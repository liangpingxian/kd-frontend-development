#!/usr/bin/env node

/**
 * KWC 表单链接生成脚本
 * 从环境配置和页面元数据中生成 :::render:kdform 渲染卡片
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 */

import { readFileSync } from 'node:fs'

import {
  createFatal,
  parseArgs,
  loadEnvConfig,
  normalizeUrl,
} from './_shared.mjs'

const fatal = createFatal('form-link')

// ─── 工具函数 ────────────────────────────────────────────

/** 从 .page-meta.kwp 文件中用正则提取指定标签的值 */
function extractTag(content, tagName) {
  const match = content.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`))
  return match ? match[1].trim() : null
}

// ─── 命令实现 ────────────────────────────────────────────

function generate(opts) {
  // 校验必填参数
  if (!opts.pageMeta) {
    fatal('缺少必填参数 --pageMeta\n用法: node form-link.mjs generate --pageMeta <path> [--env <envName>]')
  }

  // 读取页面元数据文件
  let content
  try {
    content = readFileSync(opts.pageMeta, 'utf-8')
  } catch {
    fatal(`无法读取页面元数据文件: ${opts.pageMeta}`)
  }

  // 提取 pageName 和 title
  const pageName = extractTag(content, 'name')
  if (!pageName) {
    fatal('无法从页面元数据中提取 <name>，请补全页面元数据')
  }

  const title = extractTag(content, 'masterLabel')
  if (!title) {
    fatal('无法从页面元数据中提取 <masterLabel>，请补全页面元数据')
  }

  // 加载环境配置
  const env = loadEnvConfig(opts.env)

  // 构建输出
  const baseUrl = normalizeUrl(env.url)
  const url = `${baseUrl}/?formId=${pageName}`

  const result = { title, url }

  console.log(`:::render:kdform ${JSON.stringify(result)}:::`)
}

// ─── 主流程 ──────────────────────────────────────────────

function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (command !== 'generate') {
    console.error('用法: node form-link.mjs generate --pageMeta <path> [--env <envName>]')
    process.exit(1)
  }

  const opts = parseArgs(rest)
  generate(opts)
}

main()
