#!/usr/bin/env node

/**
 * KWC 环境一键配置脚本
 * 使用 kd env 原生参数完成环境创建 + OpenAPI 认证，跨平台（macOS / Linux / Windows）
 * 多数据中心时自动打印候选并以退出码 2 终止，提示通过 --datacenter <accountId> 指定后重跑
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { spawn, execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createFatal, parseArgs, fetchDatacenters, loadEnvConfig, augmentPathWithNpmGlobalBin } from './_shared.mjs'

const fatal = createFatal('setup-env')

// 非交互 shell 下 npm 全局 bin 通常不在 PATH，先补一下，避免 `kd` 命令 ENOENT
augmentPathWithNpmGlobalBin()

// ─── 常量 ───────────────────────────────────────────────

const ALWAYS_REQUIRED = ['envName', 'clientId', 'clientSecret', 'username']
const EXIT_NEED_DATACENTER = 2  // 多数据中心且未指定 --datacenter 时的专用退出码

// ─── 工具函数 ───────────────────────────────────────────

/** 同步执行命令并返回 stdout，失败返回 null */
function execQuiet(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return null
  }
}

/** 检查环境是否已存在于 kd env list 输出中 */
function envExists(envName) {
  const output = execQuiet('kd env list')
  if (!output) return false
  // 按行查找，匹配环境名称（可能出现在表格的某列中）
  return output.split('\n').some(line => line.includes(envName))
}

