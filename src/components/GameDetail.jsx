import React, { useState, useEffect } from 'react'
import StatCard from './StatCard'
import CS2Dashboard from './CS2Dashboard'
import { getCs2Stats } from '../lib/api'

export default function GameDetail({ game, onBack }) {
  const [cs2Stats, setCs2Stats] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load CS2 stats if this is Counter-Strike 2
  useEffect(() => {
    if (game.appid === 730) { // CS2 App ID
      loadCs2Stats()
    }
  }, [game.appid])

  const loadCs2Stats = async () => {
    setLoading(true)
    try {
      const stats = await getCs2Stats(game.steamId || '76561198263113480') // Use actual steamId
      setCs2Stats(stats)
    } catch (e) {
      console.error('Failed to load CS2 stats:', e)
    } finally {
      setLoading(false)
    }
  }

  const computeCs2Insights = (stats) => {
    if (!stats?.stats) return null
    
    const s = (name) => stats.stats.find(x => x.name === name)?.value ?? 0
    
    // All the comprehensive stats
    const kills = s('total_kills')
    const deaths = s('total_deaths')
    const shots = s('total_shots_fired')
    const hits = s('total_shots_hit')
    const hs = s('total_kills_headshot')
    const wins = s('total_wins')
    const matches = s('total_matches_played')
    const mvps = s('total_mvps')
    const bombsPlanted = s('total_planted_bombs')
    const bombsDefused = s('total_defused_bombs')
    const rounds = s('total_rounds_played')
    const money = s('total_money_earned')
    const damage = s('total_damage_done')
    const time = s('total_time_played')
    
    // Special kills
    const knifeKills = s('total_kills_knife')
    const grenadeKills = s('total_kills_hegrenade')
    const blindKills = s('total_kills_enemy_blinded')
    const enemyWeaponKills = s('total_kills_enemy_weapon')
    
    // Calculations
    const kd = deaths ? (kills / deaths).toFixed(2) : '0.00'
    const acc = shots ? ((hits / shots) * 100).toFixed(1) : '0.0'
    const hsPercent = kills ? ((hs / kills) * 100).toFixed(1) : '0.0'
    const winRate = matches ? ((wins / matches) * 100).toFixed(1) : '0.0'
    const mvpRate = rounds ? ((mvps / rounds) * 100).toFixed(1) : '0.0'
    const avgDamagePerRound = rounds ? (damage / rounds).toFixed(0) : '0'
    const hoursPlayed = time ? (time / 3600).toFixed(0) : '0'

    return { 
      kills, deaths, kd, acc, hsPercent, wins, matches, winRate, mvps, mvpRate, 
      bombsPlanted, bombsDefused, rounds, money, avgDamagePerRound, hoursPlayed,
      knifeKills, grenadeKills, blindKills, enemyWeaponKills
    }
  }

  const getWeaponStats = (stats) => {
    if (!stats?.stats) return []
    
    const weapons = [
      { name: 'AK-47', key: 'ak47', icon: '🔫' },
      { name: 'AWP', key: 'awp', icon: '🎯' },
      { name: 'M4A1', key: 'm4a1', icon: '🔫' },
      { name: 'P90', key: 'p90', icon: '🔫' },
      { name: 'Deagle', key: 'deagle', icon: '🔫' }
    ]

    return weapons.map(weapon => {
      const kills = stats.stats.find(s => s.name === `total_kills_${weapon.key}`)?.value || 0
      const shots = stats.stats.find(s => s.name === `total_shots_${weapon.key}`)?.value || 0
      const hits = stats.stats.find(s => s.name === `total_hits_${weapon.key}`)?.value || 0
      const accuracy = shots ? ((hits / shots) * 100).toFixed(1) : '0.0'
      
      return { ...weapon, kills, shots, hits, accuracy }
    }).filter(w => w.kills > 0).sort((a, b) => b.kills - a.kills)
  }

  const insights = cs2Stats ? computeCs2Insights(cs2Stats) : null
  const weaponStats = cs2Stats ? getWeaponStats(cs2Stats) : []

  const formatPlaytime = (minutes) => {
    if (!minutes) return '0h 0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatLastPlayed = (timestamp) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp * 1000)
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getPlatformStats = () => {
    const platforms = [
      { name: 'Windows', time: game.playtime_windows_forever || 0, icon: '🪟' },
      { name: 'Mac', time: game.playtime_mac_forever || 0, icon: '🍎' },
      { name: 'Linux', time: game.playtime_linux_forever || 0, icon: '🐧' },
      { name: 'Steam Deck', time: game.playtime_deck_forever || 0, icon: '🎮' }
    ]
    return platforms.filter(p => p.time > 0)
  }

  const getPlaytimeInsights = () => {
    const total = game.playtime_forever || 0
    const recent = game.playtime_2weeks || 0
    const insights = []

    if (total === 0) insights.push('🆕 Never played - ready to start!')
    else if (total < 60) insights.push('🌱 Just getting started')
    else if (total < 300) insights.push('🎯 Getting into it')
    else if (total < 1200) insights.push('⭐ Regular player')
    else insights.push('🏆 Dedicated player')

    if (recent > 0) {
      const percentage = ((recent / total) * 100).toFixed(1)
      insights.push(`📈 ${percentage}% of total time in last 2 weeks`)
    }

    return insights
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            ← Back
          </button>
          <div className="text-lg font-semibold">Game Details</div>
        </div>
        
        <div className="flex items-center gap-6">
          <img 
            src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
            alt={game.name}
            className="w-16 h-16 rounded-xl"
          />
          <div className="flex-1">
            <div className="text-xl font-bold mb-2">{game.name}</div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>App ID: {game.appid}</span>
              {game.has_community_visible_stats && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                  Stats Available
                </span>
              )}
            </div>
            <a 
              href={`https://store.steampowered.com/app/${game.appid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View on Steam Store →
            </a>
          </div>
        </div>
      </div>

      {/* Playtime Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Playtime" 
          value={formatPlaytime(game.playtime_forever)} 
          icon="⏱️" 
        />
        <StatCard 
          title="Recent (2 weeks)" 
          value={formatPlaytime(game.playtime_2weeks || 0)} 
          icon="📅" 
        />
        <StatCard 
          title="Last Played" 
          value={formatLastPlayed(game.rtime_last_played)} 
          icon="🕐" 
        />
        <StatCard 
          title="Offline Time" 
          value={formatPlaytime(game.playtime_disconnected)} 
          icon="📴" 
        />
      </div>

      {/* CS2 Specific Stats */}
      {game.appid === 730 && (
        <>
          {loading && (
            <div className="card text-center">
              <div className="animate-spin text-2xl mb-2">⚙️</div>
              <div>Loading CS2 stats...</div>
            </div>
          )}

          {insights && (
            <CS2Dashboard 
              cs2Stats={cs2Stats} 
              computed={insights} 
              isHomepage={false}
            />
          )}
        </>
      )}
      
      {/* Playtime Insights */}
      <div className="card">
        <div className="text-lg font-semibold mb-4">💡 Playtime Insights</div>
        <div className="space-y-2">
          {getPlaytimeInsights().map((insight, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 text-sm">
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Platform Breakdown */}
      {getPlatformStats().length > 0 && (
        <div className="card">
          <div className="text-lg font-semibold mb-4">🖥️ Platform Breakdown</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getPlatformStats().map(platform => (
              <div key={platform.name} className="p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span>{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                </div>
                <div className="text-xl font-bold text-primary">
                  {formatPlaytime(platform.time)}
                </div>
                <div className="text-xs text-muted">
                  {((platform.time / (game.playtime_forever || 1)) * 100).toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Descriptors */}
      {game.content_descriptorids && game.content_descriptorids.length > 0 && (
        <div className="card">
          <div className="text-lg font-semibold mb-4">⚠️ Content Warnings</div>
          <div className="flex gap-2">
            {game.content_descriptorids.map(id => (
              <span key={id} className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">
                {id === 2 ? 'Violence' : id === 5 ? 'Mature Content' : `Content ID: ${id}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <div className="text-lg font-semibold mb-4">🚀 Quick Actions</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <a 
            href={`steam://run/${game.appid}`}
            className="p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 transition-colors text-center"
          >
            <div className="text-2xl mb-1">▶️</div>
            <div className="text-sm font-medium">Launch Game</div>
          </a>
          <a 
            href={`https://store.steampowered.com/app/${game.appid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-center"
          >
            <div className="text-2xl mb-1">🏪</div>
            <div className="text-sm font-medium">Store Page</div>
          </a>
          {game.has_community_visible_stats && (
            <a 
              href={`https://steamcommunity.com/stats/${game.appid}/achievements`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-center"
            >
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-sm font-medium">Achievements</div>
            </a>
          )}
          <a 
            href={`https://steamcommunity.com/app/${game.appid}/discussions/`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 transition-colors text-center"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="text-sm font-medium">Discussions</div>
          </a>
        </div>
      </div>

      {/* Performance Stats Placeholder
      <div className="card">
        <div className="text-lg font-semibold mb-4">📊 Performance Stats</div>
        <div className="p-8 text-center bg-white/5 rounded-xl border-2 border-dashed border-white/20">
          <div className="text-4xl mb-2">🚧</div>
          <div className="text-lg font-medium mb-2">Coming Soon</div>
          <div className="text-muted">
            Game-specific performance statistics and achievements will be displayed here
          </div>
        </div>
      </div> */}


    </div>
  )
}
