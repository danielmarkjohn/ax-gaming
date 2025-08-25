import { steam } from './_steam.js'

export default async function handler(req, res) {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  try {
    const data = await steam(`/IPlayerService/GetOwnedGames/v0001/?steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`)
    res.status(200).json(data?.response || {})
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
