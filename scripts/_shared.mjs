/**
 * KWC API Script Shared Infrastructure Module
 * Provides CLI argument parsing, ciphertext decryption, environment config loading, authentication, API calls, and other common capabilities
 * Zero external dependencies — only uses Node.js built-in modules
 *
 * Decryption via _secret-store.mjs (SecretStore, namespace=kingdee-kd)
 * Reads the master-key from the OS credential container; no longer reads/writes ~/.kd/secret.key.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir, platform } from 'node:os'
import { execSync } from 'node:child_process'
import { randomBytes, publicEncrypt, constants } from 'node:crypto'
import { unprotect, isKdsec } from './_secret-store.mjs'

// ─── Constants ───────────────────────────────────────────────
export const KD_DIR = join(homedir(), '.kd')
export const CONFIG_FILE = join(KD_DIR, 'config.json')

// ─── PATH fix for non-interactive shells ──────────────────────

/**
 * Add the npm global bin directory to the current process's PATH.
 * Node.js in non-interactive shells does not load ~/.zshrc / ~/.bashrc,
 * so user-configured npm prefixes (e.g. ~/.npm-global/bin) may not be in PATH,
 * causing `which kd` / direct `spawn kd` to throw ENOENT.
 * Calls `npm config get prefix` to get the global prefix and injects it into process.env.PATH.
 *
 * Idempotent: repeated calls will not append duplicates. Silently skipped when npm is unavailable.
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
    // Silently skipped when npm is unavailable; the issue will surface naturally when kd is actually called later
  }
}

// ─── Internal default fatal ─────────────────────────────────────

/** Default fatal function, uses the generic prefix [kd-api] */
function _fatal(msg) {
  console.error(`[kd-api] error: ${msg}`)
  process.exit(1)
}

// ─── Utility functions ───────────────────────────────────────────

/**
 * Create a fatal function bound to a specified prefix
 * @param {string} prefix - Prefix identifier, e.g. 'menu-api', 'meta-query-api'
 * @returns {(msg: string) => never}
 */
export function createFatal(prefix) {
  return function fatal(msg) {
    console.error(`[${prefix}] error: ${msg}`)
    process.exit(1)
  }
}

/** Simple CLI argument parser, no external libraries */
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

/** Decrypt ciphertext: only recognizes the new `kdsec:` prefix; legacy `iv:ciphertext` format directly errors and guides the user to re-authenticate */
export function decrypt(encoded) {
  if (!isKdsec(encoded)) {
    _fatal('legacy ciphertext detected, please re-run `kd env auth openapi` to migrate credentials')
  }
  try {
    return unprotect(encoded)
  } catch (e) {
    _fatal(`ciphertext decryption failed: ${e && e.message ? e.message : String(e)}`)
  }
}

/** Read ~/.kd/config.json and return the specified environment configuration */
export function loadEnvConfig(envName) {
  let config
  try {
    config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {
    _fatal('cannot read config file ~/.kd/config.json, please create an environment configuration first')
  }

  const envMap = config.env || {}

  // If an env name is specified, use it directly; otherwise find the one with default: true
  if (envName) {
    if (!envMap[envName]) _fatal(`environment "${envName}" not found, available: ${Object.keys(envMap).join(', ')}`)
    return envMap[envName]
  }

  const defaultEnv = Object.values(envMap).find(e => e.default)
  if (!defaultEnv) _fatal('no default environment found, please specify one with --env')
  return defaultEnv
}

/**
 * Read the top-level config.language independently (not dependent on any env).
 * File missing / parse failure / field missing → always falls back to 'zh_CN', no error thrown.
 */
export function loadLanguage() {
  try {
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
    return config.language || 'zh_CN'
  } catch {
    return 'zh_CN'
  }
}

/** Remove trailing slashes from a URL to avoid double-slash concatenation */
export function normalizeUrl(url) {
  return url.replace(/\/+$/, '')
}

/** Safely parse a JSON response; returns a readable error when the response is not JSON */
export async function safeJson(resp) {
  const text = await resp.text()
  try {
    return JSON.parse(text)
  } catch {
    _fatal(`non-JSON response from server (HTTP ${resp.status}):\n${text.slice(0, 500)}`)
  }
}

/** Filter out null/undefined fields, keeping only fields with values */
export function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null))
}

