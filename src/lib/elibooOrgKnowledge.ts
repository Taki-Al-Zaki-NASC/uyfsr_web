// =============================================================================
// UYFSR MASTER ORGANIZATIONAL KNOWLEDGE BASE & ENCYCLOPEDIA (v3.0)
// Complete, Exhaustive Knowledge of Every Leader, Executive, Contact, Event,
// Partner, Activity, Registration Policy, bKash Gateway & Campus Ambassador Rule
// =============================================================================

export interface OrgKnowledgeItem {
  keys: string[]
  bn: string
  banglish: string
  en: string
  topic: string
  actionLink?: {
    label: string
    href: string
    view?: 'home' | 'register' | 'executive-login' | 'dashboard' | 'ambassador'
    anchor?: string
    leaderName?: string
  }
}

// -----------------------------------------------------------------------------
// 1. ALL 11 EXECUTIVES & LEADERSHIP ROSTER (EXHAUSTIVE DETAIL)
// -----------------------------------------------------------------------------
export const UYFSR_EXECUTIVES_DETAIL = [
  {
    name: 'Mustafiz Bin Jihad',
    nameBn: 'মোস্তাফিজ বিন জিহাদ',
    title: 'Chief Executive Officer (CEO)',
    titleBn: 'প্রধান নির্বাহী কর্মকর্তা (সিইও)',
    department: 'Executive Council & Strategic Vision',
    rankTier: 'Executive Council',
    phone: '+880 1824-798147',
    rawPhone: '01824798147',
    email: 'mostafizbinjihad@gmail.com',
    facebook: 'https://www.facebook.com/share/1J6Aei7Kqf/',
    voucher: 'UYFSR-REF-MBJ2026',
    bio: 'Founding leadership directing national youth scientific exploration, central institutional alliances, policy strategy, and nationwide research initiatives across Bangladesh.'
  },
  {
    name: 'Fahim Samiul Islam',
    nameBn: 'ফাহিম সামিউল ইসলাম',
    title: 'Deputy Chief Executive Officer (DCEO)',
    titleBn: 'উপ-প্রধান নির্বাহী কর্মকর্তা (ডিসিইও)',
    department: 'Executive Directorate & Program Operations',
    rankTier: 'Executive Council',
    phone: '+880 1303-290971',
    rawPhone: '01303290971',
    email: 'samiulislamfahim8@gmail.com',
    facebook: 'https://www.facebook.com/fahimsamiul.Islam.568/',
    voucher: 'N/A',
    bio: 'Assisting executive leadership in organizational governance, nationwide youth program coordination, institutional strategy, and council development.'
  },
  {
    name: 'Shahriar Mejba',
    nameBn: 'শাহরিয়ার মেজবা',
    title: 'Chief Operating Officer (COO)',
    titleBn: 'প্রধান পরিচালনা কর্মকর্তা (সিওও)',
    department: 'Operations & Council Governance',
    rankTier: 'Executive Council',
    phone: '+880 1410-581821',
    rawPhone: '01410581821',
    email: 'mejbaacps2007@gmail.com',
    facebook: 'https://www.facebook.com/share/1E5uVz1e3v/',
    voucher: 'UYFSR-REF-SM2026',
    bio: 'Directing organizational operations, operational workflows, national event execution, field chapter coordination, and logistics governance.'
  },
  {
    name: 'Soyaib Islam',
    nameBn: 'শোয়াইব ইসলাম',
    title: 'Chief Research Officer (CRO)',
    titleBn: 'প্রধান গবেষণা কর্মকর্তা (সিআরও)',
    department: 'Research Strategy & Scientific Development',
    rankTier: 'Executive Council',
    phone: '+880 1349-359808',
    rawPhone: '01349359808',
    email: 'soyaib248@gmail.com',
    facebook: 'https://www.facebook.com/share/1DTfy9EwFd/',
    voucher: 'N/A',
    bio: 'Directing research methodologies, academic publications, research clinics, and scientific curriculum standards for youth cohorts across Bangladesh.'
  },
  {
    name: 'Dalia Sultana Joty',
    nameBn: 'দালিয়া সুলতানা জ্যোতি',
    title: 'Chief Communications Officer (CCO)',
    titleBn: 'প্রধান যোগাযোগ কর্মকর্তা (সিসিও)',
    department: 'Communications & External Affairs',
    rankTier: 'Executive Council',
    phone: '+880 1333-623162',
    rawPhone: '01333623162',
    email: 'daliajoty@gmail.com',
    facebook: 'https://www.facebook.com/dalia.joty',
    voucher: 'N/A',
    bio: 'Stewarding strategic organizational communications, media relations, institutional press engagement, and public outreach across youth research initiatives.'
  },
  {
    name: 'Jarin Tasnim',
    nameBn: 'জারিন তাসনিম',
    title: 'Chief Management Officer (CMO)',
    titleBn: 'প্রধান ব্যবস্থাপনা কর্মকর্তা (সিএমও)',
    department: 'Management Operations & Public Affairs',
    rankTier: 'Executive Council',
    phone: '+880 1333-623162',
    rawPhone: '01333623162',
    email: 'parkjarinot7@gmail.com',
    facebook: 'https://www.facebook.com/share/1Hs9Ffvgxd/',
    voucher: 'N/A',
    bio: 'Directing organizational management workflows, inter-institutional communications, event logistics, and youth cohort engagement.'
  },
  {
    name: 'Md Nabil Tahmid',
    nameBn: 'মো: নাবিল তাহমিদ',
    title: 'Chief Human Resources Officer (CHRO)',
    titleBn: 'প্রধান মানবসম্পদ কর্মকর্তা (সিএইচআরও)',
    department: 'Human Resources & Talent Development',
    rankTier: 'Executive Council',
    phone: '+880 1617-607048',
    rawPhone: '01617607048',
    email: 'hassantahmid312@gmail.com',
    facebook: 'https://www.facebook.com/share/1E6jW8D1Vd/',
    voucher: 'N/A',
    bio: 'Leading human capital management, leadership talent development, nationwide member recruitment, and organizational community welfare.'
  },
  {
    name: 'Shahriyar Tashkir',
    nameBn: 'শাহরিয়ার তাসকির',
    title: 'Chief Technology Officer (CTO)',
    titleBn: 'প্রধান প্রযুক্তি কর্মকর্তা (সিটিও)',
    department: 'Technology & Digital Infrastructure',
    rankTier: 'Executive Council',
    phone: '+880 1349-359808',
    rawPhone: '01349359808',
    email: 'tashkir2006@gmail.com',
    facebook: 'https://www.facebook.com/share/1b6Xuh2wGZ/',
    voucher: 'N/A',
    bio: 'Spearheading digital systems architecture, technological platforms, portal engineering, scientific computing frameworks, and computational research tools.'
  },
  {
    name: 'Khaled Saifullah Rohan',
    nameBn: 'খালেদ সাইফুল্লাহ রোহান',
    title: 'Adviser',
    titleBn: 'উপদেষ্টা',
    department: 'Advisory Board & Strategic Guidance',
    rankTier: 'Advisory Board',
    phone: '+880 1736-309347',
    rawPhone: '01736309347',
    email: 'rohan232619@gmail.com',
    facebook: 'https://www.facebook.com/share/1FGbriwzQb/',
    voucher: 'N/A',
    bio: 'Providing institutional governance, strategic advisory, policy mentorship, and organizational leadership for nationwide youth science programs.'
  },
  {
    name: 'Oasimul Rafin',
    nameBn: 'ওয়াসিমুল রাফিন',
    title: 'Adviser',
    titleBn: 'উপদেষ্টা',
    department: 'Advisory Board & Academic Oversight',
    rankTier: 'Advisory Board',
    phone: '+880 1855-052383',
    rawPhone: '01855052383',
    email: 'Oasimulrafin@gmail.com',
    facebook: 'https://www.facebook.com/share/1CLvCsT3Ho/',
    voucher: 'N/A',
    bio: 'Providing strategic mentorship, academic guidance, and institutional governance for national youth research and innovation initiatives.'
  },
  {
    name: 'Taki Al Zaki',
    nameBn: 'তাকি আল জাকি',
    title: 'Secretary of Technology',
    titleBn: 'তথ্যপ্রযুক্তি সচিব (সেক্রেটারি অব টেকনোলজি)',
    department: 'Technology & Digital Systems',
    rankTier: 'Secretariat',
    phone: '+880 1911-287501',
    rawPhone: '01911287501',
    email: 'ktahan629@gmail.com',
    facebook: 'https://www.facebook.com/uyfsr',
    voucher: 'N/A',
    bio: 'Overseeing technological implementations, web engineering, system integrations, and digital operations for research cohorts and events.'
  }
]

