import { db } from '@/firebase/config'
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import type { Appeal, AppealCategory, AppealStatus } from '@/types'

// Сборник категорий appeals
export const APPEAL_CATEGORIES: Record<AppealCategory, { label: string; icon: string; color: string }> = {
  technical: { label: 'Технические проблемы', icon: 'bug', color: 'red' },
  billing: { label: 'Биллинг и платежи', icon: 'credit-card', color: 'amber' },
  schedule: { label: 'Расписание и слоты', icon: 'calendar', color: 'blue' },
  referral: { label: 'Реферальная программа', icon: 'users', color: 'green' },
  verification: { label: 'Верификация', icon: 'shield-check', color: 'purple' },
  training: { label: 'Обучение и Contour', icon: 'book', color: 'pink' },
  trading: { label: 'Торговля и сигналы', icon: 'trending-up', color: 'emerald' },
  access: { label: 'Доступ к разделам', icon: 'lock', color: 'orange' },
  other: { label: 'Другое', icon: 'help-circle', color: 'gray' },
}

// Статусы appeals
export const APPEAL_STATUS_META: Record<AppealStatus, { label: string; color: string; bgColor: string }> = {
  in_progress: { label: 'В работе', color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
  resolved: { label: 'Отработано', color: 'text-green-500', bgColor: 'bg-green-500/20' },
  closed: { label: 'Закрыто', color: 'text-gray-500', bgColor: 'bg-gray-500/20' },
}

// Получить все appeals
export const getAppeals = async (): Promise<Appeal[]> => {
  try {
    const appealsRef = collection(db, 'appeals')
    const q = query(appealsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Appeal))
      .filter((appeal) => !appeal.deleted)
  } catch (error) {
    console.error('Error fetching appeals:', error)
    return []
  }
}

// Создать appeal
export const createAppeal = async (appealData: Omit<Appeal, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<{ id: string; appealId: string }> => {
  try {
    const appealsRef = collection(db, 'appeals')
    const docRef = await addDoc(appealsRef, {
      ...appealData,
      status: 'in_progress',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    // Генерируем фиксированный ID на основе docId и timestamp
    const timestamp = new Date().getTime().toString(36).toUpperCase()
    const appealId = `APP-${timestamp}-${docRef.id.substring(0, 4).toUpperCase()}`
    
    // Обновляем документ с appealId (не блокируем при ошибке)
    try {
      await updateDoc(docRef, { appealId })
    } catch (updateError) {
      console.warn('Warning: Could not update appealId, but document was created:', updateError)
      // Продолжаем, даже если updateDoc не удался
    }
    
    return { id: docRef.id, appealId }
  } catch (error) {
    console.error('Error creating appeal:', error)
    throw new Error('Не удалось создать обращение')
  }
}

// Обновить статус appeal
export const updateAppealStatus = async (appealId: string, status: AppealStatus, adminComment?: string, processedBy?: string): Promise<void> => {
  try {
    const appealRef = doc(db, 'appeals', appealId)
    const updateData: any = {
      status,
      processedBy,
      processedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    // Добавляем adminComment только если он не пустой
    if (adminComment && adminComment.trim()) {
      updateData.adminComment = adminComment.trim()
    }
    
    await updateDoc(appealRef, updateData)
  } catch (error) {
    console.error('Error updating appeal status:', error)
    throw new Error('Не удалось обновить статус обращения')
  }
}

// Удалить appeal
export const deleteAppeal = async (appealId: string): Promise<void> => {
  try {
    const appealRef = doc(db, 'appeals', appealId)
    await updateDoc(appealRef, {
      deleted: true,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error deleting appeal:', error)
    throw new Error('Не удалось удалить обращение')
  }
}
