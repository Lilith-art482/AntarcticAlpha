import { useEffect, useCallback } from 'react'
import { cleanupOldCalls } from '@/services/firestoreService'

/**
 * Хук для автоматической очистки старых закрытых/просроченных сигналов
 * Запускается каждые intervalMinutes минут и удаляет сигналы,
 * которые были закрыты/просрочены более чем hoursAgo часов назад
 * @param intervalMinutes - интервал запуска очистки в минутах (по умолчанию 5)
 * @param hoursAgo - количество часов, после которых удалять закрытые/просроченные сигналы (по умолчанию 3)
 */
export const useCleanupOldCalls = (
  intervalMinutes: number = 5,
  hoursAgo: number = 3
) => {
  const performCleanup = useCallback(async () => {
    try {
      const deletedCount = await cleanupOldCalls(hoursAgo)
      if (deletedCount > 0) {
        console.log(`🗑️ Auto-cleanup: ${deletedCount} old calls removed`)
      }
    } catch (error) {
      console.error('❌ Error in auto-cleanup:', error)
    }
  }, [hoursAgo])

  useEffect(() => {
    // Первая очистка через 1 минуту после монтирования
    const initialTimeout = setTimeout(() => {
      performCleanup()
    }, 60000) // 1 минута

    // Затем очистка каждые intervalMinutes минут
    const interval = setInterval(() => {
      performCleanup()
    }, intervalMinutes * 60 * 1000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [performCleanup, intervalMinutes])

  return {
    performCleanup,
  }
}
