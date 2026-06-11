#!/usr/bin/env node

/**
 * KWC 工程初始化脚本
 * 使用 kd project init 原生参数一键创建工程，跨平台（macOS / Linux / Windows）
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { parseArgs, createFatal, augmentPathWithNpmGlobalBin } from './_shared.mjs'
import { spawn, execSync } from 'node:child_process'
import path from 'node:path'

const fatal = createFatal('project-init')

// ─── 常量 ───────────────────────────────────────────────

const VALID_FRAMEWORKS = ['react', 'vue', 'lwc']
const VALID_LANGUAGES = ['ts', 'js']

const USAGE = `Usage: node project-init.mjs --name <name> --framework <react|vue|lwc> --language <ts|js> --app <appCode>

Required:
  --name        project name
  --framework   framework (react / vue / lwc)
  --language    language (ts / js)
  --app         Cosmic app identifier

The project is created at <current shell cwd>/<name>. To target a different parent directory, cd into it before invoking this script.

Note: this script does NOT run npm install. After init, run it yourself (in CN networks, prefer --registry=https://registry.npmmirror.com).

Example:
  cd /workspace && node project-init.mjs --name my-project --framework react --language ts --app kdec_contract`

// ─── 工具函数 ────────────────────────────────────────────

/** 检测 kd CLI 是否已安装，未安装则自动安装 */
/** 检测 kd CLI 是否可调用（直接尝试运行，不依赖 which/PATH 字符串匹配） */
function isKdAvailable() {
  try {
    execSync('kd -v', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function ensureKdCli() {
  augmentPathWithNpmGlobalBin()
  if (isKdAvailable()) return

  console.error('[project-init] kd CLI not detected, installing @kdcloudjs/cli ...')
  try {
    execSync('npm i -g @kdcloudjs/cli --registry=https://registry.npmmirror.com', { stdio: 'inherit' })
  } catch (err) {
    fatal(`Failed to install kd CLI: ${err.message}`)
  }
  // 安装完再补一次 PATH 并校验（新装的 bin 可能就在刚拿到的 prefix 下）
  augmentPathWithNpmGlobalBin()
  if (!isKdAvailable()) {
    fatal('kd CLI still not callable after install. Check that the npm global bin directory is on PATH (`npm config get prefix`).')
  }
}

/**
 * 调用 kd project init 原生参数完成工程初始化（无需交互）
 * 工程生成在 process.cwd() 下；调用方负责在调用前 cd 到目标父目录。
 * @returns {Promise<void>}
 */
function runKdProjectInit(name, framework, language, app) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'kd',
      ['project', 'init', name,
        '--framework', framework,
        '--language', language,
        '--app', app],
      {
        stdio: 'inherit',
        shell: process.platform === 'win32',
      }
    )
    proc.on('error', err => reject(new Error(`Failed to spawn 'kd project init': ${err.message}`)))
    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`'kd project init' exited with code ${code}`))
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

  // 校验必填参数
  const { name, framework, language, app } = args

  if (!name) fatal(`Missing required --name\n${USAGE}`)
  if (!framework) fatal(`Missing required --framework\n${USAGE}`)
  if (!language) fatal(`Missing required --language\n${USAGE}`)
  if (!app) fatal(`Missing required --app\n${USAGE}`)

  if (!VALID_FRAMEWORKS.includes(framework)) {
    fatal(`Invalid --framework: "${framework}". Supported: ${VALID_FRAMEWORKS.join(' / ')}`)
  }
  if (!VALID_LANGUAGES.includes(language)) {
    fatal(`Invalid --language: "${language}". Supported: ${VALID_LANGUAGES.join(' / ')}`)
  }

  // 检测 / 安装 kd CLI
  ensureKdCli()

  // 执行 kd project init（自动交互）
  console.error('[project-init] Initializing project...')
  try {
    await runKdProjectInit(name, framework, language, app)
  } catch (err) {
    fatal(`'kd project init' failed: ${err.message}`)
  }

  const projectDir = path.resolve(process.cwd(), name)
  const installCmd = 'npm install --registry=https://registry.npmmirror.com'

  // 输出结果摘要
  const result = {
    success: true,
    project: name,
    framework,
    language,
    app,
    path: projectDir,
    installed: false,
    nextSteps: [
      `cd ${projectDir}`,
      installCmd,
    ],
  }
  console.log(JSON.stringify(result, null, 2))
  console.error(`\n[project-init] Done. Install dependencies manually:\n  cd ${projectDir} && ${installCmd}`)
}

main().catch(err => {
  console.error(`[project-init] Unexpected error: ${err.message}`)
  process.exit(1)
})
