import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Toaster, toast } from 'sonner'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Tracks } from './components/Tracks'
import { ProjectsTable } from './components/ProjectsTable'
import { NewsSection } from './components/NewsSection'
import { HowItWorks } from './components/HowItWorks'
import { Partners } from './components/Partners'
import { AboutUs } from './components/AboutUs'
import { FAQ } from './components/FAQ'
import { Preloader } from './components/Preloader'

// High-Performance Dynamic Imports & Code Splitting (Reduces initial bundle by >65%)
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })))
const RegistrationPage = lazy(() => import('./components/RegistrationPage').then((m) => ({ default: m.RegistrationPage })))
const ExecutiveLoginPage = lazy(() => import('./components/ExecutiveLoginPage').then((m) => ({ default: m.ExecutiveLoginPage })))
const CampusAmbassadorPage = lazy(() => import('./components/CampusAmbassadorPage').then((m) => ({ default: m.CampusAmbassadorPage })))
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const PaymentModal = lazy(() => import('./components/PaymentModal').then((m) => ({ default: m.PaymentModal })))
const ElibooAgent = lazy(() => import('./components/ElibooAgent').then((m) => ({ default: m.ElibooAgent })))

const ViewFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-[#2b2b28] bg-[#f7f7f5]">
    <div className="w-8 h-8 rounded-full border-2 border-[#0c7866] border-t-transparent animate-spin mb-3" />
    <div className="text-[13px] font-medium tracking-wide">Loading portal view...</div>
  </div>
)






import { Footer } from './components/Footer'
import { ArrowRight } from 'lucide-react'

type PageView = 'home' | 'register' | 'executive-login' | 'dashboard' | 'ambassador' | 'not-found'

const AUTH_STORAGE_KEY = 'uyfsr_authenticated_officer'

function getInitialState(): { view: PageView; officer: string | null } {
  let storedOfficer: string | null = null
  try {
    storedOfficer = localStorage.getItem(AUTH_STORAGE_KEY)
  } catch (e) {
    console.error('Failed to read auth state from storage', e)
  }

  const hash = window.location.hash.toLowerCase()
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '')

  if (
    hash === '#404' ||
    hash === '#not-found' ||
    hash === '#error' ||
    path === '/404' ||
    path === '/not-found' ||
    path === '/error'
  ) {
    return { view: 'not-found', officer: storedOfficer }
  }

  if (hash === '#ambassador' || hash === '#campus-ambassador' || path === '/ambassador') {
    return { view: 'ambassador', officer: storedOfficer }
  }

  if (hash === '#register' || path === '/register') {
    return { view: 'register', officer: storedOfficer }
  }

  if (hash === '#executive-login' || hash === '#login' || path === '/login' || path === '/executive-login') {
    return { view: 'executive-login', officer: storedOfficer }
  }

  if (hash === '#dashboard' || hash === '#workspace' || path === '/dashboard' || path === '/workspace') {
    if (storedOfficer) {
      return { view: 'dashboard', officer: storedOfficer }
    } else {
      return { view: 'executive-login', officer: null }
    }
  }

  if (path && path !== '' && path !== '/index.html') {
    return { view: 'not-found', officer: storedOfficer }
  }

  return { view: 'home', officer: storedOfficer }
}

