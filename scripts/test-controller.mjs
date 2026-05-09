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
 * 账号/密码来源（优先级从高到低）：
 *   --user --password  >  ~/.kd/config.json 的 env.<name>.login_account.{name,password}
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
 *   --user <account>       登录账号（覆盖 env.login_account.name）
 *   --password <pwd>       登录密码（覆盖 env.login_account.password）
 *   --accountId <id>       数据中心 accountId（覆盖 env.accountId）
 *   --isv <isv>            URL 拼装时的 isv（覆盖 env.isv / .kd/config.json.isv）
 *   --app <app>            URL 拼装时的 app（覆盖 .kd/config.json.app）
 *   --verbose              输出请求详情
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

function resolvePath(opts, env, projectCfg) {
  if (typeof opts.path === 'string') {
    if (!opts.path.startsWith('/')) fatal(`--path 必须以 / 开头，收到: ${opts.path}`)
    return opts.path
  }
  const endpoint = typeof opts.endpoint === 'string' ? opts.endpoint : null
  if (!endpoint) fatal('缺少接口路径，请使用 --path 直接指定完整路径，或使用 --sub + --endpoint 三段式拼装')
  const isv = opts.isv || env.isv || projectCfg.isv
  const app = opts.app || projectCfg.app
  if (!isv) fatal('无法确定 isv：请在环境 / .kd/config.json 中配置，或通过 --isv 传入')
  if (!app) fatal('无法确定 app：请在 .kd/config.json 中配置，或通过 --app 传入')
  const segs = ['/kwc/v1', isv, app]
  if (opts.sub) segs.push(String(opts.sub).replace(/^\/+|\/+$/g, ''))
  segs.push(String(endpoint).replace(/^\/+|\/+$/g, ''))
  return segs.join('/').replace(/\/{2,}/g, '/')
}

function resolveBody(opts) {
  if (typeof opts['body-file'] === 'string') {
    const p = opts['body-file']
    const txt = readFileSync(p, 'utf-8')
    try { return JSON.parse(txt) } catch { fatal(`--body-file ${p} 不是合法 JSON`) }
  }
  if (typeof opts.body === 'string') {
    try { return JSON.parse(opts.body) } catch { fatal(`--body 不是合法 JSON: ${opts.body}`) }
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

  console.log(`[test-controller] 环境: ${env.name || '(default)'}  ${baseUrl}`)
  console.log(`[test-controller] 接口: ${method} ${path}${Object.keys(query).length ? ' ?' + new URLSearchParams(query).toString() : ''}`)
  if (opts.verbose && body !== undefined) console.log('[test-controller] body:', JSON.stringify(body))

  // 1) 登录拿 Cookie
  console.log('[test-controller] 登录中...')
  let cookie
  try {
    cookie = await loginAndGetCookie(env, {
      user: typeof opts.user === 'string' ? opts.user : undefined,
      password: typeof opts.password === 'string' ? opts.password : undefined,
      accountId: typeof opts.accountId === 'string' ? opts.accountId : undefined,
    })
  } catch (e) {
    fatal(`登录失败: ${e.message}`)
  }
  if (opts.verbose) console.log('[test-controller] Cookie:', cookie.slice(0, 80) + '...')

  // 2) 调 Controller
  let result
  try {
    result = await callControllerViaCookie(baseUrl, cookie, path, { method, query, body })
  } catch (e) {
    fatal(`调用接口失败: ${e.message}`)
  }

  // 3) 结果判定
  console.log(`[test-controller] HTTP ${result.status}`)
  const out = result.data != null ? JSON.stringify(result.data, null, 2) : result.raw.slice(0, 800)
  console.log(out)

  // 常见业务层失败形态
  if (result.data && result.data.success === false) {
    fatal(`Controller 业务失败: error_code=${result.data.error_code} error_desc=${result.data.error_desc}`)
  }
  if (result.status >= 400) {
    fatal(`Controller HTTP 异常: ${result.status}`)
  }
  console.log('[test-controller] ✅ Controller 测试通过')
}

main().catch(e => fatal(`未预期错误: ${e.message || e}`))
