import React, { useState, useEffect } from 'react'
import { sounds } from '../lib/audio'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  onOpenJoin: () => void
  onOpenLogin: () => void
  currentOfficer?: string | null
  onOpenDashboard?: () => void
  onLogout?: () => void
}

const OFFICER_PHOTOS: Record<string, string> = {
  'Khaled Saifullah Rohan': '/images/executives/khaled-saifullah-rohan-adviser.jpeg',
  'Mustafiz Bin Jihad': '/images/executives/mustafiz-bin-jihad-ceo.jpeg',
  'Fahim Samiul Islam': '/images/executives/fahim-samiul-islam-dceo.jpeg',
  'Shahriar Mejba': '/images/executives/shahriar-mejba-coo.jpeg',
  'Dalia Sultana Joty': '/images/executives/dalia-sultana-joty-cco.jpeg',
  'Jarin Tasnim': '/images/executives/jarin-tasnim-cmo.jpeg',
  'Shahriyar Tashkir': '/images/executives/shahriyar-tashkir-cto.jpg',
  'Soyaib Islam': '/images/executives/soyaib-islam-cro.jpeg',
  'Md Nabil Tahmid': '/images/executives/md-nabil-tahmid-chro.jpeg',
  'Oasimul Rafin': '/images/executives/oasimul-rafin-adviser.jpeg',
  'Taki Al Zaki': '/images/executives/taki-al-zaki-secretary-of-technology.jpg'
}

function getOfficerPhoto(name?: string | null): string {
  if (!name) return '/images/executives/khaled-saifullah-rohan-adviser.jpeg'
  const trimmed = name.trim().toLowerCase()
  const found = Object.keys(OFFICER_PHOTOS).find(
    (k) => k.toLowerCase() === trimmed || trimmed.includes(k.toLowerCase()) || k.toLowerCase().includes(trimmed)
  )
  return found ? OFFICER_PHOTOS[found] : '/images/executives/khaled-saifullah-rohan-adviser.jpeg'
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenJoin,
  onOpenLogin,
  currentOfficer,
  onOpenDashboard,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Activities', href: '#activities' },
    { label: 'Events', href: '#events' },
    { label: 'News', href: '#news' },
    { label: 'Partners', href: '#partners' },
    { label: 'Teams', href: '#leadership' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f7f7f5]/92 backdrop-blur-md shadow-xs py-2.5 sm:py-3 border-b border-[#dcdcd8]'
          : 'bg-[#f7f7f5] py-4 sm:py-5 border-b border-[#ecece9]'
      }`}
    >
      {/* Main Masthead Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-2 sm:gap-3">
        {/* Wordmark with Academic Seal Typography */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-baseline gap-2.5">
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              UYFSR
            </span>
          </a>
        </div>

        {/* Clean Editorial Links with Animated Line on Hover (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[14px] font-medium text-[#2b2b28]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-[#2b2b28] hover:text-[#111111] transition-colors group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#111111] transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Controls: Join, Executive Login/Portal, and Far-Right Circular Photo Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!currentOfficer && (
            <button
              onClick={() => {
                sounds.playClick()
                onOpenLogin()
              }}
              className="hidden sm:inline-flex h-10 px-4 items-center justify-center text-[13px] sm:text-[14px] text-[#111111] hover:text-white bg-transparent hover:bg-[#111111] border border-[#111111] font-medium transition-colors cursor-pointer shrink-0"
            >
              Executive Portal
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick()
              onOpenJoin()
            }}
            className="h-10 px-3 sm:px-5 flex items-center justify-center bg-[#0c7866] hover:bg-[#095f51] text-white font-medium text-[13px] sm:text-[14px] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            Join the Event
          </button>

          {/* Far-Right: Clean circular avatar matching the exact button height (40px) */}
          {currentOfficer && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick()
                onOpenDashboard?.()
              }}
              title={`${currentOfficer} · Open Executive Workspace`}
              aria-label={`${currentOfficer} Profile`}
              className="w-10 h-10 rounded-full overflow-hidden border border-[#111111]/30 hover:border-[#0c7866] hover:ring-2 hover:ring-[#0c7866]/30 transition-all cursor-pointer shrink-0 p-0 shadow-sm block focus:outline-none"
            >
              <img
                src={getOfficerPhoto(currentOfficer)}
                alt={currentOfficer}
                className="w-full h-full object-cover object-top"
              />
            </button>
          )}

          {/* Mobile Menu Toggle Button (Hamburger 3 Lines / Close Icon) */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick()
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden h-10 w-10 flex items-center justify-center text-[#111111] bg-[#ecece9] hover:bg-[#e4e4e0] transition-colors cursor-pointer shrink-0 rounded-xs"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#111111]" /> : <Menu className="w-5 h-5 text-[#111111]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f7f7f5] px-4 sm:px-8 py-4 sm:py-5 border-t border-[#e5e5e0] transition-all animate-fade-scale shadow-lg">
          {/* Main Navigation Links */}
          <nav className="grid grid-cols-2 gap-y-2 gap-x-4 text-left pb-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[15px] font-medium text-[#111111] hover:text-[#0c7866] transition-colors relative group w-fit min-h-[40px] flex items-center"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0c7866] transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Clean Executive Access Section */}
          <div className="pt-4 border-t border-[#e5e5e0]">
            {currentOfficer ? (
              <div className="flex items-center justify-between gap-3 bg-white p-3 border border-[#ecece9]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={getOfficerPhoto(currentOfficer)}
                    alt={currentOfficer}
                    className="w-8 h-8 rounded-full object-cover border border-[#0c7866]"
                  />
                  <div className="min-w-0 text-left">
                    <div className="text-[13px] font-semibold text-[#111111] truncate">{currentOfficer}</div>
                    <div className="text-[11px] text-[#0c7866] font-medium tracking-wide">Executive Session Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playClick()
                      setMobileMenuOpen(false)
                      onOpenDashboard?.()
                    }}
                    className="px-3 py-1.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Dashboard →
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick()
                      setMobileMenuOpen(false)
                      onLogout?.()
                    }}
                    title="Sign out"
                    className="p-1.5 text-red-600 hover:bg-red-50 text-[12px] transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick()
                  setMobileMenuOpen(false)
                  onOpenLogin()
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#ecece9] border border-[#dcdcd8] text-[#111111] text-[13.5px] font-medium transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0c7866]" />
                  <span>Executive Portal</span>
                </div>
                <span className="text-[12px] text-[#2b2b28]/70 group-hover:text-[#111111] font-medium flex items-center gap-1">
                  Login &rarr;
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
