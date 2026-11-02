// =============================================================================
// ELIBOO ADVANCED CAPABILITIES & INTERACTIVE MODULES (v3.0)
// Math Solver, Science Quiz Engine, Daily Facts, Olympiad Roadmaps,
// Research Methodologies, Science Projects, and Global Scholarships
// =============================================================================

import { SCIENCE_QUIZZES, SCIENCE_FACTS, type ScienceQuizItem } from './elibooKnowledgeBase'

export interface MassiveResponseResult {
  bn: string
  banglish: string
  en: string
  actionLink?: {
    label: string
    href: string
    view?: 'home' | 'register' | 'executive-login' | 'dashboard' | 'ambassador'
    anchor?: string
  }
}

// -----------------------------------------------------------------------------
// 1. DYNAMIC MATH & SCIENTIFIC COMPUTATION ENGINE
// -----------------------------------------------------------------------------
export function evaluateMathCalculation(query: string): MassiveResponseResult | null {
  const qLower = query.toLowerCase().trim()

  // 1. Scientific Constants check
  if (
    qLower.includes('speed of light') ||
    qLower.includes('আলোর গতি') ||
    qLower.includes('alor goti') ||
    qLower === 'c'
  ) {
    return {
      bn: `⚡ **শূন্য মাধ্যমে আলোর গতিবেগ (Speed of Light, $c$):**\n\n` +
        `• **মান:** প্রায় $299,792,458\\text{ m/s}$ (প্রায় $3 \\times 10^8\\text{ m/s}$ বা সেকেন্ডে ৩ লাখ কিলোমিটার!)\n` +
        `• **তাৎপর্য:** আলবার্ট আইনস্টাইনের বিশেষ আপেক্ষিকতা (Special Relativity) অনুযায়ী মহাবিশ্বে কোনো তথ্য বা ভরযুক্ত বস্তু আলোর চেয়ে দ্রুত চলতে পারে না।\n` +
        `• **সূত্রে ব্যবহার:** $E = mc^2$ (ভর-শক্তি সমতুল্যতা)।`,
      banglish: `⚡ **Shunno maddhome Alor gotibeg (Speed of Light, c):**\n\n` +
        `• **Maan:** Pray 3 x 10^8 m/s (Sec-e pray 3 lakh kilometer!)\n` +
        `• Special relativity onusare eita universe-er ultimate cosmic speed limit!`,
      en: `⚡ **Speed of Light in Vacuum ($c$):**\n\n` +
        `• **Value:** Exactly $299,792,458\\text{ m/s}$ (approx. $3 \\times 10^8\\text{ m/s}$ or $300,000\\text{ km/s}$).\n` +
        `• **Significance:** The cosmic speed limit according to Einstein's Theory of Special Relativity.`
    }
  }

  if (
    qLower.includes('planck') ||
    qLower.includes('প্লাঙ্ক') ||
    qLower.includes('plank er dhrubok')
  ) {
    return {
      bn: `🔬 **প্লাঙ্কের ধ্রুবক (Planck's Constant, $h$):**\n\n` +
        `• **মান:** $6.62607015 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$ ($m^2\\text{ kg/s}$)\n` +
        `• **তাৎপর্য:** কোয়ান্টাম মেকানিক্সের সবচেয়ে মৌলিক ধ্রুবক। এটি ফোটনের শক্তি এবং তার কম্পাঙ্কের মধ্যকার সম্পর্ক নির্ধারণ করে ($E = hf$ বা $E = h\\nu$)।`,
      banglish: `🔬 **Planck-er Dhrubok (Planck's Constant, h):**\n\n` +
        `• **Maan:** 6.626 x 10^-34 J.s\n` +
        `• Quantum mechanics er basic constant. E = hf sutre bebohar hoy.`,
      en: `🔬 **Planck's Constant ($h$):**\n\n` +
        `• **Value:** $6.62607015 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$.\n` +
        `• **Significance:** Fundamental quantum scale constant relating photon energy to frequency ($E = h\\nu$).`
    }
  }

  if (
    qLower.includes('gravitational constant') ||
    qLower.includes('মহাকর্ষীয় ধ্রুবক') ||
    qLower.includes('gravity constant') ||
    qLower.includes('g er maan')
  ) {
    return {
      bn: `🌌 **সর্বজনীন মহাকর্ষীয় ধ্রুবক (Universal Gravitational Constant, $G$):**\n\n` +
        `• **মান:** $6.67430 \\times 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$\n` +
        `• **তাৎপর্য:** স্যার আইজ্যাক নিউটনের মহাকর্ষ সূত্রে ব্যবহৃত ধ্রুবক: $F = G \\frac{m_1 m_2}{r^2}$। পৃথিবীর অভিকর্ষজ ত্বরণ $g \\approx 9.8\\text{ m/s}^2$।`,
      banglish: `🌌 **Mohakorshiyo Dhrubok (Gravitational Constant, G):**\n\n` +
        `• **Maan:** 6.674 x 10^-11 N m^2 / kg^2\n` +
        `• Newton-er gravity sutro: F = G*(m1*m2)/r^2. Prithibir g er maan pray 9.8 m/s^2.`,
      en: `🌌 **Universal Gravitational Constant ($G$):**\n\n` +
        `• **Value:** $6.67430 \\times 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$.\n` +
        `• Standard Earth surface gravitational acceleration $g \\approx 9.80665\\text{ m/s}^2$.`
    }
  }

  if (
    qLower.includes('avogadro') ||
    qLower.includes('অ্যাভোগাড্রো') ||
    qLower.includes('avogadro shongkha')
  ) {
    return {
      bn: `🧪 **অ্যাভোগাড্রো সংখ্যা (Avogadro's Number, $N_A$):**\n\n` +
        `• **মান:** $6.02214076 \\times 10^{23}\\text{ mol}^{-1}$\n` +
        `• **তাৎপর্য:** যেকোনো পদার্থের ১ মোলে ঠিক এই পরিমাণ পরমাণু, অণু বা কণা বিদ্যমান থাকে। রসায়নের স্টয়কিওমেট্রি গণনার ভিত্তি।`,
      banglish: `🧪 **Avogadro Shongkha (Avogadro's Number, NA):**\n\n` +
        `• **Maan:** 6.022 x 10^23 ti particle/mole.\n` +
        `• 1 mole poriman er moddhe thaka onur shongkha!`,
      en: `🧪 **Avogadro's Constant ($N_A$):**\n\n` +
        `• **Value:** $6.02214076 \\times 10^{23}\\text{ mol}^{-1}$.\n` +
        `• Defines the exact number of constituent particles per mole in chemistry.`
    }
  }

  // 2. Arithmetic expression evaluator
  // e.g. "what is 25 * 4", "100 / 5", "12 + 45", "50 - 18", "2^10", "sqrt(144)"
  const cleanExpr = qLower
    .replace(/(?:what is|calculate|calculate:|eval|evaluate|কত|হবে|করো|solve|হিসাব করো)/gi, '')
    .trim()

  // Square root pattern: sqrt(x) or root x
  const sqrtMatch = cleanExpr.match(/^(?:sqrt|root|\u221A)\s*\(?(\d+(?:\.\d+)?)\)?$/i)
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1])
    const res = Math.sqrt(num)
    return {
      bn: `📐 **বর্গমূল হিসাব:** $\\sqrt{${num}} = ${res}$`,
      banglish: `📐 **Square Root Result:** sqrt(${num}) = ${res}`,
      en: `📐 **Square Root Computation:** $\\sqrt{${num}} = ${res}$`
    }
  }

  // Simple binary arithmetic: e.g. 50 + 20, 100 * 5, 2^8, 15 / 3
  const arithMatch = cleanExpr.match(/^(\d+(?:\.\d+)?)\s*([\+\-\*\/xX\^\÷])\s*(\d+(?:\.\d+)?)$/)
  if (arithMatch) {
    const a = parseFloat(arithMatch[1])
    let op = arithMatch[2].toLowerCase()
    const b = parseFloat(arithMatch[3])
    let val: number | null = null

    if (op === '+') val = a + b
    else if (op === '-') val = a - b
    else if (op === '*' || op === 'x') {
      op = '×'
      val = a * b
    } else if (op === '/' || op === '÷') {
      op = '÷'
      val = b !== 0 ? a / b : null
    } else if (op === '^') {
      val = Math.pow(a, b)
    }

    if (val !== null) {
      const valStr = Number.isInteger(val) ? val.toString() : val.toFixed(4).replace(/\.?0+$/, '')
      return {
        bn: `🔢 **গাণিতিক সমাধান:**\n\n\`${a} ${op} ${b}\` = **${valStr}**\n\n💡 *গণিত হলো সব বিজ্ঞানের মাতৃভাষা! অলিম্পিয়াড প্রস্তুতির জন্য আমাদের ম্যাথ গাইড দেখুন।*`,
        banglish: `🔢 **Mathematical Calculation:**\n\n\`${a} ${op} ${b}\` = **${valStr}**\n\n💡 Ganit holo shob bigganer chabikathi!`,
        en: `🔢 **Mathematical Computation Result:**\n\n\`${a} ${op} ${b}\` = **${valStr}**\n\n💡 *Mathematics is the foundational bedrock of all empirical research!*`
      }
    }
  }

  return null
}

