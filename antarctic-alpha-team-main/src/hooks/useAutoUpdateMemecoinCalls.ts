import { useEffect, useState, useCallback } from 'react'
import { Call } from '@/types'
import { updateMemecoinCallData } from '@/services/firestoreService'

// Временные лимиты по стратегиям (в часах)
const STRATEGY_DEADLINES: Record<string, number> = {
  flip: 24,           // 24 часа
  medium: 14 * 24,    // 14 дней
  long: 90 * 24,      // 90 суток
}

// Порог успешного завершения по прибыли
const SUCCESS_THRESHOLD = 50 // 50%
const FULL_SUCCESS_THRESHOLD = 100 // 100%

/**
 * Хук для автоматического обновления данных мемкоинов
 * Обновляет каждые intervalSeconds секунд только активные сигналы
 * @param calls - список всех сигналов
 * @param onUpdate - колбэк для обновления состояния
 * @param intervalSeconds - интервал обновления в секундах (по умолчанию 5)
 * @param autoCompleteThreshold - порог для автоматического завершения по прибыли в % (по умолчанию 50)
 * @param autoCancelThreshold - порог для автоматической отмены по убытку в % (по умолчанию -90)
 */
export const useAutoUpdateMemecoinCalls = (
  calls: Call[],
  onUpdate: (callId: string, updates: Partial<Call>) => void,
  intervalSeconds: number = 5,
  autoCompleteThreshold: number = 50,
  autoCancelThreshold: number = -90
) => {
  const [updatingCallIds, setUpdatingCallIds] = useState<Set<string>>(new Set())

  // Проверка дедлайна для сигнала
  const checkDeadline = useCallback((call: Call): { isExpired: boolean; hoursSincePublication: number; deadlineHours: number } => {
    const publishedAt = call.publishedAt ? new Date(call.publishedAt).getTime() : (call.createdAt ? new Date(call.createdAt).getTime() : Date.now())
    const now = Date.now()
    const hoursSincePublication = (now - publishedAt) / (1000 * 60 * 60)
    
    const strategy = call.details?.memecoins?.holdPlan || 'medium'
    const deadlineHours = STRATEGY_DEADLINES[strategy] || STRATEGY_DEADLINES.medium
    
    return {
      isExpired: hoursSincePublication >= deadlineHours,
      hoursSincePublication,
      deadlineHours,
    }
  }, [])

  const updateActiveMemecoins = useCallback(async () => {
    // Фильтруем только активные сигналы мемкоинов с адресом контракта
    const activeMemecoins = calls.filter(
      (call) =>
        call.category === 'memecoins' &&
        call.status === 'active' &&
        call.details?.memecoins?.contract &&
        !updatingCallIds.has(call.id)
    )

    if (activeMemecoins.length === 0) return

    console.log(`🔄 Auto-updating ${activeMemecoins.length} memecoin calls...`)

    // Обновляем каждый сигнал параллельно
    const updatePromises = activeMemecoins.map(async (call) => {
      const contract = call.details?.memecoins?.contract
      if (!contract) return null

      try {
        // Добавляем ID в список обновляемых
        setUpdatingCallIds((prev) => new Set(prev).add(call.id))

        // Получаем обновлённые данные с порогами завершения и отмены
        const result = await updateMemecoinCallData(
          call.id,
          contract,
          autoCompleteThreshold,
          autoCancelThreshold
        )

        if (result) {
          console.log(`✅ Updated ${call.id}: MC=${formatMC(result.currentMarketCap)}, PnL=${result.currentPnL.toFixed(2)}%, Max=${result.maxProfit.toFixed(2)}%`)

          // Обновляем состояние через колбэк
          const updates: Partial<Call> = {
            currentMarketCap: result.currentMarketCap,
            currentPnL: result.currentPnL,
            maxProfit: result.maxProfit,
          }

          // Проверяем дедлайн
          const { isExpired, deadlineHours } = checkDeadline(call)
          
          // Логика завершения сигнала:
          // 1. Если профит >= 100% - сразу завершаем как "успешный"
          // 2. Если дедлайн истёк:
          //    - профит >= 50% = успешный
          //    - профит < 50% = неуспешный (cancelled)
          
          let newStatus: 'active' | 'completed' | 'cancelled' | null = null

          // Проверяем порог 100% - сразу успешный
          if (result.maxProfit >= FULL_SUCCESS_THRESHOLD) {
            newStatus = 'completed'
            console.log(`🎯 Call ${call.id} auto-completed: 100%+ profit (${result.maxProfit.toFixed(2)}%)`)
          }
          // Проверяем дедлайн
          else if (isExpired) {
            if (result.maxProfit >= SUCCESS_THRESHOLD) {
              newStatus = 'completed'
              console.log(`⏰ Call ${call.id} auto-completed by deadline (${deadlineHours}h): profit ${result.maxProfit.toFixed(2)}%`)
            } else {
              newStatus = 'cancelled'
              console.log(`❌ Call ${call.id} auto-cancelled by deadline (${deadlineHours}h): profit ${result.maxProfit.toFixed(2)}% < 50%`)
            }
          }

          if (newStatus) {
            updates.status = newStatus
          }

          onUpdate(call.id, updates)
        }
      } catch (error) {
        console.error(`❌ Error updating ${call.id}:`, error)
      } finally {
        // Убираем ID из списка обновляемых
        setUpdatingCallIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(call.id)
          return newSet
        })
      }
    })

    await Promise.all(updatePromises)
  }, [calls, onUpdate, updatingCallIds, autoCompleteThreshold, autoCancelThreshold, checkDeadline])

  useEffect(() => {
    // Первое обновление через 5 секунд после монтирования
    const initialTimeout = setTimeout(() => {
      updateActiveMemecoins()
    }, 5000)

    // Затем обновляем каждые intervalSeconds секунд
    const interval = setInterval(() => {
      updateActiveMemecoins()
    }, intervalSeconds * 1000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [updateActiveMemecoins, intervalSeconds])

  return {
    isUpdating: updatingCallIds.size > 0,
    updatingCallIds,
  }
}

// Вспомогательная функция форматирования MC
function formatMC(mc: number): string {
  if (mc >= 1_000_000) return `$${(mc / 1_000_000).toFixed(2)}M`
  if (mc >= 1_000) return `$${(mc / 1_000).toFixed(2)}K`
  return `$${mc.toFixed(0)}`
}
