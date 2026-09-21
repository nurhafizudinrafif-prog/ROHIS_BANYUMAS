import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

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
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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
            return res.end(JSON.stringify({ result: store[key] !== undefined ? store[key] : null }))
          }
          return res.end(JSON.stringify({ result: store }))
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { key, value } = JSON.parse(body)
              const store = getStore()
              store[key] = value
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
