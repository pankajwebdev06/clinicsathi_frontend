import Link from 'next/link';
import React from 'react';
import { LogoIcon } from '@/shared/components/LogoIcon';

export const metadata = {
  title: 'How to Register Your Clinic on DoctorKaDost | 5-Minute Setup',
  description:
    'Register your clinic on DoctorKaDost in 5 simple steps. OTP-based login, no passwords. Built for Indian clinics.',
};

// ─── Reusable mock UI primitives ────────────────────────────────────────────

function MockField({ label, value, half }: { label: string; value: string; half?: boolean }) {
  return (
    <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
      <p style={{ fontSize: 10, fontWeight: 600, color: '#64748b', marginBottom: 3 }}>{label}</p>
      <div style={{
        background: 'white', border: '1.5px solid #bfdbfe',
        borderRadius: 8, padding: '7px 10px',
        fontSize: 11, fontWeight: 600, color: '#1e293b',
      }}>
        {value}
      </div>
    </div>
  );
}

function MockLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10, fontWeight: 600, color: '#64748b', marginBottom: 3 }}>{children}</p>;
}

function MockSelect({ value }: { value: string }) {
  return (
    <div style={{
      background: 'white', border: '1.5px solid #bfdbfe',
      borderRadius: 8, padding: '7px 10px',
      fontSize: 11, fontWeight: 600, color: '#1e293b',
      display: 'flex', justifyContent: 'space-between',
    }}>
      <span>{value}</span><span style={{ color: '#94a3b8' }}>▾</span>
    </div>
  );
}

