// UYFSR Central Secretariat Frontend API Client

const BASE_URL = '/api'

export interface ExecutiveProfile {
  id: string
  name: string
  rankTier: string
  title: string
  department: string
  isCEO: boolean
  ecardId: string
  activeSince: string
  bio: string
}

export interface ApplicationRecord {
  id: string
  trackingId: string
  name: string
  email: string
  phone?: string
  institution: string
  program: string
  category?: string
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
  createdAt: string
  updatedAt: string
}

export interface SubmissionRecord {
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

export interface VoucherRedemptionRecord {
  applicantId: string
  name: string
  email: string
  program?: string
  usedAt: string
}

export interface VoucherRecord {
  code: string
  candidateName?: string
  targetRole?: string
  createdBy: string
  creatorRole: string
  discount: string
  maxUses: number
  usedCount: number
  redemptions?: VoucherRedemptionRecord[]
  createdAt: string
}

export interface MessageRecord {
  id: string
  senderName: string
  senderRole: string
  channel: string
  message: string
  timestamp: string
}

export interface MeetingRecord {
  id: string
  title: string
  hostName: string
  attendees: string[]
  dateTime: string
  agenda: string
  status: string
  createdAt: string
}

function getAuthHeaders(officerName?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('uyfsr_auth_token') : null
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else if (officerName) {
      headers['Authorization'] = `Bearer mock_jwt_${encodeURIComponent(officerName)}`
    }
  } catch {}
  if (officerName) {
    headers['x-officer-name'] = officerName
  }
  return headers
}

// 1. Executive Login (Identifier + Password/PIN)
export async function apiLogin(
  credentials: { identifier?: string; password?: string; officerName?: string; accessPin?: string; ecardId?: string } | string,
  passkey?: string
) {
  let bodyPayload: Record<string, string | undefined> = {}
  if (typeof credentials === 'string') {
    bodyPayload = { identifier: credentials, password: passkey }
  } else {
    bodyPayload = {
      identifier: credentials.identifier || credentials.ecardId || credentials.officerName,
      password: credentials.password || credentials.accessPin
    }
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(err.error || 'Authentication error')
  }
  const data = await res.json()
  if (data?.token && typeof window !== 'undefined') {
    try {
      localStorage.setItem('uyfsr_auth_token', data.token)
    } catch {}
  }
  return data as {
    success: boolean
    token: string
    officer: ExecutiveProfile
  }
}

// 1.1 Verify and Login via Executive E-ID Card with PIN
export async function apiLoginByEcard(ecardId: string, passkey: string) {
  return apiLogin({ ecardId, accessPin: passkey })
}

