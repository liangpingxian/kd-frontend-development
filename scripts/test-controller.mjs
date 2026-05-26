#!/usr/bin/env node

/**
 * Controller End-to-End Self-Check Script
 *
 * Background:
 *   Controllers deployed on Cosmic are only exposed at /kwc/v1/{isv}/{app}/...,
 *   and this prefix only supports session Cookie authentication (OpenAPI access_token cannot be used).
 *   Therefore, "writing an end-to-end test for a Controller" must go through:
 *     Username/password login → Parse tenant-scoped Cookie → Call /kwc/v1
 *
 * This script's responsibility is to encapsulate the above flow for the
 * kwc-ks-controller-development skill to perform mandatory self-checks after
 * Controller writing and deployment are complete (KWC frontend integration code
 * may only be written after this script's tests all pass).
 *
 * Usage:
 *   # Mode A: Specify the full path directly
 *   node scripts/test-controller.mjs --env vb \
 *        --path /kwc/v1/kdtest/kdtest_kwc_test/demo/hello \
 *        --method GET --query "name=VB"
 *
 *   # Mode B: Three-segment style (isv/app is auto-read from .kd/config.json)
 *   node scripts/test-controller.mjs --env vb \
 *        --sub demo --endpoint hello --method GET --query "name=VB"
 *
 *   # Mode C: POST + JSON body
 *   node scripts/test-controller.mjs --env vb --path /kwc/v1/kdtest/xx/yy \
 *        --method POST --body '{"a":1}'
 *
 *   # Mode D: With data assertions
 *   node scripts/test-controller.mjs --env vb \
 *        --path /kwc/v1/kdtest/kdtest_kwc_test/expense/list \
 *        --method GET --assert-not-empty data --assert-field data[0].id
 *
 * Account/password sources (priority from high to low):
 *   --user --password  >  ~/.kd/config.json env.<name>.login_account.{fname,password}
 *
 * Parameters:
 *   --env <name>           Environment name (uses default environment if not provided)
 *   --path <absolute>      Full API path starting with / (highest priority)
 *   --sub <seg>            Custom subdirectory (used with --endpoint when --path is not provided)
 *   --endpoint <seg>       Last resource segment (required when --path is not provided)
 *   --method <HTTP>        Default GET
 *   --query "k=v&k2=v2"    Query parameters (or use --q repeatedly)
 *   --q k=v                Append a single query parameter (repeatable)
 *   --body '<json>'        Request body JSON string
 *   --body-file <path>     Request body JSON file
 *   --user <account>       Login account (overrides env.login_account.fname)
 *   --password <pwd>       Login password (overrides env.login_account.password)
 *   --accountId <id>       Data center accountId (overrides env.accountId)
 *   --isv <isv>            isv for URL assembly (overrides env.isv / .kd/config.json.isv)
 *   --app <app>            app for URL assembly (overrides .kd/config.json.app)
 *   --verbose              Output request details
 *   --assert-status <code>          Assert HTTP status code (e.g., --assert-status 200)
 *   --assert-field <jsonpath>       Assert field exists and is non-null/undefined (e.g., --assert-field data)
 *   --assert-not-empty <jsonpath>   Assert field is a non-empty array or non-empty object (e.g., --assert-not-empty data)
 *   --assert-contains <path=value>  Assert field contains a specific value (e.g., --assert-contains data[0].name=John)
 *   --assert-type <path=type>       Assert field type (e.g., --assert-type data=array)
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseArgs,
  loadEnvConfig,
  loginAndGetCookie,
  callControllerViaCookie,
  normalizeUrl,
  createFatal,
} from './_shared.mjs'

const fatal = createFatal('test-controller')

function loadProjectConfig() {
  const p = join(process.cwd(), '.kd', 'config.json')
  if (!existsSync(p)) return {}
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) || {}
  } catch {
    return {}
  }
}

function parseQueryString(str) {
  if (!str) return {}
  const out = {}
  for (const pair of String(str).split('&')) {
    if (!pair) continue
    const idx = pair.indexOf('=')
    if (idx === -1) out[decodeURIComponent(pair)] = ''
    else out[decodeURIComponent(pair.slice(0, idx))] = decodeURIComponent(pair.slice(idx + 1))
  }
  return out
}

/** Collect all --q k=v entries (supports multiple) */
function collectRepeatedQ(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--q' && argv[i + 1]) {
      const kv = argv[i + 1]
      const idx = kv.indexOf('=')
      if (idx > 0) out[kv.slice(0, idx)] = kv.slice(idx + 1)
      i++
    }
  }
  return out
}

