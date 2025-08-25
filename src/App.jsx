import React, { useMemo } from 'react'
import Header from './components/Header'
import StatCard from './components/StatCard'
import { AccuracyChart, KDRatioBar, HSPie } from './components/Charts'
import { useAppStore } from './store'

function computeInsights(stats) {
  const s = (name) => stats?.stats?.find(x => x.name === name)?.value ?? 0
  const kills = s('total_kills')
  const deaths = s('total_deaths')
  const shots = s('total_shots_fired')
  const hits = s('total_shots_hit')
  const hs = s('total_kills_headshot')
  const wins = s('total_wins')
  const dmg = s('total_damage_done')
  const time = s('total_time_played')

  const kd = deaths ? (kills / deaths) : 0
  const acc = shots ? (hits / shots) * 100 : 0
  const hsPercent = kills ? (hs / kills) * 100 : 0
  const dpm = time ? (dmg / (time/60)) : 0

  const improvements = []
  if (kd < 1.0) improvements.push('Improve survivability: play for trades, tighter angles, better utility.')
  if (hsPercent < 35) improvements.push('Aim focus: practice headshot drills; target 35%+ HS%.')
  if (acc < 20) improvements.push('Spray control + crosshair placement: push accuracy above 20%.')
  if (dpm < 300) improvements.push('Impact: use nades to chip damage; isolate duels.')

  return { kills, deaths, wins, kd: +kd.toFixed(2), acc: +acc.toFixed(1), hsPercent: +hsPercent.toFixed(1), dpm: +dpm.toFixed(0), improvements }
}

export default function App() {
  const { profile, games, cs2Stats, news, loading } = useAppStore()

  const computed = useMemo(() => computeInsights(cs2Stats), [cs2Stats])

  // Synthetic accuracy trend from totals (placeholder until you wire match history)
  const accuracyHistory = useMemo(() => {
    if (!cs2Stats) return []
    const base = computed.acc || 18
    return Array.from({ length: 10 }).map((_, i) => ({
      label: `S${i+1}`,
      accuracy: Math.max(5, Math.min(60, (base - 5) + (i * 0.8)))
    }))
  }, [cs2Stats, computed.acc])

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-6">
      <Header />

      {loading && <div className="card">Loading…</div>}

      {profile && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card col-span-2 flex items-center gap-4">
            <img src={profile.avatarfull} alt="avatar" className="w-20 h-20 rounded-xl" />
            <div>
              <div className="text-xl font-semibold">{profile.personaname}</div>
              <div className="text-muted text-sm">{profile.realname || ''}</div>
              <div className="text-xs text-muted">{profile.loccountrycode || ''}</div>
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-muted mb-2">Your Games</div>
            <select className="select w-full">
              {games.map(g => <option key={g.appid} value={g.appid}>{g.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {cs2Stats && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard title="Kills" value={computed.kills} />
            <StatCard title="Deaths" value={computed.deaths} />
            <StatCard title="Wins" value={computed.wins} />
            <StatCard title="Dmg / min" value={computed.dpm} hint="Heuristic from totals" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <KDRatioBar kd={computed.kd} />
            <HSPie hsPercent={computed.hsPercent} />
            <AccuracyChart accuracyHistory={accuracyHistory} />
          </div>

          <div className="card">
            <div className="text-lg font-semibold mb-2">Areas for Improvement</div>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              {computed.improvements.length ? computed.improvements.map((x,i)=>(<li key={i}>{x}</li>)) : <li>Solid baseline. Keep grinding.</li>}
            </ul>
          </div>

          {news?.length ? (
            <div className="card">
              <div className="text-lg font-semibold mb-2">Latest CS2 News</div>
              <div className="grid md:grid-cols-2 gap-3">
                {news.map(n => (
                  <a key={n.gid} href={n.url} target="_blank" className="block p-4 rounded-xl border border-white/10 hover:border-primary/50">
                    <div className="text-sm text-muted">{new Date(n.date * 1000).toLocaleString()}</div>
                    <div className="font-semibold mt-1">{n.title}</div>
                    <div className="text-sm mt-1 opacity-80 line-clamp-3">{n.contents?.replace(/\[.+?\]/g,'')}</div>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      {!profile && !loading && (
        <div className="card">
          <div className="text-lg font-semibold mb-2">Get Started</div>
          <ol className="list-decimal pl-6 space-y-1 text-muted">
            <li>Enter your SteamID64 or vanity name and hit Load.</li>
            <li>Set the STEAM_API_KEY environment variable on Vercel.</li>
            <li>Explore your CS2 stats, charts, and improvement suggestions.</li>
          </ol>
        </div>
      )}
    </div>
  )
}