// 1.2 Fetch Public Executive E-ID Card Details
export async function apiGetEcardDetails(cardId: string) {
  const res = await fetch(`${BASE_URL}/auth/ecard/${encodeURIComponent(cardId)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Card not found' }))
    throw new Error(err.error || 'E-ID Card verification failed')
  }
  return res.json() as Promise<{ valid: boolean; officer: ExecutiveProfile }>
}

export interface ForgotPasswordRequestResponse {
  success: boolean
  officerId: string
  officerName: string
  officerTitle: string
  ecardId?: string
  maskedEmail: string
  resetToken: string
  message: string
}

export interface ResetPasswordPayload {
  officerId: string
  resetToken: string
  otpCode: string
  newPassword: string
  confirmPassword: string
}

// 1.3 Request Executive Passkey Reset
export async function apiForgotPasswordRequest(identifier: string): Promise<ForgotPasswordRequestResponse> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Passkey recovery request failed' }))
    throw new Error(err.error || 'Failed to initiate passkey reset')
  }
  return res.json()
}

// 1.4 Complete Executive Passkey Reset
export async function apiResetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Passkey reset failed' }))
    throw new Error(err.error || 'Failed to update security passkey')
  }
  return res.json()
}

// 2. Student Registration
export async function apiRegisterStudent(payload: {
  name: string
  email: string
  phone?: string
  institution: string
  program: string
  category?: string
  notes?: string
  voucherCode?: string
  mfsMethod?: string
  mfsPhone?: string
  mfsTrxId?: string
}) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Registration failed' }))
    throw new Error(err.error || 'Registration error')
  }
  return res.json() as Promise<{
    success: boolean
    trackingId: string
    status: string
    application: ApplicationRecord
    message: string
  }>
}

// 3. Track Application Pipeline
export async function apiTrackApplication(trackingId: string) {
  const res = await fetch(`${BASE_URL}/track/${encodeURIComponent(trackingId)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Tracking ID not found' }))
    throw new Error(err.error || 'Application not found')
  }
  return res.json() as Promise<{
    success: boolean
    application: ApplicationRecord
    pipeline: { step: number; title: string; status: string }[]
    officialNotice: string
  }>
}

// 3.1 List All Applications (Executive / Council Dashboard)
export async function apiGetApplications(officerName?: string) {
  const res = await fetch(`${BASE_URL}/applications`, {
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch applications' }))
    throw new Error(err.error || 'Failed to fetch applications')
  }
  const data = await res.json()
  return data.applications as ApplicationRecord[]
}

// 3.2 Update Application Status (Approve / Review / Reject)
export async function apiUpdateApplicationStatus(
  id: string,
  status: 'submitted' | 'under_review' | 'approved' | 'rejected',
  officerName?: string
) {
  const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(id)}/status`, {
    method: 'POST',
    headers: getAuthHeaders(officerName),
    body: JSON.stringify({ status })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Status update failed' }))
    throw new Error(err.error || 'Failed to update application status')
  }
  return res.json()
}

// 3.3 Dispatch Custom CEO / Executive Email to Candidate
export async function apiSendApplicantEmail(
  id: string,
  payload: { subject: string; message: string; autoMarkMailed?: boolean },
  officerName?: string
) {
  const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(id)}/send-email`, {
    method: 'POST',
    headers: getAuthHeaders(officerName),
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to dispatch email' }))
    throw new Error(err.error || 'Failed to dispatch email')
  }
  return res.json() as Promise<{ success: boolean; message: string; application: ApplicationRecord }>
}

// 3.4 Toggle Mailed / Non-Mailed Status
export async function apiToggleMailedStatus(id: string, mailed: boolean, officerName?: string) {
  const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(id)}/toggle-mailed`, {
    method: 'POST',
    headers: getAuthHeaders(officerName),
    body: JSON.stringify({ mailed })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update status' }))
    throw new Error(err.error || 'Failed to update mailed status')
  }
  return res.json() as Promise<{ success: boolean; mailed: boolean; application: ApplicationRecord }>
}

export type VoucherVerifyResult =
  | { valid: true; code: string; referrer: string; discount: string; remainingUses: number }
  | { valid: false; message: string }

// 4. Voucher Verification
export async function apiVerifyVoucher(code: string): Promise<VoucherVerifyResult> {
  const res = await fetch(`${BASE_URL}/vouchers/verify/${encodeURIComponent(code)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Invalid voucher' }))
    return { valid: false, message: err.message || 'Invalid voucher code' }
  }
  return res.json()
}

// 5. Generate Voucher Pass (Executive)
export async function apiGenerateVoucher(
  officerName: string,
  optionsOrDiscount?: string | { candidateName?: string; targetRole?: string; creatorRole?: string; discount?: string; maxUses?: number },
  maxUsesArg = 25
) {
  let body: any = { discount: '20% Executive Discount', maxUses: 25 }
  if (typeof optionsOrDiscount === 'object' && optionsOrDiscount !== null) {
    body = {
      candidateName: optionsOrDiscount.candidateName,
      targetRole: optionsOrDiscount.targetRole,
      creatorRole: optionsOrDiscount.creatorRole,
      discount: optionsOrDiscount.discount || '20% Executive Discount',
      maxUses: optionsOrDiscount.maxUses || 25
    }
  } else if (typeof optionsOrDiscount === 'string') {
    body = { discount: optionsOrDiscount, maxUses: maxUsesArg }
  }

  const res = await fetch(`${BASE_URL}/vouchers/generate`, {
    method: 'POST',
    headers: getAuthHeaders(officerName),
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to generate voucher' }))
    throw new Error(err.error || 'Voucher generation failed')
  }
  return res.json() as Promise<{ success: boolean; voucher: VoucherRecord }>
}

export async function apiGetVouchers(officerName?: string) {
  const res = await fetch(`${BASE_URL}/vouchers`, {
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.vouchers || []) as VoucherRecord[]
}

// 6. Submissions Management (CEO-only approvals)
export async function apiGetSubmissions() {
  const res = await fetch(`${BASE_URL}/submissions`)
  if (!res.ok) throw new Error('Failed to fetch submissions')
  const data = await res.json()
  return data.submissions as SubmissionRecord[]
}

export async function apiApproveSubmission(id: string, officerName: string) {
  const res = await fetch(`${BASE_URL}/submissions/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Permission denied' }))
    throw new Error(err.error || 'Only the CEO can approve submissions.')
  }
  return res.json()
}

export async function apiRejectSubmission(id: string, officerName: string) {
  const res = await fetch(`${BASE_URL}/submissions/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Permission denied' }))
    throw new Error(err.error || 'Only the CEO can reject submissions.')
  }
  return res.json()
}

// 7. Live Internal Messaging
export async function apiGetMessages(channel = 'Executive Council') {
  const res = await fetch(`${BASE_URL}/messages?channel=${encodeURIComponent(channel)}`)
  if (!res.ok) throw new Error('Failed to load messages')
  const data = await res.json()
  return data.messages as MessageRecord[]
}

export async function apiSendMessage(senderName: string, senderRole: string, channel: string, message: string) {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderName, senderRole, channel, message })
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

// 7.1 Public Contact Inquiry
export async function apiSendContactInquiry(payload: {
  name: string
  contact: string
  message: string
}) {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to send message' }))
    throw new Error(err.error || 'Failed to send message')
  }
  return res.json() as Promise<{ success: boolean; message: string }>
}

