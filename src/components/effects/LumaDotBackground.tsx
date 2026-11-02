import React, { useEffect, useRef } from 'react'

interface LumaDotBackgroundProps {
  className?: string
  dotSize?: number
  dotSpacing?: number
  dotColor?: string // e.g. '12, 120, 102'
  glowColor?: string // e.g. '56, 178, 172'
  mouseRadius?: number
  waveSpeed?: number
  waveFrequency?: number
}

export const LumaDotBackground: React.FC<LumaDotBackgroundProps> = ({
  className = '',
  dotSize = 1.6,
  dotSpacing = 32,
  dotColor = '12, 120, 102',
  glowColor = '56, 178, 172',
  mouseRadius = 160
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mousePos = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 })
  const animationFrameId = useRef<number | null>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    // Cap DPR to 1.5 to prevent massive GPU overhead on high-density displays
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const effectiveSpacing = window.innerWidth < 768 ? Math.max(dotSpacing, 38) : dotSpacing

    const handleResize = () => {
      if (!canvas.parentElement) return
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    // IntersectionObserver to pause rendering when Hero is scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting && !animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(render)
        } else if (!entry.isIntersecting && animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
          animationFrameId.current = null
        }
      },
      { threshold: 0.05 }
    )

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current.targetX = e.clientX - rect.left
      mousePos.current.targetY = e.clientY - rect.top
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect()
        mousePos.current.targetX = e.touches[0].clientX - rect.left
        mousePos.current.targetY = e.touches[0].clientY - rect.top
      }
    }

    const handleMouseLeave = () => {
      mousePos.current.targetX = -1000
      mousePos.current.targetY = -1000
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleMouseLeave, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    const render = () => {
      if (!isVisibleRef.current) {
        animationFrameId.current = null
        return
      }

      // Smooth mouse interpolation (spring feel)
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.12
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.12

      ctx.clearRect(0, 0, width, height)

      const cols = Math.ceil(width / effectiveSpacing) + 1
      const rows = Math.ceil(height / effectiveSpacing) + 1

      const mx = mousePos.current.x
      const my = mousePos.current.y
      const mouseRadiusSq = mouseRadius * mouseRadius

      // Batched draw calls for 10x higher performance:
      // Bucket 1: Base ambient dots (single fill call)
      ctx.beginPath()
      ctx.fillStyle = `rgba(${dotColor}, 0.22)`

      const highlightDots: Array<{ x: number; y: number; r: number; alpha: number }> = []

      for (let r = 0; r < rows; r++) {
        const y = r * effectiveSpacing
        for (let c = 0; c < cols; c++) {
          const x = c * effectiveSpacing

          // Mouse proximity calculation
          const dx = x - mx
          const dy = y - my
          const distSq = dx * dx + dy * dy

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq)
            const proximity = 1 - dist / mouseRadius
            const alpha = Math.min(0.25 + proximity * 0.75, 0.95)
            const rSize = dotSize + proximity * 1.6
            highlightDots.push({ x, y, r: rSize, alpha })
          } else {
            // Static/wave ambient dot
            ctx.moveTo(x + dotSize, y)
            ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          }
        }
      }
      ctx.fill()

      // Bucket 2: Cursor glow highlight dots (only near mouse, fast)
      if (highlightDots.length > 0) {
        for (const dot of highlightDots) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${glowColor}, ${dot.alpha})`
          ctx.fill()
        }
      }

      animationFrameId.current = requestAnimationFrame(render)
    }

    animationFrameId.current = requestAnimationFrame(render)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove)
      window.removeEventListener('touchend', handleMouseLeave)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [dotSize, dotSpacing, dotColor, glowColor, mouseRadius])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      style={{ opacity: 0.85 }}
    />
  )
}
