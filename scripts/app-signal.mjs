#!/usr/bin/env node

/**
 * 开发态动画信号脚本
 * 输出一行 :::render:kdapp ...::: 让右侧 UI 进入"正在开发"动画态
 * 调用方：模型在端到端开发链路的第一次回应里跑一次，stdout 原样贴回正文
 *
 * 用法：
 *   node app-signal.mjs --title "签到时长查询页面"
 *
 * 🔴 铁律：title 内禁止出现描述数据性质的字眼（mock / 模拟 / 测试 / 示例 / 演示 / 预设 / 默认 数据等）
 */

const FORBIDDEN = /(mock|模拟|假|测试|示例|样例|演示|预设|默认)\s*数据|mock/gi

function parseTitle(argv) {
  const i = argv.indexOf('--title')
  if (i === -1 || !argv[i + 1]) {
    process.stderr.write('用法: node app-signal.mjs --title "<业务概括>"\n')
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
  if (FORBIDDEN.test(t)) {
    process.stderr.write(`title 含违禁字眼，请改为只讲业务的措辞：${t}\n`)
    process.exit(3)
  }
  if (!t) t = 'KWC 页面开发'
  if ([...t].length > 24) {
    process.stderr.write(`title 过长（>24 字），请精简：${t}\n`)
    process.exit(4)
  }
  return t
}

const title = sanitize(parseTitle(process.argv.slice(2)))
const payload = JSON.stringify({ target: 'kdapp', title, phase: 'developing' })
process.stdout.write(`:::render:kdapp ${payload}:::\n`)
