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
  dob?: string
  photo?: string
  facebookUrl?: string
  password?: string
  rankTier: 'Executive Council' | 'Advisors' | 'Secretariat'
  title: string
  department: string
  isCEO: boolean
  accessPin: string
  ecardId: string
  activeSince: string
  bio: string
  status?: 'active' | 'pending' | 'rejected' | 'deactivated'
  appliedAt?: string
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

export interface SiteEvent {
  id: string
  title: string
  dateDisplay: {
    days: string
    monthYear: string
    duration: string
  }
  category: string
  uyfsrRole: string
  organizer: string
  detailsNote: string
  description: string
  status: 'Upcoming 2026' | 'Ongoing' | 'Scheduled' | 'Completed'
}

export interface SitePartner {
  id: string
  name: string
  role: string
  description: string
  logo: string
  category: 'Strategic Alliances' | 'Media Consortium' | 'Club & Campus Partners' | 'Community & Affiliates'
}

export interface SiteFaq {
  id: string
  q: string
  a: string
  category: 'About UYFSR' | 'Olympiads & Fairs' | 'Participation & Research'
}

export interface SiteHero {
  headline: string
  leadText: string
  foundationDate: string
  foundationLabel: string
  foundationSub: string
  studentsTarget: number
  studentsSuffix: string
  studentsLabel: string
  studentsSub: string
  categoriesTarget: number
  categoriesLabel: string
  categoriesSub: string
  alliancesTarget: number
  alliancesLabel: string
  alliancesSub: string
}

export interface SiteMissionVision {
  missionTitle: string
  missionText: string
  visionTitle: string
  visionText: string
}

export interface SiteTrackConfig {
  id: string
  num: string
  title: string
  isOpen: boolean
  sessionTitle?: string
  notice?: string
  fee?: string
}

export interface SiteContent {
  hero: SiteHero
  missionVision: SiteMissionVision
  events: SiteEvent[]
  partners: SitePartner[]
  faqs: SiteFaq[]
  tracks?: SiteTrackConfig[]
}

export interface DatabaseSchema {
  executives: Executive[]
  applications: Application[]
  submissions: StudentSubmission[]
  vouchers: Voucher[]
  messages: Message[]
  meetings: Meeting[]
  news: NewsPost[]
  siteContent?: SiteContent
}