/** Safely convert a CLI string parameter to an integer; errors and exits on invalid or out-of-range values */
export function toInt(value, paramName) {
  if (value == null) return undefined
  const n = Number(value)
  if (!Number.isInteger(n)) _fatal(`argument --${paramName} must be an integer, got: "${value}"`)
  if (n < 1 || n > 32767) _fatal(`argument --${paramName} must be within 1–32767, got: ${n}`)
  return n
}

// ─── Datacenter (before authentication, no auth needed) ─────────────────────

/**
 * Fetch the list of available datacenters for the environment (used for the --datacenter parameter of kd env auth openapi)
 * Endpoint: POST <envUrl>/auth/getAllDatacenters.do
 * Return shape is normalized to [{ id: accountId, name: accountName }]
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
    throw new Error(`datacenter request failed: ${e.message} (url=${url})`)
  }

  const data = await safeJson(resp)
  // Compatible with several common return wrappers: { data: [...] } / { datacenters: [...] } / [...]
  const list = Array.isArray(data) ? data : (data.data || data.datacenters || [])
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error(`datacenter list empty or malformed: ${JSON.stringify(data).slice(0, 300)}`)
  }

  return list
    .map(d => ({
      id: d.accountId,
      name: d.accountName,
    }))
    .filter(d => d.id)
}

// ─── Authentication ───────────────────────────────────────────────

/** POST the getToken endpoint to fetch a new access_token; language defaults from loadLanguage() reading the top-level config.language */
export async function fetchToken(baseUrl, { client_id, client_secret, username, accountId, language = loadLanguage() }) {
  const body = {
    client_id,
    client_secret,
    username,
    accountId,
    language,
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
    _fatal(`failed to fetch token: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }
  return data.data.access_token
}

/** Get an available access_token based on the environment configuration */
export async function resolveToken(env) {
  const { client_id, client_secret, username, accountId, auth2, access_token, url } = env
  const hasFullCredentials = client_id && client_secret && username && accountId

  // Case 1: Full credentials and not Web OAuth → fetch a new token each time
  if (hasFullCredentials && auth2 !== true) {
    const secret = decrypt(client_secret)
    return await fetchToken(url, { client_id, client_secret: secret, username, accountId })
  }

  // Case 2: Web OAuth → decrypt the cached access_token and use directly
  if (auth2 === true && access_token) {
    return decrypt(access_token)
  }

  // Case 3: No available credentials
  _fatal('environment not authenticated, please run `kd env auth openapi` first')
}

// ─── API Calls ────────────────────────────────────────────

/** Generic POST API request wrapper */
export async function callApi(baseUrl, path, token, body) {
  const url = `${normalizeUrl(baseUrl)}${path}`
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', access_token: token },
    body: JSON.stringify(body),
  })

  // Token expiry handling
  if (resp.status === 401) {
    _fatal('authentication expired, please re-run `kd env auth openapi`')
  }

  const data = await safeJson(resp)

  // Business error handling
  if (data.status === false) {
    _fatal(`API returned error: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }

  return data
}

// ─── KWC Internal Route Cookie Login (/kwc/v1 entry point) ────────────────
// /kwc/v1-prefixed Controller interfaces in Cosmic only support session Cookie auth
// (OpenAPI access_token is not accepted), so the "end-to-end self-check" after writing
// a Controller must follow the account/password login → parse tenant-specific Cookie →
// call /kwc/v1 flow. Below is the shared encapsulation of this flow.

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

/** accessKey: when account length <=16, pad with random chars to 16 chars; otherwise use the account directly (following login.py) */
function _buildAccessKey(user) {
  if (user.length > 16) return user
  return (user + _randomAlphanum(16)).slice(0, 16)
}

/** Wrap a DER base64 public key into PEM format (if already PEM, return as-is) */
function _normalizePublicKey(pubKeyB64) {
  const trimmed = String(pubKeyB64).trim()
  if (trimmed.startsWith('-----BEGIN PUBLIC KEY-----')) return trimmed
  const wrapped = trimmed.replace(/(.{64})/g, '$1\n')
  return `-----BEGIN PUBLIC KEY-----\n${wrapped}\n-----END PUBLIC KEY-----`
}

/** RSA PKCS1v15 encrypt the password, returns base64 */
function _encryptPassword(password, pubKeyB64) {
  const encrypted = publicEncrypt(
    { key: _normalizePublicKey(pubKeyB64), padding: constants.RSA_PKCS1_PADDING },
    Buffer.from(password, 'utf-8'),
  )
  return encrypted.toString('base64')
}

/** Request /auth/getPublicKey.do to get the RSA public key */
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
    throw new Error(`getPublicKey non-JSON response (HTTP ${resp.status}): ${text.slice(0, 300)}`)
  }
  if (!data.publicKey) throw new Error(`failed to fetch public key: ${JSON.stringify(data).slice(0, 400)}`)
  return data.publicKey
}

