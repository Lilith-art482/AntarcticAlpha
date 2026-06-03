/**
 * Сервис для отслеживания цен и капитализации токенов
 * Использует DexScreener API для получения данных в реальном времени
 */

interface TokenPriceData {
  priceUsd: number
  marketCap: number
  liquidity: number
  volume24h: number
  priceChange24h: number
  tokenSymbol?: string // Символ базового токена (например, "TOKEN")
  tokenPair?: string // Пара токенов в формате "BASE/QUOTE" (например, "TOKEN/SOL")
  pairAddress?: string // Адрес пары (например, "7XcjGyxEozQkcZZ4LPYbybFsHppQiGr6BRMQKUMuavJA")
}

/**
 * Получает текущие данные токена через DexScreener API
 * @param contractAddress - адрес контракта токена
 * @returns данные токена или null если токен не найден
 */
export async function fetchTokenPriceData(contractAddress: string): Promise<TokenPriceData | null> {
  if (!contractAddress || contractAddress.length < 10) return null

  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`)
    if (!response.ok) return null

    const data = await response.json()
    if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) return null

    const firstPair = data.pairs[0]
    const baseSymbol = firstPair.baseToken?.symbol
    const quoteSymbol = firstPair.quoteToken?.symbol

    return {
      priceUsd: firstPair.priceUsd ? parseFloat(firstPair.priceUsd) : 0,
      marketCap: firstPair.fdv || firstPair.marketCap || 0,
      liquidity: firstPair.liquidity?.usd || 0,
      volume24h: firstPair.volume?.h24 || 0,
      priceChange24h: firstPair.priceChange?.h24 || 0,
      tokenSymbol: baseSymbol || quoteSymbol || undefined,
      tokenPair: (baseSymbol && quoteSymbol) ? `${baseSymbol}/${quoteSymbol}` : undefined,
      pairAddress: firstPair.pairAddress || undefined,
    }
  } catch (error) {
    console.error('Error fetching token price data:', error)
    return null
  }
}

/**
 * Рассчитывает профит по капитализации
 * @param currentMarketCap - текущая капитализация
 * @param signalMarketCap - капитализация при сигнале
 * @returns профит в процентах
 */
export function calculateProfitByMarketCap(currentMarketCap: number, signalMarketCap: number): number {
  if (!signalMarketCap || signalMarketCap === 0) return 0
  if (!currentMarketCap || currentMarketCap === 0) return 0

  return ((currentMarketCap - signalMarketCap) / signalMarketCap) * 100
}

/**
 * Рассчитывает профит по цене
 * @param currentPrice - текущая цена
 * @param entryPrice - цена входа
 * @returns профит в процентах
 */
export function calculateProfitByPrice(currentPrice: number, entryPrice: number): number {
  if (!entryPrice || entryPrice === 0) return 0
  if (!currentPrice || currentPrice === 0) return 0

  return ((currentPrice - entryPrice) / entryPrice) * 100
}

/**
 * Обновляет максимальный профит
 * @param currentProfit - текущий профит
 * @param maxProfit - текущий максимальный профит
 * @returns новый максимальный профит
 */
export function updateMaxProfit(currentProfit: number, maxProfit?: number): number {
  if (maxProfit === undefined) return currentProfit
  return Math.max(currentProfit, maxProfit)
}
