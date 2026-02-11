import { useState, useRef, useEffect } from 'react'

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

// ─── System Nav Items (non-removable) ───────────────────────
const systemNavItems = [
  { id: 'search', label: 'Search', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )},
  { id: 'home', label: 'Home', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )},
]

// ─── Pinned Page Type ───────────────────────────────────────
interface PinnedPage {
  id: string
  label: string
  url: string
  icon: React.ReactNode
  group?: string
}

const defaultPinnedPages: PinnedPage[] = [
  { id: 'vehicles', label: 'Vehicles', url: 'https://connectedfleetcentral-staging.connectedfleet.io/#/vehicles', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.126-.504 1.126-1.125V14.25" />
    </svg>
  )},
  { id: 'messages', label: 'Messages', url: 'https://www.dcveh.peoplenetonline.com/pfm-main/main/index', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )},
  { id: 'compliance', label: 'Compliance', url: 'https://connectedfleetcentral-staging.connectedfleet.io/#/dashboard', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  )},
  { id: 'drivewyze', label: 'Drivewyze', url: 'https://login.go.fleetworthy.com/bpfleetsprod.onmicrosoft.com', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  )},
  { id: 'reports', label: 'Reports', url: 'https://demo.platformscience.com', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )},
]

// ─── Pinned Nav Item (with overflow menu) ──────────────────
function PinnedNavItem({ item, isActive, isCollapsed, onNavigate, onRemove }: {
  item: PinnedPage
  isActive: boolean
  isCollapsed: boolean
  onNavigate: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div className="relative group">
      <button
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#30BAFF]/10 text-[#30BAFF] text-glow-sm'
            : 'text-gray-500 hover:bg-[#30BAFF]/5 hover:text-[#30BAFF]'
        }`}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!isCollapsed && (
          <span className="ml-3 font-tech font-medium text-[15px] fade-text tracking-wide flex-1 text-left">{item.label}</span>
        )}
        {isActive && (
          <div className="absolute left-0 w-[2px] h-5 bg-[#30BAFF] rounded-r-full cyan-glow" />
        )}
      </button>

      {/* Overflow dots — visible on hover */}
      {!isCollapsed && (
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-700 hover:text-[#30BAFF] hover:bg-[#30BAFF]/10 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      )}

      {/* Tooltip menu */}
      {menuOpen && (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-[#0c1424] border border-white/[0.1] shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-dropdown-in">
          <button
            onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank'); setMenuOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-gray-400 hover:text-white hover:bg-[#30BAFF]/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <span className="font-tech text-xs tracking-wide">Open in new tab</span>
          </button>
          <div className="h-px bg-white/[0.06]" />
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(item.id); setMenuOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.533-1.8a3.75 3.75 0 00-5.98-4.243m12.714 3.658A9.956 9.956 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.956 9.956 0 004.315 8.22" />
            </svg>
            <span className="font-tech text-xs tracking-wide">Remove from sidebar</span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────
function Sidebar({ isCollapsed, activePage, onToggle, onNavigate, pinnedPages, onRemovePinned, onPinUrl, onGroupTabs }: {
  isCollapsed: boolean
  activePage: string
  onToggle: () => void
  onNavigate: (id: string) => void
  pinnedPages: PinnedPage[]
  onRemovePinned: (id: string) => void
  onPinUrl: () => void
  onGroupTabs: () => void
}) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!moreMenuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setMoreMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [moreMenuOpen])

  const toggleSection = (name: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Derive grouped and ungrouped pages
  const ungroupedPages = pinnedPages.filter(p => !p.group)
  const groupNames = [...new Set(pinnedPages.filter(p => p.group).map(p => p.group!))]
  const groupedPages = groupNames.map(name => ({
    name,
    pages: pinnedPages.filter(p => p.group === name),
  }))

  return (
    <aside className={`sidebar-transition ${isCollapsed ? 'w-[72px]' : 'w-[200px]'} glass-subtle flex flex-col justify-between relative z-20 flex-shrink-0`}>
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
          {/* System items: Search, Home */}
          {systemNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
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
          ))}

          {/* Divider before pinned pages */}
          {pinnedPages.length > 0 && <div className="h-px w-full bg-[#30BAFF]/5 my-2" />}

          {/* Ungrouped pinned pages */}
          {ungroupedPages.map((item) => (
            <PinnedNavItem
              key={item.id}
              item={item}
              isActive={activePage === item.id}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
              onRemove={onRemovePinned}
            />
          ))}

          {/* Grouped sections */}
          {groupedPages.map(({ name, pages }) => (
            <div key={name}>
              <button
                onClick={() => toggleSection(name)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 mt-1 text-gray-600 hover:text-gray-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${collapsedSections.has(name) ? '-rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                {!isCollapsed && (
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase flex-1 text-left">{name}</span>
                )}
                {!isCollapsed && (
                  <span className="font-mono text-[9px] text-gray-700">{pages.length}</span>
                )}
              </button>
              {!collapsedSections.has(name) && pages.map((item) => (
                <PinnedNavItem
                  key={item.id}
                  item={item}
                  isActive={activePage === item.id}
                  isCollapsed={isCollapsed}
                  onNavigate={onNavigate}
                  onRemove={onRemovePinned}
                />
              ))}
            </div>
          ))}

          <div className="h-px w-full bg-[#30BAFF]/5 my-3" />

          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="w-full group flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-[#30BAFF]/5 hover:text-[#30BAFF] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {!isCollapsed && <span className="ml-3 font-tech font-medium text-[15px] fade-text tracking-wide">More</span>}
            </button>

            {moreMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-52 rounded-lg bg-[#0c1424] border border-white/[0.1] shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-dropdown-in">
                <button
                  onClick={() => { onPinUrl(); setMoreMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-gray-400 hover:text-white hover:bg-[#30BAFF]/5 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  <span className="font-tech text-xs tracking-wide">Pin a URL</span>
                </button>
                <div className="h-px bg-white/[0.06]" />
                <button
                  onClick={() => { onGroupTabs(); setMoreMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-gray-400 hover:text-white hover:bg-[#30BAFF]/5 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  <span className="font-tech text-xs tracking-wide">Group Tabs</span>
                </button>
              </div>
            )}
          </div>
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
function Header({ activePage, onNavigate, pinnedPages }: { activePage: string; onNavigate: (id: string) => void; pinnedPages: PinnedPage[] }) {
  const systemLabels: Record<string, string> = {
    search: 'SEARCH',
    notifications: 'NOTIFICATIONS',
    account: 'ACCOUNT',
    home: 'HOME',
    settings: 'SETTINGS',
  }
  const pinnedLabel = pinnedPages.find(p => p.id === activePage)?.label.toUpperCase()
  const pageLabels = { ...systemLabels, ...(pinnedLabel ? { [activePage]: pinnedLabel } : {}) }

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
        <button onClick={() => onNavigate('search')} className="p-2 text-gray-500 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 rounded-lg transition-all group press-scale">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        {/* Notifications */}
        <button onClick={() => onNavigate('notifications')} className="p-2 text-gray-500 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 rounded-lg transition-all relative press-scale">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {activePage !== 'notifications' && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#30BAFF] rounded-full shadow-[0_0_6px_rgba(48,186,255,0.6)]" />}
        </button>

        <div className="h-6 w-px bg-gray-800 mx-1" />

        {/* Avatar */}
        <button onClick={() => onNavigate('account')} className="flex items-center gap-2 hover:opacity-80 transition-opacity press-scale">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-[#30BAFF]/20 to-blue-600/20 p-px ${activePage === 'account' ? 'shadow-[0_0_12px_rgba(48,186,255,0.3)]' : ''}`}>
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

// ─── Portal Types & Defaults ────────────────────────────────
interface Portal {
  id: string
  name: string
  url: string
  color: string
}