// 8. Meeting Scheduler
export async function apiGetMeetings() {
  const res = await fetch(`${BASE_URL}/meetings`)
  if (!res.ok) throw new Error('Failed to fetch meetings')
  const data = await res.json()
  return data.meetings as MeetingRecord[]
}

export async function apiScheduleMeeting(
  payload: {
    title: string
    hostName: string
    attendees: string[]
    dateTime: string
    agenda: string
  },
  officerName?: string
) {
  const res = await fetch(`${BASE_URL}/meetings`, {
    method: 'POST',
    headers: getAuthHeaders(officerName || payload.hostName),
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to schedule meeting' }))
    throw new Error(err.error || 'Failed to schedule meeting')
  }
  return res.json() as Promise<{ success: boolean; meeting: MeetingRecord }>
}

export async function apiDeleteMeeting(meetingId: string, officerName?: string) {
  const res = await fetch(`${BASE_URL}/meetings/${encodeURIComponent(meetingId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete meeting' }))
    throw new Error(err.error || 'Failed to delete meeting session')
  }
  return res.json() as Promise<{ success: boolean; message: string }>
}

export async function apiDeleteApplication(applicantId: string, officerName?: string) {
  const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(applicantId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete application' }))
    throw new Error(err.error || 'Failed to delete application record')
  }
  return res.json() as Promise<{ success: boolean; message: string }>
}

export async function apiDeleteMessage(messageId: string, officerName?: string) {
  const res = await fetch(`${BASE_URL}/messages/${encodeURIComponent(messageId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete message' }))
    throw new Error(err.error || 'Failed to delete message')
  }
  return res.json() as Promise<{ success: boolean; message: string }>
}

export async function apiDeleteVoucher(code: string, officerName?: string) {
  const res = await fetch(`${BASE_URL}/vouchers/${encodeURIComponent(code)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(officerName)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to revoke voucher' }))
    throw new Error(err.error || 'Failed to revoke voucher code')
  }
  return res.json() as Promise<{ success: boolean; message: string }>
}

// 9. Facebook News Syndication
export async function apiGetNews() {
  const res = await fetch(`${BASE_URL}/news`)
  if (!res.ok) throw new Error('Failed to fetch syndicated news')
  const data = await res.json()
  return data.news
}

export async function apiSyncNews() {
  const res = await fetch(`${BASE_URL}/news/sync`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to synchronize news feed')
  return res.json()
}

// 10. Campus Ambassador Application (100% Free Leadership Nomination)
export async function apiApplyAmbassador(payload: {
  name: string
  email: string
  phone: string
  institution: string
  gradeYear?: string
  district?: string
  experience?: string
  statement?: string
  socialLink?: string
}) {
  const res = await fetch(`${BASE_URL}/ambassadors/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to submit application' }))
    throw new Error(err.error || 'Failed to submit application')
  }
  return res.json() as Promise<{
    success: boolean
    trackingId: string
    message: string
  }>
}
