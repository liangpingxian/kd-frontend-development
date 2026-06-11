#!/usr/bin/env node

/**
 * Controller 端到端自检脚本
 *
 * 背景：
 *   苍穹部署后的 Controller 只暴露在 /kwc/v1/{isv}/{app}/... 这条路径上，
 *   该前缀仅支持 session Cookie 鉴权（无法用 OpenAPI access_token）。
 *   因此"写完 Controller 的端到端测试"必须走：
 *     账号密码登录 → 解析租户化 Cookie → 调 /kwc/v1
 *
 * 本脚本的职责就是封装上述流程，供 kwc-ks-controller-development 技能在
 * Controller 编写完成、部署完毕之后进行强制自检（必须通过本脚本测试全绿后，
 * 才能进入 KWC 前端对接代码的编写）。
 *
 * 使用：
 *   # 方式 A：直接指定完整路径
 *   node scripts/test-controller.mjs --env vb \
 *        --path /kwc/v1/kdtest/kdtest_kwc_test/demo/hello \
 *        --method GET --query "name=VB"
 *
 *   # 方式 B：三段式（isv/app 会从 .kd/config.json 自动读取）
 *   node scripts/test-controller.mjs --env vb \
 *        --sub demo --endpoint hello --method GET --query "name=VB"
 *
 *   # 方式 C：POST + JSON body
 *   node scripts/test-controller.mjs --env vb --path /kwc/v1/kdtest/xx/yy \
 *        --method POST --body '{"a":1}'
 *
 *   # 方式 D：带数据断言
 *   node scripts/test-controller.mjs --env vb \
 *        --path /kwc/v1/kdtest/kdtest_kwc_test/expense/list \
 *        --method GET --assert-not-empty data --assert-field data[0].id
 *
 * 账号/密码来源（优先级从高到低）：
 *   --user --password  >  ~/.kd/config.json 的 env.<name>.login_account.{fname,password}
 *
 * 参数：
 *   --env <name>           环境名（不传则使用默认环境）
 *   --path <absolute>      以 / 开头的完整接口路径（优先级最高）
 *   --sub <seg>            自定义子目录（path 未传时与 --endpoint 配合使用）
 *   --endpoint <seg>       末尾资源名（path 未传时必需）
 *   --method <HTTP>        默认 GET
 *   --query "k=v&k2=v2"    query 参数（或重复使用 --q）
 *   --q k=v                追加单条 query（可重复）
 *   --body '<json>'        请求体 JSON 字符串
 *   --body-file <path>     请求体 JSON 文件
 *   --user <account>       登录账号（覆盖 env.login_account.fname）
 *   --password <pwd>       登录密码（覆盖 env.login_account.password）
 *   --accountId <id>       数据中心 accountId（覆盖 env.accountId）
 *   --isv <isv>            URL 拼装时的 isv（覆盖 env.isv / .kd/config.json.isv）
 *   --app <app>            URL 拼装时的 app（覆盖 .kd/config.json.app）
 *   --verbose              输出请求详情
 *   --assert-status <code>          断言 HTTP 状态码（如 --assert-status 200）
 *   --assert-field <jsonpath>       断言字段存在且非 null/undefined（如 --assert-field data）
 *   --assert-not-empty <jsonpath>   断言字段为非空数组或非空对象（如 --assert-not-empty data）
 *   --assert-contains <path=value>  断言字段包含特定值（如 --assert-contains data[0].name=张三）
 *   --assert-type <path=type>       断言字段类型（如 --assert-type data=array）
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

/** 收集所有 --q k=v（支持多次） */
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

/** 收集所有重复出现的 --assert-* 参数 */
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
 * 解析简单 jsonpath：支持点路径 + 数组索引
 * 例: "data", "data.rows", "data[0].name", "data.total"
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

