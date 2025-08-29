import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <div>
              <div className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AxGaming Dashboard
              </div>
              <div className="text-xs text-muted">Gaming Analytics Platform</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted mb-2">Developed with ❤️ by</div>
            <div className="font-semibold text-primary mb-2">Axsphere</div>
            <div className="flex items-center gap-4 justify-center">
              <a 
                href="https://github.com/danielmarkjohn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="text-xl">🐙</span>
                <span>GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/danielmarkjohn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="text-xl">💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted">
              © 2024 Axsphere
            </div>
            <div className="text-xs text-muted">
              Built with React & Steam Web API
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}