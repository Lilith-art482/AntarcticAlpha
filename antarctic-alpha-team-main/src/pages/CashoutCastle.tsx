import { useThemeStore } from '@/store/themeStore'
import { Wallet, ArrowDownCircle, ArrowRight, Sparkles } from 'lucide-react'

export const CashoutCastle = () => {
  const { theme } = useThemeStore()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl border ${
        theme === 'dark' 
          ? 'border-white/10 bg-gradient-to-br from-[#2e2a1a] to-[#1a150f]' 
          : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
      } shadow-2xl`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${
              theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">В разработке</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-100'
            }`}>
              <ArrowDownCircle className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className={`text-3xl md:text-4xl font-black mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Cashout <span className="text-amber-500">Castle</span>
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Вывод средств
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
                theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
              }`}>
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Управление выводом средств через <span className="font-bold text-amber-500">Antarctic Wallet</span>. 
                  Безопасный вывод прибыли, история транзакций, автоматические выплаты и интеграция с различными платёжными системами.
                </p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              'Вывод прибыли',
              'История транзакций',
              'Авто-выплаты',
              'Множество валют'
            ].map((feature, i) => (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-xl ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <ArrowRight className="w-4 h-4 text-amber-500" />
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

export default CashoutCastle
