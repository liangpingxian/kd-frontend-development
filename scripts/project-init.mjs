#!/usr/bin/env node

/**
 * KWC 工程初始化脚本
 * 使用 kd project init 原生参数一键创建工程，跨平台（macOS / Linux / Windows）
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { parseArgs, createFatal } from './_shared.mjs'
import { spawn, execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const fatal = createFatal('project-init')

// ─── 常量 ───────────────────────────────────────────────

const VALID_FRAMEWORKS = ['react', 'vue', 'lwc']
const VALID_LANGUAGES = ['ts', 'js']

const USAGE = `用法: node project-init.mjs --name <name> --framework <react|vue|lwc> --language <ts|js> --app <appCode> [--cwd <path>] [--registry <url>]

必填参数:
  --name        项目名称
  --framework   框架 (react / vue / lwc)
  --language    语言 (ts / js)
  --app         苍穹应用编码

可选参数:
  --cwd <path>       工程创建的目标目录（可选，默认当前目录）
  --registry <url>   npm 镜像地址（可选，默认读环境变量 KWC_NPM_REGISTRY；常用: https://registry.npmmirror.com）

注意: 脚本默认不执行 npm install，初始化完成后请手动执行 npm install 安装依赖。

示例:
  node project-init.mjs --name my-project --framework react --language ts --app kdec_contract --cwd /workspace
  node project-init.mjs --name my-project --framework react --language ts --app kdec_contract --registry https://registry.npmmirror.com`

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
 * 调用 kd project init 原生参数完成工程初始化（无需交互）
 * @returns {Promise<void>}
 */
function runKdProjectInit(name, framework, language, app, cwdPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'kd',
      ['project', 'init', name,
        '--framework', framework,
        '--language', language,
        '--app', app],
      {
        cwd: cwdPath,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      }
    )
    proc.on('error', err => reject(new Error(`启动 kd project init 失败: ${err.message}`)))
    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`kd project init 退出码 ${code}`))
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

  const registry = (args.registry && args.registry !== true)
    ? args.registry
    : (process.env.KWC_NPM_REGISTRY || null)

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

  const projectDir = path.resolve(cwdPath, name)

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
      registry ? `npm install --registry ${registry}` : 'npm install',
    ],
  }
  console.log(JSON.stringify(result, null, 2))
  console.error(`\n[project-init] 初始化完成！请手动执行 npm install 安装依赖：\n  cd ${projectDir} && ${registry ? `npm install --registry ${registry}` : 'npm install'}`)
}

main().catch(err => {
  console.error(`[project-init] 未预期的错误: ${err.message}`)
  process.exit(1)
})
