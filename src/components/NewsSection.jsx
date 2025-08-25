import React from 'react'

export default function NewsSection({ news }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-semibold">📰 Latest CS2 News</span>
        <div className="px-2 py-1 bg-primary/20 rounded-lg text-xs">Live Feed</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {news.map(article => (
          <a 
            key={article.gid} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-white/10 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted">
                {new Date(article.date * 1000).toLocaleDateString()}
              </div>
              <div className="text-xs px-2 py-1 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Read More →
              </div>
            </div>
            <div className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </div>
            <div className="text-sm text-muted line-clamp-3">
              {article.contents?.replace(/\[.+?\]/g, '').substring(0, 150)}...
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}