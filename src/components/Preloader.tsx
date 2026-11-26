import React, { useEffect, useState } from 'react'

interface PreloaderProps {
  onComplete?: () => void
}

/**
 * Signature UYFSR Opening Animation — "The Eclipse Curtain Reveal"
 * Replaces traditional loading spinners/progress bars with a fast, 60fps
 * solar eclipse corona alignment + architectural split-curtain reveal.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'ignite' | 'part' | 'done'>('enter')

  useEffect(() => {
    // Respect prefers-reduced-motion for instant accessibility
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setPhase('done')
      onComplete?.()
      return
    }

    // Phase 1: Eclipse totality & typographic emergence
    const tIgnite = window.setTimeout(() => {
      setPhase('ignite')
    }, 80)

    // Phase 2: Architectural split-curtain reveal
    const tPart = window.setTimeout(() => {
      setPhase('part')
      onComplete?.()
    }, 1150)

    // Phase 3: Clean unmount after curtains clear viewport
    const tDone = window.setTimeout(() => {
      setPhase('done')
    }, 1950)

    return () => {
      clearTimeout(tIgnite)
      clearTimeout(tPart)
      clearTimeout(tDone)
    }
  }, [onComplete])

  if (phase === 'done') return null

  const isParting = phase === 'part'
  const isIgnited = phase === 'ignite' || phase === 'part'

  return (
    <div
      role="presentation"
      onClick={() => {
        setPhase('part')
        onComplete?.()
        window.setTimeout(() => setPhase('done'), 700)
      }}
      className={`fixed inset-0 z-9999 select-none overflow-hidden ${
        isParting ? 'pointer-events-none' : 'cursor-pointer'
      }`}
    >
      {/* Top Architectural Velvet Curtain */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#080d0e] will-change-transform"
        style={{
          transform: isParting ? 'translate3d(0, -102%, 0)' : 'translate3d(0, 0, 0)',
          transition: 'transform 820ms cubic-bezier(0.77, 0, 0.175, 1)',
          borderBottom: isParting ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent'
        }}
      />

      {/* Bottom Architectural Velvet Curtain */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#080d0e] will-change-transform"
        style={{
          transform: isParting ? 'translate3d(0, 102%, 0)' : 'translate3d(0, 0, 0)',
          transition: 'transform 820ms cubic-bezier(0.77, 0, 0.175, 1)',
          borderTop: isParting ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent'
        }}
      />

      {/* Ambient Solar Corona Glow Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
        style={{
          opacity: isParting ? 0 : isIgnited ? 1 : 0,
          background:
            'radial-gradient(circle at 50% 44%, rgba(12,120,102,0.28) 0%, rgba(212,175,55,0.08) 24%, transparent 62%)'
        }}
      />

      {/* Centerpiece: Eclipse Geometry & Editorial Wordmark */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6"
        style={{
          opacity: isParting ? 0 : 1,
          transform: isParting ? 'scale(1.06)' : 'scale(1)',
          transition: 'opacity 420ms ease-out, transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Solar Eclipse Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-7">
          {/* Outer Astrolabe Precision Ring */}
          <svg
            viewBox="0 0 140 140"
            className="absolute inset-0 w-full h-full"
            style={{
              transform: isIgnited ? 'rotate(45deg) scale(1)' : 'rotate(0deg) scale(0.75)',
              opacity: isIgnited ? 0.65 : 0,
              transition: 'transform 1100ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out'
            }}
          >
            <circle
              cx="70"
              cy="70"
              r="64"
              fill="none"
              stroke="rgba(212,175,55,0.35)"
              strokeWidth="0.75"
              strokeDasharray="3 5"
            />
            <circle
              cx="70"
              cy="70"
              r="52"
              fill="none"
              stroke="rgba(16,185,129,0.45)"
              strokeWidth="0.9"
              strokeDasharray="48 18 14 22"
            />
          </svg>

          {/* Expanding Light Shockwave Ring */}
          <div
            className="absolute w-20 h-20 rounded-full border border-emerald-400/40 pointer-events-none"
            style={{
              transform: isIgnited ? 'scale(1.65)' : 'scale(0.8)',
              opacity: isIgnited ? 0 : 0.7,
              transition: 'transform 1050ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1050ms ease-out'
            }}
          />

          {/* Luminous Corona Disc */}
          <div
            className="w-[74px] h-[74px] sm:w-[82px] sm:h-[82px] rounded-full relative flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #0c7866 48%, #d4af37 100%)',
              boxShadow: isIgnited
                ? '0 0 42px rgba(16,185,129,0.55), 0 0 18px rgba(212,175,55,0.35)'
                : '0 0 0 rgba(16,185,129,0)',
              transform: isIgnited ? 'scale(1)' : 'scale(0.82)',
              transition: 'all 850ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Dark Eclipsing Lunar Core sliding into totality */}
            <div
              className="w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full bg-[#080d0e] flex items-center justify-center relative"
              style={{
                transform: isIgnited ? 'translate3d(0px, 0px, 0)' : 'translate3d(14px, -10px, 0)',
                transition: 'transform 950ms cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <span
                className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight"
                style={{
                  opacity: isIgnited ? 1 : 0,
                  transform: isIgnited ? 'scale(1)' : 'scale(0.8)',
                  transition: 'opacity 600ms ease-out 220ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 220ms'
                }}
              >
                U
              </span>
            </div>

            {/* Diamond-Ring Solar Flare Sparkle at Top-Right Limb */}
            <div
              className="absolute -top-0.5 right-1 w-2.5 h-2.5 rounded-full bg-white"
              style={{
                boxShadow: '0 0 14px 4px rgba(255,255,255,0.9), 0 0 28px 8px rgba(52,211,153,0.75)',
                opacity: isIgnited ? 1 : 0,
                transform: isIgnited ? 'scale(1)' : 'scale(0)',
                transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1) 260ms'
              }}
            />
          </div>
        </div>

        {/* Editorial Serif Wordmark with Cinematic Tracking Compression */}
        <h1
          className="font-serif text-3xl sm:text-4xl font-semibold text-white uppercase"
          style={{
            letterSpacing: isIgnited ? '0.26em' : '0.62em',
            opacity: isIgnited ? 1 : 0,
            transform: isIgnited ? 'translate3d(0, 0, 0)' : 'translate3d(0, 10px, 0)',
            transition: 'letter-spacing 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms ease-out, transform 750ms ease-out',
            paddingLeft: '0.26em'
          }}
        >
          UYFSR
        </h1>

        {/* Hairline Emerald-Gold Horizon Rule Drawing Outward */}
        <div className="w-56 sm:w-72 h-px my-3.5 overflow-hidden relative">
          <div
            className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            style={{
              transform: isIgnited ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 180ms'
            }}
          />
        </div>

        {/* Subtitle Tagline */}
        <p
          className="text-[10.5px] sm:text-[11.5px] text-stone-300/85 tracking-[0.22em] uppercase text-center font-medium"
          style={{
            opacity: isIgnited ? 1 : 0,
            transform: isIgnited ? 'translate3d(0, 0, 0)' : 'translate3d(0, 6px, 0)',
            transition: 'opacity 650ms ease-out 280ms, transform 650ms ease-out 280ms'
          }}
        >
          United Youth Forum of Science &amp; Research · Est. 2025
        </p>
      </div>
    </div>
  )
}
