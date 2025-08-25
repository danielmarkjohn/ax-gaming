import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function AccuracyChart({ accuracyHistory }) {
  if (!accuracyHistory?.length) return <div className="card">No accuracy history available (first load will synthesize from totals).</div>
  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold">Shot Accuracy Over Time</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={accuracyHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="accuracy" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function KDRatioBar({ kd }) {
  const data = [{ name: 'K/D', value: kd || 0 }]
  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold">K/D Ratio</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, Math.max(2, kd || 1.5)]} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function HSPie({ hsPercent }) {
  const data = [
    { name: 'Headshot %', value: hsPercent || 0 },
    { name: 'Other', value: Math.max(0, 100 - (hsPercent || 0)) }
  ]
  return (
    <div className="card h-64">
      <div className="mb-3 font-semibold">Headshot Percentage</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value" label>
            {data.map((entry, idx) => <Cell key={idx} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