/** 执行所有断言，返回 { passed: boolean, results: Array } */
function runAssertions(assertions, httpStatus, responseData) {
  const results = []
  for (const a of assertions) {
    switch (a.type) {
      case 'status': {
        const expected = Number(a.value)
        const pass = httpStatus === expected
        results.push({
          pass,
          label: `assert-status: 期望 ${expected}`,
          detail: pass ? `实际 ${httpStatus} ✅` : `实际 ${httpStatus} ❌`,
        })
        break
      }
      case 'field': {
        const val = resolveJsonPath(responseData, a.path)
        const pass = val !== undefined && val !== null
        results.push({
          pass,
          label: `assert-field: ${a.path} 存在且非 null`,
          detail: pass ? `值 = ${JSON.stringify(val)} ✅` : `实际值 = ${JSON.stringify(val)} ❌`,
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
          label: `assert-not-empty: ${a.path} 为非空数组或非空对象`,
          detail: pass
            ? `长度/键数 = ${Array.isArray(val) ? val.length : Object.keys(val).length} ✅`
            : `实际值 = ${JSON.stringify(val)} ❌（${val == null ? '值为 null/undefined' : Array.isArray(val) ? '空数组' : typeof val === 'object' ? '空对象' : '非数组/对象类型: ' + typeof val}）`,
        })
        break
      }
      case 'contains': {
        const eqIdx = a.expr.indexOf('=')
        if (eqIdx === -1) {
          results.push({ pass: false, label: `assert-contains: ${a.expr}`, detail: '格式错误，需 path=value ❌' })
          break
        }
        const cPath = a.expr.slice(0, eqIdx)
        const expected = a.expr.slice(eqIdx + 1)
        const val = resolveJsonPath(responseData, cPath)
        const pass = String(val) === expected
        results.push({
          pass,
          label: `assert-contains: ${cPath} = "${expected}"`,
          detail: pass ? `匹配 ✅` : `实际值 = ${JSON.stringify(val)} ❌`,
        })
        break
      }
      case 'type': {
        const eqIdx = a.expr.indexOf('=')
        if (eqIdx === -1) {
          results.push({ pass: false, label: `assert-type: ${a.expr}`, detail: '格式错误，需 path=type ❌' })
          break
        }
        const tPath = a.expr.slice(0, eqIdx)
        const expectedType = a.expr.slice(eqIdx + 1).toLowerCase()
        const val = resolveJsonPath(responseData, tPath)
        let actualType = Array.isArray(val) ? 'array' : typeof val
        const pass = actualType === expectedType
        results.push({
          pass,
          label: `assert-type: ${tPath} 类型为 ${expectedType}`,
          detail: pass ? `实际类型 ${actualType} ✅` : `实际类型 ${actualType} ❌`,
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
    if (!opts.path.startsWith('/')) fatal(`--path must start with '/', got: ${opts.path}`)
    return opts.path
  }
  const endpoint = typeof opts.endpoint === 'string' ? opts.endpoint : null
  if (!endpoint) fatal("Missing endpoint path. Either pass --path with a full path, or pass --sub + --endpoint to assemble it.")
  const isv = opts.isv || env.isv || projectCfg.isv
  const app = opts.app || projectCfg.app
  if (!isv) fatal('Cannot determine isv. Configure it in env / .kd/config.json, or pass --isv.')
  if (!app) fatal('Cannot determine app. Configure it in .kd/config.json, or pass --app.')
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

  console.log(`[test-controller] Env: ${env.name || '(default)'}  ${baseUrl}`)
  console.log(`[test-controller] Endpoint: ${method} ${path}${Object.keys(query).length ? ' ?' + new URLSearchParams(query).toString() : ''}`)
  if (opts.verbose && body !== undefined) console.log('[test-controller] body:', JSON.stringify(body))

  // 1) 登录拿 Cookie
  console.log('[test-controller] Logging in...')
  let cookie
  try {
    cookie = await loginAndGetCookie(env, {
      user: typeof opts.user === 'string' ? opts.user : undefined,
      password: typeof opts.password === 'string' ? opts.password : undefined,
      accountId: typeof opts.accountId === 'string' ? opts.accountId : undefined,
    })
  } catch (e) {
    fatal(`Login failed: ${e.message}`)
  }
  if (opts.verbose) console.log('[test-controller] Cookie:', cookie.slice(0, 80) + '...')

  // 2) 调 Controller
  let result
  try {
    result = await callControllerViaCookie(baseUrl, cookie, path, { method, query, body })
  } catch (e) {
    fatal(`Failed to call endpoint: ${e.message}`)
  }

  // 3) 结果判定
  console.log(`[test-controller] HTTP ${result.status}`)
  const out = result.data != null ? JSON.stringify(result.data, null, 2) : result.raw.slice(0, 800)
  console.log(out)

  // 常见业务层失败形态
  if (result.data && result.data.success === false) {
    fatal(`Controller business failure: error_code=${result.data.error_code} error_desc=${result.data.error_desc}`)
  }
  if (result.status >= 400) {
    fatal(`Controller HTTP error: ${result.status}`)
  }

  // 4) 数据断言
  const assertions = collectAssertArgs(argv)
  if (assertions.length > 0) {
    console.log(`\n[test-controller] Running data assertions (${assertions.length})...`)
    const { passed, results: assertResults } = runAssertions(assertions, result.status, result.data)
    for (const r of assertResults) {
      console.log(`  ${r.pass ? '✅' : '❌'} ${r.label} → ${r.detail}`)
    }
    if (!passed) {
      const failCount = assertResults.filter(r => !r.pass).length
      fatal(`Data assertions failed: ${failCount}/${assertResults.length} not passed`)
    }
    console.log(`[test-controller] ✅ All ${assertResults.length} assertions passed`)
  }

  console.log('[test-controller] ✅ Controller test passed')
}

main().catch(e => fatal(`Unexpected error: ${e.message || e}`))
