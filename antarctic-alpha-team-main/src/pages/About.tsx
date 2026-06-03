import { useThemeStore } from '@/store/themeStore'
import { TEAM_MEMBERS } from '@/types'
import { useUserAvatar } from '@/utils/userUtils'
import {
  Users,
  Calendar,
  BookOpen,
  Layers,
  Shield,
  Lock,
  GraduationCap,
  Zap,
  Globe,
  Mail,
  ArrowUpRight,
  Sparkles,
  Rocket,
  HeartHandshake,
  Brain,
  HelpCircle,
  FileText,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const TeamMemberAvatar: React.FC<{ userId: string; size: 'lg' | 'md' }> = ({ userId, size }) => {
  const avatarUrl = useUserAvatar(userId)
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-12 h-12 text-xl'
  const member = TEAM_MEMBERS.find(m => m.id === userId)
  const initials = member?.name?.[0] || '?'

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden shadow-lg border-2 border-white/20 transition-opacity duration-300`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={member?.name || 'User'} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
          <span className="text-white font-bold">{initials}</span>
        </div>
      )}
    </div>
  )
}

export const About = () => {
  const { theme } = useThemeStore()
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const glassCard = theme === 'dark'
    ? 'bg-white/5 border-white/10' 
    : 'bg-white border-gray-200'
  const sectionBg = ''
  const gridPattern = theme === 'dark'
    ? 'bg-[linear-gradient(rgba(78,110,73,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(78,110,73,0.08)_1px,transparent_1px)]'
    : 'bg-[linear-gradient(rgba(78,110,73,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(78,110,73,0.06)_1px,transparent_1px)]'

  const principles = [
    {
      title: 'Финансовая грамотность',
      icon: GraduationCap,
      note: 'Управление рисками и анализ вместо эмоций.',
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/5 border-emerald-500/20'
    },
    {
      title: 'Приватность',
      icon: Lock,
      note: 'Защита цифровой идентичности и личных границ.',
      accent: 'text-blue-200',
      bg: 'bg-blue-300/5 border-blue-300/20'
    },
    {
      title: 'Образование',
      icon: BookOpen,
      note: 'От основ блокчейна до DeFi-стратегий.',
      accent: 'text-amber-400',
      bg: 'bg-amber-500/5 border-amber-500/20'
    },
    {
      title: 'Прозрачность',
      icon: Shield,
      note: 'Честные сделки и открытость внутри клуба.',
      accent: 'text-purple-400',
      bg: 'bg-purple-500/5 border-purple-500/20'
    },
    {
      title: 'Инновации',
      icon: Zap,
      note: 'Тестируем новые протоколы и не боимся быть первыми.',
      accent: 'text-pink-400',
      bg: 'bg-pink-500/5 border-pink-500/20'
    },
    {
      title: 'Критическое мышление',
      icon: Brain,
      note: 'Анализируем, проверяем, не следуем за хайпом.',
      accent: 'text-cyan-400',
      bg: 'bg-cyan-500/5 border-cyan-500/20'
    },
    {
      title: 'Глобальность',
      icon: Globe,
      note: 'Сотрудничество ради свободы в рамках закона.',
      accent: 'text-lime-400',
      bg: 'bg-lime-500/5 border-lime-500/20'
    },
    {
      title: 'Ответственность',
      icon: HeartHandshake,
      note: 'Зрелость и самоконтроль в принятии решений.',
      accent: 'text-slate-400',
      bg: 'bg-slate-500/5 border-slate-500/20'
    },
  ]

  const stats = [
    { label: 'Участников', value: '25', suffix: '+', icon: Users, desc: 'Активное комьюнити' },
    { label: 'Сессий / Неделю', value: '10', suffix: '+', icon: Calendar, desc: 'Регулярные созвоны' },
    { label: 'База знаний', value: '50', suffix: '+', icon: BookOpen, desc: 'Уроков и материалов' },
  ]

  const teamHierarchy = [
    {
      level: 'CEO',
      name: 'Ксения',
      userId: '3',
      avatar: '/avatars/kseniya.jpg',
      isMain: true
    },
    {
      level: 'COO',
      name: 'Артём',
      userId: '1',
      avatar: '/avatars/artyom.jpg',
      isMain: true
    },
    {
      level: 'CFO',
      name: '—',
      userId: null,
      avatar: null,
      isMain: false
    },
    {
      level: 'CTO',
      name: 'Адель',
      userId: '2',
      avatar: '/avatars/adel.jpg',
      isMain: false
    },
    {
      level: 'CMO',
      name: '—',
      userId: null,
      avatar: null,
      isMain: false
    },
    {
      level: 'CSO',
      name: '—',
      userId: null,
      avatar: null,
      isMain: false
    },
    {
      level: 'CCO',
      name: '—',
      userId: null,
      avatar: null,
      isMain: false
    },
  ]

  return (
    <div className={`min-h-screen ${sectionBg} relative`}>
      {/* Grid Pattern Background - full width */}
      <div className={`fixed inset-0 pointer-events-none ${gridPattern} [background-size:40px_40px] z-0`} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#4E6E49]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-[#4E6E49]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              О сообществе
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 ${headingColor}`}>
              Где знания <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-500/80">
                превращаются в действие
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              ARCA — это сообщество единомышленников, которые объединились для изучения, тестирования и масштабирования крипто-стратегий в безопасной среде.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className={`relative rounded-2xl p-6 border backdrop-blur-sm ${glassCard}`}
                >
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${subTextColor}`}>{stat.label}</span>
                      <stat.icon className="w-5 h-5 text-[#4E6E49]" />
                    </div>
                    <div className={`text-4xl font-black ${headingColor}`}>
                      {stat.value}<span className="text-[#4E6E49]">{stat.suffix}</span>
                    </div>
                    <div className="text-xs mt-2 font-medium text-[#4E6E49]">
                      {stat.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        <div className="text-center mb-6">
          <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${headingColor}`}>
            Наши принципы
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Фундамент, на котором строится всё сообщество
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className={`group rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark' ? item.bg : 'bg-white border-gray-100'}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <item.icon className={`w-4 h-4 ${item.accent}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.title}
                </span>
              </div>
              <p className={`text-sm ${subTextColor}`}>{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className={`rounded-3xl p-8 border relative overflow-hidden ${glassCard}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4E6E49]/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-sm font-semibold">
                <Rocket className="w-4 h-4" />
                Миссия
              </div>
              
              <h3 className={`text-xl sm:text-2xl font-black mb-4 ${headingColor}`}>
                Создаём будущее финансовой свободы
              </h3>
              
              <p className={`${subTextColor}`}>
                Мы объединяем людей, которые хотят не просто понимать крипторынок, а уверенно в нём действовать. Без спешки, без FOMO, без потери депозита — только взвешенные решения и системный подход.
              </p>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="space-y-4">
            {/* Strategies */}
            <Link
              to="/strategies"
              className={`block rounded-2xl p-6 border relative overflow-hidden group ${glassCard} hover:border-[#4E6E49]/30 transition-all`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-sm font-semibold mb-3">
                    <Layers className="w-4 h-4" />
                    Стратегии
                  </div>
                  <h4 className={`text-xl font-bold mb-2 ${headingColor}`}>Наши стратегии</h4>
                  <p className={`text-sm ${subTextColor} max-w-xs`}>
                    Проверенные методики торговли и инвестирования
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#4E6E49] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>

            {/* Rules */}
            <Link
              to="/rules"
              className={`block rounded-2xl p-6 border relative overflow-hidden group ${glassCard} hover:border-[#4E6E49]/30 transition-all`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-sm font-semibold mb-3">
                    <Shield className="w-4 h-4" />
                    Регламент
                  </div>
                  <h4 className={`text-xl font-bold mb-2 ${headingColor}`}>Правила сообщества</h4>
                  <p className={`text-sm ${subTextColor} max-w-xs`}>
                    Прозрачные правила — залог доверия и эффективности
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#4E6E49] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${headingColor}`}>
            Наша команда
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Руководство, которое задает вектор развития
          </p>
        </div>

        <div className="flex flex-col items-center gap-0">
          {/* Leadership Column */}
          <div className="flex flex-col items-center">
            {/* CEO */}
            {teamHierarchy.filter(m => m.isMain && m.level === 'CEO').map((member, idx) => (
              <div key={idx} className="relative z-10">
                <div className={`relative rounded-2xl p-4 border backdrop-blur-md border-white/10 bg-white/5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
                  <div className="flex flex-col items-center gap-2">
                    <TeamMemberAvatar userId={member.userId || ''} size="lg" />
                    <div className="text-center">
                      <h3 className={`text-base font-bold ${headingColor}`}>{member.name}</h3>
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{member.level} — Antarctic Alpha</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Line from CEO to COO */}
            <div className="w-0.5 h-4 bg-gradient-to-b from-[#4E6E49]/60 to-[#4E6E49]/30" />

            {/* COO */}
            {teamHierarchy.filter(m => m.isMain && m.level === 'COO').map((member, idx) => (
              <div key={idx} className="relative z-10">
                <div className={`relative rounded-2xl p-4 border backdrop-blur-md border-white/10 bg-white/5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
                  <div className="flex flex-col items-center gap-2">
                    <TeamMemberAvatar userId={member.userId || ''} size="lg" />
                    <div className="text-center">
                      <h3 className={`text-base font-bold ${headingColor}`}>{member.name}</h3>
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{member.level} — Antarctic Alpha</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Line from COO to branches */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-[#4E6E49]/60 to-[#4E6E49]/30" />
          </div>

          {/* Horizontal branch line - centered below */}
          <div className="hidden md:block w-[500px] h-0.5 bg-gradient-to-r from-transparent via-[#4E6E49]/50 to-transparent -my-1" />

          {/* C-Level Branching - single row on larger screens */}
          <div className="w-full">
            {/* On md+ show as flex row, on smaller show as grid */}
            <div className="hidden md:flex justify-center items-start gap-3">
              {teamHierarchy.filter(m => !m.isMain).map((member, idx) => (
                <div key={idx} className="relative group z-10 flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#4E6E49]/40 to-transparent mb-1" />
                  <div className={`relative rounded-2xl p-4 border backdrop-blur-md border-white/10 bg-white/5 shadow-md transition-all duration-300 hover:scale-[1.05] hover:shadow-xl`}>
                    <div className="flex flex-col items-center gap-2">
                      <TeamMemberAvatar userId={member.userId || ''} size="md" />
                      <div className="text-center">
                        <h3 className={`text-base font-bold ${headingColor}`}>{member.name}</h3>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{member.level}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Grid for smaller screens */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {teamHierarchy.filter(m => !m.isMain).map((member, idx) => (
                <div key={idx} className="relative group z-10">
                  <div className={`relative rounded-2xl p-4 border backdrop-blur-md border-white/10 bg-white/5 shadow-md transition-all duration-300 hover:scale-[1.05] hover:shadow-xl`}>
                    <div className="flex flex-col items-center gap-2">
                      <TeamMemberAvatar userId={member.userId || ''} size="md" />
                      <div className="text-center">
                        <h3 className={`text-base font-bold ${headingColor}`}>{member.name}</h3>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{member.level}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${headingColor}`}>
            Документы
          </h2>
          <p className={subTextColor}>
            Официальные материалы и регламентирующие документы
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Устав */}
          <div className={`group rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${glassCard}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-medium">
                <Clock className="w-3 h-3" />
                В разработке
              </span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${headingColor}`}>Устав</h3>
            <p className={`text-sm ${subTextColor}`}>
              Основной документ, определяющий структуру и принципы работы сообщества
            </p>
          </div>

          {/* Положение о пуле */}
          <Link
            to="/pool-rules"
            className={`group rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-[#4E6E49]/30 ${glassCard}`}
          >
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${headingColor}`}>Положение о пуле</h3>
            <p className={`text-sm ${subTextColor} mb-4`}>
              Правила формирования и управления пулом с использованием прогрессивной шкалы
            </p>
            <div className={`inline-flex items-center gap-2 text-sm font-medium text-blue-400`}>
              <span>Открыть документ</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>

          {/* Политика обработки персональных данных */}
          <div className={`group rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${glassCard}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-medium">
                <Clock className="w-3 h-3" />
                В разработке
              </span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${headingColor}`}>Политика обработки персональных данных</h3>
            <p className={`text-sm ${subTextColor}`}>
              Политика конфиденциальности и защиты персональных данных
            </p>
          </div>

          {/* Положение о бета-тестировании */}
          <Link
            to="/beta-testing"
            className={`group rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-[#4E6E49]/30 ${glassCard}`}
          >
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${headingColor}`}>Положение о бета-тестировании</h3>
            <p className={`text-sm ${subTextColor} mb-4`}>
              Регламент проведения бета-тестирования продуктов ARCA
            </p>
            <div className={`inline-flex items-center gap-2 text-sm font-medium text-[#4E6E49]`}>
              <span>Открыть документ</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-12">
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${headingColor}`}>
            Остались вопросы?
          </h2>
          <p className={subTextColor}>
            Задавай — всегда на связи
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://t.me/+n0tBXaJGGjI1NDhi"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <Mail className="w-4 h-4" />
            <span>Командный чат</span>
          </a>

          <a
            href="https://t.me/artyommedoed"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <Users className="w-4 h-4" />
            <span>Написать DM</span>
          </a>

          <Link
            to="/faq"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
