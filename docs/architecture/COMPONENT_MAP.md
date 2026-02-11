# Component Architecture — VV Nano

## Application Shell

```
┌─────────────────────────────────────────────────────────────────────┐
│  PasswordGate (sessionStorage auth)                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Atmosphere (fixed background: gradients, orbs, scanline)     │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Mac Window Frame (rounded, shadow, border)              │  │  │
│  │  │  ┌─────────────────────────────────────────────────────┐ │  │  │
│  │  │  │  Title Bar [ TrafficLights ●●● ]                    │ │  │  │
│  │  │  ├──────────┬──────────────────────────────────────────┤ │  │  │
│  │  │  │          │  Header                                  │ │  │  │
│  │  │  │          │  [ PAGE TITLE | v1.0.0-alpha ]  [🔍][🔔][AF] │  │  │
│  │  │  │          ├──────────────────────────────────────────┤ │  │  │
│  │  │  │ Sidebar  │                                          │ │  │  │
│  │  │  │          │        << Active View >>                 │ │  │  │
│  │  │  │ [VV]     │                                          │ │  │  │
│  │  │  │ [◀]      │   ContentFrame / SearchView /            │ │  │  │
│  │  │  │ ──────── │   NotificationsView / AccountView /      │ │  │  │
│  │  │  │ Search   │   SettingsView / Iframe (pinned)         │ │  │  │
│  │  │  │ Home     │                                          │ │  │  │
│  │  │  │ ──────── │                                          │ │  │  │
│  │  │  │ Vehicles │                                          │ │  │  │
│  │  │  │ Messages │                                          │ │  │  │
│  │  │  │ Complnce │                                          │ │  │  │
│  │  │  │ Drivewyze│                                          │ │  │  │
│  │  │  │ Reports  │                                          │ │  │  │
│  │  │  │ ──────── │                                          │ │  │  │
│  │  │  │ More     │                                          │ │  │  │
│  │  │  │          │                                          │ │  │  │
│  │  │  │ Settings │                                          │ │  │  │
│  │  │  │ [Online] │                                          │ │  │  │
│  │  │  └──────────┴──────────────────────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Tree

```
App
├── PasswordGate                     # Auth → sessionStorage("vv-auth")
│   ├── Atmosphere
│   └── VVLogo
│
├── Atmosphere                       # Fixed BG layer (z-0)
├── TrafficLights                    # ●●● macOS dots
│
├── Sidebar                          # Collapsible (72px / 200px)
│   ├── VVLogo
│   ├── [Collapse Toggle]
│   ├── systemNavItems[]             # Search, Home (non-removable)
│   ├── PinnedNavItem[]              # Vehicles, Messages, etc.
│   │   └── [Overflow Menu]          #   → Open in new tab
│   │                                #   → Remove from sidebar
│   ├── [More]
│   ├── [Settings]
│   └── [System Online indicator]
│
├── Header
│   ├── Page Title (dynamic)
│   ├── [Search icon] → navigates to search
│   ├── [Bell icon] → navigates to notifications
│   │   └── Badge (hidden when on notifications page)
│   └── [AF Avatar] → navigates to account
│
├── << View Router (activePage string) >>
│   │
│   ├── home ──────────── ContentFrame
│   │                     ├── [Empty State]
│   │                     │   ├── Energy Orb (SVG animate)
│   │                     │   ├── "Welcome to VV Nano"
│   │                     │   ├── [Start Setup] → AddPortalModal
│   │                     │   └── Status: Disconnected / --ms / 0
│   │                     │
│   │                     └── [Connected State]
│   │                         ├── Portal Grid (2-col)
│   │                         │   └── Portal Card (thumbnail + info)
│   │                         ├── [+ Add Portal] → AddPortalModal
│   │                         └── Status: Connected / 24ms / N
│   │
│   ├── search ────────── SearchView
│   │                     ├── [Pre-search] Hero bar + suggestions + filters
│   │                     └── [Post-search] Compact bar + result cards + AI panel
│   │
│   ├── notifications ─── NotificationsView
│   │                     ├── Filter toolbar
│   │                     ├── Notification cards (read/unread toggle)
│   │                     └── AI Summary sidebar
│   │
│   ├── account ────────── AccountView
│   │                      ├── Secondary sidebar (Profile, Sign-in, 2FA, Billing, Usage)
│   │                      ├── Profile tab (name, email ✓, theme, shortcuts, delete)
│   │                      ├── Sign-in tab (email, Google, passkeys, GitHub)
│   │                      ├── Two-Factor tab (authenticator, SMS, recovery)
│   │                      ├── Billing tab (plan, payment, history)
│   │                      └── Usage tab (stats, progress bar, weekly/monthly charts)
│   │
│   ├── settings ────────── SettingsView
│   │                       ├── Theme modes (dark/light/system with preview swatches)
│   │                       └── Portal list (edit/delete) + [Add Portal]
│   │
│   └── <pinned page> ──── BrowserControls + iframe(url)
│
└── AddPortalModal (overlay, z-50)   # Shared between home + settings
```

## Data Flow

```
                    ┌──────────────────────┐
                    │         App          │
                    │                      │
                    │ portals[]        ────┼──→ localStorage('vv-portals')
                    │ pinnedPages[]    ────┼──→ localStorage('vv-pinned-pages')
                    │ notifications[]  ────┼──→ localStorage('vv-notifications')
                    │ themeMode        ────┼──→ localStorage('vv-theme')
                    │ activePage           │       + <html data-theme>
                    │ showModal            │
                    └──────┬───────────────┘
                           │
       ┌───────────┬───────┼────────┬────────────┬────────────┐
       │           │       │        │            │            │
       ▼           ▼       ▼        ▼            ▼            ▼
  ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐
  │ Sidebar  │ │ Header │ │Content │ │ Settings │ │ Notifs   │ │ Portal │
  │          │ │        │ │ Frame  │ │          │ │ View     │ │ Modal  │
  │pinned[]  │ │unread  │ │        │ │portals[] │ │notifs[]  │ │        │
  │onRemove()│ │Count   │ │portals │ │theme     │ │onToggle()│ │onAdd() │
  └─────────┘ └────────┘ └────────┘ │onSetTheme│ │onMarkAll │ └────────┘
                                     └──────────┘ └──────────┘
