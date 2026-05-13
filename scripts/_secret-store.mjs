/**
 * SecretStore —— ESM 版（仅 unprotect + isKdsec，供 kd-frontend-development 脚本使用）
 *
 * 与 kd-cli 的 src/utils/secretStore.js 同源，命名空间 "kingdee-kd"。
 * 脚本侧只消费密文，故不提供 protect；加密能力保留在 kd-cli 和 opencode 后端。
 *
 * 平台分派（当前仅支持 win32 / darwin）：
 *   - darwin : Keychain 中读 32B master-key，Node crypto 做 AES-256-GCM 解密
 *   - win32  : DPAPI (CurrentUser) via PowerShell，entropy=<namespace>-v1
 *   - linux  : 直接抛 Unsupported platform
 */

import { spawnSync } from 'node:child_process'
import { createDecipheriv } from 'node:crypto'

export const PREFIX = 'kdsec:v1:'
export const DEFAULT_NAMESPACE = 'kingdee-kd'
const DARWIN_SECURITY_CLI = '/usr/bin/security'

function ensureNamespace(opts) {
  const ns = (opts && opts.namespace) || DEFAULT_NAMESPACE
  if (!/^[a-zA-Z0-9_\-]+$/.test(ns)) {
    throw new Error(`Invalid SecretStore namespace: ${ns}`)
  }
  return ns
}

export function isKdsec(data) {
  return typeof data === 'string' && data.indexOf(PREFIX) === 0
}

// ─── macOS：Keychain master-key + AES-256-GCM ─────────────────────

function darwinGetMasterKey(namespace) {
  const read = spawnSync(
    DARWIN_SECURITY_CLI,
    ['find-generic-password', '-s', namespace, '-a', 'master-key', '-w'],
    { encoding: 'utf8' }
  )
  if (read.status !== 0) {
    throw new Error(
      `macOS Keychain 未找到 master-key (service=${namespace}, account=master-key)，` +
        '请先在终端运行 `kd env auth` 初始化密钥。'
    )
  }
  const hex = (read.stdout || '').trim()
  const buf = Buffer.from(hex, 'hex')
  if (buf.length !== 32) {
    throw new Error(`macOS Keychain 中的 master-key 长度异常 (${buf.length} bytes)，请重新运行 kd env auth`)
  }
  return buf
}

function darwinUnprotect(payload, namespace) {
  const key = darwinGetMasterKey(namespace)
  const buf = Buffer.from(payload, 'base64')
  if (buf.length < 12 + 16 + 1) {
    throw new Error('Invalid kdsec payload: too short')
  }
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const ct = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const plain = Buffer.concat([decipher.update(ct), decipher.final()])
  return plain.toString('utf8')
}

// ─── Windows：DPAPI (CurrentUser) via PowerShell ──────────────────

function runPowerShell(script, stdinEnv) {
  const res = spawnSync(
    'powershell',
    ['-NoProfile', '-NonInteractive', '-Command', script],
    {
      encoding: 'utf8',
      env: Object.assign({}, process.env, stdinEnv || {}),
    }
  )
  if (res.error) {
    throw new Error(
      'PowerShell not available: ' +
      res.error.message +
      '. Please ensure powershell.exe is installed and on PATH.'
    )
  }
  if (res.status !== 0) {
    throw new Error('PowerShell failed: ' + (res.stderr || res.stdout || 'unknown error'))
  }
  return (res.stdout || '').trim()
}

function winUnprotect(payload, namespace) {
  const entropyTag = `${namespace}-v1`
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security | Out-Null
$data = [Convert]::FromBase64String($env:KDSEC_IN)
$entropy = [Text.Encoding]::UTF8.GetBytes($env:KDSEC_ENT)
$plain = [Security.Cryptography.ProtectedData]::Unprotect($data, $entropy, 'CurrentUser')
[Console]::Out.Write([Text.Encoding]::UTF8.GetString($plain))
`.trim()
  try {
    return runPowerShell(script, {
      KDSEC_IN: payload,
      KDSEC_ENT: entropyTag,
    })
  } catch (e) {
    if (/key not valid/i.test(e && e.message ? e.message : String(e))) {
      throw new Error(
        'DPAPI decryption failed: this credential is bound to a different Windows user / machine. ' +
        'Please re-run "kd env auth" to rebuild credentials.'
      )
    }
    throw e
  }
}

// ─── 平台调度 ────────────────────────────────────────────────────

export function unprotect(data, opts) {
  if (!isKdsec(data)) {
    throw new Error(
      'SecretStore.unprotect: not a kdsec payload, got: ' + String(data).slice(0, 16)
    )
  }
  const namespace = ensureNamespace(opts)
  const rest = data.slice(PREFIX.length)
  const sepIdx = rest.indexOf(':')
  if (sepIdx < 0) throw new Error('SecretStore.unprotect: malformed payload')
  const tag = rest.slice(0, sepIdx)
  const payload = rest.slice(sepIdx + 1)

  if (tag === 'gcm') {
    if (process.platform !== 'darwin') {
      throw new Error(
        `Cannot unprotect gcm payload on ${process.platform}: master-key is bound to macOS Keychain.`
      )
    }
    return darwinUnprotect(payload, namespace)
  }
  if (tag === 'win') {
    if (process.platform !== 'win32') {
      throw new Error(
        `Cannot unprotect win payload on ${process.platform}: DPAPI is bound to the original Windows user.`
      )
    }
    return winUnprotect(payload, namespace)
  }
  throw new Error(`SecretStore.unprotect: unknown payload tag "${tag}"`)
}
