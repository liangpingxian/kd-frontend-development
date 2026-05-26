#!/usr/bin/env node

/**
 * 开发态动画信号脚本
 * 输出一行 :::render:kdapp ...::: 让右侧 UI 进入"正在开发"动画态
 * 调用方：模型在端到端开发链路的第一次回应里跑一次，stdout 原样贴回正文
 *
 * 用法：
 *   node app-signal.mjs --title "签到时长查询页面"
 */

function parseTitle(argv) {
  const i = argv.indexOf('--title')
  if (i === -1 || !argv[i + 1]) {
    process.stderr.write('usage: node app-signal.mjs --title "<business summary>"\n')
    process.exit(2)
  }
  return argv[i + 1]
}

function sanitize(raw) {
  let t = String(raw)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/["""]/g, '〞')
    .replace(/:{3,}/g, '·')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) t = 'KWC page development'
  if ([...t].length > 24) {
    process.stderr.write(`title too long (>24 chars), please shorten: ${t}\n`)
    process.exit(4)
  }
  return t
}

const title = sanitize(parseTitle(process.argv.slice(2)))
const payload = JSON.stringify({ target: 'kdapp', title, phase: 'developing' })
process.stdout.write(`:::render:kdapp ${payload}:::\n`)
