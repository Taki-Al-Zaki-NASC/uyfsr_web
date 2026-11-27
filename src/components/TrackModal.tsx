import React, { useState } from 'react'
import { X, CheckCircle2, ArrowRight, AlertCircle, Clock, Send, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { sounds } from '../lib/audio'
import { apiRegisterStudent, type SiteTrackConfig } from '../lib/api'

interface TrackModalProps {
  track: SiteTrackConfig & { category?: string; description?: string; highlights?: string[] }
  onClose: () => void
  onExploreEvents?: () => void
}

export const TrackModal: React.FC<TrackModalProps> = ({ track, onClose, onExploreEvents }) => {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [institution, setInstitution] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      toast.error('Please enter your full name.')
      return
    }
    if (!email.trim().includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (phone.trim().length < 10) {
      toast.error('Please enter a valid 11-digit mobile phone number.')
      return
    }

    setSubmitting(true)
    sounds.playClick()
    try {
      const res = await apiRegisterStudent({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        institution: institution.trim() || 'Independent Participant',
        program: `${track.num} ${track.title} · ${track.sessionTitle || 'Cohort 2026'}`,
        notes: notes.trim() || undefined
      })
      sounds.playSuccess()
      setTrackingId(res.trackingId)
      setStep('success')
      toast.success('Registration submitted successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit registration.')
    } finally {
      setSubmitting(false)
    }
  }

  // -------------------------------------------------------------
  // STATE 1: TRACK IS CLOSED / NO UPCOMING SESSIONS (User Feature)
  // -------------------------------------------------------------
  if (!track.isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-[#dcdcd8] w-full max-w-lg shadow-2xl text-left overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#ecece9] bg-[#f7f7f5]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-200 text-neutral-700">
                {track.num}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#111111]">{track.title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-[#ecece9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Inactive Notice Body */}
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Currently Closed · No Upcoming Sessions</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-[#111111]">
                No Sessions Scheduled Right Now
              </h4>
              <p className="text-[13.5px] text-[#2b2b28]/80 leading-relaxed mt-2 max-w-md mx-auto">
                {track.notice ||
                  'Currently, there are no open workshops or registration cohorts for this track. Our Academic Secretariat is finalizing the next national schedule.'}
              </p>
            </div>

            <div className="p-4 bg-[#f7f7f5] border border-[#ecece9] text-left text-xs text-[#2b2b28]/80 space-y-1">
              <div className="font-semibold text-[#111111] text-[12.5px] mb-1">Notice from Secretariat:</div>
              <div>• New cohort dates will be announced on our Facebook page and official portal.</div>
              <div>• You may register for our flagship competitions in the meantime.</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              {onExploreEvents && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onExploreEvents()
                  }}
                  className="px-5 py-2.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Open Events & Fairs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#f0f0ed] hover:bg-[#e4e4e0] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // STATE 2: TRACK IS ACTIVE / REGISTRATION OPEN
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#dcdcd8] w-full max-w-lg shadow-2xl my-6 text-left overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ecece9] bg-[#f7f7f5]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#0c7866] text-white">
                Track {track.num}
              </span>
              <span className="text-[11px] font-semibold text-[#0c7866] uppercase tracking-wider">
                Registration Active
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#111111]">{track.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-[#ecece9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'success' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#111111]">Enrolment Confirmed!</h4>
            <p className="text-[13px] text-[#2b2b28]/80 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{name}</strong>. Your enrolment for{' '}
              <strong>{track.title}</strong> has been logged in the UYFSR registry.
            </p>

            {trackingId && (
              <div className="p-3 bg-[#f7f7f5] border border-[#ecece9] max-w-xs mx-auto">
                <div className="text-[11px] text-[#2b2b28]/60 uppercase tracking-widest font-mono">Reference Serial</div>
                <div className="font-mono font-bold text-[#0c7866] text-sm mt-0.5">{trackingId}</div>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-6 py-2.5 bg-[#111111] text-white text-[13px] font-medium hover:bg-[#2b2b28] transition-colors cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Session Info Banner */}
            <div className="p-3.5 bg-[#0c7866]/5 border border-[#0c7866]/20 flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-bold text-[#0c7866]">
                  {track.sessionTitle || `${track.title} Hands-on Cohort`}
                </div>
                <p className="text-[12px] text-[#2b2b28]/80 mt-1 leading-snug">
                  {track.notice || 'Active academic cohort session supervised by UYFSR research fellows.'}
                </p>
              </div>
              {track.fee && (
                <div className="shrink-0 px-2.5 py-1 bg-[#0c7866] text-white text-[11px] font-bold rounded-xs">
                  {track.fee}
                </div>
              )}
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] mb-1">
                Full Participant Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#111111] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#111111] mb-1">
                  Mobile Number (11-digit BD) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] mb-1">
                School, College or Institution
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka College"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] mb-1">
                Special Learning Goals or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any specific topic you are eager to explore..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#ecece9]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#2b2b28]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0c7866]" />
                <span>Verified Central Enrolment</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Confirm Enrolment'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
