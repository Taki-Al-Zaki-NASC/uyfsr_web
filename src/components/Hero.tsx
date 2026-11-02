import React, { useState, useEffect, useRef } from 'react'
import { LumaDotBackground } from './effects/LumaDotBackground'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  onOpenJoin: () => void
}

const AnimatedNumber: React.FC<{ target: number; suffix?: string; decimals?: number }> = ({
  target,
  suffix = '',
  decimals = 0
}) => {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1400
          const start = performance.now()

          const step = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out expo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setVal(ease * target)

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setVal(target)
            }
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export const Hero: React.FC<HeroProps> = ({ onOpenJoin }) => {
  return (
    <section id="about" className="pt-8 sm:pt-10 pb-14 sm:pb-20 bg-[#f7f7f5] relative overflow-hidden">
      {/* Interactive Luma-Dot Background Grid (60 FPS, Mouse-Reactive) */}
      <LumaDotBackground dotSpacing={32} dotSize={1.7} mouseRadius={180} />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-left relative z-10">
        
        {/* Dominant Focal Statement & Manifesto Deck */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h1 className="display-title text-[#111111] max-w-4xl mb-4 sm:mb-5">
            Science, research, and reform by youth.
          </h1>

          <p className="lead-text max-w-[65ch] text-[#2b2b28] text-[16.5px] sm:text-[19.5px] leading-relaxed mb-6 sm:mb-8">
            Welcome to the official page of UYFSR — United Youth Forum of Science and Research, established 30 May 2025. Where young minds unite to ignite change through science and reform. We turn ideas into action, dreams into movements, and passion into progress. Join us in shaping a smarter, stronger, and sustainable tomorrow.
          </p>

          {/* Action Controls with Micro-Interactions */}
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenJoin}
              className="w-full sm:w-auto justify-center px-6 py-3.5 bg-[#111111] hover:bg-[#0c7866] text-white text-[15px] sm:text-[15.5px] font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer rounded-xs shadow-xs inline-flex items-center gap-2 group"
            >
              <span>Register for 2026 programs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Featured Archival Showcase Image (Exact placement as in 2nd image) */}
        <div data-reveal className="mb-10 sm:mb-12">
          <div className="relative w-full overflow-hidden rounded-xs border border-[#dcdcd8] bg-[#ecece9] shadow-sm">
            <img
              src="/images/hero-science-eclipse.jpg"
              alt="Archival Plate: Student researchers and young innovators engaged in empirical field experimentation"
              className="w-full h-[260px] xs:h-[300px] sm:h-[440px] md:h-[500px] lg:h-[540px] object-cover object-[center_28%]"
            />
          </div>

          {/* Archival Plate Caption & Metadata Strip */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-[11.5px] sm:text-[13px] text-[#2b2b28]/70 border-b border-[#dcdcd8] pb-3.5 leading-relaxed">
            <div>
              Archival Plate: Student researchers and young innovators engaged in empirical field experimentation.
            </div>
            <div className="text-left sm:text-right">
              United Youth Forum of Science and Research Archives. Dhaka
            </div>
          </div>
        </div>

        {/* Institutional Register of Record (Refined Micro-Interaction with Smooth Elevation & Top Accent Bar) */}
        <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          
          <div className="group relative overflow-hidden bg-white/70 hover:bg-white p-4.5 border border-[#e5e5e0] hover:border-[#0c7866]/40 rounded-xs shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            {/* Top Green Accent Glide Indicator */}
            <div className="absolute top-0 left-0 w-0 h-[2.5px] bg-[#0c7866] group-hover:w-full transition-all duration-500 ease-out" />
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] group-hover:text-[#0c7866] group-hover:translate-x-1 transition-all duration-300 tabular-nums inline-block">
              30 May 2025
            </div>
            <div className="text-[14.5px] text-[#2b2b28] mt-1 font-semibold group-hover:text-[#111111] transition-colors">
              Established foundation date
            </div>
            <div className="text-[13px] text-[#2b2b28]/80 mt-0.5 group-hover:text-[#2b2b28] transition-colors">
              Central Council charter established
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 hover:bg-white p-4.5 border border-[#e5e5e0] hover:border-[#0c7866]/40 rounded-xs shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            {/* Top Green Accent Glide Indicator */}
            <div className="absolute top-0 left-0 w-0 h-[2.5px] bg-[#0c7866] group-hover:w-full transition-all duration-500 ease-out" />
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] group-hover:text-[#0c7866] group-hover:translate-x-1 transition-all duration-300 tabular-nums inline-block">
              <AnimatedNumber target={2.6} decimals={1} suffix="K+" />
            </div>
            <div className="text-[14.5px] text-[#2b2b28] mt-1 font-semibold group-hover:text-[#111111] transition-colors">
              Students guided in research
            </div>
            <div className="text-[13px] text-[#2b2b28]/80 mt-0.5 group-hover:text-[#2b2b28] transition-colors">
              School & college cohorts nationwide
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 hover:bg-white p-4.5 border border-[#e5e5e0] hover:border-[#0c7866]/40 rounded-xs shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            {/* Top Green Accent Glide Indicator */}
            <div className="absolute top-0 left-0 w-0 h-[2.5px] bg-[#0c7866] group-hover:w-full transition-all duration-500 ease-out" />
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] group-hover:text-[#0c7866] group-hover:translate-x-1 transition-all duration-300 tabular-nums inline-block">
              <AnimatedNumber target={14} suffix="" />
            </div>
            <div className="text-[14.5px] text-[#2b2b28] mt-1 font-semibold group-hover:text-[#111111] transition-colors">
              Competition categories
            </div>
            <div className="text-[13px] text-[#2b2b28]/80 mt-0.5 group-hover:text-[#2b2b28] transition-colors">
              National Science Eclipse disciplines
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 hover:bg-white p-4.5 border border-[#e5e5e0] hover:border-[#0c7866]/40 rounded-xs shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
            {/* Top Green Accent Glide Indicator */}
            <div className="absolute top-0 left-0 w-0 h-[2.5px] bg-[#0c7866] group-hover:w-full transition-all duration-500 ease-out" />
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] group-hover:text-[#0c7866] group-hover:translate-x-1 transition-all duration-300 tabular-nums inline-block">
              <AnimatedNumber target={11} suffix="" />
            </div>
            <div className="text-[14.5px] text-[#2b2b28] mt-1 font-semibold group-hover:text-[#111111] transition-colors">
              Institutional alliances
            </div>
            <div className="text-[13px] text-[#2b2b28]/80 mt-0.5 group-hover:text-[#2b2b28] transition-colors">
              TWIMBOL, KIDLON & media partners
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