export const defaultSiteContent: SiteContent = {
  hero: {
    headline: 'Science, research, and reform by youth.',
    leadText:
      'Welcome to the official page of UYFSR — United Youth Forum of Science and Research, established 30 May 2025. Where young minds unite to ignite change through science and reform. We turn ideas into action, dreams into movements, and passion into progress. Join us in shaping a smarter, stronger, and sustainable tomorrow.',
    foundationDate: '30 May 2025',
    foundationLabel: 'Established foundation date',
    foundationSub: 'Central Council charter established',
    studentsTarget: 2.6,
    studentsSuffix: 'K+',
    studentsLabel: 'Students guided in research',
    studentsSub: 'School & college cohorts nationwide',
    categoriesTarget: 14,
    categoriesLabel: 'Competition categories',
    categoriesSub: 'National Science Eclipse disciplines',
    alliancesTarget: 11,
    alliancesLabel: 'Institutional alliances',
    alliancesSub: 'TWIMBOL, KIDLON & media partners'
  },
  missionVision: {
    missionTitle: 'Our Mission',
    missionText:
      'The mission of United Youth Forum of Science and Research (UYFSR) is to introduce and promote the culture of research among students and young individuals. We believe that research is not limited to scientists or higher-level academics; it is a field of exploration that everyone should have the opportunity to understand and experience. Our aim is to inspire students to think beyond textbooks, ask questions, explore new ideas, and develop a deeper understanding of the world through scientific thinking and research.',
    visionTitle: 'Our Vision',
    visionText:
      'Our vision is to build a generation that is curious, creative, knowledgeable, and passionate about research and scientific exploration. We aspire to make research more accessible and familiar to students and people from different backgrounds, encouraging them to explore new possibilities, challenge existing ideas, and contribute to the advancement of knowledge.'
  },
  events: [
    {
      id: 'eclipse-2026',
      title: 'National Science Eclipse 2026',
      dateDisplay: { days: '16–18', monthYear: 'April 2026', duration: '3-Day Event' },
      category: 'Science Fair & Olympiad',
      uyfsrRole: 'Lead Organizer',
      organizer: 'United Youth Forum of Science and Research (UYFSR)',
      detailsNote: 'Official UYFSR Flagship Program',
      description:
        'Our flagship national science festival uniting young researchers, students, and aspiring innovators through project exhibitions, science competitions, and theoretical problem-solving olympiads.',
      status: 'Upcoming 2026'
    },
    {
      id: 'junior-talent-season-1',
      title: 'KIDLON Presents Junior Talent Award – Season 1',
      dateDisplay: { days: '18', monthYear: 'July 2026', duration: '21-Day Event' },
      category: 'Talent & Research Search',
      uyfsrRole: 'Community Partner',
      organizer: 'TWIMBOL (Presented by KIDLON)',
      detailsNote: 'Venue Partner: KIDLON',
      description:
        'A 21-day youth talent discovery program empowering school and college students to showcase original ideas, discover research interests, and receive structured mentorship.',
      status: 'Scheduled'
    },
    {
      id: 'junior-startup-season-1',
      title: 'Junior Startup Challenge – Season 1',
      dateDisplay: { days: '3', monthYear: 'September 2026', duration: 'Full-Day Summit' },
      category: 'Innovation & Project Showcase',
      uyfsrRole: 'Community Partner',
      organizer: 'TWIMBOL',
      detailsNote: 'Innovation & Startup Exhibition',
      description:
        'Encouraging young innovators to turn scientific inquiry and creative prototypes into meaningful societal solutions and community ventures.',
      status: 'Scheduled'
    },
    {
      id: 'journalism-carnival-2025',
      title: '1st National Journalism Carnival 2025',
      dateDisplay: { days: '17–19', monthYear: 'October 2025', duration: '3-Day Event' },
      category: 'Workshops & Media',
      uyfsrRole: 'Workshop Partner',
      organizer: 'Adamjee School News Network & Communication Club',
      detailsNote: 'Scientific Communication Sessions',
      description:
        'Specialized three-day educational carnival promoting scientific communication, objective reporting, and analytical journalism among youth.',
      status: 'Completed'
    }
  ],
  partners: [
    {
      id: 'p-twimbol',
      name: 'TWIMBOL',
      role: 'Strategic Event & Outreach Partner',
      description:
        'Co-organizing nationwide youth talent initiatives including the Junior Talent Award and Junior Startup Challenge.',
      logo: '/images/partners/twimbol.png',
      category: 'Strategic Alliances'
    },
    {
      id: 'p-kidlon',
      name: 'KIDLON',
      role: 'Venue & Presenting Partner',
      description:
        'Providing hosting venues and presenting partner for Season 1 of the Junior Talent Award across national stages.',
      logo: '/images/partners/kidlon.png',
      category: 'Strategic Alliances'
    },
    {
      id: 'p-mejology',
      name: 'MEJOLOGY',
      role: 'Academic Content Partner',
      description:
        'Academic content collaboration and curriculum development for secondary school empirical research workshops.',
      logo: '/images/partners/mejology.svg',
      category: 'Strategic Alliances'
    },
    {
      id: 'p-astrosphere',
      name: 'ASTROSPHERE',
      role: 'Olympiad & Astronomy Co-organizer',
      description:
        'Co-organizing astronomical science sessions, olympiad question panels, and youth space awareness seminars.',
      logo: '/images/partners/astrosphere.svg',
      category: 'Strategic Alliances'
    },
    {
      id: 'p-bayline',
      name: 'The Bayline Journal',
      role: 'Editorial Media Partner',
      description:
        'In-depth editorial coverage, investigative student science dispatches, and national carnival publications.',
      logo: '/images/partners/bayline.svg',
      category: 'Media Consortium'
    },
    {
      id: 'p-motionbd',
      name: 'Motion BD',
      role: 'Broadcast Media Partner',
      description:
        'Video coverage, documentary production, and digital broadcast support for flagship science exhibitions.',
      logo: '/images/partners/motion-bd.svg',
      category: 'Media Consortium'
    },
    {
      id: 'p-tezzfeed',
      name: 'TezzFeed',
      role: 'Digital Media Partner',
      description:
        'Digital media outreach and student innovator spotlight stories across national youth social communities.',
      logo: '/images/partners/tezzfeed.svg',
      category: 'Media Consortium'
    },
    {
      id: 'p-adamjee',
      name: 'Adamjee School News Network & Communication Club',
      role: 'Campus Workshop & Club Partner',
      description:
        'Campus co-organizer and host for the 1st National Journalism Carnival 2025, collaborating on empirical reporting and media literacy clinics.',
      logo: '/images/partners/adamjee.svg',
      category: 'Club & Campus Partners'
    },
    {
      id: 'p-learning',
      name: 'Learning and Study Organization',
      role: 'Academic Study Co-organizer',
      description:
        'Community student mobilization and academic study material curation for olympiad participants.',
      logo: '/images/partners/learning-study.svg',
      category: 'Club & Campus Partners'
    },
    {
      id: 'p-focalvibe',
      name: 'The Focal Vibe',
      role: 'Creative Direction Partner',
      description:
        'Visual identity, creative design coordination, stagecraft aesthetics, and multimedia documentation.',
      logo: '/images/partners/focal-vibe.svg',
      category: 'Community & Affiliates'
    },
    {
      id: 'p-yeasirians',
      name: 'The Yeasirians',
      role: 'Merchandise & Gift Partner',
      description:
        'Official merchandise, commemorative awards, and appreciation packages for competition laureates.',
      logo: '/images/partners/yeasirians.svg',
      category: 'Community & Affiliates'
    },
    {
      id: 'p-aurelix',
      name: 'Aurelix',
      role: 'Event Fragrance Partner',
      description:
        'Event fragrance curation and participant welcome amenities for national symposia.',
      logo: '/images/partners/aurelix.svg',
      category: 'Community & Affiliates'
    }
  ],
  tracks: [
    {
        "id": "workshops",
        "num": "01",
        "title": "Practical Workshops",
        "isOpen": true,
        "sessionTitle": "Hands-on Experimental Methodology Clinic",
        "notice": "Weekend laboratory apparatus handling, titration techniques, and empirical data verification.",
        "fee": "৳250 BDT"
    },
    {
        "id": "seminars-sessions",
        "num": "02",
        "title": "Seminars & Expert Talks",
        "isOpen": false,
        "sessionTitle": "University Faculty Mentorship Series",
        "notice": "Currently, no expert seminars are open for registration. Next cohort opens in April 2026.",
        "fee": "Free Admission"
    },
    {
        "id": "fairs-olympiads",
        "num": "03",
        "title": "Science Fairs & Olympiads",
        "isOpen": true,
        "sessionTitle": "National Science Eclipse 2026 Olympiads",
        "notice": "Multi-disciplinary Olympiad in Physics, Chemistry, Biology & Math with verified credentials.",
        "fee": "৳350 BDT"
    },
    {
        "id": "scientific-competitions",
        "num": "04",
        "title": "Quiz & Problem-Solving",
        "isOpen": false,
        "sessionTitle": "National Inter-College Science Quiz Tournament",
        "notice": "Registration for this track is currently closed. Follow our page for the Season 2 announcement.",
        "fee": "৳150 BDT"
    },
    {
        "id": "youth-development",
        "num": "05",
        "title": "Youth Leadership & Mentorship",
        "isOpen": true,
        "sessionTitle": "Campus Ambassador & Scientific Leadership Cohort",
        "notice": "Leadership credentials and campus science club organization mentorship.",
        "fee": "100% Free"
    }
],
  faqs: [
    {
      id: 'faq-1',
      q: 'What is the United Youth Forum of Science and Research (UYFSR)?',
      a: 'United Youth Forum of Science and Research (UYFSR) is an educational and research-oriented organization established on 30 May 2025. Our mission is to promote science, research, innovation, and scientific awareness among young minds, turning curiosity into meaningful knowledge and impactful action.',
      category: 'About UYFSR'
    },
    {
      id: 'faq-2',
      q: 'Who is eligible to participate in UYFSR programs and workshops?',
      a: 'Our programs are open to school, college, and undergraduate students, as well as young independent researchers. We design our competitions, Olympiads, and seminars, including the National Science Eclipse and Junior Talent Awards, to welcome students at all stages of their academic journey.',
      category: 'Participation & Research'
    },
    {
      id: 'faq-3',
      q: 'How does UYFSR make scientific research accessible to students?',
      a: 'We believe research is not limited to senior institutional professors. We guide students to think beyond textbooks, formulate original questions, and learn practical methodology through hands-on seminars, peer collaboration, and project showcases.',
      category: 'Participation & Research'
    },
    {
      id: 'faq-4',
      q: 'What are the flagship upcoming events scheduled for 2026?',
      a: 'Key upcoming events include the National Science Eclipse 2026 (16–18 April 2026), KIDLON Presents Junior Talent Award: Season 1 (18 July 2026), and the Junior Startup Challenge: Season 1 (3 September 2026).',
      category: 'Olympiads & Fairs'
    },
    {
      id: 'faq-5',
      q: 'How can institutions and youth clubs partner with UYFSR?',
      a: 'We actively collaborate with educational institutions, campus media clubs, and partner organizations as co-organizers, workshop partners, and venue hosts, working alongside partners like TWIMBOL, KIDLON, MEJOLOGY, and Adamjee School Communication Club.',
      category: 'About UYFSR'
    }
  ]
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
      dob: '10/15/2009',
      rankTier: 'Secretariat',
      title: 'Secretary of Technology',
      department: 'Technology & Digital Systems',
      isCEO: false,
      accessPin: 'SEC-2026',
      password: 'Zaki#2026@sec',
      ecardId: 'UYFSR-SEC-84D2-9K1F',
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
      // Synchronize missing executive council seed attributes (never overwrite user-edited fields)
      if (this.cache && Array.isArray(this.cache.executives)) {
        let changed = false
        for (const seedExec of initialSeed.executives) {
          const existing = this.cache.executives.find((e) => e.id === seedExec.id)
          if (existing) {
            if (!existing.status) {
              existing.status = 'active'
              changed = true
            }
            if (seedExec.email && !existing.email) {
              existing.email = seedExec.email
              changed = true
            }
            if (seedExec.phone && !existing.phone) {
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
            this.cache.executives.push({ ...seedExec, status: 'active' })
            changed = true
          }
        }
        if (!this.cache.siteContent) {
          this.cache.siteContent = structuredClone(defaultSiteContent)
          changed = true
        }
        if (changed) {
          await this.persist().catch(() => {})
        }
      }
    } catch {
      this.cache = { ...initialSeed, siteContent: structuredClone(defaultSiteContent) }
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

  async getSiteContent(): Promise<SiteContent> {
    if (!this.cache) await this.init()
    if (!this.cache!.siteContent) {
      this.cache!.siteContent = structuredClone(defaultSiteContent)
    }
    return this.cache!.siteContent
  }

  async setSiteContent(content: SiteContent): Promise<void> {
    if (!this.cache) await this.init()
    this.cache!.siteContent = content
    await this.persist()
  }

  async insert<K extends Exclude<keyof DatabaseSchema, 'siteContent'>>(
    table: K,
    item: DatabaseSchema[K][number]
  ): Promise<void> {
    if (!this.cache) await this.init()
    ;(this.cache![table] as any[]).push(item)
    await this.persist()
  }

  async update<K extends Exclude<keyof DatabaseSchema, 'siteContent'>>(
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

  async delete<K extends Exclude<keyof DatabaseSchema, 'siteContent'>>(
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
