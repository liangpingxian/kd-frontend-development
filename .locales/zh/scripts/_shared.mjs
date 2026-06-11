/**
 * KWC API 脚本公共基础设施模块
 * 提供 CLI 参数解析、密文解密、环境配置加载、鉴权、API 调用等通用能力
 * 零外部依赖，仅使用 Node.js 内置模块
 *
 * 解密通过 _secret-store.mjs (SecretStore，namespace=kingdee-kd)
 * 读取 OS 凭据容器中的 master-key，不再读写 ~/.kd/secret.key。
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir, platform } from 'node:os'
import { execSync } from 'node:child_process'
import { randomBytes, publicEncrypt, constants } from 'node:crypto'
import { unprotect, isKdsec } from './_secret-store.mjs'

// ─── 常量 ───────────────────────────────────────────────
export const KD_DIR = join(homedir(), '.kd')
export const CONFIG_FILE = join(KD_DIR, 'config.json')

// ─── 非交互 shell 的 PATH 修正 ──────────────────────────

/**
 * 把 npm 全局 bin 目录补进当前进程的 PATH。
 * Node.js 在非交互 shell 下不会加载 ~/.zshrc / ~/.bashrc，
 * 所以用户配置的 npm prefix（如 ~/.npm-global/bin）可能不在 PATH 里，
 * 导致 `which kd` / 直接 spawn `kd` 报 ENOENT。
 * 调用 `npm config get prefix` 拿到全局 prefix 后注入到 process.env.PATH。
 *
 * 幂等：重复调用不会重复追加。npm 不可用时静默跳过。
 */
export function augmentPathWithNpmGlobalBin() {
  try {
    const prefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim()
    if (!prefix) return
    const binDir = platform() === 'win32' ? prefix : join(prefix, 'bin')
    const sep = platform() === 'win32' ? ';' : ':'
    const currentPath = process.env.PATH || ''
    if (!currentPath.split(sep).includes(binDir)) {
      process.env.PATH = binDir + sep + currentPath
    }
  } catch {
    // npm 不可用时静默跳过；后续真正调用 kd 时会自然暴露问题
  }
}

// ─── 内部默认 fatal ─────────────────────────────────────

/** 默认 fatal，使用通用前缀 [kd-api] */
function _fatal(msg) {
  console.error(`[kd-api] Error: ${msg}`)
  process.exit(1)
}

// ─── 工具函数 ───────────────────────────────────────────

/**
 * 创建绑定指定前缀的 fatal 函数
 * @param {string} prefix - 前缀标识，如 'menu-api'、'meta-query-api'
 * @returns {(msg: string) => never}
 */
export function createFatal(prefix) {
  return function fatal(msg) {
    console.error(`[${prefix}] Error: ${msg}`)
    process.exit(1)
  }
}

/** 简单命令行参数解析，不引入外部库 */
export function parseArgs(args) {
  const result = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      result[key] = args[i + 1] || true
      i++
    }
  }
  return result
}

/** 解密密文：仅识别新 `kdsec:` 前缀，遇老密文直接 fatal 引导用户重认证 */
export function decrypt(encoded) {
  if (!isKdsec(encoded)) {
    _fatal('Legacy ciphertext found, please re-run "kd env auth" in CLI')
  }
  try {
    return unprotect(encoded)
  } catch (e) {
    _fatal(`Ciphertext decryption failed: ${e && e.message ? e.message : String(e)}`)
  }
}

