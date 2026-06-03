import { useThemeStore } from '@/store/themeStore'
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, BarChart3, Target } from 'lucide-react'

export const AIReview = () => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  const aiInsights = [
    {
      id: 1,
      type: 'strength',
      title: 'Высокая точность входов',
      description: 'Ваши точки входа демонстрируют 87% точность за последнюю неделю',
      icon: CheckCircle2,
      color: 'green'
    },
    {
      id: 2,
      type: 'improvement',
      title: 'Улучшить стоп-лоссы',
      description: 'Рекомендуется пересмотреть уровень стоп-лоссов на волатильных активах',
      icon: AlertTriangle,
      color: 'amber'
    },
    {
      id: 3,
      type: 'insight',
      title: 'Потенциал роста',
      description: 'AI обнаружил паттерн: ваши лучшие результаты в период 14:00-16:00 UTC',
      icon: Lightbulb,
      color: 'blue'
    }
  ]

  const metrics = [
    { label: 'Точность сигналов', value: '87%', change: '+5%', positive: true },
    { label: 'Risk/Reward', value: '2.3', change: '+0.2', positive: true },
    { label: 'Win Rate', value: '68%', change: '-2%', positive: false },
    { label: 'Profit Factor', value: '1.9', change: '+0.1', positive: true }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        text: 'text-green-500'
      },
      amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-500'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-500'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/5">
        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
          <Brain className="w-8 h-8 text-purple-500" />
        </div>
        <div>
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
            AI Review
          </h1>
          <p className={`text-sm font-medium ${subTextColor}`}>
            Искусственный интеллект анализирует вашу торговую деятельность
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`section-card rounded-xl p-4 border ${
              theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}
          >
            <p className={`text-sm ${subTextColor}`}>{metric.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className={`text-2xl font-bold ${headingColor}`}>{metric.value}</p>
              <span className={`text-xs font-semibold ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className={`text-lg font-bold ${headingColor}`}>AI Insights</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {aiInsights.map((insight) => {
            const Icon = insight.icon
            const colors = getColorClasses(insight.color)
            return (
              <div
                key={insight.id}
                className={`section-card rounded-xl p-5 border ${colors.bg} ${colors.border} relative overflow-hidden`}
              >
                <div className="relative z-10 space-y-3">
                  <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${headingColor}`}>{insight.title}</h3>
                    <p className={`text-sm mt-1 ${subTextColor}`}>{insight.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className={`section-card rounded-2xl p-6 border ${
        theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          <h3 className={`text-lg font-bold ${headingColor}`}>Анализ производительности</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${headingColor}`}>Технический анализ</span>
              <span className="text-sm font-bold text-green-500">85%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${headingColor}`}>Риск-менеджмент</span>
              <span className="text-sm font-bold text-amber-500">72%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${headingColor}`}>Дисциплина</span>
              <span className="text-sm font-bold text-blue-500">90%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${headingColor}`}>Психология</span>
              <span className="text-sm font-bold text-purple-500">78%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className={`section-card rounded-2xl p-6 border ${
        theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-emerald-500" />
          <h3 className={`text-lg font-bold ${headingColor}`}>Рекомендации AI</h3>
        </div>

        <div className="space-y-3">
          {[
            'Сосредоточьтесь на улучшении риск-менеджмента для повышения стабильности результатов',
            'Рассмотрите возможность увеличения объёмов в периоды высокой точности (14:00-16:00 UTC)',
            'Добавьте больше инструментов для анализа волатильности рынка',
            'Практикуйте паттерны, которые показывают наибольшую эффективность'
          ].map((recommendation, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className={`text-sm ${subTextColor}`}>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AIReview
