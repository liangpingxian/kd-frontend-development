#!/usr/bin/env node

/**
 * KWC one-shot environment setup script.
 * Uses native `kd env` flags to create the env and complete OpenAPI auth (cross-platform: macOS / Linux / Windows).
 * When multiple datacenters are available, prints candidates and exits with code 2 so the caller can re-run with --datacenter <accountId>.
 * Zero external dependencies — only Node.js built-ins.
 * Shared infrastructure helpers live in ./_shared.mjs.
 */

import { spawn, execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createFatal, parseArgs, fetchDatacenters, loadEnvConfig, augmentPathWithNpmGlobalBin } from './_shared.mjs'

const fatal = createFatal('setup-env')

// Non-interactive shells usually don't have the npm global bin on PATH; patch it first to avoid ENOENT when spawning `kd`.
augmentPathWithNpmGlobalBin()

// ─── Constants ──────────────────────────────────────────

const ALWAYS_REQUIRED = ['envName', 'clientId', 'clientSecret', 'username']
const EXIT_NEED_DATACENTER = 2  // Dedicated exit code for "multiple datacenters and --datacenter not specified"

// ─── Helpers ────────────────────────────────────────────

/** Run a command synchronously and return stdout; return null on failure. */
function execQuiet(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return null
  }
}

/** Check whether the env already appears in `kd env list` output. */
function envExists(envName) {
  const output = execQuiet('kd env list')
  if (!output) return false
  // Scan line by line for the env name (may appear in one of the table columns).
  return output.split('\n').some(line => line.includes(envName))
}