/** 读取 ~/.kd/config.json 并返回指定环境配置 */
export function loadEnvConfig(envName) {
  let config
  try {
    config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {
    _fatal('Failed to read ~/.kd/config.json. Create an environment config first.')
  }

  const envMap = config.env || {}

  // 指定了环境名则直接取，否则找 default: true 的环境
  if (envName) {
    if (!envMap[envName]) _fatal(`Env "${envName}" not found. Available: ${Object.keys(envMap).join(', ')}`)
    return envMap[envName]
  }

  const defaultEnv = Object.values(envMap).find(e => e.default)
  if (!defaultEnv) _fatal('No default env found. Specify one via --env.')
  return defaultEnv
}

/** 去除 URL 尾部斜杠，避免拼接出双斜杠 */
export function normalizeUrl(url) {
  return url.replace(/\/+$/, '')
}

/** 安全解析 JSON 响应，非 JSON 时返回可读错误 */
export async function safeJson(resp) {
  const text = await resp.text()
  try {
    return JSON.parse(text)
  } catch {
    _fatal(`Server returned non-JSON response (HTTP ${resp.status}):\n${text.slice(0, 500)}`)
  }
}

/** 过滤掉值为 null/undefined 的字段，仅保留有值的字段 */
export function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null))
}

/** 将 CLI 字符串参数安全转换为整数，非法值或超范围时报错退出 */
export function toInt(value, paramName) {
  if (value == null) return undefined
  const n = Number(value)
  if (!Number.isInteger(n)) _fatal(`--${paramName} must be an integer, got: "${value}"`)
  if (n < 1 || n > 32767) _fatal(`--${paramName} must be in range 1–32767, got: ${n}`)
  return n
}

// ─── 数据中心（认证前，不需要鉴权） ──────────────────────

/**
 * 拉取环境可用的数据中心列表（用于 kd env auth openapi 的 --datacenter 入参）
 * 接口: POST <envUrl>/auth/getAllDatacenters.do
 * 返回形态统一为 [{ id: accountId, name: accountName }]
 * @param {string} envUrl
 * @param {string} clientId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function fetchDatacenters(envUrl, clientId) {
  const url = `${normalizeUrl(envUrl)}/auth/getAllDatacenters.do`
  let resp
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId }),
    })
  } catch (e) {
    throw new Error(`Failed to call datacenter endpoint: ${e.message} (url=${url})`)
  }

  const data = await safeJson(resp)
  // 兼容几种常见返回壳: { data: [...] } / { datacenters: [...] } / [...]
  const list = Array.isArray(data) ? data : (data.data || data.datacenters || [])
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error(`Datacenter list is empty or malformed: ${JSON.stringify(data).slice(0, 300)}`)
  }

  return list
    .map(d => ({
      id: d.accountId,
      name: d.accountName,
    }))
    .filter(d => d.id)
}

// ─── 鉴权 ───────────────────────────────────────────────

/** POST getToken 接口获取新 access_token */
export async function fetchToken(baseUrl, { client_id, client_secret, username, accountId }) {
  const body = {
    client_id,
    client_secret,
    username,
    accountId,
    language: 'zh_CN',
    nonce: randomBytes(8).toString('hex'),
    timestamp: String(Date.now()),
  }

  const url = `${normalizeUrl(baseUrl)}/kapi/oauth2/getToken`
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await safeJson(resp)
  if (!data.status || !data.data?.access_token) {
    _fatal(`Failed to fetch token: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }
  return data.data.access_token
}

/** 根据环境配置获取可用的 access_token */
export async function resolveToken(env) {
  const { client_id, client_secret, username, accountId, auth2, access_token, url } = env
  const hasFullCredentials = client_id && client_secret && username && accountId

  // 情况1: 完整凭据且非 Web OAuth → 每次重新获取 token
  if (hasFullCredentials && auth2 !== true) {
    const secret = decrypt(client_secret)
    return await fetchToken(url, { client_id, client_secret: secret, username, accountId })
  }

  // 情况2: Web OAuth → 使用缓存的 access_token 解密后直接用
  if (auth2 === true && access_token) {
    return decrypt(access_token)
  }

  // 情况3: 无可用凭据
  _fatal('Environment not authenticated. Run: kd env auth openapi')
}

// ─── API 调用 ────────────────────────────────────────────

/** 通用 POST API 请求封装 */
export async function callApi(baseUrl, path, token, body) {
  const url = `${normalizeUrl(baseUrl)}${path}`
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', access_token: token },
    body: JSON.stringify(body),
  })

  // Token 过期处理
  if (resp.status === 401) {
    _fatal('Auth expired. Re-run: kd env auth openapi')
  }

  const data = await safeJson(resp)

  // 业务错误处理
  if (data.status === false) {
    _fatal(`API returned error: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }

  return data
}

// ─── KWC 内部路由 Cookie 登录（/kwc/v1 入口）────────────────
//
// /kwc/v1 前缀的 Controller 接口在苍穹里仅支持 session Cookie 鉴权（无法用
// OpenAPI access_token），因此编写完 Controller 之后的「端到端自检」必须走
// 账号密码登录 → 解析租户化 Cookie → 调 /kwc/v1 的流程。以下是对该流程的公共封装。

function _formEncode(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function _randomAlphanum(n) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let s = ''
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

/** accessKey: 账号长度 <=16 时用账号 + 随机串补齐到 16 位；否则直接用账号（参照 login.py） */
function _buildAccessKey(user) {
  if (user.length > 16) return user
  return (user + _randomAlphanum(16)).slice(0, 16)
}

/** 把 DER base64 公钥包装成 PEM（若已经是 PEM 就直接返回） */
function _normalizePublicKey(pubKeyB64) {
  const trimmed = String(pubKeyB64).trim()
  if (trimmed.startsWith('-----BEGIN PUBLIC KEY-----')) return trimmed
  const wrapped = trimmed.replace(/(.{64})/g, '$1\n')
  return `-----BEGIN PUBLIC KEY-----\n${wrapped}\n-----END PUBLIC KEY-----`
}

/** RSA PKCS1v15 加密密码，返回 base64 */
function _encryptPassword(password, pubKeyB64) {
  const encrypted = publicEncrypt(
    { key: _normalizePublicKey(pubKeyB64), padding: constants.RSA_PKCS1_PADDING },
    Buffer.from(password, 'utf-8'),
  )
  return encrypted.toString('base64')
}

/** 请求 /auth/getPublicKey.do 拿 RSA 公钥 */
async function _fetchPublicKey(baseUrl, { accessKey, accountId }) {
  const url = `${normalizeUrl(baseUrl)}/auth/getPublicKey.do`
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: _formEncode({ accessKey, language: 'zh_CN', accountId }),
  })
  const text = await resp.text()
  let data
  try { data = JSON.parse(text) } catch {
    throw new Error(`getPublicKey returned non-JSON (HTTP ${resp.status}): ${text.slice(0, 300)}`)
  }
  if (!data.publicKey) throw new Error(`Failed to fetch public key: ${JSON.stringify(data).slice(0, 400)}`)
  return data.publicKey
}