```

## Routing Table

| `activePage` | View Component | Has iframe? | Notes |
|---|---|---|---|
| `home` | ContentFrame | No | Empty state or portal grid |
| `search` | SearchView | No | Hero search → results + AI panel |
| `notifications` | NotificationsView | No | Notification list + AI summary |
| `account` | AccountView | No | 5-tab secondary sidebar layout |
| `settings` | SettingsView | No | Theme + portal management |
| `vehicles` | iframe | Yes | `connectedfleetcentral.../#/vehicles` |
| `messages` | iframe | Yes | `dcveh.peoplenetonline.com/...` |
| `compliance` | iframe | Yes | `connectedfleetcentral.../#/dashboard` |
| `drivewyze` | iframe | Yes | `login.go.fleetworthy.com/...` |
| `reports` | iframe | Yes | `demo.platformscience.com` |

## Animation System (`index.css`)

```
Entrance Animations          Micro-interactions       Ambient
─────────────────           ────────────────────     ─────────
animate-fade-in-up          press-scale (:active)    animate-drift
animate-fade-in-down        hover-lift (:hover)      animate-pulse-glow
animate-fade-in-scale       nav-indicator            animate-scanline
animate-slide-in-right                               animate-fog
animate-dropdown-in         Stagger Classes          animate-float
animate-pill-pop            stagger-1..stagger-8     animate-orb-ring
animate-glow-in             (0.04s increments)       animate-orb-core
```

## Persistence Layer

```
localStorage
├── vv-theme          → ThemeMode ('dark' | 'light' | 'system')
├── vv-portals        → Portal[] JSON
├── vv-pinned-pages   → PinnedPageData[] JSON (no JSX icons)
└── vv-notifications  → {id: number, read: boolean}[] JSON

sessionStorage
├── vv-auth           → '1' (password gate)

localStorage (one-time)
└── vv-onboarding-completed → '1' (skip welcome modal)
```

## File Size Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/App.tsx` | ~2700 | All components, types, mock data, hooks |
| `src/index.css` | ~281 | Tailwind + 20+ keyframe animations + light theme overrides |
| `src/main.tsx` | ~8 | React DOM mount |
| `public/vv-logo.svg` | ~53 | 17-path composed wordmark |
