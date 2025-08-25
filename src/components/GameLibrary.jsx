import React, { useState, useMemo } from 'react'

export default function GameLibrary({ games, onGameClick }) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('playtime')
  const [collection, setCollection] = useState('all')

  const collections = useMemo(() => {
    const unplayed = games.filter(g => !g.playtime_forever)
    const under2h = games.filter(g => g.playtime_forever && g.playtime_forever < 120)
    const recent = games.filter(g => g.playtime_2weeks > 0)
    const favorites = games.filter(g => g.playtime_forever > 600) // 10+ hours
    
    return {
      all: { games, label: 'All Games', icon: '🎮' },
      unplayed: { games: unplayed, label: 'Unplayed', icon: '🆕' },
      under2h: { games: under2h, label: 'Under 2h', icon: '⏱️' },
      recent: { games: recent, label: 'Recently Played', icon: '🕐' },
      favorites: { games: favorites, label: 'Most Played', icon: '⭐' }
    }
  }, [games])

  const filteredGames = collections[collection].games
    .filter(game => game.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'playtime') return (b.playtime_forever || 0) - (a.playtime_forever || 0)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'recent') return (b.rtime_last_played || 0) - (a.rtime_last_played || 0)
      return 0
    })

  const formatLastPlayed = (timestamp) => {
    if (!timestamp) return 'Never'
    const days = Math.floor((Date.now() / 1000 - timestamp) / 86400)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <div className="card">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">🎮 Game Library</span>
          <span className="px-2 py-1 bg-primary/20 rounded-lg text-xs">{games.length} games</span>
        </div>
        
        {/* Collections */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(collections).map(([key, col]) => (
            <button
              key={key}
              onClick={() => setCollection(key)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                collection === key 
                  ? 'bg-primary text-white' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {col.icon} {col.label} ({col.games.length})
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Search games..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="playtime">By Playtime</option>
            <option value="name">By Name</option>
            <option value="recent">By Last Played</option>
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredGames.slice(0, 12).map(game => (
          <div 
            key={game.appid} 
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
            onClick={() => onGameClick?.(game)}
          >
            <div className="flex items-center gap-3">
              <img 
                src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                alt={game.name}
                className="w-12 h-12 rounded-lg"
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate group-hover:text-primary transition-colors">{game.name}</div>
                <div className="text-sm text-muted">
                  {game.playtime_forever ? `${Math.round(game.playtime_forever / 60)}h played` : 'Never played'}
                </div>
                <div className="text-xs text-muted">
                  Last: {formatLastPlayed(game.rtime_last_played)}
                </div>
              </div>
              {game.playtime_2weeks > 0 && (
                <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                  Recent
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredGames.length > 12 && (
        <div className="text-center mt-4 text-muted text-sm">
          Showing 12 of {filteredGames.length} games
        </div>
      )}
    </div>
  )
}