/**
 * 从登录返回的 Set-Cookie 列表中筛出 KERPSESSIONID* 和 Isolator*（苍穹 Cookie 带租户后缀），
 * 拼成可用于 /kwc/v1 请求的 Cookie 头。
 */
function _assembleKerpCookie(setCookies) {
  let kerp = ''
  let isolator = ''
  for (const sc of setCookies) {
    const first = String(sc).split(';')[0].trim()
    if (first.startsWith('KERPSESSIONID') && !kerp) kerp = first
    else if (first.startsWith('Isolator') && !isolator) isolator = first
  }
  if (!kerp) {
    throw new Error(`No KERPSESSIONID* cookie found in login response. Raw Set-Cookie:\n${setCookies.join('\n')}`)
  }
  return [kerp, isolator].filter(Boolean).join('; ')
}

/**
 * 使用账号密码登录苍穹，返回可直接用于 /kwc/v1 请求的 Cookie 字符串。
 *
 * 优先级: opts.user/opts.password > env.login_account.{fname,password}
 * 必需的环境字段: url, accountId
 *
 * @param {object} env  loadEnvConfig 返回的环境配置
 * @param {{user?: string, password?: string, accountId?: string}} [opts]
 * @returns {Promise<string>} Cookie 头字符串，形如 "KERPSESSIONIDxxx=...; Isolatorxxx=..."
 */
