import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  ArrowLeft,
  Clock,
  Search,
  LogOut,
  Send,
  Copy,
  RotateCw,
  Plus,
  Check,
  Calendar,
  Ticket,
  ShieldCheck,
  Video,
  FileText,
  Lock,
  Mail,
  MailCheck,
  Eye,
  Users,
  X,
  Trash2,
  Edit3,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'
import { sounds } from '../lib/audio'
import { CVModal } from './CVModal'
import { ApplicantDetailModal } from './ApplicantDetailModal'
import { ExecutiveProfileModal } from './ExecutiveProfileModal'
import { CeoCmsPanel } from './CeoCmsPanel'
import {
  apiApproveSubmission,
  apiRejectSubmission,
  apiGenerateVoucher,
  apiSendMessage,
  apiGetMessages,
  apiScheduleMeeting,
  apiDeleteMeeting,
  apiDeleteApplication,
  apiDeleteVoucher,
  apiDeleteMessage,
  apiGetApplications,
  apiUpdateApplicationStatus,
  apiGetVouchers,
  apiGetMeetings,
  apiSendApplicantEmail,
  apiToggleMailedStatus,
  apiGetPendingExecutives,
  type SiteContentData,
  type ExecutiveProfileData
} from '../lib/api'

interface DashboardProps {
  officerName: string
  onViewPublicWebsite: () => void
  onLogout: () => void
  onSiteContentUpdated?: (content: SiteContentData, news?: any[]) => void
}

type ExecutiveTier = 'Executive Council' | 'Advisors' | 'Senior Executive' | 'Sub-Executive'

interface ExecutiveProfile {
  id: string
  name: string
  rankTier: ExecutiveTier
  title: string
  department: string
  email: string
  phone: string
  dob?: string
  bio?: string
  facebookUrl?: string
  image: string
  issueDate: string
  clearanceLevel: string
  isCEO?: boolean
  portfolioTasks: {
    id: string
    title: string
    deadline: string
    priority: 'High' | 'Normal'
    status: 'Completed' | 'In Progress' | 'Pending'
  }[]
}

const executiveTeam: ExecutiveProfile[] = [
  {
    id: 'UYFSR-ADV-001',
    name: 'Khaled Saifullah Rohan',
    rankTier: 'Advisors',
    title: 'Adviser',
    department: 'Advisory Board & Strategic Guidance',
    email: 'rohan232619@gmail.com',
    phone: '+880 1736-309347',
    image: '/images/executives/khaled-saifullah-rohan-adviser.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Advisory Board',
    portfolioTasks: [
      { id: 'T-ADV-01', title: 'Institutional policy guidance and scientific council charter review', deadline: '20 Nov 2026', priority: 'High', status: 'Completed' },
      { id: 'T-ADV-02', title: 'Advisory council strategic consultation with national academic partners', deadline: '05 Dec 2026', priority: 'High', status: 'In Progress' }
    ]
  },
  {
    id: 'UYFSR-CP-001',
    name: 'Mustafiz Bin Jihad',
    rankTier: 'Executive Council',
    title: 'Chief Executive Officer (CEO)',
    department: 'Executive Council & Strategic Vision',
    email: 'mostafizbinjihad@gmail.com',
    phone: '+880 1824-798147',
    image: '/images/executives/mustafiz-bin-jihad-ceo.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council (Sole Approval Authority)',
    isCEO: true,
    portfolioTasks: [
      { id: 'T-01', title: 'National Science Eclipse 2026 university host MOU ratification', deadline: '15 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-02', title: 'Formalize media partnership renewal with TezzFeed and Bayline', deadline: '20 Nov 2026', priority: 'High', status: 'Completed' },
      { id: 'T-03', title: 'Chair quarterly Executive Council review of regional chapters', deadline: '05 Dec 2026', priority: 'Normal', status: 'Pending' }
    ]
  },
  {
    id: 'UYFSR-CP-002',
    name: 'Fahim Samiul Islam',
    rankTier: 'Executive Council',
    title: 'Deputy Chief Executive Officer (DCEO)',
    department: 'Executive Directorate & Program Operations',
    email: 'samiulislamfahim8@gmail.com',
    phone: '+880 1303-290971',
    image: '/images/executives/fahim-samiul-islam-dceo.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-DCEO-01', title: 'Coordinate nationwide youth program operations and regional chapter leadership', deadline: '18 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-DCEO-02', title: 'Facilitate executive directorate oversight for university cohorts', deadline: '02 Dec 2026', priority: 'Normal', status: 'Completed' }
    ]
  },
  {
    id: 'UYFSR-CP-003',
    name: 'Shahriar Mejba',
    rankTier: 'Executive Council',
    title: 'Chief Operating Officer (COO)',
    department: 'Operations & Council Governance',
    email: 'mejbaacps2007@gmail.com',
    phone: '+880 1410-581821',
    image: '/images/executives/shahriar-mejba-coo.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-04', title: 'Standardize operations and chapter governance guidelines', deadline: '18 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-05', title: 'Audit volunteer registrations across regional division cohorts', deadline: '30 Nov 2026', priority: 'Normal', status: 'Completed' }
    ]
  },
  {
    id: 'UYFSR-CP-004',
    name: 'Dalia Sultana Joty',
    rankTier: 'Executive Council',
    title: 'Chief Communications Officer (CCO)',
    department: 'Communications & Public Relations',
    email: 'daliajoty@gmail.com',
    phone: '+880 1333-623162',
    image: '/images/executives/dalia-sultana-joty-cco.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-06', title: 'Coordinate national media communications and organizational press releases', deadline: '14 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-07', title: 'Oversee institutional communications channels and stakeholder broadcasts', deadline: '25 Nov 2026', priority: 'High', status: 'Completed' }
    ]
  },
  {
    id: 'UYFSR-CP-005',
    name: 'Jarin Tasnim',
    rankTier: 'Executive Council',
    title: 'Chief Management Officer (CMO)',
    department: 'Management Operations & Public Affairs',
    email: 'parkjarinot7@gmail.com',
    phone: '+880 1333-623162',
    image: '/images/executives/jarin-tasnim-cmo.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-JT-01', title: 'Direct organizational management workflows and inter-institutional communications', deadline: '16 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-JT-02', title: 'Manage youth cohort public affairs and community outreach', deadline: '26 Nov 2026', priority: 'Normal', status: 'Completed' }
    ]
  },
  {
    id: 'UYFSR-CP-006',
    name: 'Shahriyar Tashkir',
    rankTier: 'Executive Council',
    title: 'Chief Technology Officer (CTO)',
    department: 'Technology & Digital Infrastructure',
    email: 'tashkir2006@gmail.com',
    phone: '+880 1349-359808',
    image: '/images/executives/shahriyar-tashkir-cto.jpg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-08', title: 'Deploy candidate portal and database automation engine', deadline: '10 Nov 2026', priority: 'High', status: 'Completed' },
      { id: 'T-09', title: 'Audit digital systems security and high-concurrency uptime', deadline: '22 Nov 2026', priority: 'High', status: 'In Progress' }
    ]
  },
  {
    id: 'UYFSR-CP-007',
    name: 'Soyaib Islam',
    rankTier: 'Executive Council',
    title: 'Chief Research Officer (CRO)',
    department: 'Research Strategy & Scientific Development',
    email: 'soyaib248@gmail.com',
    phone: '+880 1349-359808',
    image: '/images/executives/soyaib-islam-cro.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-10', title: 'Standardize research ethics and peer methodology clinics syllabus', deadline: '15 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-11', title: 'Curate academic juries and research evaluation rubrics for Eclipse 2026', deadline: '24 Nov 2026', priority: 'High', status: 'Completed' }
    ]
  },
  {
    id: 'UYFSR-CP-008',
    name: 'Md Nabil Tahmid',
    rankTier: 'Executive Council',
    title: 'Chief Human Resources Officer (CHRO)',
    department: 'Human Resources & Talent Development',
    email: 'hassantahmid312@gmail.com',
    phone: '+880 1617-607048',
    image: '/images/executives/md-nabil-tahmid-chro.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Executive Council',
    portfolioTasks: [
      { id: 'T-NT-01', title: 'Lead human capital talent management and nationwide campus ambassador cohort recruitment', deadline: '12 Nov 2026', priority: 'High', status: 'Completed' },
      { id: 'T-NT-02', title: 'Facilitate executive talent appraisals and council welfare', deadline: '27 Nov 2026', priority: 'Normal', status: 'In Progress' }
    ]
  },
  {
    id: 'UYFSR-ADV-002',
    name: 'Oasimul Rafin',
    rankTier: 'Advisors',
    title: 'Adviser',
    department: 'Advisory Board & Academic Oversight',
    email: 'Oasimulrafin@gmail.com',
    phone: '+880 1855-052383',
    image: '/images/executives/oasimul-rafin-adviser.jpeg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 4 · Advisory Board',
    portfolioTasks: [
      { id: 'T-ADV-03', title: 'Academic curriculum oversight and research ethics evaluation', deadline: '19 Nov 2026', priority: 'High', status: 'In Progress' }
    ]
  },
  {
    id: 'UYFSR-SEC-001',
    name: 'Taki Al Zaki',
    rankTier: 'Senior Executive',
    title: 'Secretary of Technology',
    department: 'Technology & Digital Systems',
    email: 'ktahan629@gmail.com',
    phone: '+880 1911-287501',
    image: '/images/executives/taki-al-zaki-secretary-of-technology.jpg',
    issueDate: '30 May 2025',
    clearanceLevel: 'Clearance Tier 2 · Technical Secretariat',
    portfolioTasks: [
      { id: 'T-SEC-01', title: 'Coordinate technological implementation for scientific cohorts', deadline: '15 Nov 2026', priority: 'High', status: 'In Progress' },
      { id: 'T-SEC-02', title: 'Manage server diagnostics and frontend component responsiveness', deadline: '28 Nov 2026', priority: 'Normal', status: 'Completed' }
    ]
  }
]

export type ApplicantStatus = 'Approved' | 'Reviewing' | 'Pending' | 'Rejected'

interface Applicant {
  id: string
  name: string
  institution: string
  program: string
  proposal: string
  date: string
  status: ApplicantStatus
  email?: string
  phone?: string
  paymentStatus?: 'paid' | 'waived' | 'pending'
  mfsMethod?: string
  mfsTrxId?: string
  mfsPhone?: string
  category?: string
  voucherCode?: string
  referredBy?: string
  mailed?: boolean
  mailedAt?: string
  mailedBy?: string
}

const initialApplicants: Applicant[] = []

interface ChatMessage {
  id: string
  channel: 'general' | 'eclipse-ops' | 'secretariat'
  senderName: string
  senderTier: ExecutiveTier
  senderImage: string
  message: string
  timestamp: string
}