/** 创建环境 */
function createEnv(envName, envUrl) {
  try {
    execSync(`kd env create ${envName} --url ${envUrl}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  } catch (err) {
    const stderr = err.stderr || err.message
    fatal(`Failed to create env: ${stderr}`)
  }
}

// ─── 认证执行器 ─────────────────────────────────────────

/**
 * 调用 kd env auth openapi 原生参数完成 OpenAPI 认证（无需 TTY/expect）
 * 使用 spawn + 参数数组，避免 shell 注入与特殊字符转义问题
 */
function runAuth(envName, datacenterId, clientId, clientSecret, username) {
  return new Promise((resolve, reject) => {
    const proc = spawn('kd', [
      'env', 'auth', 'openapi',
      '-e', envName,
      '--datacenter', String(datacenterId),
      '--client-id', clientId,
      '--client-secret', clientSecret,
      '--username', username,
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', d => { stdout += d })
    proc.stderr.on('data', d => { stderr += d })

    proc.on('error', err => reject(new Error(`Failed to spawn 'kd env auth openapi': ${err.message}`)))
    proc.on('close', code => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`'kd env auth openapi' exited with code ${code}: ${stderr || stdout}`))
    })
  })
}

/** 验证认证状态（直接读取 ~/.kd/config.json 验证关键字段） */
function verifyAuth(envName) {
  try {
    const configPath = join(homedir(), '.kd', 'config.json')
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    const envConfig = config.env?.[envName]

    if (!envConfig) {
      return { success: false, reason: `env "${envName}" not present in config file` }
    }

    // 检查关键认证字段
    const hasClientId = !!envConfig.client_id
    const hasAccessToken = !!envConfig.access_token
    const hasUsername = !!envConfig.username

    if (hasClientId && hasAccessToken && hasUsername) {
      return { success: true, env: envConfig }
    }

    const missing = []
    if (!hasClientId) missing.push('client_id')
    if (!hasAccessToken) missing.push('access_token')
    if (!hasUsername) missing.push('username')

    return { success: false, reason: `Missing auth fields: ${missing.join(', ')}` }
  } catch (e) {
    return { success: false, reason: `Failed to read config file: ${e.message}` }
  }
}

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2))

  // 1. 校验始终必填的参数
  for (const key of ALWAYS_REQUIRED) {
    if (!opts[key] || opts[key] === true) {
      fatal(`Missing required --${key}\nUsage: node setup-env.mjs --envName <name> [--envUrl <url>] --clientId <id> --clientSecret <secret> --username <user> [--datacenter <accountId>]\nNotes: --envUrl is required when the env does not exist yet; --datacenter is required only when multiple datacenters are available`)
    }
  }

  const { envName, envUrl, clientId, clientSecret, username } = opts
  const userDatacenter = (opts.datacenter && opts.datacenter !== true) ? opts.datacenter : null

  // 2. 确定 envUrl（不管环境是否存在，要做数据中心探测都需要）
  const existing = envExists(envName)
  let effectiveEnvUrl = (envUrl && envUrl !== true) ? envUrl : null
  if (!effectiveEnvUrl) {
    if (existing) {
      try {
        effectiveEnvUrl = loadEnvConfig(envName).url
      } catch (e) {
        fatal(`Failed to read url for env "${envName}" from config: ${e.message}`)
      }
    } else {
      fatal(`Env "${envName}" does not exist. Creating a new env requires --envUrl.\nUsage: node setup-env.mjs --envName <name> --envUrl <url> --clientId <id> --clientSecret <secret> --username <user>`)
    }
  }

  // 3. 先拉取数据中心列表（无副作用探测，失败不会污染本地 ~/.kd/config.json）
  let datacenters
  try {
    datacenters = await fetchDatacenters(effectiveEnvUrl, clientId)
  } catch (err) {
    fatal(`Failed to fetch datacenters: ${err.message}`)
  }

  // 4. 决定使用哪个 accountId（多个且未指定时直接 exit 2，不走后续副作用）
  let datacenterId
  if (datacenters.length === 1) {
    datacenterId = datacenters[0].id
    console.error(`[setup-env] Single datacenter detected: ${datacenters[0].name} (accountId=${datacenterId}). Using it automatically.`)
  } else if (userDatacenter) {
    const matched = datacenters.find(d => String(d.id) === String(userDatacenter))
    if (!matched) {
      console.error(`[setup-env] --datacenter "${userDatacenter}" not in available list. Candidates:\n`)
      for (const d of datacenters) {
        console.error(`  ${d.name}\t(accountId=${d.id})`)
      }
      process.exit(EXIT_NEED_DATACENTER)
    }
    datacenterId = matched.id
    console.error(`[setup-env] Using specified datacenter: ${matched.name} (accountId=${datacenterId})`)
  } else {
    // 多个且未指定→ 打印候选 + 退出码 2（此时本地还没 createEnv，不会产生孤儿环境）
    console.error('[setup-env] Multiple datacenters available. Re-run with --datacenter <accountId>:\n')
    for (const d of datacenters) {
      console.error(`  ${d.name}\t(accountId=${d.id})`)
    }
    console.error('\nExample:')
    console.error(
      `  node scripts/setup-env.mjs --envName ${envName}${envUrl && envUrl !== true ? ` --envUrl ${envUrl}` : ''} ` +
      `--clientId ${clientId} --clientSecret <secret> --username ${username} --datacenter ${datacenters[0].id}`
    )
    process.exit(EXIT_NEED_DATACENTER)
  }

  // 5. 数据中心确认可用后，再创建本地 env（如果还不存在）
  let created = false
  if (!existing) {
    createEnv(envName, effectiveEnvUrl)
    created = true
  } else {
    console.error(`[setup-env] Env "${envName}" already exists, skipping create.`)
  }

  // 6. 调用 kd env auth openapi 完成认证
  try {
    await runAuth(envName, datacenterId, clientId, clientSecret, username)
  } catch (err) {
    fatal(err.message)
  }

  // 6. 验证认证状态（从配置文件验证，而非仅检查环境列表）
  const authResult = verifyAuth(envName)
  if (!authResult.success) {
    fatal(`Auth not persisted: ${authResult.reason}\nRun manually: kd env auth openapi -e ${envName}`)
  }

  console.error(`[setup-env] ✅ Auth verified. Env "${envName}" is ready.`)

  // 输出结果
  const result = {
    success: true,
    envName,
    ...(envUrl && envUrl !== true ? { envUrl } : {}),
    datacenter: datacenterId,
    authenticated: true,
    message: created
      ? `Env ${envName} created and authenticated successfully`
      : `Env ${envName} already existed; authenticated successfully`,
  }
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(`[setup-env] Unexpected error: ${err.message}`)
  process.exit(1)
})
