import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { RefreshCw, ArrowLeftRight, Bitcoin } from 'lucide-react'

interface Rates {
  solana: { usd: number; eur: number; rub: number; cny: number; aed: number }
  bitcoin: { usd: number; eur: number; rub: number; cny: number; aed: number }
  ethereum: { usd: number; eur: number; rub: number; cny: number; aed: number }
  binancecoin: { usd: number; eur: number; rub: number; cny: number; aed: number }
  usd: { eur: number; rub: number; cny: number; aed: number }
  eur: { usd: number; rub: number; cny: number; aed: number }
}

// AED fixed rate (1 USD ≈ 3.67 AED)
const AED_RATE = 3.67

const fallbackRates: Rates = {
  solana: { usd: 180, eur: 165, rub: 16200, cny: 1300, aed: 660 },
  bitcoin: { usd: 95000, eur: 87000, rub: 8550000, cny: 690000, aed: 348000 },
  ethereum: { usd: 3200, eur: 2930, rub: 288000, cny: 23200, aed: 11700 },
  binancecoin: { usd: 680, eur: 620, rub: 61000, cny: 4900, aed: 2490 },
  usd: { eur: 0.92, rub: 89.5, cny: 7.2, aed: 3.67 },
  eur: { usd: 1.09, rub: 97.3, cny: 7.8, aed: 3.99 },
}

function useRates() {
  const [rates, setRates] = useState<Rates>(fallbackRates)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        const [btcRes, solRes, ethRes, bnbRes] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT'),
        ])

        const [btcData, solData, ethData, bnbData] = await Promise.all([
          btcRes.json(),
          solRes.json(),
          ethRes.json(),
          bnbRes.json(),
        ])

        let fiatRates = { EUR: 0.92, RUB: 89.5, CNY: 7.2 }
        try {
          const fiatRes = await fetch('https://api.frankfurter.app/latest?from=USD')
          const fiatData = await fiatRes.json()
          if (fiatData.rates) {
            fiatRates = { 
              EUR: fiatData.rates.EUR || 0.92, 
              RUB: fiatData.rates.RUB || 89.5,
              CNY: fiatData.rates.CNY || 7.2
            }
          }
        } catch { /* fallback */ }

        const usdToEur = fiatRates.EUR
        const usdToRub = fiatRates.RUB
        const usdToCny = fiatRates.CNY
        const usdToAed = AED_RATE

        setRates({
          solana: { usd: parseFloat(solData.price), eur: parseFloat(solData.price) * usdToEur, rub: parseFloat(solData.price) * usdToRub, cny: parseFloat(solData.price) * usdToCny, aed: parseFloat(solData.price) * usdToAed },
          bitcoin: { usd: parseFloat(btcData.price), eur: parseFloat(btcData.price) * usdToEur, rub: parseFloat(btcData.price) * usdToRub, cny: parseFloat(btcData.price) * usdToCny, aed: parseFloat(btcData.price) * usdToAed },
          ethereum: { usd: parseFloat(ethData.price), eur: parseFloat(ethData.price) * usdToEur, rub: parseFloat(ethData.price) * usdToRub, cny: parseFloat(ethData.price) * usdToCny, aed: parseFloat(ethData.price) * usdToAed },
          binancecoin: { usd: parseFloat(bnbData.price), eur: parseFloat(bnbData.price) * usdToEur, rub: parseFloat(bnbData.price) * usdToRub, cny: parseFloat(bnbData.price) * usdToCny, aed: parseFloat(bnbData.price) * usdToAed },
          usd: { eur: usdToEur, rub: usdToRub, cny: usdToCny, aed: usdToAed },
          eur: { usd: 1 / usdToEur, rub: usdToRub / usdToEur, cny: usdToCny / usdToEur, aed: usdToAed / usdToEur },
        })
      } catch (err) {
        console.error('RatesBar fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 30000)
    return () => clearInterval(interval)
  }, [])

  return { rates, loading }
}

