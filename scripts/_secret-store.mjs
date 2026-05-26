/**
 * SecretStore — ESM build (unprotect + isKdsec only, for use by kd-frontend-development scripts).
 *
 * Shares the same source as kd-cli's src/utils/secretStore.js; namespace "kingdee-kd".
 * Script-side only consumes ciphertext, so `protect` is not provided; encryption stays in kd-cli and the opencode backend.
 *
 * Platform dispatch (currently win32 / darwin only):
 *   - darwin : read 32-byte master-key from Keychain, decrypt AES-256-GCM via Node crypto
 *   - win32  : DPAPI (CurrentUser) via PowerShell, entropy=<namespace>-v1
 *   - linux  : throws "Unsupported platform"
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

// ─── macOS: Keychain master-key + AES-256-GCM ────────────────────

function darwinGetMasterKey(namespace) {
  const read = spawnSync(
    DARWIN_SECURITY_CLI,
    ['find-generic-password', '-s', namespace, '-a', 'master-key', '-w'],
    { encoding: 'utf8' }
  )
  if (read.status !== 0) {
    throw new Error(
      `macOS Keychain: master-key not found (service=${namespace}, account=master-key). ` +
        'Run `kd env auth openapi` in a terminal first to initialize the key.'
    )
  }
  const hex = (read.stdout || '').trim()
  const buf = Buffer.from(hex, 'hex')
  if (buf.length !== 32) {
    throw new Error(`macOS Keychain: master-key has invalid length (${buf.length} bytes). Re-run \`kd env auth openapi\`.`)
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

// ─── Windows: DPAPI (CurrentUser) via PowerShell ─────────────────

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
        'Please re-run "kd env auth openapi" to rebuild credentials.'
      )
    }
    throw e
  }
}

// ─── Platform dispatch ───────────────────────────────────────────

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