// -----------------------------------------------------------------------------
// 2. INTERACTIVE SCIENCE QUIZ GENERATOR
// -----------------------------------------------------------------------------
export function getQuizResponse(query?: string): MassiveResponseResult {
  // Check if user answered a previous quiz with a number (1, 2, 3, 4)
  const qClean = (query || '').trim().toLowerCase()
  const ansMatch = qClean.match(/^(?:উত্তর|ans|option|choice|opt)?\s*([1-4১-৪])$/)
  if (ansMatch) {
    const numChar = ansMatch[1]
    const numMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, '১': 0, '২': 1, '৩': 2, '৪': 3 }
    void numMap[numChar]
    return {
      bn: `🎯 **আপনার উত্তর গ্রহণ করা হয়েছে!**\n\n` +
        `আপনি নির্বাচন করেছেন: **অপশন ${numChar}**।\n` +
        `বিজ্ঞান শিখতে নিয়মিত কুইজ চর্চা মস্তিষ্ককে দ্রুত ও শাণিত করে।\n\n` +
        `নতুন আরেকটি বৈজ্ঞানিক কুইজ খেলতে চান? লিখুন: **"Science Quiz"** বা **"কুইজ"**! 🌟`,
      banglish: `🎯 **Apnar uttor grohon kora hoyeche!**\n\n` +
        `Apni select korechen: **Option ${numChar}**.\n` +
        `Notun arekta quiz khelar jonno likhun: **"Science Quiz"**! 🌟`,
      en: `🎯 **Option ${numChar} recorded!**\n\n` +
        `Scientific inquiry thrives through iterative testing and hypothesis validation.\n` +
        `To challenge yourself with another question, type **"Science Quiz"**! 🌟`
    }
  }

  const randomIndex = Math.floor(Math.random() * SCIENCE_QUIZZES.length)
  const quiz: ScienceQuizItem = SCIENCE_QUIZZES[randomIndex]

  return {
    bn: `🧠 **দৈনিক বৈজ্ঞানিক কুইজ চ্যালেঞ্জ (Daily Science Quiz):**\n\n` +
      `❓ **প্রশ্ন:** ${quiz.questionBn}\n\n` +
      `**বিকল্পসমূহ:**\n` +
      quiz.optionsBn.map((opt) => `• ${opt}`).join('\n') +
      `\n\n💬 *উত্তর দিতে অপশন নম্বরটি লিখুন (যেমন: ১ বা 2)। এর সঠিক ব্যাখ্যা দেখতে চান? উত্তর দিয়ে দেখুন!*`,
    banglish: `🧠 **Daily Science Quiz Challenge:**\n\n` +
      `❓ **Question:** ${quiz.questionBanglish}\n\n` +
      `**Options:**\n` +
      quiz.optionsBanglish.map((opt) => `• ${opt}`).join('\n') +
      `\n\n💬 *Uttor dite option number ti likhun (jemone: 1 ba 2)!*`,
    en: `🧠 **Daily Science Quiz Challenge:**\n\n` +
      `❓ **Question:** ${quiz.questionEn}\n\n` +
      `**Options:**\n` +
      quiz.optionsEn.map((opt) => `• ${opt}`).join('\n') +
      `\n\n💬 *Type your answer option number (e.g., 1 or 2) to verify!*`
  }
}

// -----------------------------------------------------------------------------
// 3. ASTONISHING SCIENCE FACTS
// -----------------------------------------------------------------------------
export function getFactResponse(): MassiveResponseResult {
  const randomIndex = Math.floor(Math.random() * SCIENCE_FACTS.length)
  const fact = SCIENCE_FACTS[randomIndex]

  return {
    bn: `✨ **আজকের বিস্ময়কর বিজ্ঞান তথ্য (${fact.category}):**\n\n` +
      `${fact.bn}\n\n` +
      `🔍 *আরও তথ্য জানতে চান? লিখুন "আরেকটি ফ্যাক্ট" বা মহাকাশ/পদার্থবিজ্ঞান সংক্রান্ত যেকোনো প্রশ্ন জিজ্ঞাসা করুন!*`,
    banglish: `✨ **Ajker Bismoykor Biggan Tothyo (${fact.category}):**\n\n` +
      `${fact.banglish}\n\n` +
      `🔍 *Aro jante chaile likhun "Science Fact" ba jekono question korun!*`,
    en: `✨ **Astonishing Daily Science Fact (${fact.category}):**\n\n` +
      `${fact.en}\n\n` +
      `🔍 *Want more? Type "Science Fact" or ask ELiboo about any scientific concept!*`
  }
}