/** Collect all repeating --assert-* parameters */
function collectAssertArgs(argv) {
  const assertions = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--assert-status' && argv[i + 1]) {
      assertions.push({ type: 'status', value: argv[++i] })
    } else if (argv[i] === '--assert-field' && argv[i + 1]) {
      assertions.push({ type: 'field', path: argv[++i] })
    } else if (argv[i] === '--assert-not-empty' && argv[i + 1]) {
      assertions.push({ type: 'not-empty', path: argv[++i] })
    } else if (argv[i] === '--assert-contains' && argv[i + 1]) {
      assertions.push({ type: 'contains', expr: argv[++i] })
    } else if (argv[i] === '--assert-type' && argv[i + 1]) {
      assertions.push({ type: 'type', expr: argv[++i] })
    }
  }
  return assertions
}

/**
 * Parse simple jsonpath: supports dot-notation paths + array indexing
 * Example: "data", "data.rows", "data[0].name", "data.total"
 */
function resolveJsonPath(obj, path) {
  const segments = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (const seg of segments) {
    if (current == null) return undefined
    current = current[seg]
  }
  return current
}

/** Execute all assertions, returns { passed: boolean, results: Array } */
function runAssertions(assertions, httpStatus, responseData) {
  const results = []
  for (const a of assertions) {
    switch (a.type) {
      case 'status': {
        const expected = Number(a.value)
        const pass = httpStatus === expected
        results.push({
          pass,
          label: `assert-status: expected ${expected}`,
          detail: pass ? `actual ${httpStatus} ✅` : `actual ${httpStatus} ❌`,
        })
        break
      }
      case 'field': {
        const val = resolveJsonPath(responseData, a.path)
        const pass = val !== undefined && val !== null
        results.push({
          pass,
          label: `assert-field: ${a.path} exists and is non-null`,
          detail: pass ? `value = ${JSON.stringify(val)} ✅` : `actual value = ${JSON.stringify(val)} ❌`,
        })
        break
      }
      case 'not-empty': {
        const val = resolveJsonPath(responseData, a.path)
        let pass = false
        if (Array.isArray(val)) pass = val.length > 0
        else if (val && typeof val === 'object') pass = Object.keys(val).length > 0
        results.push({
          pass,
          label: `assert-not-empty: ${a.path} is non-empty array or non-empty object`,
          detail: pass
            ? `length/keys = ${Array.isArray(val) ? val.length : Object.keys(val).length} ✅`
            : `actual value = ${JSON.stringify(val)} ❌ (${val == null ? 'value is null/undefined' : Array.isArray(val) ? 'empty array' : typeof val === 'object' ? 'empty object' : 'not array/object, type: ' + typeof val})`,
        })
        break
      }
      case 'contains': {
        const eqIdx = a.expr.indexOf('=')
        if (eqIdx === -1) {
          results.push({ pass: false, label: `assert-contains: ${a.expr}`, detail: 'malformed, expected path=value ❌' })
          break
        }
        const cPath = a.expr.slice(0, eqIdx)
        const expected = a.expr.slice(eqIdx + 1)
        const val = resolveJsonPath(responseData, cPath)
        const pass = String(val) === expected
        results.push({
          pass,
          label: `assert-contains: ${cPath} = "${expected}"`,
          detail: pass ? `match ✅` : `actual value = ${JSON.stringify(val)} ❌`,
        })
        break
      }
      case 'type': {
        const eqIdx = a.expr.indexOf('=')
        if (eqIdx === -1) {
          results.push({ pass: false, label: `assert-type: ${a.expr}`, detail: 'malformed, expected path=type ❌' })
          break
        }
        const tPath = a.expr.slice(0, eqIdx)
        const expectedType = a.expr.slice(eqIdx + 1).toLowerCase()
        const val = resolveJsonPath(responseData, tPath)
        let actualType = Array.isArray(val) ? 'array' : typeof val
        const pass = actualType === expectedType
        results.push({
          pass,
          label: `assert-type: ${tPath} should be ${expectedType}`,
          detail: pass ? `actual type ${actualType} ✅` : `actual type ${actualType} ❌`,
        })
        break
      }
    }
  }
  const passed = results.every(r => r.pass)
  return { passed, results }
}

