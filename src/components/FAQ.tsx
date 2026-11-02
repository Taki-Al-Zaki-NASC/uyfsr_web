import React, { useState } from 'react'
import { sounds } from '../lib/audio'

interface FAQItem {
  q: string
  a: string
  category: 'About UYFSR' | 'Olympiads & Fairs' | 'Participation & Research'
}

const faqs: FAQItem[] = [
  {
    q: "What is the United Youth Forum of Science and Research (UYFSR)?",
    a: "United Youth Forum of Science and Research (UYFSR) is an educational and research-oriented organization established on 30 May 2025. Our mission is to promote science, research, innovation, and scientific awareness among young minds, turning curiosity into meaningful knowledge and impactful action.",
    category: "About UYFSR"
  },
  {
    q: "Who is eligible to participate in UYFSR programs and workshops?",
    a: "Our programs are open to school, college, and undergraduate students, as well as young independent researchers. We design our competitions, Olympiads, and seminars, including the National Science Eclipse and Junior Talent Awards, to welcome students at all stages of their academic journey.",
    category: "Participation & Research"
  },
  {
    q: "How does UYFSR make scientific research accessible to students?",
    a: "We believe research is not limited to senior institutional professors. We guide students to think beyond textbooks, formulate original questions, and learn practical methodology through hands-on seminars, peer collaboration, and project showcases.",
    category: "Participation & Research"
  },
  {
    q: "What are the flagship upcoming events scheduled for 2026?",
    a: "Key upcoming events include the National Science Eclipse 2026 (16–18 April 2026), KIDLON Presents Junior Talent Award: Season 1 (18 July 2026), and the Junior Startup Challenge: Season 1 (3 September 2026).",
    category: "Olympiads & Fairs"
  },
  {
    q: "How can institutions and youth clubs partner with UYFSR?",
    a: "We actively collaborate with educational institutions, campus media clubs, and partner organizations as co-organizers, workshop partners, and venue hosts, working alongside partners like TWIMBOL, KIDLON, MEJOLOGY, and Adamjee School Communication Club.",
    category: "About UYFSR"
  }
]

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [selectedCat, setSelectedCat] = useState<string>('All')

  const categories = ['All', 'About UYFSR', 'Olympiads & Fairs', 'Participation & Research']

  const toggle = (idx: number) => {
    sounds.playClick()
    setOpenIdx(openIdx === idx ? null : idx)
  }

  const filteredFaqs = faqs.filter(
    (f) => selectedCat === 'All' || f.category === selectedCat
  )

  return (
    <section id="faq" className="py-14 sm:py-16 bg-[#f7f7f5]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-left">
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="section-title text-[#111111] mb-4">
            Frequently asked questions
          </h2>
          <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[65ch]">
            Answers to common questions regarding our organization, student participation, and partnership collaborations.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat)
                setOpenIdx(0)
              }}
              className={`px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#ecece9] text-[#2b2b28] hover:text-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Q&A Sequence (Smooth Dynamic Accordion) */}
        <div className="space-y-6">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                data-reveal
                className="border-b border-[#e5e5e0] pb-6 cursor-pointer group"
                onClick={() => toggle(idx)}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#111111] group-hover:text-[#0c7866] transition-colors">
                    {faq.q}
                  </h3>
                  <span
                    className={`text-2xl font-light text-[#0c7866] select-none shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[65ch] pt-2.5">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