// -----------------------------------------------------------------------------
// 4. MATHEMATICS OLYMPIAD GUIDE (BDMO / IMO)
// -----------------------------------------------------------------------------
export function getMathOlympiadResponse(): MassiveResponseResult {
  return {
    bn: `📐 **বাংলাদেশ গণিত অলিম্পিয়াড (BDMO) ও IMO প্রস্তুতি মাস্টারক্লাস:**\n\n` +
      `গণিত অলিম্পিয়াডে মুখস্থবিদ্যার কোনো স্থান নেই; এটি সমস্যা সমাধানের মৌলিক চিন্তাশক্তির পরীক্ষা। প্রস্তুতিকে ৪টি প্রধান স্তম্ভে ভাগ করা হয়:\n\n` +
      `১. **সংখ্যাতত্ত্ব (Number Theory):**\n` +
      `• ভাজ্যতা (Divisibility), মৌলিক সংখ্যা (Prime factorization), ইউক্লিডীয় অ্যালগরিদম (GCD/LCM)\n` +
      `• মডুলার অ্যারিথমেটিক (Modular Arithmetic), ফার্মার লিটল থিওরেম (Fermat's Little Theorem), উইলসনস থিওরেম, চাইনিজ রিমেইন্ডার থিওরেম (CRT)\n\n` +
      `২. **জ্যামিতি (Geometry):**\n` +
      `• ত্রিভুজের সর্বসমতা ও সদৃশতা, সাইক্লিক কোয়াড্রিলেটারাল (Cyclic Quadrilateral)\n` +
      `• টলেমি থিওরেম (Ptolemy's Theorem), চেভা ও মেনেলাউস থিওরেম (Ceva & Menelaus)\n` +
      `• ইনসেন্টার, সারকামসেন্টার, অর্থোসেন্টার ও অয়লার লাইন (Euler Line)\n\n` +
      `৩. **কম্বিনেটোরিক্স (Combinatorics):**\n` +
      `• বিন্যাস ও সমাবেশ (Permutations & Combinations)\n` +
      `• পিজিয়নহোল প্রিন্সিপাল (Pigeonhole Principle - পায়রার খোপ নীতি)\n` +
      `• ইনক্লুশন-এক্সক্লুশন প্রিন্সিপাল ও ইনভেরিয়েন্স প্রিন্সিপাল\n\n` +
      `৪. **বীজগণিত (Algebra):**\n` +
      `• পলিনোমিয়াল (Polynomials) ও ভিয়েতার সূত্র (Vieta's Formulas)\n` +
      `• অসমতা (Inequalities): AM-GM, Cauchy-Schwarz, Chebyshev Inequality\n` +
      `• ফাংশনাল ইকুয়েশন (Functional Equations)\n\n` +
      `📚 **প্রস্তুতির জন্য সেরা বইসমূহ:**\n` +
      `• মাহবুব মজুমদারের 'গণিত অলিম্পিয়াড সমগ্র' ও মুনির হাসানের বইসমূহ\n` +
      `• *The Art and Craft of Problem Solving* — Paul Zeitz\n` +
      `• *Problem-Solving Strategies* — Arthur Engel\n` +
      `• *Challenge and Thrill of Pre-College Mathematics*\n\n` +
      `🌐 **অনলাইন প্র্যাকটিস:** Art of Problem Solving (AoPS) ফোরাম এবং বিডিএমও-এর বিগত বছরের প্রশ্নোত্তর আর্কাইভ। UYFSR প্রতি বছর অলিম্পিয়াড ওয়ার্কশপ আয়োজন করে থাকে!`,
    banglish: `📐 **BDMO & Math Olympiad Preparation Master Guide:**\n\n` +
      `Math Olympiad 4-ti main topic er upor depend kore:\n` +
      `1. **Number Theory:** Modular arithmetic, divisibility, primes, Fermat's Little Theorem.\n` +
      `2. **Geometry:** Cyclic quadrilaterals, Ptolemy's theorem, Ceva-Menelaus, triangle centers.\n` +
      `3. **Combinatorics:** Pigeonhole principle (PHP), counting, invariance.\n` +
      `4. **Algebra:** AM-GM inequality, Cauchy-Schwarz, polynomials, functional equations.\n\n` +
      `📚 **Recommended Books:**\n` +
      `• Munir Hasan & Mahbub Majumder er BDMO boi shomogro\n` +
      `• Art and Craft of Problem Solving (Paul Zeitz)\n` +
      `• AoPS (Art of Problem Solving) online community\n\n` +
      `UYFSR Science Eclipse e Math Olympiad workshop e ongsho nite register korun!`,
    en: `📐 **Comprehensive Mathematical Olympiad (BDMO / IMO) Preparation Framework:**\n\n` +
      `Olympiad mathematics is structured around four rigorous analytical domains:\n\n` +
      `• **Number Theory:** Divisibility, Euclidean algorithm, modular congruences, Fermat's Little Theorem, Euler's totient function, Diophantine equations.\n` +
      `• **Synthetic Geometry:** Circle theorems, cyclic quadrilaterals, power of a point, Ptolemy's theorem, Ceva & Menelaus theorems, projective harmonic bundles.\n` +
      `• **Combinatorics:** Bijections, generating functions, Pigeonhole Principle (PHP), double counting, invariants and monovariants.\n` +
      `• **Algebra:** Vieta's formulas, functional equations, core inequalities ($AM-GM \\ge HM$, Cauchy-Schwarz, Jensen's Inequality).\n\n` +
      `📚 **Recommended Reading:** *Problem-Solving Strategies* (Arthur Engel), *The Art and Craft of Problem Solving* (Paul Zeitz), and the Art of Problem Solving (AoPS) archive.`,
    actionLink: { label: 'Register for Science Eclipse', href: '#register', view: 'register' }
  }
}

