import React, { useState, useRef, useEffect } from 'react'
import { sounds } from '../lib/audio'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface EventItem {
  id: string
  title: string
  dateDisplay: {
    days: string
    monthYear: string
    duration: string
  }
  category: 'Science Fair & Olympiad' | 'Talent & Research Search' | 'Innovation & Project Showcase' | 'Workshops & Media'
  uyfsrRole: string
  organizer: string
  detailsNote: string
  description: string
  status: 'Upcoming 2026' | 'Scheduled' | 'Completed'
}

const events: EventItem[] = [
  {
    id: "eclipse-2026",
    title: "National Science Eclipse 2026",
    dateDisplay: {
      days: "16–18",
      monthYear: "April 2026",
      duration: "3-Day Event"
    },
    category: "Science Fair & Olympiad",
    uyfsrRole: "Lead Organizer",
    organizer: "United Youth Forum of Science and Research (UYFSR)",
    detailsNote: "Official UYFSR Flagship Program",
    description: "Our flagship national science festival uniting young researchers, students, and aspiring innovators through project exhibitions, science competitions, and theoretical problem-solving olympiads.",
    status: "Upcoming 2026"
  },
  {
    id: "junior-talent-season-1",
    title: "KIDLON Presents Junior Talent Award – Season 1",
    dateDisplay: {
      days: "18",
      monthYear: "July 2026",
      duration: "21-Day Event"
    },
    category: "Talent & Research Search",
    uyfsrRole: "Community Partner",
    organizer: "TWIMBOL (Presented by KIDLON)",
    detailsNote: "Venue Partner: KIDLON",
    description: "A 21-day youth talent discovery program empowering school and college students to showcase original ideas, discover research interests, and receive structured mentorship.",
    status: "Scheduled"
  },
  {
    id: "junior-startup-season-1",
    title: "Junior Startup Challenge – Season 1",
    dateDisplay: {
      days: "3",
      monthYear: "September 2026",
      duration: "Full-Day Summit"
    },
    category: "Innovation & Project Showcase",
    uyfsrRole: "Community Partner",
    organizer: "TWIMBOL",
    detailsNote: "Innovation & Startup Exhibition",
    description: "Encouraging young innovators to turn scientific inquiry and creative prototypes into meaningful societal solutions and community ventures.",
    status: "Scheduled"
  },
  {
    id: "journalism-carnival-2025",
    title: "1st National Journalism Carnival 2025",
    dateDisplay: {
      days: "17–19",
      monthYear: "October 2025",
      duration: "3-Day Event"
    },
    category: "Workshops & Media",
    uyfsrRole: "Workshop Partner",
    organizer: "Adamjee School News Network & Communication Club",
    detailsNote: "Scientific Communication Sessions",
    description: "Specialized three-day educational carnival promoting scientific communication, objective reporting, and analytical journalism among youth.",
    status: "Completed"
  }
]

const categories = [
  "All Programs",
  "Science Fair & Olympiad",
  "Talent & Research Search",
  "Innovation & Project Showcase",
  "Workshops & Media"
]

