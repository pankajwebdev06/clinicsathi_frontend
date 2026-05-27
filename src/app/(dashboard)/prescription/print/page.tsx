'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinic, TemplateConfig, DEFAULT_TEMPLATE_CONFIG } from '@/core/store/clinic-context';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { Button } from '@/shared/components/ui/Button';

// Preset templates mapped to TemplateConfig shape
const PRESET_CONFIGS: Record<string, Partial<TemplateConfig>> = {
  t1: { primaryColor: '#1e40af', bgColor: '#ffffff', fontFamily: 'serif', borderStyle: 'top' },
  t2: { primaryColor: '#15803d', bgColor: '#f0fdf4', fontFamily: 'serif', borderStyle: 'top' },
  t3: { primaryColor: '#1e293b', bgColor: '#f8fafc', fontFamily: 'sans', borderStyle: 'full' },
  t4: { primaryColor: '#9f1239', bgColor: '#fff1f2', fontFamily: 'serif', borderStyle: 'top' },
  t5: { primaryColor: '#0f766e', bgColor: '#f0fdfa', fontFamily: 'sans', borderStyle: 'top' },
};

function formatTime(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

interface Patient { name: string; age: string; gender: string; symptoms: string; token: string; mobile: string; bp: string; weight: string; temperature: string; pulse: string; }

function PrescriptionSheet({ cfg, clinic, patient }: {
  cfg: TemplateConfig;
  clinic: ReturnType<typeof useClinic>['clinic'];
  patient: Patient;
}) {
  const c = cfg.primaryColor;
  const font = cfg.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, system-ui, sans-serif';
  const timings = `${formatTime(clinic.morningStart)}–${formatTime(clinic.morningEnd)} | ${formatTime(clinic.eveningStart)}–${formatTime(clinic.eveningEnd)}`;

  const borderStyle: React.CSSProperties =
    cfg.borderStyle === 'top' ? { borderTop: `6px solid ${c}` } :
    cfg.borderStyle === 'full' ? { border: `2px solid ${c}` } : {};

  return (
    <div style={{ ...borderStyle, background: cfg.bgColor, width: '100%', minHeight: '100vh', fontFamily: font, boxSizing: 'border-box' }}>

      {/* ===== HEADER ===== */}
      {cfg.letterheadUrl ? (
        /* Custom letterhead image — replaces text header */
        <div style={{ borderBottom: `2px solid ${c}`, textAlign: 'center', padding: '8px 24px', background: 'white' }}>
          <img src={cfg.letterheadUrl} alt="Clinic Letterhead" style={{ maxHeight: 90, maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      ) : (
        /* Text-based header */
        <div>
          <div style={{ background: c, color: 'white', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {cfg.header.showClinicName && <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>{clinic.clinicName}</div>}
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                {cfg.header.showPhone && clinic.phone && `📞 ${clinic.phone}`}
                {cfg.header.showAddress && clinic.address && ` | ${clinic.address}`}
              </div>
              {cfg.header.customLine && <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>{cfg.header.customLine}</div>}
            </div>
            {cfg.header.showTimings && (
              <div style={{ textAlign: 'right', fontSize: 11, opacity: 0.9 }}>
                <div>🕐 {timings}</div>
                {clinic.offDays.length > 0 && <div>Off: {clinic.offDays.join(', ')}</div>}
              </div>
            )}
          </div>

          <div style={{ padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${c}` }}>
            <div>
              {cfg.header.showDoctorName && <div style={{ fontSize: 17, fontWeight: 800, color: c }}>{clinic.doctorName}</div>}
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                {cfg.header.showDegree && clinic.degree}{cfg.header.showDegree && cfg.header.showSpecialization && ' | '}
                {cfg.header.showSpecialization && clinic.specialization}
                {clinic.experience && ` | ${clinic.experience} yrs exp`}
              </div>
              {cfg.header.showMCI && clinic.mciNumber && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Reg. No: {clinic.mciNumber}</div>}
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'right' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      )}

      {/* Patient Details */}
      <div style={{ padding: '10px 24px', background: '#f8fafc', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, borderBottom: `1px solid ${c}33` }}>
        {[['Patient Name', patient.name], ['Age / Gender', `${patient.age} yrs / ${patient.gender}`], ['Token No.', patient.token], ['Mobile', `+91 ${patient.mobile}`]].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Arial, sans-serif' }}>{k}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'Arial, sans-serif', marginTop: 2 }}>{v || '—'}</div>
          </div>
        ))}
      </div>

      {/* Vitals + Symptoms */}
      <div style={{ padding: '8px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr', gap: 8, background: 'white', borderBottom: `2px solid ${c}` }}>
        {[['BP', patient.bp], ['Weight', patient.weight ? `${patient.weight} kg` : ''], ['Temp', patient.temperature], ['Pulse', patient.pulse ? `${patient.pulse} bpm` : '']].map(([k, v]) => (
          <div key={k} style={{ background: `${c}10`, borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9ca3af', fontFamily: 'Arial, sans-serif' }}>{k}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: 'Arial, sans-serif' }}>{v || '—'}</div>
          </div>
        ))}
        <div style={{ background: '#fef9c3', borderRadius: 6, padding: '6px 10px' }}>
          <div style={{ fontSize: 9, color: '#9ca3af', fontFamily: 'Arial, sans-serif' }}>Chief Complaint</div>
          <div style={{ fontSize: 11, color: '#92400e', fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>{patient.symptoms || '—'}</div>
        </div>
      </div>

      {/* ===== Rx WRITING AREA ===== */}
      <div style={{ padding: '16px 24px 0', minHeight: '56vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: c, fontFamily: 'Georgia, serif' }}>℞</span>
          <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prescription</span>
          <div style={{ flex: 1, height: 1, background: `${c}30` }} />
        </div>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${c}18`, height: 32 }} />
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ padding: '10px 24px', borderTop: `1.5px solid ${c}40`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
        <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'Arial, sans-serif', maxWidth: '65%' }}>
          {cfg.footer.customText
            ? cfg.footer.customText
            : cfg.footer.showPoweredBy
              ? 'Generated via DoctorKaDost. The prescribing doctor is solely responsible for clinical decisions.'
              : ''}
          {cfg.footer.followUpText && <><br />{cfg.footer.followUpText}</>}
          <br />Printed: {new Date().toLocaleString('en-IN')}
        </div>
        {cfg.footer.showSignature && (
          <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'Arial, sans-serif', textAlign: 'right' }}>
            <div style={{ marginBottom: 20 }}>&nbsp;</div>
            <div style={{ borderTop: '1px solid #9ca3af', paddingTop: 4, minWidth: 140 }}>Doctor&apos;s Signature</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrintPage() {
  const params = useSearchParams();
  const { clinic } = useClinic();
  const [isPrinting, setIsPrinting] = useState(false);

  const patient: Patient = {
    name: params.get('name') ?? '',
    age: params.get('age') ?? '',
    gender: params.get('gender') ?? '',
    symptoms: params.get('symptoms') ?? '',
    token: params.get('token') ?? '',
    mobile: params.get('mobile') ?? '',
    bp: params.get('bp') ?? '',
    weight: params.get('weight') ?? '',
    temperature: params.get('temperature') ?? '',
    pulse: params.get('pulse') ?? '',
  };

  // Resolve the active template config
  // Custom: use clinic.templateConfig; Presets: merge preset values over defaults
  const activeCfg: TemplateConfig = clinic.selectedTemplate === 'custom' && clinic.templateConfig
    ? clinic.templateConfig
    : {
        ...DEFAULT_TEMPLATE_CONFIG,
        ...(PRESET_CONFIGS[clinic.selectedTemplate] ?? PRESET_CONFIGS['t1']),
      };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => { window.print(); setIsPrinting(false); }, 100);
  };

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            margin: 0 !important; 
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          .print-wrapper {
            height: 100vh !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>
      {/* Print-only */}
      <div className="hidden print:block print-wrapper">
        <PrescriptionSheet cfg={activeCfg} clinic={clinic} patient={patient} />
      </div>

      {/* Screen */}
      <div className="min-h-screen bg-slate-100 print:hidden">
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-5 py-4">
            {/* Breadcrumb */}
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/', icon: '🏠' },
                { label: 'Reception', href: '/reception' },
                { label: 'Print Prescription', isCurrent: true }
              ]}
            />
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Print Prescription</h1>
                <p className="text-slate-500 text-sm">
                  {patient.name} &bull; Token: <strong>{patient.token}</strong> &bull; {clinic.clinicName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-4 h-4 rounded" style={{ background: activeCfg.primaryColor }}></div>
                  <span className="text-sm font-semibold text-slate-600">
                    {clinic.selectedTemplate === 'custom' ? 'Custom Template' : `Preset ${clinic.selectedTemplate?.toUpperCase()}`}
                  </span>
                  <span className="text-xs text-slate-400">(set by doctor)</span>
                </div>
                <Button onClick={handlePrint} loading={isPrinting} icon="🖨️" size="lg">
                  Print Prescription
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {clinic.selectedTemplate === 'custom' ? 'Custom template' : 'Preset theme'} selected by doctor &mdash; to change, go to Settings &rarr; Prescription Template.
            </p>
            <span className="text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">A4 Print Size</span>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <PrescriptionSheet cfg={activeCfg} clinic={clinic} patient={patient} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function PrescriptionPrintPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">Loading...</div>}>
      <PrintPage />
    </Suspense>
  );
}
