import React, { useMemo, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import StatCard from './components/StatCard'
import { 
  AccuracyChart, 
  PlaytimeChart, 
  SkillRadarChart, 
  PerformanceTrendChart, 
  MapMasteryChart, 
  CombatEffectivenessChart,
  PlaytimeHealthChart,
  SessionBreakdownChart,
  WeeklyPatternChart
} from './components/Charts'
import GameLibrary from './components/GameLibrary'
import GameDetail from './components/GameDetail'
import NewsSection from './components/NewsSection'
import CS2Dashboard from './components/CS2Dashboard'
import { useAppStore } from './store'

// Simple client-side router
function useRouter() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(1)
    return hash || 'home'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      setRoute(hash || 'home')
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (path) => {
    window.location.hash = path
    setRoute(path)
  }

  return { route, navigate }
}

function computeInsights(stats) {
  if (!stats?.stats) return null
  
  const s = (name) => stats.stats.find(x => x.name === name)?.value ?? 0
  
  // Core stats
  const kills = s('total_kills')
  const deaths = s('total_deaths')
  const shots = s('total_shots_fired')
  const hits = s('total_shots_hit')
  const hs = s('total_kills_headshot')
  const wins = s('total_wins')
  const dmg = s('total_damage_done')
  const time = s('total_time_played')
  const matches = s('total_matches_played')
  const rounds = s('total_rounds_played')
  const mvps = s('total_mvps')
  const money = s('total_money_earned')
  
  // Bomb stats
  const bombsPlanted = s('total_planted_bombs')
  const bombsDefused = s('total_defused_bombs')
  
  // Special kills
  const knifeKills = s('total_kills_knife')
  const grenadeKills = s('total_kills_hegrenade')
  const blindKills = s('total_kills_enemy_blinded')
  const enemyWeaponKills = s('total_kills_enemy_weapon')
  const sniperKills = s('total_kills_against_zoomed_sniper')
  
  // Domination stats
  const dominations = s('total_dominations')
  const revenges = s('total_revenges')
  
  // Last match stats
  const lastMatchKills = s('last_match_kills')
  const lastMatchDeaths = s('last_match_deaths')
  const lastMatchMvps = s('last_match_mvps')
  const lastMatchDamage = s('last_match_damage')
  const lastMatchRounds = s('last_match_rounds')
  
  // Weapon stats
  const weaponStats = getWeaponStats(stats.stats)
  const mapStats = getMapStats(stats.stats)
  
  // Calculations
  const kd = deaths ? (kills / deaths) : 0
  const acc = shots ? (hits / shots) * 100 : 0
  const hsPercent = kills ? (hs / kills) * 100 : 0
  const dpm = time ? (dmg / (time/60)) : 0
  const winRate = matches ? (wins / matches) * 100 : 0
  const mvpRate = rounds ? (mvps / rounds) * 100 : 0
  const avgDamagePerRound = rounds ? (dmg / rounds) : 0
  const hoursPlayed = time ? (time / 3600) : 0
  
  // Advanced insights
  const improvements = []
  if (kd < 1.0) improvements.push('🎯 Focus on positioning and crosshair placement')
  if (hsPercent < 35) improvements.push('🎪 Practice aim training - target 35%+ headshot rate')
  if (acc < 20) improvements.push('🎮 Work on spray control and burst firing')
  if (avgDamagePerRound < 70) improvements.push('💥 Increase impact with better utility usage')
  if (winRate < 50) improvements.push('🏆 Focus on team communication and objective play')
  if (mvpRate < 10) improvements.push('⭐ Step up in clutch situations for more MVPs')

  return { 
    // Core metrics
    kills, deaths, wins, matches, rounds, mvps, money, hoursPlayed,
    kd: +kd.toFixed(2), acc: +acc.toFixed(1), hsPercent: +hsPercent.toFixed(1), 
    dpm: +dpm.toFixed(0), winRate: +winRate.toFixed(1), mvpRate: +mvpRate.toFixed(1),
    avgDamagePerRound: +avgDamagePerRound.toFixed(0),
    
    // Bomb stats
    bombsPlanted, bombsDefused,
    
    // Special kills
    knifeKills, grenadeKills, blindKills, enemyWeaponKills, sniperKills,
    
    // Social stats
    dominations, revenges,
    
    // Last match
    lastMatch: {
      kills: lastMatchKills, deaths: lastMatchDeaths, mvps: lastMatchMvps,
      damage: lastMatchDamage, rounds: lastMatchRounds,
      kd: lastMatchDeaths ? (lastMatchKills / lastMatchDeaths).toFixed(2) : '0.00'
    },
    
    // Detailed stats
    weaponStats, mapStats, improvements,
    achievements: stats.achievements || []
  }
}

