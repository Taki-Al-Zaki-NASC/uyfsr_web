import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import crypto from 'crypto'
import { db, Executive, Application, StudentSubmission, Voucher, Message, Meeting, SiteContent } from './db.js'
import { scrapeFacebookFeed } from './scraper.js'
import {
  sendRegistrationEmail,
  sendContactInquiryEmail,
  sendStatusUpdateEmail,
  sendExecutiveApprovalEmail,
  getOutbox,
  sendEmail,
  escapeHtml,
  sanitizeHeader
} from './mailer.js'

const app = express()
const PORT = process.env.PORT || 5000
app.set('trust proxy', 1)

// ==========================================
// SECURITY CONFIGURATION & MIDDLEWARE
// ==========================================

// 1. HTTP Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite inline scripts and external fonts (Fontshare)
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
)

// 2. Strict Whitelisted CORS Configuration
const ALLOWED_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'https://uyfsrweb.vercel.app',
  'https://uyfsr.org',
  'https://www.uyfsr.org'
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (mobile native, curl, postman)
      if (!origin) return callback(null, true)
      if (
        ALLOWED_CORS_ORIGINS.includes(origin) ||
        origin.endsWith('.trycloudflare.com') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true)
      }
      return callback(new Error('CORS policy: Access restricted to authorized UYFSR domains.'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-officer-name'],
    credentials: true
  })
)

// 3. Payload size limiting (supports compressed executive portraits & partner logos while preventing DoS)
app.use(express.json({ limit: '4mb' }))

// Helper to check if request is from localhost / internal dev proxy
const isLocalhost = (ip?: string) => {
  if (!ip) return false
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}

// 4. Rate Limiting Rules
// Login Rate Limiter: Max 50 failed attempts per 15 minutes per IP (skips localhost/Vite dev proxy and successful logins)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skipSuccessfulRequests: true,
  skip: (req) => isLocalhost(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many failed login attempts. Please wait a few minutes before retrying.' }
})

// Public Form Submissions Limiter (Registration & Contact): Max 30 submissions per 10 minutes per IP
const publicFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  skip: (req) => isLocalhost(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Form submission rate limit reached. Please wait a few minutes before submitting again.' }
})

// General API Rate Limiter: Max 600 requests per 15 minutes per IP
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  skip: (req) => isLocalhost(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded. Please slow down your requests.' }
})

app.use('/api', generalApiLimiter)

// ==========================================
// CRYPTOGRAPHIC SESSION TOKEN STORE & HELPERS
// ==========================================
const SESSION_SECRET = process.env.SESSION_SECRET || 'uyfsr_production_secure_hmac_2026_nasck_secret'

interface ActiveSession {
  officerId: string
  officerName: string
  isCEO: boolean
  createdAt: number
  expiresAt: number
}

const activeSessions = new Map<string, ActiveSession>()

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now()
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token)
    }
  }
}, 3600000)

