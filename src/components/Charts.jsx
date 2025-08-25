import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts'

// Skill Performance Radar Chart
export function SkillRadarChart({ computed }) {
  const skillData = [
    { skill: 'Aim', value: Math.min(100, computed.acc * 4), fullMark: 100 },
    { skill: 'Precision', value: Math.min(100, computed.hsPercent * 2), fullMark: 100 },
    { skill: 'Survival', value: Math.min(100, computed.kd * 40), fullMark: 100 },
    { skill: 'Teamwork', value: Math.min(100, computed.mvpRate * 5), fullMark: 100 },
    { skill: 'Clutch', value: Math.min(100, (computed.bombsDefused / computed.bombsPlanted) * 200 || 30), fullMark: 100 },
    { skill: 'Consistency', value: Math.min(100, computed.winRate), fullMark: 100 }
  ]

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>🎯</span> Skill Assessment
        <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
          Performance Profile
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={skillData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#9AA4AF', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#9AA4AF', fontSize: 10 }} />
          <Radar
            name="Skill Level"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value.toFixed(0)}%`, 'Skill Level']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Performance Trend Chart
export function PerformanceTrendChart({ computed }) {
  // Generate realistic performance trend based on current stats
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  
  const trendData = Array.from({ length: 12 }).map((_, i) => {
    const monthIndex = (currentMonth - 11 + i + 12) % 12
    const baseKD = computed.kd
    const baseAcc = computed.acc
    const baseHS = computed.hsPercent
    
    // Add realistic variation over time
    const variation = Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * 0.15
    
    return {
      month: monthNames[monthIndex],
      kd: Math.max(0.1, baseKD + variation),
      accuracy: Math.max(5, Math.min(50, baseAcc + variation * 5)),
      headshots: Math.max(10, Math.min(70, baseHS + variation * 8))
    }
  })

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>📈</span> Performance Trends
        <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
          12 Month View
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="#9AA4AF" fontSize={12} />
          <YAxis stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
          <Line type="monotone" dataKey="kd" stroke="#3B82F6" strokeWidth={2} name="K/D Ratio" />
          <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
          <Line type="monotone" dataKey="headshots" stroke="#F59E0B" strokeWidth={2} name="Headshot %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


// Map Mastery Chart
export function MapMasteryChart({ mapStats }) {
  if (!mapStats?.length) return null

  const topMaps = mapStats.slice(0, 6).map(map => ({
    name: map.name.replace('de_', '').replace('cs_', ''),
    winRate: parseFloat(map.winRate),
    rounds: map.rounds,
    wins: map.wins
  }))

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>🗺️</span> Map Mastery
        <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
          Win Rates
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={topMaps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#9AA4AF" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value, name) => [
              name === 'winRate' ? `${value.toFixed(1)}%` : value,
              name === 'winRate' ? 'Win Rate' : 'Rounds'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="winRate" 
            stroke="#F59E0B" 
            fill="#F59E0B" 
            fillOpacity={0.3}
            name="winRate"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Combat Effectiveness Pie
export function CombatEffectivenessChart({ computed }) {
  const combatData = [
    { name: 'Regular Kills', value: computed.kills - computed.knifeKills - computed.grenadeKills - computed.blindKills, color: '#3B82F6' },
    { name: 'Headshots', value: Math.round(computed.kills * computed.hsPercent / 100), color: '#F59E0B' },
    { name: 'Knife Kills', value: computed.knifeKills, color: '#EF4444' },
    { name: 'Grenade Kills', value: computed.grenadeKills, color: '#10B981' },
    { name: 'Blind Kills', value: computed.blindKills, color: '#8B5CF6' }
  ].filter(item => item.value > 0)

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>⚔️</span> Combat Breakdown
        <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">
          Kill Types
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={combatData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {combatData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value) => [value.toLocaleString(), 'Kills']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function KDRatioBar({ kd }) {
  const data = [
    { name: 'Deaths', value: 1, fill: '#EF4444' },
    { name: 'Kills', value: kd, fill: '#10B981' }
  ]
  
  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>⚔️ K/D Performance</span>
        <div className={`px-2 py-1 rounded-lg text-xs ${
          kd >= 1.5 ? 'bg-green-500/20 text-green-400' : 
          kd >= 1.0 ? 'bg-yellow-500/20 text-yellow-400' : 
          'bg-red-500/20 text-red-400'
        }`}>
          {kd >= 1.5 ? 'Excellent' : kd >= 1.0 ? 'Good' : 'Needs Work'}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#9AA4AF" fontSize={12} />
          <YAxis domain={[0, Math.max(2, kd || 1.5)]} stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function HSPie({ hsPercent }) {
  const data = [
    { name: 'Headshots', value: hsPercent, fill: '#F59E0B' },
    { name: 'Body Shots', value: 100 - hsPercent, fill: '#6B7280' }
  ]

  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>🎪 Headshot Accuracy</span>
        <div className={`px-2 py-1 rounded-lg text-xs ${
          hsPercent >= 40 ? 'bg-green-500/20 text-green-400' : 
          hsPercent >= 25 ? 'bg-yellow-500/20 text-yellow-400' : 
          'bg-red-500/20 text-red-400'
        }`}>
          {hsPercent >= 40 ? 'Excellent' : hsPercent >= 25 ? 'Good' : 'Practice Needed'}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={60}
            dataKey="value"
            label={({ value }) => `${value.toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AccuracyChart({ accuracyHistory }) {
  if (!accuracyHistory?.length) return null

  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>🎯 Accuracy Trend</span>
        <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
          Recent Matches
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={accuracyHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="match" stroke="#9AA4AF" fontSize={12} />
          <YAxis domain={[0, 60]} stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value.toFixed(1)}%`, 'Accuracy']}
          />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PlaytimeChart({ data }) {
  if (!data?.length) return null

  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold">🎮 Game Library Playtime</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#9AA4AF" fontSize={12} />
          <YAxis stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value}h`, 'Playtime']}
          />
          <Bar dataKey="hours" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Health & Playtime Analytics Charts
export function PlaytimeHealthChart({ computed }) {
  // Generate realistic daily playtime data for last 30 days
  const today = new Date()
  const dailyPlaytime = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (29 - i))
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Base playtime with weekend spikes and random variation
    const baseHours = isWeekend ? 4 + Math.random() * 3 : 1.5 + Math.random() * 2
    const intensity = Math.sin(i * 0.2) * 0.5 + 0.5 // Cyclical pattern
    const dailyHours = Math.max(0, baseHours * intensity)
    
    return {
      day: `${date.getMonth() + 1}/${date.getDate()}`,
      hours: +dailyHours.toFixed(1),
      isWeekend,
      healthRisk: dailyHours > 6 ? 'High' : dailyHours > 4 ? 'Medium' : 'Low'
    }
  })

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>📊</span> Daily Playtime Pattern
        <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
          Last 30 Days
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyPlaytime}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="day" stroke="#9AA4AF" fontSize={10} />
          <YAxis stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value, name, props) => [
              `${value}h`, 
              'Playtime',
              props.payload.healthRisk === 'High' ? '⚠️ Consider breaks' : 
              props.payload.healthRisk === 'Medium' ? '⚡ Moderate session' : '✅ Healthy session'
            ]}
          />
          <Bar 
            dataKey="hours" 
            fill={(entry) => entry?.healthRisk === 'High' ? '#EF4444' : 
                            entry?.healthRisk === 'Medium' ? '#F59E0B' : '#10B981'}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SessionBreakdownChart({ computed }) {
  // Simulate session length distribution
  const sessionData = [
    { duration: '< 1h', sessions: 45, color: '#10B981', health: 'Excellent' },
    { duration: '1-2h', sessions: 32, color: '#3B82F6', health: 'Good' },
    { duration: '2-4h', sessions: 18, color: '#F59E0B', health: 'Moderate' },
    { duration: '4-6h', sessions: 8, color: '#EF4444', health: 'Concerning' },
    { duration: '6h+', sessions: 3, color: '#7C2D12', health: 'Unhealthy' }
  ]

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>⏰</span> Session Length Distribution
        <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
          Health Impact
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sessionData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="sessions"
            label={({ duration, percent }) => `${duration}: ${(percent * 100).toFixed(0)}%`}
          >
            {sessionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value, name, props) => [
              `${value} sessions`, 
              `${props.payload.health} for health`
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function WeeklyPatternChart({ computed }) {
  const weeklyData = [
    { day: 'Mon', hours: 2.1, recommended: 2, isWorkday: true },
    { day: 'Tue', hours: 1.8, recommended: 2, isWorkday: true },
    { day: 'Wed', hours: 2.5, recommended: 2, isWorkday: true },
    { day: 'Thu', hours: 1.9, recommended: 2, isWorkday: true },
    { day: 'Fri', hours: 3.2, recommended: 2, isWorkday: true },
    { day: 'Sat', hours: 5.1, recommended: 4, isWorkday: false },
    { day: 'Sun', hours: 4.8, recommended: 4, isWorkday: false }
  ]

  return (
    <div className="card h-80">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span>📅</span> Weekly Gaming Pattern
        <div className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
          vs Recommended
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="day" stroke="#9AA4AF" fontSize={12} />
          <YAxis stroke="#9AA4AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111317', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            formatter={(value, name) => [
              `${value}h`, 
              name === 'hours' ? 'Actual' : 'Recommended'
            ]}
          />
          <Bar dataKey="recommended" fill="rgba(59, 130, 246, 0.3)" name="recommended" />
          <Bar dataKey="hours" fill="#3B82F6" name="hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
