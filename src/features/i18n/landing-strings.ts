// Bilingual content for the landing page.
// All translatable text is stored as { en, hi } pairs.
// Natural Hindi — mixes Hindi + everyday English words (clinic, token, OTP, etc.)
// as Indians actually speak, not robotic literal translation.

export type Bi = { en: string; hi: string };
const b = (en: string, hi: string): Bi => ({ en, hi });

// ─── Trust badges ─────────────────────────────────────────────────────────────
export const TRUST_DATA = [
  { icon: '🔒', title: b('Highly Secure',   'पूरी तरह सुरक्षित'),   desc: b('Bank-grade encryption',  'Bank जैसी Security') },
  { icon: '📶', title: b('Offline-Ready',   'Offline भी चलता है'),   desc: b('Works without internet', 'Internet के बिना भी') },
  { icon: '⚡', title: b('Fast & Reliable', 'तेज़ और भरोसेमंद'),     desc: b('99.9% Uptime SLA',       '99.9% Uptime की गारंटी') },
  { icon: '🌐', title: b('Multi-Language',  'कई भाषाओं में'),        desc: b('Hindi, Tamil & more',    'Hindi, Tamil और भी') },
] as const;

// ─── Feature cards ────────────────────────────────────────────────────────────
export const FEATURES_DATA = [
  {
    icon: '🗂️',
    title: b('Smart Queue Management', 'Smart Queue Management'),
    desc: b(
      'Color-coded real-time queue with token numbers. WebSocket-powered — every device updates instantly.',
      'Token numbers के साथ real-time queue, color-coded। हर device तुरंत update — WebSocket से powered।',
    ),
    detail: [['● Waiting', '10 mins'], ['● In Consultation', 'Room 2']],
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: '📋',
    title: b('Digital Patient Records', 'Digital Patient Records'),
    desc: b(
      "Access full patient history instantly. Searchable by mobile number within your clinic's secure database.",
      'Mobile number से search करें — पूरी history तुरंत। आपके clinic का secure database।',
    ),
    detail: [['● Records', 'Instant access'], ['● History', 'All visits']],
    color: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50',
  },
  {
    icon: '⚡',
    title: b('Fast Check-In & Tokens', 'तेज़ Check-In और Token'),
    desc: b(
      'Auto-generate unique tokens (M-001) after registration. Receptionists check in patients in seconds.',
      'Registration के बाद automatic token (M-001) बनता है। Receptionist seconds में check-in करे।',
    ),
    detail: [['● Token', 'Auto-generated'], ['● Check-in', '< 30 seconds']],
    color: 'from-orange-500 to-rose-600',
    bg: 'bg-orange-50',
  },
  {
    icon: '📱',
    title: b('Works Offline', 'Offline भी चलता है'),
    desc: b(
      'Reception works even on poor internet. Data auto-syncs the moment connectivity is restored.',
      'खराब internet पर भी reception चलती है। Connection वापस आते ही data खुद sync।',
    ),
    detail: [['● Sync', 'Auto on reconnect'], ['● Storage', 'Local IndexedDB']],
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
  },
  {
    icon: '🖨️',
    title: b('Custom Prescription Pad', 'अपना Prescription Pad'),
    desc: b(
      'Upload your existing letterhead, auto-extract colors, customize every header/footer field. Print-ready A4.',
      'अपना letterhead upload करें, colors auto-detect होंगे, हर field customize करें। A4 print-ready।',
    ),
    detail: [['● Templates', '5 presets + custom'], ['● Output', 'A4 print-ready']],
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
  },
  {
    icon: '🌐',
    title: b('SEO-Optimized Public Profile', 'Google पर आपकी Profile'),
    desc: b(
      'Every doctor gets a Google-indexed profile page with photos, services, fees & "Book Appointment" CTA.',
      'हर doctor को Google-indexed profile मिलती है — photos, services, fees और appointment CTA।',
    ),
    detail: [['● URL', 'doctor/dr-name-city'], ['● SEO', 'Meta + canonical']],
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50',
  },
] as const;

