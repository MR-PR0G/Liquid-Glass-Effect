import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 44 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center rounded-full group cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
      title="پوریا | طراح محصول و توسعه‌دهنده وب"
    >
      {/* Ambient glow behind circular logo */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.5) 0%, rgba(192,132,252,0.3) 60%, transparent 100%)'
        }}
      />

      {/* SVG Minimalist Logo based on prompt specifications */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-sm"
      >
        <defs>
          {/* Subtle modern monochromatic & liquid gradients */}
          <linearGradient id="logoBgGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="fluidLine1" x1="10" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="fluidLine2" x1="20" y1="30" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="ringGlint" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer Rim Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="47" 
          stroke="url(#ringGlint)" 
          strokeWidth="1.5" 
          fill="url(#logoBgGrad)" 
        />

        {/* Abstract Fluid Curved Wave 1 */}
        <path
          d="M 22 56 C 34 68, 44 32, 60 40 C 72 46, 75 62, 82 50"
          stroke="url(#fluidLine1)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Abstract Fluid Curved Wave 2 (Echo Line) */}
        <path
          d="M 28 44 C 40 32, 50 64, 66 58 C 76 54, 78 40, 74 34"
          stroke="url(#fluidLine2)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 1.5"
          fill="none"
        />

        {/* Center Minimalist Focal Sphere (liquid drop focal point) */}
        <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
        <circle cx="50" cy="50" r="7.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </svg>
    </div>
  );
};
