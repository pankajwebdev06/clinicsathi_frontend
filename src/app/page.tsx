import Link from 'next/link';
import { StatsBar } from '@/features/landing/ProductShowcase';
import { PricingCard } from '@/features/landing/PricingCard';
import { NavBar } from './NavBar';

const BENEFITS = [
  {
    icon: '⏱️',
    stat: '2–3 hrs',
    statLabel: 'saved per day',
    title: 'Your receptionist goes home on time',
    desc: 'Patient check-in drops from 3–4 minutes to under 30 seconds. No more manual registers, no more lost slips.',
    color: 'border-blue-200 bg-blue-50',
    statColor: 'text-blue-600',
  },
  {
    icon: '📂',
    stat: '0',
    statLabel: 'records ever lost',
    title: 'Every patient visit, always on record',
    desc: 'Search any patient by mobile number — full history, vitals, prescriptions, and reports appear instantly.',
    color: 'border-teal-200 bg-teal-50',
    statColor: 'text-teal-600',
  },
  {
    icon: '🌐',
    stat: '₹0',
    statLabel: 'marketing cost',
    title: 'Google finds your clinic for free',
    desc: 'Your SEO-optimised profile page ranks for "doctor near me" searches — no ads, no agency fees needed.',
    color: 'border-purple-200 bg-purple-50',
    statColor: 'text-purple-600',
  },
  {
    icon: '📵',
    stat: '100%',
    statLabel: 'uptime even offline',
    title: 'Powercut? Poor signal? Still works.',
    desc: 'Reception keeps running on any network — even 2G or no internet. Data syncs automatically when back online.',
    color: 'border-orange-200 bg-orange-50',
    statColor: 'text-orange-600',
  },
  {
    icon: '🖨️',
    stat: '5 min',
    statLabel: 'to set up your pad',
    title: 'Prescriptions that look like yours',
    desc: 'Upload your existing letterhead once. DoctorKaDost matches your header, colors, and layout. Patients notice no difference.',
    color: 'border-rose-200 bg-rose-50',
    statColor: 'text-rose-600',
  },
  {
    icon: '🧑‍💻',
    stat: 'Zero',
    statLabel: 'IT team needed',
    title: 'Works on any phone, out of the box',
    desc: 'No installation, no training manual. Your receptionist is ready in under 10 minutes on any Android or iPhone.',
    color: 'border-emerald-200 bg-emerald-50',
    statColor: 'text-emerald-600',
  },
];

const UPCOMING = [
  {
    icon: '💬',
    title: 'WhatsApp Reminders',
    desc: 'Auto-send appointment confirmations and follow-up reminders directly to patients on WhatsApp.',
    tag: 'Coming Soon',
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    iconBg: 'bg-green-500',
  },
  {
    icon: '🏥',
    title: 'ABHA / Digital Health ID',
    desc: 'Link patients to their Ayushman Bharat Health Account at check-in — auto-fill their profile with one OTP.',
    tag: 'Coming Soon',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-500',
  },
  {
    icon: '💳',
    title: 'Billing & Invoicing',
    desc: 'OPD invoice generation, UPI/cash/card tracking, and payment history — all inside DoctorKaDost.',
    tag: 'Premium Feature',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-500',
  },
];

const FEATURES = [
  {
    icon: '🗂️',
    title: 'Smart Queue Management',
    desc: 'Color-coded real-time queue with token numbers. WebSocket-powered — every device updates instantly.',
    detail: [['● Waiting', '10 mins'], ['● In Consultation', 'Room 2']],
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: '📋',
    title: 'Digital Patient Records',
    desc: 'Access full patient history instantly. Searchable by mobile number within your clinic\'s secure database.',
    detail: [['● Records', 'Instant access'], ['● History', 'All visits']],
    color: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50',
  },
  {
    icon: '⚡',
    title: 'Fast Check-In & Tokens',
    desc: 'Auto-generate unique tokens (M-001) after registration. Receptionists check in patients in seconds.',
    detail: [['● Token', 'Auto-generated'], ['● Check-in', '< 30 seconds']],
    color: 'from-orange-500 to-rose-600',
    bg: 'bg-orange-50',
  },
  {
    icon: '📱',
    title: 'Works Offline',
    desc: 'Reception works even on poor internet. Data auto-syncs the moment connectivity is restored.',
    detail: [['● Sync', 'Auto on reconnect'], ['● Storage', 'Local IndexedDB']],
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
  },
  {
    icon: '🖨️',
    title: 'Custom Prescription Pad',
    desc: 'Upload your existing letterhead, auto-extract colors, customize every header/footer field. Print-ready A4.',
    detail: [['● Templates', '5 presets + custom'], ['● Output', 'A4 print-ready']],
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
  },
  {
    icon: '🌐',
    title: 'SEO-Optimized Public Profile',
    desc: 'Every doctor gets a Google-indexed profile page with photos, services, fees & "Book Appointment" CTA.',
    detail: [['● URL', 'doctor/dr-name-specialization-city'], ['● SEO', 'Meta + canonical']],
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50',
  },
];