interface ProjectsTableProps {
  onOpenJoin?: () => void
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ onOpenJoin }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Programs")
  const [query, setQuery] = useState("")
  const [showAllMobile, setShowAllMobile] = useState(false)
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = categoryScrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    checkScroll()
    const el = categoryScrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scrollCategories = (dir: 'left' | 'right') => {
    sounds.playHover()
    const el = categoryScrollRef.current
    if (!el) return
    const scrollAmount = 220
    el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  const filtered = events.filter((e) => {
    const matchesQuery =
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.organizer.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase()) ||
      e.uyfsrRole.toLowerCase().includes(query.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All Programs' || e.category === selectedCategory

    return matchesQuery && matchesCategory
  })

  // On mobile, show top 2 programs by default unless expanded or filtered
  const isFilteredOrSearched = selectedCategory !== 'All Programs' || query.trim().length > 0
  const displayedEvents = (showAllMobile || isFilteredOrSearched) ? filtered : filtered.slice(0, 2)

  return (
    <section id="events" className="py-14 sm:py-16 bg-[#ecece9] text-left">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Heading - Clean Executive Header */}
        <div data-reveal className="mb-8">
          <h2 className="section-title text-[#111111] mb-2">
            Events and programs organized
          </h2>
          <p className="text-[15px] text-[#2b2b28] max-w-[55ch]">
            Explore our calendar of national science fairs, talent awards, startup summits, and educational workshops.
          </p>
        </div>

        {/* Filter & Search Bar - High Efficiency Compact Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {canScrollLeft && (
              <button
                onClick={() => scrollCategories('left')}
                aria-label="Scroll categories left"
                className="hidden sm:flex items-center justify-center w-7 h-7 bg-white hover:bg-[#0c7866] hover:text-white border border-[#dcdcd8] text-[#0c7866] rounded-xs shadow-2xs cursor-pointer transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div 
              ref={categoryScrollRef}
              className="flex overflow-x-auto theme-scrollbar gap-1.5 pb-2.5 -mx-6 px-6 sm:mx-0 sm:px-0 flex-1 min-w-0"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={(e) => {
                    sounds.playClick()
                    setSelectedCategory(cat)
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                  }}
                  className={`px-3 py-1.5 text-[13px] font-medium transition-all duration-200 cursor-pointer shrink-0 rounded-xs active:scale-[0.98] ${
                    selectedCategory === cat
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-[#f7f7f5] text-[#2b2b28] hover:bg-white hover:text-[#111111] border border-[#dcdcd8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scrollCategories('right')}
                aria-label="Scroll categories right"
                className="hidden sm:flex items-center justify-center w-7 h-7 bg-white hover:bg-[#0c7866] hover:text-white border border-[#dcdcd8] text-[#0c7866] rounded-xs shadow-2xs cursor-pointer transition-colors shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-60 shrink-0">
            <input
              type="text"
              placeholder="Search programs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] text-[13px] rounded-xs focus:outline-none focus:border-[#0c7866] transition-colors"
            />
          </div>
        </div>

        {/* High-Efficiency 2-Column Responsive Grid with Fluid Entrance Animation */}
        <div key={`${selectedCategory}-${query}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {displayedEvents.map((item, idx) => (
            <div
              key={item.id}
              className="animate-fade-scale bg-[#f7f7f5] p-5 sm:p-6 border border-[#e5e5e0] flex flex-col justify-between hover:border-[#0c7866] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group rounded-xs shadow-2xs"
              style={{ animationDelay: `${(idx % 4) * 60}ms` }}
            >
              <div>
                {/* Header: Date + Status Badge with Live Radar Pulse */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[12px] font-semibold text-[#064e43] bg-[#0c7866]/10 px-2.5 py-1 rounded-xs tracking-wide">
                    {item.dateDisplay.days} {item.dateDisplay.monthYear} · {item.dateDisplay.duration}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-semibold tracking-wider rounded-xs uppercase flex items-center gap-1.5 ${
                      item.status === 'Upcoming 2026'
                        ? 'bg-[#0c7866] text-white shadow-xs'
                        : item.status === 'Scheduled'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#ecece9] text-[#2b2b28]'
                    }`}
                  >
                    {item.status === 'Upcoming 2026' && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34d399]"></span>
                      </span>
                    )}
                    <span>{item.status}</span>
                  </span>
                </div>

                {/* Subtitle: Track Category & UYFSR Role */}
                <div className="text-[12px] text-[#064e43] font-medium mb-1">
                  {item.category} · UYFSR: {item.uyfsrRole}
                </div>

                {/* Event Title */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111] mb-2 group-hover:text-[#0c7866] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Event Description (Concise & Readable) */}
                <p className="text-[14px] text-[#2b2b28] leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>
              </div>

              {/* Card Footer: Organizer Credit & Primary Action */}
              <div className="pt-3 border-t border-[#e5e5e0] flex items-center justify-between gap-3 text-[12.5px]">
                <div className="text-[#2b2b28] truncate pr-2">
                  <span className="text-[#2b2b28]/60">By:</span>{' '}
                  <span className="font-medium text-[#111111]">{item.organizer}</span>
                </div>

                {onOpenJoin && (item.status === 'Upcoming 2026' || item.status === 'Scheduled') ? (
                  <button
                    onClick={() => {
                      sounds.playClick()
                      onOpenJoin()
                    }}
                    className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#0c7866] active:scale-[0.98] text-white text-[12.5px] font-medium transition-all duration-200 cursor-pointer shrink-0 inline-flex items-center gap-1.5 group/btn"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </button>
                ) : (
                  <span className="text-[#2b2b28]/60 text-[11px] font-medium shrink-0">
                    Archived
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Expander (Reduces excessive mobile scroll) */}
        {!isFilteredOrSearched && filtered.length > 2 && (
          <div className="md:hidden mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                sounds.playClick()
                setShowAllMobile(!showAllMobile)
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#ecece9] border border-[#dcdcd8] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>
                {showAllMobile
                  ? 'Show top 2 programs (Collapse) ↑'
                  : `View all ${filtered.length} programs (${filtered.length - 2} more) ↓`}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
