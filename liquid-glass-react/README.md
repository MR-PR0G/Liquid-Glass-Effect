<div align="center">

# @mr-prog/liquid-glass

### Next-Generation Optical Physics Engine for React

Physical Snell's law refraction, multi-spectral chromatic dispersion along meniscus bevels, 100% undistorted transmission core, and 120 FPS mobile GPU acceleration.

<br />

[![npm version](https://img.shields.io/npm/v/@mr-prog/liquid-glass?style=for-the-badge&color=06b6d4&labelColor=09090b)](https://www.npmjs.com/package/@mr-prog/liquid-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-3b82f6?style=for-the-badge&labelColor=09090b)](https://opensource.org/licenses/MIT)
[![Optics: Snell's Law](https://img.shields.io/badge/Optics-Snell's%20Law-8b5cf6?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)
[![WebGL 2.0](https://img.shields.io/badge/WebGL-2.0%20GPU-ec4899?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)
[![120 FPS](https://img.shields.io/badge/Performance-120%20FPS-10b981?style=for-the-badge&labelColor=09090b)](https://mr-pr0g.github.io/LiquidGlass/)

<br />

**[🚀 Live Interactive Studio](https://mr-pr0g.github.io/LiquidGlass/)** &bull; **[📦 NPM Registry](https://www.npmjs.com/package/@mr-prog/liquid-glass)** &bull; **[🐙 GitHub Repository](https://github.com/MR-PR0G/LiquidGlass)**

</div>

---

## ⚡ Installation

```bash
npm install @mr-prog/liquid-glass
# or
pnpm add @mr-prog/liquid-glass
# or
yarn add @mr-prog/liquid-glass
```

---

## 🚀 Minimal One-Line Usage

```tsx
import { LiquidGlass } from '@mr-prog/liquid-glass';
import '@mr-prog/liquid-glass/liquid-glass.css';

export default function Navigation() {
  return <LiquidGlass mode="nav" />;
}
```

---

## 🎨 Built-in Component Modes

The `<LiquidGlass />` component provides 4 ready-to-use production modes:

- `mode="nav"`: Flagship draggable squircle liquid lens navigation bar.
- `mode="player"`: Cupertino luxury audio player with animated EQ disc and frosted glass controls.
- `mode="text"`: Viscous ray-traced typography refracting underlying backdrops.
- `mode="empty"`: Pure physical liquid glass card container for custom children.

```tsx
{/* 1. Flagship Navigation Bar */}
<LiquidGlass mode="nav" />

{/* 2. Luxury Cupertino Audio Player */}
<LiquidGlass mode="player" audioTitle="Cupertino Waves" />

{/* 3. Fluid Ray-Traced Typography */}
<LiquidGlass mode="text" text="LIQUID GLASS" />

{/* 4. Custom Glass Card Container */}
<LiquidGlass mode="empty" radius={24} className="p-6">
  <h2 className="text-white text-xl font-bold">Custom Card</h2>
</LiquidGlass>
```

---

## 🎛️ Optical Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'nav' \| 'player' \| 'text' \| 'empty'` | `'nav'` | Pre-configured interactive mode. |
| `refraction` | `number` | `0.344` | Snell ray-tracing refraction strength. |
| `bevel` | `number` | `28` | Curved meniscus rim width in pixels. |
| `dispersion` | `number` | `0.28` | Chromatic spectral RGB splitting. |
| `darkTint` | `number` | `0.15` | Translucent obsidian tint absorption. |
| `blur` | `number` | `0` | Frosted micro-surface roughness. |
| `wallpaper` | `'cross' \| 'stripes' \| 'none'` | `'cross'` | Built-in hardware-accelerated test backdrop. |

---

## 📄 License & Author

Crafted with passion by **[MR PROG](https://github.com/MR-PR0G)**.  
Released under the [MIT License](LICENSE).
