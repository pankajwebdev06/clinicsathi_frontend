'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale, LOCALES, STRINGS } from './strings';
import { authApi } from '@/features/auth/api';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;   // e.g. "common.bookAppointment"
}

const STORAGE_KEY = 'clinicsathi_locale';

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (p) => p,
});

function lookup(path: string, locale: Locale): string {
  const [section, key] = path.split('.') as [string, string];
  const s = (STRINGS as any)[section];
  if (!s) return path;
  const entry = s[key];
  if (!entry) return path;
  return entry[locale] ?? entry.en ?? path;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Resolution order on mount:
  //   1. user_info.preferred_language (set after login from backend /me)
  //   2. localStorage[STORAGE_KEY] (last in-session choice)
  //   3. navigator.language (browser default)
  useEffect(() => {
    try {
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.preferred_language && LOCALES.some(l => l.code === userInfo.preferred_language)) {
          setLocaleState(userInfo.preferred_language as Locale);
          return;
        }
      }
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.some(l => l.code === saved)) {
        setLocaleState(saved);
        return;
      }
      if (typeof navigator !== 'undefined') {
        const browser = navigator.language?.toLowerCase() || '';
        if (browser.startsWith('hi')) setLocaleState('hi');
      }
    } catch { /* ignore */ }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    // Fire-and-forget backend sync — only attempts if the user is authenticated.
    // Public visitors browsing /doctors or /doctor/[slug] won't hit this.
    if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
      authApi.updateMyPreferences({ preferred_language: l }).catch(() => {
        /* silent — locale still applies locally even if backend sync fails */
      });
    }
  };

  const t = (path: string) => lookup(path, locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);

/**
 * Inline language toggle pill — drop into any patient-facing page header.
 * Mobile-friendly, doesn't depend on Tailwind so it works inside inline-styled pages too.
 */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 999,
      padding: 3, fontSize: compact ? 11 : 12, fontWeight: 700,
    }}>
      {LOCALES.map(l => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          style={{
            padding: compact ? '4px 10px' : '6px 12px', borderRadius: 999,
            border: 'none', cursor: 'pointer', minHeight: compact ? 28 : 32,
            background: locale === l.code ? '#2563eb' : 'transparent',
            color: locale === l.code ? 'white' : '#64748b',
            fontWeight: 700, fontSize: 'inherit', transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
