import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import https from 'https'

// Vite plugin for GigaChat API proxy
const gigachatProxy = () => ({
  name: 'gigachat-proxy',
  configureServer(server: any) {
    const AUTH_KEY = 'NzVhNDg2OWItYThiMy00MDRkLTk4MTEtYjgwYjcwNDNhNDNlOmMzNzVkOGYyLWRlZjYtNDFjOS04NjY4LTAwNWY4NTRhOTYxYg=='
    const TOKEN_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
    const API_URL = 'https://gigachat.devices.sberbank.ru/api/v1'

    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }

    // Custom fetch with HTTPS agent
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false // Для работы с Sberbank API
    })

    async function customFetch(url: string, options: any = {}): Promise<any> {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url)
        const req = https.request({
          hostname: urlObj.hostname,
          port: urlObj.port || 443,
          path: urlObj.pathname + urlObj.search,
          method: options.method || 'GET',
          headers: options.headers || {},
          agent: httpsAgent
        }, (res: any) => {
          let data = ''
          res.on('data', chunk => { data += chunk })
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: async () => JSON.parse(data),
              text: async () => data
            })
          })
        })
        req.on('error', reject)
        if (options.body) {
          req.write(options.body)
        }
        req.end()
      })
    }

    let cachedToken: string | null = null
    let tokenExpiresAt = 0

    async function getAccessToken(): Promise<string> {
      if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
        console.log('[GigaChat] Using cached token')
        return cachedToken
      }

      console.log('[GigaChat] Requesting new token...')
      
      const response = await customFetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'RqUID': generateUUID(),
          'Authorization': `Basic ${AUTH_KEY}`
        },
        body: 'scope=GIGACHAT_API_PERS'
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[GigaChat] Token request failed:', errorText)
        throw new Error(`Failed to get token: ${response.status}`)
      }

      const data = await response.json()
      cachedToken = data.access_token
      tokenExpiresAt = data.expires_at
      console.log('[GigaChat] Token received successfully')
      return data.access_token
    }

    server.middlewares.use(async (req: any, res: any, next: any) => {
      // Handle chat requests
      if (req.url === '/api/gigachat-chat' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          console.log('[GigaChat] Received chat request')
          try {
            const token = await getAccessToken()
            const { messages, model = 'GigaChat:latest' } = JSON.parse(body)

            console.log('[GigaChat] Sending request to API...')
            const response = await customFetch(`${API_URL}/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                model,
                messages,
                temperature: 0.7,
                max_tokens: 1024
              })
            })

            if (!response.ok) {
              const errorText = await response.text()
              console.error('[GigaChat] API error:', errorText)
              res.statusCode = response.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: errorText }))
              return
            }

            const data = await response.json()
            console.log('[GigaChat] Response received')
            
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(JSON.stringify(data))
          } catch (error) {
            console.error('[GigaChat] Proxy error:', error)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: String(error) }))
          }
        })
        return
      }

      // Handle CORS preflight
      if (req.url === '/api/gigachat-chat' && req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.end()
        return
      }

      next()
    })
  }
})

export default defineConfig({
  plugins: [react(), gigachatProxy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['firebase'],
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash][extname]`,
      },
    },
  },
})