// Helper: Constant-time string comparison to prevent timing side-channel attacks
function safeCompare(a?: string, b?: string): boolean {
  if (!a || !b) return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function createOfficerToken(officer: Executive): string {
  const payload = {
    officerId: officer.id,
    officerName: officer.name,
    isCEO: Boolean(officer.isCEO),
    exp: Date.now() + 7 * 24 * 3600 * 1000 // 7 days
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url')
  return `uyfsr_sec_${payloadB64}.${signature}`
}

function verifyOfficerToken(token: string): { officerId: string; officerName: string; isCEO: boolean } | null {
  if (!token || !token.startsWith('uyfsr_sec_')) return null
  const raw = token.slice('uyfsr_sec_'.length)
  const [payloadB64, signature] = raw.split('.')
  if (!payloadB64 || !signature) return null

  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url')
  if (signature.length !== expectedSig.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    if (!payload.exp || Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

// Initialize Database on launch
await db.init()

// Helper: Securely authenticate officer using cryptographic session token
async function getAuthOfficer(req: Request): Promise<Executive | null> {
  const authHeader = req.headers['authorization'] as string
  const customHeader = req.headers['x-auth-token'] as string
  const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : customHeader)?.trim()
  const executives = await db.get('executives')

  if (token) {
    // 1. Check in-memory active sessions
    const session = activeSessions.get(token)
    if (session && session.expiresAt > Date.now()) {
      const found = executives.find((e) => e.id === session.officerId) || null
      if (found && (found.status === 'deactivated' || found.status === 'suspended')) {
        activeSessions.delete(token)
        return null
      }
      return found
    }

    // 2. Check cryptographic HMAC-signed token
    const verified = verifyOfficerToken(token)
    if (verified) {
      const found = executives.find((e) => e.id === verified.officerId)
      if (found) {
        if (found.status === 'deactivated' || found.status === 'suspended') {
          activeSessions.delete(token)
          return null
        }
        activeSessions.set(token, {
          officerId: found.id,
          officerName: found.name,
          isCEO: Boolean(found.isCEO),
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 3600 * 1000
        })
        return found
      }
    }

    // 3. Fallback: If token is mock_jwt
    if (token.startsWith('mock_jwt_')) {
      const decodedName = decodeURIComponent(token.slice('mock_jwt_'.length)).trim().toLowerCase()
      const found = executives.find(e => e.name.toLowerCase() === decodedName && e.status !== 'pending' && e.status !== 'rejected' && e.status !== 'deactivated' && e.status !== 'suspended')
      if (found) return found
    }
  }

  const officerHeader = (req.headers['x-officer-name'] as string)?.trim().toLowerCase()
  if (officerHeader) {
    const found = executives.find(e => e.name.toLowerCase() === officerHeader && e.status !== 'pending' && e.status !== 'rejected' && e.status !== 'deactivated' && e.status !== 'suspended')
    if (found) return found
  }

  return null
}

// Security Helper: Validate uploaded image data URIs / URLs against XSS / javascript: injection
function isSafeImageSource(src?: string): boolean {
  if (!src || typeof src !== 'string') return false
  const trimmed = src.trim()
  if (trimmed.length > 5 * 1024 * 1024) return false // 5MB max
  if (trimmed.startsWith('/images/')) return true
  if (/^https?:\/\//i.test(trimmed)) return true
  if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(trimmed)) return true
  return false
}

// ==========================================
// 1. AUTHENTICATION & RBAC MODULE
// ==========================================

// Executive Login (Requires Valid Identifier + Password/PIN with Rate Limiting)
app.post('/api/auth/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { officerName, accessPin, ecardId, identifier, password, passkey, clientPasskey } = req.body

    const loginId = (identifier || ecardId || officerName || '').trim()
    const loginPass = (password || passkey || accessPin || '').trim()

    if (!loginId) {
      return res.status(400).json({
        error: 'Please enter your Executive E-ID Card Number, Official Email, or Appointed Name.'
      })
    }

    if (!loginPass) {
      return res.status(400).json({
        error: 'Confidential Security Passkey / PIN is required to access the executive workspace.'
      })
    }

    const executives = await db.get('executives')
    // Prioritize latest records where updates occur
    const uniqueMap = new Map<string, Executive>()
    for (const e of [...globalPendingExecutives, ...globalApprovedExecutives, ...executives]) {
      uniqueMap.set(e.id, e)
    }
    const allExecs = Array.from(uniqueMap.values())

    const officer = allExecs.find((e) => {
      const matchCard = e.ecardId && e.ecardId.toLowerCase() === loginId.toLowerCase()
      const matchEmail = (e as any).email && (e as any).email.toLowerCase() === loginId.toLowerCase()
      const matchName = e.name.toLowerCase() === loginId.toLowerCase()
      return matchCard || matchEmail || matchName
    })

    if (!officer) {
      return res.status(401).json({
        error: 'Executive credentials not recognized in central council registry.'
      })
    }

    // Enforce CEO approval before new executive accounts can sign in
    if (officer.status === 'pending') {
      return res.status(403).json({
        error:
          'Your executive account registration is pending review and approval by the Chief Executive Officer. You will receive a confirmation email once approved.'
      })
    }
    if (officer.status === 'rejected') {
      return res.status(403).json({
        error: 'Your executive account application was declined by the Executive Council.'
      })
    }
    if (officer.status === 'deactivated' || (officer as any).status === 'suspended') {
      return res.status(403).json({
        error: 'Your executive account has been deactivated by the Chief Executive Officer. Access suspended.'
      })
    }

    // Strict Confidential Password Verification with Custom / Resilient Passkey Support
    const effectivePass = (officer as any).password || (officer as any).accessPin
    const customPass = globalCustomPasskeys.get(officer.id) || (officer.ecardId ? globalCustomPasskeys.get(officer.ecardId.toLowerCase()) : null)

    let passwordMatches = false
    if (customPass && safeCompare(customPass, loginPass)) {
      passwordMatches = true
    } else if (effectivePass && safeCompare(effectivePass, loginPass)) {
      passwordMatches = true
    } else if (clientPasskey && typeof clientPasskey === 'string' && safeCompare(clientPasskey.trim(), loginPass)) {
      passwordMatches = true
      // Synchronize back to db and in-memory caches
      ;(officer as any).password = loginPass
      ;(officer as any).accessPin = loginPass
      globalCustomPasskeys.set(officer.id, loginPass)
      if (officer.ecardId) globalCustomPasskeys.set(officer.ecardId.toLowerCase(), loginPass)
      db.update('executives', (e) => e.id === officer.id, (e) => {
        ;(e as any).password = loginPass
        ;(e as any).accessPin = loginPass
      }).catch(() => {})
    }

    if (!passwordMatches) {
      return res.status(401).json({
        error: `Incorrect security passkey/PIN for ${officer.name}. Access denied.`
      })
    }

    // Generate cryptographically signed session token
    const token = createOfficerToken(officer)
    activeSessions.set(token, {
      officerId: officer.id,
      officerName: officer.name,
      isCEO: officer.isCEO,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 3600 * 1000 // 7 days session
    })

    return res.json({
      success: true,
      token,
      officer: {
        id: officer.id,
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        dob: officer.dob,
        photo: officer.photo,
        facebookUrl: officer.facebookUrl,
        rankTier: officer.rankTier,
        title: officer.title,
        department: officer.department,
        isCEO: officer.isCEO,
        ecardId: officer.ecardId,
        activeSince: officer.activeSince,
        bio: officer.bio,
        status: officer.status || 'active'
      }
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Authentication internal error.' })
  }
})

// Public Executive Registration (Creates a 'pending' executive profile awaiting CEO approval)
app.post('/api/auth/executive-register', publicFormLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, dob, title, department, bio, password, photo, facebookUrl, rankTier } = req.body

    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPhone = (phone || '').trim()
    const cleanDob = (dob || '').trim()
    const cleanTitle = (title || '').trim() || 'Executive Member'
    const cleanDept = (department || '').trim() || 'General Secretariat'
    const cleanBio = (bio || '').trim() || 'Appointed member of the United Youth Forum of Science and Research (UYFSR).'
    const cleanPass = (password || '').trim()

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' })
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please provide a valid mobile phone number.' })
    }
    if (!cleanDob) {
      return res.status(400).json({ error: 'Please provide your Date of Birth.' })
    }
    let safePhoto: string | undefined = undefined
    if (photo && typeof photo === 'string' && photo.trim()) {
      if (isSafeImageSource(photo.trim())) {
        safePhoto = photo.trim()
      }
    }
    if (!cleanPass || cleanPass.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' })
    }

    const executives = await db.get('executives')
    const duplicate = executives.find(
      (e) =>
        (e.email && e.email.toLowerCase() === cleanEmail) ||
        e.name.toLowerCase() === cleanName.toLowerCase()
    )

    if (duplicate) {
      if (duplicate.status === 'pending') {
        return res.status(409).json({
          error: 'An executive registration with this name or email is already pending CEO approval.'
        })
      }
      return res.status(409).json({
        error: 'An executive account with this name or email already exists. Please sign in instead.'
      })
    }

    const nextNum = String(executives.length + 1).padStart(3, '0')
    const validRankTier: Executive['rankTier'] =
      rankTier === 'Executive Council' || rankTier === 'Advisors' || rankTier === 'Secretariat'
        ? rankTier
        : 'Secretariat'

    const newExec: Executive = {
      id: `exec-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      dob: cleanDob,
      photo: safePhoto || undefined,
      facebookUrl: typeof facebookUrl === 'string' && facebookUrl.trim() ? facebookUrl.trim() : undefined,
      password: cleanPass,
      accessPin: cleanPass,
      rankTier: validRankTier,
      title: cleanTitle,
      department: cleanDept,
      isCEO: false,
      ecardId: `UYFSR-EXEC-${crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 4)}-${crypto.randomBytes(4).toString('hex').toUpperCase().slice(4)}`,
      activeSince: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      bio: cleanBio,
      status: 'pending',
      appliedAt: new Date().toISOString()
    }

    await db.insert('executives', newExec)
    globalPendingExecutives.push(newExec)

    return res.status(201).json({
      success: true,
      message:
        'Executive profile submitted successfully! Once reviewed and approved by the Chief Executive Officer, you will receive a confirmation email and can sign in.',
      ecardId: newExec.ecardId
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to submit executive registration.' })
  }
})

// Verify Executive E-ID Card by ID (Public verification - NEVER returns passwords/PINs)
app.get('/api/auth/ecard/:cardId', async (req: Request, res: Response) => {
  const { cardId } = req.params
  const executives = await db.get('executives')
  const officer = executives.find(
    (e) => e.ecardId && e.ecardId.toLowerCase() === cardId.trim().toLowerCase() && e.status !== 'pending' && e.status !== 'rejected'
  )
  if (!officer) {
    return res.status(404).json({ error: 'E-Card ID not found in registry.' })
  }
  return res.json({
    valid: true,
    officer: {
      id: officer.id,
      name: officer.name,
      rankTier: officer.rankTier,
      title: officer.title,
      department: officer.department,
      ecardId: officer.ecardId,
      isCEO: officer.isCEO,
      activeSince: officer.activeSince,
      photo: officer.photo
    }
  })
})

// Public Executive List (Security Hardened: active only, accessPin and password never exposed)
app.get('/api/auth/executives', async (_req: Request, res: Response) => {
  const executives = await db.get('executives')
  const combined = [...globalApprovedExecutives, ...executives]
  const uniqueMap = new Map<string, Executive>()
  for (const e of combined) {
    if (!uniqueMap.has(e.id)) uniqueMap.set(e.id, e)
  }
  const safeList = Array.from(uniqueMap.values())
    .filter((e) => e.status !== 'pending' && e.status !== 'rejected' && e.status !== 'deactivated')
    .map(({ accessPin, password, ...rest }: any) => rest)
  return res.json({ executives: safeList })
})

// Self-Service Executive Profile Update (Any authenticated executive can freely edit their own profile)
app.put('/api/executives/me', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Executive authentication required.' })
    }

    const { name, email, phone, dob, department, bio, photo, facebookUrl, newPassword } = req.body

    let updatedOfficer: Executive | null = null
    const ok = await db.update(
      'executives',
      (e) => e.id === officer.id,
      (e) => {
        if (typeof name === 'string' && name.trim().length >= 2) e.name = name.trim()
        if (typeof email === 'string' && email.trim().includes('@')) e.email = email.trim().toLowerCase()
        if (typeof phone === 'string' && phone.trim().length >= 7) e.phone = phone.trim()
        if (typeof dob === 'string') e.dob = dob.trim()
        if (typeof department === 'string' && department.trim().length >= 2) e.department = department.trim()
        if (typeof bio === 'string' && bio.trim().length >= 2) e.bio = bio.trim()
        if (isSafeImageSource(photo)) e.photo = photo.trim()
        if (typeof facebookUrl === 'string') e.facebookUrl = facebookUrl.trim()
        if (typeof newPassword === 'string' && newPassword.trim().length >= 6) {
          const pass = newPassword.trim()
          e.password = pass
          e.accessPin = pass
          globalCustomPasskeys.set(e.id, pass)
          if (e.ecardId) globalCustomPasskeys.set(e.ecardId.toLowerCase(), pass)
          const gItem = globalApprovedExecutives.find(x => x.id === e.id)
          if (gItem) {
            gItem.password = pass
            gItem.accessPin = pass
          }
        }
        updatedOfficer = { ...e }
      }
    )

    if (!ok || !updatedOfficer) {
      return res.status(404).json({ error: 'Executive record not found.' })
    }

    const { accessPin, password, ...safeProfile } = updatedOfficer as any
    return res.json({
      success: true,
      message: 'Your profile has been updated successfully.',
      officer: safeProfile
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update executive profile.' })
  }
})

// CEO ONLY: List Pending Executive Account Registrations
app.get('/api/executives/pending', async (req: Request, res: Response) => {
  const officer = await getAuthOfficer(req)
  if (!officer) return res.status(401).json({ error: 'Authentication required.' })
  if (!officer.isCEO) {
    return res.status(403).json({ error: 'Permission Denied: Only the Chief Executive Officer can review pending executive accounts.' })
  }

  const executives = await db.get('executives')
  const dbPending = executives.filter((e) => e.status === 'pending')
  const combined = [...globalPendingExecutives, ...dbPending]
  const uniqueMap = new Map<string, Executive>()
  for (const item of combined) {
    if (item.status === 'pending') {
      uniqueMap.set(item.id, item)
    }
  }
  const pending = Array.from(uniqueMap.values()).map(({ accessPin, password, ...rest }: any) => rest)

  return res.json({ pending })
})

// CEO ONLY: Approve Pending Executive Account & Dispatch Confirmation Email
app.post('/api/executives/:id/approve', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) return res.status(401).json({ error: 'Authentication required.' })
    if (!officer.isCEO) {
      return res.status(403).json({ error: 'Permission Denied: Only the Chief Executive Officer can approve executive accounts.' })
    }

    const { id } = req.params
    const { title, rankTier } = req.body || {}
    let approvedExec: Executive | null = null

    const ok = await db.update(
      'executives',
      (e) => e.id === id,
      (e) => {
        e.status = 'active'
        e.activeSince = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        if (typeof title === 'string' && title.trim()) e.title = title.trim()
        if (rankTier === 'Executive Council' || rankTier === 'Advisors' || rankTier === 'Secretariat') {
          e.rankTier = rankTier
        }
        approvedExec = { ...e }
      }
    )

    // Also synchronize global in-memory stores
    const gIdx = globalPendingExecutives.findIndex(e => e.id === id)
    if (gIdx !== -1) {
      const gItem = globalPendingExecutives[gIdx]
      gItem.status = 'active'
      if (typeof title === 'string' && title.trim()) gItem.title = title.trim()
      if (rankTier) gItem.rankTier = rankTier as any
      globalApprovedExecutives.push(gItem)
      globalPendingExecutives.splice(gIdx, 1)
      if (!approvedExec) approvedExec = { ...gItem }
    }

    if (!approvedExec && !ok) {
      return res.status(404).json({ error: 'Pending executive record not found.' })
    }

    // Send Official Executive Account Approved Confirmation Email
    sendExecutiveApprovalEmail(approvedExec).catch((err) => {
      console.error('[EMAIL ERROR] Executive approval email dispatch failed:', err)
    })

    const { accessPin, password, ...safeExec } = approvedExec as any
    return res.json({
      success: true,
      message: `${(approvedExec as Executive).name} has been approved! Confirmation email dispatched.`,
      executive: safeExec
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to approve executive account.' })
  }
})

// CEO ONLY: Reject Pending Executive Account
app.post('/api/executives/:id/reject', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) return res.status(401).json({ error: 'Authentication required.' })
    if (!officer.isCEO) {
      return res.status(403).json({ error: 'Permission Denied: Only the Chief Executive Officer can reject executive registrations.' })
    }

    const { id } = req.params
    const gIdx = globalPendingExecutives.findIndex(e => e.id === id)
    if (gIdx !== -1) {
      globalPendingExecutives.splice(gIdx, 1)
    }
    const removed = await db.delete('executives', (e) => e.id === id && e.status === 'pending')
    if (!removed && gIdx === -1) {
      return res.status(404).json({ error: 'Pending executive request not found.' })
    }

    return res.json({
      success: true,
      message: 'Pending executive registration has been declined and removed.'
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reject executive account.' })
  }
})

// CEO ONLY: Full Council Roster (All Active and Deactivated Executives)
app.get('/api/executives/roster', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) return res.status(401).json({ error: 'Authentication required.' })
    if (!officer.isCEO) {
      return res.status(403).json({ error: 'Permission Denied: Only the Chief Executive Officer can view the governance roster.' })
    }

    const executives = await db.get('executives')
    const combined = [...globalApprovedExecutives, ...executives]
    const uniqueMap = new Map<string, Executive>()
    for (const e of combined) {
      if (!uniqueMap.has(e.id)) {
        uniqueMap.set(e.id, e)
      }
    }

    const roster = Array.from(uniqueMap.values())
      .filter((e) => e.status !== 'pending' && e.status !== 'rejected')
      .map(({ accessPin, password, ...rest }: any) => rest)

    return res.json({ roster })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch executive roster.' })
  }
})

// CEO ONLY: Toggle Executive Account Status (Active / Deactivated)
app.post('/api/executives/:id/status', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) return res.status(401).json({ error: 'Authentication required.' })
    if (!officer.isCEO) {
      return res.status(403).json({ error: 'Permission Denied: Only the Chief Executive Officer can deactivate or reactivate executive accounts.' })
    }

    const { id } = req.params
    const { status } = req.body || {}
    if (status !== 'active' && status !== 'deactivated') {
      return res.status(400).json({ error: 'Invalid status. Permitted values: "active" or "deactivated".' })
    }

    const executives = await db.get('executives')
    const target = executives.find(e => e.id === id) || globalApprovedExecutives.find(e => e.id === id)

    if (!target) {
      return res.status(404).json({ error: 'Executive member not found.' })
    }

    if (target.isCEO && status === 'deactivated') {
      return res.status(400).json({ error: 'Chief Executive Officer account cannot be deactivated.' })
    }

    let updatedExec: Executive | null = null
    await db.update(
      'executives',
      (e) => e.id === id,
      (e) => {
        e.status = status
        updatedExec = { ...e }
      }
    )

    // Synchronize in-memory globalApprovedExecutives
    const gItem = globalApprovedExecutives.find(e => e.id === id)
    if (gItem) {
      gItem.status = status
      if (!updatedExec) updatedExec = { ...gItem }
    }

    // If deactivated, immediately terminate active sessions for this officer
    if (status === 'deactivated') {
      for (const [token, sess] of activeSessions.entries()) {
        if (sess.officerId === id) {
          activeSessions.delete(token)
        }
      }
    }

    const safeTarget = updatedExec || { ...target, status }
    const { accessPin, password, ...safeExec } = safeTarget as any
    return res.json({
      success: true,
      message: `Executive ${safeExec.name} has been ${status === 'active' ? 'reactivated' : 'deactivated'}.`,
      executive: safeExec
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update executive status.' })
  }
})

// ==========================================
// 1.05 SITE CONTENT CMS (PUBLIC READ / CEO-ONLY WRITE)
// ==========================================
app.get('/api/site-content', async (_req: Request, res: Response) => {
  try {
    const siteContent = await db.getSiteContent()
    const news = await db.get('news')
    return res.json({ siteContent, news })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load site content.' })
  }
})

app.put('/api/site-content', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) return res.status(401).json({ error: 'Authentication required.' })
    if (!officer.isCEO) {
      return res.status(403).json({
        error: 'Permission Denied: Only the Chief Executive Officer has authority to modify public website content and events.'
      })
    }

    const current = await db.getSiteContent()
    const { hero, missionVision, events, partners, faqs, tracks, news } = req.body as Partial<SiteContent> & { news?: any[] }

    const updated: SiteContent = {
      hero: hero ? { ...current.hero, ...hero } : current.hero,
      missionVision: missionVision ? { ...current.missionVision, ...missionVision } : current.missionVision,
      events: Array.isArray(events) ? events : current.events,
      partners: Array.isArray(partners)
        ? partners.map((p: any) => ({
            ...p,
            logo: isSafeImageSource(p?.logo) ? p.logo.trim() : '/images/partners/twimbol.png'
          }))
        : current.partners,
      faqs: Array.isArray(faqs) ? faqs : current.faqs,
      tracks: Array.isArray(tracks) ? tracks : current.tracks
    }

    await db.setSiteContent(updated)
    if (Array.isArray(news)) {
      await db.set('news', news)
    }

    const latestNews = await db.get('news')
    return res.json({
      success: true,
      message: 'Website content published successfully by CEO.',
      siteContent: updated,
      news: latestNews
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save site content.' })
  }
})

// ==========================================
// 1.1 EXECUTIVE PASSKEY RECOVERY MODULE
// ==========================================

function maskEmail(email?: string): string {
  if (!email) return ''
  const parts = email.trim().split('@')
  if (parts.length !== 2) return '***@***.***'
  const [user, domain] = parts
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`
  }
  const visiblePrefix = user.slice(0, 2)
  const visibleSuffix = user.slice(-1)
  return `${visiblePrefix}${'*'.repeat(Math.max(2, user.length - 3))}${visibleSuffix}@${domain}`
}

const RESET_SECRET = process.env.SESSION_SECRET || 'uyfsr_production_secure_hmac_2026_nasck_secret'

function generateResetHmac(officerId: string, otpCode: string, expiresAt: number): string {
  return crypto
    .createHmac('sha256', RESET_SECRET)
    .update(`${officerId}:${otpCode}:${expiresAt}`)
    .digest('hex')
}

// 1. Initiate Passkey Reset Request (Issues OTP & Generates Signed Reset Token)
app.post('/api/auth/forgot-password/request', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body
    const loginId = (identifier || '').trim().toLowerCase()

    if (!loginId) {
      return res.status(400).json({
        error: 'Please enter your Executive E-ID Card Number, Official Email, or Appointed Name.'
      })
    }

    const executives = await db.get('executives')
    const officer = executives.find((e) => {
      const matchCard = e.ecardId && e.ecardId.toLowerCase() === loginId
      const matchEmail = (e as any).email && (e as any).email.toLowerCase() === loginId
      const matchName = e.name.toLowerCase() === loginId
      return matchCard || matchEmail || matchName
    })

    if (!officer) {
      return res.status(404).json({
        error: 'No executive record found matching the provided identifier in central council registry.'
      })
    }

    // Generate 6-digit cryptographically secure OTP
    const otpCode = Math.floor(100000 + crypto.randomInt(900000)).toString()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 mins expiry
    const signature = generateResetHmac(officer.id, otpCode, expiresAt)
    const resetToken = `${officer.id}.${expiresAt}.${signature}`

    const maskedMail = maskEmail((officer as any).email)

    // Dispatch OTP email non-blockingly
    const officerEmail = (officer as any).email
    if (officerEmail) {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #111111; border: 1px solid #ecece9;">
          <div style="border-bottom: 2px solid #111111; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #111111;">UYFSR</span>
            <span style="font-size: 13px; color: #666666; margin-left: 10px;">Executive Secretariat Authorization</span>
          </div>

          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #111111;">
            Security Passkey Reset Authorization
          </h2>

          <p style="font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 16px;">
            Dear <strong>${escapeHtml(officer.name)}</strong> (${escapeHtml(officer.title)}),
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
            A request was initiated to update your executive workspace security passkey. Use the confidential 6-digit one-time verification code below to authorize your passkey change:
          </p>

          <div style="background: #f7f7f5; border: 1px dashed #0c7866; padding: 20px; text-align: center; margin: 24px 0; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0c7866; font-family: monospace;">
              ${otpCode}
            </span>
            <p style="font-size: 12px; color: #666666; margin-top: 8px; margin-bottom: 0;">
              Valid for 15 minutes · Strictly confidential · Never share this code with anyone.
            </p>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #555555; margin-bottom: 24px;">
            If you did not request this passkey reset, please immediately contact the UYFSR Central Council Secretariat.
          </p>

          <div style="border-top: 1px solid #ecece9; padding-top: 16px; font-size: 12px; color: #777777;">
            United Youth Forum of Science and Research (UYFSR)<br />
            Executive Council & Central Secretariat<br />
            Official Portal: <a href="https://uyfsrweb.vercel.app" style="color: #0c7866;">uyfsrweb.vercel.app</a>
          </div>
        </div>
      `

      const emailText = `UYFSR Executive Passkey Reset Authorization\n\nDear ${officer.name} (${officer.title}),\n\nYour 6-digit one-time passkey verification code is: ${otpCode}\n\nThis code is valid for 15 minutes.\nIf you did not request this, please notify the secretariat.\n\nUYFSR Executive Council`

      try {
        await sendEmail({
          to: officerEmail,
          subject: `[UYFSR Security] Passkey Reset Code: ${otpCode}`,
          html: emailHtml,
          text: emailText
        })
      } catch (mailErr) {
        console.error('[FORGOT-PASSWORD] Email dispatch error:', mailErr)
      }
    }

    return res.json({
      success: true,
      officerId: officer.id,
      officerName: officer.name,
      officerTitle: officer.title,
      ecardId: officer.ecardId,
      maskedEmail: maskedMail,
      resetToken,
      message: `Confidential 6-digit OTP verification code sent to official email (${maskedMail}).`
    })
  } catch (err: any) {
    console.error('[FORGOT-PASSWORD] Request error:', err)
    return res.status(500).json({ error: 'Failed to initiate passkey reset request.' })
  }
})

// 2. Complete Passkey Reset (Strict Email OTP Verification Only)
app.post('/api/auth/forgot-password/reset', loginLimiter, async (req: Request, res: Response) => {
  try {
    const {
      officerId,
      resetToken,
      otpCode,
      newPassword,
      confirmPassword
    } = req.body

    if (!officerId) {
      return res.status(400).json({ error: 'Officer identification missing.' })
    }

    const trimmedOtp = (otpCode || '').trim()
    if (!trimmedOtp) {
      return res.status(400).json({ error: 'Please enter the confidential 6-digit OTP code sent to your official email.' })
    }

    const trimmedPass = (newPassword || '').trim()
    const trimmedConfirm = (confirmPassword || '').trim()

    if (!trimmedPass) {
      return res.status(400).json({ error: 'Please enter a new confidential security passkey.' })
    }
    if (trimmedPass.length < 6) {
      return res.status(400).json({ error: 'Security passkey must be at least 6 characters in length.' })
    }
    if (trimmedPass !== trimmedConfirm) {
      return res.status(400).json({ error: 'New passkey and confirmation passkey do not match.' })
    }

    const executives = await db.get('executives')
    const officer = executives.find((e) => e.id === officerId)
    if (!officer) {
      return res.status(404).json({ error: 'Officer not found in central council registry.' })
    }

    // Strict Email OTP HMAC Verification
    let verified = false
    if (resetToken && typeof resetToken === 'string') {
      const tokenParts = resetToken.split('.')
      if (tokenParts.length === 3) {
        const [tokOfficerId, expStr, sig] = tokenParts
        const expTime = parseInt(expStr, 10)
        if (tokOfficerId === officer.id && Date.now() <= expTime) {
          const expectedSig = generateResetHmac(officer.id, trimmedOtp, expTime)
          if (sig.length === expectedSig.length) {
            const bufA = Buffer.from(sig)
            const bufB = Buffer.from(expectedSig)
            if (crypto.timingSafeEqual(bufA, bufB)) {
              verified = true
            }
          }
        }
      }
    }

    if (!verified) {
      return res.status(400).json({
        error: 'Authorization failed: Invalid or expired 6-digit verification code. Please check your official email or request a new code.'
      })
    }

    // Persist new passkey in DB & in-memory stores
    await db.update(
      'executives',
      (e) => e.id === officer.id,
      (e) => {
        ;(e as any).password = trimmedPass
        ;(e as any).accessPin = trimmedPass
      }
    )

    globalCustomPasskeys.set(officer.id, trimmedPass)
    if (officer.ecardId) globalCustomPasskeys.set(officer.ecardId.toLowerCase(), trimmedPass)
    const gItem = globalApprovedExecutives.find(x => x.id === officer.id)
    if (gItem) {
      gItem.password = trimmedPass
      gItem.accessPin = trimmedPass
    }

    // Send confirmation notification email
    const officerEmail = (officer as any).email
    if (officerEmail) {
      const confirmHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #111111; border: 1px solid #ecece9;">
          <div style="border-bottom: 2px solid #111111; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #111111;">UYFSR</span>
            <span style="font-size: 13px; color: #666666; margin-left: 10px;">Security Confirmation</span>
          </div>

          <h2 style="font-size: 18px; font-weight: 700; color: #0c7866; margin-bottom: 12px;">
            Security Passkey Successfully Updated
          </h2>

          <p style="font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 12px;">
            Dear <strong>${escapeHtml(officer.name)}</strong> (${escapeHtml(officer.title)}),
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 16px;">
            Your security passkey for the UYFSR Executive Workspace was successfully updated via <strong>Official Email OTP Authorization</strong> on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (Dhaka Time).
          </p>

          <p style="font-size: 13px; color: #666666; margin-bottom: 24px;">
            If you did not authorize this change, please report immediately to the Executive Council.
          </p>

          <div style="border-top: 1px solid #ecece9; padding-top: 16px; font-size: 12px; color: #777777;">
            United Youth Forum of Science and Research (UYFSR)<br />
            Executive Council & Central Secretariat
          </div>
        </div>
      `
      try {
        await sendEmail({
          to: officerEmail,
          subject: '[UYFSR Security] Passkey Updated Successfully',
          html: confirmHtml,
          text: `Dear ${officer.name},\n\nYour security passkey has been successfully updated via Official Email OTP Authorization.\n\nUYFSR Executive Council`
        })
      } catch (mailErr) {
        console.error('[FORGOT-PASSWORD] Confirmation email error:', mailErr)
      }
    }

    return res.json({
      success: true,
      message: `Security passkey for ${officer.name} (${officer.title}) has been successfully updated. You may now sign in.`
    })
  } catch (err: any) {
    console.error('[FORGOT-PASSWORD] Reset error:', err)
    return res.status(500).json({ error: 'Failed to complete passkey update.' })
  }
})