const STEPS = [
  { n: '01', title: 'Doctor Signs Up', desc: 'Register your clinic in 3 quick steps — specialization, clinic details, and staff setup.' },
  { n: '02', title: 'Add Your Team', desc: 'Add receptionists by mobile number. They log in instantly on any device, no separate app needed.' },
  { n: '03', title: 'Start Seeing Patients', desc: 'Receptionist enters patient mobile number → auto-search → register or retrieve → print token. Done.' },
];

const TRUST = [
  { icon: '🔒', title: 'Highly Secure', desc: 'Bank-grade encryption' },
  { icon: '📶', title: 'Offline-Ready', desc: 'Works without internet' },
  { icon: '⚡', title: 'Fast & Reliable', desc: '99.9% Uptime SLA' },
  { icon: '🌐', title: 'Multi-Language', desc: 'Hindi, Tamil & more' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden">

      {/* NAV */}
      <NavBar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36">
        {/* Gradient BG */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Designed for Indian Clinics
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-5 md:mb-6">
            Your Clinic&apos;s{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              Digital Saathi.
            </span>{' '}
            Effortless Flow.
          </h1>

          <p className="text-base md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 font-medium">
            Modern queue management, digital records, and seamless patient check-in — designed for Indian clinics.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Link href="/doctor/setup" className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-blue-600/25 transition-all active:scale-[0.98] hover:-translate-y-0.5 text-center">
              Register My Clinic →
            </Link>
            <Link href="/login" className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-base md:text-lg border-2 border-slate-200 transition-all active:scale-[0.98] hover:-translate-y-0.5 text-center">
              Login to Dashboard
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-1 shadow-2xl shadow-slate-900/30 max-w-3xl mx-auto">
              <div className="bg-slate-900 rounded-2xl overflow-hidden">
                {/* Mock Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                  <div className="hidden sm:block w-3 h-3 rounded-full bg-red-500/80 flex-shrink-0"></div>
                  <div className="hidden sm:block w-3 h-3 rounded-full bg-yellow-500/80 flex-shrink-0"></div>
                  <div className="hidden sm:block w-3 h-3 rounded-full bg-emerald-500/80 flex-shrink-0"></div>
                  <div className="flex-1 sm:ml-3 bg-slate-700/50 rounded-md h-5 flex items-center px-3 overflow-hidden">
                    <span className="text-slate-400 text-xs font-mono truncate">app.doctorkadost.in/reception</span>
                  </div>
                </div>
                {/* Mock Dashboard UI */}
                <div className="flex min-h-[260px] md:min-h-[320px]">
                  {/* Sidebar */}
                  <div className="w-14 md:w-48 bg-slate-800 border-r border-slate-700/50 p-3 flex flex-col gap-2">
                    <div className="p-2 rounded-xl bg-blue-600 flex items-center gap-2">
                      <span className="text-base">🗂️</span>
                      <span className="hidden md:block text-white text-xs font-semibold">Patient Entry</span>
                    </div>
                    {['📋 Queue Mgmt', '⚙️ Settings'].map(s => (
                      <div key={s} className="p-2 rounded-xl flex items-center gap-2 text-slate-400">
                        <span className="text-base">{s.split(' ')[0]}</span>
                        <span className="hidden md:block text-xs font-medium">{s.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 p-4 md:p-6 space-y-4">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Patient Check-in</p>
                    <div className="bg-slate-700/40 rounded-xl p-4 border border-slate-600/40">
                      <p className="text-slate-400 text-xs mb-2">Mobile Number</p>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-medium">+91</span>
                        <span className="text-white font-bold tracking-widest text-sm md:text-base">9876543210</span>
                        <div className="ml-auto w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 animate-in fade-in duration-700">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-emerald-400 text-xs font-bold uppercase">● Patient Found</p>
                        <span className="bg-slate-900 text-white text-xs font-black px-2 py-1 rounded-lg">M-007</span>
                      </div>
                      <p className="text-white font-bold text-sm md:text-base">Rahul Sharma</p>
                      <p className="text-slate-400 text-xs mt-0.5">34 yrs • Male • 3 prev visits</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-blue-600 rounded-xl py-2.5 text-center text-white text-xs font-bold">Generate Token</div>
                      <div className="flex-1 bg-slate-700 rounded-xl py-2.5 text-center text-slate-300 text-xs font-bold">Print Slip</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-500/20 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST.map(t => (
              <div key={t.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                  {t.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.title}</p>
                  <p className="text-slate-400 text-xs">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Built for Operational Efficiency</h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Everything you need to run a modern clinic. Nothing you don&apos;t.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className={`${f.bg} rounded-3xl p-8 border border-white shadow-sm hover:shadow-lg transition-shadow group`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl bg-gradient-to-br ${f.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-5">{f.desc}</p>
                <div className="bg-white/80 rounded-2xl p-4 space-y-2 border border-white">
                  {f.detail.map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">{k}</span>
                      <span className="text-slate-900 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DOCTORS CHOOSE DOCTORKADOST */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-4 uppercase tracking-wider">
              For Doctors & Clinic Owners
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Real results, from day one
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto">
              DoctorKaDost is built around one goal — give doctors more time with patients, and less time with paperwork.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BENEFITS.map(b => (
              <div key={b.title} className={`rounded-3xl border p-6 ${b.color} flex flex-col gap-4`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{b.icon}</span>
                  <div className="text-right">
                    <div className={`text-2xl md:text-3xl font-black ${b.statColor}`}>{b.stat}</div>
                    <div className="text-slate-500 text-xs font-semibold">{b.statLabel}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{b.title}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR — credibility/scale */}
      <StatsBar />

      {/* UPCOMING FEATURES */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold mb-4 uppercase tracking-wider">
              🛣️ What&apos;s coming next
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              We&apos;re just getting started
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg mx-auto">
              These features are in active development — built based on feedback from real clinics.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {UPCOMING.map(u => (
              <div key={u.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden">
                {/* Subtle top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${u.iconBg} opacity-60`}></div>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${u.iconBg} flex items-center justify-center text-xl text-white shadow-sm flex-shrink-0`}>
                    {u.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${u.tagColor} uppercase tracking-wider`}>
                    {u.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{u.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SETUP GUIDE CTA — bridges Features and How-It-Works */}
      <section className="py-14 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-y border-amber-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl md:text-4xl shadow-lg shadow-orange-200">
              📖
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">First time? Start here.</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">
                Step-by-step setup guide — register your clinic in 10 minutes
              </h3>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                Visual walkthrough covering doctor signup, clinic details, timings, staff onboarding,
                patient check-in, token generation, and prescription printing.
              </p>
            </div>
            <Link
              href="/register-guide"
              className="flex-shrink-0 px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Open Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Up and Running in Minutes</h2>
            <p className="text-slate-400 text-lg font-medium">No training required. No IT team needed.</p>
          </div>
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-blue-400">
                  {s.n}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[27px] mt-14 w-0.5 h-6 bg-white/10 hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — social proof */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">What doctors say</p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Built with feedback from real Indian clinics</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                quote: "Patient check-in used to take 3-4 minutes per patient. Now it’s under 30 seconds. The token system alone has saved my receptionist hours every day.",
                author: 'Dr. Ramesh Kumar',
                role: 'General Physician • Mumbai',
                avatar: '👨‍⚕️',
              },
              {
                quote: "I uploaded my old prescription pad and DoctorKaDost matched my header exactly. Patients can’t tell the difference between the printed one and the original.",
                author: 'Dr. Anjali Sharma',
                role: 'Pediatrician • Delhi',
                avatar: '👩‍⚕️',
              },
            ].map(t => (
              <div key={t.author} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-7 shadow-sm">
                <div className="text-amber-400 mb-3 text-lg">★★★★★</div>
                <p className="text-slate-700 font-medium leading-relaxed mb-5 text-sm md:text-base">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.author}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Simple, Honest Pricing</h2>
          <p className="text-slate-500 text-base md:text-lg font-medium mb-10">Pick monthly or save with yearly billing.</p>
          <PricingCard />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
            Ready to modernize your clinic?
          </h2>
          <p className="text-blue-100 text-lg font-medium mb-10 max-w-xl mx-auto">
            Join hundreds of doctors across India already using DoctorKaDost to run smoother, faster, and smarter clinics.
          </p>
          <Link href="/doctor/setup" className="inline-block px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98]">
            Register My Clinic — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs flex-shrink-0">DK</div>
            <span className="font-extrabold text-slate-900">DoctorKaDost</span>
          </div>
          <p className="text-slate-400 text-sm font-medium text-center">© 2026 DoctorKaDost. Built for the Indian Subcontinent.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 text-sm font-semibold text-slate-500">
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
            <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
