import { useEffect, useRef, memo, useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { 
  LineChart, 
  Flame,
  Building2,
  Coins,
  Newspaper,
  CalendarDays,
  ChevronDown
} from 'lucide-react'

// TradingView Widget Component
const TradingViewWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing widgets
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: 'D',
      locale: 'ru',
      save_image: true,
      style: '1',
      symbol: 'BINANCE:BTCUSDT',
      theme: 'dark',
      timezone: 'Europe/Moscow',
      backgroundColor: '#0F0F0F',
      gridColor: 'rgba(242, 242, 242, 0.06)',
      watchlist: [],
      withdateranges: true,
      compareSymbols: [],
      studies: [],
      autosize: true
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: '100%', width: '100%' }}
    >
      <div 
        className="tradingview-widget-container__widget" 
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a 
          href="https://ru.tradingview.com/symbols/BTCUSDT/?exchange=BINANCE" 
          rel="noopener nofollow" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
})

TradingViewWidget.displayName = 'TradingViewWidget'

// TradingView News Widget Component
const TradingViewNewsWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing widgets
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      displayMode: 'regular',
      feedMode: 'all_symbols',
      colorTheme: 'dark',
      isTransparent: false,
      locale: 'ru',
      autosize: true
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: '100%', width: '100%' }}
    >
      <div 
        className="tradingview-widget-container__widget" 
        style={{ height: '100%', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a 
          href="https://ru.tradingview.com/news/top-providers/tradingview/" 
          rel="noopener nofollow" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
})

TradingViewNewsWidget.displayName = 'TradingViewNewsWidget'

// TradingView Economic Calendar Widget Component
const TradingViewEventsWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing widgets
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      isTransparent: false,
      locale: 'ru',
      countryFilter: 'ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu',
      importanceFilter: '-1,0,1',
      autosize: true
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: '100%', width: '100%' }}
    >
      <div 
        className="tradingview-widget-container__widget" 
        style={{ height: '100%', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a 
          href="https://ru.tradingview.com/economic-calendar/" 
          rel="noopener nofollow" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
})

TradingViewEventsWidget.displayName = 'TradingViewEventsWidget'

// TradingView Crypto Market Screener Widget Component
const TradingViewCryptoScreenerWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing widgets
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      defaultColumn: 'moving_averages',
      screener_type: 'crypto_mkt',
      displayCurrency: 'USD',
      colorTheme: 'dark',
      isTransparent: false,
      locale: 'ru',
      autosize: true
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: '100%', width: '100%' }}
    >
      <div 
        className="tradingview-widget-container__widget" 
        style={{ height: '100%', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a 
          href="https://ru.tradingview.com/markets/cryptocurrencies/prices-all/" 
          rel="noopener nofollow" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
})

TradingViewCryptoScreenerWidget.displayName = 'TradingViewCryptoScreenerWidget'

// TradingView Crypto Heatmap Widget Component
const TradingViewCryptoHeatmapWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing widgets
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      dataSource: 'Crypto',
      blockSize: 'market_cap_calc',
      blockColor: '24h_close_change|5',
      locale: 'ru',
      symbolUrl: '',
      colorTheme: 'dark',
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      autosize: true
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: '100%', width: '100%' }}
    >
      <div 
        className="tradingview-widget-container__widget" 
        style={{ height: '100%', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a 
          href="https://ru.tradingview.com/heatmap/crypto/" 
          rel="noopener nofollow" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
})

TradingViewCryptoHeatmapWidget.displayName = 'TradingViewCryptoHeatmapWidget'

// TradingView Stock Heatmap Widget Component
const TradingViewStockHeatmapWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // Clear any existing widgets
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      dataSource: 'SPX500',
      blockSize: 'market_cap_basic',
      blockColor: 'change',
      grouping: 'sector',
      locale: 'ru',
      symbolUrl: '',
      colorTheme: 'dark',
      exchanges: [],
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      autosize: true
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: '100%', width: '100%' }}
    >
      <div 
        className="tradingview-widget-container__widget" 
        style={{ height: '100%', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a 
          href="https://ru.tradingview.com/heatmap/stock/" 
          rel="noopener nofollow" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
})

TradingViewStockHeatmapWidget.displayName = 'TradingViewStockHeatmapWidget'

