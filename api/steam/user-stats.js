import { getUserStats } from './_steam.js'

export default async function handler(req, res) {
  const { steamId, appid } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  if (!appid) return res.status(400).json({ error: 'appid required' })
  
  try {
    // Use ISteamUserStats/GetUserStatsForGame/v0002
    const data = await getUserStats(steamId)
    
    if (!data?.playerstats) {
      return res.status(404).json({ error: 'No stats found. Make sure your game details are public.' })
    }
    
    res.status(200).json(data.playerstats)
  } catch (e) {
    console.error('[USER STATS ERROR]', e.message)
    res.status(500).json({ error: 'Failed to fetch user stats. Profile may be private.' })
  }
}