// ─── Benefit cards ────────────────────────────────────────────────────────────
export const BENEFITS_DATA = [
  {
    icon: '⏱️',
    stat: '2–3 hrs',
    statLabel: b('saved per day',     'रोज़ाना बचती है'),
    title:     b('Your receptionist goes home on time', 'Receptionist समय पर घर जाएगी'),
    desc:      b(
      'Patient check-in drops from 3–4 minutes to under 30 seconds. No more manual registers, no more lost slips.',
      'मरीज़ का check-in 3-4 मिनट से घटकर 30 seconds से कम। कोई manual register नहीं, कोई पर्ची गुम नहीं।',
    ),
    color: 'border-blue-200 bg-blue-50',
    statColor: 'text-blue-600',
  },
  {
    icon: '📂',
    stat: '0',
    statLabel: b('records ever lost', 'records कभी गुम नहीं'),
    title:     b('Every patient visit, always on record', 'हर मरीज़, हमेशा record में'),
    desc:      b(
      'Search any patient by mobile number — full history, vitals, prescriptions, and reports appear instantly.',
      'Mobile number से कोई भी मरीज़ खोजें — पूरी history, vitals, prescriptions, सब कुछ तुरंत सामने।',
    ),
    color: 'border-teal-200 bg-teal-50',
    statColor: 'text-teal-600',
  },
  {
    icon: '🌐',
    stat: '₹0',
    statLabel: b('marketing cost',    'marketing पर खर्च'),
    title:     b('Google finds your clinic for free', 'Google मरीज़ आपके पास free में भेजेगा'),
    desc:      b(
      'Your SEO-optimised profile page ranks for "doctor near me" searches — no ads, no agency fees needed.',
      '"Doctor near me" search में आपका profile आएगा — कोई ad नहीं, कोई agency fees नहीं।',
    ),
    color: 'border-purple-200 bg-purple-50',
    statColor: 'text-purple-600',
  },
  {
    icon: '📵',
    stat: '100%',
    statLabel: b('uptime even offline', 'offline uptime'),
    title:     b('Powercut? Poor signal? Still works.', 'बिजली गई? Signal नहीं? फ़र्क नहीं पड़ता।'),
    desc:      b(
      'Reception keeps running on any network — even 2G or no internet. Data syncs automatically when back online.',
      '2G पर भी, internet बिना भी reception चलती रहती है। Connection वापस आते ही data खुद sync।',
    ),
    color: 'border-orange-200 bg-orange-50',
    statColor: 'text-orange-600',
  },
  {
    icon: '🖨️',
    stat: '5 min',
    statLabel: b('to set up your pad', 'में pad तैयार'),
    title:     b('Prescriptions that look like yours', 'Prescription बिल्कुल आपकी जैसी दिखेगी'),
    desc:      b(
      'Upload your existing letterhead once. DoctorKaDost matches your header, colors, and layout. Patients notice no difference.',
      'अपना letterhead एक बार upload करें। DoctorKaDost exact वैसा ही match करता है। मरीज़ों को कोई फ़र्क नहीं पता।',
    ),
    color: 'border-rose-200 bg-rose-50',
    statColor: 'text-rose-600',
  },
  {
    icon: '🧑‍💻',
    stat: 'Zero',
    statLabel: b('IT team needed',    'IT team की ज़रूरत'),
    title:     b('Works on any phone, out of the box', 'कोई भी phone, तुरंत तैयार'),
    desc:      b(
      'No installation, no training manual. Your receptionist is ready in under 10 minutes on any Android or iPhone.',
      'कोई installation नहीं, कोई training नहीं। Android हो या iPhone — receptionist 10 मिनट में तैयार।',
    ),
    color: 'border-emerald-200 bg-emerald-50',
    statColor: 'text-emerald-600',
  },
] as const;

