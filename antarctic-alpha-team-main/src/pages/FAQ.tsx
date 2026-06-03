import { useThemeStore } from '@/store/themeStore'
import { Link } from 'react-router-dom'
import { Settings, HelpCircle, MessageCircle, Mail, Users } from 'lucide-react'

export const FAQ = () => {
  const { theme } = useThemeStore()
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const glassCard = theme === 'dark'
    ? 'bg-white/5 border-white/10' 
    : 'bg-white border-gray-200'

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#4E6E49]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-[#4E6E49]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-sm font-semibold mb-6">
              <HelpCircle className="w-4 h-4" />
              Вопросы и ответы
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 ${headingColor}`}>
              Часто задаваемые <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-500/80">
                вопросы
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Здесь собраны ответы на самые популярные вопросы о работе сообщества ARCA
            </p>
          </div>
        </div>
      </div>

      {/* Development Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className={`rounded-3xl border-2 border-dashed p-10 text-center ${glassCard}`}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-[#4E6E49]/10'
          }`}>
            <Settings className={`w-10 h-10 text-[#4E6E49] animate-spin-slow`} />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${headingColor}`}>
            Раздел в разработке
          </h2>
          <p className={`text-base max-w-md mx-auto ${subTextColor}`}>
            Мы собираем самые частые вопросы и готовим подробные ответы. Совсем скоро здесь появится полная база знаний.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-12">
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${headingColor}`}>
            Нужна помощь?
          </h2>
          <p className={subTextColor}>
            Пока FAQ наполняется — задавай вопросы напрямую
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://t.me/+n0tBXaJGGjI1NDhi"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Командный чат</span>
          </a>

          <Link
            to="/contact-dm"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <Users className="w-4 h-4" />
            <span>Написать DM</span>
          </Link>

          <a
            href="mailto:support@arca-apex.io"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default FAQ
