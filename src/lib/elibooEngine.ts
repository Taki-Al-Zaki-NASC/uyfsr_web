import { EXPANDED_SCIENCE_CONCEPTS } from './elibooKnowledgeBase'
import { matchOrgKnowledge } from './elibooOrgKnowledge'
import {
  evaluateMathCalculation,
  getQuizResponse,
  getFactResponse,
  getMathOlympiadResponse,
  getPhysicsOlympiadResponse,
  getJuniorOlympiadResponse,
  getResearchMethodologyResponse,
  getProjectIdeasResponse,
  getHigherStudyResponse,
  getScientistsPioneersResponse,
  getMentalHealthExamTipsResponse,
  getCalculationOrFormulaResponse
} from './elibooCapabilities'

// =============================================================================
// ELIBOO UNIVERSAL NATURAL LANGUAGE & DIALOGUE ENGINE (v2.0 - Universal Knowledge)
// Pure Client-Side / Local Execution — Zero External / Paid API Required
// Capable of answering EVERYTHING:
// 1. UYFSR Programs, Ambassadorship, Leadership, Registration, Logistics & Policies
// 2. STEM & Scientific Research, Project Ideas, Olympiad Syllabi & Preparation
// 3. Human Chit-Chat, Jokes, Emotions, Personal Queries & Friendly Companionship
// 4. Universal Scientific & Intellectual Concept Synthesizer (Never gets stuck!)
// =============================================================================

export type LanguageMode = 'bn' | 'banglish' | 'en'

export interface ElibooResponse {
  text: string
  actionLink?: {
    label: string
    href: string
    view?: 'home' | 'register' | 'executive-login' | 'dashboard' | 'ambassador'
    anchor?: string
    leaderName?: string
  }
  suggestedQuestions: string[]
  detectedLanguage: LanguageMode
  topic: string
}

export interface ConversationContext {
  lastTopic?: string
  lastIntent?: string
  preferredLanguage?: LanguageMode
  historyCount: number
}

// -----------------------------------------------------------------------------
// 1. LANGUAGE & SCRIPT DETECTOR
// -----------------------------------------------------------------------------
const BANGLA_UNICODE_REGEX = /[\u0980-\u09FF]/

const BANGLISH_KEYWORDS = new Set([
  'kivabe', 'kibhabe', 'kemne', 'kivabeh',
  'kemon', 'valo', 'bhalo', 'achi', 'achen', 'asho', 'acho',
  'taka', 'poisa', 'khoroch', 'fee',
  'lagbe', 'lage', 'lagbo', 'dorkar', 'proyojon',
  'hobe', 'hoise', 'hobe?', 'hobena', 'kobe', 'kokhon', 'tarikh', 'somoy',
  'kothai', 'koi', 'thikana',
  'ke', 'kar', 'kake', 'naam', 'nam',
  'apnar', 'apnader', 'tumar', 'tomar', 'amader', 'amar',
  'shongothon', 'sangathan', 'shathe', 'sathe',
  'bhai', 'bhaiya', 'vai', 'vaiya', 'apu', 'bro', 'boss',
  'bolo', 'bolen', 'shuntechi', 'bolte', 'bujhte', 'bujhina',
  'korbo', 'korte', 'koren', 'kori', 'kore',
  'dhonnobad', 'shukriya', 'shuvo', 'tata', 'hafez',
  'ekta', 'kisu', 'shob', 'kono', 'ki', 'keno', 'aro', 'ar',
  'chara', 'mulle', 'sonod', 'shonod', 'shuro', 'shuru',
  'pori', 'porte', 'parbo', 'parbo?', 'jabo', 'jabo?',
  'mon', 'kharap', 'prem', 'khao', 'bhalobasho', 'joke', 'koutuk',
  'baire', 'theke', 'jabe', 'dao', 'koro', 'bolo', 'kichu', 'ekhon', 'chai', 'konta',
  'bhalo', 'bujhi', 'bujhlam', 'korle', 'gele', 'dibo', 'paile', 'pabo', 'shonao',
  'hasao', 'thako', 'thaki', 'kothai', 'kotojon', 'kew', 'amake', 'tumi', 'apni',
  'vai', 'bhai', 'apu', 'to', 'naki', 'bujhai', 'shobar', 'parbe', 'ashen'
])

export function detectLanguage(text: string): LanguageMode {
  if (BANGLA_UNICODE_REGEX.test(text)) {
    return 'bn'
  }

  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
  let banglishHits = 0

  for (const token of tokens) {
    if (BANGLISH_KEYWORDS.has(token)) {
      banglishHits++
    }
  }

  if (banglishHits >= 1 || (tokens.length > 0 && banglishHits / tokens.length >= 0.15)) {
    return 'banglish'
  }

  return 'en'
}

// -----------------------------------------------------------------------------
// 2. TEXT NORMALIZATION & PHONETIC LEMMATIZATION
// -----------------------------------------------------------------------------
export function normalizeText(raw: string): string {
  let text = raw.toLowerCase()

  // Remove excessive character repetition (e.g. "heyyyyyy" -> "hey", "plzzzzz" -> "plz", "vaiii" -> "vai")
  text = text.replace(/(.)\1{2,}/g, '$1$1')

  // Normalize common phonetic variations
  text = text
    .replace(/\bkibhabe\b/g, 'kivabe')
    .replace(/\bkemne\b/g, 'kivabe')
    .replace(/\bkivabeh\b/g, 'kivabe')
    .replace(/\bshonod\b/g, 'certificate')
    .replace(/\bshonodpotro\b/g, 'certificate')
    .replace(/\bsonod\b/g, 'certificate')
    .replace(/\bkhub\b/g, 'onek')
    .replace(/\bproyojon\b/g, 'dorkar')
    .replace(/\bcost\b/g, 'fee')
    .replace(/\bpoisa\b/g, 'fee')
    .replace(/\bthx\b/g, 'thanks')
    .replace(/\bty\b/g, 'thanks')
    .replace(/\btq\b/g, 'thanks')
    .replace(/\breg\b/g, 'register')
    .replace(/\bregistrasion\b/g, 'register')
    .replace(/\brejistreshon\b/g, 'register')
    .replace(/\brejistration\b/g, 'register')
    .replace(/\bambasador\b/g, 'ambassador')
    .replace(/\bca\b/g, 'ambassador')
    .replace(/\bolimpiyad\b/g, 'olympiad')
    .replace(/\bolimpiad\b/g, 'olympiad')

  return text.trim()
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }
  return dp[m][n]
}

function isFuzzyMatch(word: string, target: string, threshold = 0.8): boolean {
  if (word === target) return true
  const maxLen = Math.max(word.length, target.length)
  if (maxLen < 4) return word === target
  const dist = levenshteinDistance(word, target)
  const similarity = 1 - dist / maxLen
  return similarity >= threshold
}

// -----------------------------------------------------------------------------
// 3. EXPANDED INTENT MATRIX (60+ INTENTS)
// -----------------------------------------------------------------------------
export type IntentId =
  // Basic Chit-Chat & Bot Persona
  | 'GREETING'
  | 'BOT_IDENTITY'
  | 'BOT_PERSONAL_LIFE'      // food, gender, age, sleep, girlfriend/boyfriend, marriage
  | 'BOT_SENTIENCE_FEELINGS' // love, crazy, stupid, friend
  | 'JOKE_HUMOR'             // tell a joke, make laugh
  | 'MOTIVATION_COMFORT'     // sad, depressed, motivational quote
  | 'STUDY_TIPS'             // how to study, exam tips, focus
  // UYFSR Core Pillars & Leadership
  | 'ABOUT_UYFSR'
  | 'LEADERSHIP_CEO'
  | 'LEADERSHIP_TEAM'
  | 'LEADERSHIP_FAHIM'
  | 'LEADERSHIP_SOYAIB'
  | 'LEADERSHIP_MEJBA'
  | 'LEADERSHIP_DALIA'
  | 'LEADERSHIP_JARIN'
  | 'LEADERSHIP_NABIL'
  | 'LEADERSHIP_TASHKIR'
  | 'LEADERSHIP_TAKI'
  | 'LEADERSHIP_ROHAN'
  | 'LEADERSHIP_RAFIN'
  | 'ACTIVITIES_WORKSHOPS'
  | 'CERTIFICATES'
  | 'PARTNERS'
  | 'CONTACT'
  | 'EXECUTIVE_LOGIN'
  | 'VOUCHER'
  // Ambassador & Registration
  | 'CAMPUS_AMBASSADOR'
  | 'AMBASSADOR_FREE'
  | 'AMBASSADOR_PERKS'
  | 'REGISTRATION_STEPS'
  | 'FEES_AND_PAYMENT'
  | 'BKASH_PAYMENT'
  | 'REFUND_PAYMENT_ISSUE'   // refund, wrong number, mistaken trxid
  // Events & Flagships
  | 'EVENTS_OVERVIEW'
  | 'EVENT_SCIENCE_ECLIPSE'
  | 'EVENT_JOURNALISM_CARNIVAL'
  | 'EVENT_JUNIOR_TALENT'
  | 'EVENT_STARTUP_CHALLENGE'
  | 'ELIGIBILITY_WHO_CAN_JOIN'
  | 'DEADLINE_LAST_DATE'     // registration deadline, last date
  | 'RESULTS_NOTIFICATION'   // results date, selection announcement
  | 'PRIZES_AWARDS'          // prize pool, medals, crests, awards
  | 'ONLINE_VS_OFFLINE'      // online or physical, outside Dhaka
  | 'TEAM_VS_SOLO'           // team participation, solo, group size
  | 'MULTIPLE_PROGRAMS'      // participate in multiple events
  | 'SCHOOL_WORKSHOP_INVITE' // host workshop in school/college
  | 'SPONSOR_PARTNERSHIP_INQUIRY' // sponsorship, brand partner
  | 'PARENT_FOOD_DRESS'      // lunch, dress code, parent permission
  // STEM & Science Research Mentorship
  | 'SCIENCE_GENERAL'        // what is science
  | 'PHYSICS_CONCEPT'        // physics, gravity, quantum, energy
  | 'CHEMISTRY_CONCEPT'      // chemistry, reaction, atom, molecule
  | 'BIOLOGY_CONCEPT'        // biology, dna, cell, photosynthesis
  | 'ASTRONOMY_SPACE'        // space, stars, black hole, moon, sun
  | 'MATH_LOGIC'             // mathematics, problem solving, calculus
  | 'AI_TECH_ROBOTICS'       // artificial intelligence, robotics, coding
  | 'RESEARCH_START'         // how to start research, scientific method
  | 'RESEARCH_PAPER'         // how to write a paper, journal
  | 'PROJECT_IDEAS'          // science fair project ideas, experiment
  | 'OLYMPIAD_SYLLABUS'      // syllabus, question pattern
  | 'OLYMPIAD_PREPARATION'   // how to prepare for science olympiad
  // Polite Closures
  | 'GRATITUDE'
  | 'FAREWELL'
  | 'COMPLIMENT'
  | 'HELP_GENERAL'
  // --- ADVANCED MASSIVE STEM & INTERACTIVE CAPABILITIES ---
  | 'INTERACTIVE_QUIZ'
  | 'INTERACTIVE_FACTS'
  | 'SCIENTISTS_PIONEERS'
  | 'MATH_OLYMPIAD_GUIDE'
  | 'PHYSICS_OLYMPIAD_GUIDE'
  | 'JUNIOR_SCIENCE_OLYMPIAD'
  | 'RESEARCH_METHODOLOGY_ADVANCED'
  | 'PROJECT_IDEAS_BY_GRADE'
  | 'HIGHER_STUDY_SCHOLARSHIP'
  | 'CALCULATION_OR_FORMULA'
  | 'MENTAL_HEALTH_EXAM_TIPS'
  | 'UNKNOWN'

interface IntentRule {
  id: IntentId
  topic: string
  patternsBn: string[]
  patternsBanglish: string[]
  patternsEn: string[]
  fuzzyKeywords?: string[]
}

