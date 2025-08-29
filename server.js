import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const API = 'https://api.steampowered.com'
const KEY = process.env.STEAM_API_KEY

if (!KEY) {
  console.warn('[WARN] STEAM_API_KEY not set. API routes will fail until configured.')
}

async function steam(path) {
  const url = `${API}${path}${path.includes('?') ? '&' : '?'}key=${KEY}`
  
  console.log(`[STEAM API] Requesting: ${url.replace(KEY || 'undefined', '***')}`)
  
  const res = await fetch(url)
  
  if (!res.ok) {
    const text = await res.text()
    console.error(`[STEAM API ERROR] ${res.status}: ${text}`)
    throw new Error(`Steam API error ${res.status}: ${text || 'Unknown error'}`)
  }
  
  const data = await res.json()
  console.log(`[STEAM API] Success: ${res.status}`, JSON.stringify(data, null, 2))
  return data
}

// Resolve vanity URL
app.get('/api/steam/resolve-vanity', async (req, res) => {
  const { vanity } = req.query
  if (!vanity) return res.status(400).json({ error: 'Please enter your steam id' })
  try {
    const data = await steam(`/ISteamUser/ResolveVanityURL/v0001/?vanityurl=${encodeURIComponent(vanity)}`)
    if (data?.response?.success === 1) {
      res.status(200).json({ steamid: data.response.steamid })
    } else {
      res.status(404).json({ error: 'Could not resolve vanity' })
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Player summary
app.get('/api/steam/player-summary', async (req, res) => {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  try {
    const data = await steam(`/ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamId}`)
    const player = data?.response?.players?.[0] || null
    res.status(200).json(player)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// CS2 stats
app.get('/api/steam/cs2-stats', async (req, res) => {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  
  try {
    const data = await steam(`/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&steamid=${steamId}`)
    
    if (!data?.playerstats) {
      return res.status(404).json({ error: 'No CS2 stats found. Make sure your game details are public.' })
    }
    
    res.status(200).json(data.playerstats)
  } catch (e) {
    console.error('[CS2 STATS ERROR]', e.message)
    res.status(500).json({ error: 'Failed to fetch CS2 stats. Profile may be private or no CS2 data available.' })
  }
})

// Owned games
app.get('/api/steam/owned-games', async (req, res) => {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  try {
    const data = await steam(`/IPlayerService/GetOwnedGames/v0001/?steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`)
    res.status(200).json(data?.response || {})
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// News
app.get('/api/steam/news', async (req, res) => {
  const { appid, count='3' } = req.query
  if (!appid) return res.status(400).json({ error: 'appid required' })
  try {
    const data = await steam(`/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=${count}`)
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`)
})