const initialMessages: ChatMessage[] = []

interface VoucherRedemption {
  applicantId: string
  name: string
  email: string
  program?: string
  usedAt: string
}

interface Voucher {
  code: string
  candidateName: string
  targetRole: string
  issuedBy: string
  creatorRole?: string
  issuerTier: ExecutiveTier
  issuedDate: string
  status: 'Active' | 'Redeemed' | 'Exhausted'
  maxUses?: number
  usedCount?: number
  discount?: string
  redemptions?: VoucherRedemption[]
}

const initialVouchers: Voucher[] = []

interface CouncilMeeting {
  id: string
  title: string
  date: string
  time: string
  type: string
  hostName: string
  platform: string
  meetLink: string
}

const initialMeetings: CouncilMeeting[] = []

function getOfficerProfileByName(name: string): ExecutiveProfile | undefined {
  if (!name) return undefined
  const trimmed = name.trim().toLowerCase()
  return executiveTeam.find(
    (m) =>
      m.name.toLowerCase() === trimmed ||
      trimmed.includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(trimmed)
  )
}

const LS_PURGED_APPS = 'uyfsr_purged_applicant_ids'
const LS_STATUS_OVERRIDES = 'uyfsr_applicant_status_overrides'
const LS_DELETED_MEETINGS = 'uyfsr_deleted_meeting_ids'
const LS_DELETED_VOUCHERS = 'uyfsr_deleted_voucher_codes'
const LS_DELETED_MESSAGES = 'uyfsr_deleted_message_ids'

function getLocalSet(key: string): Set<string> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set<string>()
}

function addToLocalSet(key: string, item: string) {
  try {
    if (typeof window === 'undefined') return
    const current = getLocalSet(key)
    current.add(item)
    localStorage.setItem(key, JSON.stringify(Array.from(current)))
  } catch {}
}

function getLocalMap<T>(key: string): Record<string, T> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function setLocalMapItem<T>(key: string, id: string, val: T) {
  try {
    if (typeof window === 'undefined') return
    const map = getLocalMap<T>(key)
    map[id] = val
    localStorage.setItem(key, JSON.stringify(map))
  } catch {}
}

