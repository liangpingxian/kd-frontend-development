#!/usr/bin/env node

/**
 * KWC 工程初始化脚本
 * 将 kd project init 的交互式流程封装为一键参数化调用
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { parseArgs, createFatal } from './_shared.mjs'
import { spawn, execSync } from 'node:child_process'
import { writeFileSync, unlinkSync, existsSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const fatal = createFatal('project-init')

// ─── 常量 ───────────────────────────────────────────────

const VALID_FRAMEWORKS = ['react', 'vue', 'lwc']
const VALID_LANGUAGES = ['ts', 'js']
const INTERACT_TIMEOUT_MS = 120_000

const USAGE = `用法: node project-init.mjs --name <name> --framework <react|vue|lwc> --language <ts|js> --app <appCode> [--cwd <path>]

必填参数:
  --name        项目名称
  --framework   框架 (react / vue / lwc)
  --language    语言 (ts / js)
  --app         苍穹应用编码

可选参数:
  --cwd <path>       工程创建的目标目录（可选，默认当前目录）

示例:
  node project-init.mjs --name my-project --framework react --language ts --app kdec_contract --cwd /workspace`

// ─── expect 执行器 ──────────────────────────────────────

/** 生成 expect 脚本写入临时文件并执行，返回 Promise */
function runExpect(expectScript, { timeoutMs = INTERACT_TIMEOUT_MS, cwd } = {}) {
  return new Promise((resolve, reject) => {
    const tmpFile = path.join(os.tmpdir(), `kd-expect-${Date.now()}.exp`)
    writeFileSync(tmpFile, expectScript, 'utf-8')

    const spawnOpts = { stdio: ['ignore', 'pipe', 'pipe'] }
    if (cwd) spawnOpts.cwd = cwd

    const proc = spawn('expect', [tmpFile], spawnOpts)

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

// ─── 工具函数 ────────────────────────────────────────────

/** 检测 kd CLI 是否已安装，未安装则自动安装 */
function ensureKdCli() {
  const whichCmd = os.platform() === 'win32' ? 'where' : 'which'
  try {
    execSync(`${whichCmd} kd`, { stdio: 'ignore' })
  } catch {
    console.error('[project-init] kd CLI 未检测到，正在自动安装 @kdcloudjs/cli ...')
    try {
      execSync('npm i -g @kdcloudjs/cli', { stdio: 'inherit' })
    } catch (err) {
      fatal(`kd CLI 安装失败: ${err.message}`)
    }
  }
}

/**
 * 使用 expect 驱动 kd project init 并自动完成交互
 * @returns {Promise<void>}
 */
function runKdProjectInit(name, framework, language, app, cwdPath) {
  // 转义 Tcl 特殊字符
  const esc = s => s.replace(/[\\";\[\]\${}]/g, '\\$&')

  // 框架和语言的序号映射（基于 kd CLI 选项顺序）
  // react=第1项, vue=第2项, lwc=第3项
  const frameworkIndex = { react: 0, vue: 1, lwc: 2 }
  // ts=第1项, js=第2项
  const languageIndex = { ts: 0, js: 1 }

  // 生成方向键序列：从第一项开始，发送下键移动到目标位置
  const arrowDown = '\\033[B'
  const frameworkArrows = arrowDown.repeat(frameworkIndex[framework] || 0)
  const languageArrows = arrowDown.repeat(languageIndex[language] || 0)

  const script = `#!/usr/bin/expect -f
set timeout ${Math.floor(INTERACT_TIMEOUT_MS / 1000)}

spawn kd project init ${esc(name)}

# 1. 框架选择
expect {
  -re "framework|框架|React|Vue|LWC" {
    ${frameworkArrows ? `send "${frameworkArrows}";
    sleep 0.2;
    ` : ''}send "\r"
  }
  timeout { puts stderr "timeout waiting for framework prompt"; exit 1 }
}

# 2. 语言选择
expect {
  -re "language|语言|TypeScript|JavaScript" {
    ${languageArrows ? `send "${languageArrows}";
    sleep 0.2;
    ` : ''}send "\r"
  }
  timeout { puts stderr "timeout waiting for language prompt"; exit 1 }
}

# 3. 应用编码输入
expect {
  -re "app|应用|appCode|bizApp" { send "${esc(app)}\r" }
  timeout { puts stderr "timeout waiting for app prompt"; exit 1 }
}

expect eof

# 检查退出码
foreach {pid spawnid os_error_flag value} [wait] break
exit $value
`

  return runExpect(script, { cwd: cwdPath })
}

/**
 * 在项目目录中执行 npm install
 * @returns {Promise<void>}
 */
function runNpmInstall(projectDir) {
  if (!existsSync(projectDir)) {
    return Promise.reject(new Error(`项目目录不存在: ${projectDir}，请确认 kd project init 是否成功创建了工程`))
  }
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['install'], {
      cwd: projectDir,
      stdio: 'inherit',
      shell: true,
    })

    proc.on('error', (err) => {
      reject(new Error(`启动 npm install 失败: ${err.message}`))
    })

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`npm install 退出码 ${code}`))
      } else {
        resolve()
      }
    })
  })
}

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2))

  // --help 支持
  if (args.help || process.argv.includes('--help')) {
    console.log(USAGE)
    process.exit(0)
  }

  // 解析可选参数
  const cwdPath = args.cwd ? path.resolve(args.cwd) : process.cwd()
  if (args.cwd && !existsSync(cwdPath)) {
    fatal(`--cwd 目录不存在: ${cwdPath}`)
  }

  // 校验必填参数
  const { name, framework, language, app } = args

  if (!name) fatal(`缺少必填参数 --name\n${USAGE}`)
  if (!framework) fatal(`缺少必填参数 --framework\n${USAGE}`)
  if (!language) fatal(`缺少必填参数 --language\n${USAGE}`)
  if (!app) fatal(`缺少必填参数 --app\n${USAGE}`)

  if (!VALID_FRAMEWORKS.includes(framework)) {
    fatal(`--framework 值无效: "${framework}"，支持: ${VALID_FRAMEWORKS.join(' / ')}`)
  }
  if (!VALID_LANGUAGES.includes(language)) {
    fatal(`--language 值无效: "${language}"，支持: ${VALID_LANGUAGES.join(' / ')}`)
  }

  // 检测 / 安装 kd CLI
  ensureKdCli()

  // 执行 kd project init（自动交互）
  console.error('[project-init] 正在初始化项目...')
  try {
    await runKdProjectInit(name, framework, language, app, cwdPath)
  } catch (err) {
    fatal(`kd project init 失败: ${err.message}`)
  }

  // 执行 npm install
  const projectDir = path.resolve(cwdPath, name)
  console.error('[project-init] 正在安装依赖...')
  try {
    await runNpmInstall(projectDir)
  } catch (err) {
    fatal(`npm install 失败: ${err.message}`)
  }

  // 输出结果摘要
  const result = {
    success: true,
    project: name,
    framework,
    language,
    app,
    path: projectDir,
  }
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(`[project-init] 未预期的错误: ${err.message}`)
  process.exit(1)
})
