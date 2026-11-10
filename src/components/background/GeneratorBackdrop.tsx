import React from 'react';

export interface BackgroundPattern {
  id: string;
  name: string;
  tagline: string;
  category: 'stripes' | 'grid' | 'gradient';
  style: React.CSSProperties;
  thumbnailStyle: React.CSSProperties;
}

export const BACKGROUND_PATTERNS: BackgroundPattern[] = [
  {
    id: 'bold-vertical',
    name: 'Bold Vertical Stripes',
    tagline: '28px thick vertical bands for maximum lateral Snell deflection',
    category: 'stripes',
    style: {
      backgroundColor: '#07090e',
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          #38bdf8 0px,
          #38bdf8 24px,
          #0b0f19 24px,
          #0b0f19 56px,
          #ffffff 56px,
          #ffffff 80px,
          #07090e 80px,
          #07090e 112px
        )
      `,
    },
    thumbnailStyle: {
      backgroundColor: '#07090e',
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          #38bdf8 0px,
          #38bdf8 6px,
          #0b0f19 6px,
          #0b0f19 14px,
          #ffffff 14px,
          #ffffff 20px,
          #07090e 20px,
          #07090e 28px
        )
      `,
    },
  },
  {
    id: 'bold-horizontal',
    name: 'Bold Horizontal Stripes',
    tagline: '26px thick horizontal bars demonstrating vertical ray bending',
    category: 'stripes',
    style: {
      backgroundColor: '#06080f',
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          #818cf8 0px,
          #818cf8 26px,
          #080911 26px,
          #080911 54px,
          #38bdf8 54px,
          #38bdf8 80px,
          #06080f 80px,
          #06080f 108px
        )
      `,
    },
    thumbnailStyle: {
      backgroundColor: '#06080f',
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          #818cf8 0px,
          #818cf8 6px,
          #080911 6px,
          #080911 13px,
          #38bdf8 13px,
          #38bdf8 19px,
          #06080f 19px,
          #06080f 26px
        )
      `,
    },
  },
  {
    id: 'bold-grid',
    name: 'Bold High-Contrast Grid',
    tagline: '52px thick checkerboard grid for 2D cross-axis distortion test',
    category: 'grid',
    style: {
      backgroundColor: '#07080d',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.40) 4px, transparent 4px),
        linear-gradient(90deg, rgba(56, 189, 248, 0.55) 4px, transparent 4px)
      `,
      backgroundSize: '52px 52px',
    },
    thumbnailStyle: {
      backgroundColor: '#07080d',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.40) 2px, transparent 2px),
        linear-gradient(90deg, rgba(56, 189, 248, 0.55) 2px, transparent 2px)
      `,
      backgroundSize: '16px 16px',
    },
  },
  {
    id: 'bold-zigzag',
    name: 'Bold Chevron Zig-Zag',
    tagline: '32px thick diagonal bands demonstrating chromatic angular warp',
    category: 'stripes',
    style: {
      backgroundColor: '#06070c',
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          #38bdf8 0px,
          #38bdf8 22px,
          #090a13 22px,
          #090a13 50px
        ),
        repeating-linear-gradient(
          -45deg,
          #c084fc 0px,
          #c084fc 22px,
          transparent 22px,
          transparent 50px
        )
      `,
    },
    thumbnailStyle: {
      backgroundColor: '#06070c',
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          #38bdf8 0px,
          #38bdf8 6px,
          #090a13 6px,
          #090a13 13px
        ),
        repeating-linear-gradient(
          -45deg,
          #c084fc 0px,
          #c084fc 6px,
          transparent 6px,
          transparent 13px
        )
      `,
    },
  },
  {
    id: 'tri-color',
    name: 'Tri-Color Chromatic Prism',
    tagline: 'Thick cyan, fuchsia and emerald prism bands',
    category: 'stripes',
    style: {
      backgroundColor: '#06070c',
      backgroundImage: `
        repeating-linear-gradient(
          125deg,
          #06b6d4 0px,
          #06b6d4 30px,
          #0b0d18 30px,
          #0b0d18 55px,
          #ec4899 55px,
          #ec4899 85px,
          #0b0d18 85px,
          #0b0d18 110px,
          #10b981 110px,
          #10b981 140px,
          #06070c 140px,
          #06070c 165px
        )
      `,
    },
    thumbnailStyle: {
      backgroundColor: '#06070c',
      backgroundImage: `
        repeating-linear-gradient(
          125deg,
          #06b6d4 0px,
          #06b6d4 7px,
          #0b0d18 7px,
          #0b0d18 13px,
          #ec4899 13px,
          #ec4899 20px,
          #0b0d18 20px,
          #0b0d18 26px,
          #10b981 26px,
          #10b981 33px,
          #06070c 33px,
          #06070c 39px
        )
      `,
    },
  },
  {
    id: 'nebula',
    name: 'Deep Nebula Fluid',
    tagline: 'Vibrant cosmic aurora fluid clouds with neon ambient glow',
    category: 'gradient',
    style: {
      backgroundColor: '#040509',
      backgroundImage: `
        radial-gradient(circle at 18% 28%, rgba(56, 189, 248, 0.45) 0%, transparent 48%),
        radial-gradient(circle at 82% 65%, rgba(129, 140, 248, 0.40) 0%, transparent 48%),
        radial-gradient(circle at 50% 85%, rgba(217, 70, 239, 0.28) 0%, transparent 55%),
        radial-gradient(circle at 45% 35%, rgba(52, 211, 153, 0.22) 0%, transparent 40%)
      `,
    },
    thumbnailStyle: {
      backgroundColor: '#040509',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.6) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(129, 140, 248, 0.6) 0%, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(217, 70, 239, 0.4) 0%, transparent 60%)
      `,
    },
  },
  {
    id: 'cyber-sunset',
    name: 'Cyberpunk Aurora',
    tagline: 'High-contrast sunset gradient of deep blue, violet, and gold',
    category: 'gradient',
    style: {
      backgroundColor: '#05050a',
      backgroundImage: `
        linear-gradient(
          140deg,
          #0284c7 0%,
          #4f46e5 35%,
          #9333ea 65%,
          #f59e0b 95%,
          #05050a 100%
        )
      `,
    },
    thumbnailStyle: {
      backgroundColor: '#05050a',
      backgroundImage: `
        linear-gradient(
          140deg,
          #0284c7 0%,
          #4f46e5 35%,
          #9333ea 65%,
          #f59e0b 95%,
          #05050a 100%
        )
      `,
    },
  },
];

interface GeneratorBackdropProps {
  patternId: string;
}

export const GeneratorBackdrop: React.FC<GeneratorBackdropProps> = ({ patternId }) => {
  const current = BACKGROUND_PATTERNS.find((p) => p.id === patternId) || BACKGROUND_PATTERNS[0];

  return (
    <div 
      className="fixed inset-0 pointer-events-none select-none z-0 transition-all duration-300 ease-out"
      style={current.style}
    />
  );
};
