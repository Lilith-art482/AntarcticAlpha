import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useAccessControl } from '@/hooks/useAccessControl'
import {
    TrendingUp,
    LineChart,
    BarChart3,
    Image as ImageIcon,
    Zap,
    Gift,
    MoreHorizontal,
    Code,
    Lock,
    Wallet,
} from 'lucide-react'
import { SphereSelector } from '@/components/Strategies/SphereSelector'
import { SphereSelectionModal, SPHERE_META } from '@/components/Strategies/SphereSelectionModal'
import { MemecoinStrategies } from '@/components/Strategies/MemecoinStrategies'
import { PolymarketStrategies } from '@/components/Strategies/PolymarketStrategies'
import { NftStrategies } from '@/components/Strategies/NftStrategies'
import { FuturesStrategies } from '@/components/Strategies/FuturesStrategies'
import { AirDropStrategies } from '@/components/Strategies/AirDropStrategies'
import { OtherStrategies } from '@/components/Strategies/OtherStrategies'
import { DigitalPaymentStrategies } from '@/components/Strategies/DigitalPaymentStrategies'
import { ContourSphere } from '@/types'
import MemcoinsDevingPage from '@/pages/Contour/spheres/MemcoinsDeving'

type TabType = 'memecoins_trading' | 'memecoins_deving' | 'polymarket' | 'futures' | 'nft' | 'airdrop' | 'digital_payments' | 'other'

