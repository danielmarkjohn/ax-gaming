import { steam } from './_steam.js'

export default async function handler(req, res) {
  const { appid, count='3' } = req.query
  if (!appid) return res.status(400).json({ error: 'appid required' })
  try {
    const data = await steam(`/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=${count}`)
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