// -----------------------------------------------------------------------------
// 5. PHYSICS OLYMPIAD GUIDE (BdPhO / IPhO)
// -----------------------------------------------------------------------------
export function getPhysicsOlympiadResponse(): MassiveResponseResult {
  return {
    bn: `⚛️ **বাংলাদেশ ফিজিক্স অলিম্পিয়াড (BdPhO) ও IPhO প্রস্তুতি গাইড:**\n\n` +
      `ফিজিক্স অলিম্পিয়াডে উচ্চমানের গাণিতিক বিশ্লেষণ এবং প্রাকৃতিক সূত্রের বাস্তব প্রয়োগের গভীর দক্ষতা যাচাই করা হয়।\n\n` +
      `১. **বলবিদ্যা (Mechanics):**\n` +
      `• দ্বিমাত্রিক গতি, রোটেশনাল ডায়নামিক্স (Rotational Dynamics), জড়তার ভ্রামক (Moment of Inertia)\n` +
      `• কৌণিক ভরবেগ সংরক্ষণশীলতা (Angular Momentum Conservation)\n` +
      `• সরল ছন্দিত স্পন্দন (SHM) ও দোলক গতি\n\n` +
      `২. **তড়িৎ ও চুম্বকত্ব (Electromagnetism):**\n` +
      `• গাউসের সূত্র (Gauss's Law), কুলম্বের সূত্র, ক্যাপাসিট্যান্স\n` +
      `• অ্যাম্পিয়ারের বর্তনী সূত্র ও বায়োট-স্যাভার্ট সূত্র\n` +
      `• ফ্যারাডের আবেশ সূত্র ও লেনজের সূত্র (Lenz's Law), ম্যাক্সওয়েল সমীকরণ\n\n` +
      `৩. **তাপগতিবিদ্যা (Thermodynamics):**\n` +
      `• কার্নো চক্র (Carnot Cycle), এনট্রপি (Entropy), তাপগতিবিদ্যার প্রথম ও দ্বিতীয় সূত্র, আদর্শ গ্যাস সমীকরণ\n\n` +
      `৪. **তরঙ্গ ও আলোকবিজ্ঞান (Waves & Optics):**\n` +
      `• অপবর্তন (Diffraction), ব্যতিচার (Interference), স্লিট এক্সপেরিমেন্ট, প্রতিসরণ ও লেন্স ফর্মুলা\n\n` +
      `৫. **আধুনিক পদার্থবিজ্ঞান (Modern Physics):**\n` +
      `• বিশেষ আপেক্ষিকতা (Special Relativity): দৈর্ঘ্য সংকোচন, কাল দীর্ঘায়ন\n` +
      `• ফোটোইলেক্ট্রিক ইফেক্ট, দ্য ব্রগলি তরঙ্গদৈর্ঘ্য, বোর মডেল\n\n` +
      `📚 **সেরা রেফারেন্স বইসমূহ:**\n` +
      `• *Physics* — Halliday, Resnick, Krane (Vol 1 & 2)\n` +
      `• *Problems in General Physics* — I.E. Irodov (উচ্চতর সমস্যার জন্য)\n` +
      `• *University Physics* — Young & Freedman\n` +
      `• *200 Puzzling Physics Problems* — Gnädig, Honyek, Riley\n\n` +
      `🔬 UYFSR সায়েন্স এক্লিপ্সে ফিজিক্স প্রবলেম সলভিং সেশন নিয়মিত অনুষ্ঠিত হয়!`,
    banglish: `⚛️ **BdPhO & Physics Olympiad Complete Roadmap:**\n\n` +
      `Physics Olympiad-e physics er deep concept ebong calculus application dorkar hoy:\n` +
      `1. **Mechanics:** Rotational motion, moment of inertia, angular momentum, gravitation.\n` +
      `2. **Electromagnetism:** Gauss's law, Biot-Savart, Faraday's induction, LC circuits.\n` +
      `3. **Thermodynamics:** Carnot engine, entropy, adiabatic processes.\n` +
      `4. **Optics & Waves:** Wave equation, diffraction, thin lens.\n` +
      `5. **Modern Physics:** Special relativity (time dilation, gamma factor), photoelectric effect.\n\n` +
      `📚 **Standard Books:**\n` +
      `• Halliday Resnick Krane (HRK) Vol 1 & 2\n` +
      `• I.E. Irodov - Problems in General Physics\n` +
      `• University Physics (Young & Freedman)\n\n` +
      `Science Eclipse e join kore practice session gulo miss korben na!`,
    en: `⚛️ **International Physics Olympiad (BdPhO / IPhO) Syllabus & Rigorous Training Plan:**\n\n` +
      `Mastering competitive physics requires fluid fluency in multi-variable calculus, differential equations, and physical intuition across five core pillars:\n\n` +
      `• **Classical Mechanics:** Rigid-body rotational dynamics, tensor moments of inertia, Lagrangian mechanics fundamentals, non-inertial frames & Coriolis forces.\n` +
      `• **Electrodynamics:** Maxwell's equations in differential and integral forms, Poynting vectors, electromagnetic induction, multipole expansions.\n` +
      `• **Thermodynamics & Statistical Physics:** Microstates, Boltzmann distribution, Carnot heat pumps, thermodynamic potentials ($U, H, F, G$).\n` +
      `• **Wave Mechanics & Physical Optics:** Wave propagation, Fourier decomposition, Fresnel and Fraunhofer diffraction, polarization optics.\n` +
      `• **Special Relativity & Quantum Origins:** Lorentz transforms, Minkowski 4-vectors, relativistic energy-momentum $E^2 = (pc)^2 + (m_0c^2)^2$, Compton scattering.\n\n` +
      `📚 **Canonical Literature:** *Halliday, Resnick & Krane*, *I.E. Irodov*, and *200 Puzzling Physics Problems*.`,
    actionLink: { label: 'Register for Science Eclipse', href: '#register', view: 'register' }
  }
}

// -----------------------------------------------------------------------------
// 6. JUNIOR SCIENCE OLYMPIAD (BdJSO / IJSO)
// -----------------------------------------------------------------------------
export function getJuniorOlympiadResponse(): MassiveResponseResult {
  return {
    bn: `🌟 **বাংলাদেশ জুনিয়র সায়েন্স অলিম্পিয়াড (BdJSO) ও IJSO প্রস্তুতি:**\n\n` +
      `অনূর্ধ্ব-১৬ বা ষষ্ঠ থেকে দশম শ্রেণীর শিক্ষার্থীদের জন্য সবচেয়ে সম্মানজনক আন্তর্জাতিক প্রতিযোগিতা হলো International Junior Science Olympiad (IJSO)। এটিতে পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞানের সমন্বিত জ্ঞান যাচাই করা হয়।\n\n` +
      `• **পদার্থবিজ্ঞান বিভাগ:** নিউটনের গতিসূত্র, কাজ ও শক্তি, সহজ বর্তনী, আলোর প্রতিফলন ও প্রতিসরণ, চাপ ও প্লবতা (আর্কিমিডিসের নীতি)।\n` +
      `• **রসায়ন বিভাগ:** পর্যায় সারণী ও মৌলের ধর্ম, রাসায়নিক বন্ধন (আয়নিক ও সমযোজী), মোল ধারণা ও স্টয়কিওমেট্রি, অ্যাসিড-ক্ষার-লবণ ও pH স্কেল।\n` +
      `• **জীববিজ্ঞান বিভাগ:** কোষের গঠন ও অর্গানেলসমূহ, সালোকসংশ্লেষণ ও শ্বসন প্রক্রিয়া, মানবদেহের সংবহন ও পরিপাকতন্ত্র, মেন্ডেলের বংশগতি সূত্র ও জিনতত্ত্ব।\n\n` +
      `🎯 **প্রস্তুতির ধাপসমূহ:**\n` +
      `১. পাঠ্যবইয়ের কনসেপ্ট মুখস্থ না করে খুঁটিনাটি বুঝে পড়া।\n` +
      `২. বিগত বছরের BdJSO প্রশ্নপত্র সমাধান করা।\n` +
      `৩. বৈজ্ঞানিক এক্সপেরিমেন্ট ও ল্যাব টেস্টের মূলনীতি বোঝা (IJSO-তে থিওরি ছাড়াও এক্সপেরিমেন্টাল পরীক্ষা থাকে)।\n\n` +
      `UYFSR জুনিয়র গবেষক ও স্কুল শিক্ষার্থীদের জন্য নিয়মিত মেন্টরশিপ সেশন প্রদান করে থাকে!`,
    banglish: `🌟 **BdJSO & IJSO Junior Science Olympiad Preparation:**\n\n` +
      `Class 6-10 er student-der jonno combined science competition:\n` +
      `• **Physics:** Motion, Force, Energy, Current, Optics.\n` +
      `• **Chemistry:** Periodic table, chemical bonding, mole calculations, acids & bases.\n` +
      `• **Biology:** Cell biology, photosynthesis, human physiology, genetics.\n\n` +
      `Previous BdJSO question papers solve kora shuru korun. UYFSR er workshop gulo apnake shera guide debe!`,
    en: `🌟 **Junior Science Olympiad (BdJSO / IJSO) Tri-Disciplinary Framework:**\n\n` +
      `Tailored for pre-university scholars under age 16 across three integrated sciences:\n` +
      `• **Physics:** Mechanics, hydrostatics (Archimedes principle), basic circuits, geometric optics.\n` +
      `• **Chemistry:** Atomic structure, stoichiometric equilibria, molarity calculations, redox fundamentals.\n` +
      `• **Biology:** Cytology, energetic metabolism (photosynthesis & cellular respiration), Mendelian genetics.\n` +
      `Includes theoretical exams and competitive laboratory experiments.`,
    actionLink: { label: 'Register for Science Eclipse', href: '#register', view: 'register' }
  }
}

