// Translation strings for patient-facing surfaces.
// Add new locales by adding a new key to each string object.
// Currently: English (en), Hindi (hi)

export type Locale = 'en' | 'hi';

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'English',  native: 'English' },
  { code: 'hi', label: 'Hindi',    native: 'हिन्दी' },
];

// Format: STRINGS.section.key[locale]
export const STRINGS = {
  common: {
    languageToggle: { en: 'Language',                 hi: 'भाषा' },
    home:           { en: 'Home',                     hi: 'होम' },
    doctors:        { en: 'Doctors',                  hi: 'डॉक्टर' },
    bookAppointment:{ en: 'Book Appointment',         hi: 'अपॉइंटमेंट बुक करें' },
    callNow:        { en: 'Call Now',                 hi: 'अभी कॉल करें' },
    register:       { en: 'Register',                 hi: 'पंजीकरण' },
    login:          { en: 'Login',                    hi: 'लॉगिन' },
    search:         { en: 'Search',                   hi: 'खोजें' },
    backToHome:     { en: 'Go to Homepage',           hi: 'होमपेज पर जाएँ' },
    loading:        { en: 'Loading…',                 hi: 'लोड हो रहा है…' },
    notFound:       { en: 'Profile Not Found',        hi: 'प्रोफ़ाइल नहीं मिली' },
  },
  landing: {
    heroTagline:    { en: 'Designed for Indian Clinics', hi: 'भारतीय क्लीनिक्स के लिए बनाया गया' },
    heroTitleA:     { en: "Your Clinic's",            hi: 'आपके क्लीनिक का' },
    heroTitleAccent:{ en: 'Digital Saathi.',          hi: 'डिजिटल साथी।' },
    heroTitleB:     { en: 'Effortless Flow.',         hi: 'आसान काम।' },
    heroSub:        { en: 'Modern queue management, digital records, and seamless patient check-in — designed for Indian clinics.',
                       hi: 'आधुनिक क्यू मैनेजमेंट, डिजिटल रिकॉर्ड्स, और निर्बाध मरीज़ चेक-इन — भारतीय क्लीनिक्स के लिए।' },
    ctaRegister:    { en: 'Register My Clinic →',     hi: 'मेरा क्लीनिक रजिस्टर करें →' },
    ctaLogin:       { en: 'Login to Dashboard',       hi: 'डैशबोर्ड में लॉगिन करें' },
    features:       { en: 'Features',                 hi: 'फ़ीचर्स' },
    howItWorks:     { en: 'How it Works',             hi: 'यह कैसे काम करता है' },
    pricing:        { en: 'Pricing',                  hi: 'मूल्य' },
    setupGuide:     { en: 'Setup Guide',              hi: 'सेटअप गाइड' },
  },
  profile: {
    aboutDoctor:    { en: 'About Doctor',             hi: 'डॉक्टर के बारे में' },
    services:       { en: 'Services',                 hi: 'सेवाएँ' },
    location:       { en: 'Location',                 hi: 'स्थान' },
    contact:        { en: 'Contact',                  hi: 'संपर्क' },
    fee:            { en: 'Consultation Fee',         hi: 'परामर्श शुल्क' },
    mciNumber:      { en: 'MCI Registration',         hi: 'एमसीआई पंजीकरण' },
    yearsExp:       { en: 'years experience',         hi: 'वर्ष का अनुभव' },
    bookNow:        { en: 'Book an Appointment',      hi: 'अपॉइंटमेंट बुक करें' },
    bookSub:        { en: 'Visit the clinic and consult with the doctor',
                       hi: 'क्लीनिक जाएँ और डॉक्टर से परामर्श करें' },
    moved:          { en: 'This doctor profile may have been updated or moved.',
                       hi: 'यह डॉक्टर प्रोफ़ाइल अपडेट या स्थानांतरित हो सकती है।' },
    browseDoctors:  { en: 'Browse Doctors →',         hi: 'डॉक्टर देखें →' },
  },
  directory: {
    title:          { en: 'Find a Doctor Near You',   hi: 'अपने पास डॉक्टर खोजें' },
    cityFilter:     { en: 'Filter by city',           hi: 'शहर से छाँटें' },
    specFilter:     { en: 'Filter by specialization', hi: 'विशेषज्ञता से छाँटें' },
    noResults:      { en: 'No doctors found',         hi: 'कोई डॉक्टर नहीं मिला' },
    viewProfile:    { en: 'View Profile →',           hi: 'प्रोफ़ाइल देखें →' },
  },
} as const;

export type StringSection = keyof typeof STRINGS;
export type StringKey<S extends StringSection> = keyof (typeof STRINGS)[S];
