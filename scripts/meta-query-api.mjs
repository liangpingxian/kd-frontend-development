#!/usr/bin/env node

/**
 * KWC metadata-query REST API wrapper script.
 * Supported commands: queryFormsByApp, getEntityFields.
 * Zero external dependencies — only Node.js built-ins.
 * Shared infrastructure helpers live in ./_shared.mjs.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

import {
  createFatal,
  parseArgs,
  loadEnvConfig,
  resolveToken,
  callGetApi,
  compact,
  CONFIG_FILE,
} from './_shared.mjs'

const fatal = createFatal('meta-query-api')

// ─── appNumber auto-resolution ───────────────────────────

/**
 * Try to auto-resolve appNumber from project or global config.
 * Priority: --appNumber > `app` field in {cwd}/kd.config.json > `app` field in ~/.kd/config.json.
 */
function resolveAppNumber(opts) {
  // 1. Explicit CLI flag.
  if (opts.appNumber) return opts.appNumber

  const cwd = opts.cwd ? resolve(opts.cwd) : process.cwd()

  // 2. Read from the project's kd.config.json.
  const projectConfigPath = join(cwd, 'kd.config.json')
  if (existsSync(projectConfigPath)) {
    try {
      const cfg = JSON.parse(readFileSync(projectConfigPath, 'utf-8'))
      if (cfg.app) return cfg.app
    } catch { /* ignore parse errors */ }
  }

  // 3. Read from the global ~/.kd/config.json.
  if (existsSync(CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
      if (cfg.app) return cfg.app
    } catch { /* ignore parse errors */ }
  }

  return undefined
}

// ─── Command implementations ─────────────────────────────

const commands = {
  queryFormsByApp: {
    required: [],
    usage: 'queryFormsByApp [--appNumber <app>] [--keyword <keyword>] [--cloudNumber <cloud>] [--cwd <path>] [--env <envName>]',
    run: (opts, env, token) =>
      callGetApi(env.url, '/kapi/v2/devportal/ai-meta/queryFormsByApp', token, compact({
        appNumber: opts.appNumber,
        keyword: opts.keyword,
        cloudNumber: opts.cloudNumber,
      })),
  },

  getEntityFields: {
    required: ['formNumber'],
    usage: 'getEntityFields --formNumber <formNumber> [--env <envName>]',
    run: (opts, env, token) =>
      callGetApi(env.url, `/kapi/v2/devportal/ai-meta/getEntityFields`, token, compact({
        formNumber: opts.formNumber,
      })),
  },
}

// ─── Main flow ──────────────────────────────────────────

async function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (!command || !commands[command]) {
    console.error(`Usage: node meta-query-api.mjs <command> [options]\n`)
    console.error('Supported commands:')
    for (const [name, cmd] of Object.entries(commands)) {
      console.error(`  ${cmd.usage}`)
    }
    process.exit(1)
  }

  const cmd = commands[command]
  const opts = parseArgs(rest)

  // queryFormsByApp: auto-resolve appNumber.
  if (command === 'queryFormsByApp') {
    opts.appNumber = resolveAppNumber(opts)
    if (!opts.appNumber) {
      fatal('Missing appNumber: --appNumber not passed and `app` field not found in kd.config.json / ~/.kd/config.json.\nUsage: ' + cmd.usage)
    }
  }

  // Validate required flags.
  for (const key of cmd.required) {
    if (!opts[key]) {
      fatal(`Missing required --${key}\nUsage: ${cmd.usage}`)
    }
  }

  // Load env config and obtain a token.
  const env = loadEnvConfig(opts.env)
  const token = await resolveToken(env)

  // Run the command and print the result.
  const result = await cmd.run(opts, env, token)
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(`[meta-query-api] Unexpected error: ${err.message}`)
  process.exit(1)
})
