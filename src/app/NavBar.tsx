'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LanguageToggle } from '@/features/i18n/LocaleProvider';

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            CS
          </div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">DoctorKaDost</span>
        </div>

        {/* Desktop nav — only on lg+ so it never overflows on iPad portrait */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-500">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
          <Link href="/register-guide" className="hover:text-slate-900 transition-colors">Setup Guide</Link>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <Link href="/doctors" className="hover:text-slate-900 transition-colors">Doctors</Link>
          <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 lg:gap-3 flex-shrink-0">
          <div className="hidden lg:block"><LanguageToggle compact /></div>
          {/* Doctors shortcut — visible on tablet (md), hidden on lg where full nav shows it */}
          <Link href="/doctors" className="lg:hidden text-sm font-bold text-blue-600 hover:text-blue-700 px-2 py-2">
            Doctors
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2 md:px-4 py-2"
          >
            Login
          </Link>
          <Link
            href="/doctor/setup"
            className="hidden sm:inline-flex text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
          >
            Get Started
          </Link>
          {/* Hamburger — visible on sm/md (tablet), hidden once lg nav takes over */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="block w-5 text-center text-lg leading-none select-none">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Tablet / mobile dropdown — appears when hamburger is tapped */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-0.5 shadow-lg">
          {[
            { label: 'Features', href: '#features', external: true },
            { label: 'How it Works', href: '#how-it-works', external: true },
            { label: 'Setup Guide', href: '/register-guide', external: false },
            { label: 'Pricing', href: '#pricing', external: true },
            { label: 'Doctors', href: '/doctors', external: false },
            { label: 'Blog', href: '/blog', external: false },
          ].map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {label}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-slate-100 px-4">
            <LanguageToggle compact />
          </div>
        </div>
      )}
    </header>
  );
}
