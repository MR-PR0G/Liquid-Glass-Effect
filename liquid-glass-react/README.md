# @mr-prog/liquid-glass

Production-grade Liquid Glass optical physics engine for React. Features physically-accurate Snell's law refraction, multi-spectral chromatic dispersion along meniscus bevels, zero-distortion flat core transmission, and 120 FPS mobile GPU acceleration.

[![npm version](https://img.shields.io/npm/v/@mr-prog/liquid-glass.svg)](https://www.npmjs.com/package/@mr-prog/liquid-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Snell's Law Refraction**: Exact Snell's law ray-tracing across curved liquid meniscus borders.
- **Chromatic Dispersion**: Multi-wavelength spectral splitting (red, green, blue optical divergence).
- **Undistorted Flat Face**: 100% crystal-clear transmission at normal incidence without crease lines.
- **Isotropic Specular Rim**: Ambient Fresnel highlights without artificial directional hot spots.
- **Mobile Hardware Acceleration**: WebGL 2.0 / GLSL shader pipeline operating at 120 FPS.
- **Universal Backdrop Tracking**: 1:1 pixel-perfect alignment with underlying DOM content.

---

## Installation

```bash
npm install @mr-prog/liquid-glass
# or
pnpm add @mr-prog/liquid-glass
# or
yarn add @mr-prog/liquid-glass
```

---

## Quick Start

### 1. Minimal One-Line Usage (`mode="nav"`)

Call the flagship liquid glass navbar with standard defaults in just one line:

```tsx
import { LiquidGlass } from '@mr-prog/liquid-glass';
import '@mr-prog/liquid-glass/liquid-glass.css';

export function Navigation() {
  return <LiquidGlass mode="nav" />;
}
```

### 2. Available Modes

The `<LiquidGlass />` component supports four distinct built-in modes:

- `mode="nav"`: Flagship draggable squircle liquid lens tab bar (Home, Search, Explore, Alerts).
- `mode="player"`: Minimalist Cupertino audio glass player with playback controls.
- `mode="text"`: Ray-traced typography with elastic fluid drag viscosity.
- `mode="empty"`: Empty translucent liquid glass container for custom children.

```tsx
{/* Interactive Tab Bar */}
<LiquidGlass mode="nav" />

{/* Audio Glass Player */}
<LiquidGlass mode="player" />

{/* Fluid Viscosity Text */}
<LiquidGlass mode="text" text="LIQUID GLASS" />

{/* Custom Glass Card / Container */}
<LiquidGlass mode="empty" radius={24} className="p-6">
  <h2 className="text-white text-xl font-bold">Custom Content</h2>
</LiquidGlass>
```

### 3. Customizing the Navbar

Pass custom items, active index, or theme options directly:

```tsx
import { useState } from 'react';
import { LiquidGlass } from '@mr-prog/liquid-glass';
import { Home, Compass, Bell, User } from 'lucide-react';
import '@mr-prog/liquid-glass/liquid-glass.css';

export function CustomNav() {
  const [active, setActive] = useState(0);

  return (
    <LiquidGlass
      mode="nav"
      activeIndex={active}
      onChange={(idx) => setActive(idx)}
      items={[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'explore', label: 'Explore', icon: Compass },
        { id: 'alerts', label: 'Alerts', icon: Bell, badge: true },
        { id: 'profile', label: 'Profile', icon: User },
      ]}
      shadowTone="dark"
      shadowStep={5}
    />
  );
}
```

### 2. Ray-Traced Refracted Typography

Hardware Snell ray-tracing font renderer with dynamic optical beam:

```tsx
import { RefractedText } from '@mr-prog/liquid-glass';

export function Hero() {
  return (
    <RefractedText
      text="LIQUID GLASS"
      fontSize="clamp(36px, 8vw, 72px)"
      fontWeight={900}
      intensity={1.2}
      animateBeam={true}
    />
  );
}
```

### 3. General Liquid Glass Container & Surface

Curved translucent glass surface with Snell meniscus bevel:

```tsx
import { LiquidGlass } from '@mr-prog/liquid-glass';

export function Card() {
  return (
    <LiquidGlass
      refraction={0.35}
      bevel={28}
      dispersion={0.70}
      darkTint={0.15}
      radius={24}
      className="p-6 text-white"
    >
      <h3>Liquid Glass Surface</h3>
      <p>Crystal clear transmission core with curved edge refraction.</p>
    </LiquidGlass>
  );
}
```

---

## API Reference

### `<LiquidGlass />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `refraction` | `number` | `0.35` | Meniscus edge refraction power via Snell's law ratio (`0.0` to `1.0`). |
| `bevel` | `number` | `28` | Curved border meniscus width in pixels (`0` to `50`). |
| `dispersion` | `number` | `0.70` | Chromatic dispersion rainbow split (`0.0` = achromatic to `2.0`). |
| `blur` | `number` | `0` | Multi-pass concentric frosted Gaussian blur in pixels (`0` to `30`). |
| `darkTint` | `number` | `0.0` | Translucent glass body dark tint absorption (`0.0` to `1.0`). |
| `tintColor` | `string` | `"#000000"` | Hex or RGBA custom tint color palette. |
| `thickness` | `number` | `28` | Volumetric glass depth (Thin, Medium, Deep, Ultra). |
| `viscosity` | `number` | `0.5` | Fluid elastic resistance & spring tension (`0.0` = fluid to `1.0`). |
| `radius` | `number` | `9999` | Global corner radius in pixels (`9999` for capsule). |
| `topRadius` | `number` | `undefined` | Independent top corner radius in pixels. |
| `bottomRadius` | `number` | `undefined` | Independent bottom corner radius in pixels. |
| `borderOpacity` | `number` | `0.12` | Perimeter crystal border stroke opacity (`0.0` = none to `1.0`). |
| `borderGradient` | `string` | `undefined` | Custom CSS gradient rim (Prism, Cyan, Gold, Chrome). |
| `shadowStep` | `number` | `4` | Elevation shadow intensity (`0` to `10`). |
| `shadowTone` | `'dark' \| 'light' \| '3d'` | `'dark'` | Ambient drop shadow personality or stereoscopic 3D. |
| `isShadowInverted` | `boolean` | `false` | Inverts shadow into 360° internal luminous caustic aura. |
| `interactive` | `boolean` | `false` | Live pointer ripple and tactile surface tension response. |
| `wobble` | `number` | `0` | Organic fluid wobble elasticity. |
| `className` | `string` | `""` | Standard CSS / Tailwind class name. |
| `style` | `CSSProperties` | `{}` | Optional inline style overrides. |

---

## Author & License

- **Author**: [MR PROG](https://github.com/MR-PR0G)
- **Repository**: [MR-PR0G/LiquidGlass](https://github.com/MR-PR0G/LiquidGlass)
- **License**: MIT &copy; MR PROG — Free for personal and commercial use.
