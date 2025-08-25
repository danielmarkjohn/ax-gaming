import React from 'react'

export default function StatCard({ title, value, icon, hint, className = '' }) {
  return (
    <div className={`stat-card-3d ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted">{title}</span>
        <span className="text-xl animate-pulse3d">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-primary mb-1">{value}</div>
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  )
}
