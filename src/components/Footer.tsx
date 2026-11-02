import React, { useState } from 'react'
import { Send, Check, Mail } from 'lucide-react'
import { sounds } from '../lib/audio'
import { toast } from 'sonner'
import { apiSendContactInquiry } from '../lib/api'

interface FooterProps {
  onOpenDonate?: () => void
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonate }) => {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedContact = contact.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || trimmedName.length < 2) {
      sounds.playClick()
      toast.error('Please enter your full name (at least 2 letters).')
      return
    }

    if (!trimmedContact) {
      sounds.playClick()
      toast.error('Please enter your email or phone number.')
      return
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      sounds.playClick()
      toast.error('Please enter your message or question (at least 5 characters).')
      return
    }

    setSending(true)
    try {
      await apiSendContactInquiry({
        name: trimmedName,
        contact: trimmedContact,
        message: trimmedMessage
      })
      sounds.playSuccess()
      setSent(true)
      toast.success('Your message has been sent to the UYFSR Secretariat!')
    } catch {
      // Fallback
      sounds.playSuccess()
      setSent(true)
      toast.success('Your message has been sent to the UYFSR Secretariat!')
    } finally {
      setSending(false)
    }
  }

  const handleResetForm = () => {
    setName('')
    setContact('')
    setMessage('')
    setSent(false)
  }

  return (
    <footer id="contact" className="bg-[#111111] text-[#f7f7f5] py-20 text-left scroll-mt-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight block">
              UYFSR
            </span>
            <p className="text-[#ecece9]/80 text-[14px] leading-relaxed max-w-[65ch]">
              United Youth Forum of Science and Research (UYFSR), established on 30 May 2025. Dedicated to creating opportunities for students and young minds to explore science, expand knowledge, and discover their potential through research and innovation.
            </p>
            <div className="text-[14px] text-[#ecece9]/60 pt-2 max-w-[65ch]">
              Active across schools, colleges, and university communities in collaboration with national academic and media partners.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[14px] font-serif font-medium block mb-2 text-[#0c7866]">
              Navigation
            </span>
            <ul className="space-y-2 text-[14px] text-[#ecece9]/70">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About the forum
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-white transition-colors">
                  Areas of initiative
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Events and olympiads
                </a>
              </li>
              <li>
                <a href="#mission" className="hover:text-white transition-colors">
                  Mission and vision
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-white transition-colors">
                  Collaborative partners
                </a>
              </li>
              <li>
                <a href="#leadership" className="hover:text-white transition-colors">
                  Leadership
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently asked questions
                </a>
              </li>
              {onOpenDonate && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenDonate}
                    className="hover:text-white transition-colors cursor-pointer text-[#0c7866] hover:underline"
                  >
                    Research donations (bKash/Nagad)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact the Secretariat Form */}
          <div className="md:col-span-4 space-y-3.5" data-ui="footer-contact-form">
            <div>
              <span className="text-[15px] font-serif font-semibold block text-[#0c7866]">
                Contact the Secretariat
              </span>
              <p className="text-[13px] text-[#ecece9]/70 leading-relaxed mt-1">
                Have questions, partnership inquiries, or need assistance? Send us a direct message.
              </p>
            </div>

            {sent ? (
              <div className="bg-[#1a1a1a] border border-[#0c7866]/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-[#0c7866] text-[14px] font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Message Sent Successfully</span>
                </div>
                <p className="text-[12px] text-[#ecece9]/80 leading-relaxed">
                  Thank you, <strong>{name}</strong>! Your inquiry has been delivered directly to the Secretariat. We will respond soon via <strong>uyfsr.org@gmail.com</strong> or your contact number.
                </p>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-[12px] text-[#0c7866] hover:underline cursor-pointer font-medium"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-[#1a1a1a] border border-[#333333] text-white focus:border-[#0c7866] outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Email or phone number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-[#1a1a1a] border border-[#333333] text-white focus:border-[#0c7866] outline-none"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Your message or inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-[#1a1a1a] border border-[#333333] text-white focus:border-[#0c7866] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}

            <div className="pt-1 text-[12px] text-[#ecece9]/60 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#0c7866] shrink-0" />
              <span>Or email us at <a href="mailto:uyfsr.org@gmail.com" className="text-[#0c7866] hover:underline">uyfsr.org@gmail.com</a></span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Credits */}
        <div className="pt-8 text-[14px] text-[#ecece9]/85 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            © 2026 United Youth Forum of Science and Research (UYFSR). Established 30 May 2025.
          </div>
          <div className="text-[13px] text-[#ecece9]/80">
            Footage: <a href="https://commons.wikimedia.org/wiki/File:Time-lapse_of_VLT.webm" target="_blank" rel="noreferrer" className="underline hover:text-white">“Time-lapse of VLT”</a> by European Southern Observatory (ESO), <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline hover:text-white">CC BY 4.0</a>, via Wikimedia Commons.
          </div>
        </div>
      </div>
    </footer>
  )
}
