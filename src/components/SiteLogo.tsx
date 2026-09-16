import React from 'react';

interface SiteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  const sizeMap = {
    sm: { box: 'h-8 w-8', text: 'text-xs', sub: 'text-[9px]' },
    md: { box: 'h-9 w-9', text: 'text-sm', sub: 'text-[11px]' },
    lg: { box: 'h-11 w-11', text: 'text-base', sub: 'text-xs' },
    xl: { box: 'h-14 w-14', text: 'text-lg', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`${className} inline-flex items-center gap-2.5 select-none`}>
      {/* Unique Polyglot Vector Emblem */}
      <div
        className={`relative flex ${currentSize.box} items-center justify-center rounded-xl bg-linear-to-br from-slate-900 via-slate-950 to-amber-950/40 p-1 border border-amber-500/30 shadow-lg shadow-amber-500/15 group-hover:border-amber-400/60 transition-all duration-300`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.25)]"
          aria-hidden="true"
        >
          {/* Subtle Ambient Radial Glow */}
          <circle cx="24" cy="24" r="20" fill="url(#polyglot_glow)" opacity="0.3" />

          {/* C# Diamond / Precision Compiler Matrix: Outer Diamond Lattice */}
          <path
            d="M 24 4 L 42 24 L 24 44 L 6 24 Z"
            stroke="url(#csharp_gradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 3"
            opacity="0.85"
          />

          {/* C# Hash Sharp Grid Rails (#) */}
          <line x1="18" y1="12" x2="18" y2="36" stroke="url(#csharp_rail)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="30" y1="12" x2="30" y2="36" stroke="url(#csharp_rail)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="12" y1="18" x2="36" y2="18" stroke="url(#csharp_rail)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="12" y1="30" x2="36" y2="30" stroke="url(#csharp_rail)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

          {/* Python Upper Serpent Curve (Amber / Gold) */}
          <path
            d="M 14 16 C 14 11, 20 9, 26 9 C 32 9, 36 12, 36 17 C 36 21, 32 23, 27 23 L 20 23 C 16 23, 13 25, 13 29"
            stroke="url(#python_gold)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Python Upper Eye */}
          <circle cx="20" cy="13" r="1.6" fill="#1e293b" stroke="#fbbf24" strokeWidth="0.8" />

          {/* Python Lower Serpent Curve (Sky / Cyan / Blue) */}
          <path
            d="M 34 32 C 34 37, 28 39, 22 39 C 16 39, 12 36, 12 31 C 12 27, 16 25, 21 25 L 28 25 C 32 25, 35 23, 35 19"
            stroke="url(#python_blue)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Python Lower Eye */}
          <circle cx="28" cy="35" r="1.6" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />

          {/* Central High-Performance Architecture Nexus */}
          <circle cx="24" cy="24" r="3.2" fill="#f59e0b" className="animate-pulse" />
          <circle cx="24" cy="24" r="1.5" fill="#ffffff" />

          <defs>
            <linearGradient id="python_gold" x1="12" y1="8" x2="36" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="python_blue" x1="36" y1="40" x2="12" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="csharp_gradient" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="csharp_rail" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <radialGradient id="polyglot_glow" cx="24" cy="24" r="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Typography Brand Lockup */}
      {showText && (
        <div className="hidden text-left sm:block">
          <div className="flex items-center gap-2">
            <span className={`${currentSize.text} font-extrabold text-white tracking-tight group-hover:text-amber-300 transition-colors`}>
              PyCSharp
            </span>
            <span className="hidden sm:inline-block rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Architect
            </span>
          </div>
          <p className={`${currentSize.sub} text-slate-400 hidden md:block leading-tight font-medium`}>
            Polyglot Systems & Technical Rosetta Stone
          </p>
        </div>
      )}
    </div>
  );
};