// -----------------------------------------------------------------------------
// 7. RESEARCH METHODOLOGY MASTERCLASS
// -----------------------------------------------------------------------------
export function getResearchMethodologyResponse(): MassiveResponseResult {
  return {
    bn: `🔬 **কীভাবে বৈজ্ঞানিক গবেষণা শুরু করবেন: কমপ্লিট মেথডোলজি গাইড**\n\n` +
      `স্কুল ও কলেজ থেকেই আন্তর্জাতিক মানের গবেষণা শুরু করা পুরোপুরি সম্ভব। এর সুনির্দিষ্ট রোডম্যাপ নিম্নরূপ:\n\n` +
      `১. **টপিক নির্বাচন ও রিসার্চ প্রশ্ন (Research Question):**\n` +
      `• আপনি যে বিষয়ে উৎসাহী তা নির্বাচন করুন (যেমন: নবায়নযোগ্য শক্তি, জৈবপ্রযুক্তি, জলবায়ু পরিবর্তন, বা মেশিন লার্নিং)।\n` +
      `• প্রশ্নটি সুনির্দিষ্ট ও পরিমাপযোগ্য হতে হবে।\n\n` +
      `২. **লিটারেচার রিভিউ (Literature Review):**\n` +
      `• গুগল স্কলার (Google Scholar), ResearchGate, PubMed, arXiv থেকে প্রকাশিত পেপার পড়ুন।\n` +
      `• 'Research Gap' খুঁজে বের করুন—অর্থাৎ পূর্ববর্তী বিজ্ঞানীরা ঠিক কোন প্রশ্নের সমাধান এখনো করতে পারেননি।\n\n` +
      `৩. **হাইপোথিসিস ও মেথডোলজি ডিজাইন (Methodology):**\n` +
      `• হাইপোথিসিস গঠন করুন।\n` +
      `• ডেটা সংগ্রহের বৈজ্ঞানিক পদ্ধতি নির্ধারণ করুন (ল্যাব এক্সপেরিমেন্ট, ফিল্ড সার্ভে বা কম্পিউটেশনাল সিমুলেশন)।\n` +
      `• কন্ট্রোল ভেরিয়েবল ও ইন্ডিপেনডেন্ট ভেরিয়েবল কঠোরভাবে নিয়ন্ত্রণ করুন।\n\n` +
      `৪. **ডেটা বিশ্লেষণ (Data Analysis):**\n` +
      `• পাইথন (Pandas/Matplotlib), R বা এক্সেলের মাধ্যমে পরিসংখ্যানগত বিশ্লেষণ ও গ্রাফ তৈরি করুন।\n` +
      `• স্ট্যাটিস্টিক্যাল তাৎপর্য (p-value, error bars) যাচাই করুন।\n\n` +
      `৫. **পেপার লেখা (IMRaD Structure):**\n` +
      `• **Introduction:** সমস্যাটি কেন গুরুত্বপূর্ণ?\n` +
      `• **Methods:** আপনি কাজটি কীভাবে করলেন? (যেন অন্য যে কেউ পুনরাবৃত্তি করতে পারে)\n` +
      `• **Results:** ফলাফলের গ্রাফ ও টেবিল।\n` +
      `• **Discussion:** ফলাফলের অন্তর্নিহিত অর্থ এবং সীমাবদ্ধতা।\n\n` +
      `৬. **প্রকাশনা ও কনফারেন্স:**\n` +
      `• সায়েন্স ফেয়ার বা আন্তর্জাতিক জার্নালে সাবমিট করুন। UYFSR গবেষণা প্রবন্ধে মেন্টরশিপ ও পেপার রিভিউ প্রদান করে!`,
    banglish: `🔬 **How to Start Scientific Research - Step-by-Step Guide:**\n\n` +
      `1. **Research Question:** Specific and measurable topic select korun.\n` +
      `2. **Literature Review:** Google Scholar, arXiv e published paper pore research gap khujun.\n` +
      `3. **Methodology:** Experiment ba simulation design korun with proper control variables.\n` +
      `4. **Data Analysis:** Python, R ba Excel diye graph o statistical p-value check korun.\n` +
      `5. **Paper Writing (IMRaD):** Introduction, Methods, Results, Discussion format e likhun.\n\n` +
      `UYFSR Youth Research Fellowship e apply kore mentor der theke direct guideline nite paren!`,
    en: `🔬 **Empirical Research Methodology Architecture:**\n\n` +
      `A rigorous primer for early-career student researchers:\n\n` +
      `1. **Formulating the Research Question:** Identify specific, falsifiable, and quantifiable inquiries within current scientific frontiers.\n` +
      `2. **Systematic Literature Review:** Query Google Scholar, arXiv, PubMed, and IEEE Xplore. Identify critical methodological limitations in existing publications (the research gap).\n` +
      `3. **Experimental / Computational Design:** Isolate independent, dependent, and confounding variables. Establish double-blind control protocols where applicable.\n` +
      `4. **Statistical Rigor & Data Visualization:** Evaluate variance via ANOVA, confidence intervals ($95\\%$ CI), and $p$-values. Plot via Python Matplotlib/Seaborn or R.\n` +
      `5. **Manuscript Synthesis (IMRaD):** Adhere to canonical Introduction, Methodology, Results, and Discussion structures with strict citation hygiene (BibTeX/Zotero).`,
    actionLink: { label: 'Register as UYFSR Ambassador', href: '#ambassador', view: 'ambassador' }
  }
}