function MockStepDots({ active, total = 4 }: { active: number; total?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n < active;
        const cur = n === active;
        return (
          <React.Fragment key={n}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: done ? '#10b981' : cur ? '#2563eb' : 'white',
              border: done ? 'none' : cur ? 'none' : '2px solid #e2e8f0',
              color: (done || cur) ? 'white' : '#94a3b8',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done ? '✓' : n}
            </div>
            {i < total - 1 && (
              <div style={{ height: 2, width: 20, borderRadius: 2, background: done ? '#10b981' : '#e2e8f0' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function MockCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#f1f5f9', borderRadius: 14, border: '1px solid #e2e8f0',
      overflow: 'hidden', maxWidth: 340, width: '100%',
      boxShadow: '0 4px 24px 0 rgba(15,23,42,0.08)',
    }}>
      {/* Mini browser top bar */}
      <div style={{ background: '#1e293b', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
        <div style={{ flex: 1, background: '#334155', borderRadius: 4, height: 14, display: 'flex', alignItems: 'center', paddingLeft: 6, marginLeft: 4 }}>
          <span style={{ color: '#94a3b8', fontSize: 9 }}>app.doctorkadost.in/doctor/setup</span>
        </div>
      </div>

      {/* App header */}
      <div style={{ background: 'white', padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
            <line x1="7" y1="2.5" x2="7" y2="6.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
            <line x1="17" y1="2.5" x2="17" y2="6.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M7 6.5 Q7 13.5 12 13.5 Q17 13.5 17 6.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" fill="none" />
            <line x1="12" y1="13.5" x2="12" y2="17.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M12 17.5 Q12 21.5 16.5 21.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" fill="none" />
            <circle cx="16.5" cy="21.5" r="2.1" stroke="white" strokeWidth="1.9" fill="none" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Setup Your Clinic</p>
          <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>Complete 4 quick steps</p>
        </div>
      </div>

      {/* Step dots */}
      <div style={{ background: 'white', paddingTop: 12, paddingBottom: 4 }}>
        <MockStepDots active={step} />
      </div>

      {/* Form card */}
      <div style={{ background: 'white', margin: '0 10px 10px', borderRadius: 12, border: '1px solid #f1f5f9', padding: '14px 14px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>{title}</p>
        {children}
        <div style={{
          background: '#2563eb', borderRadius: 8, padding: '9px',
          textAlign: 'center', color: 'white', fontSize: 11, fontWeight: 700,
          marginTop: 14,
        }}>
          {step === 4 ? '🚀 Finish & Open Dashboard' : 'Continue →'}
        </div>
      </div>
    </div>
  );
}

// ─── Step mockups ─────────────────────────────────────────────────────────────

function Step1Mockup() {
  return (
    <MockCard step={1} title="Your Professional Details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MockField label="Full Name (with Dr. prefix)" value="Dr. Anil Kumar Mehta" />
        <MockField label="Mobile Number (Login ID)" value="9876543210" />
        <div style={{ display: 'flex', gap: 8 }}>
          <MockField label="Degree(s)" value="MBBS, MD" half />
          <MockField label="Experience (yrs)" value="12" half />
        </div>
        <div>
          <MockLabel>Specialization</MockLabel>
          <MockSelect value="General Physician" />
        </div>
      </div>
    </MockCard>
  );
}

function Step2Mockup() {
  return (
    <MockCard step={2} title="Clinic Information">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MockField label="Clinic Name" value="Mehta Health Clinic" />
        <div style={{ display: 'flex', gap: 8 }}>
          <MockField label="City" value="New Delhi" half />
          <MockField label="Contact (+91)" value="9811234567" half />
        </div>
        <MockField label="MCI / NMC Number (optional)" value="DL-MCI-98765" />
        <div>
          <MockLabel>Full Clinic Address</MockLabel>
          <div style={{
            background: 'white', border: '1.5px solid #bfdbfe',
            borderRadius: 8, padding: '7px 10px', fontSize: 11,
            fontWeight: 600, color: '#1e293b', lineHeight: 1.5,
          }}>
            Shop No. 12, Laxmi Nagar<br />New Delhi — 110092
          </div>
          <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 3 }}>Appears on your public profile &amp; prescriptions</p>
        </div>
      </div>
    </MockCard>
  );
}

function Step3Mockup() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const offDays = ['Sun'];
  return (
    <MockCard step={3} title="Clinic Timings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10, border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 8 }}>🌅 Morning Session</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Opens', '09:00 AM'], ['Closes', '01:00 PM']].map(([lbl, val]) => (
              <div key={lbl} style={{ flex: 1 }}>
                <p style={{ fontSize: 9, color: '#94a3b8', marginBottom: 3 }}>{lbl}</p>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10, border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 8 }}>🌆 Evening Session</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Opens', '05:00 PM'], ['Closes', '08:00 PM']].map(([lbl, val]) => (
              <div key={lbl} style={{ flex: 1 }}>
                <p style={{ fontSize: 9, color: '#94a3b8', marginBottom: 3 }}>{lbl}</p>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 6 }}>🚫 Off / Holiday Days</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {days.map(d => (
              <div key={d} style={{
                padding: '4px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: offDays.includes(d) ? '#fee2e2' : '#f1f5f9',
                color: offDays.includes(d) ? '#b91c1c' : '#64748b',
                border: offDays.includes(d) ? '1.5px solid #fca5a5' : '1.5px solid transparent',
              }}>
                {d}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>Red = clinic closed that day. Tap to toggle.</p>
        </div>
      </div>
    </MockCard>
  );
}

function Step4Mockup() {
  return (
    <MockCard step={4} title="Add Reception Staff">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 10, color: '#64748b', marginTop: -6 }}>Add staff by mobile — they log in using it</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', flex: 1, background: 'white', border: '1.5px solid #bfdbfe', borderRadius: 8, overflow: 'hidden', alignItems: 'center' }}>
            <span style={{ padding: '0 8px', fontSize: 10, fontWeight: 700, color: '#64748b', borderRight: '1px solid #e2e8f0' }}>+91</span>
            <span style={{ padding: '7px 8px', fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Staff mobile…</span>
          </div>
          <div style={{ background: '#1e293b', color: 'white', borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 700 }}>Add</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '8px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>1</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>+91 9823456789</p>
              <p style={{ fontSize: 9, color: '#94a3b8' }}>Receptionist</p>
            </div>
          </div>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>✕</span>
        </div>
        <p style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center' }}>You can skip and add staff later from Settings</p>
      </div>
    </MockCard>
  );
}

function Step5Mockup() {
  return (
    <div style={{
      background: '#f1f5f9', borderRadius: 14, border: '1px solid #e2e8f0',
      overflow: 'hidden', maxWidth: 340, width: '100%',
      boxShadow: '0 4px 24px 0 rgba(15,23,42,0.08)',
    }}>
      <div style={{ background: '#1e293b', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
        <div style={{ flex: 1, background: '#334155', borderRadius: 4, height: 14, display: 'flex', alignItems: 'center', paddingLeft: 6, marginLeft: 4 }}>
          <span style={{ color: '#94a3b8', fontSize: 9 }}>app.doctorkadost.in/reception</span>
        </div>
      </div>
      <div style={{ background: '#0f172a', padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, minHeight: 180 }}>
          {/* Sidebar */}
          <div style={{ width: 34, background: '#1e293b', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4, padding: 6 }}>
            {(['🗂️', '📋', '⚙️'] as const).map((icon, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: i === 0 ? '#2563eb' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                {icon}
              </div>
            ))}
          </div>
          {/* Main */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: '#1e293b', borderRadius: 8, padding: 10 }}>
              <p style={{ fontSize: 9, color: '#64748b', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Patient Check-In</p>
              <div style={{ background: '#0f172a', borderRadius: 6, padding: '6px 8px', marginBottom: 6 }}>
                <p style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>Mobile Number</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>+91</span>
                  <span style={{ fontSize: 11, color: 'white', fontWeight: 800, letterSpacing: 1 }}>9876543210</span>
                  <div style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', border: '2px solid #3b82f6', borderTopColor: 'transparent' }} />
                </div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700 }}>● Patient Found</span>
                  <span style={{ background: '#0f172a', color: 'white', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>M-007</span>
                </div>
                <p style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>Rahul Sharma</p>
                <p style={{ fontSize: 9, color: '#94a3b8' }}>34 yrs • Male • 3 prev visits</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, background: '#2563eb', borderRadius: 6, padding: '7px', textAlign: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>Generate Token</div>
              <div style={{ flex: 1, background: '#1e293b', borderRadius: 6, padding: '7px', textAlign: 'center', color: '#94a3b8', fontSize: 9, fontWeight: 700 }}>Print Slip</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page data ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01', title: 'Tell us about you',
    sub: 'Doctor name, mobile number (your login ID), degree, specialization, and years of experience.',
    mockup: <Step1Mockup />,
  },
  {
    n: '02', title: 'Add your clinic',
    sub: 'Clinic name, city, phone, address, and optional MCI/NMC registration number (appears on prescriptions).',
    mockup: <Step2Mockup />,
  },
  {
    n: '03', title: 'Set timings',
    sub: 'Morning and evening sessions. Mark weekly off-days. Patients see this on your public profile.',
    mockup: <Step3Mockup />,
  },
  {
    n: '04', title: 'Add reception staff',
    sub: 'Just their mobile numbers — they log in instantly with OTP. Skippable, add anytime from Settings.',
    mockup: <Step4Mockup />,
  },
  {
    n: '05', title: 'Open your dashboard',
    sub: "You're all set. Your reception desk is live — start checking patients in immediately.",
    mockup: <Step5Mockup />,
  },
];

const BENEFITS = [
  { icon: '⏱️',  title: 'Live in 5 minutes',       sub: 'No installation. Works on any phone or laptop browser.' },
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
            <LogoIcon size={32} />
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
            Five short steps. No installation. No passwords. The screens below show exactly what you&apos;ll see at each step.
          </p>
        </div>
      </section>

      {/* 5 Steps with mockups */}
      <section className="py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">The 5-step setup</h2>
            <p className="text-slate-500 text-sm md:text-base">Each step takes under a minute. Example data is filled in so you know what to enter.</p>
          </div>

          <ol className="space-y-10 md:space-y-14">
            {STEPS.map((s) => (
              <li key={s.n} className="flex flex-col gap-6">
                {/* Step header */}
                <div className="flex gap-4 md:gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white font-black text-base md:text-lg flex items-center justify-center shadow-lg shadow-blue-200">
                    {s.n}
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h3 className="font-bold text-slate-900 text-base md:text-xl leading-tight">{s.title}</h3>
                    <p className="text-slate-500 text-sm md:text-base mt-1 leading-relaxed">{s.sub}</p>
                  </div>
                </div>

                {/* Screen mockup */}
                <div className="flex justify-center md:justify-start md:pl-[72px]">
                  <div className="w-full" style={{ maxWidth: 340 }}>
                    {s.mockup}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
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
            <LogoIcon size={28} />
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
