import React, { useState, useRef } from 'react'
import { TrackModal } from './TrackModal'
import type { SiteTrackConfig } from '../lib/api'
import { sounds } from '../lib/audio'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  GraduationCap,
  Trophy,
  Target,
  Users,
  Layers,
  MoveHorizontal
} from 'lucide-react'

export interface ActivityItem {
  id: string
  num: string
  title: string
  category: string
  description: string
  highlights: string[]
  flagship: string
  audience: string
}

const activities: ActivityItem[] = [
  {
    id: 'workshops',
    num: '01',
    title: 'Practical Workshops',
    category: 'Hands-on Learning',
    description: 'Practical weekend sessions where students work with real laboratory apparatus, learn data observation, and practice scientific problem-solving through live experiments.',
    highlights: [
      'Lab apparatus handling & experiment practice',
      'Data recording and empirical verification',
      'Guided problem-solving under instructor supervision'
    ],
    flagship: 'Scientific Methodology Clinics',
    audience: 'High School & College Students'
  },
  {
    id: 'seminars-sessions',
    num: '02',
    title: 'Seminars & Expert Talks',
    category: 'Knowledge Exchange',
    description: 'Interactive lectures and open discussions connecting university faculty, practicing scientists, and educators with school and college cohorts.',
    highlights: [
      'Direct interaction with university faculty mentors',
      'STEM study, academic research & career guidance',
      'Open Q&A on contemporary scientific frontiers'
    ],
    flagship: '1st National Journalism Carnival',
    audience: 'Students & Science Club Members'
  },
  {
    id: 'fairs-olympiads',
    num: '03',
    title: 'Science Fairs & Olympiads',
    category: 'National Competitions',
    description: 'National competitive stages where students test their knowledge in physics, chemistry, biology, mathematics, and space science against peers nationwide.',
    highlights: [
      'Standardized multi-disciplinary Olympiad exams',
      'Project exhibition & scientific jury evaluations',
      'National awards, medals, and credentials'
    ],
    flagship: 'National Science Eclipse Olympiads',
    audience: 'School, College & Youth Delegations'
  },
  {
    id: 'scientific-competitions',
    num: '04',
    title: 'Quiz & Problem-Solving',
    category: 'Analytical Contests',
    description: 'Fast-paced science quizzes and cross-disciplinary logic challenges that test quick thinking, factual accuracy, and teamwork under competitive settings.',
    highlights: [
      'Live inter-school buzzer quiz tournaments',
      'Cross-disciplinary STEM puzzles & logic rounds',
      'Team collaborative problem decomposition'
    ],
    flagship: 'Junior Talent Award (Season 1)',
    audience: 'Quiz Teams & Individual Solvers'
  },
  {
    id: 'youth-development',
    num: '05',
    title: 'Youth Leadership & Mentorship',
    category: 'Campus Community',
    description: 'Developing campus ambassadors and student organizers who run local science clubs, coordinate academic seminars, and inspire peers across their institutions.',
    highlights: [
      'Nationwide Campus Ambassador leadership program',
      'Science communication & event management skills',
      'Peer-to-peer science outreach across 64 districts'
    ],
    flagship: 'UYFSR Ambassador Cohort',
    audience: 'Youth Ambassadors & Organizers'
  }
]

const getIcon = (id: string) => {
  switch (id) {
    case 'workshops': return Sliders
    case 'seminars-sessions': return GraduationCap
    case 'fairs-olympiads': return Trophy
    case 'scientific-competitions': return Target
    case 'youth-development': return Users
    default: return Sliders
  }
}

interface TracksProps {
  onOpenJoin?: () => void
  tracksConfig?: SiteTrackConfig[]
}

