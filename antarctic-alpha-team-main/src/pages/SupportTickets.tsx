import { useThemeStore } from '@/store/themeStore'
import { Headphones, Sparkles } from 'lucide-react'

export const SupportTickets = () => {
  const { theme } = useThemeStore()

  return (
    <div className="max-w-xl mx-auto">
      <div className={`relative overflow-hidden rounded-3xl border ${
        theme === 'dark' 
          ? 'border-[#4C7F6E]/30 bg-[#1a2520]' 
          : 'border-[#4C7F6E]/20 bg-gradient-to-br from-white to-[#f0f7f4]'
      } shadow-xl`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#4C7F6E]/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#4C7F6E]/10 rounded-full blur-2xl" />
        </div>

        <div className="relative p-8 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${
            theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>В разработке</span>
          </div>

          <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
          }`}>
            <Headphones className="w-8 h-8 text-[#4C7F6E]" />
          </div>

          <h1 className={`text-2xl font-black mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="text-[#4C7F6E]">Support</span> Tickets
          </h1>
          
          <p className={`text-sm mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Обращения поддержки
          </p>

          <div className={`p-4 rounded-2xl ${
            theme === 'dark' ? 'bg-white/5' : 'bg-[#4C7F6E]/5'
          }`}>
            <p className={`text-sm leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span className="font-bold text-[#4C7F6E]">Обращения клиентов</span> и участников сообщества. Создание тикетов и оперативная поддержка.
            </p>
          </div>

          <p className={`mt-6 text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            🚀 Запуск скоро
          </p>
        </div>
      </div>
    </div>
  )
}

export default SupportTickets
