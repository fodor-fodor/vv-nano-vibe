# CLAUDE.md — AI Context for VV Nano

This file provides context for AI assistants (Claude, Copilot, etc.) working on this codebase.

## Project Overview

VV Nano is a **React + Vite + Tailwind v4** standalone frontend prototype for a desktop portal aggregator. It simulates a Mac desktop app that connects to multiple fleet telematics platforms via iframes.

**This is a vibe-first prototype** — speed of visual iteration is prioritized over production architecture. The entire UI lives in a single file (`src/App.tsx`) by design.

## Critical Knowledge

### Build & Deploy
- **Build command:** `tsc -b && vite build` — TypeScript is strict, unused variables are **errors** (TS6133)
- **Dev server:** `npm run dev` → `http://localhost:5173`
- **Hosting:** Vercel auto-deploys from `main` → https://vv-nano-vibe.vercel.app
- **Password gate:** `Surf&sn0w` (session-based, stored in `sessionStorage`)

### Tailwind v4 Gotchas
- Uses `@tailwindcss/vite` plugin (NOT PostCSS)
- `@theme` block: `--font-*` namespace is **reserved for font families** — never use `--font-bold: 700`
- Custom classes are defined in `src/index.css` (glass, glow, animations)

### Architecture: Single-File Components
Everything is in `src/App.tsx` (~2700 lines). This is intentional for rapid iteration. Components:

```
App (root)
├── PasswordGate           # Auth gate (sessionStorage)
├── Atmosphere             # Fixed background (gradients, orbs, scanline)
├── TrafficLights          # macOS red/yellow/green dots
├── Sidebar                # Collapsible nav (system items + pinned pages)
│   └── PinnedNavItem      # Hoverable with overflow menu
├── Header                 # Page title, search, notifications, avatar
├── ContentFrame           # Empty state OR portal thumbnail grid
├── AddPortalModal         # Glass overlay for adding portals
├── SearchView             # Pre-search hero → post-search results
├── NotificationsView      # Notification list + AI summary
├── AccountView            # 5-tab settings (profile, sign-in, 2FA, billing, usage)
└── SettingsView           # Theme modes + portal management
```

### State Architecture
- **Portal state** lives in `App` → shared between `ContentFrame` and `SettingsView`
- **Pinned pages** are separate from portals — they represent sidebar URL shortcuts
- **Notifications** state lifted to `App` — enables dynamic header badge count
- **Theme** managed by `useTheme()` hook at App level — syncs to DOM + localStorage
- **No external state library** — all `useState` at component level or lifted to `App`
- Portals start empty (empty state) — user adds them via modal

### Persistence (localStorage)
| Key | Type | Purpose |
|-----|------|---------|
| `vv-theme` | `ThemeMode` | Theme preference (dark/light/system) |
| `vv-portals` | `Portal[]` | Connected portals |
| `vv-pinned-pages` | `PinnedPageData[]` | Sidebar shortcuts (no JSX — icons hydrated on load) |
| `vv-notifications` | `{id, read}[]` | Notification read state |
| `vv-onboarding-completed` | `'1'` | Skip welcome modal |

### Key Types
```typescript
interface Portal { id: string; name: string; url: string; color: string }
interface PinnedPage { id: string; label: string; url: string; icon: React.ReactNode; group?: string }
interface PinnedPageData { id: string; label: string; url: string; group?: string }  // serializable
type ThemeMode = 'dark' | 'light' | 'system'
type AccountTab = 'profile' | 'sign-in' | 'two-factor' | 'billing' | 'usage'
type NotifFilter = 'all' | 'unread' | 'critical' | 'alert' | 'warning' | 'info'
```

### Design System
- **Accent:** `#30BAFF` (was `#00f0ff`, swapped project-wide)
- **Fonts:** Orbitron (display, `.font-display`), Rajdhani (body, `.font-tech`)
- **Glass:** `rgba(5, 10, 20, 0.4)` + `backdrop-filter: blur(20px)` + `border: 1px solid rgba(48, 186, 255, 0.1)`
- **Animations:** All defined in `src/index.css` — `animate-fade-in-up`, `animate-slide-in-right`, `animate-dropdown-in`, `animate-pill-pop`, `hover-lift`, `press-scale`
- **Stagger pattern:** Classes `stagger-1` through `stagger-8` (0.04s increments)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for snappy spring

### Routing
No router library — simple `activePage` string state in `App`:
- `home` → ContentFrame (empty state or portal grid)
- `search` → SearchView
- `notifications` → NotificationsView
- `account` → AccountView
- `settings` → SettingsView
- Any pinned page ID → iframe of that page's URL

### Pinned Pages (Default)
| ID | Label | URL |
|----|-------|-----|
| vehicles | Vehicles | `connectedfleetcentral-staging.connectedfleet.io/#/vehicles` |
| messages | Messages | `www.dcveh.peoplenetonline.com/pfm-main/main/index` |
| compliance | Compliance | `connectedfleetcentral-staging.connectedfleet.io/#/dashboard` |
| drivewyze | Drivewyze | `login.go.fleetworthy.com/bpfleetsprod.onmicrosoft.com` |
| reports | Reports | `demo.platformscience.com` |

## Coding Conventions
- All components are function components with TypeScript
- Inline Tailwind classes (no `className` abstractions)
- SVG icons are inline (no icon library)
- Mock data is hardcoded as `const` arrays above their consuming components
- Animations use CSS keyframes in `index.css`, applied via utility classes
- `useEffect` for: click-outside handlers, dropdown dismiss, localStorage persistence, theme sync
- `useCallback` for notification handlers passed as props

## What NOT to Do
- Don't split `App.tsx` into multiple files (yet) — this is a vibing prototype
- Don't add a router library — the string-based routing is intentional
- Don't add a state management library — `useState` is sufficient
- Don't remove the password gate — it protects the Vercel demo
- Don't change `#30BAFF` — it's the locked-in accent color
- Don't use Tailwind v3 syntax (`@apply` in `@layer`, `tailwind.config.js`) — this is v4
