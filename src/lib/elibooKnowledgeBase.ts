// =============================================================================
// ELIBOO MASSIVE KNOWLEDGE BASE (v3.0)
// Universal STEM Encyclopedia, Olympiad Syllabi, Science Quizzes & Facts
// Pure Client-Side / Local Execution — Zero External API Required
// =============================================================================

export interface MassiveScienceConcept {
  keys: string[]
  bn: string
  banglish: string
  en: string
  topic: string
}

export interface ScienceQuizItem {
  questionBn: string
  questionBanglish: string
  questionEn: string
  optionsBn: string[]
  optionsBanglish: string[]
  optionsEn: string[]
  correctIndex: number
  explanationBn: string
  explanationBanglish: string
  explanationEn: string
}

export interface ScienceFactItem {
  bn: string
  banglish: string
  en: string
  category: string
}

// -----------------------------------------------------------------------------
// 1. MASSIVE SCIENCE CONCEPTS (50+ DETAILED TOPICS)
// -----------------------------------------------------------------------------
export const EXPANDED_SCIENCE_CONCEPTS: MassiveScienceConcept[] = [
  // --- ASTRONOMY & COSMOLOGY ---
  {
    keys: ['james webb', 'jwst', 'ওয়েব টেলিস্কোপ', 'webb telescope', 'habol', 'hubbles'],
    topic: 'astronomy',
    bn: `🔭 **জেমস ওয়েব স্পেস টেলিস্কোপ (JWST):**

জেমস ওয়েব স্পেস টেলিস্কোপ হলো মানব ইতিহাসের সবচেয়ে শক্তিশালী ইনফ্রারেড (Infrared) মহাকাশ দূরবীক্ষণ যন্ত্র।
• **অবস্থান:** পৃথিবী থেকে প্রায় ১৫ লাখ কিলোমিটার দূরে "দ্বিতীয় ল্যাগ্রাঞ্জ বিন্দু" (L2)-তে প্রদক্ষিণ করছে।
• **স্বর্ণালী দর্পণ:** এর মূল আয়নাটি ৬.৫ মিটার চওড়া এবং মোট ১৮টি ষড়ভুজাকার বেরিলিয়াম খণ্ড দিয়ে তৈরি, যার উপর নিখুঁত খাঁটি সোনার প্রলেপ দেওয়া হয়েছে।
• **ক্ষমতা:** এটি প্রায় ১৩৫০ কোটি বছর আগের আদিমতম গ্যালাক্সি এবং প্রথম নক্ষত্রগুলোর আলো শনাক্ত করতে পারে!`,
    banglish: `🔭 **James Webb Space Telescope (JWST):**

JWST হলো মানুষের তৈরি সবচেয়ে ক্ষমতাধর স্পেস টেলিস্কোপ!
• এটি পৃথিবী থেকে ১৫ লাখ কিমি দূরে **L2 (Lagrange Point 2)** পয়েন্টে অবস্থান করছে।
• এর ৬.৫ মিটার চওড়া গোল্ডেন মিরর ইনফ্রারেড আলো ক্যাপচার করতে পারে।
• এটি মহাবিশ্বের শুরুর দিকের (১৩.৫ বিলিয়ন বছর আগের) প্রথম গ্যালাক্সিগুলোর ছবি তুলে পাঠাতে সক্ষম!`,
    en: `🔭 **James Webb Space Telescope (JWST):**

The JWST is the premier observatory in space sciences, orbiting the Sun at the Second Lagrange Point (L2), 1.5 million kilometers from Earth.
• **Primary Mirror:** A 6.5-meter gold-coated beryllium reflector.
• **Infrared Vision:** Operates primarily in the infrared spectrum to peer through dense cosmic dust clouds.
• **Mission:** Capturing the formation of the earliest stars and galaxies born over 13.5 billion years ago.`
  },
  {
    keys: ['big bang', 'বিগ ব্যাং', 'মহাবিশ্বের সৃষ্টি', 'origin of universe', 'expanding universe'],
    topic: 'cosmology',
    bn: `🌌 **বিগ ব্যাং তত্ত্ব (The Big Bang Theory):**

বিগ ব্যাং হলো আধুনিক জ্যোতির্বিজ্ঞানের সর্বজনবিদিত মডেল যা মহাবিশ্বের উৎপত্তি ব্যাখ্যা করে।
• **সময়কাল:** আজ থেকে প্রায় **১৩৮০ কোটি বছর** (13.8 Billion Years) পূর্বে সমগ্র স্থান, কাল, শক্তি ও পদার্থ এক পরম ঘন ও উত্তপ্ত বিন্দু ("Singularity") থেকে স্ফীত হতে শুরু করে।
• **প্রমাণ:**
1. **এডউইন হাবলের পর্যবেক্ষণ:** গ্যালাক্সিগুলো পরস্পরের থেকে দূরে সরে যাচ্ছে।
2. **CMB (Cosmic Microwave Background):** বিগ ব্যাং-এর আদিম তাপীয় বিকিরণ যা আজও সারা মহাবিশ্বে তরঙ্গ আকারে ছড়িয়ে আছে।
3. **হালকা মৌলের অনুপাত:** মহাবিশ্বে প্রায় ৭৫% হাইড্রোজেন ও ২৫% হিলিয়াম গ্যাসের উপস্থিতি।`,
    banglish: `🌌 **Big Bang তত্ত্ব সহজ ভাষায়:**

বিগ ব্যাং হলো এমন একটি বৈজ্ঞানিক তত্ত্ব যা ব্যাখ্যা করে কীভাবে ১৩.৮ বিলিয়ন বছর আগে এক মহাবিস্ফোরণ নয়, বরং এক অবিশ্বাস্য মহাশূন্যের প্রসারণ (Expansion) থেকে মহাবিশ্বের জন্ম হয়েছিল।
• সব গ্যালাক্সি একে অপরের থেকে দূরে সরে যাচ্ছে।
• মহাবিশ্ব আজও দিন দিন প্রসারিত হচ্ছে!`,
    en: `🌌 **The Big Bang Theory:**

The Big Bang is the prevailing cosmological model for the observable universe from the earliest known periods through its subsequent large-scale evolution.
• **Timeline:** Emerged roughly **13.8 billion years ago** from an infinitely dense singularity.
• **Key Pillars:** Hubble's Law (expanding universe), the Cosmic Microwave Background (CMB) radiation, and primordial nucleosynthesis ratios.`
  },
  {
    keys: ['dark matter', 'dark energy', 'ডার্ক ম্যাটার', 'ডার্ক এনার্জি', 'অদৃশ্য বস্তু'],
    topic: 'cosmology',
    bn: `🌑 **ডার্ক ম্যাটার ও ডার্ক এনার্জি (Dark Matter & Dark Energy):**

আমরা মহাবিশ্বে যা কিছু দেখতে পাই—সব নক্ষত্র, গ্রহ, ধূলিকণা—তা সমগ্র মহাবিশ্বের মোট ভরের মাত্র **৫%**!
• **ডার্ক ম্যাটার (প্রায় ২৭%):** এটি কোনো আলো শোষণ বা প্রতিফলন করে না। কিন্তু এর প্রচণ্ড মহাকর্ষ বলের কারণেই গ্যালাক্সিগুলো একত্রে আবদ্ধ থাকে এবং বিচ্ছিন্ন হয়ে উড়ে যায় না।
• **ডার্ক এনার্জি (প্রায় ৬৮%):** এটি এক রহস্যময় শক্তি যা মহাবিশ্বের প্রসারণের গতিকে দিন দিন ত্বরান্বিত করছে!`,
    banglish: `🌑 **Dark Matter ও Dark Energy কী?**

মহাবিশ্বের ৯৫ ভাগ জিনিসই কিন্তু আমাদের চোখের অদৃশ্য!
• **Dark Matter (~27%):** এমন অদৃশ্য পদার্থ যার ভর আছে এবং গ্র্যাভিটি টানে গ্যালাক্সিকে একসাথে ধরে রাখে।
• **Dark Energy (~68%):** এক অদ্ভুত শক্তি যা পুরো মহাবিশ্বকে প্রচণ্ড গতিতে ফুলিয়ে বড় করছে!
• সাধারণ পদার্থ (যা দিয়ে আমরা তৈরি): মাত্র ৫%!`,
    en: `🌑 **Dark Matter & Dark Energy:**

Normal baryonic matter (atoms, stars, planets) constitutes only ~5% of the cosmos.
• **Dark Matter (~27%):** Non-luminous matter that does not interact with the electromagnetic spectrum, detected only via its gravitational pull binding galaxies together.
• **Dark Energy (~68%):** A hypothetical vacuum energy density responsible for accelerating the cosmic expansion.`
  },
  {
    keys: ['solar eclipse', 'lunar eclipse', 'সূর্যগ্রহণ', 'চন্দ্রগ্রহণ', 'grohon', 'grahan'],
    topic: 'astronomy',
    bn: `🌘 **সূর্যগ্রহণ ও চন্দ্রগ্রহণ (Solar & Lunar Eclipses):**

গ্রহণ হলো তিনটি মহাজাগতিক বস্তুর নিখুঁত সরলরৈখিক সারিবদ্ধতার (Syzygy) ফলাফল।
• **সূর্যগ্রহণ (Solar Eclipse):** চাঁদ যখন পৃথিবী ও সূর্যের ঠিক মাঝখানে চলে আসে এবং পৃথিবীর ওপর ছায়া ফেলে। তখন দিনের বেলা সূর্য সাময়িকভাবে ঢাকা পড়ে যায়। (অமாவস্যার সময় ঘটে)।
• **চন্দ্রগ্রহণ (Lunar Eclipse):** পৃথিবী যখন সূর্য ও চাঁদের মাঝখানে আসে এবং পৃথিবীর ছায়া চাঁদের ওপর পড়ে। (পূর্ণিমার সময় ঘটে)।
• **UYFSR National Science Eclipse:** এই মহাজাগতিক বিস্ময়কে কেন্দ্র করেই আমাদের ফ্ল্যাগশিপ মেগা কার্নিভালের নামকরণ করা হয়েছে!`,
    banglish: `🌘 **সূর্যগ্রহণ ও চন্দ্রগ্রহণ কীভাবে ঘটে?**

• **সূর্যগ্রহণ:** চাঁদ যখন সূর্য আর পৃথিবীর মাঝখানে ঢুকে সূর্যের আলোকে ঢেকে দেয়।
• **চন্দ্রগ্রহণ:** পৃথিবী যখন সূর্য আর চাঁদের মাঝে চলে আসে এবং পৃথিবীর ছায়া চাঁদের গায়ে পড়ে।
• UYFSR-এর মেগা ইভেন্ট **"National Science Eclipse 2026"**-এর নাম এই মহাজাগতিক ঘটনা থেকেই অনুপ্রাণিত!`,
    en: `🌘 **The Science of Solar & Lunar Eclipses:**

Eclipses occur when three celestial bodies align in straight configuration (syzygy).
• **Solar Eclipse:** The Moon passes directly between Earth and the Sun, casting its shadow (umbra and penumbra) across Earth.
• **Lunar Eclipse:** Earth passes between the Sun and Moon, casting its terrestrial shadow onto the lunar surface.
• This cosmic marvel inspired our flagship national carnival: **National Science Eclipse 2026**!`
  },
  {
    keys: ['mars', 'মঙ্গল গ্রহ', 'red planet', 'mongol groho', 'elon musk mars'],
    topic: 'astronomy',
    bn: `🔴 **মঙ্গল গ্রহ (Mars - লাল গ্রহ):**

সৌরজগতের চতুর্থ গ্রহ মঙ্গল। এর পৃষ্ঠে প্রচুর আয়রন অক্সাইড (মরিচা) থাকার কারণে একে রক্তিম লাল দেখায়।
• **দিন-রাত্রি:** মঙ্গলের একদিন (Sol) ২৪ ঘণ্টা ৩৭ মিনিট—যা পৃথিবীর প্রায় সমান!
• **অলিম্পাস মনস:** সৌরজগতের সবচেয়ে উঁচু আগ্নেয়গিরি "Olympus Mons" মঙ্গলে অবস্থিত, যা মাউন্ট এভারেস্টের চেয়ে প্রায় তিনগুণ উঁচু (২১ কিমি)।
• **জল ও প্রাণের সন্ধান:** নাসা ও বিজ্ঞানীদের ধারণা মঙ্গলে অতীতে তরল পানি প্রবাহিত হতো এবং মাটির নিচে এখনও বরফের আধার রয়েছে।`,
    banglish: `🔴 **মঙ্গল গ্রহ (Mars) সম্পর্কে জানুন:**

মঙ্গল হলো সৌরজগতের চতুর্থ গ্রহ। মাটিতে প্রচুর আয়রন অক্সাইড (লোহার মরিচা) থাকায় একে লাল দেখায়।
• একদিনের দৈর্ঘ্য ২৪ ঘণ্টা ৩৭ মিনিট।
• এখানে রয়েছে সৌরজগতের সবচেয়ে বড় আগ্নেয়গিরি **Olympus Mons** (উচ্চতা ২১ কিমি!)।
• ভবিষ্যৎ মানব সভ্যতার দ্বিতীয় আবাস হিসেবে মঙ্গলে মানব অভিযানের জোর প্রস্তুতি চলছে।`,
    en: `🔴 **Mars — The Red Planet:**

The fourth planet from the Sun, named the Red Planet due to ubiquitous iron oxide on its terrain.
• **Rotational Period:** One Martian day (sol) is 24 hours and 37 minutes.
• **Olympus Mons:** The largest volcano in the solar system, soaring 21.9 km above mean surface level.
• **Exploration:** Ongoing rovers (Perseverance, Curiosity) search for biosignatures in ancient lakebeds.`
  },
  {
    keys: ['neutron star', 'pulsar', 'নিউট্রন তারা', 'পালসার', 'supernova'],
    topic: 'astronomy',
    bn: `💫 **নিউট্রন নক্ষত্র ও পালসার (Neutron Stars & Pulsars):**

কোনো বিশাল নক্ষত্র যখন সুপারনোভা বিস্ফোরণে ধ্বংস হয়, তখন তার অবশিষ্ট কেন্দ্র প্রচণ্ড চাপে সংকুচিত হয়ে নিউট্রন নক্ষত্রে রূপ নেয়।
• **চরম ঘনত্ব:** একটি নিউট্রন নক্ষত্র মাত্র ২০ কিমি চওড়া হলেও এর ভর সূর্যের চেয়ে প্রায় দেড়গুণ বেশি! এর এক চামচ পদার্থের ওজন পৃথিবীতে প্রায় ১০০ কোটি টন!
• **পালসার:** যেসব নিউট্রন তারা প্রচণ্ড গতিতে ঘোরে এবং দুই মেরু থেকে নির্দিষ্ট বিরতিতে আলোক রশ্মি পাঠায়, তাদের পালসার বলা হয়।`,
    banglish: `💫 **Neutron Star কী?**

মহাবিশ্বের সবচেয়ে অদ্ভুত ও চরম ঘনত্বের নক্ষত্র হলো নিউট্রন স্টার!
• একটি মাত্র চিনির দানার সমপরিমাণ নিউট্রন নক্ষত্রের পদার্থের ওজন পৃথিবীতে প্রায় ১০০ কোটি টন!
• এগুলো সেকেন্ডে শত শত বার নিজের অক্ষে লাটিমের মতো ঘোরে এবং পালসার তৈরি করে।`,
    en: `💫 **Neutron Stars & Pulsars:**

Super-dense stellar remnants resulting from the gravitational collapse of massive stars during a supernova explosion.
• **Density:** A city-sized sphere (~20 km diameter) packed with 1.4 solar masses. A single teaspoon weighs a billion tons!
• **Pulsars:** Magnetized, highly rotating neutron stars emitting beams of electromagnetic radiation from their magnetic poles.`
  },

  // --- PHYSICS & QUANTUM REALMS ---
  {
    keys: ['quantum', 'quantum mechanics', 'কোয়ান্টাম', 'কোয়ান্টাম', 'qubit', 'superposition'],
    topic: 'physics',
    bn: `⚛️ **কোয়ান্টাম মেকানিক্স (Quantum Mechanics):**

পরমাণু এবং উপ-পরমাণু কণার (ইলেকট্রন, ফোটন) অদ্ভুত আচরণ ব্যাখ্যার পদার্থবিজ্ঞান হলো কোয়ান্টাম বলবিদ্যা।
• **সুপারপজিশন (Superposition):** কোনো কণা পর্যবেক্ষণ না করা পর্যন্ত একই সাথে একাধিক অবস্থায় অবস্থান করতে পারে!
• **কোয়ান্টাম এনট্যাঙ্গলমেন্ট:** দুটি কণা মহাবিশ্বের কোটি আলোকবর্ষ দূরে থাকলেও একটির অবস্থা পাল্টালে অপরটির অবস্থা তাৎক্ষণিকভাবে পরিবর্তিত হয়—আইনস্টাইন একে বলেছিলেন "Spooky action at a distance"!
• **কোয়ান্টাম কম্পিউটার:** সাধারণ কম্পিউটার বিট (0 বা 1) দিয়ে কাজ করে, আর কোয়ান্টাম কম্পিউটার **Qubit** ব্যবহার করে যা একই সাথে 0 ও 1 হতে পারে, ফলে এটি অতি জটিল গণনা কয়েক সেকেন্ডে সম্পন্ন করতে পারে!`,
    banglish: `⚛️ **Quantum Physics সহজ বাংলায়:**

মাইক্রোস্কোপিক পরমাণুর স্তরে পৃথিবীর নিয়ম কানুন সম্পূর্ণ বদলে যায়!
• **Superposition:** একটি ইলেকট্রন একই সাথে দুই জায়গায় থাকতে পারে যতক্ষণ না কেউ দেখছে!
• **Quantum Entanglement:** কোটি মাইল দূরে থাকা দুটি কণা একে অপরের সাথে টেলিফোনের মতো তাত্ক্ষণিক যুক্ত থাকে।
• এই নিয়মে তৈরি হচ্ছে ভবিষ্যতের সুপার ফাস্ট **Quantum Computer**!`,
    en: `⚛️ **Quantum Mechanics & Quantum Computing:**

The fundamental physical theory describing matter and light on atomic and subatomic scales.
• **Superposition:** Quantum states exist as linear combinations of basis states until measured.
• **Entanglement:** Two or more particles become correlated such that the quantum state of each particle cannot be described independently.
• **Quantum Computing:** Leverages qubits (which can represent 0, 1, or both concurrently) to perform exponential parallel calculations.`
  },
  {
    keys: ['schrodinger', 'schrodingers cat', 'শ্রোডিঙ্গার', 'বিড়াল'],
    topic: 'physics',
    bn: `🐱 **শ্রোডিঙ্গারের বিড়াল (Schrödinger's Cat Paradox):**

এরউইন শ্রোডিঙ্গার ১৯৩৫ সালে কোয়ান্টাম সুপারপজিশনের অসঙ্গতি বোঝাতে এই বিখ্যাত কাল্পনিক চিন্তা-পরীক্ষা (Thought Experiment) উপস্থাপন করেন।
• একটি বাক্সের ভেতর একটি বিড়াল, বিষের শিশি এবং সামান্য তেজস্ক্রিয় পরমাণু রাখা হয়। পরমাণু ক্ষয় হলে বিষ নির্গত হবে এবং বিড়াল মারা যাবে; ক্ষয় না হলে বেঁচে থাকবে।
• কোয়ান্টাম নিয়ম অনুযায়ী, যতক্ষণ না বাক্সটি খুলে পর্যবেক্ষণ করা হচ্ছে, ততক্ষণ পরমাণুটি ক্ষয়িত ও অক্ষয়িত উভয় অবস্থায় থাকে—যার অর্থ বিড়ালটি **একই সাথে জীবিত ও মৃত**!
• এটি মূলত দেখায় যে কোয়ান্টাম স্তরের সম্ভাব্যতা আমাদের দৈনন্দিন জীবনে কতটা অভাবনীয়!`,
    banglish: `🐱 **Schrodinger's Cat প্যারাডক্স কী?**

এটি একটি বিখ্যাত কাল্পনিক এক্সপেরিমেন্ট!
• একটি সিল করা বাক্সে বিড়াল রাখা আছে। যতক্ষণ না বাক্সটি খুলে দেখা হচ্ছে, কোয়ান্টাম মেকানিক্সের সূত্রমতে বিড়ালটি একই সাথে **জীবিত ও মৃত** উভয় দশাতেই বিদ্যমান!
• বক্স খুললেই কেবল একটি বাস্তবতায় স্থির হয়।`,
    en: `🐱 **Schrödinger's Cat Paradox:**

A famous thought experiment devised by Austrian physicist Erwin Schrödinger in 1935.
• Illustrates the apparent paradox of quantum superposition: an unobserved cat in an enclosed box alongside a radioactive trigger mechanism is simultaneously alive and dead until the box is opened and wave-function collapse occurs.`
  },
  {
    keys: ['relativity', 'theory of relativity', 'আপেক্ষিকতা', 'e=mc2', 'emc2', 'alor goti', 'time dilation'],
    topic: 'physics',
    bn: `⏳ **আইনস্টাইনের আপেক্ষিকতা তত্ত্ব ও $E=mc^2$:**

অ্যালবার্ট আইনস্টাইন ১৯০৫ ও ১৯১৫ সালে স্থান, কাল ও মহাকর্ষের ধারণাকে চিরতরে বদলে দেন।
• **বিশেষ আপেক্ষিকতা (Special Relativity):**
1. আলোর গতি ($c \approx 3 \times 10^8$ m/s) মহাবিশ্বের পরম সীমা, কোনো তথ্য বা বস্তু এর চেয়ে দ্রুত চলতে পারে না।
2. **Time Dilation (সময় প্রসারণ):** আপনি আলোর গতির কাছাকাছি যত দ্রুত ভ্রমণ করবেন, আপনার জন্য সময় তত ধীরে চলবে!
• **ভর-শক্তি সমীকরণ ($E = mc^2$):** ভর এবং শক্তি মূলত একই জিনিসের দুটি রূপ। সামান্য একটু ভর ধ্বংস করে বিপুল শক্তি উৎপাদন করা সম্ভব (যেমন পারমাণবিক বিদ্যুৎ ও নক্ষত্রের শক্তি)।`,
    banglish: `⏳ **Theory of Relativity & Time Dilation:**

আইনস্টাইনের যুগান্তকারী তত্ত্ব অনুযায়ী:
• আলোর গতি ($300,000$ কিমি/সেকেন্ড) মহাবিশ্বের সর্বোচ্চ স্পিড লিমিট।
• **টাইম ডাইলেশন:** কেউ যদি আলোর কাছাকাছি স্পিডে রকেটে ঘুরে আসে, তার জন্য কয়েক বছর কাটলেও পৃথিবীতে কয়েক যুগ পার হয়ে যাবে!
• **$E=mc^2$:** অল্প একটু ভর শক্তিতে রূপান্তর করলে বিশাল পারমাণবিক শক্তি তৈরি হয়।`,
    en: `⏳ **Einstein's Theory of Relativity & $E=mc^2$:**

Revolutionized modern physics by unifying space, time, and gravity.
• **Special Relativity (1905):** The speed of light ($c = 299,792,458\\text{ m/s}$) is invariant for all observers. Faster motion through space results in slower passage of time (**Time Dilation**).
• **Mass-Energy Equivalence ($E = mc^2$):** Mass can be converted into immense energy, powering stars and nuclear reactors.`
  },
  {
    keys: ['newton', 'newtons law', 'গতির সূত্র', 'মহাকর্ষ সূত্র', 'আইজ্যাক নিউটন'],
    topic: 'physics',
    bn: `🍎 **স্যার আইজ্যাক নিউটনের ৩টি গতির সূত্র:**

১৬৮৭ সালে প্রকাশিত 'ফিলোসফিয়া ন্যাচারালিস প্রিন্সিপিয়া ম্যাথামেটিকা'-তে নিউটন ক্লাসিক্যাল মেকানিক্সের ভিত্তি স্থাপন করেন:
1. **১ম সূত্র (জড়তা):** বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলপথে চলতে থাকবে।
2. **২য় সূত্র ($F = ma$):** বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক।
3. **৩য় সূত্র:** প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে। (যেমন রকেটের জেট গ্যাস নিচে বের হলে রকেট উপরে ওঠে!)`,
    banglish: `🍎 **নিউটনের ৩টি গতির সূত্র সহজ বাংলায়:**

১. বল প্রয়োগ না করলে থেমে থাকা জিনিস থেমে থাকবে, আর চলতে থাকা জিনিস চিরকাল সরলরেখায় চলবে (জড়তা)।
২. বল = ভর × ত্বরণ ($F = ma$)।
৩. প্রত্যেক ক্রিয়ার একটি সমান ও বিপরীত প্রতিক্রিয়া রয়েছে (যেমন বন্দুক ছুড়লে পেছনে ধাক্কা দেয়)।`,
    en: `🍎 **Sir Isaac Newton's Three Laws of Motion:**

Published in 1687, foundational to classical mechanics:
1. **First Law (Inertia):** An object at rest stays at rest, and an object in uniform motion stays in motion unless acted upon by an external net force.
2. **Second Law ($F = ma$):** Acceleration is directly proportional to net force and inversely proportional to mass.
3. **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction.`
  },
  {
    keys: ['speed of light', 'আলোর গতি', 'alor goti koto'],
    topic: 'physics',
    bn: `⚡ **আলোর গতিবেগ (Speed of Light):**

শূন্য মাধ্যমে আলোর গতিবেগ হলো ঠিক **২৯৯,৭৯২,৪৫৮ মিটার প্রতি সেকেন্ড** (প্রায় ৩ লাখ কিলোমিটার/সেকেন্ড)।
• সূর্য থেকে আলো পৃথিবীতে পৌঁছাতে সময় নেয় প্রায় **৮ মিনিট ২০ সেকেন্ড**!
• আলোর এই গতি মহাবিশ্বের যেকোনো তথ্য আদান-প্রদানের সর্বোচ্চ তাত্ত্বিক সীমা।`,
    banglish: `⚡ **আলোর গতিবেগ কত?**

শূন্যস্থানে আলোর গতি প্রায় **৩,০০,০০০ কিলোমিটার প্রতি সেকেন্ড**!
• এক সেকেন্ডে আলো পৃথিবীর চারদিকে সাড়ে সাত বার ঘুরে আসতে পারে!
• সূর্য থেকে পৃথিবীতে আলো আসতে সময় লাগে ৮ মিনিট ২০ সেকেন্ড।`,
    en: `⚡ **The Speed of Light ($c$):**

In vacuum, light travels at exactly **299,792,458 meters per second** (~300,000 km/s).
• It takes roughly **8 minutes and 20 seconds** for sunlight to reach Earth across 150 million kilometers.
• In Einstein's relativity, $c$ is the universal speed limit for causality.`
  },

  // --- CHEMISTRY & MATERIALS ---
  {
    keys: ['periodic table', 'পর্যায় সারণি', 'element', 'মৌল', 'mendeleev'],
    topic: 'chemistry',
    bn: `📊 **পর্যায় সারণি (The Periodic Table):**

১৮৬৯ সালে রুশ রসায়নবিদ দিমিত্রি মেন্ডেলিভ পর্যায় সারণির কাঠামো তৈরি করেন।
• **মৌলের সংখ্যা:** বর্তমানে পর্যায় সারণিতে মোট **১১৮টি** মৌলিক উপাদান রয়েছে।
• **বিন্যাস:** মৌলগুলোকে তাদের পারমাণবিক সংখ্যার (প্রোটন সংখ্যা) ভিত্তিতে ৭টি পর্যায় (Periods) এবং ১৮টি গ্রুপে (Groups) সাজানো হয়েছে।
• এর মাধ্যমে মৌলগুলোর যোজ্যতা, ইলেকট্রন বিন্যাস এবং রাসায়নিক বিক্রিয়ার প্রবণতা নিখুঁতভাবে পূর্বাভাস করা যায়।`,
    banglish: `📊 **পর্যায় সারণি (Periodic Table):**

মেন্ডেলিভের তৈরি করা পর্যায় সারণিতে বর্তমানে মোট **১১৮টি মৌল** রয়েছে।
• হাইড্রোজেন (১) থেকে ওগানেসন (১১৮) পর্যন্ত পারমাণবিক সংখ্যা অনুযায়ী এগুলো সাজানো।
• রসায়ন বিজ্ঞানের যে কোনো অলিম্পিয়াড ও ল্যাব টেস্টের জন্য পর্যায় সারণি বোঝা সবচেয়ে জরুরি!`,
    en: `📊 **The Periodic Table of Elements:**

Pioneered by Dmitri Mendeleev in 1869, arranging all 118 confirmed chemical elements by atomic number ($Z$), electron configuration, and recurring chemical properties across 7 periods and 18 groups.`
  },
  {
    keys: ['nanotechnology', 'graphene', 'গ্রাফিন', 'ন্যানোটেকনোলজি', 'nano'],
    topic: 'chemistry',
    bn: `🧪 **ন্যানোটেকনোলজি ও গ্রাফিন (Graphene):**

১ ন্যানোমিটার হলো ১ মিটারের ১০০ কোটি ভাগের এক ভাগ ($10^{-9}$ m)! এই অতি ক্ষুদ্র স্কেলে পদার্থের পরমাণু নিয়ন্ত্রণ করাই ন্যানোটেকনোলজি।
• **গ্রাফিন:** কার্বনের মাত্র এক পরমাণু পুরু দ্বি-মাত্রিক (2D) জালিকা।
• **ক্ষমতা:** এটি ইস্পাতের চেয়ে **২০০ গুণ বেশি শক্তিশালী**, কিন্তু ওজনে অতি হালকা, স্বচ্ছ এবং তামার চেয়েও চমৎকার বিদ্যুৎ ও তাপ পরিবাহী! এর আবিষ্কারের জন্য ২০১০ সালে নোবেল পুরস্কার দেওয়া হয়।`,
    banglish: `🧪 **Graphene ও Nanotechnology কী?**

• **গ্রাফিন** হলো কার্বনের তৈরি মাত্র ১ পরমাণু পাতলা এক জাদুকরী শিট!
• এটি সাধারণ স্টিল বা ইস্পাতের চেয়ে **২০০ গুণ মজবুত**, কিন্তু কাগজের চেয়েও পাতলা আর স্বচ্ছ!
• ফাস্ট ব্যাটারি, ফ্লেক্সিবল স্ক্রিন এবং ভবিষ্যতের স্পেস এলিভেটর তৈরিতে গ্রাফিনের ব্যবহার নিয়ে বিশ্বজুড়ে গবেষণা চলছে।`,
    en: `🧪 **Nanotechnology & Graphene:**

Nanotechnology manipulates matter at molecular dimensions (1 to 100 nanometers).
• **Graphene:** A single-atom-thick planar sheet of carbon atoms packed in a honeycomb lattice. It is 200 times stronger than steel, exceptionally lightweight, transparent, and an extraordinary electrical and thermal conductor.`
  },
  {
    keys: ['acid', 'base', 'ph', 'এসিড', 'ক্ষার', 'ph scale'],
    topic: 'chemistry',
    bn: `⚗️ **অ্যাসিড, ক্ষার ও pH স্কেল:**

• **অ্যাসিড:** জলীয় দ্রবণে হাইড্রোজেন আয়ন ($H^+$) দান করে। স্বাদ টক, নীল লিটমাসকে লাল করে (যেমন: লেবুর সাইট্রিক অ্যাসিড, ভিনেগারের অ্যাসিটিক অ্যাসিড)।
• **ক্ষার (Base):** জলীয় দ্রবণে হাইড্রোক্সাইড আয়ন ($OH^-$) দেয়। স্বাদ কটু বা তিক্ত, লাল লিটমাসকে নীল করে (যেমন: সাবান, সোডিয়াম হাইড্রোক্সাইড)।
• **pH স্কেল (০-১৪):**
  - pH < ৭: অ্যাসিডিক
  - pH = ৭: নিরপেক্ষ (বিশুদ্ধ পানি)
  - pH > ৭: ক্ষারীয়
  - মানুষের রক্তের স্বাভাবিক pH প্রায় ৭.৩৫ থেকে ৭.৪৫।`,
    banglish: `⚗️ **Acid, Base এবং pH স্কেল:**

• **Acid:** $H^+$ আয়ন ছাড়ে, নীল লিটমাস লাল করে (লেবু, ভিনেগার)।
• **Base বা ক্ষার:** $OH^-$ আয়ন ছাড়ে, লাল লিটমাস নীল করে (সাবান)।
• **pH স্কেল:** ৭ হলো নিউট্রাল বা নিরপেক্ষ পানি। ৭-এর নিচে অ্যাসিড, আর ৭-এর উপরে ক্ষার।`,
    en: `⚗️ **Acids, Bases & the pH Scale:**

• **Acids:** Proton ($H^+$) donors; turn blue litmus red ($pH < 7$).
• **Bases:** Hydroxide ($OH^-$) donors or proton acceptors; turn red litmus blue ($pH > 7$).
• **pH Scale:** Logarithmic scale measuring hydrogen ion activity from 0 (ultra-acidic) to 14 (ultra-basic), with 7 being neutral pure water.`
  },

  // --- BIOLOGY & GENETICS ---
  {
    keys: ['crispr', 'gene editing', 'জিন এডিটিং', 'ক্রিস্পার', 'genetic engineering'],
    topic: 'biology',
    bn: `🧬 **ক্রিস্পার ও জিন এডিটিং (CRISPR-Cas9):**

CRISPR হলো আধুনিক জীববিজ্ঞানের এক বিপ্লবী প্রযুক্তি যার মাধ্যমে ডিএনএ-এর নির্দিষ্ট অংশ আণবিক কাঁচির মতো নিখুঁতভাবে কাটা ও প্রতিস্থাপন করা যায়।
• **কাজ করার পদ্ধতি:** Cas9 নামের একটি এনজাইমকে গাইড আরএনএ (gRNA) দিয়ে নির্দিষ্ট ত্রুটিযুক্ত জিনের ঠিকানায় পাঠানো হয়, যেখানে এটি ডিএনএ কেটে রোগ প্রতিরোধক নতুন কোড বসিয়ে দিতে পারে!
• **প্রয়োগ:** বংশগত রোগ নিরাময়, ক্যানসার গবেষণা এবং খরা-সহনশীল ফসলের জাত উদ্ভাবনে এটি যুগান্তকারী পরিবর্তন এনেছে। ২০২০ সালে এ আবিষ্কারের জন্য নোবেল পুরস্কার প্রদান করা হয়।`,
    banglish: `🧬 **CRISPR জিন এডিটিং কী?**

CRISPR হলো জীববিজ্ঞানের এক অলৌকিক "আণবিক কাঁচি" (Molecular Scissors)!
• এটি দিয়ে যে কোনো প্রাণীর ক্ষতিকর বা রোগবাহী DNA কোড কেটে বাদ দিয়ে সুস্থ DNA জোড়া লাগানো যায়।
• বংশগত অন্ধত্ব, থ্যালাসেমিয়া কিংবা ক্যানসার নিরাময়ে বিশ্বজুড়ে এটি আলোড়ন তুলেছে।`,
    en: `🧬 **CRISPR-Cas9 Gene Editing:**

A groundbreaking biotechnology tool that allows molecular biologists to edit genetic sequences with unprecedented precision.
• **Mechanism:** Uses a guide RNA (gRNA) to target specific genomic sequences, where the Cas9 endonuclease introduces double-strand breaks, enabling gene deletion or insertion.
• Awarded the 2020 Nobel Prize in Chemistry.`
  },
  {
    keys: ['human brain', 'neuron', 'মস্তিষ্ক', 'নিউরণ', 'brain memory'],
    topic: 'biology',
    bn: `🧠 **মানব মস্তিষ্ক ও নিউরন (Human Brain & Neurons):**

মানব মস্তিষ্ক হলো জীবজগতের সবচেয়ে জটিল জৈব কম্পিউটার!
• **৮৬০০ কোটি নিউরন:** আমাদের মস্তিষ্কে প্রায় **৮৬ বিলিয়ন** নিউরন বা স্নায়ুকোষ রয়েছে, যা বৈদ্যুতিক ও রাসায়নিক সংকেতের মাধ্যমে প্রতি সেকেন্ডে হাজার হাজার বার্তা আদান-প্রদান করে।
• **সিন্যাপ্স:** প্রতিটি নিউরন অন্যান্য নিউরনের সাথে হাজার হাজার সংযোগ বা "Synapse" তৈরি করে, যা আমাদের স্মৃতি, আবেগ ও চিন্তাশক্তি সঞ্চয় করে।
• মস্তিষ্ক দেহের মোট ওজনের মাত্র ২% হলেও শরীরের মোট অক্সিজেনের **২০%** খরচ করে!`,
    banglish: `🧠 **মানব মস্তিষ্ক সম্পর্কে অবাক করা তথ্য:**

• আমাদের ব্রেনে প্রায় **৮৬ বিলিয়ন (৮৬০০ কোটি)** নিউরন রয়েছে!
• এগুলো জটিল সিন্যাপ্স নেটওয়ার্কের মাধ্যমে মানুষের মেমোরি ও চিন্তা নিয়ন্ত্রণ করে।
• মস্তিষ্ক দেহের মোট এনার্জি ও অক্সিজেনের প্রায় ২০% একাই ব্যবহার করে।`,
    en: `🧠 **The Human Brain & Neuronal Networks:**

The central organ of the nervous system and the most complex computing structure in the biological realm.
• Contains roughly **86 billion neurons**, communicating via trillions of synaptic connections using electrical action potentials and chemical neurotransmitters.
• Consumes 20% of resting metabolic energy despite representing only 2% of total body mass.`
  },
  {
    keys: ['vaccine', 'ভ্যাকসিন', 'টিকা', 'immunity', 'রোগ প্রতিরোধ'],
    topic: 'biology',
    bn: `💉 **ভ্যাকসিন বা টিকা কীভাবে কাজ করে?**

টিকা হলো মানবদেহের ইমিউন সিস্টেমকে (রোগ প্রতিরোধ ক্ষমতা) আগে থেকেই রোগ শনাক্ত ও নির্মূল করতে প্রশিক্ষণ দেওয়ার একটি নিরাপদ বৈজ্ঞানিক পদ্ধতি।
• **কৌশল:** ভ্যাকসিনে কোনো ক্ষতিকারক ভাইরাসের নিষ্ক্রিয় অংশ, দুর্বল রূপ অথবা mRNA কোড দেওয়া হয়।
• এটি মানবদেহের রক্তের শ্বেতকণিকাকে সেই প্যাথোজেনের অ্যান্টিবডি তৈরি করতে শেখায়। ফলে ভবিষ্যতে আসল জীবাণু আক্রমণ করলে শরীর তাৎক্ষণিকভাবে তা ধ্বংস করে দেয়!`,
    banglish: `💉 **টিকা (Vaccine) কীভাবে শরীরকে রক্ষা করে?**

ভ্যাকসিন হলো আমাদের ইমিউন সিস্টেমের জন্য একটি "মক ড্রিল" বা মিলিটারি ট্রেনিং!
• এটি শরীরে কোনো ক্ষতিকর জীবাণুর ডামি বা নিষ্ক্রিয় অংশ প্রবেশ করিয়ে অ্যান্টিবডি বানাতে শেখায়।
• পরবর্তীতে আসল ভাইরাস আক্রমণ করলে শরীর মুহূর্তের মধ্যেই তাকে চিনে ফেলে মেরে ফেলে!`,
    en: `💉 **How Vaccines & Immunity Work:**

Vaccines train the immune system to recognize and neutralize targeted pathogens without causing disease.
• Introduce harmless antigens, attenuated viruses, or mRNA blueprints.
• Memory B and T cells develop specific antibodies and immunological memory, ensuring rapid defense upon future exposure.`
  },

  // --- COMPUTER SCIENCE, AI & CODING ---
  {
    keys: ['python', 'পাইথন', 'learn coding', 'programming language', 'কোডিং শিখব'],
    topic: 'coding',
    bn: `💻 **প্রোগ্রামিং ও পাইথন (Python for Beginners):**

পাইথন হলো বিশ্বের সবচেয়ে জনপ্রিয় এবং শিক্ষার্থীবান্ধব প্রোগ্রামিং ভাষা।
• **কেন পাইথন শিখবেন?** এর সিনট্যাক্স সাধারণ ইংরেজির মতো সহজ এবং ডেটা সায়েন্স, কৃত্রিম বুদ্ধিমত্তা (AI), রোবোটিক্স ও সফটওয়্যার তৈরিতে এটি সর্বাধিক ব্যবহৃত হয়।
• **কোডিং শুরুর রোডম্যাপ:**
1. **ভিত্তি:** Variables, Data Types, If-Else কন্ডিশন।
2. **লজিক:** For/While Loops, Functions।
3. **ডেটা স্ট্রাকচার:** Lists, Tuples, Dictionaries।
4. **প্রজেক্ট:** ক্যালকুলেটর, অটোমেশন স্ক্রিপ্ট বা ছোট গেম তৈরি করুন!`,
    banglish: `💻 **কীভাবে কোডিং ও Python শুরু করবেন?**

প্রোগ্রামিং শেখার জন্য পাইথন হলো সেরা পছন্দ!
১. **Variables & Logic:** ইনপুট, আউটপুট ও if-else বোঝা।
২. **Loops & Functions:** পুনরাবৃত্তি এবং কোডকে ছোট ফাংশনে ভাগ করা।
৩. প্র্যাকটিস করুন **HackerRank** বা **LeetCode**-এ।
UYFSR-এর জুনিয়র টেকনোলজি কার্যক্রমে শিক্ষার্থীদের প্রজেক্ট ডেভেলপমেন্ট শেখানো হয়!`,
    en: `💻 **Programming with Python:**

Python is the preeminent open-source programming language for science, machine learning, and automation due to its clear, human-readable syntax.
• **Core Path:** Data types, conditionals, iteration loops, functional decomposition, object-oriented concepts, and algorithmic thinking.`
  },
  {
    keys: ['machine learning', 'deep learning', 'মেশিন লার্নিং', 'neural network', 'কৃত্রিম বুদ্ধিমত্তা'],
    topic: 'ai',
    bn: `🤖 **মেশিন লার্নিং ও নিউরাল নেটওয়ার্ক (Machine Learning):**

মেশিন লার্নিং হলো কম্পিউটারকে কোনো সরাসরি নিয়ম লিখে না দিয়ে বিপুল পরিমাণ ডেটা থেকে নিজে নিজে শেখার ও সিদ্ধান্ত নেওয়ার ক্ষমতা দেওয়া।
• **সুপারভাইজড লার্নিং:** লেবেলযুক্ত উদাহরণ দেখে শেখা (যেমন: লাখ লাখ বিড়ালের ছবি দেখে বিড়াল চেনা)।
• **ডিপ লার্নিং:** মানুষের মস্তিষ্কের নিউরনের আদলে বহুস্তর বিশিষ্ট গাণিতিক নেটওয়ার্ক (Artificial Neural Networks) তৈরি করে জটিল ভাষা ও ইমেজ প্রসেসিং সমাধান করা (যেমন: ChatGPT বা স্বচালিত গাড়ি)।`,
    banglish: `🤖 **Machine Learning (ML) কী?**

কম্পিউটারকে যখন হাতে ধরে কোড না লিখে ডেটা খাইয়ে অভিজ্ঞ করা হয়, সেটাই হলো মেশিন লার্নিং!
• কোটি কোটি ডেটা প্যাটার্ন বিশ্লেষণ করে কম্পিউটার নতুন জিনিসের ভবিষ্যদ্বাণী করতে পারে।
• ফেস আনলক, সেলফ-ড্রাইভিং কার থেকে শুরু করে রোগ শনাক্তকরণে ML আজ সর্বত্র ব্যবহৃত হচ্ছে।`,
    en: `🤖 **Machine Learning & Deep Learning:**

A branch of AI that enables systems to learn from data patterns without explicit rule-based programming.
• **Supervised Learning:** Training models on labeled datasets for classification and regression.
• **Deep Learning:** Artificial Neural Networks modeled on biological cortex layers, powering computer vision, speech recognition, and generative AI.`
  },

  // --- GREAT SCIENTIFIC PIONEERS ---
  {
    keys: ['jagadish chandra bose', 'jc bose', 'জগদীশ চন্দ্র বসু', 'জগদীশচন্দ্র', 'crescograph'],
    topic: 'pioneers',
    bn: `🌿 **স্যার জগদীশ চন্দ্র বসু (Sir J.C. Bose):**

বাঙালির গর্ব স্যার জগদীশ চন্দ্র বসু ছিলেন আধুনিক পদার্থবিজ্ঞান ও জীববিজ্ঞানের এক অনন্য পথিকৃৎ।
• **রেডিও তরঙ্গ ও মাইক্রোওয়েভ:** মার্কোনির আগেই ১৮৯৫ সালে কলকাতায় তিনি মিলিমিটার-তরঙ্গদৈর্ঘ্যের বেতার সংকেত বাতাসে প্রেরণ করে ঘণ্টা বাজিয়ে দেখান।
• **উদ্ভিদের প্রাণ ও ক্রেসকোগ্রাফ:** তিনি নিজে "Crescograph" নামের অতি সূক্ষ্ম যন্ত্র আবিষ্কার করে প্রমাণ করেন যে উদ্ভিদেরও উত্তেজনা ও ব্যথাবোধের অনুভূতি রয়েছে!
• তিনি কখনো তাঁর গবেষণার পেটেন্ট নিয়ে বাণিজ্যিক ফায়দা নেননি, মুক্ত জ্ঞানের পথ উন্মুক্ত রেখেছিলেন।`,
    banglish: `🌿 **স্যার জগদীশ চন্দ্র বসু সম্পর্কে জানুন:**

বাঙালির বিজ্ঞান চর্চার মহান শিক্ষক ও আন্তর্জাতিক বিজ্ঞানী!
• বেতার তরঙ্গ বা Radio তরঙ্গের অন্যতম আদি উদ্ভাবক।
• **Crescograph** আবিষ্কার করে তিনিই প্রথম বিশ্বকে দেখান যে গাছেরও প্রাণ আছে এবং তারা বাইরের উত্তেজনায় সাড়া দেয়!`,
    en: `🌿 **Sir Jagadish Chandra Bose (1858–1937):**

Polymath, physicist, biologist, and pioneer of radio science.
• Demonstrated wireless millimeter-wave transmission in 1895 in Kolkata before Marconi's patent.
• Invented the **Crescograph**, measuring plant response to external stimuli with microscopic precision, proving physiological responses in flora.`
  },
  {
    keys: ['satyendra nath bose', 'sn bose', 'সত্যেন্দ্রনাথ বসু', 'সত্যেন বোস', 'boson'],
    topic: 'pioneers',
    bn: `⚛️ **সত্যেন্দ্রনাথ বসু ও "বোসন" কণা (S.N. Bose):**

তাত্ত্বিক পদার্থবিজ্ঞানী সত্যেন্দ্রনাথ বসু ছিলেন ঢাকা বিশ্ববিদ্যালয়ের পদার্থবিজ্ঞান বিভাগের সম্মানিত অধ্যাপক।
• **বোস-আইনস্টাইন স্ট্যাটিস্টিকস:** ১৯২৪ সালে ঢাকা বিশ্ববিদ্যালয়ে বসে তিনি কোয়ান্টাম আলোক কণার গাণিতিক পরিসংখ্যান উদ্ভাবন করে আলবার্ট আইনস্টাইনকে চিঠি পাঠান। আইনস্টাইন তা জার্মান ভাষায় অনুবাদ করে প্রকাশ করেন।
• **বোসন (Boson):** মহাবিশ্বের অর্ধেক মৌলিক কণা (যেমন আলো বা ফোটন, হিগস বোসন)—সত্যেন বসুর নামানুসারে পল ডিরাক এদের নাম রেখেছেন "বোসন"!
• **BEC:** চরম শূন্য তাপমাত্রায় পদার্থের পঞ্চম অবস্থা "Bose-Einstein Condensate" তাঁর তত্ত্বের ওপরই প্রতিষ্ঠিত।`,
    banglish: `⚛️ **সত্যেন্দ্রনাথ বসু ও বোসন কণা:**

ঢাকা বিশ্ববিদ্যালয়ের খ্যাতনামা অধ্যাপক সত্যেন্দ্রনাথ বসু আলবার্ট আইনস্টাইনের সাথে মিলে কোয়ান্টাম পরিসংখ্যান তৈরি করেছিলেন।
• তাঁর নাম অনুসারেই মহাবিশ্বের আলোক কণার শ্রেণির নাম রাখা হয়েছে **"Boson"** (যেমন গড পার্টিকেল বা হিগস বোসন)!`,
    en: `⚛️ **Satyendra Nath Bose (1894–1974):**

Bengali theoretical physicist who formulated Bose-Einstein statistics and predicted the Bose-Einstein Condensate (BEC) while faculty at Dhaka University.
• The class of fundamental particles that obey these statistics—**Bosons** (including photons, gluons, and the Higgs boson)—was named in his honor by Paul Dirac.`
  },
  {
    keys: ['jamal nazrul islam', 'জামাল নজরুল ইসলাম', 'cosmologist chittagong'],
    topic: 'pioneers',
    bn: `🌌 **প্রফেসর জামাল নজরুল ইসলাম (Jamal Nazrul Islam):**

বিশ্বখ্যাত কসমোলজিস্ট ও তাত্ত্বিক গণিতবিদ প্রফেসর জামাল নজরুল ইসলাম ছিলেন ক্যামব্রিজ বিশ্ববিদ্যালয়ের স্টিফেন হকিং এবং পেনরোজের ঘনিষ্ঠ গবেষণা সহকর্মী।
• **মহাবিশ্বের চূড়ান্ত পরিণতি:** তাঁর রচিত বিখ্যাত বই *"The Ultimate Fate of the Universe"* (ক্যামব্রিজ ইউনিভার্সিটি প্রেস, ১৯৮৩) সারা বিশ্বে মহাবিশ্বের ভবিষ্যৎ নির্ধারণে ক্লাসিক গ্রন্থ হিসেবে গণ্য।
• তিনি বিদেশের বিলাসবহুল জীবন ছেড়ে নিজ দেশে ফিরে চট্টগ্রাম বিশ্ববিদ্যালয়ে তাত্ত্বিক পদার্থবিজ্ঞান গবেষণা কেন্দ্র গড়ে তুলেছিলেন।`,
    banglish: `🌌 **প্রফেসর জামাল নজরুল ইসলাম:**

বাংলাদেশের গর্বিত বিশ্বখ্যাত জ্যোতির্বিজ্ঞানী ও গণিতবিদ!
• স্টিফেন হকিং-এর ঘনিষ্ঠ বন্ধু ও সহকর্মী ছিলেন।
• মহাবিশ্বের ভবিষ্যৎ ও চূড়ান্ত পরিণতি নিয়ে তাঁর গবেষণা গ্রন্থ ক্যামব্রিজ ইউনিভার্সিটি প্রেস থেকে প্রকাশিত হয়ে বিশ্বজোড়া খ্যাতি অর্জন করে।`,
    en: `🌌 **Prof. Jamal Nazrul Islam (1939–2013):**

Eminent Bangladeshi mathematical physicist and cosmologist who collaborated at Cambridge with Stephen Hawking and Freeman Dyson.
• Author of the seminal monograph *"The Ultimate Fate of the Universe"* (Cambridge University Press, 1983). Dedicated his life to cultivating advanced science research in Bangladesh.`
  },
  {
    keys: ['marie curie', 'মাদাম কুরি', 'ম্যারি কুরি', 'radioactivity'],
    topic: 'pioneers',
    bn: `🏆 **মাদাম ম্যারি কুরি (Marie Curie):**

ইতিহাসের প্রথম ব্যক্তি যিনি **দুটি ভিন্ন বিজ্ঞান শাখায়** (পদার্থবিজ্ঞান ও রসায়ন) নোবেল পুরস্কার অর্জন করেছিলেন!
• তিনি তেজস্ক্রিয়তা (Radioactivity) বিষয়ে মৌলিক গবেষণা পরিচালনা করেন এবং দুটি নতুন মৌল আবিষ্কার করেন—**পোলোনিয়াম** ও **রেডিয়াম**।
• তাঁর গবেষণা ক্যান্সার চিকিৎসার রেডিওথেরাপির ভিত্তি গড়ে তোলে।`,
    banglish: `🏆 **Marie Curie সম্পর্কে অনুপ্রেরণাদায়ী তথ্য:**

ইতিহাসের একমাত্র বিজ্ঞানী যিনি ফিজিক্স এবং কেমিস্ট্রি—দুটি ভিন্ন বিজ্ঞানে নোবেল পুরস্কার জয় করেছেন!
• তেজস্ক্রিয়তা (Radioactivity) ও রেডিয়াম আবিষ্কার করে তিনি আধুনিক চিকিৎসার পথ খুলে দেন।`,
    en: `🏆 **Marie Skłodowska Curie (1867–1934):**

The first person to win Nobel Prizes in two distinct scientific fields (Physics 1903, Chemistry 1911).
• Discovered radium and polonium, formulated the theory of radioactivity, and developed mobile radiography units during WWI.`
  },

  // --- ENVIRONMENT & CLIMATE ---
  {
    keys: ['climate change', 'global warming', 'জলবায়ু পরিবর্তন', 'গ্রিনহাউস', 'carbon footprint'],
    topic: 'environment',
    bn: `🌍 **জলবায়ু পরিবর্তন ও গ্লোবাল ওয়ার্মিং:**

জীবাশ্ম জ্বালানি (কয়লা, তেল, গ্যাস) পোড়ানোর ফলে বায়ুমণ্ডলে কার্বন-ডাই-অক্সাইড ($CO_2$), মিথেন ইত্যাদি গ্রিনহাউস গ্যাসের ঘনত্ব দ্রুত বাড়ছে।
• **ফলাফল:** পৃথিবীর গড় তাপমাত্রা বৃদ্ধি পাচ্ছে, মেরু অঞ্চলের বরফ গলে সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি পাচ্ছে এবং খরা ও ঘূর্ণিঝড়ের প্রকোপ বাড়ছে।
• **বাংলাদেশ প্রেক্ষাপট:** ভৌগোলিক কারণে নিম্নাঞ্চলীয় ব-দ্বীপ হওয়ায় সমুদ্রের পানির উচ্চতা বৃদ্ধিতে সবচেয়ে ঝুঁকিপূর্ণ দেশগুলোর অন্যতম বাংলাদেশ। নবায়নযোগ্য সৌর ও বায়ু শক্তির ব্যবহারই টেকসই ভবিষ্যৎ গড়ে তুলতে পারে।`,
    banglish: `🌍 **Climate Change ও বৈশ্বিক উষ্ণতা:**

অতিরিক্ত কলকারখানা ও গাড়ির ধোঁয়ায় বায়ুমণ্ডলে গ্রিনহাউস গ্যাস জমে পৃথিবীর তাপমাত্রা বেড়েই চলেছে।
• এর ফলে বরফ গলছে, সমুদ্রের পানির স্তর বাড়ছে এবং আকস্মিক বন্যা-ঘূর্ণিঝড় বাড়ছে।
• পরিবেশ বিজ্ঞান ও গ্রিন এনার্জি নিয়ে UYFSR নিয়মিত তরুণদের সচেতনতা কর্মশালা পরিচালনা করে।`,
    en: `🌍 **Climate Change & Global Warming:**

Driven by anthropogenic greenhouse gas emissions ($CO_2$, $CH_4$) trapping infrared radiation in the troposphere.
• **Impacts:** Rising global sea levels, ocean acidification, and extreme weather events. Bangladesh as a riverine delta faces pronounced vulnerability, necessitating sustainable renewable energy shifts.`
  }
]

