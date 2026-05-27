interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 36, className = '' }: LogoIconProps) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size * 0.58, height: size * 0.58 }}
        aria-hidden="true"
      >
        {/* Left ear tube */}
        <line x1="7" y1="2.5" x2="7" y2="6.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
        {/* Right ear tube */}
        <line x1="17" y1="2.5" x2="17" y2="6.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
        {/* U-shaped binaural connecting ears */}
        <path d="M7 6.5 Q7 13.5 12 13.5 Q17 13.5 17 6.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        {/* Stem down */}
        <line x1="12" y1="13.5" x2="12" y2="17.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
        {/* Curve to chest piece */}
        <path d="M12 17.5 Q12 21.5 16.5 21.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        {/* Chest piece (diaphragm) */}
        <circle cx="16.5" cy="21.5" r="2.1" stroke="white" strokeWidth="1.9" fill="none" />
      </svg>
    </div>
  );
}
