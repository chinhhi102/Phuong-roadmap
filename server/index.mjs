// Minimal zero-dependency data server for BA Academy.
// Persists the app's key/value data to a single XML file on disk, so learner
// data lives "on the server / in a file" instead of only the browser.
//
//   node server/index.mjs           # starts on http://localhost:8787
//   data is written to  ./data/ba-data.xml
//
// API (consumed by src/services/serverStore.ts):
//   GET    /api/keys            -> JSON array of stored keys
//   GET    /api/kv/:key         -> raw string value (404 if absent)
//   PUT    /api/kv/:key         -> body is the raw string value
//   DELETE /api/kv/:key

import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const FILE = join(DATA_DIR, 'ba-data.xml')
const PORT = process.env.PORT || 8787

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const unescAttr = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&amp;/g, '&')

function loadStore() {
  if (!existsSync(FILE)) return {}
  try {
    const xml = readFileSync(FILE, 'utf8')
    const store = {}
    const re = /<entry key="([^"]*)"><!\[CDATA\[([\s\S]*?)\]\]><\/entry>/g
    let m
    while ((m = re.exec(xml)) !== null) store[unescAttr(m[1])] = m[2]
    return store
  } catch {
    return {}
  }
}

function saveStore(store) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  const entries = Object.entries(store)
    .map(([k, v]) => `  <entry key="${escAttr(k)}"><![CDATA[${v}]]></entry>`)
    .join('\n')
  writeFileSync(FILE, `<?xml version="1.0" encoding="UTF-8"?>\n<baData>\n${entries}\n</baData>\n`)
}

let store = loadStore()

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const server = createServer((req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return void res.writeHead(204).end()

  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/api/keys' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return void res.end(JSON.stringify(Object.keys(store)))
  }

  const kv = url.pathname.match(/^\/api\/kv\/(.+)$/)
  if (kv) {
    const key = decodeURIComponent(kv[1])
    if (req.method === 'GET') {
      if (key in store) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
        return void res.end(store[key])
      }
      return void res.writeHead(404).end()
    }
    if (req.method === 'PUT') {
      let body = ''
      req.on('data', (c) => (body += c))
      req.on('end', () => {
        store[key] = body
        saveStore(store)
        res.writeHead(204).end()
      })
      return
    }
    if (req.method === 'DELETE') {
      delete store[key]
      saveStore(store)
      return void res.writeHead(204).end()
    }
  }

  res.writeHead(404).end()
})

server.listen(PORT, () => {
  console.log(`✅ BA data server on http://localhost:${PORT}`)
  console.log(`   Persisting to ${FILE}`)
})
