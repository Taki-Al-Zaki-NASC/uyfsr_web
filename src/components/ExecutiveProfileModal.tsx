import React, { useState } from 'react'
import { X, Upload, Save, User, Calendar, Phone, Mail, Building2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { sounds } from '../lib/audio'
import { apiUpdateMyProfile, type ExecutiveProfileData } from '../lib/api'
import { compressImageFile } from '../lib/imageUtils'

interface ExecutiveProfileModalProps {
  officerName: string
  initialProfile: {
    name: string
    email: string
    phone: string
    dob?: string
    department: string
    bio?: string
    image: string
    facebookUrl?: string
  }
  onClose: () => void
  onSaved: (updated: ExecutiveProfileData) => void
}

export const ExecutiveProfileModal: React.FC<ExecutiveProfileModalProps> = ({
  officerName,
  initialProfile,
  onClose,
  onSaved
}) => {
  const [name, setName] = useState(initialProfile.name)
  const [dob, setDob] = useState(initialProfile.dob || '')
  const [email, setEmail] = useState(initialProfile.email)
  const [phone, setPhone] = useState(initialProfile.phone)
  const [department, setDepartment] = useState(initialProfile.department)
  const [bio, setBio] = useState(initialProfile.bio || '')
  const [facebookUrl, setFacebookUrl] = useState(initialProfile.facebookUrl || '')
  const [photo, setPhoto] = useState(initialProfile.image)
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImageFile(file, { maxWidth: 420, maxHeight: 420, quality: 0.85 })
      setPhoto(compressed)
      sounds.playClick()
      toast.success('Photo ready — click Save Changes to update your profile.')
    } catch (err: any) {
      toast.error(err.message || 'Could not read image.')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      toast.error('Full name must be at least 2 characters.')
      return
    }
    if (newPassword && newPassword.trim().length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }

    setSaving(true)
    sounds.playClick()
    try {
      const res = await apiUpdateMyProfile(
        {
          name: name.trim(),
          dob: dob.trim(),
          email: email.trim(),
          phone: phone.trim(),
          department: department.trim(),
          bio: bio.trim(),
          photo,
          facebookUrl: facebookUrl.trim(),
          newPassword: newPassword.trim() || undefined
        },
        officerName
      )
      sounds.playSuccess()
      toast.success('Your profile has been updated!')
      onSaved(res.officer)
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#dcdcd8] w-full max-w-xl shadow-xl my-8 text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ecece9] bg-[#f7f7f5]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#111111]">Edit My Executive Profile</h2>
            <p className="text-[12px] text-[#2b2b28]/70 mt-0.5">
              Update your personal info, Date of Birth, photo, or passkey directly — saved immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#2b2b28] hover:text-[#111111] hover:bg-[#ecece9] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Photo Row */}
          <div className="flex items-center gap-4 p-3.5 bg-[#f7f7f5] border border-[#ecece9]">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#dcdcd8] bg-white shrink-0">
              <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#111111]">Profile Portrait</div>
              <p className="text-[11.5px] text-[#2b2b28]/70 mb-2">Displayed on your E-Card, Navbar & Directory.</p>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#ecece9] border border-[#dcdcd8] text-[12px] font-medium text-[#111111] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#0c7866]" />
                <span>Upload New Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Department</label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Facebook Profile URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/username"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">Executive Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-[#ecece9]">
              <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                Change Passkey / Password (Leave blank to keep current)
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2b28]/60" />
                <input
                  type="password"
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[13.5px] bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ecece9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-[#2b2b28] hover:text-[#111111] bg-[#ecece9] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-[13px] font-medium text-white bg-[#0c7866] hover:bg-[#095f51] transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5"
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save My Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
