#!/usr/bin/env node

/**
 * KWC 元数据查询 REST API 封装脚本
 * 支持命令: queryFormsByApp, getEntityFields
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

import {
  createFatal,
  parseArgs,
  loadEnvConfig,
  resolveToken,
  callGetApi,
  compact,
  CONFIG_FILE,
} from './_shared.mjs'

const fatal = createFatal('meta-query-api')

// ─── appNumber 自动解析 ──────────────────────────────────

/**
 * 尝试从项目或全局配置中自动获取 appNumber
 * 优先级: --appNumber > {cwd}/kd.config.json 的 app 字段 > ~/.kd/config.json 的 app 字段
 */
function resolveAppNumber(opts) {
  // 1. CLI 显式传入
  if (opts.appNumber) return opts.appNumber

  const cwd = opts.cwd ? resolve(opts.cwd) : process.cwd()

  // 2. 从项目目录的 kd.config.json 读取
  const projectConfigPath = join(cwd, 'kd.config.json')
  if (existsSync(projectConfigPath)) {
    try {
      const cfg = JSON.parse(readFileSync(projectConfigPath, 'utf-8'))
      if (cfg.app) return cfg.app
    } catch { /* ignore parse errors */ }
  }

  // 3. 从全局 ~/.kd/config.json 读取
  if (existsSync(CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
      if (cfg.app) return cfg.app
    } catch { /* ignore parse errors */ }
  }

  return undefined
}

// ─── 命令实现 ────────────────────────────────────────────

const commands = {
  queryFormsByApp: {
    required: [],
    usage: 'queryFormsByApp [--appNumber <app>] [--keyword <keyword>] [--cloudNumber <cloud>] [--cwd <path>] [--env <envName>]',
    run: (opts, env, token) =>
      callGetApi(env.url, '/kapi/v2/devportal/ai-meta/queryFormsByApp', token, compact({
        appNumber: opts.appNumber,
        keyword: opts.keyword,
        cloudNumber: opts.cloudNumber,
      })),
  },

  getEntityFields: {
    required: ['formNumber'],
    usage: 'getEntityFields --formNumber <formNumber> [--env <envName>]',
    run: (opts, env, token) =>
      callGetApi(env.url, `/kapi/v2/devportal/ai-meta/getEntityFields`, token, compact({
        formNumber: opts.formNumber,
      })),
  },
}

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (!command || !commands[command]) {
    console.error(`用法: node meta-query-api.mjs <command> [options]\n`)
    console.error('支持的命令:')
    for (const [name, cmd] of Object.entries(commands)) {
      console.error(`  ${cmd.usage}`)
    }
    process.exit(1)
  }

  const cmd = commands[command]
  const opts = parseArgs(rest)

  // queryFormsByApp: 自动解析 appNumber
  if (command === 'queryFormsByApp') {
    opts.appNumber = resolveAppNumber(opts)
    if (!opts.appNumber) {
      fatal('缺少 appNumber：未通过 --appNumber 传入，且在 kd.config.json / ~/.kd/config.json 中均未找到 app 字段\n用法: ' + cmd.usage)
    }
  }

  // 校验必填参数
  for (const key of cmd.required) {
    if (!opts[key]) {
      fatal(`缺少必填参数 --${key}\n用法: ${cmd.usage}`)
    }
  }

  // 加载环境配置并获取 token
  const env = loadEnvConfig(opts.env)
  const token = await resolveToken(env)

  // 执行命令并输出结果
  const result = await cmd.run(opts, env, token)
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(`[meta-query-api] 未预期的错误: ${err.message}`)
  process.exit(1)
})