// ─── Upcoming feature cards ───────────────────────────────────────────────────
export const UPCOMING_DATA = [
  {
    icon: '💬',
    title: b('WhatsApp Reminders', 'WhatsApp Reminders'),
    desc:  b(
      'Auto-send appointment confirmations and follow-up reminders directly to patients on WhatsApp.',
      'Appointment confirm होते ही patient के WhatsApp पर message — follow-up reminder भी automatic।',
    ),
    tag:      b('Coming Soon',     'जल्द आ रहा है'),
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    iconBg:   'bg-green-500',
  },
  {
    icon: '🏥',
    title: b('ABHA / Digital Health ID', 'ABHA / Digital Health ID'),
    desc:  b(
      'Link patients to their Ayushman Bharat Health Account at check-in — auto-fill their profile with one OTP.',
      'Check-in पर एक OTP से patient का ABHA account link हो जाएगा — profile खुद भर जाएगी।',
    ),
    tag:      b('Coming Soon',     'जल्द आ रहा है'),
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    iconBg:   'bg-blue-500',
  },
  {
    icon: '💳',
    title: b('Billing & Invoicing', 'Billing और Invoicing'),
    desc:  b(
      'OPD invoice generation, UPI/cash/card tracking, and payment history — all inside DoctorKaDost.',
      'OPD invoice बनाएँ, UPI/cash/card track करें — payment history सब DoctorKaDost में।',
    ),
    tag:      b('Premium Feature', 'Premium Feature'),
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    iconBg:   'bg-amber-500',
  },
] as const;

// ─── How it works steps ───────────────────────────────────────────────────────
export const STEPS_DATA = [
  {
    n: '01',
    title: b('Doctor Signs Up',        'Doctor Sign Up करें'),
    desc:  b(
      'Register your clinic in 3 quick steps — specialization, clinic details, and staff setup.',
      '3 आसान steps में clinic register करें — specialization, clinic details, और staff।',
    ),
  },
  {
    n: '02',
    title: b('Add Your Team',          'Team जोड़ें'),
    desc:  b(
      'Add receptionists by mobile number. They log in instantly on any device, no separate app needed.',
      'Receptionist का mobile number डालें। किसी भी device पर तुरंत login — अलग app की ज़रूरत नहीं।',
    ),
  },
  {
    n: '03',
    title: b('Start Seeing Patients',  'मरीज़ देखना शुरू करें'),
    desc:  b(
      'Receptionist enters patient mobile number → auto-search → register or retrieve → print token. Done.',
      'Receptionist mobile number डाले → auto-search → register या retrieve → token print। बस।',
    ),
  },
] as const;

