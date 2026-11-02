import React, { useState } from 'react'
import { sounds } from '../lib/audio'
import { Pause, Play, LayoutGrid, SlidersHorizontal, Info, CheckCircle2 } from 'lucide-react'

export interface Partner {
  name: string
  role: string
  description: string
  logo: string
  category: 'Strategic Alliances' | 'Media Consortium' | 'Club & Campus Partners' | 'Community & Affiliates'
}

export const partners: Partner[] = [
  // Strategic Alliances
  {
    name: "TWIMBOL",
    role: "Program & Workshop Partner",
    description: "Collaborating on interactive skill workshops and co-organizing the Junior Startup Challenge and Junior Talent Award.",
    logo: "/images/partners/twimbol.png",
    category: "Strategic Alliances"
  },
  {
    name: "KIDLON",
    role: "Venue & Presenting Partner",
    description: "Providing hosting venues and presenting partner for Season 1 of the Junior Talent Award across national stages.",
    logo: "/images/partners/kidlon.png",
    category: "Strategic Alliances"
  },
  {
    name: "MEJOLOGY",
    role: "Academic Content Partner",
    description: "Academic content collaboration and curriculum development for secondary school empirical research workshops.",
    logo: "/images/partners/mejology.svg",
    category: "Strategic Alliances"
  },
  {
    name: "ASTROSPHERE",
    role: "Olympiad & Astronomy Co-organizer",
    description: "Co-organizing astronomical science sessions, olympiad question panels, and youth space awareness seminars.",
    logo: "/images/partners/astrosphere.svg",
    category: "Strategic Alliances"
  },

  // Media Consortium
  {
    name: "The Bayline Journal",
    role: "Editorial Media Partner",
    description: "In-depth editorial coverage, investigative student science dispatches, and national carnival publications.",
    logo: "/images/partners/bayline.svg",
    category: "Media Consortium"
  },
  {
    name: "Motion BD",
    role: "Broadcast Media Partner",
    description: "Video coverage, documentary production, and digital broadcast support for flagship science exhibitions.",
    logo: "/images/partners/motion-bd.svg",
    category: "Media Consortium"
  },
  {
    name: "TezzFeed",
    role: "Digital Media Partner",
    description: "Digital media outreach and student innovator spotlight stories across national youth social communities.",
    logo: "/images/partners/tezzfeed.svg",
    category: "Media Consortium"
  },

  // Club & Campus Partners
  {
    name: "Adamjee School News Network & Communication Club",
    role: "Campus Workshop & Club Partner",
    description: "Campus co-organizer and host for the 1st National Journalism Carnival 2025, collaborating on empirical reporting and media literacy clinics.",
    logo: "/images/partners/adamjee.svg",
    category: "Club & Campus Partners"
  },
  {
    name: "Learning and Study Organization",
    role: "Academic Study Co-organizer",
    description: "Community student mobilization and academic study material curation for olympiad participants.",
    logo: "/images/partners/learning-study.svg",
    category: "Club & Campus Partners"
  },

  // Community & Affiliates
  {
    name: "The Focal Vibe",
    role: "Creative Direction Partner",
    description: "Visual identity, creative design coordination, stagecraft aesthetics, and multimedia documentation.",
    logo: "/images/partners/focal-vibe.svg",
    category: "Community & Affiliates"
  },
  {
    name: "The Yeasirians",
    role: "Merchandise & Gift Partner",
    description: "Official merchandise, commemorative awards, and appreciation packages for competition laureates.",
    logo: "/images/partners/yeasirians.svg",
    category: "Community & Affiliates"
  },
  {
    name: "Aurelix",
    role: "Event Fragrance Partner",
    description: "Event fragrance curation and participant welcome amenities for national symposia.",
    logo: "/images/partners/aurelix.svg",
    category: "Community & Affiliates"
  }
]

const partnerCategories = [
  'All Partners',
  'Strategic Alliances',
  'Media Consortium',
  'Club & Campus Partners',
  'Community & Affiliates'
]