function resolvePath(opts, env, projectCfg) {
  if (typeof opts.path === 'string') {
    if (!opts.path.startsWith('/')) fatal(`--path must start with /, got: ${opts.path}`)
    return opts.path
  }
  const endpoint = typeof opts.endpoint === 'string' ? opts.endpoint : null
  if (!endpoint) fatal('missing endpoint path. Use --path for the full path, or use --sub + --endpoint to assemble it')
  const isv = opts.isv || env.isv || projectCfg.isv
  const app = opts.app || projectCfg.app
  if (!isv) fatal('cannot determine isv: configure it in env / .kd/config.json, or pass --isv')
  if (!app) fatal('cannot determine app: configure it in .kd/config.json, or pass --app')
  const segs = ['/kwc/v1', isv, app]
  if (opts.sub) segs.push(String(opts.sub).replace(/^\/+|\/+$/g, ''))
  segs.push(String(endpoint).replace(/^\/+|\/+$/g, ''))
  return segs.join('/').replace(/\/{2,}/g, '/')
}

function resolveBody(opts) {
  if (typeof opts['body-file'] === 'string') {
    const p = opts['body-file']
    const txt = readFileSync(p, 'utf-8')
    try { return JSON.parse(txt) } catch { fatal(`--body-file ${p} is not valid JSON`) }
  }
  if (typeof opts.body === 'string') {
    try { return JSON.parse(opts.body) } catch { fatal(`--body is not valid JSON: ${opts.body}`) }
  }
  return undefined
}

async function main() {
  const argv = process.argv.slice(2)
  const opts = parseArgs(argv)

  const env = loadEnvConfig(typeof opts.env === 'string' ? opts.env : undefined)
  const projectCfg = loadProjectConfig()
  const baseUrl = normalizeUrl(env.url)

  const path = resolvePath(opts, env, projectCfg)
  const method = (typeof opts.method === 'string' ? opts.method : 'GET').toUpperCase()
  const query = { ...parseQueryString(typeof opts.query === 'string' ? opts.query : ''), ...collectRepeatedQ(argv) }
  const body = resolveBody(opts)

  console.log(`[test-controller] env: ${env.name || '(default)'}  ${baseUrl}`)
  console.log(`[test-controller] endpoint: ${method} ${path}${Object.keys(query).length ? ' ?' + new URLSearchParams(query).toString() : ''}`)
  if (opts.verbose && body !== undefined) console.log('[test-controller] body:', JSON.stringify(body))

  // 1) Login to get Cookie
  console.log('[test-controller] logging in...')
  let cookie
  try {
    cookie = await loginAndGetCookie(env, {
      user: typeof opts.user === 'string' ? opts.user : undefined,
      password: typeof opts.password === 'string' ? opts.password : undefined,
      accountId: typeof opts.accountId === 'string' ? opts.accountId : undefined,
    })
  } catch (e) {
    fatal(`login failed: ${e.message}`)
  }
  if (opts.verbose) console.log('[test-controller] Cookie:', cookie.slice(0, 80) + '...')

  // 2) Call Controller
  let result
  try {
    result = await callControllerViaCookie(baseUrl, cookie, path, { method, query, body })
  } catch (e) {
    fatal(`endpoint call failed: ${e.message}`)
  }

  // 3) Evaluate results
  console.log(`[test-controller] HTTP ${result.status}`)
  const out = result.data != null ? JSON.stringify(result.data, null, 2) : result.raw.slice(0, 800)
  console.log(out)

  // Common business-layer failure patterns
  if (result.data && result.data.success === false) {
    fatal(`Controller business failure: error_code=${result.data.error_code} error_desc=${result.data.error_desc}`)
  }
  if (result.status >= 400) {
    fatal(`Controller HTTP error: ${result.status}`)
  }

  // 4) Data assertions
  const assertions = collectAssertArgs(argv)
  if (assertions.length > 0) {
    console.log(`\n[test-controller] running assertions (${assertions.length})...`)
    const { passed, results: assertResults } = runAssertions(assertions, result.status, result.data)
    for (const r of assertResults) {
      console.log(`  ${r.pass ? '✅' : '❌'} ${r.label} → ${r.detail}`)
    }
    if (!passed) {
      const failCount = assertResults.filter(r => !r.pass).length
      fatal(`assertions failed: ${failCount}/${assertResults.length} did not pass`)
    }
    console.log(`[test-controller] ✅ all ${assertResults.length} assertions passed`)
  }

  console.log('[test-controller] ✅ Controller test passed')
}

main().catch(e => fatal(`unexpected error: ${e.message || e}`))