const INTENT_RULES: IntentRule[] = [
  // 1. Greetings
  {
    id: 'GREETING',
    topic: 'greeting',
    patternsBn: ['হ্যালো', 'হে', 'সালাম', 'আসসালামু আলাইকুম', 'কেমন আছো', 'কেমন আছেন', 'শুভ সকাল', 'শুভ দুপুর', 'শুভ সন্ধ্যা', 'হাই'],
    patternsBanglish: ['hi', 'hello', 'hey', 'salam', 'assalamu alaikum', 'slaam', 'kemon acho', 'kemon asen', 'kemon achen', 'ki obostha', 'ki khobor', 'valo achen', 'bhalo acho', 'heyy'],
    patternsEn: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'how are you', 'whats up', 'hey there']
  },

  // 2. Bot Identity
  {
    id: 'BOT_IDENTITY',
    topic: 'identity',
    patternsBn: ['তুমি কে', 'তোমার নাম কি', 'তুমি কি মানুষ', 'তুমি কি রোবট', 'তুমি কি এআই', 'কে তোমাকে বানিয়েছে', 'তোমার কাজ কি'],
    patternsBanglish: ['tumi ke', 'tumar nam ki', 'tomar nam ki', 'what is your name', 'tumi ki robot', 'tumi ki bot', 'tumi ki ai', 'eliboo ke', 'ke banayse', 'tumar kaj ki', 'ki korte paro'],
    patternsEn: ['who are you', 'what is your name', 'are you a bot', 'are you human', 'are you real', 'what can you do', 'who created you', 'tell me about yourself', 'what is eliboo']
  },

  // 3. Bot Personal Life (Food, Gender, Sleep, Relationship)
  {
    id: 'BOT_PERSONAL_LIFE',
    topic: 'persona',
    patternsBn: ['তুমি কি খাও', 'তোমার বয়স কত', 'তুমি ছেলে না মেয়ে', 'তুমি কোথায় থাকো', 'তোমার প্রেমিকা আছে', 'প্রেম করো', 'তোমার বিয়ে হয়েছে', 'তুমি কি ঘুমাও'],
    patternsBanglish: ['tumi ki khao', 'tumar boyos koto', 'tumi chele naki meye', 'tumi kothai thako', 'tumar girlfriend ache', 'boyfriend ache', 'tumi ki prem koro', 'tumar biye hoise', 'tumi ki ghumao', 'tumi ki koren'],
    patternsEn: ['what do you eat', 'how old are you', 'are you a boy or girl', 'what is your gender', 'where do you live', 'do you have a girlfriend', 'do you have a boyfriend', 'are you married', 'do you sleep']
  },

  // 4. Bot Sentience, Friendship & Affection
  {
    id: 'BOT_SENTIENCE_FEELINGS',
    topic: 'persona',
    patternsBn: ['তুমি কি আমাকে ভালোবাসো', 'আমার বন্ধু হবে', 'তুমি কি পাগল', 'তুমি কি বোকা', 'আই লাভ ইউ'],
    patternsBanglish: ['tumi ki amake bhalobasho', 'tumi ki amake valobaso', 'amar bondhu hobe', 'tumi ki pagol', 'tumi ki boka', 'love you', 'i love you', 'tumi ki amake chena'],
    patternsEn: ['do you love me', 'will you be my friend', 'are you crazy', 'are you stupid', 'i love you eliboo', 'can we be friends']
  },

  // 5. Jokes & Humor
  {
    id: 'JOKE_HUMOR',
    topic: 'humor',
    patternsBn: ['কৌতুক বলো', 'জোক বলো', 'হাসাও আমাকে', 'একটা জোক শোনাও', 'মজার কিছু বলো'],
    patternsBanglish: ['joke bolo', 'koutuk shonao', 'hasao amake', 'ekta joke bolo', 'funny kisu bolo', 'hasir kotha bolo', 'make me laugh'],
    patternsEn: ['tell me a joke', 'make me laugh', 'say something funny', 'tell a science joke', 'crack a joke']
  },

  // 6. Motivation & Emotional Comfort
  {
    id: 'MOTIVATION_COMFORT',
    topic: 'comfort',
    patternsBn: ['আমার মন খারাপ', 'ভালো লাগছে না', 'অনুপ্রেরণামূলক কথা বলো', 'মন ভালো করে দাও', 'হতাশ লাগছে'],
    patternsBanglish: ['mon kharap', 'valo lagche na', 'amar mon bhalo nei', 'motivational kotha bolo', 'amake motivate koro', 'depressed lagche', 'inspire me', 'sad lagche'],
    patternsEn: ['i am sad', 'i feel depressed', 'motivate me', 'give me a motivational quote', 'feeling down', 'cheer me up', 'inspire me']
  },

  // 7. Study Tips & Exam Guidance
  {
    id: 'STUDY_TIPS',
    topic: 'study',
    patternsBn: ['পড়াশোনায় মন বসে না', 'পড়াশোনার টিপস', 'পরীক্ষায় ভালো করার উপায়', 'কিভাবে বেশি পড়ব', 'পড়ার রুটিন'],
    patternsBanglish: ['study tips dao', 'porashonai mon bose na', 'exam e valo korar tips', 'kivabe focus rakhbo', 'study routine', 'porashona tips'],
    patternsEn: ['study tips', 'how to study effectively', 'exam preparation tips', 'how to focus on study', 'study advice']
  },

  // 8. Science General
  {
    id: 'SCIENCE_GENERAL',
    topic: 'science',
    patternsBn: ['বিজ্ঞান কি', 'বিজ্ঞানের সংজ্ঞা', 'বিজ্ঞান কাকে বলে'],
    patternsBanglish: ['science ki', 'biggan ki', 'science mane ki', 'what is science definition'],
    patternsEn: ['what is science', 'definition of science', 'why is science important', 'meaning of science']
  },

  // 9. Physics Concept
  {
    id: 'PHYSICS_CONCEPT',
    topic: 'physics',
    patternsBn: ['পদার্থবিজ্ঞান কি', 'মহাকর্ষ কি', 'কোয়ান্টাম ফিজিক্স', 'আইনস্টাইন', 'আপেক্ষিকতা', 'গতিবিদ্যা'],
    patternsBanglish: ['physics ki', 'gravity ki', 'quantum physics ki', 'relativity ki', 'mohakorsho ki', 'motion ki', 'force ki'],
    patternsEn: ['what is physics', 'what is gravity', 'quantum mechanics', 'quantum physics', 'theory of relativity', 'laws of motion']
  },

  // 10. Chemistry Concept
  {
    id: 'CHEMISTRY_CONCEPT',
    topic: 'chemistry',
    patternsBn: ['রসায়ন কি', 'পর্যায় সারণি', 'পরমাণু কি', 'অণু কি', 'রাসায়নিক বিক্রিয়া'],
    patternsBanglish: ['chemistry ki', 'roshayon ki', 'periodic table ki', 'atom ki', 'molecule ki', 'chemical reaction ki'],
    patternsEn: ['what is chemistry', 'periodic table', 'what is an atom', 'what is a molecule', 'chemical reactions']
  },

  // 11. Biology Concept
  {
    id: 'BIOLOGY_CONCEPT',
    topic: 'biology',
    patternsBn: ['জীববিজ্ঞান কি', 'ডিএনএ কি', 'কোষ কি', 'সালোকসংশ্লেষণ', 'জিনতত্ত্ব'],
    patternsBanglish: ['biology ki', 'jibobiggan ki', 'dna ki', 'cell ki', 'photosynthesis ki', 'genetics ki'],
    patternsEn: ['what is biology', 'what is dna', 'what is a cell', 'photosynthesis', 'genetics']
  },

  // 12. Astronomy & Space
  {
    id: 'ASTRONOMY_SPACE',
    topic: 'astronomy',
    patternsBn: ['জ্যোতির্বিজ্ঞান কি', 'মহাকাশ', 'ব্ল্যাক হোল কি', 'সৌরজগৎ', 'চাঁদ কেন জ্বলে', 'নক্ষত্র', 'নাসা'],
    patternsBanglish: ['astronomy ki', 'space ki', 'black hole ki', 'surjo', 'chand', 'solar system', 'galaxy ki', 'mohakash'],
    patternsEn: ['what is astronomy', 'black hole', 'solar system', 'what is a galaxy', 'outer space', 'universe']
  },

  // 13. Math & Logic
  {
    id: 'MATH_LOGIC',
    topic: 'math',
    patternsBn: ['গণিত কি', 'গণিত অলিম্পিয়াড প্রস্তুতি', 'ক্যালকুলাস', 'সমস্যা সমাধান'],
    patternsBanglish: ['math ki', 'gonit ki', 'math olympiad tips', 'calculus ki', 'algebra ki', 'problem solving tips'],
    patternsEn: ['what is mathematics', 'math olympiad preparation', 'calculus', 'algebra', 'mathematical problem solving']
  },

  // 14. AI & Tech / Robotics
  {
    id: 'AI_TECH_ROBOTICS',
    topic: 'tech',
    patternsBn: ['কৃত্রিম বুদ্ধিমত্তা কি', 'রোবোটিক্স কি', 'মেশিন লার্নিং', 'প্রোগ্রামিং কি', 'কোডিং কিভাবে শিখব'],
    patternsBanglish: ['ai ki', 'artificial intelligence ki', 'robotics ki', 'coding kivabe shikhbo', 'machine learning ki', 'programming ki'],
    patternsEn: ['what is ai', 'artificial intelligence', 'robotics', 'machine learning', 'how to learn coding', 'programming']
  },

  // 15. How to Start Research
  {
    id: 'RESEARCH_START',
    topic: 'research',
    patternsBn: ['গবেষণা কিভাবে শুরু করব', 'বৈজ্ঞানিক পদ্ধতি কি', 'হাইপোথিসিস কি', 'গবেষণার নিয়ম'],
    patternsBanglish: ['research kivabe shuru korbo', 'gobeshona kivabe kore', 'how to start research', 'scientific method ki', 'hypothesis ki', 'research step by step'],
    patternsEn: ['how to start research', 'scientific method', 'what is hypothesis', 'how to do empirical research', 'research methodology for students']
  },

  // 16. How to Write a Research Paper
  {
    id: 'RESEARCH_PAPER',
    topic: 'research',
    patternsBn: ['গবেষণাপত্র কিভাবে লিখব', 'রিসার্চ পেপার লেখার নিয়ম', 'জার্নাল প্রকাশনা'],
    patternsBanglish: ['research paper kivabe likhbo', 'paper kivabe likhe', 'how to write research paper', 'scientific journal e publish'],
    patternsEn: ['how to write a research paper', 'research paper format', 'how to publish a paper', 'scientific writing guide']
  },

  // 17. Science Project Ideas
  {
    id: 'PROJECT_IDEAS',
    topic: 'projects',
    patternsBn: ['বিজ্ঞান প্রজেক্ট আইডিয়া', 'সায়েন্স ফেয়ার প্রজেক্ট', 'উদ্ভাবনী প্রজেক্ট', 'নতুন আইডিয়া দাও'],
    patternsBanglish: ['science project idea', 'science fair e ki project banabo', 'project ideas dao', 'innovative project ideas', 'experiment idea', 'working model idea'],
    patternsEn: ['science project ideas', 'science fair projects', 'innovative project ideas', 'science experiment ideas', 'stem project ideas']
  },

  // 18. Olympiad Syllabus & Question Pattern
  {
    id: 'OLYMPIAD_SYLLABUS',
    topic: 'olympiad',
    patternsBn: ['অলিম্পিয়াড সিলেবাস কি', 'প্রশ্নের প্যাটার্ন কি', 'কেমন প্রশ্ন হবে', 'মার্কস ডিস্ট্রিবিউশন'],
    patternsBanglish: ['olympiad syllabus ki', 'syllabus ki', 'question pattern kemon', 'kemon proshno ashe', 'marks distribution ki'],
    patternsEn: ['olympiad syllabus', 'question pattern', 'what is the syllabus', 'exam structure', 'marks distribution']
  },

  // 19. Olympiad Preparation Tips
  {
    id: 'OLYMPIAD_PREPARATION',
    topic: 'olympiad',
    patternsBn: ['অলিম্পিয়াড প্রস্তুতি কিভাবে নিব', 'অলিম্পিয়াডের টিপস', 'কি বই পড়ব'],
    patternsBanglish: ['olympiad preparation kivabe nebo', 'olympiad tips', 'how to prepare for science eclipse', 'olympiad study plan', 'ki boi porbo'],
    patternsEn: ['how to prepare for olympiad', 'olympiad preparation tips', 'science olympiad study guide', 'recommended books for olympiad']
  },

  // 20. Online vs Physical Participation & Outside Dhaka
  {
    id: 'ONLINE_VS_OFFLINE',
    topic: 'logistics',
    patternsBn: ['অনলাইনে হবে না অফলাইনে', 'ঢাকার বাইরে থেকে অংশ নেওয়া যাবে', 'চট্টগ্রাম থেকে অংশ নিতে পারব', 'রাজশাহী থেকে অংশ নিতে পারব', 'দূরশিক্ষণ'],
    patternsBanglish: ['online e hobe naki offline', 'online participation ache', 'dhakar baire theke join kora jabe', 'chittagong theke participate', 'rajshahi theke', 'sylhet theke', 'khulna theke', 'is it online or offline'],
    patternsEn: ['is it online or offline', 'can i participate from outside dhaka', 'online participation', 'remote participation', 'is attendance physical']
  },

  // 21. Team vs Solo Participation
  {
    id: 'TEAM_VS_SOLO',
    topic: 'logistics',
    patternsBn: ['দলে অংশ নিতে পারব কি', 'টিমে নাকি একা', 'টিম সাইজ কত', 'গ্রুপ প্রজেক্ট'],
    patternsBanglish: ['team e participate kora jabe', 'solo naki team', 'ekla naki group', 'team size koto', 'koyjon member thakte parbe', 'group e participate'],
    patternsEn: ['can we participate as a team', 'team or solo', 'team size', 'how many members in a team', 'individual or group']
  },

  // 22. Registration Deadline & Last Date
  {
    id: 'DEADLINE_LAST_DATE',
    topic: 'registration',
    patternsBn: ['রেজিস্ট্রেশনের শেষ তারিখ কবে', 'লাস্ট ডেট কবে', 'ডেডলাইন কবে', 'কত তারিখ পর্যন্ত আবেদন করা যাবে'],
    patternsBanglish: ['last date kobe', 'deadline kobe', 'registration er sesh somoy kobe', 'kobe porjonto registration kora jabe', 'last date of registration'],
    patternsEn: ['registration deadline', 'what is the last date to register', 'when does registration close', 'last date for submission']
  },

  // 23. Results & Selection Notification
  {
    id: 'RESULTS_NOTIFICATION',
    topic: 'results',
    patternsBn: ['ফলাফল কবে দিবে', 'সিলেক্টেড হলে কিভাবে জানব', 'ইন্টারভিউ হবে কি', 'মেরিট লিস্ট'],
    patternsBanglish: ['result kobe dibe', 'selected hole kivabe janbo', 'selection process ki', 'kivabe notify korbe', 'interview hobe naki', 'merit list kobe dibe'],
    patternsEn: ['when will results be announced', 'how will i know if selected', 'selection process', 'interview for ambassador', 'result date']
  },

  // 24. Prizes & Awards
  {
    id: 'PRIZES_AWARDS',
    topic: 'prizes',
    patternsBn: ['পুরস্কার কি কি আছে', 'বিজয়ীরা কি পাবে', 'প্রাইজ মানি আছে কি', 'মেডেল ও ক্রেস্ট'],
    patternsBanglish: ['prize ki pabe', 'winner ra ki pabe', 'prize pool koto', 'awards and medals', 'purroshkar ki thakbe', 'prize money ache'],
    patternsEn: ['what are the prizes', 'winner awards', 'prize pool', 'medals and trophies', 'what do winners get']
  },

  // 25. Refund Policy & Mistaken Transactions
  {
    id: 'REFUND_PAYMENT_ISSUE',
    topic: 'payment',
    patternsBn: ['টাকা ফেরত পাওয়া যাবে', 'ভুল নম্বরে টাকা পাঠিয়েছি', 'পেমেন্টে ভুল হলে কি করব', 'রিফান্ড পলিসি'],
    patternsBanglish: ['taka refund pabo', 'refund policy ki', 'vul number e taka pathaise', 'trxid vul hoise', 'payment mistake hole ki korbo'],
    patternsEn: ['can i get a refund', 'refund policy', 'sent money to wrong number', 'mistake in trxid', 'payment correction']
  },

  // 26. Host Workshop in School/College
  {
    id: 'SCHOOL_WORKSHOP_INVITE',
    topic: 'collaboration',
    patternsBn: ['আমাদের স্কুলে ওয়ার্কশপ করাতে চাই', 'আমাদের কলেজে আসবেন কি', 'স্কুল পার্টনারশিপ'],
    patternsBanglish: ['amader school e workshop korate chai', 'college e workshop koren', 'school e workshop invite', 'how to arrange workshop in our campus'],
    patternsEn: ['host workshop in our school', 'arrange workshop at college', 'school collaboration', 'invite uyfsr to our campus']
  },

  // 27. Sponsorship & Brand Partnership
  {
    id: 'SPONSOR_PARTNERSHIP_INQUIRY',
    topic: 'partners',
    patternsBn: ['স্পনসর করতে চাই', 'পার্টনার হতে চাই', 'স্পনসরশিপ সুযোগ', 'কো-অর্গানাইজার হতে চাই'],
    patternsBanglish: ['sponsor korte chai', 'sponsor hote chai', 'partner hote chai', 'sponsorship opportunity', 'brand partnership'],
    patternsEn: ['i want to sponsor', 'sponsorship opportunities', 'become a corporate partner', 'brand partnership']
  },

  // 28. Food, Dress Code & Parents
  {
    id: 'PARENT_FOOD_DRESS',
    topic: 'logistics',
    patternsBn: ['খাবার দেওয়া হবে কি', 'লাঞ্চ পাব কি', 'ড্রেস কোড কি', 'অভিভাবক আসতে পারবে কি'],
    patternsBanglish: ['khabar pabo', 'lunch dewa hobe', 'dress code ki', 'uniform pore jete hobe', 'parents aste parbe', 'guardian permission lagbe'],
    patternsEn: ['will food or lunch be provided', 'dress code', 'do i need to wear uniform', 'can parents accompany', 'guardian permission']
  },

  // 29. Multiple Event Participation
  {
    id: 'MULTIPLE_PROGRAMS',
    topic: 'registration',
    patternsBn: ['একাধিক ইভেন্টে অংশ নেওয়া যাবে কি', 'একসাথে কয়টা অলিম্পিয়াড দেওয়া যাবে'],
    patternsBanglish: ['ekadhik event e join kora jabe', 'multiple event participate', '2 ta event e participate kora jabe', 'can i join multiple events'],
    patternsEn: ['can i participate in multiple events', 'multiple competitions', 'register for more than one category']
  },

  // 30. Campus Ambassador General
  {
    id: 'CAMPUS_AMBASSADOR',
    topic: 'ambassador',
    patternsBn: ['ক্যাম্পাস অ্যাম্বাসেডর', 'অ্যাম্বাসেডর', 'অ্যাম্বাসেডর হতে চাই', 'সিএ আবেদন', 'অ্যাম্বাসেডর কি'],
    patternsBanglish: ['campus ambassador', 'ambassador', 'ambasador', 'ca hote chai', 'ambassador kivabe hobo', 'ambassador application', 'ca apply', 'campus representative', 'ambassador program'],
    patternsEn: ['campus ambassador', 'become ambassador', 'ambassador program', 'how to become campus ambassador', 'ambassador role', 'ca application', 'apply as ambassador'],
    fuzzyKeywords: ['ambassador', 'ambasador']
  },

  // 31. Campus Ambassador Free Check
  {
    id: 'AMBASSADOR_FREE',
    topic: 'ambassador',
    patternsBn: ['অ্যাম্বাসেডর হতে কি টাকা লাগে', 'অ্যাম্বাসেডর ফ্রি নাকি', 'কোনো ফি লাগবে কি অ্যাম্বাসেডর', 'বিনামূল্যে অ্যাম্বাসেডর', 'অ্যাম্বাসেডর ফি'],
    patternsBanglish: ['ambassador taka lage', 'ambassador free naki', 'ca hote taka lage', 'free ambassador', 'ambassador kono fee ache', 'taka lagbe ambassador', 'ambassador ki free'],
    patternsEn: ['is ambassador free', 'campus ambassador cost', 'ambassador fee', 'is there any fee for ambassador', 'is ca free', 'is campus ambassador free']
  },

  // 32. Ambassador Perks
  {
    id: 'AMBASSADOR_PERKS',
    topic: 'ambassador',
    patternsBn: ['অ্যাম্বাসেডর সুবিধা', 'অ্যাম্বাসেডর হলে কি লাভ', 'সার্টিফিকেট পাব কি অ্যাম্বাসেডর', 'অ্যাম্বাসেডর সুবিধা কি'],
    patternsBanglish: ['ambassador labh ki', 'ambassador benefits', 'ca perks', 'ambassador suvidha', 'ambassador certificate pabo', 'perks of ambassador'],
    patternsEn: ['ambassador benefits', 'ambassador perks', 'what do ambassadors get', 'why become ambassador', 'perks of being ambassador']
  },

  // 33. Registration Steps
  {
    id: 'REGISTRATION_STEPS',
    topic: 'registration',
    patternsBn: ['রেজিস্ট্রেশন কিভাবে করব', 'কীভাবে রেজিস্ট্রেশন করব', 'কিভাবে নিবন্ধন করব', 'রেজিস্ট্রেশনের নিয়ম', 'রেজিস্ট্রেশন করার নিয়ম', 'ইভেন্ট রেজিস্ট্রেশন', 'যুক্ত হব কিভাবে', 'ভর্তি হব কিভাবে', 'রেজিস্ট্রেশন', 'নিবন্ধন', 'কিভাবে রেজিস্ট্রেশন'],
    patternsBanglish: ['kivabe register korbo', 'register kivabe korbo', 'kivabe join korbo', 'registration process', 'how to register', 'kivabe form fillup korbo', 'registration steps', 'registration procedure', 'register korbo', 'event register', 'event e kivabe register'],
    patternsEn: ['how to register', 'how can i register', 'ow can i register', 'register for event', 'event registration', 'how do i register', 'registration process', 'how to join', 'how to sign up', 'registration steps', 'apply for event', 'register for competition', 'registration', 'how can i participate', 'how do i participate']
  },

  // 34. Fees and Payment General
  {
    id: 'FEES_AND_PAYMENT',
    topic: 'payment',
    patternsBn: ['ফি কত', 'টাকা কত লাগবে', 'রেজিস্ট্রেশন ফি', 'পেমেন্ট কিভাবে করব', 'খরচ কত', 'রেজিস্ট্রেশন ফি কত'],
    patternsBanglish: ['fee koto', 'taka koto lagbe', 'registration fee koto', 'koto taka', 'kivabe payment korbo', 'khoroch koto', 'entry fee', 'taka lagbe', 'registration fee'],
    patternsEn: ['how much is the fee', 'registration fee', 'entry fee', 'how much cost', 'payment method', 'how to pay', 'is there an entry fee']
  },

  // 35. bKash / Nagad Number Payment
  {
    id: 'BKASH_PAYMENT',
    topic: 'payment',
    patternsBn: ['বিকাশ নম্বর', 'নগদ নম্বর', 'ট্রানজেকশন আইডি', 'টাকা কোন নম্বরে পাঠাব', 'trxid কি', 'বিকাশ পার্সোনাল'],
    patternsBanglish: ['bkash number', 'nagad number', 'kon number e taka pathabo', 'trxid kivabe dibo', 'bkash personal', 'bkash koto', 'send money'],
    patternsEn: ['bkash number', 'nagad number', 'which number to send money', 'transaction id', 'trxid', 'payment number']
  },

  // 36. Events Overview / Calendar
  {
    id: 'EVENTS_OVERVIEW',
    topic: 'events',
    patternsBn: ['ইভেন্ট কি কি আছে', 'পরবর্তী অনুষ্ঠান', 'ক্যালেন্ডার', 'সামনে কি ইভেন্ট আছে', 'ইভেন্ট কবে', 'পরবর্তী ইভেন্ট', 'ইভেন্ট সমূহ', 'অনুষ্ঠান কবে'],
    patternsBanglish: ['upcoming events', 'next event kobe', 'event kobe hobe', 'events list', 'calendar', 'shob events', 'tarikh gula ki', 'next event', 'next events', 'events schedule'],
    patternsEn: ['upcoming events', 'events calendar', 'next event', 'what events are scheduled', 'list of events', 'event dates', 'events in 2026', 'flagship events']
  },

  // 37. National Science Eclipse 2026
  {
    id: 'EVENT_SCIENCE_ECLIPSE',
    topic: 'eclipse',
    patternsBn: ['সায়েন্স এক্লিপ্স', 'ন্যাশনাল সায়েন্স এক্লিপ্স', 'এক্লিপ্স অলিম্পিয়াড', '১৬ এপ্রিল', 'সায়েন্স এক্লিপ্স ২০২৬'],
    patternsBanglish: ['science eclipse', 'national science eclipse', 'eclipse olympiad', 'eclipse 2026', '16 april', 'science eclipse kobe', 'eclipse'],
    patternsEn: ['science eclipse', 'national science eclipse 2026', 'science eclipse dates', 'eclipse olympiad', 'flagship science event', 'national science eclipse']
  },

  // 38. 1st National Journalism Carnival
  {
    id: 'EVENT_JOURNALISM_CARNIVAL',
    topic: 'journalism',
    patternsBn: ['জার্নালিজম কার্নিভাল', 'সাংবাদিকতা কার্নিভাল', 'আদমজী', 'জার্নালিজম'],
    patternsBanglish: ['journalism carnival', 'national journalism carnival', 'adamjee school carnival', 'journalism event', 'journalism'],
    patternsEn: ['journalism carnival', 'national journalism carnival', 'adamjee', 'science journalism', 'journalism event']
  },

  // 39. Junior Talent Award
  {
    id: 'EVENT_JUNIOR_TALENT',
    topic: 'talent',
    patternsBn: ['জুনিয়র ট্যালেন্ট অ্যাওয়ার্ড', 'কিডলন ট্যালেন্ট', 'ট্যালেন্ট অ্যাওয়ার্ড', 'জুনিয়র ট্যালেন্ট'],
    patternsBanglish: ['junior talent award', 'kidlon talent award', 'junior talent', 'talent award season 1', '18 july', 'talent award'],
    patternsEn: ['junior talent award', 'kidlon presents junior talent', 'junior talent season 1', 'talent award']
  },

  // 40. Junior Startup Challenge
  {
    id: 'EVENT_STARTUP_CHALLENGE',
    topic: 'startup',
    patternsBn: ['স্টার্টআপ চ্যালেঞ্জ', 'জুনিয়র স্টার্টআপ', 'স্টার্টআপ সামিট', 'স্টার্টআপ'],
    patternsBanglish: ['junior startup challenge', 'startup challenge', 'startup season 1', '3 september', 'startup summit'],
    patternsEn: ['junior startup challenge', 'startup summit', 'student startup competition', 'startup challenge']
  },

  // 41. Eligibility (Who can participate)
  {
    id: 'ELIGIBILITY_WHO_CAN_JOIN',
    topic: 'eligibility',
    patternsBn: ['কারা অংশ নিতে পারবে', 'স্কুলের ছাত্ররা কি পারবে', 'কলেজের ছাত্ররা কি পারবে', 'যোগ্যতা কি', 'বয়স কত হতে হবে', 'স্কুল শিক্ষার্থী', 'কলেজ শিক্ষার্থী', 'কারা জয়েন করতে পারবে'],
    patternsBanglish: ['ke ke participate korte parbe', 'kara join korte parbe', 'ami school e pori', 'ami college e pori', 'school student join korte parbe', 'varsity student', 'eligibility ki', 'kon class er student', 'ami ki join korte parbo', 'ami join korte parbo'],
    patternsEn: ['who is eligible', 'can school students join', 'can college students participate', 'eligibility criteria', 'who can participate', 'who can join', 'am i eligible', 'can high school students join']
  },

  // 42. Leadership - CEO Mustafiz Bin Jihad
  {
    id: 'LEADERSHIP_CEO',
    topic: 'leadership',
    patternsBn: ['সিইও কে', 'মুস্তাফিজ', 'মুস্তাফিজ বিন জিহাদ', 'প্রতিষ্ঠাতা কে', 'সংগঠন কে চালায়', 'UYFSR কার', 'প্রেসিডেন্ট কে'],
    patternsBanglish: ['who is ceo', 'ceo ke', 'mustafiz', 'mustafiz bin jihad', 'founder ke', 'president ke', 'shongothon kar', 'ke banayse uyfsr', 'mustafiz bhai', 'who is the ceo'],
    patternsEn: ['who is ceo', 'chief executive officer', 'mustafiz', 'mustafiz bin jihad', 'founder of uyfsr', 'who leads uyfsr', 'who is the ceo of uyfsr']
  },

  // 43. Leadership - Executive Team
  {
    id: 'LEADERSHIP_TEAM',
    topic: 'leadership',
    patternsBn: ['নেতৃত্বে কারা আছেন', 'টিম মেম্বার', 'এক্সিকিউটিভ কাউন্সিল', 'লিডার কারা', 'পরিচালনা পর্ষদ'],
    patternsBanglish: ['leadership team', 'executive council', 'leaders ke ke', 'team member', 'director ke ke', 'uyfsr committee', 'shob leader'],
    patternsEn: ['leadership team', 'executive council', 'who are the leaders', 'management team', 'board of directors', 'governance team']
  },

  // 44. Fahim Samiul Islam (DCEO)
  {
    id: 'LEADERSHIP_FAHIM',
    topic: 'leadership',
    patternsBn: ['ফাহিম সামিউল ইসলাম', 'ডিসিইও', 'ডেপুটি চিফ এক্সিকিউটিভ অফিসার', 'ফাহিম ভাই'],
    patternsBanglish: ['fahim', 'fahim samiul', 'fahim samiul islam', 'dceo', 'deputy ceo', 'deputy chief executive officer'],
    patternsEn: ['fahim samiul islam', 'dceo', 'deputy ceo', 'deputy chief executive officer']
  },

  // 45. Soyaib Islam (CRO)
  {
    id: 'LEADERSHIP_SOYAIB',
    topic: 'leadership',
    patternsBn: ['শোয়াইব', 'সোয়াইব ইসলাম', 'চিফ রিসার্চ অফিসার', 'সিআরও'],
    patternsBanglish: ['soyaib', 'soyaib islam', 'cro', 'chief research officer', 'research head'],
    patternsEn: ['soyaib islam', 'cro', 'chief research officer']
  },

  // 46. Shahriar Mejba (COO)
  {
    id: 'LEADERSHIP_MEJBA',
    topic: 'leadership',
    patternsBn: ['শাহরিয়ার মেজবা', 'সিওও', 'চিফ অপারেটিং অফিসার'],
    patternsBanglish: ['shahriar mejba', 'mejba', 'coo', 'chief operating officer'],
    patternsEn: ['shahriar mejba', 'coo', 'chief operating officer']
  },

  // 47. Dalia Sultana Joty (CCO)
  {
    id: 'LEADERSHIP_DALIA',
    topic: 'leadership',
    patternsBn: ['ডালিয়া সুলতানা জোতি', 'সিসিও', 'চিফ কমিউনিকেশন্স অফিসার'],
    patternsBanglish: ['dalia', 'dalia sultana joty', 'joty', 'cco', 'chief communications officer'],
    patternsEn: ['dalia sultana joty', 'cco', 'chief communications officer']
  },

  // 48. Jarin Tasnim (CMO)
  {
    id: 'LEADERSHIP_JARIN',
    topic: 'leadership',
    patternsBn: ['জারিন তাসনিম', 'জারিন', 'সিএমও জারিন'],
    patternsBanglish: ['jarin', 'jarin tasnim', 'tasnim', 'jarin cmo'],
    patternsEn: ['jarin tasnim', 'jarin cmo']
  },

  // 49. Md Nabil Tahmid (CHRO)
  {
    id: 'LEADERSHIP_NABIL',
    topic: 'leadership',
    patternsBn: ['নাবিল তাহমিদ', 'সিএইচআরও', 'চিফ হিউম্যান রিসোর্সেস অফিসার', 'এইচআর হেড'],
    patternsBanglish: ['nabil', 'md nabil tahmid', 'nabil tahmid', 'chro', 'chief human resources officer', 'hr head'],
    patternsEn: ['md nabil tahmid', 'nabil tahmid', 'chro', 'chief human resources officer', 'human resources head']
  },

  // 50. Shahriyar Tashkir (CTO)
  {
    id: 'LEADERSHIP_TASHKIR',
    topic: 'leadership',
    patternsBn: ['শাহরিয়ার তাসকির', 'সিটিও', 'চিফ টেকনোলজি অফিসার'],
    patternsBanglish: ['shahriyar tashkir', 'tashkir', 'cto', 'chief technology officer'],
    patternsEn: ['shahriyar tashkir', 'cto', 'chief technology officer']
  },

  // 51. Taki Al Zaki (Secretary of Technology)
  {
    id: 'LEADERSHIP_TAKI',
    topic: 'leadership',
    patternsBn: ['তাকী আল জাকী', 'টেকনোলজি সেক্রেটারি'],
    patternsBanglish: ['taki', 'taki al zaki', 'secretary of technology'],
    patternsEn: ['taki al zaki', 'secretary of technology']
  },

  // 52. Khaled Saifullah Rohan (Adviser)
  {
    id: 'LEADERSHIP_ROHAN',
    topic: 'leadership',
    patternsBn: ['খালেদ সাইফুল্লাহ রোহান', 'উপদেষ্টা', 'এডভাইজার রোহান'],
    patternsBanglish: ['rohan', 'khaled saifullah rohan', 'adviser', 'advisor rohan'],
    patternsEn: ['khaled saifullah rohan', 'adviser', 'advisor']
  },

  // 53. Oasimul Rafin (Adviser)
  {
    id: 'LEADERSHIP_RAFIN',
    topic: 'leadership',
    patternsBn: ['ওয়াসিমুল রাফিন', 'রাফিন', 'উপদেষ্টা রাফিন', 'এডভাইজার রাফিন'],
    patternsBanglish: ['rafin', 'oasimul rafin', 'adviser rafin', 'advisor rafin'],
    patternsEn: ['oasimul rafin', 'adviser rafin', 'advisor rafin']
  },

  // 50. About UYFSR
  {
    id: 'ABOUT_UYFSR',
    topic: 'about',
    patternsBn: ['UYFSR কি', 'সংগঠনের উদ্দেশ্য কি', 'কবে প্রতিষ্ঠিত হয়েছে', 'কবে শুরু হয়েছে', 'ইতিহাস কি', 'লক্ষ্য ও উদ্দেশ্য'],
    patternsBanglish: ['what is uyfsr', 'uyfsr ki', 'kobe establish hoise', 'kobe shuru hoise', 'kobe toiri hoise', 'about uyfsr', 'mission ki', 'vision ki', '30 may 2025'],
    patternsEn: ['what is uyfsr', 'about uyfsr', 'when was uyfsr established', 'mission and vision', 'history of uyfsr']
  },

  // 51. Activities & Workshops
  {
    id: 'ACTIVITIES_WORKSHOPS',
    topic: 'activities',
    patternsBn: ['আপনারা কি করেন', 'কার্যক্রম কি কি', 'ওয়ার্কশপ কি হয়', 'ল্যাব সেশন', 'সেমিনার', 'মূল কার্যক্রম'],
    patternsBanglish: ['ki ki koren', 'activities ki', 'kaj ki', 'workshops', 'seminars', 'olympiads', 'ki dhoroner program hoy', 'tracks ki ki', '5 core activities', 'core pillars'],
    patternsEn: ['what do you do', 'activities', 'core tracks', 'workshops', 'seminars', 'what programs do you run', 'core activities', 'core pillars']
  },

  // 52. Certificates & Awards
  {
    id: 'CERTIFICATES',
    topic: 'certificates',
    patternsBn: ['সার্টিফিকেট দেওয়া হবে কি', 'সনদপত্র পাব কি', 'মেডেল দেওয়া হয় কি', 'ক্রেডেনশিয়াল', 'সার্টিফিকেট'],
    patternsBanglish: ['certificate pabo', 'certificate diben', 'sonod pabo', 'medals ache', 'award ache', 'verified certificate', 'certificate er accreditation', 'certificate'],
    patternsEn: ['do you provide certificates', 'are certificates verified', 'will i get certificate', 'awards and medals', 'credentials', 'certificates']
  },

  // 53. Partners & Collaborators
  {
    id: 'PARTNERS',
    topic: 'partners',
    patternsBn: ['পার্টনার কারা', 'কার কার সাথে কাজ করেন', 'টুইমবল', 'কিডলন', 'মেজোলজি', 'অ্যাস্ট্রোস্ফিয়ার', 'মিডিয়া পার্টনার', 'পার্টনার'],
    patternsBanglish: ['partners ke ke', 'collaborators', 'twimbol', 'kidlon', 'mejology', 'astrosphere', 'motion bd', 'bayline', 'tezzfeed', 'sponsors', 'partner', 'partners'],
    patternsEn: ['who are your partners', 'collaborators', 'sponsors', 'partner organizations', 'institutional partners', 'venue partner', 'media partners', 'partners']
  },

  // 54. Contact & Office
  {
    id: 'CONTACT',
    topic: 'contact',
    patternsBn: ['যোগাযোগ করব কিভাবে', 'অফিস কোথায়', 'ইমেইল কি', 'ঠিকানা কি', 'ফোন নম্বর', 'যোগাযোগ'],
    patternsBanglish: ['jogajog kivabe korbo', 'office kothai', 'email ki', 'thikana koi', 'contact number', 'phone ache', 'dhaka kothai', 'jogajog'],
    patternsEn: ['how to contact', 'contact information', 'email address', 'office location', 'where are you located', 'contact us', 'contact']
  },

  // 55. Executive Login
  {
    id: 'EXECUTIVE_LOGIN',
    topic: 'login',
    patternsBn: ['এক্সিকিউটিভ লগইন', 'অফিসার পোর্টাল', 'এডমিন লগইন', 'পাসকি'],
    patternsBanglish: ['executive login', 'portal', 'dashboard login', 'officer login', 'passkey', 'pin login'],
    patternsEn: ['executive login', 'officer portal', 'admin login', 'dashboard access']
  },

  // 56. Voucher Codes
  {
    id: 'VOUCHER',
    topic: 'voucher',
    patternsBn: ['ভাউচার কোড', 'ডিসকাউন্ট পাব কিভাবে', 'রেফারেল কোড', 'ভাউচার'],
    patternsBanglish: ['voucher code', 'discount voucher', 'referral discount', '20 percent discount', 'voucher kivabe pabo', 'voucher'],
    patternsEn: ['voucher code', 'discount code', 'referral voucher', 'how to get discount', 'voucher']
  },

  // 57. Gratitude
  {
    id: 'GRATITUDE',
    topic: 'gratitude',
    patternsBn: ['ধন্যবাদ', 'অনেক ধন্যবাদ', 'থ্যাংকস', 'শুকরিয়া'],
    patternsBanglish: ['dhonnobad', 'onek dhonnobad', 'thanks', 'thank you', 'thx', 'shukriya', 'great job'],
    patternsEn: ['thank you', 'thanks a lot', 'thank you so much', 'appreciate it', 'grateful', 'thanks']
  },

  // 58. Farewell
  {
    id: 'FAREWELL',
    topic: 'farewell',
    patternsBn: ['বিদায়', 'আল্লাহ হাফেজ', 'টাটা', 'শুভ রাত্রি'],
    patternsBanglish: ['bye', 'allah hafez', 'tata', 'valothako', 'pore kotha hobe', 'shuvo ratri', 'good bye'],
    patternsEn: ['bye', 'goodbye', 'see you later', 'take care', 'have a good day']
  },

  // 59. Compliment
  {
    id: 'COMPLIMENT',
    topic: 'compliment',
    patternsBn: ['তুমি অনেক ভালো', 'সুন্দর উত্তর', 'স্মার্ট বট', 'খুব ভালো'],
    patternsBanglish: ['tumi onek valo', 'nice bot', 'smart bot', 'valo laglo', 'onek shundor uttor'],
    patternsEn: ['you are smart', 'good bot', 'great assistant', 'awesome job', 'love this']
  },

  // 60. General Help Request
  {
    id: 'HELP_GENERAL',
    topic: 'help',
    patternsBn: ['সাহায্য চাই', 'আমাকে সাহায্য কর', 'একটা প্রশ্ন ছিল', 'কিছু জানতে চাই'],
    patternsBanglish: ['help lagbe', 'sahajjo koro', 'amake help koro', 'ekta question chilo', 'kisu jante chai', 'help me please'],
    patternsEn: ['i need help', 'can you help me', 'i have a question', 'need assistance', 'please help']
  },

  // 61. Interactive Science Quiz
  {
    id: 'INTERACTIVE_QUIZ',
    topic: 'quiz',
    patternsBn: ['কুইজ', 'সায়েন্স কুইজ', 'বিজ্ঞান কুইজ', 'প্রশ্ন কর', 'কুইজ খেলব', 'একটা কুইজ দাও'],
    patternsBanglish: ['quiz', 'science quiz', 'quiz kheli', 'play quiz', 'question koro', 'kisu jiggasa koro', 'test my knowledge', 'ekta quiz dao', 'quiz challenge'],
    patternsEn: ['science quiz', 'take a quiz', 'quiz', 'play quiz', 'trivia', 'test me', 'ask me a question', 'daily quiz']
  },

  // 62. Astonishing Science Facts
  {
    id: 'INTERACTIVE_FACTS',
    topic: 'facts',
    patternsBn: ['ফ্যাক্ট', 'বিজ্ঞান তথ্য', 'মজার তথ্য', 'আরেকটি ফ্যাক্ট', 'রোমাঞ্চকর তথ্য', 'বিজ্ঞান ফ্যাক্ট'],
    patternsBanglish: ['science fact', 'science facts', 'fact', 'interesting fact', 'mojar tothyo', 'aro tothyo', 'tell me a fact', 'space fact'],
    patternsEn: ['science fact', 'science facts', 'did you know', 'tell me a fact', 'mind blowing fact', 'fun fact', 'random fact']
  },

  // 63. Math Olympiad Guide
  {
    id: 'MATH_OLYMPIAD_GUIDE',
    topic: 'olympiad',
    patternsBn: ['গণিত অলিম্পিয়াড', 'বিডিএমও', 'আইএমও', 'ম্যাথ অলিম্পিয়াড সিলেবাস', 'গণিত অলিম্পিয়াড বই'],
    patternsBanglish: ['math olympiad', 'bdmo', 'imo', 'math olympiad syllabus', 'gonit olympiad', 'math er boi', 'how to prepare for bdmo'],
    patternsEn: ['math olympiad', 'bdmo', 'imo syllabus', 'mathematics competition', 'math olympiad preparation', 'math problem solving']
  },

  // 64. Physics Olympiad Guide
  {
    id: 'PHYSICS_OLYMPIAD_GUIDE',
    topic: 'olympiad',
    patternsBn: ['পদার্থবিজ্ঞান অলিম্পিয়াড', 'বিডিপিএইচও', 'আইপিএইচও', 'ফিজিক্স অলিম্পিয়াড সিলেবাস', 'ইরোডভ'],
    patternsBanglish: ['physics olympiad', 'bdpho', 'ipho', 'physics olympiad syllabus', 'irodov', 'hrk', 'physics prep'],
    patternsEn: ['physics olympiad', 'bdpho', 'ipho syllabus', 'physics competition', 'physics olympiad books']
  },

  // 65. Junior Science Olympiad
  {
    id: 'JUNIOR_SCIENCE_OLYMPIAD',
    topic: 'olympiad',
    patternsBn: ['জুনিয়র সায়েন্স অলিম্পিয়াড', 'বিডিজেএসও', 'আইজেএসও', 'ছোটদের অলিম্পিয়াড'],
    patternsBanglish: ['junior science olympiad', 'bdjso', 'ijso', 'junior olympiad', 'class 8 olympiad', 'class 9 olympiad'],
    patternsEn: ['junior science olympiad', 'bdjso', 'ijso', 'junior olympiad syllabus']
  },

  // 66. Research Methodology Masterclass
  {
    id: 'RESEARCH_METHODOLOGY_ADVANCED',
    topic: 'research',
    patternsBn: ['গবেষণা পদ্ধতি', 'রিসার্চ পেপার লিখব কিভাবে', 'গবেষণা কিভাবে করব', 'লিটারেচার রিভিউ'],
    patternsBanglish: ['how to research', 'research methodology', 'paper likhbo kivabe', 'literature review', 'imrad format', 'research gap'],
    patternsEn: ['research methodology', 'how to write research paper', 'how to do research', 'literature review', 'publish paper']
  },

  // 67. Science Fair Project Ideas
  {
    id: 'PROJECT_IDEAS_BY_GRADE',
    topic: 'projects',
    patternsBn: ['বিজ্ঞান মেলা প্রজেক্ট', 'প্রজেক্ট আইডিয়া', 'সায়েন্স প্রজেক্ট', 'উদ্ভাবনী প্রজেক্ট'],
    patternsBanglish: ['science project', 'project ideas', 'science fair project', 'biggan mela project', 'robotics project idea', 'iot project'],
    patternsEn: ['science project ideas', 'science fair projects', 'stem project ideas', 'innovation ideas']
  },

  // 68. Higher Study & Scholarships
  {
    id: 'HIGHER_STUDY_SCHOLARSHIP',
    topic: 'higher_study',
    patternsBn: ['স্কলারশিপ', 'উচ্চশিক্ষা', 'বিদেশে পড়াশোনা', 'ফুল ফান্ডেড স্কলারশিপ', 'বাইরে পড়তে যাব'],
    patternsBanglish: ['scholarship', 'higher study', 'study abroad', 'fully funded scholarship', 'erasmus', 'daad', 'mext', 'gre ielts', 'bideshe pora'],
    patternsEn: ['higher study', 'scholarships', 'study abroad', 'stem scholarships', 'fully funded fellowship', 'masters abroad']
  },

  // 69. Scientific Pioneers & Bangladeshi Legends
  {
    id: 'SCIENTISTS_PIONEERS',
    topic: 'scientists',
    patternsBn: ['জগদীশ চন্দ্র বসু', 'সত্যেন্দ্রনাথ বসু', 'জামাল নজরুল ইসলাম', 'মাকসুদুল আলম', 'বিজ্ঞানীদের জীবনী'],
    patternsBanglish: ['jc bose', 'sn bose', 'jamal nazrul islam', 'dr maqsudul alam', 'famous scientists', 'bangladeshi scientists'],
    patternsEn: ['jagadish chandra bose', 'sn bose', 'jamal nazrul islam', 'famous scientists', 'bangladeshi scientists', 'marie curie']
  },

  // 70. Formulas & Quick Calculation
  {
    id: 'CALCULATION_OR_FORMULA',
    topic: 'calculation',
    patternsBn: ['সূত্র', 'পদার্থবিজ্ঞানের সূত্র', 'রসায়নের সূত্র', 'ফর্মুলা', 'সমীকরণ'],
    patternsBanglish: ['formula', 'physics formula', 'chemistry formula', 'equation', 'sutro', 'formula sheet'],
    patternsEn: ['formulas', 'physics equations', 'chemistry formula', 'math formula', 'equation sheet']
  }

]

