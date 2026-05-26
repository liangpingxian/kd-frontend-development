#!/usr/bin/env node

/**
 * KWC 表单链接生成脚本
 * 从环境配置和页面元数据中生成 :::render:kdform 渲染卡片
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 *
 * render 卡片必须由本脚本生成，禁止手工拼接 JSON。
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
    fatal('Missing required --pageMeta\nUsage: node form-link.mjs generate --pageMeta <path> [--formNumber <entity-formNumber>] [--env <envName>]')
  }

  // 读取页面元数据文件
  let content
  try {
    content = readFileSync(opts.pageMeta, 'utf-8')
  } catch {
    fatal(`Failed to read page metadata file: ${opts.pageMeta}`)
  }

  // 提取 pageName 和 title
  const pageName = extractTag(content, 'name')
  if (!pageName) {
    fatal('Could not extract <name> from page metadata. Please fill it in.')
  }

  const title = extractTag(content, 'masterLabel')
  if (!title) {
    fatal('Could not extract <masterLabel> from page metadata. Please fill it in.')
  }

  // 加载环境配置
  const env = loadEnvConfig(opts.env)

  // formNumber 需要 isv（拼出来的元数据 URL 由后端按 isv 隔离查询）
  const formNumber = opts.formNumber
  if (formNumber && !env.isv) {
    fatal('Current env has no `isv` configured; cannot build entity metadata URL')
  }

  // 构建输出
  const baseUrl = normalizeUrl(env.url)
  const url = `${baseUrl}/?formId=${pageName}`

  const result = { title, url }

  // 页面绑定了苍穹后端实体时，附带实体字段查询接口，供前端按需拉取实体结构
  if (formNumber) {
    result.metadata = `${baseUrl}/kapi/v2/devportal/ai-meta/getEntityFields?formNumber=${formNumber}`
  }

  console.log(`:::render:kdform ${JSON.stringify(result)}:::`)
}

// ─── 主流程 ──────────────────────────────────────────────

function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (command !== 'generate') {
    console.error('Usage: node form-link.mjs generate --pageMeta <path> [--formNumber <entity-formNumber>] [--env <envName>]')
    process.exit(1)
  }

  const opts = parseArgs(rest)
  generate(opts)
}

main()