// -----------------------------------------------------------------------------
// 2. INTERACTIVE SCIENCE QUIZZES (CURATED FOR YOUNG MINDS)
// -----------------------------------------------------------------------------
export const SCIENCE_QUIZZES: ScienceQuizItem[] = [
  {
    questionBn: 'প্রশ্ন: সূর্য থেকে পৃথিবীতে আলো পৌঁছাতে কত সময় লাগে?',
    questionBanglish: 'Proshno: Surjo theke prithibite alo ashte koto somoy lage?',
    questionEn: 'Question: How long does sunlight take to reach Earth?',
    optionsBn: ['১. ৩ সেকেন্ড', '২. ৮ মিনিট ২০ সেকেন্ড', '৩. ১ ঘণ্টা', '৪. ১২ মিনিট'],
    optionsBanglish: ['1. 3 seconds', '2. 8 minutes 20 seconds', '3. 1 hour', '4. 12 minutes'],
    optionsEn: ['1. 3 seconds', '2. 8 minutes 20 seconds', '3. 1 hour', '4. 12 minutes'],
    correctIndex: 1,
    explanationBn: 'সূর্য থেকে পৃথিবীর গড় দূরত্ব প্রায় ১৫ কোটি কিলোমিটার। শূন্য মাধ্যমে আলোর গতিবেগ ৩ লাখ কিমি/সেকেন্ড হওয়ায় আলো আসতে প্রায় ৮ মিনিট ২০ সেকেন্ড সময় নেয়!',
    explanationBanglish: 'Surjo theke prithibir durotto 15 koti km. Alor goti 300,000 km/s hoyay shomoy lage pray 8 minute 20 second!',
    explanationEn: 'Traveling at ~300,000 km/s across 150 million km, photons take roughly 8 minutes and 20 seconds to reach Earth.'
  },
  {
    questionBn: 'প্রশ্ন: মানবদেহের সবচেয়ে শক্তিশালী ও বড় অস্থি (হাড়) কোনটি?',
    questionBanglish: 'Proshno: Manobdeher shobcheye shokto o boro haad konti?',
    questionEn: 'Question: What is the strongest and longest bone in the human body?',
    optionsBn: ['১. টিবিয়া', '২. হিউমেরাস', '৩. ফিমার (উরু)', '৪. কশেরুকা'],
    optionsBanglish: ['1. Tibia', '2. Humerus', '3. Femur (Thigh bone)', '4. Spine'],
    optionsEn: ['1. Tibia', '2. Humerus', '3. Femur (Thigh bone)', '4. Vertebra'],
    correctIndex: 2,
    explanationBn: 'ফিমার (Femur) বা উরুর হাড় মানবদেহের দীর্ঘতম, সবচেয়ে মজবুত ও ভারী হাড়। এটি শরীরের ওজনের প্রায় ৩০ গুণ চাপ সহ্য করতে পারে!',
    explanationBanglish: 'Femur ba urur haad shorirer shobcheye boro o strong haad, ja body weight er pray 30 gun chap sojjo korte pare!',
    explanationEn: 'The femur (thigh bone) is the longest, strongest, and densest bone in the human skeleton.'
  },
  {
    questionBn: 'প্রশ্ন: পরম শূন্য তাপমাত্রা (Absolute Zero) সেলসিয়াসে কত?',
    questionBanglish: 'Proshno: Absolute Zero temperature Celsius e koto?',
    questionEn: 'Question: What is Absolute Zero in Celsius?',
    optionsBn: ['১. ০°C', '২. -১০০°C', '৩. -২৭৩.১৫°C', '৪. -৪৫৯.৬৭°C'],
    optionsBanglish: ['1. 0°C', '2. -100°C', '3. -273.15°C', '4. -459.67°C'],
    optionsEn: ['1. 0°C', '2. -100°C', '3. -273.15°C', '4. -459.67°C'],
    correctIndex: 2,
    explanationBn: '-২৭৩.১৫°C হলো পরম শূন্য তাপমাত্রা (0 Kelvin)। এই তাপমাত্রায় পদার্থের সব অণু-পরমাণুর তাপীয় গতি পুরোপুরি থেমে যায়!',
    explanationBanglish: '-273.15°C ba 0 Kelvin e poromanur shob motion thame jay!',
    explanationEn: 'Absolute Zero corresponds to -273.15°C (0 Kelvin), the thermodynamic threshold where entropy reaches its minimum.'
  },
  {
    questionBn: 'প্রশ্ন: কোন গ্রহটি নিজের অক্ষে উল্টো দিকে (পূর্ব থেকে পশ্চিমে) ঘোরে?',
    questionBanglish: 'Proshno: Kono grohoti ultodike (East to West) ghore?',
    questionEn: 'Question: Which planet rotates in retrograde direction (East to West)?',
    optionsBn: ['১. মঙ্গল', '২. শুক্র (Venus)', '৩. বৃহস্পতি', '৪. শনি'],
    optionsBanglish: ['1. Mars', '2. Venus (Shukro)', '3. Jupiter', '4. Saturn'],
    optionsEn: ['1. Mars', '2. Venus', '3. Jupiter', '4. Saturn'],
    correctIndex: 1,
    explanationBn: 'শুক্র (Venus) গ্রহের ঘূর্ণন বিপরীতমুখী (Retrograde)। অর্থাৎ শুক্র গ্রহে সূর্য ওঠে পশ্চিমে আর অস্ত যায় পূর্বে! আর শুক্রের একদিন এর এক বছরের চেয়েও দীর্ঘ!',
    explanationBanglish: 'Venus ba Shukro groho ultodike ghore! Ekhane surjo uthe poschime ar dube purbe!',
    explanationEn: 'Venus exhibits retrograde rotation, spinning East to West. Consequently, the Sun rises in the west and sets in the east on Venus.'
  }
]

