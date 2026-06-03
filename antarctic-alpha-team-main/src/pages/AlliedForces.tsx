import { useThemeStore } from '@/store/themeStore'
import { PawPrint, ArrowRight, Sparkles } from 'lucide-react'

export const AlliedForces = () => {
  const { theme } = useThemeStore()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl border ${
        theme === 'dark' 
          ? 'border-white/10 bg-gradient-to-br from-[#1a2a2e] to-[#0f1a1c]' 
          : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
      } shadow-2xl`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${
              theme === 'dark' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-100'
            }`}>
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-semibold text-cyan-500">В разработке</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-100'
            }`}>
              <PawPrint className="w-6 h-6 text-cyan-500" />
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className={`text-3xl md:text-4xl font-black mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Allied <span className="text-cyan-500">Forces</span>
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Партнёры и союзники
            </p>
          </div>

          {/* Description Card */}
          <div className={`p-6 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
              }`}>
                <PawPrint className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  База данных <span className="font-bold text-cyan-500">партнёров и союзников</span> нашей команды и сообщества 
                  <span className="font-bold"> Antarctic Alpha</span>. Знакомьтесь с ключевыми игроками экосистемы, находите новые связи и расширяйте сеть контактов.
                </p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              'База партнёров',
              'Профили команды',
              'Связи и контакты',
              'Коллаборации'
            ].map((feature, i) => (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-xl ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <ArrowRight className="w-4 h-4 text-cyan-500" />
                <span className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{feature}</span>
              </div>
            ))}
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-500/20">
            <p className={`text-center text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              🚀 <span className="font-semibold">Запуск ожидается в ближайшее время</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlliedForces
