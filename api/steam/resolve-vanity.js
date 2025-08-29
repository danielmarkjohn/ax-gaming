import { steam } from './_steam.js'

export default async function handler(req, res) {
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
}