const portalColors = ['#30BAFF', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#6366F1', '#14B8A6']

// ─── Add Portal Modal ──────────────────────────────────────
function AddPortalModal({ onAdd, onClose, portalCount }: { onAdd: (p: Portal) => void; onClose: () => void; portalCount: number }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!name.trim() || !url.trim()) return
    const color = portalColors[portalCount % portalColors.length]
    onAdd({ id: Date.now().toString(), name: name.trim(), url: url.trim(), color })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-scale" style={{ animationDuration: '0.2s' }} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="rounded-2xl bg-[#0c1424] border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(48,186,255,0.05)] overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#30BAFF]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#30BAFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wider text-white/90">Connect Portal</h3>
                <p className="font-mono text-[10px] text-gray-600">Add a new portal to your workspace</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 pb-2 flex flex-col gap-3">
            <div>
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-1.5">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Fleet Manager"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-tech text-white/80 tracking-wide placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 focus:shadow-[0_0_12px_rgba(48,186,255,0.06)] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-1.5">URL</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://portal-url.com"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-mono text-white/60 placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 focus:shadow-[0_0_12px_rgba(48,186,255,0.06)] transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-5 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs font-tech text-gray-500 hover:text-gray-400 transition-all press-scale tracking-wider">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim() || !url.trim()}
              className="px-5 py-2 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] text-xs font-tech font-semibold tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 hover:shadow-[0_0_20px_rgba(48,186,255,0.15)] transition-all press-scale disabled:opacity-30 disabled:pointer-events-none"
            >
              Connect Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Add Pinned Page Modal ──────────────────────────────────
function AddPinnedPageModal({ onAdd, onClose }: { onAdd: (label: string, url: string) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!name.trim() || !url.trim()) return
    onAdd(name.trim(), url.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-scale" style={{ animationDuration: '0.2s' }} />
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="rounded-2xl bg-[#0c1424] border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(48,186,255,0.05)] overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#30BAFF]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#30BAFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wider text-white/90">Pin a URL</h3>
                <p className="font-mono text-[10px] text-gray-600">Add a shortcut to your sidebar</p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-2 flex flex-col gap-3">
            <div>
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-1.5">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Fleet Dashboard"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-tech text-white/80 tracking-wide placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 focus:shadow-[0_0_12px_rgba(48,186,255,0.06)] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-1.5">URL</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-mono text-white/60 placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 focus:shadow-[0_0_12px_rgba(48,186,255,0.06)] transition-all"
              />
            </div>
          </div>
          <div className="px-6 py-5 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs font-tech text-gray-500 hover:text-gray-400 transition-all press-scale tracking-wider">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim() || !url.trim()}
              className="px-5 py-2 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] text-xs font-tech font-semibold tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 hover:shadow-[0_0_20px_rgba(48,186,255,0.15)] transition-all press-scale disabled:opacity-30 disabled:pointer-events-none"
            >
              Pin URL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Create Section Modal ───────────────────────────────────
function CreateSectionModal({ pinnedPages, onAssign, onClose }: { pinnedPages: PinnedPage[]; onAssign: (pageIds: string[], sectionName: string) => void; onClose: () => void }) {
  const [sectionName, setSectionName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSubmit = () => {
    if (!sectionName.trim() || selectedIds.length === 0) return
    onAssign(selectedIds, sectionName.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-scale" style={{ animationDuration: '0.2s' }} />
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="rounded-2xl bg-[#0c1424] border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(48,186,255,0.05)] overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#30BAFF]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#30BAFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wider text-white/90">Group Tabs</h3>
                <p className="font-mono text-[10px] text-gray-600">Organize tabs into a section</p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-2 flex flex-col gap-3">
            <div>
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-1.5">Section Name</label>
              <input
                value={sectionName}
                onChange={e => setSectionName(e.target.value)}
                placeholder="e.g. Fleet Tools"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-tech text-white/80 tracking-wide placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 focus:shadow-[0_0_12px_rgba(48,186,255,0.06)] transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-1.5">Select Tabs</label>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-white/[0.08] bg-white/[0.02]">
                {pinnedPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => toggleId(page.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all ${
                      selectedIds.includes(page.id)
                        ? 'bg-[#30BAFF]/10 text-[#30BAFF]'
                        : 'text-gray-400 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                      selectedIds.includes(page.id)
                        ? 'border-[#30BAFF] bg-[#30BAFF]/20'
                        : 'border-gray-600'
                    }`}>
                      {selectedIds.includes(page.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-gray-500">{page.icon}</span>
                    <span className="font-tech text-xs tracking-wide">{page.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs font-tech text-gray-500 hover:text-gray-400 transition-all press-scale tracking-wider">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!sectionName.trim() || selectedIds.length === 0}
              className="px-5 py-2 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] text-xs font-tech font-semibold tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 hover:shadow-[0_0_20px_rgba(48,186,255,0.15)] transition-all press-scale disabled:opacity-30 disabled:pointer-events-none"
            >
              Create Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Content Frame ──────────────────────────────────────────
function ContentFrame({ portals, onAddPortal }: { portals: Portal[]; onAddPortal: () => void }) {
  return (
    <div className="flex-1 w-full rounded-xl border border-[#30BAFF]/15 animate-pulse-glow animate-glow-in iframe-container relative overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-[#30BAFF]/40 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-[#30BAFF]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-[#30BAFF]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-[#30BAFF]/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-[#30BAFF]/40 to-transparent" />

      <div className="w-full h-full relative overflow-auto">
        {/* Inner atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#30BAFF] opacity-[0.02] rounded-full blur-[100px]" />
        </div>

        {portals.length === 0 ? (
          /* ── Empty State ── */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="z-10 flex flex-col items-center gap-6 animate-fade-in-scale">
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
                  <circle cx="40" cy="40" r="24" fill="none" stroke="#30BAFF" strokeWidth="0.4" opacity="0.1" className="animate-orb-ring" />
                  <circle cx="40" cy="40" r="20" fill="none" stroke="#30BAFF" strokeWidth="0.6" opacity="0.08" className="animate-orb-ring2" />
                  <path fill="url(#orb-grad2)" opacity="0.6" filter="url(#orb-glow)">
                    <animate attributeName="d" dur="1.8s" repeatCount="indefinite" values="M40,24 C50,24 56,30 56,40 C56,50 50,56 40,56 C30,56 24,50 24,40 C24,30 30,24 40,24Z;M42,22 C54,26 58,34 54,44 C50,54 40,58 32,54 C24,50 20,38 26,28 C32,18 36,20 42,22Z;M38,23 C48,20 58,30 56,42 C54,54 44,58 34,54 C24,50 20,40 24,30 C28,20 30,24 38,23Z;M40,24 C50,24 56,30 56,40 C56,50 50,56 40,56 C30,56 24,50 24,40 C24,30 30,24 40,24Z" calcMode="spline" keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1" />
                  </path>
                  <path fill="url(#orb-grad)" filter="url(#orb-glow-hot)">
                    <animate attributeName="d" dur="2.2s" repeatCount="indefinite" values="M40,22 C52,22 58,30 58,40 C58,52 50,58 40,58 C28,58 22,50 22,40 C22,28 30,22 40,22Z;M44,20 C56,26 60,36 54,46 C48,56 36,60 28,54 C20,48 18,36 24,26 C30,16 34,18 44,20Z;M36,19 C48,16 62,28 58,42 C54,56 42,62 30,56 C18,50 14,36 22,24 C30,12 28,20 36,19Z;M43,21 C55,24 60,38 54,48 C48,58 34,60 26,52 C18,44 18,30 26,22 C34,14 35,20 43,21Z;M37,20 C50,18 60,30 58,44 C56,56 44,60 32,56 C20,52 16,40 20,28 C24,16 28,20 37,20Z;M40,22 C52,22 58,30 58,40 C58,52 50,58 40,58 C28,58 22,50 22,40 C22,28 30,22 40,22Z" calcMode="spline" keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1" />
                  </path>
                  <circle cx="40" cy="40" r="8" fill="#30BAFF" opacity="0.15" className="animate-orb-core" />
                  <circle cx="40" cy="40" r="4" fill="#30BAFF" opacity="0.4" className="animate-orb-core-bright" />
                  <circle cx="40" cy="40" r="1.5" fill="#ffffff" opacity="0.6" className="animate-orb-core-bright" />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="font-display text-xl font-semibold tracking-wider text-white/90 text-glow-sm mb-3">Welcome to VV Nano</h3>
                <p className="font-tech text-sm text-gray-500 max-w-sm leading-relaxed tracking-wide">
                  Looks like you don't have any connected portals yet.
                </p>
              </div>

              <button onClick={onAddPortal} className="mt-2 px-6 py-2.5 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] font-tech font-semibold text-sm tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 hover:shadow-[0_0_20px_rgba(48,186,255,0.15)] transition-all duration-300 press-scale">
                Start Setup
              </button>

              <div className="flex gap-2 mt-2">
                <div className="w-1 h-1 rounded-full bg-gray-600 shadow-[0_0_6px_rgba(107,114,128,0.3)] animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-gray-600 shadow-[0_0_6px_rgba(107,114,128,0.3)] animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 rounded-full bg-gray-600 shadow-[0_0_6px_rgba(107,114,128,0.3)] animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>

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
        ) : (
          /* ── Connected State — Portal Thumbnails ── */
          <div className="w-full h-full p-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 animate-fade-in-down">
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wider text-white/80">Your Portals</h3>
                <p className="font-mono text-[10px] text-gray-600 mt-0.5">{portals.length} connected</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  <span className="font-mono text-[10px] text-emerald-500 tracking-wider">Online</span>
                </div>
                <button onClick={onAddPortal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/20 text-[#30BAFF] text-[11px] font-tech font-semibold tracking-wider hover:bg-[#30BAFF]/15 hover:border-[#30BAFF]/30 transition-all press-scale">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Portal
                </button>
              </div>
            </div>

            {/* Portal grid */}
            <div className="grid grid-cols-2 gap-4">
              {portals.map((p, i) => {
                const domain = (() => { try { return new URL(p.url).hostname } catch { return p.url } })()
                return (
                  <button
                    key={p.id}
                    className={`group relative rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover-lift text-left animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
                  >
                    {/* Thumbnail preview area */}
                    <div className="h-36 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.color}08 0%, ${p.color}03 50%, transparent 100%)` }}>
                      {/* Fake browser chrome */}
                      <div className="absolute top-0 inset-x-0 h-7 bg-black/20 flex items-center px-3 gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="flex-1 mx-2 h-3 rounded bg-white/[0.04] flex items-center px-2">
                          <span className="font-mono text-[7px] text-gray-600 truncate">{domain}</span>
                        </div>
                      </div>

                      {/* Fake page content lines */}
                      <div className="absolute top-10 left-4 right-4 flex flex-col gap-2">
                        <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: `${p.color}15` }} />
                        <div className="h-1.5 rounded-full w-full bg-white/[0.03]" />
                        <div className="h-1.5 rounded-full w-5/6 bg-white/[0.03]" />
                        <div className="h-1.5 rounded-full w-2/3 bg-white/[0.02]" />
                        <div className="mt-2 flex gap-2">
                          <div className="h-8 w-16 rounded" style={{ backgroundColor: `${p.color}10` }} />
                          <div className="h-8 w-16 rounded bg-white/[0.02]" />
                        </div>
                        <div className="h-1.5 rounded-full w-full bg-white/[0.02]" />
                        <div className="h-1.5 rounded-full w-4/5 bg-white/[0.02]" />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <span className="font-tech text-xs text-white/80 tracking-wider flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          Open Portal
                        </span>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-0 left-0 w-6 h-px" style={{ background: `linear-gradient(to right, ${p.color}60, transparent)` }} />
                      <div className="absolute top-0 left-0 w-px h-6" style={{ background: `linear-gradient(to bottom, ${p.color}60, transparent)` }} />
                    </div>

                    {/* Info bar */}
                    <div className="p-3 bg-white/[0.02]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" style={{ color: p.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-tech text-xs text-white/70 font-medium tracking-wide truncate group-hover:text-white/90 transition-colors">{p.name}</p>
                          <p className="font-mono text-[9px] text-gray-600 truncate">{domain}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}

              {/* Add portal card */}
              <button
                onClick={onAddPortal}
                className="rounded-xl border border-dashed border-white/[0.08] hover:border-[#30BAFF]/25 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-[#30BAFF] group press-scale min-h-[200px]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] group-hover:bg-[#30BAFF]/10 border border-white/[0.06] group-hover:border-[#30BAFF]/20 flex items-center justify-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="font-tech text-xs tracking-wide">Add Portal</span>
              </button>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-6 mt-5 animate-fade-in-up stagger-6">
              <div className="flex items-center gap-2 border-l-2 border-gray-800 pl-3">
                <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Status</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <span className="font-mono text-[10px] text-emerald-500">Connected</span>
              </div>
              <div className="flex items-center gap-2 border-l-2 border-gray-800 pl-3">
                <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Latency</span>
                <span className="font-mono text-[10px] text-[#30BAFF]">24ms</span>
              </div>
              <div className="flex items-center gap-2 border-l-2 border-gray-800 pl-3">
                <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Portals</span>
                <span className="font-mono text-[10px] text-[#30BAFF]">{portals.length}</span>
              </div>
            </div>
          </div>
        )}
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

// ─── Search Data ───────────────────────────────────────────
const searchFilters = ['Vehicles', 'Faults', 'Drivers', 'Alerts', 'ELD', 'DVIR', 'GPS', 'Routes']

const searchSuggestions: Record<string, string[]> = {
  v: ['Vehicle diagnostics', 'VIN lookup', 'Vehicle location tracking', 'Voltage monitoring'],
  f: ['Fault code P0301', 'Fleet fuel consumption', 'FMCSA compliance check', 'Firmware update status'],
  d: ['Driver HOS summary', 'DVIR submissions', 'Driver scorecard', 'Dispatch route history'],
  e: ['ELD connection status', 'Engine hours report', 'ECM data stream', 'ELD malfunction alerts'],
  g: ['GPS position history', 'Geofence violations', 'GPS signal strength', 'Gateway device status'],
  r: ['Route optimization', 'Real-time engine data', 'Regulatory alerts', 'Rest break compliance'],
  a: ['Active fault codes', 'Alert configuration', 'Asset utilization report', 'Ambient temperature log'],
  h: ['HOS violations', 'Hard braking events', 'Harsh acceleration log', 'Hub odometer reading'],
  s: ['Speed limit violations', 'Service reminders', 'SPN/FMI fault lookup', 'Seatbelt compliance'],
  t: ['Tire pressure monitoring', 'Trip history', 'Telematics device health', 'Terminal assignments'],
  p: ['Platform Science portal', 'Pre-trip inspection', 'Power take-off usage', 'Predictive maintenance'],
  c: ['CSA score breakdown', 'Carrier profile', 'CAN bus diagnostics', 'Compliance dashboard'],
}

const mockResults = [
  { category: 'Vehicle', title: 'Unit #4821 — Freightliner Cascadia', subtitle: 'Last seen: I-10 W, Mile 342 · 12 min ago', status: 'Active', statusColor: 'text-[#30BAFF]' },
  { category: 'Fault', title: 'P0401 — EGR Flow Insufficient', subtitle: 'Detected on Unit #4821 · SPN 27 / FMI 4', status: 'Critical', statusColor: 'text-red-500' },
  { category: 'Driver', title: 'Marcus Chen — CDL #TX-8841927', subtitle: 'HOS: 6h 14m remaining · Driving', status: 'On Duty', statusColor: 'text-[#30BAFF]' },
  { category: 'ELD', title: 'ELD Device #PS-90042', subtitle: 'Connected to Unit #4821 · Firmware v3.8.1', status: 'Connected', statusColor: 'text-[#30BAFF]' },
  { category: 'Alert', title: 'Geofence Exit — Distribution Center Alpha', subtitle: 'Unit #4821 exited zone at 14:32 CST', status: 'Warning', statusColor: 'text-amber-500' },
  { category: 'Route', title: 'Dallas → Phoenix — Route 1042', subtitle: 'ETA: 9h 22m · 642 miles remaining', status: 'In Transit', statusColor: 'text-[#30BAFF]' },
]

// ─── Search View ───────────────────────────────────────────
function SearchView() {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const firstChar = query.trim().toLowerCase().charAt(0)
  const suggestions = firstChar ? (searchSuggestions[firstChar] || []) : []

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true)
      setShowDropdown(false)
    }
  }

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion)
    setShowDropdown(false)
    setHasSearched(true)
  }

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Pre-search: centered hero layout
  if (!hasSearched) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-auto">
        {/* Inner atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#30BAFF] opacity-[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="z-10 flex flex-col items-center w-full max-w-[680px] px-4">
          <h2 className="font-display text-2xl font-semibold tracking-wider text-white/90 text-glow-sm mb-8 animate-fade-in-up">
            Search across all portals
          </h2>

          {/* Search bar */}
          <div className="relative w-full mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center w-full rounded-2xl bg-black/30 border-2 border-[#30BAFF]/20 focus-within:border-[#30BAFF]/40 focus-within:shadow-[0_0_30px_rgba(48,186,255,0.08)] transition-all duration-300 overflow-hidden">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(e.target.value.length > 0) }}
                onFocus={() => query.length > 0 && setShowDropdown(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search vehicles, faults, drivers, routes..."
                className="flex-1 bg-transparent px-6 py-5 text-[16px] font-tech text-white/80 placeholder-gray-600 outline-none tracking-wide"
              />
              <button
                onClick={handleSearch}
                className="m-2 w-12 h-12 rounded-xl bg-gradient-to-b from-[#1e6298] to-[#244151] flex items-center justify-center hover:from-[#2878b5] hover:to-[#2d5470] transition-all flex-shrink-0 press-scale hover:shadow-[0_0_15px_rgba(48,186,255,0.2)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>

            {/* Dropdown suggestions */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#0c1424] border border-white/[0.08] shadow-[0_15px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-dropdown-in">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(s)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#30BAFF]/5 transition-all duration-150 group animate-fade-in-up stagger-${i + 1}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 group-hover:text-[#30BAFF] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <span className="font-tech text-sm text-gray-400 group-hover:text-white/80 tracking-wide transition-colors">{s}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {searchFilters.map((f, i) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold font-tech tracking-wider uppercase press-scale animate-fade-in-up stagger-${i + 1} ${
                  activeFilters.includes(f)
                    ? 'bg-[#30BAFF]/15 border-[#30BAFF]/40 text-[#30BAFF] shadow-[0_0_12px_rgba(48,186,255,0.1)]'
                    : 'bg-[#323232]/40 border-[#30BAFF]/15 text-gray-500 hover:border-[#30BAFF]/30 hover:text-gray-400'
                } transition-all duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Post-search: results layout
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Compact search bar at top */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3">
        <div className="relative w-full max-w-[680px]">
          <div className="flex items-center w-full rounded-xl bg-black/30 border border-[#30BAFF]/15 focus-within:border-[#30BAFF]/30 transition-all overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 ml-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(e.target.value.length > 0) }}
              onFocus={() => query.length > 0 && setShowDropdown(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent px-3 py-3 text-sm font-tech text-white/80 placeholder-gray-600 outline-none tracking-wide"
            />
            <button
              onClick={() => { setHasSearched(false); setQuery('') }}
              className="px-3 py-1 mr-2 text-xs font-tech text-gray-500 hover:text-[#30BAFF] transition-all tracking-wider press-scale"
            >
              Clear
            </button>
          </div>

          {/* Filter pills — compact */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {searchFilters.map((f) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`px-3 py-1 rounded-full border text-[10px] font-semibold font-tech tracking-wider uppercase transition-all ${
                  activeFilters.includes(f)
                    ? 'bg-[#30BAFF]/15 border-[#30BAFF]/40 text-[#30BAFF]'
                    : 'bg-transparent border-white/[0.06] text-gray-600 hover:border-[#30BAFF]/20 hover:text-gray-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-[#0c1424] border border-white/[0.08] shadow-[0_15px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-dropdown-in">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(s)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#30BAFF]/5 transition-all duration-150 group animate-fade-in-up stagger-${i + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#30BAFF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span className="font-tech text-xs text-gray-400 group-hover:text-white/80 tracking-wide">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto px-6 pb-5">
        <div className="flex gap-4 h-full">
          {/* Left column — results cards */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase mb-1 animate-fade-in-up">{mockResults.length} results for "{query}"</span>
            {mockResults.map((r, i) => (
              <button
                key={i}
                className={`w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#30BAFF]/20 hover:bg-[#30BAFF]/[0.03] group hover-lift animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#30BAFF]/10 text-[#30BAFF]/70 tracking-wider uppercase">{r.category}</span>
                    </div>
                    <h4 className="font-tech text-sm text-white/80 group-hover:text-white font-medium tracking-wide truncate transition-colors">{r.title}</h4>
                    <p className="font-mono text-[11px] text-gray-600 mt-1 truncate">{r.subtitle}</p>
                  </div>
                  <span className={`font-mono text-[10px] tracking-wider flex-shrink-0 mt-1 ${r.statusColor}`}>{r.status}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right column — detail / AI panel */}
          <div className="w-[320px] flex-shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.01] p-5 flex flex-col animate-slide-in-right">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#30BAFF] shadow-[0_0_8px_rgba(48,186,255,0.5)] animate-pulse" />
              <span className="font-mono text-[10px] text-[#30BAFF] tracking-wider uppercase">AI Assistant</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="p-3 rounded-lg bg-[#30BAFF]/[0.04] border border-[#30BAFF]/10 animate-fade-in-up stagger-2">
                <p className="font-tech text-xs text-gray-400 leading-relaxed tracking-wide">
                  Found <span className="text-[#30BAFF]">6 results</span> across your portals. Unit #4821 has an active fault code that may need attention — <span className="text-red-400">P0401 EGR Flow Insufficient</span> was detected 23 minutes ago.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] animate-fade-in-up stagger-4">
                <p className="font-tech text-xs text-gray-500 leading-relaxed tracking-wide">
                  Driver Marcus Chen is currently on duty with 6h 14m HOS remaining. The unit is en route Dallas → Phoenix with an ETA of 9h 22m.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] animate-fade-in-up stagger-6">
                <p className="font-tech text-xs text-gray-500 leading-relaxed tracking-wide">
                  Tip: Click any result card to view full details in the portal viewer.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.06] px-3 py-2">
                <span className="font-tech text-xs text-gray-600 flex-1">Ask a follow-up...</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Data ────────────────────────────────────
const initialNotifications = [
  { id: 1, type: 'critical' as const, read: false, title: 'Critical Fault: P0401 — EGR Flow Insufficient', body: 'Detected on Unit #4821 (Freightliner Cascadia). SPN 27 / FMI 4. Immediate inspection recommended.', time: '23 min ago', source: 'Platform Science' },
  { id: 2, type: 'alert' as const, read: false, title: 'Geofence Exit — Distribution Center Alpha', body: 'Unit #4821 exited zone at 14:32 CST. Driver: Marcus Chen. No scheduled departure found.', time: '48 min ago', source: 'Geofence Monitor' },
  { id: 3, type: 'warning' as const, read: false, title: 'HOS Warning: 2h remaining', body: 'Driver Marcus Chen approaching daily driving limit. 6h 14m of 8h used. Break required before 20:46 CST.', time: '1h ago', source: 'ELD Compliance' },
  { id: 4, type: 'info' as const, read: true, title: 'DVIR Submitted — Unit #4821', body: 'Pre-trip inspection completed by Marcus Chen. All items passed. No defects reported.', time: '3h ago', source: 'DVIR System' },
  { id: 5, type: 'alert' as const, read: true, title: 'Tire Pressure Low — Position 3L', body: 'Unit #4821 left rear outer tire at 92 PSI (threshold: 95 PSI). Monitor recommended.', time: '4h ago', source: 'TPMS' },
  { id: 6, type: 'info' as const, read: true, title: 'Firmware Update Available — ELD #PS-90042', body: 'Version 3.8.2 available. Includes stability improvements and FMCSA regulation updates.', time: '6h ago', source: 'Device Manager' },
  { id: 7, type: 'warning' as const, read: true, title: 'Hard Braking Event Detected', body: 'Unit #4821 at I-10 W Mile 387. Deceleration: -8.2 mph/s. No collision reported.', time: '8h ago', source: 'Safety Monitor' },
  { id: 8, type: 'info' as const, read: true, title: 'Route Update — Dallas → Phoenix', body: 'ETA recalculated: 9h 22m. Weather delay expected near Tucson (dust advisory).', time: '10h ago', source: 'Route Planner' },
]

const notifTypeConfig = {
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', shadow: 'shadow-[0_0_6px_rgba(239,68,68,0.5)]', label: 'Critical' },
  alert: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500', shadow: 'shadow-[0_0_6px_rgba(245,158,11,0.5)]', label: 'Alert' },
  warning: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', dot: 'bg-orange-400', shadow: 'shadow-[0_0_6px_rgba(251,146,60,0.4)]', label: 'Warning' },
  info: { color: 'text-[#30BAFF]', bg: 'bg-[#30BAFF]/10', border: 'border-[#30BAFF]/20', dot: 'bg-[#30BAFF]', shadow: 'shadow-[0_0_6px_rgba(48,186,255,0.5)]', label: 'Info' },
}

type NotifFilter = 'all' | 'unread' | 'critical' | 'alert' | 'warning' | 'info'

// ─── Notifications View ────────────────────────────────────
function NotificationsView() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<NotifFilter>('all')

  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.read).length

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'all') return true
    return n.type === filter
  })

  const filters: { key: NotifFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: `Unread (${unreadCount})` },
    { key: 'critical', label: 'Critical' },
    { key: 'alert', label: 'Alerts' },
    { key: 'warning', label: 'Warnings' },
    { key: 'info', label: 'Info' },
  ]

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main notifications list */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex-shrink-0 px-6 pt-4 pb-3 flex items-center justify-between animate-fade-in-down">
          <div className="flex items-center gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-tech font-semibold tracking-wider uppercase transition-all duration-200 press-scale ${
                  filter === f.key
                    ? 'bg-[#30BAFF]/15 border border-[#30BAFF]/30 text-[#30BAFF]'
                    : 'text-gray-600 hover:text-gray-400 border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] font-tech text-gray-500 hover:text-[#30BAFF] transition-colors tracking-wider press-scale"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-auto px-6 pb-5">
          <div className="flex flex-col gap-2">
            {filtered.map((n, i) => {
              const cfg = notifTypeConfig[n.type]
              return (
                <button
                  key={n.id}
                  onClick={() => toggleRead(n.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 8)} ${
                    n.read
                      ? 'bg-white/[0.01] border-white/[0.04] opacity-60 hover:opacity-80'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-[#30BAFF]/15'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread dot + type indicator */}
                    <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full transition-all ${n.read ? 'bg-gray-700' : `${cfg.dot} ${cfg.shadow} animate-pulse`}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded tracking-wider uppercase ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                        <span className="font-mono text-[9px] text-gray-700">{n.source}</span>
                        <span className="font-mono text-[9px] text-gray-700 ml-auto flex-shrink-0">{n.time}</span>
                      </div>
                      <h4 className={`font-tech text-sm font-medium tracking-wide mb-1 transition-colors ${n.read ? 'text-gray-500' : 'text-white/80 group-hover:text-white'}`}>
                        {n.title}
                      </h4>
                      <p className="font-mono text-[11px] text-gray-600 leading-relaxed line-clamp-2">{n.body}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                      <span className="font-mono text-[9px] text-gray-600 tracking-wider">
                        {n.read ? 'Mark unread' : 'Mark read'}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in-scale">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className="font-tech text-sm text-gray-600 tracking-wide">No notifications match this filter</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary sidebar */}
      <div className="w-[300px] flex-shrink-0 border-l border-white/[0.06] p-5 flex flex-col animate-slide-in-right">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#30BAFF] shadow-[0_0_8px_rgba(48,186,255,0.5)] animate-pulse" />
          <span className="font-mono text-[10px] text-[#30BAFF] tracking-wider uppercase">AI Summary</span>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] animate-fade-in-up stagger-1">
            <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase block mb-1">Unread</span>
            <span className="font-display text-lg text-white/80">{unreadCount}</span>
          </div>
          <div className="p-3 rounded-lg bg-red-500/[0.04] border border-red-500/10 animate-fade-in-up stagger-2">
            <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase block mb-1">Critical</span>
            <span className="font-display text-lg text-red-500">{criticalCount}</span>
          </div>
        </div>

        {/* AI insights */}
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          <div className="p-3 rounded-lg bg-red-500/[0.04] border border-red-500/10 animate-fade-in-up stagger-3">
            <p className="font-tech text-xs text-gray-400 leading-relaxed tracking-wide">
              <span className="text-red-400 font-semibold">Priority:</span> Unit #4821 has a critical EGR fault (P0401). This may trigger a <span className="text-red-400">roadside inspection failure</span>. Recommend scheduling service at next stop.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10 animate-fade-in-up stagger-4">
            <p className="font-tech text-xs text-gray-400 leading-relaxed tracking-wide">
              <span className="text-amber-400 font-semibold">Attention:</span> Unscheduled geofence exit detected. Marcus Chen left Distribution Center Alpha without a dispatch record. Verify with dispatch.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#30BAFF]/[0.04] border border-[#30BAFF]/10 animate-fade-in-up stagger-5">
            <p className="font-tech text-xs text-gray-400 leading-relaxed tracking-wide">
              <span className="text-[#30BAFF] font-semibold">Overview:</span> 3 unread notifications requiring action. Driver HOS approaching limit — a 30-min break before 20:46 CST will reset the clock. All other systems nominal.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] animate-fade-in-up stagger-6">
            <p className="font-tech text-xs text-gray-500 leading-relaxed tracking-wide">
              Tip: Click any notification to toggle read/unread. Critical items will keep pulsing until acknowledged.
            </p>
          </div>
        </div>

        {/* AI input */}
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.06] px-3 py-2 hover:border-[#30BAFF]/15 transition-colors">
            <span className="font-tech text-xs text-gray-600 flex-1">Ask about alerts...</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Account / User Settings ──────────────────────────────
type AccountTab = 'profile' | 'sign-in' | 'two-factor' | 'billing' | 'usage'

const accountTabs: { id: AccountTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )},
  { id: 'sign-in', label: 'Sign-in Methods', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  )},
  { id: 'two-factor', label: 'Two-Factor Auth', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )},
  { id: 'billing', label: 'Billing', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  )},
  { id: 'usage', label: 'Usage', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )},
]

