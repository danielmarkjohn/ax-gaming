import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store'
import { resolveVanity, getOwnedGames, getPlayerSummary, getNews, getCs2Stats } from '../lib/api'

const CS_APPID = 730

export default function Header({ onLogoClick }) {
  const { steamId, setSteamId, setProfile, setGames, setCs2Stats, setNews, setLoading, loading, darkMode, toggleDarkMode } = useAppStore()
  const [input, setInput] = useState('')
  
  async function handleLoad() {
    setLoading(true)
    try {
      let id = input.trim()
      if (!/^[0-9]{17}$/.test(id)) {
        const r = await resolveVanity(id)
        if (r?.steamid) id = r.steamid
      }
      if (!/^[0-9]{17}$/.test(id)) throw new Error('Enter a valid SteamID64 or vanity URL name')

      setSteamId(id)
      const [profile, owned, news, cs2Stats] = await Promise.all([
        getPlayerSummary(id),
        getOwnedGames(id),
        getNews(CS_APPID, 4),
        getCs2Stats(id).catch(() => null) // Gracefully handle CS2 stats errors
      ])
      setProfile(profile)
      setGames(owned?.games || [])
      setCs2Stats(cs2Stats)
      setNews(news?.appnews?.newsitems || [])
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onLogoClick}
          > 
            🎮 Gaming Dashboard (Steam)
          </div>
          <span className="text-muted text-sm hidden sm:inline">Developed by Axsphere</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
            title="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <input 
            type="text" 
            className="input flex-1"
            placeholder="76561198263113480 or vanity name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
          />
          <button 
            onClick={handleLoad} 
            className="btn flex-shrink-0"
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
      </div>
    </div>
  )
}