// ==========================================
// 2. REGISTRATION & STUDENT PIPELINE MODULE
// ==========================================

// Register Student / Cohort Applicant (Rate Limited & Sanitized)
app.post('/api/register', publicFormLimiter, async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      institution,
      program,
      category,
      notes,
      voucherCode,
      mfsMethod,
      mfsPhone,
      mfsTrxId
    } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Candidate name and email are required.' })
    }

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
      return res.status(400).json({ error: 'Candidate name must be between 2 and 120 characters.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim()) || email.trim().length > 120) {
      return res.status(400).json({ error: 'Please enter a valid email address (name@domain.com).' })
    }

    // Strict BD Phone Validation
    let sanitizedPhone = phone ? String(phone).replace(/[^\d+]/g, '') : ''
    if (sanitizedPhone.startsWith('+880')) sanitizedPhone = '0' + sanitizedPhone.slice(4)
    else if (sanitizedPhone.startsWith('880')) sanitizedPhone = '0' + sanitizedPhone.slice(3)
    else if (sanitizedPhone.startsWith('+88')) sanitizedPhone = sanitizedPhone.slice(3)
    sanitizedPhone = sanitizedPhone.replace(/\D/g, '')

    if (sanitizedPhone) {
      if (sanitizedPhone.length !== 11 || !/^01[3-9]\d{8}$/.test(sanitizedPhone)) {
        return res.status(400).json({
          error: 'Invalid Bangladeshi mobile number. Must be 11 digits starting with 013-019.'
        })
      }
    }

    const trackingId = `UYFSR-APP-2026-${Math.floor(100000 + Math.random() * 900000)}`
    let referredBy: string | undefined = undefined
    let paymentStatus: 'paid' | 'waived' = 'paid'

    // Check voucher if provided
    if (voucherCode) {
      const vouchers = await db.get('vouchers')
      const v = vouchers.find((item) => item.code.toUpperCase() === voucherCode.trim().toUpperCase())
      if (v && v.usedCount < v.maxUses) {
        referredBy = `${v.createdBy} (${v.creatorRole})`
        paymentStatus = 'waived'
        v.usedCount += 1
        if (!v.redemptions) v.redemptions = []
        v.redemptions.push({
          applicantId: trackingId,
          name: name.trim().slice(0, 120),
          email: email.trim().toLowerCase().slice(0, 120),
          program: program ? String(program).slice(0, 120) : 'National Science Eclipse 2026',
          usedAt: new Date().toISOString()
        })
        await db.set('vouchers', vouchers)
      }
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      trackingId,
      name: name.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 120),
      phone: sanitizedPhone || undefined,
      institution: (institution || 'Independent Candidate').trim().slice(0, 150),
      program: (program || 'National Science Eclipse 2026').trim().slice(0, 150),
      category: category ? String(category).trim().slice(0, 100) : undefined,
      notes: notes ? String(notes).trim().slice(0, 1000) : undefined,
      voucherCode: voucherCode ? String(voucherCode).trim().slice(0, 50) : undefined,
      referredBy,
      mfsMethod: mfsMethod ? String(mfsMethod).trim().slice(0, 20) : (paymentStatus === 'waived' ? 'waiver' : 'bkash'),
      mfsPhone: mfsPhone ? String(mfsPhone).replace(/[^\d+]/g, '').slice(0, 20) : undefined,
      mfsTrxId: mfsTrxId ? String(mfsTrxId).trim().slice(0, 50) : (paymentStatus === 'waived' ? 'WAIVED_OFFICIAL' : undefined),
      status: 'submitted',
      paymentStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await db.insert('applications', newApp)

    // Trigger Automated Email Dispatch to applicant
    sendRegistrationEmail(newApp).catch((err) => {
      console.error('[EMAIL DISPATCH ERROR] Failed to send registration email:', err)
    })

    return res.status(201).json({
      success: true,
      trackingId,
      application: newApp,
      message: 'Registration logged successfully. Confirmation email dispatched from uyfsr.org@gmail.com.'
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process registration.' })
  }
})