/**
 * Filter out KERPSESSIONID* and Isolator* from the Set-Cookie list in the login response
 * (Cosmic cookies have tenant suffixes), and assemble them into a Cookie header usable for /kwc/v1 requests.
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
    throw new Error(`no KERPSESSIONID* cookie in login response. raw Set-Cookie:\n${setCookies.join('\n')}`)
  }
  return [kerp, isolator].filter(Boolean).join('; ')
}

/**
 * Log in to Cosmic using account/password, returning a Cookie string that can be used directly for /kwc/v1 requests.
 *
 * Priority: opts.user/opts.password > env.login_account.{fname,password}
 * Required env fields: url, accountId
 *
 * @param {object} env  Environment config returned by loadEnvConfig
 * @param {{user?: string, password?: string, accountId?: string}} [opts]
 * @returns {Promise<string>} Cookie header string, e.g. "KERPSESSIONIDxxx=...; Isolatorxxx=..."
 */
export async function loginAndGetCookie(env, opts = {}) {
  if (!env || !env.url) throw new Error('login failed: env missing `url` field')
  const accountId = opts.accountId || env.accountId
  if (!accountId) throw new Error('login failed: env missing `accountId` field')

  const loginAccount = env.login_account || {}
  const user = opts.user || loginAccount.fname
  const password = opts.password || loginAccount.password
  if (!user || !password) {
    throw new Error(
      'login failed: account/password not found. Please add "login_account": {"fname":"xxx","password":"xxx"} under the matching env in ~/.kd/config.json, or pass --user/--password',
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
    throw new Error(`login response has no Set-Cookie (HTTP ${resp.status}). Likely wrong credentials or dynamic-password restriction. Body snippet: ${text.slice(0, 300)}`)
  }
  return _assembleKerpCookie(setCookies)
}

/**
 * Call a /kwc/v1 Controller interface carrying the session Cookie.
 *
 * @param {string} baseUrl  Environment base URL (env.url)
 * @param {string} cookie   Return value from loginAndGetCookie
 * @param {string} path     Controller path starting with /, e.g. /kwc/v1/kdtest/kdtest_react/demo/hello
 * @param {{method?: string, query?: Record<string, any>, body?: any, headers?: Record<string,string>}} [opts]
 * @returns {Promise<{status: number, data: any, raw: string}>}
 */
export async function callControllerViaCookie(baseUrl, cookie, path, opts = {}) {
  if (!path || !path.startsWith('/')) throw new Error(`controller path must start with /: ${path}`)
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
    throw new Error(`request redirected to ${loc} (cookie likely expired, please re-login)`)
  }

  const raw = await resp.text()
  let data
  try { data = JSON.parse(raw) } catch { data = null }
  return { status: resp.status, data, raw }
}

/** Generic GET API request wrapper */
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

  // Token expiry handling
  if (resp.status === 401) {
    _fatal('authentication expired, please re-run `kd env auth openapi`')
  }

  const data = await safeJson(resp)

  // Business error handling
  if (data.status === false) {
    _fatal(`API returned error: ${data.errorCode || ''} ${data.message || JSON.stringify(data)}`)
  }

  return data
}