// -----------------------------------------------------------------------------
// 8. SCIENCE PROJECT IDEAS BY CATEGORY
// -----------------------------------------------------------------------------
export function getProjectIdeasResponse(): MassiveResponseResult {
  return {
    bn: `💡 **বিজ্ঞান মেলা ও জাতীয় প্রতিযোগিতার জন্য উদ্ভাবনী প্রজেক্ট আইডিয়া:**\n\n` +
      `১. **পরিবেশ ও গ্রিন এনার্জি (Green Energy & Eco-Tech):**\n` +
      `• **কলা বা আলুর খোসা থেকে বায়োপ্লাস্টিক তৈরি:** পচনশীল এবং শতভাগ পরিবেশবান্ধব প্লাস্টিক বিকল্প।\n` +
      `• **সোলার ট্র্যাকার স্মার্ট ইরিগেশন:** সূর্যের গতির সাথে সৌর প্যানেল ঘোরা এবং মাটির আর্দ্রতা মেপে স্বয়ংক্রিয় সেচ ব্যবস্থা।\n` +
      `• **লো-কস্ট আর্সেনিক ফিল্টার:** স্থানীয় উপাদান (বালু, কাঠকয়লা ও আয়রন চিপস) দিয়ে গ্রামীণ নিরাপদ পানির প্রযুক্তি।\n\n` +
      `২. **স্মার্ট আইওটি ও রোবোটিক্স (IoT & Robotics):**\n` +
      `• **ভূমিকম্প সতর্কীকরণ সিস্টেম:** সস্তা অ্যাক্সেলেরোমিটার সেন্সর এবং আরডুইনো ব্যবহার করে পি-ওয়েভ শনাক্তকরণ অ্যালার্ম।\n` +
      `• **ড্রোন ভিত্তিক ফসল রোগ শনাক্তকরণ:** ওপেনসিভি (OpenCV) এবং কম্পিউটার ভিশন দিয়ে ফসলের পাতার রোগ নির্ণয়।\n` +
      `• **দৃষ্টিপ্রতিবন্ধীদের জন্য স্মার্ট চশমা:** আল্ট্রাসোনিক সেন্সর এবং হ্যাপটিক ভাইব্রেশন সমন্বিত পথনির্দেশক গ্লাস।\n\n` +
      `৩. **স্বাস্থ্য ও বায়োটেকনোলজি (Biotech & Health):**\n` +
      `• **ভেষজ উদ্ভিদের অ্যান্টিমাইক্রোবিয়াল কার্যকারিতা:** নিম, তুলসী বা হলুদের নির্যাস দিয়ে সাধারণ ব্যাকটেরিয়ার বিস্তার রোধ পরীক্ষা।\n` +
      `• **স্মার্ট বর্জ্য বাছাইকরণ ডাস্টবিন:** সেন্সরের মাধ্যমে বায়োডিগ্রেডেবল ও নন-বায়োডিগ্রেডেবল বর্জ্য স্বয়ংক্রিয়ভাবে আলাদা করার সিস্টেম।\n\n` +
      `🚀 যেকোনো প্রজেক্ট সফল করতে প্রয়োজন সুন্দর প্রেজেন্টেশন ও স্পষ্ট বৈজ্ঞানিক যুক্তি। আপনার প্রজেক্টটি আমাদের Science Eclipse ইভেন্টে উপস্থাপন করতে পারেন!`,
    banglish: `💡 **Innovative Science Fair & Exhibition Project Ideas:**\n\n` +
      `1. **Green Energy:**\n` +
      `• Bioplastics from banana peels\n` +
      `• Arduino-based Dual-axis Solar Tracker with soil moisture auto-irrigation\n` +
      `• Low-cost organic water purification using moringa seeds & charcoal\n\n` +
      `2. **IoT & Robotics:**\n` +
      `• Early earthquake detection system using MPU6050 accelerometer\n` +
      `• AI plant disease classifier using Raspberry Pi & OpenCV\n` +
      `• Smart ultrasonic walking glasses for visually impaired individuals\n\n` +
      `Science Eclipse e ei doroner project show korar bishal sujog ache! Register kore fellun.`,
    en: `💡 **Award-Winning Science Fair & STEM Innovation Project Blueprints:**\n\n` +
      `• **Biotechnology & Sustainable Materials:** Synthesis of biodegradable bioplastics via starch polymer cross-linking; antimicrobial quantification of endemic botanical extracts.\n` +
      `• **Autonomous Embedded Systems (IoT):** Microcontroller-driven dual-axis photovoltaic solar trackers; seismic P-wave telemetry sensors for micro-earthquake early alert.\n` +
      `• **Applied AI for Agriculture:** Edge-deployed convolutional neural networks (CNNs) for real-time foliar pathogen classification on low-power devices.`,
    actionLink: { label: 'Register Your Project', href: '#register', view: 'register' }
  }
}

// -----------------------------------------------------------------------------
// 9. HIGHER STUDY & GLOBAL SCHOLARSHIPS ROADMAP
// -----------------------------------------------------------------------------
export function getHigherStudyResponse(): MassiveResponseResult {
  return {
    bn: `🎓 **বিদেশে উচ্চশিক্ষা ও ফুল-ফান্ডেড স্কলারশিপ অর্জনের সম্পূর্ণ গাইডলাইন:**\n\n` +
      `বিজ্ঞান ও প্রযুক্তিতে আন্তর্জাতিক পর্যায়ে উচ্চশিক্ষার জন্য প্রস্তুতি নেওয়ার সঠিক সময় হলো আপনার স্কুল-কলেজ ও অনার্স জীবন থেকেই।\n\n` +
      `🌍 **বিশ্বের শীর্ষস্থানীয় ফুল-ফান্ডেড স্কলারশিপসমূহ:**\n` +
      `১. **যুক্তরাষ্ট্র (USA) ফিসেস অ্যাসিস্ট্যান্টশিপ (RA/TA):** বেশিরভাগ আমেরিকান বিশ্ববিদ্যালয়ের STEM বিষয়ের PhD ও অনেক MS প্রোগ্রামে ১০০% টিউশন ফি মওকুফের পাশাপাশি প্রতি মাসে $২,০০০ - $৩,৫০০ পর্যন্ত জীবনযাত্রার ভাতা (Stipend) দেওয়া হয়।\n` +
      `২. **Erasmus Mundus (ইউরোপ):** ইউরোপের একাধিক দেশের সেরা বিশ্ববিদ্যালয়ে পড়ার স্কলারশিপ, যাতে সম্পূর্ণ খরচ ও মাসিক ভাতা দেওয়া হয়।\n` +
      `৩. **DAAD স্কলারশিপ (জার্মানি):** ইউরোপের ইঞ্জিনিয়ারিং ও সায়েন্সের প্রাণকেন্দ্র জার্মানিতে বিনামূল্যে পড়ার অসাধারণ সুযোগ।\n` +
      `৪. **MEXT স্কলারশিপ (জাপান):** জাপান সরকারের শীর্ষ স্কলারশিপ যা আন্ডারগ্রাজুয়েট ও পোস্টগ্রাজুয়েট দুই স্তরেই দেওয়া হয়।\n` +
      `৫. **Chevening (যুক্তরাজ্য) ও Fulbright (যুক্তরাষ্ট্র):** নেতৃত্ব ও একাডেমিক উৎকর্ষের জন্য সর্বজনবিদিত মাস্টার্স স্কলারশিপ।\n\n` +
      `📋 **একটি শক্তিশালী প্রোফাইল তৈরির ৫টি মূল স্তম্ভ:**\n` +
      `• **একাডেমিক ফলাফল (CGPA):** যত বেশি রাখা সম্ভব।\n` +
      `• **গবেষণা ও প্রকাশনা (Research Papers):** পিয়ার-রিভিউড জার্নাল বা কনফারেন্সে পেপার থাকলে স্কলারশিপের সম্ভাবনা বহুগুণ বেড়ে যায়।\n` +
      `• **ভাষাগত দক্ষতা:** IELTS (সাধারণত ৬.৫ - ৭.৫) বা TOEFL স্কোর।\n` +
      `• **স্ট্যান্ডার্ডাইজড টেস্ট:** গ্র্যাজুয়েট লেভেলে GRE স্কোর।\n` +
      `• **SOP (Statement of Purpose):** নিজের গবেষণার লক্ষ্য ও আগ্রহ স্পষ্টভাবে তুলে ধরা।\n\n` +
      `UYFSR নেটওয়ার্কে দেশ-বিদেশের অনেক সফল গবেষক যুক্ত আছেন যারা নিয়মিত তরুণদের পরামর্শ দেন!`,
    banglish: `🎓 **Higher Studies & Fully Funded Scholarship Master Roadmap:**\n\n` +
      `Top global STEM scholarships:\n` +
      `1. **US Universities RA/TA:** 100% tuition waiver + monthly stipend ($2000-$3500) for MS/PhD.\n` +
      `2. **Erasmus Mundus (Europe):** Multi-country EU masters scholarship with full travel and living costs.\n` +
      `3. **DAAD (Germany):** Best for engineering & technology in Germany.\n` +
      `4. **MEXT (Japan):** Japanese Government scholarship for Undergraduate & Graduate studies.\n` +
      `5. **Fulbright (USA) & Chevening (UK):** Prestigious leadership master's scholarships.\n\n` +
      `Key Profile Drivers: CGPA, Research Publications, IELTS/GRE, and exceptional SOP writing!`,
    en: `🎓 **Global Higher Study & Fully-Funded STEM Scholarship Strategic Roadmap:**\n\n` +
      `Securing competitive graduate fellowships requires meticulous longitudinal profile development:\n\n` +
      `• **North American Assistantships (RA / TA):** Graduate Research and Teaching Assistantships provide $100\\%$ tuition remission plus living stipends ($24,000–$42,000/year).\n` +
      `• **Erasmus Mundus Joint Masters (EU):** Comprehensive European consortium grant funding cross-border degrees.\n` +
      `• **National Grants:** German DAAD, Japanese MEXT, British Chevening, and US Fulbright.\n` +
      `• **Core Metrics:** Research output (IEEE/Springer index), quantitative GRE scores, high GPA, IELTS 7.5+, and a research-driven Statement of Purpose (SOP).`
  }
}