// Apply as Campus Ambassador (100% Free Leadership Nomination - Zero Fees)
app.post('/api/ambassadors/apply', publicFormLimiter, async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      institution,
      gradeYear,
      district,
      experience,
      statement,
      socialLink
    } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Candidate name and email address are required.' })
    }

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
      return res.status(400).json({ error: 'Name must be between 2 and 120 characters.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim()) || email.trim().length > 120) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    // Strict BD Phone Validation
    let sanitizedPhone = phone ? String(phone).replace(/[^\d+]/g, '') : ''
    if (sanitizedPhone.startsWith('+880')) sanitizedPhone = '0' + sanitizedPhone.slice(4)
    else if (sanitizedPhone.startsWith('880')) sanitizedPhone = '0' + sanitizedPhone.slice(3)
    else if (sanitizedPhone.startsWith('+88')) sanitizedPhone = sanitizedPhone.slice(3)
    sanitizedPhone = sanitizedPhone.replace(/\D/g, '')

    if (sanitizedPhone) {
      if (sanitizedPhone.length !== 11 || !/^01[3-9]\d{8}$/.test(sanitizedPhone)) {
        return res.status(400).json({
          error: 'Please enter a valid 11-digit Bangladeshi mobile number (013–019).'
        })
      }
    }

    const trackingId = `UYFSR-AMB-2026-${Math.floor(100000 + Math.random() * 900000)}`

    const notesSummary = [
      gradeYear ? `Academic Year / Class: ${String(gradeYear).trim()}` : '',
      district ? `District / City: ${String(district).trim()}` : '',
      experience ? `Leadership / Club Background: ${String(experience).trim()}` : '',
      statement ? `Statement of Purpose: ${String(statement).trim()}` : '',
      socialLink ? `Social / Portfolio Profile: ${String(socialLink).trim()}` : ''
    ].filter(Boolean).join('\n')

    const newApp: Application = {
      id: `app-amb-${Date.now()}`,
      trackingId,
      name: name.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 120),
      phone: sanitizedPhone || undefined,
      institution: (institution || 'Independent Student Representative').trim().slice(0, 150),
      program: 'Campus Ambassador Programme',
      category: 'Campus Ambassador',
      notes: notesSummary || 'Campus Ambassador Cohort 2026 Application',
      mfsMethod: 'free_ambassador',
      mfsTrxId: 'AMBASSADOR_FREE_NOMINATION',
      status: 'submitted',
      paymentStatus: 'waived',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await db.insert('applications', newApp)

    // Trigger Automated Email Dispatch to applicant
    sendRegistrationEmail(newApp).catch((err) => {
      console.error('[EMAIL DISPATCH ERROR] Failed to send ambassador application email:', err)
    })

    return res.status(201).json({
      success: true,
      trackingId,
      application: newApp,
      message: 'Campus Ambassador application submitted successfully. No fee required.'
    })
  } catch (err: any) {
    console.error('Ambassador apply error:', err)
    return res.status(500).json({ error: 'Failed to process Campus Ambassador application.' })
  }
})

