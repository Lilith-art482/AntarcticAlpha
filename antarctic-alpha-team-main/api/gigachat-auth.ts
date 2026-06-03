import type { VercelRequest, VercelResponse } from '@vercel/node'

const AUTH_KEY = 'NzVhNDg2OWItYThiMy00MDRkLTk4MTEtYjgwYjcwNDNhNDNlOmMzNzVkOGYyLWRlZjYtNDFjOS04NjY4LTAwNWY4NTRhOTYxYg=='
const TOKEN_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
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
    const response = await fetch(TOKEN_URL, {
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
      console.error('Token request failed:', errorText)
      return res.status(response.status).json({ error: 'Failed to get token', details: errorText })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error', message: String(error) })
  }
}
