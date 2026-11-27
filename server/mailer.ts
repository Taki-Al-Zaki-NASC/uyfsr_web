import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Application } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUTBOX_FILE = path.join(__dirname, 'data', 'outbox.json')

// Attempt native environment loading
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile()
  }
} catch {
  // .env may not exist yet, ignore
}

export interface EmailRecord {
  id: string
  to: string | string[]
  from: string
  replyTo?: string
  bcc?: string | string[]
  subject: string
  html: string
  text: string
  sentAt: string
  mode: 'live_smtp' | 'local_outbox'
  status: 'delivered' | 'queued' | 'failed'
  messageId?: string
  error?: string
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
  bcc?: string | string[]
}

const OFFICIAL_EMAIL = process.env.GMAIL_USER || 'uyfsr.org@gmail.com'
const OFFICIAL_SENDER = `UYFSR <${OFFICIAL_EMAIL}>`

/**
 * Sanitizes user input to prevent HTML injection in emails.
 */
export function escapeHtml(str: any): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function sanitizeHeader(str: any): string {
  if (typeof str !== 'string') return ''
  return str.replace(/[\r\n]+/g, ' ').trim()
}

/**
 * Ensures the outbox storage file exists.
 */
async function ensureOutboxFile(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(OUTBOX_FILE), { recursive: true })
    try {
      await fs.access(OUTBOX_FILE)
    } catch {
      await fs.writeFile(OUTBOX_FILE, JSON.stringify([], null, 2), 'utf-8')
    }
  } catch (err) {
    console.error('[MAILER] Failed to initialize outbox file:', err)
  }
}

/**
 * Retrieves the stored outbox history.
 */
export async function getOutbox(): Promise<EmailRecord[]> {
  await ensureOutboxFile()
  try {
    const raw = await fs.readFile(OUTBOX_FILE, 'utf-8')
    return JSON.parse(raw) as EmailRecord[]
  } catch {
    return []
  }
}

/**
 * Saves a new email record into the outbox history.
 */
async function recordOutbox(record: EmailRecord): Promise<void> {
  try {
    await ensureOutboxFile()
    const current = await getOutbox()
    current.unshift(record)
    const trimmed = current.slice(0, 200)
    await fs.writeFile(OUTBOX_FILE, JSON.stringify(trimmed, null, 2), 'utf-8')
  } catch (_err) {
    // Read-only serverless environment fallback (safe to ignore)
  }
}

/**
 * Creates Nodemailer Gmail transporter if credentials are configured.
 */
function getTransporter() {
  const emailUser = process.env.GMAIL_USER || 'uyfsr.org@gmail.com'
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || 'duhc bgrq cwoy plht'
  if (!appPassword) return null

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: appPassword.replace(/\s+/g, '')
    }
  })
}

// ==========================================
// ANTI-SPAM, DEBOUNCE & THROTTLING MECHANISM
// ==========================================
interface RecipientLog {
  lastSentAt: number
  recentDispatches: Array<{ subject: string; time: number }>
}

const recipientThrottleMap = new Map<string, RecipientLog>()

// Internal Developer & Executive Email list to protect from all routine/minor applicant & event email spam
const PROTECTED_INTERNAL_EMAILS = new Set([
  'ktahan629@gmail.com',
  'uyfsr.org@gmail.com',
  'daliajoty@gmail.com',
  'tashkir2006@gmail.com',
  'soyaib248@gmail.com',
  'parkjarinot7@gmail.com'
])

function checkSpamThrottle(to: string | string[], subject: string): { allow: boolean; reason?: string } {
  const recipients = Array.isArray(to) ? to : [to]
  const now = Date.now()
  const isSecurityOtp =
    subject.includes('Passkey Reset Code') ||
    subject.includes('Passkey Updated') ||
    subject.includes('Executive Account Approved')

  for (const rawRecipient of recipients) {
    const email = (rawRecipient || '').trim().toLowerCase()
    if (!email) continue

    // 1. Absolute Mute for Internal Developer & Executive Accounts:
    // Never send student admissions, minor status changes, or routine candidate emails to developer or executive personal emails.
    // ONLY explicit user-requested security passkey resets (OTP) are allowed through.
    if (PROTECTED_INTERNAL_EMAILS.has(email) && !isSecurityOtp) {
      return {
        allow: false,
        reason: `Muted routine notifications for internal developer/executive address (${email}). Only security OTPs are permitted.`
      }
    }

    const record = recipientThrottleMap.get(email) || { lastSentAt: 0, recentDispatches: [] }

    // 2. Duplicate Subject Cooldown: Never send the exact same email subject to the same address within 5 minutes
    const duplicateRecent = record.recentDispatches.find(
      (d) => d.subject.trim().toLowerCase() === subject.trim().toLowerCase() && now - d.time < 5 * 60 * 1000
    )
    if (duplicateRecent && !isSecurityOtp) {
      return {
        allow: false,
        reason: `Suppressed duplicate email to ${email} (subject already sent within 5m)`
      }
    }

    // 3. High-Frequency Burst Throttle: Max 2 emails per 5 minutes to any recipient
    const last5MinDispatches = record.recentDispatches.filter((d) => now - d.time < 5 * 60 * 1000)
    if (last5MinDispatches.length >= 2 && !isSecurityOtp) {
      return {
        allow: false,
        reason: `Rate limit reached for ${email} (maximum 2 emails per 5 minutes window exceeded)`
      }
    }
  }

  return { allow: true }
}

