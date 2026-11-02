import React from 'react'

export const HowItWorks: React.FC = () => {
  return (
    <section id="mission" className="py-14 sm:py-16 bg-[#ecece9]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 text-left">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <h2 className="section-title text-[#111111] mb-4">
            Our mission and vision
          </h2>
          <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[65ch]">
            Established on 30 May 2025, United Youth Forum of Science and Research (UYFSR) creates opportunities for students and young minds to explore science, expand knowledge, and discover their potential.
          </p>
        </div>

        {/* Editorial Split: Photograph on Left, Mission & Vision on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Photograph with Contextual Caption */}
          <div data-reveal className="lg:col-span-5 space-y-3">
            <div className="relative overflow-hidden bg-[#111111] group shadow-sm rounded-xs border border-[#dcdcd8]">
              <img
                src="/images/uyfsr-council-session.jpg"
                alt="Students and young researchers collaborating on empirical exploration"
                loading="lazy"
                decoding="async"
                className="w-full h-80 sm:h-[480px] object-cover object-[center_32%] transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="text-[14px] text-[#2b2b28] leading-relaxed">
              Empowering young researchers to explore questions, test ideas, and learn through empirical practice.
            </div>
          </div>

          {/* Right Column: Mission and Vision Cards */}
          <div className="lg:col-span-7 space-y-10">
            {/* Mission */}
            <div data-reveal className="space-y-3">
              <div className="text-[15px] font-medium text-[#064e43]">
                Organizational purpose
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#111111]">
                Our Mission
              </h3>
              <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[60ch]">
                The mission of United Youth Forum of Science and Research (UYFSR) is to introduce and promote the culture of research among students and young individuals. We believe that research is not limited to scientists or higher-level academics; it is a field of exploration that everyone should have the opportunity to understand and experience.
              </p>
              <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[60ch]">
                Our aim is to inspire students to think beyond textbooks, ask questions, explore new ideas, and develop a deeper understanding of the world through scientific thinking and research. We strive to create opportunities for young minds to discover research, develop their interests, enhance their knowledge, and turn their curiosity into meaningful ideas through workshops, seminars, competitions, Olympiads, and various educational initiatives.
              </p>
            </div>

            {/* Vision */}
            <div data-reveal className="space-y-3 pt-6">
              <div className="text-[15px] font-medium text-[#064e43]">
                Long-term outlook
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#111111]">
                Our Vision
              </h3>
              <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[60ch]">
                Our vision is to build a generation that is curious, creative, knowledgeable, and passionate about research and scientific exploration. We aspire to make research more accessible and familiar to students and people from different backgrounds, encouraging them to explore new possibilities, challenge existing ideas, and contribute to the advancement of knowledge.
              </p>
              <p className="text-[16px] text-[#2b2b28] leading-relaxed max-w-[60ch]">
                Ultimately, we want to establish a strong research-oriented community where young minds are empowered to explore, innovate, share knowledge, and create a positive impact on society through science and research.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