const keyboardShortcuts = [
  { keys: ['⌘', 'K'], action: 'Quick search' },
  { keys: ['⌘', '/'], action: 'Command palette' },
  { keys: ['⌘', 'B'], action: 'Toggle sidebar' },
  { keys: ['⌘', 'N'], action: 'New portal' },
  { keys: ['⌘', '.'], action: 'Settings' },
  { keys: ['Esc'], action: 'Close panel / Cancel' },
]

const billingHistory = [
  { date: 'Feb 1, 2026', description: 'Pro Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Jan 1, 2026', description: 'Pro Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Dec 1, 2025', description: 'Pro Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Nov 1, 2025', description: 'Pro Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Oct 15, 2025', description: 'Token overage — 12,400 tokens', amount: '$4.80', status: 'Paid' },
  { date: 'Oct 1, 2025', description: 'Pro Plan — Monthly', amount: '$49.00', status: 'Paid' },
]

const weeklyUsage = [
  { label: 'Mon', value: 3200 },
  { label: 'Tue', value: 4800 },
  { label: 'Wed', value: 6100 },
  { label: 'Thu', value: 5400 },
  { label: 'Fri', value: 7200 },
  { label: 'Sat', value: 1800 },
  { label: 'Sun', value: 900 },
]

const monthlyUsage = [
  { label: 'Sep', value: 82000 },
  { label: 'Oct', value: 124000 },
  { label: 'Nov', value: 98000 },
  { label: 'Dec', value: 110000 },
  { label: 'Jan', value: 134000 },
  { label: 'Feb', value: 45000 },
]

