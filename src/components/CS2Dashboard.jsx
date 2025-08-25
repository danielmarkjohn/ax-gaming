import React from 'react'
import StatCard from './StatCard'

export default function CS2Dashboard({ cs2Stats, computed, accuracyHistory, isHomepage = false }) {
  if (!cs2Stats || !computed) return null

  if (isHomepage) {
    // Compact version for homepage
    return (
      <div className="space-y-6">
        {/* CS2 Header */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎮</div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Counter-Strike 2 Stats
                </div>
                <div className="text-sm text-muted">Live performance data from Steam</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium">
              CS2 Active
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard 
            title="K/D Ratio" 
            value={computed.kd} 
            icon="⚔️" 
            hint={computed.kd >= 1.2 ? 'Excellent' : computed.kd >= 1.0 ? 'Good' : 'Needs work'}
          />
          <StatCard 
            title="Win Rate" 
            value={`${computed.winRate}%`} 
            icon="🏆" 
            hint={`${computed.wins} wins`}
          />
          <StatCard 
            title="Accuracy" 
            value={`${computed.acc}%`} 
            icon="🎯" 
            hint={computed.acc >= 20 ? 'Sharp shooter' : 'Practice aim'}
          />
          <StatCard 
            title="Headshot %" 
            value={`${computed.hsPercent}%`} 
            icon="🎪" 
            hint={computed.hsPercent >= 40 ? 'Precision master' : 'Aim higher'}
          />
        </div>

        {/* Performance Highlights */}
        <div className="card">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⭐</span> Performance Highlights
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">🏆</span>
                <span className="font-medium text-green-400">Total Victories</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{computed.wins.toLocaleString()}</div>
              <div className="text-xs text-green-300/70">{computed.matches} matches played</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400">⚔️</span>
                <span className="font-medium text-blue-400">Total Eliminations</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{computed.kills.toLocaleString()}</div>
              <div className="text-xs text-blue-300/70">{computed.hoursPlayed}h played</div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-400">⭐</span>
                <span className="font-medium text-purple-400">MVP Awards</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{computed.mvps.toLocaleString()}</div>
              <div className="text-xs text-purple-300/70">{computed.mvpRate}% MVP rate</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full version for game detail page
  return (
    <div className="space-y-6">
      {/* CS2 Header */}
      <div className="card">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>⚔️ Counter-Strike 2 Performance</span>
          <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
            Live Stats
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard title="K/D Ratio" value={computed.kd} icon="⚔️" />
          <StatCard title="Accuracy" value={`${computed.acc}%`} icon="🎯" />
          <StatCard title="Headshot %" value={`${computed.hsPercent}%`} icon="🎪" />
          <StatCard title="Win Rate" value={`${computed.winRate}%`} icon="🏆" />
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          <StatCard title="Total Kills" value={computed.kills.toLocaleString()} icon="💀" />
          <StatCard title="Total Wins" value={computed.wins.toLocaleString()} icon="🏆" />
          <StatCard title="MVPs" value={computed.mvps.toLocaleString()} icon="⭐" />
          <StatCard title="Bombs Planted" value={computed.bombsPlanted.toLocaleString()} icon="💣" />
          <StatCard title="Bombs Defused" value={computed.bombsDefused.toLocaleString()} icon="🛡️" />
        </div>
      </div>

      {/* Weapon Performance */}
      {computed.weaponStats?.length > 0 && (
        <div className="card">
          <div className="text-lg font-semibold mb-4">🔫 Top Weapons</div>
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
      )}

      {/* Performance Insights */}
      <div className="card">
        <div className="text-lg font-semibold mb-4">💡 Performance Analysis</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <div className="font-medium mb-2">🎯 Aim Performance</div>
            <div className="text-sm text-muted">
              {parseFloat(computed.acc) > 20 ? 
                `Excellent accuracy at ${computed.acc}%! Keep it up.` :
                parseFloat(computed.acc) > 15 ?
                `Good accuracy at ${computed.acc}%. Try crosshair placement drills.` :
                `Work on accuracy (${computed.acc}%). Focus on spray control.`
              }
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5">
            <div className="font-medium mb-2">⚔️ Combat Effectiveness</div>
            <div className="text-sm text-muted">
              {parseFloat(computed.kd) > 1.2 ? 
                `Strong K/D ratio of ${computed.kd}. Dominating matches!` :
                parseFloat(computed.kd) > 0.9 ?
                `Solid K/D of ${computed.kd}. Room for improvement.` :
                `Focus on survival. K/D of ${computed.kd} needs work.`
              }
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5">
            <div className="font-medium mb-2">🏆 Team Impact</div>
            <div className="text-sm text-muted">
              MVP rate: {computed.mvpRate}% - {parseFloat(computed.mvpRate) > 15 ? 'Excellent team player!' : 'Focus on objective play'}
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5">
            <div className="font-medium mb-2">🎪 Precision</div>
            <div className="text-sm text-muted">
              {parseFloat(computed.hsPercent) > 40 ? 
                `Outstanding headshot rate: ${computed.hsPercent}%` :
                `Headshot rate: ${computed.hsPercent}%. Practice aim maps!`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