// ─── All other landing-page strings ──────────────────────────────────────────
export const LS = {
  // Hero
  heroTagline:     b('Designed for Indian Clinics',  'भारतीय Clinics के लिए बना'),
  heroTitleA:      b("Your Clinic's",                'आपके Clinic का'),
  heroTitleAccent: b('Digital Dost.',                'डिजिटल दोस्त।'),
  heroTitleB:      b('Effortless Flow.',             'आसान काम।'),
  heroSub: b(
    'Modern queue management, digital records, and seamless patient check-in — designed for Indian clinics.',
    'मरीज़ों की queue, digital records, और आसान check-in — सब कुछ एक जगह। भारतीय clinics के लिए।',
  ),
  ctaRegister: b('Register My Clinic →',   'मेरी Clinic Register करें →'),
  ctaLogin:    b('Login to Dashboard',     'Dashboard में Login करें'),

  // Features section
  featuresTitle: b('Built for Operational Efficiency', 'Clinic को efficiently चलाने के लिए'),
  featuresSub:   b(
    "Everything you need to run a modern clinic. Nothing you don't.",
    'Modern clinic के लिए जो ज़रूरी है — सब यहाँ है।',
  ),

  // Benefits section
  benefitsTag:   b('For Doctors & Clinic Owners',   'Doctors और Clinic Owners के लिए'),
  benefitsTitle: b('Real results, from day one',    'पहले दिन से ही असली फ़र्क'),
  benefitsSub: b(
    'DoctorKaDost is built around one goal — give doctors more time with patients, and less time with paperwork.',
    'DoctorKaDost का एक ही मकसद है — doctors को मरीज़ों के साथ ज़्यादा वक़्त मिले, paperwork में कम।',
  ),

  // Upcoming section
  upcomingTag:   b("🛣️ What's coming next",          '🛣️ आगे क्या आ रहा है'),
  upcomingTitle: b("We're just getting started",    'बस शुरुआत है अभी तो'),
  upcomingSub: b(
    'These features are in active development — built based on feedback from real clinics.',
    'ये features real clinics की feedback पर बन रहे हैं।',
  ),

  // Setup guide CTA
  guideTag:   b('First time? Start here.',  'पहली बार? यहाँ से शुरू करें।'),
  guideTitle: b(
    'Step-by-step setup guide — register your clinic in 10 minutes',
    'Step-by-step setup guide — 10 मिनट में clinic register करें',
  ),
  guideSub: b(
    'Visual walkthrough covering doctor signup, clinic details, timings, staff onboarding, patient check-in, token generation, and prescription printing.',
    'Doctor signup से लेकर prescription printing तक — पूरी visual guide। कुछ भी miss नहीं होगा।',
  ),
  guideCta: b('Open Guide →', 'Guide खोलें →'),

  // How it works
  howTitle: b('Up and Running in Minutes', 'मिनटों में शुरू हो जाएँ'),
  howSub:   b('No training required. No IT team needed.', 'कोई training नहीं। कोई IT team नहीं।'),

  // Testimonials
  testTag:   b('What doctors say',                        'Doctors क्या कहते हैं'),
  testTitle: b('Built with feedback from real Indian clinics', 'Real Indian clinics की feedback से बना'),
  test1Quote: b(
    '"Patient check-in used to take 3-4 minutes per patient. Now it\'s under 30 seconds. The token system alone has saved my receptionist hours every day."',
    '"पहले हर मरीज़ का check-in 3-4 मिनट लगता था। अब 30 seconds से भी कम। Token system ने अकेले घंटों की बचत कर दी।"',
  ),
  test1Author: b('Dr. Ramesh Kumar',      'Dr. Ramesh Kumar'),
  test1Role:   b('General Physician • Mumbai', 'General Physician • Mumbai'),
  test2Quote: b(
    '"I uploaded my old prescription pad and DoctorKaDost matched my header exactly. Patients can\'t tell the difference between the printed one and the original."',
    '"मैंने अपना पुराना prescription pad upload किया और DoctorKaDost ने exact वैसा ही बना दिया। Patients को कोई फ़र्क ही नहीं पता।"',
  ),
  test2Author: b('Dr. Anjali Sharma',     'Dr. Anjali Sharma'),
  test2Role:   b('Pediatrician • Delhi',  'Pediatrician • Delhi'),

  // Pricing
  pricingTitle: b('Simple, Honest Pricing',              'सीधी, सच्ची Pricing'),
  pricingSub:   b('Pick monthly or save with yearly billing.', 'Monthly चुनें या Yearly पर बचत पाएँ।'),

  // Final CTA
  ctaFinalTitle: b(
    'Ready to modernize your clinic?',
    'क्या आप अपनी Clinic को modern बनाने के लिए तैयार हैं?',
  ),
  ctaFinalSub: b(
    'Join hundreds of doctors across India already using DoctorKaDost to run smoother, faster, and smarter clinics.',
    'भारत भर के सैकड़ों doctors पहले से DoctorKaDost use कर रहे हैं — faster, smarter और smoother clinic के लिए।',
  ),
  ctaFinalBtn: b("Register My Clinic — It's Free", 'मेरी Clinic Register करें — बिल्कुल Free'),

  // Footer
  footerCopy: b(
    '© 2026 DoctorKaDost. Built for the Indian Subcontinent.',
    '© 2026 DoctorKaDost. भारतीय Subcontinent के लिए बनाया।',
  ),
};
