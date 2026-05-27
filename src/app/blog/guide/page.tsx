import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'How to Register Your Clinic on DoctorKaDost | 5-Minute Setup',
  description:
    'Register your clinic on DoctorKaDost in 5 simple steps. OTP-based login, no passwords. Built for Indian clinics.',
};

const STEPS = [
  {
    n: '01',
    title: 'Tell us about you',
    sub: 'Doctor name, mobile number (your login ID), degree, and specialization.',
  },
  {
    n: '02',
    title: 'Add your clinic',
    sub: 'Clinic name, city, phone, address, MCI/NMC registration number.',
  },
  {
    n: '03',
    title: 'Set timings',
    sub: 'Morning and evening sessions. Mark off-days. Patients see this on your public profile.',
  },
  {
    n: '04',
    title: 'Add reception staff',
    sub: 'Just their mobile numbers — they log in instantly with OTP. Skippable, add anytime from Settings.',
  },
  {
    n: '05',
    title: 'Open your dashboard',
    sub: 'You\'re logged in. Start checking patients in — your reception desk is live.',
  },
];

const BENEFITS = [
  { icon: '⏱️',  title: 'Live in 5 minutes',      sub: 'No installation. Works on any phone or laptop browser.' },
  { icon: '🔐',  title: 'No passwords to remember', sub: 'OTP-based login on your registered mobile number.' },
  { icon: '📱',  title: 'Works on poor internet',   sub: 'Reception keeps working even when the network drops.' },
  { icon: '🌐',  title: 'Free public profile',      sub: 'Auto-generated SEO page — patients find you on Google.' },
  { icon: '🖨️',  title: 'Your prescription pad',    sub: 'Upload your existing letterhead — printed Rx looks just like yours.' },
  { icon: '💸',  title: 'Free trial, no card',      sub: 'Try the full system free. Pay only when it works for you.' },
];

const FAQS = [
  {
    q: 'Do I need to install anything?',
    a: 'No. DoctorKaDost runs in any modern browser — Chrome on your phone, Safari on iPad, anything. Nothing to download or maintain.',
  },
  {
    q: 'What if my internet is slow or drops?',
    a: 'Reception keeps working offline. Patient check-ins and tokens save locally and sync the moment connectivity returns.',
  },
  {
    q: 'Can I customize my prescription printout?',
    a: 'Yes. Pick from 5 medical-grade themes, or upload your existing prescription letterhead — your printout will look just like the pad you already use.',
  },
  {
    q: 'Will my patients find me online?',
    a: 'Yes. Every clinic gets a Google-indexed public profile page with photos, services, fees and a "Call Now" button — included in the free trial.',
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs flex-shrink-0">CS</div>
            <span className="font-extrabold text-slate-900 truncate">DoctorKaDost</span>
          </Link>
          <Link href="/doctor/setup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap min-h-[40px] flex items-center">
            Register Now →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-14 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4">
            📖 Setup Guide
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            Register your clinic in 5 minutes.
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-xl mx-auto">
            Five short steps. No installation. No passwords. Designed for clinic owners who don&apos;t have IT teams.
          </p>
        </div>
      </section>

      {/* 5 Steps */}
      <section className="py-14 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">The 5-step setup</h2>
            <p className="text-slate-500 text-sm md:text-base">Each step takes under a minute. You can pause and resume any time.</p>
          </div>

          <ol className="space-y-4 md:space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.n} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6 flex gap-4 md:gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white font-black text-base md:text-lg flex items-center justify-center shadow-lg shadow-blue-200">
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{s.title}</h3>
                  <p className="text-slate-500 text-sm md:text-base mt-1 leading-relaxed">{s.sub}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <Link
              href="/doctor/setup"
              className="inline-block px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
            >
              Start step 1 → Register Now
            </Link>
            <p className="text-slate-400 text-xs mt-3">No credit card. Free trial included.</p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-14 md:py-20 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">What you get</h2>
            <p className="text-slate-500 text-sm md:text-base">Everything below is included from day one.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className="text-3xl mb-2.5">{b.icon}</div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map(f => (
              <details key={f.q} className="group bg-slate-50 border border-slate-100 rounded-2xl p-5 cursor-pointer">
                <summary className="font-bold text-slate-900 text-sm md:text-base list-none flex justify-between items-center gap-3">
                  <span>{f.q}</span>
                  <span className="text-slate-400 text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
            Ready? Setup takes 5 minutes.
          </h2>
          <p className="text-blue-100 text-sm md:text-base mb-7">
            Join clinics across India using DoctorKaDost to run smarter, faster, and offline-ready.
          </p>
          <Link
            href="/doctor/setup"
            className="inline-block px-8 py-4 bg-white text-blue-700 rounded-2xl font-black text-base md:text-lg shadow-xl active:scale-[0.98]"
          >
            Register My Clinic
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 bg-white px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs">CS</div>
            <span className="font-bold text-slate-700">DoctorKaDost</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-3 md:gap-5">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <Link href="/doctors" className="hover:text-slate-900">Doctors</Link>
            <Link href="/privacy-policy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
