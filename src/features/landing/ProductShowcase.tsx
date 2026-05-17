'use client';
import React from 'react';

// Visual showcases of new features — pure CSS mockups, no images, fast on 3G.
// Component-first: this file owns the marketing visualisations so the landing
// page stays under control. Add new feature cards here without touching the
// main page.tsx layout.

function UploadProgressMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-slate-900 text-sm">Doctor Photo Preview</h4>
        <span className="text-slate-400 text-lg leading-none">×</span>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 h-32 mb-3 flex items-center justify-center text-5xl">
        👨‍⚕️
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-600">Uploading...</span>
          <span className="text-blue-600">68%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: '68%' }} />
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
            <div key={p} className={`w-1.5 h-1.5 rounded-full ${p <= 68 ? 'bg-blue-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PrescriptionTemplateMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-sm mx-auto">
      {/* Mini prescription preview */}
      <div className="border-t-4 border-emerald-600 bg-emerald-50/30">
        <div className="bg-emerald-600 text-white p-3">
          <div className="font-black text-xs">Mehra Health Clinic</div>
          <div className="text-[10px] opacity-90">📞 9876543210 • Mumbai</div>
        </div>
        <div className="p-3 border-b border-emerald-200/50">
          <div className="font-bold text-emerald-700 text-xs">Dr. Anil Mehra</div>
          <div className="text-[9px] text-slate-500">MBBS, MD • General Physician</div>
        </div>
        <div className="p-3 grid grid-cols-4 gap-1 bg-emerald-50/20 text-[8px]">
          {['BP', 'Wt', 'Temp', 'Pulse'].map(v => (
            <div key={v} className="bg-emerald-100/50 rounded p-1 text-center">
              <div className="text-slate-500">{v}</div>
              <div className="text-emerald-700 font-bold">—</div>
            </div>
          ))}
        </div>
        <div className="p-3">
          <div className="text-emerald-700 font-serif text-xl">℞</div>
          {[80, 60, 70, 50].map((w, i) => (
            <div key={i} className="h-0.5 bg-emerald-200 my-2" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      {/* Theme picker hint */}
      <div className="bg-slate-50 px-3 py-2 flex items-center justify-between border-t border-slate-100">
        <span className="text-[10px] font-semibold text-slate-500">5 themes + custom letterhead</span>
        <div className="flex gap-1">
          {['#1e40af', '#15803d', '#9f1239', '#0f766e', '#1e293b'].map(c => (
            <div key={c} className="w-3 h-3 rounded-full ring-1 ring-white" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicProfileMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-sm mx-auto">
      {/* Browser bar */}
      <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <div className="flex-1 bg-white rounded-md px-2 py-1 text-[9px] text-slate-500 truncate font-mono">
          clinicsathi.in/doctor/dr-anil-mehra-cardiologist-mumbai
        </div>
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 p-4 text-white">
        <div className="flex gap-3 items-start">
          <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl flex-shrink-0">👨‍⚕️</div>
          <div className="min-w-0">
            <div className="font-black text-sm leading-tight">Dr. Anil Mehra</div>
            <div className="text-[10px] opacity-90 font-semibold">Cardiologist • Mumbai</div>
            <div className="text-[9px] opacity-80 mt-0.5">12 years experience</div>
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="p-3 grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <div className="text-[8px] uppercase text-slate-400 font-bold">Fee</div>
          <div className="font-bold text-slate-800">₹500</div>
        </div>
        <div>
          <div className="text-[8px] uppercase text-slate-400 font-bold">MCI No.</div>
          <div className="font-bold text-slate-800">MH-12345</div>
        </div>
      </div>
      {/* CTA */}
      <div className="px-3 pb-3">
        <div className="bg-blue-600 rounded-lg py-2 text-center text-white text-[10px] font-bold">
          📞 Call Now
        </div>
      </div>
      <div className="bg-emerald-50 border-t border-emerald-100 px-3 py-1.5 text-[9px] text-emerald-700 font-semibold text-center">
        ✓ Indexed by Google • SEO optimized
      </div>
    </div>
  );
}

function RealtimeQueueMockup() {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden max-w-sm mx-auto">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">Live Queue</h4>
          <div className="text-[10px] text-slate-400">WebSocket • All devices sync</div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>
      <div className="p-3 space-y-2">
        {[
          { token: 'M-001', name: 'Rahul Sharma', status: 'in_consultation', color: 'bg-blue-500/20 text-blue-300', label: 'In Room' },
          { token: 'M-002', name: 'Priya Patel', status: 'waiting', color: 'bg-amber-500/20 text-amber-300', label: 'Waiting' },
          { token: 'M-003', name: 'Anjali Kumar', status: 'waiting', color: 'bg-amber-500/20 text-amber-300', label: 'Waiting' },
          { token: 'M-004', name: 'Vikram Singh', status: 'completed', color: 'bg-emerald-500/20 text-emerald-300', label: 'Done' },
        ].map(p => (
          <div key={p.token} className="bg-slate-800/50 rounded-lg p-2.5 flex items-center gap-2.5 border border-slate-700/50">
            <span className="font-black text-white text-xs w-12 flex-shrink-0">{p.token}</span>
            <span className="flex-1 text-slate-300 text-xs truncate font-medium">{p.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${p.color}`}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SHOWCASES = [
  {
    title: 'Smart image uploads',
    sub: 'Progress bar, preview popup, retake or confirm — for every photo across the app.',
    mockup: <UploadProgressMockup />,
    tag: 'NEW',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Custom prescription pad',
    sub: 'Upload your existing letterhead, pick from 5 medical themes, or build your own. A4 print-ready.',
    mockup: <PrescriptionTemplateMockup />,
    tag: 'NEW',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Public SEO profile',
    sub: 'Every clinic gets a Google-indexed page with photos, services, and "Call now" CTA.',
    mockup: <PublicProfileMockup />,
    tag: 'SEO',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Real-time queue sync',
    sub: 'WebSocket-powered. Doctor calls a patient → reception screen updates instantly. No refresh needed.',
    mockup: <RealtimeQueueMockup />,
    tag: 'LIVE',
    tagColor: 'bg-rose-100 text-rose-700',
  },
];

export function ProductShowcase() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-4">
            ✨ Recently shipped
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            See what's inside
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto">
            Real screenshots of features your patients and staff use every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {SHOWCASES.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center text-center group">
              {/* Mockup */}
              <div className="relative w-full mb-6 transition-transform group-hover:-translate-y-1 duration-300">
                {/* Glow */}
                <div className="absolute inset-x-0 -bottom-6 h-12 bg-blue-200/40 blur-2xl rounded-full -z-10" />
                {s.mockup}
              </div>

              {/* Caption */}
              <div className="max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${s.tagColor}`}>
                    {s.tag}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats / Social Proof Bar ────────────────────────────────────────────────
export function StatsBar() {
  const STATS = [
    { value: '< 30s', label: 'Patient check-in time' },
    { value: '0', label: 'Training required' },
    { value: '99.9%', label: 'Uptime' },
    { value: '2G', label: 'Minimum network needed' },
  ];
  return (
    <section className="py-12 md:py-16 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 mb-1">
                {s.value}
              </div>
              <div className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
