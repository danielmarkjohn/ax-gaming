import React, { useState } from 'react'
import { useAppStore } from '../store'
import { resolveVanity, getOwnedGames, getPlayerSummary, getCs2Stats, getNews } from '../lib/api'

const CS_APPID = 730

export default function Header() {
  const { steamId, setSteamId, setProfile, setGames, setCs2Stats, setNews, setLoading } = useAppStore()
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
      const [profile, owned, cs2, news] = await Promise.all([
        getPlayerSummary(id),
        getOwnedGames(id),
        getCs2Stats(id),
        getNews(CS_APPID, 4)
      ])
      setProfile(profile)
      setGames(owned?.games || [])
      setCs2Stats(cs2)
      setNews(news?.appnews?.newsitems || [])
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">🎮 CS2 Steam Dashboard</div>
        <span className="text-muted">by Daniel</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="input w-64"
          placeholder="SteamID64 or vanity"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
        <button className="btn" onClick={handleLoad}>Load</button>
      </div>
    </div>
  )
}