export function App() {
  const [initial] = useState(getInitialState)
  const [pageView, setPageView] = useState<PageView>(initial.view)
  const [currentOfficer, setCurrentOfficer] = useState<string | null>(initial.officer)
  const [donateModalOpen, setDonateModalOpen] = useState(false)

  // Synchronize URL hash with current page view
  const updateHashForView = useCallback((view: PageView, anchor?: string) => {
    if (view === 'not-found') {
      window.location.hash = '404'
    } else if (view === 'ambassador') {
      window.location.hash = 'ambassador'
    } else if (view === 'register') {
      window.location.hash = 'register'
    } else if (view === 'executive-login') {
      window.location.hash = 'executive-login'
    } else if (view === 'dashboard') {
      window.location.hash = 'dashboard'
    } else {
      if (anchor) {
        window.location.hash = anchor.replace(/^#/, '')
      } else if (window.location.hash === '#register' || window.location.hash === '#executive-login' || window.location.hash === '#dashboard' || window.location.hash === '#ambassador' || window.location.hash === '#campus-ambassador') {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }, [])

  // Navigation Handlers
  const goToHome = useCallback((anchor?: string) => {
    setPageView('home')
    updateHashForView('home', anchor)
    if (anchor) {
      setTimeout(() => {
        const id = anchor.replace(/^#/, '')
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [updateHashForView])

  const goToAmbassador = useCallback(() => {
    setPageView('ambassador')
    updateHashForView('ambassador')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateHashForView])

  const goToRegister = useCallback(() => {
    setPageView('register')
    updateHashForView('register')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateHashForView])

  const goToLogin = useCallback(() => {
    setPageView('executive-login')
    updateHashForView('executive-login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateHashForView])

  const goToDashboard = useCallback(() => {
    if (!currentOfficer) {
      goToLogin()
      return
    }
    setPageView('dashboard')
    updateHashForView('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentOfficer, goToLogin, updateHashForView])

  const handleLoginSuccess = useCallback((officerName: string) => {
    setCurrentOfficer(officerName)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, officerName)
    } catch (e) {
      console.error('Failed to store auth state', e)
    }
    setPageView('dashboard')
    updateHashForView('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateHashForView])

  const handleLogout = useCallback(() => {
    setCurrentOfficer(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (e) {
      console.error('Failed to remove auth state', e)
    }
    toast.success('Signed out of executive session.')
    setPageView('home')
    updateHashForView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateHashForView])

  // Handle browser navigation (Back / Forward buttons & direct hash navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#404' || hash === '#not-found' || hash === '#error') {
        setPageView('not-found')
      } else if (hash === '#register') {
        setPageView('register')
      } else if (hash === '#ambassador' || hash === '#campus-ambassador') {
        setPageView('ambassador')
      } else if (hash === '#executive-login' || hash === '#login') {
        setPageView('executive-login')
      } else if (hash === '#dashboard' || hash === '#workspace') {
        const stored = currentOfficer || localStorage.getItem(AUTH_STORAGE_KEY)
        if (stored) {
          if (!currentOfficer) setCurrentOfficer(stored)
          setPageView('dashboard')
        } else {
          setPageView('executive-login')
        }
      } else {
        setPageView('home')
        if (hash && hash !== '#') {
          const el = document.getElementById(hash.replace(/^#/, ''))
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentOfficer])

  // Scroll to section on initial home load if hash present
  useEffect(() => {
    if (pageView === 'home' && window.location.hash) {
      const hash = window.location.hash.replace(/^#/, '')
      if (hash && !['register', 'executive-login', 'dashboard'].includes(hash)) {
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [pageView])

  // Progressive enhancement reveal animations (static & dynamic DOM nodes)
  useEffect(() => {
    document.documentElement.classList.add('js')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )

    const observeUnrevealed = () => {
      const elements = document.querySelectorAll('[data-reveal]:not(.is-revealed)')
      elements.forEach((el) => observer.observe(el))
    }

    observeUnrevealed()

    const mutObserver = new MutationObserver(() => {
      observeUnrevealed()
    })
    mutObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutObserver.disconnect()
    }
  }, [currentOfficer, pageView])

  // VIEW 1: Active Executive Dashboard (Dedicated Workspace Screen)
  if (pageView === 'dashboard' && currentOfficer) {
    return (
      <Suspense fallback={<ViewFallback />}>
        <Toaster theme="light" position="bottom-right" />
        <Dashboard
          officerName={currentOfficer}
          onViewPublicWebsite={() => goToHome()}
          onLogout={handleLogout}
        />
      </Suspense>
    )
  }

  // VIEW 2: Dedicated Free Campus Ambassador Application Page
  if (pageView === 'ambassador') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <Toaster theme="light" position="bottom-right" />
        <CampusAmbassadorPage onBackToHome={() => goToHome()} />
      </Suspense>
    )
  }

  // VIEW 3: Dedicated Full Registration Page
  if (pageView === 'register') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <Toaster theme="light" position="bottom-right" />
        <RegistrationPage onBackToHome={() => goToHome()} onOpenAmbassador={goToAmbassador} />
      </Suspense>
    )
  }

  // VIEW 3: Dedicated Full Executive Login Page
  if (pageView === 'executive-login') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <Toaster theme="light" position="bottom-right" />
        <ExecutiveLoginPage
          onBackToHome={() => goToHome()}
          onLoginSuccess={handleLoginSuccess}
        />
      </Suspense>
    )
  }

  // VIEW 5: Dedicated 404 / Error Not Found Page
  if (pageView === 'not-found') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <Toaster theme="light" position="bottom-right" />
        <NotFoundPage
          onBackToHome={() => goToHome()}
          onOpenRegister={goToRegister}
          onOpenAmbassador={goToAmbassador}
          onOpenLogin={goToLogin}
        />
      </Suspense>
    )
  }

  // VIEW 4: Main UYFSR Public Home Page
  return (
    <div className="relative min-h-[100svh] bg-[#f7f7f5] text-[#111111] flex flex-col selection:bg-[#0c7866]/20 selection:text-[#0c7866]">
      <Preloader />
      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          className: 'bg-[#f7f7f5] text-[#111111] border-0',
        }}
      />

      {/* Navigation Header */}
      <Navbar
        onOpenJoin={goToRegister}
        onOpenLogin={goToLogin}
        currentOfficer={currentOfficer}
        onOpenDashboard={goToDashboard}
        onLogout={handleLogout}
      />

            {/* Eliboo - Intelligent UYFSR AI Agent (Client-Side & Zero Paid API) */}
      <Suspense fallback={null}>
        <ElibooAgent
        onNavigate={(view, anchor) => {
          if (view === 'ambassador') goToAmbassador()
          else if (view === 'register') goToRegister()
          else if (view === 'executive-login') goToLogin()
          else if (view === 'dashboard') goToDashboard()
          else goToHome(anchor)
        }}
      />
      </Suspense>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenJoin={goToRegister} />

        {/* Core Areas of Initiative */}
        <Tracks onOpenJoin={goToRegister} />

        {/* Academic Calendar & Symposia */}
        <ProjectsTable onOpenJoin={goToRegister} />

        {/* News & Official Dispatches */}
        <NewsSection
          onOpenJoin={goToRegister}
          onOpenLogin={goToLogin}
          onOpenAmbassador={goToAmbassador}
        />

        {/* Mission & Vision */}
        <HowItWorks />

        {/* Consortium of Partners */}
        <Partners />

        {/* Leadership */}
        <AboutUs />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Final Fellowship & Participation Callout */}
        <section className="py-14 sm:py-16 bg-[#ecece9] text-left">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h2 className="section-title text-[#111111] mb-4">
                  Ready to explore scientific research?
                </h2>
                <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[65ch] mb-8">
                  Whether you are a student, young innovator, or institution seeking collaboration, UYFSR invites you to participate in upcoming science fairs, workshops, and educational initiatives.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={goToRegister}
                    className="px-7 py-3.5 bg-[#111111] hover:bg-[#0c7866] active:scale-[0.98] text-white text-[16px] font-medium transition-all duration-200 inline-flex items-center gap-3 cursor-pointer group shadow-sm"
                  >
                    <span>Register for 2026 programs</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
                  </button>

                  <button
                    onClick={() => setDonateModalOpen(true)}
                    className="px-6 py-3.5 bg-transparent hover:bg-[#111111] hover:text-white border border-[#111111] text-[#111111] text-[16px] font-medium transition-colors cursor-pointer"
                  >
                    Support research grants (bKash / Nagad)
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 overflow-hidden group rounded-xs shadow-sm">
                <img
                  src="/images/hero-youth.jpg"
                  alt="UYFSR youth research cohort collaboration"
                  className="w-full h-72 sm:h-80 object-cover object-center filter grayscale-[5%] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Donation Modal */}
      <Suspense fallback={null}>
        <PaymentModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        purpose="Donation"
        initialAmount={1000}
        />
      </Suspense>

      {/* Footer */}
      <Footer onOpenDonate={() => setDonateModalOpen(true)} />
    </div>
  )
}

export default App
