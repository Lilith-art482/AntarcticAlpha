import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import {
    Shield,
    ShieldAlert,
    ShieldX,
    Lock,
    ChevronRight,
    AlertTriangle
} from 'lucide-react'
import { RestrictionForm } from '@/components/Management/RestrictionForm'
import { UserConflictsForm } from '@/components/Management/UserConflictsForm'
import { AccessBlocksForm } from '@/components/Management/AccessBlocksForm'

export const Controls = () => {
    const { theme } = useThemeStore()
    const { isAdmin } = useAdminStore()
    const [showRestrictionForm, setShowRestrictionForm] = useState(false)
    const [showConflictsForm, setShowConflictsForm] = useState(false)
    const [showAccessBlocksForm, setShowAccessBlocksForm] = useState(false)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const labelColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const cardBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-white'
    const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

    if (!isAdmin) {
        return (
            <div className="py-20 text-center space-y-4">
                <Lock className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доступ ограничен</h3>
                <p className="text-gray-500 max-w-md mx-auto">У вас нет прав для доступа к панели управления администрированием.</p>
            </div>
        )
    }

    const controlCards = [
        {
            id: 'restrictions',
            title: 'Ограничения',
            description: 'Управление запретами на создание слотов, отгулов и больничных для участников.',
            icon: <ShieldAlert className="w-8 h-8 text-orange-500" />,
            action: () => setShowRestrictionForm(true),
            color: 'orange',
            badge: 'Rules'
        },
        {
            id: 'conflicts',
            title: 'Конфликты',
            description: 'Проверка пересечений графиков и выявление потенциальных проблем в расписании.',
            icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
            action: () => setShowConflictsForm(true),
            color: 'amber',
            badge: 'Sync'
        },
        {
            id: 'access',
            title: 'Блокировки',
            description: 'Ограничение доступа к конкретным разделам и функциям панели для отдельных пользователей.',
            icon: <ShieldX className="w-8 h-8 text-rose-500" />,
            action: () => setShowAccessBlocksForm(true),
            color: 'rose',
            badge: 'Access'
        }
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header Area */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#4E6E49]/10 rounded-2xl border border-[#4E6E49]/20">
                        <Shield className="w-6 h-6 text-[#4E6E49]" />
                    </div>
                    <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${headingColor}`}>
                        Admin Controls
                    </h1>
                </div>
                <p className={`text-sm md:text-base font-medium ${labelColor} max-w-2xl`}>
                    Центральная панель управления безопасностью и бизнес-логикой ARCA - Team.
                    Настройте ограничения, проверьте конфликты или управляйте доступом участников.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {controlCards.map((card) => (
                    <button
                        key={card.id}
                        onClick={card.action}
                        className={`group relative flex flex-col items-start p-8 rounded-[2.5rem] border text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${cardBg} ${borderColor} hover:border-[#4E6E49]/30 overflow-hidden`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-8 -top-8 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-${card.color}-500`} />

                        <div className={`mb-6 p-4 rounded-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            {card.icon}
                        </div>

                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                    {card.badge}
                                </span>
                                <div className={`w-1 h-1 rounded-full bg-${card.color}-500 animate-pulse`} />
                            </div>
                            <h3 className={`text-xl font-black tracking-tight ${headingColor}`}>
                                {card.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${labelColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                {card.description}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter text-[#4E6E49] group-hover:translate-x-1 transition-transform">
                            <span>Открыть управление</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Modals */}
            {showRestrictionForm && (
                <RestrictionForm
                    onClose={() => setShowRestrictionForm(false)}
                    onSave={() => setShowRestrictionForm(false)}
                />
            )}

            {showConflictsForm && (
                <UserConflictsForm onClose={() => setShowConflictsForm(false)} />
            )}

            {showAccessBlocksForm && (
                <AccessBlocksForm onClose={() => setShowAccessBlocksForm(false)} />
            )}
        </div>
    )
}
