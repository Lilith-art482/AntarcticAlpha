import { create } from 'zustand'

interface Rates {
  solana: { usd: number; eur: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  bitcoin: { usd: number; eur: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  ethereum: { usd: number; eur: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  binancecoin: { usd: number; eur: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  toncoin: { usd: number; eur: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  usd: { eur: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  eur: { usd: number; rub: number; cny: number; aed: number; byn: number; kzt: number }
  rub: { usd: number; eur: number; cny: number; aed: number; byn: number; kzt: number }
  cny: { usd: number; eur: number; rub: number; aed: number; byn: number; kzt: number }
  aed: { usd: number; eur: number; rub: number; cny: number; byn: number; kzt: number }
  byn: { usd: number; eur: number; rub: number; cny: number; aed: number; kzt: number }
  kzt: { usd: number; eur: number; rub: number; cny: number; aed: number; byn: number }
}

const fallbackRates: Rates = {
  solana: { usd: 180, eur: 165, rub: 16200, cny: 1300, aed: 660, byn: 588, kzt: 81000 },
  bitcoin: { usd: 95000, eur: 87000, rub: 8550000, cny: 690000, aed: 348000, byn: 310000, kzt: 42750000 },
  ethereum: { usd: 3200, eur: 2930, rub: 288000, cny: 23200, aed: 11700, byn: 10400, kzt: 1440000 },
  binancecoin: { usd: 680, eur: 620, rub: 61000, cny: 4900, aed: 2490, byn: 2220, kzt: 306000 },
  toncoin: { usd: 5.2, eur: 4.8, rub: 460, cny: 37, aed: 19, byn: 17, kzt: 2340 },
  usd: { eur: 0.92, rub: 89.5, cny: 7.2, aed: 3.67, byn: 3.27, kzt: 450 },
  eur: { usd: 1.09, rub: 97.3, cny: 7.8, aed: 3.99, byn: 3.55, kzt: 489 },
  rub: { usd: 0.011, eur: 0.010, cny: 0.08, aed: 0.04, byn: 0.036, kzt: 5.03 },
  cny: { usd: 0.14, eur: 0.128, rub: 12.4, aed: 0.51, byn: 0.45, kzt: 62.5 },
  aed: { usd: 0.27, eur: 0.25, rub: 24.4, cny: 1.96, byn: 0.88, kzt: 122 },
  byn: { usd: 0.31, eur: 0.28, rub: 27.4, cny: 2.2, aed: 1.13, kzt: 137.5 },
  kzt: { usd: 0.0022, eur: 0.002, rub: 0.2, cny: 0.016, aed: 0.008, byn: 0.0073 },
}

interface RatesStore {
  rates: Rates
  loading: boolean
  lastUpdated: number
  fetchRates: () => Promise<void>
  initialize: () => Promise<void>
}

export const useRatesStore = create<RatesStore>((set, get) => ({
  rates: fallbackRates,
  loading: true,
  lastUpdated: 0,

  fetchRates: async () => {
    try {
      const [btcRes, solRes, ethRes, bnbRes, tonRes] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT'),
      ])

      const [btcData, solData, ethData, bnbData, tonData] = await Promise.all([
        btcRes.json(),
        solRes.json(),
        ethRes.json(),
        bnbRes.json(),
        tonRes.json(),
      ])

      // Все фиатные курсы берём из ЦБ РФ (один источник)
      // Курсы даны относительно RUB (сколько RUB за 1 единицу валюты)
      
      const fallbackFiat = {
        usdToRub: 89.5,
        eurToRub: 97.3,
        cnyToRub: 12.4,
        bynToRub: 27.4,
        kztToRub: 0.2,
        aedToRub: 24.4,
      }
      
      let fiat = { ...fallbackFiat }
      
      try {
        const cbrRes = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        const cbrData = await cbrRes.json()
        if (cbrData.Valute) {
          const v = cbrData.Valute
          fiat = {
            usdToRub: v.USD?.Value || fallbackFiat.usdToRub,
            eurToRub: v.EUR?.Value || fallbackFiat.eurToRub,
            cnyToRub: v.CNY?.Value || fallbackFiat.cnyToRub,
            bynToRub: v.BYN?.Value || fallbackFiat.bynToRub,
            kztToRub: (v.KZT?.Value || 15.69) / 100,
            aedToRub: v.AED?.Value || fallbackFiat.aedToRub,
          }
        }
      } catch { /* fallback */ }

      // Вычисляем кросс-курсы относительно USD
      const usdToRub = fiat.usdToRub
      const usdToEur = usdToRub / fiat.eurToRub
      const usdToCny = usdToRub / fiat.cnyToRub
      const usdToByn = usdToRub / fiat.bynToRub
      const usdToKzt = usdToRub / fiat.kztToRub
      const usdToAed = usdToRub / fiat.aedToRub
      
      // Курсы относительно EUR
      const eurToRub = fiat.eurToRub
      const eurToUsd = fiat.eurToRub / usdToRub
      const eurToCny = fiat.eurToRub / fiat.cnyToRub
      const eurToByn = fiat.eurToRub / fiat.bynToRub
      const eurToKzt = fiat.eurToRub / fiat.kztToRub
      const eurToAed = fiat.eurToRub / fiat.aedToRub

      const newRates: Rates = {
        solana: { usd: parseFloat(solData.price), eur: parseFloat(solData.price) * usdToEur, rub: parseFloat(solData.price) * usdToRub, cny: parseFloat(solData.price) * usdToCny, aed: parseFloat(solData.price) * usdToAed, byn: parseFloat(solData.price) * usdToByn, kzt: parseFloat(solData.price) * usdToKzt },
        bitcoin: { usd: parseFloat(btcData.price), eur: parseFloat(btcData.price) * usdToEur, rub: parseFloat(btcData.price) * usdToRub, cny: parseFloat(btcData.price) * usdToCny, aed: parseFloat(btcData.price) * usdToAed, byn: parseFloat(btcData.price) * usdToByn, kzt: parseFloat(btcData.price) * usdToKzt },
        ethereum: { usd: parseFloat(ethData.price), eur: parseFloat(ethData.price) * usdToEur, rub: parseFloat(ethData.price) * usdToRub, cny: parseFloat(ethData.price) * usdToCny, aed: parseFloat(ethData.price) * usdToAed, byn: parseFloat(ethData.price) * usdToByn, kzt: parseFloat(ethData.price) * usdToKzt },
        binancecoin: { usd: parseFloat(bnbData.price), eur: parseFloat(bnbData.price) * usdToEur, rub: parseFloat(bnbData.price) * usdToRub, cny: parseFloat(bnbData.price) * usdToCny, aed: parseFloat(bnbData.price) * usdToAed, byn: parseFloat(bnbData.price) * usdToByn, kzt: parseFloat(bnbData.price) * usdToKzt },
        toncoin: { usd: parseFloat(tonData.price), eur: parseFloat(tonData.price) * usdToEur, rub: parseFloat(tonData.price) * usdToRub, cny: parseFloat(tonData.price) * usdToCny, aed: parseFloat(tonData.price) * usdToAed, byn: parseFloat(tonData.price) * usdToByn, kzt: parseFloat(tonData.price) * usdToKzt },
        usd: { eur: usdToEur, rub: usdToRub, cny: usdToCny, aed: usdToAed, byn: usdToByn, kzt: usdToKzt },
        eur: { usd: eurToUsd, rub: eurToRub, cny: eurToCny, aed: eurToAed, byn: eurToByn, kzt: eurToKzt },
        rub: { usd: 1 / usdToRub, eur: 1 / eurToRub, cny: usdToCny / usdToRub, aed: usdToAed / usdToRub, byn: usdToByn / usdToRub, kzt: usdToKzt / usdToRub },
        cny: { usd: 1 / usdToCny, eur: usdToEur / usdToCny, rub: usdToRub / usdToCny, aed: usdToAed / usdToCny, byn: usdToByn / usdToCny, kzt: usdToKzt / usdToCny },
        aed: { usd: 1 / usdToAed, eur: usdToEur / usdToAed, rub: usdToRub / usdToAed, cny: usdToCny / usdToAed, byn: usdToByn / usdToAed, kzt: usdToKzt / usdToAed },
        byn: { usd: 1 / usdToByn, eur: usdToEur / usdToByn, rub: usdToRub / usdToByn, cny: usdToCny / usdToByn, aed: usdToAed / usdToByn, kzt: usdToKzt / usdToByn },
        kzt: { usd: 1 / usdToKzt, eur: usdToEur / usdToKzt, rub: usdToRub / usdToKzt, cny: usdToCny / usdToKzt, aed: usdToAed / usdToKzt, byn: usdToByn / usdToKzt },
      }

      set({ rates: newRates, loading: false, lastUpdated: Date.now() })
      localStorage.setItem('cachedRates', JSON.stringify(newRates))
    } catch (err) {
      console.error('Rates fetch error:', err)
      const cached = localStorage.getItem('cachedRates')
      if (cached) {
        try {
          set({ rates: JSON.parse(cached), loading: false })
        } catch {}
      } else {
        set({ loading: false })
      }
    }
  },

  initialize: async () => {
    // Загружаем из кэша сразу
    const cached = localStorage.getItem('cachedRates')
    if (cached) {
      try {
        set({ rates: JSON.parse(cached) })
      } catch {}
    }
    
    // Запускаем fetch
    await get().fetchRates()
    
    // Запускаем интервал
    setInterval(() => get().fetchRates(), 30000)
  },
}))