export const Partners: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All Partners')
  const [hoveredPartner, setHoveredPartner] = useState<Partner | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee')

  const filteredPartners = partners.filter(
    (p) => selectedCat === 'All Partners' || p.category === selectedCat
  )

  // Duplicate for seamless infinite loop (needs 2 sets minimum for -50% translateX)
  const marqueeList = [...filteredPartners, ...filteredPartners]

  const activeSpotlight = hoveredPartner || filteredPartners[0]

  return (
    <section id="partners" className="py-14 sm:py-16 bg-[#ecece9] text-left relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-8">
        
        {/* Section Heading & Controls */}
        <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h2 className="section-title text-[#111111] mb-2.5">
              Partners and Collaborators
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#2b2b28] leading-relaxed">
              UYFSR collaborates with 12 academic institutions, presenting partners, media networks, campus clubs, and youth organizations across Bangladesh. Hover over any partner to view partnership role and scope.
            </p>
          </div>

          {/* View Mode & Animation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playClick()
                setIsPaused(!isPaused)
              }}
              title={isPaused ? "Resume Marquee Animation" : "Pause Marquee Animation"}
              className="px-3 py-1.5 bg-[#f7f7f5] hover:bg-white border border-[#dcdcd8] text-[#2b2b28] hover:text-[#111111] text-[12.5px] font-medium rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#0c7866]" /> : <Pause className="w-3.5 h-3.5 text-[#666660]" />}
              <span>{isPaused ? "Play" : "Pause"}</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick()
                setViewMode(viewMode === 'marquee' ? 'grid' : 'marquee')
              }}
              className="px-3 py-1.5 bg-[#f7f7f5] hover:bg-white border border-[#dcdcd8] text-[#2b2b28] hover:text-[#111111] text-[12.5px] font-medium rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {viewMode === 'marquee' ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-[#0c7866]" />
                  <span>Grid View</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0c7866]" />
                  <span>Marquee View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto theme-scrollbar pb-2.5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
          {partnerCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick()
                setSelectedCat(cat)
              }}
              className={`px-3.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer rounded-xs shrink-0 ${
                selectedCat === cat
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#f7f7f5] text-[#2b2b28] hover:bg-white hover:text-[#111111] border border-[#dcdcd8]'
              }`}
            >
              {cat}
              <span className="ml-1.5 text-[11px] opacity-70">
                ({cat === 'All Partners' ? partners.length : partners.filter(p => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SINGLE-LINE INFINITE MARQUEE TICKER (Continuous Right to Left)   */}
      {/* ========================================================================= */}
      {viewMode === 'marquee' ? (
        <div className="relative w-full py-4 pause-on-hover">
          {/* Subtle Left & Right Soft Fade Vignettes */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#ecece9] to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#ecece9] to-transparent z-20" />

          {/* Marquee Track */}
          <div
            className={`animate-marquee-track flex items-stretch gap-4 sm:gap-5 px-4 ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {marqueeList.map((partner, idx) => {
              const isHovered = hoveredPartner?.name === partner.name
              return (
                <div
                  key={`${partner.name}-${idx}`}
                  onMouseEnter={() => {
                    sounds.playHover()
                    setHoveredPartner(partner)
                  }}
                  onMouseLeave={() => setHoveredPartner(null)}
                  onClick={() => {
                    sounds.playClick()
                    setHoveredPartner(partner)
                  }}
                  className={`relative w-[280px] sm:w-[320px] shrink-0 bg-[#f7f7f5] rounded-xs border p-4.5 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                    isHovered
                      ? 'border-[#0c7866] bg-white shadow-lg -translate-y-1'
                      : 'border-[#dcdcd8] hover:border-[#0c7866] hover:bg-white'
                  }`}
                  style={{ minHeight: '165px' }}
                >
                  {/* Top Bar: Logo + Tier Badge */}
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="h-8 max-w-[130px] flex items-center justify-start overflow-hidden">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className={`max-h-7 max-w-[120px] object-contain transition-all duration-300 ${
                          isHovered ? 'filter-none scale-105' : 'filter grayscale opacity-75'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#064e43] bg-[#0c7866]/8 border border-[#0c7866]/20 px-2 py-0.5 rounded-xs shrink-0">
                      {partner.category.replace('Consortium', '').replace('& Affiliates', '')}
                    </span>
                  </div>

                  {/* Middle: Partner Name & Role ("Kisher Partner") */}
                  <div>
                    <h3 className="font-serif text-[15.5px] font-bold text-[#111111] leading-snug">
                      {partner.name}
                    </h3>
                    <div className="text-[12px] font-semibold text-[#0c7866] flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-[#0c7866] shrink-0" />
                      <span className="truncate">{partner.role}</span>
                    </div>
                  </div>

                  {/* Bottom: Description ("Choto Description") */}
                  <div className="mt-2.5 pt-2 border-t border-[#e5e5e0]">
                    <p className="text-[12px] text-[#2b2b28] leading-relaxed line-clamp-2">
                      {partner.description}
                    </p>
                  </div>

                  {/* Active Indicator Line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#0c7866] transition-opacity duration-200 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Active Partner Spotlight Inspector Bar (Below Marquee) */}
          <div className="max-w-6xl mx-auto px-6 sm:px-8 mt-5">
            <div className="bg-[#f7f7f5] border border-[#dcdcd8] p-3.5 sm:p-4 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#0c7866]/10 text-[#064e43] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13.5px] font-bold text-[#111111]">
                      {activeSpotlight.name}
                    </span>
                    <span className="text-[11.5px] font-semibold text-[#0c7866] bg-white border border-[#0c7866]/30 px-2 py-0.2 rounded-xs">
                      {activeSpotlight.role}
                    </span>
                    <span className="text-[10.5px] text-[#666660]">
                      ({activeSpotlight.category})
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#2b2b28] mt-0.5 leading-snug">
                    {activeSpotlight.description}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-[#666660] shrink-0 italic">
                Hover or tap any card in the line to pause and view details
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: EDITORIAL GRID VIEW (Static Directory)                           */
        /* ========================================================================= */
        <div className="max-w-6xl mx-auto px-6 sm:px-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredPartners.map((partner, idx) => (
              <div
                key={`${partner.name}-${idx}`}
                className="bg-[#f7f7f5] hover:bg-white border border-[#dcdcd8] hover:border-[#0c7866] p-5 rounded-xs transition-all duration-300 flex flex-col justify-between group shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="h-8 max-w-[140px] flex items-center">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-7 max-w-[130px] object-contain filter grayscale group-hover:filter-none transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#064e43] bg-white border border-[#e5e5e0] px-2 py-0.5 rounded-xs">
                      {partner.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-[17px] font-bold text-[#111111] mb-1">
                    {partner.name}
                  </h3>

                  <div className="text-[13px] font-semibold text-[#0c7866] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{partner.role}</span>
                  </div>

                  <p className="text-[13px] text-[#2b2b28] leading-relaxed">
                    {partner.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#e5e5e0] text-[11px] text-[#666660]">
                  Official Academic & Program Partner
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
