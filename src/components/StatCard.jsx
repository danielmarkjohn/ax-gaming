import React from 'react'

export default function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="text-sm text-muted">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-muted mt-2">{hint}</div>}
    </div>
  )
}
