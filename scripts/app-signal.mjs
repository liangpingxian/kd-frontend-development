#!/usr/bin/env node

/**
 * Development-mode animation signal script
 * Outputs a line :::render:kdapp ...::: to put the right-side UI into the "developing" animation state
 * Caller: the model runs this once in the first response of the end-to-end development chain; stdout is pasted back verbatim into the body
 *
 * Usage:
 *   node app-signal.mjs --title "Check-in Duration Query Page"
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
