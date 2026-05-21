#!/usr/bin/env node

/**
 * KWC 表单链接生成脚本
 * 从环境配置和页面元数据中生成 :::render:kdform 渲染卡片
 * 零外部依赖，仅使用 Node.js 内置模块
 * 公共基础设施函数来自 ./_shared.mjs
 *
 * 🔴 铁律（与 SKILL.md 顶部"🔴 铁律"小节保持一致）：
 *   ① render 卡片必须由本脚本生成，禁止手工拼接 JSON
 *   ② 卡片可见文案（title 等）禁止出现描述数据性质的字眼，本脚本会自动清洗
 */

import { readFileSync } from 'node:fs'

import {
  createFatal,
  parseArgs,
  loadEnvConfig,
  normalizeUrl,
} from './_shared.mjs'

const fatal = createFatal('form-link')

// 🔴 铁律 ②：禁止出现在用户可见文案中的字眼（大小写不敏感）
const FORBIDDEN_PATTERNS = [
  /mock(?:\s*data)?/gi,
  /模拟数据/g,
  /假数据/g,
  /测试数据/g,
  /示例数据/g,
  /样例数据/g,
  /演示数据/g,
  /预设数据/g,
  /默认数据/g,
  /sample\s*data/gi,
  /demo\s*data/gi,
  /test\s*data/gi,
]

/** 清洗用户可见文案：剥掉描述数据性质的字眼，并把多余空白折叠掉 */
function sanitizeUserFacingText(text) {
  if (typeof text !== 'string') return text
  let cleaned = text
  let touched = false
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(cleaned)) {
      touched = true
      cleaned = cleaned.replace(pattern, '')
    }
  }
  cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/[\s\-_·:：]+$/g, '').trim()
  if (touched) {
    console.error(`[form-link] 警告：已自动剥离文案中描述数据性质的字眼。原文："${text}" → 清洗后："${cleaned}"`)
  }
  return cleaned
}

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
    fatal('Missing required --pageMeta\nUsage: node form-link.mjs generate --pageMeta <path> [--env <envName>]')
  }

  // --formNumber 参数已预留：当前 payload 仅输出 title / url，formNumber 保留为后续扩展占位

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

  const rawTitle = extractTag(content, 'masterLabel')
  if (!rawTitle) {
    fatal('Could not extract <masterLabel> from page metadata. Please fill it in.')
  }

  // 🔴 铁律 ②：清洗卡片可见文案
  const title = sanitizeUserFacingText(rawTitle) || rawTitle

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
    console.error('Usage: node form-link.mjs generate --pageMeta <path> [--env <envName>]')
    process.exit(1)
  }

  const opts = parseArgs(rest)
  generate(opts)
}

main()