export const Strategies = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin: isAdminStore } = useAdminStore()
    // Admin = isAdminStore (from adminStore) OR role === 'admin' OR user id is 1 (dexim/Артём) or 3 (xenia/Ксения)
    const isAdmin = isAdminStore || user?.role === 'admin' || user?.id === '1' || user?.id === '3'
    const [activeTab, setActiveTab] = useState<TabType>('memecoins_trading')
    const [showSphereModal, setShowSphereModal] = useState(false)
    const [blockedSphere, setBlockedSphere] = useState<string | null>(null)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const pageAccess = useAccessControl('tools_strategies_view')
    const memecoinsTradingAccess = useAccessControl('tools_kontur_memecoins_trading')
    const memecoinsDevingAccess = useAccessControl('tools_kontur_memecoins_deving')
    const polymarketAccess = useAccessControl('tools_kontur_polymarket')
    const nftAccess = useAccessControl('tools_kontur_nft')
    const futuresAccess = useAccessControl('tools_kontur_futures')
    const airdropAccess = useAccessControl('tools_kontur_airdrop')
    const digitalPaymentsAccess = useAccessControl('tools_kontur_digital_payments')
    const otherAccess = useAccessControl('tools_kontur_other')

    const tabs: { id: TabType; label: string; icon: any; access: { hasAccess: boolean; loading: boolean } }[] = [
        { id: 'memecoins_trading', label: 'Мемкоины (торговля)', icon: <TrendingUp className="w-4 h-4" />, access: memecoinsTradingAccess },
        { id: 'memecoins_deving', label: 'Мемкоины (девинг)', icon: <Code className="w-4 h-4" />, access: memecoinsDevingAccess },
        { id: 'polymarket', label: 'Polymarket', icon: <BarChart3 className="w-4 h-4" />, access: polymarketAccess },
        { id: 'futures', label: 'Фьючерсы и Спот', icon: <Zap className="w-4 h-4" />, access: futuresAccess },
        { id: 'nft', label: 'NFT', icon: <ImageIcon className="w-4 h-4" />, access: nftAccess },
        { id: 'airdrop', label: 'AirDrop', icon: <Gift className="w-4 h-4" />, access: airdropAccess },
        { id: 'digital_payments', label: 'Цифровые платежи', icon: <Wallet className="w-4 h-4" />, access: digitalPaymentsAccess },
        { id: 'other', label: 'Прочее', icon: <MoreHorizontal className="w-4 h-4" />, access: otherAccess },
    ]

    // Check if user can access a sphere based on their selected sphere
    const canAccessSphere = (sphereId: TabType): boolean => {
        // Admins can access all spheres
        if (isAdmin) return true
        // If no sphere selected yet, show all
        if (!user?.selectedSphere) return true
        
        // For 'other' tab, always allow access
        if (sphereId === 'other') return true
        
        // User can only access their selected sphere
        return user.selectedSphere === sphereId
    }

    // For admins, show all tabs. For regular users, filter by sphere
    const visibleTabs = tabs.filter(t => {
        // Admins see all tabs they have access to
        if (isAdmin) return t.access.hasAccess
        // 'other' tab is always visible for all users who can view the page
        if (t.id === 'other') return true
        // Other tabs require both access and sphere match
        return t.access.hasAccess && canAccessSphere(t.id)
    })
    const anyLoading = tabs.some(t => t.access.loading) || pageAccess.loading

    // Check if user needs to select a sphere
    // Admins never need to select a sphere - they see all
    // Only show modal if user is authenticated, data is loaded, and no sphere is selected
    const needsSphereSelection = user && !user.selectedSphere && !isAdmin

    // Show modal on first load or if user clicks to change sphere
    useEffect(() => {
        // Only show modal if:
        // 1. Not loading
        // 2. User has access to page
        // 3. User is authenticated (user exists)
        // 4. User needs to select sphere
        if (!anyLoading && pageAccess.hasAccess && needsSphereSelection) {
            setShowSphereModal(true)
        }
    }, [anyLoading, pageAccess.hasAccess, needsSphereSelection, user?.selectedSphere, user])

    // Auto-select first available tab when sphere is selected
    useEffect(() => {
        if (!anyLoading && visibleTabs.length > 0) {
            // If current tab is not in visible tabs, switch to first available
            if (!visibleTabs.find(t => t.id === activeTab)) {
                setActiveTab(visibleTabs[0].id)
            }
            // For admins, don't auto-switch - they should see all spheres
            if (isAdmin) return
            
            // If user has selected sphere but it's not visible and not 'other', switch to it
            // Note: Don't switch away from 'other' tab
            if (user?.selectedSphere && activeTab !== user.selectedSphere && activeTab !== 'other') {
                const userTab = visibleTabs.find(t => t.id === user.selectedSphere)
                if (userTab) {
                    setActiveTab(user.selectedSphere)
                }
            }
        }
    }, [anyLoading, visibleTabs, activeTab, user?.selectedSphere, isAdmin])

    const spheres = visibleTabs.map(t => ({
        id: t.id,
        label: t.label,
        icon: t.icon
    }))

    // Handle tab change with blocked sphere check
    const handleTabChange = (id: string) => {
        const tabId = id as TabType
        const tab = tabs.find(t => t.id === tabId)
        
        // Check if tab exists
        if (!tab) {
            setBlockedSphere(null)
            return
        }
        
        // For admins, always allow access to any tab (no restrictions)
        if (isAdmin) {
            setBlockedSphere(null)
            setActiveTab(tabId)
            return
        }
        
        // For 'other' tab, always allow access (no sphere restriction)
        if (tabId === 'other') {
            setBlockedSphere(null)
            setActiveTab(tabId)
            return
        }
        
        // Check if user has access to this tab
        if (!tab.access.hasAccess) {
            setBlockedSphere(null)
            return
        }
        
        // Check sphere restriction for non-admin users
        if (!isAdmin && user?.selectedSphere) {
            const isContourSphere = (id: string): id is ContourSphere => {
                return ['memecoins_trading', 'memecoins_deving', 'polymarket', 'futures', 'nft', 'airdrop', 'digital_payments'].includes(id)
            }
            
            if (isContourSphere(tabId)) {
                const userSelectedSphere = user.selectedSphere as ContourSphere
                
                // Non-admin users can only access their selected sphere
                if (userSelectedSphere && userSelectedSphere !== tabId) {
                    setBlockedSphere(SPHERE_META[tabId]?.label || tabId)
                    return
                }
            }
        }
        
        setBlockedSphere(null)
        setActiveTab(tabId)
    }

    // Handle sphere selection from modal
    const handleSphereSelect = (sphere: ContourSphere) => {
        setShowSphereModal(false)
        // Set the active tab to the selected sphere if user has access
        const tabId = sphere as TabType
        const tab = tabs.find(t => t.id === tabId)
        
        // For 'other' tab, check pageAccess instead of tab.access
        const hasTabAccess = tabId === 'other' ? pageAccess.hasAccess : tab?.access.hasAccess
        
        if (hasTabAccess) {
            setActiveTab(tabId)
        } else if (visibleTabs.length > 0) {
            setActiveTab(visibleTabs[0].id)
        }
    }

    // Close blocked sphere message
    const handleCloseBlocked = () => {
        setBlockedSphere(null)
    }

    if (anyLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4E6E49] border-t-transparent"></div>
            </div>
        )
    }

    if (!pageAccess.hasAccess || visibleTabs.length === 0) {
        return (
            <div className="py-20 text-center space-y-4">
                <TrendingUp className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                <h3 className={`text-xl font-black ${headingColor}`}>Доступ ограничен</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    {pageAccess.reason || 'У вас нет доступа к разделам ARCA Контур. Свяжитесь с администрацией.'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Sphere Selection Modal - shows on every entry, cannot be closed until selection */}
            <SphereSelectionModal
                isOpen={showSphereModal}
                onClose={() => setShowSphereModal(false)}
                onSelect={handleSphereSelect}
                selectedSphere={user?.selectedSphere as ContourSphere | undefined}
                sphereSelectedAt={user?.sphereSelectedAt}
                isAdmin={isAdmin}
            />

            {/* Blocked Sphere Notification */}
            {blockedSphere && (
                <div className="fixed top-4 right-4 z-40 max-w-sm p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-lg">
                    <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-bold text-amber-400 text-sm">Сфера недоступна</h4>
                            <p className="text-sm text-gray-300 mt-1">
                                Доступна только выбранная сфера: «{user?.selectedSphere ? SPHERE_META[user.selectedSphere as ContourSphere]?.label : ''}».
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                                Для смены сферы обратитесь к администратору.
                            </p>
                            <button
                                onClick={handleCloseBlocked}
                                className="mt-3 text-xs text-amber-400 hover:text-amber-300 underline"
                            >
                                Понятно
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#4E6E49]/10 rounded-2xl border border-[#4E6E49]/20">
                        <TrendingUp className="w-8 h-8 text-[#4E6E49]" />
                    </div>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
                            Contour
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} whitespace-nowrap`}>
                                Авторские материалы ARCA - Team
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full sm:w-auto">
                    <SphereSelector
                        spheres={spheres}
                        activeSphere={activeTab}
                        setActiveSphere={handleTabChange}
                    />
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'memecoins_trading' ? (
                    <MemecoinStrategies />
                ) : activeTab === 'memecoins_deving' ? (
                    <MemcoinsDevingPage />
                ) : activeTab === 'polymarket' ? (
                    <PolymarketStrategies />
                ) : activeTab === 'futures' ? (
                    <FuturesStrategies />
                ) : activeTab === 'nft' ? (
                    <NftStrategies />
                ) : activeTab === 'airdrop' ? (
                    <AirDropStrategies />
                ) : activeTab === 'digital_payments' ? (
                    <DigitalPaymentStrategies />
                ) : activeTab === 'other' ? (
                    <OtherStrategies />
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="flex justify-center">
                            <LineChart className="w-16 h-16 text-gray-700 animate-pulse" />
                        </div>
                        <h3 className={`text-xl font-black ${headingColor}`}>
                            {tabs.find(t => t.id === activeTab)?.label} — В разработке
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto px-4">
                            Мы готовим новые контентные модули и стратегии для данного направления. Следите за обновлениями в ARCA Контур.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Strategies
