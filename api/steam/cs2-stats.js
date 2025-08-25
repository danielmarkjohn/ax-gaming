import { getUserStats, getPlayerAchievements } from './_steam.js'

export default async function handler(req, res) {
  const { steamId } = req.query
  if (!steamId) return res.status(400).json({ error: 'steamId required' })
  
  try {
    // Get CS2 stats using ISteamUserStats
    const statsData = await getUserStats(steamId)
    
    if (!statsData?.playerstats?.stats) {
      return res.status(404).json({ error: 'CS2 stats not available. Game details may be private.' })
    }

    // Also get achievements if available
    let achievements = null
    try {
      const achievementData = await getPlayerAchievements(steamId)
      achievements = achievementData?.playerstats?.achievements || null
    } catch (e) {
      console.log('[CS2] Achievements not available:', e.message)
    }

    res.status(200).json({
      ...statsData.playerstats,
      achievements
    })
  } catch (e) {
    console.error('[CS2 STATS ERROR]', e.message)
    if (e.message.includes('403')) {
      res.status(403).json({ error: 'Profile is private or CS2 stats are not public' })
    } else {
      res.status(500).json({ error: 'Failed to fetch CS2 stats' })
    }
  }
}