function getWeaponStats(stats) {
  const weapons = [
    { name: 'AK-47', key: 'ak47', icon: '🔫', type: 'Rifle' },
    { name: 'AWP', key: 'awp', icon: '🎯', type: 'Sniper' },
    { name: 'M4A1', key: 'm4a1', icon: '🔫', type: 'Rifle' },
    { name: 'P90', key: 'p90', icon: '🔫', type: 'SMG' },
    { name: 'Desert Eagle', key: 'deagle', icon: '🔫', type: 'Pistol' },
    { name: 'Glock-18', key: 'glock', icon: '🔫', type: 'Pistol' },
    { name: 'USP-S/P2000', key: 'hkp2000', icon: '🔫', type: 'Pistol' },
    { name: 'P250', key: 'p250', icon: '🔫', type: 'Pistol' },
    { name: 'SG 553', key: 'sg556', icon: '🔫', type: 'Rifle' },
    { name: 'SCAR-20', key: 'scar20', icon: '🎯', type: 'Sniper' },
    { name: 'SSG 08', key: 'ssg08', icon: '🎯', type: 'Sniper' },
    { name: 'MP7', key: 'mp7', icon: '🔫', type: 'SMG' },
    { name: 'Nova', key: 'nova', icon: '💥', type: 'Shotgun' },
    { name: 'Negev', key: 'negev', icon: '🔫', type: 'Machine Gun' }
  ]

  return weapons.map(weapon => {
    const kills = stats.find(s => s.name === `total_kills_${weapon.key}`)?.value || 0
    const shots = stats.find(s => s.name === `total_shots_${weapon.key}`)?.value || 0
    const hits = stats.find(s => s.name === `total_hits_${weapon.key}`)?.value || 0
    const accuracy = shots ? ((hits / shots) * 100).toFixed(1) : '0.0'
    
    return { ...weapon, kills, shots, hits, accuracy: +accuracy }
  }).filter(w => w.kills > 0).sort((a, b) => b.kills - a.kills)
}

function getMapStats(stats) {
  const maps = [
    { name: 'Dust2', key: 'de_dust2', icon: '🏜️' },
    { name: 'Inferno', key: 'de_inferno', icon: '🔥' },
    { name: 'Mirage', key: 'de_mirage', icon: '🏛️' },
    { name: 'Cache', key: 'de_cache', icon: '🏭' },
    { name: 'Cobblestone', key: 'de_cbble', icon: '🏰' },
    { name: 'Nuke', key: 'de_nuke', icon: '☢️' },
    { name: 'Train', key: 'de_train', icon: '🚂' },
    { name: 'Vertigo', key: 'de_vertigo', icon: '🏢' },
    { name: 'Overpass', key: 'de_overpass', icon: '🌉' }
  ]

  return maps.map(map => {
    const wins = stats.find(s => s.name === `total_wins_map_${map.key}`)?.value || 0
    const rounds = stats.find(s => s.name === `total_rounds_map_${map.key}`)?.value || 0
    const winRate = rounds ? ((wins / rounds) * 100).toFixed(1) : '0.0'
    
    return { ...map, wins, rounds, winRate: +winRate }
  }).filter(m => m.rounds > 0).sort((a, b) => b.rounds - a.rounds)
}

