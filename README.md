# Liquid Glass Effect

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.2.7-white?style=for-the-badge&labelColor=black" alt="Version 0.2.7" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&labelColor=black" alt="MIT License" />
  <img src="https://img.shields.io/badge/Optics-Snell's%20Law-cyan?style=for-the-badge&labelColor=black" alt="Snell's Law" />
  <img src="https://img.shields.io/badge/WebGL-2.0%20GLSL%20300es-indigo?style=for-the-badge&labelColor=black" alt="WebGL 2.0" />
  <img src="https://img.shields.io/badge/Performance-120%20FPS-emerald?style=for-the-badge&labelColor=black" alt="120 FPS" />
</p>

> An experimental physical optics studio and zero-dependency code generator for **Liquid Glass Effect**. Simulates real-time Snell's law ray-tracing, chromatic dispersion, and parametric meniscus bevels with zero distortion in the transmission core. Built with love by **[MR PROG](https://github.com/MR-PR0G)** &bull; Official Repository: **[MR-PR0G/LiquidGlass](https://github.com/MR-PR0G/LiquidGlass)**.

---

## 🚀 Live Demo & Interactive Studio

Experience the real-time physical ray-tracing in your browser:

- **Local Development**: `http://localhost:5173/`
- **Zero Runtime Dependencies**: Pure WebGL2 GLSL 300es shaders running at native 60–120 FPS.
- **Dynamic Backgrounds**: Test refraction against high-contrast diagonal ribbons, typography inertia scroll, and kinetic 3D physics shapes.
- **Instant Code Export**: Generate standalone single-file HTML or production React/TSX modules with one click.

---

## 💎 Features

- **Physically-Accurate Snell Ray-Tracing**: Vector refraction calculated per fragment via $n_1 \sin\theta_1 = n_2 \sin\theta_2$.
- **Parametric Meniscus Edge Bevel**: Refraction is concentrated along curved rims while preserving 100% distortion-free transmission through the core face (zero pinwheel artifacts at rounded corners).
- **Spectral Chromatic Dispersion ($\Delta\lambda$)**: Prismatic RGB wavelength splitting along high-curvature bevel borders.
- **Smoked Dark Tinting**: Translucent optical absorption layer customizable from crystal-clear to deep obsidian.
- **Zero External Dependencies**: Standalone HTML and React components run with pure WebGL2 and zero external library bloat.
- **Drag-Anywhere Physics**: Inspect background distortions smoothly across any point on desktop or mobile touch devices.

---

## 🔬 Optical Physics Formulation

Traditional CSS glassmorphism relies solely on uniform Gaussian blur, which produces flat, cloudy surfaces without realistic depth. **LIQUID GLASS GENERATOR** computes real-time Snell's law refraction vectors along the curved liquid meniscus bevel of any element:

$$n_1 \cdot \sin(\theta_1) = n_2 \cdot \sin(\theta_2)$$

### Flat Core Transmission & Meniscus Bevel

Light rays entering perpendicular to a flat glass surface experience zero lateral deflection. Therefore, the **interior core** of the Liquid Glass remains optically flat and undistorted, while refraction occurs exclusively along the **parametric meniscus bevel**:

$$\vec{N} = \text{normalize}\left(-\nabla \text{SDF} \cdot \cos\left(t \cdot \frac{\pi}{2}\right) \cdot (1 - t) \cdot \eta, \; 1.0\right)$$

Where $t \in [0, 1]$ represents normalized distance from the outer perimeter to the inner flat face.

### Chromatic Dispersion ($\Delta\lambda$)

Wavelengths split across red, green, and blue indices of refraction:

$$\eta_{\text{green}} = \frac{1.0}{1.0 + \text{refraction}}$$
$$\eta_{\text{red}} = \eta_{\text{green}} \cdot (1.0 - \text{dispersion} \cdot 0.35)$$
$$\eta_{\text{blue}} = \eta_{\text{green}} \cdot (1.0 + \text{dispersion} \cdot 0.35)$$

---

## 🎛️ Configuration Parameters Matrix

Every parameter in the generator maps directly to physical optical variables:

| Parameter | Type | Default Step | Physical Value | Range | Description & Optical Effect |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `refraction` | `number` | `6 / 10` | `0.344` | `0.08 - 0.52` | Snell ray-tracing optical bending power along the bevel. |
| `bevel` | `number` | `5 / 10` | `28 px` | `10 - 46 px` | Physical width of the curved meniscus rim along the perimeter. |
| `dispersion` | `number` | `2 / 10` | `0.28` | `0.00 - 1.40` | Spectral prism wavelength split ($\Delta\lambda$) along curved edges. |
| `darkTint` | `number` | `2 / 10` | `0.15` | `0.00 - 0.75` | Smoked optical glass absorption coefficient. |
| `blur` | `number` | `0 / 10` | `0 px` | `0 - 22 px` | Frosted optical diffusion layer simulating internal micro-roughness. |
| `radius` | `number` | `10 / 10` | `9999 px` | `14 - 9999 px` | Corner radius. Use `9999` for capsule / pill; `14 - 44` for cards. |
| `width` | `number` | `5 / 10` | `620 px` | `360 - 880 px` | Width of the liquid glass container in pixels. |
| `height` | `number` | `2 / 10` | `92 px` | `56 - 236 px` | Height of the liquid glass container. |

---

## 🛠️ Usage & Integration Guide

### 1. Standalone Single-File HTML Export

The generated HTML file is fully self-contained with an embedded WebGL2 ray-tracer and includes a modular `createLiquidGlass` function ready to mount on any element:

```html
<div id="my-glass-container" style="position: absolute; width: 520px; height: 88px; border-radius: 9999px;">
  <canvas id="my-glass-canvas" style="width: 100%; height: 100%; border-radius: inherit;"></canvas>
  <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white;">
    LIQUID GLASS
  </div>
</div>

<script>
  // Mount the lens on any background canvas or image
  const glass = createLiquidGlass(container, canvas, backdropSource, {
    refraction: 0.344,
    bevel: 28,
    dispersion: 0.28,
    darkTint: 0.15,
    blur: 0,
    radius: 9999,
  });

  // Re-render when position or backdrop updates
  glass.render();
</script>
```

### 2. React / Next.js Component (TSX)

Zero-dependency drop-in TypeScript component for modern web applications:

```bash
pnpm add @mr-prog/liquid-glass
```

```tsx
import React from 'react';
import { LiquidGlass } from '@mr-prog/liquid-glass';

export default function GlassNavBar() {
  return (
    <div className="relative w-full h-screen bg-[#07080d] flex items-center justify-center">
      {/* Liquid Glass Capsule Navigation */}
      <LiquidGlass
        refraction={0.344}
        bevel={28}
        dispersion={0.28}
        darkTint={0.15}
        blur={0}
        radius={9999}
        style={{ width: '520px', height: '80px' }}
      >
        <nav className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-slate-200">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#optics" className="hover:text-cyan-400 transition-colors">Optics</a>
          <a href="#export" className="hover:text-cyan-400 transition-colors">Export</a>
        </nav>
      </LiquidGlass>
    </div>
  );
}
```

---

## 📦 Getting Started Locally

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/MR-PR0G/Liquid-Glass-Effect.git
cd Liquid-Glass-Effect

# Install dependencies
npm install

# Start 120 FPS development server
npm run dev
```

### Production Build

```bash
npm run build
```

The production assets will be output to the `dist/` directory with zero build errors.

---

## 📂 Project Architecture

```text
LIQUID GLASS GENERATOR/
├── public/                     # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── generator/          # InteractiveGlassSandbox & Export Deck
│   │   ├── soap-bubble/        # Physical WebGL2 Snell Shader Engine
│   │   ├── refracted-text/     # Ray-traced dynamic typography
│   │   ├── features/           # Seamless Floating Features Marquee
│   │   └── topographic-flow/   # Subtle topographic contour canvas
│   ├── pages/                  # Main HomePage layout
│   ├── styles/                 # Tailwind CSS & keyframe animations
│   ├── types/                  # Optical configuration types & default steps
│   ├── utils/                  # Standalone HTML & TSX Code Generator
│   ├── App.tsx                 # Root application orchestrator
│   └── main.tsx                # Application entrypoint
├── liquid-glass-react/         # Standalone npm package source
├── package.json                # Project manifest (v0.2.7)
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build pipeline
└── README.md                   # Documentation
```

---

## 📄 License & Attribution

This project is open-source under the **MIT License**. Free for personal and commercial use.

- **Author**: [MR PROG](https://github.com/MR-PR0G)
- **Official GitHub Repository**: [MR-PR0G/LiquidGlass](https://github.com/MR-PR0G/LiquidGlass)
- **Experimental Optical Lab Project** &bull; Built with love by **MR PROG**.
