import React from 'react';
interface FluidWaveBackgroundProps {
  className?: string;
  variant?: 'hero' | 'cta';
}
const FluidWaveBackground: React.FC<FluidWaveBackgroundProps> = ({
  className = '',
  variant = 'hero'
}) => {
  const isHero = variant === 'hero';
  return <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wave-gradient-1" gradientTransform="rotate(65)">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="wave-gradient-3" gradientTransform="rotate(25)">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          {isHero ? <linearGradient id="wave-gradient-4" gradientTransform="rotate(85)">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.1" />
            </linearGradient> : <linearGradient id="wave-gradient-4" gradientTransform="rotate(85)">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.05" />
            </linearGradient>}
        </defs>
        {/* Wave 1 - Bottom layer, slowest */}
        <path className="wave wave-1" fill="url(#wave-gradient-1)" d="M0,800 C320,730 420,580 720,600 C1020,620 1200,730 1440,650 L1440,800 L0,800 Z" />
        {/* Wave 2 - Middle layer */}
        <path className="wave wave-2" fill="url(#wave-gradient-2)" d="M0,800 C220,750 320,650 620,680 C920,710 1120,780 1440,720 L1440,800 L0,800 Z" />
        {/* Wave 3 - Top layer, fastest */}
        <path className="wave wave-3" fill="url(#wave-gradient-3)" d="M0,800 C140,770 240,720 540,740 C840,760 1040,800 1440,760 L1440,800 L0,800 Z" />
        {/* Wave 4 - Accent layer */}
        <path className="wave wave-4" fill="url(#wave-gradient-4)" d="M0,800 C180,785 280,760 480,770 C680,780 980,790 1440,780 L1440,800 L0,800 Z" />
        {/* Background circles */}
        <circle cx="10%" cy="20%" r="150" fill="#4f46e5" fillOpacity="0.03" className="floating-circle circle-1" />
        <circle cx="80%" cy="30%" r="200" fill="#7e22ce" fillOpacity="0.03" className="floating-circle circle-2" />
        <circle cx="40%" cy="60%" r="250" fill="#3b82f6" fillOpacity="0.03" className="floating-circle circle-3" />
      </svg>
    </div>;
};
export default FluidWaveBackground;