import { getGlobalAchievementPercentages } from './_steam.js'

export default async function handler(req, res) {
  try {
    const data = await getGlobalAchievementPercentages()
    res.status(200).json(data?.achievementpercentages || {})
  } catch (e) {
    console.error('[CS2 GLOBAL STATS ERROR]', e.message)
    res.status(500).json({ error: 'Failed to fetch CS2 global stats' })
  }
}
