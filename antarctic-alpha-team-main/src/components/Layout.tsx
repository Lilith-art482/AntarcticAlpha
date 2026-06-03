import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { useAdminStore, AdminSection } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { useViewedUserStore, getEffectiveUserId } from '@/store/viewedUserStore'
import { checkUserAccess } from '@/services/firestoreService'
import {
  Users,
  BookOpen,
  Settings,
  Shield,
  CheckCircle2,
  Sun,
  Moon,
  PanelLeftOpen,
  PanelLeftClose,
  Menu,
  X,
  Radio,
  DollarSign,
  CheckSquare,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronRight,
  LogOut,
  Calendar,
  CalendarDays,
  MessageSquare,
  MessageSquarePlus,
  Wallet,
  Coins,
  FileText,
  Bell,
  HelpCircle,
  Bot,
  Globe,
  ArrowLeftRight,
  Sparkles,
  LayoutGrid,
  User,
  LineChart,
  CreditCard,
  QrCode,
  Send,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useState, useEffect, useMemo } from 'react'
import { AccessBlockScreen } from '@/components/AccessBlockScreen'
import Avatar from '@/components/Avatar'
import RatesBar from '@/components/RatesBar'
import { QRScanner } from '@/components/QRScanner'
import { AdminProtectedLink } from '@/components/AdminProtectedLink'
import { AdminCodeModal } from '@/components/AdminCodeModal'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin, isLimitedAdmin, deactivateAdmin, hasSectionAccess } = useAdminStore()
  const { user, logout } = useAuthStore()
  const { viewedUserId } = useViewedUserStore()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isCollapsed, setIsCollapsed } = useSidebarStore()
  const [accessibleFeatures, setAccessibleFeatures] = useState<Set<string>>(new Set())
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(true)
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [isDevModalOpen, setIsDevModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const [isAdminCodeModalOpen, setIsAdminCodeModalOpen] = useState(false)
  const [adminCodePendingAction, setAdminCodePendingAction] = useState<(() => void) | null>(null)

  // Get effective user ID (viewed user or current user)
  const effectiveUserId = getEffectiveUserId(user?.id, isAdmin, viewedUserId)

  // Device detection for menu click behavior (for future use)
  // const { isDesktop } = useDeviceDetection()

  // Handle global admin code modal events
  useEffect(() => {
    const handleOpenAdminCodeModal = (event: CustomEvent<{ action: () => void; userId?: string }>) => {
      setAdminCodePendingAction(() => event.detail.action)
      setIsAdminCodeModalOpen(true)
    }

    window.addEventListener('openAdminCodeModal', handleOpenAdminCodeModal as EventListener)
    return () => {
      window.removeEventListener('openAdminCodeModal', handleOpenAdminCodeModal as EventListener)
    }
  }, [])

    // Check user access to features
  useEffect(() => {
    if (location.state?.openMenu && window.innerWidth < 1024) {
      setIsMobileMenuOpen(true)
      // Clear state to prevent reopening on refresh or back navigation
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  useEffect(() => {
    const checkFeaturesAccess = async () => {
      setIsFeaturesLoading(true)
      try {
    if (!user || isAdmin) {
      setAccessibleFeatures(new Set(['ava_schedule', 'ava_profit', 'ava_tasks', 'ava_rating', 'ava_referrals', 'profile', 'admin', 'tools', 'tools_strategies', 'tools_events', 'ava_hub', 'ava_info', 'ava_feedback', 'ava_communication', 'ava_converter', 'ava_realtime_chart']))
      return
    }

        const features = [
          // Menu Categories (parent features)
          'ava_traders_lounge', 'ava_planner_dashboard', 'ava_reward_centre', 'ava_applications', 'ava_arca_info',
          // Individual Menu Items - Traders' Lounge
          'ava_hub', 'ava_trader_diary', 'ava_realtime_chart', 'tools_strategies',
          // Individual Menu Items - Planner Dashboard
          'ava_schedule', 'ava_tasks', 'tools_events', 'tools_challenges', 'tools_initiatives', 'ava_rating', 'ava_referrals',
          // Individual Menu Items - Reward Centre
          'ava_profit', 'ava_community_fund', 'ava_team_fund', 'ava_payments', 'ava_cards_crypto',
          // Individual Menu Items - Applications
          'tools_applications',
          // Individual Menu Items - ARCA INFO
          'ava_faq', 'ava_info', 'ava_feedback', 'ava_contact_dm',
          // Quick Access (верхнее меню)
          'ava_converter', 'ava_communication',
          // Legacy for compatibility
          'profile', 'tools', 'slots', 'earnings', 'rating', 'about'
        ]
        const accessible = new Set<string>()

        for (const feature of features) {
          try {
            const accessResult = await checkUserAccess(effectiveUserId || '', feature)
            if (accessResult.hasAccess) {
              accessible.add(feature)
            }
          } catch (error) {
            accessible.add(feature)
          }
        }

        setAccessibleFeatures(accessible)
      } finally {
        setIsFeaturesLoading(false)
      }
    }

    checkFeaturesAccess()
  }, [user, isAdmin, effectiveUserId])

  // Menu categories with enhanced styling
  type MenuCategory = {
    id: string
    label: string
    icon: LucideIcon
    accentColor?: string
    items: { path: string; label: string; icon: LucideIcon; feature?: string; isDev?: boolean }[]
  }

  const menuCategories: MenuCategory[] = useMemo(() => [
    // Traders' Lounge
    {
      id: 'traders',
      label: "Traders' Lounge",
      icon: Wallet,
      accentColor: '#4C7F6E',
      items: [
        { path: '/hub', label: 'HUB', icon: Radio, feature: 'ava_hub' },
        { path: '/trader-diary', label: 'Trader Diary', icon: BookOpen, feature: 'ava_trader_diary' },
        { path: '/market-analytics', label: 'Market analytics', icon: LineChart, feature: 'ava_realtime_chart' },
        { path: '/strategies', label: 'Contour', icon: TrendingUp, feature: 'tools_strategies' },
      ]
    },
    // Planner Dashboard
    {
      id: 'planner',
      label: 'Planner Dashboard',
      icon: Calendar,
      accentColor: '#4C7F6E',
      items: [
        { path: '/lead', label: 'Lead', icon: Calendar, feature: 'ava_schedule' },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare, feature: 'ava_tasks' },
        { path: '/events', label: 'Events', icon: CalendarDays, feature: 'tools_events' },
        { path: '/challenges', label: 'Challenges', icon: CheckCircle2, feature: 'tools_challenges' },
        { path: '/initiatives', label: 'Initiatives', icon: Sparkles, feature: 'tools_initiatives' },
        { path: '/track-record', label: 'Track Record', icon: TrendingUp, feature: 'ava_rating' },
        { path: '/invite-earn', label: 'Invite & Earn', icon: Users, feature: 'ava_referrals' },
      ]
    },
    // Reward Centre
    {
      id: 'reward',
      label: 'Reward Centre',
      icon: DollarSign,
      accentColor: '#4C7F6E',
      items: [
        { path: '/pnl', label: 'P&L', icon: DollarSign, feature: 'ava_profit' },
        { path: '/community-fund', label: 'Community Fund', icon: Coins, feature: 'ava_community_fund' },
        { path: '/team-fund', label: "Team's Wallet", icon: Wallet, feature: 'ava_team_fund' },
        { path: '/payments', label: 'Payments', icon: DollarSign, feature: 'ava_payments' },
        { path: '/cards-crypto', label: 'Cards & Crypto', icon: CreditCard, feature: 'ava_cards_crypto' },
      ]
    },
    // ARCA INFO
    {
      id: 'arca-info',
      label: 'ARCA INFO',
      icon: BookOpen,
      accentColor: '#4C7F6E',
      items: [
        { path: '/faq', label: 'FAQ', icon: HelpCircle, feature: 'ava_faq' },
        { path: '/about', label: 'INFO', icon: Info, feature: 'ava_info' },
        { path: '/feedback', label: 'Feedback', icon: MessageSquarePlus, feature: 'ava_feedback' },
        { path: '/contact-dm', label: 'Contact DM', icon: Send, feature: 'ava_contact_dm' },
      ]
    },
  ], [])

  const adminSubItems: { path: string; label: string; icon: LucideIcon }[] = [
    { path: '/admin', label: 'Team', icon: Users },
    { path: '/controls', label: 'Controls', icon: Shield },
    { path: '/team-wallets', label: 'Wallets', icon: Wallet },
    { path: '/appeals', label: 'Appeals', icon: MessageSquare },
    { path: '/applications', label: 'Applications', icon: FileText },
    { path: '/approvals', label: 'Check', icon: CheckCircle2 },
    { path: '/check-ref', label: 'Check_REF', icon: Users },
    { path: '/feedback-form', label: 'Feedback Form', icon: MessageSquarePlus },
    { path: '/hr-hub', label: 'HR Hub', icon: Settings },
    { path: '/contour-spheres', label: 'Contour Spheres', icon: TrendingUp },
  ]

  const navigate = useNavigate()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
  const isAdminActive = adminSubItems.some(item => location.pathname === item.path) || location.pathname === '/admin-dashboard'

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)
    }
  }, [hoverTimeout])

  // Auto-expand category when navigating to a page inside it
  useEffect(() => {
    const currentPath = location.pathname
    const category = menuCategories.find(c => 
      c.items.some(item => item.path === currentPath)
    )
    if (category && category.id && !expandedCategories.has(category.id)) {
      setExpandedCategories(prev => {
        const next = new Set(prev)
        if (next.size >= 2) {
          const firstCategory = next.values().next().value
          if (firstCategory) next.delete(firstCategory)
        }
        next.add(category.id)
        return next
      })
    }
  }, [location.pathname])

  // Initial expand for current path on mount
  useEffect(() => {
    const currentPath = location.pathname
    const category = menuCategories.find(c => 
      c.items.some(item => item.path === currentPath)
    )
    if (category && category.id) {
      setExpandedCategories(prev => {
        if (prev.has(category.id)) return prev
        const next = new Set(prev)
        if (next.size >= 2) {
          const firstCategory = next.values().next().value
          if (firstCategory) next.delete(firstCategory)
        }
        next.add(category.id)
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        // If already open, close it
        next.delete(categoryId)
      } else {
        // If opening a new category and we already have 2 open, close the oldest one
        if (next.size >= 2) {
          // Find and remove the first (oldest) category
          const firstCategory = next.values().next().value
          if (firstCategory) {
            next.delete(firstCategory)
          }
        }
        next.add(categoryId)
      }
      return next
    })
  }

  const isCategoryActive = (category: MenuCategory) => 
    category.items.some(item => location.pathname === item.path)

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0b0f17]' : 'bg-[#f8fafc]'}`}>
      {/* Site-wide Access Block Screen */}
      <AccessBlockScreen />

      {/* Rates Bar - shows on all pages except login */}
      <RatesBar />

      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-12 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/25 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-8 right-0 w-[520px] h-[520px] bg-gradient-to-bl from-blue-500/12 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-120px] left-12 w-96 h-96 bg-gradient-to-tr from-amber-400/10 to-[#4E6E49]/12 blur-3xl" />
        <div className="floating-grid" />
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Enhanced Desktop Sidebar */}
        <aside className={`hidden xl:flex ${isCollapsed ? 'w-20' : 'w-72'} h-screen fixed left-0 top-0 flex flex-col overflow-visible z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#0d1520] via-[#0a1019] to-[#0d1520] border-r border-white/5' 
            : 'bg-gradient-to-b from-white via-gray-50/80 to-white border-r border-gray-200/50'
        }`}>
          {/* Decorative gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#4C7F6E]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-[#4E6E49]/15 to-transparent rounded-full blur-3xl" />
            <div className="absolute inset-0 accent-dots opacity-30" />
          </div>

          {/* Collapse Toggle Button - inside sidebar */}
          <button
            onClick={toggleCollapsed}
            className={`absolute top-4 z-50 p-2.5 rounded-xl transition-all duration-300 group ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-[#4C7F6E]/20 text-gray-500 hover:text-[#4C7F6E]'
                : 'bg-gray-100 hover:bg-[#4C7F6E]/10 text-gray-400 hover:text-[#4C7F6E]'
            } ${isCollapsed ? 'left-1/2 -translate-x-1/2 right-auto' : 'right-3 left-auto'}`}
            title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <PanelLeftClose className="w-4.5 h-4.5 transition-transform duration-300 group-hover:-rotate-90" />
            )}
          </button>

          {/* Upper section - Logo */}
          <div className="shrink-0 flex-none relative z-10">
            <div className={`p-5 pb-3 transition-all duration-500 origin-left overflow-hidden ${isCollapsed ? 'opacity-0 scale-90 w-0 px-0 translate-x-[-100%]' : 'opacity-100 scale-100'}`}>
              <Link to="/profile" className="flex items-center gap-3 group">
                <img
                  src={logo}
                  alt="ARCA TEAM"
                  className="w-10 h-10 object-contain rounded-xl"
                />
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-wider text-gradient bg-gradient-to-r from-[#4C7F6E] to-[#4E6E49] dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    ARCA_TEAM
                  </span>
                  <span className={`text-[10px] font-medium tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    TRADING ECOSYSTEM
                  </span>
                </div>
              </Link>
            </div>

            {/* Quick Access Icons - Mobile/Tablet Version: Converter, Chat (no Hub, no Settings) */}
            <div className="xl:hidden px-4 pb-3 flex gap-2">
              {[
                { to: '/converter', icon: ArrowLeftRight, label: 'Converter' },
                { to: '/communication', icon: MessageSquare, label: 'Chat' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex-1 flex items-center justify-center p-2 rounded-xl transition-all duration-300 group relative ${
                    theme === 'dark'
                      ? 'bg-white/5 border border-white/5 hover:bg-[#4C7F6E]/20 hover:border-[#4C7F6E]/30'
                      : 'bg-gray-100 border border-gray-200 hover:bg-[#4C7F6E]/10 hover:border-[#4C7F6E]/30'
                  }`}
                  title={item.label}
                >
                  <item.icon className={`w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110 ${
                    theme === 'dark' ? 'text-gray-400 group-hover:text-[#4C7F6E]' : 'text-gray-600 group-hover:text-[#4C7F6E]'
                  }`} />
                  {location.pathname === item.to && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#4C7F6E] rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Quick Access Icons - PC Version: Hub, Converter, Chat (no Settings) */}
            <div className={`hidden xl:flex px-4 pb-3 gap-2 transition-all duration-500 ${isCollapsed ? 'flex-col items-center px-2 w-full' : 'flex-row'}`}>
              {[
                { to: '/hub', icon: Radio, label: 'HUB', feature: 'ava_hub' },
                { to: '/converter', icon: ArrowLeftRight, label: 'Converter', feature: 'ava_converter' },
                { to: '/communication', icon: MessageSquare, label: 'Chat', feature: 'ava_communication' },
              ].filter(item => {
                // Фильтруем по доступу
                if ('feature' in item && item.feature) {
                  return isAdmin || isFeaturesLoading || accessibleFeatures.has(item.feature)
                }
                return true
              }).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-center p-2 rounded-xl transition-all duration-300 group relative ${
                    theme === 'dark'
                      ? 'bg-white/5 border border-white/5 hover:bg-[#4C7F6E]/20 hover:border-[#4C7F6E]/30'
                      : 'bg-gray-100 border border-gray-200 hover:bg-[#4C7F6E]/10 hover:border-[#4C7F6E]/30'
                  } ${isCollapsed ? 'w-full mb-1' : 'flex-1'}`}
                  title={item.label}
                >
                  <item.icon className={`w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110 ${
                    theme === 'dark' ? 'text-gray-400 group-hover:text-[#4C7F6E]' : 'text-gray-600 group-hover:text-[#4C7F6E]'
                  }`} />
                  {location.pathname === item.to && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#4C7F6E] rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            <div className={`h-px w-full bg-gradient-to-r from-transparent via-gray-200/50 dark:via-white/10 to-transparent mx-4 transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} />
          </div>

          {/* Middle section - Navigation (scrollable) */}
          <nav className="flex-1 min-h-0 overflow-visible no-scrollbar px-2 py-2 space-y-1 relative z-10">
            <>
              {/* Menu Categories with Enhanced Design */}
              {menuCategories.map((category) => {
                const categoryId = category.id || ''
                const isManuallyExpanded = expandedCategories.has(categoryId)
                const isHovered = hoveredCategory === categoryId
                const isActive = isCategoryActive(category)
                const accentColor = category.accentColor || '#4C7F6E'
                
                const accessibleItems = category.items.filter(item =>
                  isAdmin || isFeaturesLoading || !item.feature || accessibleFeatures.has(item.feature)
                )
                
                if (accessibleItems.length === 0) return null
                
                const showItems = isCollapsed ? isHovered : isManuallyExpanded
                
                return (
                  <div 
                    key={categoryId} 
                    className={`space-y-1.5 relative group z-[50] ${isCollapsed ? 'group' : ''}`}
                    onMouseEnter={() => {
                      if (isCollapsed) {
                        if (hoverTimeout) clearTimeout(hoverTimeout)
                        setHoveredCategory(categoryId)
                      }
                    }}
                    onMouseLeave={() => {
                      if (isCollapsed) {
                        const timeout = setTimeout(() => {
                          setHoveredCategory(null)
                        }, 300)
                        setHoverTimeout(timeout)
                      }
                    }}
                  >
                    {/* Enhanced Category Header */}
                    <button
                      onClick={() => !isCollapsed && toggleCategory(categoryId)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group/cat ${
                        isActive 
                          ? `bg-gradient-to-r from-[${accentColor}]/20 to-[${accentColor}]/10 border-l-2 border-[${accentColor}]` 
                          : `hover:bg-white/5 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center px-0' : ''}`
                      } ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                    >
                      {!isCollapsed && (
                        <>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-br from-[${accentColor}] to-[${accentColor}]/70` 
                              : `bg-white/5 dark:bg-white/5 group-hover/cat:bg-[${accentColor}]/20`
                          }`}>
                            <category.icon className={`w-4 h-4 ${isActive ? 'text-white' : `text-[${accentColor}]`}`} />
                          </div>
                          <span className="font-medium flex-1 text-left text-xs uppercase tracking-wider">{category.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isManuallyExpanded ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                        </>
                      )}
                      {isCollapsed && (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br from-[${accentColor}] to-[${accentColor}]/70` 
                      : `bg-white/5 dark:bg-white/5 group-hover:bg-white/10`
                  }`}>
                    <category.icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? 'text-white' : `text-[${accentColor}]`} ${isHovered ? 'group-hover:scale-110' : ''}`} />
                        </div>
                      )}
                    </button>
                    
                    {/* Category Items - Desktop Expanded */}
                    {showItems && !isCollapsed && (
                      <div className="ml-3 space-y-1 relative z-[60] animate-in slide-in-from-top-2 duration-200">
                        {accessibleItems.map((item) => (
                          item.isDev ? (
                            <button
                              key={item.path}
                              onClick={() => setIsDevModalOpen(true)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 dark:hover:bg-white/5 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                              <item.icon className="w-5 h-5" style={{ color: accentColor }} />
                              <span className="font-medium text-sm">{item.label}</span>
                            </button>
                          ) : (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group/item ${
                                location.pathname === item.path 
                                  ? `bg-gradient-to-r from-[${accentColor}] to-[${accentColor}]/80 text-white shadow-lg shadow-[${accentColor}]/25` 
                                  : `hover:bg-white/5 dark:hover:bg-white/5 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
                              }`}
                            >
                              <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover/item:scale-110 ${location.pathname === item.path ? 'text-white' : ''}`} style={{ color: location.pathname === item.path ? 'white' : accentColor }} />
                              <span className="font-medium text-sm">{item.label}</span>
                              {location.pathname === item.path && (
                                <Sparkles className="w-3 h-3 ml-auto animate-pulse" />
                              )}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                    
                  {/* Category Items - Collapsed (Dropdown) */}
                  {isCollapsed && hoveredCategory === categoryId && (
                    <div 
                      className="absolute left-full top-0 ml-2 transition-all duration-300 z-[100]"
                        onMouseEnter={() => {
                          if (hoverTimeout) clearTimeout(hoverTimeout)
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => {
                            setHoveredCategory(null)
                          }, 300)
                          setHoverTimeout(timeout)
                        }}
                      >
                        <div className={`relative overflow-hidden rounded-2xl ${
                          theme === 'dark'
                            ? 'bg-[#0d1520]/95 border border-white/10 shadow-2xl shadow-black/50' 
                            : 'bg-white/95 border border-gray-200 shadow-2xl'
                        } backdrop-blur-2xl`}>
                          {/* Dropdown gradient decoration */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#4C7F6E]/20 to-transparent rounded-full blur-2xl" />
                          </div>
                          <div className="relative p-3 min-w-[240px]">
                            <div className="px-4 py-3 mb-2 flex items-center gap-2 border-b border-gray-100 dark:border-white/5">
                              <LayoutGrid className="w-4 h-4" style={{ color: '#4C7F6E' }} />
                              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#4C7F6E' }}>{category.label}</p>
                            </div>
                            {accessibleItems.map((item) => (
                              item.isDev ? (
                                <button
                                  key={item.path}
                                  onClick={() => setIsDevModalOpen(true)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all hover:bg-white/50 dark:hover:bg-white/5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
                                >
                                  <item.icon className="w-5 h-5" style={{ color: accentColor }} />
                                  <span>{item.label}</span>
                                </button>
                              ) : (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all group/drop ${
                                    location.pathname === item.path 
                                      ? `bg-gradient-to-r from-[${accentColor}] to-[${accentColor}]/80 text-white` 
                                      : `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-800 hover:text-gray-900 hover:bg-white/50'}`
                                  }`}
                                >
                                  <item.icon className={`w-5 h-5 transition-transform group-hover/drop:scale-110 ${location.pathname === item.path ? '' : ''}`} style={{ color: location.pathname === item.path ? 'white' : accentColor }} />
                                  <span>{item.label}</span>
                                </Link>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Enhanced Admin section - same style as other categories with #4C7F6E */}
              {(isAdmin || isLimitedAdmin) && (
                <div className="space-y-1 relative group-admin pt-1">
                  <div className={`mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-white/10 to-transparent`} />
                  
                  <button
                    onClick={() => navigate('/admin-dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group/adm ${
                      isAdminActive 
                        ? 'bg-gradient-to-r from-[#4C7F6E]/20 to-[#4C7F6E]/10 border-l-2 border-[#4C7F6E]' 
                        : `hover:bg-white/5 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center px-0' : ''}`
                    } ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isAdminActive 
                        ? 'bg-gradient-to-br from-[#4C7F6E] to-[#4C7F6E]/70' 
                        : 'bg-white/5 dark:bg-white/5 group-hover/adm:bg-[#4C7F6E]/20'
                    }`}>
                      <Shield className={`w-4 h-4 ${isAdminActive ? 'text-white' : 'text-[#4C7F6E]'}`} />
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="font-medium flex-1 text-left text-xs">{isLimitedAdmin ? 'Limited Admin' : 'Admin'}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 group-hover/adm:translate-x-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      </>
                    )}
                  </button>

                  {isCollapsed && (
                    <div 
                      className="absolute left-full top-0 ml-2 invisible group-hover/admin:visible opacity-0 group-hover/admin:opacity-100 transition-all duration-300 z-[100]"
                      onMouseEnter={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout)
                      }}
                      onMouseLeave={() => {
                        const timeout = setTimeout(() => {
                          // Don't auto-hide for admin
                        }, 300)
                        setHoverTimeout(timeout)
                      }}
                    >
                      <div className={`ml-3 overflow-hidden rounded-2xl ${
                        theme === 'dark'
                          ? 'bg-[#0d1520]/95 border border-white/10 shadow-2xl shadow-black/50' 
                          : 'bg-white/95 border border-gray-200 shadow-2xl'
                      } backdrop-blur-2xl`}>
                        <div className="relative p-3 min-w-[240px]">
                          <div className="px-4 py-3 mb-2 flex items-center gap-2 border-b border-gray-100 dark:border-white/5">
                            <Shield className="w-4 h-4" style={{ color: '#4C7F6E' }} />
                            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#4C7F6E' }}>{isLimitedAdmin ? 'Limited Admin' : 'Admin Panel'}</p>
                          </div>
                          {adminSubItems
                            .filter(item => {
                              const section = item.path.replace('/', '') as AdminSection
                              return hasSectionAccess(section)
                            })
                            .map((item) => (
                              <AdminProtectedLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                  location.pathname === item.path 
                                    ? `bg-gradient-to-r from-[#4C7F6E] to-[#4C7F6E]/80 text-white` 
                                    : `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-800 hover:text-gray-900 hover:bg-white/50'}`
                                }`}
                              >
                                <item.icon className={`w-5 h-5`} style={{ color: location.pathname === item.path ? 'white' : '#4C7F6E' }} />
                                <span>{item.label}</span>
                              </AdminProtectedLink>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          </nav>

          {/* Lower section - Profile, Settings & Actions (fixed at bottom) */}
          <div className={`shrink-0 flex-none pt-2 pb-3 px-3 transition-all duration-500 relative z-10 ${isCollapsed ? 'px-2' : ''}`}>
            <div className={`h-px w-full bg-gradient-to-r from-transparent via-gray-200/50 dark:via-white/10 to-transparent mx-3 mb-2 transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} />
            
            {/* Profile + Settings Row */}
            <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
              {/* Profile Link with User icon */}
              <Link
                to="/profile"
                className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-300 group ${
                  location.pathname === '/profile' 
                    ? 'bg-gradient-to-r from-[#4C7F6E]/20 to-[#4C7F6E]/10 border border-[#4C7F6E]/30' 
                    : theme === 'dark'
                      ? 'bg-white/5 border border-white/5 hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                } ${isCollapsed ? 'w-full justify-center' : 'flex-1'}`}
              >
                <div className={`shrink-0 ${isCollapsed ? '' : 'w-8 h-8 flex items-center justify-center'}`}>
                  <Avatar userId={user?.id} user={user || undefined} size="sm" />
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className="text-sm font-semibold truncate dark:text-white text-gray-800">{user?.name || 'Administrator'}</p>
                  </div>
                )}
              </Link>
            </div>

              {/* Action Buttons */}
              <div className={`flex gap-2 mt-2 ${isCollapsed ? 'flex-col items-center' : ''}`}>
                <button
                  onClick={() => {
                    logout()
                    deactivateAdmin()
                    window.location.href = '/login'
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isCollapsed ? 'w-full' : 'flex-1'} ${
                    theme === 'dark' 
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40' 
                      : 'bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300'
                    }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {!isCollapsed && <span>Выйти</span>}
                </button>

                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isCollapsed ? 'w-full' : 'flex-1'} ${
                    theme === 'dark' 
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40' 
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
                  }`}
                  title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {!isCollapsed && <span>{theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>}
                </button>
              </div>
          </div>
        </aside>

        <div className={`flex-1 ${isCollapsed ? 'xl:pl-20' : 'xl:pl-72'} min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
          <main className={`lg:pb-16 pb-6 lg:pt-3 pt-3 transition-all duration-300 ${
            location.pathname === '/market-analytics' 
              ? 'max-w-none w-full px-3 xl:px-5' 
              : 'page-shell'
          }`}>
            <div className="xl:hidden h-[65px]"></div> {/* Spacer for mobile header */}
            {children}
          </main>
        </div>

        {/* Enhanced Mobile Header */}
        <div className={`xl:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b flex items-center justify-between transition-all duration-300 backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-[#0b0f17]/90 via-[#0d1520]/85 to-[#0b0f17]/90 border-white/5'
            : 'bg-gradient-to-r from-white/90 via-gray-50/85 to-white/90 border-gray-200/50'
        }`}>
          <Link to="/about" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center relative">
              <div className={`absolute inset-0 bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
              <img
                src={logo}
                alt="ARCA TEAM"
                className="w-7 h-7 object-contain rounded-xl relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-black tracking-wider uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ARCA_TEAM</span>
              <span className={`text-[9px] font-medium tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>TRADING ECOSYSTEM</span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-[#4C7F6E]/20 to-[#4E6E49]/20 text-white hover:from-[#4C7F6E]/30 hover:to-[#4E6E49]/30'
                : 'bg-gradient-to-br from-[#4C7F6E]/10 to-[#4E6E49]/10 text-[#4C7F6E] hover:from-[#4C7F6E]/20 hover:to-[#4E6E49]/20'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={`fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-right duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-[#0d1520] via-[#0a1019] to-[#0d1520]' 
              : 'bg-gradient-to-br from-white via-gray-50 to-white'
          }`}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-[#4C7F6E]/15 to-transparent rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#4E6E49]/10 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}">
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 flex items-center justify-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <img
                    src={logo}
                    alt="ARCA TEAM"
                    className="w-7 h-7 object-contain rounded-xl relative z-10"
                  />
                </div>
                <span className={`text-sm font-black tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Menu</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                  theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-5">
              {/* Enhanced Profile Section */}
              <div className={`flex items-center justify-between gap-3 p-4 rounded-2xl transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-white/5 to-white/2 border border-white/5' 
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-100'
              }`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 shrink-0">
                    <Avatar userId={user?.id} user={user || undefined} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate dark:text-white text-gray-900">{user?.name || 'Guest'}</p>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-xs text-[#4C7F6E] hover:underline font-medium">
                      Перейти в профиль
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-[0.98] ${
                      theme === 'dark' 
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30' 
                        : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
                    }`}
                    title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      deactivateAdmin()
                      window.location.href = '/login'
                    }}
                    className={`flex-1 p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-[0.98] ${
                      theme === 'dark' 
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30' 
                        : 'bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300'
                    }`}
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Access - Enhanced (Mobile: Converter, Chat - no Settings) */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { to: '/pay', icon: QrCode, label: 'Оплатить', feature: 'ava_converter', action: () => setIsQRScannerOpen(true) },
                  { to: '/converter', icon: ArrowLeftRight, label: 'Converter', feature: 'ava_converter' },
                  { to: '/communication', icon: MessageSquare, label: 'Chat', feature: 'ava_communication' },
                ].filter(item => {
                  // Фильтруем по доступу
                  if ('feature' in item && item.feature) {
                    return isAdmin || isFeaturesLoading || accessibleFeatures.has(item.feature)
                  }
                  return true
                }).map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMobileMenuOpen(false)
                      if ('action' in item && item.action) {
                        item.action()
                      }
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      location.pathname === item.to
                        ? `bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] text-white shadow-lg shadow-[#4C7F6E]/30`
                        : theme === 'dark'
                          ? 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${location.pathname === item.to ? '' : 'text-[#4C7F6E]'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Menu Categories - Mobile Enhanced */}
              {menuCategories.map((category) => {
                const categoryId = category.id || ''
                const accentColor = category.accentColor || '#4C7F6E'
                const accessibleItems = category.items.filter(item =>
                  isAdmin || isFeaturesLoading || !item.feature || accessibleFeatures.has(item.feature)
                )
                if (accessibleItems.length === 0) return null
                
                return (
                  <div key={categoryId} className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>{category.label}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {accessibleItems.map((item) => (
                        item.isDev ? (
                          <button
                            key={item.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setIsDevModalOpen(true)
                            }}
                            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                              theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <item.icon className="w-5 h-5" style={{ color: accentColor }} />
                            <span className="font-semibold text-sm">{item.label}</span>
                          </button>
                        ) : (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                              location.pathname === item.path 
                                ? `bg-gradient-to-r from-[${accentColor}] to-[${accentColor}]/80 text-white shadow-lg` 
                                : theme === 'dark' 
                                  ? 'text-gray-300 hover:bg-white/5 hover:text-white' 
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <item.icon className="w-5 h-5" style={{ color: location.pathname === item.path ? 'white' : accentColor }} />
                            <span className="font-semibold text-sm">{item.label}</span>
                            {location.pathname === item.path && (
                              <Sparkles className="w-3.5 h-3.5 ml-auto animate-pulse" />
                            )}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Admin Section - Mobile Enhanced */}
              {(isAdmin || isLimitedAdmin) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-500">{isLimitedAdmin ? 'Limited Admin' : 'Панель управления'}</p>
                  </div>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                      location.pathname === '/admin-dashboard'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Shield className={`w-5 h-5 ${location.pathname === '/admin-dashboard' ? 'text-white' : 'text-amber-500'}`} />
                    <span className="font-semibold text-sm">{isLimitedAdmin ? 'Limited Admin' : 'Admin'}</span>
                  </Link>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Alerts Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAlertModalOpen(false)}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all animate-in zoom-in-95 duration-200 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-white/10' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Уведомления
                </h3>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${
              theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
              }`}>
                <Settings className={`w-8 h-8 text-[#4C7F6E] animate-spin-slow`} />
              </div>
              <p className={`text-base font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Раздел в разработке
              </p>
              <p className={`text-sm px-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Здесь будут отображаться все уведомления по сайту, торговле и важным событиям.
              </p>
            </div>

            <button
              onClick={() => setIsAlertModalOpen(false)}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all shadow-lg shadow-[#4C7F6E]/20"
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {/* Dev Modal - AI ARCA */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDevModalOpen(false)}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all animate-in zoom-in-95 duration-200 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-white/10' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  AI ARCA
                </h3>
              </div>
              <button
                onClick={() => setIsDevModalOpen(false)}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${
              theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
              }`}>
                <Bot className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <p className={`text-base font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI ARCA — В разработке
              </p>
              <p className={`text-sm px-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Скоро здесь появится искусственный интеллект для анализа рынка и помощи в торговле.
              </p>
            </div>

            <button
              onClick={() => setIsDevModalOpen(false)}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all shadow-lg shadow-[#4C7F6E]/20"
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSettingsModalOpen(false)}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all animate-in zoom-in-95 duration-200 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-white/10' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="mb-4">
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                  theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
                </span>
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </button>
            </div>

            {/* Language Selection - Dev */}
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-4 h-4 text-[#4C7F6E]" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Язык / Language
                </span>
              </div>
              <div className={`text-center py-6 rounded-xl border-2 border-dashed ${
                theme === 'dark' ? 'border-white/5' : 'border-gray-100'
              }`}>
                <p className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  В разработке
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Скоро можно будет выбрать русский или английский язык.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all shadow-lg shadow-[#4C7F6E]/20"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={(result) => {
          console.log('QR Code scanned:', result)
          setIsQRScannerOpen(false)
          // Здесь можно добавить обработку сканированного QR кода
          // Например, показать сообщение или перейти по ссылке
        }}
      />

      {/* Admin Code Modal - Global */}
      {isAdminCodeModalOpen && (
        <AdminCodeModal
          isOpen={isAdminCodeModalOpen}
          onClose={() => {
            setIsAdminCodeModalOpen(false)
            setAdminCodePendingAction(null)
          }}
          onSuccess={() => {
            setIsAdminCodeModalOpen(false)
            if (adminCodePendingAction) {
              adminCodePendingAction()
              setAdminCodePendingAction(null)
            }
          }}
          userId={user?.id}
        />
      )}
    </div>
  )
}

// Register global handler for admin code modal
declare global {
  interface Window {
    openAdminCodeModal?: (action: () => void, userId?: string) => void
  }
}

if (typeof window !== 'undefined') {
  window.openAdminCodeModal = (action: () => void, userId?: string) => {
    const event = new CustomEvent('openAdminCodeModal', { detail: { action, userId } })
    window.dispatchEvent(event)
  }
}
