import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SEED_FILE = path.join(__dirname, 'data', 'db.json')
const DB_FILE = process.env.VERCEL ? path.join(os.tmpdir(), 'uyfsr_db.json') : SEED_FILE

export interface Executive {
  id: string
  name: string
  email?: string
  phone?: string
  password?: string
  rankTier: 'Executive Council' | 'Advisors' | 'Secretariat'
  title: string
  department: string
  isCEO: boolean
  accessPin: string
  ecardId: string
  activeSince: string
  bio: string
}

export interface Application {
  id: string
  trackingId: string
  name: string
  email: string
  phone?: string
  institution: string
  program: string
  category?: string
  notes?: string
  voucherCode?: string
  referredBy?: string
  mfsMethod?: string
  mfsPhone?: string
  mfsTrxId?: string
  status: 'submitted' | 'payment_verified' | 'under_review' | 'approved' | 'rejected'
  paymentStatus: 'paid' | 'waived' | 'pending'
  mailed?: boolean
  mailedAt?: string
  mailedBy?: string
  lastEmailSubject?: string
  notifiedStatuses?: string[]
  createdAt: string
  updatedAt: string
}

export interface StudentSubmission {
  id: string
  title: string
  category: string
  leadStudent: string
  institution: string
  abstract: string
  status: 'submitted' | 'approved' | 'rejected'
  evaluatedBy?: string
  reviewedAt?: string
  createdAt: string
}

export interface VoucherRedemption {
  applicantId: string
  name: string
  email: string
  program?: string
  usedAt: string
}

export interface Voucher {
  code: string
  candidateName?: string
  targetRole?: string
  createdBy: string
  creatorRole: string
  discount: string
  maxUses: number
  usedCount: number
  redemptions?: VoucherRedemption[]
  createdAt: string
}

export interface Message {
  id: string
  senderName: string
  senderRole: string
  channel: string
  message: string
  timestamp: string
}

export interface Meeting {
  id: string
  title: string
  hostName: string
  attendees: string[]
  dateTime: string
  agenda: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
}

export interface NewsPost {
  id: string
  title: string
  excerpt: string
  fullContent: string
  date: string
  category: string
  facebookUrl: string
  likes: number
  comments: number
  shares: number
  syncedAt: string
}

export interface DatabaseSchema {
  executives: Executive[]
  applications: Application[]
  submissions: StudentSubmission[]
  vouchers: Voucher[]
  messages: Message[]
  meetings: Meeting[]
  news: NewsPost[]
}