// -----------------------------------------------------------------------------
// 3. ASTONISHING SCIENCE FACTS
// -----------------------------------------------------------------------------
export const SCIENCE_FACTS: ScienceFactItem[] = [
  {
    category: 'Astronomy',
    bn: '🪐 **শুক্র গ্রহের ১ দিন তার ১ বছরের চেয়ে বড়!** শুক্র গ্রহ সূর্যের চারদিকে একবার ঘুরে আসতে সময় নেয় ২২৫ দিন, কিন্তু নিজের অক্ষে একবার পাক খেতে সময় নেয় ২৪৩ দিন!',
    banglish: '🪐 **Venus-er 1 din tar 1 bochorer cheye boro!** Venus surjor charpashe ghure ashte 225 din lage, kintu nijek ekbar ghurte 243 din somoy ney!',
    en: '🪐 **A day on Venus is longer than its year!** Venus takes 243 Earth days to rotate once on its axis, but only 225 Earth days to orbit the Sun!'
  },
  {
    category: 'Biology',
    bn: '🧬 **আপনার শরীরের সকল ডিএনএ জোড়া লাগালে তা প্লুটো পর্যন্ত গিয়ে আবার ফিরে আসতে পারে!** মানুষের প্রতিটি কোষে প্রায় ২ মিটার লম্বা ডিএনএ থাকে। পুরো শরীরের কোষে মোট ১০০ ট্রিলিয়ন মিটার ডিএনএ রয়েছে!',
    banglish: '🧬 **Amader body-r shob DNA jora dile Pluto porjonto giye abr phire asha jabe!** Ekta manush-er shorire pray 100 trillion meter DNA ache!',
    en: '🧬 **If unwound, the DNA in your body would stretch to Pluto and back!** Each cell holds ~2 meters of DNA; scaled across ~37 trillion cells, it spans billions of kilometers!'
  },
  {
    category: 'Physics',
    bn: '💫 **একটি নিউট্রন নক্ষত্রের এক চামচ পদার্থের ওজন পৃথিবীতে প্রায় ১০০ কোটি টন!** নিউট্রন নক্ষত্র এতটাই চরম ঘনত্বের যে এটি পুরো পৃথিবীর মানুষকে একটি চিনির কিউবের মধ্যে সংকুচিত করার সমান।',
    banglish: '💫 **Neutron star-er 1 chamoch podarther ojon prithibite 100 koti ton!** Eto extreme density je dharona korao kothin!',
    en: '💫 **A single teaspoon of a neutron star weighs about 1 billion tons on Earth!** Their nuclear density is equivalent to compressing the entire human species into a sugar cube.'
  },
  {
    category: 'Biology',
    bn: '🍯 **মধু কখনো নষ্ট হয় না!** প্রত্নতাত্ত্বিকরা প্রাচীন মিশরীয় পিরামিডে ৩০০০ বছরের পুরনো অক্ষত মধু খুঁজে পেয়েছেন যা আজও পুরোপুরি খাওয়ার উপযোগী! এর কারণ মধুর কম আর্দ্রতা ও অম্লীয় পিএইচ।',
    banglish: '🍯 **Modhu kokhono nosto hoy na!** Misorer 3000 bochorer purono pyramid e modhu pawa gese ja ekhono ekdom bhalo ache!',
    en: '🍯 **Honey never spoils!** Archaeologists have found 3,000-year-old honey pots in Egyptian tombs that remain completely edible due to low moisture and high acidity.'
  },
  {
    category: 'Zoology',
    bn: '🐻 **টার্ডিগ্রেড (Tardigrade - জল-ভালুক):** এই আণুবীক্ষণিক প্রাণী মহাকাশের মহাশূন্যে, চরম বিকিরণে এবং মাইনাস ২৭০ ডিগ্রি ঠান্ডায়ও বেঁচে থাকতে পারে!',
    banglish: '🐻 **Tardigrade ba Water Bear:** Ekti onubikhonik prani ja space-er shunnotay, extreme radiation o extreme sheet e bochorer por bochor beche thakte pare!',
    en: '🐻 **Tardigrades can survive the vacuum of open space, extreme ionizing radiation, and temperatures near absolute zero!**'
  }
]
