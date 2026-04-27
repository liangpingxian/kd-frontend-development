#!/usr/bin/env node

/**
 * KWC 批量创建脚本
 * 一次调用批量创建多个组件、页面、Controller，避免逐个执行 kd project create
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { execSync } from 'node:child_process'

import {
  createFatal,
  parseArgs,
} from './_shared.mjs'

const fatal = createFatal('batch-create')

// ─── 工具函数 ────────────────────────────────────────────

/** 将逗号分隔的字符串拆为去空白的名称数组，空串返回空数组 */
function splitNames(raw) {
  if (!raw || raw === true) return []
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

/** 执行单条 kd project create 命令，返回结果对象 */
function runCreate(name, type, env) {
  const args = ['project', 'create', name, '--type', type]
  if (env && type === 'controller') args.push('-e', env)

  try {
    execSync(`kd ${args.join(' ')}`, { stdio: 'pipe', encoding: 'utf-8' })
    return { name, type, success: true }
  } catch (err) {
    return { name, type, success: false, error: err.stderr || err.message }
  }
}

/** 构建某一类别的汇总统计 */
function summarize(items) {
  const success = items.filter(r => r.success).length
  return { total: items.length, success, failed: items.length - success }
}

// ─── 主流程 ──────────────────────────────────────────────

function main() {
  const opts = parseArgs(process.argv.slice(2))

  const components  = splitNames(opts.components)
  const pages       = splitNames(opts.pages)
  const controllers = splitNames(opts.controllers)
  const env         = typeof opts.env === 'string' ? opts.env : undefined

  // 校验：至少需要一种创建任务
  if (components.length === 0 && pages.length === 0 && controllers.length === 0) {
    fatal(
      '至少需要提供 --components / --pages / --controllers 中的一个\n' +
      '用法: node batch-create.mjs \\\n' +
      '  --components UserProfile,OrderList,Dashboard \\\n' +
      '  --pages user_dashboard,order_list \\\n' +
      '  --controllers UserController \\\n' +
      '  [--env dev]'
    )
  }

  const results = { components: [], controllers: [], pages: [] }

  // 1. 先创建组件
  for (const name of components) {
    results.components.push(runCreate(name, 'kwc', env))
  }

  // 2. 再创建 Controller
  if (controllers.length > 0 && !env) {
    console.warn('[batch-create] 警告: 未指定 --env，Controller 创建通常需要环境来拉取 SDK')
  }
  for (const name of controllers) {
    results.controllers.push(runCreate(name, 'controller', env))
  }

  // 3. 最后创建页面
  for (const name of pages) {
    results.pages.push(runCreate(name, 'page', env))
  }

  // 汇总
  const details = [
    ...results.components,
    ...results.controllers,
    ...results.pages,
  ]
  const allSuccess = details.every(r => r.success)

  const output = {
    success: allSuccess,
    summary: {
      components:  summarize(results.components),
      controllers: summarize(results.controllers),
      pages:       summarize(results.pages),
    },
    details,
  }

  console.log(JSON.stringify(output, null, 2))

  // 如果全部失败则以非零码退出
  if (details.length > 0 && details.every(r => !r.success)) {
    process.exit(1)
  }
}

main()