function AccountView({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Secondary sidebar */}
      <div className="w-[200px] flex-shrink-0 border-r border-white/[0.06] flex flex-col animate-fade-in-up">
        {/* User card */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#30BAFF]/20 to-blue-600/20 p-px flex-shrink-0">
              <div className="w-full h-full rounded-[11px] bg-[#0a1124] flex items-center justify-center">
                <span className="font-display text-xs font-bold text-[#30BAFF]">AF</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-tech text-sm text-white/80 font-medium tracking-wide truncate">Andrew Fodor</p>
              <p className="font-mono text-[9px] text-gray-600 tracking-wider truncate">Virtual Vehicle</p>
            </div>
          </div>
          <div className="h-px bg-white/[0.06]" />
        </div>

        {/* Tab nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3">
          {accountTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#30BAFF]/10 text-[#30BAFF] text-glow-sm'
                  : 'text-gray-500 hover:bg-[#30BAFF]/5 hover:text-gray-400'
              }`}
            >
              {tab.icon}
              <span className="font-tech text-[13px] font-medium tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Log out at bottom */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-500/5 hover:text-red-400 transition-all w-full press-scale"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            <span className="font-tech text-[13px] font-medium tracking-wide">Log Out</span>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[640px]">

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-lg font-semibold tracking-wider text-white/90 mb-1">Profile</h2>
              <p className="font-tech text-xs text-gray-600 tracking-wide mb-6">Manage your account information and preferences</p>

              {/* Avatar + name */}
              <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#30BAFF]/20 to-blue-600/20 p-px flex-shrink-0">
                  <div className="w-full h-full rounded-[15px] bg-[#0a1124] flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-[#30BAFF]">AF</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-tech text-lg text-white/90 font-semibold tracking-wide">Andrew Fodor</h3>
                  <p className="font-tech text-sm text-gray-500 tracking-wide">Virtual Vehicle</p>
                  <p className="font-mono text-[10px] text-gray-700 tracking-wider mt-1">Account created Oct 15, 2025</p>
                </div>
                <button className="ml-auto px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                  Edit
                </button>
              </div>

              {/* Email */}
              <div className="mb-8">
                <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-2">Email Address</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="font-tech text-sm text-white/70 tracking-wide flex-1">afodor@virtualvehicle.com</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    <span className="font-mono text-[9px] text-emerald-500 tracking-wider uppercase font-semibold">Verified</span>
                  </span>
                </div>
              </div>

              {/* Theme preferences */}
              <div className="mb-8">
                <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-2">Theme</label>
                <div className="flex gap-3 animate-fade-in-up stagger-3">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all press-scale ${
                      theme === 'dark'
                        ? 'bg-[#30BAFF]/10 border-[#30BAFF]/30 text-[#30BAFF]'
                        : 'bg-white/[0.02] border-white/[0.06] text-gray-500 hover:border-white/[0.12]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                    <span className="font-tech text-sm font-medium tracking-wide">Dark</span>
                    {theme === 'dark' && <div className="ml-auto w-2 h-2 rounded-full bg-[#30BAFF] shadow-[0_0_8px_rgba(48,186,255,0.5)]" />}
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all press-scale ${
                      theme === 'light'
                        ? 'bg-[#30BAFF]/10 border-[#30BAFF]/30 text-[#30BAFF]'
                        : 'bg-white/[0.02] border-white/[0.06] text-gray-500 hover:border-white/[0.12]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    <span className="font-tech text-sm font-medium tracking-wide">Light</span>
                    {theme === 'light' && <div className="ml-auto w-2 h-2 rounded-full bg-[#30BAFF] shadow-[0_0_8px_rgba(48,186,255,0.5)]" />}
                  </button>
                </div>
              </div>

              {/* Keyboard shortcuts */}
              <div className="mb-8">
                <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-2">Keyboard Shortcuts</label>
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden animate-fade-in-up stagger-4">
                  {keyboardShortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5">
                      <span className="font-tech text-xs text-gray-400 tracking-wide">{s.action}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, j) => (
                          <span key={j}>
                            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono text-[10px] text-gray-400">{k}</kbd>
                            {j < s.keys.length - 1 && <span className="text-gray-700 text-[10px] mx-0.5">+</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="pt-6 border-t border-white/[0.06]">
                <label className="font-mono text-[10px] text-red-500/60 tracking-wider uppercase block mb-2">Danger Zone</label>
                <div className="p-4 rounded-xl bg-red-500/[0.03] border border-red-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-tech text-sm text-red-400/80 font-medium tracking-wide">Delete Account</p>
                      <p className="font-mono text-[10px] text-gray-600 mt-0.5">Permanently remove your account and all data. This cannot be undone.</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-red-500/20 text-red-500 text-xs font-tech font-semibold tracking-wider hover:bg-red-500/10 hover:border-red-500/30 transition-all press-scale">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Sign-in Methods Tab ── */}
          {activeTab === 'sign-in' && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-lg font-semibold tracking-wider text-white/90 mb-1">Sign-in Methods</h2>
              <p className="font-tech text-xs text-gray-600 tracking-wide mb-6">Manage how you sign in to your account</p>

              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 animate-fade-in-up stagger-1 hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-[#30BAFF]/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#30BAFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">Email & Password</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">afodor@virtualvehicle.com</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[9px] text-emerald-500 tracking-wider uppercase font-semibold">Connected</span>
                  </span>
                </div>

                {/* Google */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 animate-fade-in-up stagger-2 hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">Google</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Sign in with your Google account</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                    Connect
                  </button>
                </div>

                {/* Passkeys */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 animate-fade-in-up stagger-3 hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">Passkeys</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Biometric or hardware key authentication</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                    Set Up
                  </button>
                </div>

                {/* GitHub */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 animate-fade-in-up stagger-4 hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">GitHub</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Sign in with your GitHub account</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Two-Factor Auth Tab ── */}
          {activeTab === 'two-factor' && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-lg font-semibold tracking-wider text-white/90 mb-1">Two-Factor Authentication</h2>
              <p className="font-tech text-xs text-gray-600 tracking-wide mb-6">Add an extra layer of security to your account</p>

              {/* Status */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-tech text-sm text-white/80 font-semibold tracking-wide">2FA is not enabled</p>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono text-[9px] text-amber-500 tracking-wider uppercase font-semibold">Recommended</span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-600 leading-relaxed">
                      Two-factor authentication adds a second verification step when signing in. We strongly recommend enabling it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Methods */}
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-3">Available Methods</label>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 hover-lift animate-fade-in-up stagger-2">
                  <div className="w-10 h-10 rounded-xl bg-[#30BAFF]/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#30BAFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">Authenticator App</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Use Google Authenticator, Authy, or 1Password</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] text-xs font-tech font-semibold tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 transition-all press-scale">
                    Enable
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 hover-lift animate-fade-in-up stagger-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">SMS Verification</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Receive a code via text message</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                    Enable
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 hover-lift animate-fade-in-up stagger-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/80 font-medium tracking-wide">Recovery Codes</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Generate backup codes for account recovery</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Billing Tab ── */}
          {activeTab === 'billing' && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-lg font-semibold tracking-wider text-white/90 mb-1">Billing</h2>
              <p className="font-tech text-xs text-gray-600 tracking-wide mb-6">Manage your subscription and payment methods</p>

              {/* Current plan */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#30BAFF]/[0.06] to-blue-600/[0.03] border border-[#30BAFF]/15 mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm font-bold text-[#30BAFF] tracking-wider">PRO PLAN</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#30BAFF]/15 border border-[#30BAFF]/25 font-mono text-[9px] text-[#30BAFF] tracking-wider uppercase font-semibold">Active</span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-600">Billed monthly · Next invoice Feb 1, 2026</p>
                  </div>
                  <span className="font-display text-2xl text-white/90">$49<span className="text-sm text-gray-600">/mo</span></span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-[#30BAFF]/20 text-[11px] font-tech text-[#30BAFF] hover:bg-[#30BAFF]/10 transition-all press-scale tracking-wider">
                    Change Plan
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:border-red-500/20 hover:text-red-400 transition-all press-scale tracking-wider">
                    Cancel
                  </button>
                </div>
              </div>

              {/* Payment method */}
              <div className="mb-6">
                <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-2">Payment Method</label>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 animate-fade-in-up stagger-2">
                  <div className="w-12 h-8 rounded-md bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                    <span className="font-mono text-[9px] text-white font-bold tracking-wider">VISA</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-tech text-sm text-white/70 tracking-wide">•••• •••• •••• 4242</p>
                    <p className="font-mono text-[10px] text-gray-600 mt-0.5">Expires 08/2028</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:border-[#30BAFF]/20 hover:text-[#30BAFF] transition-all press-scale tracking-wider">
                    Update
                  </button>
                </div>
              </div>

              {/* Billing history */}
              <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-2">Billing History</label>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden animate-fade-in-up stagger-3">
                <div className="grid grid-cols-[1fr_2fr_auto_auto] gap-x-4 px-4 py-2 border-b border-white/[0.06]">
                  <span className="font-mono text-[9px] text-gray-700 tracking-wider uppercase">Date</span>
                  <span className="font-mono text-[9px] text-gray-700 tracking-wider uppercase">Description</span>
                  <span className="font-mono text-[9px] text-gray-700 tracking-wider uppercase">Amount</span>
                  <span className="font-mono text-[9px] text-gray-700 tracking-wider uppercase">Status</span>
                </div>
                {billingHistory.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr_auto_auto] gap-x-4 px-4 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors">
                    <span className="font-mono text-[11px] text-gray-500">{item.date}</span>
                    <span className="font-tech text-xs text-gray-400 tracking-wide">{item.description}</span>
                    <span className="font-mono text-[11px] text-white/70">{item.amount}</span>
                    <span className="font-mono text-[10px] text-emerald-500 tracking-wider">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Usage Tab ── */}
          {activeTab === 'usage' && (
            <div className="animate-fade-in-up">
              <h2 className="font-display text-lg font-semibold tracking-wider text-white/90 mb-1">Usage</h2>
              <p className="font-tech text-xs text-gray-600 tracking-wide mb-6">Token consumption and API usage metrics</p>

              {/* Current period stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-1">
                  <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase block mb-1">This Week</span>
                  <span className="font-display text-xl text-white/90">29.4K</span>
                  <span className="font-mono text-[9px] text-gray-600 block mt-0.5">tokens</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-2">
                  <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase block mb-1">This Month</span>
                  <span className="font-display text-xl text-white/90">45.0K</span>
                  <span className="font-mono text-[9px] text-gray-600 block mt-0.5">tokens</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-3">
                  <span className="font-mono text-[9px] text-gray-600 tracking-wider uppercase block mb-1">Plan Limit</span>
                  <span className="font-display text-xl text-[#30BAFF]">100K</span>
                  <span className="font-mono text-[9px] text-gray-600 block mt-0.5">tokens / mo</span>
                </div>
              </div>

              {/* Usage bar */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6 animate-fade-in-up stagger-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Monthly Usage</span>
                  <span className="font-mono text-[10px] text-gray-500">45,000 / 100,000</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#30BAFF] to-blue-500 shadow-[0_0_10px_rgba(48,186,255,0.3)]" style={{ width: '45%' }} />
                </div>
                <p className="font-mono text-[9px] text-gray-700 mt-1.5">55,000 tokens remaining this billing cycle</p>
              </div>

              {/* Weekly chart */}
              <div className="mb-6">
                <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-3">This Week</label>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-5">
                  <div className="flex items-end gap-2 h-32">
                    {weeklyUsage.map((d, i) => {
                      const maxVal = Math.max(...weeklyUsage.map(w => w.value))
                      const pct = (d.value / maxVal) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="font-mono text-[8px] text-gray-600">{(d.value / 1000).toFixed(1)}K</span>
                          <div className="w-full rounded-t-md bg-gradient-to-t from-[#30BAFF]/30 to-[#30BAFF]/60 transition-all duration-500" style={{ height: `${pct}%` }} />
                          <span className="font-mono text-[9px] text-gray-600">{d.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Monthly chart */}
              <div>
                <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-3">Monthly Trend</label>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in-up stagger-6">
                  <div className="flex items-end gap-3 h-32">
                    {monthlyUsage.map((d, i) => {
                      const maxVal = Math.max(...monthlyUsage.map(m => m.value))
                      const pct = (d.value / maxVal) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="font-mono text-[8px] text-gray-600">{(d.value / 1000).toFixed(0)}K</span>
                          <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600/30 to-[#30BAFF]/50 transition-all duration-500" style={{ height: `${pct}%` }} />
                          <span className="font-mono text-[9px] text-gray-600">{d.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Settings View ────────────────────────────────────────
type ThemeMode = 'dark' | 'light' | 'system'

function SettingsView({ portals, onAddPortal, onRemovePortal, onEditPortal }: {
  portals: Portal[]
  onAddPortal: () => void
  onRemovePortal: (id: string) => void
  onEditPortal: (id: string, name: string, url: string) => void
}) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')

  const startEdit = (p: Portal) => {
    setEditingId(p.id)
    setEditName(p.name)
    setEditUrl(p.url)
  }

  const saveEdit = () => {
    if (!editName.trim() || !editUrl.trim() || !editingId) return
    onEditPortal(editingId, editName.trim(), editUrl.trim())
    setEditingId(null)
  }

  const themeModes: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'dark', label: 'Dark', desc: 'Always use dark theme', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    )},
    { id: 'light', label: 'Light', desc: 'Always use light theme', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    )},
    { id: 'system', label: 'System', desc: 'Match your OS preference', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
      </svg>
    )},
  ]

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-[680px] mx-auto">
        <h2 className="font-display text-lg font-semibold tracking-wider text-white/90 mb-1 animate-fade-in-up">Settings</h2>
        <p className="font-tech text-xs text-gray-600 tracking-wide mb-8 animate-fade-in-up stagger-1">Configure your workspace appearance and connected portals</p>

        {/* ── Appearance ── */}
        <div className="mb-10 animate-fade-in-up stagger-2">
          <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase block mb-3">Appearance</label>
          <div className="grid grid-cols-3 gap-3">
            {themeModes.map((m) => (
              <button
                key={m.id}
                onClick={() => setThemeMode(m.id)}
                className={`relative p-4 rounded-xl border transition-all duration-200 press-scale group ${
                  themeMode === m.id
                    ? 'bg-[#30BAFF]/10 border-[#30BAFF]/30 shadow-[0_0_20px_rgba(48,186,255,0.08)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {/* Preview swatch */}
                <div className={`w-full h-16 rounded-lg mb-3 overflow-hidden border ${
                  m.id === 'dark' ? 'bg-[#0a1124] border-white/[0.08]' :
                  m.id === 'light' ? 'bg-gray-100 border-gray-200' :
                  'border-white/[0.08] overflow-hidden'
                }`}>
                  {m.id === 'dark' && (
                    <div className="w-full h-full flex gap-1 p-1.5">
                      <div className="w-4 h-full rounded bg-white/[0.06]" />
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-2 rounded bg-white/[0.04]" />
                        <div className="flex-1 rounded bg-white/[0.03]" />
                      </div>
                    </div>
                  )}
                  {m.id === 'light' && (
                    <div className="w-full h-full flex gap-1 p-1.5">
                      <div className="w-4 h-full rounded bg-gray-200" />
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-2 rounded bg-gray-200" />
                        <div className="flex-1 rounded bg-gray-100" />
                      </div>
                    </div>
                  )}
                  {m.id === 'system' && (
                    <div className="w-full h-full flex">
                      <div className="w-1/2 bg-[#0a1124] flex gap-0.5 p-1">
                        <div className="w-2 h-full rounded-sm bg-white/[0.06]" />
                        <div className="flex-1 rounded-sm bg-white/[0.03]" />
                      </div>
                      <div className="w-1/2 bg-gray-100 flex gap-0.5 p-1">
                        <div className="w-2 h-full rounded-sm bg-gray-200" />
                        <div className="flex-1 rounded-sm bg-gray-50" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`transition-colors ${themeMode === m.id ? 'text-[#30BAFF]' : 'text-gray-500 group-hover:text-gray-400'}`}>{m.icon}</span>
                  <div className="text-left">
                    <p className={`font-tech text-sm font-medium tracking-wide transition-colors ${themeMode === m.id ? 'text-[#30BAFF]' : 'text-white/70'}`}>{m.label}</p>
                    <p className="font-mono text-[9px] text-gray-600">{m.desc}</p>
                  </div>
                </div>

                {themeMode === m.id && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#30BAFF] shadow-[0_0_8px_rgba(48,186,255,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Connected Portals ── */}
        <div className="animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-3">
            <label className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">Connected Portals</label>
            <span className="font-mono text-[10px] text-gray-700">{portals.length} portal{portals.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex flex-col gap-3">
            {portals.map((p, i) => (
              <div
                key={p.id}
                className={`rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
              >
                {editingId === p.id ? (
                  /* Edit mode */
                  <div className="p-4">
                    <div className="flex flex-col gap-3">
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="Portal name"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-tech text-white/80 tracking-wide placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 transition-all"
                      />
                      <input
                        value={editUrl}
                        onChange={e => setEditUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-mono text-white/60 placeholder-gray-600 outline-none focus:border-[#30BAFF]/30 transition-all"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-tech text-gray-500 hover:text-gray-400 transition-all press-scale tracking-wider">
                          Cancel
                        </button>
                        <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[11px] font-tech text-[#30BAFF] hover:bg-[#30BAFF]/20 transition-all press-scale tracking-wider font-semibold">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display mode */
                  <div className="p-4 flex items-center gap-4">
                    {/* Color indicator */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: p.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-tech text-sm text-white/80 font-medium tracking-wide">{p.name}</p>
                      <p className="font-mono text-[10px] text-gray-600 truncate mt-0.5">{p.url}</p>
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        <span className="font-mono text-[9px] text-emerald-500 tracking-wider uppercase font-semibold">Ready</span>
                      </span>
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-[#30BAFF] hover:bg-[#30BAFF]/5 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onRemovePortal(p.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add portal */}
            <button
              onClick={onAddPortal}
              className="w-full p-4 rounded-xl border border-dashed border-white/[0.08] hover:border-[#30BAFF]/25 text-gray-600 hover:text-[#30BAFF] transition-all duration-200 flex items-center justify-center gap-2 group press-scale"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="font-tech text-sm tracking-wide">Add Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Password Gate ─────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'Surf&sn0w') {
      sessionStorage.setItem('vv-auth', '1')
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#1a1a2e]">
      <Atmosphere />
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
        <div className="h-8">
          <VVLogo />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className={`w-64 px-4 py-2.5 rounded-lg bg-white/[0.04] border text-sm font-tech text-white/80 tracking-wide placeholder-gray-600 outline-none transition-all duration-300 ${
              error
                ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                : 'border-white/[0.08] focus:border-[#30BAFF]/30 focus:shadow-[0_0_15px_rgba(48,186,255,0.1)]'
            }`}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#30BAFF]/10 border border-[#30BAFF]/25 text-[#30BAFF] font-tech font-semibold text-sm tracking-wider hover:bg-[#30BAFF]/20 hover:border-[#30BAFF]/40 hover:shadow-[0_0_20px_rgba(48,186,255,0.15)] transition-all duration-300 press-scale"
          >
            Enter
          </button>
          {error && (
            <span className="font-mono text-[11px] text-red-500 animate-pulse">Invalid password</span>
          )}
        </form>
      </div>
    </div>
  )
}

// ─── App ────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('vv-auth') === '1')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('home')
  const [portals, setPortals] = useState<Portal[]>([])
  const [showPortalModal, setShowPortalModal] = useState(false)
  const [pinnedPages, setPinnedPages] = useState<PinnedPage[]>(defaultPinnedPages)
  const [showPinUrlModal, setShowPinUrlModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)

  const addPinnedPage = (label: string, url: string) => {
    const page: PinnedPage = {
      id: Date.now().toString(),
      label,
      url,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    }
    setPinnedPages(prev => [...prev, page])
    setShowPinUrlModal(false)
  }

  const assignToSection = (pageIds: string[], sectionName: string) => {
    setPinnedPages(prev => prev.map(p => pageIds.includes(p.id) ? { ...p, group: sectionName } : p))
    setShowGroupModal(false)
  }

  const removePinnedPage = (id: string) => {
    setPinnedPages(prev => prev.filter(p => p.id !== id))
    if (activePage === id) setActivePage('home')
  }

  // Find the URL for the active pinned page (if any)
  const activePinnedPage = pinnedPages.find(p => p.id === activePage)

  const addPortal = (p: Portal) => {
    setPortals(prev => [...prev, p])
    setShowPortalModal(false)
  }

  const removePortal = (id: string) => {
    setPortals(prev => prev.filter(p => p.id !== id))
  }

  const editPortal = (id: string, name: string, url: string) => {
    setPortals(prev => prev.map(p => p.id === id ? { ...p, name, url } : p))
  }

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />

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
            pinnedPages={pinnedPages}
            onRemovePinned={removePinnedPage}
            onPinUrl={() => setShowPinUrlModal(true)}
            onGroupTabs={() => setShowGroupModal(true)}
          />

          <main className="flex-1 flex flex-col relative min-w-0 z-10">
            <Header activePage={activePage} onNavigate={setActivePage} pinnedPages={pinnedPages} />

            {activePage === 'search' ? (
              <SearchView />
            ) : activePage === 'notifications' ? (
              <NotificationsView />
            ) : activePage === 'account' ? (
              <AccountView onLogout={() => { sessionStorage.removeItem('vv-auth'); setAuthed(false) }} />
            ) : activePage === 'settings' ? (
              <SettingsView portals={portals} onAddPortal={() => setShowPortalModal(true)} onRemovePortal={removePortal} onEditPortal={editPortal} />
            ) : activePinnedPage ? (
              <div className="flex-1 flex flex-col px-6 pb-5 pt-4 overflow-hidden">
                <BrowserControls />
                <div className="flex-1 w-full rounded-xl border border-[#30BAFF]/15 animate-glow-in iframe-container relative overflow-hidden">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-[#30BAFF]/40 to-transparent" />
                  <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-[#30BAFF]/40 to-transparent" />
                  <iframe
                    src={activePinnedPage.url}
                    className="w-full h-full border-0 rounded-xl"
                    title={activePinnedPage.label}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col px-6 pb-5 pt-4 overflow-hidden">
                <BrowserControls />
                <ContentFrame portals={portals} onAddPortal={() => setShowPortalModal(true)} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Portal Modal */}
      {showPortalModal && (
        <AddPortalModal onAdd={addPortal} onClose={() => setShowPortalModal(false)} portalCount={portals.length} />
      )}

      {/* Pin URL Modal */}
      {showPinUrlModal && (
        <AddPinnedPageModal onAdd={addPinnedPage} onClose={() => setShowPinUrlModal(false)} />
      )}

      {/* Group Tabs Modal */}
      {showGroupModal && (
        <CreateSectionModal pinnedPages={pinnedPages} onAssign={assignToSection} onClose={() => setShowGroupModal(false)} />
      )}
    </div>
  )
}
