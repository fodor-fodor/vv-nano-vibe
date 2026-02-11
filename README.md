```
 ___      ___ ___      ___      ________   ________   ________    ________
|\  \    /  /|\  \    /  \    /  \  __  \ |\   ___  \|\   __  \  |\   ___  \
\ \  \  /  / \ \  \  /  / /  /  \ \  \|\  \\ \  \\ \  \ \  \|\  \ \ \  \\ \  \
 \ \  \/  / / \ \  \/  / /  /    \ \   __  \\ \  \\ \  \ \   __  \ \ \  \\ \  \
  \ \    / /   \ \    / /  /      \ \  \ \  \\ \  \\ \  \ \  \ \  \ \ \  \\ \  \
   \ \__/ /     \ \__/ /__/        \ \__\ \__\\ \__\\ \__\ \__\ \__\ \ \__\\ \__\
    \|__|/       \|__|/|__|          \|__|\|__| \|__| \|__|\|__|\|__|  \|__| \|__|
```

# VV Nano — Virtual Vehicle Desktop Prototype

> A rapid UI/UX iteration playground for the Virtual Vehicle desktop experience.
> No Electron, no IPC — just vibes.

[![Deploy with Vercel](https://img.shields.io/badge/Live-vv--nano--vibe.vercel.app-30BAFF?style=flat-square&logo=vercel)](https://vv-nano-vibe.vercel.app)
[![Stack](https://img.shields.io/badge/React_19-Vite_7-Tailwind_v4-blue?style=flat-square)]()

---

## What is this?

VV Nano is a **standalone frontend prototype** that simulates a desktop portal aggregator — think a mini browser-within-a-browser that connects to multiple fleet telematics platforms. It's designed for **fast visual iteration** on the Virtual Vehicle product vision before porting to Electron.

**Password to access the live site:** `Surf&sn0w`

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Portals** | External URLs loaded in iframes within the app shell (fleet management tools, telematics dashboards) |
| **Pinned Pages** | Sidebar shortcuts to specific portal URLs — hoverable with overflow menu (open in new tab, remove) |
| **Empty/Connected States** | Home page transitions from onboarding to portal grid as user adds connections |
| **Glass UI** | Atmospheric dark theme with backdrop blur, glow effects, and energy orb animations |

## Features

- **Home** — Empty state with animated energy orb, transitions to portal thumbnail grid (4 varied layouts: dashboard, table, map, list)
- **Search** — Full-page search with hero bar, typeahead suggestions, filter pills, query-filtered results with AI assistant panel
- **Notifications** — Rich notification center with severity types (critical/alert/warning/info), persistent read/unread states, AI summary sidebar
- **Account** — User profile, sign-in methods (email/Google/passkeys/GitHub), 2FA setup, billing, token usage charts
- **Settings** — Real theme switching (dark/light/system with OS preference detection), portal management with inline edit/delete
- **Pinned URL Pages** — Sidebar items that render external URLs in iframes with dynamic URL bar showing actual hostname
- **Persistence** — Portals, pinned pages, notification read states, and theme preference all survive page reload via localStorage
- **Password Gate** — Session-based auth gate for demo access

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7.3 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Fonts | Orbitron (display) + Rajdhani (tech/body) via Google Fonts |
| Hosting | Vercel (auto-deploy from `main`) |
| State | React `useState` + localStorage persistence — no external state library |

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
```

## Project Structure

```
vv-nano-vibe/
├── public/
│   └── vv-logo.svg          # Composed Virtual Vehicle wordmark (17 vector paths)
├── src/
│   ├── App.tsx               # All components (~2700 lines, single-file architecture)
│   ├── index.css             # Tailwind + custom animations & glass effects
│   ├── main.tsx              # React DOM entry point
│   └── assets/               # Static assets
├── docs/
│   ├── architecture/         # Architecture diagrams and component maps
│   └── sessions/             # Session notes for AI context continuity
├── CLAUDE.md                 # AI assistant instructions (Claude Code)
├── index.html                # HTML shell with Google Fonts
├── vite.config.ts            # Vite + React + Tailwind plugins
└── package.json              # Dependencies and scripts
```

## Architecture

See [`docs/architecture/COMPONENT_MAP.md`](docs/architecture/COMPONENT_MAP.md) for the full component tree and data flow diagram.

## Session History

Development session notes are stored in [`docs/sessions/`](docs/sessions/) for AI context continuity across conversations.

## Design System — Figma

The complete design system lives in Figma, including token variables, presentation-quality artboards, and a full screen catalog.

**Figma File:** [ATG Desktop — White Rabbit](https://www.figma.com/design/G9jDet8JJZg9G3JV1wdFTE/ATG-Desktop---White-Rabbit)

### Design Kit 1.0 (White Rabbit Design Library page)

Five presentation artboards branded **VV Nano Design Kit 1.0**:

| Artboard | Contents |
|----------|----------|
| 01 — Cover | Logo, title, version badge, accent gradient |
| 02 — Color Palette | Full color system with hex values and usage labels |
| 03 — Typography | Orbitron, Rajdhani, JetBrains Mono specimens at all weights/sizes |
| 04 — Components | Glass panels, buttons, inputs, cards, sidebar, badges |
| 05 — Effects & Motion | Glow effects, shadows, blur, animation curves, easing |

### Design Tokens (69 variables, 4 collections)

| Collection | Count | Examples |
|------------|-------|----------|
| Colors | 30 | Accent, background, surface, text, status colors (Dark + Light modes) |
| Spacing | 12 | 4px–64px scale |
| Radius | 7 | sm (4px) through full (9999px) |
| Effects | 20 | Shadow offsets, blur radii, glow opacities (Dark + Light modes) |

### Screen Catalog (VV Nano 2.0 page)

[View in Figma →](https://www.figma.com/design/G9jDet8JJZg9G3JV1wdFTE/ATG-Desktop---White-Rabbit?node-id=169-3661)

20 artboards covering every screen, modal, and state in the app:

| # | Screen | # | Screen |
|---|--------|---|--------|
| 01 | Password Gate | 11 | Account · Usage |
| 02 | Home · Empty State | 12 | Settings |
| 03 | Home · Portals | 13 | Pinned Page · Iframe |
| 04 | Search · Hero | 14 | Welcome Modal · Panel 1 |
| 05 | Search · Results | 15 | Welcome Modal · Panel 2 |
| 06 | Notifications | 16 | Welcome Modal · Panel 3 |
| 07 | Account · Profile | 17 | Add Portal Modal |
| 08 | Account · Sign-in | 18 | Add Pinned Page Modal |
| 09 | Account · Two-Factor | 19 | Create Section Modal |
| 10 | Account · Billing | 20 | Sidebar Collapsed |

## Design Language

| Token | Value |
|-------|-------|
| Accent | `#30BAFF` |
| Background | `#1a1a2e` (outer), `#050a14` (app chrome) |
| Glass | `rgba(5, 10, 20, 0.4)` + `blur(20px)` |
| Font Display | `Orbitron` |
| Font Body | `Rajdhani` |
| Font Mono | `JetBrains Mono` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Glow | `box-shadow: 0 0 30px rgba(48, 186, 255, 0.15)` |

---

Built with [Claude Code](https://claude.com/claude-code)