function recordDispatch(to: string | string[], subject: string) {
  const recipients = Array.isArray(to) ? to : [to]
  const now = Date.now()
  for (const rawRecipient of recipients) {
    const email = (rawRecipient || '').trim().toLowerCase()
    if (!email) continue

    const record = recipientThrottleMap.get(email) || { lastSentAt: 0, recentDispatches: [] }
    record.lastSentAt = now
    record.recentDispatches.push({ subject, time: now })
    // Keep only dispatches within last 1 hour
    record.recentDispatches = record.recentDispatches.filter((d) => now - d.time < 60 * 60 * 1000)
    recipientThrottleMap.set(email, record)
  }
}

/**
 * Core dispatch function.
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; mode: string; id: string }> {
  const emailId = `mail-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

  // Anti-Spam Throttling Check
  const throttleCheck = checkSpamThrottle(options.to, options.subject)
  if (!throttleCheck.allow) {
    console.log(`[ANTI-SPAM SHIELD] ${throttleCheck.reason}`)
    return { success: true, mode: 'suppressed_by_anti_spam_shield', id: emailId }
  }

  recordDispatch(options.to, options.subject)
  const emailUser = process.env.GMAIL_USER || 'uyfsr.org@gmail.com'
  const emailSender = `UYFSR <${emailUser}>`
  const transporter = getTransporter()

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: emailSender,
        to: options.to,
        bcc: options.bcc,
        replyTo: options.replyTo || emailUser,
        subject: options.subject,
        text: options.text,
        html: options.html,
        headers: {
          'X-Entity-Ref-ID': emailId,
          'Organization': 'United Youth Forum of Science and Research (UYFSR)',
          'X-Priority': '3',
          'X-Auto-Response-Suppress': 'OOF, AutoReply'
        }
      })

      const record: EmailRecord = {
        id: emailId,
        to: options.to,
        from: emailSender,
        replyTo: options.replyTo,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        sentAt: new Date().toISOString(),
        mode: 'live_smtp',
        status: 'delivered',
        messageId: info.messageId
      }

      await recordOutbox(record).catch(() => {})
      console.log(`[MAILER - GMAIL SMTP] Dispatched to ${options.to} (${info.messageId})`)
      return { success: true, mode: 'live_smtp', id: emailId }
    } catch (err: any) {
      console.error(`[MAILER - GMAIL SMTP ERROR]:`, err?.message || err)
      const record: EmailRecord = {
        id: emailId,
        to: options.to,
        from: emailSender,
        replyTo: options.replyTo,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        sentAt: new Date().toISOString(),
        mode: 'live_smtp',
        status: 'failed',
        error: err?.message || String(err)
      }
      await recordOutbox(record).catch(() => {})
      return { success: false, mode: 'live_smtp_failed', id: emailId }
    }
  }

  // Fallback: Local Outbox
  const record: EmailRecord = {
    id: emailId,
    to: options.to,
    from: emailSender,
    replyTo: options.replyTo,
    bcc: options.bcc,
    subject: options.subject,
    html: options.html,
    text: options.text,
    sentAt: new Date().toISOString(),
    mode: 'local_outbox',
    status: 'queued',
    messageId: `<simulated-${emailId}@uyfsr.org>`
  }

  await recordOutbox(record).catch(() => {})
  console.log(`[MAILER - LOCAL OUTBOX] Recorded email for ${options.to}: "${options.subject}"`)
  return { success: true, mode: 'local_outbox', id: emailId }
}

/**
 * 1. Candidate Registration Confirmation Email
 * Exact theme match: #f7f7f5 background, #ffffff card, #111111 ink, #2b2b28 text,
 * Georgia/Erode serif typography, #0c7866 emerald accent, authentic dossier table & 3-stage pipeline.
 */
