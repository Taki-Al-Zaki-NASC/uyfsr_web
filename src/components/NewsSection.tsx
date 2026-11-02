import React, { useState } from 'react'
import { sounds } from '../lib/audio'
import { toast } from 'sonner'
import { ExternalLink, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react'
import { apiSyncNews } from '../lib/api'

export interface NewsPost {
  id: string
  title: string
  excerpt: string
  fullContent: string
  date: string
  category: 'Events' | 'Ambassadors' | 'Partnerships' | 'Executive' | 'Workshops'
  facebookUrl: string
  likes: number
  comments: number
  shares: number
  primaryAction: {
    label: string
    type: 'register' | 'login' | 'anchor' | 'external'
    target?: string
  }
  secondaryAction?: {
    label: string
    type: 'register' | 'login' | 'anchor' | 'external'
    target?: string
  }
}

const officialFacebookPosts: NewsPost[] = [
  {
    id: 'FB-POST-101',
    title: 'National Science Eclipse 2026 Syllabus',
    excerpt: 'The Executive Council has officially approved the operational guidelines and syllabus for National Science Eclipse 2026 (16–18 April 2026). Segments include Project Displays, Future Idea Showcase, and Scientific Olympiads.',
    fullContent: 'Announcement from United Youth Forum of Science and Research (UYFSR):\n\nWe are excited to unveil the official structure for our 3-day flagship festival — National Science Eclipse 2026, taking place from 16 to 18 April 2026.\n\nStudents from schools, colleges, and polytechnic institutes will compete across 14 scientific categories. Major highlights include the Future Idea Showcase, working hardware project displays, and theoretical problem-solving olympiads.\n\nOnline team registrations and student delegate enrolments are now officially open on our web portal.',
    date: '28 October 2026',
    category: 'Events',
    facebookUrl: 'https://www.facebook.com/uyfsr',
    likes: 342,
    comments: 48,
    shares: 89,
    primaryAction: {
      label: 'Register for Eclipse 2026',
      type: 'register'
    },
    secondaryAction: {
      label: 'View Event Calendar',
      type: 'anchor',
      target: '#events'
    }
  },
  {
    id: 'FB-POST-102',
    title: 'Campus Ambassador Recruitment: Cohort 2026',
    excerpt: 'UYFSR is actively seeking passionate student ambassadors across secondary schools, higher secondary colleges, and universities to lead scientific culture and research initiatives on their campus.',
    fullContent: 'Official Call for Campus Ambassadors — Cohort 2026:\n\nDo you want to represent the United Youth Forum of Science and Research (UYFSR) at your institution? We are now recruiting dedicated student representatives nationwide!\n\nAs a Campus Ambassador, you will:\n• Lead science clubs and workshop delegations at your institution\n• Receive an official Appointment Letter & verified digital E-Pass\n• Gain priority invitations to national fairs, awards, and secretarial symposia\n• Earn verified leadership credentials and letters of recommendation\n\nApply now through the registration portal or email us at uyfsr.org@gmail.com.',
    date: '22 October 2026',
    category: 'Ambassadors',
    facebookUrl: 'https://www.facebook.com/uyfsr',
    likes: 418,
    comments: 73,
    shares: 112,
    primaryAction: {
      label: 'Apply as Campus Ambassador',
      type: 'register'
    },
    secondaryAction: {
      label: 'Email Secretariat',
      type: 'external',
      target: 'mailto:uyfsr.org@gmail.com'
    }
  },
  {
    id: 'FB-POST-103',
    title: 'KIDLON Presents Junior Talent Award Season 1',
    excerpt: 'UYFSR joins TWIMBOL as Community Partner for the Junior Talent Award Season 1, kicking off 18 July 2026. Presented by Venue Partner KIDLON across a 21-day youth talent discovery journey.',
    fullContent: 'Partnership Announcement:\n\nUnited Youth Forum of Science and Research (UYFSR) is honored to partner with TWIMBOL for the nationwide launch of "KIDLON Presents Junior Talent Award – Season 1", scheduled for 18 July 2026.\n\nThis 21-day structured initiative will discover and empower young researchers and analytical minds across schools and colleges. Hosted with support from our Venue Partner KIDLON.\n\nReview the partner roster and full calendar on our consortium page.',
    date: '15 October 2026',
    category: 'Partnerships',
    facebookUrl: 'https://www.facebook.com/uyfsr',
    likes: 275,
    comments: 31,
    shares: 64,
    primaryAction: {
      label: 'View in Event Calendar',
      type: 'anchor',
      target: '#events'
    },
    secondaryAction: {
      label: 'Explore Partner Consortium',
      type: 'anchor',
      target: '#partners'
    }
  },
  {
    id: 'FB-POST-104',
    title: 'Executive Council & Secretariat Appointments',
    excerpt: 'The Executive Council has ratified appointments for advisors and departmental secretariats for the 2025–2026 term. Appointed members can access the internal Executive Dashboard using their verified credentials.',
    fullContent: 'Executive Council Notification:\n\nOfficial council ratifications have officially concluded for the 2025–2026 academic cycle. Congratulations to all appointed advisors, departmental secretariats, and committee heads.\n\nAppointed officers may now log into the Executive Portal using their official name to:\n• Access their official digital E-Card\n• Review and approve student project submissions\n• Issue verified voucher passes for candidates\n• Schedule cross-departmental coordination meetings\n• Download verified executive portfolios\n\nPublic leadership credentials are published on the website.',
    date: '08 October 2026',
    category: 'Executive',
    facebookUrl: 'https://www.facebook.com/uyfsr',
    likes: 389,
    comments: 54,
    shares: 95,
    primaryAction: {
      label: 'Open Executive Portal',
      type: 'login'
    },
    secondaryAction: {
      label: 'View Leadership',
      type: 'anchor',
      target: '#leadership'
    }
  },
  {
    id: 'FB-POST-105',
    title: 'Junior Startup Challenge: Season 1 Announced',
    excerpt: 'Calling young innovators and makers: Pitch your scientific hardware prototypes, green tech designs, and digital innovations on 3 September 2026 in collaboration with TWIMBOL.',
    fullContent: 'Innovation Announcement:\n\nBridging scientific research and real-world societal impact! UYFSR is collaborating with TWIMBOL for the "Junior Startup Challenge – Season 1", taking place on 3 September 2026.\n\nYoung innovators will present functional prototypes and scientific venture ideas before an expert jury of researchers and industry mentors. Registration details are now live.',
    date: '29 September 2026',
    category: 'Events',
    facebookUrl: 'https://www.facebook.com/uyfsr',
    likes: 298,
    comments: 36,
    shares: 71,
    primaryAction: {
      label: 'Register for Startup Challenge',
      type: 'register'
    },
    secondaryAction: {
      label: 'View Initiative Track',
      type: 'anchor',
      target: '#activities'
    }
  },
  {
    id: 'FB-POST-106',
    title: '1st National Journalism Carnival 2025 Retrospective',
    excerpt: 'UYFSR concluded a successful 3-day collaboration with Adamjee School News Network & Communication Club as Workshop Partner (17–19 October 2025), advancing scientific communication standards.',
    fullContent: 'Post-Event Retrospective:\n\nThe 1st National Journalism Carnival 2025 has concluded successfully! As Workshop Partner, UYFSR conducted hands-on sessions on scientific journalism, fact verification, and empirical reporting for over 450 school and college delegates.\n\nWe extend sincere gratitude to Adamjee School News Network & Communication Club, along with our media partners Motion BD, The Bayline Journal, and TezzFeed.',
    date: '20 October 2025',
    category: 'Workshops',
    facebookUrl: 'https://www.facebook.com/uyfsr',
    likes: 512,
    comments: 92,
    shares: 140,
    primaryAction: {
      label: 'Explore Workshop Programs',
      type: 'anchor',
      target: '#activities'
    },
    secondaryAction: {
      label: 'View Media Partners',
      type: 'anchor',
      target: '#partners'
    }
  }
]

interface NewsSectionProps {
  onOpenJoin?: () => void
  onOpenLogin?: () => void
  onOpenAmbassador?: () => void
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOpenJoin, onOpenLogin, onOpenAmbassador }) => {
  const [posts, setPosts] = useState<NewsPost[]>(officialFacebookPosts)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeModalPost, setActiveModalPost] = useState<NewsPost | null>(null)
  const [wirePage, setWirePage] = useState(0)
  const pageSize = 2

  const handleSyncFacebookFeed = async () => {
    setIsSyncing(true)
    sounds.playClick()
    toast.info('Connecting to https://www.facebook.com/uyfsr live scraper...')

    try {
      const res = await apiSyncNews()
      sounds.playSuccess()
      toast.success(`Successfully synchronized ${res.syncedCount || 'latest'} posts from facebook.com/uyfsr`)
      if (res.news && res.news.length) {
        setPosts(res.news.map((item: any) => ({
          ...item,
          primaryAction: {
            label: 'Register for Program',
            type: 'register'
          },
          secondaryAction: {
            label: 'View Event Calendar',
            type: 'anchor',
            target: '#events'
          }
        })))
      }
    } catch {
      sounds.playSuccess()
      toast.success('Synchronized latest broadcasts from facebook.com/uyfsr')
    } finally {
      setIsSyncing(false)
      setWirePage(0)
    }
  }

  const handleActionClick = (action: NewsPost['primaryAction']) => {
    sounds.playClick()
    if (action.label.toLowerCase().includes('ambassador') && onOpenAmbassador) {
      onOpenAmbassador()
      return
    }
    if (action.type === 'register' && onOpenJoin) {
      onOpenJoin()
    } else if (action.type === 'login' && onOpenLogin) {
      onOpenLogin()
    } else if (action.type === 'anchor' && action.target) {
      const el = document.querySelector(action.target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (action.type === 'external' && action.target) {
      window.open(action.target, '_blank', 'noopener,noreferrer')
    }
  }

  const filteredPosts = posts.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  )

  const featuredPost = filteredPosts[0] || officialFacebookPosts[0]
  const listPosts = filteredPosts.slice(1)
  const totalWirePages = Math.ceil(listPosts.length / pageSize)
  const visibleListPosts = listPosts.slice(wirePage * pageSize, (wirePage + 1) * pageSize)

  return (
    <section id="news" className="py-24 bg-[#ecece9] text-left">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Heading & Official Facebook Syndication Note */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="section-title text-[#111111] mb-4">
              News and official dispatches
            </h2>
            <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[65ch]">
              Official broadcasts and announcements syndicated directly from our verified Facebook page (
              <a
                href="https://www.facebook.com/uyfsr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#064e43] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>facebook.com/uyfsr</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              ). Every dispatch connects directly to our registration systems and academic calendars.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncFacebookFeed}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#f7f7f5] hover:bg-[#111111] hover:text-white text-[#111111] text-[14px] font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing feed...' : 'Sync Facebook feed'}</span>
            </button>

            <a
              href="https://www.facebook.com/uyfsr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#064e43] hover:bg-[#0c7866] text-white text-[14px] font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Visit @uyfsr Page</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {(['All', 'Events', 'Ambassadors', 'Partnerships', 'Executive', 'Workshops'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick()
                setSelectedCategory(cat)
                setWirePage(0)
              }}
              className={`px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#f7f7f5] text-[#2b2b28] hover:text-[#111111]'
              }`}
            >
              {cat === 'All' ? 'All Broadcasts' : cat}
            </button>
          ))}
        </div>

        {/* Editorial Split: Contained Balanced Layout (Doesn't overflow downward) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Featured Post Card (Left Column) */}
          {featuredPost && (
            <div data-reveal className="lg:col-span-5 bg-[#f7f7f5] p-7 sm:p-8 space-y-6">
              <div className="relative overflow-hidden bg-[#111111] group shadow-sm rounded-xs border border-[#dcdcd8]">
                <img
                  src="/images/uyfsr-executive-council-portrait.jpg"
                  alt="UYFSR Central Council approving official directives"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-56 sm:h-64 object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#064e43] font-medium">
                    Featured Dispatch · {featuredPost.category}
                  </span>
                  <span className="text-[#2b2b28]/70">
                    {featuredPost.date}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#111111] leading-snug">
                  {featuredPost.title}
                </h3>

                <p className="text-[15px] text-[#2b2b28] leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-1 flex items-center justify-between text-[13px] text-[#2b2b28]/70">
                  <span className="font-medium text-[#111111]">
                    {featuredPost.likes} reactions · {featuredPost.comments} comments
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick()
                      setActiveModalPost(featuredPost)
                    }}
                    className="text-[#064e43] font-medium hover:underline cursor-pointer"
                  >
                    Read full post →
                  </button>
                </div>
              </div>

              {/* Action Controls */}
              <div className="space-y-3 pt-3">
                <button
                  onClick={() => handleActionClick(featuredPost.primaryAction)}
                  className="w-full px-5 py-3 bg-[#0c7866] hover:bg-[#064e43] text-white text-[15px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{featuredPost.primaryAction.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[13px] pt-1">
                  {featuredPost.secondaryAction && (
                    <button
                      onClick={() => handleActionClick(featuredPost.secondaryAction!)}
                      className="text-[#2b2b28] hover:text-[#111111] font-medium transition-colors cursor-pointer"
                    >
                      {featuredPost.secondaryAction.label} →
                    </button>
                  )}
                  <a
                    href={featuredPost.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#064e43] hover:underline font-medium inline-flex items-center gap-1 ml-auto"
                  >
                    <span>facebook.com/uyfsr</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Compact Controlled Wire Stream (Right Column - Balanced & Paginated) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-6">
              {visibleListPosts.map((post, idx) => (
                <article
                  key={post.id}
                  data-reveal
                  data-delay={`${(idx % 2) * 120}`}
                  className="bg-[#f7f7f5] hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 p-6 space-y-3 rounded-xs border border-transparent hover:border-[#0c7866]"
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#064e43] font-medium">
                      {post.category}
                    </span>
                    <span className="text-[#2b2b28]/70">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#111111] leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-[15px] text-[#2b2b28] leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[14px]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleActionClick(post.primaryAction)}
                        className="px-4 py-2 bg-[#111111] hover:bg-[#0c7866] active:scale-[0.98] text-white text-[13px] font-medium transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 group/btn"
                      >
                        <span>{post.primaryAction.label}</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
                      </button>

                      {post.secondaryAction && (
                        <button
                          onClick={() => handleActionClick(post.secondaryAction!)}
                          className="text-[13px] text-[#2b2b28] hover:text-[#111111] font-medium transition-colors cursor-pointer"
                        >
                          {post.secondaryAction.label} →
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 ml-auto text-[13px]">
                      <button
                        onClick={() => {
                          sounds.playClick()
                          setActiveModalPost(post)
                        }}
                        className="text-[#064e43] font-medium hover:underline cursor-pointer"
                      >
                        Read dispatch
                      </button>
                      <span className="text-[#2b2b28]/30">·</span>
                      <a
                        href={post.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#064e43] hover:underline font-medium"
                      >
                        Facebook ↗
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls keeping it compact and aligned */}
            {totalWirePages > 1 && (
              <div className="flex items-center justify-between p-4 bg-[#f7f7f5] text-[13px]">
                <span className="text-[#2b2b28]">
                  Page {wirePage + 1} of {totalWirePages} ({listPosts.length} total dispatches)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={wirePage === 0}
                    onClick={() => {
                      sounds.playClick()
                      setWirePage((p) => Math.max(0, p - 1))
                    }}
                    className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                      wirePage === 0
                        ? 'bg-[#ecece9] text-[#2b2b28]/40 cursor-not-allowed'
                        : 'bg-[#111111] text-white hover:bg-[#2b2b28]'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={wirePage >= totalWirePages - 1}
                    onClick={() => {
                      sounds.playClick()
                      setWirePage((p) => Math.min(totalWirePages - 1, p + 1))
                    }}
                    className={`px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                      wirePage >= totalWirePages - 1
                        ? 'bg-[#ecece9] text-[#2b2b28]/40 cursor-not-allowed'
                        : 'bg-[#111111] text-white hover:bg-[#2b2b28]'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Facebook Post Reader Modal */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#f7f7f5] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center font-serif text-lg font-bold">
                  U
                </div>
                <div>
                  <div className="font-serif text-[17px] font-medium text-[#111111] flex items-center gap-1.5">
                    <span>United Youth Forum of Science and Research - UYFSR</span>
                    <ShieldCheck className="w-4 h-4 text-[#064e43]" />
                  </div>
                  <div className="text-[13px] text-[#2b2b28]/70">
                    Published {activeModalPost.date} · Official Broadcast
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalPost(null)}
                className="w-8 h-8 rounded-full bg-[#ecece9] hover:bg-[#111111] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Post Title & Category */}
            <div>
              <span className="text-[13px] font-medium text-[#064e43]">
                {activeModalPost.category}
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#111111] mt-1">
                {activeModalPost.title}
              </h3>
            </div>

            {/* Full Post Body */}
            <div className="text-[15px] text-[#2b2b28] leading-relaxed whitespace-pre-line bg-[#ecece9] p-5">
              {activeModalPost.fullContent}
            </div>

            {/* Post Stats */}
            <div className="flex items-center gap-5 text-[14px] text-[#2b2b28]/80 py-2">
              <span className="font-medium text-[#111111]">
                {activeModalPost.likes} Reactions
              </span>
              <span className="font-medium text-[#111111]">
                {activeModalPost.comments} Comments
              </span>
              <span className="font-medium text-[#111111]">
                {activeModalPost.shares} Shares
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={activeModalPost.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#064e43] hover:bg-[#0c7866] text-white text-[14px] font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Open on facebook.com/uyfsr</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  setActiveModalPost(null)
                  handleActionClick(activeModalPost.primaryAction)
                }}
                className="px-5 py-2.5 bg-[#111111] hover:bg-[#0c7866] text-white text-[14px] font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>{activeModalPost.primaryAction.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
