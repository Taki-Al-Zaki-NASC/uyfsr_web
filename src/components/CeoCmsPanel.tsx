import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Plus,
  Trash2,
  Save,
  Upload,
  CheckCircle2,
  XCircle,
  Globe,
  Users,
  FileText,
  HelpCircle,
  Handshake,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  RefreshCw,
  Sliders,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { toast } from 'sonner'
import { sounds } from '../lib/audio'
import {
  apiGetSiteContent,
  apiUpdateSiteContent,
  apiGetPendingExecutives,
  apiApproveExecutive,
  apiRejectExecutive,
  apiGetCouncilRoster,
  apiUpdateExecutiveStatus,
  apiGetInquiries,
  apiDeleteMessage,
  type InquiryItem,
  type SiteContentData,
  type SiteEventItem,
  type SitePartnerItem,
  type SiteFaqItem,
  type ExecutiveProfileData,
  type SiteTrackConfig
} from '../lib/api'
import { compressImageFile } from '../lib/imageUtils'

interface CeoCmsPanelProps {
  officerName: string
  onSiteContentUpdated?: (content: SiteContentData, news?: any[]) => void
  onExecutiveApproved?: () => void
}

export const CeoCmsPanel: React.FC<CeoCmsPanelProps> = ({
  officerName,
  onSiteContentUpdated,
  onExecutiveApproved
}) => {
  const [subTab, setSubTab] = useState<'approvals' | 'roster' | 'inquiries' | 'tracks' | 'events' | 'partners' | 'hero' | 'faqs'>('approvals')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Pending executive approvals
  const [pendingExecs, setPendingExecs] = useState<ExecutiveProfileData[]>([])
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])
  const [actionId, setActionId] = useState<string | null>(null)

  // Council roster & governance access
  const [councilRoster, setCouncilRoster] = useState<ExecutiveProfileData[]>([])
  const [rosterSearch, setRosterSearch] = useState('')
  const [rosterFilter, setRosterFilter] = useState<'all' | 'active' | 'deactivated'>('all')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Editable site content
  const [content, setContent] = useState<SiteContentData | null>(null)
  const [newsList, setNewsList] = useState<any[]>([])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [siteRes, pending, roster] = await Promise.all([
        apiGetSiteContent(),
        apiGetPendingExecutives(officerName).catch(() => [] as ExecutiveProfileData[]),
        apiGetCouncilRoster(officerName).catch(() => [] as ExecutiveProfileData[])
      ])
      setContent(siteRes.siteContent)
      setNewsList(siteRes.news || [])
      setPendingExecs(pending)
      setCouncilRoster(roster)
      setInquiries(await apiGetInquiries(officerName).catch(() => [] as InquiryItem[]))
    } catch (err: any) {
      toast.error(err.message || 'Failed to load CMS data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [officerName])

  // CEO Toggle Executive Account Status (Active / Deactivated)
  const handleToggleExecutiveStatus = async (exec: ExecutiveProfileData, targetStatus: 'active' | 'deactivated') => {
    if (exec.isCEO) {
      toast.error('Chief Executive Officer account cannot be deactivated.')
      return
    }
    if (targetStatus === 'deactivated') {
      const confirmed = window.confirm(
        `Are you sure you want to DEACTIVATE ${exec.name}? They will immediately lose access to the Executive Workspace and cannot log in until reactivated.`
      )
      if (!confirmed) return
    }

    setTogglingId(exec.id)
    sounds.playClick()
    try {
      const res = await apiUpdateExecutiveStatus(exec.id, targetStatus, officerName)
      sounds.playSuccess()
      toast.success(res.message || `${exec.name} status updated to ${targetStatus}.`)
      setCouncilRoster((prev) =>
        prev.map((item) => (item.id === exec.id ? { ...item, status: targetStatus } : item))
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to update executive status.')
    } finally {
      setTogglingId(null)
    }
  }

  // CEO Approve / Reject Pending Executive
  const handleApproveExec = async (exec: ExecutiveProfileData) => {
    setActionId(exec.id)
    sounds.playClick()
    try {
      const res = await apiApproveExecutive(exec.id, { title: exec.title, rankTier: exec.rankTier }, officerName)
      sounds.playSuccess()
      toast.success(res.message || `${exec.name} approved! Confirmation email sent.`)
      setPendingExecs((prev) => prev.filter((p) => p.id !== exec.id))
      if (res.executive) {
        setCouncilRoster((prev) => [res.executive, ...prev.filter(e => e.id !== exec.id)])
      }
      onExecutiveApproved?.()
    } catch (err: any) {
      toast.error(err.message || 'Approval failed.')
    } finally {
      setActionId(null)
    }
  }

  const handleRejectExec = async (exec: ExecutiveProfileData) => {
    setActionId(exec.id)
    sounds.playClick()
    try {
      const res = await apiRejectExecutive(exec.id, officerName)
      toast.success(res.message || `${exec.name} declined.`)
      setPendingExecs((prev) => prev.filter((p) => p.id !== exec.id))
    } catch (err: any) {
      toast.error(err.message || 'Rejection failed.')
    } finally {
      setActionId(null)
    }
  }

  // Publish Site Content to Backend
  
  const updateTrack = (id: string, patch: Partial<SiteTrackConfig>) => {
    if (!content) return
    const currentTracks = content.tracks || []
    setContent({
      ...content,
      tracks: currentTracks.map((t) => (t.id === id ? { ...t, ...patch } : t))
    })
  }

  const handlePublish = async () => {
    if (!content) return
    setSaving(true)
    sounds.playClick()
    try {
      const res = await apiUpdateSiteContent({ ...content, news: newsList }, officerName)
      sounds.playSuccess()
      setContent(res.siteContent)
      setNewsList(res.news || newsList)
      onSiteContentUpdated?.(res.siteContent, res.news)
      toast.success('All website changes published live by CEO!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish changes.')
    } finally {
      setSaving(false)
    }
  }

  // Event Helpers
  const addEvent = () => {
    if (!content) return
    sounds.playClick()
    const newEv: SiteEventItem = {
      id: `event-${Date.now()}`,
      title: 'New UYFSR National Program',
      dateDisplay: { days: '10–12', monthYear: 'December 2026', duration: '3-Day Event' },
      category: 'Science Fair & Olympiad',
      uyfsrRole: 'Lead Organizer',
      organizer: 'United Youth Forum of Science and Research (UYFSR)',
      detailsNote: 'Official UYFSR Program',
      description: 'Describe the program scope, categories, and eligibility for students.',
      status: 'Upcoming 2026'
    }
    setContent({ ...content, events: [newEv, ...content.events] })
    toast.info('New event added — edit details and click Save & Publish.')
  }

  const updateEvent = (id: string, patch: Partial<SiteEventItem>) => {
    if (!content) return
    setContent({
      ...content,
      events: content.events.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev))
    })
  }

  const deleteEvent = (id: string) => {
    if (!content) return
    sounds.playClick()
    setContent({ ...content, events: content.events.filter((ev) => ev.id !== id) })
  }

  // Partner Helpers
  const addPartner = () => {
    if (!content) return
    sounds.playClick()
    const newPartner: SitePartnerItem = {
      id: `partner-${Date.now()}`,
      name: 'New Partner Organization',
      role: 'Strategic Partner',
      description: 'Collaborative partner supporting UYFSR youth science and research initiatives.',
      logo: '/images/partners/twimbol.png',
      category: 'Strategic Alliances'
    }
    setContent({ ...content, partners: [newPartner, ...content.partners] })
    toast.info('New partner card created — upload their logo and click Save & Publish.')
  }

  const updatePartner = (id: string, patch: Partial<SitePartnerItem>) => {
    if (!content) return
    setContent({
      ...content,
      partners: content.partners.map((p) => (p.id === id ? { ...p, ...patch } : p))
    })
  }

  const deletePartner = (id: string) => {
    if (!content) return
    sounds.playClick()
    setContent({ ...content, partners: content.partners.filter((p) => p.id !== id) })
  }

  const handlePartnerLogoUpload = async (partnerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImageFile(file, {
        maxWidth: 360,
        maxHeight: 160,
        quality: 0.9,
        preserveTransparency: true
      })
      updatePartner(partnerId, { logo: compressed })
      sounds.playClick()
      toast.success('Partner logo uploaded! Click Save & Publish to make it live.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload partner logo.')
    }
  }

  // FAQ Helpers
  const addFaq = () => {
    if (!content) return
    sounds.playClick()
    const newFaq: SiteFaqItem = {
      id: `faq-${Date.now()}`,
      q: 'New Frequently Asked Question?',
      a: 'Provide a clear, official institutional answer here.',
      category: 'About UYFSR'
    }
    setContent({ ...content, faqs: [...content.faqs, newFaq] })
  }

  const updateFaq = (id: string, patch: Partial<SiteFaqItem>) => {
    if (!content) return
    setContent({
      ...content,
      faqs: content.faqs.map((f) => (f.id === id ? { ...f, ...patch } : f))
    })
  }

  const deleteFaq = (id: string) => {
    if (!content) return
    sounds.playClick()
    setContent({ ...content, faqs: content.faqs.filter((f) => f.id !== id) })
  }

  if (loading) {
    return (
      <div className="p-10 bg-white border border-[#ecece9] text-center text-[13.5px] text-[#2b2b28]">
        Loading CEO Governance & Site Management Console...
      </div>
    )
  }

  const filteredRoster = councilRoster.filter((exec) => {
    const matchesFilter =
      rosterFilter === 'all'
        ? true
        : rosterFilter === 'deactivated'
        ? exec.status === 'deactivated'
        : exec.status !== 'deactivated'

    const q = rosterSearch.trim().toLowerCase()
    if (!q) return matchesFilter
    return (
      exec.name.toLowerCase().includes(q) ||
      (exec.title && exec.title.toLowerCase().includes(q)) ||
      (exec.department && exec.department.toLowerCase().includes(q)) ||
      (exec.ecardId && exec.ecardId.toLowerCase().includes(q)) ||
      (exec.email && exec.email.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Publish Action */}
      <div className="bg-[#111111] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CEO Exclusive Authority · Live Website CMS</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold">
            Executive Approvals & Public Site Control
          </h2>
          <p className="text-[12.5px] text-white/75 mt-1">
            Review new executive registrations, manage upcoming/completed events, upload partner logos, and edit main page content.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadAll}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="px-5 py-2.5 bg-[#0c7866] hover:bg-[#0ea088] text-white text-[13px] font-semibold cursor-pointer inline-flex items-center gap-2 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish to Main Site'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#ecece9] pb-3">
        <button
          type="button"
          onClick={() => setSubTab('roster')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'roster'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Council Roster</span>
          <span className="ml-1 text-[11px] opacity-75 font-mono">({councilRoster.length})</span>
          {councilRoster.filter(e => e.status === 'deactivated').length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded-full">
              {councilRoster.filter(e => e.status === 'deactivated').length} deactivated
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab('approvals')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'approvals'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Executive Approvals</span>
          {pendingExecs.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
              {pendingExecs.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab('inquiries')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'inquiries'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Public Inquiries ({inquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('tracks')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'tracks'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tracks & Workshops (5)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('events')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'events'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Events & Calendar ({content?.events.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('partners')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'partners'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>Partners & Logos ({content?.partners.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('hero')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'hero'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Hero, Stats & Mission</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('faqs')}
          className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
            subTab === 'faqs'
              ? 'bg-[#111111] text-white'
              : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQs ({content?.faqs.length || 0})</span>
        </button>
      </div>

      {subTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#111111]">
                Public Inquiries ({inquiries.length})
              </h3>
              <p className="text-[12.5px] text-[#2b2b28]/70">
                Messages sent through "Contact the Secretariat" on the main site. Visible to the CEO only.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                sounds.playClick()
                try {
                  const list = await apiGetInquiries(officerName)
                  setInquiries(list)
                  toast.success(`Inquiries refreshed: ${list.length} records active.`)
                } catch {
                  toast.error('Failed to reload inquiries.')
                }
              }}
              className="px-3.5 py-1.5 bg-[#ecece9] hover:bg-[#111111] hover:text-white text-[#111111] text-[12px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 w-fit"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Inbox</span>
            </button>
          </div>
          {inquiries.length === 0 ? (
            <div className="p-8 bg-white border border-[#ecece9] text-center text-[13px] text-[#2b2b28]/70">
              No public inquiries yet.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((q) => (
                <div key={q.id} className="bg-white border border-[#ecece9] p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-[13.5px] font-semibold text-[#111111] break-all">{q.senderName}</div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#2b2b28]/60">{q.timestamp}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await apiDeleteMessage(q.id, officerName)
                            setInquiries((prev) => prev.filter((i) => i.id !== q.id))
                          } catch (err: any) {
                            toast.error(err.message || 'Delete failed.')
                          }
                        }}
                        className="p-1 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#2b2b28] whitespace-pre-wrap">{q.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 1: PENDING EXECUTIVE ACCOUNT APPROVALS                    */}
      {/* ================================================================= */}
      {subTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#111111]">
                Pending Executive Registrations ({pendingExecs.length})
              </h3>
              <p className="text-[12.5px] text-[#2b2b28]/70">
                Newly registered executive candidate profiles awaiting CEO ratifications.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                sounds.playClick()
                try {
                  const list = await apiGetPendingExecutives(officerName)
                  setPendingExecs(list)
                  toast.success(`Registrations refreshed: ${list.length} pending candidate(s).`)
                } catch {
                  toast.error('Failed to reload pending registrations.')
                }
              }}
              className="px-3.5 py-1.5 bg-[#ecece9] hover:bg-[#111111] hover:text-white text-[#111111] text-[12px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 w-fit"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Candidates</span>
            </button>
          </div>

          {pendingExecs.length === 0 ? (
            <div className="p-8 bg-white border border-[#ecece9] text-center space-y-2">
              <Users className="w-8 h-8 text-[#0c7866]/50 mx-auto" />
              <div className="text-[14px] font-semibold text-[#111111]">No Pending Executive Applications</div>
              <p className="text-[12.5px] text-[#2b2b28]/70 max-w-md mx-auto">
                When a new executive registers from the Executive Login portal, their full profile (photo, DOB, phone, email) will appear here for your review and approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingExecs.map((exec) => (
                <div
                  key={exec.id}
                  className="bg-white border border-[#dcdcd8] p-5 space-y-4 shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#dcdcd8] bg-[#f7f7f5] shrink-0 flex items-center justify-center">
                      {exec.photo ? (
                        <img src={exec.photo} alt={exec.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <Users className="w-7 h-7 text-[#2b2b28]/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif text-[17px] font-bold text-[#111111]">{exec.name}</h4>
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200">
                          Pending CEO Approval
                        </span>
                      </div>
                      <div className="text-[13px] font-semibold text-[#0c7866] mt-0.5">{exec.title}</div>
                      <div className="text-[12px] text-[#2b2b28]/80">
                        {exec.department} · {exec.rankTier}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] bg-[#f7f7f5] p-3 border border-[#ecece9]">
                    <div className="flex items-center gap-1.5 text-[#2b2b28]">
                      <Mail className="w-3.5 h-3.5 text-[#0c7866] shrink-0" />
                      <span className="truncate">{exec.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2b2b28]">
                      <Phone className="w-3.5 h-3.5 text-[#0c7866] shrink-0" />
                      <span>{exec.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2b2b28]">
                      <Calendar className="w-3.5 h-3.5 text-[#0c7866] shrink-0" />
                      <span>DOB: {exec.dob || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2b2b28]">
                      <FileText className="w-3.5 h-3.5 text-[#0c7866] shrink-0" />
                      <span>ID: {exec.ecardId}</span>
                    </div>
                  </div>

                  {exec.bio && (
                    <p className="text-[12.5px] text-[#2b2b28] leading-relaxed">{exec.bio}</p>
                  )}

                  <div className="flex items-center gap-2.5 pt-2 border-t border-[#ecece9]">
                    <button
                      type="button"
                      disabled={actionId === exec.id}
                      onClick={() => handleApproveExec(exec)}
                      className="flex-1 py-2.5 px-3 bg-[#0c7866] hover:bg-[#095f51] text-white text-[12.5px] font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Send Confirmation Email</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionId === exec.id}
                      onClick={() => handleRejectExec(exec)}
                      className="py-2.5 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[12.5px] font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB: COUNCIL ROSTER & ACCESS CONTROL (DEACTIVATE / REACTIVATE)*/}
      {/* ================================================================= */}
      {subTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#111111]">
                Council Roster & Executive Access Control ({councilRoster.length})
              </h3>
              <p className="text-[12.5px] text-[#2b2b28]/70">
                Manage appointed executive council members. Deactivating an officer immediately revokes their portal login privileges. You can reactivate them at any time.
              </p>
            </div>
            <button
              type="button"
              onClick={loadAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium border border-[#dcdcd8] bg-white text-[#2b2b28] hover:bg-[#ecece9] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Roster</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-[#dcdcd8] p-3.5">
              <span className="text-[11px] uppercase tracking-wider text-[#2b2b28]/60 font-medium">Total Council Members</span>
              <p className="font-serif text-2xl font-bold text-[#111111] mt-0.5">{councilRoster.length}</p>
            </div>
            <div className="bg-white border border-[#dcdcd8] p-3.5">
              <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium">Active · Login Permitted</span>
              <p className="font-serif text-2xl font-bold text-emerald-700 mt-0.5">
                {councilRoster.filter(e => e.status !== 'deactivated').length}
              </p>
            </div>
            <div className="bg-white border border-[#dcdcd8] p-3.5">
              <span className="text-[11px] uppercase tracking-wider text-rose-700 font-medium">Deactivated · Access Suspended</span>
              <p className="font-serif text-2xl font-bold text-rose-700 mt-0.5">
                {councilRoster.filter(e => e.status === 'deactivated').length}
              </p>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#dcdcd8] p-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, title, department, or E-Card ID..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full text-[13px] px-3 py-2 border border-[#dcdcd8] focus:border-[#111111] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setRosterFilter('all')}
                className={`px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                  rosterFilter === 'all'
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#f4f4f0] text-[#2b2b28] hover:bg-[#ecece9]'
                }`}
              >
                All ({councilRoster.length})
              </button>
              <button
                type="button"
                onClick={() => setRosterFilter('active')}
                className={`px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                  rosterFilter === 'active'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#f4f4f0] text-[#2b2b28] hover:bg-[#ecece9]'
                }`}
              >
                Active ({councilRoster.filter(e => e.status !== 'deactivated').length})
              </button>
              <button
                type="button"
                onClick={() => setRosterFilter('deactivated')}
                className={`px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                  rosterFilter === 'deactivated'
                    ? 'bg-rose-700 text-white'
                    : 'bg-[#f4f4f0] text-[#2b2b28] hover:bg-[#ecece9]'
                }`}
              >
                Deactivated ({councilRoster.filter(e => e.status === 'deactivated').length})
              </button>
            </div>
          </div>

          {/* Roster Cards List */}
          {filteredRoster.length === 0 ? (
            <div className="bg-white border border-[#dcdcd8] p-10 text-center space-y-2">
              <Users className="w-8 h-8 text-[#2b2b28]/40 mx-auto" />
              <h4 className="font-serif text-base font-semibold text-[#111111]">No matching council members</h4>
              <p className="text-[13px] text-[#2b2b28]/60">
                {rosterSearch
                  ? 'No council members match your search criteria.'
                  : 'No executives found in this filter category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoster.map((exec) => {
                const isDeactivated = exec.status === 'deactivated'
                const isBusy = togglingId === exec.id
                return (
                  <div
                    key={exec.id}
                    className={`bg-white border p-4 transition-shadow space-y-3 ${
                      isDeactivated
                        ? 'border-rose-300 bg-rose-50/20'
                        : exec.isCEO
                        ? 'border-amber-300/80 bg-amber-50/10'
                        : 'border-[#dcdcd8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {exec.photo ? (
                          <img
                            src={exec.photo}
                            alt={exec.name}
                            className="w-12 h-12 object-cover rounded-full border border-[#dcdcd8] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-base shrink-0">
                            {exec.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif text-[15px] font-semibold text-[#111111] truncate">{exec.name}</h4>
                            {exec.isCEO && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 border border-amber-300">
                                CEO
                              </span>
                            )}
                          </div>
                          <p className="text-[12.5px] font-medium text-[#2b2b28]/80 truncate">{exec.title}</p>
                          <p className="text-[11.5px] text-[#2b2b28]/60 truncate">{exec.department}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        {exec.isCEO ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>CEO Protected</span>
                          </span>
                        ) : isDeactivated ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Access Suspended</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Login Permitted</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11.5px] text-[#2b2b28]/70 pt-2 border-t border-[#ecece9]">
                      <div>
                        <span className="text-[#2b2b28]/40 block text-[10px] uppercase">E-Card ID</span>
                        <span className="font-mono font-medium text-[#111111]">{exec.ecardId || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[#2b2b28]/40 block text-[10px] uppercase">Rank Tier</span>
                        <span className="font-medium text-[#111111]">{exec.rankTier}</span>
                      </div>
                      {exec.email && (
                        <div className="col-span-2 truncate">
                          <span className="text-[#2b2b28]/40 block text-[10px] uppercase">Official Email</span>
                          <span className="font-mono text-[#111111]">{exec.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Governance Action Row */}
                    <div className="pt-2 border-t border-[#ecece9] flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#2b2b28]/50 truncate">
                        {isDeactivated
                          ? 'Account deactivated · Access suspended'
                          : exec.isCEO
                          ? 'Protected executive authority'
                          : 'Full access to executive workspace'}
                      </span>

                      {exec.isCEO ? (
                        <span className="text-[11px] italic text-[#2b2b28]/40 shrink-0">Permanent Access</span>
                      ) : isDeactivated ? (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleExecutiveStatus(exec, 'active')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isBusy ? 'Reactivating...' : 'Reactivate Access'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleExecutiveStatus(exec, 'deactivated')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isBusy ? 'Deactivating...' : 'Deactivate Access'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

            {/* ================================================================= */}
      {/* SUB-TAB: TRACKS & WORKSHOPS FEATURE CONTROL (CEO ON/OFF TOGGLE)   */}
      {/* ================================================================= */}
      {subTab === 'tracks' && content && (
        <div className="space-y-5">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#111111]">
              Core Tracks & Practical Workshop Controls (5)
            </h3>
            <p className="text-[12.5px] text-[#2b2b28]/70">
              Toggle track registration ON or OFF. When OFF, visitors clicking the track see an official notice that no upcoming sessions are scheduled.
            </p>
          </div>

          <div className="space-y-4">
            {(content.tracks || []).map((t) => (
              <div
                key={t.id}
                className={`bg-white border p-5 transition-all space-y-4 ${
                  t.isOpen ? 'border-[#0c7866]/40 shadow-xs' : 'border-[#dcdcd8] opacity-90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ecece9] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#111111] text-white">
                      Track {t.num}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#111111]">{t.title}</h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick()
                      updateTrack(t.id, { isOpen: !t.isOpen })
                    }}
                    className={`px-3 py-1.5 text-xs font-bold cursor-pointer inline-flex items-center gap-2 rounded-full transition-colors ${
                      t.isOpen
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    {t.isOpen ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                        <span>ACTIVE · Registration Open</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-amber-600" />
                        <span>CLOSED · No Upcoming Sessions</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2b2b28] mb-1">
                      Active Cohort / Session Title
                    </label>
                    <input
                      type="text"
                      value={t.sessionTitle || ''}
                      onChange={(e) => updateTrack(t.id, { sessionTitle: e.target.value })}
                      placeholder="e.g. Hands-on Laboratory Methodology Clinic"
                      className="w-full px-3 py-2 text-xs bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2b2b28] mb-1">
                      Enrolment Fee Badge
                    </label>
                    <input
                      type="text"
                      value={t.fee || ''}
                      onChange={(e) => updateTrack(t.id, { fee: e.target.value })}
                      placeholder="e.g. ৳250 BDT or 100% Free"
                      className="w-full px-3 py-2 text-xs bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#0c7866] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2b2b28] mb-1">
                    Notice Details (Displayed to applicants on modal)
                  </label>
                  <textarea
                    rows={2}
                    value={t.notice || ''}
                    onChange={(e) => updateTrack(t.id, { notice: e.target.value })}
                    placeholder="Notice shown to applicants regarding schedule, eligibility, or why registration is currently closed..."
                    className="w-full px-3 py-2 text-xs bg-[#f7f7f5] border border-[#dcdcd8] text-[#111111] focus:border-[#0c7866] outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 2: EVENTS & CALENDAR MANAGER                              */}
      {/* ================================================================= */}
      {subTab === 'events' && content && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#111111]">
                Events, Olympiads & Program Calendar
              </h3>
              <p className="text-[12.5px] text-[#2b2b28]/75">
                Set which events are Upcoming, Ongoing, Scheduled, or Completed — or create brand new events.
              </p>
            </div>
            <button
              type="button"
              onClick={addEvent}
              className="px-4 py-2 bg-[#111111] hover:bg-[#0c7866] text-white text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {content.events.map((ev) => (
              <div key={ev.id} className="bg-white border border-[#dcdcd8] p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-3 border-b border-[#ecece9] pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wide ${
                        ev.status === 'Upcoming 2026' || ev.status === 'Ongoing'
                          ? 'bg-emerald-50 text-[#0c7866] border border-[#0c7866]/30'
                          : ev.status === 'Completed'
                          ? 'bg-stone-100 text-stone-600 border border-stone-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ev.status}
                    </span>
                    <span className="font-serif text-[16px] font-bold text-[#111111]">{ev.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEvent(ev.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Event Name</label>
                    <input
                      type="text"
                      value={ev.title}
                      onChange={(e) => updateEvent(ev.id, { title: e.target.value })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Event Status</label>
                    <select
                      value={ev.status}
                      onChange={(e) => updateEvent(ev.id, { status: e.target.value as SiteEventItem['status'] })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    >
                      <option value="Upcoming 2026">Upcoming 2026</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Category</label>
                    <input
                      type="text"
                      value={ev.category}
                      onChange={(e) => updateEvent(ev.id, { category: e.target.value })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Days (e.g. 16–18)</label>
                    <input
                      type="text"
                      value={ev.dateDisplay.days}
                      onChange={(e) =>
                        updateEvent(ev.id, { dateDisplay: { ...ev.dateDisplay, days: e.target.value } })
                      }
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">
                      Month & Year (e.g. April 2026)
                    </label>
                    <input
                      type="text"
                      value={ev.dateDisplay.monthYear}
                      onChange={(e) =>
                        updateEvent(ev.id, { dateDisplay: { ...ev.dateDisplay, monthYear: e.target.value } })
                      }
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Duration</label>
                    <input
                      type="text"
                      value={ev.dateDisplay.duration}
                      onChange={(e) =>
                        updateEvent(ev.id, { dateDisplay: { ...ev.dateDisplay, duration: e.target.value } })
                      }
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">UYFSR Role</label>
                    <input
                      type="text"
                      value={ev.uyfsrRole}
                      onChange={(e) => updateEvent(ev.id, { uyfsrRole: e.target.value })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Organizer</label>
                    <input
                      type="text"
                      value={ev.organizer}
                      onChange={(e) => updateEvent(ev.id, { organizer: e.target.value })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Details Note</label>
                    <input
                      type="text"
                      value={ev.detailsNote}
                      onChange={(e) => updateEvent(ev.id, { detailsNote: e.target.value })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block text-[11.5px] font-semibold text-[#2b2b28] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={ev.description}
                      onChange={(e) => updateEvent(ev.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 3: PARTNERS & COLLABORATORS LOGOS MANAGER                 */}
      {/* ================================================================= */}
      {subTab === 'partners' && content && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#111111]">
                Partners & Collaborators Logos
              </h3>
              <p className="text-[12.5px] text-[#2b2b28]/75">
                Upload official PNG/JPG/SVG logos for each partner or add new institutional partners.
              </p>
            </div>
            <button
              type="button"
              onClick={addPartner}
              className="px-4 py-2 bg-[#111111] hover:bg-[#0c7866] text-white text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.partners.map((partner) => (
              <div key={partner.id} className="bg-white border border-[#dcdcd8] p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-28 bg-[#f7f7f5] border border-[#ecece9] px-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-10 max-w-full object-contain"
                      />
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f7f5] hover:bg-[#ecece9] border border-[#dcdcd8] text-[12px] font-medium text-[#111111] cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#0c7866]" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePartnerLogoUpload(partner.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePartner(partner.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete partner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2b2b28] mb-0.5">Partner Name</label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => updatePartner(partner.id, { name: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-[12.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2b2b28] mb-0.5">Category</label>
                    <select
                      value={partner.category}
                      onChange={(e) =>
                        updatePartner(partner.id, { category: e.target.value as SitePartnerItem['category'] })
                      }
                      className="w-full px-2.5 py-1.5 text-[12.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    >
                      <option value="Strategic Alliances">Strategic Alliances</option>
                      <option value="Media Consortium">Media Consortium</option>
                      <option value="Club & Campus Partners">Club & Campus Partners</option>
                      <option value="Community & Affiliates">Community & Affiliates</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#2b2b28] mb-0.5">Partner Role</label>
                    <input
                      type="text"
                      value={partner.role}
                      onChange={(e) => updatePartner(partner.id, { role: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-[12.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#2b2b28] mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={partner.description}
                      onChange={(e) => updatePartner(partner.id, { description: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-[12.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 4: HERO, STATS & MISSION / VISION                         */}
      {/* ================================================================= */}
      {subTab === 'hero' && content && (
        <div className="space-y-6">
          <div className="bg-white border border-[#dcdcd8] p-5 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#111111]">Hero Section & Key Statistics</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#2b2b28] mb-1">Main Headline</label>
                <input
                  type="text"
                  value={content.hero.headline}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
                  className="w-full px-3 py-2 text-[14px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#2b2b28] mb-1">Manifesto / Lead Paragraph</label>
                <textarea
                  rows={3}
                  value={content.hero.leadText}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, leadText: e.target.value } })}
                  className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#f7f7f5] border border-[#ecece9] space-y-2">
                  <div className="text-[11px] font-bold text-[#0c7866] uppercase">Stat 1 · Foundation</div>
                  <input
                    type="text"
                    value={content.hero.foundationDate}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, foundationDate: e.target.value } })
                    }
                    className="w-full px-2.5 py-1 text-[13px] bg-white border border-[#dcdcd8]"
                  />
                  <input
                    type="text"
                    value={content.hero.foundationLabel}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, foundationLabel: e.target.value } })
                    }
                    className="w-full px-2.5 py-1 text-[12px] bg-white border border-[#dcdcd8]"
                  />
                </div>

                <div className="p-3 bg-[#f7f7f5] border border-[#ecece9] space-y-2">
                  <div className="text-[11px] font-bold text-[#0c7866] uppercase">Stat 2 · Students Guided</div>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      value={content.hero.studentsTarget}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, studentsTarget: parseFloat(e.target.value) || 0 }
                        })
                      }
                      className="w-20 px-2 py-1 text-[13px] bg-white border border-[#dcdcd8]"
                    />
                    <input
                      type="text"
                      value={content.hero.studentsSuffix}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, studentsSuffix: e.target.value } })
                      }
                      className="flex-1 px-2 py-1 text-[13px] bg-white border border-[#dcdcd8]"
                    />
                  </div>
                  <input
                    type="text"
                    value={content.hero.studentsLabel}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, studentsLabel: e.target.value } })
                    }
                    className="w-full px-2.5 py-1 text-[12px] bg-white border border-[#dcdcd8]"
                  />
                </div>

                <div className="p-3 bg-[#f7f7f5] border border-[#ecece9] space-y-2">
                  <div className="text-[11px] font-bold text-[#0c7866] uppercase">Stat 3 · Categories</div>
                  <input
                    type="number"
                    value={content.hero.categoriesTarget}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, categoriesTarget: parseInt(e.target.value, 10) || 0 }
                      })
                    }
                    className="w-full px-2.5 py-1 text-[13px] bg-white border border-[#dcdcd8]"
                  />
                  <input
                    type="text"
                    value={content.hero.categoriesLabel}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, categoriesLabel: e.target.value } })
                    }
                    className="w-full px-2.5 py-1 text-[12px] bg-white border border-[#dcdcd8]"
                  />
                </div>

                <div className="p-3 bg-[#f7f7f5] border border-[#ecece9] space-y-2">
                  <div className="text-[11px] font-bold text-[#0c7866] uppercase">Stat 4 · Alliances</div>
                  <input
                    type="number"
                    value={content.hero.alliancesTarget}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, alliancesTarget: parseInt(e.target.value, 10) || 0 }
                      })
                    }
                    className="w-full px-2.5 py-1 text-[13px] bg-white border border-[#dcdcd8]"
                  />
                  <input
                    type="text"
                    value={content.hero.alliancesLabel}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, alliancesLabel: e.target.value } })
                    }
                    className="w-full px-2.5 py-1 text-[12px] bg-white border border-[#dcdcd8]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#dcdcd8] p-5 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#111111]">Mission & Vision Statements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#2b2b28] mb-1">Mission Statement</label>
                <textarea
                  rows={5}
                  value={content.missionVision.missionText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      missionVision: { ...content.missionVision, missionText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#2b2b28] mb-1">Vision Statement</label>
                <textarea
                  rows={5}
                  value={content.missionVision.visionText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      missionVision: { ...content.missionVision, visionText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 5: FAQs MANAGER                                           */}
      {/* ================================================================= */}
      {subTab === 'faqs' && content && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[#111111]">Frequently Asked Questions</h3>
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 bg-[#111111] hover:bg-[#0c7866] text-white text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {content.faqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-[#dcdcd8] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={faq.category}
                    onChange={(e) => updateFaq(faq.id, { category: e.target.value as SiteFaqItem['category'] })}
                    className="px-2.5 py-1 text-[12px] bg-[#f7f7f5] border border-[#dcdcd8]"
                  >
                    <option value="About UYFSR">About UYFSR</option>
                    <option value="Olympiads & Fairs">Olympiads & Fairs</option>
                    <option value="Participation & Research">Participation & Research</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteFaq(faq.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => updateFaq(faq.id, { q: e.target.value })}
                  className="w-full px-3 py-1.5 text-[13.5px] font-medium bg-[#f7f7f5] border border-[#dcdcd8]"
                />
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={(e) => updateFaq(faq.id, { a: e.target.value })}
                  className="w-full px-3 py-1.5 text-[13px] bg-[#f7f7f5] border border-[#dcdcd8] resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
