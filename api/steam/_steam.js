const API = 'https://api.steampowered.com'
const KEY = process.env.STEAM_API_KEY
const CS2_APPID = 730

if (!KEY) {
  console.warn('[WARN] STEAM_API_KEY not set. API routes will fail until configured.')
}

// General Steam API function
export async function steam(path) {
  const url = `${API}${path}${path.includes('?') ? '&' : '?'}key=${KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Steam API error ${res.status}: ${text}`)
  }
  return res.json()
}

// CS2-specific functions using actual Steam Web API endpoints
export async function getUserStats(steamid) {
  const url = `${API}/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${CS2_APPID}&steamid=${steamid}&key=${KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Stats ${res.status}`)
  return res.json()
}

export async function getPlayerAchievements(steamid) {
  const url = `${API}/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${CS2_APPID}&steamid=${steamid}&key=${KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Achievements ${res.status}`)
  return res.json()
}

export async function getGlobalAchievementPercentages() {
  const url = `${API}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${CS2_APPID}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Global ${res.status}`)
  return res.json()
}
