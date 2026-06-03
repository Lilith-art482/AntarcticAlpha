import { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useRatesStore } from '@/store/ratesStore'
import { ArrowLeftRight, RefreshCw, TrendingUp, ChevronDown, Copy, Check, Clock, History } from 'lucide-react'

// Хук, который использует глобальный стор для получения курсов валют
function useRates() {
  const { rates, loading, fetchRates, initialize } = useRatesStore()
  
  useEffect(() => {
    initialize()
  }, [initialize])

  return { rates, loading, refetch: fetchRates }
}

function formatCurrency(value: number, currency: string): string {
  if (!value || isNaN(value)) return '—'
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: currency === 'RUB' || currency === 'AED' || currency === 'BYN' || currency === 'KZT' ? 0 : 2,
    maximumFractionDigits: currency === 'RUB' || currency === 'AED' || currency === 'BYN' || currency === 'KZT' ? 2 : 2,
  }).format(value)
  return currency === 'RUB' ? `${formatted} ₽` : currency === 'USD' ? `$${formatted}` : currency === 'CNY' ? `¥${formatted}` : currency === 'AED' ? `AED ${formatted}` : currency === 'BYN' ? `Br ${formatted}` : currency === 'KZT' ? `₸ ${formatted}` : `€${formatted}`
}

// ====== HIGH-QUALITY CURRENCY ICONS ======

const SolanaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195"/>
        <stop offset="100%" stopColor="#9945FF"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#solGrad)"/>
    <path d="M8.5 16L14.5 10V13.5L10.5 16L14.5 18.5V22L8.5 16Z" fill="white"/>
    <path d="M14.5 16L20.5 10V13.5L16.5 16L20.5 18.5V22L14.5 16Z" fill="white" fillOpacity="0.7"/>
    <path d="M14.5 10L23.5 16L14.5 22V10Z" fill="white" fillOpacity="0.4"/>
  </svg>
)

const EthereumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#627EEA"/>
    <path d="M16 4L6 27.5L7 28.5L16 24.5L25 28.5L26 27.5L16 4Z" fill="white"/>
    <path d="M16 14.5L6 27.5L16 23.5L26 27.5L16 14.5Z" fill="white" fillOpacity="0.6"/>
  </svg>
)

const BnbIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#F3BA2F"/>
    <path d="M16 6L5 14L16 22L27 14L16 6Z" fill="white"/>
    <path d="M5 14L16 22L27 14V25L16 31L5 25V14Z" fill="white" fillOpacity="0.6"/>
  </svg>
)

const BitcoinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#F7931A"/>
    <path d="M22.5 14.5C22.5 11.5 19.5 10.5 17 10V6H15V10C14.5 10 14 10 13.5 10V6H11.5V10H7V12H8.5C9 12 9.5 12.5 9.5 13V19C9.5 19.5 9 20 8.5 20H7V22H11.5V26H13.5V22C14 22 14.5 22 15 22V26H17V22C21 21.5 22.5 19.5 22.5 14.5ZM11.5 12H15C17 12 18.5 12.5 18.5 14.5C18.5 16.5 17 17 15 17H11.5V12ZM15.5 20H11.5V19H15.5C17.5 19 19 18.5 19 16.5C19 14.5 17.5 14 15.5 14V20Z" fill="white"/>
  </svg>
)

const TonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#0098EA"/>
    <path d="M8 8L16 16L8 24V8Z" fill="white" fillOpacity="0.9"/>
    <path d="M16 16L24 8V24L16 16Z" fill="white" fillOpacity="0.7"/>
    <circle cx="16" cy="16" r="4" fill="white"/>
  </svg>
)

const UsdIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="usdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#85BB65"/>
        <stop offset="100%" stopColor="#5FA03F"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#usdGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
  </svg>
)

const EurIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="eurGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4E6E49"/>
        <stop offset="100%" stopColor="#3A5236"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#eurGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">€</text>
  </svg>
)

const RubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#62AC5F"/>
        <stop offset="100%" stopColor="#4A8A47"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#rubGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">₽</text>
  </svg>
)

const CnyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cnyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E63946"/>
        <stop offset="100%" stopColor="#C92A37"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#cnyGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">¥</text>
  </svg>
)

const AedIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4"/>
        <stop offset="100%" stopColor="#0891B2"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#aedGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">د.إ</text>
  </svg>
)

const BynIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bynGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E63946"/>
        <stop offset="100%" stopColor="#D62839"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#bynGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Br</text>
  </svg>
)

const KztIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kztGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00B4D8"/>
        <stop offset="100%" stopColor="#0096B4"/>
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#kztGrad)"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">₸</text>
  </svg>
)

type CurrencyType = 'SOL' | 'BTC' | 'ETH' | 'BNB' | 'TON' | 'USD' | 'EUR' | 'RUB' | 'CNY' | 'AED' | 'BYN' | 'KZT'

const currencies: { id: CurrencyType; label: string; icon: React.ReactNode; color: string; category: 'crypto' | 'fiat' }[] = [
  // Crypto
  { id: 'SOL', label: 'SOL', icon: <SolanaIcon className="w-5 h-5" />, color: 'text-purple-400', category: 'crypto' },
  { id: 'BTC', label: 'BTC', icon: <BitcoinIcon className="w-5 h-5" />, color: 'text-orange-400', category: 'crypto' },
  { id: 'ETH', label: 'ETH', icon: <EthereumIcon className="w-5 h-5" />, color: 'text-blue-400', category: 'crypto' },
  { id: 'BNB', label: 'BNB', icon: <BnbIcon className="w-5 h-5" />, color: 'text-yellow-500', category: 'crypto' },
  { id: 'TON', label: 'TON', icon: <TonIcon className="w-5 h-5" />, color: 'text-sky-400', category: 'crypto' },
  // Fiat
  { id: 'USD', label: 'USD', icon: <UsdIcon className="w-5 h-5" />, color: 'text-green-400', category: 'fiat' },
  { id: 'EUR', label: 'EUR', icon: <EurIcon className="w-5 h-5" />, color: 'text-[#4E6E49]', category: 'fiat' },
  { id: 'RUB', label: 'RUB', icon: <RubIcon className="w-5 h-5" />, color: 'text-[#62AC5F]', category: 'fiat' },
  { id: 'CNY', label: 'CNY', icon: <CnyIcon className="w-5 h-5" />, color: 'text-rose-400', category: 'fiat' },
  { id: 'AED', label: 'AED', icon: <AedIcon className="w-5 h-5" />, color: 'text-cyan-400', category: 'fiat' },
  { id: 'BYN', label: 'BYN', icon: <BynIcon className="w-5 h-5" />, color: 'text-red-400', category: 'fiat' },
  { id: 'KZT', label: 'KZT', icon: <KztIcon className="w-5 h-5" />, color: 'text-sky-400', category: 'fiat' },
]

