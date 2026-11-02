import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Mail,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
  LayoutGrid,
  Layers,
  Pause
} from 'lucide-react'
import { sounds } from '../lib/audio'

interface Leader {
  name: string
  rankTier: 'Executive Council' | 'Advisors' | 'Secretariat'
  title: string
  department: string
  bio: string
  image: string
  facebookUrl?: string
  email?: string
}

const leaders: Leader[] = [
  // Executive Council Leadership
  {
    name: "Mustafiz Bin Jihad",
    rankTier: "Executive Council",
    title: "Chief Executive Officer (CEO)",
    department: "Executive Council & Strategic Vision",
    bio: "Founding leadership directing national youth scientific exploration, central institutional alliances, policy strategy, and nationwide research initiatives across Bangladesh.",
    image: "/images/executives/mustafiz-bin-jihad-ceo.jpeg",
    facebookUrl: "https://www.facebook.com/share/1J6Aei7Kqf/",
    email: "mostafizbinjihad@gmail.com"
  },
  {
    name: "Fahim Samiul Islam",
    rankTier: "Executive Council",
    title: "Deputy Chief Executive Officer (DCEO)",
    department: "Executive Directorate & Program Operations",
    bio: "Assisting executive leadership in organizational governance, nationwide youth program coordination, institutional strategy, and council development.",
    image: "/images/executives/fahim-samiul-islam-dceo.jpeg",
    facebookUrl: "https://www.facebook.com/fahimsamiul.Islam.568/",
    email: "samiulislamfahim8@gmail.com"
  },
  {
    name: "Shahriar Mejba",
    rankTier: "Executive Council",
    title: "Chief Operating Officer (COO)",
    department: "Operations & Council Governance",
    bio: "Directing organizational operations, operational workflows, national event execution, field chapter coordination, and logistics governance.",
    image: "/images/executives/shahriar-mejba-coo.jpeg",
    facebookUrl: "https://www.facebook.com/share/1E5uVz1e3v/",
    email: "mejbaacps2007@gmail.com"
  },
  {
    name: "Soyaib Islam",
    rankTier: "Executive Council",
    title: "Chief Research Officer (CRO)",
    department: "Research Strategy & Scientific Development",
    bio: "Directing research methodologies, academic publications, research clinics, and scientific curriculum standards for youth cohorts across Bangladesh.",
    image: "/images/executives/soyaib-islam-cro.jpeg",
    facebookUrl: "https://www.facebook.com/share/1DTfy9EwFd/",
    email: "soyaib248@gmail.com"
  },
  {
    name: "Dalia Sultana Joty",
    rankTier: "Executive Council",
    title: "Chief Management Officer (CMO)",
    department: "Management & Institutional Coordination",
    bio: "Stewarding comprehensive management operations, internal administration, institutional partnerships, and executive secretariat coordination.",
    image: "/images/executives/dalia-sultana-joty-cmo.jpeg",
    facebookUrl: "https://www.facebook.com/dalia.joty",
    email: "daliajoty@gmail.com"
  },
  {
    name: "Jarin Tasnim",
    rankTier: "Executive Council",
    title: "Chief Management Officer (CMO)",
    department: "Management Operations & Public Affairs",
    bio: "Directing organizational management workflows, inter-institutional communications, event logistics, and youth cohort engagement.",
    image: "/images/executives/jarin-tasnim-cmo.jpeg",
    facebookUrl: "https://www.facebook.com/share/1Hs9Ffvgxd/",
    email: "parkjarinot7@gmail.com"
  },
  {
    name: "Md Nabil Tahmid",
    rankTier: "Executive Council",
    title: "Chief Human Resources Officer (CHRO)",
    department: "Human Resources & Talent Development",
    bio: "Leading human capital management, leadership talent development, nationwide member recruitment, and organizational community welfare.",
    image: "/images/executives/md-nabil-tahmid-chro.jpeg",
    facebookUrl: "https://www.facebook.com/share/1E6jW8D1Vd/",
    email: "hassantahmid312@gmail.com"
  },
  {
    name: "Shahriyar Tashkir",
    rankTier: "Executive Council",
    title: "Chief Technology Officer (CTO)",
    department: "Technology & Digital Infrastructure",
    bio: "Spearheading digital systems architecture, technological platforms, portal engineering, scientific computing frameworks, and computational research tools.",
    image: "/images/executives/shahriyar-tashkir-cto.jpg",
    facebookUrl: "https://www.facebook.com/share/1b6Xuh2wGZ/",
    email: "tashkir2006@gmail.com"
  },

  // Advisory Board
  {
    name: "Khaled Saifullah Rohan",
    rankTier: "Advisors",
    title: "Adviser",
    department: "Advisory Board & Strategic Guidance",
    bio: "Providing institutional governance, strategic advisory, policy mentorship, and organizational leadership for nationwide youth science programs.",
    image: "/images/executives/khaled-saifullah-rohan-adviser.jpeg",
    facebookUrl: "https://www.facebook.com/share/1FGbriwzQb/",
    email: "rohan232619@gmail.com"
  },
  {
    name: "Oasimul Rafin",
    rankTier: "Advisors",
    title: "Adviser",
    department: "Advisory Board & Academic Oversight",
    bio: "Providing strategic mentorship, academic guidance, and institutional governance for national youth research and innovation initiatives.",
    image: "/images/executives/oasimul-rafin-adviser.jpeg",
    facebookUrl: "https://www.facebook.com/uyfsr",
    email: "uyfsr.org@gmail.com"
  },

  // Secretariat
  {
    name: "Taki Al Zaki",
    rankTier: "Secretariat",
    title: "Secretary of Technology",
    department: "Technology & Digital Systems",
    bio: "Overseeing technological implementations, web engineering, system integrations, and digital operations for research cohorts and events.",
    image: "/images/executives/taki-al-zaki-secretary-of-technology.jpg",
    facebookUrl: "https://www.facebook.com/uyfsr",
    email: "ktahan629@gmail.com"
  }
]

