import React, { useEffect, useState } from 'react'

interface PreloaderProps {
  onComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15)
  const [statusText, setStatusText] = useState('Initializing UYFSR Secure Network...')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)

  useEffect(() => {
    // Stage 1: Initial handshake
    const t1 = setTimeout(() => {
      setProgress(45)
      setStatusText('Synchronizing Central Secretariat Registries...')
    }, 280)

    // Stage 2: Verification
    const t2 = setTimeout(() => {
      setProgress(85)
      setStatusText('Verifying Executive Credentials & Protocols...')
    }, 620)

    // Stage 3: Complete
    const t3 = setTimeout(() => {
      setProgress(100)
      setStatusText('Access Authorized · Portal Ready')
    }, 950)

    // Stage 4: Trigger Fade-out
    const t4 = setTimeout(() => {
      setIsFadingOut(true)
      if (onComplete) onComplete()
    }, 1150)

    // Stage 5: Unmount completely
    const t5 = setTimeout(() => {
      setIsRemoved(true)
    }, 1750)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [onComplete])

  if (isRemoved) return null

  return (
    <div
      role="status"
      aria-label="Loading UYFSR Central Portal"
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0d1214] text-white select-none transition-all duration-600 ease-out ${
        isFadingOut ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,120,102,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Crest / Logo Emblem */}
      <div className="relative mb-6">
        {/* Orbital Pulsing Ring */}
        <div className="w-20 h-20 rounded-full border border-[#0c7866]/40 animate-ping absolute inset-0 opacity-20 pointer-events-none" />
        
        {/* Spinning Elegant Border */}
        <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-[#0c7866] border-r-[#10b981]/50 border-b-[#0c7866]/30 animate-spin flex items-center justify-center shadow-[0_0_25px_rgba(12,120,102,0.35)]" />

        {/* Center Insignia */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#131b1e] border border-[#0c7866]/50 flex items-center justify-center shadow-inner">
            <span className="font-serif font-bold text-lg tracking-wider text-emerald-400">
              U
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Typography */}
      <div className="text-center space-y-1.5 px-4 relative z-10 max-w-md">
        <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-white">
          UYFSR
        </h2>
        <p className="text-[12px] sm:text-[13px] text-stone-300 font-light tracking-wide uppercase">
          United Youth Forum of Science and Research
        </p>
      </div>

      {/* Dynamic Progress Indicator */}
      <div className="w-64 sm:w-72 mt-8 space-y-2 relative z-10">
        <div className="w-full bg-stone-800/80 h-1 rounded-full overflow-hidden border border-stone-700/40 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#0c7866] to-[#10b981] rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{statusText}</span>
          </span>
          <span className="tabular-nums font-semibold text-stone-300">{progress}%</span>
        </div>
      </div>

      {/* Footer Classification Notice */}
      <div className="absolute bottom-6 text-[10.5px] text-stone-500 font-mono tracking-wider uppercase">
        Secured Enterprise Protocol · Est. 30 May 2025
      </div>
    </div>
  )
}
