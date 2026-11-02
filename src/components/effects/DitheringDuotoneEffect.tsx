import React, { useEffect, useRef } from 'react'

interface DitheringDuotoneEffectProps {
  className?: string
  width?: number
  height?: number
  pixelSize?: number // e.g. 2 or 3 for retro pixel grain
  primaryColor?: [number, number, number] // e.g. [12, 120, 102] Emerald
  secondaryColor?: [number, number, number] // e.g. [247, 247, 245] Cream
  darkColor?: [number, number, number] // e.g. [17, 17, 17] Deep Obsidian
}

export const DitheringDuotoneEffect: React.FC<DitheringDuotoneEffectProps> = ({
  className = '',
  width = 320,
  height = 320,
  pixelSize = 3,
  primaryColor = [12, 120, 102], // #0c7866
  secondaryColor = [247, 247, 245], // #f7f7f5
  darkColor = [17, 17, 17] // #111111
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const frameId = useRef<number | null>(null)

  // 8x8 Bayer Matrix Normalized (0 to 63) / 64
  const bayer8x8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const lowW = Math.floor(width / pixelSize)
    const lowH = Math.floor(height / pixelSize)

    // Offscreen buffer for retro dither
    const offCanvas = document.createElement('canvas')
    offCanvas.width = lowW
    offCanvas.height = lowH
    const offCtx = offCanvas.getContext('2d')
    if (!offCtx) return

    const imgData = offCtx.createImageData(lowW, lowH)
    const data = imgData.data

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.targetX = (e.clientX - rect.left - width / 2) / (width / 2)
      mouseRef.current.targetY = (e.clientY - rect.top - height / 2) / (height / 2)
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0
      mouseRef.current.targetY = 0
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let angle = 0

    const render = () => {
      angle += 0.018
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      const rotX = mouseRef.current.y * 1.2
      const rotY = angle + mouseRef.current.x * 1.5

      // Light vector
      const lx = Math.sin(angle * 0.7) * 0.5
      const ly = -0.7
      const lz = 0.8
      const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz)
      const nlx = lx / lLen, nly = ly / lLen, nlz = lz / lLen

      const radius = lowW * 0.38
      const cx = lowW / 2
      const cy = lowH / 2

      // Render 3D geometric sphere with mathematical dithering
      for (let y = 0; y < lowH; y++) {
        for (let x = 0; x < lowW; x++) {
          const idx = (y * lowW + x) * 4
          const dx = x - cx
          const dy = y - cy
          const distSq = dx * dx + dy * dy

          if (distSq <= radius * radius) {
            const dz = Math.sqrt(radius * radius - distSq)

            // Normal vector
            let nx = dx / radius
            let ny = dy / radius
            let nz = dz / radius

            // 3D rotation
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
            const rx = nx * cosY + nz * sinY
            const rz = -nx * sinY + nz * cosY

            const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
            const ry = ny * cosX - rz * sinX
            const rz2 = ny * sinX + rz * cosX

            // Lambertian lighting + ambient
            const dotLight = Math.max(0, rx * nlx + ry * nly + rz2 * nlz)
            
            // Latitude ring texture bands
            const latBands = Math.sin(ry * 14 + angle * 3) * 0.12
            const intensity = Math.min(1, Math.max(0, 0.15 + dotLight * 0.85 + latBands))

            // Bayer 8x8 threshold
            const bVal = bayer8x8[y % 8][x % 8] / 64.0

            if (intensity > bVal) {
              // Highlight: Signature Emerald
              data[idx] = primaryColor[0]
              data[idx + 1] = primaryColor[1]
              data[idx + 2] = primaryColor[2]
              data[idx + 3] = 255
            } else if (intensity > bVal * 0.45) {
              // Midtone: Muted Teal
              data[idx] = Math.round((primaryColor[0] + darkColor[0]) / 2)
              data[idx + 1] = Math.round((primaryColor[1] + darkColor[1]) / 2)
              data[idx + 2] = Math.round((primaryColor[2] + darkColor[2]) / 2)
              data[idx + 3] = 240
            } else {
              // Shadow: Deep Charcoal
              data[idx] = darkColor[0]
              data[idx + 1] = darkColor[1]
              data[idx + 2] = darkColor[2]
              data[idx + 3] = 255
            }
          } else {
            // Background is transparent
            data[idx] = 0
            data[idx + 1] = 0
            data[idx + 2] = 0
            data[idx + 3] = 0
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0)

      // Upscale without blur to preserve crisp dither pixels
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(offCanvas, 0, 0, width, height)

      frameId.current = requestAnimationFrame(render)
    }

    frameId.current = requestAnimationFrame(render)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (frameId.current) cancelAnimationFrame(frameId.current)
    }
  }, [width, height, pixelSize, primaryColor, secondaryColor, darkColor])

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-xs cursor-crosshair ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