export default function App() {
  const { 
    steamId, profile, games, cs2Stats, news, loading, darkMode, 
    selectedGame, setSelectedGame 
  } = useAppStore()
  
  const { route, navigate } = useRouter()
  const [showCs2Stats, setShowCs2Stats] = useState(false)

  const computed = useMemo(() => computeInsights(cs2Stats), [cs2Stats])

  // Enhanced accuracy trend with more realistic variation
  const accuracyHistory = useMemo(() => {
    if (!cs2Stats || !computed) return []
    const base = computed.acc || 18
    return Array.from({ length: 15 }).map((_, i) => ({
      match: `Match ${i + 1}`,
      accuracy: Math.max(5, Math.min(60, base + (Math.sin(i * 0.5) * 8) + (Math.random() - 0.5) * 6))
    }))
  }, [cs2Stats, computed])

  // Synthetic playtime data
  const playtimeData = useMemo(() => {
    if (!games.length) return []
    return games.slice(0, 8).map(game => ({
      name: game.name.length > 15 ? game.name.substring(0, 15) + '...' : game.name,
      hours: Math.round((game.playtime_forever || 0) / 60)
    })).sort((a, b) => b.hours - a.hours)
  }, [games])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Handle game selection with routing
  const handleGameClick = (game) => {
    setSelectedGame(game)
    navigate(`game/${game.appid}`)
  }

  const handleBackToHome = () => {
    setSelectedGame(null)
    navigate('home')
  }

  // Route handling
  if (route.startsWith('game/') && selectedGame) {
    return (
      <div className="min-h-screen bg-bg text-white">
        <div className="container mx-auto px-4 py-6">
          <Header onLogoClick={() => handleBackToHome()} />
          <GameDetail 
            game={{...selectedGame, steamId: profile?.steamid}} 
            onBack={handleBackToHome} 
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header onLogoClick={() => navigate('home')} />

        {/* Hero Section with 3D effects */}
        {!profile && !loading && (
          <div className="card-3d text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-float">🎮</div>
              <div className="text-2xl font-semibold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome to Gaming Dashboard (Steam)
              </div>
              <div className="text-muted mb-6">Get detailed insights into your Counter-Strike 2 performance</div>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="feature-card">
                  <div className="text-primary font-semibold mb-2">📊 Performance Analytics</div>
                  <div className="text-sm text-muted">Track K/D, accuracy, headshot percentage, and more</div>
                </div>
                <div className="feature-card">
                  <div className="text-accent font-semibold mb-2">🎯 AI Insights</div>
                  <div className="text-sm text-muted">Get personalized improvement suggestions</div>
                </div>
                <div className="feature-card">
                  <div className="text-green-400 font-semibold mb-2">📈 Progress Tracking</div>
                  <div className="text-sm text-muted">Visualize your gaming journey with charts</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Overview */}
        {profile && (
          <>
            <div className="card">
              <div className="flex items-center gap-6">
                <img 
                  src={profile.avatarfull} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-xl border-2 border-primary/30"
                />
                <div className="flex-1">
                  <div className="text-2xl font-bold mb-1">{profile.personaname}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${profile.personastate === 1 ? 'bg-green-500' : profile.personastate === 0 ? 'bg-gray-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs text-muted">
                      {profile.personastate === 1 ? 'Online' : profile.personastate === 0 ? 'Offline' : 'Away'}
                    </span>
                  </div>
                  {profile.profileurl && (
                    <a href={profile.profileurl} target="_blank" rel="noopener noreferrer" 
                       className="text-xs text-primary hover:underline mt-1 block">
                      View Steam Profile →
                    </a>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <StatCard title="Total Games" value={games.length} icon="🎮" />
                <StatCard 
                  title="Account Created" 
                  value={profile.timecreated ? new Date(profile.timecreated * 1000).getFullYear() : 'Unknown'} 
                  icon="📅" 
                />
                <StatCard 
                  title="Friends" 
                  value={profile.friend_count || 'Private'} 
                  icon="👥" 
                />
                <StatCard 
                  title="Years Active" 
                  value={profile.timecreated ? new Date().getFullYear() - new Date(profile.timecreated * 1000).getFullYear() : 'Unknown'} 
                  icon="⏳" 
                />
                <StatCard 
                  title="Achievements" 
                  value={computed?.achievements?.length || 0} 
                  icon="🏆" 
                />
              </div>
            </div>
          </>
        )}

        {/* CS2 Stats Toggle Button */}
        {profile && cs2Stats && (
          <div className="card text-center">
            <button 
              onClick={() => setShowCs2Stats(!showCs2Stats)}
              className="btn bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto"
            >
              <span>🎮</span>
              {showCs2Stats ? 'Hide CS2 Stats' : 'Show CS2 Stats'}
            </button>
          </div>
        )}

        {/* All CS2 Stats - Only show when toggled */}
        {showCs2Stats && cs2Stats && computed && (
          <>
            {/* CS2 Dashboard */}
            <CS2Dashboard 
              cs2Stats={cs2Stats} 
              computed={computed} 
              accuracyHistory={accuracyHistory}
              isHomepage={true}
            />

            {/* Enhanced Core Stats */}
            <div className="grid md:grid-cols-6 gap-4">
              <StatCard title="Kills" value={computed.kills.toLocaleString()} icon="⚔️" />
              <StatCard title="Deaths" value={computed.deaths.toLocaleString()} icon="💀" />
              <StatCard title="K/D Ratio" value={computed.kd} icon="📊" />
              <StatCard title="Win Rate" value={`${computed.winRate}%`} icon="🏆" />
              <StatCard title="MVPs" value={computed.mvps.toLocaleString()} icon="⭐" />
              <StatCard title="Hours Played" value={computed.hoursPlayed.toFixed(0)} icon="⏰" />
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <StatCard title="Accuracy" value={`${computed.acc}%`} icon="🎯" />
              <StatCard title="Headshot %" value={`${computed.hsPercent}%`} icon="🎪" />
              <StatCard title="Damage/Round" value={computed.avgDamagePerRound} icon="💥" />
              <StatCard title="MVP Rate" value={`${computed.mvpRate}%`} icon="⭐" />
            </div>

            {/* Bomb & Special Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>💣</span> Tactical Performance
              </h3>
              <div className="grid md:grid-cols-5 gap-4">
                <StatCard title="Bombs Planted" value={computed.bombsPlanted.toLocaleString()} icon="💣" />
                <StatCard title="Bombs Defused" value={computed.bombsDefused.toLocaleString()} icon="🛡️" />
                <StatCard title="Knife Kills" value={computed.knifeKills.toLocaleString()} icon="🔪" />
                <StatCard title="Grenade Kills" value={computed.grenadeKills.toLocaleString()} icon="💥" />
                <StatCard title="Blind Kills" value={computed.blindKills.toLocaleString()} icon="👁️" />
              </div>
            </div>

            {/* Last Match Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎮</span> Last Match Performance
                <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                  Recent
                </div>
              </h3>
              <div className="grid md:grid-cols-5 gap-4">
                <StatCard title="Kills" value={computed.lastMatch.kills} icon="⚔️" />
                <StatCard title="Deaths" value={computed.lastMatch.deaths} icon="💀" />
                <StatCard title="K/D" value={computed.lastMatch.kd} icon="📊" />
                <StatCard title="MVPs" value={computed.lastMatch.mvps} icon="⭐" />
                <StatCard title="Damage" value={computed.lastMatch.damage.toLocaleString()} icon="💥" />
              </div>
            </div>

            {/* Top Weapons */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🔫</span> Weapon Mastery
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {computed.weaponStats.slice(0, 6).map((weapon, i) => (
                  <div key={weapon.key} className={`feature-card stagger-${i + 1}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{weapon.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{weapon.name}</div>
                          <div className="text-xs text-muted">{weapon.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-bold">{weapon.kills}</div>
                        <div className="text-xs text-muted">kills</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Accuracy: {weapon.accuracy}%</span>
                      <span className="text-muted">{weapon.shots} shots</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🗺️</span> Map Performance
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {computed.mapStats.slice(0, 6).map((map, i) => (
                  <div key={map.key} className={`feature-card stagger-${i + 1}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{map.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{map.name}</div>
                          <div className="text-xs text-muted">{map.rounds} rounds</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-bold">{map.winRate}%</div>
                        <div className="text-xs text-muted">win rate</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted">
                      {map.wins} wins out of {map.rounds} rounds
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Money & Economy Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>💰</span> Economy Stats
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <StatCard 
                  title="Total Money Earned" 
                  value={`$${(computed.money / 1000000).toFixed(1)}M`} 
                  icon="💰" 
                />
                <StatCard 
                  title="Money per Hour" 
                  value={`$${Math.round(computed.money / computed.hoursPlayed).toLocaleString()}`} 
                  icon="💸" 
                />
                <StatCard 
                  title="Dominations" 
                  value={computed.dominations.toLocaleString()} 
                  icon="👑" 
                />
                <StatCard 
                  title="Revenges" 
                  value={computed.revenges.toLocaleString()} 
                  icon="⚡" 
                />
              </div>
            </div>

            {/* Special Kills Breakdown */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎯</span> Special Eliminations
              </h3>
              <div className="grid md:grid-cols-5 gap-4">
                <StatCard title="Knife Kills" value={computed.knifeKills.toLocaleString()} icon="🔪" />
                <StatCard title="Grenade Kills" value={computed.grenadeKills.toLocaleString()} icon="💥" />
                <StatCard title="Blind Kills" value={computed.blindKills.toLocaleString()} icon="👁️" />
                <StatCard title="Enemy Weapon" value={computed.enemyWeaponKills.toLocaleString()} icon="🔄" />
                <StatCard title="vs Snipers" value={computed.sniperKills.toLocaleString()} icon="🎯" />
              </div>
            </div>

            {/* CS2 Skill Analytics */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Skill Analytics & Trends
                <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                  Performance Insights
                </div>
              </h3>
              <div className="grid lg:grid-cols-2 gap-4">
                <SkillRadarChart computed={computed} />
                <PerformanceTrendChart computed={computed} />
                <MapMasteryChart mapStats={computed.mapStats} />
                <CombatEffectivenessChart computed={computed} />
                <AccuracyChart accuracyHistory={accuracyHistory} />
              </div>
            </div>
          </>
        )}

        {/* Game Library Playtime - Always visible */}
        {playtimeData.length > 0 && (
          <PlaytimeChart data={playtimeData} />
        )}

        {/* Gaming Health & Wellness Section - Always visible */}
        {profile && computed && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🏥</span> Gaming Health & Wellness
              <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                Playtime Analytics
              </div>
            </h3>
            
            {/* Health Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Daily Average" 
                value={`${(computed.hoursPlayed / 365).toFixed(1)}h`} 
                icon="📊" 
                hint={computed.hoursPlayed / 365 > 4 ? 'Consider reducing' : 'Healthy range'}
              />
              <StatCard 
                title="Total Hours" 
                value={`${computed.hoursPlayed.toFixed(0)}h`} 
                icon="⏰" 
                hint={`${(computed.hoursPlayed / 24).toFixed(0)} full days`}
              />
              <StatCard 
                title="Health Score" 
                value={computed.hoursPlayed / 365 < 2 ? '95' : computed.hoursPlayed / 365 < 4 ? '75' : '45'} 
                icon="💚" 
                hint={computed.hoursPlayed / 365 < 2 ? 'Excellent' : computed.hoursPlayed / 365 < 4 ? 'Good' : 'Needs attention'}
              />
              <StatCard 
                title="Break Reminder" 
                value="Every 1h" 
                icon="⏸️" 
                hint="Recommended frequency"
              />
            </div>

            {/* Health Charts */}
            <div className="grid lg:grid-cols-2 gap-4 mb-6">
              <PlaytimeHealthChart computed={computed} />
              <SessionBreakdownChart computed={computed} />
              <WeeklyPatternChart computed={computed} />
              
              {/* Health Insights Panel */}
              <div className="card bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20">
                <div className="mb-3 font-semibold flex items-center gap-2">
                  <span>💡</span> Health Insights & Recommendations
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✅</span>
                    <div>
                      <div className="font-medium text-green-400">20-20-20 Rule</div>
                      <div className="text-muted">Every 20 minutes, look at something 20 feet away for 20 seconds</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {games.length > 0 && (
          <GameLibrary 
            games={games} 
            onGameClick={handleGameClick}
          />
        )}

        {news?.length > 0 && <NewsSection news={news} />}

      </div>
      <Footer />
    </div>
  )
}