export async function sendRegistrationEmail(app: Application) {
  const isWaived = app.paymentStatus === 'waived'
  const paymentMethodLabel = isWaived ? 'Executive Referral Waiver' : `${(app.mfsMethod || 'bkash').toUpperCase()}`
  const trxLabel = isWaived ? 'Official Waiver Applied' : (app.mfsTrxId || 'Recorded')

  const safeName = escapeHtml(app.name)
  const safeProgram = escapeHtml(app.program)
  const safeTrackingId = escapeHtml(app.trackingId)
  const safeInstitution = escapeHtml(app.institution)
  const safeCategory = escapeHtml(app.category || 'Science & Research')
  const safePhone = escapeHtml(app.phone || 'Recorded')
  const safePaymentMethod = escapeHtml(paymentMethodLabel)
  const safeTrx = escapeHtml(trxLabel)

  // Clean, spam-free subject line without brackets or trigger words
  const subject = sanitizeHeader(`Registration Confirmation: ${app.name} (${app.trackingId})`)

  const text = `
UNITED YOUTH FORUM OF SCIENCE AND RESEARCH (UYFSR)
Official Candidate Enrolment Confirmation
Established 30 May 2025 · Science, research, and reform by youth.
================================================================================

Dear ${app.name},

Thank you for registering with the United Youth Forum of Science and Research (UYFSR).
Your application for ${app.program} has been successfully received by our admissions desk.

OFFICIAL TRACKING REFERENCE ID:
${app.trackingId}

REGISTRATION DOSSIER:
--------------------------------------------------------------------------------
Candidate Name:      ${app.name}
Institution:         ${app.institution}
Registered Program:  ${app.program}
Category / Track:    ${app.category || 'Science & Research'}
Contact Phone:       ${app.phone || 'Recorded'}
Registered Email:    ${app.email}
Enrolment Mode:      ${paymentMethodLabel}
Verification Ref:    ${trxLabel}
Current Status:      Submitted · In Secretariat Verification Queue
Submission Date:     ${new Date(app.createdAt).toUTCString()}

APPLICATION PROCESSING STAGES:
--------------------------------------------------------------------------------
[✓] STAGE 1: Enrolment Form & Details Logged (Completed)
[⟳] STAGE 2: Central Secretariat Document & Identity Verification (In Progress)
[ ] STAGE 3: Supplementary Intake Form & Candidate Orientation (Next Phase)

OFFICIAL NOTICE:
Upon completing document verification in Stage 2, an official confirmation and status
update will be dispatched directly to your registered email from uyfsr.org@gmail.com.

IMPORTANT INBOX PLACEMENT ADVISORY:
If this communication arrived in your Spam or Junk folder, please click "Report Not Spam"
and save uyfsr.org@gmail.com to your address book to guarantee all subsequent Stage 2
verification clearances, interview calls, and orientation documents reach your Primary Inbox.

CENTRAL SECRETARIAT CONTACT:
- Official Correspondence: uyfsr.org@gmail.com
- Coordination Helpline: +880 1911-287501
- Secretariat Office: Dhaka, Bangladesh
`.trim()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f7f7f5; font-family: 'Erode', Georgia, 'Times New Roman', serif; color: #111111; -webkit-font-smoothing: antialiased; line-height: 1.55;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border: 1px solid #ecece9; text-align: left;">
          
          <!-- Top Pitch-Black Institutional Bar -->
          <tr>
            <td style="background-color: #111111; padding: 18px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #ffffff; font-weight: 600;">
                      United Youth Forum of Science and Research
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #a1a1aa;">
                      Est. 30 May 2025
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Editorial Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #ecece9;">
              <div style="display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em; color: #064e43; background-color: #e6f4f1; padding: 4px 10px; margin-bottom: 14px;">
                UYFSR Registry Confirmation · 2026
              </div>
              <h1 style="margin: 0 0 10px 0; font-family: 'Erode', Georgia, serif; font-size: 26px; font-weight: 500; color: #111111; line-height: 1.15; letter-spacing: -0.025em;">
                Application & Payment Received
              </h1>
              <p style="margin: 0; font-family: 'Erode', Georgia, serif; font-size: 15px; line-height: 1.5; color: #2b2b28;">
                Thank you, <strong style="color: #111111;">${safeName}</strong>. Your enrolment submission for <strong style="color: #111111;">${safeProgram}</strong> has been logged in the UYFSR central registry.
              </p>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 28px 32px;">

              <!-- Official Tracking Reference ID Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5; border: 1px solid #ecece9; border-left: 4px solid #0c7866; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #2b2b28; margin-bottom: 4px; font-weight: 600;">
                      Official Tracking Reference ID
                    </div>
                    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 21px; font-weight: 700; color: #064e43; letter-spacing: 0.04em;">
                      ${safeTrackingId}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Spam / Primary Inbox Advisory Notice -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-family: 'Erode', Georgia, serif; font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 4px;">
                      Important Action Required: Ensure Primary Inbox Delivery
                    </div>
                    <div style="font-family: 'Erode', Georgia, serif; font-size: 12.5px; line-height: 1.55; color: #78350f;">
                      If this message arrived in your <strong>Spam / Junk</strong> folder, please click <strong>"Report Not Spam"</strong> and add <strong>uyfsr.org@gmail.com</strong> to your contacts. This ensures your Stage 2 Secretariat verification results and orientation schedule arrive promptly in your Primary Inbox.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- 3-Step Application Pipeline Tracker (Direct Match with Website) -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5; border: 1px solid #ecece9; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-family: 'Erode', Georgia, serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; margin-bottom: 14px;">
                      Current Application Processing Stage:
                    </div>

                    <!-- Stage 1: Completed -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="28" valign="top">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #0c7866; color: #ffffff; text-align: center; line-height: 22px; font-size: 12px; font-weight: bold;">
                            ✓
                          </div>
                        </td>
                        <td style="padding-left: 10px;">
                          <div style="font-family: 'Erode', Georgia, serif; font-size: 14px; font-weight: 600; color: #111111;">
                            Stage 1: Enrolment Form & Payment Received
                          </div>
                          <div style="font-family: 'Erode', Georgia, serif; font-size: 12.5px; color: #0c7866; font-weight: 500;">
                            Status: Completed (${isWaived ? 'Sponsor Waiver' : `${(app.mfsMethod || 'bkash').toUpperCase()} MFS Verified`})
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Stage 2: In Progress -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="28" valign="top">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #111111; color: #ffffff; text-align: center; line-height: 22px; font-size: 12px; font-weight: bold;">
                            ⟳
                          </div>
                        </td>
                        <td style="padding-left: 10px;">
                          <div style="font-family: 'Erode', Georgia, serif; font-size: 14px; font-weight: 600; color: #111111;">
                            Stage 2: Central Secretariat Document & Identity Verification
                          </div>
                          <div style="font-family: 'Erode', Georgia, serif; font-size: 12.5px; color: #0c7866; font-weight: 500;">
                            Status: In Progress (Reviewing institutional affiliation)
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Stage 3: Upcoming -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="28" valign="top">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #ecece9; color: #2b2b28; text-align: center; line-height: 22px; font-size: 11px; font-weight: bold;">
                            3
                          </div>
                        </td>
                        <td style="padding-left: 10px;">
                          <div style="font-family: 'Erode', Georgia, serif; font-size: 14px; font-weight: 500; color: #2b2b28;">
                            Stage 3: Supplementary Intake Form & Candidate Orientation
                          </div>
                          <div style="font-family: 'Erode', Georgia, serif; font-size: 12.5px; color: #666662;">
                            Status: Scheduled upon Stage 2 verification
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Registration Particulars Dossier Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
                <tr>
                  <td colspan="2" style="padding: 10px 0; border-bottom: 2px solid #111111; font-family: 'Erode', Georgia, serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #111111;">
                    Candidate Dossier Summary
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; width: 40%; font-weight: 500;">Candidate Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #111111; font-weight: 600;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Institution</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #111111;">${safeInstitution}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Selected Program</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #111111; font-weight: 600;">${safeProgram}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Category / Discipline</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #111111;">${safeCategory}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Registered Phone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #111111; font-family: ui-monospace, Consolas, monospace;">${safePhone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Payment Method</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #0c7866; font-weight: 600;">${safePaymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Transaction ID (TrxID)</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9;">
                    <code style="font-family: ui-monospace, Consolas, monospace; background-color: #f7f7f5; border: 1px solid #ecece9; padding: 2px 7px; font-size: 13px; font-weight: 700; color: #111111;">${safeTrx}</code>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9; color: #2b2b28; font-weight: 500;">Current Status</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ecece9;">
                    <span style="display: inline-block; background-color: #e6f4f1; color: #064e43; font-family: ui-monospace, Consolas, monospace; font-size: 11px; font-weight: 700; padding: 3px 8px; text-transform: uppercase;">
                      Stage 2: Under Secretariat Review
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Official Secretariat Notice Box (Exact Match with Website) -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f9f6; border-left: 4px solid #0c7866; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-family: 'Erode', Georgia, serif; font-size: 14px; font-weight: 700; color: #064e43; margin-bottom: 6px;">
                      Official Notice from UYFSR Secretariat
                    </div>
                    <div style="font-family: 'Erode', Georgia, serif; font-size: 13.5px; line-height: 1.55; color: #2b2b28;">
                      Upon completing document and payment verification, an official confirmation and status update will be dispatched directly to your registered email from <strong>uyfsr.org@gmail.com</strong>.
                    </div>
                    <div style="font-family: 'Erode', Georgia, serif; font-size: 13px; line-height: 1.55; color: #2b2b28; margin-top: 8px;">
                      <strong>Next Step Requirement:</strong> If required for cohort allocation, a Supplementary Intake Form link will be included in the dispatch from <strong>uyfsr.org@gmail.com</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Link: Track Application -->
              <p style="margin: 0; font-family: 'Erode', Georgia, serif; font-size: 13px; color: #666662; line-height: 1.5;">
                Please preserve this email and your <strong>Tracking ID (${app.trackingId})</strong> for future communications.
              </p>
            </td>
          </tr>

          <!-- Institutional Archival Footer -->
          <tr>
            <td style="background-color: #ecece9; padding: 24px 32px; border-top: 1px solid #dcdcd8; font-size: 12px; color: #2b2b28; line-height: 1.6;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <strong style="color: #111111; font-family: 'Erode', Georgia, serif; font-size: 13px;">United Youth Forum of Science and Research (UYFSR)</strong><br>
                    <span>Central Secretariat Admissions &bull; Dhaka, Bangladesh</span><br>
                    <span>Official Email: <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866; text-decoration: underline;">uyfsr.org@gmail.com</a> &bull; Helpline: +880 1911-287501</span>
                  </td>
                  <td align="right" valign="bottom" style="font-family: ui-monospace, Consolas, monospace; font-size: 11px; color: #666662;">
                    Ref: 30-MAY-2025
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  return sendEmail({
    to: app.email,
    replyTo: OFFICIAL_EMAIL,
    subject,
    text,
    html
  })
}