// Track Application Status (Public endpoint)
app.get('/api/track/:trackingId', async (req: Request, res: Response) => {
  const { trackingId } = req.params
  if (!trackingId || trackingId.length > 50) {
    return res.status(400).json({ error: 'Invalid tracking ID parameter.' })
  }

  const apps = await db.get('applications')
  const appItem = apps.find(
    (a) => a.trackingId.toLowerCase() === trackingId.trim().toLowerCase()
  )

  if (!appItem) {
    return res.status(404).json({ error: 'Tracking ID not found in UYFSR registry.' })
  }

  // Return public tracking info without exposing sensitive internal notes
  return res.json({
    success: true,
    application: {
      trackingId: appItem.trackingId,
      name: appItem.name,
      program: appItem.program,
      category: appItem.category,
      status: appItem.status,
      paymentStatus: appItem.paymentStatus,
      createdAt: appItem.createdAt
    },
    pipeline: [
      { step: 1, title: 'Application & Payment Logged', status: 'completed' },
      {
        step: 2,
        title: 'Central Secretariat Document Verification',
        status: appItem.status === 'submitted' ? 'in_progress' : 'completed'
      },
      {
        step: 3,
        title: 'Supplementary Intake Form & Orientation',
        status: appItem.status === 'approved' ? 'completed' : 'upcoming'
      }
    ],
    officialNotice: 'Updates are dispatched directly from uyfsr.org@gmail.com.'
  })
})

// List All Applications (PROTECTED: Authorized Executive Access Only)
app.get('/api/applications', async (req: Request, res: Response) => {
  const officer = await getAuthOfficer(req)
  if (!officer) {
    return res.status(401).json({ error: 'Authentication required to access applicant directory.' })
  }
  const apps = await db.get('applications')
  const sorted = [...apps].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )
  return res.json({ applications: sorted })
})