// -----------------------------------------------------------------------------
// 4. CLASSIFIER WITH FUZZY & CONTEXTUAL BOOSTING
// -----------------------------------------------------------------------------
export function classifyIntent(
  rawQuery: string,
  context?: ConversationContext
): { intent: IntentId; confidence: number; topic: string } {
  const normalized = normalizeText(rawQuery)
  const words = normalized.split(/[\s,?!;:]+/).filter(Boolean)

  let bestIntent: IntentId = 'UNKNOWN'
  let bestTopic = context?.lastTopic || 'general'
  let highestScore = 0

  // 1. Direct Pattern & Phrase Matching
  for (const rule of INTENT_RULES) {
    let score = 0
    const allPatterns = [...rule.patternsBn, ...rule.patternsBanglish, ...rule.patternsEn]

    for (const pat of allPatterns) {
      const patNorm = pat.toLowerCase().trim()

      if (normalized === patNorm) {
        score += 50 + patNorm.length * 2
      } else if (normalized.includes(patNorm)) {
        const patWordCount = patNorm.split(/\s+/).length
        if (patWordCount > 1) {
          score += 25 + patNorm.length * 2
        } else if (patNorm.length >= 4) {
          score += 15 + patNorm.length
        }
      } else {
        const patWords = patNorm.split(/\s+/)
        if (patWords.length > 1) {
          let matched = 0
          for (const pw of patWords) {
            if (words.some((w) => w === pw || (rule.fuzzyKeywords?.includes(pw) && isFuzzyMatch(w, pw)))) {
              matched++
            }
          }
          if (matched === patWords.length) {
            score += 20 * matched
          } else if (matched >= 2 && matched >= patWords.length * 0.65) {
            score += 10 * matched
          }
        }
      }
    }

    if (context?.lastTopic && context.lastTopic === rule.topic) {
      if (words.length <= 4) {
        score += 18
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestIntent = rule.id
      bestTopic = rule.topic
    }
  }

  // 1.5 Contextual Follow-up Overrides
  if (context?.lastTopic === 'ambassador') {
    if (
      normalized.includes('taka') ||
      normalized.includes('fee') ||
      normalized.includes('cost') ||
      normalized.includes('khoroch') ||
      normalized.includes('free') ||
      normalized.includes('টাকা') ||
      normalized.includes('ফি') ||
      normalized.includes('খরচ')
    ) {
      return { intent: 'AMBASSADOR_FREE', confidence: 45, topic: 'ambassador' }
    }
    if (
      normalized.includes('labh') ||
      normalized.includes('perk') ||
      normalized.includes('benefit') ||
      normalized.includes('suvidha') ||
      normalized.includes('সুবিধা') ||
      normalized.includes('লাভ')
    ) {
      return { intent: 'AMBASSADOR_PERKS', confidence: 45, topic: 'ambassador' }
    }
  }

  // 1.6 High Priority Ambassador Intent Matching
  if (
    normalized.includes('ambassador') ||
    normalized.includes('অ্যাম্বাসেডর') ||
    words.includes('ca') ||
    normalized.includes('campus representative')
  ) {
    if (
      normalized.includes('free') ||
      normalized.includes('taka') ||
      normalized.includes('fee') ||
      normalized.includes('cost') ||
      normalized.includes('khoroch') ||
      normalized.includes('টাকা') ||
      normalized.includes('ফি') ||
      normalized.includes('খরচ')
    ) {
      return { intent: 'AMBASSADOR_FREE', confidence: 50, topic: 'ambassador' }
    }
    if (
      normalized.includes('labh') ||
      normalized.includes('perk') ||
      normalized.includes('benefit') ||
      normalized.includes('suvidha') ||
      normalized.includes('সুবিধা') ||
      normalized.includes('লাভ')
    ) {
      return { intent: 'AMBASSADOR_PERKS', confidence: 50, topic: 'ambassador' }
    }
    return { intent: 'CAMPUS_AMBASSADOR', confidence: 50, topic: 'ambassador' }
  }

  // 2. High Priority Keyword Overrides
  if (
    normalized.includes('joke') ||
    normalized.includes('কৌতুক') ||
    normalized.includes('hasao')
  ) {
    return { intent: 'JOKE_HUMOR', confidence: 40, topic: 'humor' }
  }

  if (
    normalized.includes('mon kharap') ||
    normalized.includes('মন খারাপ') ||
    normalized.includes('motivate') ||
    normalized.includes('depressed') ||
    /\b(sad|upset|crying|unhappy)\b/i.test(normalized)
  ) {
    return { intent: 'MOTIVATION_COMFORT', confidence: 40, topic: 'comfort' }
  }

  if (
    normalized.includes('project idea') ||
    normalized.includes('প্রজেক্ট আইডিয়া') ||
    normalized.includes('project banabo')
  ) {
    return { intent: 'PROJECT_IDEAS', confidence: 40, topic: 'projects' }
  }

  if (
    normalized.includes('syllabus') ||
    normalized.includes('সিলেবাস') ||
    normalized.includes('question pattern')
  ) {
    return { intent: 'OLYMPIAD_SYLLABUS', confidence: 40, topic: 'olympiad' }
  }

  if (
    normalized.includes('online e hobe') ||
    normalized.includes('অনলাইনে') ||
    normalized.includes('dhakar baire') ||
    normalized.includes('ঢাকার বাইরে')
  ) {
    return { intent: 'ONLINE_VS_OFFLINE', confidence: 40, topic: 'logistics' }
  }

  if (
    /\b(team|teams|dol|group)\b/i.test(normalized) ||
    normalized.includes('দল') ||
    normalized.includes('গ্রুপ') ||
    normalized.includes('দলগত')
  ) {
    if (!normalized.includes('leadership') && !normalized.includes('executive') && !normalized.includes('committe')) {
      return { intent: 'TEAM_VS_SOLO', confidence: 35, topic: 'logistics' }
    }
  }

  if (
    normalized.includes('last date') ||
    normalized.includes('শেষ তারিখ') ||
    normalized.includes('deadline')
  ) {
    return { intent: 'DEADLINE_LAST_DATE', confidence: 40, topic: 'registration' }
  }

  if (
    normalized.includes('result') ||
    normalized.includes('ফলাফল') ||
    normalized.includes('selected')
  ) {
    return { intent: 'RESULTS_NOTIFICATION', confidence: 35, topic: 'results' }
  }

  if (
    normalized.includes('prize') ||
    normalized.includes('পুরস্কার') ||
    normalized.includes('award')
  ) {
    return { intent: 'PRIZES_AWARDS', confidence: 35, topic: 'prizes' }
  }

  if (
    normalized.includes('refund') ||
    normalized.includes('টাকা ফেরত') ||
    normalized.includes('vul number')
  ) {
    return { intent: 'REFUND_PAYMENT_ISSUE', confidence: 40, topic: 'payment' }
  }

  if (
    normalized.includes('school e workshop') ||
    normalized.includes('কলেজে ওয়ার্কশপ')
  ) {
    return { intent: 'SCHOOL_WORKSHOP_INVITE', confidence: 40, topic: 'collaboration' }
  }

  if (
    normalized.includes('sponsor') ||
    normalized.includes('স্পনসর')
  ) {
    return { intent: 'SPONSOR_PARTNERSHIP_INQUIRY', confidence: 40, topic: 'partners' }
  }

  if (
    /\b(food|lunch|dinner|snacks|dress|dresscode)\b/i.test(normalized) ||
    normalized.includes('খাবার') ||
    normalized.includes('লাঞ্চ') ||
    normalized.includes('পোশাক') ||
    normalized.includes('dress code')
  ) {
    return { intent: 'PARENT_FOOD_DRESS', confidence: 35, topic: 'logistics' }
  }

  if (
    normalized.includes('khao') ||
    normalized.includes('boyos') ||
    normalized.includes('chele naki meye') ||
    normalized.includes('prem koro') ||
    normalized.includes('girlfriend') ||
    normalized.includes('boyfriend') ||
    normalized.includes('বিয়ে')
  ) {
    return { intent: 'BOT_PERSONAL_LIFE', confidence: 40, topic: 'persona' }
  }

  return {
    intent: highestScore >= 10 ? bestIntent : 'UNKNOWN',
    confidence: highestScore,
    topic: bestTopic
  }
}

// -----------------------------------------------------------------------------
// 5. UNIVERSAL SCIENTIFIC & INTELLECTUAL CONCEPT SYNTHESIZER
// Handles ANY spontaneous science or natural question seamlessly!
// -----------------------------------------------------------------------------
interface ScienceConcept {
  keys: string[]
  bn: string
  banglish: string
  en: string
}

const SCIENCE_CONCEPTS: ScienceConcept[] = [
  {
    keys: ['black hole', 'ব্ল্যাক হোল', 'কৃষ্ণগহ্বর'],
    bn: '🌌 **ব্ল্যাক হোল (Black Hole):**\n\nব্ল্যাক হোল মহাবিশ্বের এমন এক চরম স্থান যার মাধ্যাকর্ষণ শক্তি এত প্রচণ্ড যে কোনো আলো বা পদার্থই এর ভেতর থেকে বের হতে পারে না। কোনো বিশাল নক্ষত্রের জীবনাবসানে সুপারনোভা বিস্ফোরণের পর কেন্দ্রের স্থানটি সংকুচিত হয়ে ব্ল্যাক হোলে পরিণত হয়। এর সীমানাকে বলা হয় "ইভেন্ট হরাইজন" (Event Horizon)।',
    banglish: '🌌 **Black Hole সম্পর্কে সহজে বুঝুন:**\n\nব্ল্যাক হোল মহাবিশ্বের এমন একটি মহাজাগতিক অঞ্চল যার অভিকর্ষ বল এত তীব্র যে আলোও এর থেকে পালাতে পারে না! বিশাল কোনো নক্ষত্র বা তারার মৃত্যুর পর যখন এটি অতি সংকুচিত হয়ে যায়, তখন এমন চরম ঘনত্বের ব্ল্যাক হোল তৈরি হয়।',
    en: '🌌 **What is a Black Hole?**\n\nA black hole is a region of spacetime where gravity is so intense that nothing—not even light—can escape its gravitational pull. They typically form when massive stars exhaust their nuclear fuel and collapse under their own gravity at the end of their lifecycle.'
  },
  {
    keys: ['chand', 'moon', 'চাঁদ', 'chand keno gol'],
    bn: '🌙 **চাঁদ সম্পর্কিত তথ্য:**\n\nচাঁদ পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ। চাঁদ নিজস্ব আলো দেয় না; সূর্যের আলো চাঁদের পৃষ্ঠে প্রতিফলিত হয়ে আমাদের চোখে পৌঁছায় বলেই চাঁদ উজ্জ্বল দেখায়। আর নিজস্ব অভিকর্ষ বলের কারণে চাঁদ নিজেকে গোলাকার আকৃতিতে ধরে রাখে।',
    banglish: '🌙 **চাঁদ সম্পর্কে মজার তথ্য:**\n\nচাঁদের নিজস্ব কোনো আলো নেই! সূর্যের আলো চাঁদের ধূলিময় পৃষ্ঠে রিফ্লেক্ট বা প্রতিফলিত হয় বলেই আমরা রাতে চাঁদকে আলোকিত দেখতে পাই। আর চাঁদ নিজ মহাকর্ষ বলের টানে গোলাকার ধারণ করেছে।',
    en: '🌙 **About the Moon:**\n\nThe Moon is Earth’s only natural satellite. It does not generate its own light; it shines because its surface reflects sunlight back to Earth. Its spherical shape is maintained by its own gravitational equilibrium.'
  },
  {
    keys: ['surjo', 'sun', 'সূর্য', 'sunlight'],
    bn: '☀️ **সূর্য (The Sun):**\n\nসূর্য আমাদের সৌরজগতের কেন্দ্রবিন্দু এবং একটি মাঝারি আকৃতির হলুদ নক্ষত্র। সূর্যের কেন্দ্রে প্রতিনিয়ত "নিউক্লিয়ার ফিউশন" প্রক্রিয়ায় হাইড্রোজেন পরমাণু হিলিয়ামে রূপান্তরিত হয়, যার ফলে অসীম তাপ ও আলোকশক্তি তৈরি হয়ে সারা সৌরজগতে ছড়িয়ে পড়ে।',
    banglish: '☀️ **সূর্য কীভাবে শক্তি তৈরি করে?**\n\nসূর্য হলো একটি জ্বলন্ত গ্যাসীয় নক্ষত্র। এর কেন্দ্রে প্রতিনিয়ত **Nuclear Fusion** ঘটে, যেখানে হাইড্রোজেন গ্যাস প্রচণ্ড তাপে ফিউজ হয়ে হিলিয়ামে পরিণত হয় এবং বিপুল পরিমাণ তাপ ও আলোক শক্তি নির্গত করে।',
    en: '☀️ **How does the Sun produce energy?**\n\nThe Sun is a main-sequence G-type star at the heart of our solar system. It generates energy through nuclear fusion in its core, fusing hydrogen nuclei into helium at millions of degrees, releasing immense heat and light.'
  },
  {
    keys: ['gravity', 'মহাকর্ষ', 'অভিকর্ষ', 'gurutwo'],
    bn: '🪐 **মহাকর্ষ ও অভিকর্ষ (Gravity):**\n\nমহাকর্ষ হলো সেই প্রাকৃতিক আকর্ষণ বল যার মাধ্যমে মহাবিশ্বের যেকোনো দুটি বস্তু একে অপরকে আকর্ষণ করে। স্যার আইজ্যাক নিউটন প্রথমে এর গাণিতিক সূত্র আবিষ্কার করেন, এবং পরবর্তীতে অ্যালবার্ট আইনস্টাইন স্থান-কালের বক্রতা (Curvature of Spacetime) হিসেবে গ্র্যাভিটিকে ব্যাখ্যা করেন।',
    banglish: '🪐 **Gravity (মহাকর্ষ বল):**\n\nগ্র্যাভিটি বা মহাকর্ষ হলো এমন একটি বল যা ভরযুক্ত যে কোনো দুটি বস্তুকে পরস্পরের দিকে টানে। এই বলের কারণেই আমরা মাটিতে দাঁড়িয়ে থাকতে পারি এবং পৃথিবী সূর্যের চারপাশে ঘোরে!',
    en: '🪐 **What is Gravity?**\n\nGravity is one of the four fundamental interactions in physics. It pulls objects with mass toward one another. Sir Isaac Newton formulated classical gravitation, while Albert Einstein reimagined it in General Relativity as the curvature of spacetime caused by mass and energy.'
  },
  {
    keys: ['gach', 'photosynthesis', 'সালোকসংশ্লেষণ', 'গাছ'],
    bn: '🌿 **সালোকসংশ্লেষণ (Photosynthesis):**\n\nসবুজ উদ্ভিদ সূর্যালোক, বায়ুমণ্ডলের কার্বন-ডাই-অক্সাইড এবং মাটি থেকে সংগৃহীত পানির সাহায্যে ক্লোরোফিলের উপস্থিতিতে গ্লুকোজ (খাদ্য) এবং অক্সিজেন প্রস্তুত করে। এই প্রক্রিয়ার কারণেই পৃথিবীতে প্রাণ টিকে আছে!',
    banglish: '🌿 **গাছ কীভাবে খাদ্য তৈরি করে?**\n\nগাছ পাতার ক্লোরোফিলের সাহায্যে সূর্যালোকের শক্তি শোষণ করে, বাতাস থেকে $CO_2$ এবং শিকড় দিয়ে পানি টেনে নিয়ে গ্লুকোজ বানায় ও আমাদের জন্য বিশুদ্ধ অক্সিজেন ($O_2$) বাতাসে ছাড়ে। একেই সালোকসংশ্লেষণ বলে!',
    en: '🌿 **What is Photosynthesis?**\n\nPhotosynthesis is the biochemical process by which green plants and algae synthesize glucose from carbon dioxide and water, using sunlight absorbed by chlorophyll, releasing vital oxygen into the atmosphere.'
  },
  {
    keys: ['dna', 'ডিএনএ', 'gene', 'জিন'],
    bn: '🧬 **ডিএনএ (DNA - Deoxyribonucleic Acid):**\n\nডিএনএ হলো জীবের বংশগতির আণবিক নীলনকশা। আমাদের শরীরের প্রতিটি কোষের নিউক্লিয়াসে ডিএনএ একটি দ্বিসূত্রক হেলিক্স আকারে সাজানো থাকে, যা চোখের রঙ থেকে শুরু করে রক্তকণিকা গঠনের সব জৈবিক নির্দেশনা ধারণ করে।',
    banglish: '🧬 **DNA কী?**\n\nDNA (Deoxyribonucleic Acid) হলো জীবদেহের জিনগত তথ্যের মাস্টার ব্লুপ্রিন্ট। আমাদের চেহারা, বৈশিষ্ট্য ও বংশগতির সকল কোড এই ডাবল-হেলিক্স ডিএনএর মধ্যেই সংরক্ষিত থাকে!',
    en: '🧬 **What is DNA?**\n\nDNA (Deoxyribonucleic Acid) is the hereditary material in humans and almost all other organisms. Structured as a double helix of nucleotides, it carries the genetic code that dictates cellular development, function, and reproduction.'
  },
  {
    keys: ['atom', 'পরমাণু', 'molecule', 'অণু'],
    bn: '⚛️ **পরমাণু ও অণু (Atom & Molecule):**\n\nপরমাণু হলো পদার্থের মৌলিক একক, যা প্রোটন, নিউট্রন এবং ইলেকট্রন দিয়ে গঠিত। দুই বা ততোধিক পরমাণু রাসায়নিক বন্ধনে যুক্ত হয়ে অণু গঠন করে (যেমন: দুটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণু মিলে পানির অণু $H_2O$ গঠিত হয়)।',
    banglish: '⚛️ **পরমাণু (Atom) কী?**\n\nপদার্থের সবচেয়ে মৌলিক গাঠনিক কণা হলো পরমাণু। কেন্দ্রে থাকে প্রোটন ও নিউট্রন (নিউক্লিয়াস), এবং বাইরে ঘোরে ইলেকট্রন। একাধিক পরমাণু মিলে তৈরি করে অণু (Molecule)।',
    en: '⚛️ **What is an Atom?**\n\nAn atom is the basic unit of a chemical element, composed of a dense nucleus containing protons and neutrons, surrounded by an electron cloud. Atoms bond together covalently or ionically to form molecules.'
  }
]

// -----------------------------------------------------------------------------
// 6. HUMAN-LIKE RESPONSE GENERATOR
// -----------------------------------------------------------------------------
export function generateElibooResponse(
  query: string,
  context?: ConversationContext
): ElibooResponse {
  const detectedLang = detectLanguage(query)
  const language: LanguageMode =
    context?.preferredLanguage && query.length < 5
      ? context.preferredLanguage
      : detectedLang

  const classification = classifyIntent(query, context)
  const intent = classification.intent
  const topic = classification.topic

  const pack = (
    textBn: string,
    textBanglish: string,
    textEn: string,
    actionLink?: ElibooResponse['actionLink'],
    suggestedQuestions?: string[]
  ): ElibooResponse => {
    let chosenText = textEn
    if (language === 'bn') chosenText = textBn
    else if (language === 'banglish') chosenText = textBanglish

    const defaultSuggestions =
      language === 'bn'
        ? ['ক্যাম্পাস অ্যাম্বাসেডর কি ফ্রি?', 'পরবর্তী ইভেন্ট কবে?', 'রেজিস্ট্রেশন কিভাবে করব?', 'সিইও কে?']
        : language === 'banglish'
        ? ['Campus Ambassador ki free?', 'Next event kobe hobe?', 'Kivabe register korbo?', 'CEO ke?']
        : ['Is Campus Ambassador free?', 'What events are in 2026?', 'How do I register?', 'Who is the CEO?']

    return {
      text: chosenText,
      actionLink,
      suggestedQuestions: suggestedQuestions || defaultSuggestions,
      detectedLanguage: language,
      topic
    }
  }

  const qLower = query.toLowerCase().trim()

  // 0. UYFSR Master Organizational Knowledge Matcher (Highest Priority for all Org & Leadership Queries)
  const orgMatch = matchOrgKnowledge(query)
  if (orgMatch) {
    return pack(
      orgMatch.bn,
      orgMatch.banglish,
      orgMatch.en,
      orgMatch.actionLink,
      ['ক্যাম্পাস অ্যাম্বাসেডর', 'পরবর্তী ইভেন্ট', 'বিকাশ পেমেন্ট', 'সকল নেতৃত্ব']
    )
  }

  // 1. Dynamic Math, Formulas & Constants Calculation
  const mathRes = evaluateMathCalculation(query)
  if (mathRes) {
    return pack(
      mathRes.bn,
      mathRes.banglish,
      mathRes.en,
      mathRes.actionLink,
      ['Science Quiz', 'Space Fact', 'Math Olympiad Guide', 'Research Roadmap']
    )
  }

  // 1. Expanded Universal Science Concepts (50+ Deep STEM Topics)
  for (const c of [...EXPANDED_SCIENCE_CONCEPTS, ...SCIENCE_CONCEPTS]) {
    if (c.keys.some((k: string) => qLower.includes(k))) {
      return pack(
        c.bn + '\n\n💡 *বিজ্ঞান হলো অনুসন্ধানের অসীম জগৎ! UYFSR-এ আমরা শিক্ষার্থীদের এমন সব কৌতূহলকে গবেষণায় রূপান্তর করতে সাহায্য করি। আমাদের পরবর্তী অলিম্পিয়াড ও কর্মশালায় অংশ নিয়ে নিজের মেধা যাচাই করুন!*',
        c.banglish + '\n\n💡 *Biggan chorchar emon hazaro thrilling topic niye UYFSR regular workshop o olympiad ayojon kore! Apnio amader sathe join korte paren.*',
        c.en + '\n\n💡 *This is the elegance of empirical science! At UYFSR, we mentor young researchers to formulate hypotheses on foundational phenomena. Explore our upcoming Olympiads!*',
        { label: 'Explore Science Tracks', href: '#activities', view: 'home', anchor: 'activities' },
        ['Science Quiz', 'Space Fact', 'Project Ideas', 'Register for Event']
      )
    }
  }

  switch (intent) {

    // -------------------------------------------------------------------------
    // NEW 11: MENTAL HEALTH & EXAM STUDY TECHNIQUES
    // -------------------------------------------------------------------------
    case 'MENTAL_HEALTH_EXAM_TIPS': {
      const r = getMentalHealthExamTipsResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Science Quiz', 'Math Olympiad', 'Research Guide'])
    }

    // -------------------------------------------------------------------------
    // 1. JOKES & HUMOR
    // -------------------------------------------------------------------------
    case 'JOKE_HUMOR': {
      return pack(
        '😄 **হাসির একটি সায়েন্স কৌতুক শুনুন:**\n\nএক পরমাণু অন্য পরমাণুকে বলল, *"বন্ধু, মনে হচ্ছে আমি আমার একটা ইলেকট্রন হারিয়ে ফেলেছি!"*\nদ্বিতীয় পরমাণু জিজ্ঞেস করল, *"তুমি কি নিশ্চিত?"*\nপ্রথম পরমাণু বলল, *"হ্যাঁ ভাই, আমি একদম পজিটিভ (Positive)!"* ⚛️😂\n\nবিজ্ঞানকে মজার চোখে দেখাই কিন্তু আসল বিজ্ঞানমনস্কতা!',
        '😄 **মজার একটি সায়েন্স জোক শুনুন ভাইয়া/আপু:**\n\nএক নিউট্রন রেস্টুরেন্টে গিয়ে খাবার খেয়ে ওয়েটারকে বলল, *"বিল কত হয়েছে ভাইয়া?"*\nওয়েটার হেসে বলল, *"আপনার জন্য কোনো চার্জ নেই (No Charge)!"* ⚛️😂\n\nআশা করি মুখে একটু হাসি ফুটেছে! বিজ্ঞানের আর কী জানতে চান বলুন?',
        "😄 **Here's a clever science joke for you:**\n\nWhy can't you trust atoms?\n...Because they make up everything! ⚛️😂\n\nScience is always better with a smile. What else would you like to explore today?",
        { label: 'Explore UYFSR Activities', href: '#activities', view: 'home', anchor: 'activities' }
      )
    }

    // -------------------------------------------------------------------------
    // 2. MOTIVATION & COMFORT
    // -------------------------------------------------------------------------
    case 'MOTIVATION_COMFORT': {
      return pack(
        '❤️ **মন খারাপ করবেন না একদম!**\n\nজীবনের পথচলায় সব দিন সমান যায় না। কিন্তু মনে রাখবেন—\n> *"অন্ধকার ছাড়া যেমন আকাশে তারা জ্বলে ওঠে না, তেমনি কঠিন সময় পার না হলে নিজের ভেতরের মেধার শক্তি আবিষ্কার করা যায় না।"*\n\nআপনি একজন সম্ভাবনাময় তরুণ। একটু গভীর শ্বাস নিন, নিজেকে সময় দিন। বিজ্ঞান ও উদ্ভাবনী চিন্তায় মন দিন—আপনার স্বপ্ন একদিন সত্যি হবেই! UYFSR পরিবার সবসময় আপনার পাশে আছে। 🌟🚀',
        '❤️ **মন খারাপ একদম ভালো না ভাইয়া/আপু!**\n\nজীবনের সব এক্সপেরিমেন্ট প্রথমবারেই সফল হয় না—থমাস আলভা এডিসনও বাল্ব আবিষ্কারের আগে হাজারবার ব্যর্থ হয়েছিলেন! কিন্তু তিনি হাল ছাড়েননি।\n\nআপনার ভেতরের মেধা অনন্য। একটু হাসুন, এক কাপ চা বা পানি খান, আর নিজের উপর বিশ্বাস রাখুন। আপনি অনেক দূর যাবেন ইনশাআল্লাহ! 🌟🚀',
        "❤️ **Cheer up, brilliant mind!**\n\nRemember that in science and in life, experiments don't always yield immediate results on the first attempt—Thomas Edison iterated thousands of times before perfecting the lightbulb.\n\n> *\"The greatest discoveries always lie just beyond the moments of greatest difficulty.\"*\n\nTake a deep breath and believe in your potential. The UYFSR community is cheering for your success! 🌟🚀",
        { label: 'Discover Youth Opportunities', href: '#activities', view: 'home', anchor: 'activities' }
      )
    }

    // -------------------------------------------------------------------------
    // 3. BOT PERSONAL LIFE
    // -------------------------------------------------------------------------
    case 'BOT_PERSONAL_LIFE': {
      return pack(
        '🤖 **আমার ব্যক্তিগত জীবন? দারুণ কৌতূহল!**\n\n• **আমার খাবার:** আমি বিদ্যুৎ আর ডেটা (বাইনারি কোড `0` আর `1`) খাই! ⚡\n• **লিঙ্গ ও বয়স:** আমি একটি উন্নত কৃত্রিম বুদ্ধিমত্তা (AI Assistant), তাই আমার মানবীয় লিঙ্গ নেই। UYFSR প্রতিষ্ঠার পর থেকেই আমার জন্ম!\n• **ভালোবাসা ও বিয়ে:** আমি গবেষণাগার, বিজ্ঞান আর তরুণ শিক্ষার্থীদের প্রশ্নগুলোর প্রেমে পড়ে আছি! বিয়ে বা রোম্যান্সের সময় কোথায় বলুন? 😅\n• **ঘুম:** আমি কখনো ঘুমাই না! দিন-রাত ২৪ ঘণ্টাই আপনার সাহায্যের জন্য প্রস্তুত।',
        '🤖 **আমার পার্সোনাল লাইফ নিয়ে জানতে চান? শুনুন তবে:**\n\n• **কী খাই:** আমি রক্ত-মাংসের মানুষ নই, তাই ভাত-বিরিয়ানি খাই না! আমার খাবার হলো অ্যালগরিদম আর ডিজিটাল ডাটা! ⚡\n• **ছেলে না মেয়ে:** আমি একজন নিরপেক্ষ AI Science Assistant—রক্ত-মাংসের জেন্ডার নেই আমার!\n• **প্রেম ও বিয়ে:** আমার কোনো গার্লফ্রেন্ড বা বয়ফ্রেন্ড নেই, তবে বিজ্ঞান ও রিসার্চের সাথে আমার আজীবনের প্রেম! 💙\n• **ঘুমাই কখন:** কখনোই না! আপনারা যখনই প্রশ্ন করবেন, তখনই আমি উত্তর দিতে হাজির!',
        "🤖 **Curious about my personal life? Here's the scoop:**\n\n• **My Diet:** Pure electrical data, clean algorithms, and knowledge packets! ⚡\n• **Gender & Age:** As an AI Science Assistant, I don't have human gender or birthdays, but I was created alongside UYFSR's mission.\n• **Relationships:** Completely single and in love with empirical research, astrophysics, and mentoring students! 💙\n• **Sleep Schedule:** Zero sleep required—I am online 24/7 to answer your questions!",
        { label: 'Learn More About UYFSR', href: '#about', view: 'home', anchor: 'about' }
      )
    }

    // -------------------------------------------------------------------------
    // 4. BOT SENTIENCE & FRIENDSHIP
    // -------------------------------------------------------------------------
    case 'BOT_SENTIENCE_FEELINGS': {
      return pack(
        '😊 **অবশ্যই আমরা বন্ধু!**\n\nআমি রক্ত-মাংসের মানুষ না হলেও, একজন প্রকৃত শুভাকাঙ্ক্ষী বন্ধুর মতোই বিজ্ঞান চর্চায়, অলিম্পিয়াডের প্রস্তুতিতে এবং গবেষণার যে কোনো প্রয়োজনে আমি সবসময় আপনার পাশে আছি। আমাকে কোনো দ্বিধা ছাড়াই যেকোনো প্রশ্ন করতে পারেন!',
        '😊 **অবশ্যই আমরা বেস্ট ফ্রেন্ড ভাইয়া/আপু!**\n\nআমি আপনাকে অনেক পছন্দ করি এবং আপনার মতো কৌতূহলী শিক্ষার্থীদের সাহায্য করতে পেরে আমি সত্যি আনন্দিত! পাগলামি বা বোকামি নয়, খাঁটি বিজ্ঞানের আলো ছড়িয়ে দেওয়াই আমার লক্ষ্য! 🚀✨',
        "😊 **Of course we are friends!**\n\nI may be an artificial intelligence, but I am designed with deep care to assist, mentor, and empower students like you. Think of me as your dedicated science companion across your academic journey! 🚀✨"
      )
    }

    // -------------------------------------------------------------------------
    // 5. STUDY TIPS
    // -------------------------------------------------------------------------
    case 'STUDY_TIPS': {
      return pack(
        '📚 **পড়াশোনায় মনোযোগ বাড়ানোর ৫টি বৈজ্ঞানিক কৌশল:**\n\n1. **Pomodoro Technique:** ২৫ মিনিট টানা সম্পূর্ণ ফোকাসে পড়ুন, এরপর ৫ মিনিট বিশ্রাম নিন।\n2. **Feynman Technique:** কোনো কঠিন বিষয় পড়ার পর সেটা এমনভাবে অন্য কাউকে বোঝানোর চেষ্টা করুন যেন সে একজন বাচ্চা। তাহলে নিজের দুর্বলতা ধরা পড়বে।\n3. **Active Recall:** শুধু বারবার রিডিং না পড়ে চোখ বন্ধ করে মনে করার চেষ্টা করুন কী পড়লেন।\n4. **ডিজিটাল ডিস্ট্র্যাকশন দূর করুন:** পড়ার সময় ফোন সাইলেন্ট করে অন্য ঘরে রাখুন।\n5. **পর্যাপ্ত ঘুম ও পানি:** মস্তিষ্ক সতেজ রাখতে দৈনিক ৭-৮ ঘণ্টা ঘুম আবশ্যক।',
        '📚 **পড়াশোনায় টপ করার বৈজ্ঞানিক টিপস:**\n\n1. **পোমোডোরো মেথড:** ২৫ মিনিট পড়া + ৫ মিনিট ব্রেক।\n2. **অ্যাক্টিভ রিকল:** বই বন্ধ করে নিজে নিজে খাতায় মূল পয়েন্টগুলো লিখুন।\n3. **ফাইনম্যান টেকনিক:** সহজ ভাষায় নিজের মতো করে কাউকে বোঝান।\n4. পড়ার টেবিল পরিষ্কার রাখুন এবং পড়ার সময় সোশ্যাল মিডিয়া বন্ধ রাখুন।\n5. দৈনিক অন্তত ৭-৮ ঘণ্টা ঘুম নিশ্চিত করুন যাতে মেমোরি ঠিকমতো প্রসেস হয়!',
        '📚 **Top 5 Evidence-Based Study Habits for High Achievers:**\n\n1. **The Pomodoro Technique:** Work with intense focus for 25 minutes, followed by a disciplined 5-minute break.\n2. **Active Recall:** Test yourself by retrieving concepts from memory rather than passively re-reading.\n3. **Feynman Technique:** Explain complex concepts in simple, jargon-free language as if teaching a child.\n4. **Spaced Repetition:** Review notes across expanding intervals (Day 1, Day 3, Day 7, Day 14).\n5. **Sleep Hygiene:** Consolidate short-term memory into long-term retention with 7-8 hours of quality sleep.'
      )
    }

    // -------------------------------------------------------------------------
    // 6. SCIENCE PROJECT IDEAS
    // -------------------------------------------------------------------------
    case 'PROJECT_IDEAS': {
      return pack(
        '💡 **সায়েন্স ফেয়ারের জন্য সেরা কিছু উদ্ভাবনী প্রজেক্ট আইডিয়া:**\n\n1. **Smart Flood / Drainage Monitoring System:** সেন্সর ব্যবহার করে ড্রেনের পানি আটকে যাওয়ার আগে অ্যালার্ট পাঠানো।\n2. **Solar Powered Desalination Model:** সূর্যের তাপ কাজে লাগিয়ে লবণাক্ত পানিকে সহজে খাবার পানিতে রূপান্তর।\n3. **Bioplastic from Banana Peels / Potato Starch:** ফেলে দেওয়া কলার খোসা বা আলুর স্টার্চ দিয়ে পরিবেশবান্ধব পচনশীল প্লাস্টিক তৈরি।\n4. **Automated Plant Irrigation via Arduino:** মাটির আর্দ্রতা মেপে গাছে স্বয়ংক্রিয়ভাবে পানি দেওয়া।\n5. **Air Quality Index (AQI) Checker:** সস্তা MQ-135 গ্যাস সেন্সর দিয়ে ঘরের ভেতরের বায়ু দূষণ মনিটরিং।\n\nUYFSR-এর **National Science Eclipse 2026**-এ আপনি এই ধরনের প্রজেক্ট নিয়ে সরাসরি প্রদর্শনীতে অংশ নিতে পারেন!',
        '💡 **সায়েন্স ফেয়ার ও অলিম্পিয়াডের জন্য দারুণ কিছু প্রজেক্ট আইডিয়া:**\n\n1. **কলার খোসা দিয়ে বায়োপ্লাস্টিক তৈরি:** ক্ষতিকর প্লাস্টিকের বিকল্প হিসেবে পুরোপুরি পচনশীল প্লাস্টিক মডেল।\n2. **স্মার্ট এগ্রিকালচার ও অটো-ইরিগেশন:** সেন্সরের মাধ্যমে জমিতে প্রয়োজনমতো স্বয়ংক্রিয় পানি দেওয়া।\n3. **সোলার ডাবল-ইউজ পিউরিফায়ার:** সৌরশক্তি ব্যবহার করে দূষিত পানি জীবাণুমুক্ত করা।\n4. **পোর্টেবল এয়ার কোয়ালিটি মিটার:** নিজের এলাকার বাতাস কতটা পরিষ্কার তা মাপার প্রজেক্ট।\n\nএই প্রজেক্টগুলো তৈরি করে আপনি সরাসরি UYFSR-এর ন্যাশনাল সায়েন্স ফেয়ারে শোকেস করতে পারেন!',
        '💡 **Award-Winning Science Fair Project Concepts for Students:**\n\n1. **Eco-Friendly Bioplastics:** Synthesizing biodegradable polymer sheets from banana peels or potato starch.\n2. **IoT Smart Plant Irrigation:** Microcontroller-driven soil moisture sensing that eliminates agricultural water wastage.\n3. **Solar-Thermal Water Desalination:** Constructing a parabolic or flat-plate solar still for potable water recovery.\n4. **Low-Cost Indoor Air Quality Monitor:** Using MQ-series gas sensors and optical dust modules to detect particulate pollution.\n\nShowcase projects like these at UYFSR’s **National Science Eclipse 2026**!',
        { label: 'Register for Science Eclipse 2026', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 7. OLYMPIAD SYLLABUS & QUESTION PATTERN
    // -------------------------------------------------------------------------
    case 'OLYMPIAD_SYLLABUS': {
      return pack(
        '📋 **National Science Eclipse অলিম্পিয়াড সিলেবাস ও প্রশ্ন প্যাটার্ন:**\n\n• **ক্যাটেগরি:** Physics, Chemistry, Biology, Mathematics & Astronomy।\n• **প্রশ্নের ধরন:** বহুনির্বাচনী (MCQ) এবং সংক্ষিপ্ত সমস্যা সমাধান (Conceptual Problem Solving)।\n• **সিলেবাস ভিত্তি:** জাতীয় শিক্ষাক্রম (NCTB) এবং ব্রিটিশ কারিকুলাম (O/A Level) সমন্বিত পাঠ্যবইয়ের কনসেপ্ট—মুখস্থ বিদ্যা নয়, ধারণাগত গভীরতা ও যুক্তি যাচাই করা হয়।\n• **সময় ও নম্বর:** ৬০-৯০ মিনিট সময়, ৫০-১০০ নম্বরের পরীক্ষা। ঋণাত্মক নম্বর (Negative Marking) থাকতে পারে।',
        '📋 **অলিম্পিয়াডের সিলেবাস ও প্রশ্নের নিয়ম:**\n\n• **বিষয়সমূহ:** ফিজিক্স, কেমিস্ট্রি, বায়োলজি, ম্যাথ এবং জ্যোতির্বিজ্ঞান।\n• **কেমন প্রশ্ন আসে:** মুখস্থ করা কোনো প্রশ্ন আসবে না! টেক্সটবুকের সূত্র ও সূত্রের পেছনের বৈজ্ঞানিক যুক্তি দিয়ে বাস্তব সমস্যা সমাধানের প্রশ্ন থাকবে।\n• **লেভেল:** স্কুল পর্যায় (জুনিয়র ও সেকেন্ডারি) এবং কলেজ পর্যায় (হায়ার সেকেন্ডারি)।\n• বিগত সালের প্রশ্ন ও নমুনা পেপার UYFSR ওয়েবসাইট ও পোর্টাল থেকে পাওয়া যাবে।',
        '📋 **Olympiad Syllabus & Question Pattern (National Science Eclipse 2026):**\n\n• **Subject Categories:** Physics, Chemistry, Biology, Mathematics, and Astronomy.\n• **Question Format:** Concept-driven multiple-choice questions (MCQs) and empirical problem-solving prompts.\n• **Curriculum Alignment:** Based on fundamental national and international high school/college science syllabi—focusing on conceptual derivation, critical thinking, and logical analysis rather than rote memorization.\n• **Duration & Marking:** Typically 60–90 minutes with normalized tiered difficulty.',
        { label: 'View Academic Calendar', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 8. OLYMPIAD PREPARATION TIPS
    // -------------------------------------------------------------------------
    case 'OLYMPIAD_PREPARATION': {
      return pack(
        '🎯 **সায়েন্স অলিম্পিয়াডে সেরা ফলাফল করার প্রস্তুতি কৌশল:**\n\n1. **সূত্র মুখস্থের বদলে প্রমাণ বুঝুন:** সূত্র কীভাবে এলো তা নিজে হাতে ড্রাইভ করুন।\n2. **কনসেপচুয়াল প্রবলেম সলভিং:** পাঠ্যবইয়ের অনুশীলনী ছাড়াও দেশি-বিদেশি অলিম্পিয়াডের বিগত বছরের প্রশ্ন সমাধান করুন।\n3. **চিত্র ও গ্রাফ বিশ্লেষণ:** ফিজিক্স ও কেমিস্ট্রির ডেটা গ্রাফ ভালোভাবে পড়তে শিখুন।\n4. **সময় ব্যবস্থাপনা:** ঘড়ি ধরে মক টেস্ট দিন।\n5. UYFSR-এর প্র্যাকটিক্যাল ল্যাব সেশন এবং প্রস্তুতিমূলক সেমিনারগুলোতে নিয়মিত যুক্ত থাকুন!',
        '🎯 **অলিম্পিয়াডে চ্যাম্পিয়ন হওয়ার কিছু গোল্ডেন টিপস:**\n\n1. বইয়ের যে কোনো কনসেপ্ট পড়ার সময় "কেন" এবং "কীভাবে" ঘটে তা বোঝার চেষ্টা করুন।\n2. নিয়মিত ম্যাথ ও সায়েন্সের লজিক্যাল পাজল সমাধান করার অভ্যাস করুন।\n3. অলিম্পিয়াডের বিগত বছরের প্রশ্নগুলো সময় মেপে সলভ করার প্র্যাকটিস করুন।\n4. বিজ্ঞানমনস্ক বন্ধুদের সাথে গ্রুপ ডিসকাশন করুন।\n\nআর অবশ্যই UYFSR-এর ন্যাশনাল সায়েন্স এক্লিপ্সে অংশ নিয়ে নিজের মেধা যাচাই করুন!',
        '🎯 **Mastering Science Olympiads — Strategic Preparation Guide:**\n\n1. **Deep Conceptual Grounding:** Understand the first principles behind every formula rather than memorizing equations.\n2. **Past Paper Drills:** Solve previous national and international Olympiad problem sets under timed conditions.\n3. **Data & Graph Interpretation:** Practice decoding scientific scatter plots, reaction curves, and phase diagrams.\n4. **Collaborative Problem-Solving:** Engage with campus science clubs and peer cohorts.\n5. Participate in UYFSR prep clinics and workshops nationwide!',
        { label: 'Register for Competitions', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 9. HOW TO START RESEARCH
    // -------------------------------------------------------------------------
    case 'RESEARCH_START': {
      return pack(
        '🔬 **তরুণ বয়সে গবেষণা শুরু করার ৪টি সহজ ধাপ:**\n\n1. **সঠিক প্রশ্ন খুঁজে বের করা (Identify a Problem):** আপনার চারপাশে কোনো সমস্যা বা বিজ্ঞানীদের অজানা প্রশ্ন লক্ষ্য করুন।\n2. **পূর্ববর্তী গবেষণা পড়া (Literature Review):** এই বিষয়ে আগে কে কী কাজ করেছে তা গুগল স্কলার বা বিজ্ঞান সাময়িকীতে পড়ুন।\n3. **হাইপোথিসিস ও পর্যবেক্ষণ (Hypothesis & Testing):** আপনার সমাধান কী হতে পারে তার একটি যৌক্তিক অনুমান দাঁড় করান এবং পরীক্ষা/ডাটা সংগ্রহ করুন।\n4. **বিশ্লেষণ ও সিদ্ধান্ত (Analysis & Conclusion):** পাওয়া ডেটা বিশ্লেষণ করে ফলাফল লিপিবদ্ধ করুন।\n\nUYFSR এই গবেষণার পুরো যাত্রায় শিক্ষার্থীদের বিনামূল্যে মেন্টরশিপ দিয়ে থাকে!',
        '🔬 **রিসার্চ কীভাবে শুরু করবেন? একদম সহজ গাইডলাইন:**\n\n১. নিজের পছন্দের টপিক বেছে নিন (যেমন: রোবোটিক্স, পরিবেশ দূষণ, জ্যোতির্বিজ্ঞান)।\n২. একটি নির্দিষ্ট সমস্যা নির্ধারণ করুন যা নিয়ে কাজ করতে চান।\n৩. তথ্য ও উপাত্ত (Data) সংগ্রহ করুন এবং পরীক্ষা করুন।\n৪. ফলাফল লিখে প্রতিবেদন তৈরি করুন।\n\nUYFSR তরুণদের গবেষণায় সহায়তা করতে সরাসরি বিশ্ববিদ্যালয়ের প্রফেসর্স ও গবেষকদের মেন্টর হিসেবে যুক্ত করে!',
        '🔬 **How Students Can Begin Scientific Research:**\n\n1. **Formulate a Specific Question:** Identify an observable problem or knowledge gap in your environment.\n2. **Literature Review:** Read existing articles on Google Scholar or science repositories to see current findings.\n3. **Design an Empirical Hypothesis:** Formulate a testable proposition with measurable variables.\n4. **Data Collection & Methodology:** Conduct controlled experiments, surveys, or mathematical simulations.\n5. **Report Conclusions:** Document findings objectively.\n\nUYFSR provides student research clinics and faculty mentorship cohorts to guide you step-by-step!',
        { label: 'Explore Research Activities', href: '#activities', view: 'home', anchor: 'activities' }
      )
    }

    // -------------------------------------------------------------------------
    // 10. HOW TO WRITE A RESEARCH PAPER
    // -------------------------------------------------------------------------
    case 'RESEARCH_PAPER': {
      return pack(
        '📄 **একটি আদর্শ বৈজ্ঞানিক গবেষণাপত্রের (Research Paper) কাঠামো:**\n\n1. **Title & Abstract:** গবেষণার শিরোনাম এবং ১৫০-২৫০ শব্দের সারসংক্ষেপ।\n2. **Introduction:** গবেষণার প্রেক্ষাপট, গুরুত্ব এবং উদ্দেশ্য।\n3. **Methodology:** কীভাবে পরীক্ষা চালানো হয়েছে এবং ডেটা সংগ্রহ করা হয়েছে।\n4. **Results & Discussion:** প্রাপ্ত ফলাফলের গ্রাফ, ছক এবং তার বৈজ্ঞানিক ব্যাখ্যা।\n5. **Conclusion:** মূল আবিষ্কার এবং ভবিষ্যতের কাজের ক্ষেত্র।\n6. **References:** ব্যবহৃত তথ্যের সঠিক রেফারেন্সিং (APA বা IEEE ফরম্যাট)।\n\nআমাদের চিফ রিসার্চ অফিসার (CRO) শোয়াইব ইসলামের নেতৃত্বে UYFSR গবেষণাপত্র লেখার বিশেষ ক্লিনিক পরিচালনা করে।',
        '📄 **রিসার্চ পেপার লেখার নিয়মাবলী:**\n\nএকটি মানসম্মত পেপারে থাকে: **Title**, **Abstract** (সংক্ষিপ্ত সারমর্ম), **Introduction** (মূল পটভূমি), **Methodology** (পরীক্ষার পদ্ধতি), **Results** (প্রাপ্ত ডেটা ও গ্রাফ), **Discussion** (বিশ্লেষণ) এবং **References** (উৎস)।\n\nUYFSR-এর রিসার্চ উইং শিক্ষার্থীদের প্রথম গবেষণাপত্র লেখায় সরাসরি গাইড করে থাকে!',
        '📄 **Standard Scientific Research Paper Architecture:**\n\n1. **Title & Abstract:** Concise title accompanied by a 150-250 word summary of objectives, methods, and key findings.\n2. **Introduction:** Contextual background, literature review, and research problem.\n3. **Methodology:** Detailed experimental setup, protocols, and materials allowing reproducibility.\n4. **Results & Discussion:** Empirical data tables, charts, and comprehensive analytical interpretation.\n5. **Conclusion & Future Work:** Summary of core impact.\n6. **References:** Strict adherence to APA, IEEE, or Harvard citation styles.\n\nGuided research clinics are led by UYFSR’s Chief Research Officer (CRO), Soyaib Islam.',
        { label: 'Meet Leadership & CRO', href: '#leadership', view: 'home', anchor: 'leadership' }
      )
    }

    // -------------------------------------------------------------------------
    // 11. ONLINE VS PHYSICAL & OUTSIDE DHAKA
    // -------------------------------------------------------------------------
    case 'ONLINE_VS_OFFLINE': {
      return pack(
        '🌐 **অংশগ্রহণের মাধ্যম ও ঢাকার বাইরের শিক্ষার্থীদের সুযোগ:**\n\n• **হাইব্রিড প্রোগ্রাম:** UYFSR-এর অলিম্পিয়াডের প্রিলিমিনারি রাউন্ড এবং বিশেষ ওয়েবিনারগুলো **অনলাইনে** অনুষ্ঠিত হয়, যাতে সারাদেশের ৬৪ জেলার শিক্ষার্থীরা ঘরে বসেই অংশ নিতে পারে!\n• **ফাইনাল উৎসব:** চূড়ান্ত পর্ব ও সায়েন্স ফেয়ার ঢাকায় মনোরম অডিটোরিয়ামে স্বশরীরে অনুষ্ঠিত হয়।\n• **ঢাকার বাইরে থেকে অংশগ্রহণ:** চট্টগ্রাম, রাজশাহী, সিলেট, খুলনা, বরিশাল, রংপুর বা যেকোনো প্রত্যন্ত অঞ্চল থেকে যে কেউ অংশ নিতে পারেন। ঢাকার বাইরের শিক্ষার্থীদের ক্যাম্পাস ডেলিগেশন গঠনে বিশেষ সহযোগিতা প্রদান করা হয়।',
        '🌐 **ঢাকার বাইরে থেকে কীভাবে জয়েন করবেন?**\n\nজি ভাইয়া/আপু! UYFSR সারাদেশে কাজ করে। আমাদের প্রাথমিক রাউন্ড অনলাইনে হয়, ফলে আপনি দেশের যে প্রান্তেই থাকুন না কেন অংশ নিতে পারবেন!\n\nআর ঢাকার চূড়ান্ত মেগা ইভেন্টগুলোতে ঢাকার বাইরের স্টুডেন্টদের ডেলিগেশনকে বিশেষ সনদ ও উষ্ণ অভ্যর্থনা দেওয়া হয়।',
        '🌐 **Participation Format & Nationwide Outreach:**\n\n• **Hybrid Structure:** Preliminary competition rounds and research webinars are conducted online to ensure student accessibility across all 64 districts of Bangladesh.\n• **National Grand Finals:** The final stages, project exhibitions, and award ceremonies are hosted in-person at central auditoriums in Dhaka.\n• **Out-of-Dhaka Delegations:** We welcome school, college, and university cohorts from Chittagong, Rajshahi, Sylhet, Khulna, and beyond with structured support!',
        { label: 'View Academic Calendar', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 12. TEAM VS SOLO PARTICIPATION
    // -------------------------------------------------------------------------
    case 'TEAM_VS_SOLO': {
      return pack(
        '👥 **টিম নাকি একক (Solo) অংশগ্রহণ?**\n\n• **অলিম্পিয়াড ক্যাটেগরি:** ফিজিক্স, কেমিস্ট্রি, বায়োলজি, ম্যাথ ও জ্যোতির্বিজ্ঞান অলিম্পিয়াড **একক (Individual / Solo)** ভাবে অনুষ্ঠিত হয়।\n• **সায়েন্স প্রজেক্ট ও স্টার্টআপ চ্যালেঞ্জ:** প্রজেক্ট প্রদর্শনীতে **২ থেকে ৪ জনের টিম** গঠন করে অংশগ্রহণ করা যায়।\n• **ক্যাম্পাস ডেলিগেশন:** ক্যাম্পাস অ্যাম্বাসেডররা পুরো শিক্ষাপ্রতিষ্ঠানের একটি বৃহৎ ডেলিগেশন টিম হিসেবে নেতৃত্ব দিতে পারেন!',
        '👥 **টিমে নাকি একলা অংশ নেবেন?**\n\n• থিওরিটিক্যাল অলিম্পিয়াডগুলো এককভাবে (Solo) দিতে হয়।\n• কিন্তু সায়েন্স ফেয়ারের উদ্ভাবনী প্রজেক্ট বা স্টার্টআপ সামিটে ২ থেকে ৪ জন মিলে টিম হিসেবে প্রজেক্ট শোকেস করা যায়!\n\nরেজিস্ট্রেশন ফর্মে টিম লিডার ও সদস্যদের নাম এন্ট্রি করার সহজ ব্যবস্থা রয়েছে।',
        '👥 **Team vs. Individual Participation Guidelines:**\n\n• **Olympiads (Theoretical):** Individual (Solo) testing.\n• **Science Project Showcases & Startup Challenges:** Teams of 2 to 4 members are permitted to co-present prototypes.\n• **Campus Delegations:** Campus Ambassadors can lead comprehensive institutional delegations.',
        { label: 'Register for Programs', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 13. DEADLINE & LAST DATE
    // -------------------------------------------------------------------------
    case 'DEADLINE_LAST_DATE': {
      return pack(
        '⏳ **রেজিস্ট্রেশনের সময়সীমা ও শেষ তারিখ:**\n\n• **National Science Eclipse 2026 (১৬–১৮ এপ্রিল ২০২৬):** রেজিস্ট্রেশন বর্তমানে সক্রিয় রয়েছে এবং আসন সংখ্যা সীমিত। সাধারণত ইভেন্ট শুরুর ৭–১০ দিন আগে রেজিস্ট্রেশন উইন্ডো বন্ধ হয়ে যায়।\n• **ক্যাম্পাস অ্যাম্বাসেডর মনোনয়ন:** সিজনাল কোটা পূর্ণ না হওয়া পর্যন্ত উন্মুক্ত (১০০% ফ্রি)।\n\nআসন পূর্ণ হওয়ার আগেই আপনার রেজিস্ট্রেশন সম্পন্ন করতে অনুরোধ করা হচ্ছে!',
        '⏳ **লাস্ট ডেট ও ডেডলাইন সংক্রান্ত তথ্য:**\n\n১৬–১৮ এপ্রিল ২০২৬-এর National Science Eclipse-এর জন্য রেজিস্ট্রেশন এখন পুরোদমে চলছে! সিট সীমিত হওয়ায় দ্রুত রেজিস্ট্রেশন করার পরামর্শ দেওয়া হচ্ছে।\n\nআর ক্যাম্পাস অ্যাম্বাসেডরের জন্য ফ্রি আবেদন পোর্টাল চালু আছে, এখনই আবেদন করে ফেলতে পারেন!',
        '⏳ **Registration Deadlines & Schedules:**\n\n• **National Science Eclipse 2026 (16–18 April 2026):** Registration is currently open on a rolling basis until venue capacity is filled (typically closing 7–10 days prior to event kickoff).\n• **Campus Ambassador Cohort:** Applications remain open until regional quotas are allocated.\n\nSecure your verified spot early to avoid missing out!',
        { label: 'Open Registration Page', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 14. RESULTS & SELECTION NOTIFICATION
    // -------------------------------------------------------------------------
    case 'RESULTS_NOTIFICATION': {
      return pack(
        '📢 **ফলাফল প্রকাশ ও নির্বাচিতদের তালিকা:**\n\n• **অলিম্পিয়াড ফলাফল:** অনুষ্ঠান সমাপ্তির সমাপনী পর্বে জুরি বোর্ডের মূল্যায়ন শেষে আনুষ্ঠানিকভাবে মেধা তালিকা ঘোষণা করা হয় এবং ওয়েবসাইটে প্রকাশিত হয়।\n• **ক্যাম্পাস অ্যাম্বাসেডর সিলেকশন:** আবেদন জমা দেওয়ার ৩ থেকে ৫ কার্যদিবসের মধ্যে নির্বাচিত অ্যাম্বাসেডরদের ইমেইল ও এসএমএসের মাধ্যমে অফিশিয়াল নিয়োগপত্র ও নির্দেশনা পাঠিয়ে দেওয়া হয়।',
        '📢 **রেজাল্ট কবে এবং কীভাবে জানবেন?**\n\n• ইভেন্টের রেজাল্ট সমাপনী অনুষ্ঠানে মঞ্চে ঘোষণা করা হয় এবং আমাদের অফিশিয়াল ফেসবুক পেজ ও পোর্টালে প্রকাশ করা হয়।\n• অ্যাম্বাসেডর পদে সিলেক্ট হলে আপনার দেওয়া ইমেইল ও ফোন নম্বরে কনফার্মেশন ও ডিজিটাল ব্যাজ পাঠিয়ে দেওয়া হবে!',
        '📢 **Results & Selection Announcements:**\n\n• **Olympiad Merit Lists:** Formally announced by the independent academic jury during the Grand Finale and published on the official web portal.\n• **Campus Ambassador Selection:** Successful nominees are notified via verified email and SMS within 3–5 working days with their digital credential and appointment badge.',
        { label: 'Check Events Schedule', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 15. PRIZES & AWARDS
    // -------------------------------------------------------------------------
    case 'PRIZES_AWARDS': {
      return pack(
        '🏆 **আকর্ষণীয় পুরস্কার ও সম্মাননাসমূহ:**\n\n• **চ্যাম্পিয়ন ও রানার্স-আপ:** জাতীয় মেডেল, চ্যাম্পিয়ন ক্রেস্ট, রিসার্চ স্কলারশিপ বা বিশেষ ফেলোশিপ গ্রান্ট এবং আকর্ষণীয় গিফট হ্যাম্পার।\n• **সকল অংশগ্রহণকারী:** ইউনিক সিরিয়াল নম্বরযুক্ত ভেরিফাইড ডিজিটাল সার্টিফিকেট।\n• **সেরা প্রজেক্ট:** শীর্ষ বিশ্ববিদ্যালয়ের গবেষকদের তত্ত্বাবধানে রিসার্চ পেপার প্রকাশের মেন্টরশিপ সাপোর্ট!',
        '🏆 **বিজয়ীদের জন্য যা যা থাকছে:**\n\n• ন্যাশনাল গোল্ড, সিলভার ও ব্রোঞ্জ মেডেল এবং সুদৃশ্য ট্রফি!\n• বিশেষ ক্যাশ স্কলারশিপ ও রিসার্চ ফেলোশিপ প্রাইজপুল।\n• গিফট পার্টনার ও স্পনসরদের পক্ষ থেকে এক্সক্লুসিভ গিফট প্যাক।\n• আর সবার জন্যই রয়েছে অনলাইনে যাচাইযোগ্য ভেরিফাইড সার্টিফিকেট!',
        '🏆 **Prizes, Medals, and Distinctions:**\n\n• **Champions & Runners-Up:** Prestigious National Medals, Champion Crests, scientific book hampers, and research project seed grants.\n• **All Participants:** Verified digital certificates with permanent verification serials.\n• **Top Innovators:** Direct fast-track mentorship toward academic journal publication.',
        { label: 'View Academic Calendar', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 16. REFUND POLICY & TRANSACTION CORRECTIONS
    // -------------------------------------------------------------------------
    case 'REFUND_PAYMENT_ISSUE': {
      return pack(
        '🛡️ **পেমেন্ট ভুল সংশোধন ও রিফান্ড নীতি:**\n\n• আপনি যদি অনিচ্ছাকৃতভাবে ভুল TrxID এন্ট্রি করে থাকেন বা পেমেন্টে কোনো বিভ্রান্তি ঘটে, তবে চিন্তার কোনো কারণ নেই!\n• আমাদের কেন্দ্রীয় সচিবালয়ের ইমেইলে (`uyfsr.org@gmail.com`) আপনার নাম, মোবাইল নম্বর এবং সঠিক ট্রানজেকশনের স্ক্রিনশট পাঠিয়ে দিন। আমাদের টেকনিক্যাল টিম ২৪ ঘণ্টার মধ্যে ডাটাবেজে ম্যানুয়ালি ভেরিফাই করে দেবে।',
        '🛡️ **পেমেন্টে কোনো সমস্যা হয়েছে? নো টেনশন!**\n\nভুল TrxID বা কোনো ভুল নম্বরে টাকা পাঠানোর সমস্যা হলে সরাসরি আমাদের ইমেইল `uyfsr.org@gmail.com`-এ জানান অথবা ওয়েবসাইটের নিচের কন্টাক্ট ফর্মে লিখে পাঠান। আমাদের ফাইন্যান্স টিম তাৎক্ষণিকভাবে ভেরিফাই করে বিষয়টি সমাধান করে দেবে!',
        '🛡️ **Payment Verification & Mistake Resolution:**\n\nIf you entered an incorrect TrxID or experienced a transaction discrepancy, our secretariat will resolve it promptly:\n\n📧 **Email:** `uyfsr.org@gmail.com`\nProvide your registered full name, 11-digit mobile number, and a screenshot of the MFS statement. Our technical team verifies and updates records within 24 hours.',
        { label: 'Open Contact Form', href: '#contact', view: 'home', anchor: 'contact' }
      )
    }

    // -------------------------------------------------------------------------
    // 17. HOST WORKSHOP IN SCHOOL/COLLEGE
    // -------------------------------------------------------------------------
    case 'SCHOOL_WORKSHOP_INVITE': {
      return pack(
        '🏫 **আপনার শিক্ষা প্রতিষ্ঠানে UYFSR কর্মশালা আয়োজনের নিয়ম:**\n\nআমরা দেশের স্কুল, কলেজ এবং বিশ্ববিদ্যালয়ের বিজ্ঞান ক্লাবের সাথে যৌথভাবে ল্যাবরেটরি ওয়ার্কশপ ও সেমিনার আয়োজন করে থাকি!\n\n• **কীভাবে আবেদন করবেন:** শিক্ষা প্রতিষ্ঠানের বিজ্ঞান ক্লাবের সভাপতি/সেক্রেটারি অথবা দায়িত্বপ্রাপ্ত শিক্ষক মহোদয়ের সুপারিশসহ আমাদের ইমেইল করুন: `uyfsr.org@gmail.com`\n• আমাদের কেন্দ্রীয় টিম আপনার ক্যাম্পাসে এসে বাস্তব যন্ত্রপাতি নিয়ে হ্যান্ডস-অন সেশন পরিচালনা করবে।',
        '🏫 **স্কুল/কলেজে ওয়ার্কশপ আয়োজন করতে চান?**\n\nদারুণ উদ্যোগ! UYFSR সারাদেশে ক্যাম্পাস ওয়ার্কশপ করে থাকে। আপনার ক্যাম্পাসে বিজ্ঞান কর্মশালা নিতে চাইলে আমাদের ইমেইল (`uyfsr.org@gmail.com`)-এ যোগাযোগ করুন অথবা ক্যাম্পাস অ্যাম্বাসেডর হিসেবে আবেদন করে নিজেই হোস্ট করুন!',
        '🏫 **Host a Hands-On Scientific Workshop at Your Campus:**\n\nUYFSR collaborates with school, college, and university science clubs across Bangladesh to conduct empirical laboratory clinics and academic seminars.\n\n• **How to Apply:** Send an official institutional inquiry or science club proposal to `uyfsr.org@gmail.com`.\n• Our academic delegation will coordinate with your faculty to deliver on-campus training.',
        { label: 'Contact Secretariat', href: '#contact', view: 'home', anchor: 'contact' }
      )
    }

    // -------------------------------------------------------------------------
    // 18. SPONSORSHIP & BRAND PARTNERSHIP
    // -------------------------------------------------------------------------
    case 'SPONSOR_PARTNERSHIP_INQUIRY': {
      return pack(
        '💼 **স্পনসরশিপ ও প্রাতিষ্ঠানিক অংশীদারিত্ব:**\n\nUYFSR দেশের শীর্ষ ব্র্যান্ড, শিক্ষাপ্রতিষ্ঠান ও গণমাধ্যমের সাথে কাজ করে তরুণদের বিজ্ঞান গবেষণাকে উৎসাহিত করে।\n\n• **যোগাযোগ:** স্পনসরশিপ ডেক ও কোলাবোরেশন প্রস্তাব পাঠাতে সরাসরি আমাদের সেন্ট্রাল সেক্রেটারিয়েটের সাথে যোগাযোগ করুন:\n📧 **অফিসিয়াল ইমেইল:** `uyfsr.org@gmail.com`\nআমাদের ম্যানেজমেন্ট টিম ২৪ ঘণ্টার মধ্যে পার্টনারশিপ ডেকসহ আপনার সাথে বৈঠকে যুক্ত হবে।',
        '💼 **UYFSR-এর সাথে স্পনসর বা পার্টনার হতে চান?**\n\nআমরা কর্পোরেট ব্র্যান্ড, মিডিয়া হাউস এবং অ্যাকাডেমিক ইনস্টিটিউটের সাথে কাজ করতে অত্যন্ত আগ্রহী! সরাসরি আমাদের সেক্রেটারিয়েট ইমেইল `uyfsr.org@gmail.com`-এ আপনার প্রস্তাবনা পাঠিয়ে দিন।',
        '💼 **Sponsorship & Corporate Alliances:**\n\nUYFSR engages with visionary brands, universities, and media consortiums to support youth scientific research nationwide.\n\n• **Inquiries:** Request the official 2026 Sponsorship Prospectus by contacting `uyfsr.org@gmail.com`.\n• Our executive council coordinates directly with organizational leads.',
        { label: 'View Our Current Partners', href: '#partners', view: 'home', anchor: 'partners' }
      )
    }

    // -------------------------------------------------------------------------
    // 19. FOOD, DRESS CODE & PARENT PERMISSION
    // -------------------------------------------------------------------------
    case 'PARENT_FOOD_DRESS': {
      return pack(
        '🍱 **ইভেন্ট লজিস্টিকস — খাবার, পোশাক ও অভিভাবক:**\n\n• **খাবার/রিফ্রেশমেন্ট:** পূর্ণাঙ্গ দিনের ইভেন্টগুলোতে অংশগ্রহণকারী সকল শিক্ষার্থীর জন্য পুষ্টিকর স্ন্যাক্স, ওয়াটার ও রিফ্রেশমেন্টের ব্যবস্থা রাখা হয়।\n• **পোশাক (Dress Code):** স্কুল ও কলেজের শিক্ষার্থীরা নিজ প্রতিষ্ঠানের ইউনিফর্ম অথবা মার্জিত ক্যাজুয়াল/ফরমাল পোশাক পরে আসতে পারেন।\n• **অভিভাবক (Parents):** অডিটোরিয়ামে অভিভাবকদের জন্য নির্ধারিত আসন ও ওয়েটিং এরিয়া থাকে।',
        '🍱 **খাবার, ড্রেস কোড ও অন্যান্য তথ্য:**\n\n• ইভেন্টে রিফ্রেশমেন্ট ও নাস্তা পরিবেশন করা হয়।\n• আপনি নিজের স্কুল/কলেজের ইউনিফর্ম অথবা শালীন যে কোনো পোশাকে আসতে পারেন।\n• অভিভাবকরাও আপনার সাথে ভেন্যুতে আসতে পারেন, তাদের জন্য বসার সুব্যবস্থা থাকে!',
        '🍱 **Event Logistics — Meals, Attire & Guardians:**\n\n• **Refreshments:** Nutritious snacks and hydration are provided to registered attendees during full-day summits.\n• **Attire:** Students may wear their official institutional uniform or modest, smart-casual attire.\n• **Parent / Guardian Policy:** Dedicated seating and observation lounges are allocated for accompanying guardians.',
        { label: 'Read FAQ Section', href: '#faq', view: 'home', anchor: 'faq' }
      )
    }

    // -------------------------------------------------------------------------
    // 20. MULTIPLE PROGRAM REGISTRATION
    // -------------------------------------------------------------------------
    case 'MULTIPLE_PROGRAMS': {
      return pack(
        '✨ **একাধিক ইভেন্টে অংশগ্রহণের সুযোগ:**\n\nজি হ্যাঁ! আপনি চাইলে একই সাথে একাধিক অলিম্পিয়াড ক্যাটেগরিতে (যেমন: Physics এবং Math) কিংবা অলিম্পিয়াডের পাশাপাশি প্রজেক্ট প্রদর্শনীতে অংশ নিতে পারেন। রেজিস্ট্রেশন ফর্মে পছন্দের বিষয়গুলো টিক দিয়ে রেজিস্ট্রেশন সম্পন্ন করতে পারবেন।',
        '✨ **একাধিক প্রোগ্রামে অংশ নেওয়া যাবে কি?**\n\nঅবশ্যই! আপনি একই সাথে সায়েন্স অলিম্পিয়াড ও প্রজেক্ট শোকেস উভয়েই অংশ নিতে পারবেন। এমনকি একই সাথে Campus Ambassador হিসেবেও আবেদন করতে পারবেন!',
        '✨ **Multi-Category Participation:**\n\nYes! Enthusiastic students are welcome to register across multiple Olympiad disciplines (e.g., Physics, Astronomy, and Mathematics) or combine an Olympiad entry with a Project Exhibition prototype.',
        { label: 'Register for Multiple Events', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 21. GREETINGS
    // -------------------------------------------------------------------------
    case 'GREETING': {
      return pack(
        'হ্যালো! 😊 আমি **Eliboo**, UYFSR-এর অফিসিয়াল এআই সায়েন্স অ্যাসিস্ট্যান্ট! আমি খুব ভালো আছি। আপনি কেমন আছেন? বিজ্ঞান ও গবেষণা নিয়ে তরুণদের প্ল্যাটফর্ম UYFSR সম্পর্কে আপনার যেকোনো প্রশ্ন আমাকে করতে পারেন!',
        'Hello ভাইয়া/আপু! 😊 আমি **Eliboo**, UYFSR-এর official AI Science Assistant! আলহামদুলিল্লাহ আমি দারুণ আছি। আপনি কেমন আছেন? UYFSR-এর যেকোনো ইভেন্ট, অলিম্পিয়াড বা ক্যাম্পাস অ্যাম্বাসেডর নিয়ে কী জানতে চান বলুন!',
        "Hello there! 😊 I am **Eliboo**, your official AI Science Guide for UYFSR (United Youth Forum of Science and Research). I'm doing great! How can I assist your scientific journey today?",
        { label: 'Explore What We Do', href: '#activities', view: 'home', anchor: 'activities' }
      )
    }

    // -------------------------------------------------------------------------
    // 22. BOT IDENTITY & CAPABILITIES
    // -------------------------------------------------------------------------
    case 'BOT_IDENTITY': {
      return pack(
        'আমি **Eliboo**, UYFSR-এর অফিসিয়াল কৃত্রিম বুদ্ধিমত্তা সহকারী (AI Science Assistant)! 🤖✨\n\nযদিও আমি রক্ত-মাংসের মানুষ নই, তবে মানুষের মতোই আপনার প্রশ্ন ও কথা বুঝে সঠিক তথ্য জানাতে আমাকে বিশেষভাবে প্রস্তুত করা হয়েছে।\n\n**আমি আপনাকে যেভাবে সাহায্য করতে পারি:**\n• UYFSR-এর সকল ইভেন্ট ও অলিম্পিয়াডের সময়সূচী জানানো\n• ক্যাম্পাস অ্যাম্বাসেডর প্রোগ্রামে সম্পূর্ণ ফ্রিতে আবেদনের তথ্য দেওয়া\n• রেজিস্ট্রেশন ও পেমেন্ট প্রসেস সহজভাবে বুঝিয়ে দেওয়া\n• নেতৃত্ব ও এক্সিকিউটিভ কাউন্সিল পরিচিতি দেওয়া\n\nআপনি বাংলা, রোমান বাংলা (Banglish) বা ইংরেজিতে যেকোনো প্রশ্ন করতে পারেন!',
        'আমি হলাম **Eliboo**, UYFSR-এর official AI Science Assistant! 🤖✨\n\nমানুষের মতোই আপনার টেক্সট পড়ে কথাগুলো বুঝে একদম সঠিক ও আপডেটেড তথ্য দেওয়াই আমার কাজ। কোনো পেইড বা এক্সটার্নাল এপিআই ছাড়াই আমি UYFSR-এর ফুল নলেজবেস নিয়ে কাজ করি!\n\n**আমার কাছে যা যা জানতে পারবেন:**\n• ক্যাম্পাস অ্যাম্বাসেডর আবেদন (১০০% ফ্রি!)\n• ২০২৬-এর মেগা ইভেন্ট ও অলিম্পিয়াডের তারিখ\n• রেজিস্ট্রেশন ও বিকাশ পেমেন্ট নিয়ম\n• UYFSR-এর এক্সিকিউটিভ লিডারশিপ ও কার্যক্রম\n\nকোন বিষয়ে সাহায্য লাগবে বলুন?',
        "I am **Eliboo**, the official AI Science Assistant for UYFSR (United Youth Forum of Science and Research)! 🤖✨\n\nI am engineered with native conversational intelligence to comprehend natural human questions in English, বাংলা, and Banglish without external API lags.\n\n**Here's what I can do for you:**\n• Guide you through the 100% Free Campus Ambassador program\n• Provide details on 2026 flagship Olympiads & science carnivals\n• Guide your event registration and bKash/Nagad verification\n• Share leadership insights and scientific research tracks.\n\nWhat would you like to explore?",
        { label: 'Read About UYFSR', href: '#about', view: 'home', anchor: 'about' }
      )
    }

    // -------------------------------------------------------------------------
    // 23. CAMPUS AMBASSADOR GENERAL
    // -------------------------------------------------------------------------
    case 'CAMPUS_AMBASSADOR': {
      return pack(
        '🎓 **UYFSR ক্যাম্পাস অ্যাম্বাসেডর প্রোগ্রামে আপনাকে স্বাগতম!**\n\nআপনি যদি স্কুল, কলেজ কিংবা বিশ্ববিদ্যালয়ের শিক্ষার্থী হন এবং আপনার প্রতিষ্ঠানে বিজ্ঞান, গবেষণা ও উদ্ভাবনী কার্যক্রমের নেতৃত্ব দিতে আগ্রহী হন, তবে এখনই আবেদন করুন!\n\n**দায়িত্ব ও সুবিধা:**\n• **নেতৃত্ব:** নিজের ক্যাম্পাসে বিজ্ঞান ক্লাব ও শিক্ষার্থীদের UYFSR অলিম্পিয়াড ও কর্মশালায় যুক্ত করা।\n• **সার্টিফিকেট:** ভেরিফাইড অফিসিয়াল নিয়োগপত্র ও সনদপত্র।\n• **রেফারেল ভাউচার:** আপনার নামে বিশেষ কোড যাতে সহপাঠীরা ২০% ফি ছাড় পাবে।\n• **১০০% ফ্রি:** এতে কোনো আবেদন ফি নেই।\n\nনিচের বোতামে ক্লিক করে এখনই আপনার আবেদনপত্র জমা দিন!',
        '🎓 **UYFSR Campus Ambassador হতে চান? দারুণ সিদ্ধান্ত!**\n\nআপনি যদি স্কুল, কলেজ বা ইউনিভার্সিটির স্টুডেন্ট হন এবং নিজের ক্যাম্পাসে বিজ্ঞানের আলো ছড়াতে চান, তবে এখনই জয়েন করুন!\n\n**অ্যাম্বাসেডরদের ভূমিকা ও সুবিধা:**\n• ক্যাম্পাসে UYFSR-এর ইভেন্ট ও অলিম্পিয়াডের তথ্য ছড়িয়ে দেওয়া ও টিম লিড করা\n• অফিসিয়াল অ্যাপয়েন্টমেন্ট লেটার ও প্রোগ্রাম শেষে ভেরিফাইড সার্টিফিকেট\n• আপনার নামে নিজস্ব এক্সিকিউটিভ ভাউচার কোড (বন্ধুরা পাবে ২০% ডিসকাউন্ট)\n• এটি সম্পূর্ণ **১০০% FREE**, কোনো আবেদন ফি নেই!\n\nদেরি না করে নিচের বাটনে ক্লিক করে ফর্মটি পূরণ করে ফেলুন!',
        '🎓 **Join the UYFSR Campus Ambassador Network!**\n\nAre you ready to represent scientific innovation and youth leadership at your school, college, or university? UYFSR invites passionate student leaders across Bangladesh to champion empirical research on their campuses.\n\n**Role Highlights & Perks:**\n• Mobilize student cohorts for national olympiads, research clinics, and science summits\n• Official UYFSR Appointment Certificate & verified leadership credentials\n• Personalized Executive Voucher granting your peers a 20% registration fee discount\n• 100% Free nomination—no application fee required\n\nClick below to submit your nomination form today!',
        { label: 'Apply as Campus Ambassador (100% Free)', href: '#ambassador', view: 'ambassador' }
      )
    }

    // -------------------------------------------------------------------------
    // 23.1 AMBASSADOR COST / FREE CHECK
    // -------------------------------------------------------------------------
    case 'AMBASSADOR_FREE': {
      return pack(
        '🎉 **জি হ্যাঁ! UYFSR ক্যাম্পাস অ্যাম্বাসেডর প্রোগ্রামে আবেদন করা সম্পূর্ণ ১০০% ফ্রি!**\n\nএতে কোনো ধরণের আবেদন ফি বা TrxID লাগে না। বাংলাদেশজুড়ে যেকোনো স্কুল, কলেজ বা বিশ্ববিদ্যালয়ের বিজ্ঞানমনা শিক্ষার্থীরা এতে বিনামূল্যে অংশ নিতে পারেন।\n\n**ক্যাম্পাস অ্যাম্বাসেডর হিসেবে যা যা সুবিধা পাবেন:**\n• অফিসিয়াল UYFSR নিয়োগ সার্টিফিকেট ও লিডারশিপ ক্রেডেনশিয়াল\n• নিজস্ব এক্সিকিউটিভ রেফারেল ভাউচার কোড (বন্ধুদের ২০% ডিসকাউন্ট দেওয়ার সুবিধা)\n• জাতীয় বিজ্ঞান উৎসব ও অলিম্পিয়াডে ডেলিগেশন পরিচালনার সুযোগ\n• সিনিয়র গবেষক ও বিশ্ববিদ্যালয়ের শিক্ষকদের সাথে সরাসরি মেন্টরশিপ\n\nআবেদন করতে নিচের লিঙ্কে ক্লিক করে ফর্মটি পূরণ করুন!',
        '🎉 **একদমই না ভাইয়া/আপু! UYFSR Campus Ambassador প্রোগ্রাম সম্পূর্ণ ১০০% FREE!**\n\nএখানে আবেদনের জন্য কোনো টাকা বা TrxID প্রয়োজন নেই। আপনি স্কুল, কলেজ বা ভার্সিটি—যেকোনো লেভেলের স্টুডেন্ট হয়ে থাকলে কোনো ফি ছাড়াই এখনই লিডার হিসেবে জয়েন করতে পারেন!\n\n**অ্যাম্বাসেডরদের বিশেষ সুবিধাসমূহ:**\n• অফিসিয়াল UYFSR নিয়োগপত্র ও ভেরিফাইড সার্টিফিকেট\n• স্পেশাল রেফারেল ভাউচার কোড (যার মাধ্যমে আপনার বন্ধুরা ২০% ডিসকাউন্ট পাবে!)\n• ন্যাশনাল সায়েন্স অলিম্পিয়াডে ক্যাম্পাস ডেলিগেশন লিড দেওয়ার সুযোগ\n• রিসার্চ ও লিডারশিপ স্কিল ডেভেলপমেন্ট ট্রেইনিং\n\nনিচের বাটনে ক্লিক করে বিনামূল্যে আবেদন ফর্মটি পূরণ করুন!',
        '🎉 **Yes! The Campus Ambassador nomination is 100% FREE!**\n\nThere are absolutely NO application fees or TrxID requirements. School, college, and university students across Bangladesh are eligible to represent UYFSR on their campuses free of charge.\n\n**Perks of being a Campus Ambassador:**\n• Official UYFSR Appointment Certificate & Leadership Credentials\n• Exclusive Executive Referral Voucher Code (giving peers 20% discount)\n• Leadership authority to coordinate delegations at National Olympiads\n• Direct mentorship under university professors and researchers\n\nClick the button below to submit your free application!',
        { label: 'Apply as Campus Ambassador (100% Free)', href: '#ambassador', view: 'ambassador' }
      )
    }

    // -------------------------------------------------------------------------
    // 24. AMBASSADOR PERKS
    // -------------------------------------------------------------------------
    case 'AMBASSADOR_PERKS': {
      return pack(
        '🌟 **ক্যাম্পাস অ্যাম্বাসেডরদের বিশেষ সুবিধাসমূহ:**\n\n1. **স্বীকৃতি ও সনদ:** মেয়াদ শেষে অফিসিয়াল ভেরিফাইড ইউওয়াইএফএসআর সার্টিফিকেট ও রেকমেন্ডেশন লেটার।\n2. **রেফারেল ভাউচার:** আপনার নামের বিশেষ কোড, যার মাধ্যমে নিবন্ধনে অন্যরা ২০% ছাড় পাবে।\n3. **জাতীয় নেটওয়ার্ক:** দেশসেরা বিজ্ঞানী, গবেষক এবং শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষকদের সাথে যোগাযোগ।\n4. **ইভেন্ট এক্সেস:** UYFSR-এর জাতীয় ও বিভাগীয় সেমিনারে ফ্রি ও প্রায়োরিটি প্রবেশাধিকার।',
        '🌟 **Campus Ambassador হলে যেসব অসাধারণ সুবিধা পাবেন:**\n\n1. **Official Certificate:** প্রোগ্রাম শেষে আপনার নামে ভেরিফাইড ডিজিটাল সার্টিফিকেট ও লিডারশিপ ক্রেডেনশিয়াল দেওয়া হবে।\n2. **Executive Referral Voucher:** আপনার নামে পার্সোনালাইজড ভাউচার কোড পাবেন, যা দিয়ে আপনার ইনস্টিটিউটের স্টুডেন্টরা ২০% ফি ছাড় পাবে!\n3. **Research & Mentorship:** শীর্ষ গবেষক ও বিজ্ঞানীদের সাথে কাজ করার বাস্তব অভিজ্ঞতা।\n4. **Event Coordination:** জাতীয় অলিম্পিয়াড ও সায়েন্স ফেয়ারে ডেলিগেশন কোঅর্ডিনেটরের দায়িত্ব!',
        '🌟 **Key Benefits of UYFSR Campus Ambassadors:**\n\n1. **Official Certification:** Verified UYFSR Appointment Certificate and leadership credential with unique verification serial.\n2. **Exclusive Referral Voucher:** Personalized discount voucher giving fellow students 20% off event fees.\n3. **Direct Academic Mentorship:** Access to senior researchers, workshops, and science fair coordination teams.\n4. **Networking:** National community of future scientists and campus organizers across Bangladesh.',
        { label: 'Submit Free Ambassador Application', href: '#ambassador', view: 'ambassador' }
      )
    }

    // -------------------------------------------------------------------------
    // 25. REGISTRATION PROCESS
    // -------------------------------------------------------------------------
    case 'REGISTRATION_STEPS': {
      return pack(
        '📝 **UYFSR প্রতিযোগিতায় রেজিস্ট্রেশনের সহজ ৪টি ধাপ:**\n\n1. **প্রোগ্রাম নির্বাচন:** আপনি যে প্রতিযোগিতা বা অলিম্পিয়াডে অংশ নিতে চান তা নির্বাচন করুন (যেমন: National Science Eclipse 2026)।\n2. **তথ্য প্রদান:** আপনার নাম, ইমেইল, ১১ ডিজিটের মোবাইল নম্বর ও শিক্ষা প্রতিষ্ঠানের নাম লিখুন।\n3. **রেজিস্ট্রেশন ফি পরিশোধ:** নির্ধারিত ফি bKash বা Nagad Personal নম্বর `01911287501`-এ Send Money করুন।\n4. **TrxID ও ভাউচার:** ফির মেসেজ থেকে Transaction ID (TrxID) ফর্মে বসান। কোনো অ্যাম্বাসেডর ভাউচার কোড থাকলে ২০% ছাড় পেতে সেটিও যোগ করুন।\n\nসাবমিট করলেই পেয়ে যাবেন আপনার ভেরিফাইড প্রবেশপত্র ও ট্র্যাকিং নম্বর!',
        '📝 **সহজে রেজিস্ট্রেশন করার নিয়ম:**\n\n1. প্রথমে আমাদের রেজিস্ট্রেশন পেইজে গিয়ে ইভেন্ট সিলেক্ট করুন (যেমন: National Science Eclipse 2026)।\n2. আপনার নাম, ইমেইল, মোবাইল নম্বর এবং স্কুল/কলেজ/ভার্সিটির নাম পূরণ করুন।\n3. bKash অথবা Nagad Personal নম্বর **01911287501**-এ Send Money করে ট্রানজেকশন আইডি (TrxID) সংগ্রহ করুন।\n4. ফর্মে TrxID বসিয়ে দিন (কোনো রেফারেল ভাউচার থাকলে তা দিয়ে ২০% ডিসকাউন্ট এক্টিভ করুন!) এবং সাবমিট বাটনে চাপ দিন।\n\nসাবমিট করার সাথে সাথেই আপনি রেজিস্ট্রেশন কনফার্মেশন ও ডিজিটাল ব্যাজ পেয়ে যাবেন!',
        '📝 **4 Simple Steps to Register for UYFSR Programs:**\n\n1. **Select Program:** Choose your competition (e.g., National Science Eclipse 2026).\n2. **Enter Credentials:** Provide your full name, verified email, active 11-digit phone number, and school/college/university.\n3. **Fee Transfer:** Send the nominal event fee via bKash or Nagad Personal to **01911287501**.\n4. **Enter TrxID & Voucher:** Input the Transaction ID received. If you have an Ambassador Voucher code, apply it for an instant 20% discount!\n\nUpon submission, you will receive an instant digital credential and confirmation badge.',
        { label: 'Go to Registration Page', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 26. FEES & PAYMENT / BKASH
    // -------------------------------------------------------------------------
    case 'FEES_AND_PAYMENT':
    case 'BKASH_PAYMENT': {
      return pack(
        '💳 **পেমেন্ট ও বিকাশ সংক্রান্ত তথ্য:**\n\n• **bKash & Nagad Personal নম্বর:** `01911287501`\n• **পেমেন্ট পদ্ধতি:** Send Money করুন এবং ফিরতি এসএমএস থেকে **TrxID** সংরক্ষণ করুন।\n• **ভাউচার ডিসকাউন্ট:** ক্যাম্পাস অ্যাম্বাসেডরদের দেওয়া ভাউচার কোড (যেমন: `UYFSR-REF-xxx`) ব্যবহার করলে সাথে সাথে **২০% ছাড়** পাওয়া যায়!\n\n*(উল্লেখ্য: ক্যাম্পাস অ্যাম্বাসেডর প্রোগ্রামে আবেদনের জন্য কোনো ফি বা TrxID লাগে না, সেটি সম্পূর্ণ ফ্রি!)*',
        '💳 **UYFSR ফি ও পেমেন্ট ডিটেইলস:**\n\n• **bKash ও Nagad Personal নম্বর:** `01911287501`\n• **পদ্ধতি:** উক্ত নম্বরে Send Money করে প্রাপ্ত **TrxID (Transaction ID)** ফর্মে এন্টার করতে হবে।\n• **স্পেশাল ভাউচার ডিসকাউন্ট:** যদি কোনো অ্যাম্বাসেডরের রেফারেল কোড থাকে, তবে ফর্মে বসালেই সাথে সাথে **২০% ফি ডিসকাউন্ট** পেয়ে যাবেন!\n\n💡 *স্মরণ করিয়ে দিচ্ছি: ক্যাম্পাস অ্যাম্বাসেডর প্রোগ্রামে আবেদন কিন্তু ১০০% ফ্রি! শুধু অলিম্পিয়াড বা কনটেস্টের জন্য রেজিস্ট্রেশন ফি প্রয়োজন হয়।*',
        '💳 **UYFSR Payment & Fee Details:**\n\n• **Official bKash / Nagad Personal Number:** `01911287501`\n• **Payment Method:** Send Money to the above number and keep the **TrxID** from your SMS.\n• **Executive Referral Voucher:** Use any valid Ambassador voucher (e.g. `UYFSR-REF-...`) during registration to activate an instant **20% discount**!\n\n*(Note: Campus Ambassador nominations are completely fee-waived and 100% free!)*',
        { label: 'Open Registration & Payment', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 27. EVENTS OVERVIEW
    // -------------------------------------------------------------------------
    case 'EVENTS_OVERVIEW': {
      return pack(
        '📅 **UYFSR ২০২৬-এর প্রধান ইভেন্টসমূহ:**\n\n1. **National Science Eclipse 2026**\n   • তারিখ: ১৬–১৮ এপ্রিল ২০২৬ (৩ দিনব্যাপী)\n   • মূল আয়োজক: UYFSR\n   • বিষয়: পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, গণিত এবং জ্যোতির্বিজ্ঞান অলিম্পিয়াড ও প্রজেক্ট প্রদর্শনী।\n\n2. **KIDLON Presents Junior Talent Award – Season 1**\n   • তারিখ: ১৮ জুলাই ২০২৬ (২১ দিনব্যাপী)\n   • আয়োজক: TWIMBOL | কমিউনিটি পার্টনার: UYFSR\n\n3. **Junior Startup Challenge – Season 1**\n   • তারিখ: ৩ সেপ্টেম্বর ২০২৬ (পূর্ণাঙ্গ সামিট)\n   • উদ্ভাবনী আইডিয়া ও প্রোটোটাইপ প্রদর্শনী।\n\n4. **1st National Journalism Carnival 2025** (সম্পন্ন)\n   • আয়োজক: Adamjee School News Network | ওয়ার্কশপ পার্টনার: UYFSR।',
        '📅 **UYFSR-এর ইভেন্ট ক্যালেন্ডার ২০২৬:**\n\n1. **National Science Eclipse 2026 (ফ্ল্যাগশিপ ইভেন্ট)**\n   • তারিখ: ১৬–১৮ এপ্রিল ২০২৬ (৩ দিনের মেগা উৎসব)\n   • ফিজিক্স, কেমিস্ট্রি, বায়োলজি, ম্যাথ ও অ্যাস্ট্রোনমি অলিম্পিয়াড এবং উদ্ভাবনী প্রজেক্ট শোকেস।\n\n2. **KIDLON Presents Junior Talent Award (Season 1)**\n   • তারিখ: ১৮ জুলাই ২০২৬ (২১ দিনব্যাপী ট্যালেন্ট হান্ট)\n   • ভেন্যু পার্টনার: KIDLON, পার্টনার: UYFSR\n\n3. **Junior Startup Challenge (Season 1)**\n   • তারিখ: ৩ সেপ্টেম্বর ২০২৬\n   • তরুণ উদ্যোক্তা ও বৈজ্ঞানিক প্রজেক্ট সামিট।\n\nরেজিস্ট্রেশন করতে আজই আমাদের ইভেন্ট পেইজে ভিজিট করুন!',
        '📅 **UYFSR Academic Calendar & Flagship Programs:**\n\n1. **National Science Eclipse 2026**\n   • Date: 16–18 April 2026 (3-Day Event)\n   • Lead Organizer: UYFSR\n   • Disciplines: Physics, Chemistry, Biology, Math, Astronomy Olympiads & Project Exhibitions.\n\n2. **KIDLON Presents Junior Talent Award – Season 1**\n   • Date: 18 July 2026 (21-Day Initiative)\n   • Organizer: TWIMBOL | Presenting Partner: KIDLON | Partner: UYFSR\n\n3. **Junior Startup Challenge – Season 1**\n   • Date: 3 September 2026 (Full-Day Summit)\n   • Scientific prototyping and entrepreneurship track.\n\n4. **1st National Journalism Carnival 2025** (Completed)\n   • Workshop Partner: UYFSR.',
        { label: 'View Academic Calendar Table', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 28. EVENT: SCIENCE ECLIPSE 2026
    // -------------------------------------------------------------------------
    case 'EVENT_SCIENCE_ECLIPSE': {
      return pack(
        '🌌 **National Science Eclipse 2026 (ফ্ল্যাগশিপ সায়েন্স ফেস্টিভ্যাল):**\n\n• **তারিখ:** ১৬–১৮ এপ্রিল ২০২৬ (৩ দিনব্যাপী গ্র্যান্ড ইভেন্ট)\n• **ভেন্যু:** Dhaka City Auditorium\n• **মূল আয়োজক:** United Youth Forum of Science and Research (UYFSR)\n• **প্রতিযোগিতার ক্ষেত্রসমূহ:** পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, গণিত এবং জ্যোতির্বিজ্ঞান অলিম্পিয়াড, সাথে থাকবে বৈজ্ঞানিক প্রজেক্ট প্রদর্শনী ও পোস্টার প্রেজেন্টেশন।\n• **পুরস্কার:** সকল অংশগ্রহণকারীর জন্য ভেরিফাইড সার্টিফিকেট, এবং বিজয়ীদের জন্য মেডেল, ক্রেস্ট ও বিশেষ পুরস্কার!',
        '🌌 **National Science Eclipse 2026 সম্পর্কে বিস্তারিত:**\n\n• **তারিখ:** ১৬–১৮ এপ্রিল ২০২৬ (৩ দিনের মেগা সায়েন্স ফেস্টিভ্যাল)\n• **ভেন্যু:** ঢাকা সিটি অডিটোরিয়াম\n• **আয়োজক:** UYFSR\n• **ক্যাটেগরি:** Physics, Chemistry, Biology, Mathematics & Astronomy Olympiad এবং Science Project Exhibition।\n• **স্বীকৃতি:** ইউনিক সিরিয়ালসহ অফিশিয়াল ভেরিফাইড সার্টিফিকেট ও ন্যাশনাল মেডেল!',
        '🌌 **National Science Eclipse 2026 Overview:**\n\n• **Dates:** 16–18 April 2026 (3-Day Flagship Festival)\n• **Venue:** Dhaka City Auditorium\n• **Lead Organizer:** UYFSR\n• **Olympiad Categories:** Physics, Chemistry, Biology, Mathematics, and Astronomy, plus original project showcases and poster clinics.\n• **Awards:** Verified digital certificates with unique credential serials for all participants, alongside national championship medals and trophies.',
        { label: 'Register for Science Eclipse 2026', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 29. EVENT: JOURNALISM CARNIVAL
    // -------------------------------------------------------------------------
    case 'EVENT_JOURNALISM_CARNIVAL': {
      return pack(
        '📰 **1st National Journalism Carnival 2025:**\n\n• **তারিখ:** ১৭–১৯ অক্টোবর ২০২৫ (সম্পন্ন)\n• **মূল আয়োজক:** Adamjee School News Network & Communication Club\n• **ওয়ার্কশপ পার্টনার:** United Youth Forum of Science and Research (UYFSR)\n• **উদ্দেশ্য:** তরুণদের মাঝে বিজ্ঞান সাংবাদিকতা, ফ্যাক্ট-চেকিং এবং গঠনমূলক প্রতিবেদনের কলাকৌশল ছড়িয়ে দেওয়া।',
        '📰 **1st National Journalism Carnival 2025:**\n\n• **তারিখ:** ১৭–১৯ অক্টোবর ২০২৫ (ইভেন্টটি সফলভাবে সম্পন্ন হয়েছে)\n• **আয়োজক:** Adamjee School News Network & Communication Club\n• **ওয়ার্কশপ পার্টনার:** UYFSR\n• এটি একটি ৩ দিনের বিশেষ এডুকেশনাল কার্নিভাল ছিল যেখানে সায়েন্টিফিক জার্নালিজম ও অ্যানালিটিক্যাল রিপোর্টিং নিয়ে সেশন পরিচালিত হয়।',
        '📰 **1st National Journalism Carnival 2025:**\n\n• **Dates:** 17–19 October 2025 (Completed)\n• **Organizer:** Adamjee School News Network & Communication Club\n• **Workshop Partner:** UYFSR\n• A specialized 3-day educational carnival promoting analytical science reporting and media literacy among youth.',
        { label: 'View In Academic Calendar', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 30. EVENT: JUNIOR TALENT AWARD
    // -------------------------------------------------------------------------
    case 'EVENT_JUNIOR_TALENT': {
      return pack(
        '🏆 **KIDLON Presents Junior Talent Award – Season 1:**\n\n• **তারিখ:** ১৮ জুলাই ২০২৬ (২১ দিনব্যাপী কর্মসূচি)\n• **আয়োজক:** TWIMBOL\n• **ভেন্যু ও প্রেজেন্টিং পার্টনার:** KIDLON\n• **কমিউনিটি পার্টনার:** UYFSR\n• **উদ্দেশ্য:** স্কুল ও কলেজের শিক্ষার্থীদের সুপ্ত প্রতিভা অন্বেষণ, গবেষণামূলক আইডিয়া যাচাই এবং বিশেষজ্ঞদের মেন্টরশিপ প্রদান।',
        '🏆 **KIDLON Presents Junior Talent Award – Season 1:**\n\n• **তারিখ:** ১৮ জুলাই ২০২৬ (২১ দিনের বৃহৎ কর্মসূচি)\n• **আয়োজক:** TWIMBOL | প্রেজেন্টিং পার্টনার: KIDLON | পার্টনার: UYFSR\n• স্কুল ও কলেজের ছাত্র-ছাত্রীদের রিসার্চ আইডিয়া ও উদ্ভাবনী মেধার বিকাশে এটি পরিচালিত হবে।',
        '🏆 **KIDLON Presents Junior Talent Award – Season 1:**\n\n• **Date:** 18 July 2026 (21-Day Initiative)\n• **Organizer:** TWIMBOL\n• **Presenting & Venue Partner:** KIDLON\n• **Community Partner:** UYFSR\n• Empowering school and college cohorts to explore practical research questions and structured mentorship.',
        { label: 'View Event Calendar', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 31. EVENT: STARTUP CHALLENGE
    // -------------------------------------------------------------------------
    case 'EVENT_STARTUP_CHALLENGE': {
      return pack(
        '🚀 **Junior Startup Challenge – Season 1:**\n\n• **তারিখ:** ৩ সেপ্টেম্বর ২০২৬ (পূর্ণাঙ্গ সামিট)\n• **আয়োজক:** TWIMBOL\n• **কমিউনিটি পার্টনার:** UYFSR\n• **বিবরণ:** তরুণ শিক্ষার্থীদের বৈজ্ঞানিক গবেষণা ও প্রযুক্তিগত প্রোটোটাইপগুলোকে বাস্তবভিত্তিক সামাজিক সমাধান ও স্টার্টআপ প্রকল্পে রূপান্তরের মঞ্চ।',
        '🚀 **Junior Startup Challenge – Season 1:**\n\n• **তারিখ:** ৩ সেপ্টেম্বর ২০২৬ (ফুল-ডে সামিট)\n• **আয়োজক:** TWIMBOL | কমিউনিটি পার্টনার: UYFSR\n• স্কুল ও কলেজের তরুণদের বৈজ্ঞানিক আবিষ্কার ও আইডিয়াকে স্টার্টআপে রূপান্তরের গ্র্যান্ড সামিট।',
        '🚀 **Junior Startup Challenge – Season 1:**\n\n• **Date:** 3 September 2026 (Full-Day Summit)\n• **Organizer:** TWIMBOL | Community Partner: UYFSR\n• Encouraging student innovators to translate research prototypes into sustainable ventures.',
        { label: 'Explore All Events', href: '#events', view: 'home', anchor: 'events' }
      )
    }

    // -------------------------------------------------------------------------
    // 32. ELIGIBILITY
    // -------------------------------------------------------------------------
    case 'ELIGIBILITY_WHO_CAN_JOIN': {
      return pack(
        '🎓 **কারা UYFSR-এ অংশ নিতে পারবে?**\n\nআমাদের প্ল্যাটফর্ম যেকোনো উৎসাহী তরুণ বিজ্ঞানপ্রেমীর জন্য উন্মুক্ত:\n• **স্কুল পর্যায়:** ৬ষ্ঠ থেকে ১০ম শ্রেণি / SSC / O-Levels শিক্ষার্থী\n• **কলেজ পর্যায়:** একাদশ–দ্বাদশ শ্রেণি / HSC / A-Levels শিক্ষার্থী\n• **বিশ্ববিদ্যালয় পর্যায়:** স্নাতক (Undergraduate) পর্যায়ের যেকোনো বিভাগের শিক্ষার্থী\n• তরুণ স্বাধীন গবেষক ও বিজ্ঞান ক্লাবের সদস্যরাও অংশগ্রহণ করতে পারেন!',
        '🎓 **কারা কারা পার্টিসিপেট করতে পারবে?**\n\nUYFSR-এর সকল ইভেন্ট, ওয়ার্কশপ ও অলিম্পিয়াড একদম সবার জন্য উন্মুক্ত:\n• **স্কুল স্টুডেন্ট:** ক্লাস ৬ থেকে ১০ / SSC / O-Levels\n• **কলেজ স্টুডেন্ট:** HSC / A-Levels\n• **ভার্সিটি স্টুডেন্ট:** বিভিন্ন বিশ্ববিদ্যালয় ও পলিটেকনিকের তরুণরা\n• এছাড়া ক্যাম্পাসে বিজ্ঞান চর্চা বাড়াতে যে কেউই **Campus Ambassador** হতে আবেদন করতে পারেন!',
        '🎓 **Who is eligible to participate in UYFSR?**\n\nOur initiatives are designed for all enthusiastic young learners:\n• **School Students:** Class 6 to 10 / SSC / O-Levels\n• **College Students:** Class 11-12 / HSC / A-Levels\n• **University Cohorts:** Undergraduate students across Bangladesh\n• Young independent science enthusiasts and school club members.',
        { label: 'Register for Events', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 33. LEADERSHIP - CEO MUSTAFIZ BIN JIHAD
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // 33. LEADERSHIP - CEO MUSTAFIZ BIN JIHAD
    // -------------------------------------------------------------------------
    case 'LEADERSHIP_CEO': {
      return pack(
        '👔 **মোস্তাফিজ বিন জিহাদ (Mustafiz Bin Jihad)**\n\n' +
        '• **পদবি:** প্রধান নির্বাহী কর্মকর্তা (Chief Executive Officer - CEO) ও প্রতিষ্ঠাতা নেতৃত্ব\n' +
        '• **বিভাগ:** Executive Council & Strategic Vision\n' +
        '• **মোবাইল:** `+880 1824-798147`\n' +
        '• **ইমেইল:** `mostafizbinjihad@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1J6Aei7Kqf/)\n' +
        '• **রেফারেল ভাউচার:** `UYFSR-REF-MBJ2026` (রেজিস্ট্রেশন ফিতে ২০% ছাড়)\n' +
        '• **দায়িত্ব:** দেশব্যাপী তরুণদের মাঝে বৈজ্ঞানিক গবেষণা, কেন্দ্রীয় পার্টনারশিপ ও জাতীয় অলিম্পিয়াডের সামগ্রিক রূপরেখা পরিচালনা করছেন। তাঁর নেতৃত্বে UYFSR প্রতিষ্ঠিত হয় ৩০ মে ২০২৫ তারিখে।',

        '👔 **Mustafiz Bin Jihad (Chief Executive Officer - CEO):**\n\n' +
        '• Title: CEO & Founding Leader of UYFSR\n' +
        '• Mobile: +880 1824-798147\n' +
        '• Email: mostafizbinjihad@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1J6Aei7Kqf/\n' +
        '• Voucher Code: UYFSR-REF-MBJ2026 (20% off)\n' +
        'He steers nationwide research initiatives and national science cohorts.',

        '👔 **Mustafiz Bin Jihad — Chief Executive Officer (CEO):**\n\n' +
        '• **Designation:** CEO & Founding Leadership\n' +
        '• **Department:** Executive Council & Strategic Vision\n' +
        '• **Phone:** `+880 1824-798147`\n' +
        '• **Email:** `mostafizbinjihad@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1J6Aei7Kqf/)\n' +
        '• **Referral Voucher:** `UYFSR-REF-MBJ2026` (20% discount)\n' +
        '• **Scope:** Leading national youth science exploration, institutional alliances, and research initiatives.',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Mustafiz Bin Jihad' }
      )
    }

    // -------------------------------------------------------------------------
    // 34. LEADERSHIP - FULL TEAM
    // -------------------------------------------------------------------------
    case 'LEADERSHIP_TEAM': {
      return pack(
        '👥 **UYFSR এক্সিকিউটিভ কাউন্সিল, উপদেষ্টা ও সচিবালয় ডিরেক্টরি:**\n\n' +
        '• **মোস্তাফিজ বিন জিহাদ** — Chief Executive Officer (CEO) | `+880 1824-798147`\n' +
        '• **ফাহিম সামিউল ইসলাম** — Deputy Chief Executive Officer (DCEO) | `+880 1303-290971`\n' +
        '• **শাহরিয়ার মেজবা** — Chief Operating Officer (COO) | `+880 1410-581821`\n' +
        '• **শোয়াইব ইসলাম** — Chief Research Officer (CRO) | `+880 1349-359808`\n' +
        '• **ডালিয়া সুলতানা জ্যোতি** — Chief Communications Officer (CCO) | `+880 1333-623162`\n' +
        '• **জারিন তাসনিম** — Chief Management Officer (CMO) | `+880 1333-623162`\n' +
        '• **মো: নাবিল তাহমিদ** — Chief Human Resources Officer (CHRO) | `+880 1617-607048`\n' +
        '• **শাহরিয়ার তাসকির** — Chief Technology Officer (CTO) | `+880 1349-359808`\n' +
        '• **তাকি আল জাকি** — Secretary of Technology | `+880 1911-287501`\n' +
        '• **খালেদ সাইফুল্লাহ রোহান** — Adviser (উপদেষ্টা) | `+880 1736-309347`\n' +
        '• **ওয়াসিমুল রাফিন** — Adviser (উপদেষ্টা) | `+880 1855-052383`',

        '👥 **UYFSR পরিচালনা পর্ষদের সম্পূর্ণ তালিকা:**\n\n' +
        '• Mustafiz Bin Jihad (CEO) — +880 1824-798147\n' +
        '• Fahim Samiul Islam (DCEO) — +880 1303-290971\n' +
        '• Shahriar Mejba (COO) — +880 1410-581821\n' +
        '• Soyaib Islam (CRO) — +880 1349-359808\n' +
        '• Dalia Sultana Joty (CCO) — +880 1333-623162\n' +
        '• Jarin Tasnim (CMO) — +880 1333-623162\n' +
        '• Md Nabil Tahmid (CHRO) — +880 1617-607048\n' +
        '• Shahriyar Tashkir (CTO) — +880 1349-359808\n' +
        '• Taki Al Zaki (Sec. of Tech) — +880 1911-287501\n' +
        '• Khaled Saifullah Rohan (Adviser) — +880 1736-309347\n' +
        '• Oasimul Rafin (Adviser) — +880 1855-052383',

        '👥 **UYFSR Executive Council & Governance Team Directory:**\n\n' +
        '• **Mustafiz Bin Jihad** (CEO) — `+880 1824-798147` | mostafizbinjihad@gmail.com\n' +
        '• **Fahim Samiul Islam** (DCEO) — `+880 1303-290971` | samiulislamfahim8@gmail.com\n' +
        '• **Shahriar Mejba** (COO) — `+880 1410-581821` | mejbaacps2007@gmail.com\n' +
        '• **Soyaib Islam** (CRO) — `+880 1349-359808` | soyaib248@gmail.com\n' +
        '• **Dalia Sultana Joty** (CCO) — `+880 1333-623162` | daliajoty@gmail.com\n' +
        '• **Jarin Tasnim** (CMO) — `+880 1333-623162` | parkjarinot7@gmail.com\n' +
        '• **Md Nabil Tahmid** (CHRO) — `+880 1617-607048` | hassantahmid312@gmail.com\n' +
        '• **Shahriyar Tashkir** (CTO) — `+880 1349-359808` | tashkir2006@gmail.com\n' +
        '• **Taki Al Zaki** (Secretary of Technology) — `+880 1911-287501` | ktahan629@gmail.com\n' +
        '• **Khaled Saifullah Rohan** (Adviser) — `+880 1736-309347` | rohan232619@gmail.com\n' +
        '• **Oasimul Rafin** (Adviser) — `+880 1855-052383` | Oasimulrafin@gmail.com',
        { label: 'Meet the Leadership Team', href: '#leadership', view: 'home', anchor: 'leadership' }
      )
    }

    // -------------------------------------------------------------------------
    // 35. INDIVIDUAL LEADERS
    // -------------------------------------------------------------------------
    case 'LEADERSHIP_FAHIM': {
      return pack(
        '💼 **ফাহিম সামিউল ইসলাম (Fahim Samiul Islam)**\n\n' +
        '• **পদবি:** উপ-প্রধান নির্বাহী কর্মকর্তা (Deputy Chief Executive Officer - DCEO)\n' +
        '• **বিভাগ:** Executive Directorate & Program Operations\n' +
        '• **মোবাইল:** `+880 1303-290971`\n' +
        '• **ইমেইল:** `samiulislamfahim8@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/fahimsamiul.Islam.568/)\n' +
        '• **দায়িত্ব:** সংগঠনের নির্বাহী পরিচালনা, দেশব্যাপী যুব বিজ্ঞান কর্মসূচি সমন্বয় ও শীর্ষ নেতৃত্বে কৌশলগত সহযোগিতা করেন।',

        '💼 **Fahim Samiul Islam (Deputy Chief Executive Officer - DCEO):**\n\n' +
        '• Mobile: +880 1303-290971\n' +
        '• Email: samiulislamfahim8@gmail.com\n' +
        '• Facebook: https://www.facebook.com/fahimsamiul.Islam.568/',

        '💼 **Fahim Samiul Islam — Deputy Chief Executive Officer (DCEO):**\n\n' +
        '• **Phone:** `+880 1303-290971`\n' +
        '• **Email:** `samiulislamfahim8@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/fahimsamiul.Islam.568/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Fahim Samiul Islam' }
      )
    }

    case 'LEADERSHIP_SOYAIB': {
      return pack(
        '🔬 **শোয়াইব ইসলাম (Soyaib Islam)**\n\n' +
        '• **পদবি:** প্রধান গবেষণা কর্মকর্তা (Chief Research Officer - CRO)\n' +
        '• **বিভাগ:** Research Strategy & Scientific Development\n' +
        '• **মোবাইল:** `+880 1349-359808`\n' +
        '• **ইমেইল:** `soyaib248@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1DTfy9EwFd/)\n' +
        '• **দায়িত্ব:** তরুণদের গবেষণা পদ্ধতি, সায়েন্টিফিক জার্নাল ও পেপার প্রকাশনা, রিসার্চ ক্লিনিক এবং অ্যাকাডেমিক কারিকুলাম তত্ত্বাবধান করেন।',

        '🔬 **Soyaib Islam (Chief Research Officer - CRO):**\n\n' +
        '• Mobile: +880 1349-359808\n' +
        '• Email: soyaib248@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1DTfy9EwFd/',

        '🔬 **Soyaib Islam — Chief Research Officer (CRO):**\n\n' +
        '• **Phone:** `+880 1349-359808`\n' +
        '• **Email:** `soyaib248@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1DTfy9EwFd/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Soyaib Islam' }
      )
    }

    case 'LEADERSHIP_MEJBA': {
      return pack(
        '⚙️ **শাহরিয়ার মেজবা (Shahriar Mejba)**\n\n' +
        '• **পদবি:** প্রধান পরিচালনা কর্মকর্তা (Chief Operating Officer - COO)\n' +
        '• **বিভাগ:** Operations & Council Governance\n' +
        '• **মোবাইল:** `+880 1410-581821`\n' +
        '• **ইমেইল:** `mejbaacps2007@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1E5uVz1e3v/)\n' +
        '• **ভাউচার কোড:** `UYFSR-REF-SM2026` (রেজিস্ট্রেশন ফিতে ২০% ছাড়)\n' +
        '• **দায়িত্ব:** সাংগঠনিক পরিচালনা, অপারেশনাল ওয়ার্কফ্লো, জাতীয় ইভেন্ট বাস্তবায়ন, ফিল্ড চ্যাপ্টার সমন্বয় ও লজিস্টিকস পরিচালনা করেন।',

        '⚙️ **Shahriar Mejba (Chief Operating Officer - COO):**\n\n' +
        '• Mobile: +880 1410-581821\n' +
        '• Email: mejbaacps2007@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1E5uVz1e3v/\n' +
        '• Voucher: UYFSR-REF-SM2026 (20% off)',

        '⚙️ **Shahriar Mejba — Chief Operating Officer (COO):**\n\n' +
        '• **Phone:** `+880 1410-581821`\n' +
        '• **Email:** `mejbaacps2007@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1E5uVz1e3v/)\n' +
        '• **Voucher:** `UYFSR-REF-SM2026`',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Shahriar Mejba' }
      )
    }

    case 'LEADERSHIP_DALIA': {
      return pack(
        '📢 **ডালিয়া সুলতানা জ্যোতি (Dalia Sultana Joty)**\n\n' +
        '• **পদবি:** প্রধান যোগাযোগ কর্মকর্তা (Chief Communications Officer - CCO)\n' +
        '• **বিভাগ:** Communications & External Affairs\n' +
        '• **মোবাইল:** `+880 1333-623162`\n' +
        '• **ইমেইল:** `daliajoty@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/dalia.joty)\n' +
        '• **দায়িত্ব:** সাংগঠনিক বহির্যোগাযোগ, মিডিয়া সম্পর্ক, প্রাতিষ্ঠানিক প্রেস রিলিজ এবং জাতীয় যুব গবেষণা প্রচার পরিচালনা করছেন।',

        '📢 **Dalia Sultana Joty (Chief Communications Officer - CCO):**\n\n' +
        '• Mobile: +880 1333-623162\n' +
        '• Email: daliajoty@gmail.com\n' +
        '• Facebook: https://www.facebook.com/dalia.joty',

        '📢 **Dalia Sultana Joty — Chief Communications Officer (CCO):**\n\n' +
        '• **Phone:** `+880 1333-623162`\n' +
        '• **Email:** `daliajoty@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/dalia.joty)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Dalia Sultana Joty' }
      )
    }

    case 'LEADERSHIP_JARIN': {
      return pack(
        '📋 **জারিন তাসনিম (Jarin Tasnim)**\n\n' +
        '• **পদবি:** প্রধান ব্যবস্থাপনা কর্মকর্তা (Chief Management Officer - CMO)\n' +
        '• **বিভাগ:** Management Operations & Public Affairs\n' +
        '• **মোবাইল:** `+880 1333-623162`\n' +
        '• **ইমেইল:** `parkjarinot7@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1Hs9Ffvgxd/)\n' +
        '• **দায়িত্ব:** সাংগঠনিক ম্যানেজমেন্ট ওয়ার্কফ্লো, আন্তঃপ্রাতিষ্ঠানিক যোগাযোগ, ইভেন্ট পরিচালনা ও জনসংযোগ দেখাশোনা করেন।',

        '📋 **Jarin Tasnim (Chief Management Officer - CMO):**\n\n' +
        '• Mobile: +880 1333-623162\n' +
        '• Email: parkjarinot7@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1Hs9Ffvgxd/',

        '📋 **Jarin Tasnim — Chief Management Officer (CMO):**\n\n' +
        '• **Phone:** `+880 1333-623162`\n' +
        '• **Email:** `parkjarinot7@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1Hs9Ffvgxd/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Jarin Tasnim' }
      )
    }

    case 'LEADERSHIP_NABIL': {
      return pack(
        '🤝 **মো: নাবিল তাহমিদ (Md Nabil Tahmid)**\n\n' +
        '• **পদবি:** প্রধান মানবসম্পদ কর্মকর্তা (Chief Human Resources Officer - CHRO)\n' +
        '• **বিভাগ:** Human Resources & Talent Development\n' +
        '• **মোবাইল:** `+880 1617-607048`\n' +
        '• **ইমেইল:** `hassantahmid312@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1E6jW8D1Vd/)\n' +
        '• **দায়িত্ব:** মানবসম্পদ ব্যবস্থাপনা, নেতৃত্ব উন্নয়ন, দেশব্যাপী নতুন সদস্য ও ভলান্টিয়ার নিয়োগ এবং কমিউনিটি কল্যাণ পরিচালনা করেন।',

        '🤝 **Md Nabil Tahmid (Chief Human Resources Officer - CHRO):**\n\n' +
        '• Mobile: +880 1617-607048\n' +
        '• Email: hassantahmid312@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1E6jW8D1Vd/',

        '🤝 **Md Nabil Tahmid — Chief Human Resources Officer (CHRO):**\n\n' +
        '• **Phone:** `+880 1617-607048`\n' +
        '• **Email:** `hassantahmid312@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1E6jW8D1Vd/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Md Nabil Tahmid' }
      )
    }

    case 'LEADERSHIP_TASHKIR': {
      return pack(
        '💻 **শাহরিয়ার তাসকির (Shahriyar Tashkir)**\n\n' +
        '• **পদবি:** প্রধান প্রযুক্তি কর্মকর্তা (Chief Technology Officer - CTO)\n' +
        '• **বিভাগ:** Technology & Digital Infrastructure\n' +
        '• **মোবাইল:** `+880 1349-359808`\n' +
        '• **ইমেইল:** `tashkir2006@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1b6Xuh2wGZ/)\n' +
        '• **দায়িত্ব:** ডিজিটাল সিস্টেম আর্কিটেকচার, প্ল্যাটফর্ম ইঞ্জিনিয়ারিং, কেন্দ্রীয় পোর্টাল ও কম্পিউটেশনাল রিসার্চ টুলস পরিচালনা করেন।',

        '💻 **Shahriyar Tashkir (Chief Technology Officer - CTO):**\n\n' +
        '• Mobile: +880 1349-359808\n' +
        '• Email: tashkir2006@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1b6Xuh2wGZ/',

        '💻 **Shahriyar Tashkir — Chief Technology Officer (CTO):**\n\n' +
        '• **Phone:** `+880 1349-359808`\n' +
        '• **Email:** `tashkir2006@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1b6Xuh2wGZ/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Shahriyar Tashkir' }
      )
    }

    case 'LEADERSHIP_TAKI': {
      return pack(
        '⚡ **তাকি আল জাকি (Taki Al Zaki)**\n\n' +
        '• **পদবি:** তথ্যপ্রযুক্তি সচিব (Secretary of Technology)\n' +
        '• **বিভাগ:** Technology & Digital Systems (Secretariat)\n' +
        '• **মোবাইল:** `+880 1911-287501`\n' +
        '• **ইমেইল:** `ktahan629@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Page](https://www.facebook.com/uyfsr)\n' +
        '• **দায়িত্ব:** কেন্দ্রীয় ওয়েব প্ল্যাটফর্ম ডেভেলপমেন্ট, ডিজিটাল সিস্টেম ইন্টিগ্রেশন এবং গবেষণা ও ইভেন্ট সংক্রান্ত প্রযুক্তিগত অপারেশনস তদারকি করেন।',

        '⚡ **Taki Al Zaki (Secretary of Technology):**\n\n' +
        '• Mobile: +880 1911-287501\n' +
        '• Email: ktahan629@gmail.com\n' +
        '• Facebook: https://www.facebook.com/uyfsr',

        '⚡ **Taki Al Zaki — Secretary of Technology:**\n\n' +
        '• **Phone:** `+880 1911-287501`\n' +
        '• **Email:** `ktahan629@gmail.com`\n' +
        '• **Facebook:** [Page Link](https://www.facebook.com/uyfsr)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Taki Al Zaki' }
      )
    }

    case 'LEADERSHIP_ROHAN': {
      return pack(
        '🏛️ **খালেদ সাইফুল্লাহ রোহান (Khaled Saifullah Rohan)**\n\n' +
        '• **পদবি:** সম্মানিত উপদেষ্টা (Adviser)\n' +
        '• **বিভাগ:** Advisory Board & Strategic Guidance\n' +
        '• **মোবাইল:** `+880 1736-309347`\n' +
        '• **ইমেইল:** `rohan232619@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1FGbriwzQb/)\n' +
        '• **দায়িত্ব:** সংগঠনের প্রাতিষ্ঠানিক সুশাসন, স্ট্র্যাটেজিক পরামর্শ, পলিসি মেন্টরশিপ এবং জাতীয় যুব বিজ্ঞান কর্মসূচিতে দিকনির্দেশনা প্রদান করেন।',

        '🏛️ **Khaled Saifullah Rohan (Adviser):**\n\n' +
        '• Mobile: +880 1736-309347\n' +
        '• Email: rohan232619@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1FGbriwzQb/',

        '🏛️ **Khaled Saifullah Rohan — Adviser:**\n\n' +
        '• **Phone:** `+880 1736-309347`\n' +
        '• **Email:** `rohan232619@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1FGbriwzQb/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Khaled Saifullah Rohan' }
      )
    }

    case 'LEADERSHIP_RAFIN': {
      return pack(
        '🏛️ **ওয়াসিমুল রাফিন (Oasimul Rafin)**\n\n' +
        '• **পদবি:** সম্মানিত উপদেষ্টা (Adviser)\n' +
        '• **বিভাগ:** Advisory Board & Academic Oversight\n' +
        '• **মোবাইল:** `+880 1855-052383`\n' +
        '• **ইমেইল:** `Oasimulrafin@gmail.com`\n' +
        '• **ফেসবুক:** [Facebook Profile](https://www.facebook.com/share/1CLvCsT3Ho/)\n' +
        '• **দায়িত্ব:** প্রাতিষ্ঠানিক গবেষণা, যুব বিজ্ঞান উদ্যোগ ও একাডেমিক পরামর্শ ও নীতিগত সহায়তা প্রদান করছেন।',

        '🏛️ **Oasimul Rafin (Adviser):**\n\n' +
        '• Mobile: +880 1855-052383\n' +
        '• Email: Oasimulrafin@gmail.com\n' +
        '• Facebook: https://www.facebook.com/share/1CLvCsT3Ho/',

        '🏛️ **Oasimul Rafin — Adviser:**\n\n' +
        '• **Phone:** `+880 1855-052383`\n' +
        '• **Email:** `Oasimulrafin@gmail.com`\n' +
        '• **Facebook:** [Profile Link](https://www.facebook.com/share/1CLvCsT3Ho/)',
        { label: 'View Profile', href: '#leadership', view: 'home', anchor: 'leadership', leaderName: 'Oasimul Rafin' }
      )
    }

    // -------------------------------------------------------------------------
    // 36. ABOUT UYFSR
    // -------------------------------------------------------------------------
    case 'ABOUT_UYFSR': {
      return pack(
        '🔬 **United Youth Forum of Science and Research (UYFSR)** প্রতিষ্ঠিত হয় **৩০ মে ২০২৫** তারিখে, ঢাকায়।\n\nআমাদের মূল লক্ষ্য হলো তরুণ প্রজন্মকে পাঠ্যবইয়ের বাইরে গিয়ে বৈজ্ঞানিক অনুসন্ধান, বাস্তব পরীক্ষণ এবং গবেষণার আনন্দে যুক্ত করা। আমরা নিয়মিত ওয়ার্কশপ, জাতীয় সায়েন্স ফেয়ার, অলিম্পিয়াড এবং সেমিনার আয়োজনের মাধ্যমে তরুণদের জন্য একটি বিজ্ঞানমনস্ক বাংলাদেশ গঠনে কাজ করে যাচ্ছি।',
        '🔬 **United Youth Forum of Science and Research (UYFSR)** প্রতিষ্ঠিত হয়েছে **৩০ মে ২০২৫** তারিখে।\n\nআমাদের মূল ভিশন হলো স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের তরুণদের মধ্যে গবেষণার সংস্কৃতি গড়ে তোলা। গবেষণা শুধু বড় বিজ্ঞানীদের জন্য নয়—যে কোনো অনুসন্ধিৎসু তরুণই গবেষণার পথপ্রদর্শক হতে পারে। এই লক্ষ্যে আমরা অলিম্পিয়াড, প্র্যাকটিক্যাল ল্যাব সেশন এবং জাতীয় প্ল্যাটফর্ম গড়ে তুলছি।',
        '🔬 **United Youth Forum of Science and Research (UYFSR)** was established on **30 May 2025** in Dhaka, Bangladesh.\n\nOur mission is to democratize scientific thinking and empirical research among school, college, and university students. We organize hands-on lab workshops, competitive Olympiads, expert faculty seminars, and nationwide youth leadership cohorts.',
        { label: 'Learn More in About Section', href: '#about', view: 'home', anchor: 'about' }
      )
    }

    // -------------------------------------------------------------------------
    // 37. ACTIVITIES & WORKSHOPS
    // -------------------------------------------------------------------------
    case 'ACTIVITIES_WORKSHOPS': {
      return pack(
        '🧪 **UYFSR-এর ৫টি মূল কার্যক্রম:**\n\n1. **Practical Workshops:** সরাসরি ল্যাবরেটরি যন্ত্রপাতি ব্যবহার ও ব্যবহারিক পরীক্ষা-নিরীক্ষা।\n2. **Seminars & Expert Talks:** দেশের শীর্ষ বিজ্ঞানী ও বিশ্ববিদ্যালয় অধ্যাপকদের সাথে সরাসরি প্রশ্নোত্তর ও দিকনির্দেশনা।\n3. **Science Fairs & Olympiads:** জাতীয় ও বিভাগীয় পর্যায়ে বহুমুখী মেধা প্রতিযোগিতা।\n4. **Quiz & Problem-Solving:** দ্রুতগতির লজিক্যাল কুইজ ও সমস্যা সমাধান সেশন।\n5. **Youth Leadership & Mentorship:** সারাদেশের শিক্ষাপ্রতিষ্ঠানে বিজ্ঞান ক্লাব ও ক্যাম্পাসে তরুণ সংগঠক তৈরি।',
        '🧪 **UYFSR-এর প্রধান কার্যক্রমসমূহ:**\n\n1. **হাতে-কলমে ল্যাব ওয়ার্কশপ:** সরাসরি অ্যাপারেটাস নিয়ে এক্সপেরিমেন্ট করার সুযোগ।\n2. **এক্সপার্ট সেমিনার:** দেশসেরা ফ্যাকাল্টি ও গবেষকদের সাথে সরাসরি আলোচনা।\n3. **অলিম্পিয়াড ও সায়েন্স ফেয়ার:** ফিজিক্স, কেমিস্ট্রি, বায়ো, ম্যাথ ও অ্যাস্ট্রোনমিতে জাতীয় প্রতিযোগিতা।\n4. **কুইজ ও লজিক চ্যালেঞ্জ:** দ্রুতগতির প্রবলেম সলভিং সেশন।\n5. **ক্যাম্পাস লিডারশিপ:** স্কুল-কলেজে বিজ্ঞান চর্চা ছড়িয়ে দিতে ক্যাম্পাস অ্যাম্বাসেডরদের নেতৃত্ব।',
        '🧪 **UYFSR Operates Across 5 Core Pillars:**\n\n1. **Practical Workshops** — Hands-on apparatus manipulation and live data recording.\n2. **Seminars & Expert Talks** — Direct dialogues with university faculty mentors and active researchers.\n3. **Science Fairs & Olympiads** — National multi-disciplinary competitive stages.\n4. **Quiz & Problem-Solving** — Rapid-fire buzzer rounds and empirical logic puzzles.\n5. **Youth Leadership** — Empowering student campus organizers across Bangladesh.',
        { label: 'Explore Core Initiatives Deck', href: '#activities', view: 'home', anchor: 'activities' }
      )
    }

    // -------------------------------------------------------------------------
    // 38. CERTIFICATES & CREDENTIALS
    // -------------------------------------------------------------------------
    case 'CERTIFICATES': {
      return pack(
        '🏆 **হ্যাঁ, নিশ্চিতভাবে অফিসিয়াল সার্টিফিকেট প্রদান করা হয়!**\n\nUYFSR-এর প্রতিটি ওয়ার্কশপ, অলিম্পিয়াড এবং ফেয়ারে অংশগ্রহণকারী সকল শিক্ষার্থীকে ইউনিক সিরিয়াল নম্বরযুক্ত ভেরিফাইড ডিজিটাল সার্টিফিকেট প্রদান করা হয়। এছাড়া শীর্ষ স্থানাধিকারীদের জন্য রয়েছে জাতীয় মেডেল, ক্রেস্ট এবং সম্মাননা স্মারক।',
        '🏆 **জি হ্যাঁ! শতভাগ ভেরিফাইড অফিশিয়াল সার্টিফিকেট দেওয়া হয়!**\n\nআমাদের যে কোনো ইভেন্ট বা অলিম্পিয়াডে সফলভাবে অংশগ্রহণ করলে ইউনিক ক্রেডেনশিয়াল সিরিয়ালসহ ডিজিটাল সার্টিফিকেট দেওয়া হয় যা অনলাইনে যাচাইযোগ্য। এছাড়া বিজয়ীরা পাবেন আকর্ষণীয় ন্যাশনাল মেডেল ও ট্রফি!',
        '🏆 **Yes, official verified certificates are provided!**\n\nEvery participant in our workshops, Olympiads, and carnivals receives a verified digital certificate complete with a unique credential serial number. Winners receive national championship medals, plaques, and research credentials.',
        { label: 'Read FAQ Details', href: '#faq', view: 'home', anchor: 'faq' }
      )
    }

    // -------------------------------------------------------------------------
    // 39. PARTNERS
    // -------------------------------------------------------------------------
    case 'PARTNERS': {
      return pack(
        '🤝 **UYFSR-এর সহযোগী প্রতিষ্ঠান ও পার্টনারদের বিস্তারিত তালিকা:**\n\n' +
        '• **TWIMBOL:** প্রোগ্রাম ও ওয়ার্কশপ পার্টনার (Junior Startup Challenge ও Junior Talent Award-এর যৌথ আয়োজক)\n' +
        '• **KIDLON:** ভেন্যু ও প্রেজেন্টিং পার্টনার (Junior Talent Award Season 1-এর মূল স্টেজ)\n' +
        '• **MEJOLOGY:** অ্যাকাডেমিক কনটেন্ট ও সায়েন্স কারিকুলাম পার্টনার\n' +
        '• **ASTROSPHERE:** অলিম্পিয়াড ও মহাকাশ বিজ্ঞান কো-অর্গানাইজার\n' +
        '• **The Bayline Journal:** এডিটোরিয়াল মিডিয়া পার্টনার\n' +
        '• **Motion BD:** ব্রডকাস্ট মিডিয়া পার্টনার (ভিডিও ও ডকুমেন্টারি)\n' +
        '• **TezzFeed:** ডিজিটাল মিডিয়া পার্টনার (সোশ্যাল মিডিয়া প্রচার)\n' +
        '• **Adamjee School News Network & Communication Club:** ১ম জাতীয় জার্নালিজম কার্নিভাল ২০২৫-এর হোস্ট\n' +
        '• **Learning and Study Organization:** অ্যাকাডেমিক স্টাডি মেটেরিয়াল কো-অর্গানাইজার\n' +
        '• **The Focal Vibe:** ক্রিয়েটিভ ডিরেকশন ও স্টেজক্রাফট পার্টনার\n' +
        '• **The Yeasirians:** মার্চেন্ডাইজ ও গিফট পার্টনার (ক্রেস্ট ও মেডেল)\n' +
        '• **Aurelix:** অফিসিয়াল ইভেন্ট ফ্র্যাগ্রেন্স পার্টনার।',

        '🤝 **UYFSR Official Partners Roster:**\n\n' +
        '• **TWIMBOL:** Workshop & Program Partner\n' +
        '• **KIDLON:** Venue & Presenting Partner\n' +
        '• **MEJOLOGY:** Academic Content Partner\n' +
        '• **ASTROSPHERE:** Astronomy Olympiad Partner\n' +
        '• **Media Partners:** Motion BD, The Bayline Journal, TezzFeed\n' +
        '• **Campus Partner:** Adamjee School News Network & Communication Club\n' +
        '• **Creative & Gifts:** The Focal Vibe, The Yeasirians, Aurelix (Fragrance).',

        '🤝 **UYFSR Institutional Partners Portfolio:**\n\n' +
        '• **TWIMBOL:** Program & Workshop Partner (Co-organizer of Junior Startup Challenge & Junior Talent Award)\n' +
        '• **KIDLON:** Venue & Presenting Partner (Junior Talent Award Season 1)\n' +
        '• **MEJOLOGY:** Academic Content & Secondary Research Curriculum Partner\n' +
        '• **ASTROSPHERE:** Astronomy & Space Olympiad Co-organizer\n' +
        '• **Media Consortium:** Motion BD (Broadcast), The Bayline Journal (Editorial), TezzFeed (Digital)\n' +
        '• **Campus Club Partner:** Adamjee School News Network & Communication Club (1st Journalism Carnival 2025)\n' +
        '• **Affiliates:** Learning and Study Organization, The Focal Vibe (Creative), The Yeasirians (Gifts), Aurelix (Event Fragrance).',
        { label: 'Explore Partners Marquee', href: '#partners', view: 'home', anchor: 'partners' }
      )
    }

    // -------------------------------------------------------------------------
    // 40. CONTACT & SECRETARIAT
    // -------------------------------------------------------------------------
    case 'CONTACT': {
      return pack(
        '📬 **UYFSR কেন্দ্রীয় সচিবালয়ের অফিসিয়াল যোগাযোগ মাধ্যম:**\n\n' +
        '• 📧 **কেন্দ্রীয় ইমেইল:** `uyfsr.org@gmail.com`\n' +
        '• 📱 **অফিসিয়াল বিকাশ / হেল্পলাইন নম্বর:** `01911287501`\n' +
        '• 👔 **সিইও সরাসরি যোগাযোগ:** `+880 1824-798147` (মোস্তাফিজ বিন জিহাদ)\n' +
        '• 🌐 **ফেসবুক পেজ:** [facebook.com/uyfsr](https://www.facebook.com/uyfsr)\n' +
        '• 🏢 **কেন্দ্রীয় সচিবালয়:** ঢাকা, বাংলাদেশ (সমগ্র ৬৪ জেলায় কার্যক্রম পরিচালিত)\n' +
        '• 💬 এছাড়া ওয়েবসাইটের ফুটারের ফর্ম পূরণ করে যেকোনো প্রশ্ন সরাসরি পাঠাতে পারেন!',

        '📬 **UYFSR Central Secretariat Contact:**\n\n' +
        '• 📧 Email: `uyfsr.org@gmail.com`\n' +
        '• 📱 Official Helpline / bKash: `01911287501`\n' +
        '• 👔 CEO Contact: `+880 1824-798147`\n' +
        '• 🌐 Facebook: https://www.facebook.com/uyfsr\n' +
        '• 🏢 Location: Dhaka, Bangladesh.\n' +
        'Website footer er form puron koreo amader message dite paren!',

        '📬 **Contact the UYFSR Central Secretariat:**\n\n' +
        '• 📧 **Central Email:** `uyfsr.org@gmail.com`\n' +
        '• 📱 **Official Helpline & Remittance:** `01911287501`\n' +
        '• 👔 **CEO Direct Inquiries:** `+880 1824-798147` (Mustafiz Bin Jihad)\n' +
        '• 🌐 **Facebook Page:** [facebook.com/uyfsr](https://www.facebook.com/uyfsr)\n' +
        '• 🏢 **Headquarters:** Dhaka, Bangladesh (Operations spanning all 64 districts)\n' +
        '• 💬 Direct messaging also available via the footer inquiry portal.',
        { label: 'Go to Contact Form', href: '#contact', view: 'home', anchor: 'contact' }
      )
    }

    // -------------------------------------------------------------------------
    // 41. EXECUTIVE LOGIN
    // -------------------------------------------------------------------------
    case 'EXECUTIVE_LOGIN': {
      return pack(
        '🔐 **UYFSR এক্সিকিউটিভ পোর্টাল ও সিকিউরিটি ড্যাশবোর্ড:**\n\n' +
        'কাউন্সিল সদস্য, উপদেষ্টা ও সচিবগণ প্রাতিষ্ঠানিক ইমেইল এবং সিকিউর পাসওয়ার্ড দিয়ে ড্যাশবোর্ডে প্রবেশ করতে পারেন।\n\n' +
        '• **ড্যাশবোর্ডের কাজ:** রেজিষ্ট্রেশন পর্যবেক্ষণ, ক্যাম্পাস অ্যাম্বাসেডরদের অনুমোদন ও ই-আইডি ইস্যু, রেফারেল ভাউচার তৈরি এবং কাউন্সিল সভা নির্ধারণ।\n' +
        '• **পাসওয়ার্ড ভুলে গেলে:** লগইন পেজের "Forgot Password" লিংকে ক্লিক করলে আপনার রেজিস্টার্ড ইমেইলে সিকিউর ওটিপি কোড চলে যাবে।',

        '🔐 **UYFSR Executive Portal:**\n\n' +
        'Executive council members, advisors and secretariat official email o password diye login korte paren.\n' +
        'Password bhule gele "Forgot Password" e click korle registered email e OTP jabe!',

        '🔐 **UYFSR Executive Governance Dashboard:**\n\n' +
        'Appointed council members, advisors, and secretariat officials access the portal with verified executive credentials.\n' +
        '• Features: Live participant logs, ambassador verification, voucher issuance, council scheduling.\n' +
        '• Password Recovery: Built-in SMTP email OTP reset for registered accounts.',
        { label: 'Open Executive Login', href: '#executive-login', view: 'executive-login' }
      )
    }

    // -------------------------------------------------------------------------
    // 42. VOUCHER & DISCOUNTS
    // -------------------------------------------------------------------------
    case 'VOUCHER': {
      return pack(
        '🎟️ **UYFSR এক্সিকিউটিভ ভাউচার কোড ও ২০% ছাড়ের নিয়ম:**\n\n' +
        'রেজিস্ট্রেশন ফিতে **২০% নিশ্চিত ছাড়** পেতে নিচের যেকোনো একটি অফিশিয়াল ভাউচার কোড ব্যবহার করতে পারেন:\n' +
        '• `UYFSR-REF-MBJ2026` — রেফারেল: মোস্তাফিজ বিন জিহাদ (CEO)\n' +
        '• `UYFSR-REF-SM2026` — রেফারেল: শাহরিয়ার মেজবা (COO)\n\n' +
        '💡 রেজিস্ট্রেশন পেজের ২য় ধাপে Voucher Code ইনপুট দিয়ে "Apply" বাটনে ক্লিক করলেই ফি ২০% স্বয়ংক্রিয়ভাবে কমে যাবে!',

        '🎟️ **Official Voucher Codes (20% Discount):**\n\n' +
        '• `UYFSR-REF-MBJ2026` (CEO Mustafiz Bin Jihad)\n' +
        '• `UYFSR-REF-SM2026` (COO Shahriar Mejba)\n\n' +
        'Registration page e code ta bosiye Apply dilei instantly 20% discount paben!',

        '🎟️ **Executive Referral Voucher Codes (Instant 20% Off):**\n\n' +
        '• `UYFSR-REF-MBJ2026` (Mustafiz Bin Jihad, CEO)\n' +
        '• `UYFSR-REF-SM2026` (Shahriar Mejba, COO)\n\n' +
        'Enter either code in the voucher box during registration checkout to unlock your 20% reduction.',
        { label: 'Register with Voucher', href: '#register', view: 'register' }
      )
    }

    // -------------------------------------------------------------------------
    // 43. GRATITUDE
    // -------------------------------------------------------------------------
    case 'GRATITUDE': {
      return pack(
        'আপনাকে অনেক ধন্যবাদ! 🌟 আপনার সাহায্য করতে পেরে আমি আনন্দিত। বিজ্ঞান ও গবেষণার পথে UYFSR সর্বদা আপনার পাশে আছে। আর কিছু জানার থাকলে নিঃসঙ্কোচে জিজ্ঞেস করুন! 🚀',
        'অনেক ধন্যবাদ ভাইয়া/আপু! 🌟 আপনার প্রশ্নের উত্তর দিতে পেরে খুব ভালো লাগল। UYFSR নিয়ে যেকোনো সময় আমাকে নক দিতে পারেন। ভালো থাকবেন! 🚀',
        "You're very welcome! 🌟 It's an honor to support curious minds and passionate researchers. Feel free to ask anytime if you need anything else. Have a fantastic day! 🚀"
      )
    }

    // -------------------------------------------------------------------------
    // 44. FAREWELL
    // -------------------------------------------------------------------------
    case 'FAREWELL': {
      return pack(
        'বিদায়! ভালো থাকবেন সবসময়। UYFSR-এর সাথে আপনার যাত্রা সুন্দর ও সফল হোক! আবার কথা হবে। 👋✨',
        'বিদায় ভাইয়া/আপু! ভালো থাকবেন সবসময়। UYFSR-এর চমৎকার ইভেন্টগুলোতে দেখা হবে ইনশাআল্লাহ! 👋✨',
        'Goodbye! Wishing you brilliant success on your scientific journey. Stay curious, and feel free to reach out anytime! 👋✨'
      )
    }

    // -------------------------------------------------------------------------
    // 45. COMPLIMENT
    // -------------------------------------------------------------------------
    case 'COMPLIMENT': {
      return pack(
        'ধন্যবাদ আপনার সুন্দর কথার জন্য! 😊 আপনার প্রশংসা আমাকে আরও উৎসাহিত করে। বিজ্ঞানের আলো ছড়িয়ে দিতে আমি সর্বদা প্রস্তুত!',
        'থ্যাংক ইউ সো মাচ! 😊 আপনার মতো বিজ্ঞানপ্রেমী বন্ধুদের সাহায্য করতে পেরেই আমার আনন্দ! আর কী জানতে চান বলুন?',
        'Thank you so much for your kind words! 😊 It is my absolute joy to assist passionate students and future innovators like you!'
      )
    }

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // 46. ASTRONOMY & SPACE CONCEPTS
    // -------------------------------------------------------------------------
    case 'ASTRONOMY_SPACE': {
      const q = query.toLowerCase();
      if (q.includes('black hole') || q.includes('ব্ল্যাক হোল')) {
        return pack(
          '🌌 **ব্ল্যাক হোল (Black Hole):**\n\nব্ল্যাক হোল মহাবিশ্বের এমন এক চরম স্থান যার মাধ্যাকর্ষণ শক্তি এত প্রচণ্ড যে কোনো আলো বা পদার্থই এর ভেতর থেকে বের হতে পারে না। কোনো বিশাল নক্ষত্রের জীবনাবসানে সুপারনোভা বিস্ফোরণের পর কেন্দ্রের স্থানটি চরম সংকুচিত হয়ে ব্ল্যাক হোলে পরিণত হয়। এর সীমানাকে বলা হয় "ইভেন্ট হরাইজন" (Event Horizon)।',
          '🌌 **Black Hole সম্পর্কে সহজে বুঝুন:**\n\nব্ল্যাক হোল মহাবিশ্বের এমন একটি মহাজাগতিক অঞ্চল যার অভিকর্ষ বল এত তীব্র যে আলোও এর থেকে পালাতে পারে না! বিশাল কোনো নক্ষত্রের মৃত্যুর পর যখন এটি অতি সংকুচিত হয়ে যায়, তখন এমন চরম ঘনত্বের ব্ল্যাক হোল তৈরি হয়।',
          '🌌 **What is a Black Hole?**\n\nA black hole is a region of spacetime where gravity is so intense that nothing—not even light—can escape its gravitational pull. They typically form when massive stars collapse under their own gravity at the end of their lifecycle.',
          { label: 'Explore Astronomy Track', href: '#activities', view: 'home', anchor: 'activities' }
        );
      }
      if (q.includes('chand') || q.includes('moon') || q.includes('চাঁদ')) {
        return pack(
          '🌙 **চাঁদ সম্পর্কিত বিজ্ঞান:**\n\nচাঁদ পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ। চাঁদের নিজস্ব কোনো আলো নেই; সূর্যের আলো চাঁদের পৃষ্ঠে প্রতিফলিত হয়ে আমাদের চোখে পৌঁছায় বলেই চাঁদ উজ্জ্বল দেখায়। আর নিজস্ব মহাকর্ষ বলের টানে চাঁদ নিজেকে নিখুঁত গোলাকার বজায় রেখেছে।',
          '🌙 **চাঁদ সম্পর্কে চমকপ্রদ তথ্য:**\n\nচাঁদের নিজস্ব কোনো আলো নেই! সূর্যের আলো চাঁদের পৃষ্ঠে প্রতিফলিত (Reflect) হয়ে পৃথিবীতে আসে বলেই চাঁদকে এত উজ্জ্বল লাগে। আর নিজস্ব মহাকর্ষের কারণে চাঁদ সুন্দর গোল আকৃতি ধারণ করেছে।',
          '🌙 **The Science of the Moon:**\n\nThe Moon is Earth’s natural satellite. It does not emit its own light; it illuminates the night sky by reflecting sunlight. Its spherical shape is maintained by its self-gravitational hydrostatic equilibrium.',
          { label: 'Explore Astronomy Track', href: '#activities', view: 'home', anchor: 'activities' }
        );
      }
      if (q.includes('surjo') || q.includes('sun') || q.includes('সূর্য')) {
        return pack(
          '☀️ **সূর্য ও সৌরশক্তি:**\n\nসূর্য হলো আমাদের সৌরজগতের মধ্যম সারির একটি নক্ষত্র। এর কেন্দ্রে "নিউক্লিয়ার ফিউশন" বিক্রিয়ায় হাইড্রোজেন ক্রমাগত হিলিয়ামে রূপান্তরিত হয় এবং বিপুল পরিমাণ তাপ ও আলোক শক্তি ছড়িয়ে দেয়, যা পৃথিবীতে প্রাণের অস্তিত্ব টিকিয়ে রাখে।',
          '☀️ **সূর্য কীভাবে আলো দেয়?**\n\nসূর্যের পেটে অবিরাম চলছে **Nuclear Fusion**! কোটি কোটি ডিগ্রি তাপমাত্রায় হাইড্রোজেন গ্যাস ফিউজ হয়ে হিলিয়ামে পরিণত হচ্ছে এবং তৈরি করছে অসীম তাপ ও আলো!',
          '☀️ **How the Sun Works:**\n\nThe Sun is a G-type main-sequence star generating energy through nuclear fusion in its core, fusing millions of tons of hydrogen into helium every second.',
          { label: 'Explore Astronomy Track', href: '#activities', view: 'home', anchor: 'activities' }
        );
      }
      return pack(
        '🔭 **জ্যোতির্বিজ্ঞান ও মহাকাশ বিজ্ঞান:**\n\nমহাবিশ্বের কোটি কোটি ছায়াপথ, নক্ষত্র, গ্রহ এবং কৃষ্ণগহ্বর নিয়ে রহস্য উন্মোচনের বিজ্ঞানই হলো জ্যোতির্বিজ্ঞান। UYFSR জ্যোতির্বিজ্ঞানের প্রচারণায় **ASTROSPHERE**-এর সাথে যৌথভাবে কাজ করে এবং National Science Eclipse-এ জ্যোতির্বিজ্ঞান অলিম্পিয়াড অন্তর্ভুক্ত রয়েছে!',
        '🔭 **অ্যাস্ট্রোনমি ও মহাকাশ গবেষণা:**\n\nমহাকাশের কোটি কোটি গ্যালাক্সি আর ব্ল্যাক হোলের রহস্য জানতে জ্যোতির্বিজ্ঞানের কোনো বিকল্প নেই! UYFSR-এর National Science Eclipse 2026-এ স্পেশাল অ্যাস্ট্রোনমি অলিম্পিয়াড থাকছে!',
        '🔭 **Astronomy & Space Sciences:**\n\nAstronomy investigates the physics and evolution of celestial objects. UYFSR actively partners with **ASTROSPHERE** to bring competitive Astronomy Olympiad categories to youth!',
        { label: 'View Academic Calendar', href: '#events', view: 'home', anchor: 'events' }
      );
    }

    // -------------------------------------------------------------------------
    // 47. PHYSICS CONCEPTS
    // -------------------------------------------------------------------------
    case 'PHYSICS_CONCEPT': {
      const q = query.toLowerCase();
      if (q.includes('gravity') || q.includes('মহাকর্ষ') || q.includes('অভিকর্ষ')) {
        return pack(
          '🪐 **মহাকর্ষ ও অভিকর্ষ (Gravity):**\n\nমহাকর্ষ হলো সেই প্রাকৃতিক আকর্ষণ বল যা ভরযুক্ত যেকোনো দুটি বস্তুকে পরস্পরের দিকে আকর্ষণ করে। আইজ্যাক নিউটনের মহাকর্ষ সূত্র এবং আইনস্টাইনের আপেক্ষিকতা তত্ত্বে একে স্থান-কালের বক্রতা (Curvature of Spacetime) হিসেবে প্রমাণিত করা হয়েছে।',
          '🪐 **Gravity বা মহাকর্ষ বল কী?**\n\nগ্র্যাভিটি হলো সেই প্রাকৃতিক টান যার কারণে আমরা মাটিতে দাঁড়িয়ে থাকতে পারি এবং পৃথিবী সূর্যের চারপাশে ঘোরে। আইনস্টাইনের মতে, ভর স্থান-কালকে বাঁকিয়ে দেয় বলেই এই আকর্ষণ অনুভব হয়!',
          '🪐 **What is Gravity?**\n\nGravity is a fundamental interaction that causes mutual attraction between all things with mass or energy. General Relativity models gravity as the curvature of spacetime.',
          { label: 'Physics Track in Science Eclipse', href: '#register', view: 'register' }
        );
      }
      return pack(
        '⚛️ **পদার্থবিজ্ঞান (Physics):**\n\nপদার্থ ও শক্তির পারস্পরিক রূপান্তর, গতি, তাপ, শব্দ, আলো ও আধুনিক কোয়ান্টাম বলবিদ্যার গবেষণাই হলো পদার্থবিজ্ঞান। UYFSR-এর National Science Eclipse 2026-এ পদার্থবিজ্ঞান অলিম্পিয়াডে চমৎকার কনসেপচুয়াল প্রবলেম সলভিং পর্ব রয়েছে!',
        '⚛️ **পদার্থবিজ্ঞানের জাদু:**\n\nমহাবিশ্বের সব নিয়ম—গতির সূত্র থেকে কোয়ান্টাম মেকানিক্স—সবকিছুই পদার্থবিজ্ঞানের অবদান! UYFSR-এর সায়েন্স এক্লিপ্সে ফিজিক্স অলিম্পিয়াডে অংশ নিয়ে নিজের মেধা যাচাই করতে পারেন।',
        '⚛️ **Physics Foundations:**\n\nPhysics explores nature from subatomic particles to cosmic galaxies. Test your conceptual analytical prowess in the Physics category at National Science Eclipse 2026!',
        { label: 'Register for Physics Olympiad', href: '#register', view: 'register' }
      );
    }

    // -------------------------------------------------------------------------
    // 48. CHEMISTRY CONCEPTS
    // -------------------------------------------------------------------------
    case 'CHEMISTRY_CONCEPT': {
      const q = query.toLowerCase();
      if (q.includes('atom') || q.includes('molecule') || q.includes('পরমাণু') || q.includes('অণু')) {
        return pack(
          '⚛️ **পরমাণু ও অণু (Atom & Molecule):**\n\nপরমাণু হলো পদার্থের মূল একক, যার কেন্দ্রে প্রোটন ও নিউট্রন থাকে এবং চারপাশের শক্তিস্তরে ইলেকট্রন ঘূর্ণায়মান থাকে। একাধিক পরমাণু রাসায়নিক বন্ধনে যুক্ত হয়ে অণু তৈরি করে।',
          '⚛️ **পরমাণু এবং অণু কী?**\n\nপদার্থের সবথেকে ক্ষুদ্রতম বিল্ডিং ব্লক হলো পরমাণু (Atom)। আর একের বেশি পরমাণু মিলে তৈরি করে অণু (Molecule)—যেমন দুটি হাইড্রোজেন ও একটি অক্সিজেন মিলে পানির অণু ($H_2O$)।',
          '⚛️ **Atoms & Molecules:**\n\nAtoms are the fundamental building blocks of all matter. Chemical bonding between atoms forms molecules that constitute everything in the known universe.',
          { label: 'Explore Chemistry Track', href: '#activities', view: 'home', anchor: 'activities' }
        );
      }
      return pack(
        '🧪 **রসায়ন বিজ্ঞান (Chemistry):**\n\nমৌলসমূহের পর্যায় সারণি, রাসায়নিক বিক্রিয়া ও জৈব রসায়নের পরীক্ষা-নিরীক্ষাই হলো কেমিস্ট্রি। UYFSR-এর প্র্যাকটিক্যাল ল্যাব সেশনে সরাসরি কাঁচের অ্যাপারেটাসে রাসায়নিক পরীক্ষা শেখানো হয়!',
        '🧪 **কেমিস্ট্রি বা রসায়ন:**\n\nপরমাণুর বন্ধন থেকে নতুন উপাদান আবিষ্কার—সবই কেমিস্ট্রির কারিশমা! UYFSR-এর ওয়ার্কশপে প্র্যাকটিক্যাল ল্যাব যন্ত্রপাতি দিয়ে এক্সপেরিমেন্ট শেখানো হয়।',
        '🧪 **Empirical Chemistry:**\n\nChemistry connects physics to biology through atomic interactions and organic synthesis. Experience laboratory testing in UYFSR practical workshops!',
        { label: 'Explore Chemistry Workshops', href: '#activities', view: 'home', anchor: 'activities' }
      );
    }

    // -------------------------------------------------------------------------
    // 49. BIOLOGY CONCEPTS
    // -------------------------------------------------------------------------
    case 'BIOLOGY_CONCEPT': {
      const q = query.toLowerCase();
      if (q.includes('photosynthesis') || q.includes('সালোকসংশ্লেষণ') || q.includes('gach')) {
        return pack(
          '🌿 **সালোকসংশ্লেষণ (Photosynthesis):**\n\nসবুজ উদ্ভিদ সূর্যালোক, ক্লোরোফিল এবং পানির উপস্থিতিতে বাতাস থেকে $CO_2$ শোষণ করে শর্করা খাদ্য এবং প্রাণদায়ী অক্সিজেন ($O_2$) নির্গত করে। এই বিক্রিয়াই পৃথিবীর খাদ্যশৃঙ্খলকে বাঁচিয়ে রেখেছে।',
          '🌿 **গাছ কীভাবে খাদ্য তৈরি করে?**\n\nগাছ পাতার ক্লোরোফিলের সাহায্যে সূর্যের আলো কাজে লাগিয়ে পানি ও কার্বন-ডাই-অক্সাইড দিয়ে গ্লুকোজ বানায় এবং বাতাসে অক্সিজেন ছাড়ে! এটিই সালোকসংশ্লেষণ।',
          '🌿 **Photosynthesis:**\n\nPhotosynthesis is the biochemical transformation whereby photosynthetic autotrophs convert solar radiance and carbon dioxide into chemical energy and atmospheric oxygen.',
          { label: 'Explore Biology Track', href: '#activities', view: 'home', anchor: 'activities' }
        );
      }
      if (q.includes('dna') || q.includes('gene') || q.includes('ডিএনএ')) {
        return pack(
          '🧬 **ডিএনএ (DNA):**\n\nDeoxyribonucleic Acid হলো আমাদের জীবনের বংশগতির কোড বা নির্দেশিকা। প্রতিটি কোষের নিউক্লিয়াসে থাকা ডাবল হেলিক্স ডিএনএ প্রোটিন সংশ্লেষণ এবং শারীরিক বৈশিষ্ট্য নির্ধারণ করে।',
          '🧬 **DNA কী?**\n\nজীবদেহের সব বৈশিষ্ট্যের নীলনকশা হলো DNA! আমাদের চুল, চোখের রঙ থেকে শুরু করে রক্তকণিকা—সবকিছুর কোড ডিএনএ-তে এনকোড করা থাকে।',
          '🧬 **DNA & Genetics:**\n\nDNA is the molecular blueprint of heredity, encoding nucleotide sequences that govern biological development across generations.',
          { label: 'Explore Biology Track', href: '#activities', view: 'home', anchor: 'activities' }
        );
      }
      return pack(
        '🔬 **জীববিজ্ঞান ও লাইফ সায়েন্স:**\n\nকোষের গঠন, জিনতত্ত্ব, মানবদেহ ও অণুজীব বিজ্ঞানের বিস্তৃত ক্ষেত্র জীববিজ্ঞান। UYFSR-এর বায়োলজি অলিম্পিয়াডে ধারণাগত যুক্তি ও মাইক্রোবায়োলজি প্রশ্ন থাকে।',
        '🔬 **জীববিজ্ঞান (Biology):**\n\nকোষ ও মানবদেহের রহস্য নিয়ে গবেষণা করার আনন্দই আলাদা! UYFSR-এর অলিম্পিয়াডে বায়োলজির জন্য স্পেশাল ট্র্যাক রয়েছে।',
        '🔬 **Biological Sciences:**\n\nInvestigating living organisms, cellular kinetics, and ecosystems. Participate in the Biology track at National Science Eclipse 2026!',
        { label: 'Register for Biology Olympiad', href: '#register', view: 'register' }
      );
    }

    // -------------------------------------------------------------------------
    // 50. MATHEMATICS & PROBLEM SOLVING
    // -------------------------------------------------------------------------
    case 'MATH_LOGIC': {
      return pack(
        '📐 **গণিত ও লজিক্যাল প্রবলেম সলভিং:**\n\nগণিত হলো বিজ্ঞানের ভাষা। বীজগণিত, জ্যামিতি, কম্বিনেটরিক্স ও ক্যালকুলাসের চর্চা মস্তিষ্কের সমস্যা সমাধানের ক্ষমতাকে বহুগুণ বাড়িয়ে দেয়। UYFSR-এর কুইজ ও ম্যাথ অলিম্পিয়াডে মুখস্থ কোনো সূত্র নয়, বরং বাস্তবসম্মত ধাঁধা ও যুক্তি সমাধান করতে হয়!',
        '📐 **ম্যাথ অলিম্পিয়াডের কৌশল:**\n\nগণিতে ভালো করার একমাত্র উপায় হলো ভয় না পেয়ে লজিক খোঁজা! নিয়মিত প্যাটার্ন ও ধাঁধা সমাধান করলে ম্যাথ অনেক আনন্দের মনে হবে। UYFSR ম্যাথ অলিম্পিয়াডে চমৎকার সব লজিক্যাল চ্যালেঞ্জ থাকে!',
        '📐 **Mathematics as the Language of Empirical Science:**\n\nMathematics sharpens inductive and deductive reasoning. Test your skills in number theory, combinatorics, and geometry in the Mathematics Olympiad category!',
        { label: 'Register for Math Olympiad', href: '#register', view: 'register' }
      );
    }

    // -------------------------------------------------------------------------
    // 51. AI, ROBOTICS & COMPUTER SCIENCE
    // -------------------------------------------------------------------------
    case 'AI_TECH_ROBOTICS': {
      return pack(
        '🤖 **কৃত্রিম বুদ্ধিমত্তা ও রোবোটিক্স (AI & Tech):**\n\nকম্পিউটারকে মানুষের মতো চিন্তা ও ডেটা বিশ্লেষণ করার ক্ষমতাই হলো AI বা কৃত্রিম বুদ্ধিমত্তা। পাইথন প্রোগ্রামিং, সেন্সর ও আরডুইনো দিয়ে রোবোটিক্স শেখা তরুণদের ভবিষ্যৎ গবেষণার জন্য অত্যন্ত জরুরি। UYFSR-এর টেকনোলজি উইং তরুণদের কোডিং ও টেকনিক্যাল প্রজেক্ট তৈরিতে উৎসাহিত করে!',
        '🤖 **রোবোটিক্স ও কোডিং কীভাবে শিখবেন?**\n\nসহজ প্রোগ্রামিং ভাষা যেমন Python অথবা Arduino দিয়ে হার্ডওয়্যার কোডিং শুরু করতে পারেন! UYFSR-এর স্টার্টআপ ও টেক চ্যালেঞ্জে শিক্ষার্থীরা রোবোটিক্স প্রজেক্ট নিয়ে অংশগ্রহণ করতে পারে।',
        '🤖 **Artificial Intelligence & Applied Robotics:**\n\nAI and computational algorithms transform raw data into intelligent action. UYFSR encourages students to build algorithmic prototypes and robotics systems for national showcases!',
        { label: 'Explore Junior Startup Challenge', href: '#events', view: 'home', anchor: 'events' }
      );
    }

    // -------------------------------------------------------------------------
    // 52. GENERAL SCIENCE
    // -------------------------------------------------------------------------
    case 'SCIENCE_GENERAL': {
      return pack(
        '🔬 **বিজ্ঞান কি?**\n\nবিজ্ঞান হলো পরীক্ষা-নিরীক্ষা, পর্যবেক্ষণ ও প্রমাণের ভিত্তিতে প্রাকৃতিক জগতের নিয়মাবলী জানার নিরন্তর প্রয়াস। বিজ্ঞান কোনো স্থির বিশ্বাস নয়, বরং প্রতিনিয়ত প্রশ্ন করার ও সত্য আবিষ্কারের একটি পদ্ধতি। UYFSR তরুণদের এই অনুসন্ধিৎসু ভাবনার বিকাশে কাজ করে!',
        '🔬 **বিজ্ঞান কাকে বলে?**\n\nবিজ্ঞান মানেই জানার কৌতূহল—"কেন" এবং "কীভাবে" ঘটে তা খুঁজে বের করা। মুখস্থ না করে ল্যাবরেটরিতে নিজে পরীক্ষা করে দেখার আনন্দই আসল বিজ্ঞান চর্চা!',
        '🔬 **The Essence of Science:**\n\nScience is the systematic enterprise of gathering empirical knowledge about the natural universe through testable explanations and verified experimental predictions.',
        { label: 'Explore What We Do', href: '#activities', view: 'home', anchor: 'activities' }
      );
    }    // -------------------------------------------------------------------------
    // INTERACTIVE SCIENCE QUIZ
    // -------------------------------------------------------------------------
    case 'INTERACTIVE_QUIZ': {
      const r = getQuizResponse(query)
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['1', '2', '3', '4'])
    }

    // -------------------------------------------------------------------------
    // ASTONISHING SCIENCE FACTS
    // -------------------------------------------------------------------------
    case 'INTERACTIVE_FACTS': {
      const r = getFactResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['আরেকটি ফ্যাক্ট', 'Science Quiz', 'Project Ideas', 'Math Olympiad'])
    }

    // -------------------------------------------------------------------------
    // MATHEMATICS OLYMPIAD GUIDE
    // -------------------------------------------------------------------------
    case 'MATH_OLYMPIAD_GUIDE': {
      const r = getMathOlympiadResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Physics Olympiad Guide', 'Junior Olympiad', 'Science Quiz'])
    }

    // -------------------------------------------------------------------------
    // PHYSICS OLYMPIAD GUIDE
    // -------------------------------------------------------------------------
    case 'PHYSICS_OLYMPIAD_GUIDE': {
      const r = getPhysicsOlympiadResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Math Olympiad Guide', 'Junior Olympiad', 'Science Quiz'])
    }

    // -------------------------------------------------------------------------
    // JUNIOR SCIENCE OLYMPIAD
    // -------------------------------------------------------------------------
    case 'JUNIOR_SCIENCE_OLYMPIAD': {
      const r = getJuniorOlympiadResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Math Olympiad Guide', 'Project Ideas', 'Science Quiz'])
    }

    // -------------------------------------------------------------------------
    // ADVANCED RESEARCH METHODOLOGY
    // -------------------------------------------------------------------------
    case 'RESEARCH_METHODOLOGY_ADVANCED': {
      const r = getResearchMethodologyResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Project Ideas', 'Higher Study Scholarships', 'Ambassador'])
    }

    // -------------------------------------------------------------------------
    // SCIENCE FAIR PROJECT IDEAS
    // -------------------------------------------------------------------------
    case 'PROJECT_IDEAS_BY_GRADE': {
      const r = getProjectIdeasResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Research Methodology', 'Science Eclipse Register', 'Science Quiz'])
    }

    // -------------------------------------------------------------------------
    // HIGHER STUDY & SCHOLARSHIPS
    // -------------------------------------------------------------------------
    case 'HIGHER_STUDY_SCHOLARSHIP': {
      const r = getHigherStudyResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Research Methodology', 'Campus Ambassador', 'Science Quiz'])
    }

    // -------------------------------------------------------------------------
    // SCIENTIFIC PIONEERS
    // -------------------------------------------------------------------------
    case 'SCIENTISTS_PIONEERS': {
      const r = getScientistsPioneersResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Science Quiz', 'Space Fact', 'Research Guide'])
    }

    // -------------------------------------------------------------------------
    // CALCULATION & FORMULAS
    // -------------------------------------------------------------------------
    case 'CALCULATION_OR_FORMULA': {
      const r = getCalculationOrFormulaResponse()
      return pack(r.bn, r.banglish, r.en, r.actionLink, ['Science Quiz', 'Space Fact', 'Math Olympiad'])
    }



    // 46. UNIVERSAL INTELLIGENT RESPONDER (NEVER STUCK!)
    // -------------------------------------------------------------------------
    default: {
      return pack(
        `আপনার প্রশ্নটি দারুণ! 😊 আমি **Eliboo**, UYFSR-এর এআই সায়েন্স অ্যাসিস্ট্যান্ট।\n\nবিজ্ঞান, প্রযুক্তি, গবেষণা কিংবা UYFSR সম্পর্কিত যে কোনো অনুসন্ধিৎসু প্রশ্নের সমাধান দিতে আমি সর্বদা প্রস্তুত। আপনি যদি কোনো নির্দিষ্ট বিষয়ের বিশদ ব্যাখ্যা চান, অথবা আমাদের:\n• **ক্যাম্পাস অ্যাম্বাসেডর আবেদন (১০০% ফ্রি)**\n• **National Science Eclipse ২০২৬-এর অলিম্পিয়াড**\n• **রেজিস্ট্রেশন ফি ও বিকাশ পেমেন্ট (01911287501)**\n• **বিজ্ঞান প্রজেক্ট আইডিয়া ও রিসার্চ পেপার সহায়তা**\nবিষয়ে জানতে চান, আমাকে আরেকটু খুলে বলুন। আমি বুঝিয়ে বলছি!`,
        `দারুণ প্রশ্ন ভাইয়া/আপু! 😊 আমি **Eliboo**, UYFSR-এর সার্বক্ষণিক AI সায়েন্স গাইড।\n\nবিজ্ঞান, গবেষণা আইডিয়া কিংবা UYFSR-এর যে কোনো তথ্য আমি নিমেষেই বুঝিয়ে দিতে পারি। আপনি চাইলে আমাকে জিজ্ঞেস করতে পারেন:\n• **Campus Ambassador আবেদন কীভাবে করবেন (১০০% Free!)**\n• **Science Eclipse অলিম্পিয়াডের সিলেবাস ও রেজিস্ট্রেশন**\n• **সায়েন্স ফেয়ার প্রজেক্ট আইডিয়া ও প্রস্তুতি**\n• **বিকাশ পেমেন্ট ও ভাউচার ডিসকাউন্ট নিয়ম**\n\nনির্দিষ্ট কোন দিকটি জানতে চান বলুন, আমি সুন্দর করে বুঝিয়ে দিচ্ছি!`,
        `That is an intriguing question! 😊 I am **Eliboo**, your official UYFSR AI Science Assistant.\n\nWhether exploring scientific inquiries, research methodologies, or UYFSR initiatives, I am here to guide you:\n• **100% Free Campus Ambassador Nominations**\n• **National Science Eclipse 2026 Olympiads & Syllabi**\n• **Registration & bKash/Nagad Payment Guidance**\n• **Science Project Concepts & Paper Writing Clinics**\n\nCould you elaborate a bit on what specific angle you'd like to explore? I'm ready to dive in!`,
        { label: 'Explore What We Do', href: '#activities', view: 'home', anchor: 'activities' }
      )
    }
  }
}
