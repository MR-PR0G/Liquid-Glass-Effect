<div align="center">

# Liquid Glass Effect

### Next-Generation Optical Physics Engine for React

The liquid glass UI engine web developers have been waiting for.  
Simulates physically-accurate **Snell's law refraction**, **chromatic dispersion** along curved meniscus rims, and **crystal-clear flat transmission** at 120 FPS.

<br />

[![npm version](https://img.shields.io/npm/v/@mr-prog/liquid-glass?style=for-the-badge&color=06b6d4&labelColor=09090b)](https://www.npmjs.com/package/@mr-prog/liquid-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-3b82f6?style=for-the-badge&labelColor=09090b)](https://opensource.org/licenses/MIT)
[![Optics: Snell's Law](https://img.shields.io/badge/Optics-Snell's%20Law-8b5cf6?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)
[![WebGL 2.0](https://img.shields.io/badge/WebGL-2.0%20GPU-ec4899?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)
[![120 FPS](https://img.shields.io/badge/Performance-120%20FPS-10b981?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)

<br />

**[🚀 Live Interactive Studio](https://mr-pr0g.github.io/LiquidGlass/)** &bull; **[📦 NPM Package](https://www.npmjs.com/package/@mr-prog/liquid-glass)** &bull; **[📖 Quick Start](#-quick-start)**

<br />

<p align="center">
  <img src="demo/hero-preview.png" alt="Liquid Glass Optical Physics Engine Preview" width="850" style="border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);" />
</p>

</div>

---

## ⚡ Why Liquid Glass?

Traditional CSS `backdrop-filter: blur(...)` produces muddy, flat glass without physical realism. **Liquid Glass** brings real optical simulation into modern web interfaces:

- 🔮 **True Snell's Law Refraction**: Ray-traces background deflection across curved meniscus bevels ($n_1 \sin\theta_1 = n_2 \sin\theta_2$).
- 🌈 **Chromatic Dispersion ($\Delta\lambda$)**: Spectral RGB wavelength splitting along high-curvature borders.
- 💎 **Undistorted Flat Face**: 100% crystal-clear transmission at normal incidence — text remains sharp and readable with zero blur artifact.
- ⚡ **120 FPS Hardware Acceleration**: Hardware-accelerated GLSL shaders optimized for battery-friendly mobile and desktop GPUs.
- 🎛️ **Multi-Mode Versatility**: Out-of-the-box support for interactive tab navigations, luxury audio players, typography, and custom containers.

---

## 📦 Quick Start

### 1. Installation

```bash
npm install @mr-prog/liquid-glass
# or
pnpm add @mr-prog/liquid-glass
# or
yarn add @mr-prog/liquid-glass
```

### 2. Import and Use

Drop the standalone liquid glass navbar into your app with standard defaults in just **one line**:

```tsx
import { LiquidGlass } from '@mr-prog/liquid-glass';
import '@mr-prog/liquid-glass/liquid-glass.css';

export default function App() {
  return (
    <div className="min-h-screen bg-[#07070b] flex items-center justify-center">
      <LiquidGlass mode="nav" />
    </div>
  );
}
```

---

## 🎨 Built-in Modes

### 1. Flagship Navigation Bar (`mode="nav"`)
Draggable squircle liquid lens with fluid spring momentum, responsive item tracking, and strict optical boundary clipping:

```tsx
<LiquidGlass 
  mode="nav" 
  activeIndex={0} 
  onChange={(index) => console.log('Active tab:', index)} 
/>
```

<br />

### 2. Cupertino Luxury Audio Player (`mode="player"`)
Minimalist frosted glass disc, dynamic 3-bar animated equalizer, lossless sound badge, and responsive circular frosted glass playback controls:

```tsx
<LiquidGlass 
  mode="player" 
  audioTitle="Cupertino Waves" 
  audioArtist="MR PROG &bull; Lossless 48kHz"
/>
```

<p align="center">
  <img src="demo/audio-player-preview.png" alt="Luxury Audio Glass Player" width="700" style="border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.5);" />
</p>

<br />

### 3. Viscous Fluid Typography (`mode="text"`)
Ray-traced text refracting whatever is behind it:

```tsx
<LiquidGlass 
  mode="text" 
  text="LIQUID GLASS" 
/>
```

<br />

### 4. Custom Children Container (`mode="empty"`)
Wrap any custom React element inside a physical liquid glass container:

```tsx
<LiquidGlass mode="empty" radius={28} className="p-8">
  <h2 className="text-white text-2xl font-bold">Custom Glass Card</h2>
  <p className="text-zinc-400 mt-2">Physical refraction with your custom content inside.</p>
</LiquidGlass>
```

---

## 🎛️ Configuration Parameters

All parameters map directly to real optical physics variables:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'nav' \| 'player' \| 'text' \| 'empty'` | `'nav'` | Pre-configured interactive component mode. |
| `refraction` | `number` | `0.344` | Optical bending power along curved meniscus edges. |
| `bevel` | `number` | `28` | Width of the curved meniscus rim in screen pixels. |
| `dispersion` | `number` | `0.28` | Spectral prism RGB wavelength divergence ($\Delta\lambda$). |
| `darkTint` | `number` | `0.15` | Smoked obsidian optical absorption coefficient. |
| `blur` | `number` | `0` | Internal micro-surface roughness diffusion. |
| `radius` | `number` | `9999` | Corner rounding (`9999` for capsule/pill, `16–36` for cards). |
| `wallpaper` | `'cross' \| 'stripes' \| 'none'` | `'cross'` | Built-in hardware-accelerated test backdrop. |

---

## 🛠️ Custom Navbar Items

Customize icons, labels, and badges seamlessly with standard [lucide-react](https://lucide.dev) icons:

```tsx
import { useState } from 'react';
import { LiquidGlass } from '@mr-prog/liquid-glass';
import { Home, Compass, Bell, User } from 'lucide-react';
import '@mr-prog/liquid-glass/liquid-glass.css';

export function Navigation() {
  const [active, setActive] = useState(0);

  return (
    <LiquidGlass
      mode="nav"
      activeIndex={active}
      onChange={setActive}
      items={[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'explore', label: 'Explore', icon: Compass },
        { id: 'alerts', label: 'Alerts', icon: Bell, badge: true },
        { id: 'profile', label: 'Profile', icon: User },
      ]}
    />
  );
}
```

---

## 📄 License & Author

Engineered with passion by **[MR PROG](https://github.com/MR-PR0G)**.  
Released under the [MIT License](LICENSE). Open-source, free for personal and commercial projects.
