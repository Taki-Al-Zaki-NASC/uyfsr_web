import React, { useState } from 'react'
import {
  ArrowLeft,
  Home,
  Compass,
  GraduationCap,
  Award,
  ShieldCheck,
  Search,
  Mail,
  Copy,
  CheckCircle2,
  AlertCircle,
  Phone
} from 'lucide-react'
import { sounds } from '../lib/audio'
import { toast } from 'sonner'
import { apiTrackApplication } from '../lib/api'
import { LumaDotBackground } from './effects/LumaDotBackground'

interface NotFoundPageProps {
  onBackToHome: () => void
  onOpenRegister: () => void
  onOpenAmbassador: () => void
  onOpenLogin: () => void
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onBackToHome,
  onOpenRegister,
  onOpenAmbassador,
  onOpenLogin
}) => {
  const [trackingId, setTrackingId] = useState('')
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [trackingError, setTrackingError] = useState<string | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanId = trackingId.trim()
    if (!cleanId) return

    sounds.playClick()
    setTrackingLoading(true)
    setTrackingError(null)
    setTrackingResult(null)

    try {
      const res = await apiTrackApplication(cleanId)
      if (res && res.success && res.application) {
        setTrackingResult(res.application)
        sounds.playSuccess()
      } else {
        setTrackingError('No registration record found for this Tracking ID.')
      }
    } catch (err: any) {
      setTrackingError(err.message || 'Tracking ID not found in UYFSR registry.')
    } finally {
      setTrackingLoading(false)
    }
  }

  const handleCopyEmail = () => {
    sounds.playSuccess()
    navigator.clipboard?.writeText('uyfsr.org@gmail.com')
    setCopiedEmail(true)
    toast.success('Official secretariat email copied: uyfsr.org@gmail.com')
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  return (
    <div className="relative min-h-[100svh] bg-[#f7f7f5] text-[#111111] flex flex-col font-sans selection:bg-[#0c7866]/20 selection:text-[#0c7866]">
      {/* Background Subtle Luma Canvas */}
      <LumaDotBackground
        className="opacity-45 pointer-events-none"
        dotColor="12, 120, 102"
        glowColor="56, 178, 172"
        dotSpacing={32}
        mouseRadius={120}
      />

      {/* Top Academic Navigation Bar */}
      <header className="relative z-10 w-full border-b border-[#ecece9] bg-[#f7f7f5]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick()
              onBackToHome()
            }}
            className="flex items-center gap-2 text-[13px] font-medium text-[#2b2b28] hover:text-[#0c7866] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Main Platform</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#666663]">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>UYFSR GATEWAY · 404 RES</span>
        </div>
      </header>

      {/* Main Editorial Content Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto w-full text-center">
        {/* Academic Status Stamp */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecece9]/70 border border-[#deded9] text-[11px] font-mono tracking-widest uppercase text-[#555552] mb-6">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>HTTP 404 · Resource Not Resolved · Page Not Found</span>
        </div>

        {/* Large Typography Hero */}
        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-semibold tracking-tight text-[#111111] mb-2 select-none">
          4<span className="text-[#0c7866]">0</span>4
        </h1>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#111111] max-w-2xl leading-snug mb-4">
          The requested page could not be found
        </h2>

        <p className="text-[#2b2b28] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          The requested URL, document pathway, or resource does not exist in the central UYFSR registry, has been archived, or is undergoing institutional review. Please choose an authorized gateway below:
        </p>

        {/* Primary Navigation Hub Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mb-10 text-left">
          {/* Card 1: Main Platform */}
          <button
            onClick={() => {
              sounds.playClick()
              onBackToHome()
            }}
            className="p-4 bg-white border border-[#ecece9] hover:border-[#0c7866] hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Home className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#111111] mb-1">
                Main Portal
              </h3>
              <p className="text-xs text-[#666663] leading-relaxed">
                Return to the public portal and explore national science tracks.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#0c7866] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Return Home →
            </span>
          </button>

          {/* Card 2: Student Registration */}
          <button
            onClick={() => {
              sounds.playClick()
              onOpenRegister()
            }}
            className="p-4 bg-white border border-[#ecece9] hover:border-[#0c7866] hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#111111] mb-1">
                Join Cohort
              </h3>
              <p className="text-xs text-[#666663] leading-relaxed">
                Register for the 2026 National Scientific Research Cohort.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#0c7866] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Register Now →
            </span>
          </button>

          {/* Card 3: Campus Ambassador */}
          <button
            onClick={() => {
              sounds.playClick()
              onOpenAmbassador()
            }}
            className="p-4 bg-white border border-[#ecece9] hover:border-[#0c7866] hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#111111] mb-1">
                Ambassador
              </h3>
              <p className="text-xs text-[#666663] leading-relaxed">
                Represent UYFSR as an official ambassador at your institution.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#0c7866] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Ambassador Program →
            </span>
          </button>

          {/* Card 4: Executive Login */}
          <button
            onClick={() => {
              sounds.playClick()
              onOpenLogin()
            }}
            className="p-4 bg-white border border-[#ecece9] hover:border-[#0c7866] hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#111111] mb-1">
                Executive Portal
              </h3>
              <p className="text-xs text-[#666663] leading-relaxed">
                Access governance dashboard, verification queue, and secretariat tools.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#0c7866] mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Council Login →
            </span>
          </button>
        </div>

        {/* Live Tracking ID Resolver Utility */}
        <div className="w-full max-w-xl bg-white border border-[#ecece9] p-5 sm:p-6 mb-8 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#0c7866]">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Registration Tracking Resolver
            </span>
          </div>
          <p className="text-xs text-[#666663] mb-4">
            If you were attempting to access an application or verification link, enter your official Tracking ID below:
          </p>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. UYFSR-2026-XXXX"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#f7f7f5] border border-[#d8d8d4] focus:outline-none focus:border-[#0c7866] font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading || !trackingId.trim()}
              className="px-5 py-2.5 bg-[#0c7866] hover:bg-[#095f51] disabled:opacity-50 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{trackingLoading ? 'Searching...' : 'Track Status'}</span>
            </button>
          </form>

          {/* Tracking Result Display */}
          {trackingResult && (
            <div className="mt-4 p-3.5 bg-[#f0f8f6] border border-[#a3dfd3] text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-sm font-medium text-[#0c7866]">
                  {trackingResult.name}
                </span>
                <span className="px-2 py-0.5 bg-[#0c7866] text-white text-[11px] font-mono uppercase tracking-wider">
                  {trackingResult.status}
                </span>
              </div>
              <p className="text-xs text-[#2b2b28]">
                <strong>Program:</strong> {trackingResult.program || 'Research Cohort 2026'} ·{' '}
                <strong>Tracking:</strong> <span className="font-mono">{trackingResult.trackingId}</span>
              </p>
            </div>
          )}

          {trackingError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{trackingError}</span>
            </div>
          )}
        </div>

        {/* Secretariat Direct Contact & Assistance */}
        <div className="text-xs text-[#666663] max-w-lg mx-auto flex flex-col items-center gap-2">
          <span>Need immediate assistance? Contact the Central Secretariat:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#deded9] hover:border-[#0c7866] text-[#2b2b28] hover:text-[#0c7866] transition-colors cursor-pointer text-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#0c7866]" />
              <span className="font-mono">uyfsr.org@gmail.com</span>
              {copiedEmail ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0c7866]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#888884]" />
              )}
            </button>
            <a
              href="tel:+8801824798147"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#deded9] hover:border-[#0c7866] text-[#2b2b28] hover:text-[#0c7866] transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#0c7866]" />
              <span className="font-mono">+880 1824-798147</span>
            </a>
          </div>
        </div>
      </main>

      {/* Institutional Academic Footer Stamp */}
      <footer className="relative z-10 w-full border-t border-[#ecece9] bg-[#f7f7f5] py-4 px-4 text-center text-xs text-[#888884]">
        <span>
          United Youth Forum of Science and Research (UYFSR) · Founded 30 May 2025 · Dhaka, Bangladesh
        </span>
      </footer>
    </div>
  )
}
