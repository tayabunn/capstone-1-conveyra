# Design System: Conveyra

> Standardized design specification based on the [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) and Google Stitch format.
> Single source of truth for UI development, component composition, and AI agent code generation.

---

## 1. Visual Theme & Atmosphere

- **Design Philosophy**: High-agency, restrained executive clarity. Clinical precision with thoughtful human warmth.
- **Density Score**: `5/10` (Balanced Enterprise / Executive Studio — spacious yet info-dense when presenting generated communication assets).
- **Variance Score**: `7/10` (Offset Asymmetric Bento Grids, dynamic preview panels, structured step flows).
- **Motion Score**: `5/10` (Tactile spring physics, micro-interactions, seamless tab state shifts, zero layout jank).
- **Theme Support**: Seamless dual-theme support (Light and Dark modes) using CSS Custom Properties and Tailwind v4 theme bindings.

---

## 2. Color Palette & Roles

Conveyra uses a disciplined palette anchored by crisp slate neutrals, a signature Indigo/Purple primary brand color, and an Electric Blue precision accent.

### Light Mode
| Token | Hex / Value | Role & Usage |
| :--- | :--- | :--- |
| `--background` | `#F8FAFC` (Slate-50) | Main canvas surface |
| `--foreground` | `#0F172A` (Slate-900) | Primary text and headings |
| `--card` | `#FFFFFF` | Card surface and container fill |
| `--card-foreground` | `#0F172A` | Card primary content |
| `--border` | `#E2E8F0` (Slate-200) | Standard structural dividers |
| `--border-subtle` | `rgba(226, 232, 240, 0.6)` | Soft card borders and interior rules |
| `--muted` | `#E2E8F0` | Muted backgrounds and secondary pills |
| `--muted-foreground` | `#475569` (Slate-600) | Secondary body copy, labels, metadata |
| `--brand` | `#6D28D9` (Violet-700) | Primary brand CTA, active tabs, hero highlights |
| `--brand-subtle` | `#F5F3FF` (Violet-50) | Brand badges, active radio backdrops |
| `--brand-border` | `#DDD6FE` (Violet-200) | Brand highlight borders |
| `--electric` | `#2563EB` (Blue-600) | Secondary action, metric chips, speed tags |
| `--electric-subtle` | `#EFF6FF` (Blue-50) | Speed metrics and engine status pills |
| `--destructive` | `#DC2626` (Red-600) | Error messages, destructive actions |

### Dark Mode (`.dark`)
| Token | Hex / Value | Role & Usage |
| :--- | :--- | :--- |
| `--background` | `#090D16` (Obsidian Navy) | Canvas surface in dark mode |
| `--foreground` | `#F8FAFC` (Slate-50) | Primary text in dark mode |
| `--card` | `#0F172A` (Slate-900) | Dark card container surface |
| `--card-foreground` | `#F8FAFC` | Card header & body text |
| `--border` | `#1E293B` (Slate-800) | Dark theme structural borders |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Translucent glass borders |
| `--muted` | `#1E293B` | Muted backgrounds |
| `--muted-foreground` | `#94A3B8` (Slate-400) | Dark theme secondary labels |
| `--brand` | `#8B5CF6` (Violet-500) | High-contrast brand accent in dark mode |
| `--brand-subtle` | `rgba(139, 92, 246, 0.12)` | Translucent violet chips |
| `--brand-border` | `rgba(139, 92, 246, 0.3)` | Illuminated brand borders |
| `--electric` | `#3B82F6` (Blue-500) | High-contrast secondary accent |
| `--electric-subtle` | `rgba(59, 130, 246, 0.12)` | Electric blue status indicator backdrops |
| `--destructive` | `#EF4444` (Red-500) | Error alerts and warning banners |

---

## 3. Typography Architecture

- **Primary Sans**: `Geist Sans` (`var(--font-geist-sans)`, `ui-sans-serif, system-ui, sans-serif`)
  - **Display / H1**: `font-bold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-slate-50`
  - **Section H2**: `font-semibold tracking-tight text-2xl sm:text-3xl text-slate-900 dark:text-slate-100`
  - **Card H3 / Subheadings**: `font-medium text-lg sm:text-xl text-slate-900 dark:text-slate-100`
  - **Body**: `text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-prose`
  - **Caption / Meta**: `text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400`
