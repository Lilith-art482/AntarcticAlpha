import { useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useSidebarStore } from '@/store/sidebarStore'

const RatesBar = () => {
  const { theme } = useThemeStore()
  const { isCollapsed } = useSidebarStore()
  const containerRef = useRef<HTMLDivElement>(null)

  // Show only on tablets and PCs (width > 768px)
  const isVisible = typeof window !== 'undefined' && window.innerWidth > 768
  const sidebarWidth = isVisible && window.innerWidth >= 1280 
    ? (isCollapsed ? '80px' : '288px') 
    : '0px'

  if (!isVisible) return null

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' },
        { proName: 'BITSTAMP:ETHUSD', title: 'ETH/USD' },
        { proName: 'BINANCE:SOLUSDT', title: 'SOL/USDT' },
        { proName: 'BINANCE:BNBUSDT', title: 'BNB/USDT' },
        { proName: 'OKX:TONUSDT', title: 'TON/USDT' },
        { proName: 'BINANCE:XRPUSDT', title: 'XRP/USDT' },
        { proName: 'FX_IDC:USDRUB', title: 'USD/RUB' },
        { proName: 'FX_IDC:EURRUB', title: 'EUR/RUB' },
      ],
      colorTheme: theme,
      isTransparent: true,
      displayMode: 'adaptive',
    })
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [theme])

  return (
    <div 
      ref={containerRef}
      className="tradingview-widget-container fixed bottom-0 z-[60]"
      style={{ 
        left: sidebarWidth, 
        right: 0,
        height: '36px',
        backgroundColor: theme === 'dark' ? '#0b0f17' : '#ffffff'
      }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: '100%' }} />
    </div>
  )
}

export default RatesBar