export const Tracks: React.FC<TracksProps> = ({ onOpenJoin: _onOpenJoin, tracksConfig }) => {
  const [modalTrack, setModalTrack] = useState<(SiteTrackConfig & { category?: string; description?: string; highlights?: string[] }) | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')
  const [viewEffect, setViewEffect] = useState<'slider' | 'stack'>('slider')
  const touchStartX = useRef<number | null>(null)

  
  const getTrackConfig = (id: string) => {
    return tracksConfig?.find((t) => t.id === id) || {
      id,
      num: activities.find((a) => a.id === id)?.num || '01',
      title: activities.find((a) => a.id === id)?.title || 'Track',
      isOpen: id === 'workshops' || id === 'fairs-olympiads' || id === 'youth-development',
      sessionTitle: activities.find((a) => a.id === id)?.flagship,
      notice: activities.find((a) => a.id === id)?.description,
      fee: id === 'youth-development' ? 'Free' : '৳250 BDT'
    }
  }

  const handleOpenTrack = (act: ActivityItem) => {
    sounds.playClick()
    const cfg = getTrackConfig(act.id)
    setModalTrack({
      ...cfg,
      category: act.category,
      description: act.description,
      highlights: act.highlights
    })
  }

  const activeActivity = activities[activeIndex]
  const Icon = getIcon(activeActivity.id)

  const handleNext = () => {
    sounds.playClick()
    setSlideDirection('right')
    setActiveIndex((prev) => (prev + 1) % activities.length)
  }

  const handlePrev = () => {
    sounds.playClick()
    setSlideDirection('left')
    setActiveIndex((prev) => (prev - 1 + activities.length) % activities.length)
  }

  // Touch Swipe Handlers for mobile sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
    touchStartX.current = null
  }

  return (
    <section id="activities" className="py-14 sm:py-16 bg-[#ecece9] text-left">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Heading & View Effect Switcher */}
        <div data-reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <h2 className="section-title text-[#111111] mb-2">
              What We Do
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#2b2b28] max-w-[65ch] leading-relaxed">
              From practical lab workshops and faculty seminars to national Olympiads, rapid quizzes, and campus leadership.
            </p>
          </div>

          {/* Effect Mode Toggle: Slide Mode vs Scroll Stacking Mode */}
          <div className="flex items-center gap-1.5 p-1 bg-[#deded9] border border-[#d2d2cc] rounded-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => {
                sounds.playClick()
                setViewEffect('slider')
              }}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewEffect === 'slider'
                  ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                  : 'text-[#555550] hover:text-[#111111]'
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5 text-[#0c7866]" />
              <span>Slide Deck</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick()
                setViewEffect('stack')
              }}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewEffect === 'stack'
                  ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                  : 'text-[#555550] hover:text-[#111111]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0c7866]" />
              <span>Scroll Stack</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EFFECT 1: INTERACTIVE SLIDE DECK (Slide on Click, Arrow, or Touch Swipe)   */}
        {/* ========================================================================= */}
        {viewEffect === 'slider' ? (
          <div data-reveal className="space-y-4">
            
            {/* Quick-Nav Pills for all 5 Activities */}
            <div className="flex items-center gap-2 overflow-x-auto theme-scrollbar pb-2.5 -mx-6 px-6 sm:mx-0 sm:px-0">
              {activities.map((act, idx) => {
                const isSelected = activeIndex === idx
                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      sounds.playHover()
                      setSlideDirection(idx >= activeIndex ? 'right' : 'left')
                      setActiveIndex(idx)
                    }}
                    className={`px-3.5 py-2 text-[13px] font-medium rounded-xs transition-all cursor-pointer shrink-0 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-[#f7f7f5] text-[#2b2b28] hover:bg-white hover:text-[#111111] border-[#dcdcd8]'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#34d399]' : 'text-[#0c7866]'}>
                      {act.num}
                    </span>
                    <span>{act.title}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Slide Showcase Card with Smooth Transitions */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="bg-[#fcfcfb] border border-[#dcdcd8] hover:border-[#0c7866] transition-all duration-300 rounded-xs p-6 sm:p-9 shadow-sm overflow-hidden"
            >
              <div
                key={activeActivity.id}
                className={slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                
                {/* Left Column (7 cols): Header, Description, Actions */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Top Meta Line: Number + Icon + Category Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-serif text-3xl sm:text-4xl font-light text-[#0c7866]">
                        {activeActivity.num}
                      </span>
                      <div className="w-9 h-9 rounded-xs bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#064e43] bg-white border border-[#dcdcd8] px-2.5 py-1 rounded-xs">
                        {activeActivity.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mb-3 leading-snug">
                      {activeActivity.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[14.5px] sm:text-[15.5px] text-[#2b2b28] leading-relaxed mb-6">
                      {activeActivity.description}
                    </p>
                  </div>

                  {/* Call to Action Button */}
                  <div className="pt-4 border-t border-[#f0f0ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenTrack(activeActivity)}
                      className={`w-full sm:w-auto px-5 py-3 text-white text-[13.5px] font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 rounded-xs shadow-xs ${
                        getTrackConfig(activeActivity.id).isOpen
                          ? 'bg-[#111111] hover:bg-[#0c7866]'
                          : 'bg-neutral-800 hover:bg-neutral-900 border border-amber-500/40 text-amber-300'
                      }`}
                    >
                      <span>
                        {getTrackConfig(activeActivity.id).isOpen
                          ? `Enrol in ${activeActivity.title}`
                          : `Check ${activeActivity.title} Status`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-left sm:text-right">
                      {getTrackConfig(activeActivity.id).isOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11.5px] font-semibold rounded-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active · Registration Open</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11.5px] font-semibold rounded-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>No Upcoming Sessions</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Highlights Card & Flagship Banner */}
                <div className="lg:col-span-5 bg-[#f7f7f5] border border-[#e5e5e0] p-5 sm:p-6 rounded-xs flex flex-col justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-[#064e43] mb-3">
                      Key activities and deliverables
                    </div>

                    <ul className="space-y-3 mb-5">
                      {activeActivity.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#2b2b28]">
                          <Check className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                          <span className="leading-snug">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Flagship Event & Audience Strip */}
                  <div className="pt-3 border-t border-[#e2e2dc] space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#666660]">Flagship Event:</span>
                      <span className="font-semibold text-[#0c7866]">{activeActivity.flagship}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#666660]">Target Cohort:</span>
                      <span className="text-[#111111] font-medium">{activeActivity.audience}</span>
                    </div>
                  </div>
                </div>

              </div>
              </div>

              {/* Slider Bottom Controller: Progress bar + Prev/Next Controls */}
              <div className="mt-6 pt-5 border-t border-[#e5e5e0] flex items-center justify-between gap-4">
                
                {/* Step Dots / Progress Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#111111]">
                    {activeActivity.num}
                  </span>
                  <div className="w-24 sm:w-36 h-1.5 bg-[#e5e5e0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0c7866] transition-all duration-300"
                      style={{ width: `${((activeIndex + 1) / activities.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[13px] text-[#666660]">
                    05
                  </span>
                </div>

                {/* Arrow Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    title="Previous Track"
                    className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-[#111111] hover:text-white border border-[#dcdcd8] text-[#111111] text-[12.5px] font-medium rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <button
                    onClick={handleNext}
                    title="Next Track"
                    className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-[#111111] hover:text-white border border-[#dcdcd8] text-[#111111] text-[12.5px] font-medium rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* EFFECT 2: STICKY STACKING CARDS (Cards slide & stack as user scrolls down)*/
          /* ========================================================================= */
          <div className="space-y-6 pt-2">
            <div className="text-[13px] text-[#666660] italic mb-3">
              Scroll down to watch each track slide into the deck:
            </div>
            {activities.map((act, idx) => {
              const ActIcon = getIcon(act.id)
              return (
                <div
                  key={act.id}
                  style={{
                    top: `calc(90px + ${idx * 20}px)`,
                    zIndex: idx + 10,
                  }}
                  className="sticky bg-[#fcfcfb] border border-[#dcdcd8] hover:border-[#0c7866] rounded-xs p-6 sm:p-8 shadow-md transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-start">
                    
                    {/* Left: Number + Icon + Title + Description */}
                    <div className="md:col-span-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-serif text-3xl font-light text-[#0c7866]">
                          {act.num}
                        </span>
                        <div className="w-8 h-8 rounded-xs bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center shrink-0">
                          <ActIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#064e43] bg-white border border-[#e5e5e0] px-2.5 py-0.5 rounded-xs">
                          {act.category}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] mb-2 leading-snug group-hover:text-[#0c7866] transition-colors">
                        {act.title}
                      </h3>

                      <p className="text-[14px] text-[#2b2b28] leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    {/* Right: Highlights Checklist & Flagship Event */}
                    <div className="md:col-span-5 bg-[#f7f7f5] p-4.5 rounded-xs border border-[#e5e5e0]">
                      <div className="text-[12.5px] font-semibold text-[#064e43] mb-2.5">
                        Key activities and deliverables
                      </div>

                      <ul className="space-y-2 mb-3.5">
                        {act.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#2b2b28]">
                            <Check className="w-3.5 h-3.5 text-[#0c7866] shrink-0 mt-0.5" />
                            <span className="leading-snug">{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2.5 border-t border-[#e0e0da] flex items-center justify-between text-[11.5px]">
                        <span className="text-[#666660]">Flagship Event:</span>
                        <span className="font-semibold text-[#0c7866] truncate ml-1">{act.flagship}</span>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Track Enrolment & Inactive Notice Modal */}
        {modalTrack && (
          <TrackModal
            track={modalTrack}
            onClose={() => setModalTrack(null)}
            onExploreEvents={() => {
              setModalTrack(null)
              document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        )}
      </div>
    </section>
  )
}