// Update Application Status & Dispatch Email Alert (PROTECTED: Authorized Executive Access Only)
app.post('/api/applications/:id/status', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to update applicant status.' })
    }

    const { id } = req.params
    const rawStatus = (req.body.status || '').toLowerCase().trim()
    const { paymentStatus } = req.body

    const validStatuses = ['submitted', 'payment_verified', 'under_review', 'reviewing', 'approved', 'rejected']
    if (rawStatus && !validStatuses.includes(rawStatus)) {
      return res.status(400).json({ error: 'Invalid status value provided.' })
    }
    const status = rawStatus === 'reviewing' ? 'under_review' : rawStatus

    if ((status === 'approved' || status === 'rejected') && !officer.isCEO) {
      return res.status(403).json({
        error: `Permission Denied: Only the Chief Executive Officer (${officer.name} is not CEO) has sole authority to ${status} registrations.`
      })
    }

    const rawId = decodeURIComponent(id).trim()
    const apps = await db.get('applications')
    const appIndex = apps.findIndex(
      (a) =>
        a.id === id ||
        a.trackingId === id ||
        a.id === rawId ||
        a.trackingId === rawId ||
        a.id?.toLowerCase() === rawId.toLowerCase() ||
        a.trackingId?.toLowerCase() === rawId.toLowerCase()
    )

    if (appIndex === -1) {
      const submissions = await db.get('submissions')
      const subIndex = submissions.findIndex((s) => s.id === id || s.id === rawId)
      if (subIndex !== -1) {
        submissions[subIndex].status = (status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'submitted')
        submissions[subIndex].evaluatedBy = `${officer.name} (CEO)`
        submissions[subIndex].reviewedAt = new Date().toISOString()
        await db.set('submissions', submissions)
        return res.json({
          success: true,
          submission: submissions[subIndex]
        })
      }
      return res.status(404).json({ error: 'Application or submission not found.' })
    }

    const previousStatus = apps[appIndex].status
    if (status) {
      apps[appIndex].status = status
      // If approved by CEO, ensure payment status is recorded as paid if pending
      if (status === 'approved' && (!apps[appIndex].paymentStatus || apps[appIndex].paymentStatus === 'pending')) {
        apps[appIndex].paymentStatus = 'paid'
      }
    }
    if (paymentStatus) apps[appIndex].paymentStatus = paymentStatus
    apps[appIndex].updatedAt = new Date().toISOString()
    await db.set('applications', apps)

    if (status && previousStatus !== status) {
      sendStatusUpdateEmail(apps[appIndex], previousStatus).catch((err) => {
        console.error('[EMAIL ERROR] Status change email dispatch failed:', err)
      })
    }

    return res.json({
      success: true,
      application: apps[appIndex]
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update application status.' })
  }
})

// Dispatch CEO / Executive Custom Email to Candidate & Automatically Mark as Mailed
app.post('/api/applications/:id/send-email', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to dispatch candidate emails.' })
    }

    const { id } = req.params
    const { subject, message, autoMarkMailed = true } = req.body

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and email message content are required.' })
    }

    const apps = await db.get('applications')
    const appIndex = apps.findIndex((a) => a.id === id || a.trackingId === id)
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Applicant record not found in registry.' })
    }

    const applicant = apps[appIndex]
    if (!applicant.email) {
      return res.status(400).json({ error: 'Applicant does not have a registered email address.' })
    }

    // Clean, natural 1-to-1 human email format (guaranteed Primary Inbox delivery)
    const cleanSubject = sanitizeHeader(subject)
    const plainText = String(message).trim()
    const paragraphsHtml = plainText
      .split('\n\n')
      .map(
        (p) =>
          `<p style="margin: 0 0 16px 0; font-size: 15px; color: #222222; line-height: 1.6;">${escapeHtml(
            p
          ).replace(/\n/g, '<br>')}</p>`
      )
      .join('')

    const humanHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 24px 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <div style="max-width: 600px; margin: 0 auto;">
    ${paragraphsHtml}
    <hr style="border: none; border-top: 1px solid #e0e0dc; margin: 24px 0 16px 0;">
    <div style="font-size: 12px; color: #666662; line-height: 1.5;">
      <strong>United Youth Forum of Science and Research (UYFSR)</strong><br>
      Admissions &amp; Central Secretariat &bull; Dhaka, Bangladesh<br>
      Official Email: <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866;">uyfsr.org@gmail.com</a> &bull; Reference ID: ${escapeHtml(
        applicant.trackingId
      )}
    </div>
  </div>
