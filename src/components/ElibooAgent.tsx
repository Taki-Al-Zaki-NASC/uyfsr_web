import React, { useState, useEffect, useRef, useCallback } from 'react'
import { sounds } from '../lib/audio'
import { generateElibooResponse } from '../lib/elibooEngine'
import type { ConversationContext } from '../lib/elibooEngine'
import {
  Bot,
  X,
  Send,
  ArrowRight,
  RotateCcw,
  User,
  Sparkles,
  Globe2,
  Copy,
  Check
} from 'lucide-react'

export interface Message {
  id: string
  sender: 'user' | 'eliboo'
  text: string
  timestamp: string
  actionLink?: {
    label: string
    href: string
    view?: 'home' | 'register' | 'executive-login' | 'dashboard' | 'ambassador'
    anchor?: string
    leaderName?: string
  }
}

interface ElibooAgentProps {
  onNavigate?: (
    view: 'home' | 'register' | 'executive-login' | 'dashboard' | 'ambassador',
    anchor?: string
  ) => void
}

export const ElibooAgent: React.FC<ElibooAgentProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    historyCount: 0
  })

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const CAPABILITY_CHIPS = [
    { label: '🧠 Science Quiz', query: 'science quiz' },
    { label: '🪐 Space Fact', query: 'science fact' },
    { label: '💡 Project Ideas', query: 'science project ideas' },
    { label: '📐 Math Olympiad', query: 'math olympiad' },
    { label: '⚛️ Physics Olympiad', query: 'physics olympiad' },
    { label: '🔬 Research Guide', query: 'research methodology' },
    { label: '🎓 Scholarships', query: 'scholarship higher study' },
    { label: '⚡ Speed of Light', query: 'speed of light' }
  ]

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    '🧠 Science Quiz',
    '🪐 Space Fact',
    'Campus Ambassador ki free?',
    '💡 Project Ideas',
    '📐 Math Olympiad Guide'
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'eliboo',
      text:
        'Hello! I am **Eliboo**, your official UYFSR AI Science Assistant. 🤖✨\n\nI am equipped with massive STEM knowledge across astronomy, quantum physics, biology, and chemistry! Ask me anything in **English**, **বাংলা**, or **Banglish**:\n\n• 🧠 **Science Quizzes & Daily Facts**\n• 📐 **Math & Physics Olympiad Prep (BDMO, BdPhO, IJSO)**\n• 🔬 **How to Start Research & Write Papers**\n• 💡 **Innovative Science Fair Project Ideas**\n• 🎓 **Global STEM Scholarships & Profile Building**\n• ⚡ **Math & Scientific Formula Calculations**\n• 🚀 **100% Free Campus Ambassador Nominations & Registration**',
      timestamp: 'Just now'
    }
  ])

  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [messages, isOpen, isTyping, scrollToBottom])

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text) return

    sounds.playClick()

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Calculate natural human typing delay (350ms - 550ms)
    const typingDelay = Math.min(600, Math.max(350, text.length * 12))

    setTimeout(() => {
      const response = generateElibooResponse(text, conversationContext)

      // Update multi-turn memory
      setConversationContext((prev) => ({
        lastTopic: response.topic,
        preferredLanguage: response.detectedLanguage,
        historyCount: prev.historyCount + 1
      }))

      // Update dynamic suggestions
      if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
        setSuggestedQuestions(response.suggestedQuestions)
      }

      const elibooMsg: Message = {
        id: `eliboo-${Date.now()}`,
        sender: 'eliboo',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: response.actionLink
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, elibooMsg])
      sounds.playSuccess()
    }, typingDelay)
  }

  const handleActionClick = (actionLink: Message['actionLink']) => {
    if (!actionLink) return
    sounds.playClick()

    if (actionLink.leaderName) {
      try {
        sessionStorage.setItem('uyfsr_focus_leader', actionLink.leaderName)
      } catch {
        // ignore
      }
      window.dispatchEvent(
        new CustomEvent('uyfsr:focus-leader', {
          detail: { name: actionLink.leaderName }
        })
      )
    }

    if (actionLink.view && onNavigate) {
      onNavigate(actionLink.view, actionLink.anchor)
      setIsOpen(false)
      return
    }

    if (actionLink.href.startsWith('#')) {
      const targetId = actionLink.href.replace(/^#/, '')
      window.location.hash = targetId
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      setIsOpen(false)
    }
  }

  const handleReset = () => {
    sounds.playClick()
    setConversationContext({ historyCount: 0 })
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'eliboo',
        text:
          'Conversation reset! Ask me anything about UYFSR, STEM topics, quizzes or research in **English**, **বাংলা**, or **Banglish**! 🚀',
        timestamp: 'Just now'
      }
    ])
    setSuggestedQuestions([
      '🧠 Science Quiz',
      '🪐 Space Fact',
      'Campus Ambassador ki free?',
      '💡 Project Ideas',
      '📐 Math Olympiad Guide'
    ])
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    sounds.playClick()
    setTimeout(() => setCopiedId(null), 1500)
  }

  // Render markdown with bold & code support
  const renderMessageContent = (text: string, isUser: boolean) => {
    const lines = text.split('\n')
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, lIdx) => {
          if (!line.trim()) {
            return <div key={lIdx} className="h-1.5" />
          }

          // Split line by bold (**text**) and code (`text`)
          const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g)

          return (
            <p key={lIdx} className="text-[12.5px] sm:text-[13px] leading-relaxed">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong
                      key={pIdx}
                      className={`font-semibold ${isUser ? 'text-white font-bold' : 'text-[#111111]'}`}
                    >
                      {part.slice(2, -2)}
                    </strong>
                  )
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code
                      key={pIdx}
                      className={`font-mono text-[11px] px-1 py-0.5 rounded-xs ${
                        isUser
                          ? 'bg-white/20 text-white'
                          : 'bg-[#0c7866]/10 text-[#0c7866] font-medium'
                      }`}
                    >
                      {part.slice(1, -1)}
                    </code>
                  )
                }
                return part
              })}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING AGENT LAUNCHER BUTTON (Bottom Right Corner - Modern Mobile UX) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-4 sm:right-6 z-40 select-none">
        <button
          onClick={() => {
            sounds.playClick()
            setIsOpen(!isOpen)
          }}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 bg-[#111111] hover:bg-[#0c7866] text-white rounded-full shadow-2xl border border-[#333333] transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          {/* Avatar with pulsing online indicator */}
          <div className="relative w-7 h-7 rounded-full bg-[#0c7866] text-white flex items-center justify-center shrink-0 border border-[#34d399]/40 group-hover:bg-[#111111]">
            <Bot className="w-4 h-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#34d399] ring-2 ring-[#111111]" />
          </div>

          <div className="text-left hidden sm:block pr-1">
            <div className="text-[12.5px] font-bold leading-tight flex items-center gap-1.5">
              <span>Eliboo</span>
              <span className="text-[9px] font-mono font-medium text-[#34d399] bg-[#0c7866]/30 px-1 py-0.2 rounded-xs">
                AI
              </span>
            </div>
            <div className="text-[10px] text-white/70 leading-tight">Ask in বাংলা / Eng</div>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. ELIBOO EXPANDED CHAT DRAWER / WINDOW                                  */}
      {/* ========================================================================= */}
      {isOpen && (
        <>
          {/* Mobile backdrop to dismiss drawer on outside tap */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/25 sm:hidden transition-opacity backdrop-blur-2xs"
            aria-hidden="true"
          />
          <div className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:inset-x-auto sm:bottom-20 sm:right-6 w-auto sm:w-[420px] max-w-[440px] max-h-[82dvh] sm:max-h-[600px] bg-[#f7f7f5] rounded-xl sm:rounded-lg border border-[#dcdcd8] shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#111111] text-white px-4 py-3 flex items-center justify-between border-b border-[#2b2b28]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0c7866] text-white flex items-center justify-center border border-[#34d399]/40 shadow-xs">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[14px] font-bold leading-tight flex items-center gap-1.5">
                  <span>Eliboo</span>
                  <span className="text-[9.5px] font-mono text-[#34d399] bg-[#0c7866]/40 px-1.5 py-0.2 rounded-xs">
                    UYFSR Agent
                  </span>
                </div>
                <div className="text-[10px] text-[#34d399] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  <span>Online · Multilingual Native NLP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset Conversation"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick()
                  setIsOpen(false)
                }}
                title="Close Eliboo"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Language Capabilities Pill */}
          <div className="px-3 py-1.5 bg-[#ecece9] border-b border-[#dcdcd8] flex items-center justify-between text-[10.5px] text-[#555550]">
            <div className="flex items-center gap-1.5 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-[#0c7866]" />
              <span>Type in বাংলা, Banglish, or English</span>
            </div>
            <div className="flex items-center gap-1 text-[#0c7866] font-mono text-[9.5px] bg-white px-1.5 py-0.5 rounded-xs border border-[#dcdcd8]">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Zero-API Native</span>
            </div>
          </div>

          {/* Dynamic Follow-up Suggestions Chips */}
          <div className="p-2.5 bg-[#f4f4f1] border-b border-[#dcdcd8] flex items-center gap-1.5 overflow-x-auto theme-scrollbar pb-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-white hover:bg-[#111111] hover:text-white text-[#2b2b28] text-[11px] font-medium rounded-full border border-[#dcdcd8] whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="p-3 sm:p-4 space-y-3.5 overflow-y-auto flex-1 min-h-[160px] max-h-[46dvh] sm:max-h-[380px] text-left text-[13px] bg-[#f7f7f5] theme-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 animate-message-pop ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'eliboo' && (
                  <div className="w-6 h-6 rounded-full bg-[#0c7866] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-md p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111] border border-[#dcdcd8] shadow-2xs'
                  }`}
                >
                  {renderMessageContent(msg.text, msg.sender === 'user')}

                  {/* Connected Action Link Button */}
                  {msg.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-[#e5e5e0]">
                      <button
                        onClick={() => handleActionClick(msg.actionLink)}
                        className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#0c7866] hover:text-[#095f51] hover:underline cursor-pointer"
                      >
                        <span>{msg.actionLink.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[9.5px] mt-1.5 flex items-center justify-between gap-2 ${
                      msg.sender === 'user' ? 'text-white/60 justify-end' : 'text-[#666660]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'eliboo' && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy answer"
                        className="p-1 hover:text-[#0c7866] hover:bg-[#f0f0ed] rounded-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#0c7866]" />
                            <span className="text-[9px] text-[#0c7866] font-medium">Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3 h-3 text-[#888880] hover:text-[#0c7866]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator with animated bouncing dots */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#0c7866] text-[12px] bg-white px-3 py-2 rounded-md border border-[#dcdcd8] w-fit shadow-2xs">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span className="font-medium">Eliboo is thinking</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#0c7866] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 rounded-full bg-[#0c7866] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-[#0c7866] animate-bounce" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Interactive Capability Chips */}
          <div className="px-2.5 py-1.5 bg-[#f0f0ed] border-t border-[#dcdcd8] flex items-center gap-1.5 overflow-x-auto theme-scrollbar">
            {CAPABILITY_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="px-2.5 py-1 bg-white hover:bg-[#0c7866] hover:text-white text-[#2b2b28] text-[10.5px] font-medium rounded-full border border-[#dcdcd8] whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-2.5 bg-white border-t border-[#dcdcd8] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Eliboo anything in বাংলা, Banglish, English..."
              className="flex-1 bg-[#f7f7f5] border border-[#dcdcd8] focus:border-[#0c7866] px-3 py-2 rounded-xs text-[12.5px] text-[#111111] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-[#0c7866] hover:bg-[#095f51] disabled:opacity-40 text-white rounded-xs transition-colors cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        </>
      )}
    </>
  )
}
