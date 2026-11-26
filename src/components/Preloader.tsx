import React, { useEffect, useState, useRef, useCallback } from 'react'

interface PreloaderProps {
  onComplete?: () => void
}

/**
 * Editorial Swiss Preloader — Inspired by Awwwards Site-of-the-Day & Contemporary Editorial Studios
 * 
 * Replaces cheesy sci-fi orbital rings with:
 * - Stark, high-contrast editorial typography
 * - Rapid, silky monospace percentage counter (00% -> 100% in ~700ms)
 * - Razor-thin 1px precision hairline progress rule
 * - Single-sheet upward curtain wipe with weighted cubic-bezier physics
 * - Instant skip via click, tap, or Escape key
 */
export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const handleFinish = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setProgress(100)
    setIsExiting(true)
    onComplete?.()

    // Unmount after the upward curtain glide finishes
    window.setTimeout(() => {
      setIsDone(true)
    }, 700)
  }, [onComplete])

  useEffect(() => {
    // Accessibility check
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setIsDone(true)
      onComplete?.()
      return
    }

    const DURATION = 750 // 750ms fast, responsive, zero user fatigue

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const rawRatio = Math.min(elapsed / DURATION, 1)

      // Snappy cubic ease-out for realistic loading counter progression
      const ease = 1 - Math.pow(1 - rawRatio, 3)
      const currentPct = Math.round(ease * 100)
      setProgress(currentPct)

      if (rawRatio < 1) {
        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        // Hold at 100% for 80ms then glide away
        window.setTimeout(() => {
          handleFinish()
        }, 80)
      }
    }

    animFrameRef.current = requestAnimationFrame(tick)

    // Keyboard listener to skip
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleFinish, onComplete])

  if (isDone) return null

  // Format progress as 3-digit tabular mono string: 000 -> 100
  const formattedCount = String(progress).padStart(3, '0')

  return (
    <div
      role="presentation"
      onClick={handleFinish}
      className="fixed inset-0 z-[99999] select-none cursor-pointer flex flex-col justify-between p-6 sm:p-10 will-change-transform"
      style={{
        backgroundColor: '#070a0b',
        transform: isExiting ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)',
        transition: 'transform 650ms cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: isExiting ? 'none' : 'auto'
      }}
    >
      {/* Top Header Strip: Editorial Meta Data */}
      <header
        className="w-full flex items-center justify-between text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase transition-opacity duration-300"
        style={{ opacity: isExiting ? 0 : 1 }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>UYFSR • RESEARCH FORUM</span>
        </div>
        <div className="hidden sm:block text-neutral-500">
          <span>EST. 2025 • DHAKA</span>
        </div>
      </header>

      {/* Centerpiece: Pure Typographic Grandeur (Anti-Slop) */}
      <div
        className="my-auto w-full max-w-4xl mx-auto flex flex-col items-center text-center transition-all duration-300"
        style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'translate3d(0, -18px, 0)' : 'translate3d(0, 0, 0)'
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] tracking-[0.25em] font-mono uppercase text-emerald-300/90 mb-5">
          <span>Official Portal</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light tracking-tight text-white leading-none">
          UYFSR
        </h1>

        <p className="mt-4 text-xs sm:text-sm font-sans tracking-[0.22em] text-neutral-300 uppercase font-medium max-w-md">
          United Youth Forum of Science and Research
        </p>

        {/* Precision Hairline Progress Rule */}
        <div className="w-full max-w-xs mt-8 sm:mt-10">
          <div className="w-full h-[1.5px] bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-[width] duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Numerical Counter */}
          <div className="flex items-center justify-between mt-3 text-[11px] font-mono tracking-widest text-neutral-400">
            <span className="text-neutral-500 text-[10px] uppercase">INDEXING ARCHIVE</span>
            <span className="text-white font-medium">{formattedCount}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Strip: Skip Prompt & Copyright */}
      <footer
        className="w-full flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase transition-opacity duration-300"
        style={{ opacity: isExiting ? 0 : 1 }}
      >
        <span className="text-neutral-400">CLICK ANYWHERE OR ESC TO SKIP</span>
        <span>ACADEMIC FOUNDATION</span>
      </footer>
    </div>
  )
}