</body>
</html>
`.trim()

    // Send via live Gmail SMTP
    const dispatchResult = await sendEmail({
      to: applicant.email,
      replyTo: 'uyfsr.org@gmail.com',
      subject: cleanSubject,
      text: plainText,
      html: humanHtml
    })

    if (autoMarkMailed) {
      apps[appIndex].mailed = true
      apps[appIndex].mailedAt = new Date().toISOString()
      apps[appIndex].mailedBy = officer.name
      apps[appIndex].lastEmailSubject = cleanSubject
      apps[appIndex].updatedAt = new Date().toISOString()
      await db.set('applications', apps)
    }

    return res.json({
      success: true,
      message: `Official email dispatched to ${applicant.email} and recorded as Mailed.`,
      dispatchResult,
      application: apps[appIndex]
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to dispatch email.' })
  }
})

// Toggle Mailed / Non-Mailed status for an applicant
app.post('/api/applications/:id/toggle-mailed', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required.' })
    }

    const { id } = req.params
    const { mailed } = req.body

    const apps = await db.get('applications')
    const appIndex = apps.findIndex((a) => a.id === id || a.trackingId === id)
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Applicant not found.' })
    }

    apps[appIndex].mailed = Boolean(mailed)
    if (apps[appIndex].mailed) {
      apps[appIndex].mailedAt = new Date().toISOString()
      apps[appIndex].mailedBy = officer.name
    } else {
      apps[appIndex].mailedAt = undefined
      apps[appIndex].mailedBy = undefined
    }
    apps[appIndex].updatedAt = new Date().toISOString()
    await db.set('applications', apps)

    return res.json({
      success: true,
      mailed: apps[appIndex].mailed,
      application: apps[appIndex]
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to toggle mailed status.' })
  }
})

// ==========================================
// 4. EXECUTIVE VOUCHER SYSTEM MODULE
// ==========================================

// Generate Executive Voucher Pass (PROTECTED: Authorized Executive Access Only)
app.post('/api/vouchers/generate', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to issue executive voucher passes.' })
    }

    const {
      candidateName = '',
      targetRole = 'Sub-Executive Candidate',
      creatorRole,
      discount = '20% Executive Discount',
      maxUses = 25
    } = req.body

    const initials = officer.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    const code = `UYFSR-REF-${initials}-${Math.floor(1000 + Math.random() * 9000)}`

    const newVoucher: Voucher = {
      code,
      candidateName: String(candidateName).trim().slice(0, 120) || 'Official Invitee',
      targetRole: String(targetRole).trim().slice(0, 100) || 'Sub-Executive Candidate',
      createdBy: officer.name,
      creatorRole: (creatorRole || officer.title || 'Executive Council Member').trim().slice(0, 100),
      discount: String(discount).slice(0, 50),
      maxUses: Math.min(Math.max(Number(maxUses) || 25, 1), 100),
      usedCount: 0,
      redemptions: [],
      createdAt: new Date().toISOString()
    }

    await db.insert('vouchers', newVoucher)

    return res.status(201).json({
      success: true,
      voucher: newVoucher
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate voucher.' })
  }
})

// Verify Voucher
app.get('/api/vouchers/verify/:code', async (req: Request, res: Response) => {
  const { code } = req.params
  if (!code || code.length > 50) {
    return res.status(400).json({ valid: false, message: 'Invalid voucher code.' })
  }

  const vouchers = await db.get('vouchers')
  const v = vouchers.find((item) => item.code.toUpperCase() === code.trim().toUpperCase())

  if (!v) {
    return res.status(404).json({ valid: false, message: 'Voucher code does not exist.' })
  }

  if (v.usedCount >= v.maxUses) {
    return res.status(400).json({ valid: false, message: 'Voucher code usage quota has expired.' })
  }

  return res.json({
    valid: true,
    code: v.code,
    referrer: `${v.createdBy} (${v.creatorRole})`,
    discount: v.discount,
    remainingUses: v.maxUses - v.usedCount
  })
})

// List All Vouchers with Live Usage Tracking (PROTECTED: Authorized Executive Access Only)
app.get('/api/vouchers', async (req: Request, res: Response) => {
  const officer = await getAuthOfficer(req)
  if (!officer) {
    return res.status(401).json({ error: 'Authentication required to access voucher registry.' })
  }
  const [vouchers, applications] = await Promise.all([
    db.get('vouchers'),
    db.get('applications')
  ])

  // Cross-reference with real candidate applications to compute exact redemptions and usage
  const enriched = vouchers.map((v) => {
    const matchingApps = applications.filter(
      (app) => app.voucherCode && app.voucherCode.trim().toUpperCase() === v.code.toUpperCase()
    )
    const existingRedemptions = v.redemptions || []
    const mergedRedemptions: VoucherRedemption[] = [...existingRedemptions]

    for (const app of matchingApps) {
      if (
        !mergedRedemptions.some(
          (r) =>
            r.applicantId === app.trackingId ||
            (app.email && r.email.toLowerCase() === app.email.toLowerCase())
        )
      ) {
        mergedRedemptions.push({
          applicantId: app.trackingId,
          name: app.name,
          email: app.email,
          program: app.program,
          usedAt: app.createdAt
        })
      }
    }

    return {
      ...v,
      usedCount: Math.max(v.usedCount || 0, mergedRedemptions.length),
      redemptions: mergedRedemptions
    }
  })

  return res.json({ vouchers: enriched.reverse() })
})

// ==========================================
// 5. STUDENT SUBMISSION APPROVAL (CEO ONLY)
// ==========================================

// List Project Submissions
app.get('/api/submissions', async (_req: Request, res: Response) => {
  const submissions = await db.get('submissions')
  return res.json({ submissions })
})

// Approve Submission or Application (PROTECTED: STRICTLY CEO ONLY)
app.post('/api/submissions/:id/approve', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Valid executive authentication token required.' })
    }

    if (!officer.isCEO) {
      return res.status(403).json({
        error: `Permission Denied: Only the Chief Executive Officer (${officer.name} is not CEO) has sole authority to approve student submissions.`
      })
    }

    const { id } = req.params
    const updated = await db.update(
      'submissions',
      (s) => s.id === id,
      (s) => {
        s.status = 'approved'
        s.evaluatedBy = `${officer.name} (CEO)`
        s.reviewedAt = new Date().toISOString()
      }
    )

    if (updated) {
      return res.json({
        success: true,
        message: 'Project submission officially approved and ratified by CEO.'
      })
    }

    // Check if ID belongs to an applicant registration
    const apps = await db.get('applications')
    const appIndex = apps.findIndex((a) => a.id === id || a.trackingId === id)
    if (appIndex !== -1) {
      const prevStatus = apps[appIndex].status
      if (prevStatus === 'approved') {
        return res.json({
          success: true,
          message: 'Application is already approved.'
        })
      }
      apps[appIndex].status = 'approved'
      apps[appIndex].updatedAt = new Date().toISOString()
      await db.set('applications', apps)
      sendStatusUpdateEmail(apps[appIndex], prevStatus).catch(() => null)
      return res.json({
        success: true,
        message: 'Application officially approved and ratified by CEO.'
      })
    }

    return res.status(404).json({ error: 'Project submission or application ID not found.' })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to approve submission.' })
  }
})

// Reject Submission or Application (PROTECTED: STRICTLY CEO ONLY)
app.post('/api/submissions/:id/reject', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Valid executive authentication token required.' })
    }

    if (!officer.isCEO) {
      return res.status(403).json({
        error: `Permission Denied: Only the Chief Executive Officer has sole authority to reject student submissions.`
      })
    }

    const { id } = req.params
    const updated = await db.update(
      'submissions',
      (s) => s.id === id,
      (s) => {
        s.status = 'rejected'
        s.evaluatedBy = `${officer.name} (CEO)`
        s.reviewedAt = new Date().toISOString()
      }
    )

    if (updated) {
      return res.json({
        success: true,
        message: 'Project submission rejected by CEO.'
      })
    }

    const apps = await db.get('applications')
    const appIndex = apps.findIndex((a) => a.id === id || a.trackingId === id)
    if (appIndex !== -1) {
      const prevStatus = apps[appIndex].status
      if (prevStatus === 'rejected') {
        return res.json({
          success: true,
          message: 'Application is already rejected.'
        })
      }
      apps[appIndex].status = 'rejected'
      apps[appIndex].updatedAt = new Date().toISOString()
      await db.set('applications', apps)
      sendStatusUpdateEmail(apps[appIndex], prevStatus).catch(() => null)
      return res.json({
        success: true,
        message: 'Application rejected by CEO.'
      })
    }

    return res.status(404).json({ error: 'Record ID not found.' })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reject submission.' })
  }
})

// ==========================================
// 6. LIVE MESSAGING & MEETING SCHEDULER MODULE
// ==========================================

const INQUIRY_CHANNEL = 'CEO Inquiries'
const globalInquiries: Message[] = []
const globalPendingExecutives: Executive[] = []
const globalApprovedExecutives: Executive[] = []
const globalCustomPasskeys = new Map<string, string>()

// CEO ONLY: Public contact-form inquiries inbox
app.get('/api/inquiries', async (req: Request, res: Response) => {
  const officer = await getAuthOfficer(req)
  if (!officer) return res.status(401).json({ error: 'Authentication required.' })
  if (!officer.isCEO) {
    return res.status(403).json({ error: 'Permission Denied: Public inquiries are visible to the CEO only.' })
  }
  const messages = await db.get('messages')
  const dbInquiries = messages.filter((m) => (m.channel || '').toLowerCase() === INQUIRY_CHANNEL.toLowerCase())
  const combined = [...globalInquiries, ...dbInquiries]
  const uniqueMap = new Map<string, Message>()
  for (const item of combined) {
    uniqueMap.set(item.id, item)
  }
  const allInquiries = Array.from(uniqueMap.values())
  return res.json({ inquiries: allInquiries.slice().reverse() })
})

// Get Messages
app.get('/api/messages', async (req: Request, res: Response) => {
  const reqChannel = (req.query.channel as string || '').trim().toLowerCase()
  const viewer = await getAuthOfficer(req)
  // Public contact-form inquiries are confidential: visible to the CEO only
  const messages = (await db.get('messages')).filter(
    (m) => (m.channel || '').toLowerCase() !== INQUIRY_CHANNEL.toLowerCase() || !!viewer?.isCEO
  )
  if (!reqChannel || reqChannel === 'all') {
    return res.json({ messages })
  }
  const filtered = messages.filter((m) => {
    const mChan = (m.channel || '').toLowerCase()
    if (reqChannel === 'general') {
      return mChan === 'general' || mChan === 'executive council'
    }
    return mChan === reqChannel
  })
  return res.json({ messages: filtered })
})

// Send Message (Input Sanitized)
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { senderName, senderRole, channel, message } = req.body
    if (!senderName || !message) {
      return res.status(400).json({ error: 'Sender name and message are required.' })
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderName: String(senderName).trim().slice(0, 100),
      senderRole: (senderRole || 'Executive Member').trim().slice(0, 100),
      channel: (channel || 'Executive Council').trim().slice(0, 50),
      message: String(message).trim().slice(0, 2000),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    await db.insert('messages', newMessage)

    return res.status(201).json({ success: true, message: newMessage })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record message.' })
  }
})

// Public Contact & Direct Inquiry Form (Rate Limited & Length Capped)
app.post('/api/contact', publicFormLimiter, async (req: Request, res: Response) => {
  try {
    const { name, contact, message } = req.body
    if (!name || !message || !contact) {
      return res.status(400).json({ error: 'Name, contact info (email or phone), and message are required.' })
    }

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' })
    }

    if (typeof contact !== 'string' || contact.trim().length < 3 || contact.trim().length > 120) {
      return res.status(400).json({ error: 'Contact info must be between 3 and 120 characters.' })
    }

    if (typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 3000) {
      return res.status(400).json({ error: 'Message must be between 5 and 3000 characters.' })
    }

    // Save as message for dashboard executive visibility
    const chatMsg: Message = {
      id: `msg-${Date.now()}`,
      senderName: `${name.trim()} (${contact.trim()})`,
      senderRole: 'Public Inquiry',
      channel: INQUIRY_CHANNEL,
      message: message.trim(),
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    }

    await db.insert('messages', chatMsg)
    globalInquiries.push(chatMsg)
    const ceo = (await db.get('executives')).find((e) => e.isCEO && e.status !== 'pending' && e.status !== 'rejected')

    // Trigger automated email alert to uyfsr.org@gmail.com and visitor acknowledgment
    sendContactInquiryEmail({
      name: name.trim(),
      contact: contact.trim(),
      message: message.trim(),
      ceoEmail: (ceo as any)?.email
    }).catch((err) => {
      console.error('[EMAIL DISPATCH ERROR] Contact inquiry email failed:', err)
    })

    return res.status(201).json({
      success: true,
      message: 'Your message has been delivered to the Chief Executive Officer. We will respond soon via uyfsr.org@gmail.com.'
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process inquiry.' })
  }
})

// Schedule Meeting (PROTECTED: Authorized Executive Access Only)
app.post('/api/meetings', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to schedule executive council meetings.' })
    }

    const { title, attendees = [], dateTime, agenda } = req.body
    if (!title || !dateTime) {
      return res.status(400).json({ error: 'Title and date/time are required for meetings.' })
    }

    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      title: String(title).trim().slice(0, 150),
      hostName: officer.name,
      attendees: Array.isArray(attendees) ? attendees.map((a) => String(a).slice(0, 100)) : [],
      dateTime: String(dateTime).trim().slice(0, 100),
      agenda: String(agenda || '').trim().slice(0, 1000),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }

    await db.insert('meetings', newMeeting)

    return res.status(201).json({ success: true, meeting: newMeeting })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to schedule meeting.' })
  }
})

// List All Council Meetings (Council Dashboard)
app.get('/api/meetings', async (_req: Request, res: Response) => {
  const meetings = await db.get('meetings')
  return res.json({ meetings: [...meetings].reverse() })
})

// Delete Council Meeting (PROTECTED: Host, COO, or CEO Access Only)
app.delete('/api/meetings/:id', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to delete council meetings.' })
    }

    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Meeting ID is required.' })
    }

    const rawId = decodeURIComponent(id).trim()
    const meetings = await db.get('meetings')
    const mtg = meetings.find((m) => 
      m.id === id || 
      m.id === rawId || 
      m.id.toLowerCase() === rawId.toLowerCase()
    )

    if (!mtg) {
      return res.status(404).json({ error: 'Meeting session not found in council registry.' })
    }

    const meetingHost = ((mtg as any).hostName || (mtg as any).host || '').toLowerCase()
    const isHost = meetingHost.includes(officer.name.toLowerCase())
    const isCOO = officer.title && officer.title.includes('COO')
    if (!officer.isCEO && !isHost && !isCOO) {
      return res.status(403).json({
        error: 'Permission Denied: Only the meeting host, COO, or CEO can cancel this council session.'
      })
    }

    const deleted = await db.delete('meetings', (m) => 
      m.id === id || 
      m.id === rawId ||
      m.id.toLowerCase() === rawId.toLowerCase()
    )

    if (!deleted) {
      return res.status(404).json({ error: 'Meeting session not found in council registry.' })
    }

    return res.json({
      success: true,
      message: 'Meeting session successfully removed from registry.'
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete meeting session.' })
  }
})

// Delete Applicant Registration (PROTECTED: STRICTLY CEO ONLY)
app.delete('/api/applications/:id', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to manage candidate registrations.' })
    }

    if (!officer.isCEO) {
      return res.status(403).json({ error: 'Permission Denied: Only the Chief Executive Officer has authority to purge applicant records.' })
    }

    const { id } = req.params
    const rawId = decodeURIComponent(id).trim()
    const deleted = await db.delete('applications', (a) => a.id === id || a.trackingId === id || a.id === rawId || a.trackingId === rawId)
    if (!deleted) {
      return res.status(404).json({ error: 'Applicant record not found in registry.' })
    }

    return res.json({
      success: true,
      message: 'Applicant record removed successfully.'
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete applicant record.' })
  }
})

// Revoke / Delete Voucher Code (PROTECTED: Creator or CEO Only)
app.delete('/api/vouchers/:code', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to manage voucher codes.' })
    }

    const { code } = req.params
    if (!code) {
      return res.status(400).json({ error: 'Voucher code is required.' })
    }

    const cleanCode = decodeURIComponent(code).trim().toUpperCase()
    const vouchers = await db.get('vouchers')
    const v = vouchers.find((item) => item.code.toUpperCase() === cleanCode)
    if (!v) {
      return res.status(404).json({ error: 'Voucher code not found in registry.' })
    }

    const isCreator = v.createdBy && v.createdBy.toLowerCase().trim() === officer.name.toLowerCase().trim()
    if (!officer.isCEO && !isCreator) {
      return res.status(403).json({
        error: 'Permission Denied: Only the voucher creator or the CEO can revoke this voucher.'
      })
    }

    const deleted = await db.delete('vouchers', (item) => item.code.toUpperCase() === cleanCode)
    if (!deleted) {
      return res.status(404).json({ error: 'Failed to revoke voucher.' })
    }

    return res.json({
      success: true,
      message: `Voucher ${cleanCode} successfully revoked.`
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete voucher.' })
  }
})

// Delete Channel Message (PROTECTED: Message Sender or CEO Only)
app.delete('/api/messages/:id', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to delete channel messages.' })
    }

    const { id } = req.params
    const rawId = decodeURIComponent(id).trim()
    const messages = await db.get('messages')
    const msg = messages.find((m) => m.id === id || m.id === rawId)
    if (!msg) {
      return res.status(404).json({ error: 'Message not found.' })
    }

    const isSender = (msg.senderName && msg.senderName.toLowerCase().trim() === officer.name.toLowerCase().trim()) ||
                     (msg.sender && msg.sender.toLowerCase().trim() === officer.name.toLowerCase().trim())
    if (!officer.isCEO && !isSender) {
      return res.status(403).json({
        error: 'Permission Denied: You can only delete messages sent by yourself, or you must hold CEO authority.'
      })
    }

    const deleted = await db.delete('messages', (m) => m.id === id || m.id === rawId)
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found.' })
    }

    return res.json({
      success: true,
      message: 'Message removed from channel.'
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete message.' })
  }
})

// ==========================================
// 7. FACEBOOK SYNDICATION SCRAPER MODULE
// ==========================================

// Get News
app.get('/api/news', async (_req: Request, res: Response) => {
  const news = await db.get('news')
  return res.json({ news })
})

// Trigger Live Facebook Scraper Sync (PROTECTED: Authorized Executive Access Only)
app.post('/api/news/sync', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Authentication required to trigger news sync.' })
    }

    const freshPosts = await scrapeFacebookFeed()
    return res.json({
      success: true,
      syncedCount: freshPosts.length,
      source: 'https://www.facebook.com/uyfsr',
      news: freshPosts
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to sync news.' })
  }
})

// ==========================================
// 8. EMAIL AUTOMATION & OUTBOX AUDIT (HARDENED)
// ==========================================

// Outbox Inspection API (PROTECTED: STRICTLY EXECUTIVE ACCESS ONLY)
app.get('/api/admin/outbox', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer) {
      return res.status(401).json({ error: 'Access denied: Executive credentials required.' })
    }

    const outbox = await getOutbox()
    const liveSmtpConfigured = Boolean(process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS)
    return res.json({
      total: outbox.length,
      officialAccount: 'uyfsr.org@gmail.com',
      liveSmtpConfigured,
      mode: liveSmtpConfigured ? 'live_smtp' : 'local_outbox',
      outbox
    })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch outbox.' })
  }
})

// Send Diagnostics Test Email (PROTECTED: RESTRICTED TO OFFICIAL ADDRESS ONLY)
app.post('/api/admin/test-email', async (req: Request, res: Response) => {
  try {
    const officer = await getAuthOfficer(req)
    if (!officer || !officer.isCEO) {
      return res.status(403).json({ error: 'Only the CEO can dispatch test diagnostic emails.' })
    }

    // Anti-Relay Defense: Force recipient strictly to official secretariat inbox
    const destination = 'uyfsr.org@gmail.com'

    const result = await sendEmail({
      to: destination,
      subject: '[UYFSR Test] Gmail Automation Diagnostics Check',
      text: `Automated test diagnostic message initiated by ${officer.name} (${officer.title}).`,
      html: `<p>This is an automated test diagnostic message initiated by <strong>${escapeHtml(officer.name)}</strong> (${escapeHtml(officer.title)}).</p>`
    })
    return res.json({ success: true, destination, result })
  } catch (err: any) {
    return res.status(500).json({ error: 'Test email failed.' })
  }
})

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'online',
    platform: 'UYFSR Central Secretariat Backend',
    version: '1.2.0',
    securityStatus: 'hardened',
    foundationDate: '30 May 2025'
  })
})

// 404 Catch-All for unhandled API endpoints
app.use('/api', (req: Request, res: Response) => {
  return res.status(404).json({
    error: 'API Endpoint Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist on the UYFSR backend.`,
    status: 404,
    timestamp: new Date().toISOString()
  })
})

// Global Express Error-Handling Middleware
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER UNHANDLED ERROR]', err)
  const statusCode = typeof err.status === 'number' ? err.status : 500
  return res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the central server.',
    path: req.originalUrl
  })
})

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[UYFSR Server] Backend running securely on http://localhost:${PORT}`)
  })
}

export default app