export const MarketAnalytics = () => {
  const { theme } = useThemeStore()
  const [activeTab, setActiveTab] = useState('chart')

  const isDark = theme === 'dark'
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600'
  const cardBg = isDark ? 'bg-[#131722]' : 'bg-white'
  const bgColor = isDark ? 'bg-[#131722]' : 'bg-gray-50'
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200'

  // Brand colors
  const brandPrimary = '#4C7F6E'
  const brandSecondary = '#4E6E49'

  // Tab configurations
  const tabs = [
    { id: 'chart', label: 'График', icon: LineChart },
    { id: 'crypto', label: 'Крипто', icon: Coins },
    { id: 'stocks', label: 'Акции', icon: Building2 },
    { id: 'heatmap', label: 'Тепловая карта', icon: Flame },
    { id: 'news', label: 'Новости', icon: Newspaper },
    { id: 'calendar', label: 'Календарь', icon: CalendarDays },
  ]

  return (
    <div className={`min-h-screen ${bgColor} pb-6`}>
      {/* Header - Clean & Minimal */}
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={`text-xl font-semibold ${textColor}`}>
              Market Analytics
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - TradingView Style */}
      <div className="px-4 lg:px-6 mb-4">
        <div className={`flex items-center gap-1 ${isDark ? 'bg-[#131722]' : 'bg-white'} p-1 rounded-lg`}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                  isActive
                    ? 'text-white shadow-lg'
                    : `${subTextColor} hover:${textColor}`
                }`}
                style={{
                  background: isActive ? `linear-gradient(to right, ${brandPrimary}, ${brandSecondary})` : 'transparent'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Chart Tab */}
        {activeTab === 'chart' && (
          <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className="h-[700px] lg:h-[800px]">
              <TradingViewWidget />
            </div>
          </div>
        )}

        {/* Crypto Tab */}
        {activeTab === 'crypto' && (
          <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className="h-[750px] lg:h-[850px]">
              <TradingViewCryptoScreenerWidget />
            </div>
          </div>
        )}

        {/* Stocks Tab */}
        {activeTab === 'stocks' && (
          <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className="h-[700px] lg:h-[800px]">
              <TradingViewStockHeatmapWidget />
            </div>
          </div>
        )}

        {/* Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
              <div className="h-[500px]">
                <TradingViewCryptoHeatmapWidget />
              </div>
            </div>
            
            <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
              <div className="h-[500px]">
                <TradingViewStockHeatmapWidget />
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className="h-[650px] lg:h-[750px]">
              <TradingViewNewsWidget />
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className={`rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}>
            <div className="h-[650px] lg:h-[750px]">
              <TradingViewEventsWidget />
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="px-4 lg:px-6 mt-6 mb-6">
        <div className={`rounded-lg border ${borderColor} ${cardBg}`}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
              Часто задаваемые вопросы
            </h3>
            <div className="space-y-3">
              <details className="group">
                <summary className={`flex items-center justify-between cursor-pointer p-3 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <LineChart className={`w-4 h-4 ${subTextColor}`} />
                    <span className={`text-sm font-medium ${textColor}`}>Как использовать графики TradingView?</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${subTextColor} group-open:rotate-180 transition-transform`} />
                </summary>
                <div className={`px-4 pb-4 text-sm ${subTextColor}`}>
                  Графики TradingView позволяют анализировать рынки с помощью технических индикаторов7 Используйте панель инструментов сверху для доступа к функциям, совсем скоро мы добавим про-чарты для полноценных инструментов.
                </div>
              </details>
              
              <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              
              <details className="group">
                <summary className={`flex items-center justify-between cursor-pointer p-3 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Coins className={`w-4 h-4 ${subTextColor}`} />
                    <span className={`text-sm font-medium ${textColor}`}>Где найти данные по криптовалютам?</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${subTextColor} group-open:rotate-180 transition-transform`} />
                </summary>
                <div className={`px-4 pb-4 text-sm ${subTextColor}`}>
                  Раздел "Крипто" содержит скринер криптовалют с реальными котировками с ведущих бирж по техническому анализу и ценой, а еще рекомендациями (не ИИР) по покупке/продаже.
                </div>
              </details>
              
              <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              
              <details className="group">
                <summary className={`flex items-center justify-between cursor-pointer p-3 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Flame className={`w-4 h-4 ${subTextColor}`} />
                    <span className={`text-sm font-medium ${textColor}`}>Что показывает тепловая карта?</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${subTextColor} group-open:rotate-180 transition-transform`} />
                </summary>
                <div className={`px-4 pb-4 text-sm ${subTextColor}`}>
                  Тепловая карта визуализирует изменения цен активов. Размер блока соответствует рыночной капитализации, цвет показывает изменение цены (зеленый — рост, красный — падение).
                </div>
              </details>
              
              <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              
              <details className="group">
                <summary className={`flex items-center justify-between cursor-pointer p-3 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <CalendarDays className={`w-4 h-4 ${subTextColor}`} />
                    <span className={`text-sm font-medium ${textColor}`}>Как использовать экономический календарь?</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${subTextColor} group-open:rotate-180 transition-transform`} />
                </summary>
                <div className={`px-4 pb-4 text-sm ${subTextColor}`}>
                  Экономический календарь показывает важные события, такие как решения по ставкам ЦБ, отчеты компаний и макроэкономические данные. Фильтруйте события по важности и стране.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 lg:px-6 mb-6">
        <div className={`flex items-center justify-between p-4 rounded-lg border ${borderColor} ${cardBg}`}>
          <div className="flex items-center gap-6">
            <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <span className={`text-sm font-medium ${subTextColor} group-hover:${textColor} transition-colors`}>TradingView</span>
            </a>
            <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <span className={`text-sm font-medium ${subTextColor} group-hover:${textColor} transition-colors`}>CoinGecko</span>
            </a>
            <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <span className={`text-sm font-medium ${subTextColor} group-hover:${textColor} transition-colors`}>Yahoo Finance</span>
            </a>
          </div>
          <div className={`text-xs ${subTextColor}`}>
            Data provided by TradingView
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketAnalytics
