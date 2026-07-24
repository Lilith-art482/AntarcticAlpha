import { useEffect, useRef, memo, useState, useCallback } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
  LineChart,
  Flame,
  Building2,
  Coins,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  BarChart3,
  TrendingUp
} from 'lucide-react'

// ─── TradingView Ticker Tape Widget (original iframe) ──────────────────────────
const TradingViewTickerTape = memo(() => {
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!container.current) return
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BINANCE:BTCUSDT', title: 'BTC' },
        { proName: 'BINANCE:ETHUSDT', title: 'ETH' },
        { proName: 'BINANCE:SOLUSDT', title: 'SOL' },
        { proName: 'BINANCE:BNBUSDT', title: 'BNB' },
        { proName: 'BINANCE:GRAMUSDT', title: 'GRAM' },
        { proName: 'BINANCE:XRPUSDT', title: 'XRP' },
        { proName: 'BINANCE:DOGEUSDT', title: 'DOGE' },
        { proName: 'BINANCE:ADAUSDT', title: 'ADA' },
        { proName: 'BINANCE:AVAXUSDT', title: 'AVAX' }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: isDark ? 'dark' : 'light',
      locale: 'ru'
    })
    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [isDark])

  return (
    <div ref={container} style={{ height: '56px', width: '100%' }} />
  )
})

TradingViewTickerTape.displayName = 'TradingViewTickerTape'

// ─── TradingView Advanced Chart Widget (iframe-based with drawing tools) ────────
const TradingViewWidget = memo(({ symbol }: { symbol: string }) => {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const features = JSON.stringify([
    'chart',
    'side_toolbar',
    'drawing_tools',
    'chart_crosshair_menu',
    'chart_multiple_instance',
    'symbol_search',
    'keep_info_panel_open',
    'uppercase_in_symbols_search',
    'delete_symbol_in_search'
  ])

  const studies = JSON.stringify([
    'MASimple@tv-basicstudies',
    'Volume@tv-basicstudies'
  ])

  const widgetUrl = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=D&theme=${isDark ? 'dark' : 'light'}&style=1&locale=ru&hide_side_toolbar=0&symboledit=1&saveimage=0&allow_symbol_change=1&timezone=Europe/Moscow&enabled_features=${encodeURIComponent(features)}&studies=${encodeURIComponent(studies)}`

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <iframe
        src={widgetUrl}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allowFullScreen={true}
      />
    </div>
  )
})

TradingViewWidget.displayName = 'TradingViewWidget'

// ─── TradingView Economic Calendar Widget ───────────────────────────────────────
const TradingViewEventsWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!container.current) return
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: isDark ? 'dark' : 'light',
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
  }, [isDark])

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
    </div>
  )
})

TradingViewEventsWidget.displayName = 'TradingViewEventsWidget'

// ─── TradingView Crypto Screener Widget ─────────────────────────────────────────
const TradingViewCryptoScreenerWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!container.current) return
    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      defaultColumn: 'moving_averages',
      screener_type: 'crypto_mkt',
      displayCurrency: 'USD',
      colorTheme: isDark ? 'dark' : 'light',
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
  }, [isDark])

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
    </div>
  )
})

TradingViewCryptoScreenerWidget.displayName = 'TradingViewCryptoScreenerWidget'

// ─── TradingView Crypto Heatmap Widget ──────────────────────────────────────────
const TradingViewCryptoHeatmapWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!container.current) return
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
      colorTheme: isDark ? 'dark' : 'light',
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
  }, [isDark])

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
    </div>
  )
})

TradingViewCryptoHeatmapWidget.displayName = 'TradingViewCryptoHeatmapWidget'

// ─── TradingView Stock Heatmap Widget ───────────────────────────────────────────
const TradingViewStockHeatmapWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!container.current) return
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
      colorTheme: isDark ? 'dark' : 'light',
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
  }, [isDark])

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
    </div>
  )
})

TradingViewStockHeatmapWidget.displayName = 'TradingViewStockHeatmapWidget'

// ─── Premium FAQ Item Component ─────────────────────────────────────────────────
const FAQItem = memo(({ icon: Icon, question, answer, isDark, textColor, subTextColor }: {
  icon: React.ElementType
  question: string
  answer: string
  isDark: boolean
  textColor: string
  subTextColor: string
}) => (
  <details className="group">
    <summary className={`flex items-center justify-between cursor-pointer p-4 rounded-2xl transition-all duration-300 ${
      isDark ? 'hover:bg-white/5 active:bg-white/8' : 'hover:bg-gray-50 active:bg-gray-100'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-[#4C7F6E]/10 group-hover:bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10 group-hover:bg-[#4C7F6E]/15'
        }`}>
          <Icon className="w-4 h-4 text-[#4C7F6E]" />
        </div>
        <span className={`text-sm font-semibold ${textColor}`}>{question}</span>
      </div>
      <ChevronDown className={`w-4 h-4 ${subTextColor} group-open:rotate-180 transition-transform duration-300`} />
    </summary>
    <div className={`px-4 pb-4 ml-11 text-sm leading-relaxed ${subTextColor}`}>
      {answer}
    </div>
  </details>
))

FAQItem.displayName = 'FAQItem'

// ─── Main Page Component ────────────────────────────────────────────────────────
// ─── DEX Chart Widget (GMGN / DexScreener) ─────────────────────────────────────
type DexSource = 'gmgn' | 'dexscreener'

const DexChartWidget = memo(({ contractAddress, source }: { contractAddress: string; source: DexSource }) => {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const embedUrl = source === 'gmgn'
    ? `https://www.gmgn.cc/kline/sol/${contractAddress}?theme=${isDark ? 'dark' : 'light'}&interval=15`
    : `https://dexscreener.com/solana/${contractAddress}?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=${isDark ? 'dark' : 'light'}&theme=${isDark ? 'dark' : 'light'}&chartStyle=0&chartType=usd&interval=15`

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <iframe
        src={embedUrl}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allowFullScreen={true}
      />
    </div>
  )
})

