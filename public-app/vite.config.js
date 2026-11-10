import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { sanitizeAndProtect, scanValueForThreats } from '../shared/services/securitySanitizer.js'
import { fallbackData } from '../shared/data/fallback.js'

function localSyncPlugin() {
  const storePath = path.resolve(import.meta.dirname, '../shared/data/localStore.json')

  const getStore = () => {
    try {
      if (fs.existsSync(storePath)) {
        return JSON.parse(fs.readFileSync(storePath, 'utf8'))
      }
    } catch { /* ignore */ }
    return {}
  }

  const saveStore = (data) => {
    try {
      fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8')
    } catch { /* ignore */ }
  }

  return {
    name: 'local-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/sync', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key, x-admin-pin')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }

        if (req.method === 'GET') {
          const url = new URL(req.url, 'http://localhost')
          const key = url.searchParams.get('key')
          const store = getStore()
          res.setHeader('Content-Type', 'application/json')
          if (key) {
            const raw = store[key] !== undefined ? store[key] : (fallbackData[key] || null)
            const { safeData, wasQuarantined } = sanitizeAndProtect(key, raw)
            return res.end(JSON.stringify({ result: safeData, quarantined: wasQuarantined }))
          }
          const sanitizedStore = {}
          for (const k of Object.keys({ ...fallbackData, ...store })) {
            const raw = store[k] !== undefined ? store[k] : fallbackData[k]
            sanitizedStore[k] = sanitizeAndProtect(k, raw).safeData
          }
          return res.end(JSON.stringify({ result: sanitizedStore }))
        }

        if (req.method === 'POST') {
          const authHeader = req.headers['authorization'] || ''
          if (!authHeader.startsWith('Bearer ') || authHeader.length < 10) {
            res.statusCode = 401
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: 'Unauthorized: Hanya administrator terautentikasi yang diizinkan mengubah data.' }))
          }

          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { key, value } = JSON.parse(body)
              if (value !== null && value !== undefined) {
                const threatCheck = scanValueForThreats(value)
                if (!threatCheck.isSafe) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({ error: `Konten berbahaya ditolak: ${threatCheck.reason}` }))
                }
              }
              const store = getStore()
              store[key] = value !== null && value !== undefined ? sanitizeAndProtect(key, value).safeData : null
              saveStore(store)
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ success: true }))
            } catch (err) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localSyncPlugin()],
  server: {
    port: 3000,
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@shared': import.meta.dirname + '/../shared',
    },
  },
})
