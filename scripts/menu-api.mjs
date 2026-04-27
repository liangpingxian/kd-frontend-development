#!/usr/bin/env node

/**
 * KWC 应用菜单管理 REST API 封装脚本
 * 支持命令: queryTree, getMenu, addMenu, updateMenu, deleteMenu, moveMenu
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import {
  createFatal,
  parseArgs,
  loadEnvConfig,
  resolveToken,
  callApi,
  compact,
  toInt,
} from './_shared.mjs'

const fatal = createFatal('menu-api')

// ─── 命令实现 ────────────────────────────────────────────

const commands = {
  queryTree: {
    required: ['bizAppNumber'],
    usage: 'queryTree --bizAppNumber <app> [--env <envName>]',
    run: (opts, env, token) =>
      callApi(env.url, '/kapi/v2/devportal/ai-meta/app/menu/queryTree', token, { bizAppNumber: opts.bizAppNumber }),
  },

  getMenu: {
    required: ['bizAppNumber', 'menuId'],
    usage: 'getMenu --bizAppNumber <app> --menuId <id> [--env <envName>]',
    run: (opts, env, token) =>
      callApi(env.url, '/kapi/v2/devportal/ai-meta/app/menu/getMenu', token, { bizAppNumber: opts.bizAppNumber, menuId: opts.menuId }),
  },

  addMenu: {
    required: ['bizAppNumber', 'name'],
    usage: 'addMenu --bizAppNumber <app> --name <name> [--formNumber <form>] [--parentMenuId <pid>] [--seq <number>] [--menuType link] [--linkUrl <url>] [--env <envName>]',
    run: (opts, env, token) =>
      callApi(env.url, '/kapi/v2/devportal/ai-meta/app/menu/add', token, compact({
        bizAppNumber: opts.bizAppNumber,
        name: opts.name,
        formNumber: opts.formNumber,
        parentMenuId: opts.parentMenuId,
        seq: toInt(opts.seq, 'seq'),
        menuType: opts.menuType || 'page',
        openType: 'MainNewTabPage',
        visible: '1',
        linkUrl: opts.linkUrl,
      })),
  },

  updateMenu: {
    required: ['bizAppNumber', 'menuId'],
    usage: 'updateMenu --bizAppNumber <app> --menuId <id> [--name <name>] [--formNumber <form>] [--parentMenuId <pid>] [--visible 0|1] [--seq <number>] [--env <envName>]',
    run: (opts, env, token) =>
      callApi(env.url, '/kapi/v2/devportal/ai-meta/app/menu/update', token, compact({
        bizAppNumber: opts.bizAppNumber,
        menuId: opts.menuId,
        name: opts.name,
        formNumber: opts.formNumber,
        parentMenuId: opts.parentMenuId,
        visible: opts.visible,
        seq: toInt(opts.seq, 'seq'),
      })),
  },

  deleteMenu: {
    required: ['bizAppNumber', 'menuId'],
    usage: 'deleteMenu --bizAppNumber <app> --menuId <id> [--env <envName>]',
    run: (opts, env, token) =>
      callApi(env.url, '/kapi/v2/devportal/ai-meta/app/menu/delete', token, { bizAppNumber: opts.bizAppNumber, menuId: opts.menuId }),
  },

  moveMenu: {
    required: ['bizAppNumber', 'menuId', 'direction'],
    usage: 'moveMenu --bizAppNumber <app> --menuId <id> --direction <up|down> [--env <envName>]',
    run: (opts, env, token) =>
      callApi(env.url, '/kapi/v2/devportal/ai-meta/app/menu/move', token, { bizAppNumber: opts.bizAppNumber, menuId: opts.menuId, direction: opts.direction }),
  },
}

// ─── 主流程 ──────────────────────────────────────────────

async function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (!command || !commands[command]) {
    console.error(`用法: node menu-api.mjs <command> [options]\n`)
    console.error('支持的命令:')
    for (const [name, cmd] of Object.entries(commands)) {
      console.error(`  ${cmd.usage}`)
    }
    process.exit(1)
  }

  const cmd = commands[command]
  const opts = parseArgs(rest)

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
  console.error(`[menu-api] 未预期的错误: ${err.message}`)
  process.exit(1)
})