function CurrencySelect({ value, onChange, theme }: { value: CurrencyType; onChange: (v: CurrencyType) => void; theme: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = currencies.find(c => c.id === value)

  useEffect(() => {
    const h = (e: MouseEvent) => { 
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false) 
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

 const bg = theme === 'dark' ? 'bg-gray-900' : 'bg-white'
 const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
 const txt = theme === 'dark' ? 'text-white' : 'text-gray-900'
 const subTxt = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

 const cryptoCurrencies = currencies.filter(c => c.category === 'crypto')
 const fiatCurrencies = currencies.filter(c => c.category === 'fiat')

 const dropdownBg = theme === 'dark' ? 'bg-[#0b0f17] border-gray-700' : 'bg-white border-gray-300'

 return (
<div ref={ref} className="relative inline-block">
<button type="button" onClick={() => setIsOpen(!isOpen)}
 className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold border text-sm transition-all hover:scale-[1.02] active:scale-95 ${bg} ${border} ${txt} ${isOpen ? 'ring-2 ring-[#4E6E49] shadow-lg shadow-[#4E6E49]/10' : ''}`}>
<span className="p-0.5 rounded-md bg-white/40">{selected?.icon}</span>
<span>{value}</span>
<ChevronDown className={`w-3.5 h-3.5 ${isOpen ? 'rotate-180' : ''} transition-transform`} />
</button>
 {isOpen && (
<div className={`absolute z-[100] mt-2 rounded-xl border shadow-2xl min-w-[140px] max-h-[320px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200 ${dropdownBg}`}>
{/* Crypto Section */}
<div className="p-1.5">
<div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${subTxt}`}>Crypto</div>
{cryptoCurrencies.map(c => (
<button key={c.id} type="button" onClick={() => { onChange(c.id); setIsOpen(false) }}
 className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all ${value === c.id ? 'bg-[#4E6E49] text-white font-semibold' : theme === 'dark' ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}>
<span className="p-0.5 rounded-md bg-white/20">{c.icon}</span>
<span className="font-bold">{c.label}</span>
 {value === c.id &&<Check className="w-3.5 h-3.5 ml-auto" />}
</button>
 ))}
</div>
          
 {/* Fiat Section */}
<div className="p-1.5 border-t border-dashed border-gray-300 dark:border-gray-700">
            <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${subTxt}`}>Fiat</div>
{fiatCurrencies.map(c => (
<button key={c.id} type="button" onClick={() => { onChange(c.id); setIsOpen(false) }}
 className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all ${value === c.id ? 'bg-[#4E6E49] text-white font-semibold' : theme === 'dark' ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}>
<span className="p-0.5 rounded-md bg-white/20">{c.icon}</span>
<span className="font-bold">{c.label}</span>
 {value === c.id &&<Check className="w-3.5 h-3.5 ml-auto" />}
</button>
 ))}
          </div>
        </div>
      )}
    </div>
  )
}

type HistoryItem = { from: CurrencyType; to: CurrencyType; amount: string; result: string; timestamp: number }

const Converter = () => {
  const { theme } = useThemeStore()
  const { rates, loading, refetch } = useRates()
  const [fromCurrency, setFromCurrency] = useState<CurrencyType>('SOL')
  const [toCurrency, setToCurrency] = useState<CurrencyType>('USD')
  const [amount, setAmount] = useState<string>('1')
  const [copied, setCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const glassCard = theme === 'dark' ? 'bg-[#151a21] border-white/20' : 'bg-white border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
  const resultBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'

  // Save conversion to history
  const saveToHistory = (from: CurrencyType, to: CurrencyType, amt: string, res: string) => {
    if (!amt || parseFloat(amt.replace(',', '.')) === 0) return
    const newItem: HistoryItem = { from, to, amount: amt, result: res, timestamp: Date.now() }
    setHistory(prev => [newItem, ...prev.slice(0, 9)]) // Keep last 10 items
  }

  // Copy result to clipboard
  const copyResult = async () => {
    const displayCurrency = getDisplayCurrency()
    const sym = toCurrency === 'USD' ? '$' : toCurrency === 'EUR' ? '€' : toCurrency === 'RUB' ? '₽' : toCurrency === 'CNY' ? '¥' : toCurrency === 'AED' ? 'AED ' : toCurrency === 'BYN' ? 'Br ' : toCurrency === 'KZT' ? '₸ ' : ''
    const text = `${sym}${formatCurrency(result, displayCurrency).replace(/[$€₽¥AED]/g, '').trim()} ${toCurrency}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const convert = (): number => {
    const n = parseFloat(amount.replace(',', '.')) || 0
    if (n === 0) return 0
    let usd = 0
    switch (fromCurrency) {
      case 'SOL': usd = n * rates.solana.usd; break
      case 'BTC': usd = n * rates.bitcoin.usd; break
      case 'ETH': usd = n * rates.ethereum.usd; break
      case 'BNB': usd = n * rates.binancecoin.usd; break
      case 'TON': usd = n * rates.toncoin.usd; break
      case 'USD': usd = n; break
      case 'EUR': usd = n * rates.eur.usd; break
      case 'RUB': usd = n * rates.rub.usd; break
      case 'CNY': usd = n * rates.cny.usd; break
      case 'AED': usd = n * rates.aed.usd; break
      case 'BYN': usd = n * rates.byn.usd; break
      case 'KZT': usd = n * rates.kzt.usd; break
    }
    let res = 0
    switch (toCurrency) {
      case 'SOL': res = usd / rates.solana.usd; break
      case 'BTC': res = usd / rates.bitcoin.usd; break
      case 'ETH': res = usd / rates.ethereum.usd; break
      case 'BNB': res = usd / rates.binancecoin.usd; break
      case 'TON': res = usd / rates.toncoin.usd; break
      case 'USD': res = usd; break
      case 'EUR': res = usd * rates.usd.eur; break
      case 'RUB': res = usd * rates.usd.rub; break
      case 'CNY': res = usd * rates.usd.cny; break
      case 'AED': res = usd * rates.usd.aed; break
      case 'BYN': res = usd * rates.usd.byn; break
      case 'KZT': res = usd * rates.usd.kzt; break
    }
    return res
  }

  const result = convert()
  const fromCurr = currencies.find(c => c.id === fromCurrency)
  const toCurr = currencies.find(c => c.id === toCurrency)

  const swap = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency) }
  const sym = (c: CurrencyType) => c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'RUB' ? '₽' : c === 'CNY' ? '¥' : c === 'AED' ? 'AED ' : c === 'BYN' ? 'Br ' : c === 'KZT' ? '₸ ' : ''

  const getDisplayCurrency = () => {
    if (toCurrency === 'USD' || toCurrency === 'EUR' || toCurrency === 'RUB' || toCurrency === 'CNY' || toCurrency === 'AED' || toCurrency === 'BYN' || toCurrency === 'KZT') return toCurrency
    return 'USD'
  }

  // Save to history when result changes
  useEffect(() => {
    if (result > 0 && amount && parseFloat(amount.replace(',', '.')) > 0) {
      const displayCurrency = getDisplayCurrency()
      const s = toCurrency === 'USD' ? '$' : toCurrency === 'EUR' ? '€' : toCurrency === 'RUB' ? '₽' : toCurrency === 'CNY' ? '¥' : toCurrency === 'AED' ? 'AED ' : toCurrency === 'BYN' ? 'Br ' : toCurrency === 'KZT' ? '₸ ' : ''
      const formattedResult = `${s}${formatCurrency(result, displayCurrency).replace(/[$€₽¥AED]/g, '').trim()}`
      saveToHistory(fromCurrency, toCurrency, amount, formattedResult)
    }
  }, [fromCurrency, toCurrency, amount])

  return (
    <div className="relative">
      <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center relative">
        <div className="max-w-[1100px] mx-auto w-full animate-fade-in pb-6 font-sans overflow-visible relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4E6E49]/20 to-[#4E6E49]/5 border border-[#4E6E49]/20 shadow-lg shadow-[#4E6E49]/10">
            <ArrowLeftRight className="w-6 h-6 text-[#4E6E49]" />
          </div>
          <div>
            <h1 className={`text-2xl font-black ${headingColor} tracking-tight`}>CONVERTER</h1>
            <p className={`text-xs ${subTextColor} font-medium`}>Crypto & fiat exchange</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHistory(!showHistory)} 
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button onClick={() => refetch()} 
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '...' : 'Update'}
          </button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <div className={`rounded-2xl p-4 border mb-6 ${theme === 'dark' ? 'bg-[#151a21] border-white/20' : 'bg-gray-100 border-gray-200'} animate-fade-in`}>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-[#4E6E49]" />
            <span className={`text-xs font-bold ${subTextColor} uppercase tracking-wider`}>Recent conversions</span>
          </div>
          <div className="space-y-2">
            {history.slice(0, 5).map((item, idx) => (
              <button key={idx} onClick={() => { setFromCurrency(item.from); setToCurrency(item.to); setAmount(item.amount); setShowHistory(false) }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${headingColor}`}>{item.amount} {item.from}</span>
                  <ArrowLeftRight className="w-3 h-3 text-gray-400" />
                  <span className={`font-bold text-[#4E6E49]`}>{item.result} {item.to}</span>
                </div>
                <span className={`text-[10px] ${subTextColor}`}>{new Date(item.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Three Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Left Column - Crypto Rates */}
        <div className="order-2 lg:order-1 w-full lg:w-[170px] shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className={`text-sm font-bold ${subTextColor} uppercase tracking-wider`}>Crypto</h2>
          </div>
          <div className="space-y-3">
            {[
              { id: 'SOL', rates: rates.solana, gradient: 'from-purple-500/10 to-purple-500/5', color: 'text-purple-400', icon: <SolanaIcon className="w-5 h-5" /> },
              { id: 'BTC', rates: rates.bitcoin, gradient: 'from-orange-500/10 to-orange-500/5', color: 'text-orange-400', icon: <BitcoinIcon className="w-5 h-5" /> },
              { id: 'ETH', rates: rates.ethereum, gradient: 'from-blue-500/10 to-blue-500/5', color: 'text-blue-400', icon: <EthereumIcon className="w-5 h-5" /> },
              { id: 'BNB', rates: rates.binancecoin, gradient: 'from-yellow-500/10 to-yellow-500/5', color: 'text-yellow-500', icon: <BnbIcon className="w-5 h-5" /> },
              { id: 'TON', rates: rates.toncoin, gradient: 'from-sky-500/10 to-sky-500/5', color: 'text-sky-400', icon: <TonIcon className="w-5 h-5" /> },
            ].map(c => (
              <div key={c.id} 
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark' ? `bg-gradient-to-br ${c.gradient} border-white/10 hover:border-[#4E6E49]/40` : `bg-gradient-to-br ${c.gradient} border-gray-200 hover:border-[#4E6E49]/30`}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative p-3">
                  <div className="flex flex-col items-center text-center mb-2">
                    <div className={`p-2 rounded-xl bg-white/10 mb-2`}>
                      {c.icon}
                    </div>
                    <span className={`text-base font-bold ${c.color}`}>{c.id}</span>
                  </div>
                  <div className={`text-xs ${subTextColor} space-y-0.5 text-center`}>
                    {loading ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-gray-900 dark:text-white">${formatCurrency(c.rates.usd, 'USD').replace('$', '')}</div>
                        <div className="opacity-60">{formatCurrency(c.rates.rub, 'RUB').replace(' ₽', '')} ₽</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column - Converter */}
        <div className="order-1 lg:order-2 flex-1">
          <div className={`rounded-2xl p-6 border relative overflow-visible group shadow-xl ${glassCard}`}>
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4E6E49]/20 to-[#4E6E49]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />
            
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#4E6E49]/0 via-[#4E6E49]/10 to-[#4E6E49]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 space-y-3">
              {/* From */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <input type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} placeholder="0.00"
                      className={`w-full px-5 py-4 rounded-2xl text-xl font-bold border focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all shadow-sm ${inputBg} ${theme === 'dark' ? 'dark:text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`} />
                  </div>
                  <CurrencySelect value={fromCurrency} onChange={setFromCurrency} theme={theme} />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-3 relative z-20">
                <button onClick={swap} 
                  className={`p-3 rounded-full border-2 transition-all hover:scale-110 active:scale-95 shadow-lg ${theme === 'dark' ? 'bg-[#4E6E49] border-[#4E6E49] text-white hover:bg-[#5a8054] hover:shadow-[#4E6E49]/30' : 'bg-[#4E6E49] border-[#4E6E49] text-white hover:bg-[#5a8054] hover:shadow-[#4E6E49]/30'}`}>
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>

              {/* To */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0 relative">
                    <div className={`w-full px-5 py-4 rounded-2xl text-xl font-bold border truncate transition-all shadow-sm ${resultBg} ${theme === 'dark' ? 'dark:text-white' : 'text-gray-900'}`}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-[#4E6E49] rounded-full animate-spin" />
                          <span className="text-gray-400 text-base">Loading...</span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span className="text-[#4E6E49] text-2xl">{sym(toCurrency)}</span>
                          <span className="animate-in fade-in slide-in-from-left-1 duration-300">{formatCurrency(result, getDisplayCurrency()).replace(/[$€₽¥AED]/g, '').trim()}</span>
                        </span>
                      )}
                    </div>
                    <button onClick={copyResult} 
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all hover:scale-110 ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`} 
                      title="Copy result">
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <CurrencySelect value={toCurrency} onChange={setToCurrency} theme={theme} />
                </div>
              </div>

              {/* Exchange Rate Info */}
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                {fromCurr && toCurr && !loading && (
                  <div className="flex items-center justify-between gap-2 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#4E6E49]/10">
                        <TrendingUp className="w-4 h-4 text-[#4E6E49]" />
                      </div>
                      <span className={`text-xs font-medium ${subTextColor}`}>1 {fromCurr.label} =</span>
                    </div>
                    <span className="font-bold text-[#4E6E49] text-sm truncate">{formatCurrency(convert() / (parseFloat(amount.replace(',', '.')) || 1), getDisplayCurrency())} {toCurr.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Fiat Rates */}
        <div className="order-3 lg:order-3 w-full lg:w-[170px] shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-green-500/10">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className={`text-sm font-bold ${subTextColor} uppercase tracking-wider`}>Fiat</h2>
          </div>
          <div className="space-y-3">
            {[
              { id: 'USD', usdVal: 1, rubVal: rates.usd.rub, gradient: 'from-green-500/10 to-green-500/5', color: 'text-green-400', icon: <UsdIcon className="w-5 h-5" /> },
              { id: 'EUR', usdVal: rates.eur.usd, rubVal: rates.eur.rub, gradient: 'from-emerald-500/10 to-emerald-500/5', color: 'text-[#4E6E49]', icon: <EurIcon className="w-5 h-5" /> },
              { id: 'CNY', usdVal: rates.cny.usd, rubVal: rates.cny.rub, gradient: 'from-rose-500/10 to-rose-500/5', color: 'text-rose-400', icon: <CnyIcon className="w-5 h-5" /> },
              { id: 'AED', usdVal: rates.aed.usd, rubVal: rates.aed.rub, gradient: 'from-cyan-500/10 to-cyan-500/5', color: 'text-cyan-400', icon: <AedIcon className="w-5 h-5" /> },
              { id: 'BYN', usdVal: rates.byn.usd, rubVal: rates.byn.rub, gradient: 'from-red-500/10 to-red-500/5', color: 'text-red-400', icon: <BynIcon className="w-5 h-5" /> },
            ].map(c => (
              <div key={c.id} 
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${theme === 'dark' ? `bg-gradient-to-br ${c.gradient} border-white/10 hover:border-[#4E6E49]/40` : `bg-gradient-to-br ${c.gradient} border-gray-200 hover:border-[#4E6E49]/30`}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative p-3">
                  <div className="flex flex-col items-center text-center mb-2">
                    <div className={`p-2 rounded-xl bg-white/10 mb-2`}>
                      {c.icon}
                    </div>
                    <span className={`text-base font-bold ${c.color}`}>{c.id}</span>
                  </div>
                  <div className={`text-xs ${subTextColor} space-y-0.5 text-center`}>
                    {loading ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-gray-900 dark:text-white">${c.usdVal.toFixed(2)}</div>
                        <div className="opacity-60">{c.rubVal.toFixed(2)} ₽</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}

export default Converter
