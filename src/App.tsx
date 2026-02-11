import { useState } from 'react'

// ─── Logo ───────────────────────────────────────────────────
const VVLogo = () => (
  <img src="/vv-logo.svg" alt="Virtual Vehicle" className="h-full w-auto" />
)

// ─── Atmospheric Background ─────────────────────────────────
function Atmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Radial gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,240,255,0.04)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,100,255,0.03)_0%,transparent_50%)]" />

      {/* Drifting orbs */}
      <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full bg-[#30BAFF] opacity-[0.02] blur-[150px] animate-drift" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600 opacity-[0.03] blur-[120px] animate-drift" style={{ animationDelay: '-10s' }} />

      {/* Scanline */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#30BAFF]/10 to-transparent animate-scanline" />

      {/* Speed lines - subtle horizontal */}
      <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#30BAFF]/5 to-transparent" />
      <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#30BAFF]/3 to-transparent" />
    </div>
  )
}

// ─── Nav Items ──────────────────────────────────────────────
const navItems = [
  { id: 'home', label: 'Home', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )},
  { id: 'vehicles', label: 'Vehicles', divider: true, icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.126-.504 1.126-1.125V14.25" />
    </svg>
  )},
  { id: 'messages', label: 'Messages', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )},
  { id: 'compliance', label: 'Compliance', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  )},
  { id: 'drivewyze', label: 'Drivewyze', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  )},
  { id: 'reports', label: 'Reports', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )},
]