/** Create an env. */
function createEnv(envName, envUrl) {
  try {
    execSync(`kd env create ${envName} --url ${envUrl}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  } catch (err) {
    const stderr = err.stderr || err.message
    fatal(`Failed to create env: ${stderr}`)
  }
}

// ─── Auth runner ────────────────────────────────────────

/**
 * Invoke `kd env auth openapi` with native flags to complete OpenAPI auth (no TTY / expect required).
 * Uses spawn + argv array to avoid shell injection and special-character escaping issues.
 */
function runAuth(envName, datacenterId, clientId, clientSecret, username) {
  return new Promise((resolve, reject) => {
    const proc = spawn('kd', [
      'env', 'auth', 'openapi',
      '-e', envName,
      '--datacenter', String(datacenterId),
      '--client-id', clientId,
      '--client-secret', clientSecret,
      '--username', username,
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', d => { stdout += d })
    proc.stderr.on('data', d => { stderr += d })

    proc.on('error', err => reject(new Error(`Failed to spawn 'kd env auth openapi': ${err.message}`)))
    proc.on('close', code => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`'kd env auth openapi' exited with code ${code}: ${stderr || stdout}`))
    })
  })
}

/** Verify auth state by reading ~/.kd/config.json and checking the critical fields. */
function verifyAuth(envName) {
  try {
    const configPath = join(homedir(), '.kd', 'config.json')
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    const envConfig = config.env?.[envName]

    if (!envConfig) {
      return { success: false, reason: `env "${envName}" not present in config file` }
    }

    // Check the critical auth fields.
    const hasClientId = !!envConfig.client_id
    const hasAccessToken = !!envConfig.access_token
    const hasUsername = !!envConfig.username

    if (hasClientId && hasAccessToken && hasUsername) {
      return { success: true, env: envConfig }
    }

    const missing = []
    if (!hasClientId) missing.push('client_id')
    if (!hasAccessToken) missing.push('access_token')
    if (!hasUsername) missing.push('username')

    return { success: false, reason: `Missing auth fields: ${missing.join(', ')}` }
  } catch (e) {
    return { success: false, reason: `Failed to read config file: ${e.message}` }
  }
}

// ─── Main flow ──────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2))

  // 1. Validate the always-required flags.
  for (const key of ALWAYS_REQUIRED) {
    if (!opts[key] || opts[key] === true) {
      fatal(`Missing required --${key}\nUsage: node setup-env.mjs --envName <name> [--envUrl <url>] --clientId <id> --clientSecret <secret> --username <user> [--datacenter <accountId>]\nNotes: --envUrl is required when the env does not exist yet; --datacenter is required only when multiple datacenters are available`)
    }
  }

  const { envName, envUrl, clientId, clientSecret, username } = opts
  const userDatacenter = (opts.datacenter && opts.datacenter !== true) ? opts.datacenter : null

  // 2. Determine envUrl (required for datacenter discovery whether or not the env exists).
  const existing = envExists(envName)
  let effectiveEnvUrl = (envUrl && envUrl !== true) ? envUrl : null
  if (!effectiveEnvUrl) {
    if (existing) {
      try {
        effectiveEnvUrl = loadEnvConfig(envName).url
      } catch (e) {
        fatal(`Failed to read url for env "${envName}" from config: ${e.message}`)
      }
    } else {
      fatal(`Env "${envName}" does not exist. Creating a new env requires --envUrl.\nUsage: node setup-env.mjs --envName <name> --envUrl <url> --clientId <id> --clientSecret <secret> --username <user>`)
    }
  }

  // 3. Fetch the datacenter list first (side-effect-free probe — a failure here won't pollute local ~/.kd/config.json).
  let datacenters
  try {
    datacenters = await fetchDatacenters(effectiveEnvUrl, clientId)
  } catch (err) {
    fatal(`Failed to fetch datacenters: ${err.message}`)
  }

  // 4. Decide which accountId to use (when multiple and unspecified, exit 2 immediately — skip downstream side effects).
  let datacenterId
  if (datacenters.length === 1) {
    datacenterId = datacenters[0].id
    console.error(`[setup-env] Single datacenter detected: ${datacenters[0].name} (accountId=${datacenterId}). Using it automatically.`)
  } else if (userDatacenter) {
    const matched = datacenters.find(d => String(d.id) === String(userDatacenter))
    if (!matched) {
      console.error(`[setup-env] --datacenter "${userDatacenter}" not in available list. Candidates:\n`)
      for (const d of datacenters) {
        console.error(`  ${d.name}\t(accountId=${d.id})`)
      }
      process.exit(EXIT_NEED_DATACENTER)
    }
    datacenterId = matched.id
    console.error(`[setup-env] Using specified datacenter: ${matched.name} (accountId=${datacenterId})`)
  } else {
    // Multiple datacenters and none specified → print candidates and exit 2 (createEnv hasn't run yet, so no orphan env is left behind).
    console.error('[setup-env] Multiple datacenters available. Re-run with --datacenter <accountId>:\n')
    for (const d of datacenters) {
      console.error(`  ${d.name}\t(accountId=${d.id})`)
    }
    console.error('\nExample:')
    console.error(
      `  node scripts/setup-env.mjs --envName ${envName}${envUrl && envUrl !== true ? ` --envUrl ${envUrl}` : ''} ` +
      `--clientId ${clientId} --clientSecret <secret> --username ${username} --datacenter ${datacenters[0].id}`
    )
    process.exit(EXIT_NEED_DATACENTER)
  }

  // 5. Once a datacenter is confirmed available, create the local env (if it doesn't exist yet).
  let created = false
  if (!existing) {
    createEnv(envName, effectiveEnvUrl)
    created = true
  } else {
    console.error(`[setup-env] Env "${envName}" already exists, skipping create.`)
  }

  // 6. Invoke `kd env auth openapi` to complete authentication.
  try {
    await runAuth(envName, datacenterId, clientId, clientSecret, username)
  } catch (err) {
    fatal(err.message)
  }

  // 7. Verify auth state from the config file (rather than just checking the env list).
  const authResult = verifyAuth(envName)
  if (!authResult.success) {
    fatal(`Auth not persisted: ${authResult.reason}\nRun manually: kd env auth openapi -e ${envName}`)
  }

  console.error(`[setup-env] ✅ Auth verified. Env "${envName}" is ready.`)

  // Emit the result.
  const result = {
    success: true,
    envName,
    ...(envUrl && envUrl !== true ? { envUrl } : {}),
    datacenter: datacenterId,
    authenticated: true,
    message: created
      ? `Env ${envName} created and authenticated successfully`
      : `Env ${envName} already existed; authenticated successfully`,
  }
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(`[setup-env] Unexpected error: ${err.message}`)
  process.exit(1)
})