DexChartWidget.displayName = 'DexChartWidget'

export const MarketAnalytics = () => {
  const { theme } = useThemeStore()
  const [activeTab, setActiveTab] = useState('chart')
  const [chartMode, setChartMode] = useState<'cex' | 'dex'>('cex')
  const [contractAddress, setContractAddress] = useState('')
  const [contractInput, setContractInput] = useState('')
  const [dexSource, setDexSource] = useState<DexSource>('gmgn')
  const selectedSymbol = 'BINANCE:BTCUSDT'

  const isDark = theme === 'dark'
  const headingColor = isDark ? 'text-white' : 'text-gray-900'
  const subHeadingColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const cardBg = isDark ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
  const bgColor = isDark ? 'bg-[#07090f]' : 'bg-gray-50'
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200'

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id)
  }, [])

  // Tab configurations
  const tabs = [
    { id: 'chart', label: 'График', icon: LineChart },
    { id: 'crypto', label: 'Крипто', icon: Coins },
    { id: 'stocks', label: 'Акции', icon: Building2 },
    { id: 'heatmap', label: 'Тепловая карта', icon: Flame },
    { id: 'calendar', label: 'Календарь', icon: CalendarDays },
  ]

  const faqItems = [
    {
      icon: LineChart,
      question: 'Как использовать графики TradingView?',
      answer: 'Превратите хаос котировок в понятную карту: используйте график как полноценный скальпель трейдера. Стройте уровни поддержки/сопротивления, растягивайте сетку Фибоначчи для поиска точек входа и фиксируйте тренды с помощью трендовых линий — весь набор профессиональных инструментов всегда под рукой для вашего торгового анализа.'
    },
    {
      icon: Coins,
      question: 'Где найти данные по криптовалютам?',
      answer: 'Раздел "Крипто" содержит скринер криптовалют с реальными котировками с ведущих бирж по техническому анализу и ценой, а еще рекомендациями (не ИИР) по покупке/продаже.'
    },
    {
      icon: Flame,
      question: 'Что показывает тепловая карта?',
      answer: 'Тепловая карта визуализирует изменения цен активов. Размер блока соответствует рыночной капитализации, цвет показывает изменение цены (зеленый — рост, красный — падение). Идеально для быстрого обзора рыночного настроения.'
    },
    {
      icon: CalendarDays,
      question: 'Как использовать экономический календарь?',
      answer: 'Экономический календарь показывает важные события, такие как решения по ставкам ЦБ, отчеты компаний и макроэкономические данные. Фильтруйте события по важности и стране для планирования торговли.'
    }
  ]

  return (
    <div className={`flex flex-col h-screen ${bgColor} overflow-hidden`}>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-6 space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
            <BarChart3 className="w-8 h-8 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
              Market Analytics
            </h1>
            <p className={`text-sm font-medium ${subHeadingColor}`}>
              Профессиональные инструменты для трейдинга
            </p>
          </div>
        </div>

        {/* ── Ticker Tape ── */}
        <div className={`rounded-2xl border ${cardBg}`}>
          <TradingViewTickerTape />
        </div>

        {/* ── Tabs Navigation ── */}
        <div className={`flex flex-wrap items-center gap-2 p-2 rounded-2xl border ${
          isDark ? 'bg-[#0b1015]/80 border-white/5' : 'bg-white/80 border-gray-100 shadow-sm'
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg scale-[1.02]'
                    : `${subHeadingColor} hover:${headingColor} hover:bg-white/5`
                }`}
                style={isActive ? {
                  background: `linear-gradient(135deg, var(--brand), var(--brand-strong))`,
                  boxShadow: '0 8px 24px rgba(78, 110, 73, 0.35)'
                } : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Tab Content ── */}
        <div className="animate-fade-in">
          {/* Chart Tab */}
          {activeTab === 'chart' && (
            <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}>
              {/* CEX/DEX Toggle */}
              <div className={`flex items-center gap-3 p-3 border-b ${
                isDark ? 'border-white/5' : 'border-gray-100'
              }`}>
                <div className={`flex rounded-xl p-1 ${
                  isDark ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                  <button
                    onClick={() => setChartMode('cex')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      chartMode === 'cex'
                        ? 'bg-[#4C7F6E] text-white shadow-md'
                        : `${subHeadingColor} hover:${headingColor}`
                    }`}
                  >
                    CEX
                  </button>
                  <button
                    onClick={() => setChartMode('dex')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      chartMode === 'dex'
                        ? 'bg-[#4C7F6E] text-white shadow-md'
                        : `${subHeadingColor} hover:${headingColor}`
                    }`}
                  >
                    DEX
                  </button>
                </div>

                {chartMode === 'dex' && (
                  <div className="flex-1 flex items-center gap-2">
                    <div className={`flex rounded-lg p-0.5 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      {(['gmgn', 'dexscreener'] as DexSource[]).map((src) => (
                        <button
                          key={src}
                          onClick={() => setDexSource(src)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                            dexSource === src
                              ? 'bg-[#4C7F6E] text-white shadow-sm'
                              : `${subHeadingColor} hover:${headingColor}`
                          }`}
                        >
                          {src === 'gmgn' ? 'GMGN' : 'DexScreener'}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={contractInput}
                      onChange={(e) => setContractInput(e.target.value)}
                      placeholder="Solana contract address..."
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 outline-none ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E]/50'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]/50'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && contractInput.trim()) {
                          setContractAddress(contractInput.trim())
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (contractInput.trim()) {
                          setContractAddress(contractInput.trim())
                        }
                      }}
                      disabled={!contractInput.trim()}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        contractInput.trim()
                          ? 'bg-[#4C7F6E] text-white hover:bg-[#3d6a5d]'
                          : isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      Show
                    </button>
                  </div>
                )}

                {chartMode === 'cex' && (
                  <div className={`text-xs font-medium ${subHeadingColor}`}>
                    TradingView &middot; {selectedSymbol}
                  </div>
                )}
              </div>

              {/* Chart Content */}
              <div style={{ height: 'calc(100vh - 340px)', minHeight: '400px' }}>
                {chartMode === 'cex' ? (
                  <TradingViewWidget symbol={selectedSymbol} />
                ) : contractAddress ? (
                  <DexChartWidget contractAddress={contractAddress} source={dexSource} />
                ) : (
                  <div className={`flex flex-col items-center justify-center h-full ${subHeadingColor}`}>
                    <LineChart className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-sm font-medium">Enter a Solana contract address to view the chart</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Crypto Tab */}
          {activeTab === 'crypto' && (
            <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}>
              <div style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
                <TradingViewCryptoScreenerWidget />
              </div>
            </div>
          )}

          {/* Stocks Tab */}
          {activeTab === 'stocks' && (
            <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}>
              <div style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
                <TradingViewStockHeatmapWidget />
              </div>
            </div>
          )}

          {/* Heatmap Tab */}
          {activeTab === 'heatmap' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}>
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#4C7F6E]" />
                    <span className={`text-sm font-bold ${headingColor}`}>Crypto Heatmap</span>
                  </div>
                </div>
                <div style={{ height: 'calc(100vh - 380px)', minHeight: '350px' }}>
                  <TradingViewCryptoHeatmapWidget />
                </div>
              </div>

              <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}>
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4C7F6E]" />
                    <span className={`text-sm font-bold ${headingColor}`}>Stock Heatmap</span>
                  </div>
                </div>
                <div style={{ height: 'calc(100vh - 380px)', minHeight: '350px' }}>
                  <TradingViewStockHeatmapWidget />
                </div>
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}>
              <div style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
                <TradingViewEventsWidget />
              </div>
            </div>
          )}
        </div>

        {/* ── FAQ Section ── */}
        <div className={`rounded-2xl border ${borderColor} ${cardBg}`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[#4C7F6E]/10">
                <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />
              </div>
              <h3 className={`text-lg font-bold ${headingColor}`}>
                Часто задаваемые вопросы
              </h3>
            </div>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div key={index}>
                  <FAQItem
                    icon={item.icon}
                    question={item.question}
                    answer={item.answer}
                    isDark={isDark}
                    textColor={headingColor}
                    subTextColor={subHeadingColor}
                  />
                  {index < faqItems.length - 1 && (
                    <div className={`h-px mx-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className={`rounded-2xl border ${borderColor} ${cardBg}`}>
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { name: 'TradingView', url: 'https://www.tradingview.com', icon: LineChart },
                  { name: 'CoinGecko', url: 'https://www.coingecko.com', icon: Coins },
                  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', icon: Building2 }
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                      isDark
                        ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    <span className={`text-sm font-semibold transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {link.name}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
              <div className={`flex items-center gap-2 text-xs font-medium ${subHeadingColor}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C7F6E]" />
                Data provided by TradingView
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketAnalytics
