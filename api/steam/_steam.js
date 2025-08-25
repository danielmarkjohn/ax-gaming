import fetch from 'node-fetch'

const API = 'https://api.steampowered.com'
const KEY = process.env.STEAM_API_KEY

if (!KEY) {
  console.warn('[WARN] STEAM_API_KEY not set. API routes will fail until configured.')
}

export async function steam(path) {
  const url = `${API}${path}${path.includes('?') ? '&' : '?'}key=${KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Steam API error ${res.status}: ${text}`)
  }
  return res.json()
}
