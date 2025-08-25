import { steam } from './_steam.js'

export default async function handler(req, res) {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  try {
    const data = await steam(`/ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamId}`)
    const player = data?.response?.players?.[0] || null
    res.status(200).json(player)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