function formatCurrency(value: number, currency: string): string {
  if (!value || isNaN(value)) return '—'
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: currency === 'RUB' || currency === 'AED' ? 0 : 2,
    maximumFractionDigits: currency === 'RUB' || currency === 'AED' ? 2 : 2,
  }).format(value)
  return currency === 'RUB' ? `${formatted} ₽` : currency === 'USD' ? `$${formatted}` : currency === 'CNY' ? `¥${formatted}` : currency === 'AED' ? `AED ${formatted}` : `€${formatted}`
}

const SolanaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#9945FF" /><stop offset="100%" stopColor="#14F195" /></linearGradient></defs>
    <path d="M4.5 12L10.5 6V9.5L6.5 12L10.5 14.5V18L4.5 12Z" fill="url(#solGrad)"/>
    <path d="M10.5 12L16.5 6V9.5L12.5 12L16.5 14.5V18L10.5 12Z" fill="url(#solGrad)" fillOpacity="0.7"/>
    <path d="M10.5 6L19.5 12L10.5 18V6Z" fill="url(#solGrad)" fillOpacity="0.4"/>
  </svg>
)

const EthereumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#627EEA"/>
  </svg>
)

const BnbIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 8L12 14L20 8L12 2Z" fill="#F3BA2F"/>
    <path d="M4 8L12 14L20 8V16L12 22L4 16V8Z" fill="#F3BA2F" fillOpacity="0.7"/>
  </svg>
)

