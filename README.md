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

## Design Language

| Token | Value |
|-------|-------|
| Accent | `#30BAFF` |
| Background | `#1a1a2e` (outer), `#050a14` (app chrome) |
| Glass | `rgba(5, 10, 20, 0.4)` + `blur(20px)` |
| Font Display | `Orbitron` |
| Font Body | `Rajdhani` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Glow | `box-shadow: 0 0 30px rgba(48, 186, 255, 0.15)` |

---

Built with [Claude Code](https://claude.com/claude-code)