- **Monospace**: `Geist Mono` (`var(--font-geist-mono)`, `ui-monospace, monospace`)
  - Used for code snippets, JSON outputs, token counters, latency metrics, API response badges, and keyboard shortcuts (`Cmd+K`).

---

## 4. Component Behaviors & Stylings

### Buttons & Interactive Controls
- **Primary Action**: Solid brand or slate (`bg-brand text-white hover:bg-violet-800 dark:bg-violet-600 active:scale-[0.99]`).
- **Secondary / Outline**: Clean 1px border (`border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800`).
- **Tactile Feedback**: Subtle active compression (`active:scale-[0.98] transition-all duration-150`).
- **Focus Rings**: Accessible outline ring (`focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2`).

### Cards & Surfaces
- **Card Radius**: `rounded-2xl` (16px) or `rounded-xl` (12px).
- **Glassmorphism**: `backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80`.
- **Elevation**: Light theme uses `shadow-card` (soft diffused drop shadow + 1px subtle ring). Dark theme uses `shadow-card-dark`.

### Input & Form Fields
- **Labels**: Rendered above inputs with descriptive purpose and optional tooltips.
- **States**: Resting (`border-slate-300 dark:border-slate-700`), Focus (`ring-2 ring-brand border-brand`), Error (`border-red-500 ring-red-500/20`).
- **Accessibility**: Explicit `aria-describedby`, `aria-invalid`, and keyboard focus indicators on all interactive inputs.

### Badges & Status Indicators
- **Provider Badge**: Indicates active AI model (e.g. `Gemini 2.5`, `Groq 300 t/s`, `Cerebras 2000 t/s`).
- **Speed Metric Pill**: High-contrast, compact monospace tag for throughput and latency.

---

## 5. Layout & Grid Principles

1. **Max-Width Containment**:
   - Application shell: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
   - Content / Generator workspace: `max-w-4xl mx-auto`.
2. **Bento Grid Architecture**:
   - Multi-column asymmetric grids (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
   - Dynamic spans for feature hierarchy (`col-span-1 md:col-span-2`).
3. **Mobile-First Responsiveness**:
   - Strict 1-column stack below `768px` (`sm:` / `md:` breakpoint shifts).
   - Zero horizontal scrollbars. Touch targets minimum `44px × 44px`.

---

## 6. Depth & Elevation Tokens

```css
/* Elevation System */
--shadow-subtle: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
--shadow-card: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.06);
--shadow-card-dark: 0 8px 32px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08);
--shadow-elevated: 0 20px 40px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.06);
--shadow-glow-brand: 0 0 30px -4px rgba(109, 40, 217, 0.22);
--shadow-glow-blue: 0 0 30px -4px rgba(37, 99, 235, 0.22);
```

---

## 7. Anti-Patterns & Banned AI Tells

- **NO Pure Black**: Never use `#000000` for dark backgrounds (use `#090D16` or `#0F172A`).
- **NO Generic Emojis as Icons**: Use Lucide icons (`lucide-react`) exclusively.
- **NO Neon Glow Overkill**: Keep glow blurs restrained and tinted to brand hues.
- **NO Unstyled Spinners**: Use structured skeleton loaders matching the incoming content footprint.
- **NO AI Copywriting Clichés**: Avoid "Unleash the power of next-gen AI". Use clear, functional benefit-driven copy.
- **NO Hardcoded Dimensions**: Avoid fixed pixel widths that break on small mobile viewports.

---

## 8. Agent Implementation Guide

When adding new screens, components, or features to Conveyra:
1. Reference this `DESIGN.md` for color hex codes, border radius tokens, and typography hierarchy.
2. Use Tailwind v4 classes that map to the semantic variables defined in [app/globals.css](file:///e:/Flyrank%20AI/capstone-1-conveyra/app/globals.css).
3. Ensure both Light and Dark mode variations are tested and visually balanced.
4. Maintain full keyboard accessibility (`Tab`, `Escape`, `Enter`, `Space`) and ARIA standards across all interactive states.