const initialSeed: DatabaseSchema = {
  executives: [
    {
      id: 'exec-1',
      name: 'Khaled Saifullah Rohan',
      email: 'rohan232619@gmail.com',
      phone: '+880 1736-309347',
      rankTier: 'Advisors',
      title: 'Adviser',
      department: 'Advisory Board & Strategic Guidance',
      isCEO: false,
      accessPin: 'ADV-2026',
      password: 'Rohan#2026@adv',
      ecardId: 'UYFSR-EXEC-001',
      activeSince: '30 May 2025',
      bio: 'Providing institutional governance, strategic advisory, policy mentorship, and organizational leadership for nationwide youth science programs.'
    },
    {
      id: 'exec-2',
      name: 'Mustafiz Bin Jihad',
      email: 'mostafizbinjihad@gmail.com',
      phone: '+880 1824-798147',
      rankTier: 'Executive Council',
      title: 'Chief Executive Officer (CEO)',
      department: 'Executive Council & Strategic Vision',
      isCEO: true,
      accessPin: 'CEO-2026',
      password: 'Mustafiz#2026@ceo',
      ecardId: 'UYFSR-EXEC-002',
      activeSince: '30 May 2025',
      bio: 'Founding leadership directing national youth scientific exploration, central institutional alliances, policy strategy, and nationwide research initiatives across Bangladesh.'
    },
    {
      id: 'exec-3',
      name: 'Shahriar Mejba',
      email: 'mejbaacps2007@gmail.com',
      phone: '+880 1410-581821',
      rankTier: 'Executive Council',
      title: 'Chief Operating Officer (COO)',
      department: 'Operations & Council Governance',
      isCEO: false,
      accessPin: 'COO-2026',
      password: 'Mejba#2026@coo',
      ecardId: 'UYFSR-EXEC-003',
      activeSince: '30 May 2025',
      bio: 'Directing organizational operations, operational workflows, national event execution, field chapter coordination, and logistics governance.'
    },
    {
      id: 'exec-4',
      name: 'Dalia Sultana Joty',
      email: 'daliajoty@gmail.com',
      phone: '+880 1333-623162',
      rankTier: 'Executive Council',
      title: 'Chief Communications Officer (CCO)',
      department: 'Communications & External Affairs',
      isCEO: false,
      accessPin: 'CCO-2026',
      password: 'Joty#2026@cco',
      ecardId: 'UYFSR-EXEC-004',
      activeSince: '30 May 2025',
      bio: 'Stewarding strategic organizational communications, media relations, institutional press engagement, and public outreach across youth research initiatives.'
    },
    {
      id: 'exec-5',
      name: 'Shahriyar Tashkir',
      email: 'tashkir2006@gmail.com',
      phone: '+880 1349-359808',
      rankTier: 'Executive Council',
      title: 'Chief Technology Officer (CTO)',
      department: 'Technology & Digital Infrastructure',
      isCEO: false,
      accessPin: 'CTO-2026',
      password: 'Tashkir#2026@cto',
      ecardId: 'UYFSR-EXEC-005',
      activeSince: '30 May 2025',
      bio: 'Spearheading digital systems architecture, technological platforms, portal engineering, scientific computing frameworks, and computational research tools.'
    },
    {
      id: 'exec-6',
      name: 'Taki Al Zaki',
      email: 'ktahan629@gmail.com',
      phone: '+880 1911-287501',
      rankTier: 'Secretariat',
      title: 'Secretary of Technology',
      department: 'Technology & Digital Systems',
      isCEO: false,
      accessPin: 'SEC-2026',
      password: 'Zaki#2026@sec',
      ecardId: 'UYFSR-EXEC-006',
      activeSince: '30 May 2025',
      bio: 'Overseeing technological implementations, web engineering, system integrations, and digital operations for research cohorts and events.'
    },
    {
      id: 'exec-7',
      name: 'Soyaib Islam',
      email: 'soyaib248@gmail.com',
      phone: '+880 1349-359808',
      rankTier: 'Executive Council',
      title: 'Chief Research Officer (CRO)',
      department: 'Research Strategy & Scientific Development',
      isCEO: false,
      accessPin: 'CRO-2026',
      password: 'Soyaib#2026@cro',
      ecardId: 'UYFSR-EXEC-007',
      activeSince: '30 May 2025',
      bio: 'Directing research methodologies, academic publications, research clinics, and scientific curriculum standards for youth cohorts across Bangladesh.'
    },
    {
      id: 'exec-8',
      name: 'Fahim Samiul Islam',
      email: 'samiulislamfahim8@gmail.com',
      phone: '+880 1303-290971',
      rankTier: 'Executive Council',
      title: 'Deputy Chief Executive Officer (DCEO)',
      department: 'Executive Directorate & Program Operations',
      isCEO: false,
      accessPin: 'DCEO-2026',
      password: 'Fahim#2026@dceo',
      ecardId: 'UYFSR-EXEC-008',
      activeSince: '30 May 2025',
      bio: 'Assisting executive leadership in organizational governance, nationwide youth program coordination, institutional strategy, and council development.'
    },
    {
      id: 'exec-9',
      name: 'Md Nabil Tahmid',
      email: 'hassantahmid312@gmail.com',
      phone: '+880 1617-607048',
      rankTier: 'Executive Council',
      title: 'Chief Human Resources Officer (CHRO)',
      department: 'Human Resources & Talent Development',
      isCEO: false,
      accessPin: 'CHRO-2026',
      password: 'Nabil#2026@chro',
      ecardId: 'UYFSR-EXEC-009',
      activeSince: '30 May 2025',
      bio: 'Leading human capital management, leadership talent development, nationwide member recruitment, and organizational community welfare.'
    },
    {
      id: 'exec-10',
      name: 'Oasimul Rafin',
      email: 'Oasimulrafin@gmail.com',
      phone: '+880 1855-052383',
      rankTier: 'Advisors',
      title: 'Adviser',
      department: 'Advisory Board & Academic Oversight',
      isCEO: false,
      accessPin: 'ADV2-2026',
      password: 'Rafin#2026@adv',
      ecardId: 'UYFSR-EXEC-010',
      activeSince: '30 May 2025',
      bio: 'Providing strategic mentorship, academic guidance, and institutional governance for national youth research and innovation initiatives.'
    },
    {
      id: 'exec-11',
      name: 'Jarin Tasnim',
      email: 'parkjarinot7@gmail.com',
      phone: '+880 1333-623162',
      rankTier: 'Executive Council',
      title: 'Chief Management Officer (CMO)',
      department: 'Management Operations & Public Affairs',
      isCEO: false,
      accessPin: 'CMO2-2026',
      password: 'Jarin#2026@cmo',
      ecardId: 'UYFSR-EXEC-011',
      activeSince: '30 May 2025',
      bio: 'Directing organizational management workflows, inter-institutional communications, event logistics, and youth cohort engagement.'
    }
  ],
  applications: [],
  submissions: [],
  vouchers: [
    {
      code: 'UYFSR-REF-MBJ2026',
      createdBy: 'Mustafiz Bin Jihad',
      creatorRole: 'Chief Executive Officer (CEO)',
      discount: '20% Executive Discount',
      maxUses: 50,
      usedCount: 8,
      createdAt: '2026-06-01T00:00:00.000Z'
    },
    {
      code: 'UYFSR-REF-SM2026',
      createdBy: 'Shahriar Mejba',
      creatorRole: 'Chief Operating Officer (COO)',
      discount: '20% Executive Discount',
      maxUses: 30,
      usedCount: 4,
      createdAt: '2026-06-15T00:00:00.000Z'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      senderName: 'Mustafiz Bin Jihad',
      senderRole: 'Chief Executive Officer (CEO)',
      channel: 'Executive Council',
      message: 'Please ensure all committee leads and secretariats review participant abstracts before the weekly council.',
      timestamp: '10:30 AM'
    },
    {
      id: 'msg-2',
      senderName: 'Shahriar Mejba',
      senderRole: 'Chief Operating Officer (COO)',
      channel: 'Executive Council',
      message: 'Eclipse 2026 exhibition categories have reached 14 ratified tracks. Stage setups are confirmed with partners.',
      timestamp: '11:15 AM'
    },
    {
      id: 'msg-3',
      senderName: 'Shahriyar Tashkir',
      senderRole: 'Chief Technology Officer (CTO)',
      channel: 'Executive Council',
      message: 'Digital registration portal and submission systems are operating smoothly. Server status green.',
      timestamp: '12:05 PM'
    }
  ],
  meetings: [
    {
      id: 'meet-1',
      title: 'National Science Eclipse Steering Session',
      hostName: 'Mustafiz Bin Jihad',
      attendees: ['Shahriar Mejba', 'Dalia Sultana Joty', 'Shahriyar Tashkir'],
      dateTime: 'Tomorrow at 4:00 PM',
      agenda: 'Finalizing participant registration quotas and media broadcasts with Motion BD.',
      status: 'scheduled',
      createdAt: new Date().toISOString()
    },
    {
      id: 'meet-2',
      title: 'Talent Award Jury Consultation',
      hostName: 'Shahriar Mejba',
      attendees: ['Mustafiz Bin Jihad', 'Taki Al Zaki'],
      dateTime: 'Friday at 6:30 PM',
      agenda: 'Coordination with TWIMBOL and KIDLON presenting teams.',
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }
  ],
  news: [
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
      syncedAt: new Date().toISOString()
    },
    {
      id: 'FB-POST-102',
      title: 'Campus Ambassador Recruitment: Cohort 2026',
      excerpt: 'UYFSR is actively seeking passionate student ambassadors across secondary schools, higher secondary colleges, and universities to lead scientific culture and research initiatives on their campus.',
      fullContent: 'Official Call for Campus Ambassadors — Cohort 2026:\n\nDo you want to represent the United Youth Forum of Science and Research (UYFSR) at your institution? We are now recruiting dedicated student representatives nationwide!\n\nApply now through the registration portal or email us at uyfsr.org@gmail.com.',
      date: '22 October 2026',
      category: 'Ambassadors',
      facebookUrl: 'https://www.facebook.com/uyfsr',
      likes: 418,
      comments: 73,
      shares: 112,
      syncedAt: new Date().toISOString()
    }
  ]
}

