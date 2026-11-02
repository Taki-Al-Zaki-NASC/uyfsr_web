import React, { useState } from 'react'
import { sounds } from '../lib/audio'
import { apiApplyAmbassador } from '../lib/api'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  User,
  MapPin,
  GraduationCap
} from 'lucide-react'

interface CampusAmbassadorPageProps {
  onBackToHome: () => void
}

export const CampusAmbassadorPage: React.FC<CampusAmbassadorPageProps> = ({ onBackToHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    gradeYear: '',
    district: '',
    experience: '',
    statement: '',
    socialLink: ''
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const isValidBdPhone = (p: string) => {
    const cleaned = p.replace(/[^\d+]/g, '')
    let normalized = cleaned
    if (normalized.startsWith('+880')) normalized = '0' + normalized.slice(4)
    else if (normalized.startsWith('880')) normalized = '0' + normalized.slice(3)
    else if (normalized.startsWith('+88')) normalized = normalized.slice(3)
    normalized = normalized.replace(/\D/g, '')
    return {
      valid: normalized.length === 11 && /^01[3-9]\d{8}$/.test(normalized),
      normalized
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    const phoneValidation = isValidBdPhone(formData.phone)
    if (!phoneValidation.valid) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (013–019).')
      return
    }

    if (!formData.institution.trim()) {
      setErrorMsg('Please state your current school, college, or university name.')
      return
    }

    if (!formData.statement.trim() || formData.statement.trim().length < 15) {
      setErrorMsg('Please provide a short statement (at least 15 characters) on why you want to represent UYFSR.')
      return
    }

    setLoading(true)
    sounds.playClick()

    try {
      const res = await apiApplyAmbassador({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: phoneValidation.normalized,
        institution: formData.institution.trim(),
        gradeYear: formData.gradeYear.trim() || undefined,
        district: formData.district.trim() || undefined,
        experience: formData.experience.trim() || undefined,
        statement: formData.statement.trim(),
        socialLink: formData.socialLink.trim() || undefined
      })

      if (res.success) {
        sounds.playSuccess()
        setSubmittedId(res.trackingId)
      } else {
        setErrorMsg('Failed to submit application. Please try again.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please check your network connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111111] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => {
              sounds.playClick()
              onBackToHome()
            }}
            className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#2b2b28] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Website</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0c7866] animate-pulse" />
            <span className="text-[12px] font-semibold text-[#064e43] uppercase tracking-wider">
              Recruitment Active · Cohort 2026
            </span>
          </div>
        </div>

        {/* If Application Submitted Successfully */}
        {submittedId ? (
          <div data-reveal className="bg-white p-6 sm:p-10 border border-[#dcdcd8] shadow-sm text-left rounded-xs space-y-6">
            <div className="flex items-center gap-3 text-[#0c7866]">
              <div className="w-12 h-12 rounded-full bg-[#0c7866]/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#0c7866]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#064e43] bg-[#0c7866]/10 px-2 py-0.5 rounded-xs">
                  Official Confirmation
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-0.5">
                  Ambassador Nomination Received!
                </h1>
              </div>
            </div>

            <div className="bg-[#f7f7f5] p-5 border border-[#e5e5e0] space-y-2 rounded-xs">
              <div className="text-[12px] font-semibold text-[#2b2b28] uppercase tracking-wider">
                Official Tracking Reference ID
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#0c7866] tracking-wide">
                {submittedId}
              </div>
              <p className="text-[13px] text-[#2b2b28] pt-1">
                A confirmation dispatch has been logged for <strong className="text-[#111111]">{formData.email}</strong>.
              </p>
            </div>

            {/* Next Steps Brief */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[15px] font-bold text-[#111111]">
                What happens next?
              </h3>
              <ul className="space-y-2.5 text-[13.5px] text-[#2b2b28]">
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                  <span>
                    <strong>Review & Screening:</strong> The Central Secretariat and Chief Executive Officer (Mustafiz Bin Jihad) will review your nomination within 48–72 hours.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                  <span>
                    <strong>Email Notification:</strong> Official updates and your digital appointment pass will be dispatched directly to your inbox. <em>(Please also check your spam/junk folder).</em>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Fees Guaranteed:</strong> Campus Ambassador nominations carry strictly no registration or sponsor fees.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#e5e5e0] flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  sounds.playClick()
                  onBackToHome()
                }}
                className="px-5 py-2.5 bg-[#111111] hover:bg-[#0c7866] text-white text-[13.5px] font-semibold transition-colors cursor-pointer rounded-xs inline-flex items-center gap-2"
              >
                <span>Return to Homepage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Main Ambassador Application Form */
          <div className="space-y-6">
            
            {/* Header Card */}
            <div data-reveal className="bg-white p-6 sm:p-8 border border-[#dcdcd8] text-left shadow-2xs rounded-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0c7866]/10 border border-[#0c7866]/20 text-[#064e43] text-[11.5px] font-semibold tracking-wider uppercase mb-3 rounded-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0c7866]" />
                <span>100% Free Leadership Application · Zero Fees</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-tight">
                Apply as a Campus Ambassador
              </h1>
              <p className="text-[14.5px] text-[#2b2b28] mt-2 leading-relaxed">
                Represent the United Youth Forum of Science and Research (UYFSR) at your school, college, or university. Lead campus science awareness, coordinate student delegations, and gain verified leadership credentials.
              </p>

              {/* Verified Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#ecece9]">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                  <div className="text-[12.5px] text-[#2b2b28]">
                    <strong className="text-[#111111] block">Appointment Letter</strong>
                    Official E-ID Card & verified certificate signed by CEO.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                  <div className="text-[12.5px] text-[#2b2b28]">
                    <strong className="text-[#111111] block">National Delegation</strong>
                    Lead institutional student teams at Eclipse 2026.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0c7866] shrink-0 mt-0.5" />
                  <div className="text-[12.5px] text-[#2b2b28]">
                    <strong className="text-[#111111] block">100% Free</strong>
                    No registration fees or hidden charges whatsoever.
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} data-reveal className="bg-white p-5 sm:p-8 border border-[#dcdcd8] text-left shadow-2xs rounded-xs space-y-5">
              
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-4">
                <div className="text-[13px] font-bold text-[#111111] uppercase tracking-wider pb-1 border-b border-[#ecece9]">
                  1. Candidate Identification
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                      Official Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. tanvir@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                      WhatsApp / Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                      />
                    </div>
                    <span className="text-[11.5px] text-[#2b2b28]/70 mt-1 block">
                      Active number for secretariat coordination and WhatsApp updates.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                      District / City *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dhaka, Chittagong, Sylhet"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Profile */}
              <div className="space-y-4 pt-3">
                <div className="text-[13px] font-bold text-[#111111] uppercase tracking-wider pb-1 border-b border-[#ecece9]">
                  2. Institutional Background
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                      Institution / School / College / University *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Notre Dame College, Dhaka"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                      Class / Academic Year / Department *
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. HSC 2nd Year, or B.Sc Physics"
                        value={formData.gradeYear}
                        onChange={(e) => setFormData({ ...formData, gradeYear: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation & Experience */}
              <div className="space-y-4 pt-3">
                <div className="text-[13px] font-bold text-[#111111] uppercase tracking-wider pb-1 border-b border-[#ecece9]">
                  3. Motivation & Experience
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                    Why do you want to represent UYFSR as a Campus Ambassador? *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe your passion for science and how you plan to engage fellow students on your campus..."
                    value={formData.statement}
                    onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                    className="w-full p-3 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                    Past Club / Leadership Experience <span className="text-[#2b2b28]/60 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Science Club Member, Debate Club Executive, Class Representative"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111111] mb-1">
                    Social Profile / Facebook / LinkedIn URL <span className="text-[#2b2b28]/60 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/your.username or linkedin.com/in/..."
                    value={formData.socialLink}
                    onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#111111] outline-none rounded-xs"
                  />
                </div>
              </div>

              {/* Free Disclaimer Note */}
              <div className="p-3.5 bg-[#0c7866]/5 border border-[#0c7866]/20 rounded-xs flex items-center justify-between gap-3 text-[12.5px] text-[#064e43]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0c7866] shrink-0" />
                  <span>
                    <strong>Notice:</strong> This is an official youth leadership appointment nomination. No payment is required.
                  </span>
                </div>
                <span className="font-bold text-[#0c7866] shrink-0">100% Free</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick()
                    onBackToHome()
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-[13px] font-medium text-[#2b2b28] hover:text-[#111111] transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto justify-center px-6 py-3 bg-[#111111] hover:bg-[#0c7866] text-white text-[13.5px] font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 rounded-xs shadow-xs"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Ambassador Nomination</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  )
}
