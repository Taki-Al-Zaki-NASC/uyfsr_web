import React from 'react'
import {
  X,
  Send,
  ShieldCheck,
  Lock,
  Mail,
  MailCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  Building,
  CreditCard,
  Ticket,
  Copy,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { sounds } from '../lib/audio'

export interface ApplicantDossier {
  id: string
  name: string
  institution: string
  program: string
  proposal: string
  date: string
  status: 'Approved' | 'Reviewing' | 'Pending' | 'Rejected'
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

interface ApplicantDetailModalProps {
  isOpen: boolean
  onClose: () => void
  applicant: ApplicantDossier | null
  isCEO: boolean
  onStatusChange: (id: string, status: 'Approved' | 'Reviewing' | 'Pending' | 'Rejected') => void
  onWriteMail: (applicant: ApplicantDossier) => void
  onToggleMailed: (id: string, currentMailed?: boolean) => void
  onDelete?: (id: string) => void
}

export const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({
  isOpen,
  onClose,
  applicant,
  isCEO,
  onStatusChange,
  onWriteMail,
  onToggleMailed,
  onDelete
}) => {
  if (!isOpen || !applicant) return null

  const handleCopy = (text: string, label: string) => {
    sounds.playClick()
    navigator.clipboard?.writeText(text)
    toast.success(`Copied ${label}: ${text}`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#111111]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
    >
      <div className="bg-white border border-[#ecece9] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Masthead */}
        <div className="px-6 py-4.5 bg-[#111111] text-white flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c7866] rounded-xs flex items-center justify-center text-white shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#0c7866] font-semibold flex items-center gap-1.5">
                <span>UYFSR Official Candidate Dossier</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-300 font-mono">{applicant.id}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-0.5">
                {applicant.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close applicant dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="px-6 py-3 bg-[#f7f7f5] border-b border-[#ecece9] flex flex-wrap items-center justify-between gap-3 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-[#2b2b28]/70 text-[12px]">Current Enrolment Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-xs text-[12px] font-semibold uppercase tracking-wider ${
                applicant.status === 'Approved'
                  ? 'bg-emerald-100 text-[#064e43] border border-emerald-300'
                  : applicant.status === 'Reviewing'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : applicant.status === 'Rejected'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : 'bg-zinc-100 text-zinc-800 border border-zinc-300'
              }`}
            >
              {applicant.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#2b2b28]">
            <span>Registered: <strong className="text-[#111111]">{applicant.date}</strong></span>
            <span>·</span>
            <button
              onClick={() => handleCopy(applicant.id, 'Tracking ID')}
              className="inline-flex items-center gap-1 text-[#0c7866] hover:underline cursor-pointer"
              title="Copy Reference ID"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy ID</span>
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left text-[#111111]">
          {/* Section 1: Candidate Bio & Academic Info */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0c7866] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Candidate Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#fafaf8] p-4 border border-[#ecece9]">
              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">Full Name</div>
                <div className="text-[14px] font-semibold text-[#111111]">{applicant.name}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">Academic Institution</div>
                <div className="text-[14px] font-medium text-[#111111]">{applicant.institution || 'Independent Candidate'}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">Email Address</div>
                <div className="text-[13.5px] text-[#111111]">
                  {applicant.email ? (
                    <a href={`mailto:${applicant.email}`} className="text-[#0c7866] hover:underline font-mono">
                      {applicant.email}
                    </a>
                  ) : (
                    <span className="text-[#2b2b28]/50 italic">No email provided</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">Contact Phone</div>
                <div className="text-[13.5px] font-mono text-[#111111]">
                  {applicant.phone ? (
                    <a href={`tel:${applicant.phone}`} className="text-[#111111] hover:underline">
                      {applicant.phone}
                    </a>
                  ) : (
                    <span className="text-[#2b2b28]/50 italic">No phone provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Program & Project Proposal Details */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0c7866] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              <span>Program & Project Proposal Submission</span>
            </h3>
            <div className="bg-[#fafaf8] p-4 border border-[#ecece9] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ecece9] pb-2.5">
                <div>
                  <div className="text-[11px] text-[#2b2b28]/70 uppercase">Applied Program</div>
                  <div className="text-[14.5px] font-bold text-[#111111]">{applicant.program}</div>
                </div>
                {applicant.category && (
                  <div>
                    <div className="text-[11px] text-[#2b2b28]/70 uppercase">Track / Category</div>
                    <div className="text-[13px] font-medium text-[#0c7866]">{applicant.category}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase mb-1">
                  Project Synopsis / Proposal Abstract / Notes
                </div>
                <div className="p-3 bg-white border border-[#ecece9] text-[13.5px] text-[#2b2b28] leading-relaxed whitespace-pre-wrap font-sans max-h-48 overflow-y-auto">
                  {applicant.proposal || 'No project description notes attached with application.'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Voucher Reconciliation */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0c7866] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>Financial & Registration Verification</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#fafaf8] p-4 border border-[#ecece9]">
              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">Registration Fee Status</div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-bold uppercase rounded-xs ${
                      applicant.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : applicant.paymentStatus === 'waived'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {applicant.paymentStatus ? applicant.paymentStatus.toUpperCase() : 'PENDING VERIFICATION'}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">MFS Method & Transaction ID</div>
                <div className="text-[13px] text-[#111111] font-mono mt-0.5">
                  {applicant.mfsTrxId ? (
                    <span>
                      <strong className="text-[#0c7866]">{applicant.mfsMethod || 'bKash'}</strong>: {applicant.mfsTrxId}
                    </span>
                  ) : (
                    <span className="text-[#2b2b28]/60 italic font-sans">No TrxID submitted</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#2b2b28]/70 uppercase">Voucher Code / Referral</div>
                <div className="text-[13px] text-[#111111] font-mono mt-0.5 flex items-center gap-1">
                  {applicant.voucherCode ? (
                    <span className="text-[#0c7866] font-bold bg-[#0c7866]/10 px-2 py-0.5 rounded-xs flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" />
                      {applicant.voucherCode}
                    </span>
                  ) : (
                    <span className="text-[#2b2b28]/60 italic font-sans">Direct applicant</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Email Dispatch Log */}
          <div>
            <h3 className="text-[12px] font-bold text-[#0c7866] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>Official Secretariat Notice Dispatch</span>
            </h3>
            <div className="p-4 bg-[#fafaf8] border border-[#ecece9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-medium text-[#111111]">
                  Candidate Dispatch Status: {applicant.mailed ? (
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1 ml-1">
                      <MailCheck className="w-4 h-4" /> Dispatched
                    </span>
                  ) : (
                    <span className="text-zinc-600 font-bold inline-flex items-center gap-1 ml-1">
                      <Clock className="w-4 h-4" /> Pending Dispatch
                    </span>
                  )}
                </div>
                {applicant.mailed && applicant.mailedAt && (
                  <div className="text-[11.5px] text-[#2b2b28]/70 mt-0.5">
                    Dispatched on {new Date(applicant.mailedAt).toLocaleString('en-GB')} {applicant.mailedBy ? `by ${applicant.mailedBy}` : ''}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleMailed(applicant.id, applicant.mailed)}
                  className="px-3 py-1.5 bg-white border border-[#dcdcd8] hover:border-[#111111] text-[12px] font-medium text-[#111111] rounded-xs cursor-pointer transition-colors"
                >
                  {applicant.mailed ? "Mark as Not Mailed" : "Mark as Mailed"}
                </button>

                <button
                  type="button"
                  onClick={() => onWriteMail(applicant)}
                  className="px-3.5 py-1.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[12px] font-medium rounded-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Write Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer & Direct Executive Decision Controls */}
        <div className="px-6 py-4 bg-[#f7f7f5] border-t border-[#ecece9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-[#2b2b28] flex items-center gap-1.5">
            {isCEO ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#0c7866]" />
                CEO Executive Approval Authority Active
              </span>
            ) : (
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <Lock className="w-4 h-4 text-amber-700" />
                Review Mode Only (Approval requires CEO clearance)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {applicant.status !== 'Approved' && (
              <button
                type="button"
                onClick={() => onStatusChange(applicant.id, 'Approved')}
                disabled={!isCEO}
                title={isCEO ? 'Formally Approve Application' : 'Only CEO has authority to approve'}
                className={`px-4 py-2 text-[12.5px] font-medium rounded-xs transition-colors flex items-center gap-1.5 ${
                  isCEO
                    ? 'bg-[#0c7866] hover:bg-[#095f51] text-white cursor-pointer shadow-xs'
                    : 'bg-[#ecece9] text-[#2b2b28]/50 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Enrolment</span>
              </button>
            )}

            {applicant.status !== 'Reviewing' && (
              <button
                type="button"
                onClick={() => onStatusChange(applicant.id, 'Reviewing')}
                className="px-3.5 py-2 bg-white hover:bg-[#ecece9] text-[#111111] border border-[#dcdcd8] text-[12.5px] font-medium rounded-xs cursor-pointer transition-colors"
              >
                Set Under Review
              </button>
            )}

            {applicant.status !== 'Rejected' && (
              <button
                type="button"
                onClick={() => onStatusChange(applicant.id, 'Rejected')}
                disabled={!isCEO}
                title={isCEO ? 'Reject Application' : 'Only CEO can reject'}
                className={`px-3.5 py-2 text-[12.5px] font-medium rounded-xs transition-colors flex items-center gap-1.5 ${
                  isCEO
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer'
                    : 'bg-[#ecece9] text-[#2b2b28]/50 cursor-not-allowed'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            )}

            {isCEO && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(applicant.id)}
                title="Purge Application Record from Central Registry (CEO Clearance)"
                className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 text-[12.5px] font-medium rounded-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-rose-700" />
                <span>Purge Record</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#111111] hover:bg-[#2b2b28] text-white text-[12.5px] font-medium rounded-xs cursor-pointer transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