// -----------------------------------------------------------------------------
// 2. COMPREHENSIVE ORGANIZATIONAL ENCYCLOPEDIA ITEMS
// -----------------------------------------------------------------------------
export const UYFSR_ORG_KNOWLEDGE_ITEMS: OrgKnowledgeItem[] = [
  // --- A. FOUNDATION & HISTORY ---
  {
    keys: [
      'uyfsr kobe', 'when was uyfsr founded', 'established date', 'প্রতিষ্ঠা', 'কবে প্রতিষ্ঠিত',
      '30 may 2025', '৩০ মে ২০২৫', 'foundation date', 'establishment date', 'uyfsr history', 'ইতিহাস'
    ],
    topic: 'about',
    bn: `🏛️ **UYFSR-এর প্রতিষ্ঠা ও প্রেক্ষাপট:**\n\n` +
      `• **পূর্ণ রূপ:** United Youth Forum of Science and Research (ইউনাইটেড ইয়ুথ ফোরাম অব সায়েন্স অ্যান্ড রিসার্চ)।\n` +
      `• **প্রতিষ্ঠার তারিখ:** **৩০ মে ২০২৫ (30 May 2025)**।\n` +
      `• **উদ্দেশ্য:** বাংলাদেশের স্কুল, কলেজ এবং বিশ্ববিদ্যালয়ের তরুণ প্রজন্মের মাঝে পাঠ্যবইয়ের মুখস্থ বিদ্যার বাইরে গিয়ে বাস্তবিক গবেষণা, উদ্ভাবন এবং বৈজ্ঞানিক চিন্তার সংস্কৃতি ছড়িয়ে দেওয়া।\n` +
      `• **লক্ষ্য:** তরুণদের জন্য এমন একটি উন্মুক্ত প্ল্যাটফর্ম তৈরি করা যেখানে যে কেউ প্রশ্ন করতে পারে, পরীক্ষণ করতে পারে এবং উদ্ভাবনী আইডিয়া জাতীয় পর্যায়ে উপস্থাপন করতে পারে।`,
    banglish: `🏛️ **UYFSR Foundation & History:**\n\n` +
      `• **Full Name:** United Youth Forum of Science and Research.\n` +
      `• **Established Date:** **30 May 2025 (৩০ মে ২০২৫)**.\n` +
      `• **Mission:** Shikkharthider moddhe research culture choriye dewa ebong biggan chorchar bishal platform toiri kora!`,
    en: `🏛️ **Foundation & Strategic Origins of UYFSR:**\n\n` +
      `• **Full Title:** United Youth Forum of Science and Research (UYFSR).\n` +
      `• **Date of Establishment:** **30 May 2025**.\n` +
      `• **Strategic Mission:** Democratizing empirical research paradigms, hands-on scientific experimentation, and youth intellectual discovery across Bangladesh.`,
    actionLink: { label: 'Explore Our Story', href: '#about', view: 'home', anchor: 'about' }
  },

  // --- B. MISSION & VISION ---
  {
    keys: ['mission', 'vision', 'লক্ষ্য', 'উদ্দেশ্য', 'vision ki', 'mission ki', 'uyfsr er lokkho', 'motto'],
    topic: 'about',
    bn: `🎯 **UYFSR-এর মিশন ও ভিশন:**\n\n` +
      `• **আমাদের মিশন (Mission):** বিজ্ঞান ও গবেষণাকে শুধুমাত্র ল্যাব বা বিশ্ববিদ্যালয়ের অধ্যাপকদের মধ্যে সীমাবদ্ধ না রেখে তৃণমূল পর্যায়ের শিক্ষার্থী ও তরুণদের জন্য সহজলভ্য ও উন্মুক্ত করা। শিক্ষার্থীদের পাঠ্যবইয়ের বাইরে কৌতূহলী প্রশ্ন তোলা এবং প্রমাণভিত্তিক গবেষণায় উদ্বুদ্ধ করা।\n\n` +
      `• **আমাদের ভিশন (Vision):** এমন একটি প্রজন্ম গড়ে তোলা যারা বিজ্ঞানমনস্ক, উদ্ভাবনী এবং বৈজ্ঞানিক অনুসন্ধানের মাধ্যমে দেশ ও সমাজের বাস্তব সমস্যার সমাধান তৈরি করতে সক্ষম। বাংলাদেশের ৬৪ জেলায় তরুণ গবেষক ও বিজ্ঞানীদের সমন্বিত নেটওয়ার্ক গড়ে তোলা।`,
    banglish: `🎯 **UYFSR Mission & Vision:**\n\n` +
      `• **Mission:** Text-book er baire giye research culture ke school-college level e promote kora.\n` +
      `• **Vision:** Bangladesh-er 64 districts e curious, creative ebong research-driven youth community toiri kora!`,
    en: `🎯 **Mission & Vision of UYFSR:**\n\n` +
      `• **Mission:** To introduce and nurture empirical scientific research methodologies among pre-university and undergraduate scholars, de-mystifying academic inquiry.\n` +
      `• **Vision:** To cultivate a nationwide generation of evidence-driven innovators and young researchers capable of addressing global and local challenges through rigorous STEM investigation.`,
    actionLink: { label: 'Read Mission & Vision', href: '#mission', view: 'home', anchor: 'mission' }
  },

  // --- C. ALL 11 EXECUTIVES PHONE NUMBERS & CONTACT DIRECTORY ---
  {
    keys: [
      'phone number', 'phone numbers', 'shob phone number', 'executive phone', 'contact numbers',
      'ফোন নম্বর', 'কার নম্বর কত', 'মোবাইল নম্বর', 'shobai er number', 'executive contact'
    ],
    topic: 'leadership',
    bn: `📞 **UYFSR এক্সিকিউটিভ ও শীর্ষ নেতৃত্বের অফিসিয়াল মোবাইল ডিরেক্টরি:**\n\n` +
      `• **মোস্তাফিজ বিন জিহাদ (CEO):** \`+880 1824-798147\`\n` +
      `• **ফাহিম সামিউল ইসলাম (DCEO):** \`+880 1303-290971\`\n` +
      `• **শাহরিয়ার মেজবা (COO):** \`+880 1410-581821\`\n` +
      `• **শোয়াইব ইসলাম (CRO):** \`+880 1349-359808\`\n` +
      `• **ডালিয়া সুলতানা জ্যোতি (CCO):** \`+880 1333-623162\`\n` +
      `• **জারিন তাসনিম (CMO):** \`+880 1333-623162\`\n` +
      `• **মো: নাবিল তাহমিদ (CHRO):** \`+880 1617-607048\`\n` +
      `• **শাহরিয়ার তাসকির (CTO):** \`+880 1349-359808\`\n` +
      `• **তাকি আল জাকি (Secretary of Technology):** \`+880 1911-287501\`\n` +
      `• **খালেদ সাইফুল্লাহ রোহান (Adviser):** \`+880 1736-309347\`\n` +
      `• **ওয়াসিমুল রাফিন (Adviser):** \`+880 1855-052383\`\n\n` +
      `💬 *অফিসিয়াল সেন্ট্রাল ইমেইল:* \`uyfsr.org@gmail.com\` | *অফিসিয়াল বিকাশ:* \`01911287501\``,
    banglish: `📞 **UYFSR Executive Leadership Phone Directory:**\n\n` +
      `• Mustafiz Bin Jihad (CEO): +880 1824-798147\n` +
      `• Fahim Samiul Islam (DCEO): +880 1303-290971\n` +
      `• Shahriar Mejba (COO): +880 1410-581821\n` +
      `• Soyaib Islam (CRO): +880 1349-359808\n` +
      `• Dalia Sultana Joty (CCO): +880 1333-623162\n` +
      `• Jarin Tasnim (CMO): +880 1333-623162\n` +
      `• Md Nabil Tahmid (CHRO): +880 1617-607048\n` +
      `• Shahriyar Tashkir (CTO): +880 1349-359808\n` +
      `• Taki Al Zaki (Sec. of Tech): +880 1911-287501\n` +
      `• Khaled Saifullah Rohan (Adviser): +880 1736-309347\n` +
      `• Oasimul Rafin (Adviser): +880 1855-052383`,
    en: `📞 **UYFSR Executive Council & Advisory Contact Directory:**\n\n` +
      `• **Mustafiz Bin Jihad** (CEO): \`+880 1824-798147\`\n` +
      `• **Fahim Samiul Islam** (DCEO): \`+880 1303-290971\`\n` +
      `• **Shahriar Mejba** (COO): \`+880 1410-581821\`\n` +
      `• **Soyaib Islam** (CRO): \`+880 1349-359808\`\n` +
      `• **Dalia Sultana Joty** (CCO): \`+880 1333-623162\`\n` +
      `• **Jarin Tasnim** (CMO): \`+880 1333-623162\`\n` +
      `• **Md Nabil Tahmid** (CHRO): \`+880 1617-607048\`\n` +
      `• **Shahriyar Tashkir** (CTO): \`+880 1349-359808\`\n` +
      `• **Taki Al Zaki** (Secretary of Technology): \`+880 1911-287501\`\n` +
      `• **Khaled Saifullah Rohan** (Adviser): \`+880 1736-309347\`\n` +
      `• **Oasimul Rafin** (Adviser): \`+880 1855-052383\`\n\n` +
      `Central Secretariat: \`uyfsr.org@gmail.com\``,
    actionLink: { label: 'View Leadership Team', href: '#leadership', view: 'home', anchor: 'leadership' }
  },

  // --- D. ALL 11 EXECUTIVES EMAIL DIRECTORY ---
  {
    keys: ['executive email', 'emails', 'shob email', 'leaders email', 'ইমেইল তালিকা', 'কার ইমেইল কি'],
    topic: 'leadership',
    bn: `📧 **UYFSR এক্সিকিউটিভ ও শীর্ষ নেতৃত্বের অফিসিয়াল ইমেইল তালিকা:**\n\n` +
      `• **মোস্তাফিজ বিন জিহাদ (CEO):** \`mostafizbinjihad@gmail.com\`\n` +
      `• **ফাহিম সামিউল ইসলাম (DCEO):** \`samiulislamfahim8@gmail.com\`\n` +
      `• **শাহরিয়ার মেজবা (COO):** \`mejbaacps2007@gmail.com\`\n` +
      `• **শোয়াইব ইসলাম (CRO):** \`soyaib248@gmail.com\`\n` +
      `• **ডালিয়া সুলতানা জ্যোতি (CCO):** \`daliajoty@gmail.com\`\n` +
      `• **জারিন তাসনিম (CMO):** \`parkjarinot7@gmail.com\`\n` +
      `• **মো: নাবিল তাহমিদ (CHRO):** \`hassantahmid312@gmail.com\`\n` +
      `• **শাহরিয়ার তাসকির (CTO):** \`tashkir2006@gmail.com\`\n` +
      `• **তাকি আল জাকি (Secretary of Technology):** \`ktahan629@gmail.com\`\n` +
      `• **খালেদ সাইফুল্লাহ রোহান (Adviser):** \`rohan232619@gmail.com\`\n` +
      `• **ওয়াসিমুল রাফিন (Adviser):** \`Oasimulrafin@gmail.com\`\n\n` +
      `সেন্ট্রাল প্রাতিষ্ঠানিক যোগাযোগ: \`uyfsr.org@gmail.com\``,
    banglish: `📧 **UYFSR Executive Email Directory:**\n\n` +
      `• Mustafiz Bin Jihad (CEO): mostafizbinjihad@gmail.com\n` +
      `• Fahim Samiul Islam (DCEO): samiulislamfahim8@gmail.com\n` +
      `• Shahriar Mejba (COO): mejbaacps2007@gmail.com\n` +
      `• Soyaib Islam (CRO): soyaib248@gmail.com\n` +
      `• Dalia Sultana Joty (CCO): daliajoty@gmail.com\n` +
      `• Jarin Tasnim (CMO): parkjarinot7@gmail.com\n` +
      `• Md Nabil Tahmid (CHRO): hassantahmid312@gmail.com\n` +
      `• Shahriyar Tashkir (CTO): tashkir2006@gmail.com\n` +
      `• Taki Al Zaki (Sec. of Tech): ktahan629@gmail.com\n` +
      `• Khaled Saifullah Rohan (Adviser): rohan232619@gmail.com\n` +
      `• Oasimul Rafin (Adviser): Oasimulrafin@gmail.com`,
    en: `📧 **UYFSR Institutional Email Roster:**\n\n` +
      `• **Mustafiz Bin Jihad** (CEO): \`mostafizbinjihad@gmail.com\`\n` +
      `• **Fahim Samiul Islam** (DCEO): \`samiulislamfahim8@gmail.com\`\n` +
      `• **Shahriar Mejba** (COO): \`mejbaacps2007@gmail.com\`\n` +
      `• **Soyaib Islam** (CRO): \`soyaib248@gmail.com\`\n` +
      `• **Dalia Sultana Joty** (CCO): \`daliajoty@gmail.com\`\n` +
      `• **Jarin Tasnim** (CMO): \`parkjarinot7@gmail.com\`\n` +
      `• **Md Nabil Tahmid** (CHRO): \`hassantahmid312@gmail.com\`\n` +
      `• **Shahriyar Tashkir** (CTO): \`tashkir2006@gmail.com\`\n` +
      `• **Taki Al Zaki** (Sec. of Technology): \`ktahan629@gmail.com\`\n` +
      `• **Khaled Saifullah Rohan** (Adviser): \`rohan232619@gmail.com\`\n` +
      `• **Oasimul Rafin** (Adviser): \`Oasimulrafin@gmail.com\``,
    actionLink: { label: 'View Leadership Team', href: '#leadership', view: 'home', anchor: 'leadership' }
  },

  // --- E. MUSTAFIZ BIN JIHAD (CEO) ---
  {
    keys: [
      'mustafiz', 'mustafiz bin jihad', 'মুস্তাফিজ', 'মুস্তাফিজ বিন জিহাদ', 'ceo ke', 'who is ceo',
      'president ke', 'প্রতিষ্ঠাতা', 'founder', 'mustafiz phone', 'mustafiz email'
    ],
    topic: 'leadership',
    bn: `👔 **মোস্তাফিজ বিন জিহাদ (Mustafiz Bin Jihad):**\n\n` +
      `• **পদবি:** প্রধান নির্বাহী কর্মকর্তা (Chief Executive Officer - CEO) ও প্রতিষ্ঠাতা নেতৃত্ব।\n` +
      `• **বিভাগ:** Executive Council & Strategic Vision.\n` +
      `• **দায়িত্ব:** দেশব্যাপী তরুণদের মাঝে বৈজ্ঞানিক গবেষণা, কেন্দ্রীয় প্রাতিষ্ঠানিক পার্টনারশিপ, নীতিগত দিকনির্দেশনা ও জাতীয় অলিম্পিয়াডের সামগ্রিক রূপরেখা পরিচালনা করছেন। তাঁর নেতৃত্বে UYFSR প্রতিষ্ঠিত হয় ৩০ মে ২০২৫-এ।\n` +
      `• **মোবাইল:** \`+880 1824-798147\`\n` +
      `• **ইমেইল:** \`mostafizbinjihad@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1J6Aei7Kqf/)\n` +
      `• **অফিসিয়াল রেফারেল ভাউচার:** \`UYFSR-REF-MBJ2026\` (রেজিস্ট্রেশনে ২০% এক্সিকিউটিভ ডিসকাউন্ট)`,
    banglish: `👔 **Mustafiz Bin Jihad (Chief Executive Officer - CEO):**\n\n` +
      `• Title: CEO & Founding Leader of UYFSR.\n` +
      `• Mobile: +880 1824-798147\n` +
      `• Email: mostafizbinjihad@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1J6Aei7Kqf/\n` +
      `• Voucher Code: UYFSR-REF-MBJ2026 (20% off)`,
    en: `👔 **Mustafiz Bin Jihad — Chief Executive Officer (CEO):**\n\n` +
      `• **Designation:** CEO & Founding Leadership.\n` +
      `• **Department:** Executive Council & Strategic Vision.\n` +
      `• **Scope:** Orchestrating nationwide youth science exploration, central institutional alliances, policy strategy, and national research initiatives.\n` +
      `• **Phone:** \`+880 1824-798147\`\n` +
      `• **Email:** \`mostafizbinjihad@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1J6Aei7Kqf/)\n` +
      `• **Executive Referral Voucher:** \`UYFSR-REF-MBJ2026\` (20% Registration Discount)`,
    actionLink: { label: 'View Profile in Leadership', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Mustafiz Bin Jihad' }
  },

  // --- F. FAHIM SAMIUL ISLAM (DCEO) ---
  {
    keys: [
      'fahim', 'fahim samiul', 'fahim samiul islam', 'ফাহিম', 'ফাহিম সামিউল ইসলাম', 'dceo',
      'deputy ceo', 'fahim phone', 'fahim email', 'fahim facebook'
    ],
    topic: 'leadership',
    bn: `💼 **ফাহিম সামিউল ইসলাম (Fahim Samiul Islam):**\n\n` +
      `• **পদবি:** উপ-প্রধান নির্বাহী কর্মকর্তা (Deputy Chief Executive Officer - DCEO)।\n` +
      `• **বিভাগ:** Executive Directorate & Program Operations.\n` +
      `• **দায়িত্ব:** সংগঠনের নির্বাহী পরিচালনা, দেশব্যাপী যুব বিজ্ঞান কর্মসূচি সমন্বয় এবং প্রাতিষ্ঠানিক কৌশল প্রণয়নে শীর্ষ নেতৃত্বকে সহযোগিতা করেন।\n` +
      `• **মোবাইল:** \`+880 1303-290971\`\n` +
      `• **ইমেইল:** \`samiulislamfahim8@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/fahimsamiul.Islam.568/)`,
    banglish: `💼 **Fahim Samiul Islam (Deputy Chief Executive Officer - DCEO):**\n\n` +
      `• Title: DCEO of UYFSR.\n` +
      `• Mobile: +880 1303-290971\n` +
      `• Email: samiulislamfahim8@gmail.com\n` +
      `• Facebook: https://www.facebook.com/fahimsamiul.Islam.568/`,
    en: `💼 **Fahim Samiul Islam — Deputy Chief Executive Officer (DCEO):**\n\n` +
      `• **Designation:** Deputy Chief Executive Officer (DCEO).\n` +
      `• **Department:** Executive Directorate & Program Operations.\n` +
      `• **Scope:** Assisting executive leadership in organizational governance, nationwide youth program coordination, institutional strategy, and council development.\n` +
      `• **Phone:** \`+880 1303-290971\`\n` +
      `• **Email:** \`samiulislamfahim8@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/fahimsamiul.Islam.568/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Fahim Samiul Islam' }
  },

  // --- G. SHAHRIAR MEJBA (COO) ---
  {
    keys: [
      'mejba', 'shahriar mejba', 'শাহরিয়ার মেজবা', 'মেজবা', 'coo', 'chief operating officer',
      'mejba phone', 'mejba email', 'mejba voucher'
    ],
    topic: 'leadership',
    bn: `⚙️ **শাহরিয়ার মেজবা (Shahriar Mejba):**\n\n` +
      `• **পদবি:** প্রধান পরিচালনা কর্মকর্তা (Chief Operating Officer - COO)।\n` +
      `• **বিভাগ:** Operations & Council Governance.\n` +
      `• **দায়িত্ব:** সাংগঠনিক পরিচালনা, অপারেশনাল ওয়ার্কফ্লো, জাতীয় ইভেন্ট বাস্তবায়ন, ফিল্ড চ্যাপ্টার সমন্বয় ও লজিস্টিকস পরিচালনা করেন।\n` +
      `• **মোবাইল:** \`+880 1410-581821\`\n` +
      `• **ইমেইল:** \`mejbaacps2007@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1E5uVz1e3v/)\n` +
      `• **অফিসিয়াল রেফারেল ভাউচার:** \`UYFSR-REF-SM2026\` (রেজিস্ট্রেশনে ২০% এক্সিকিউটিভ ছাড়)`,
    banglish: `⚙️ **Shahriar Mejba (Chief Operating Officer - COO):**\n\n` +
      `• Title: COO of UYFSR.\n` +
      `• Mobile: +880 1410-581821\n` +
      `• Email: mejbaacps2007@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1E5uVz1e3v/\n` +
      `• Voucher Code: UYFSR-REF-SM2026 (20% off)`,
    en: `⚙️ **Shahriar Mejba — Chief Operating Officer (COO):**\n\n` +
      `• **Designation:** Chief Operating Officer (COO).\n` +
      `• **Department:** Operations & Council Governance.\n` +
      `• **Scope:** Directing organizational operations, operational workflows, national event execution, field chapter coordination, and logistics governance.\n` +
      `• **Phone:** \`+880 1410-581821\`\n` +
      `• **Email:** \`mejbaacps2007@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1E5uVz1e3v/)\n` +
      `• **Voucher:** \`UYFSR-REF-SM2026\` (20% Discount)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Shahriar Mejba' }
  },

  // --- H. SOYAIB ISLAM (CRO) ---
  {
    keys: [
      'soyaib', 'soyaib islam', 'শোয়াইব', 'সোয়াইব', 'শোয়াইব ইসলাম', 'cro', 'chief research officer',
      'research head', 'soyaib phone', 'soyaib email'
    ],
    topic: 'leadership',
    bn: `🔬 **শোয়াইব ইসলাম (Soyaib Islam):**\n\n` +
      `• **পদবি:** প্রধান গবেষণা কর্মকর্তা (Chief Research Officer - CRO)।\n` +
      `• **বিভাগ:** Research Strategy & Scientific Development.\n` +
      `• **দায়িত্ব:** তরুণদের গবেষণা পদ্ধতি, সায়েন্টিফিক জার্নাল ও পেপার প্রকাশনা, রিসার্চ ক্লিনিক এবং জাতীয় সায়েন্স কারিকুলাম পরিচালনা ও মানদণ্ড নিশ্চিত করেন।\n` +
      `• **মোবাইল:** \`+880 1349-359808\`\n` +
      `• **ইমেইল:** \`soyaib248@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1DTfy9EwFd/)`,
    banglish: `🔬 **Soyaib Islam (Chief Research Officer - CRO):**\n\n` +
      `• Title: CRO of UYFSR.\n` +
      `• Mobile: +880 1349-359808\n` +
      `• Email: soyaib248@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1DTfy9EwFd/`,
    en: `🔬 **Soyaib Islam — Chief Research Officer (CRO):**\n\n` +
      `• **Designation:** Chief Research Officer (CRO).\n` +
      `• **Department:** Research Strategy & Scientific Development.\n` +
      `• **Scope:** Directing research methodologies, academic publications, research clinics, and scientific curriculum standards for youth cohorts across Bangladesh.\n` +
      `• **Phone:** \`+880 1349-359808\`\n` +
      `• **Email:** \`soyaib248@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1DTfy9EwFd/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Soyaib Islam' }
  },

  // --- I. DALIA SULTANA JOTY (CCO) ---
  {
    keys: [
      'dalia', 'dalia sultana joty', 'ডালিয়া', 'ডালিয়া সুলতানা জ্যোতি', 'জোতি', 'cco',
      'chief communications officer', 'dalia phone', 'dalia email'
    ],
    topic: 'leadership',
    bn: `📢 **ডালিয়া সুলতানা জ্যোতি (Dalia Sultana Joty):**\n\n` +
      `• **পদবি:** প্রধান যোগাযোগ কর্মকর্তা (Chief Communications Officer - CCO)।\n` +
      `• **বিভাগ:** Communications & External Affairs.\n` +
      `• **দায়িত্ব:** সাংগঠনিক বহির্যোগাযোগ, মিডিয়া সম্পর্ক, প্রাতিষ্ঠানিক প্রেস রিলিজ এবং জাতীয় যুব গবেষণা প্রচার পরিচালনা করছেন।\n` +
      `• **মোবাইল:** \`+880 1333-623162\`\n` +
      `• **ইমেইল:** \`daliajoty@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/dalia.joty)`,
    banglish: `📢 **Dalia Sultana Joty (Chief Communications Officer - CCO):**\n\n` +
      `• Title: CCO of UYFSR.\n` +
      `• Mobile: +880 1333-623162\n` +
      `• Email: daliajoty@gmail.com\n` +
      `• Facebook: https://www.facebook.com/dalia.joty`,
    en: `📢 **Dalia Sultana Joty — Chief Communications Officer (CCO):**\n\n` +
      `• **Designation:** Chief Communications Officer (CCO).\n` +
      `• **Department:** Communications & External Affairs.\n` +
      `• **Scope:** Stewarding strategic organizational communications, media relations, institutional press engagement, and public outreach.\n` +
      `• **Phone:** \`+880 1333-623162\`\n` +
      `• **Email:** \`daliajoty@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/dalia.joty)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Dalia Sultana Joty' }
  },

  // --- J. JARIN TASNIM (CMO) ---
  {
    keys: [
      'jarin', 'jarin tasnim', 'জারিন', 'জারিন তাসনিম', 'cmo', 'chief management officer',
      'jarin phone', 'jarin email'
    ],
    topic: 'leadership',
    bn: `📋 **জারিন তাসনিম (Jarin Tasnim):**\n\n` +
      `• **পদবি:** প্রধান ব্যবস্থাপনা কর্মকর্তা (Chief Management Officer - CMO)।\n` +
      `• **বিভাগ:** Management Operations & Public Affairs.\n` +
      `• **দায়িত্ব:** সাংগঠনিক ম্যানেজমেন্ট ওয়ার্কফ্লো, আন্তঃপ্রাতিষ্ঠানিক যোগাযোগ, ইভেন্ট পরিচালনা এবং যুব সমাজের সংযোগ কার্যক্রম পরিচালনা করেন।\n` +
      `• **মোবাইল:** \`+880 1333-623162\`\n` +
      `• **ইমেইল:** \`parkjarinot7@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1Hs9Ffvgxd/)`,
    banglish: `📋 **Jarin Tasnim (Chief Management Officer - CMO):**\n\n` +
      `• Title: CMO of UYFSR.\n` +
      `• Mobile: +880 1333-623162\n` +
      `• Email: parkjarinot7@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1Hs9Ffvgxd/`,
    en: `📋 **Jarin Tasnim — Chief Management Officer (CMO):**\n\n` +
      `• **Designation:** Chief Management Officer (CMO).\n` +
      `• **Department:** Management Operations & Public Affairs.\n` +
      `• **Scope:** Directing organizational management workflows, inter-institutional communications, event logistics, and youth cohort engagement.\n` +
      `• **Phone:** \`+880 1333-623162\`\n` +
      `• **Email:** \`parkjarinot7@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1Hs9Ffvgxd/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Jarin Tasnim' }
  },

  // --- K. MD NABIL TAHMID (CHRO) ---
  {
    keys: [
      'nabil', 'md nabil tahmid', 'নাবিল', 'মো: নাবিল তাহমিদ', 'নাবিল তাহমিদ', 'chro',
      'chief human resources officer', 'hr head', 'nabil phone', 'nabil email'
    ],
    topic: 'leadership',
    bn: `🤝 **মো: নাবিল তাহমিদ (Md Nabil Tahmid):**\n\n` +
      `• **পদবি:** প্রধান মানবসম্পদ কর্মকর্তা (Chief Human Resources Officer - CHRO)।\n` +
      `• **বিভাগ:** Human Resources & Talent Development.\n` +
      `• **দায়িত্ব:** হিউম্যান ক্যাপিটাল ম্যানেজমেন্ট, নেতৃত্ব উন্নয়ন, দেশব্যাপী নতুন সদস্য ও ভলান্টিয়ার নিয়োগ এবং কমিউনিটি কল্যাণ পরিচালনা করেন।\n` +
      `• **মোবাইল:** \`+880 1617-607048\`\n` +
      `• **ইমেইল:** \`hassantahmid312@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1E6jW8D1Vd/)`,
    banglish: `🤝 **Md Nabil Tahmid (Chief Human Resources Officer - CHRO):**\n\n` +
      `• Title: CHRO of UYFSR.\n` +
      `• Mobile: +880 1617-607048\n` +
      `• Email: hassantahmid312@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1E6jW8D1Vd/`,
    en: `🤝 **Md Nabil Tahmid — Chief Human Resources Officer (CHRO):**\n\n` +
      `• **Designation:** Chief Human Resources Officer (CHRO).\n` +
      `• **Department:** Human Resources & Talent Development.\n` +
      `• **Scope:** Leading human capital management, leadership talent development, nationwide member recruitment, and organizational welfare.\n` +
      `• **Phone:** \`+880 1617-607048\`\n` +
      `• **Email:** \`hassantahmid312@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1E6jW8D1Vd/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Md Nabil Tahmid' }
  },

  // --- L. SHAHRIYAR TASHKIR (CTO) ---
  {
    keys: [
      'tashkir', 'shahriyar tashkir', 'তাসকির', 'শাহরিয়ার তাসকির', 'cto',
      'chief technology officer', 'tashkir phone', 'tashkir email'
    ],
    topic: 'leadership',
    bn: `💻 **শাহরিয়ার তাসকির (Shahriyar Tashkir):**\n\n` +
      `• **পদবি:** প্রধান প্রযুক্তি কর্মকর্তা (Chief Technology Officer - CTO)।\n` +
      `• **বিভাগ:** Technology & Digital Infrastructure.\n` +
      `• **দায়িত্ব:** ডিজিটাল সিস্টেম আর্কিটেকচার, টেকনোলজি প্ল্যাটফর্ম, কেন্দ্রীয় পোর্টাল ও কম্পিউটেশনাল রিসার্চ টুলস পরিচালনা করেন।\n` +
      `• **মোবাইল:** \`+880 1349-359808\`\n` +
      `• **ইমেইল:** \`tashkir2006@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1b6Xuh2wGZ/)`,
    banglish: `💻 **Shahriyar Tashkir (Chief Technology Officer - CTO):**\n\n` +
      `• Title: CTO of UYFSR.\n` +
      `• Mobile: +880 1349-359808\n` +
      `• Email: tashkir2006@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1b6Xuh2wGZ/`,
    en: `💻 **Shahriyar Tashkir — Chief Technology Officer (CTO):**\n\n` +
      `• **Designation:** Chief Technology Officer (CTO).\n` +
      `• **Department:** Technology & Digital Infrastructure.\n` +
      `• **Scope:** Spearheading digital systems architecture, technological platforms, portal engineering, and computational research tools.\n` +
      `• **Phone:** \`+880 1349-359808\`\n` +
      `• **Email:** \`tashkir2006@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1b6Xuh2wGZ/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Shahriyar Tashkir' }
  },

  // --- M. KHALED SAIFULLAH ROHAN (ADVISER) ---
  {
    keys: [
      'rohan', 'khaled saifullah rohan', 'রোহান', 'খালেদ সাইফুল্লাহ রোহান', 'adviser rohan',
      'advisor rohan', 'rohan phone', 'rohan email'
    ],
    topic: 'leadership',
    bn: `🏛️ **খালেদ সাইফুল্লাহ রোহান (Khaled Saifullah Rohan):**\n\n` +
      `• **পদবি:** সম্মানিত উপদেষ্টা (Adviser)।\n` +
      `• **বিভাগ:** Advisory Board & Strategic Guidance.\n` +
      `• **দায়িত্ব:** সংগঠনের প্রাতিষ্ঠানিক সুশাসন, স্ট্র্যাটেজিক পরামর্শ, পলিসি মেন্টরশিপ এবং জাতীয় যুব বিজ্ঞান কর্মসূচিতে দিকনির্দেশনা প্রদান করেন।\n` +
      `• **মোবাইল:** \`+880 1736-309347\`\n` +
      `• **ইমেইল:** \`rohan232619@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1FGbriwzQb/)`,
    banglish: `🏛️ **Khaled Saifullah Rohan (Adviser):**\n\n` +
      `• Title: Adviser to UYFSR.\n` +
      `• Mobile: +880 1736-309347\n` +
      `• Email: rohan232619@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1FGbriwzQb/`,
    en: `🏛️ **Khaled Saifullah Rohan — Adviser:**\n\n` +
      `• **Designation:** Adviser, Advisory Board.\n` +
      `• **Department:** Advisory Board & Strategic Guidance.\n` +
      `• **Scope:** Providing institutional governance, strategic advisory, policy mentorship, and organizational leadership for nationwide programs.\n` +
      `• **Phone:** \`+880 1736-309347\`\n` +
      `• **Email:** \`rohan232619@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1FGbriwzQb/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Khaled Saifullah Rohan' }
  },

  // --- N. OASIMUL RAFIN (ADVISER) ---
  {
    keys: [
      'rafin', 'oasimul rafin', 'রাফিন', 'ওয়াসিমুল রাফিন', 'adviser rafin', 'advisor rafin',
      'rafin phone', 'rafin email'
    ],
    topic: 'leadership',
    bn: `🏛️ **ওয়াসিমুল রাফিন (Oasimul Rafin):**\n\n` +
      `• **পদবি:** সম্মানিত উপদেষ্টা (Adviser)।\n` +
      `• **বিভাগ:** Advisory Board & Academic Oversight.\n` +
      `• **দায়িত্ব:** প্রাতিষ্ঠানিক গবেষণা, যুব বিজ্ঞান উদ্যোগ ও একাডেমিক পরামর্শ ও নীতিগত সহায়তা প্রদান করছেন।\n` +
      `• **মোবাইল:** \`+880 1855-052383\`\n` +
      `• **ইমেইল:** \`Oasimulrafin@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1CLvCsT3Ho/)`,
    banglish: `🏛️ **Oasimul Rafin (Adviser):**\n\n` +
      `• Title: Adviser to UYFSR.\n` +
      `• Mobile: +880 1855-052383\n` +
      `• Email: Oasimulrafin@gmail.com\n` +
      `• Facebook: https://www.facebook.com/share/1CLvCsT3Ho/`,
    en: `🏛️ **Oasimul Rafin — Adviser:**\n\n` +
      `• **Designation:** Adviser, Advisory Board.\n` +
      `• **Department:** Advisory Board & Academic Oversight.\n` +
      `• **Scope:** Providing strategic mentorship, academic guidance, and institutional governance for national youth research.\n` +
      `• **Phone:** \`+880 1855-052383\`\n` +
      `• **Email:** \`Oasimulrafin@gmail.com\`\n` +
      `• **Facebook:** [Profile Link](https://www.facebook.com/share/1CLvCsT3Ho/)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Oasimul Rafin' }
  },

  // --- O. TAKI AL ZAKI (SECRETARY OF TECHNOLOGY) ---
  {
    keys: [
      'taki', 'taki al zaki', 'তাকি', 'তাকী', 'তাকি আল জাকি', 'secretary of technology',
      'tech secretary', 'taki phone', 'taki email'
    ],
    topic: 'leadership',
    bn: `⚡ **তাকি আল জাকি (Taki Al Zaki):**\n\n` +
      `• **পদবি:** তথ্যপ্রযুক্তি সচিব (Secretary of Technology)।\n` +
      `• **বিভাগ:** Technology & Digital Systems (Secretariat).\n` +
      `• **দায়িত্ব:** সেন্ট্রাল ওয়েব প্ল্যাটফর্ম ইঞ্জিনিয়ারিং, ডিজিটাল সিস্টেম ইন্টিগ্রেশন এবং গবেষণা ও ইভেন্ট সংক্রান্ত প্রযুক্তিগত অপারেশনস তদারকি করেন।\n` +
      `• **মোবাইল:** \`+880 1911-287501\`\n` +
      `• **ইমেইল:** \`ktahan629@gmail.com\`\n` +
      `• **ফেসবুক:** [Facebook Page](https://www.facebook.com/uyfsr)`,
    banglish: `⚡ **Taki Al Zaki (Secretary of Technology):**\n\n` +
      `• Title: Secretary of Technology of UYFSR.\n` +
      `• Mobile: +880 1911-287501\n` +
      `• Email: ktahan629@gmail.com\n` +
      `• Facebook: https://www.facebook.com/uyfsr`,
    en: `⚡ **Taki Al Zaki — Secretary of Technology:**\n\n` +
      `• **Designation:** Secretary of Technology.\n` +
      `• **Department:** Technology & Digital Systems (Secretariat).\n` +
      `• **Scope:** Overseeing technological implementations, web engineering, system integrations, and digital operations for research cohorts.\n` +
      `• **Phone:** \`+880 1911-287501\`\n` +
      `• **Email:** \`ktahan629@gmail.com\`\n` +
      `• **Facebook:** [Page Link](https://www.facebook.com/uyfsr)`,
    actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Taki Al Zaki' }
  },

  // --- P. ALL 12 PARTNERS & COLLABORATORS (EXHAUSTIVE DETAIL) ---
  {
    keys: [
      'shob partner', 'partners list', 'collaborators list', 'সব পার্টনার', 'পার্টনার তালিকা',
      'পার্টনার কারা', 'পার্টনারদের তালিকা', 'list of partners', 'who are your partners', 'all partners'
    ],
    topic: 'partners',
    bn: `🤝 **UYFSR-এর সকল সহযোগী পার্টনার ও কোলাবোরেটরদের তালিকা:**\n\n` +
      `১. **Strategic Alliances:**\n` +
      `• **TWIMBOL:** প্রোগ্রাম ও ওয়ার্কশপ পার্টনার। স্কিল সেশন পরিচালনা এবং Junior Startup Challenge ও Junior Talent Award-এর যৌথ আয়োজক।\n` +
      `• **KIDLON:** ভেন্যু ও প্রেজেন্টিং পার্টনার। Junior Talent Award Season 1-এর মূল স্টেজ ভেন্যু সহযোগী।\n` +
      `• **MEJOLOGY:** অ্যাকাডেমিক কনটেন্ট পার্টনার। মাধ্যমিক ও কলেজ পর্যায়ের গবেষণার পাঠ্যক্রম ও কর্মশালার কনটেন্ট সহযোগী।\n` +
      `• **ASTROSPHERE:** অলিম্পিয়াড ও অ্যাস্ট্রোনমি কো-অর্গানাইজার। মহাকাশ বিজ্ঞান সেশন ও অলিম্পিয়াডের প্রশ্ন প্রণয়ন সহযোগী।\n\n` +
      `২. **Media Consortium:**\n` +
      `• **Motion BD:** ব্রডকাস্ট মিডিয়া পার্টনার (ভিডিও কভারেজ ও ডকুমেন্টারি)।\n` +
      `• **The Bayline Journal:** এডিটোরিয়াল মিডিয়া পার্টনার (ইন-ডেপথ রিপোর্ট ও ফিচার)।\n` +
      `• **TezzFeed:** ডিজিটাল মিডিয়া পার্টনার (সোশ্যাল মিডিয়া ও তরুণ উদ্ভাবক হাইলাইট)।\n\n` +
      `৩. **Club & Campus Partners:**\n` +
      `• **Adamjee School News Network & Communication Club:** ১ম জাতীয় জার্নালিজম কার্নিভাল ২০২৫-এর হোস্ট ও ক্যাম্পাস ক্লাব পার্টনার।\n` +
      `• **Learning and Study Organization:** অ্যাকাডেমিক স্টাডি মেটেরিয়াল কিউরেশন ও স্টুডেন্ট কো-অর্গানাইজার।\n\n` +
      `৪. **Community & Brand Partners:**\n` +
      `• **The Focal Vibe:** ক্রিয়েটিভ ডিরেকশন ও ব্র্যান্ড ভিজ্যুয়াল পার্টনার।\n` +
      `• **The Yeasirians:** অফিসিয়াল গিফট ও মার্চেন্ডাইজ পার্টনার (বিজয়ীদের মেডেল, ক্রেস্ট ও গিফট বক্স)।\n` +
      `• **Aurelix:** অফিসিয়াল ইভেন্ট ফ্র্যাগ্রেন্স পার্টনার (ইভেন্টের অ্যাম্বিয়েন্ট সুগন্ধ অভিজ্ঞতা)।`,
    banglish: `🤝 **UYFSR Official Partners & Collaborators:**\n\n` +
      `• **TWIMBOL:** Workshop & Program Partner (Junior Startup Challenge & Junior Talent Award co-organizer).\n` +
      `• **KIDLON:** Venue & Presenting Partner (Junior Talent Award Season 1).\n` +
      `• **MEJOLOGY:** Academic Content & Curriculum Partner.\n` +
      `• **ASTROSPHERE:** Astronomy & Space Olympiad Co-organizer.\n` +
      `• **The Bayline Journal:** Editorial Media Partner.\n` +
      `• **Motion BD:** Broadcast Media Partner.\n` +
      `• **TezzFeed:** Digital Media Partner.\n` +
      `• **Adamjee School Communication Club:** Campus Workshop Partner (1st National Journalism Carnival).\n` +
      `• **The Focal Vibe:** Creative Design Partner.\n` +
      `• **The Yeasirians:** Merchandise & Award Partner.\n` +
      `• **Aurelix:** Fragrance Partner.`,
    en: `🤝 **UYFSR Institutional Partners & Collaborators Portfolio:**\n\n` +
      `• **TWIMBOL:** Program & Workshop Partner (Co-organizer of Junior Startup Challenge & Junior Talent Award).\n` +
      `• **KIDLON:** Venue & Presenting Partner for Junior Talent Award Season 1.\n` +
      `• **MEJOLOGY:** Academic Content & Secondary Research Curriculum Partner.\n` +
      `• **ASTROSPHERE:** Astronomy & Space Olympiad Co-organizer.\n` +
      `• **Motion BD:** Official Broadcast Media Partner.\n` +
      `• **The Bayline Journal:** Official Editorial Media Partner.\n` +
      `• **TezzFeed:** Digital Media Outreach Partner.\n` +
      `• **Adamjee School News Network & Communication Club:** Campus Host for National Journalism Carnival 2025.\n` +
      `• **The Focal Vibe:** Creative Direction & Stagecraft Partner.\n` +
      `• **The Yeasirians:** Official Gift & Merchandising Partner.\n` +
      `• **Aurelix:** Official Event Fragrance Partner.`,
    actionLink: { label: 'Explore Partners Directory', href: '#partners', view: 'home', anchor: 'partners' }
  },

  // --- Q. ALL 4 FLAGSHIP EVENTS & DATES ---
  {
    keys: [
      'upcoming events', 'events', 'events calendar', 'tarikh', 'kobe hobe', 'ইভেন্ট সমূহ',
      'জাতীয় ইভেন্ট', 'সব ইভেন্ট', 'schedule', 'dates of events'
    ],
    topic: 'events',
    bn: `📅 **UYFSR-এর ৪টি জাতীয় ও ফ্ল্যাগশিপ ইভেন্ট ক্যালেন্ডার:**\n\n` +
      `১. **National Science Eclipse 2026:**\n` +
      `• **তারিখ:** ১৬–১৮ এপ্রিল ২০২৬ (3-Day Mega Event)\n` +
      `• **আয়োজক:** United Youth Forum of Science and Research (UYFSR)\n` +
      `• **বিষয়:** পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, গণিত এবং মহাকাশ অলিম্পিয়াড, সায়েন্স ফেয়ার প্রজেক্ট ডিসপ্লে ও রিসার্চ পেপার সেশন।\n\n` +
      `২. **KIDLON Presents Junior Talent Award – Season 1:**\n` +
      `• **তারিখ:** ১৮ জুলাই ২০২৬ (21-Day Event)\n` +
      `• **আয়োজক:** TWIMBOL | **ভেন্যু ও প্রেজেন্টিং পার্টনার:** KIDLON | **কমিউনিটি পার্টনার:** UYFSR\n\n` +
      `৩. **Junior Startup Challenge – Season 1:**\n` +
      `• **তারিখ:** ৩ সেপ্টেম্বর ২০২৬\n` +
      `• **আয়োজক:** TWIMBOL | **কমিউনিটি পার্টনার:** UYFSR\n` +
      `• **বিষয়:** তরুণদের উদ্ভাবনী স্টার্টআপ পিচ, টেকনোলজি প্রোটোটাইপ ও সমস্যা সমাধানের চ্যালেঞ্জ।\n\n` +
      `৪. **1st National Journalism Carnival 2025:**\n` +
      `• **তারিখ:** ১৭–১৯ অক্টোবর ২০২৫\n` +
      `• **আয়োজক:** Adamjee School News Network and Communication Club | **ওয়ার্কশপ পার্টনার:** UYFSR`,
    banglish: `📅 **UYFSR 4 Flagship Events & Calendar:**\n\n` +
      `1. **National Science Eclipse 2026:** 16–18 April 2026 (Organized by UYFSR).\n` +
      `2. **Junior Talent Award (Season 1):** 18 July 2026 (Organized by TWIMBOL, Venue: KIDLON, Community Partner: UYFSR).\n` +
      `3. **Junior Startup Challenge (Season 1):** 3 September 2026 (Organized by TWIMBOL, Partner: UYFSR).\n` +
      `4. **1st National Journalism Carnival 2025:** 17–19 October 2025 (Organized by Adamjee School News Network, Workshop Partner: UYFSR).`,
    en: `📅 **UYFSR Flagship Program Calendar:**\n\n` +
      `1. **National Science Eclipse 2026:** 16–18 April 2026 (Organized by UYFSR, 3-day multi-tier Olympiads & project showcases).\n` +
      `2. **KIDLON Presents Junior Talent Award (Season 1):** 18 July 2026 (21-day event, Organized by TWIMBOL, Venue Partner KIDLON, Community Partner UYFSR).\n` +
      `3. **Junior Startup Challenge (Season 1):** 3 September 2026 (Youth entrepreneurship, Organized by TWIMBOL, Partner UYFSR).\n` +
      `4. **1st National Journalism Carnival 2025:** 17–19 October 2025 (Science journalism, Hosted by Adamjee School News Network, Workshop Partner UYFSR).`,
    actionLink: { label: 'Register for Upcoming Events', href: '#register', view: 'register' }
  },

  // --- R. BKASH & NAGAD PAYMENT GATEWAY ---
  {
    keys: [
      'bkash number', '01911287501', 'nagad number', 'payment number', 'বিকাশ নম্বর',
      'টাকা পাঠাব কোন নম্বরে', 'trxid', 'payment kothai korbo', 'send money'
    ],
    topic: 'payment',
    bn: `💳 **অফিসিয়াল বিকাশ ও পেমেন্ট নির্দেশিকা:**\n\n` +
      `• **অফিসিয়াল বিকাশ নম্বর:** \`01911287501\` (Personal)\n` +
      `• **নগদ একাউন্ট:** \`01911287501\`\n` +
      `• **পেমেন্ট টাইপ:** Send Money (পার্সোনাল বিকাশ থেকে সেন্ড মানি করুন)\n` +
      `• **রেজিস্ট্রেশন করার নিয়ম:**\n` +
      `  ১. আমাদের ওয়েবসাইটের রেজিস্ট্রেশন পেজে যান।\n` +
      `  ২. নাম, ইমেইল, মোবাইল ও প্রতিষ্ঠানের তথ্য দিন।\n` +
      `  ৩. কোনো এক্সিকিউটিভ ভাউচার থাকলে (যেমন: \`UYFSR-REF-MBJ2026\`) ইনপুট দিন (২০% ছাড় পাবেন)।\n` +
      `  ৪. \`01911287501\` নম্বরে সেন্ড মানি করে প্রাপ্ত TrxID (Transaction ID) ফর্মের নির্ধারিত বক্সে লিখে সাবমিট করুন।\n` +
      `  ৫. সাথে সাথেই আপনার ইমেইলে ভেরিফিকেশন ও অফিসিয়াল ট্র্যাকিং আইডি পাঠানো হবে!`,
    banglish: `💳 **Official bKash Payment Details:**\n\n` +
      `• **bKash Personal Number:** \`01911287501\`\n` +
      `• **Nagad Number:** \`01911287501\`\n` +
      `• Send Money kore TrxID copy kore registration form e submit korun.\n` +
      `• Voucher code থাকলে 20% discount paben!`,
    en: `💳 **Official Registration & bKash / Nagad Remittance Guide:**\n\n` +
      `• **Official Remittance Mobile:** \`01911287501\` (bKash Personal / Nagad)\n` +
      `• **Transaction Mode:** Send Money\n` +
      `• **Workflow:** Enter participant details, apply optional 20% Executive Voucher (\`UYFSR-REF-MBJ2026\`), remit fee to \`01911287501\`, input the 10-character alphanumeric TrxID into the portal, and receive instant cryptographic tracking credentials.`,
    actionLink: { label: 'Go to Payment Portal', href: '#register', view: 'register' }
  },

  // --- S. VOUCHER SYSTEM ---
  {
    keys: [
      'voucher', 'voucher code', 'discount voucher', 'mbj2026', 'sm2026', 'ভাউচার',
      'ডিসকাউন্ট কোড', 'রেফারেল ডিসকাউন্ট', '20% discount', 'how to get discount'
    ],
    topic: 'voucher',
    bn: `🏷️ **UYFSR এক্সিকিউটিভ রেফারেল ভাউচার সিস্টেম:**\n\n` +
      `UYFSR নির্বাহী পরিষদের সদস্যরা অংশগ্রহণকারীদের ফি ছাড়ের জন্য বিশেষ ভাউচার প্রদান করে থাকেন। যেকোনো বৈধ ভাউচার ব্যবহারে রেজিস্ট্রেশন ফিতে **২০% নিশ্চিত ছাড়** পাওয়া যায়!\n\n` +
      `**জনপ্রিয় অফিসিয়াল ভাউচার কোডসমূহ:**\n` +
      `• \`UYFSR-REF-MBJ2026\` — রেফারেল: মোস্তাফিজ বিন জিহাদ (CEO)\n` +
      `• \`UYFSR-REF-SM2026\` — রেফারেল: শাহরিয়ার মেজবা (COO)\n\n` +
      `💡 রেজিস্ট্রেশনের ২য় ধাপে পেমেন্ট করার আগে ভাউচার বক্সে কোডটি লিখে 'Apply' বাটনে চাপলেই ফি ২০% স্বয়ংক্রিয়ভাবে কমে যাবে!`,
    banglish: `🏷️ **Executive Referral Voucher Codes (20% Discount):**\n\n` +
      `• \`UYFSR-REF-MBJ2026\` (Referred by Mustafiz Bin Jihad, CEO)\n` +
      `• \`UYFSR-REF-SM2026\` (Referred by Shahriar Mejba, COO)\n\n` +
      `Registration form e Voucher Code bose Apply korle instant 20% discount paben!`,
    en: `🏷️ **Executive Referral Voucher System:**\n\n` +
      `Redeemable for an instant **20% registration fee discount** across all competitive tracks:\n` +
      `• \`UYFSR-REF-MBJ2026\` (Referred by Mustafiz Bin Jihad, CEO)\n` +
      `• \`UYFSR-REF-SM2026\` (Referred by Shahriar Mejba, COO)\n\n` +
      `Input either code in the voucher field during checkout to activate your 20% reduction.`,
    actionLink: { label: 'Register with Voucher', href: '#register', view: 'register' }
  },

  // --- T. CAMPUS AMBASSADOR (COMPLETE DETAILS & BENEFITS) ---
  {
    keys: [
      'campus ambassador', 'ambassador', 'ca', 'অ্যাম্বাসেডর', 'ক্যাম্পাস অ্যাম্বাসেডর',
      'ambassador ki free', 'ambassador fee', 'is ambassador free', 'ca perks', 'ambassador labh'
    ],
    topic: 'ambassador',
    bn: `🌟 **UYFSR ক্যাম্পাস অ্যাম্বাসেডর প্রোগ্রাম (১০০% ফ্রি):**\n\n` +
      `• **আবেদন ফি:** **১০০% সম্পূর্ণ ফ্রি!** কোনো আবেদন ফি বা গোপন খরচ নেই।\n` +
      `• **কারা আবেদন করতে পারবে:** বাংলাদেশের যেকোনো স্কুল, কলেজ, মাদ্রাসা বা বিশ্ববিদ্যালয়ের বিজ্ঞানমনস্ক ও নেতৃত্বগুণসম্পন্ন শিক্ষার্থী।\n` +
      `• **অ্যাম্বাসেডরদের বিশেষ সুযোগ-সুবিধা ও সুযোগসমূহ:**\n` +
      `  ১. সিইও (মোস্তাফিজ বিন জিহাদ) স্বাক্ষরিত অফিসিয়াল নিয়োগপত্র (Appointment Letter)।\n` +
      `  ২. ডিজিটাল অফিসিয়াল ভেরিফায়েড ই-আইডি কার্ড (E-ID Card)।\n` +
      `  ৩. মেয়াদ শেষে নেতৃত্ব ও সোশ্যাল সার্ভিসের ভেরিফায়েড সনদপত্র (Certificate of Leadership)।\n` +
      `  ৪. UYFSR-এর সকল জাতীয় অলিম্পিয়াড, সায়েন্স ফেয়ার ও আন্তর্জাতিক গবেষণা কর্মশালায় সরাসরি ফ্রি/বিশেষ ছাড়ের সুযোগ।\n` +
      `  ৫. কেন্দ্রীয় পরিচালনা পর্ষদ ও উপদেষ্টামণ্ডলীর সরাসরি মেন্টরশিপ।\n` +
      `  ৬. ৬৪ জেলার শীর্ষ তরুণ নেতাদের সাথে শক্তিশালী নেটওয়ার্কিং।\n` +
      `• **বাছাই প্রক্রিয়া:** আবেদন জমা দেওয়ার ৪৮–৭২ ঘণ্টার মধ্যে কেন্দ্রীয় সেক্রেটারিয়েট আবেদন যাচাই করে ইমেইলের মাধ্যমে ডিজিটাল পাস ও নিয়োগপত্র পাঠাবে!`,
    banglish: `🌟 **UYFSR Campus Ambassador Program (100% Free):**\n\n` +
      `• **Fee:** Strictly 100% Free! Kono application fee nei.\n` +
      `• **Eligibility:** School, college, madrasah ba university-r jekono student.\n` +
      `• **Perks:**\n` +
      `  1. Appointment Letter signed by CEO.\n` +
      `  2. Digital verified E-ID Card.\n` +
      `  3. Leadership & Service Certificate.\n` +
      `  4. Event discounts & direct executive mentorship.\n` +
      `  5. Networking across 64 districts in Bangladesh!\n` +
      `• Form submit korar 48-72 hours er moddhe email e update pathano hoy.`,
    en: `🌟 **UYFSR Campus Ambassador Leadership Fellowship:**\n\n` +
      `• **Fee:** Strictly **100% Free Guaranteed** (Zero registration or sponsorship fees).\n` +
      `• **Eligibility:** Pre-university and undergraduate scholars across all educational institutions in Bangladesh.\n` +
      `• **Fellowship Privileges:**\n` +
      `  - Official Appointment Letter executed by CEO Mustafiz Bin Jihad.\n` +
      `  - Digitally signed cryptographic E-ID Card.\n` +
      `  - Verified Certificate of Leadership & Community Service.\n` +
      `  - Priority admission and waivers for National Science Eclipse & research workshops.\n` +
      `  - Direct longitudinal mentorship from the Executive Council and Advisors.\n` +
      `• **Selection Timeline:** Reviewed within 48–72 hours by the Central Secretariat with dispatch via email.`,
    actionLink: { label: 'Apply as Campus Ambassador', href: '#ambassador', view: 'ambassador' }
  },

  // --- U. 5 CORE ACTIVITY TRACKS ---
  {
    keys: [
      '5 core activities', 'core pillars', 'কার্যক্রম', 'কাজ কি', 'পাঁচটি কার্যক্রম', 'tracks',
      'areas of work', 'what does uyfsr do'
    ],
    topic: 'activities',
    bn: `🔬 **UYFSR-এর ৫টি মূল কর্মক্ষেত্র (Core Activity Tracks):**\n\n` +
      `১. **Practical Workshops (হাতে-কলমে ল্যাব কর্মশালা):** সরাসরি ল্যাবরেটরির যন্ত্রপাতি ব্যবহার, বৈজ্ঞানিক উপাত্ত রেকর্ড ও ব্যবহারিক পরীক্ষণ পরিচালনা।\n` +
      `২. **Seminars & Expert Talks (বিশেষজ্ঞ সেমিনার):** বিশ্ববিদ্যালয় ফ্যাকাল্টি ও বিজ্ঞানীদের সাথে সরাসরি উন্মুক্ত সেশন ও উচ্চশিক্ষা ক্যারিয়ার গাইডলাইন।\n` +
      `৩. **Science Fairs & Olympiads (সায়েন্স ফেয়ার ও অলিম্পিয়াড):** পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, গণিত ও মহাকাশ বিজ্ঞানে জাতীয় প্রতিযোগিতামূলক মূল্যায়ন।\n` +
      `৪. **Quiz & Problem-Solving (কুইজ ও সমস্যা সমাধান):** দ্রুতগতির লজিক্যাল কুইজ টুর্নামেন্ট ও টিম প্রবলেম সলভিং সেশন।\n` +
      `৫. **Youth Leadership & Mentorship (যুব নেতৃত্ব ও মেন্টরশিপ):** সারাদেশে ক্যাম্পাস অ্যাম্বাসেডরদের নেতৃত্ব প্রশিক্ষণ ও প্রাতিষ্ঠানিক বিজ্ঞান ক্লাব পরিচালনা।`,
    banglish: `🔬 **UYFSR 5 Core Areas of Work:**\n\n` +
      `1. Practical Workshops (Hands-on experiments with lab apparatus)\n` +
      `2. Seminars & Expert Talks (Direct interaction with faculty & scientists)\n` +
      `3. Science Fairs & Olympiads (Physics, Chemistry, Bio, Math, Space)\n` +
      `4. Quiz & Problem-Solving (Rapid buzzer quizzes & logic puzzles)\n` +
      `5. Youth Leadership & Mentorship (Campus ambassador network across 64 districts)`,
    en: `🔬 **UYFSR Five Operational Activity Tracks:**\n\n` +
      `1. **Practical Workshops:** Apparatus manipulation, empirical protocol execution, and data verification.\n` +
      `2. **Seminars & Expert Dialogues:** Bridging scholars with university faculty mentors.\n` +
      `3. **Science Fairs & Olympiads:** Standardized national competitions across foundational sciences.\n` +
      `4. **Quiz & Problem-Solving:** High-tempo buzzer tournaments and logic decomposition challenges.\n` +
      `5. **Youth Leadership & Mentorship:** Mobilizing student organizers across institutions in 64 districts.`,
    actionLink: { label: 'Explore All 5 Tracks', href: '#activities', view: 'home', anchor: 'activities' }
  },

  // --- V. PAYMENT ISSUES, TRXID CORRECTIONS & REFUNDS ---
  {
    keys: [
      'payment issue', 'wrong trxid', 'bhul number', 'taka refund', 'ভুল নম্বরে টাকা',
      'trxid ভুল', 'টাকা ফেরত', 'payment somossa', 'payment verification failed'
    ],
    topic: 'payment',
    bn: `⚠️ **পেমেন্ট বা TrxID সংক্রান্ত সমস্যা ও সমাধানের নিয়ম:**\n\n` +
      `• **ভুল TrxID বা অন্য নম্বর থেকে টাকা পাঠালে করণীয়:** চিন্তার কোনো কারণ নেই! আপনার পেমেন্টের স্ক্রিনশট, প্রেরকের নম্বর এবং রেজিস্ট্রেশনের ট্র্যাকিং রেফারেন্স আইডি লিখে সরাসরি ইমেইল করুন: \`uyfsr.org@gmail.com\` অথবা হোয়াটসঅ্যাপ/কল করুন: \`01911287501\` / \`01824798147\` নম্বরে।\n` +
      `• **অ্যাকাউন্টস ভেরিফিকেশন:** আমাদের ফাইন্যান্স টিম ম্যানুয়ালি যাচাই করে ২৪ ঘণ্টার মধ্যে আপনার রেজিস্ট্রেশন নিশ্চিত করে কনফার্মেশন ইমেইল পাঠাবে।\n` +
      `• **রিফান্ড পলিসি:** যদি কোনো প্রযুক্তিগত কারণে দ্বিগুণ টাকা কাটা যায় বা ইভেন্ট রিশিডিউল হয়, তবে UYFSR অফিসিয়াল বিকাশ/নগদে সম্পূর্ণ টাকা ফেরত প্রদান করে।`,
    banglish: `⚠️ **Payment / TrxID Issue Resolution:**\n\n` +
      `• TrxID vul hole ba onno number theke taka pathale screenshot shoh email korun: \`uyfsr.org@gmail.com\` ba call korun \`01911287501\` / \`01824798147\` e.\n` +
      `• Finance team 24 hours er moddhe verify kore confirmation pathiye debe!`,
    en: `⚠️ **Payment & Transaction Correction Protocol:**\n\n` +
      `• **Erroneous TrxID or Sender Mismatch:** If a remittance error occurs, forward your payment screenshot, sender mobile number, and applicant tracking ID to \`uyfsr.org@gmail.com\` or WhatsApp \`01911287501\` / \`01824798147\`.\n` +
      `• **Reconciliation:** The treasury department manually reconciles discrepancies within 24 hours and issues validated entry credentials.`,
    actionLink: { label: 'Contact Secretariat', href: '#contact', view: 'home', anchor: 'contact' }
  },

  // --- W. ELIGIBILITY, TEAM VS SOLO, & OUTSIDE DHAKA ---
  {
    keys: [
      'dhakar baire', 'outside dhaka', '64 district', 'chittagong theke', 'sylhet theke',
      'rajshahi theke', 'team naki solo', 'solo or team', 'টিম', 'ঢাকার বাইরে'
    ],
    topic: 'logistics',
    bn: `🗺️ **অংশগ্রহণের যোগ্যতা, এলাকা ও দলগত নিয়মাবলী:**\n\n` +
      `• **ঢাকার বাইরে থেকে অংশগ্রহণ:** বাংলাদেশের যে কোনো জেলা (৬৪ জেলা) ও শিক্ষাপ্রতিষ্ঠান থেকে শিক্ষার্থীরা অংশগ্রহণ করতে পারবে! অলিম্পিয়াডের প্রিলিমিনারি রাউন্ড অনলাইনে অনুষ্ঠিত হয় এবং গ্র্যান্ড ফাইনাল ঢাকায় অনুষ্ঠিত হয়।\n` +
      `• **দলগত নাকি একক (Team vs Solo):**\n` +
      `  - **অলিম্পিয়াডসমূহ:** একক (Individual)। প্রতিটি শিক্ষার্থী নিজ মেধা অনুযায়ী পরীক্ষা দেবে।\n` +
      `  - **সায়েন্স ফেয়ার প্রজেক্ট ও কুইজ:** একক অথবা ২–৩ জনের দল (Team of 2–3) হয়ে প্রজেক্ট উপস্থাপন করা যায়।\n` +
      `• **কারা অংশ নিতে পারে:** ষষ্ঠ শ্রেণি থেকে দ্বাদশ শ্রেণি এবং বিশ্ববিদ্যালয় পর্যায়ের শিক্ষার্থী ও তরুণ গবেষক।`,
    banglish: `🗺️ **Participation Rules & Eligibility:**\n\n` +
      `• 64 district er jekono school/college theke join kora jabe.\n` +
      `• Olympiad individual hobe, tobe Science Project e 2-3 joner team banano jabe!\n` +
      `• Preliminary round online e ebong final Dhaka te hobe.`,
    en: `🗺️ **Participation Criteria, Team Composition & Regional Access:**\n\n` +
      `• **Nationwide Representation:** Open to students across all 64 districts in Bangladesh with hybrid preliminary stages.\n` +
      `• **Structure:** Olympiad categories are strictly individual; Project Expositions and Quiz Bowls permit collaborative teams of 2–3 delegates.\n` +
      `• **Grade Levels:** Secondary (Grade 6–10), Higher Secondary (Grade 11–12), and Pre-University scholars.`,
    actionLink: { label: 'Register for Events', href: '#register', view: 'register' }
  },

  // --- X. EXECUTIVE PORTAL & DASHBOARD TOOLS ---
  {
    keys: [
      'executive portal', 'executive login', 'dashboard', 'passkey', 'password bhule gesi',
      'portal access', 'এক্সিকিউটিভ লগইন', 'ড্যাশবোর্ড', 'পাসওয়ার্ড ভুলে গেলে'
    ],
    topic: 'portal',
    bn: `🔐 **UYFSR এক্সিকিউটিভ পোর্টাল ও সিকিউরিটি ড্যাশবোর্ড:**\n\n` +
      `• **উদ্দেশ্য:** এক্সিকিউটিভ কাউন্সিল, উপদেষ্টা ও তথ্যপ্রযুক্তি সচিবদের জন্য কেন্দ্রীয় অ্যাডমিন পোর্টাল।\n` +
      `• **ড্যাশবোর্ডের সুবিধাসমূহ:**\n` +
      `  - লাইভ অংশগ্রহণকারী তালিকা ও ট্র্যাকিং যাচাই।\n` +
      `  - ক্যাম্পাস অ্যাম্বাসেডর আবেদন পর্যালোচনা ও ডিজিটাল পাস প্রদান।\n` +
      `  - কাস্টম রেফারেল ভাউচার কোড জেনারেট করা।\n` +
      `  - এক্সিকিউটিভ মিটিং শিডিউল ও অভ্যন্তরীণ নোটিশ প্রচার।\n` +
      `• **পাসওয়ার্ড ভুলে গেলে (Forgot Password):** লগইন পেজে 'Forgot Password' বাটনে চাপলে আপনার রেজিস্টার্ড ইমেইলে সুরক্ষিত ওটিপি বা রিকভারি লিংক চলে যাবে, যার মাধ্যমে মুহূর্তেই পাসওয়ার্ড পরিবর্তন করা যায়!`,
    banglish: `🔐 **Executive Portal & Dashboard Security:**\n\n` +
      `• Official executive ra dashboard e login kore participant list, ambassador applications o vouchers manage korte paren.\n` +
      `• Password bhule gele 'Forgot Password' e click korle registered email e recovery code jabe!`,
    en: `🔐 **UYFSR Executive Governance Dashboard:**\n\n` +
      `• **Purpose:** Administrative console for Executive Council members, Advisors, and Secretariat.\n` +
      `• **Features:** Real-time registration registry, applicant verification, referral voucher administration, and council assembly scheduling.\n` +
      `• **Recovery:** Automated SMTP password recovery dispatching cryptographically secured OTPs to verified executive emails.`,
    actionLink: { label: 'Executive Portal Login', href: '#executive-login', view: 'executive-login' }
  }
]

// -----------------------------------------------------------------------------
// 3. HIGH-PRECISION QUERY MATCHER FOR ALL ORG INQUIRIES
// -----------------------------------------------------------------------------
export function matchOrgKnowledge(query: string): OrgKnowledgeItem | null {
  const qClean = query.toLowerCase().trim()

  // 1. Check specific individual partners first (e.g. "twimbol ki", "kidlon ki", "aurelix ki")
  const partnerQueries: Record<string, { bn: string; banglish: string; en: string }> = {
    twimbol: {
      bn: `🤝 **TWIMBOL — UYFSR প্রোগ্রাম ও ওয়ার্কশপ পার্টনার:**\n\nTWIMBOL হলো UYFSR-এর স্ট্র্যাটেজিক প্রোগ্রাম পার্টনার। তারা যৌথভাবে **Junior Startup Challenge (Season 1)** এবং **Junior Talent Award (Season 1)** আয়োজন করছে। এছাড়া দেশব্যাপী তরুণদের প্র্যাকটিক্যাল স্কিল ও বিজ্ঞান কর্মশালায় তারা সক্রিয় সহযোগী।`,
      banglish: `🤝 **TWIMBOL — Program & Workshop Partner:**\n\nTWIMBOL UYFSR er strategic partner, jader sathe Junior Startup Challenge ebong Junior Talent Award joint-bhabe ayojon kora hoyeche.`,
      en: `🤝 **TWIMBOL — Strategic Program & Workshop Partner:**\n\nCollaborating on interactive skill workshops and co-organizing the Junior Startup Challenge and Junior Talent Award with UYFSR.`
    },
    kidlon: {
      bn: `🏢 **KIDLON — ভেন্যু ও প্রেজেন্টিং পার্টনার:**\n\nKIDLON হলো UYFSR-এর মর্যাদাপূর্ণ ভেন্যু ও প্রেজেন্টিং পার্টনার। **Junior Talent Award – Season 1** (১৮ জুলাই ২০২৬)-এর মূল ভেন্যু এবং প্রেজেন্টিং সহযোগী হিসেবে KIDLON যুক্ত রয়েছে।`,
      banglish: `🏢 **KIDLON — Venue & Presenting Partner:**\n\nJunior Talent Award Season 1 er presenting ebong hosting venue partner holo KIDLON!`,
      en: `🏢 **KIDLON — Venue & Presenting Partner:**\n\nProviding hosting venues and acting as presenting partner for Season 1 of the Junior Talent Award.`
    },
    mejology: {
      bn: `📚 **MEJOLOGY — অ্যাকাডেমিক কনটেন্ট পার্টনার:**\n\nMEJOLOGY UYFSR-এর সাথে অ্যাকাডেমিক গবেষণার কনটেন্ট কোলাবোরেশন এবং মাধ্যমিক ও কলেজ শিক্ষার্থীদের উপযোগী বিজ্ঞান গবেষণা কারিকুলাম প্রণয়নে কাজ করছে।`,
      banglish: `📚 **MEJOLOGY — Academic Content Partner:**\n\nEmpirical research workshops ebong curriculum development e MEJOLOGY UYFSR er academic partner!`,
      en: `📚 **MEJOLOGY — Academic Content Partner:**\n\nAcademic content collaboration and curriculum development for secondary school empirical research workshops.`
    },
    astrosphere: {
      bn: `🌌 **ASTROSPHERE — অলিম্পিয়াড ও অ্যাস্ট্রোনমি কো-অর্গানাইজার:**\n\nASTROSPHERE UYFSR-এর সাথে মহাকাশ বিজ্ঞান (Space & Astronomy) সেশন পরিচালনা, অলিম্পিয়াডের প্রশ্ন প্রণয়ন এবং তরুণদের মাঝে মহাকাশ সচেতনতামূলক সেমিনার আয়োজনে কাজ করে।`,
      banglish: `🌌 **ASTROSPHERE — Olympiad & Astronomy Partner:**\n\nSpace science sessions, astronomy question panels o youth seminars e UYFSR er co-organizer ASTROSPHERE!`,
      en: `🌌 **ASTROSPHERE — Olympiad & Astronomy Co-organizer:**\n\nCo-organizing astronomical science sessions, olympiad question panels, and youth space awareness seminars.`
    },
    bayline: {
      bn: `📰 **The Bayline Journal — এডিটোরিয়াল মিডিয়া পার্টনার:**\n\nতরুণ বিজ্ঞানীদের গবেষণা প্রকাশ, ইন-ডেপথ বিজ্ঞান সাংবাদিকতা ও জাতীয় সায়েন্স ফেয়ারের বিশেষ কভারেজ প্রদান করে The Bayline Journal।`,
      banglish: `📰 **The Bayline Journal — Editorial Media Partner:**\n\nUYFSR er in-depth editorial coverage ebong science journalism publications provide kore The Bayline Journal.`,
      en: `📰 **The Bayline Journal — Editorial Media Partner:**\n\nIn-depth editorial coverage, investigative student science dispatches, and national carnival publications.`
    },
    motion: {
      bn: `🎥 **Motion BD — ব্রডকাস্ট মিডিয়া পার্টনার:**\n\nজাতীয় সায়েন্স এক্লিপ্স ও UYFSR-এর ফ্ল্যাগশিপ ইভেন্টগুলোর অফিসিয়াল ভিডিও কভারেজ, ডকুমেন্টারি ও ডিজিটাল সম্প্রচারে যুক্ত রয়েছে Motion BD।`,
      banglish: `🎥 **Motion BD — Broadcast Media Partner:**\n\nVideo coverage, documentary production ebong digital broadcast support dey Motion BD.`,
      en: `🎥 **Motion BD — Broadcast Media Partner:**\n\nVideo coverage, documentary production, and digital broadcast support for flagship science exhibitions.`
    },
    tezzfeed: {
      bn: `📱 **TezzFeed — ডিজিটাল মিডিয়া পার্টনার:**\n\nতরুণ উদ্ভাবকদের গল্প ও সায়েন্স ফেয়ারের আপডেট সোশ্যাল মিডিয়ায় দেশব্যাপী লক্ষাধিক তরুণের কাছে পৌঁছে দেয় TezzFeed।`,
      banglish: `📱 **TezzFeed — Digital Media Partner:**\n\nDigital media outreach ebong student innovator spotlight stories promote kore TezzFeed.`,
      en: `📱 **TezzFeed — Digital Media Partner:**\n\nDigital media outreach and student innovator spotlight stories across national youth social communities.`
    },
    adamjee: {
      bn: `🏫 **Adamjee School News Network and Communication Club — ক্যাম্পাস ক্লাব পার্টনার:**\n\n১ম জাতীয় জার্নালিজম কার্নিভাল ২০২৫ (1st National Journalism Carnival 2025 - ১৭–১৯ অক্টোবর ২০২৫)-এর মূল আয়োজক ও ক্যাম্পাস হোস্ট ক্লাব, যেখানে UYFSR ছিল অফিসিয়াল ওয়ার্কশপ পার্টনার।`,
      banglish: `🏫 **Adamjee School News Network & Communication Club:**\n\n1st National Journalism Carnival 2025 er host and campus partner, jar workshop partner chilo UYFSR.`,
      en: `🏫 **Adamjee School News Network & Communication Club:**\n\nCampus co-organizer and host for the 1st National Journalism Carnival 2025, collaborating on empirical reporting and media literacy clinics.`
    },
    focal: {
      bn: `🎨 **The Focal Vibe — ক্রিয়েটিভ ডিরেকশন পার্টনার:**\n\nUYFSR-এর ব্র্যান্ড ভিজ্যুয়াল আইডেন্টিটি, স্টেজ ডিজাইন ও ক্রিয়েটিভ ভিজ্যুয়াল সমন্বয় করে থাকে The Focal Vibe।`,
      banglish: `🎨 **The Focal Vibe — Creative Direction Partner:**\n\nVisual identity, creative design coordination o stagecraft aesthetics e partner The Focal Vibe.`,
      en: `🎨 **The Focal Vibe — Creative Direction Partner:**\n\nVisual identity, creative design coordination, stagecraft aesthetics, and multimedia documentation.`
    },
    yeasirians: {
      bn: `🎁 **The Yeasirians — অফিসিয়াল গিফট ও মার্চেন্ডাইজ পার্টনার:**\n\nUYFSR-এর জাতীয় অলিম্পিয়াড ও প্রতিযোগিতার বিজয়ীদের স্মারক ক্রেস্ট, মেডেল, স্পেশাল গিফট বক্স ও অফিসিয়াল মার্চেন্ডাইজ সরবরাহ করে The Yeasirians।`,
      banglish: `🎁 **The Yeasirians — Merchandise & Gift Partner:**\n\nOfficial merchandise, commemorative awards, ebong appreciation packages provide kore The Yeasirians.`,
      en: `🎁 **The Yeasirians — Merchandise & Gift Partner:**\n\nOfficial merchandise, commemorative awards, and appreciation packages for competition laureates.`
    },
    aurelix: {
      bn: `🌸 **Aurelix — অফিসিয়াল ইভেন্ট ফ্র্যাগ্রেন্স পার্টনার:**\n\nUYFSR-এর প্রতিটি ফ্ল্যাগশিপ জাতীয় সম্মেলনের প্রিমিয়াম অ্যাম্বিয়েন্ট সুগন্ধ অভিজ্ঞতা নিশ্চিত করে Aurelix।`,
      banglish: `🌸 **Aurelix — Event Fragrance Partner:**\n\nFlagship national conference e premium fragrance experience provide kore Aurelix!`,
      en: `🌸 **Aurelix — Official Event Fragrance Partner:**\n\nElevating physical congress environments through signature ambient fragrance design at national conventions.`
    }
  }

  for (const [key, partner] of Object.entries(partnerQueries)) {
    if (qClean.includes(key)) {
      return {
        keys: [],
        topic: 'partners',
        bn: partner.bn,
        banglish: partner.banglish,
        en: partner.en,
        actionLink: { label: 'Explore Partners Deck', href: '#partners', view: 'home', anchor: 'partners' }
      }
    }
  }

  // 2. Check individual executive queries first (e.g. "mustafiz er phone number", "fahim er email")
  const hasPhoneWord = qClean.includes('phone') || qClean.includes('number') || qClean.includes('নম্বর') || qClean.includes('নাম্বার') || qClean.includes('contact') || qClean.includes('mobile')
  const hasEmailWord = qClean.includes('email') || qClean.includes('mail') || qClean.includes('ইমেইল')
  const hasFbWord = qClean.includes('facebook') || qClean.includes('fb') || qClean.includes('ফেসবুক')

  for (const exec of UYFSR_EXECUTIVES_DETAIL) {
    const execMatches =
      qClean.includes(exec.name.toLowerCase()) ||
      qClean.includes(exec.nameBn.toLowerCase()) ||
      qClean.includes(exec.name.split(' ')[0].toLowerCase()) ||
      (exec.name.split(' ').length > 2 && qClean.includes(exec.name.split(' ').slice(-1)[0].toLowerCase()))

    if (execMatches) {
      if (hasPhoneWord) {
        return {
          keys: [],
          topic: 'leadership',
          bn: `📞 **${exec.nameBn} (${exec.titleBn})-এর অফিসিয়াল যোগাযোগ নম্বর:**\n\n• **মোবাইল:** \`${exec.phone}\`\n• **ইমেইল:** \`${exec.email}\`\n• **বিভাগ:** ${exec.department}\n• **ফেসবুক:** [Facebook Profile](${exec.facebook})`,
          banglish: `📞 **${exec.name} (${exec.title}) Contact:**\n\n• Mobile: ${exec.phone}\n• Email: ${exec.email}\n• Facebook: ${exec.facebook}`,
          en: `📞 **Contact Information for ${exec.name} (${exec.title}):**\n\n• **Phone:** \`${exec.phone}\`\n• **Email:** \`${exec.email}\`\n• **Department:** ${exec.department}\n• **Facebook:** [Profile Link](${exec.facebook})`,
          actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: exec.name }
        }
      }

      if (hasEmailWord) {
        return {
          keys: [],
          topic: 'leadership',
          bn: `📧 **${exec.nameBn} (${exec.titleBn})-এর অফিসিয়াল ইমেইল:**\n\n• **ইমেইল:** \`${exec.email}\`\n• **মোবাইল:** \`${exec.phone}\`\n• **বিভাগ:** ${exec.department}`,
          banglish: `📧 **${exec.name} (${exec.title}) Email:**\n\n• Email: ${exec.email}\n• Phone: ${exec.phone}`,
          en: `📧 **Email Address of ${exec.name} (${exec.title}):**\n\n• **Email:** \`${exec.email}\`\n• **Phone:** \`${exec.phone}\`\n• **Department:** ${exec.department}`,
          actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: exec.name }
        }
      }

      if (hasFbWord) {
        return {
          keys: [],
          topic: 'leadership',
          bn: `🌐 **${exec.nameBn}-এর ফেসবুক প্রোফাইল:**\n\nলিংক: [Facebook Profile](${exec.facebook})\n• মোবাইল: \`${exec.phone}\`\n• ইমেইল: \`${exec.email}\``,
          banglish: `🌐 **${exec.name} Facebook Profile:**\n\nLink: ${exec.facebook}\nPhone: ${exec.phone}`,
          en: `🌐 **Facebook Profile for ${exec.name} (${exec.title}):**\n\n• Profile: [Facebook Link](${exec.facebook})\n• Email: \`${exec.email}\``,
          actionLink: { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: exec.name }
        }
      }
    }
  }

  // 3. Direct check against all items in UYFSR_ORG_KNOWLEDGE_ITEMS
  for (const item of UYFSR_ORG_KNOWLEDGE_ITEMS) {
    if (item.keys.some((k) => qClean.includes(k.toLowerCase()))) {
      return item
    }
  }

  return null
}