/**
 * 2. Public Contact Inquiry Notification + Visitor Acknowledgment
 * Matches website warm ivory #f7f7f5 theme & editorial typography
 */
export async function sendContactInquiryEmail(inquiry: { name: string; contact: string; message: string; ceoEmail?: string }) {
  const isEmail = inquiry.contact.includes('@')
  const replyTo = isEmail ? inquiry.contact.trim() : undefined

  const safeName = escapeHtml(inquiry.name)
  const safeContact = escapeHtml(inquiry.contact)
  const safeMessage = escapeHtml(inquiry.message)

  const subject = sanitizeHeader(`[UYFSR Website Inquiry] New message from ${inquiry.name}`)

  const text = `
UNITED YOUTH FORUM OF SCIENCE AND RESEARCH (UYFSR)
New Public Inquiry Received via Website
Established 30 May 2025 · Secretariat Registry
================================================================================

Sender Name:    ${inquiry.name}
Contact Info:   ${inquiry.contact}
Timestamp:      ${new Date().toUTCString()}

INQUIRY MESSAGE:
--------------------------------------------------------------------------------
${inquiry.message}
--------------------------------------------------------------------------------

To respond, reply to this message directly or use the contact info provided above.
Central Secretariat: uyfsr.org@gmail.com
`.trim()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f7f7f5; font-family: 'Erode', Georgia, 'Times New Roman', serif; color: #111111; line-height: 1.55;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #ecece9;">
          
          <!-- Black Institutional Bar -->
          <tr>
            <td style="background-color: #111111; padding: 16px 24px;">
              <span style="font-family: ui-monospace, Consolas, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; font-weight: 600;">
                UYFSR Secretariat &bull; Direct Public Inquiry Dossier
              </span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 28px 28px;">
              <div style="font-family: ui-monospace, Consolas, monospace; font-size: 11px; text-transform: uppercase; color: #064e43; font-weight: 700; letter-spacing: 0.08em; background-color: #e6f4f1; display: inline-block; padding: 3px 8px; margin-bottom: 12px;">
                Incoming Web Correspondence
              </div>
              <h2 style="margin: 0 0 16px 0; font-family: 'Erode', Georgia, serif; font-size: 22px; font-weight: 500; color: #111111;">
                Direct Message from ${safeName}
              </h2>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; font-size: 13.5px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #666662; width: 30%;">Sender Name:</td>
                  <td style="padding: 6px 0; color: #111111; font-weight: 600;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666662;">Contact Info:</td>
                  <td style="padding: 6px 0; color: #0c7866; font-family: ui-monospace, Consolas, monospace; font-weight: 600;">${safeContact}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666662;">Logged At:</td>
                  <td style="padding: 6px 0; color: #2b2b28;">${new Date().toLocaleString()}</td>
                </tr>
              </table>

              <div style="background-color: #f7f7f5; border-left: 4px solid #0c7866; border: 1px solid #ecece9; padding: 18px 20px; font-size: 14.5px; line-height: 1.6; color: #111111; white-space: pre-wrap;">${safeMessage}</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #ecece9; padding: 16px 24px; font-size: 12px; color: #2b2b28; border-top: 1px solid #dcdcd8;">
              Dispatched by UYFSR Automated Inquiries Engine &bull; Official Inbox: <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866;">uyfsr.org@gmail.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  const secretariatNotice = await sendEmail({
    to: inquiry.ceoEmail ? [inquiry.ceoEmail, OFFICIAL_EMAIL] : OFFICIAL_EMAIL,
    replyTo,
    subject,
    text,
    html
  })

  // Courtesy Auto-Reply to Visitor
  if (isEmail) {
    const autoReplySubject = `[UYFSR Secretariat] We received your inquiry - ${inquiry.name}`
    const autoReplyText = `
UNITED YOUTH FORUM OF SCIENCE AND RESEARCH (UYFSR)
Inquiry Acknowledgment Notice
Established 30 May 2025 · Central Secretariat
================================================================================

Dear ${inquiry.name},

Thank you for reaching out to the United Youth Forum of Science and Research (UYFSR).
Our secretariat desk has received your inquiry and our coordination team will review
and respond to you as soon as possible.

YOUR INQUIRY:
"${inquiry.message}"

For urgent inquiries regarding program enrolments, research papers, or scheduling,
you can reach our secretariat coordination desk:
- Official Email: uyfsr.org@gmail.com
- Coordination Helpline: +880 1911-287501
- bKash Personal Number: 01911287501

Warm regards,
Central Secretariat
United Youth Forum of Science and Research
`.trim()

    const autoReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 24px 12px; background-color: #f7f7f5; font-family: 'Erode', Georgia, 'Times New Roman', serif; color: #111111; line-height: 1.55;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #ecece9; text-align: left;">
          
          <!-- Black Institutional Bar -->
          <tr>
            <td style="background-color: #111111; padding: 18px 28px;">
              <span style="font-family: ui-monospace, Consolas, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; font-weight: 600;">
                United Youth Forum of Science and Research &bull; Central Secretariat
              </span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 32px;">
              <div style="font-family: ui-monospace, Consolas, monospace; font-size: 11px; text-transform: uppercase; color: #064e43; font-weight: 700; letter-spacing: 0.08em; background-color: #e6f4f1; display: inline-block; padding: 3px 8px; margin-bottom: 12px;">
                Official Acknowledgment Receipt
              </div>
              <h1 style="margin: 0 0 14px 0; font-family: 'Erode', Georgia, serif; font-size: 24px; font-weight: 500; color: #111111; letter-spacing: -0.02em;">
                Inquiry Received
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #2b2b28;">
                Dear <strong style="color: #111111;">${safeName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.6; color: #2b2b28;">
                Thank you for contacting the <strong>United Youth Forum of Science and Research (UYFSR)</strong>.
                Our secretariat desk has received your message and our team will get back to you shortly.
              </p>

              <div style="background-color: #f7f7f5; border-left: 3px solid #0c7866; border: 1px solid #ecece9; padding: 16px 18px; margin-bottom: 22px;">
                <div style="font-family: ui-monospace, Consolas, monospace; font-size: 11px; text-transform: uppercase; color: #666662; margin-bottom: 4px;">
                  Your Submitted Inquiry:
                </div>
                <div style="font-size: 14px; color: #111111; font-style: italic; line-height: 1.5;">
                  "${safeMessage}"
                </div>
              </div>

              <!-- Notice Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f9f6; border-left: 4px solid #0c7866; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 13px; font-weight: 700; color: #064e43; margin-bottom: 4px;">
                      Direct Communication Channel
                    </div>
                    <div style="font-size: 13px; color: #2b2b28; line-height: 1.5;">
                      If your query is urgent regarding program registration, payment verification, or research papers, you can reply directly to this email or contact us at <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866; font-weight: 600;">uyfsr.org@gmail.com</a>.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #ecece9; padding: 20px 32px; border-top: 1px solid #dcdcd8; font-size: 12px; color: #2b2b28; line-height: 1.55;">
              <strong>United Youth Forum of Science and Research (UYFSR)</strong><br>
              Official Secretariat &bull; Dhaka, Bangladesh &bull; Official Email: <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866;">uyfsr.org@gmail.com</a> &bull; +880 1911-287501
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

    await sendEmail({
      to: inquiry.contact.trim(),
      subject: autoReplySubject,
      text: autoReplyText,
      html: autoReplyHtml
    })
  }

  return secretariatNotice
}

