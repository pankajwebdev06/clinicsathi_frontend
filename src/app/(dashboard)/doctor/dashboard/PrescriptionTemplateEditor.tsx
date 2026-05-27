'use client';
import React, { useState, useRef, useCallback } from 'react';
import { useClinic, TemplateConfig, DEFAULT_TEMPLATE_CONFIG } from '@/core/store/clinic-context';
import { ImageUploadWithPreview, uploadWithProgress } from '@/shared/components/ImageUploadWithPreview';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');

// ─── 5 curated medical-grade preset themes ───────────────────────────────────
const PRESETS = [
  {
    id: 't1',
    name: 'Classic Blue',
    desc: 'Trusted, professional — most common in India',
    primaryColor: '#1e40af',
    bgColor: '#ffffff',
    fontFamily: 'serif' as const,
    borderStyle: 'top' as const,
  },
  {
    id: 't2',
    name: 'Forest Green',
    desc: 'Calm, wellness — ideal for general & Ayurvedic',
    primaryColor: '#15803d',
    bgColor: '#f0fdf4',
    fontFamily: 'serif' as const,
    borderStyle: 'top' as const,
  },
  {
    id: 't3',
    name: 'Slate Professional',
    desc: 'Modern, corporate — specialist clinics & hospitals',
    primaryColor: '#1e293b',
    bgColor: '#f8fafc',
    fontFamily: 'sans' as const,
    borderStyle: 'full' as const,
  },
  {
    id: 't4',
    name: 'Warm Maroon',
    desc: 'Traditional Indian feel — gynaecology, general',
    primaryColor: '#9f1239',
    bgColor: '#fff1f2',
    fontFamily: 'serif' as const,
    borderStyle: 'top' as const,
  },
  {
    id: 't5',
    name: 'Teal Medical',
    desc: 'Clean, hospital-grade — paediatrics, dentistry',
    primaryColor: '#0f766e',
    bgColor: '#f0fdfa',
    fontFamily: 'sans' as const,
    borderStyle: 'top' as const,
  },
];

