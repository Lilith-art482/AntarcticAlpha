import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const WALLET_BALANCE_HISTORY_COLLECTION = 'walletBalanceHistory'

export interface WalletBalancePoint {
  sol: number
  usd: number
  timestamp: number
}

export interface WalletBalancePointWithId extends WalletBalancePoint {
  id: string
}

// Save wallet balance to history
export const saveWalletBalance = async (
  userId: string,
  walletId: string,
  balance: WalletBalancePoint
): Promise<void> => {
  try {
    const historyRef = collection(db, WALLET_BALANCE_HISTORY_COLLECTION)
    const now = new Date().toISOString()
    
    // Always add a new record to track balance changes over time
    await addDoc(historyRef, {
      userId,
      walletId,
      sol: balance.sol,
      usd: balance.usd,
      timestamp: balance.timestamp,
      createdAt: now,
    })
  } catch (error) {
    console.error('Error saving wallet balance:', error)
    throw error
  }
}

// Get ALL wallet balance history for the last N days (every record)
export const getWalletBalanceHistory = async (
  _userId: string,
  walletId: string,
  days: number = 7
): Promise<WalletBalancePointWithId[]> => {
  try {
    const historyRef = collection(db, WALLET_BALANCE_HISTORY_COLLECTION)
    // Simple query - filter by walletId only
    const q = query(
      historyRef,
      where('walletId', '==', walletId)
    )
    
    const snapshot = await getDocs(q)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0) // Start of day in UTC
    const startTimestamp = startDate.getTime()
    
    // Get all points and sort by timestamp
    const results = snapshot.docs
      .map((docSnap: any) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          sol: data.sol || 0,
          usd: data.usd || 0,
          timestamp: data.timestamp || 0,
        }
      })
      .filter(point => point.timestamp >= startTimestamp)
      .sort((a, b) => a.timestamp - b.timestamp)
    
    return results
  } catch (error) {
    console.error('Error getting wallet balance history:', error)
    return []
  }
}

// Get end-of-day balances for the last N days
export const getDailyBalances = async (
  _userId: string,
  walletId: string,
  days: number = 7
): Promise<WalletBalancePointWithId[]> => {
  try {
    const historyRef = collection(db, WALLET_BALANCE_HISTORY_COLLECTION)
    const q = query(historyRef, where('walletId', '==', walletId))
    
    const snapshot = await getDocs(q)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)
    const startTimestamp = startDate.getTime()
    
    // Get all points
    const allPoints = snapshot.docs
      .map((docSnap: any) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          sol: data.sol || 0,
          usd: data.usd || 0,
          timestamp: data.timestamp || 0,
        }
      })
      .filter(point => point.timestamp >= startTimestamp)
      .sort((a, b) => a.timestamp - b.timestamp)
    
    // Group by day and get last value for each day
    const byDay: Record<string, WalletBalancePointWithId> = {}
    
    for (const point of allPoints) {
      const date = new Date(point.timestamp)
      const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
      byDay[dayKey] = point
    }
    
    // Convert to array
    const results = Object.values(byDay)
      .sort((a, b) => a.timestamp - b.timestamp)
    
    return results.slice(-days)
  } catch (error) {
    console.error('Error getting daily balances:', error)
    return []
  }
}

// Clean up old balance history (older than 3 days)
export const cleanOldBalanceHistory = async (
  walletId?: string
): Promise<number> => {
  try {
    const historyRef = collection(db, WALLET_BALANCE_HISTORY_COLLECTION)
    const q = walletId 
      ? query(historyRef, where('walletId', '==', walletId))
      : query(historyRef)
    
    const snapshot = await getDocs(q)
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000)
    
    const oldDocs = snapshot.docs.filter((docSnap: any) => {
      const data = docSnap.data()
      return data.timestamp < threeDaysAgo
    })
    
    // Delete old documents
    const deletePromises = oldDocs.map((docSnap) => {
      return deleteDoc(doc(db, WALLET_BALANCE_HISTORY_COLLECTION, docSnap.id))
    })
    
    await Promise.all(deletePromises)
    
    console.log(`Cleaned up ${oldDocs.length} old balance records`)
    return oldDocs.length
  } catch (error) {
    console.error('Error cleaning old balance history:', error)
    return 0
  }
}

// Delete a single balance record by ID
export const deleteBalanceRecord = async (
  recordId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, WALLET_BALANCE_HISTORY_COLLECTION, recordId))
    console.log(`Deleted balance record: ${recordId}`)
  } catch (error) {
    console.error('Error deleting balance record:', error)
    throw error
  }
}

// Delete multiple balance records by IDs
export const deleteMultipleBalanceRecords = async (
  recordIds: string[]
): Promise<number> => {
  try {
    const deletePromises = recordIds.map((recordId) => {
      return deleteDoc(doc(db, WALLET_BALANCE_HISTORY_COLLECTION, recordId))
    })
    
    await Promise.all(deletePromises)
    
    console.log(`Deleted ${recordIds.length} balance records`)
    return recordIds.length
  } catch (error) {
    console.error('Error deleting multiple balance records:', error)
    throw error
  }
}

// Delete all balance records for a wallet
export const deleteAllBalanceRecords = async (
  walletId: string
): Promise<number> => {
  try {
    const historyRef = collection(db, WALLET_BALANCE_HISTORY_COLLECTION)
    const q = query(historyRef, where('walletId', '==', walletId))
    
    const snapshot = await getDocs(q)
    
    const deletePromises = snapshot.docs.map((docSnap) => {
      return deleteDoc(doc(db, WALLET_BALANCE_HISTORY_COLLECTION, docSnap.id))
    })
    
    await Promise.all(deletePromises)
    
    console.log(`Deleted all ${snapshot.docs.length} balance records for wallet: ${walletId}`)
    return snapshot.docs.length
  } catch (error) {
    console.error('Error deleting all balance records:', error)
    throw error
  }
}
