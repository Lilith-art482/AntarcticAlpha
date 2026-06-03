// Token Trade Service for Wallet Analytics
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { TokenTrade, TokenTradeStatus, Network } from '@/types'

const TOKEN_TRADES_COLLECTION = 'tokenTrades'

// Map Firestore document to TokenTrade type
const mapTokenTradeSnapshot = (docSnap: any): TokenTrade => {
  const data = docSnap.data() || {}
  return {
    id: docSnap.id,
    userId: data.userId || '',
    walletId: data.walletId || '',
    walletAddress: data.walletAddress || '',
    tokenSymbol: data.tokenSymbol || '',
    tokenContract: data.tokenContract,
    network: data.network || 'solana',
    entryDate: data.entryDate || '',
    entryPrice: data.entryPrice || 0,
    entryMarketCap: data.entryMarketCap,
    entryAmount: data.entryAmount || 0,
    entryValue: data.entryValue || 0,
    exitDate: data.exitDate,
    exitPrice: data.exitPrice,
    exitAmount: data.exitAmount,
    exitValue: data.exitValue,
    currentPrice: data.currentPrice,
    currentMarketCap: data.currentMarketCap,
    maxPrice: data.maxPrice,
    maxMarketCap: data.maxMarketCap,
    maxProfit: data.maxProfit,
    status: data.status || 'open',
    comment: data.comment,
    screenshots: data.screenshots || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  } as TokenTrade
}

// Get all token trades for a user
export const getTokenTrades = async (userId: string, filters?: {
  walletId?: string
  status?: TokenTradeStatus
  network?: Network
  startDate?: string
  endDate?: string
}): Promise<TokenTrade[]> => {
  const tradesRef = collection(db, TOKEN_TRADES_COLLECTION)
  const q = query(tradesRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  let trades = snapshot.docs.map(mapTokenTradeSnapshot)

  if (filters?.walletId) trades = trades.filter(t => t.walletId === filters.walletId)
  if (filters?.status) trades = trades.filter(t => t.status === filters.status)
  if (filters?.network) trades = trades.filter(t => t.network === filters.network)
  if (filters?.startDate) trades = trades.filter(t => t.entryDate >= filters.startDate!)
  if (filters?.endDate) trades = trades.filter(t => t.entryDate <= filters.endDate!)

  trades.sort((a, b) => b.entryDate.localeCompare(a.entryDate))
  return trades
}

// Get token trades for a specific wallet
export const getWalletTokenTrades = async (walletId: string): Promise<TokenTrade[]> => {
  const tradesRef = collection(db, TOKEN_TRADES_COLLECTION)
  const q = query(tradesRef, where('walletId', '==', walletId))
  const snapshot = await getDocs(q)

  const trades = snapshot.docs.map(mapTokenTradeSnapshot)
  trades.sort((a, b) => b.entryDate.localeCompare(a.entryDate))
  return trades
}

// Get a single token trade by ID
export const getTokenTradeById = async (id: string): Promise<TokenTrade | null> => {
  const tradeRef = doc(db, TOKEN_TRADES_COLLECTION, id)
  const docSnap = await getDoc(tradeRef)
  if (!docSnap.exists()) return null
  return mapTokenTradeSnapshot(docSnap)
}

// Add a new token trade
export const addTokenTrade = async (trade: Omit<TokenTrade, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const tradesRef = collection(db, TOKEN_TRADES_COLLECTION)
  const now = new Date().toISOString()

  const cleanTrade = Object.fromEntries(
    Object.entries({
      ...trade,
      createdAt: now,
      updatedAt: now,
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )

  const result = await addDoc(tradesRef, cleanTrade)
  return result.id
}

// Update a token trade
export const updateTokenTrade = async (id: string, updates: Partial<TokenTrade>): Promise<void> => {
  const tradeRef = doc(db, TOKEN_TRADES_COLLECTION, id)

  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )

  await updateDoc(tradeRef, cleanUpdates)
}

// Delete a token trade
export const deleteTokenTrade = async (id: string): Promise<void> => {
  const tradeRef = doc(db, TOKEN_TRADES_COLLECTION, id)
  await deleteDoc(tradeRef)
}

// Get token trade statistics for a user
export const getTokenTradeStats = async (userId: string, days: number = 7): Promise<{
  totalTrades: number
  openTrades: number
  closedTrades: number
  totalEntryValue: number
  totalExitValue: number
  totalPnl: number
  avgMaxProfit: number
  bestMaxProfit: number
  byNetwork: Record<Network, { trades: number; pnl: number; maxProfits: number[] }>
}> => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateIso = startDate.toISOString()

  const trades = await getTokenTrades(userId, { startDate: startDateIso })

  const openTrades = trades.filter(t => t.status === 'open')
  const closedTrades = trades.filter(t => t.status === 'closed')
  const totalEntryValue = trades.reduce((sum, t) => sum + t.entryValue, 0)
  const totalExitValue = trades.reduce((sum, t) => sum + (t.exitValue || 0), 0)
  const totalPnl = trades.reduce((sum, t) => sum + ((t.exitValue || 0) - t.entryValue), 0)
  
  const maxProfits = trades.map(t => t.maxProfit || 0).filter(p => p > 0)
  const avgMaxProfit = maxProfits.length > 0 
    ? maxProfits.reduce((sum, p) => sum + p, 0) / maxProfits.length 
    : 0
  const bestMaxProfit = maxProfits.length > 0 ? Math.max(...maxProfits) : 0

  const byNetwork: Record<Network, { trades: number; pnl: number; maxProfits: number[] }> = {
    solana: { trades: 0, pnl: 0, maxProfits: [] },
    ethereum: { trades: 0, pnl: 0, maxProfits: [] },
    bsc: { trades: 0, pnl: 0, maxProfits: [] },
    ton: { trades: 0, pnl: 0, maxProfits: [] },
    base: { trades: 0, pnl: 0, maxProfits: [] },
    sui: { trades: 0, pnl: 0, maxProfits: [] },
    monad: { trades: 0, pnl: 0, maxProfits: [] },
    polygon: { trades: 0, pnl: 0, maxProfits: [] },
  }

  for (const trade of trades) {
    const network = trade.network
    byNetwork[network].trades++
    byNetwork[network].pnl += (trade.exitValue || 0) - trade.entryValue
    if (trade.maxProfit && trade.maxProfit > 0) {
      byNetwork[network].maxProfits.push(trade.maxProfit)
    }
  }

  return {
    totalTrades: trades.length,
    openTrades: openTrades.length,
    closedTrades: closedTrades.length,
    totalEntryValue,
    totalExitValue,
    totalPnl,
    avgMaxProfit,
    bestMaxProfit,
    byNetwork,
  }
}