function getLeaderImageStyle(name: string): React.CSSProperties {
  if (name.includes('Dalia')) {
    return { objectPosition: 'center 80%' }
  }
  if (name.includes('Mejba')) {
    return { objectPosition: 'center 18%' }
  }
  if (name.includes('Fahim')) {
    return { objectPosition: 'center 15%' }
  }
  if (name.includes('Rafin')) {
    return { objectPosition: 'center 20%', transform: 'scale(1.25)', transformOrigin: 'center 20%' }
  }
  if (name.includes('Jarin')) {
    return { objectPosition: 'center 25%' }
  }
  if (name.includes('Nabil')) {
    return { objectPosition: 'center 15%' }
  }
  if (name.includes('Rohan')) {
    return { objectPosition: 'center 15%' }
  }
  if (name.includes('Taki')) {
    return { objectPosition: 'center 15%' }
  }
  return { objectPosition: 'center top' }
}

export const AboutUs: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('All')
  const [query, setQuery] = useState<string>('')
  const [viewFormat, setViewFormat] = useState<'showcase' | 'grid'>('showcase')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [translateX, setTranslateX] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelAccumulator = useRef<number>(0)
  const lastWheelStepTime = useRef<number>(0)
  const pauseTimerRef = useRef<number | null>(null)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const tiers = ['All', 'Executive Council', 'Advisors', 'Secretariat']

  const filteredLeaders = leaders.filter((l) => {
    const matchesTier = selectedTier === 'All' || l.rankTier === selectedTier
    const matchesQuery =
      query.trim() === '' ||
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.department.toLowerCase().includes(query.toLowerCase())
    return matchesTier && matchesQuery
  })

  // Keep currentIndex bounded when filter changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedTier, query])

  // Calculate translateX based on current active card index
  const updateTrackPosition = useCallback((index: number) => {
    if (!trackRef.current || !containerRef.current) return
    const cards = trackRef.current.children
    if (cards.length > index && cards[index]) {
      const cardEl = cards[index] as HTMLElement
      const containerEl = containerRef.current
      const maxTranslate = Math.max(0, trackRef.current.scrollWidth - containerEl.clientWidth)
      
      const paddingLeft = window.innerWidth >= 640 ? 48 : 24
      const targetOffset = cardEl.offsetLeft - paddingLeft
      const clampedOffset = Math.max(0, Math.min(targetOffset, maxTranslate))
      
      setTranslateX(clampedOffset)
    }
  }, [])

  useEffect(() => {
    updateTrackPosition(currentIndex)
  }, [currentIndex, updateTrackPosition, filteredLeaders.length])

  useEffect(() => {
    const handleResize = () => updateTrackPosition(currentIndex)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, updateTrackPosition])

  // Temporarily pause auto-slide for 3.5s after manual user scroll/interaction
  const triggerUserInteractionPause = useCallback(() => {
    setIsPaused(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = window.setTimeout(() => {
      setIsPaused(false)
    }, 3500)
  }, [])

  // Auto-slide effect: smoothly advances every 3.2 seconds
  useEffect(() => {
    if (viewFormat !== 'showcase' || isPaused || filteredLeaders.length <= 1) return

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= filteredLeaders.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 3200)

    return () => window.clearInterval(interval)
  }, [viewFormat, isPaused, filteredLeaders.length])

  // Scroll and Slide Direct Connection:
  // - When the user scrolls down the page and enters #leadership:
  // - Down-scroll advances card-by-card horizontally.
  // - The user CANNOT bypass or scroll past the section until all 11 cards have been viewed!
  // - Once the last card is reached, further down-scroll naturally continues down to #faq.
  // - Up-scroll from below rewinds card-by-card back to card 1 before continuing up the page.
  useEffect(() => {
    if (viewFormat !== 'showcase') return

    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || filteredLeaders.length <= 1) return

      const rect = sectionRef.current.getBoundingClientRect()
      const navbarHeight = 72

      // Active zone: section is currently in the reading viewport
      const inZone = rect.top <= navbarHeight + 80 && rect.bottom >= 180

      if (!inZone) return

      const maxIndex = filteredLeaders.length - 1
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

      if (delta > 0) {
        // User scrolling down / forward:
        if (currentIndex < maxIndex) {
          e.preventDefault()
          triggerUserInteractionPause()

          const now = Date.now()
          wheelAccumulator.current += delta
          if (wheelAccumulator.current >= 20 && now - lastWheelStepTime.current > 160) {
            sounds.playClick()
            setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
            lastWheelStepTime.current = now
            wheelAccumulator.current = 0
          }
        } else {
          // At the last card! Lock is released, user can scroll down to FAQ
          wheelAccumulator.current = 0
        }
      } else if (delta < 0) {
        // User scrolling up / backward:
        if (currentIndex > 0) {
          e.preventDefault()
          triggerUserInteractionPause()

          const now = Date.now()
          wheelAccumulator.current += delta
          if (wheelAccumulator.current <= -20 && now - lastWheelStepTime.current > 160) {
            sounds.playClick()
            setCurrentIndex((prev) => Math.max(0, prev - 1))
            lastWheelStepTime.current = now
            wheelAccumulator.current = 0
          }
        } else {
          // Back at the first card! Lock is released, user can scroll up
          wheelAccumulator.current = 0
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [viewFormat, currentIndex, filteredLeaders.length, triggerUserInteractionPause])

  // Mobile Touch Swiping (with intentional angle detection to preserve smooth vertical scroll)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    triggerUserInteractionPause()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX
    const deltaY = touchStartY.current - e.changedTouches[0].clientY
    const maxIndex = filteredLeaders.length - 1

    // Only swipe cards if user gesture is predominantly horizontal, never intercept natural vertical scroll!
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      sounds.playClick()
      if (deltaX > 0 && currentIndex < maxIndex) {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
      } else if (deltaX < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
      }
    }
  }

  // Navigation handlers
  const goToNext = () => {
    sounds.playClick()
    triggerUserInteractionPause()
    setCurrentIndex((prev) => Math.min(filteredLeaders.length - 1, prev + 1))
  }

  const goToPrev = () => {
    sounds.playClick()
    triggerUserInteractionPause()
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToIndex = (idx: number) => {
    sounds.playClick()
    triggerUserInteractionPause()
    setCurrentIndex(Math.max(0, Math.min(filteredLeaders.length - 1, idx)))
  }

  return (
    <section
      id="leadership"
      ref={sectionRef}
      className="relative bg-[#f7f7f5] text-left transition-colors duration-300 border-b border-[#e2e2dc] py-8 sm:py-10 overflow-hidden scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Background Watermark Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Header Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 mb-4 sm:mb-5">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#dcdcd8] pb-3">
          <div>
            <h2 className="section-title text-[#111111] text-xl sm:text-2xl md:text-3xl leading-tight">
              Leadership and governance
            </h2>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-[#ecece9] border border-[#dcdcd8] rounded-xs shadow-2xs self-start md:self-auto">
            <button
              onClick={() => {
                sounds.playClick()
                setViewFormat('showcase')
              }}
              className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                viewFormat === 'showcase'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#666660] hover:text-[#111111]'
              }`}
              title="Horizontal interactive slider"
            >
              <Layers className="w-3 h-3 text-[#0c7866]" />
              <span>Showcase Slider</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick()
                setViewFormat('grid')
              }}
              className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                viewFormat === 'grid'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#666660] hover:text-[#111111]'
              }`}
              title="Classic multi-column grid layout"
            >
              <LayoutGrid className="w-3 h-3 text-[#0c7866]" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {tiers.map((tier) => {
              const count =
                tier === 'All'
                  ? leaders.length
                  : leaders.filter((l) => l.rankTier === tier).length
              const isSelected = selectedTier === tier
              return (
                <button
                  key={tier}
                  onClick={() => {
                    sounds.playClick()
                    setSelectedTier(tier)
                  }}
                  className={`px-2.5 py-0.5 text-[11.5px] font-medium transition-all cursor-pointer rounded-xs flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-[#ecece9] text-[#2b2b28] hover:bg-white hover:text-[#111111] border border-[#dcdcd8]'
                  }`}
                >
                  <span>{tier === 'All' ? 'All Council' : tier}</span>
                  <span
                    className={`text-[10px] px-1.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#dcdcd8] text-[#555550]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Search */}
          <div className="w-full sm:w-56 relative">
            <Search className="w-3 h-3 text-[#666660] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter officer, role, dept..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-7 pr-2.5 py-0.5 bg-[#ecece9] focus:bg-white border border-[#dcdcd8] text-[#111111] text-[11.5px] rounded-xs focus:outline-none focus:border-[#0c7866] transition-colors"
            />
          </div>
        </div>
      </div>

      {viewFormat === 'showcase' ? (
        /* ======================================================================
           INTERACTIVE HORIZONTAL SLIDER WITH AUTO-SLIDE & SCROLL CONNECTION
           - Fits 100% cleanly in view without clipping cards!
           - Zero overlapping, generous gap between cards.
           - Automatic smooth progression every 3.2 seconds.
           - Direct wheel scroll connection: cannot bypass section until all cards viewed!
           ====================================================================== */
        <div className="relative w-full">
          {/* Left & Right Soft Fade Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#f7f7f5] to-transparent z-30" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#f7f7f5] to-transparent z-30" />

          {/* Cards Track Container */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden select-none touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex gap-7 sm:gap-8 items-stretch transition-transform duration-500 ease-out pl-6 sm:pl-10 md:pl-14 pr-10 sm:pr-20 py-2"
              style={{
                transform: `translate3d(-${translateX}px, 0, 0)`
              }}
            >
              {filteredLeaders.map((leader, idx) => {
                const isActive = idx === currentIndex
                const leaderIndexStr = String(idx + 1).padStart(2, '0')
                const totalLeadersStr = String(filteredLeaders.length).padStart(2, '0')

                return (
                  <div
                    key={leader.name}
                    className={`relative bg-[#ecece9] hover:bg-white p-4 sm:p-5 flex flex-col justify-between rounded-xs border transition-all duration-300 cursor-default shrink-0 select-text ${
                      isActive
                        ? 'border-[#0c7866] bg-white shadow-xl ring-2 ring-[#0c7866]/30'
                        : 'border-[#e2e2dc] hover:border-[#0c7866] shadow-2xs hover:shadow-lg'
                    }`}
                    style={{
                      width: 'min(82vw, 320px)'
                    }}
                  >
                    {/* Top Green Accent Bar */}
                    <div
                      className={`absolute top-0 left-0 h-[3px] bg-[#0c7866] transition-all duration-500 ease-out z-20 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />

                    <div>
                      {/* High-Resolution Portrait */}
                      <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-[#f7f7f5] mb-3.5 rounded-xs shadow-inner">
                        <img
                          src={leader.image}
                          alt={`${leader.name}, ${leader.title}`}
                          loading="eager"
                          decoding="async"
                          style={getLeaderImageStyle(leader.name)}
                          className="w-full h-full object-cover filter grayscale contrast-[105%] group-hover:grayscale-0 hover:grayscale-0 transition-all duration-700 ease-out"
                        />

                        {/* Social Buttons (Facebook & Email) */}
                        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                          <a
                            href={leader.facebookUrl || 'https://facebook.com/uyfsr'}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${leader.name} Facebook Profile`}
                            className="w-7 h-7 bg-[#111111]/90 hover:bg-[#0c7866] hover:scale-110 text-white flex items-center justify-center transition-all shadow-md cursor-pointer rounded-xs backdrop-blur-xs"
                            title="Facebook Profile"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>

                          <a
                            href={`mailto:${leader.email || 'uyfsr.org@gmail.com'}`}
                            aria-label={`Email ${leader.name}`}
                            className="w-7 h-7 bg-[#111111]/90 hover:bg-[#0c7866] hover:scale-110 text-white flex items-center justify-center transition-all shadow-md cursor-pointer rounded-xs backdrop-blur-xs"
                            title="Official Email"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="w-3.5 h-3.5 text-white" />
                          </a>
                        </div>

                        {/* Officer Index Counter */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#111111]/85 backdrop-blur-xs text-white text-[10px] font-mono tracking-wider rounded-xs">
                          {leaderIndexStr} / {totalLeadersStr}
                        </div>
                      </div>

                      {/* Officer Name */}
                      <h3 className="font-serif text-base sm:text-lg font-medium text-[#111111] hover:text-[#0c7866] transition-colors duration-300 leading-snug mb-0.5">
                        {leader.name}
                      </h3>

                      {/* Official Title */}
                      <div className="text-[12.5px] sm:text-[13px] font-semibold text-[#0c7866] mb-0.5">
                        {leader.title}
                      </div>

                      {/* Department */}
                      <div className="text-[11px] sm:text-[11.5px] text-[#555550] mb-2 leading-tight">
                        {leader.department}
                      </div>

                      {/* Bio */}
                      <p className="text-[12px] sm:text-[12.5px] text-[#2b2b28] leading-relaxed line-clamp-3 mb-2">
                        {leader.bio}
                      </p>
                    </div>

                    {/* Card Footer Metadata */}
                    <div className="mt-2.5 pt-2 border-t border-[#dcdcd8] flex items-center justify-between text-[11px] text-[#666660]">
                      <span className="font-semibold text-[#0c7866]">
                        {leader.rankTier}
                      </span>
                      <span className="text-[10px] opacity-75">
                        UYFSR Council
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Completion Card at the end of directory */}
              <div
                className="group relative overflow-hidden bg-white/90 hover:bg-white flex flex-col justify-center items-center text-center p-6 rounded-xs border-2 border-dashed border-[#0c7866]/40 shadow-xs shrink-0"
                style={{
                  width: 'min(76vw, 280px)'
                }}
              >
                <div className="w-10 h-10 rounded-full bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-medium text-[#111111] mb-1">
                  All Officers Explored
                </h4>
                <p className="text-[11.5px] text-[#666660] leading-relaxed mb-3.5">
                  You have reviewed all {filteredLeaders.length} appointed officers. Continue scrolling down to explore FAQs.
                </p>
                <a
                  href="#faq"
                  className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#0c7866] text-white text-[12px] font-medium rounded-xs transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore FAQs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Dock / Interactive Control Bar */}
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#dcdcd8]">
              
              {/* Left: Auto-Slide Status and Progress */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Auto-Slide Indicator Pill */}
                <button
                  onClick={() => {
                    sounds.playClick()
                    setIsPaused((prev) => !prev)
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ecece9] hover:bg-white border border-[#dcdcd8] text-[11px] font-medium text-[#2b2b28] transition-colors cursor-pointer"
                  title={isPaused ? "Click to resume auto-slide" : "Click to pause auto-slide"}
                >
                  {isPaused ? (
                    <>
                      <Pause className="w-2.5 h-2.5 text-[#f59e0b]" />
                      <span>Paused</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#0c7866] animate-pulse" />
                      <span>Auto-Sliding</span>
                    </>
                  )}
                </button>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 flex-1 sm:w-40">
                  <div className="flex-1 h-1 bg-[#dcdcd8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0c7866] transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.round(((currentIndex + 1) / filteredLeaders.length) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#555550] shrink-0">
                    {String(currentIndex + 1).padStart(2, '0')}/{String(filteredLeaders.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Middle: Active Officer Name (Desktop only) */}
              <div className="hidden md:flex items-center gap-2 text-[12px] text-[#2b2b28]">
                <span className="font-semibold text-[#0c7866]">
                  {filteredLeaders[currentIndex]?.name}
                </span>
                <span className="text-[#888880]">•</span>
                <span className="text-[#555550]">
                  {filteredLeaders[currentIndex]?.title}
                </span>
              </div>

              {/* Right: Scroll Hint & Navigation Buttons */}
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-[#888880] hidden lg:inline">
                  Scroll down wheel to advance →
                </span>

                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="p-1.5 bg-white hover:bg-[#111111] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#dcdcd8] text-[#111111] rounded-xs transition-colors shadow-2xs cursor-pointer"
                  title="Previous Officer"
                  aria-label="Previous Officer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={currentIndex >= filteredLeaders.length - 1}
                  className="p-1.5 bg-white hover:bg-[#111111] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-[#dcdcd8] text-[#111111] rounded-xs transition-colors shadow-2xs cursor-pointer"
                  title="Next Officer"
                  aria-label="Next Officer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Pagination Dots for Quick Jump */}
            <div className="flex items-center justify-center gap-1.5 mt-3.5">
              {filteredLeaders.map((leader, dotIdx) => (
                <button
                  key={leader.name}
                  onClick={() => goToIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentIndex
                      ? 'w-5 bg-[#0c7866]'
                      : 'w-1.5 bg-[#dcdcd8] hover:bg-[#888880]'
                  }`}
                  title={`Jump to ${leader.name}`}
                  aria-label={`Jump to ${leader.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================================
           ALTERNATIVE VIEW MODE: CLASSIC MULTI-COLUMN GRID
           ====================================================================== */
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLeaders.map((leader, idx) => (
              <div
                key={leader.name}
                data-reveal
                data-delay={`${(idx % 3) * 80}`}
                className="group relative overflow-hidden bg-[#ecece9] hover:bg-white p-6 sm:p-7 flex flex-col justify-between rounded-xs border border-[#e2e2dc] hover:border-[#0c7866] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-default"
              >
                <div className="absolute top-0 left-0 w-0 h-[3px] bg-[#0c7866] group-hover:w-full transition-all duration-500 ease-out" />

                <div>
                  <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#f7f7f5] mb-5 rounded-xs shadow-inner">
                    <img
                      src={leader.image}
                      alt={`${leader.name}, ${leader.title}`}
                      loading="eager"
                      decoding="async"
                      style={getLeaderImageStyle(leader.name)}
                      className="w-full h-full object-cover filter grayscale contrast-[105%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />

                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <a
                        href={leader.facebookUrl || 'https://facebook.com/uyfsr'}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${leader.name} Facebook Profile`}
                        className="w-8 h-8 bg-[#111111] hover:bg-[#0c7866] hover:scale-110 text-white flex items-center justify-center transition-all shadow-md cursor-pointer rounded-xs"
                        title="Facebook Profile"
                      >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>

                      <a
                        href={`mailto:${leader.email || 'uyfsr.org@gmail.com'}`}
                        aria-label={`Email ${leader.name}`}
                        className="w-8 h-8 bg-[#111111] hover:bg-[#0c7866] hover:scale-110 text-white flex items-center justify-center transition-all shadow-md cursor-pointer rounded-xs"
                        title="Official Email"
                      >
                        <Mail className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#111111] group-hover:text-[#0c7866] transition-colors duration-300 mb-1">
                    {leader.name}
                  </h3>

                  <div className="text-[14.5px] font-semibold text-[#0c7866] mb-1">
                    {leader.title}
                  </div>

                  <div className="text-[13px] text-[#2b2b28] mb-3">
                    {leader.department}
                  </div>

                  <p className="text-[14px] text-[#2b2b28] leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#dcdcd8] flex items-center justify-between text-[12px] text-[#666660]">
                  <span className="font-semibold text-[#0c7866]">
                    {leader.rankTier}
                  </span>
                  <span className="text-[11px] opacity-75">
                    UYFSR Council
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
