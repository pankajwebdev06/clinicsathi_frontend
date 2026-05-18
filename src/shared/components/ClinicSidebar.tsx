import { ReactNode } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  icon: string | ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ClinicSidebarProps {
  clinicName: string;
  subtitle: string;
  doctorName?: string;
  specialization?: string;
  navItems: NavItem[];
  activeId?: string;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  footerContent?: ReactNode;
  onLogout?: () => void;
}

export function ClinicSidebar({
  clinicName,
  subtitle,
  doctorName,
  specialization,
  navItems,
  activeId,
  focusMode = false,
  onToggleFocus,
  footerContent,
  onLogout,
}: ClinicSidebarProps) {
  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={`bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 ${focusMode ? 'w-16' : 'w-64'} overflow-hidden print:hidden`}>
        <div className={`p-5 border-b border-slate-800 ${focusMode ? 'flex justify-center' : ''}`}>
          {!focusMode ? (
            <>
              <h2 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 leading-tight truncate">
                {clinicName}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 truncate">{subtitle}</p>
            </>
          ) : (
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-teal-300">
              {clinicName[0]}
            </span>
          )}
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const content = (
              <>
                <span className="text-lg leading-none">{item.icon}</span>
                {!focusMode && <span>{item.label}</span>}
              </>
            );

            const className = `w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeId === item.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`;

            if (item.href) {
              return (
                <Link key={item.id} href={item.href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <button key={item.id} onClick={item.onClick} className={className}>
                {content}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          {onToggleFocus && (
            <button
              onClick={onToggleFocus}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span className="text-lg">{focusMode ? '⬅️' : '🎯'}</span>
              {!focusMode && <span>Focus Mode</span>}
            </button>
          )}

          {footerContent || (
            <div className={`${focusMode ? 'hidden' : 'block'} p-2`}>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{doctorName}</p>
              <p className="text-slate-600 text-[10px] mt-0.5">{specialization}</p>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex items-stretch z-50 print:hidden"
           style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.08)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const btnClass = `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors min-w-0 ${
            isActive ? 'text-blue-600' : 'text-slate-400'
          }`;
          const inner = (
            <>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-semibold leading-tight truncate w-full text-center px-1">
                {item.label.split(' ')[0]}
              </span>
              {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />}
            </>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className={`relative ${btnClass}`}>
                {inner}
              </Link>
            );
          }
          return (
            <button key={item.id} onClick={item.onClick} className={`relative ${btnClass}`}>
              {inner}
            </button>
          );
        })}

        {onLogout && (
          <>
            <div className="w-px bg-slate-100 my-2 flex-shrink-0" />
            <button
              onClick={onLogout}
              className="flex flex-col items-center justify-center py-2.5 gap-0.5 px-4 text-slate-400 transition-colors flex-shrink-0"
            >
              <span className="text-xl leading-none">🚪</span>
              <span className="text-[10px] font-semibold">Logout</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
}