/**
 * 3. Application Status Update Notification
 * Matches website warm ivory #f7f7f5 theme & editorial typography
 */
/**
 * Dispatches automated status change alert to applicant.
 * Handles Stage 2 Document & Identity Verification (Under Review and Approval).
 */
export async function sendStatusUpdateEmail(app: Application, previousStatus: string) {
  if (!app.email) return

  // Safeguard: Never send duplicate notification if status did not actually change
  if (previousStatus && previousStatus === app.status) {
    console.log(`[MAILER] Skipped duplicate status email for ${app.email} (already ${app.status})`)
    return
  }

  // Safeguard: Do not re-notify if this specific status was already delivered to applicant
  if (app.notifiedStatuses && app.notifiedStatuses.includes(app.status)) {
    console.log(`[MAILER] Notification for status "${app.status}" was already delivered to ${app.email}`)
    return
  }
  if (!app.notifiedStatuses) app.notifiedStatuses = []
  app.notifiedStatuses.push(app.status)

  const isApproved = app.status === 'approved'
  const isUnderReview = app.status === 'under_review' || app.status === 'reviewing'
  const isPaymentVerified = app.status === 'payment_verified'

  let stageTitle = 'Stage 2: Central Secretariat Document & Identity Verification'
  let stageStatus = 'In Progress'
  let note = `Your application processing status has been officially updated to ${app.status}.`

  if (isApproved) {
    stageStatus = 'Approved & Verified'
    note =
      'Congratulations! Your enrolment has been officially APPROVED and ratified under the executive seal of the Chief Executive Officer (Mustafiz Bin Jihad). Stage 2 (Document & Identity Verification) is now complete. You have been officially admitted into the cohort.'
  } else if (isUnderReview) {
    stageStatus = 'Under Active Review'
    note =
      'Your application is currently in Stage 2 (Central Secretariat Document & Identity Verification). Our admissions council is actively reviewing your academic details, category prerequisites, and submitted credentials.'
  } else if (isPaymentVerified) {
    stageStatus = 'Fee Verified · Entering Stage 2'
    note =
      'Your registration fee (bKash/Nagad) has been verified by the finance desk. Your profile is now entering Stage 2: Central Secretariat Document & Identity Verification.'
  } else if (app.status === 'rejected') {
    stageStatus = 'Unsuccessful'
    note =
      'Your application could not be verified or accepted at this time. Please contact the admissions secretariat at uyfsr.org@gmail.com for details.'
  }

  const safeName = escapeHtml(app.name)
  const safeProgram = escapeHtml(app.program)
  const safeTrackingId = escapeHtml(app.trackingId)
  const safeStatus = escapeHtml(app.status.toUpperCase())
  const safeStageTitle = escapeHtml(stageTitle)
  const safeStageStatus = escapeHtml(stageStatus)
  const safeNote = escapeHtml(note)

  // Subject line crafted to avoid Spam/Junk filters (no excessive caps or spam trigger symbols)
  let subjectText = `UYFSR Admissions Update: Verification Status for ${app.name} (${app.trackingId})`
  if (isApproved) {
    subjectText = `Official Notice: Enrolment Approved for ${app.name} (${app.trackingId})`
  } else if (isUnderReview) {
    subjectText = `UYFSR Admissions: Document & Identity Verification In Progress (${app.trackingId})`
  } else if (isPaymentVerified) {
    subjectText = `UYFSR Admissions: Registration Fee Verified (${app.trackingId})`
  }
  const subject = sanitizeHeader(subjectText)

  const text = `
UNITED YOUTH FORUM OF SCIENCE AND RESEARCH (UYFSR)
Official Application Status Update
Established 30 May 2025 · Central Secretariat Admissions Registry
================================================================================

Dear ${app.name},

There is an official update regarding your application for ${app.program}.

TRACKING REFERENCE ID: ${app.trackingId}
STAGE:                 ${stageTitle}
STATUS:                ${stageStatus} (Database Status: ${app.status.toUpperCase()})

SECRETARIAT STATUS DIRECTIVE:
--------------------------------------------------------------------------------
${note}

STAGE PROGRESSION:
1. Application & Payment Logged:              Completed
2. Document & Identity Verification (Stage 2): ${isApproved ? 'Approved & Completed' : isUnderReview ? 'In Progress' : 'Pending'}
3. Supplementary Intake & Orientation (Stage 3): ${isApproved ? 'Next Phase' : 'Upcoming'}

For any questions, reach out directly to the Secretariat Admissions Registry at uyfsr.org@gmail.com or +880 1911-287501.

Warm regards,
Central Secretariat Admissions Board
United Youth Forum of Science and Research (UYFSR)
Dhaka, Bangladesh · Science, research, and reform by youth.
`.trim()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f7f7f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; line-height: 1.55;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e0; text-align: left; border-radius: 4px; overflow: hidden;">
          
          <!-- Institutional Header Bar -->
          <tr>
            <td style="background-color: #0c7866; padding: 20px 28px; text-align: left;">
              <div style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
                UYFSR
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #d0f0e8; font-weight: 500; margin-top: 2px;">
                United Youth Forum of Science and Research &bull; Central Secretariat
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <div style="font-size: 11px; text-transform: uppercase; color: #0c7866; font-weight: 700; letter-spacing: 0.08em; background-color: #e6f4f1; display: inline-block; padding: 4px 10px; margin-bottom: 14px; border-radius: 2px;">
                Official Admissions Dispatch
              </div>
              
              <h1 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 600; color: #111111; letter-spacing: -0.02em; line-height: 1.3;">
                ${isApproved ? 'Enrolment Application Approved' : isUnderReview ? 'Document & Identity Verification in Progress' : 'Application Status Update'}
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 15px; color: #2b2b28;">
                Dear <strong style="color: #111111;">${safeName}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #2b2b28;">
                The Central Secretariat Admissions Board has issued an official status update for your enrolment dossier regarding <strong style="color: #111111;">${safeProgram}</strong>:
              </p>

              <!-- Status Badge Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f5; border: 1px solid #e8e8e3; border-left: 4px solid #0c7866; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #666662; margin-bottom: 4px;">
                      Tracking Reference ID: <strong style="color: #111111;">${safeTrackingId}</strong>
                    </div>
                    <div style="font-size: 17px; font-weight: 700; color: ${isApproved ? '#0c7866' : isUnderReview ? '#b45309' : '#111111'};">
                      ${safeStageTitle}: ${safeStageStatus}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Secretariat Notice -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${isApproved ? '#f0f9f6' : '#fffbeb'}; border-left: 4px solid ${isApproved ? '#0c7866' : '#d97706'}; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${isApproved ? '#064e43' : '#92400e'}; margin-bottom: 6px;">
                      Secretariat Directive
                    </div>
                    <div style="font-size: 14px; line-height: 1.6; color: #2b2b28;">
                      ${safeNote}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Stage Progression Pipeline -->
              <div style="margin-bottom: 24px; padding: 16px 20px; background-color: #fafaf8; border: 1px solid #ecece9;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #111111; margin-bottom: 12px;">
                  Enrolment Pipeline Progress
                </div>
                <div style="font-size: 13px; line-height: 1.8; color: #2b2b28;">
                  <div>&#10003; <strong>Stage 1:</strong> Application &amp; Payment Logged &mdash; <span style="color: #0c7866; font-weight: 600;">Completed</span></div>
                  <div>${isApproved ? '&#10003;' : '&bull;'} <strong>Stage 2:</strong> Document &amp; Identity Verification &mdash; <span style="color: ${isApproved ? '#0c7866' : '#d97706'}; font-weight: 600;">${safeStageStatus}</span></div>
                  <div>&bull; <strong>Stage 3:</strong> Supplementary Intake Form &amp; Orientation &mdash; <span style="color: #666662;">${isApproved ? 'Active Next Phase' : 'Upcoming'}</span></div>
                </div>
              </div>

              <p style="margin: 0; font-size: 13px; color: #555550; line-height: 1.6;">
                For any inquiries or document submissions, you can reply directly to this email at <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866; font-weight: 600;">uyfsr.org@gmail.com</a> or phone our secretariat help desk at <strong style="color: #111111;">+880 1911-287501</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer with Full Physical Anti-Spam Compliance Details -->
          <tr>
            <td style="background-color: #f7f7f5; padding: 20px 28px; border-top: 1px solid #e8e8e3; font-size: 12px; color: #666662; line-height: 1.55;">
              <strong style="color: #111111;">United Youth Forum of Science and Research (UYFSR)</strong><br>
              Central Secretariat Admissions Registry &bull; Dhaka, Bangladesh<br>
              Official Correspondence: <a href="mailto:uyfsr.org@gmail.com" style="color: #0c7866;">uyfsr.org@gmail.com</a> &bull; Phone: +880 1911-287501<br>
              <span style="font-size: 11px; color: #888884;">Established 30 May 2025. You received this transactional message because of your registered enrolment dossier.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  return sendEmail({
    to: app.email,
    replyTo: OFFICIAL_EMAIL,
    subject,
    text,
    html
  })
}