// -----------------------------------------------------------------------------
// 10. SCIENTISTS & BANGLADESHI PIONEERS
// -----------------------------------------------------------------------------
export function getScientistsPioneersResponse(): MassiveResponseResult {
  return {
    bn: `🏛️ **বিজ্ঞানের কিংবদন্তি ও বাংলাদেশি পথিকৃৎ বিজ্ঞানীগণ:**\n\n` +
      `আমাদের ভূখণ্ড এবং পৃথিবীর ইতিহাসকে যেসব মহান বিজ্ঞানী বদলে দিয়েছেন:\n\n` +
      `১. **স্যার জগদীশ চন্দ্র বসু (Sir J.C. Bose):**\n` +
      `• বেতার তরঙ্গের (Microwaves & Radio) অন্যতম পথপ্রদর্শক। তিনিই প্রথম মিলিমিটার তরঙ্গের ক্রিস্টাল ডিটেক্টর আবিষ্কার করেন।\n` +
      `• ক্রেস্কোগ্রাফ (Crescograph) উদ্ভাবনের মাধ্যমে উদ্ভিদের প্রাণ ও অনুভূতিশীলতা বৈজ্ঞানিকভাবে প্রমাণ করেন।\n\n` +
      `২. **সত্যেন্দ্রনাথ বসু (Satyendra Nath Bose):**\n` +
      `• 'বোস-আইনস্টাইন পরিসংখ্যান' (Bose-Einstein Statistics) এবং 'বোস-আইনস্টাইন ঘনীভবন'-এর আবিষ্কারক।\n` +
      `• তাঁর নামানুসারেই পদার্থবিজ্ঞানের মৌলিক কণা "বোসন" (Boson / যেমন হিগস বোসন)-এর নামকরণ করা হয়েছে!\n\n` +
      `৩. **ড. জামাল নজরুল ইসলাম (Dr. Jamal Nazrul Islam):**\n` +
      `• বিশ্বখ্যাত গাণিতিক পদার্থবিদ ও কসমোলজিস্ট। কেমব্রিজ বিশ্ববিদ্যালয়ের খ্যাতিমান গবেষক ও স্টিফেন হকিং-এর ঘনিষ্ঠ সহকর্মী।\n` +
      `• তাঁর রচিত *The Ultimate Fate of the Universe* বইটি মহাবিশ্বের ভবিষ্যৎ নির্ধারণে আন্তর্জাতিক মাইলফলক।\n\n` +
      `৪. **ড. মাকসুদুল আলম (Dr. Maqsudul Alam):**\n` +
      `• পাট এবং ছত্রাকের জীবনরহস্য (Genome Sequencing) উন্মোচনকারী যুগান্তকারী বাংলাদেশি জিনবিজ্ঞানী।\n\n` +
      `৫. **আন্তর্জাতিক মহাতারকাগণ:**\n` +
      `• আলবার্ট আইনস্টাইন (আপেক্ষিকতা), মেরি কুরি (তেজস্ক্রিয়তা ও দ্বৈত নোবেল), আইজ্যাক নিউটন (বলবিদ্যা ও ক্যালকুলাস), রিচার্ড ফাইনম্যান (কোয়ান্টাম ইলেকট্রোডাইনামিক্স)।`,
    banglish: `🏛️ **Bangladeshi & Global Science Legends:**\n\n` +
      `1. **Sir Jagadish Chandra Bose:** Wireless communication er pioner ebong Crescograph diye gacher pran praman koren.\n` +
      `2. **Satyendra Nath Bose:** Bose-Einstein statistics er jonok; boson konika tar nam onusare!\n` +
      `3. **Dr. Jamal Nazrul Islam:** Cosmologist & author of "The Ultimate Fate of the Universe", Stephen Hawking-er collaborator.\n` +
      `4. **Dr. Maqsudul Alam:** Paat (Jute) er genome sequence abishkarok.\n` +
      `5. Global legends: Newton, Einstein, Marie Curie, Feynman!`,
    en: `🏛️ **Scientific Luminaries & Bangladeshi Pioneers in STEM History:**\n\n` +
      `• **Sir Jagadish Chandra Bose:** Pioneer of 60 GHz millimeter microwave telecommunication and inventor of the crescograph for plant electrophysiology.\n` +
      `• **Satyendra Nath Bose:** Founder of Bose-Einstein quantum statistics; the fundamental particle class *Boson* bears his surname.\n` +
      `• **Prof. Jamal Nazrul Islam:** Theoretical physicist, cosmologist at Cambridge, and author of *The Ultimate Fate of the Universe*.\n` +
      `• **Dr. Maqsudul Alam:** Renowned geneticist who deciphered the genomic sequencing of jute (*Corchorus*) and rubber.`
  }
}

