#!/usr/bin/env node

/**
 * KWC batch-create script.
 * Creates multiple components, pages, and controllers in a single invocation — avoids running `kd project create` one at a time.
 * Zero external dependencies — only Node.js built-ins.
 * Shared infrastructure helpers live in ./_shared.mjs.
 */

import { execSync } from 'node:child_process'

import {
  createFatal,
  parseArgs,
  augmentPathWithNpmGlobalBin,
} from './_shared.mjs'

const fatal = createFatal('batch-create')

// Non-interactive shells usually don't have the npm global bin on PATH; patch it first to avoid ENOENT when spawning `kd`.
augmentPathWithNpmGlobalBin()

// ─── Helpers ────────────────────────────────────────────

/** Split a comma-separated string into a trimmed name list; empty input → empty array. */
function splitNames(raw) {
  if (!raw || raw === true) return []
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

/** Execute a single kd project create command, returning a result object */
function runCreate(name, type, env) {
  const args = ['project', 'create', name, '--type', type]
  if (env && type === 'controller') args.push('-e', env)

  try {
    execSync(`kd ${args.join(' ')}`, { stdio: 'pipe', encoding: 'utf-8' })
    return { name, type, success: true }
  } catch (err) {
    return { name, type, success: false, error: err.stderr || err.message }
  }
}

/** Build summary statistics for a category */
function summarize(items) {
  const success = items.filter(r => r.success).length
  return { total: items.length, success, failed: items.length - success }
}

// ─── Main flow ──────────────────────────────────────────────

function main() {
  const opts = parseArgs(process.argv.slice(2))

  const components  = splitNames(opts.components)
  const pages       = splitNames(opts.pages)
  const controllers = splitNames(opts.controllers)
  const env         = typeof opts.env === 'string' ? opts.env : undefined

  // Validation: at least one type of creation task is required
  if (components.length === 0 && pages.length === 0 && controllers.length === 0) {
    fatal(
      'at least one of --components / --pages / --controllers is required\n' +
      'usage: node batch-create.mjs \\\n' +
      '  --components UserProfile,OrderList,Dashboard \\\n' +
      '  --pages user_dashboard,order_list \\\n' +
      '  --controllers UserController \\\n' +
      '  [--env dev]'
    )
  }

  const results = { components: [], controllers: [], pages: [] }

  // 1. Create components first
  for (const name of components) {
    results.components.push(runCreate(name, 'kwc', env))
  }

  // 2. Then create Controllers
  if (controllers.length > 0 && !env) {
    console.warn('[batch-create] Warning: --env not specified; Controller creation typically needs an env to fetch SDK.')
  }
  for (const name of controllers) {
    results.controllers.push(runCreate(name, 'controller', env))
  }

  // 3. Finally create pages
  for (const name of pages) {
    results.pages.push(runCreate(name, 'page', env))
  }

  // Summary
  const details = [
    ...results.components,
    ...results.controllers,
    ...results.pages,
  ]
  const allSuccess = details.every(r => r.success)

  const output = {
    success: allSuccess,
    summary: {
      components:  summarize(results.components),
      controllers: summarize(results.controllers),
      pages:       summarize(results.pages),
    },
    details,
  }

  console.log(JSON.stringify(output, null, 2))

  // Exit with non-zero code if all failed
  if (details.length > 0 && details.every(r => !r.success)) {
    process.exit(1)
  }
}

main()
