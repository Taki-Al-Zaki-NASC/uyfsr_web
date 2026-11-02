import React from 'react'
import { X, Printer, Copy, CheckCircle2 } from 'lucide-react'
import { sounds } from '../lib/audio'
import { toast } from 'sonner'

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
  executive: {
    id: string
    name: string
    rankTier: string
    title: string
    department: string
    email: string
    phone: string
    issueDate: string
    clearanceLevel: string
    portfolioTasks: {
      id: string
      title: string
      deadline: string
      status: string
    }[]
  }
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose, executive }) => {
  if (!isOpen) return null

  const handlePrint = () => {
    sounds.playClick()
    window.print()
  }

  const handleCopyHash = () => {
    sounds.playSuccess()
    const verificationText = `UYFSR Verified Executive Dossier: ${executive.name} (${executive.id}) - Central Council Accreditation 2026`
    navigator.clipboard?.writeText(verificationText)
    toast.success("Copied verified executive dossier credentials to clipboard.")
  }

  return (
    <div
      data-ui
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#111111]/70 transition-opacity"
      />

      <div data-ui className="relative w-full max-w-3xl bg-white p-5 sm:p-10 z-10 text-left my-4 sm:my-8 max-h-[92dvh] overflow-y-auto">
        {/* Header Actions */}
        <div data-ui className="flex items-center justify-between pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0c7866]" />
            <span className="text-[12px] uppercase tracking-wider text-[#111111] font-semibold">
              UYFSR Executive Profile
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#111111] text-white hover:bg-[#333333] text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close CV dialog"
              className="p-1.5 text-[#2b2b28] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official CV Body */}
        <div id="executive-cv-document" className="space-y-6 text-[#111111]">
          {/* Institutional Letterhead */}
          <div data-ui className="pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-[#f7f7f5] p-6">
            <div>
              <div className="font-serif text-3xl font-bold tracking-tight text-[#111111]">
                UYFSR
              </div>
              <div className="text-[13px] font-serif text-[#2b2b28] mt-0.5">
                United Youth Forum of Science and Research
              </div>
            </div>

            <div className="text-left sm:text-right text-[12px] text-[#2b2b28]">
              <div>RECORD SERIAL: <code className="text-[#111111] font-semibold">{executive.id}</code></div>
              <div>COHORT: {executive.issueDate}</div>
            </div>
          </div>

          {/* Officer Bio Header */}
          <div data-ui className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-[#f7f7f5] p-6">
            <div className="sm:col-span-8">
              <span className="text-[12px] text-[#0c7866] uppercase font-semibold">
                {executive.rankTier}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#111111] mt-1">
                {executive.name}
              </h2>
              <div className="text-[16px] font-medium text-[#2b2b28] mt-1">
                {executive.title}
              </div>
              <div className="text-[14px] text-[#2b2b28]">
                {executive.department}
              </div>
            </div>

            <div data-ui className="sm:col-span-4 text-[13px] text-[#2b2b28] space-y-1.5 sm:pl-6 flex flex-col justify-center">
              <div>
                <strong>Official Email:</strong><br />
                <span className="text-[12px] text-[#111111]">{executive.email}</span>
              </div>
              <div>
                <strong>Secretariat Phone:</strong><br />
                <span className="text-[12px] text-[#111111]">{executive.phone}</span>
              </div>
              <div>
                <strong>Council Role Tier:</strong><br />
                <span className="text-[12px] text-[#0c7866]">{executive.rankTier}</span>
              </div>
            </div>
          </div>

          {/* Verified Responsibilities & Milestones */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#111111] pb-2 mb-3">
              Key Responsibilities & Portfolio
            </h3>
            <div className="space-y-2.5">
              {executive.portfolioTasks.map((t, idx) => (
                <div key={idx} data-ui className="flex items-start justify-between p-3 bg-white text-[13px]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0c7866] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-[#111111]">{t.title}</div>
                      <div className="text-[12px] text-[#2b2b28]">Target Schedule: {t.deadline}</div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 bg-[#f7f7f5] text-[#0c7866] font-medium">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Endorsements & Skill Verification */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#111111] pb-2 mb-3">
              Institutional Competencies & Endorsements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
              <div className="p-2.5 bg-[#f7f7f5]">
                Methodological Inquiry
              </div>
              <div className="p-2.5 bg-[#f7f7f5]">
                National Olympiad Ops
              </div>
              <div className="p-2.5 bg-[#f7f7f5]">
                Scientific Methodology Review
              </div>
              <div className="p-2.5 bg-[#f7f7f5]">
                Institutional Alliances
              </div>
            </div>
          </div>

          {/* Central Council Signature & Verification Seal */}
          <div data-ui className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end bg-[#f7f7f5] p-6">
            <div>
              <div className="text-[11px] text-[#2b2b28] uppercase font-semibold">
                AUTHENTICATION GUARANTEE
              </div>
              <div className="text-[12px] text-[#2b2b28] mt-1">
                This curriculum vitae and portfolio record is formally recognized under the UYFSR Central Governance Code.
              </div>
              <div className="text-[11px] text-[#0c7866] mt-2 font-medium">
                VERIFICATION HASH: <code>SHA256-UYFSR-{executive.id}-2026</code>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-serif italic text-xl text-[#111111]">
                Mustafiz Bin Jihad
              </div>
              <div className="text-[12px] font-medium text-[#111111]">
                Chief Executive Officer (CEO)
              </div>
              <div className="text-[11px] text-[#2b2b28]">
                For UYFSR Executive Council
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div data-ui className="mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={handleCopyHash}
            className="text-[13px] text-[#2b2b28] hover:text-[#111111] font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Verification Record</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ecece9] hover:bg-[#e0e0dc] text-[#111111] text-[13px] font-medium transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  )
}