class JsonDatabase {
  private cache: DatabaseSchema | null = null
  private writePromise: Promise<void> | null = null
  private pendingWrite = false

  async init(): Promise<void> {
    try {
      if (process.env.VERCEL) {
        try {
          await fs.access(DB_FILE)
        } catch {
          try {
            const seedContent = await fs.readFile(SEED_FILE, 'utf-8')
            await fs.writeFile(DB_FILE, seedContent, 'utf-8')
          } catch {
            await fs.writeFile(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8')
          }
        }
      }

      const data = await fs.readFile(DB_FILE, 'utf-8')
      this.cache = JSON.parse(data)
      // Synchronize executive council seed attributes (phones, emails, records)
      if (this.cache && Array.isArray(this.cache.executives)) {
        let changed = false
        for (const seedExec of initialSeed.executives) {
          const existing = this.cache.executives.find((e) => e.id === seedExec.id)
          if (existing) {
            if (seedExec.email && existing.email !== seedExec.email) {
              existing.email = seedExec.email
              changed = true
            }
            if (seedExec.phone && existing.phone !== seedExec.phone) {
              existing.phone = seedExec.phone
              changed = true
            }
            if (seedExec.accessPin && !existing.accessPin) {
              existing.accessPin = seedExec.accessPin
              changed = true
            }
            if (seedExec.password && !existing.password) {
              existing.password = seedExec.password
              changed = true
            }
          } else {
            this.cache.executives.push(seedExec)
            changed = true
          }
        }
        if (changed) {
          await this.persist().catch(() => {})
        }
      }
    } catch {
      this.cache = initialSeed
      await this.persist().catch(() => {})
    }
  }

  private async persist(): Promise<void> {
    if (!this.cache) return
    if (this.writePromise) {
      this.pendingWrite = true
      return this.writePromise
    }

    this.writePromise = (async () => {
      try {
        do {
          this.pendingWrite = false
          await fs.writeFile(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf-8')
        } while (this.pendingWrite)
      } catch (err) {
        // In serverless environments (Vercel Lambda), file writes to /var/task may be read-only.
      } finally {
        this.writePromise = null
      }
    })()

    return this.writePromise
  }

  async get<K extends keyof DatabaseSchema>(table: K): Promise<DatabaseSchema[K]> {
    if (!this.cache) await this.init()
    return this.cache![table]
  }

  async insert<K extends keyof DatabaseSchema>(table: K, item: DatabaseSchema[K][number]): Promise<void> {
    if (!this.cache) await this.init()
    ;(this.cache![table] as any[]).push(item)
    await this.persist()
  }

  async update<K extends keyof DatabaseSchema>(
    table: K,
    predicate: (item: DatabaseSchema[K][number]) => boolean,
    updater: (item: DatabaseSchema[K][number]) => void
  ): Promise<boolean> {
    if (!this.cache) await this.init()
    const list = this.cache![table] as any[]
    const target = list.find(predicate)
    if (!target) return false
    updater(target)
    await this.persist()
    return true
  }

  async set<K extends keyof DatabaseSchema>(table: K, data: DatabaseSchema[K]): Promise<void> {
    if (!this.cache) await this.init()
    this.cache![table] = data
    await this.persist()
  }

  async delete<K extends keyof DatabaseSchema>(
    table: K,
    predicate: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<boolean> {
    if (!this.cache) await this.init()
    const list = this.cache![table] as any[]
    const initialLen = list.length
    const remaining = list.filter((item) => !predicate(item))
    if (remaining.length === initialLen) return false
    ;(this.cache![table] as any[]) = remaining
    await this.persist()
    return true
  }
}

export const db = new JsonDatabase()
