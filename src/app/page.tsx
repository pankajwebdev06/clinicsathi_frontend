'use client';
import Link from 'next/link';
import { StatsBar } from '@/features/landing/ProductShowcase';
import { PricingCard } from '@/features/landing/PricingCard';
import { NavBar } from './NavBar';
import { LogoIcon } from '@/shared/components/LogoIcon';
import { useLocale } from '@/features/i18n/LocaleProvider';
import type { Bi } from '@/features/i18n/landing-strings';
import {
  TRUST_DATA, FEATURES_DATA, BENEFITS_DATA,
  UPCOMING_DATA, STEPS_DATA, LS,
} from '@/features/i18n/landing-strings';

export default function LandingPage() {
  const { locale } = useLocale();
  const L = (bi: Bi) => locale === 'hi' ? bi.hi : bi.en;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden">

      {/* NAV */}
      <NavBar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {L(LS.heroTagline)}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-5 md:mb-6">
            {L(LS.heroTitleA)}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              {L(LS.heroTitleAccent)}
            </span>{' '}
            {L(LS.heroTitleB)}
          </h1>

          <p className="text-base md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 font-medium">
            {L(LS.heroSub)}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Link
              href="/doctor/setup"
              className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-blue-600/25 transition-all active:scale-[0.98] hover:-translate-y-0.5 text-center"
            >
              {L(LS.ctaRegister)}
            </Link>
            <Link
              href="/login"
              className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-base md:text-lg border-2 border-slate-200 transition-all active:scale-[0.98] hover:-translate-y-0.5 text-center"
            >
              {L(LS.ctaLogin)}
            </Link>
          </div>

          {/* Hero Visual — app UI mockup stays in English */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-1 shadow-2xl shadow-slate-900/30 max-w-3xl mx-auto">
              <div className="bg-slate-900 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                  <div className="hidden sm:block w-3 h-3 rounded-full bg-red-500/80 flex-shrink-0"></div>
                  <div className="hidden sm:block w-3 h-3 rounded-full bg-yellow-500/80 flex-shrink-0"></div>
                  <div className="hidden sm:block w-3 h-3 rounded-full bg-emerald-500/80 flex-shrink-0"></div>
                  <div className="flex-1 sm:ml-3 bg-slate-700/50 rounded-md h-5 flex items-center px-3 overflow-hidden">
                    <span className="text-slate-400 text-xs font-mono truncate">app.doctorkadost.in/reception</span>
                  </div>
                </div>
                <div className="flex min-h-[260px] md:min-h-[320px]">
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
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-500/20 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_DATA.map(t => (
              <div key={t.title.en} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                  {t.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{L(t.title)}</p>
                  <p className="text-slate-400 text-xs">{L(t.desc)}</p>
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
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{L(LS.featuresTitle)}</h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">{L(LS.featuresSub)}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES_DATA.map(f => (
              <div key={f.title.en} className={`${f.bg} rounded-3xl p-8 border border-white shadow-sm hover:shadow-lg transition-shadow group`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl bg-gradient-to-br ${f.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{L(f.title)}</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-5">{L(f.desc)}</p>
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
              {L(LS.benefitsTag)}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {L(LS.benefitsTitle)}
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto">
              {L(LS.benefitsSub)}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BENEFITS_DATA.map(b => (
              <div key={b.title.en} className={`rounded-3xl border p-6 ${b.color} flex flex-col gap-4`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{b.icon}</span>
                  <div className="text-right">
                    <div className={`text-2xl md:text-3xl font-black ${b.statColor}`}>{b.stat}</div>
                    <div className="text-slate-500 text-xs font-semibold">{L(b.statLabel)}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{L(b.title)}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{L(b.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <StatsBar />

      {/* UPCOMING FEATURES */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold mb-4 uppercase tracking-wider">
              {L(LS.upcomingTag)}
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {L(LS.upcomingTitle)}
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg mx-auto">
              {L(LS.upcomingSub)}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {UPCOMING_DATA.map(u => (
              <div key={u.title.en} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${u.iconBg} opacity-60`}></div>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${u.iconBg} flex items-center justify-center text-xl text-white shadow-sm flex-shrink-0`}>
                    {u.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${u.tagColor} uppercase tracking-wider`}>
                    {L(u.tag)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{L(u.title)}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{L(u.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SETUP GUIDE CTA */}
      <section className="py-14 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-y border-amber-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl md:text-4xl shadow-lg shadow-orange-200">
              📖
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">{L(LS.guideTag)}</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">
                {L(LS.guideTitle)}
              </h3>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                {L(LS.guideSub)}
              </p>
            </div>
            <Link
              href="/register-guide"
              className="flex-shrink-0 px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              {L(LS.guideCta)}
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
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{L(LS.howTitle)}</h2>
            <p className="text-slate-400 text-lg font-medium">{L(LS.howSub)}</p>
          </div>
          <div className="space-y-6">
            {STEPS_DATA.map((s, i) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-blue-400">
                  {s.n}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold mb-2">{L(s.title)}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{L(s.desc)}</p>
                </div>
                {i < STEPS_DATA.length - 1 && (
                  <div className="absolute left-[27px] mt-14 w-0.5 h-6 bg-white/10 hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{L(LS.testTag)}</p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{L(LS.testTitle)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { quote: LS.test1Quote, author: LS.test1Author, role: LS.test1Role, avatar: '👨‍⚕️' },
              { quote: LS.test2Quote, author: LS.test2Author, role: LS.test2Role, avatar: '👩‍⚕️' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-7 shadow-sm">
                <div className="text-amber-400 mb-3 text-lg">★★★★★</div>
                <p className="text-slate-700 font-medium leading-relaxed mb-5 text-sm md:text-base">{L(t.quote)}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{L(t.author)}</p>
                    <p className="text-slate-500 text-xs">{L(t.role)}</p>
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
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{L(LS.pricingTitle)}</h2>
          <p className="text-slate-500 text-base md:text-lg font-medium mb-10">{L(LS.pricingSub)}</p>
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
            {L(LS.ctaFinalTitle)}
          </h2>
          <p className="text-blue-100 text-lg font-medium mb-10 max-w-xl mx-auto">
            {L(LS.ctaFinalSub)}
          </p>
          <Link
            href="/doctor/setup"
            className="inline-block px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98]"
          >
            {L(LS.ctaFinalBtn)}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} />
            <span className="font-extrabold text-slate-900">DoctorKaDost</span>
          </div>
          <p className="text-slate-400 text-sm font-medium text-center">{L(LS.footerCopy)}</p>
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
