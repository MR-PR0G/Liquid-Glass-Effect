<div align="center">

# 💧 Liquid Glass

### The physical liquid glass effect for React & the modern web.

No more cloudy, flat `backdrop-filter: blur()` plastic.  
**Real optical refraction, smooth curved meniscus borders, and subtle chromatic dispersion — running at a silky-smooth 120 FPS.**

<br />

[![npm version](https://img.shields.io/npm/v/@mr-prog/liquid-glass?style=for-the-badge&color=0284c7&labelColor=09090b)](https://www.npmjs.com/package/@mr-prog/liquid-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-3b82f6?style=for-the-badge&labelColor=09090b)](https://opensource.org/licenses/MIT)
[![Instant Render](https://img.shields.io/badge/Render%20Time-%3C0.8ms%20Instant-06b6d4?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)
[![120 FPS](https://img.shields.io/badge/Performance-120%20FPS-059669?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)
[![Live Studio](https://img.shields.io/badge/Live%20Demo-Interactive%20Studio-8b5cf6?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)

<br />

<p align="center">
  <img src="demo/preview.png" alt="Liquid Glass Optical Effect Preview" width="100%" style="max-width: 900px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);" />
</p>

<br />

**[🚀 Try Live Interactive Studio](https://mr-pr0g.github.io/LiquidGlass/)** &bull; **[📦 NPM Package](https://www.npmjs.com/package/@mr-prog/liquid-glass)**

</div>

---

## ✨ Why Liquid Glass?

Most "glassmorphism" tutorials tell you to slap `backdrop-filter: blur(10px)` on a semi-transparent div. But that doesn't look like real glass — it looks like foggy plastic.

In the real world, glass **bends light**:

* 🌊 **True Optical Refraction**: Background elements stretch, curve, and magnify along the edges based on Snell's law.
* ⚡ **Instant Sub-Millisecond Rendering (< 0.8ms)**: Ray tracing runs in a single-pass WebGL2 shader with zero CPU overhead, rendering instantly at 120 FPS. The engine suspends automatically when idle to preserve mobile battery life.
* 💎 **Crystal-Clear Center**: The curved meniscus is focused strictly on the outer bevel — leaving your typography, icons, and buttons 100% crisp, sharp, and readable.
* 🌈 **Prism Chromatic Dispersion**: Subtle split of red and blue wavelengths along curved edges for a luxury physical look.

---

## 📦 Installation

Grab the package using your favorite package manager:

```bash
npm install @mr-prog/liquid-glass
# or
pnpm add @mr-prog/liquid-glass
# or
yarn add @mr-prog/liquid-glass
```

---

## 🚀 Quick Start

Import the component and stylesheet, and you're good to go:

```tsx
import { LiquidGlass } from '@mr-prog/liquid-glass';
import '@mr-prog/liquid-glass/liquid-glass.css';

export default function App() {
  return (
    <div className="min-h-screen bg-[#07070b] flex items-center justify-center p-6">
      {/* Flagship Draggable Navigation Bar */}
      <LiquidGlass mode="nav" />
    </div>
  );
}
```

---

## 🎨 Built-in Modes

Liquid Glass comes out-of-the-box with 3 ready-to-use presets, or you can wrap custom content:

### 1. 🧭 Navigation Bar (`mode="nav"`)
A fluid navigation capsule featuring a draggable liquid lens that tracks your finger or mouse with elastic momentum, snapping to tabs with organic jelly physics:

```tsx
<LiquidGlass 
  mode="nav" 
  activeIndex={0} 
  onChange={(index) => console.log('Active tab:', index)} 
/>
```

### 2. 🎵 Luxury Cupertino Player (`mode="player"`)
A minimalist frosted glass music player with dynamic animated 3-bar equalizer, glowing disc, and responsive controls:

```tsx
<LiquidGlass 
  mode="player" 
  audioTitle="Cupertino Waves" 
  audioArtist="MR PROG • Lossless 48kHz"
  isPlaying={true}
/>
```

### 3. ✨ Refracted Typography & Custom Containers
Display ray-traced viscous typography or wrap your own custom React components:

```tsx
{/* Refracted Typography */}
<LiquidGlass mode="text" text="LIQUID GLASS" />

{/* Custom Container */}
<LiquidGlass mode="empty" radius={24} className="p-8">
  <h2 className="text-white text-xl font-bold">Custom Glass Card</h2>
  <p className="text-zinc-400 text-sm mt-1">Wrap any React component in authentic liquid glass.</p>
</LiquidGlass>
```

---

## ⚙️ Customization Props

You can easily customize optical physics and appearance:

| Prop | Type | Default | What it does |
| :--- | :--- | :--- | :--- |
| `mode` | `'nav' \| 'player' \| 'text' \| 'empty'` | `'nav'` | Pre-built component preset or clean container. |
| `refraction` | `number` | `0.344` | Strength of light bending through the glass edges. |
| `bevel` | `number` | `28` | Width of the curved meniscus rim in pixels. |
| `dispersion` | `number` | `0.28` | Rainbow prism splitting effect along the borders. |
| `darkTint` | `number` | `0.15` | Glass darkness (from completely clear `0` to dark `0.75`). |
| `blur` | `number` | `0` | Optional internal frosted diffusion (`0` is crystal clear). |
| `radius` | `number` | `9999` | Corner rounding (`9999` for pill capsule, `16–36` for cards). |
| `wallpaper` | `'cross' \| 'stripes' \| 'none'` | `'cross'` | High-contrast test pattern for testing optics. |

---

## 🛠️ Custom Navigation Items

Easily customize navbar tabs using any standard icon library (e.g. [Lucide Icons](https://lucide.dev)):

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

## 📄 License

Created by **[MR PROG](https://github.com/MR-PR0G)**.  
Distributed under the **MIT License**. Free for personal and commercial projects.