// -----------------------------------------------------------------------------
// 11. MENTAL HEALTH & SCIENTIFIC STUDY TIPS
// -----------------------------------------------------------------------------
export function getMentalHealthExamTipsResponse(): MassiveResponseResult {
  return {
    bn: `📚 **পড়াশোনায় গভীর মনোযোগ ও পরীক্ষার ভয় দূর করার বৈজ্ঞানিক টেকনিক:**\n\n` +
      `১. **Feynman Technique (ফাইনম্যান টেকনিক):** যেকোনো কঠিন কনসেপ্ট এমনভাবে সহজ ভাষায় অন্যকে বা নিজেকে বোঝান যেন আপনি একজন ১০ বছরের শিশুকে শেখাচ্ছেন। জটিল শব্দ বাদ দিয়ে সহজ করতে পারলেই বুঝতে পারবেন আপনার কনসেপ্ট শতভাগ ক্লিয়ার!\n` +
      `২. **Pomodoro Technique (পোমোডোরো):** একটানা ৩-৪ ঘণ্টা না পড়ে ২৫ মিনিট গভীর মনোযোগে পড়ুন, এরপর ৫ মিনিট বিশ্রাম নিন। ৪টি সাইকেল শেষে একটি দীর্ঘ ২০ মিনিটের বিরতি নিন। এতে মস্তিষ্ক সতেজ থাকে।\n` +
      `৩. **Active Recall (অ্যাক্টিভ রিকল):** বারবার রিডিং না পড়ে চোখ বন্ধ করে বা খাতায় না দেখে লেখার চেষ্টা করুন মস্তিষ্ক কতটুকু মনে করতে পারছে। এটি মেমোরিকে বহু গুণ স্থায়ী করে।\n` +
      `৪. **পর্যাপ্ত ঘুম:** পরীক্ষার আগের রাতে অন্তত ৭-৮ ঘণ্টা ঘুম অত্যন্ত জরুরি। ঘুমের মধ্যেই মস্তিষ্ক স্মৃতি স্থায়ীভাবে সংরক্ষণ করে।\n\n` +
      `বিশ্বাস রাখুন নিজের ওপর, বিজ্ঞান আপনার চিন্তার শক্তি বাড়িয়ে দেবে! 🌟`,
    banglish: `📚 **Scientific Study Techniques for Exams:**\n\n` +
      `১. **Feynman Technique:** কোনো টপিক সহজ ভাষায় ছোট বাচ্চাকে যেভাবে বোঝাতেন সেভাবে নিজেকে বুঝিয়ে বলুন।\n` +
      `২. **Pomodoro Technique:** ২৫ মিনিট পড়া + ৫ মিনিট বিরতি।\n` +
      `৩. **Active Recall:** বই বন্ধ করে নিজে নিজে রিভাইজ করার চেষ্টা করুন।\n` +
      `৪. স্ট্রেস নেবেন না, পর্যাপ্ত পানি পান করুন ও ঠিকমতো ঘুমান! UYFSR আপনার পাশে আছে। 🌟`,
    en: `📚 **Cognitive Science Study Strategies for Academic Mastery:**\n\n` +
      `• **The Feynman Technique:** Simplify complex paradigms to first principles as if teaching a beginner.\n` +
      `• **The Pomodoro System:** 25-minute focused cognitive sprint + 5-minute restorative interval.\n` +
      `• **Active Recall & Spaced Repetition:** Testing retrieval memory rather than passive re-reading.\n` +
      `• **Sleep Consolidation:** 7–8 hours of restorative sleep essential for neural synaptic consolidation. 🌟`
  }
}

// -----------------------------------------------------------------------------
// 12. CALCULATION & FORMULA CHEAT SHEET
// -----------------------------------------------------------------------------
export function getCalculationOrFormulaResponse(): MassiveResponseResult {
  return {
    bn: `🧪 **পদার্থবিজ্ঞান ও রসায়নের অতিপ্রয়োজনীয় বৈজ্ঞানিক সূত্রাবলি (Formula Sheet):**\n\n` +
      `• **গতি ও বলবিদ্যা:**\n` +
      `  - $v = u + at$\n` +
      `  - $s = ut + \\frac{1}{2}at^2$\n` +
      `  - $v^2 = u^2 + 2as$\n` +
      `  - $F = ma$ (নিউটনের ২য় সূত্র)\n` +
      `  - $W = Fs\\cos\\theta$ (কাজ)\n` +
      `  - $E_k = \\frac{1}{2}mv^2$ (গতিশক্তি) | $E_p = mgh$ (বিভবশক্তি)\n\n` +
      `• **ভর-শক্তি ও কোয়ান্টাম:**\n` +
      `  - $E = mc^2$ (আইনস্টাইনের ভর-শক্তি সমতুল্যতা)\n` +
      `  - $E = hf = \\frac{hc}{\\lambda}$ (ফোটন শক্তি)\n\n` +
      `• **তড়িৎ ও তাপগতিবিদ্যা:**\n` +
      `  - $V = IR$ (ওহমের সূত্র)\n` +
      `  - $P = VI = I^2R = \\frac{V^2}{R}$ (বৈদ্যুতিক ক্ষমতা)\n` +
      `  - $PV = nRT$ (আদর্শ গ্যাস সূত্র)\n\n` +
      `💡 *কোনো নির্দিষ্ট সমীকরণ হিসাব করতে চাইলে সমীকরণটি লিখুন, যেমন: "5 * 10" বা "sqrt(16)"!*`,
    banglish: `🧪 **Important Physics & Chemistry Formulas:**\n\n` +
      `• Motion: v = u + at, s = ut + 0.5*a*t^2, v^2 = u^2 + 2as\n` +
      `• Mechanics: F = ma, W = Fs, Ek = 0.5*m*v^2, Ep = mgh\n` +
      `• Einstein Mass-Energy: E = mc^2\n` +
      `• Quantum: E = hf = hc/lambda\n` +
      `• Electricity: V = IR, P = VI\n` +
      `• Gas: PV = nRT\n\n` +
      `Specific calculation korte chaile type korun: jemon "100 / 4" ba "sqrt 25"!`,
    en: `🧪 **Fundamental Scientific Equation Reference Sheet:**\n\n` +
      `• **Classical Mechanics:** $v = u + at$, $s = ut + \\frac{1}{2}at^2$, $F = ma$, $E_k = \\frac{1}{2}mv^2$\n` +
      `• **Relativity & Quantum:** $E = mc^2$, $E = h\\nu = \\frac{hc}{\\lambda}$\n` +
      `• **Electrodynamics:** $V = IR$, $P = VI$, $F = q(E + v \\times B)$\n` +
      `• **Thermodynamics:** $PV = nRT$, $\\Delta U = Q - W$, $S = k_B \\ln \\Omega$\n\n` +
      `To perform arithmetic or evaluate constants, input the expression directly (e.g., \`sqrt(144)\` or \`2^10\`)!`
  }
}
