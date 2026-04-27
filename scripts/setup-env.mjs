#!/usr/bin/env node

/**
 * KWC 环境一键配置脚本
 * 自动完成环境创建 + OpenAPI 认证，避免多步交互
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { spawn, execSync } from 'node:child_process'
import { writeFileSync, unlinkSync, readFileSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { join } from 'node:path'
import { createFatal, parseArgs } from './_shared.mjs'

const fatal = createFatal('setup-env')

// ─── 常量 ───────────────────────────────────────────────

const AUTH_TIMEOUT_MS = 60_000
const ALWAYS_REQUIRED = ['envName', 'clientId', 'clientSecret', 'username']

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
    fatal(`环境创建失败: ${stderr}`)
  }
}

// ─── expect 执行器 ──────────────────────────────────────

/** 生成 expect 脚本写入临时文件并执行，返回 Promise */
function runExpect(expectScript, timeoutMs = AUTH_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const tmpFile = join(tmpdir(), `kd-expect-${Date.now()}.exp`)
    writeFileSync(tmpFile, expectScript, 'utf-8')

    const proc = spawn('expect', [tmpFile], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', d => { stdout += d })
    proc.stderr.on('data', d => { stderr += d })

    const timer = setTimeout(() => {
      proc.kill()
      try { unlinkSync(tmpFile) } catch {}
      reject(new Error('expect 执行超时'))
    }, timeoutMs)

    proc.on('close', code => {
      clearTimeout(timer)
      try { unlinkSync(tmpFile) } catch {}
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`expect exit ${code}: ${stderr || stdout}`))
    })

    proc.on('error', err => {
      clearTimeout(timer)
      try { unlinkSync(tmpFile) } catch {}
      reject(new Error(`无法启动 expect: ${err.message}`))
    })
  })
}

// ─── 交互自动化 ─────────────────────────────────────────

/** 使用 expect 驱动 kd env auth openapi 的交互式认证流程 */
function runAuth(envName, clientId, clientSecret, username) {
  // 转义 Tcl 特殊字符
  const esc = s => s.replace(/[\\";\[\]\${}]/g, '\\$&')

  const script = `#!/usr/bin/expect -f
set timeout ${Math.floor(AUTH_TIMEOUT_MS / 1000)}

spawn kd env auth openapi -e ${esc(envName)}

# 1. 数据中心选择 - 回车选默认
expect {
  -re "data center|datacenter|数据中心" { send "\r" }
  timeout { puts stderr "timeout waiting for datacenter prompt"; exit 1 }
}

# 2. clientId
expect {
  -re "client.?id|Client.?ID|client_id" { send "${esc(clientId)}\r" }
  timeout { puts stderr "timeout waiting for clientId prompt"; exit 1 }
}

# 3. clientSecret
expect {
  -re "client.?secret|Client.?Secret|client_secret" { send "${esc(clientSecret)}\r" }
  timeout { puts stderr "timeout waiting for clientSecret prompt"; exit 1 }
}

# 4. username
expect {
  -re "username|用户名|user.?name" { send "${esc(username)}\r" }
  timeout { puts stderr "timeout waiting for username prompt"; exit 1 }
}

expect eof

# 检查退出码
foreach {pid spawnid os_error_flag value} [wait] break
exit $value
`

  return runExpect(script)
}

/** 验证认证状态（直接读取 ~/.kd/config.json 验证关键字段） */
function verifyAuth(envName) {
  try {
    const configPath = join(homedir(), '.kd', 'config.json')
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    const envConfig = config.env?.[envName]

    if (!envConfig) {
      return { success: false, reason: `环境 "${envName}" 不在配置文件中` }
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

    return { success: false, reason: `认证字段缺失: ${missing.join(', ')}` }
  } catch (e) {
    return { success: false, reason: `无法读取配置文件: ${e.message}` }
  }
}

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2))

  // 1. 校验始终必填的参数
  for (const key of ALWAYS_REQUIRED) {
    if (!opts[key] || opts[key] === true) {
      fatal(`缺少必填参数 --${key}\n用法: node setup-env.mjs --envName <name> [--envUrl <url>] --clientId <id> --clientSecret <secret> --username <user>\n说明: --envUrl 在环境不存在时必填，环境已存在时可省略`)
    }
  }

  const { envName, envUrl, clientId, clientSecret, username } = opts
  let created = false

  // 2. 检查环境是否已存在
  if (envExists(envName)) {
    console.error(`[setup-env] 环境 "${envName}" 已存在，跳过创建步骤`)
  } else {
    // 3. 环境不存在时 envUrl 为必填
    if (!envUrl || envUrl === true) {
      fatal(`环境 "${envName}" 不存在，需要创建新环境，但缺少必填参数 --envUrl\n用法: node setup-env.mjs --envName <name> --envUrl <url> --clientId <id> --clientSecret <secret> --username <user>`)
    }
    createEnv(envName, envUrl)
    created = true
  }

  // 4. 自动完成认证
  try {
    await runAuth(envName, clientId, clientSecret, username)
  } catch (err) {
    fatal(err.message)
  }

  // 5. 验证认证状态（从配置文件验证，而非仅检查环境列表）
  const authResult = verifyAuth(envName)
  if (!authResult.success) {
    fatal(`认证未落库: ${authResult.reason}\n请手动执行 kd env auth openapi -e ${envName} 进行认证`)
  }

  console.error(`[setup-env] ✅ 认证验证通过，环境 "${envName}" 已就绪`)

  // 输出结果
  const result = {
    success: true,
    envName,
    ...(envUrl ? { envUrl } : {}),
    authenticated: true,
    message: created
      ? `环境 ${envName} 创建并认证成功`
      : `环境 ${envName} 已存在，认证成功`,
  }
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(`[setup-env] 未预期的错误: ${err.message}`)
  process.exit(1)
})
