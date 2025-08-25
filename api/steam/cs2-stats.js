import { steam } from './_steam.js'

const APPID = 730

export default async function handler(req, res) {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  try {
    const data = await steam(`/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${APPID}&steamid=${steamId}`)
    res.status(200).json(data?.playerstats || {})
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