const RatesBar = () => {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { isCollapsed } = useSidebarStore()
  const { rates, loading } = useRates()
  const [localRates, setLocalRates] = useState<Rates | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const displayRates = localRates || rates

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const [btcRes, solRes, ethRes, bnbRes] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT'),
      ])

      const [btcData, solData, ethData, bnbData] = await Promise.all([
        btcRes.json(),
        solRes.json(),
        ethRes.json(),
        bnbRes.json(),
      ])

      let fiatRates = { EUR: 0.92, RUB: 89.5, CNY: 7.2 }
      try {
        const fiatRes = await fetch('https://api.frankfurter.app/latest?from=USD')
        const fiatData = await fiatRes.json()
        if (fiatData.rates) {
          fiatRates = { EUR: fiatData.rates.EUR, RUB: fiatData.rates.RUB, CNY: fiatData.rates.CNY }
        }
      } catch { /* fallback */ }

      const usdToEur = fiatRates.EUR
      const usdToRub = fiatRates.RUB
      const usdToCny = fiatRates.CNY
      const usdToAed = AED_RATE

      setLocalRates({
        solana: { usd: parseFloat(solData.price), eur: parseFloat(solData.price) * usdToEur, rub: parseFloat(solData.price) * usdToRub, cny: parseFloat(solData.price) * usdToCny, aed: parseFloat(solData.price) * usdToAed },
        bitcoin: { usd: parseFloat(btcData.price), eur: parseFloat(btcData.price) * usdToEur, rub: parseFloat(btcData.price) * usdToRub, cny: parseFloat(btcData.price) * usdToCny, aed: parseFloat(btcData.price) * usdToAed },
        ethereum: { usd: parseFloat(ethData.price), eur: parseFloat(ethData.price) * usdToEur, rub: parseFloat(ethData.price) * usdToRub, cny: parseFloat(ethData.price) * usdToCny, aed: parseFloat(ethData.price) * usdToAed },
        binancecoin: { usd: parseFloat(bnbData.price), eur: parseFloat(bnbData.price) * usdToEur, rub: parseFloat(bnbData.price) * usdToRub, cny: parseFloat(bnbData.price) * usdToCny, aed: parseFloat(bnbData.price) * usdToAed },
        usd: { eur: usdToEur, rub: usdToRub, cny: usdToCny, aed: usdToAed },
        eur: { usd: 1 / usdToEur, rub: usdToRub / usdToEur, cny: usdToCny / usdToEur, aed: usdToAed / usdToEur },
      })
    } catch (err) {
      console.error(err)
    }
    setIsRefreshing(false)
  }

  const sidebarWidth = isCollapsed ? '80px' : '288px'

  const rateItems = [
    { label: 'BTC', icon: Bitcoin, color: 'text-orange-400', values: [{ value: displayRates.bitcoin.usd, currency: 'USD' }, { value: displayRates.bitcoin.rub, currency: 'RUB' }] },
    { label: 'ETH', icon: EthereumIcon, color: 'text-blue-400', values: [{ value: displayRates.ethereum.usd, currency: 'USD' }, { value: displayRates.ethereum.rub, currency: 'RUB' }] },
    { label: 'SOL', icon: SolanaIcon, color: 'text-purple-400', values: [{ value: displayRates.solana.usd, currency: 'USD' }, { value: displayRates.solana.rub, currency: 'RUB' }] },
    { label: 'BNB', icon: BnbIcon, color: 'text-yellow-500', values: [{ value: displayRates.binancecoin.usd, currency: 'USD' }, { value: displayRates.binancecoin.rub, currency: 'RUB' }] },
    { label: 'EUR', icon: ({ className }: any) => <span className={`text-xs font-bold ${className}`}>€</span>, color: 'text-yellow-400', values: [{ value: displayRates.eur.usd, currency: 'USD' }, { value: displayRates.usd.rub, currency: 'RUB' }] },
    { label: 'CNY', icon: ({ className }: any) => <span className={`text-xs font-bold ${className}`}>¥</span>, color: 'text-rose-400', values: [{ value: displayRates.usd.cny, currency: 'CNY' }, { value: displayRates.usd.rub, currency: 'RUB' }] },
    { label: 'RUB', icon: ({ className }: any) => <span className={`text-xs font-bold ${className}`}>₽</span>, color: 'text-red-400', values: [{ value: displayRates.usd.rub, currency: 'RUB' }, { value: 1/displayRates.usd.rub, currency: 'USD' }] },
    { label: 'AED', icon: ({ className }: any) => <span className={`text-xs font-bold ${className}`}>د.إ</span>, color: 'text-teal-400', values: [{ value: displayRates.usd.aed, currency: 'USD' }, { value: displayRates.usd.rub, currency: 'RUB' }] },
  ]

  return (
    <div className={`fixed bottom-0 z-[60] flex items-center ${theme === 'dark' ? 'bg-[#0b0f17]/95 border-t border-white/10' : 'bg-white/95 border-t border-gray-200'} backdrop-blur-md`} style={{ left: sidebarWidth, right: 0, height: '44px' }}>
      <div className="max-w-full mx-auto px-4 h-full flex items-center">
        <div className="flex items-center gap-1 h-full overflow-x-auto no-scrollbar">
          {rateItems.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md shrink-0 transition-all hover:scale-105 cursor-default ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                <span className={`text-xs font-semibold ${item.color} shrink-0`}>{item.label}</span>
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
                  {loading ? <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>...</span> : <>{formatCurrency(item.values[0].value, item.values[0].currency)}<span className="mx-0.5 text-gray-400">/</span>{formatCurrency(item.values[1].value, item.values[1].currency)}</>}
                </span>
              </div>
              {index < rateItems.length - 1 && <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate('/converter')} className={`absolute right-16 p-1.5 rounded-md shrink-0 transition-all ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`} title="Конвертер">
        <ArrowLeftRight className="w-3.5 h-3.5" />
      </button>

      <button onClick={handleRefresh} disabled={isRefreshing || loading} className={`absolute right-3 p-1.5 rounded-md shrink-0 transition-all ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'} ${isRefreshing ? 'animate-spin' : ''}`} title="Обновить">
        <RefreshCw className="w-3 h-3" />
      </button>
    </div>
  )
}

export default RatesBar