export const Dashboard: React.FC<DashboardProps> = ({
  officerName,
  onViewPublicWebsite,
  onLogout,
  onSiteContentUpdated
}) => {
  // Stored backend executive profile (supports newly registered & self-edited executives!)
  const [profileOverride, setProfileOverride] = useState<Partial<ExecutiveProfileData> | null>(() => {
    try {
      const raw = localStorage.getItem('uyfsr_executive_officer')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.name && parsed.name.toLowerCase() === officerName.toLowerCase()) {
          return parsed
        }
      }
    } catch {}
    return null
  })

  // Edit My Profile modal state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [pendingExecCount, setPendingExecCount] = useState(0)

  // Current active officer profile merged with live backend data
  const staticMatch = executiveTeam.find(
    (e) => e.name.toLowerCase() === officerName.toLowerCase()
  )

  const currentProfile: ExecutiveProfile = staticMatch
    ? {
        ...staticMatch,
        name: profileOverride?.name || staticMatch.name,
        email: profileOverride?.email || staticMatch.email,
        phone: profileOverride?.phone || staticMatch.phone,
        dob: profileOverride?.dob || staticMatch.dob,
        department: profileOverride?.department || staticMatch.department,
        bio: profileOverride?.bio || staticMatch.bio,
        facebookUrl: profileOverride?.facebookUrl || staticMatch.facebookUrl,
        image: profileOverride?.photo || staticMatch.image
      }
    : {
        id: profileOverride?.ecardId || 'UYFSR-EXEC-NEW',
        name: profileOverride?.name || officerName,
        rankTier: (profileOverride?.rankTier as ExecutiveTier) || 'Senior Executive',
        title: profileOverride?.title || 'Executive Member',
        department: profileOverride?.department || 'General Secretariat',
        email: profileOverride?.email || 'uyfsr.org@gmail.com',
        phone: profileOverride?.phone || '+880 1911-287501',
        dob: profileOverride?.dob,
        bio: profileOverride?.bio,
        facebookUrl: profileOverride?.facebookUrl,
        image: profileOverride?.photo || '/images/executives/khaled-saifullah-rohan-adviser.jpeg',
        issueDate: profileOverride?.activeSince || '30 May 2025',
        clearanceLevel: 'Clearance Tier 2 · Appointed Executive',
        isCEO: Boolean(profileOverride?.isCEO),
        portfolioTasks: [
          {
            id: 'T-NEW-01',
            title: 'Complete onboarding and coordinate with assigned UYFSR department',
            deadline: '30 Nov 2026',
            priority: 'High',
            status: 'In Progress'
          }
        ]
      }

  const isCEO =
    Boolean(currentProfile.isCEO) ||
    currentProfile.name.toLowerCase().trim() === 'mustafiz bin jihad'

  // Fetch pending executive approvals count for CEO badge
  useEffect(() => {
    if (!isCEO) return
    apiGetPendingExecutives(currentProfile.name)
      .then((list) => setPendingExecCount(list.length))
      .catch(() => {})
  }, [isCEO, currentProfile.name])

  // Main active tab
  const [activeTab, setActiveTab] = useState<
    'ecard' | 'portfolio' | 'chat' | 'vouchers' | 'meetings' | 'directory' | 'applicants' | 'cms'
  >('ecard')

  // Applicant Dossier Modal
  const [selectedApplicantForDetail, setSelectedApplicantForDetail] = useState<Applicant | null>(null)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Reviewing' | 'Pending' | 'Rejected'>('All')

  // Chat auto-scroll reference
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // E-Card Flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  // CV Modal State
  const [showCVModal, setShowCVModal] = useState(false)

  // Live Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [activeChannel, setActiveChannel] = useState<'general' | 'eclipse-ops' | 'secretariat'>('general')
  const [chatInput, setChatInput] = useState('')

  // Vouchers state
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers)
  const [candidateName, setCandidateName] = useState('')
  const [targetRole, setTargetRole] = useState('Sub-Executive Nominee')
  const [selectedTrackingVoucher, setSelectedTrackingVoucher] = useState<Voucher | null>(null)

  // Meetings state
  const [meetings, setMeetings] = useState<CouncilMeeting[]>(initialMeetings)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingType, setMeetingType] = useState('Event Operations')
  const [showMeetingModal, setShowMeetingModal] = useState(false)

  // Directory state
  const [dirTierFilter, setDirTierFilter] = useState<'All' | ExecutiveTier>('All')
  const [dirSearch, setDirSearch] = useState('')

  // Portfolio Tasks state with local storage persistence per officer
  const [userTasks, setUserTasks] = useState<ExecutiveProfile['portfolioTasks']>(() => {
    try {
      const saved = localStorage.getItem(`uyfsr_tasks_${currentProfile.id}`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return currentProfile.portfolioTasks
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`uyfsr_tasks_${currentProfile.id}`)
      if (saved) {
        setUserTasks(JSON.parse(saved))
        return
      }
    } catch {}
    setUserTasks(currentProfile.portfolioTasks)
  }, [currentProfile.id])

  useEffect(() => {
    try {
      localStorage.setItem(`uyfsr_tasks_${currentProfile.id}`, JSON.stringify(userTasks))
    } catch {}
  }, [userTasks, currentProfile.id])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')

  // Applicants state (Dynamically synced with server database)
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('All')

  // Fetch real applications from central backend server
  const fetchBackendData = useCallback(async () => {
    setLoadingApplicants(true)
    try {
      const appsData = await apiGetApplications(currentProfile.name).catch(() => [])
      const purgedSet = getLocalSet(LS_PURGED_APPS)
      const statusOverrides = getLocalMap<ApplicantStatus>(LS_STATUS_OVERRIDES)

      const mappedApps: Applicant[] = (appsData || [])
        .filter((app: any) => {
          const id = app.trackingId || app.id
          return !purgedSet.has(id) && !purgedSet.has(app.id) && !purgedSet.has(app.trackingId)
        })
        .map((app: any) => {
          const id = app.trackingId || app.id
          const serverStatus = (app.status === 'approved'
            ? 'Approved'
            : app.status === 'rejected'
            ? 'Rejected'
            : app.status === 'under_review' || app.status === 'payment_verified'
            ? 'Reviewing'
            : 'Pending') as ApplicantStatus

          const finalStatus = statusOverrides[id] || (app.id ? statusOverrides[app.id] : undefined) || serverStatus

          return {
            id,
            name: app.name,
            institution: app.institution || 'Independent Candidate',
            program: app.program || 'National Science Eclipse 2026',
            proposal:
              app.notes ||
              (app.mfsTrxId
                ? `MFS TrxID: ${app.mfsTrxId} (${app.mfsMethod || 'bKash'})`
                : 'Candidate Enrolment Application'),
            date: app.createdAt
              ? new Date(app.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Recent',
            status: finalStatus,
            email: app.email,
            phone: app.phone,
            paymentStatus: app.paymentStatus,
            mfsMethod: app.mfsMethod,
            mfsTrxId: app.mfsTrxId,
            mailed: Boolean(app.mailed),
            mailedAt: app.mailedAt,
            mailedBy: app.mailedBy
          }
        })

      setApplicants(mappedApps)
    } catch (err) {
      console.error('Failed to load registrations from backend', err)
    } finally {
      setLoadingApplicants(false)
    }
  }, [currentProfile.name])

  // Sync data on mount
  useEffect(() => {
    fetchBackendData()
  }, [fetchBackendData])

  // Re-sync when switching to applicants tab
  useEffect(() => {
    if (activeTab === 'applicants') {
      fetchBackendData()
    }
  }, [activeTab, fetchBackendData])

  // Live Chat sync with backend
  const fetchLiveMessages = useCallback(async () => {
    const deletedMessages = getLocalSet(LS_DELETED_MESSAGES)
    try {
      const serverMsgs = await apiGetMessages(activeChannel)
      if (serverMsgs && Array.isArray(serverMsgs)) {
        setMessages((prev) => {
          const otherChannelMsgs = prev.filter((m) => m.channel !== activeChannel)
          const mappedServerMsgs: ChatMessage[] = serverMsgs
            .filter((m: any) => !deletedMessages.has(m.id))
            .map((m: any) => {
              const officer = getOfficerProfileByName(m.senderName)
              return {
                id: m.id || `msg-${Date.now()}-${Math.random()}`,
                channel: activeChannel,
                senderName: m.senderName,
                senderTier: (officer?.rankTier || 'Executive Council') as ExecutiveTier,
                senderImage: officer?.image || '/images/executives/mustafiz-bin-jihad-ceo.jpeg',
                message: m.message,
                timestamp: m.timestamp || 'Recent'
              }
            })
          return [...otherChannelMsgs, ...mappedServerMsgs]
        })
      }
    } catch {
      // Quiet fallback
    }
  }, [activeChannel])

  // Polling for live chat when chat tab is active
  useEffect(() => {
    if (activeTab === 'chat') {
      fetchLiveMessages()
      const interval = setInterval(fetchLiveMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [activeTab, fetchLiveMessages])

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, activeTab, activeChannel])

  // Load vouchers & meetings from backend
  const fetchVouchersAndMeetings = useCallback(async () => {
    const deletedVouchers = getLocalSet(LS_DELETED_VOUCHERS)
    const deletedMeetings = getLocalSet(LS_DELETED_MEETINGS)

    try {
      const vList = await apiGetVouchers(currentProfile.name)
      if (vList && vList.length > 0) {
        const filtered = vList.filter((v: any) => !deletedVouchers.has(v.code.toUpperCase()))
        setVouchers(
          filtered.map((v: any) => {
            const officer = getOfficerProfileByName(v.createdBy)
            return {
              code: v.code,
              candidateName: v.candidateName || 'Official Candidate',
              targetRole: v.targetRole || 'Nominee Pass',
              issuedBy: v.createdBy,
              creatorRole: v.creatorRole || officer?.title || (officer?.rankTier || 'Executive Council'),
              issuerTier: (officer?.rankTier || 'Executive Council') as ExecutiveTier,
              issuedDate: new Date(v.createdAt).toLocaleDateString('en-GB'),
              status: (v.usedCount || 0) >= (v.maxUses || 25) ? 'Exhausted' : 'Active',
              maxUses: v.maxUses || 25,
              usedCount: v.usedCount || 0,
              discount: v.discount || '20% Executive Discount',
              redemptions: v.redemptions || []
            }
          })
        )
      } else {
        setVouchers([])
      }
    } catch {
      // quiet fallback
    }

    try {
      const mList = await apiGetMeetings()
      if (mList && mList.length > 0) {
        const filtered = mList.filter((m: any) => !deletedMeetings.has(m.id))
        setMeetings(
          filtered.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: m.dateTime || 'Scheduled',
            time: 'Council Operations',
            type: 'Council Review',
            hostName: m.hostName,
            platform: 'Google Meet',
            meetLink: `https://meet.google.com/uyf-council`
          }))
        )
      } else {
        setMeetings([])
      }
    } catch {
      // quiet fallback
    }
  }, [currentProfile.name])

  useEffect(() => {
    fetchVouchersAndMeetings()
    fetchLiveMessages()
  }, [fetchVouchersAndMeetings, fetchLiveMessages])

  const handleFullRefresh = async () => {
    sounds.playClick()
    await Promise.all([
      fetchBackendData(),
      fetchVouchersAndMeetings(),
      fetchLiveMessages()
    ])
    toast.success('Live executive registry and candidate queue refreshed.')
  }

  // CEO-Only Status Change Handler (Persisted to Server Database)
  const handleStatusChange = async (id: string, newStatus: ApplicantStatus) => {
    if ((newStatus === 'Approved' || newStatus === 'Rejected') && !isCEO) {
      sounds.playClick()
      toast.error(`Restricted Authorization: Only CEO (Mustafiz Bin Jihad) holds final applicant ${newStatus.toLowerCase()} authority.`)
      return
    }

    sounds.playClick()
    setLocalMapItem(LS_STATUS_OVERRIDES, id, newStatus)
    // Optimistic UI update
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )
    if (selectedApplicantForDetail && selectedApplicantForDetail.id === id) {
      setSelectedApplicantForDetail((prev) => prev ? { ...prev, status: newStatus } : null)
    }

    try {
      const backendStatus =
        newStatus === 'Approved'
          ? 'approved'
          : newStatus === 'Reviewing'
          ? 'under_review'
          : newStatus === 'Rejected'
          ? 'rejected'
          : 'submitted'
      await apiUpdateApplicationStatus(id, backendStatus, currentProfile.name)

      if (newStatus === 'Approved') {
        sounds.playSuccess()
        toast.success(`Applicant ${id} formally APPROVED under CEO executive seal (Mustafiz Bin Jihad). Email confirmation dispatched.`)
      } else if (newStatus === 'Rejected') {
        toast.success(`Applicant ${id} marked as REJECTED under CEO executive seal.`)
      } else {
        toast.success(`Applicant ${id} marked as ${newStatus} on central registry.`)
      }
    } catch (err: any) {
      // Fallback for submissions table
      try {
        if (newStatus === 'Approved') {
          await apiApproveSubmission(id, currentProfile.name)
          sounds.playSuccess()
          toast.success(`Submission ${id} approved on server.`)
          return
        }
        if (newStatus === 'Rejected') {
          await apiRejectSubmission(id, currentProfile.name)
          sounds.playSuccess()
          toast.success(`Submission ${id} rejected on server.`)
          return
        }
      } catch {}
      toast.error(err.message || 'Failed to persist status change on server.')
      fetchBackendData()
    }
  }

  // CEO Custom Email Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [targetApplicant, setTargetApplicant] = useState<Applicant | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [autoMarkMailed, setAutoMarkMailed] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // Quick Template Selector for CEO
  const handleSelectTemplate = (templateType: 'approval' | 'review' | 'custom') => {
    if (!targetApplicant) return
    if (templateType === 'approval') {
      setEmailSubject(`UYFSR Cohort Enrolment Approved - ${targetApplicant.name}`)
      setEmailMessage(
`Dear ${targetApplicant.name},

Congratulations! We are delighted to inform you that your application for ${targetApplicant.program} has been officially approved and ratified by the Central Secretariat.

Your Official Tracking Reference ID: ${targetApplicant.id}

Your profile and submitted documents have successfully passed our institutional verification process. You have been officially enrolled into the upcoming scientific cohort.

Please preserve this confirmation email. Further scheduling instructions and the Supplementary Intake details will be shared with you shortly.

If you have any questions or require special accommodation, you can reply directly to this email or contact our secretariat desk at +880 1911-287501.

Warm regards,
Mustafiz Bin Jihad
Chief Executive Officer (CEO)
United Youth Forum of Science and Research (UYFSR)
Dhaka, Bangladesh · Official Email: uyfsr.org@gmail.com`
      )
    } else if (templateType === 'review') {
      setEmailSubject(`UYFSR Document & Identity Verification - ${targetApplicant.name}`)
      setEmailMessage(
`Dear ${targetApplicant.name},

Thank you for your application regarding ${targetApplicant.program}.

This is an official notice to inform you that your dossier (Tracking ID: ${targetApplicant.id}) is currently under active review by the Central Secretariat admissions council (Stage 2: Document & Identity Verification).

We are currently verifying your institutional records and registration submission. Once the CEO executive review is concluded, you will receive an official approval notification.

If you need to update any information, please reply directly to this email.

Warm regards,
Mustafiz Bin Jihad
Chief Executive Officer (CEO)
United Youth Forum of Science and Research (UYFSR)`
      )
    } else {
      setEmailSubject(`Notice from UYFSR Executive Desk - ${targetApplicant.name}`)
      setEmailMessage(
`Dear ${targetApplicant.name},

[Write your custom message here]

Warm regards,
Mustafiz Bin Jihad
Chief Executive Officer (CEO)
United Youth Forum of Science and Research (UYFSR)`
      )
    }
  }

  // Open Modal Handler
  const handleOpenEmailComposer = (app: Applicant) => {
    sounds.playClick()
    setTargetApplicant(app)
    setEmailSubject(`UYFSR Cohort Enrolment Approved - ${app.name}`)
    setEmailMessage(
`Dear ${app.name},

Congratulations! We are delighted to inform you that your application for ${app.program} has been officially approved and ratified by the Central Secretariat.

Your Official Tracking Reference ID: ${app.id}

Your profile and submitted documents have successfully passed our institutional verification process. You have been officially enrolled into the upcoming scientific cohort.

Please preserve this confirmation email. Further scheduling instructions and the Supplementary Intake details will be shared with you shortly.

If you have any questions or require special accommodation, you can reply directly to this email or contact our secretariat desk at +880 1911-287501.

Warm regards,
Mustafiz Bin Jihad
Chief Executive Officer (CEO)
United Youth Forum of Science and Research (UYFSR)
Dhaka, Bangladesh · Official Email: uyfsr.org@gmail.com`
    )
    setEmailModalOpen(true)
  }

  // Send Custom Email Handler
  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetApplicant || !emailSubject.trim() || !emailMessage.trim()) return

    setIsSendingEmail(true)
    try {
      const res = await apiSendApplicantEmail(
        targetApplicant.id,
        {
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
          autoMarkMailed
        },
        currentProfile.name
      )

      sounds.playSuccess()
      toast.success(res.message || `Official email dispatched to ${targetApplicant.email}!`)

      setApplicants((prev) =>
        prev.map((a) =>
          a.id === targetApplicant.id
            ? { ...a, mailed: autoMarkMailed ? true : a.mailed }
            : a
        )
      )
      setEmailModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch email.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Toggle Mailed Status Handler
  const handleToggleMailed = async (appId: string, currentMailed?: boolean) => {
    sounds.playClick()
    const nextVal = !currentMailed
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, mailed: nextVal } : a))
    )
    try {
      await apiToggleMailedStatus(appId, nextVal, currentProfile.name)
      toast.success(nextVal ? `Marked ${appId} as Mailed.` : `Marked ${appId} as Not Mailed.`)
    } catch {
      fetchBackendData()
    }
  }

  // Chat send handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    sounds.playClick()
    const text = chatInput.trim()
    const newMsg: ChatMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      channel: activeChannel,
      senderName: currentProfile.name,
      senderTier: currentProfile.rankTier,
      senderImage: currentProfile.image,
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, newMsg])
    setChatInput('')

    // Persist to backend server & re-sync
    try {
      await apiSendMessage(currentProfile.name, currentProfile.title, activeChannel, text)
      fetchLiveMessages()
    } catch (err) {
      console.error('Failed to persist message to server', err)
    }
  }

  // Voucher generator handler
  const handleGenerateVoucher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateName.trim()) return

    sounds.playSuccess()
    try {
      const res = await apiGenerateVoucher(currentProfile.name, {
        candidateName: candidateName.trim(),
        targetRole: targetRole,
        creatorRole: currentProfile.title,
        maxUses: 25,
        discount: '20% Executive Discount'
      })
      const v = res.voucher
      const newV: Voucher = {
        code: v.code,
        candidateName: candidateName.trim(),
        targetRole: targetRole,
        issuedBy: currentProfile.name,
        creatorRole: currentProfile.title,
        issuerTier: currentProfile.rankTier,
        issuedDate: 'Today',
        status: 'Active',
        maxUses: v.maxUses || 25,
        usedCount: 0,
        discount: v.discount || '20% Executive Discount',
        redemptions: []
      }
      setVouchers((prev) => [newV, ...prev])
      setCandidateName('')
      toast.success(`Official Voucher ${v.code} generated and registered on server for ${candidateName.trim()}!`)
    } catch {
      // Local fallback
      const initials = currentProfile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
      const randomToken = Math.floor(1000 + Math.random() * 9000)
      const generatedCode = `UYFSR-REF-${initials}-${randomToken}`

      const newVoucher: Voucher = {
        code: generatedCode,
        candidateName: candidateName.trim(),
        targetRole: targetRole,
        issuedBy: currentProfile.name,
        issuerTier: currentProfile.rankTier,
        issuedDate: 'Today',
        status: 'Active',
        maxUses: 25,
        usedCount: 0,
        discount: '20% Executive Discount',
        redemptions: []
      }
      setVouchers((prev) => [newVoucher, ...prev])
      setCandidateName('')
      toast.success(`Voucher ${generatedCode} generated!`)
    }
  }

  const handleCopyVoucher = (code: string) => {
    sounds.playClick()
    navigator.clipboard?.writeText(code)
    toast.success(`Copied Voucher Code: ${code}`)
  }

  // Schedule meeting handler
  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingTitle.trim() || !meetingDate.trim() || !meetingTime.trim()) return

    sounds.playSuccess()
    const title = meetingTitle.trim()
    const dt = `${meetingDate.trim()} at ${meetingTime.trim()}`
    const meetType = meetingType
    const tempId = `meet-${Date.now()}`

    const newMeeting: CouncilMeeting = {
      id: tempId,
      title,
      date: meetingDate.trim(),
      time: meetingTime.trim(),
      type: meetType,
      hostName: currentProfile.name,
      platform: 'Google Meet',
      meetLink: `https://meet.google.com/uyf-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
    }

    setMeetings((prev) => [newMeeting, ...prev])
    setMeetingTitle('')
    setMeetingDate('')
    setMeetingTime('')
    setShowMeetingModal(false)

    // Persist to backend server
    try {
      const res = await apiScheduleMeeting(
        {
          title,
          hostName: currentProfile.name,
          attendees: ['Council Secretariat'],
          dateTime: dt,
          agenda: `${meetType} meeting coordinated by ${currentProfile.name}.`
        },
        currentProfile.name
      )

      if (res?.meeting?.id) {
        setMeetings((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: res.meeting.id } : m))
        )
      }
      toast.success(`Council meeting scheduled and synced to backend: ${title}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to sync meeting to backend server.')
    }
  }

  const handleCopyMeetingLink = (link: string) => {
    sounds.playClick()
    navigator.clipboard?.writeText(link)
    toast.success(`Copied Meeting Link: ${link}`)
  }

  const handleToggleTaskStatus = (taskId: string) => {
    sounds.playClick()
    setUserTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed'
          return { ...t, status: nextStatus }
        }
        return t
      })
    )
    toast.success("Portfolio task status updated.")
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    sounds.playSuccess()
    const newTask = {
      id: `T-${Date.now().toString().slice(-3)}`,
      title: newTaskTitle.trim(),
      deadline: newTaskDeadline.trim() || 'Scheduled',
      priority: 'Normal' as const,
      status: 'In Progress' as const
    }
    setUserTasks((prev) => [newTask, ...prev])
    setNewTaskTitle('')
    setNewTaskDeadline('')
    toast.success("New operational item added to your portfolio.")
  }

  const handleDeleteTask = (taskId: string) => {
    sounds.playClick()
    setUserTasks((prev) => prev.filter((t) => t.id !== taskId))
    toast.success("Task item removed.")
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    sounds.playClick()
    addToLocalSet(LS_DELETED_MEETINGS, meetingId)
    const previous = [...meetings]
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId))

    try {
      await apiDeleteMeeting(meetingId, currentProfile.name)
      toast.success("Meeting session permanently deleted from registry.")
    } catch (err: any) {
      setMeetings(previous)
      toast.error(err.message || "Failed to remove meeting from backend.")
    }
  }

  const handleDeleteApplicant = async (appId: string, candidateName?: string) => {
    if (!isCEO) {
      sounds.playClick()
      toast.error("Restricted Authorization: Only CEO (Mustafiz Bin Jihad) has authority to purge applicant records.")
      return
    }

    const confirmed = window.confirm(
      `Permanently purge applicant "${candidateName || appId}" from central registry? This cannot be undone.`
    )
    if (!confirmed) return

    sounds.playClick()
    addToLocalSet(LS_PURGED_APPS, appId)
    const previous = [...applicants]
    setApplicants((prev) => prev.filter((a) => a.id !== appId))
    if (selectedApplicantForDetail && selectedApplicantForDetail.id === appId) {
      setSelectedApplicantForDetail(null)
    }

    try {
      await apiDeleteApplication(appId, currentProfile.name)
      sounds.playSuccess()
      toast.success(`Applicant ${candidateName || appId} permanently purged from registry.`)
    } catch (err: any) {
      setApplicants(previous)
      toast.error(err.message || "Failed to remove applicant record from backend.")
    }
  }

  const handleDeleteVoucher = async (code: string) => {
    sounds.playClick()
    const confirmed = window.confirm(`Are you sure you want to revoke and delete voucher ${code}?`)
    if (!confirmed) return

    addToLocalSet(LS_DELETED_VOUCHERS, code.toUpperCase())
    const previous = [...vouchers]
    setVouchers((prev) => prev.filter((v) => v.code.toUpperCase() !== code.toUpperCase()))
    if (selectedTrackingVoucher && selectedTrackingVoucher.code.toUpperCase() === code.toUpperCase()) {
      setSelectedTrackingVoucher(null)
    }

    try {
      await apiDeleteVoucher(code, currentProfile.name)
      sounds.playSuccess()
      toast.success(`Voucher ${code} successfully revoked and removed from registry.`)
    } catch (err: any) {
      setVouchers(previous)
      toast.error(err.message || "Failed to revoke voucher.")
    }
  }

  const handleDeleteChatMessage = async (msgId: string) => {
    sounds.playClick()
    addToLocalSet(LS_DELETED_MESSAGES, msgId)
    const previous = [...messages]
    setMessages((prev) => prev.filter((m) => m.id !== msgId))

    try {
      await apiDeleteMessage(msgId, currentProfile.name)
      toast.success("Message removed from channel.")
    } catch (err: any) {
      setMessages(previous)
      toast.error(err.message || "Failed to delete message.")
    }
  }

  const handleCopyId = () => {
    sounds.playSuccess()
    navigator.clipboard?.writeText(currentProfile.id)
    toast.success(`Copied Official Member ID: ${currentProfile.id}`)
  }

  const filteredDirectory = executiveTeam.filter((exec) => {
    const matchesTier = dirTierFilter === 'All' || exec.rankTier === dirTierFilter
    const matchesSearch =
      exec.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
      exec.title.toLowerCase().includes(dirSearch.toLowerCase()) ||
      exec.department.toLowerCase().includes(dirSearch.toLowerCase()) ||
      exec.email.toLowerCase().includes(dirSearch.toLowerCase())
    return matchesTier && matchesSearch
  })

  const filteredApplicants = applicants.filter((a) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.institution.toLowerCase().includes(q) ||
      a.proposal.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.phone && a.phone.includes(q))
    const matchesProgram = programFilter === 'All' || a.program === programFilter
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter
    return matchesSearch && matchesProgram && matchesStatus
  })

  return (
    <div data-ui="dashboard" className="min-h-[100svh] bg-[#f7f7f5] text-[#111111] flex flex-col font-sans">
      {/* Top Restricted Security Banner */}
      <div className="bg-[#111111] text-[#ecece9] px-6 py-2 text-[13px] flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#222222]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0c7866] inline-block animate-pulse" />
          <span className="font-medium text-white">
            UYFSR Secretariat & Member Working Council Gateway
          </span>
          <span className="text-[#ecece9]/60 hidden md:inline">
            · Restricted Access Protocol (Appointed Personnel Only)
          </span>
        </div>

        <div className="text-[12px] text-[#ecece9]/70 flex items-center gap-3">
          <span>Active Council Session: 2025–2026</span>
          <span className="px-2 py-0.5 bg-[#ecece9]/10 text-white text-[11px]">
            {currentProfile.id}
          </span>
        </div>
      </div>

      {/* Executive Shell Bar */}
      <header className="bg-white border-b border-[#ecece9] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onViewPublicWebsite}
              className="px-3 py-1.5 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
              title="Return to public website without logging out"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public website</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#111111]">
                  UYFSR
                </span>
                <span className="text-[12px] font-medium bg-[#0c7866] text-white px-2 py-0.5">
                  Executive Workspace
                </span>
                {isCEO && (
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 font-semibold">
                    CEO Clearance
                  </span>
                )}
              </div>
              <div className="text-[12px] text-[#2b2b28]">
                Logged in as: <strong className="text-[#111111]">{currentProfile.name}</strong> · {currentProfile.title}
              </div>
            </div>
          </div>

          {/* Officer Verification & Security Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#f7f7f5] border border-[#ecece9]">
              <img
                src={currentProfile.image}
                alt={currentProfile.name}
                className="w-7 h-7 object-cover grayscale-[10%]"
              />
              <div className="text-left">
                <div className="text-[12px] font-semibold text-[#111111] leading-tight">
                  {currentProfile.name}
                </div>
                <div className="text-[11px] text-[#064e43]">
                  {currentProfile.id} · {currentProfile.rankTier}
                </div>
              </div>
            </div>

            <button
              onClick={handleFullRefresh}
              className="px-3.5 py-1.5 bg-[#ecece9] hover:bg-white text-[#111111] border border-[#dcdcd8] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Refresh all candidates, vouchers, meetings, and messages from server"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingApplicants ? 'animate-spin text-[#0c7866]' : ''}`} />
              <span>{loadingApplicants ? 'Syncing...' : 'Refresh Data'}</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Executive Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8 text-left">
        {/* KPI Strip (100% Dynamic Real Data from Live Database) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 border border-[#ecece9]">
          <div>
            <div className="text-[13px] text-[#2b2b28] font-medium mb-1">
              Registered Candidates
            </div>
            <div className="text-3xl font-serif font-medium text-[#111111] tabular-nums">
              {applicants.length}
            </div>
            <div className="text-[12px] text-[#0c7866] mt-1 font-medium">
              {applicants.filter((a) => a.status === 'Approved').length} approved by CEO
            </div>
          </div>

          <div>
            <div className="text-[13px] text-[#2b2b28] font-medium mb-1">
              Verification Queue
            </div>
            <div className="text-3xl font-serif font-medium text-[#111111] tabular-nums">
              {applicants.filter((a) => a.status === 'Reviewing' || a.status === 'Pending').length}
            </div>
            <div className="text-[12px] text-amber-700 mt-1 font-medium">
              Pending secretariat review
              {applicants.filter((a) => a.status === 'Rejected').length > 0 && (
                <span className="text-rose-600 font-semibold ml-1">
                  ({applicants.filter((a) => a.status === 'Rejected').length} rejected)
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[13px] text-[#2b2b28] font-medium mb-1">
              Active Referral Vouchers
            </div>
            <div className="text-3xl font-serif font-medium text-[#111111] tabular-nums">
              {vouchers.length}
            </div>
            <div className="text-[12px] text-[#0c7866] mt-1 font-medium">
              {vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0)} redemptions logged
            </div>
          </div>

          <div>
            <div className="text-[13px] text-[#2b2b28] font-medium mb-1">
              Council Sessions
            </div>
            <div className="text-3xl font-serif font-medium text-[#111111] tabular-nums">
              {meetings.length}
            </div>
            <div className="text-[12px] text-[#2b2b28] mt-1">
              {messages.length} live messages
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div data-ui="tabs" className="flex items-center overflow-x-auto no-scrollbar border-b border-[#ecece9] gap-3 sm:gap-6 text-[14px] font-medium whitespace-nowrap -mx-6 px-6 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('ecard')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'ecard'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            My E-Card
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'portfolio'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            My Portfolio & CV
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'chat'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            Live Council Chat ({messages.length})
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'vouchers'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            Invitation Vouchers ({vouchers.length})
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'meetings'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            Council Meetings ({meetings.length})
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'directory'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            Directory ({executiveTeam.length})
          </button>

          <button
            onClick={() => setActiveTab('applicants')}
            className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'applicants'
                ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                : 'text-[#2b2b28] hover:text-[#111111]'
            }`}
          >
            <span>Submissions</span>
            <span className="text-[11px] px-1.5 py-0.2 bg-amber-100 text-amber-900 ">
              CEO Auth
            </span>
          </button>

          {isCEO && (
            <button
              onClick={() => {
                sounds.playClick()
                setActiveTab('cms')
              }}
              className={`pb-3 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'cms'
                  ? 'border-b-2 border-[#0c7866] text-[#0c7866]'
                  : 'text-[#2b2b28] hover:text-[#111111]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Site CMS & Approvals</span>
              {pendingExecCount > 0 && (
                <span className="text-[10.5px] font-bold px-1.5 py-0.2 bg-amber-500 text-white rounded-full">
                  {pendingExecCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* TAB 1: OFFICIAL ELECTRONIC MEMBER ID CARD (E-CARD) */}
        {activeTab === 'ecard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  Official Electronic Membership Credential
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Issued exclusively to authorized UYFSR Executive Council, Advisors, Senior Executives, and Sub-Executives.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    sounds.playClick()
                    setShowEditProfileModal(true)
                  }}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#0c7866] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit My Profile</span>
                </button>

                <button
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="px-4 py-2 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isCardFlipped ? "View Card Face" : "Flip to Security Back"}</span>
                </button>

                <button
                  onClick={handleCopyId}
                  className="px-4 py-2 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Member ID</span>
                </button>
              </div>
            </div>

            {/* Interactive E-Card Component */}
            <div className="flex justify-center py-6">
              {!isCardFlipped ? (
                /* Card Front */
                <div className="w-full max-w-xl bg-[#111111] text-[#f7f7f5] p-5 sm:p-8 shadow-2xl relative border-2 border-[#2b2b28] overflow-hidden">
                  <div className="absolute right-4 top-4 text-[#ecece9]/5 font-serif text-9xl select-none pointer-events-none font-bold">
                    UYFSR
                  </div>

                  <div className="flex items-start justify-between border-b border-[#333333] pb-5 relative z-10">
                    <div>
                      <div className="font-serif text-2xl font-semibold tracking-tight text-white">
                        UYFSR
                      </div>
                      <div className="text-[11px] text-[#ecece9]/70 tracking-wider uppercase mt-0.5">
                        United Youth Forum of Science and Research
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-block px-2.5 py-1 bg-[#0c7866] text-white text-[11px] uppercase tracking-wider font-semibold">
                        OFFICIAL E-PASS
                      </div>
                      <div className="text-[11px] text-[#ecece9]/60 mt-1">
                        FOUNDED 30 MAY 2025
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 my-6 items-center relative z-10">
                    <div className="sm:col-span-4">
                      <div className="w-32 h-40 overflow-hidden bg-[#222222] border-2 border-[#0c7866]/40 mx-auto sm:mx-0">
                        <img
                          src={currentProfile.image}
                          alt={currentProfile.name}
                          className="w-full h-full object-cover object-center filter grayscale-[5%]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-8 space-y-2 text-center sm:text-left">
                      <div className="text-[12px] text-[#0c7866] uppercase tracking-wider">
                        {currentProfile.rankTier}
                      </div>
                      <div className="font-serif text-2xl sm:text-3xl font-medium text-white">
                        {currentProfile.name}
                      </div>
                      <div className="text-[14px] text-[#ecece9]/90 font-medium">
                        {currentProfile.title}
                      </div>
                      <div className="text-[13px] text-[#ecece9]/70">
                        {currentProfile.department}
                      </div>
                      <div className="pt-2 space-y-1 text-[12px] text-[#ecece9]/55">
                        <div>
                          Official Email: <span className="text-[#ecece9]">{currentProfile.email}</span>
                        </div>
                        <div>
                          Phone: <span className="text-[#ecece9]">{currentProfile.phone}</span>
                        </div>
                        <div>
                          Date of Birth:{' '}
                          <span className="text-[#ecece9]">
                            {currentProfile.dob || 'Not set (Click Edit My Profile)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#333333] pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="text-center sm:text-left">
                      <div className="text-[11px] text-[#ecece9]/60 ">
                        MEMBER SERIAL ID
                      </div>
                      <div className="text-base font-bold text-[#0c7866] tracking-wider">
                        {currentProfile.id}
                      </div>
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="text-[11px] text-[#ecece9]/60 ">
                        ISSUED DATE
                      </div>
                      <div className="text-[13px] text-[#ecece9] ">
                        {currentProfile.issueDate}
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-[11px] text-[#ecece9]/60 ">
                        AUTHORIZATION
                      </div>
                      <div className="text-[12px] text-[#0c7866] font-medium ">
                        ACTIVE · APPOINTED
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Reverse */
                <div className="w-full max-w-xl bg-[#161614] text-[#f7f7f5] p-5 sm:p-8 shadow-2xl relative border-2 border-[#2b2b28] space-y-6">
                  <div className="border-b border-[#333333] pb-4 flex justify-between items-center">
                    <span className="text-[12px] text-[#0c7866] uppercase tracking-wider">
                      COUNCIL CLEARANCE SPECIFICATION
                    </span>
                    <span className="text-[12px] text-[#ecece9]/60">
                      ID: {currentProfile.id}
                    </span>
                  </div>

                  <div className="space-y-3 text-[13px] text-[#ecece9]/80 leading-relaxed">
                    <div className="p-3 bg-[#1e1e1b] border border-[#2b2b28]">
                      <div className="font-medium text-white text-[14px] mb-1">
                        Clearance Hierarchy
                      </div>
                      <div>{currentProfile.clearanceLevel}</div>
                    </div>

                    <p>
                      This electronic credential confirms that the bearer is a formally appointed member of the United Youth Forum of Science and Research (UYFSR).
                    </p>

                    <p>
                      Authorized for national academic venues, symposium organization, student jury panels, and institutional partner liaisons.
                    </p>
                  </div>

                  <div className="border-t border-[#333333] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#ecece9]/60 ">
                    <div>
                      <div>EMERGENCY SECRETARIAT:</div>
                      <div className="text-white">+880 1911-287501</div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="font-serif italic text-white text-[14px]">Mustafiz Bin Jihad</div>
                      <div>Chief Executive Officer · Council Seal</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY WORK PORTFOLIO & CV GENERATOR */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  {currentProfile.name}&apos;s Work Portfolio
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Active duties and milestone deliverables assigned for {currentProfile.title}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCVModal(true)}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#333333] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Verified Executive CV</span>
                </button>

                <div className="text-[13px] bg-white px-4 py-2 border border-[#ecece9] font-medium">
                  Completed: <span className="text-[#0c7866]">{userTasks.filter((t) => t.status === 'Completed').length}</span> of {userTasks.length}
                </div>
              </div>
            </div>

            {/* Add New Portfolio Item Form */}
            <form onSubmit={handleAddTask} className="bg-white p-6 border border-[#ecece9] space-y-4">
              <div className="font-medium text-[14px] text-[#111111]">
                Add new operational item to your portfolio
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Task title / deliverable..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="sm:col-span-8 px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                />

                <input
                  type="text"
                  placeholder="Deadline (e.g. 25 Nov 2026)"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="sm:col-span-3 px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                />

                <button
                  type="submit"
                  className="sm:col-span-1 py-2 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </form>

            {/* Task Items List */}
            <div className="space-y-3">
              {userTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-5 border border-[#ecece9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-[#111111]"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className={`mt-0.5 w-5 h-5 flex items-center justify-center border transition-colors cursor-pointer ${
                        task.status === 'Completed'
                          ? 'bg-[#0c7866] border-[#0c7866] text-white'
                          : 'bg-white border-[#2b2b28] hover:border-[#0c7866]'
                      }`}
                    >
                      {task.status === 'Completed' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <div
                        className={`text-[15px] font-medium ${
                          task.status === 'Completed' ? 'line-through text-[#2b2b28]' : 'text-[#111111]'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-[13px] text-[#2b2b28] mt-0.5 flex items-center gap-3">
                        <span>Due: {task.deadline}</span>
                        <span>·</span>
                        <span className={task.priority === 'High' ? 'text-amber-700 font-medium' : 'text-[#2b2b28]'}>
                          Priority: {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[12px] font-medium px-2.5 py-1 ${
                        task.status === 'Completed'
                          ? 'bg-[#0c7866]/10 text-[#0c7866]'
                          : task.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#ecece9] text-[#2b2b28]'
                      }`}
                    >
                      {task.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE MESSAGES & COUNCIL CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  Live Executive Communication Hub
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Private channels for all appointed working committee members.
                </p>
              </div>

              {/* Channel Selector */}
              <div className="flex gap-2">
                {[
                  { id: 'general', label: '#general-council' },
                  { id: 'eclipse-ops', label: '#eclipse-ops' },
                  { id: 'secretariat', label: '#secretariat' }
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      sounds.playClick()
                      setActiveChannel(ch.id as any)
                    }}
                    className={`px-3 py-1.5 text-[13px] font-medium border cursor-pointer transition-colors ${
                      activeChannel === ch.id
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#2b2b28] border-[#ecece9] hover:border-[#111111]'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Frame */}
            <div className="bg-white border border-[#ecece9] flex flex-col h-[520px]">
              {/* Channel Header with Live Online Presence */}
              <div className="p-3.5 border-b border-[#ecece9] bg-[#f7f7f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-[#111111]">#{activeChannel}</span>
                    <span className="text-[#2b2b28]">· {messages.filter((m) => m.channel === activeChannel).length} messages</span>
                  </div>
                  <span className="text-zinc-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5 text-[12px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-ping" />
                    <span>Realtime Sync Active (Auto-updating every 3s)</span>
                  </div>
                </div>

                {/* Active Online Council Officers */}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#2b2b28]/70">Online Council:</span>
                  <div className="flex items-center -space-x-1.5 overflow-hidden">
                    {executiveTeam.slice(0, 5).map((exec) => {
                      const isCurrent = exec.name === currentProfile.name
                      return (
                        <div
                          key={exec.id}
                          className="relative group cursor-pointer"
                          title={`${exec.name} (${exec.title}) ${isCurrent ? '· (You · Active Now)' : '· Active On Duty'}`}
                        >
                          <img
                            src={exec.image}
                            alt={exec.name}
                            className={`w-6 h-6 rounded-full object-cover border-2 ${
                              isCurrent ? 'border-emerald-600 ring-1 ring-emerald-500' : 'border-white'
                            }`}
                          />
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                        </div>
                      )
                    })}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {executiveTeam.slice(0, 5).length} Online
                  </span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 text-left">
                {messages.filter((m) => m.channel === activeChannel).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#2b2b28]">
                    <div className="w-12 h-12 rounded-full bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mb-2">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="font-serif text-lg font-medium text-[#111111]">#{activeChannel} Council Channel</div>
                    <p className="text-[13px] text-[#2b2b28]/70 max-w-sm mt-1">
                      No communications posted here yet. Use the message input below to broadcast an operational update to all appointed working committee officers.
                    </p>
                  </div>
                ) : (
                  messages
                    .filter((m) => m.channel === activeChannel)
                    .map((msg, idx) => (
                      <div key={msg.id || `${msg.channel}-${msg.senderName}-${idx}`} className="flex items-start gap-3.5 group">
                        <div className="w-10 h-10 bg-[#ecece9] overflow-hidden shrink-0">
                          <img
                            src={msg.senderImage}
                            alt={msg.senderName}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-[14px] text-[#111111]">
                                {msg.senderName}
                              </span>
                              <span className="text-[11px] text-[#0c7866]">
                                {msg.senderTier}
                              </span>
                              <span className="text-[11px] text-[#2b2b28]">
                                {msg.timestamp}
                              </span>
                            </div>
                            {(isCEO || msg.senderName.toLowerCase() === currentProfile.name.toLowerCase()) && msg.id && (
                              <button
                                type="button"
                                onClick={() => handleDeleteChatMessage(msg.id)}
                                title="Delete Message"
                                className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="text-[14px] text-[#2b2b28] mt-1 leading-relaxed bg-[#f7f7f5] p-3 border border-[#ecece9] inline-block">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendChatMessage} className="p-4 border-t border-[#ecece9] bg-[#f7f7f5] flex gap-3">
                <input
                  type="text"
                  required
                  placeholder={`Message #${activeChannel} as ${currentProfile.name}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-[14px] bg-white border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: INVITATION / REFERRAL VOUCHERS */}
        {activeTab === 'vouchers' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  Executive Invitation & Referral Vouchers
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Issue trackable referral vouchers to invite student delegates, sub-executive candidates, and campus ambassadors with real-time usage monitoring.
                </p>
              </div>

              {/* Real-time Tracking Summary Metrics */}
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <div className="bg-white px-3.5 py-1.5 border border-[#ecece9] font-medium">
                  Vouchers: <span className="text-[#0c7866] font-bold">{vouchers.length}</span>
                </div>
                <div className="bg-white px-3.5 py-1.5 border border-[#ecece9] font-medium">
                  Total Redemptions: <span className="text-[#0c7866] font-bold">{vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0)}</span>
                </div>
                <div className="bg-white px-3.5 py-1.5 border border-[#ecece9] font-medium">
                  Available Quota: <span className="text-[#111111] font-bold">{vouchers.reduce((sum, v) => sum + Math.max(0, (v.maxUses || 25) - (v.usedCount || 0)), 0)}</span>
                </div>
              </div>
            </div>

            {/* Generate Voucher Form */}
            <form onSubmit={handleGenerateVoucher} className="bg-white p-6 border border-[#ecece9] space-y-4 shadow-sm">
              <div className="font-medium text-[14px] text-[#111111] flex items-center justify-between">
                <span>
                  Issue a new official referral voucher (Issuer: <strong className="text-[#0c7866]">{currentProfile.name}</strong> · <span className="text-[#2b2b28]">{currentProfile.title}</span>)
                </span>
                <span className="text-[12px] text-[#0c7866] bg-[#0c7866]/10 px-2.5 py-0.5">
                  20% Executive Discount · 25 Quota Limit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Candidate / Invitee full name..."
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="sm:col-span-6 px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                />

                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="sm:col-span-4 px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none cursor-pointer"
                >
                  <option value="Sub-Executive Candidate">Sub-Executive Candidate</option>
                  <option value="National Science Eclipse Team Lead">National Science Eclipse Team Lead</option>
                  <option value="Campus Ambassador Nominee">Campus Ambassador Nominee</option>
                  <option value="Journalism Carnival Delegate">Journalism Carnival Delegate</option>
                  <option value="Research Workshop Scholar">Research Workshop Scholar</option>
                </select>

                <button
                  type="submit"
                  className="sm:col-span-2 py-2 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate Code</span>
                </button>
              </div>
            </form>

            {/* Issued Vouchers Table with Live Usage Tracking */}
            <div className="bg-white border border-[#ecece9] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-[14px] min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#ecece9] bg-[#f7f7f5] text-[13px] text-[#2b2b28] font-medium">
                    <th className="py-3 px-4">Voucher Code</th>
                    <th className="py-3 px-4">Candidate / Invitee</th>
                    <th className="py-3 px-4">Role / Purpose</th>
                    <th className="py-3 px-4">Issued By</th>
                    <th className="py-3 px-4">Usage Tracking</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Tracking & Actions</th>
                  </tr>
                </thead>
                <tbody data-ui="tbody" className="divide-y divide-[#ecece9]">
                  {vouchers.map((v, idx) => {
                    const used = v.usedCount || 0
                    const max = v.maxUses || 25
                    const percent = Math.min(100, Math.round((used / max) * 100))
                    const isExhausted = used >= max

                    return (
                      <tr key={idx} className="hover:bg-[#fafaf8] transition-colors">
                        <td className="py-3.5 px-4 text-[13px] font-bold text-[#0c7866]">
                          {v.code}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#111111]">
                          {v.candidateName}
                        </td>
                        <td className="py-3.5 px-4 text-[#2b2b28] text-[13px]">
                          {v.targetRole}
                        </td>
                        <td className="py-3.5 px-4 text-[#2b2b28] text-[13px]">
                          <div className="font-semibold text-[#111111]">{v.issuedBy}</div>
                          <div className="text-[11px] text-[#0c7866] font-medium">{v.creatorRole || v.issuerTier}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 min-w-[120px]">
                            <div className="flex items-center justify-between text-[11px] ">
                              <span className="font-semibold text-[#111111]">{used} / {max} used</span>
                              <span className={isExhausted ? 'text-red-600 font-bold' : 'text-[#0c7866]'}>
                                {max - used} left
                              </span>
                            </div>
                            <div className="w-full bg-[#ecece9] h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  isExhausted ? 'bg-red-500' : 'bg-[#0c7866]'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                              isExhausted
                                ? 'bg-red-100 text-red-700'
                                : used > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#0c7866]/10 text-[#0c7866]'
                            }`}
                          >
                            {isExhausted ? 'Exhausted' : used > 0 ? `Used (${used})` : 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                sounds.playClick()
                                setSelectedTrackingVoucher(v)
                              }}
                              title="Audit who redeemed this voucher"
                              className="px-2.5 py-1 bg-[#0c7866]/10 hover:bg-[#0c7866] text-[#0c7866] hover:text-white text-[12px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Track ({v.redemptions?.length || used})</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyVoucher(v.code)}
                              className="px-2.5 py-1 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[12px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>

                            {(isCEO || v.issuedBy.toLowerCase().includes(currentProfile.name.toLowerCase())) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteVoucher(v.code)}
                                title="Revoke and cancel voucher code (CEO Clearance)"
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[12px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Cancel Voucher</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Executive Voucher Usage Tracking Audit Modal */}
        {selectedTrackingVoucher && (
          <div className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full border border-[#ecece9] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Masthead */}
              <div className="bg-[#111111] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0c7866] flex items-center justify-center text-white">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-widest">
                      Executive Voucher Audit Desk
                    </div>
                    <div className="text-lg font-bold text-white tracking-wide">
                      {selectedTrackingVoucher.code}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTrackingVoucher(null)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metrics Header Grid */}
              <div className="p-5 bg-[#f7f7f5] border-b border-[#ecece9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-white p-3 border border-[#ecece9]">
                  <div className="text-[11px] text-[#2b2b28] uppercase ">Issued To</div>
                  <div className="text-[13px] font-bold text-[#111111] truncate">{selectedTrackingVoucher.candidateName}</div>
                </div>
                <div className="bg-white p-3 border border-[#ecece9]">
                  <div className="text-[11px] text-[#2b2b28] uppercase ">Total Quota</div>
                  <div className="text-[13px] font-bold text-[#111111]">{selectedTrackingVoucher.maxUses || 25} Uses</div>
                </div>
                <div className="bg-white p-3 border border-[#ecece9]">
                  <div className="text-[11px] text-[#2b2b28] uppercase ">Redemptions</div>
                  <div className="text-[13px] font-bold text-[#0c7866]">
                    {selectedTrackingVoucher.redemptions?.length || selectedTrackingVoucher.usedCount || 0} Used
                  </div>
                </div>
                <div className="bg-white p-3 border border-[#ecece9]">
                  <div className="text-[11px] text-[#2b2b28] uppercase ">Remaining</div>
                  <div className="text-[13px] font-bold text-[#111111]">
                    {Math.max(0, (selectedTrackingVoucher.maxUses || 25) - (selectedTrackingVoucher.usedCount || 0))} Remaining
                  </div>
                </div>
              </div>

              {/* Candidates Who Redeemed Table */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0c7866]" />
                    <span>Candidate Redemption History ({selectedTrackingVoucher.redemptions?.length || 0})</span>
                  </div>
                  <span className="text-[12px] text-[#2b2b28]">
                    Issuer: {selectedTrackingVoucher.issuedBy}
                  </span>
                </div>

                {selectedTrackingVoucher.redemptions && selectedTrackingVoucher.redemptions.length > 0 ? (
                  <div className="border border-[#ecece9] overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead className="bg-[#f7f7f5] border-b border-[#ecece9] font-medium text-[#2b2b28]">
                        <tr>
                          <th className="py-2.5 px-3">Candidate</th>
                          <th className="py-2.5 px-3">Email</th>
                          <th className="py-2.5 px-3">Program</th>
                          <th className="py-2.5 px-3 text-right">Redeemed At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ecece9]">
                        {selectedTrackingVoucher.redemptions.map((red, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#fafaf8]">
                            <td className="py-2.5 px-3 font-semibold text-[#111111]">
                              <div>{red.name}</div>
                              <div className="text-[11px] text-[#0c7866]">{red.applicantId}</div>
                            </td>
                            <td className="py-2.5 px-3 text-[#2b2b28]">{red.email}</td>
                            <td className="py-2.5 px-3 text-[#2b2b28] text-[12px]">{red.program || 'National Science Eclipse 2026'}</td>
                            <td className="py-2.5 px-3 text-right text-[11px] text-[#2b2b28]">
                              {red.usedAt ? new Date(red.usedAt).toLocaleDateString('en-GB') : 'Recent'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-[#f7f7f5] p-8 text-center border border-[#ecece9] space-y-2">
                    <Clock className="w-8 h-8 text-[#0c7866] mx-auto opacity-70" />
                    <div className="font-serif text-lg font-medium text-[#111111]">
                      No Redemptions Logged Yet
                    </div>
                    <p className="text-[13px] text-[#2b2b28] max-w-md mx-auto leading-relaxed">
                      This voucher code is active with a quota of {selectedTrackingVoucher.maxUses || 25} discounted enrolments. When candidates use this code on the registration page, their details will appear here automatically in real time.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#f7f7f5] border-t border-[#ecece9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyVoucher(selectedTrackingVoucher.code)}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#2b2b28] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 text-[#0c7866]" />
                  <span>Copy Voucher Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTrackingVoucher(null)}
                  className="px-4 py-2 bg-white border border-[#ecece9] hover:border-[#111111] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer"
                >
                  Close Audit Desk
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COUNCIL MEETINGS SCHEDULER */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  Executive Council Meetings & Committee Sessions
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Schedule and manage video conferences and strategy reviews among working executives.
                </p>
              </div>

              <button
                onClick={() => setShowMeetingModal(!showMeetingModal)}
                className="px-4 py-2 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{showMeetingModal ? 'Close Scheduler' : 'Schedule Council Meeting'}</span>
              </button>
            </div>

            {/* Meeting Scheduler Form */}
            {showMeetingModal && (
              <form onSubmit={handleScheduleMeeting} className="bg-white p-6 border border-[#ecece9] space-y-4">
                <div className="font-medium text-[14px] text-[#111111]">
                  Schedule New Session (Host: {currentProfile.name})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] text-[#2b2b28] mb-1 font-medium">
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Science Eclipse Laboratory Allocation Review"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-[#2b2b28] mb-1 font-medium">
                      Session Category
                    </label>
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      className="w-full px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none cursor-pointer"
                    >
                      <option value="Event Operations">Event Operations</option>
                      <option value="Executive Council Strategy">Executive Council Strategy</option>
                      <option value="Media Briefing">Media Briefing</option>
                      <option value="Chapter Alliances">Chapter Alliances</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] text-[#2b2b28] mb-1 font-medium">
                      Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 18 November 2026"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-[#2b2b28] mb-1 font-medium">
                      Time (BST)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 08:00 PM"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full px-3.5 py-2 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMeetingModal(false)}
                    className="px-4 py-2 bg-[#ecece9] text-[#2b2b28] text-[13px] font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium cursor-pointer"
                  >
                    Create Meeting & Link
                  </button>
                </div>
              </form>
            )}

            {/* Scheduled Meetings List */}
            <div className="space-y-4">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-6 border border-[#ecece9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#111111] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-[#f7f7f5] text-[#0c7866]">
                        {m.type}
                      </span>
                      <span className="text-[12px] text-[#2b2b28] ">{m.id}</span>
                    </div>

                    <h4 className="font-serif text-xl font-medium text-[#111111]">
                      {m.title}
                    </h4>

                    <div className="text-[13px] text-[#2b2b28] flex flex-wrap items-center gap-3">
                      <span>Schedule: {m.date} at {m.time}</span>
                      <span>·</span>
                      <span>Host: {m.hostName}</span>
                      <span>·</span>
                      <span>Platform: {m.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {(isCEO || m.hostName.toLowerCase().includes(currentProfile.name.toLowerCase()) || currentProfile.title.includes('COO')) && (
                      <button
                        onClick={() => handleDeleteMeeting(m.id)}
                        className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[13px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        title="Cancel and remove meeting"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyMeetingLink(m.meetLink)}
                      className="px-3 py-2 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>

                    <a
                      href={m.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EXECUTIVE & SECRETARIAT DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  Executive Council & Secretariat Directory
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Direct directory of all appointed executives, advisors, and operational sub-executives.
                </p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]" />
                <input
                  type="text"
                  placeholder="Search executive or department..."
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#ecece9] text-[13px] text-[#111111] focus:border-[#111111] outline-none"
                />
              </div>
            </div>

            {/* Tier Filters */}
            <div className="flex flex-wrap gap-2">
              {(['All', 'Executive Council', 'Advisors', 'Senior Executive', 'Sub-Executive'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setDirTierFilter(tier)}
                  className={`px-3 py-1.5 text-[13px] font-medium transition-colors cursor-pointer border ${
                    dirTierFilter === tier
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#2b2b28] border-[#ecece9] hover:border-[#111111]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Executive Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDirectory.map((exec) => (
                <div
                  key={exec.id}
                  className="bg-white p-6 border border-[#ecece9] flex flex-col justify-between space-y-4 hover:border-[#111111] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 bg-[#ecece9] overflow-hidden shrink-0">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        className="w-full h-full object-cover object-center filter grayscale-[10%]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-[#0c7866] uppercase font-medium">
                        {exec.rankTier}
                      </div>
                      <div className="font-serif text-lg font-medium text-[#111111]">
                        {exec.name}
                      </div>
                      <div className="text-[13px] text-[#2b2b28] leading-snug">
                        {exec.title}
                      </div>
                      <div className="text-[12px] text-[#2b2b28]/80">
                        {exec.department}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#ecece9] pt-3 text-[13px] space-y-1.5">
                    <div className="flex justify-between text-[#2b2b28]">
                      <span>Email:</span>
                      <a href={`mailto:${exec.email}`} className="text-[#111111] hover:underline">
                        {exec.email}
                      </a>
                    </div>
                    <div className="flex justify-between text-[#2b2b28]">
                      <span>Contact:</span>
                      <span className="text-[#111111]">{exec.phone}</span>
                    </div>
                    <div className="flex justify-between text-[#2b2b28]">
                      <span>Member ID:</span>
                      <span className="text-[12px] text-[#0c7866]">{exec.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: APPLICANT REGISTRATIONS (CEO-ONLY APPROVAL ENFORCEMENT) */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#111111]">
                  Student Submissions and Team Registrations
                </h3>
                <p className="text-[14px] text-[#2b2b28] mt-1">
                  Manage incoming student project proposals for National Science Eclipse 2026 and Junior Talent Awards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick()
                    fetchBackendData()
                  }}
                  disabled={loadingApplicants}
                  className="px-3 py-2 bg-white border border-[#ecece9] hover:border-[#111111] text-[13px] text-[#111111] flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-2xs"
                  title="Refresh live data from server"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loadingApplicants ? 'animate-spin text-[#0c7866]' : 'text-[#111111]'}`} />
                  <span>{loadingApplicants ? 'Syncing...' : 'Refresh'}</span>
                </button>

                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#ecece9] text-[13px] text-[#111111] focus:border-[#111111] outline-none cursor-pointer"
                >
                  <option value="All">All Programs</option>
                  <option value="National Science Eclipse 2026">National Science Eclipse 2026</option>
                  <option value="Junior Talent Award: Season 1">Junior Talent Award: Season 1</option>
                  <option value="Junior Startup Challenge: Season 1">Junior Startup Challenge: Season 1</option>
                  <option value="1st National Journalism Carnival">1st National Journalism Carnival</option>
                  <option value="Scientific Research Methodology Sessions">Scientific Research Methodology Sessions</option>
                </select>

                <div className="w-full sm:w-64 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]" />
                  <input
                    type="text"
                    placeholder="Search name, ID, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#ecece9] text-[13px] text-[#111111] focus:border-[#111111] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter Tab Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {(['All', 'Pending', 'Reviewing', 'Approved', 'Rejected'] as const).map((st) => {
                const count = st === 'All' ? applicants.length : applicants.filter((a) => a.status === st).length
                const isActive = statusFilter === st
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      sounds.playClick()
                      setStatusFilter(st)
                    }}
                    className={`px-3 py-1.5 text-[12.5px] font-medium rounded-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#2b2b28] border border-[#ecece9] hover:border-[#111111]'
                    }`}
                  >
                    <span>{st}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#f7f7f5] text-[#2b2b28]'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* CEO Authorization Banner */}
            <div
              className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] ${
                isCEO
                  ? 'bg-emerald-50/50 border-[#0c7866]/30 text-[#0c7866]'
                  : 'bg-amber-50/50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isCEO ? (
                  <ShieldCheck className="w-5 h-5 text-[#0c7866] shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                )}
                <div>
                  <strong className="block font-medium">
                    {isCEO
                      ? 'CEO Executive Approval Clearance Active (Mustafiz Bin Jihad)'
                      : 'Restricted Approval Mode: CEO Clearance Required'}
                  </strong>
                  <span className="text-[12px] opacity-90">
                    {isCEO
                      ? 'As Chief Executive Officer, your decisions immediately ratify and grant official entry status.'
                      : 'Only CEO (Mustafiz Bin Jihad) can grant final approval status. Other executives may mark items for review.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-[#ecece9] overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-[14px] min-w-[880px]">
                <thead>
                  <tr className="border-b border-[#ecece9] bg-[#f7f7f5] text-[13px] text-[#2b2b28] font-medium">
                    <th className="py-3 px-4">Applicant ID</th>
                    <th className="py-3 px-4">Student & Institution</th>
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Project Synopsis & Fee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Dispatch Notice</th>
                    <th className="py-3 px-4 text-right">Approval & Mail Action</th>
                  </tr>
                </thead>
                <tbody data-ui="tbody" className="divide-y divide-[#ecece9]">
                  {filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-[#fafaf8] transition-colors">
                      <td className="py-3.5 px-4 text-[12px] text-[#2b2b28]">
                        <div className="font-semibold text-[#111111]">{app.id}</div>
                        <div className="text-[11px] text-[#2b2b28]/60 mt-0.5">{app.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#111111]">{app.name}</div>
                        <div className="text-[13px] text-[#2b2b28]">{app.institution}</div>
                        {(app.email || app.phone) && (
                          <div className="text-[11px] text-[#2b2b28]/70 mt-0.5">
                            {app.email} {app.phone ? `· ${app.phone}` : ''}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#2b2b28]">
                        {app.program}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-[#2b2b28] text-[13px] leading-relaxed">
                        <div>{app.proposal}</div>
                        {app.paymentStatus && (
                          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                            <span
                              className={`px-1.5 py-0.5 text-[10px] uppercase font-medium ${
                                app.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.paymentStatus === 'waived'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              Fee: {app.paymentStatus}
                            </span>
                            {app.mfsTrxId && (
                              <span className="text-[#2b2b28]/70">
                                {app.mfsMethod || 'MFS'}: {app.mfsTrxId}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[12px] font-medium ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : app.status === 'Reviewing'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : app.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Dispatch Status Column (Mailed / Not Mailed) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleMailed(app.id, app.mailed)}
                          title={app.mailed ? "Mailed to candidate. Click to switch to Not Mailed." : "Click to mark as Mailed."}
                          className="cursor-pointer focus:outline-none block"
                        >
                          {app.mailed ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                              <MailCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>Mailed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors">
                              <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <span>Not Mailed</span>
                            </span>
                          )}
                        </button>
                        {app.mailed && app.mailedAt && (
                          <div className="text-[10px] text-[#2b2b28]/60 mt-0.5 ">
                            {new Date(app.mailedAt).toLocaleDateString('en-GB')}
                          </div>
                        )}
                      </td>

                      {/* Actions Column (View Dossier + Write Mail + Approve/Review/Reject) */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick()
                              setSelectedApplicantForDetail(app)
                            }}
                            className="px-2.5 py-1 bg-[#0c7866]/10 hover:bg-[#0c7866] text-[#0c7866] hover:text-white text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                            title="Open Full Candidate Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEmailComposer(app)}
                            className="px-2.5 py-1 bg-[#111111] hover:bg-[#2b2b28] text-white text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                            title="Compose and send custom email to this applicant"
                          >
                            <Send className="w-3 h-3" />
                            <span>Write Mail</span>
                          </button>

                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'Approved')}
                              disabled={!isCEO}
                              title={isCEO ? 'Approve as CEO' : 'Only CEO can approve'}
                              className={`px-2.5 py-1 text-[12px] font-medium transition-colors ${
                                isCEO
                                  ? 'bg-[#0c7866] hover:bg-[#095f51] text-white cursor-pointer'
                                  : 'bg-[#ecece9] text-[#2b2b28]/50 cursor-not-allowed'
                              }`}
                            >
                              Approve
                            </button>
                          )}

                          {app.status !== 'Reviewing' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'Reviewing')}
                              className="px-2.5 py-1 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[12px] font-medium transition-colors cursor-pointer"
                            >
                              Review
                            </button>
                          )}

                          {app.status !== 'Rejected' && isCEO && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'Rejected')}
                              title="Reject Application (CEO Clearance)"
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[12px] font-medium transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          )}

                          {isCEO && (
                            <button
                              type="button"
                              onClick={() => handleDeleteApplicant(app.id, app.name)}
                              title="Permanently Purge Candidate Record from Registry (CEO Sole Authority)"
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[12px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Purge</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: CEO SITE CONTENT CMS & PENDING EXECUTIVE APPROVALS */}
        {activeTab === 'cms' && isCEO && (
          <CeoCmsPanel
            officerName={currentProfile.name}
            onSiteContentUpdated={onSiteContentUpdated}
            onExecutiveApproved={() => {
              apiGetPendingExecutives(currentProfile.name)
                .then((list) => setPendingExecCount(list.length))
                .catch(() => {})
            }}
          />
        )}
      </main>

      {/* CEO Custom Email Composer Modal */}
      {emailModalOpen && targetApplicant && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-[#ffffff] border border-[#ecece9] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f7f7f5] border-b border-[#ecece9] flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#0c7866] font-semibold">
                  CEO Official Dispatch Desk
                </div>
                <h3 className="font-serif text-xl font-medium text-[#111111] mt-0.5">
                  Compose Custom Email to {targetApplicant.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="p-1.5 text-[#2b2b28] hover:text-[#111111] hover:bg-[#ecece9] rounded cursor-pointer transition-colors"
                aria-label="Close composer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient & Program Information Bar */}
            <div className="px-6 py-3 bg-[#fafaf8] border-b border-[#ecece9] text-[13px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#2b2b28]">
              <div>
                <span className="text-[#2b2b28]/60">Recipient:</span>{' '}
                <strong className="text-[#111111]">{targetApplicant.name}</strong> ({targetApplicant.email || 'No email registered'})
              </div>
              <div>
                <span className="text-[#2b2b28]/60">Reference ID:</span>{' '}
                <span className="text-[#0c7866] font-semibold">{targetApplicant.id}</span>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendCustomEmail} className="p-6 flex-1 overflow-y-auto space-y-4">
              {/* Quick Template Selector */}
              <div>
                <label className="block text-[12px] font-medium text-[#2b2b28]/80 uppercase tracking-wider mb-1.5">
                  Load Official Template Preset
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('approval')}
                    className="px-2.5 py-1 text-[12px] font-medium bg-[#f0f9f6] text-[#0c7866] border border-[#0c7866]/30 hover:bg-[#e0f4ee] cursor-pointer transition-colors"
                  >
                    ✓ Official Approval Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('review')}
                    className="px-2.5 py-1 text-[12px] font-medium bg-[#fffbeb] text-[#b45309] border border-[#f59e0b]/30 hover:bg-[#fef3c7] cursor-pointer transition-colors"
                  >
                    ⟳ Stage 2 Document Review Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('custom')}
                    className="px-2.5 py-1 text-[12px] font-medium bg-[#ecece9] text-[#111111] hover:bg-[#e0e0dc] cursor-pointer transition-colors"
                  >
                    ✎ Blank Custom Note
                  </button>
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-[13px] font-medium text-[#111111] mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. UYFSR Cohort Enrolment Approved - Participant Name"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#ecece9] text-[14px] text-[#111111] focus:border-[#0c7866] focus:ring-1 focus:ring-[#0c7866] outline-none"
                />
              </div>

              {/* Email Body Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[13px] font-medium text-[#111111]">
                    Message Body (CEO Personal Letter) *
                  </label>
                  <span className="text-[11px] text-[#2b2b28]/60">
                    Plain human text (guarantees Primary Inbox delivery)
                  </span>
                </div>
                <textarea
                  required
                  rows={9}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Type your official letter here..."
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#ecece9] text-[13.5px] font-sans leading-relaxed text-[#111111] focus:border-[#0c7866] focus:ring-1 focus:ring-[#0c7866] outline-none resize-y"
                />
              </div>

              {/* Automatic Mailed Status Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoMarkMailed"
                  checked={autoMarkMailed}
                  onChange={(e) => setAutoMarkMailed(e.target.checked)}
                  className="w-4 h-4 text-[#0c7866] border-[#ecece9] rounded focus:ring-[#0c7866] cursor-pointer"
                />
                <label htmlFor="autoMarkMailed" className="text-[13px] text-[#2b2b28] cursor-pointer select-none">
                  Automatically mark applicant as <strong>Mailed</strong> upon successful delivery
                </label>
              </div>

              {/* Primary Inbox Guarantee Badge */}
              <div className="p-3 bg-emerald-50/60 border border-[#0c7866]/20 text-[12px] text-[#064e43] flex items-start gap-2">
                <span className="text-base leading-none">⚡</span>
                <div>
                  <strong>Primary Inbox Delivery Mode:</strong> Dispatched from <code>uyfsr.org@gmail.com</code> directly as a natural 1-to-1 personal executive letter. Bypasses robotic spam filters and lands straight into the candidate's main inbox.
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#ecece9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  disabled={isSendingEmail}
                  className="px-4 py-2 text-[13px] font-medium text-[#2b2b28] hover:text-[#111111] bg-transparent hover:bg-[#ecece9] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail || !targetApplicant.email}
                  className="px-5 py-2 text-[13px] font-medium text-white bg-[#0c7866] hover:bg-[#095f51] cursor-pointer transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-spin' : ''}`} />
                  <span>{isSendingEmail ? 'Dispatching Mail...' : 'Send Official Email Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Candidate Dossier Inspection Modal */}
      {selectedApplicantForDetail && (
        <ApplicantDetailModal
          isOpen={Boolean(selectedApplicantForDetail)}
          onClose={() => setSelectedApplicantForDetail(null)}
          applicant={selectedApplicantForDetail}
          isCEO={isCEO}
          onStatusChange={handleStatusChange}
          onWriteMail={(app) => {
            setSelectedApplicantForDetail(null)
            handleOpenEmailComposer(app)
          }}
          onToggleMailed={(id, curr) => handleToggleMailed(id, curr)}
          onDelete={(id) => handleDeleteApplicant(id, selectedApplicantForDetail?.name)}
        />
      )}

      {/* Verified Executive CV Dossier Modal */}
      {showCVModal && (
        <CVModal
          isOpen={showCVModal}
          onClose={() => setShowCVModal(false)}
          executive={currentProfile}
        />
      )}

      {/* Self-Service Executive Profile Editor Modal */}
      {showEditProfileModal && (
        <ExecutiveProfileModal
          officerName={currentProfile.name}
          initialProfile={{
            name: currentProfile.name,
            email: currentProfile.email,
            phone: currentProfile.phone,
            dob: currentProfile.dob,
            department: currentProfile.department,
            bio: currentProfile.bio,
            image: currentProfile.image,
            facebookUrl: currentProfile.facebookUrl
          }}
          onClose={() => setShowEditProfileModal(false)}
          onSaved={(updated) => {
            setProfileOverride(updated)
            try {
              localStorage.setItem('uyfsr_executive_officer', JSON.stringify(updated))
            } catch {}
          }}
        />
      )}
    </div>
  )
}
