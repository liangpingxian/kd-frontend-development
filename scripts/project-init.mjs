#!/usr/bin/env node

/**
 * KWC Project Initialization Script
 * Uses kd project init native parameters for one-click project creation, cross-platform (macOS / Linux / Windows)
 * Zero external dependencies, uses only Node.js built-in modules
 * Common infrastructure functions from ./_shared.mjs
 */

import { parseArgs, createFatal, augmentPathWithNpmGlobalBin } from './_shared.mjs'
import { spawn, execSync } from 'node:child_process'
import path from 'node:path'

const fatal = createFatal('project-init')

// ─── Constants ───────────────────────────────────────────────

const VALID_FRAMEWORKS = ['react', 'vue', 'lwc']
const VALID_LANGUAGES = ['ts', 'js']

const USAGE = `Usage: node project-init.mjs --name <name> --framework <react|vue|lwc> --language <ts|js> --app <appCode>

Required:
  --name        project name
  --framework   framework (react / vue / lwc)
  --language    language (ts / js)
  --app         Cosmic app identifier

The project is created at <current shell cwd>/<name>. To target a different parent directory, cd into it before invoking this script.

Note: this script does NOT run npm install. After init, run it yourself (in CN networks, prefer --registry=https://registry.npmmirror.com).

Example:
  cd /workspace && node project-init.mjs --name my-project --framework react --language ts --app kdec_contract`

// ─── Utility Functions ────────────────────────────────────────

/** Check if kd CLI is installed; auto-install if not */
/** Check if kd CLI is callable (directly try running it, without relying on which/PATH string matching) */
function isKdAvailable() {
  try {
    execSync('kd -v', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function ensureKdCli() {
  augmentPathWithNpmGlobalBin()
  if (isKdAvailable()) return

  console.error('[project-init] kd CLI not detected, installing @kdcloudjs/cli ...')
  try {
    execSync('npm i -g @kdcloudjs/cli --registry=https://registry.npmmirror.com', { stdio: 'inherit' })
  } catch (err) {
    fatal(`Failed to install kd CLI: ${err.message}`)
  }
  // After installation, augment PATH again and verify (the newly installed bin may be under the prefix we just obtained)
  augmentPathWithNpmGlobalBin()
  if (!isKdAvailable()) {
    fatal('kd CLI still not callable after install. Check that the npm global bin directory is on PATH (`npm config get prefix`).')
  }
}

/**
 * Call kd project init with native parameters to complete project initialization (no interaction required)
 * The project is generated under process.cwd(); the caller is responsible for cd'ing to the target parent directory before calling.
 * @returns {Promise<void>}
 */
function runKdProjectInit(name, framework, language, app) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'kd',
      ['project', 'init', name,
        '--framework', framework,
        '--language', language,
        '--app', app],
      {
        stdio: 'inherit',
        shell: process.platform === 'win32',
      }
    )
    proc.on('error', err => reject(new Error(`Failed to spawn 'kd project init': ${err.message}`)))
    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`'kd project init' exited with code ${code}`))
    })
  })
}

// ─── Main Flow ─────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2))

  // --help support
  if (args.help || process.argv.includes('--help')) {
    console.log(USAGE)
    process.exit(0)
  }

  // Validate required parameters
  const { name, framework, language, app } = args

  if (!name) fatal(`Missing required --name\n${USAGE}`)
  if (!framework) fatal(`Missing required --framework\n${USAGE}`)
  if (!language) fatal(`Missing required --language\n${USAGE}`)
  if (!app) fatal(`Missing required --app\n${USAGE}`)

  if (!VALID_FRAMEWORKS.includes(framework)) {
    fatal(`Invalid --framework: "${framework}". Supported: ${VALID_FRAMEWORKS.join(' / ')}`)
  }
  if (!VALID_LANGUAGES.includes(language)) {
    fatal(`Invalid --language: "${language}". Supported: ${VALID_LANGUAGES.join(' / ')}`)
  }

  // Detect / install kd CLI
  ensureKdCli()

  // Execute kd project init (automatic interaction)
  console.error('[project-init] Initializing project...')
  try {
    await runKdProjectInit(name, framework, language, app)
  } catch (err) {
    fatal(`'kd project init' failed: ${err.message}`)
  }

  const projectDir = path.resolve(process.cwd(), name)
  const installCmd = 'npm install --registry=https://registry.npmmirror.com'

  // Output result summary
  const result = {
    success: true,
    project: name,
    framework,
    language,
    app,
    path: projectDir,
    installed: false,
    nextSteps: [
      `cd ${projectDir}`,
      installCmd,
    ],
  }
  console.log(JSON.stringify(result, null, 2))
  console.error(`\n[project-init] Done. Install dependencies manually:\n  cd ${projectDir} && ${installCmd}`)
}

main().catch(err => {
  console.error(`[project-init] Unexpected error: ${err.message}`)
  process.exit(1)
})
