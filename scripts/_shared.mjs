/**
 * KWC API 脚本公共基础设施模块
 * 提供 CLI 参数解析、AES 解密、环境配置加载、鉴权、API 调用等通用能力
 * 零外部依赖，仅使用 Node.js 内置模块
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { createDecipheriv, randomBytes } from 'node:crypto'

// ─── 常量 ───────────────────────────────────────────────
export const KD_DIR = join(homedir(), '.kd')
export const CONFIG_FILE = join(KD_DIR, 'config.json')
export const SECRET_KEY_FILE = join(KD_DIR, 'secret.key')
export const ALGORITHM = 'aes-256-cbc'

// ─── 内部默认 fatal ─────────────────────────────────────

/** 默认 fatal，使用通用前缀 [kd-api] */
function _fatal(msg) {
  console.error(`[kd-api] 错误: ${msg}`)
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
    console.error(`[${prefix}] 错误: ${msg}`)
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

/** 读取 secret.key 并返回 Buffer 密钥 */
export function readSecretKey() {
  try {
    const hex = readFileSync(SECRET_KEY_FILE, 'utf-8').trim()
    return Buffer.from(hex, 'hex')
  } catch {
    _fatal('无法读取密钥文件 ~/.kd/secret.key，请先运行 kd env auth openapi')
  }
}

/** AES-256-CBC 解密，输入格式: "iv_base64:cipher_base64" */
export function decrypt(encoded, key) {
  const [ivStr, cipherStr] = encoded.split(':')
  const iv = Buffer.from(ivStr, 'base64')
  const encrypted = Buffer.from(cipherStr, 'base64')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  let decrypted = decipher.update(encrypted, undefined, 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}

/** 读取 ~/.kd/config.json 并返回指定环境配置 */
export function loadEnvConfig(envName) {
  let config
  try {
    config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {
    _fatal('无法读取配置文件 ~/.kd/config.json，请先创建环境配置')
  }

  const envMap = config.env || {}

  // 指定了环境名则直接取，否则找 default: true 的环境
  if (envName) {
    if (!envMap[envName]) _fatal(`环境 "${envName}" 不存在，可用环境: ${Object.keys(envMap).join(', ')}`)
    return envMap[envName]
  }

  const defaultEnv = Object.values(envMap).find(e => e.default)
  if (!defaultEnv) _fatal('未找到默认环境，请通过 --env 指定环境名')
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
    _fatal(`服务端返回非 JSON 响应 (HTTP ${resp.status}):\n${text.slice(0, 500)}`)
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
  if (!Number.isInteger(n)) _fatal(`参数 --${paramName} 必须为整数，收到: "${value}"`)
  if (n < 1 || n > 32767) _fatal(`参数 --${paramName} 必须在 1–32767 范围内，收到: ${n}`)
  return n
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
    _fatal(`获取 token 失败: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }
  return data.data.access_token
}

/** 根据环境配置获取可用的 access_token */
export async function resolveToken(env) {
  const { client_id, client_secret, username, accountId, auth2, access_token, url } = env
  const hasFullCredentials = client_id && client_secret && username && accountId

  // 情况1: 完整凭据且非 Web OAuth → 每次重新获取 token
  if (hasFullCredentials && auth2 !== true) {
    const key = readSecretKey()
    const secret = decrypt(client_secret, key)
    return await fetchToken(url, { client_id, client_secret: secret, username, accountId })
  }

  // 情况2: Web OAuth → 使用缓存的 access_token 解密后直接用
  if (auth2 === true && access_token) {
    const key = readSecretKey()
    return decrypt(access_token, key)
  }

  // 情况3: 无可用凭据
  _fatal('环境未认证，请先运行 kd env auth openapi')
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
    _fatal('认证已过期，请重新运行 kd env auth openapi')
  }

  const data = await safeJson(resp)

  // 业务错误处理
  if (data.status === false) {
    _fatal(`API 返回错误: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }

  return data
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
    _fatal('认证已过期，请重新运行 kd env auth openapi')
  }

  const data = await safeJson(resp)

  // 业务错误处理
  if (data.status === false) {
    _fatal(`API 返回错误: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }

  return data
}