// ─── Sidebar ────────────────────────────────────────────────
function Sidebar({ isCollapsed, activePage, onToggle, onNavigate }: {
  isCollapsed: boolean
  activePage: string
  onToggle: () => void
  onNavigate: (id: string) => void
}) {
  return (
    <aside className={`sidebar-transition ${isCollapsed ? 'w-[72px]' : 'w-[260px]'} glass-subtle flex flex-col justify-between relative z-20 flex-shrink-0`}>
      <div>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 mb-1">
          <div className={`flex-shrink-0 h-6 ${isCollapsed ? 'w-6 overflow-hidden' : ''}`}>
            <VVLogo />
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full px-5 py-2 flex items-center text-gray-600 hover:text-[#30BAFF] transition-colors mb-2 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-4 h-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Nav items */}
        <nav className="flex flex-col px-3 gap-0.5">
          {navItems.map((item) => (
            <div key={item.id}>
            {item.divider && <div className="h-px w-full bg-[#30BAFF]/5 my-2" />}
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activePage === item.id
                  ? 'bg-[#30BAFF]/10 text-[#30BAFF] text-glow-sm'
                  : 'text-gray-500 hover:bg-[#30BAFF]/5 hover:text-[#30BAFF]'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3 font-tech font-medium text-[15px] fade-text tracking-wide">{item.label}</span>
              )}
              {activePage === item.id && (
                <div className="absolute left-0 w-[2px] h-5 bg-[#30BAFF] rounded-r-full cyan-glow" />
              )}
            </button>
            </div>
          ))}

          <div className="h-px w-full bg-[#30BAFF]/5 my-3" />

          <button className="group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-[#30BAFF]/5 hover:text-[#30BAFF] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {!isCollapsed && <span className="ml-3 font-tech font-medium text-[15px] fade-text tracking-wide">More</span>}
          </button>
        </nav>
      </div>

      {/* Settings at bottom */}
      <div className="p-3">
        <button
          onClick={() => onNavigate('settings')}
          className={`group flex items-center px-3 py-2.5 rounded-lg transition-all w-full ${
            activePage === 'settings'
              ? 'bg-[#30BAFF]/10 text-[#30BAFF] text-glow-sm'
              : 'text-gray-600 hover:bg-[#30BAFF]/5 hover:text-[#30BAFF]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {!isCollapsed && <span className="ml-3 font-tech font-medium text-[15px] fade-text tracking-wide">Settings</span>}
        </button>

        {/* Status indicator */}
        {!isCollapsed && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-[#30BAFF]/5 border border-[#30BAFF]/10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#30BAFF] shadow-[0_0_6px_rgba(48,186,255,0.5)]" />
              <span className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">System Online</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ─── Header ─────────────────────────────────────────────────
function Header({ activePage }: { activePage: string }) {
  const pageLabels: Record<string, string> = {
    home: 'HOME',
    vehicles: 'VEHICLES',
    messages: 'MESSAGES',
    compliance: 'COMPLIANCE',
    drivewyze: 'DRIVEWYZE',
    reports: 'REPORTS',
    settings: 'SETTINGS',
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 flex-shrink-0 border-b border-[#30BAFF]/5">
      {/* Page title */}
      <div className="flex items-center gap-4">
        <h1 className="font-display text-sm font-semibold tracking-[0.2em] text-white/80">
          {pageLabels[activePage] || 'DASHBOARD'}
        </h1>
        <div className="h-4 w-px bg-gray-800" />
        <span className="font-mono text-[10px] text-gray-600 tracking-wider">v1.0.0-alpha</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="p-2 text-gray-500 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 rounded-lg transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 rounded-lg transition-all relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#30BAFF] rounded-full shadow-[0_0_6px_rgba(0,240,255,0.6)]" />
        </button>

        <div className="h-6 w-px bg-gray-800 mx-1" />

        {/* Avatar */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#30BAFF]/20 to-blue-600/20 p-px">
            <div className="w-full h-full rounded-[7px] bg-[#0a1124] flex items-center justify-center">
              <span className="font-display text-[10px] font-bold text-[#30BAFF]">AF</span>
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}

// ─── Browser Controls ───────────────────────────────────────
function BrowserControls() {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <div className="h-4 w-px bg-gray-800 mx-1" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#30BAFF]/[0.03] border border-[#30BAFF]/[0.06]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#30BAFF]/60" />
          <span className="font-mono text-[11px] text-gray-500 select-none tracking-wide">portal.vvnano.com/dashboard</span>
        </div>
      </div>

      <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-tech font-medium text-gray-500 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 transition-all tracking-wider uppercase">
        <span>External</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </button>
    </div>
  )
}

// ─── Content Frame ──────────────────────────────────────────
function ContentFrame({ label }: { label: string }) {
  return (
    <div className="flex-1 w-full rounded-xl border border-[#30BAFF]/15 animate-pulse-glow iframe-container relative overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-[#30BAFF]/40 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-[#30BAFF]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-[#30BAFF]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-[#30BAFF]/40 to-transparent" />

      <div className="w-full h-full flex flex-col items-center justify-center relative">
        {/* Inner atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#30BAFF] opacity-[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="z-10 flex flex-col items-center gap-6">
          {/* Energy orb */}
          <div className="w-20 h-20 flex items-center justify-center relative">
            <svg viewBox="0 0 80 80" className="w-20 h-20 absolute" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="orb-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="orb-glow-hot">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="orb-grad" cx="38%" cy="32%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="20%" stopColor="#30BAFF" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#30BAFF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1a6faa" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="orb-grad2" cx="55%" cy="60%">
                  <stop offset="0%" stopColor="#30BAFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#30BAFF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer pulsing ring 1 */}
              <circle cx="40" cy="40" r="24" fill="none" stroke="#30BAFF" strokeWidth="0.4" opacity="0.1" className="animate-orb-ring" />
              {/* Outer pulsing ring 2 - offset */}
              <circle cx="40" cy="40" r="20" fill="none" stroke="#30BAFF" strokeWidth="0.6" opacity="0.08" className="animate-orb-ring2" />

              {/* Secondary blob - counter-rotating */}
              <path fill="url(#orb-grad2)" opacity="0.6" filter="url(#orb-glow)">
                <animate
                  attributeName="d"
                  dur="1.8s"
                  repeatCount="indefinite"
                  values="
                    M40,24 C50,24 56,30 56,40 C56,50 50,56 40,56 C30,56 24,50 24,40 C24,30 30,24 40,24Z;
                    M42,22 C54,26 58,34 54,44 C50,54 40,58 32,54 C24,50 20,38 26,28 C32,18 36,20 42,22Z;
                    M38,23 C48,20 58,30 56,42 C54,54 44,58 34,54 C24,50 20,40 24,30 C28,20 30,24 38,23Z;
                    M40,24 C50,24 56,30 56,40 C56,50 50,56 40,56 C30,56 24,50 24,40 C24,30 30,24 40,24Z
                  "
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                />
              </path>

              {/* Primary morphing blob */}
              <path fill="url(#orb-grad)" filter="url(#orb-glow-hot)">
                <animate
                  attributeName="d"
                  dur="2.2s"
                  repeatCount="indefinite"
                  values="
                    M40,22 C52,22 58,30 58,40 C58,52 50,58 40,58 C28,58 22,50 22,40 C22,28 30,22 40,22Z;
                    M44,20 C56,26 60,36 54,46 C48,56 36,60 28,54 C20,48 18,36 24,26 C30,16 34,18 44,20Z;
                    M36,19 C48,16 62,28 58,42 C54,56 42,62 30,56 C18,50 14,36 22,24 C30,12 28,20 36,19Z;
                    M43,21 C55,24 60,38 54,48 C48,58 34,60 26,52 C18,44 18,30 26,22 C34,14 35,20 43,21Z;
                    M37,20 C50,18 60,30 58,44 C56,56 44,60 32,56 C20,52 16,40 20,28 C24,16 28,20 37,20Z;
                    M40,22 C52,22 58,30 58,40 C58,52 50,58 40,58 C28,58 22,50 22,40 C22,28 30,22 40,22Z
                  "
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                />
              </path>

              {/* Hot core - pulsing */}
              <circle cx="40" cy="40" r="8" fill="#30BAFF" opacity="0.15" className="animate-orb-core" />
              <circle cx="40" cy="40" r="4" fill="#30BAFF" opacity="0.4" className="animate-orb-core-bright" />
              <circle cx="40" cy="40" r="1.5" fill="#ffffff" opacity="0.6" className="animate-orb-core-bright" />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center">
            <h3 className="font-display text-xl font-semibold tracking-wider text-white/90 text-glow-sm mb-3">Welcome to VV Nano</h3>
            <p className="font-tech text-sm text-gray-500 max-w-sm leading-relaxed tracking-wide">
              Looks like you don't have any connected portals yet.
            </p>
          </div>

          {/* Start Setup button */}
          <button className="mt-2 px-6 py-2.5 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] font-tech font-semibold text-sm tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300">
            Start Setup
          </button>

          {/* Waiting dots */}
          <div className="flex gap-2 mt-2">
            <div className="w-1 h-1 rounded-full bg-gray-600 shadow-[0_0_6px_rgba(107,114,128,0.3)] animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-gray-600 shadow-[0_0_6px_rgba(107,114,128,0.3)] animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 rounded-full bg-gray-600 shadow-[0_0_6px_rgba(107,114,128,0.3)] animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>

          {/* Status readout - disconnected */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 border-l-2 border-gray-800 pl-3">
              <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Status</span>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" />
              <span className="font-mono text-[10px] text-red-500">Disconnected</span>
            </div>
            <div className="flex items-center gap-2 border-l-2 border-gray-800 pl-3">
              <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Latency</span>
              <span className="font-mono text-[10px] text-gray-600">--ms</span>
            </div>
            <div className="flex items-center gap-2 border-l-2 border-gray-800 pl-3">
              <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Portals</span>
              <span className="font-mono text-[10px] text-gray-600">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Traffic Lights ─────────────────────────────────────────
function TrafficLights() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#EC6A5E] hover:brightness-110 transition-all cursor-pointer" />
      <div className="w-3 h-3 rounded-full bg-[#F4BF4F] hover:brightness-110 transition-all cursor-pointer" />
      <div className="w-3 h-3 rounded-full bg-[#61C554] hover:brightness-110 transition-all cursor-pointer" />
    </div>
  )
}

// ─── App ────────────────────────────────────────────────────
export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('home')

  const pageLabels: Record<string, string> = {
    home: 'Home Dashboard',
    vehicles: 'Vehicle Management',
    messages: 'Messages',
    compliance: 'Compliance',
    drivewyze: 'Drivewyze',
    reports: 'Reports',
    settings: 'Settings',
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#1a1a2e] p-6">
      <Atmosphere />

      {/* Mac window frame */}
      <div className="relative z-10 flex flex-col w-full h-full max-w-[1440px] max-h-[900px] rounded-xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/[0.08]">
        {/* Title bar */}
        <div className="h-11 bg-[#0c1019] flex items-center px-4 flex-shrink-0 border-b border-white/[0.06]">
          <TrafficLights />
        </div>

        {/* App content */}
        <div className="flex flex-1 overflow-hidden bg-[#050a14] text-gray-400">
          <Sidebar
            isCollapsed={isCollapsed}
            activePage={activePage}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            onNavigate={setActivePage}
          />

          <main className="flex-1 flex flex-col relative min-w-0 z-10">
            <Header activePage={activePage} />

            <div className="flex-1 flex flex-col px-6 pb-5 pt-4 overflow-hidden">
              <BrowserControls />
              <ContentFrame label={pageLabels[activePage] || 'Content'} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
