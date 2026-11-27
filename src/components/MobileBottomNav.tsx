import React from 'react'
import { Home, Sliders, Calendar, Users, Shield, UserCheck } from 'lucide-react'
import { sounds } from '../lib/audio'

interface MobileBottomNavProps {
  currentOfficer: string | null
  activeView: string
  onNavigateHome: (anchor?: string) => void
  onOpenLogin: () => void
  onOpenDashboard: () => void
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentOfficer,
  activeView,
  onNavigateHome,
  onOpenLogin,
  onOpenDashboard
}) => {
  const handleNav = (anchor?: string) => {
    sounds.playClick()
    onNavigateHome(anchor)
  }

  const handlePortal = () => {
    sounds.playClick()
    if (currentOfficer) {
      onOpenDashboard()
    } else {
      onOpenLogin()
    }
  }

  const isHome = activeView === 'home'
  const isPortal = activeView === 'dashboard' || activeView === 'executive-login'

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d0e]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleNav()}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isHome && !window.location.hash
              ? 'text-emerald-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Home</span>
        </button>

        {/* 2. Workshops / Tracks */}
        <button
          type="button"
          onClick={() => handleNav('tracks')}
          className="flex flex-col items-center justify-center flex-1 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Sliders className="w-4 h-4 mb-0.5 text-emerald-400/90" />
          <span className="text-[10px] tracking-wide">Workshops</span>
        </button>

        {/* 3. Events */}
        <button
          type="button"
          onClick={() => handleNav('events')}
          className="flex flex-col items-center justify-center flex-1 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Events</span>
        </button>

        {/* 4. Council / Teams */}
        <button
          type="button"
          onClick={() => handleNav('about')}
          className="flex flex-col items-center justify-center flex-1 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-wide">Council</span>
        </button>

        {/* 5. Executive Portal / Workspace */}
        <button
          type="button"
          onClick={handlePortal}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isPortal
              ? 'text-emerald-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {currentOfficer ? (
            <>
              <div className="relative">
                <UserCheck className="w-4 h-4 mb-0.5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="text-[10px] tracking-wide truncate max-w-[58px]">Portal</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mb-0.5 text-amber-400/80" />
              <span className="text-[10px] tracking-wide">Login</span>
            </>
          )}
        </button>
      </div>
    </nav>
  )
}