export async function loginAndGetCookie(env, opts = {}) {
  if (!env || !env.url) throw new Error('Login failed: env is missing the url field')
  const accountId = opts.accountId || env.accountId
  if (!accountId) throw new Error('Login failed: env is missing the accountId field')

  const loginAccount = env.login_account || {}
  const user = opts.user || loginAccount.fname
  const password = opts.password || loginAccount.password
  if (!user || !password) {
    throw new Error(
      'Login failed: no account/password available. Add "login_account": {"fname":"<account>","password":"<pwd>"} to the env section of ~/.kd/config.json, or pass --user/--password.',
    )
  }

  const baseUrl = normalizeUrl(env.url)
  const accessKey = _buildAccessKey(user)
  const pubKey = await _fetchPublicKey(baseUrl, { accessKey, accountId })
  const encryptedPwd = _encryptPassword(password, pubKey)

  const resp = await fetch(`${baseUrl}/auth/yzjlogin.do`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    },
    body: _formEncode({
      type: 'user',
      userSourceType: 2,
      accountId,
      language: 'zh_CN',
      useraccount: user,
      password: encryptedPwd,
      accessKey,
      redirect: 'index.html?formId=pc_main_console',
      isStandard: 'true',
    }),
  })

  const setCookies = typeof resp.headers.getSetCookie === 'function'
    ? resp.headers.getSetCookie()
    : (resp.headers.raw ? resp.headers.raw()['set-cookie'] || [] : [])

  if (!setCookies.length) {
    const text = await resp.text().catch(() => '')
    throw new Error(`Login response has no Set-Cookie (HTTP ${resp.status}). Likely cause: wrong credentials or OTP required. Response snippet: ${text.slice(0, 300)}`)
  }
  return _assembleKerpCookie(setCookies)
}

/**
 * 携带 session Cookie 调用 /kwc/v1 下的 Controller 接口。
 *
 * @param {string} baseUrl  环境基础 URL（env.url）
 * @param {string} cookie   loginAndGetCookie 的返回值
 * @param {string} path     以 / 开头的 Controller 路径，例如 /kwc/v1/kdtest/kdtest_react/demo/hello
 * @param {{method?: string, query?: Record<string, any>, body?: any, headers?: Record<string,string>}} [opts]
 * @returns {Promise<{status: number, data: any, raw: string}>}
 */
export async function callControllerViaCookie(baseUrl, cookie, path, opts = {}) {
  if (!path || !path.startsWith('/')) throw new Error(`Controller path must start with '/': ${path}`)
  const method = (opts.method || 'GET').toUpperCase()
  const query = opts.query || {}
  const qs = Object.entries(query)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  const url = `${normalizeUrl(baseUrl)}${path}${qs ? '?' + qs : ''}`

  const headers = {
    Cookie: cookie,
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    ...(opts.headers || {}),
  }

  const init = { method, redirect: 'manual', headers }
  if (opts.body !== undefined && method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)
  }

  const resp = await fetch(url, init)
  if (resp.status >= 300 && resp.status < 400) {
    const loc = resp.headers.get('location') || ''
    throw new Error(`Request redirected to ${loc} (cookie may be expired, please re-login)`)
  }

  const raw = await resp.text()
  let data
  try { data = JSON.parse(raw) } catch { data = null }
  return { status: resp.status, data, raw }
}

/** 通用 GET API 请求封装 */
export async function callGetApi(baseUrl, path, token, params) {
  const query = Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

  const fullUrl = `${normalizeUrl(baseUrl)}${path}${query ? '?' + query : ''}`
  const resp = await fetch(fullUrl, {
    method: 'GET',
    headers: { access_token: token },
  })

  // Token 过期处理
  if (resp.status === 401) {
    _fatal('Auth expired. Re-run: kd env auth openapi')
  }

  const data = await safeJson(resp)

  // 业务错误处理
  if (data.status === false) {
    _fatal(`API returned error: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }

  return data
}
