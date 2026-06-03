import type { VercelRequest, VercelResponse } from '@vercel/node'
import https from 'https'

const AUTH_KEY = 'NzVhNDg2OWItYThiMy00MDRkLTk4MTEtYjgwYjcwNDNhNDNlOmMzNzVkOGYyLWRlZjYtNDFjOS04NjY4LTAwNWY4NTRhOTYxYg=='
const TOKEN_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
const API_URL = 'https://gigachat.devices.sberbank.ru/api/v1'

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// HTTPS agent with self-signed cert support
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

// Custom fetch using https module
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
    return cachedToken
  }

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
    throw new Error(`Failed to get token: ${response.status}`)
  }

  const data = await response.json()
  cachedToken = data.access_token
  tokenExpiresAt = data.expires_at
  return data.access_token
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = await getAccessToken()
    const { messages, model = 'GigaChat:latest' } = req.body

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
      console.error('Chat request failed:', errorText)
      return res.status(response.status).json({ error: 'Failed to send message', details: errorText })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error', message: String(error) })
  }
}