// ─── Mini prescription preview card ─────────────────────────────────────────
function MiniPreview({ color, bg, name }: { color: string; bg: string; name: string }) {
  return (
    <div style={{ background: bg, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', width: '100%' }}>
      <div style={{ background: color, padding: '6px 8px' }}>
        <div style={{ background: 'rgba(255,255,255,0.3)', height: 4, borderRadius: 2, width: '70%', marginBottom: 3 }} />
        <div style={{ background: 'rgba(255,255,255,0.2)', height: 3, borderRadius: 2, width: '50%' }} />
      </div>
      <div style={{ padding: '6px 8px' }}>
        <div style={{ color, fontWeight: 900, fontSize: 11, marginBottom: 4 }}>℞</div>
        {[80, 60, 70].map((w, i) => (
          <div key={i} style={{ height: 2, background: `${color}25`, borderRadius: 1, marginBottom: 3, width: `${w}%` }} />
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${color}30`, padding: '4px 8px', background: `${color}08` }}>
        <div style={{ height: 2, background: `${color}20`, borderRadius: 1, width: '80%' }} />
      </div>
    </div>
  );
}

// ─── Full prescription preview (scaled) ─────────────────────────────────────
function LivePreview({ config, clinic }: { config: TemplateConfig; clinic: ReturnType<typeof useClinic>['clinic'] }) {
  const c = config.primaryColor;
  const font = config.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, system-ui, sans-serif';
  const borderStyle = config.borderStyle === 'top'
    ? { borderTop: `6px solid ${c}` }
    : config.borderStyle === 'full'
    ? { border: `2px solid ${c}` }
    : {};

  return (
    <div style={{
      background: config.bgColor, fontFamily: font,
      borderRadius: 8, overflow: 'hidden',
      ...borderStyle,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontSize: '9px',
    }}>
      {/* Header */}
      {config.letterheadUrl ? (
        <div style={{ borderBottom: `2px solid ${c}`, textAlign: 'center', padding: 4 }}>
          <img src={config.letterheadUrl} alt="Letterhead" style={{ maxHeight: 50, maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      ) : (
        <div style={{ background: c, color: 'white', padding: '7px 10px' }}>
          {config.header.showClinicName && <div style={{ fontWeight: 900, fontSize: 11 }}>{clinic.clinicName}</div>}
          <div style={{ opacity: 0.85, fontSize: 8, marginTop: 1 }}>
            {config.header.showPhone && clinic.phone && `📞 ${clinic.phone}`}
            {config.header.showAddress && clinic.address && ` | ${clinic.address}`}
          </div>
        </div>
      )}

      {/* Doctor info row */}
      <div style={{ padding: '5px 10px', borderBottom: `1px solid ${c}30`, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {config.header.showDoctorName && <div style={{ fontWeight: 800, color: c, fontSize: 10 }}>{clinic.doctorName}</div>}
          {config.header.showDegree && <div style={{ color: '#6b7280', fontSize: 7 }}>{clinic.degree}</div>}
          {config.header.showSpecialization && <div style={{ color: '#6b7280', fontSize: 7 }}>{clinic.specialization}</div>}
          {config.header.showMCI && clinic.mciNumber && <div style={{ color: '#9ca3af', fontSize: 7 }}>Reg: {clinic.mciNumber}</div>}
          {config.header.customLine && <div style={{ color: '#6b7280', fontSize: 7 }}>{config.header.customLine}</div>}
        </div>
        <div style={{ textAlign: 'right', color: '#9ca3af', fontSize: 7 }}>
          {new Date().toLocaleDateString('en-IN')}
        </div>
      </div>

      {/* Patient row */}
      <div style={{ padding: '4px 10px', background: `${c}08`, borderBottom: `1px solid ${c}20`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
        {['Patient Name', 'Age/Gender', 'Token', 'Mobile'].map(k => (
          <div key={k}>
            <div style={{ color: '#9ca3af', fontSize: 6, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ color: '#374151', fontWeight: 700, fontSize: 8 }}>—</div>
          </div>
        ))}
      </div>

      {/* Vitals */}
      <div style={{ padding: '4px 10px', display: 'flex', gap: 4, borderBottom: `2px solid ${c}` }}>
        {['BP', 'Wt', 'Temp', 'Pulse'].map(v => (
          <div key={v} style={{ flex: 1, background: `${c}12`, borderRadius: 4, padding: '3px 4px', textAlign: 'center' }}>
            <div style={{ color: '#9ca3af', fontSize: 6 }}>{v}</div>
            <div style={{ color: c, fontWeight: 700, fontSize: 7 }}>—</div>
          </div>
        ))}
        <div style={{ flex: 2, background: '#fef9c3', borderRadius: 4, padding: '3px 6px' }}>
          <div style={{ color: '#9ca3af', fontSize: 6 }}>Chief Complaint</div>
          <div style={{ color: '#92400e', fontSize: 7, fontWeight: 600 }}>—</div>
        </div>
      </div>

      {/* Rx area */}
      <div style={{ padding: '6px 10px', minHeight: 60 }}>
        <div style={{ color: c, fontWeight: 900, fontSize: 14, fontFamily: 'Georgia, serif', marginBottom: 4 }}>℞</div>
        {[90, 70, 80, 65, 75].map((w, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${c}18`, height: 11, width: `${w}%` }} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '5px 10px', borderTop: `1px solid ${c}30`, display: 'flex', justifyContent: 'space-between', background: `${c}05` }}>
        <div style={{ color: '#9ca3af', fontSize: 6 }}>
          {config.footer.customText || (config.footer.showPoweredBy ? 'DoctorKaDost' : '')}
        </div>
        {config.footer.showSignature && (
          <div style={{ color: '#9ca3af', fontSize: 6, borderTop: '1px solid #cbd5e1', paddingTop: 2, minWidth: 60, textAlign: 'center' }}>
            Signature
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toggle switch component ─────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0' }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 36, height: 20, borderRadius: 10, flexShrink: 0,
          background: value ? '#2563eb' : '#cbd5e1',
          position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 19 : 3,
          width: 14, height: 14, borderRadius: '50%', background: 'white',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
    </label>
  );
}

// ─── Color palette ────────────────────────────────────────────────────────────
const COLOR_PALETTE = [
  '#1e40af', '#15803d', '#1e293b', '#9f1239', '#0f766e',
  '#7c3aed', '#b45309', '#0369a1', '#be123c', '#166534',
  '#374151', '#4338ca', '#0e7490', '#065f46', '#831843',
];

// ─── Main component ──────────────────────────────────────────────────────────
export function PrescriptionTemplateEditor() {
  const { clinic, setClinic } = useClinic();
  const [activePreset, setActivePreset] = useState<string>(clinic.selectedTemplate || 't1');
  const [showCustomEditor, setShowCustomEditor] = useState(activePreset === 'custom');
  const [config, setConfig] = useState<TemplateConfig>(
    clinic.templateConfig ?? { ...DEFAULT_TEMPLATE_CONFIG }
  );
  const [referenceFile, setReferenceFile] = useState<string | null>(
    clinic.templateConfig?.referenceImageUrl ?? null
  );
  const [extracting, setExtracting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateConfig = useCallback((patch: Partial<TemplateConfig>) => {
    setConfig(prev => ({ ...prev, ...patch }));
  }, []);

  const updateHeader = useCallback((patch: Partial<TemplateConfig['header']>) => {
    setConfig(prev => ({ ...prev, header: { ...prev.header, ...patch } }));
  }, []);

  const updateFooter = useCallback((patch: Partial<TemplateConfig['footer']>) => {
    setConfig(prev => ({ ...prev, footer: { ...prev.footer, ...patch } }));
  }, []);

  // Extract dominant color from uploaded reference image using Canvas
  const extractColorsFromImage = (imgUrl: string) => {
    setExtracting(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) { setExtracting(false); return; }
      const ctx = canvas.getContext('2d');
      if (!ctx) { setExtracting(false); return; }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample top 20% of image (header area) for dominant color
      const headerData = ctx.getImageData(0, 0, canvas.width, Math.floor(canvas.height * 0.2));
      const pixels = headerData.data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < pixels.length; i += 16) {
        const pr = pixels[i], pg = pixels[i + 1], pb = pixels[i + 2];
        // Skip near-white and near-black pixels
        const brightness = (pr + pg + pb) / 3;
        if (brightness > 30 && brightness < 220) {
          r += pr; g += pg; b += pb; count++;
        }
      }
      if (count > 0) {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const extracted = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        updateConfig({ primaryColor: extracted });
      }
      setExtracting(false);
    };
    img.onerror = () => setExtracting(false);
    img.src = imgUrl;
  };

  // Persist the doctor's template choice to the backend so it follows them
  // across devices. Fire-and-forget — local state is the source of truth for
  // the current session, the backend write is best-effort.
  const persistToBackend = async (selectedTemplate: string, templateConfig?: TemplateConfig) => {
    try {
      const token = localStorage.getItem('auth_token');
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (!token || !userInfo.clinic_id) return;
      await fetch(`${API_BASE}/api/v1/auth/clinics/${userInfo.clinic_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          selected_template: selectedTemplate,
          template_config: templateConfig ? JSON.stringify(templateConfig) : null,
        }),
      });
    } catch (err) {
      console.warn('[PrescriptionTemplate] backend save failed (kept locally):', err);
    }
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    setShowCustomEditor(false);
    setConfig(prev => ({
      ...prev,
      primaryColor: preset.primaryColor,
      bgColor: preset.bgColor,
      fontFamily: preset.fontFamily,
      borderStyle: preset.borderStyle,
    }));
    setClinic({ ...clinic, selectedTemplate: preset.id });
    persistToBackend(preset.id, undefined);
  };

  const handleCustomSelect = () => {
    setActivePreset('custom');
    setShowCustomEditor(true);
    setClinic({ ...clinic, selectedTemplate: 'custom', templateConfig: config });
    // No backend save yet — wait for explicit "Save Custom Template" click
  };

  const handleSaveCustom = async () => {
    setClinic({ ...clinic, selectedTemplate: 'custom', templateConfig: config });
    await persistToBackend('custom', config);
    alert('Custom template saved — synced to your clinic account.');
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-1">🖨️ Prescription Template</h3>
        <p className="text-slate-500 text-sm mb-6">
          Choose a preset theme or build a custom template that matches your existing prescription pad.
        </p>

        <div className="flex flex-col xl:flex-row gap-8">

          {/* LEFT: Template picker + editor */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ── Preset Templates ─────────────────────── */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Choose a Theme</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all ${
                      activePreset === preset.id && !showCustomEditor
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-2">
                      <MiniPreview color={preset.primaryColor} bg={preset.bgColor} name={preset.name} />
                    </div>
                    <p className={`text-xs font-bold ${activePreset === preset.id && !showCustomEditor ? 'text-blue-700' : 'text-slate-700'}`}>
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{preset.desc}</p>
                    {activePreset === preset.id && !showCustomEditor && (
                      <p className="text-[10px] text-blue-500 font-semibold mt-1">✓ Active</p>
                    )}
                  </button>
                ))}

                {/* Custom Template card */}
                <button
                  onClick={handleCustomSelect}
                  className={`text-left p-3 rounded-2xl border-2 transition-all ${
                    activePreset === 'custom'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-dashed border-slate-300 bg-white hover:border-purple-400'
                  }`}
                >
                  <div className="mb-2 aspect-[3/2] rounded-lg border border-dashed border-slate-200 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                    <div className="text-center">
                      <div className="text-xl">✏️</div>
                      <p className="text-[9px] font-bold text-purple-600 mt-1">Custom</p>
                    </div>
                  </div>
                  <p className={`text-xs font-bold ${activePreset === 'custom' ? 'text-purple-700' : 'text-slate-700'}`}>
                    My Prescription
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Upload your pad & customize everything
                  </p>
                  {activePreset === 'custom' && (
                    <p className="text-[10px] text-purple-500 font-semibold mt-1">✓ Active</p>
                  )}
                </button>
              </div>
            </div>

            {/* ── Custom Template Editor ────────────────── */}
            {showCustomEditor && (
              <div className="border border-purple-100 rounded-2xl bg-purple-50/30 p-5 space-y-6">

                {/* Step 1: Upload reference prescription */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-1">
                    📋 Step 1 — Upload Your Existing Prescription (Optional)
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    Upload a photo or scan of your current prescription pad. We'll extract your clinic colors automatically.
                    Accepted: JPEG, PNG, PDF (image formats for color extraction).
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Upload button */}
                    <div className="flex-1">
                      <ImageUploadWithPreview
                        id="rx-reference-upload"
                        accept="image/*"
                        label="Prescription Reference"
                        onUpload={async (file, onProgress) => {
                          const formData = new FormData();
                          formData.append('file', file);
                          const token = localStorage.getItem('auth_token') || '';
                          const data = await uploadWithProgress(
                            `${API_BASE}/api/v1/auth/upload-image`,
                            formData, token, onProgress
                          );
                          setReferenceFile(data.url);
                          updateConfig({ referenceImageUrl: data.url });
                          extractColorsFromImage(data.url);
                        }}
                      >
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-4 bg-white hover:border-purple-500 hover:bg-purple-50 transition-all text-center cursor-pointer">
                          <span className="text-2xl mb-1">📤</span>
                          <p className="text-xs font-semibold text-purple-700">Upload Prescription Image</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">JPEG / PNG — colors auto-extracted</p>
                        </div>
                      </ImageUploadWithPreview>

                      {/* PDF reference — just stored as note */}
                      <label className="mt-2 flex items-center gap-2 border border-slate-200 rounded-xl p-3 bg-white cursor-pointer hover:border-blue-300 transition-all">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) alert(`File "${f.name}" received as reference. Use the image upload above for automatic color extraction.`);
                            e.target.value = '';
                          }}
                        />
                        <span className="text-lg">📄</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">PDF / Word (Visual Reference Only)</p>
                          <p className="text-[10px] text-slate-400">Use as reference while setting up your template manually</p>
                        </div>
                      </label>
                    </div>

                    {/* Reference image preview */}
                    {referenceFile && (
                      <div className="flex-1 relative">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reference</p>
                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                          <img src={referenceFile} alt="Reference" className="w-full object-contain max-h-32" />
                          {extracting && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <p className="text-xs font-semibold text-purple-700">🎨 Extracting colors...</p>
                            </div>
                          )}
                          <button
                            onClick={() => { setReferenceFile(null); updateConfig({ referenceImageUrl: undefined }); }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                        {!extracting && (
                          <button
                            onClick={() => extractColorsFromImage(referenceFile)}
                            className="mt-1 text-[10px] font-semibold text-purple-600 hover:underline"
                          >
                            🎨 Re-extract colors
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Colors & Style */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">🎨 Step 2 — Colors & Style</p>
                  <div className="grid sm:grid-cols-2 gap-5">

                    {/* Primary color */}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">Primary / Accent Color</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {COLOR_PALETTE.map(col => (
                          <button
                            key={col}
                            onClick={() => updateConfig({ primaryColor: col })}
                            style={{ background: col, width: 24, height: 24, borderRadius: 6, border: config.primaryColor === col ? '3px solid #0f172a' : '2px solid transparent', transition: 'border 0.15s' }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={e => updateConfig({ primaryColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={e => {
                            if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) updateConfig({ primaryColor: e.target.value });
                          }}
                          className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Background color */}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">Paper Background</label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {['#ffffff', '#fffbeb', '#f0fdf4', '#f0fdfa', '#faf5ff', '#fff1f2', '#f8fafc'].map(col => (
                          <button
                            key={col}
                            onClick={() => updateConfig({ bgColor: col })}
                            style={{ background: col, width: 24, height: 24, borderRadius: 6, border: config.bgColor === col ? '3px solid #0f172a' : '2px solid #e2e8f0', transition: 'border 0.15s' }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="color" value={config.bgColor}
                          onChange={e => updateConfig({ bgColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                        />
                        <input type="text" value={config.bgColor}
                          onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) updateConfig({ bgColor: e.target.value }); }}
                          className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Font */}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">Font Style</label>
                      <div className="flex gap-2">
                        {([['serif', 'Traditional (Serif)', 'Georgia'], ['sans', 'Modern (Sans-Serif)', 'Inter']] as const).map(([val, label, ex]) => (
                          <button
                            key={val}
                            onClick={() => updateConfig({ fontFamily: val })}
                            className={`flex-1 py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${config.fontFamily === val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                          >
                            <div style={{ fontFamily: val === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif' }}>{ex}</div>
                            <div className="text-[10px] font-normal mt-0.5 text-slate-400">{label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border style */}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">Border Style</label>
                      <div className="flex gap-2">
                        {([['none', 'None'], ['top', 'Top Only'], ['full', 'Full Border']] as const).map(([val, label]) => (
                          <button
                            key={val}
                            onClick={() => updateConfig({ borderStyle: val })}
                            className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${config.borderStyle === val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Header / Letterhead */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">🏥 Step 3 — Header / Letterhead</p>

                  {/* Letterhead image upload */}
                  <div className="mb-4 p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-600 mb-2">Clinic Logo / Letterhead Image (Optional)</p>
                    <p className="text-[10px] text-slate-400 mb-3">
                      If uploaded, this image will replace the text header — making the prescription look exactly like your existing pad.
                    </p>
                    <div className="flex items-center gap-4">
                      <ImageUploadWithPreview
                        id="letterhead-upload"
                        accept="image/*"
                        label="Clinic Letterhead / Logo"
                        onUpload={async (file, onProgress) => {
                          const formData = new FormData();
                          formData.append('file', file);
                          const token = localStorage.getItem('auth_token') || '';
                          const data = await uploadWithProgress(
                            `${API_BASE}/api/v1/auth/upload-image`,
                            formData, token, onProgress
                          );
                          updateConfig({ letterheadUrl: data.url });
                        }}
                      >
                        <div className="px-4 py-2 border-2 border-dashed border-blue-300 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-all cursor-pointer whitespace-nowrap">
                          📤 Upload Logo / Header
                        </div>
                      </ImageUploadWithPreview>
                      {config.letterheadUrl && (
                        <div className="relative flex-1 max-w-[180px]">
                          <img src={config.letterheadUrl} alt="Letterhead" className="w-full h-12 object-contain rounded-lg border border-slate-200" />
                          <button
                            onClick={() => updateConfig({ letterheadUrl: undefined })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                          >×</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Header fields toggles */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-600 mb-1">Show in Header</p>
                    <p className="text-[10px] text-slate-400 mb-3">Turn off fields you don't want printed on the prescription</p>
                    <div className="grid sm:grid-cols-2 gap-0">
                      <Toggle value={config.header.showClinicName} onChange={v => updateHeader({ showClinicName: v })} label="Clinic Name" />
                      <Toggle value={config.header.showDoctorName} onChange={v => updateHeader({ showDoctorName: v })} label="Doctor Name" />
                      <Toggle value={config.header.showDegree} onChange={v => updateHeader({ showDegree: v })} label="Degree (MBBS, MD...)" />
                      <Toggle value={config.header.showSpecialization} onChange={v => updateHeader({ showSpecialization: v })} label="Specialization" />
                      <Toggle value={config.header.showMCI} onChange={v => updateHeader({ showMCI: v })} label="MCI / NMC Reg. No." />
                      <Toggle value={config.header.showPhone} onChange={v => updateHeader({ showPhone: v })} label="Phone Number" />
                      <Toggle value={config.header.showAddress} onChange={v => updateHeader({ showAddress: v })} label="Clinic Address" />
                      <Toggle value={config.header.showTimings} onChange={v => updateHeader({ showTimings: v })} label="Clinic Timings" />
                    </div>
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Custom Line in Header (optional)</label>
                      <input
                        type="text"
                        value={config.header.customLine}
                        onChange={e => updateHeader({ customLine: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. NABH Certified | Emergency: 24×7"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4: Footer */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">📝 Step 4 — Footer</p>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <Toggle value={config.footer.showSignature} onChange={v => updateFooter({ showSignature: v })} label="Doctor's Signature area" />
                    <Toggle value={config.footer.showPoweredBy} onChange={v => updateFooter({ showPoweredBy: v })} label="'Powered by DoctorKaDost' note" />
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Follow-up Reminder Text</label>
                      <input
                        type="text"
                        value={config.footer.followUpText}
                        onChange={e => updateFooter({ followUpText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. Follow-up after 7 days"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Custom Footer Note</label>
                      <textarea
                        rows={2}
                        value={config.footer.customText}
                        onChange={e => updateFooter({ customText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        placeholder="e.g. This prescription is valid for 30 days. Generic medicines encouraged."
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSaveCustom}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors active:scale-[0.98] shadow-md"
                >
                  💾 Save Custom Template
                </button>
              </div>
            )}

            {/* Active theme note when preset selected */}
            {!showCustomEditor && (
              <p className="text-xs text-slate-400">
                Template is applied automatically when selected. Reception will use this when printing prescriptions.
              </p>
            )}
          </div>

          {/* RIGHT: Live Preview ─────────────────────── */}
          <div className="w-full xl:w-[340px] flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Preview</p>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117%' }}>
                <LivePreview config={config} clinic={clinic} />
              </div>
              {referenceFile && showCustomEditor && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Your Reference</p>
                  <img src={referenceFile} alt="Reference prescription" className="w-full rounded-xl border border-slate-200 object-contain max-h-48" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