/**
 * 4. Executive Account Approval Confirmation Email
 * Sent when the Chief Executive Officer approves a newly registered executive account.
 */
export async function sendExecutiveApprovalEmail(officer: {
  name: string
  email?: string
  title: string
  department: string
  ecardId: string
}) {
  if (!officer.email) return

  const safeName = escapeHtml(officer.name)
  const safeTitle = escapeHtml(officer.title)
  const safeDept = escapeHtml(officer.department)
  const safeEcard = escapeHtml(officer.ecardId)
  const subject = `[UYFSR Executive Account Approved] Welcome to the Secretariat, ${sanitizeHeader(officer.name)}`

  const text = `
Dear ${officer.name},

Congratulations! Your Executive Portal account registration with the United Youth Forum of Science and Research (UYFSR) has been reviewed and officially APPROVED by the Chief Executive Officer.

Executive Credentials:
- Name: ${officer.name}
- Title: ${officer.title}
- Department: ${officer.department}
- Official E-Card ID: ${officer.ecardId}

You can now sign in to the Executive Portal using your registered email (${officer.email}) or E-Card ID (${officer.ecardId}) along with the password you created during registration.

Once signed in, you may edit your profile information, view your digital E-Card, access the council directory, and collaborate in the Secretariat Workspace.

Warm regards,
Office of the Chief Executive Officer
United Youth Forum of Science and Research (UYFSR)
uyfsr.org@gmail.com
`.trim()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UYFSR Executive Account Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #111111;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f7f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #dcdcd8; border-top: 4px solid #0c7866;">
          <tr>
            <td style="padding: 28px 32px 20px; border-bottom: 1px solid #ecece9;">
              <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #0c7866; font-weight: 700; margin-bottom: 6px;">
                UYFSR EXECUTIVE COUNCIL · OFFICIAL RATIFICATION
              </div>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #111111; font-weight: 600;">
                Executive Account Approved
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; font-size: 15px; line-height: 1.65; color: #2b2b28;">
              <p style="margin: 0 0 16px;">Dear <strong>${safeName}</strong>,</p>
              <p style="margin: 0 0 18px;">
                Your registration for the <strong>UYFSR Executive Secretariat Portal</strong> has been reviewed and officially <strong>APPROVED</strong> by the Chief Executive Officer. Your account is now active.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f7f7f5; border: 1px solid #e5e5e0; margin: 18px 0;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 14px; line-height: 1.7;">
                    <div><strong>Official Name:</strong> ${safeName}</div>
                    <div><strong>Designation:</strong> ${safeTitle}</div>
                    <div><strong>Department:</strong> ${safeDept}</div>
                    <div><strong>Official E-Card ID:</strong> <span style="color: #0c7866; font-weight: 700;">${safeEcard}</span></div>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0;">
                You may now log in at the <strong>Executive Portal</strong> using your email address or E-Card ID and your chosen passkey. Once signed in, you can freely manage and update your own profile information anytime.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f7f7f5; padding: 18px 32px; border-top: 1px solid #ecece9; font-size: 12px; color: #666662;">
              <strong>United Youth Forum of Science and Research (UYFSR)</strong><br>
              Office of the Chief Executive Officer · Dhaka, Bangladesh · uyfsr.org@gmail.com
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  return sendEmail({
    to: officer.email,
    replyTo: OFFICIAL_EMAIL,
    subject,
    text,
    html
  })
}
