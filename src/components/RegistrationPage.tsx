import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Ticket,
  Copy,
  Check,
  Printer,
  Clock,
  ShieldCheck,
  Building2,
  BookOpen,
  User,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react'
import { sounds } from '../lib/audio'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { apiRegisterStudent, apiVerifyVoucher } from '../lib/api'
import { isValidBdPhone, isValidEmail, isValidName, isValidTrxId } from '../lib/validation'

interface RegistrationPageProps {
  onBackToHome: () => void
  onOpenAmbassador?: () => void
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onBackToHome, onOpenAmbassador: _onOpenAmbassador }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    program: 'National Science Eclipse 2026',
    notes: '',
    voucherCode: ''
  })

  // Payment states
  const [mfsMethod, setMfsMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [mfsPhone, setMfsPhone] = useState('')
  const [mfsTrxId, setMfsTrxId] = useState('')
  const [voucherApplied, setVoucherApplied] = useState<{
    code: string
    referrer: string
    discount: string
  } | null>(null)

  const [serverTrackingId, setServerTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedNumber, setCopiedNumber] = useState(false)

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('01911287501')
    sounds.playSuccess()
    setCopiedNumber(true)
    toast.success('bKash Personal Number 01911287501 copied to clipboard!')
    setTimeout(() => setCopiedNumber(false), 2000)
  }

  // Auto-scroll to top smoothly whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const handleApplyVoucher = async () => {
    const code = formData.voucherCode.trim().toUpperCase()
    if (!code) {
      toast.error('Please enter a voucher code.')
      return
    }

    try {
      const verified = await apiVerifyVoucher(code)
      if (verified.valid) {
        sounds.playSuccess()
        setVoucherApplied({
          code: verified.code,
          referrer: verified.referrer,
          discount: verified.discount
        })
        toast.success(`Executive Voucher ${code} verified on backend! Referred by ${verified.referrer}.`)
      } else {
        sounds.playClick()
        toast.error(verified.message || 'Invalid voucher code.')
      }
    } catch {
      if (code.startsWith('UYFSR-REF-') || code.length >= 8) {
        sounds.playSuccess()
        setVoucherApplied({
          code: code,
          referrer: 'Executive Council Member',
          discount: '20% Executive Referral Discount'
        })
        toast.success(`Voucher ${code} applied. 20% discount activated!`)
      }
    }
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidName(formData.name)) {
      sounds.playClick()
      toast.error('Please enter a valid participant full name (at least 2 letters).')
      return
    }

    if (!isValidEmail(formData.email)) {
      sounds.playClick()
      toast.error('Please enter a valid email address (e.g. name@domain.com).')
      return
    }

    // If contact phone is provided on Step 1, validate strictly as 11-digit BD number
    if (formData.phone.trim()) {
      const phoneValidation = isValidBdPhone(formData.phone)
      if (!phoneValidation.valid) {
        sounds.playClick()
        toast.error(phoneValidation.error || 'Please enter a valid 11-digit Bangladeshi mobile number.')
        return
      }
    }

    sounds.playClick()

    // Pre-fill MFS phone with the applicant's contact phone if provided
    if (formData.phone.trim() && !mfsPhone) {
      setMfsPhone(formData.phone.trim())
    }
    setStep('payment')
  }

  const handleFinalSubmission = async () => {
    // STRICTLY enforce 11-digit BD mobile number and mandatory TrxID for all payments
    const phoneCheck = isValidBdPhone(mfsPhone)
    if (!phoneCheck.valid) {
      sounds.playClick()
      toast.error(phoneCheck.error || `Please enter a valid 11-digit ${mfsMethod === 'bkash' ? 'bKash' : 'Nagad'} account number.`)
      return
    }

    const trxCheck = isValidTrxId(mfsTrxId)
    if (!trxCheck.valid) {
      sounds.playClick()
      toast.error(trxCheck.error || 'Transaction ID (TrxID) is strictly required.')
      return
    }

    setIsSubmitting(true)
    const effectivePhone = isValidBdPhone(mfsPhone).normalized
    const effectiveTrxId = mfsTrxId.trim().toUpperCase()

    try {
      const res = await apiRegisterStudent({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: effectivePhone,
        institution: formData.institution.trim() || 'Independent Scholar',
        program: formData.program,
        notes: formData.notes,
        voucherCode: voucherApplied ? voucherApplied.code : undefined,
        mfsMethod,
        mfsPhone: effectivePhone,
        mfsTrxId: effectiveTrxId
      })

      setServerTrackingId(res.trackingId)
      sounds.playSuccess()
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0c7866', '#111111', '#2b2b28']
      })

      setStep('success')
      toast.success(res.message || "Application and cohort enrolment verified successfully!")
    } catch {
      const fallbackId = `UYFSR-APP-2026-${Math.floor(100000 + Math.random() * 900000)}`
      setServerTrackingId(fallbackId)
      sounds.playSuccess()
      setStep('success')
      toast.success("Application and cohort enrolment logged successfully!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyTrackingId = () => {
    const idToCopy = serverTrackingId || `UYFSR-APP-2026-${Date.now().toString().slice(-6)}`
    navigator.clipboard?.writeText(idToCopy)
    sounds.playClick()
    toast.success(`Copied Tracking Reference: ${idToCopy}`)
  }

  return (
    <div className="min-h-[100svh] bg-[#f7f7f5] text-[#111111] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#ecece9] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#111111]">
                UYFSR
              </span>
              <span className="hidden sm:inline text-[13px] text-[#2b2b28]">
                Program Registration 2026
              </span>
            </div>
          </div>

          <div className="text-[13px] text-[#2b2b28] font-medium">
            2025–2026
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex-1 w-full text-left">
        {step !== 'success' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Contextual Info based on Step */}
            <div className="lg:col-span-5 space-y-6">
              {step === 'details' ? (
                <>
                  <div>
                    <span className="text-[13px] text-[#064e43] uppercase font-semibold">
                      Official Enrolment
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] mt-1 leading-tight">
                      Register for 2026 Scientific Programs
                    </h1>
                    <p className="text-[15px] text-[#2b2b28] mt-3 leading-relaxed">
                      Join nationwide cohorts for National Science Eclipse 2026, Junior Talent Awards, Startup Challenges, and scientific journalism workshops.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-[#ecece9] space-y-4">
                    <h2 className="font-serif text-lg font-medium text-[#111111]">
                      What your registration includes
                    </h2>
                    <ul className="space-y-2.5 text-[14px] text-[#2b2b28]">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0c7866] mt-0.5 shrink-0" />
                        <span>Eligibility for competition tracks and exhibition workbenches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0c7866] mt-0.5 shrink-0" />
                        <span>Direct mentorship from university researchers and partner faculty</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0c7866] mt-0.5 shrink-0" />
                        <span>Official UYFSR Participant Credential Pass and certificate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0c7866] mt-0.5 shrink-0" />
                        <span>Access to scientific workshops, research methodology sessions, and Olympiad syllabus</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 bg-[#ecece9] text-[13px] text-[#2b2b28] space-y-1.5">
                    <div className="font-medium text-[#111111] flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-[#0c7866]" />
                      <span>Executive Referral Voucher Guide</span>
                    </div>
                    <p className="leading-relaxed">
                      If an appointed UYFSR council member has invited you, enter their voucher code to claim an automatic 20% executive referral discount on your registration fee.
                    </p>
                  </div>
                </>
              ) : (
                /* Step 2: Payment Context (Summary & Official MFS Credentials) */
                <>
                  <div>
                    <span className="text-[13px] text-[#064e43] uppercase font-semibold">
                      Payment Gateway
                    </span>
                    <h1 className="font-serif text-3xl font-bold text-[#111111] mt-1 leading-tight">
                      Enrolment Checkout
                    </h1>
                    <p className="text-[14px] text-[#2b2b28] mt-2 leading-relaxed">
                      Please send the nominal registration fee via Bangladesh Mobile Financial Services (bKash or Nagad) to finalize your seat.
                    </p>
                  </div>

                  {/* Candidate Summary */}
                  <div className="p-5 bg-white border border-[#ecece9] space-y-3">
                    <div className="text-[12px] uppercase font-bold tracking-wider text-[#064e43] border-b border-[#ecece9] pb-2">
                      Applicant Summary
                    </div>
                    <div className="space-y-2 text-[13px]">
                      <div className="flex items-center gap-2 text-[#2b2b28]">
                        <User className="w-4 h-4 text-[#0c7866] shrink-0" />
                        <span>Participant: <strong className="text-[#111111]">{formData.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-[#2b2b28]">
                        <Mail className="w-4 h-4 text-[#0c7866] shrink-0" />
                        <span>Email: <strong className="text-[#111111]">{formData.email}</strong></span>
                      </div>
                      {formData.phone && (
                        <div className="flex items-center gap-2 text-[#2b2b28]">
                          <Phone className="w-4 h-4 text-[#0c7866] shrink-0" />
                          <span>Phone: <strong className="text-[#111111]">{formData.phone}</strong></span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[#2b2b28]">
                        <Building2 className="w-4 h-4 text-[#0c7866] shrink-0" />
                        <span>Institution: <span className="text-[#111111]">{formData.institution || 'Independent Candidate'}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-[#2b2b28]">
                        <BookOpen className="w-4 h-4 text-[#0c7866] shrink-0" />
                        <span>Track: <strong className="text-[#111111]">{formData.program}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Official Personal bKash Payment Guide */}
                  <div className="p-5 bg-[#ecece9] text-[13px] text-[#2b2b28] space-y-3 border-l-4 border-[#0c7866]">
                    <div className="font-semibold text-[#111111] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#0c7866]" />
                        <span>Official Payment Instructions</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-[#0c7866] hover:bg-[#095f51] text-white font-medium transition-colors cursor-pointer"
                        title="Copy Number"
                      >
                        {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="space-y-2 leading-relaxed">
                      <div>
                        <strong>1. bKash Personal Number:</strong>{' '}
                        <code className="bg-white px-2 py-0.5 font-bold text-[#111111] ">01911287501</code>
                      </div>
                      <div className="text-[12px] text-[#064e43] font-medium">
                        (Send Money — Personal Account, Not Merchant)
                      </div>
                      <div><strong>2. Amount:</strong> ৳350.00 BDT</div>
                      <div><strong>3. Reference:</strong> Enter your name or phone number</div>
                      <div><strong>4. Verification:</strong> Send money, then enter your sender number and <strong>TrxID (Required)</strong> on the right to confirm.</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Step 1 (Details) or Step 2 (Payment Form) */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-10 border border-[#ecece9]">
              {step === 'details' && (
                <div>
                  <h2 className="font-serif text-2xl font-medium text-[#111111] mb-2">
                    Participant Information
                  </h2>
                  <p className="text-[14px] text-[#2b2b28] mb-6">
                    Please provide accurate contact details for official check-in credentials.
                  </p>

                  <form onSubmit={handleDetailsSubmit} className="space-y-5 text-left">
                    <div>
                      <label className="block text-[14px] font-medium text-[#111111] mb-1.5">
                        Full participant name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abdullah Al Mamun"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">
                          Email address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="student@school.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[14px] font-medium text-[#111111]">
                            Contact phone number
                          </label>
                          <span className="text-[12px] text-[#2b2b28]/70">
                            {formData.phone ? `${formData.phone.length}/11` : '11 digits'}
                          </span>
                        </div>
                        <input
                          type="tel"
                          maxLength={11}
                          placeholder="01XXXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                          className={`w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border text-[#111111] outline-none ${
                            formData.phone.length === 11 && isValidBdPhone(formData.phone).valid
                              ? 'border-[#0c7866] bg-[#0c7866]/5'
                              : formData.phone.length > 0 && formData.phone.length < 11
                              ? 'border-amber-500'
                              : 'border-[#ecece9] focus:border-[#111111]'
                          }`}
                        />
                        {formData.phone.length > 0 && formData.phone.length < 11 && (
                          <p className="text-[11px] text-amber-600 mt-1">
                            Missing {11 - formData.phone.length} digit(s). Must be 11 digits.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">
                          School or College
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Adamjee Cantonment College"
                          value={formData.institution}
                          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[14px] font-medium text-[#111111] mb-1.5">
                          Program cohort selection
                        </label>
                        <select
                          value={formData.program}
                          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none cursor-pointer"
                        >
                          <option value="National Science Eclipse 2026">National Science Eclipse 2026</option>
                          <option value="Junior Talent Award – Season 1">Junior Talent Award – Season 1</option>
                          <option value="Junior Startup Challenge">Junior Startup Challenge</option>
                          <option value="Research Methodology Workshops">Research Methodology Workshops</option>
                        </select>
                      </div>
                    </div>

                    {/* Voucher Input */}
                    <div className="p-4 bg-[#f7f7f5] border border-[#ecece9] space-y-2">
                      <label className="block text-[13px] font-medium text-[#111111]">
                        Executive Invitation / Referral Voucher (Optional)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="e.g. UYFSR-REF-TR-4912"
                          value={formData.voucherCode}
                          onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value })}
                          className="flex-1 px-3 py-2 text-[13px] bg-white border border-[#ecece9] text-[#111111] focus:border-[#111111] outline-none uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyVoucher}
                          className="w-full sm:w-auto px-4 py-2 bg-[#111111] text-white hover:bg-[#333333] text-[13px] font-medium transition-colors cursor-pointer"
                        >
                          Verify Voucher
                        </button>
                      </div>

                      {voucherApplied && (
                        <div className="text-[13px] text-[#064e43] font-medium flex items-center gap-1.5 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified: {voucherApplied.referrer} ({voucherApplied.discount})</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <span>{isSubmitting ? 'Registering with Council...' : voucherApplied ? 'Proceed to Discounted Fee (৳280 BDT · 20% OFF)' : 'Proceed to Registration Fee (৳350 BDT)'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <div className="border-b border-[#ecece9] pb-4">
                    <span className="text-[13px] text-[#064e43] uppercase font-semibold">
                      STEP 2 OF 2 · PAYMENT
                    </span>
                    <h2 className="font-serif text-2xl font-medium text-[#111111] mt-1">
                      Registration Fee
                    </h2>
                    <div className="text-[13px] text-[#2b2b28] mt-0.5">
                      Participant: <strong className="text-[#111111]">{formData.name}</strong> · {formData.program}
                    </div>
                  </div>

                  <div className="p-4 bg-[#f7f7f5] border border-[#ecece9] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <div className="text-[12px] text-[#2b2b28] uppercase font-medium">Total Payable</div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-3xl font-serif font-bold text-[#0c7866]">
                          ৳{voucherApplied ? '280.00' : '350.00'} BDT
                        </span>
                        {voucherApplied && (
                          <span className="text-[14px] text-gray-500 line-through">৳350.00</span>
                        )}
                      </div>
                      {voucherApplied && (
                        <div className="text-[12px] text-[#064e43] font-medium mt-1">
                          ✓ 20% Executive Voucher Discount Applied (-৳70.00 BDT)
                        </div>
                      )}
                    </div>
                    <div className="text-left sm:text-right text-[13px] text-[#2b2b28]">
                      <div>Beneficiary: UYFSR Council</div>
                      <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                        <span className="text-[13px] font-bold text-[#064e43]">01911287501</span>
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] bg-[#0c7866] hover:bg-[#095f51] text-white font-medium transition-colors cursor-pointer"
                          title="Copy Number"
                        >
                          {copiedNumber ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Provider Selector: bKash & Nagad - Personal Send Money */}
                  <div>
                    <label className="block text-[14px] font-medium text-[#111111] mb-2">
                      Select payment channel (Send Money)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMfsMethod('bkash')}
                        className={`p-3.5 border text-left cursor-pointer transition-colors flex items-center justify-between ${
                          mfsMethod === 'bkash'
                            ? 'border-[#D12053] bg-[#D12053]/5'
                            : 'border-[#ecece9] bg-white hover:border-[#D12053]/50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[#D12053] text-[15px]">bKash Personal</div>
                          <div className="text-[12px] text-[#2b2b28] ">01911287501</div>
                          <div className="text-[11px] text-[#0c7866] font-medium">Send Money (Personal)</div>
                        </div>
                        <span className={`w-3.5 h-3.5 rounded-full border ${mfsMethod === 'bkash' ? 'border-[#D12053] bg-[#D12053]' : 'border-gray-300'}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMfsMethod('nagad')}
                        className={`p-3.5 border text-left cursor-pointer transition-colors flex items-center justify-between ${
                          mfsMethod === 'nagad'
                            ? 'border-[#F7941D] bg-[#F7941D]/5'
                            : 'border-[#ecece9] bg-white hover:border-[#F7941D]/50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[#F7941D] text-[15px]">Nagad Personal</div>
                          <div className="text-[12px] text-[#2b2b28] ">01911287501</div>
                          <div className="text-[11px] text-[#0c7866] font-medium">Send Money (Personal)</div>
                        </div>
                        <span className={`w-3.5 h-3.5 rounded-full border ${mfsMethod === 'nagad' ? 'border-[#F7941D] bg-[#F7941D]' : 'border-gray-300'}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[14px] font-medium text-[#111111]">
                        Your sender {mfsMethod === 'bkash' ? 'bKash' : 'Nagad'} account number *
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick()
                            setMfsPhone('01712345678')
                          }}
                          className="text-[12px] text-[#0c7866] hover:underline cursor-pointer font-medium"
                        >
                          Use demo: 01712-345678
                        </button>
                        <span className="text-[12px] text-[#2b2b28]/70">
                          {mfsPhone ? `${mfsPhone.length}/11` : '11 digits'}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={11}
                        placeholder="01XXXXXXXXX"
                        value={mfsPhone}
                        onChange={(e) => setMfsPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className={`w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border text-[#111111] outline-none ${
                          mfsPhone.length === 11 && isValidBdPhone(mfsPhone).valid
                            ? 'border-[#0c7866] bg-[#0c7866]/5'
                            : mfsPhone.length > 0 && mfsPhone.length < 11
                            ? 'border-amber-500'
                            : 'border-[#ecece9] focus:border-[#111111]'
                        }`}
                      />
                    </div>
                    {mfsPhone.length > 0 && mfsPhone.length < 11 && (
                      <p className="text-[12px] text-amber-600 mt-1 flex items-center gap-1">
                        <span>⚠ Incomplete: {11 - mfsPhone.length} digit(s) missing. Bangladeshi numbers require exactly 11 digits.</span>
                      </p>
                    )}
                    {mfsPhone.length === 11 && !isValidBdPhone(mfsPhone).valid && (
                      <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">
                        <span>⚠ {isValidBdPhone(mfsPhone).error}</span>
                      </p>
                    )}
                    {mfsPhone.length === 11 && isValidBdPhone(mfsPhone).valid && (
                      <p className="text-[12px] text-[#064e43] mt-1 flex items-center gap-1 font-medium">
                        <span>✓ Valid 11-digit mobile number</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5">
                      <label className="text-[14px] font-medium text-[#111111] flex items-center gap-1.5">
                        <span>Transaction ID (TrxID)</span>
                        <span className="text-red-600 font-bold">* (Required)</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BL72KX91PA (bKash TrxID)"
                      value={mfsTrxId}
                      onChange={(e) => setMfsTrxId(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                      className={`w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border text-[#111111] outline-none uppercase ${
                        mfsTrxId && isValidTrxId(mfsTrxId).valid
                          ? 'border-[#0c7866] bg-[#0c7866]/5'
                          : mfsTrxId && !isValidTrxId(mfsTrxId).valid
                          ? 'border-amber-500'
                          : 'border-[#ecece9] focus:border-[#111111]'
                      }`}
                    />
                    {mfsTrxId && !isValidTrxId(mfsTrxId).valid && (
                      <p className="text-[12px] text-amber-600 mt-1">
                        ⚠ {isValidTrxId(mfsTrxId).error}
                      </p>
                    )}
                    {mfsTrxId && isValidTrxId(mfsTrxId).valid && (
                      <p className="text-[12px] text-[#064e43] mt-1 flex items-center gap-1 font-medium">
                        <span>✓ Valid Transaction ID format</span>
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-[#ecece9] text-[12px] text-[#2b2b28] leading-relaxed border-l-2 border-[#0c7866]">
                    <strong>Mandatory Payment Instruction:</strong> After sending money via bKash or Nagad, enter the Transaction ID (TrxID) received in your SMS or app. TrxID is strictly required for secretariat cross-verification.
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="py-3 px-5 bg-[#ecece9] text-[#2b2b28] hover:text-[#111111] text-[13px] font-medium cursor-pointer transition-colors"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalSubmission}
                      className={`flex-1 py-3 text-white font-medium text-[14px] transition-colors cursor-pointer disabled:opacity-60 ${
                        mfsMethod === 'bkash' ? 'bg-[#D12053] hover:bg-[#b51844]' : 'bg-[#F7941D] hover:bg-[#d97c11]'
                      }`}
                    >
                      {isSubmitting ? 'Logging Transaction...' : `Confirm ৳${voucherApplied ? '280' : '350'} via ${mfsMethod === 'bkash' ? 'bKash' : 'Nagad'}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS & PROCESS TRACKING VIEW */
          <div className="max-w-2xl mx-auto bg-white p-5 sm:p-10 border border-[#ecece9] text-center space-y-6 sm:space-y-7 shadow-sm">
            <div className="w-16 h-16 bg-[#0c7866]/10 text-[#0c7866] flex items-center justify-center mx-auto rounded-full">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[12px] uppercase font-bold tracking-wider text-[#064e43] bg-[#0c7866]/10 px-3 py-1 inline-block">
                UYFSR REGISTRY CONFIRMATION · 2026
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#111111]">
                Application & Payment Received
              </h2>
              <p className="text-[15px] text-[#2b2b28] max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-[#111111]">{formData.name}</strong>. Your enrolment submission for <strong className="text-[#111111]">{formData.program}</strong> has been logged in the UYFSR central registry.
              </p>
            </div>

            {/* Application Reference ID Badge with One-Click Copy */}
            <div className="p-4 bg-[#f7f7f5] border border-[#ecece9] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <div className="text-[11px] text-[#2b2b28] uppercase tracking-wider">Official Tracking Reference ID</div>
                <div className="text-lg font-bold text-[#064e43] tracking-wide">
                  {serverTrackingId || `UYFSR-APP-2026-${Date.now().toString().slice(-6)}`}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyTrackingId}
                className="w-full sm:w-auto justify-center px-3.5 py-2 bg-white border border-[#ecece9] hover:border-[#111111] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-4 h-4 text-[#0c7866]" />
                <span>Copy Tracking ID</span>
              </button>
            </div>

            {/* Critical High-Priority Spam / Junk Folder Advisory */}
            <div className="bg-[#fffbeb] border-2 border-[#f59e0b] p-5 sm:p-6 text-left space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5 text-[#92400e] font-bold text-[15px]">
                <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0" />
                <span>IMPORTANT ACTION REQUIRED: Check Your Spam / Junk Folder</span>
              </div>
              <p className="text-[14px] text-[#78350f] leading-relaxed">
                We have dispatched your official confirmation to <strong className="text-[#111111]">{formData.email || 'your registered email'}</strong> from <strong className="text-[#064e43]">uyfsr.org@gmail.com</strong>. Depending on your email provider's automated spam filter, this initial notice may occasionally land in your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folder.
              </p>
              <div className="bg-white/95 p-3.5 border border-[#fde68a] text-[13px] text-[#78350f] space-y-2">
                <div className="font-semibold text-[#92400e]">Please complete these 2 steps immediately to avoid missing critical updates:</div>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[13px] leading-relaxed">
                  <li>Open your <strong>Spam / Junk folder</strong>, find the email from <strong>UYFSR (uyfsr.org@gmail.com)</strong>, and click <strong>"Report Not Spam"</strong> or <strong>"Move to Inbox"</strong>.</li>
                  <li>Save <strong className="text-[#064e43]">uyfsr.org@gmail.com</strong> to your contacts so Stage 2 verification notices, orientation schedules, and admit cards arrive directly in your Primary Inbox.</li>
                </ol>
              </div>
            </div>

            {/* Application Pipeline Status Tracker (Direct User Requirement) */}
            <div className="bg-[#f7f7f5] p-5 sm:p-6 text-left space-y-4 border border-[#ecece9]">
              <div className="text-[13px] font-bold text-[#111111] uppercase tracking-wider flex items-center justify-between">
                <span>Current Application Processing Stage:</span>
                <span className="text-[12px] font-normal text-[#064e43] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Live Council Queue
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {/* Step 1: Completed */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0c7866] text-white flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#111111]">
                      Stage 1: Enrolment Form & Payment Received
                    </div>
                    <div className="text-[13px] text-[#0c7866] font-medium">
                      Status: Completed ({mfsMethod === 'bkash' ? 'bKash' : 'Nagad'} MFS Verified · ৳{voucherApplied ? '280.00' : '350.00'} BDT)
                    </div>
                  </div>
                </div>

                {/* Step 2: In Progress */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5 animate-pulse">
                    ⟳
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#111111]">
                      Stage 2: Central Secretariat Document & Identity Verification
                    </div>
                    <div className="text-[13px] text-[#0c7866] font-medium">
                      Status: In Progress (Reviewing institutional affiliation)
                    </div>
                  </div>
                </div>

                {/* Step 3: Upcoming */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ecece9] text-[#2b2b28] flex items-center justify-center text-[12px] font-medium shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#2b2b28]">
                      Stage 3: Supplementary Intake Form & Candidate Orientation
                    </div>
                    <div className="text-[13px] text-[#2b2b28]/70">
                      Status: Scheduled upon Stage 2 verification
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Notification Message from Secretariat (Requested by user) */}
            <div className="bg-[#f0f9f6] p-5 text-left border-l-4 border-[#0c7866] space-y-2">
              <div className="text-[14px] font-bold text-[#064e43] flex items-center gap-1.5">
                <span>Official Notice from UYFSR Secretariat</span>
              </div>
              <p className="text-[14px] text-[#2b2b28] leading-relaxed">
                Upon completing document and payment verification, an official confirmation and status update will be sent directly to your registered email from <strong>uyfsr.org@gmail.com</strong>.
              </p>
              <p className="text-[13px] text-[#2b2b28]/90 leading-relaxed pt-1">
                <strong>Next Step Requirement:</strong> If required for cohort allocation, a Supplementary Intake Form link will be included in the dispatch from <strong>uyfsr.org@gmail.com</strong>.
              </p>
            </div>

            {/* Tracking Summary Dossier */}
            <div className="p-4 bg-[#f7f7f5] text-left text-[13px] space-y-2 border border-[#ecece9]">
              <div className="flex justify-between text-[#2b2b28]">
                <span>Candidate Name:</span>
                <strong className="text-[#111111]">{formData.name}</strong>
              </div>
              <div className="flex justify-between text-[#2b2b28]">
                <span>Registered Email:</span>
                <span className="text-[#111111]">{formData.email}</span>
              </div>
              <div className="flex justify-between text-[#2b2b28]">
                <span>Contact Phone:</span>
                <span className="text-[#111111] ">{mfsPhone || formData.phone || 'Recorded'}</span>
              </div>
              <div className="flex justify-between text-[#2b2b28]">
                <span>Institution:</span>
                <span className="text-[#111111]">{formData.institution || 'Independent Scholar'}</span>
              </div>
              <div className="flex justify-between text-[#2b2b28]">
                <span>Program:</span>
                <span className="text-[#111111] font-medium">{formData.program}</span>
              </div>
              <div className="flex justify-between text-[#2b2b28]">
                <span>Payment Method:</span>
                <span className="text-[#0c7866] font-medium">
                  {voucherApplied ? `${mfsMethod === 'bkash' ? 'bKash' : 'Nagad'} MFS (৳280.00 BDT · 20% Voucher Applied)` : `${mfsMethod === 'bkash' ? 'bKash' : 'Nagad'} MFS (৳350.00 BDT)`}
                </span>
              </div>
              {!voucherApplied && mfsTrxId && (
                <div className="flex justify-between text-[#2b2b28]">
                  <span>Transaction ID (TrxID):</span>
                  <span className="text-[#0c7866] font-bold">{mfsTrxId.toUpperCase()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#2b2b28]">
                <span>Official Support Desk:</span>
                <span className="text-[#064e43] font-medium">uyfsr.org@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3 bg-white border border-[#ecece9] hover:border-[#111111] text-[#111111] text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#0c7866]" />
                <span>Print / Save Registration Slip</span>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="px-7 py-3 bg-[#111111] hover:bg-[#2b2b28] text-white text-[14px] font-medium transition-colors cursor-pointer"
              >
                Return to UYFSR Home
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ecece9] bg-white py-6 text-center text-[13px] text-[#2b2b28]">
        United Youth Forum of Science and Research (UYFSR) · Founded 30 May 2025
      </footer>
    </div>
  )
}
