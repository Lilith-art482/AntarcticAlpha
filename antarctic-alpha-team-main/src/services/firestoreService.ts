// Firestore service for data operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteField,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebase/config' // Keep original path for db
import { WorkSlot, DayStatus, Earnings, RatingData, Referral, Call, Task, TaskStatus, TaskPriority, ApprovalRequest, ApprovalStatus, UserNickname, Restriction, RestrictionType, UserConflict, AccessBlock, AiAlert, User, TriggerAlert, FasolTriggerAlert, Lesson, LessonTopic, StageAssignee, Note, Trade, TradeSetupTemplate, TradeMarketType, TradeDirection, UserSession, UserWallet, CompensationRequest, CompensationRequestStatus, DiversificationEntry, TeamFundRequest, TeamFundRequestStatus, Payment, PaymentBatch, DMContactRequest, DMContactStatus } from '@/types'
import { clearNicknameCache, getUserNicknameAsync } from '@/utils/userUtils'
import { formatDate } from '@/utils/dateUtils'
import { logger } from '@/utils/logger'

const DATA_RETENTION_DAYS = 30

const pad = (value: number) => value.toString().padStart(2, '0')
const getRetentionThresholds = () => {
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() - DATA_RETENTION_DAYS)
  const dateOnly = `${thresholdDate.getFullYear()} -${pad(thresholdDate.getMonth() + 1)} -${pad(thresholdDate.getDate())} `
  return {
    dateOnly,
    iso: thresholdDate.toISOString(),
  }
}

const cleanupCollectionByField = async (collectionName: string, fieldName: string, threshold: string) => {
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, where(fieldName, '<', threshold))
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map((docSnap: any) => deleteDoc(doc(db, collectionName, docSnap.id))))
}

export const cleanupOldData = async () => {
  try {
    const { dateOnly, iso } = getRetentionThresholds()
    await Promise.all([
      cleanupCollectionByField('workSlots', 'date', dateOnly),
      cleanupCollectionByField('dayStatuses', 'date', dateOnly),
      cleanupCollectionByField('earnings', 'date', dateOnly),
      cleanupCollectionByField('referrals', 'createdAt', iso),
      cleanupCollectionByField('analytics', 'createdAt', iso),
    ])
  } catch (error) {
    console.error('Failed to cleanup old data', error)
  }
}

// Work Slots
export const getWorkSlots = async (userId?: string, date?: string) => {
  const slotsRef = collection(db, 'workSlots')
  let q: ReturnType<typeof query>

  // Build query based on filters - avoid composite index requirement
  // Use only single-field filters to avoid needing composite indexes
  if (userId && date) {
    // Filter by userId first, then filter in memory
    q = query(slotsRef, where('userId', '==', userId))
  } else if (userId) {
    // Filter by userId only, sort in memory to avoid index requirement
    q = query(slotsRef, where('userId', '==', userId))
  } else if (date) {
    // Filter by date only
    q = query(slotsRef, where('date', '==', date))
  } else {
    // No filters, get all
    q = query(slotsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    // Convert old format (break) to new format (breaks array) for backward compatibility
    const slots = (data?.slots || []).map((slot: any) => {
      if (slot.break && !slot.breaks) {
        // Old format with single break - convert to array
        return {
          ...slot,
          breaks: [slot.break],
          break: undefined
        }
      }
      return slot
    })

    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      slots,
      participants: data?.participants || [],
      ...(data?.comment && { comment: data.comment }),
      ...(data?.category && { category: data.category }),
      ...(data?.taskId && { taskId: data.taskId }),
    } as WorkSlot
  })

  // Filter by date in memory if both userId and date provided
  if (userId && date) {
    results = results.filter((s: WorkSlot) => s.date === date)
  }

  // Sort by date in memory to avoid index requirement
  results.sort((a: WorkSlot, b: WorkSlot) => a.date.localeCompare(b.date))

  return results
}

export const addWorkSlot = async (slot: Omit<WorkSlot, 'id'>) => {
  try {
    console.log('addWorkSlot: Starting, db initialized:', !!db)
    const slotsRef = collection(db, 'workSlots')
    console.log('addWorkSlot: Collection reference created')
    // Remove undefined values before saving
    const cleanSlot = Object.fromEntries(
      Object.entries(slot).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('addWorkSlot: Clean slot prepared:', cleanSlot)
    console.log('addWorkSlot: Calling addDoc...')
    const result = await addDoc(slotsRef, cleanSlot)
    console.log('addWorkSlot: Work slot added successfully:', result.id)

    return result
  } catch (error: any) {
    console.error('addWorkSlot: Error caught:', error)
    console.error('addWorkSlot: Error code:', error?.code)
    console.error('addWorkSlot: Error message:', error?.message)
    console.error('addWorkSlot: Full error:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const updateWorkSlot = async (id: string, updates: Partial<WorkSlot>) => {
  const slotRef = doc(db, 'workSlots', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(slotRef, cleanUpdates)
}

export const deleteWorkSlot = async (id: string) => {
  const slotRef = doc(db, 'workSlots', id)
  await deleteDoc(slotRef)
}

// Day Statuses
export const getDayStatuses = async (userId?: string, date?: string) => {
  const statusesRef = collection(db, 'dayStatuses')
  let q: ReturnType<typeof query>

  // Build query based on filters - avoid composite index requirement
  // Use only single-field filters to avoid needing composite indexes
  if (userId && date) {
    // Filter by userId first, then filter in memory
    q = query(statusesRef, where('userId', '==', userId))
  } else if (userId) {
    // Filter by userId only, sort in memory to avoid index requirement
    q = query(statusesRef, where('userId', '==', userId))
  } else if (date) {
    // Filter by date only
    q = query(statusesRef, where('date', '==', date))
  } else {
    // No filters, get all
    q = query(statusesRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      type: data?.type || 'dayoff',
      ...(data?.comment && { comment: data.comment }),
      ...(data?.endDate && { endDate: data.endDate }),
    } as DayStatus
  })

  // Filter by date in memory if both userId and date provided
  if (userId && date) {
    results = results.filter((s: DayStatus) => s.date === date)
  }

  // Sort by date in memory to avoid index requirement
  results.sort((a: DayStatus, b: DayStatus) => a.date.localeCompare(b.date))

  return results
}

export const addDayStatus = async (status: Omit<DayStatus, 'id'>) => {
  try {
    const statusesRef = collection(db, 'dayStatuses')
    // Remove undefined values before saving
    const cleanStatus = Object.fromEntries(
      Object.entries(status).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('Adding day status:', cleanStatus)
    const result = await addDoc(statusesRef, cleanStatus)
    console.log('Day status added successfully:', result.id)

    return result
  } catch (error) {
    console.error('Error in addDayStatus:', error)
    throw error
  }
}

export const updateDayStatus = async (id: string, updates: Partial<DayStatus>) => {
  const statusRef = doc(db, 'dayStatuses', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(statusRef, cleanUpdates)
}

export const deleteDayStatus = async (id: string) => {
  const statusRef = doc(db, 'dayStatuses', id)
  await deleteDoc(statusRef)
}

// Restrictions
export const getRestrictions = async (isActive?: boolean) => {
  const restrictionsRef = collection(db, 'restrictions')
  let q: ReturnType<typeof query>

  if (isActive !== undefined) {
    q = query(restrictionsRef, where('isActive', '==', isActive))
  } else {
    q = query(restrictionsRef)
  }

  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      type: data?.type || 'all',
      startDate: data?.startDate || '',
      endDate: data?.endDate,
      startTime: data?.startTime,
      blockFutureDates: data?.blockFutureDates || false,
      comment: data?.comment,
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      isActive: data?.isActive ?? true,
    } as Restriction
  })

  // Sort by start date in memory to avoid index requirement
  results.sort((a: Restriction, b: Restriction) => a.startDate.localeCompare(b.startDate))

  return results
}

export const addRestriction = async (restriction: Omit<Restriction, 'id'>) => {
  try {
    const restrictionsRef = collection(db, 'restrictions')
    // Remove undefined values before saving
    const cleanRestriction = Object.fromEntries(
      Object.entries(restriction).filter(([_, value]: [string, any]) => value !== undefined)
    )
    const result = await addDoc(restrictionsRef, cleanRestriction)
    return result
  } catch (error) {
    console.error('Error adding restriction:', error)
    throw error
  }
}

export const updateRestriction = async (id: string, updates: Partial<Restriction>) => {
  const restrictionRef = doc(db, 'restrictions', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(restrictionRef, cleanUpdates)
}

export const deleteRestriction = async (id: string) => {
  const restrictionRef = doc(db, 'restrictions', id)
  await deleteDoc(restrictionRef)
}

// Check if a specific action is restricted for given date/time
export const checkRestriction = async (
  actionType: RestrictionType,
  date: string,
  time?: string
): Promise<{ restricted: boolean; restriction?: Restriction; reason?: string }> => {
  try {
    const restrictions = await getRestrictions(true)
    const now = new Date()

    for (const restriction of restrictions) {
      // Check if restriction applies to this action type
      if (restriction.type !== 'all' && restriction.type !== actionType) {
        continue
      }

      const checkDate = new Date(date)
      const restrictionDateTime = new Date(`${restriction.startDate}${restriction.startTime ? `T${restriction.startTime}` : ''} `)

      // Check if blockFutureDates restriction is active
      if (restriction.blockFutureDates && now >= restrictionDateTime) {
        // Block creating records only on the next day after the restriction date
        const restrictionDate = new Date(restriction.startDate);
        const nextDay = new Date(restrictionDate);
        nextDay.setDate(restrictionDate.getDate() + 1);

        if (checkDate.toDateString() === nextDay.toDateString()) {
          return {
            restricted: true,
            restriction,
            reason: `После ${formatDate(restrictionDateTime, 'dd.MM.yyyy')}${restriction.startTime ? ` ${restriction.startTime}` : ''} запрещено создавать ${restrictionTypeToLabel(actionType)} на следующий день ${formatDate(nextDay, 'dd.MM.yyyy')} `
          }
        }
      }

      // Check date range restrictions (existing logic)
      const startDate = new Date(restriction.startDate)

      let dateInRange = false
      if (restriction.endDate) {
        const endDate = new Date(restriction.endDate)
        dateInRange = checkDate >= startDate && checkDate <= endDate
      } else {
        dateInRange = checkDate.getTime() === startDate.getTime()
      }

      if (!dateInRange) {
        continue
      }

      // If no time restriction, then it's restricted
      if (!restriction.startTime) {
        return {
          restricted: true,
          restriction,
          reason: `Запрещено создавать ${restrictionTypeToLabel(actionType)} на ${formatDate(checkDate, 'dd.MM.yyyy')} `
        }
      }

      // Check time restriction
      if (time && restriction.startTime) {
        const checkTime = time
        const restrictTime = restriction.startTime

        if (checkTime >= restrictTime) {
          return {
            restricted: true,
            restriction,
            reason: `Запрещено создавать ${restrictionTypeToLabel(actionType)} после ${restrictTime} на ${formatDate(checkDate, 'dd.MM.yyyy')} `
          }
        }
      }
    }

    return { restricted: false }
  } catch (error) {
    console.error('Error checking restrictions:', error)
    return { restricted: false } // Allow on error to avoid blocking users
  }
}

const restrictionTypeToLabel = (type: RestrictionType): string => {
  const labels: Record<RestrictionType, string> = {
    slots: 'слоты',
    dayoff: 'выходные',
    sick: 'больничные',
    vacation: 'отпуска',
    absence: 'отсутствия',
    truancy: 'прогулы',
    internship: 'стажировки',
    all: 'любые записи',
  }
  return labels[type]
}

// Approval Requests
const APPROVAL_COLLECTION = 'approvalRequests'

const mapApprovalSnapshot = (docSnap: any): ApprovalRequest => {
  const data = docSnap.data() as any
  const nowIso = new Date().toISOString()
  return {
    id: docSnap.id,
    entity: data?.entity || 'slot',
    action: data?.action || 'create',
    status: data?.status || 'pending',
    authorId: data?.authorId || '',
    targetUserId: data?.targetUserId || '',
    before: data?.before ?? null,
    after: data?.after ?? null,
    comment: data?.comment,
    adminComment: data?.adminComment,
    reviewedBy: data?.reviewedBy,
    createdAt: data?.createdAt || nowIso,
    updatedAt: data?.updatedAt || data?.createdAt || nowIso,
    processedAt: data?.processedAt,
  }
}

const applySlotChange = async (request: ApprovalRequest) => {
  const beforeSlot = request.before as WorkSlot | null | undefined
  const afterSlot = request.after as WorkSlot | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterSlot) {
        throw new Error('No slot payload for creation')
      }
      const { id: _id, ...payload } = afterSlot
      await addWorkSlot(payload)
      return
    }
    case 'update': {
      const targetId = (afterSlot as WorkSlot | undefined)?.id || beforeSlot?.id
      if (!targetId || !afterSlot) {
        throw new Error('No slot payload for update')
      }
      const { id: _id, ...payload } = afterSlot
      await updateWorkSlot(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeSlot?.id) {
        throw new Error('No slot id for delete')
      }
      await deleteWorkSlot(beforeSlot.id)
      return
    }
    default:
      return
  }
}

const applyStatusChange = async (request: ApprovalRequest) => {
  const beforeStatus = request.before as DayStatus | null | undefined
  const afterStatus = request.after as DayStatus | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterStatus) {
        throw new Error('No status payload for creation')
      }
      const { id: _id, ...payload } = afterStatus
      await addDayStatus(payload)
      return
    }
    case 'update': {
      const targetId = (afterStatus as DayStatus | undefined)?.id || beforeStatus?.id
      if (!targetId || !afterStatus) {
        throw new Error('No status payload for update')
      }
      const { id: _id, ...payload } = afterStatus
      await updateDayStatus(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeStatus?.id) {
        throw new Error('No status id for delete')
      }
      await deleteDayStatus(beforeStatus.id)
      return
    }
    default:
      return
  }
}

const applyEarningChange = async (request: ApprovalRequest) => {
  const beforeE = request.before as Earnings | null | undefined
  const afterE = request.after as Earnings | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterE) throw new Error('No earning payload for creation')
      const { id: _id, ...payload } = afterE
      // При одобрении через approval request устанавливаем статус approved
      await addEarnings({ ...payload, status: 'approved' })
      return
    }
    case 'update': {
      const targetId = afterE?.id || beforeE?.id
      if (!targetId || !afterE) throw new Error('No earning payload for update')
      const { id: _id, ...payload } = afterE
      // При одобрении через approval request устанавливаем статус approved
      await updateEarnings(targetId, { ...payload, status: 'approved' })
      return
    }
    case 'delete': {
      if (!beforeE?.id) throw new Error('No earning id for delete')
      await deleteEarnings(beforeE.id)
      return
    }
    default:
      return
  }
}

const applyReferralChange = async (request: ApprovalRequest) => {
  const beforeR = request.before as Referral | null | undefined
  const afterR = request.after as Referral | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterR) throw new Error('No referral payload for creation')
      const { id: _id, ...payload } = afterR
      await addReferral(payload)
      return
    }
    case 'update': {
      const targetId = afterR?.id || beforeR?.id
      if (!targetId || !afterR) throw new Error('No referral payload for update')
      const { id: _id, ...payload } = afterR
      await updateReferral(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeR?.id) throw new Error('No referral id for delete')
      await deleteReferral(beforeR.id)
      return
    }
    default:
      return
  }
}

const applyLoginChange = async (request: ApprovalRequest) => {
  const afterN = request.after as UserNickname | null | undefined

  switch (request.action) {
    case 'update': {
      if (!afterN || !afterN.nickname) throw new Error('No nickname payload for update')
      await setUserNickname(request.targetUserId, afterN.nickname)
      return
    }
    case 'delete': {
      await deleteUserNickname(request.targetUserId)
      return
    }
    default:
      return
  }
}

export const addApprovalRequest = async (
  request: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reviewedBy'>
) => {
  const approvalsRef = collection(db, APPROVAL_COLLECTION)
  const now = new Date().toISOString()
  const payload = {
    ...request,
    status: 'pending' as const,
    createdAt: now,
    updatedAt: now,
  }
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(approvalsRef, cleanPayload)
  return result
}

export const getApprovalRequests = async (
  status?: ApprovalStatus,
  authorId?: string,
  targetUserId?: string
) => {
  const approvalsRef = collection(db, APPROVAL_COLLECTION)
  let q: ReturnType<typeof query>

  if (status) {
    q = query(approvalsRef, where('status', '==', status))
  } else if (authorId) {
    q = query(approvalsRef, where('authorId', '==', authorId))
  } else if (targetUserId) {
    q = query(approvalsRef, where('targetUserId', '==', targetUserId))
  } else {
    q = query(approvalsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map(mapApprovalSnapshot)

  // Additional in-memory filters to avoid composite indexes
  if (status) {
    results = results.filter((r: ApprovalRequest) => r.status === status)
  }
  if (authorId) {
    results = results.filter((r: ApprovalRequest) => r.authorId === authorId)
  }
  if (targetUserId) {
    results = results.filter((r: ApprovalRequest) => r.targetUserId === targetUserId)
  }

  // Sort by creation time descending
  results.sort((a: ApprovalRequest, b: ApprovalRequest) => b.createdAt.localeCompare(a.createdAt))

  return results
}

export const updateApprovalRequest = async (id: string, updates: Partial<ApprovalRequest>) => {
  const ref = doc(db, APPROVAL_COLLECTION, id)
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(ref, cleanUpdates)
}

export const deleteApprovalRequest = async (id: string, deletedByUser: boolean = false) => {
  try {
    // Если удаляет пользователь (не админ) - делаем мягкое удаление (скрываем для пользователя)
    if (deletedByUser) {
      const ref = doc(db, APPROVAL_COLLECTION, id)
      await updateDoc(ref, {
        deletedByUser: true,
        userDeletedAt: new Date().toISOString()
      })
      console.log('Soft delete applied (hidden from user):', id)
    } else {
      // Админ удаляет полностью
      const ref = doc(db, APPROVAL_COLLECTION, id)
      await deleteDoc(ref)
      console.log('Successfully deleted approval request:', id)
    }
  } catch (error: any) {
    console.error('Error deleting approval request:', error)
    throw error
  }
}
 
// Получить архивные заявки (рассмотренные) для админа
export const getArchivedApprovalRequests = async (): Promise<ApprovalRequest[]> => {
  const approvalsRef = collection(db, APPROVAL_COLLECTION)
  const q = query(approvalsRef)
  const snapshot = await getDocs(q)
  
  const results = snapshot.docs
    .map(mapApprovalSnapshot)
    .filter((r: ApprovalRequest) => r.status === 'approved' || r.status === 'rejected')
  
  // Сортируем по дате обработки (новые первые)
  results.sort((a: ApprovalRequest, b: ApprovalRequest) => {
    const aDate = a.processedAt || a.updatedAt
    const bDate = b.processedAt || b.updatedAt
    return bDate.localeCompare(aDate)
  })
  
  return results
}

// Автоматическое удаление старых архивных заявок (старше 30 дней)
export const cleanupOldApprovalRequests = async (daysOld: number = 30): Promise<number> => {
  try {
    const approvalsRef = collection(db, APPROVAL_COLLECTION)
    const snapshot = await getDocs(approvalsRef)
    
    const now = new Date()
    const cutoffDate = new Date(now.getTime() - daysOld * 24 * 60 * 60 * 1000)
    
    let deletedCount = 0
    
    for (const doc of snapshot.docs) {
      const data = doc.data()
      const status = data.status
      
      // Удаляем только рассмотренные заявки
      if (status !== 'approved' && status !== 'rejected') continue
      
      const processedAt = data.processedAt ? new Date(data.processedAt) : null
      const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null
      const dateToCheck = processedAt || updatedAt
      
      if (dateToCheck && dateToCheck < cutoffDate) {
        await deleteApprovalRequest(doc.id)
        deletedCount++
      }
    }
    
    return deletedCount
  } catch (error) {
    console.error('Error cleaning up old approval requests:', error)
    return 0
  }
}

// Массовое удаление заявок
export const deleteMultipleApprovalRequests = async (ids: string[]): Promise<number> => {
  let deletedCount = 0
  for (const id of ids) {
    try {
      await deleteApprovalRequest(id)
      deletedCount++
    } catch (error) {
      console.error(`Error deleting approval request ${id}:`, error)
    }
  }
  return deletedCount
}

export const approveApprovalRequest = async (id: string, adminId: string, adminComment?: string) => {
  const ref = doc(db, APPROVAL_COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const request = mapApprovalSnapshot(snap)
  if (request.status !== 'pending') return

  if (request.entity === 'slot') {
    await applySlotChange(request)
  } else if (request.entity === 'status') {
    await applyStatusChange(request)
  } else if (request.entity === 'earning') {
    await applyEarningChange(request)
  } else if (request.entity === 'referral') {
    await applyReferralChange(request)
  } else if (request.entity === 'login') {
    await applyLoginChange(request)
    // Clear nickname cache and reload new value after approval
    clearNicknameCache(request.targetUserId)
    // Force reload new nickname into cache
    await getUserNicknameAsync(request.targetUserId)
  }
  // Для points_exchange ничего дополнительно делать не нужно - баллы уже списаны при создании заявки

  const approvePayload: Record<string, any> = {
    status: 'approved',
    reviewedBy: adminId,
    updatedAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
  }
  const finalComment = adminComment ?? request.adminComment
  if (finalComment !== undefined) {
    approvePayload.adminComment = finalComment
  }
  await updateDoc(ref, approvePayload)
}

export const rejectApprovalRequest = async (id: string, adminId: string, adminComment: string, partialRefundPercent?: number) => {
  const ref = doc(db, APPROVAL_COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const request = mapApprovalSnapshot(snap)
  if (request.status !== 'pending') return

  // Для points_exchange возвращаем баллы при отклонении
  if (request.entity === 'points_exchange') {
    const pointsData = request.after as any
    if (pointsData?.points) {
      const partialAmount = partialRefundPercent 
        ? Math.round(pointsData.points * partialRefundPercent / 100)
        : undefined
      await refundPoints(
        request.authorId,
        pointsData.points,
        id,
        pointsData.userName,
        partialAmount
      )
    }
  }

  await updateDoc(ref, {
    status: 'rejected',
    adminComment,
    reviewedBy: adminId,
    updatedAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
  })
}

// Earnings
export const getEarnings = async (userId?: string, startDate?: string, endDate?: string) => {
  const earningsRef = collection(db, 'earnings')
  let q: ReturnType<typeof query>

  // Build query to avoid composite index requirement
  // When userId is provided, we need to get all earnings and filter in memory
  // because we need to check both userId field and participants array
  if (userId) {
    // Get all earnings to check both userId and participants
    q = query(earningsRef)
  } else if (startDate && endDate) {
    // Filter by date range (this doesn't require index for range queries on single field)
    q = query(earningsRef, where('date', '>=', startDate), where('date', '<=', endDate))
  } else {
    // No filters, get all
    q = query(earningsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      amount: data?.amount || 0,
      poolAmount: data?.poolAmount || 0,
      slotId: data?.slotId || '',
      walletType: data?.walletType || 'personal', // Default to personal for old records or as fallback
      isDeving: data?.isDeving || false,
      extraWalletsCount: data?.extraWalletsCount || 0,
      extraWalletsAmount: data?.extraWalletsAmount || 0,
      category: data?.category || 'other',
      participants: data?.participants || [],
      status: data?.status || 'approved',
      transactionHash: data?.transactionHash || '',
      receivedWallet: data?.receivedWallet || '',
    } as Earnings
  })

  // Filter by userId in memory (check both userId field and participants array)
  if (userId) {
    results = results.filter((e: Earnings) => {
      const allParticipants = e.participants && e.participants.length > 0
        ? [...e.participants, e.userId]
        : [e.userId]
      return allParticipants.includes(userId)
    })
  }

  // Filter by date range in memory if userId is also provided
  if (userId && startDate && endDate) {
    results = results.filter((e: Earnings) => e.date >= startDate && e.date <= endDate)
  } else if (!userId && startDate && endDate) {
    // Already filtered by query, but ensure consistency
    results = results.filter((e: Earnings) => e.date >= startDate && e.date <= endDate)
  }

  // Sort by date descending in memory to avoid index requirement
  results.sort((a: any, b: any) => b.date.localeCompare(a.date))

  return results
}

export const addEarnings = async (earning: Omit<Earnings, 'id'>) => {
  try {
    const earningsRef = collection(db, 'earnings')
    // Remove undefined values before saving
    const cleanEarning = Object.fromEntries(
      Object.entries(earning).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('Adding earnings:', cleanEarning)
    const result = await addDoc(earningsRef, cleanEarning)
    console.log('Earnings added successfully:', result.id)

    // Also add to pool contributions if poolAmount > 0
    // This ensures the pool amount persists even if the earning is later deleted
    if (earning.poolAmount && earning.poolAmount > 0) {
      try {
        const contributionsRef = collection(db, 'poolContributions')
        await addDoc(contributionsRef, {
          amount: earning.poolAmount,
          date: earning.date,
          source: 'earning',
          earningId: result.id,
          description: `Вклад из заработка: ${earning.category}`,
          addedBy: earning.userId,
          createdAt: new Date().toISOString()
        })
        console.log('Pool contribution added for earning:', result.id)
      } catch (poolError) {
        // Don't fail the main operation if pool contribution fails
        console.error('Error adding pool contribution:', poolError)
      }
    }

    return result
  } catch (error) {
    console.error('Error in addEarnings:', error)
    throw error
  }
}
 
export const updateEarnings = async (id: string, updates: Partial<Earnings>) => {
  const earningRef = doc(db, 'earnings', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(earningRef, cleanUpdates)
}

export const deleteEarnings = async (id: string) => {
  const earningRef = doc(db, 'earnings', id)
  await deleteDoc(earningRef)
}

// ================================
// Pool Contributions (Community Fund)
// ================================

// Get all pool contributions
export const getPoolContributions = async (): Promise<import('@/types').PoolContribution[]> => {
  try {
    const contributionsRef = collection(db, 'poolContributions')
    const q = query(contributionsRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        amount: data.amount || 0,
        date: data.date || '',
        source: data.source || 'manual',
        earningId: data.earningId,
        description: data.description,
        addedBy: data.addedBy || '',
        createdAt: data.createdAt || new Date().toISOString(),
      } as import('@/types').PoolContribution
    })
  } catch (error) {
    console.error('Error getting pool contributions:', error)
    return []
  }
}

// Delete a pool contribution (for admin manual adjustment)
export const deletePoolContribution = async (id: string): Promise<void> => {
  try {
    const contributionRef = doc(db, 'poolContributions', id)
    await deleteDoc(contributionRef)
    console.log('Pool contribution deleted:', id)
  } catch (error) {
    console.error('Error deleting pool contribution:', error)
    throw error
  }
}
 
// Manual pool adjustment (for admin to add/remove from pool)
export const adjustPoolManually = async (
  amount: number,
  description: string,
  addedBy: string,
  date?: string,
  source?: 'manual' | 'diversification'
): Promise<string> => {
  try {
    const contributionsRef = collection(db, 'poolContributions')
    // Determine source based on amount sign if not explicitly provided
    const contributionSource = source || (amount < 0 ? 'diversification' : 'manual')
    const result = await addDoc(contributionsRef, {
      amount: amount, // Keep the original sign (negative for diversifications)
      date: date || new Date().toISOString().split('T')[0],
      source: contributionSource,
      description,
      addedBy,
      createdAt: new Date().toISOString()
    })
    console.log('Manual pool adjustment added:', result.id, amount, contributionSource)
    return result.id
  } catch (error) {
    console.error('Error adding manual pool adjustment:', error)
    throw error
  }
}

// Rating
export const getRatingData = async (userId?: string) => {
  const ratingRef = collection(db, 'ratings')
  let q = query(ratingRef)

  if (userId) {
    q = query(q, where('userId', '==', userId))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc: any) => {
    const data = doc.data()
    return {
      id: doc.id,
      userId: data.userId || '',
      earnings: data.earnings || 0,
      messages: data.messages || 0,
      initiatives: data.initiatives || 0,
      signals: data.signals || 0,
      profitableSignals: data.profitableSignals || 0,
      referrals: data.referrals || 0,
      daysOff: data.daysOff || 0,
      sickDays: data.sickDays || 0,
      vacationDays: data.vacationDays || 0,
      absenceDays: data.absenceDays || 0,
      truancyDays: data.truancyDays || 0,
      internshipDays: data.internshipDays || 0,
      poolAmount: data.poolAmount || 0,
      rating: data.rating || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
    } as RatingData
  })
}

export const getWeeklyMessages = async (userId: string, weekStart: string, weekEnd: string): Promise<number> => {
  try {
    const messagesRef = collection(db, 'messages')
    // Filter by userId first, then filter by date in memory to avoid composite index requirement
    const q = query(messagesRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    // Filter by date range in memory
    const weeklyMessages = snapshot.docs.filter((doc: any) => {
      const data = doc.data()
      const date = data.date || ''
      return date >= weekStart && date <= weekEnd
    })

    return weeklyMessages.length
  } catch (error) {
    console.error('Error getting weekly messages:', error)
    // Fallback to ratings if messages collection doesn't exist yet
    const ratingRef = collection(db, 'ratings')
    const q = query(ratingRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return 0
    const data = snapshot.docs[0].data()
    return data.messages || 0
  }
}
 
export const updateRatingData = async (userId: string, data: Partial<RatingData>) => {
  const ratingRef = doc(db, 'ratings', userId)
  const ratingDoc = await getDoc(ratingRef)

  if (ratingDoc.exists()) {
    return await updateDoc(ratingRef, data)
  } else {
    return await addDoc(collection(db, 'ratings'), { userId, ...data })
  }
}

// Referrals
export const addReferral = async (referral: Omit<Referral, 'id'>) => {
  try {
    const referralsRef = collection(db, 'referrals')
    const cleanReferral = Object.fromEntries(
      Object.entries(referral).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('Adding referral:', cleanReferral)
    const result = await addDoc(referralsRef, cleanReferral)
    console.log('Referral added successfully:', result.id)

    return result
  } catch (error) {
    console.error('Error in addReferral:', error)
    throw error
  }
}

export const getReferrals = async (ownerId?: string, startDate?: string, endDate?: string) => {
  const referralsRef = collection(db, 'referrals')
  let q: ReturnType<typeof query>

  if (ownerId) {
    q = query(referralsRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'))
  } else {
    q = query(referralsRef, orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  let referrals = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as Omit<Referral, 'id'>
    return {
      id: docSnap.id,
      referralId: data.referralId,
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      name: data.name,
      age: data.age,
      phone: data.phone,
      email: data.email,
      messenger: data.messenger,
      messengerType: data.messengerType,
      source: data.source,
      referralCode: data.referralCode,
      createdAt: data.createdAt,
      comment: data.comment,
      status: data.status || 'pending',
    } as Referral
  })

  if (startDate && endDate) {
    referrals = referrals.filter((referral: Referral) => referral.createdAt >= startDate && referral.createdAt <= endDate)
  }

  return referrals.sort((a: Referral, b: Referral) => (a.createdAt < b.createdAt ? 1 : -1))
}

export const updateReferral = async (id: string, updates: Partial<Referral>) => {
  const referralRef = doc(db, 'referrals', id)

  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(referralRef, cleanUpdates)
}

export const deleteReferral = async (id: string) => {
  const referralRef = doc(db, 'referrals', id)
  await deleteDoc(referralRef)
}

// Get all referrals (for admin)
export const getAllReferrals = async (): Promise<Referral[]> => {
  const referralsRef = collection(db, 'referrals')
  const q = query(referralsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as any
    return {
      id: docSnap.id,
      referralId: data.referralId || '',
      ownerId: data.ownerId || '',
      ownerName: data.ownerName,
      name: data.name || '',
      age: data.age,
      phone: data.phone,
      email: data.email,
      messenger: data.messenger,
      messengerType: data.messengerType,
      source: data.source,
      referralCode: data.referralCode,
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
      comment: data.comment,
      statusChangedAt: data.statusChangedAt,
      inactiveSince: data.inactiveSince,
      deleteAt: data.deleteAt,
    } as Referral
  })
}

// Points Exchange functions
export interface PointsTransaction {
  id: string
  userId: string
  userName?: string
  amount: number // положительное = начисление, отрицательное = списание
  type: 'earned' | 'spent' | 'refunded'
  description?: string
  relatedApprovalId?: string
  createdAt: string
}

// Получить баланс баллов пользователя
export const getPointsBalance = async (userId: string): Promise<number> => {
  try {
    const transactionsRef = collection(db, 'pointsTransactions')
    const q = query(transactionsRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    
    let balance = 0
    snapshot.docs.forEach((doc: any) => {
      const data = doc.data()
      balance += data.amount || 0
    })
    
    return balance // Возвращаем реальный баланс (может быть отрицательным)
  } catch (error) {
    console.error('Error getting points balance:', error)
    return 0
  }
}

// Добавить транзакцию баллов
export const addPointsTransaction = async (
  userId: string,
  amount: number,
  type: 'earned' | 'spent' | 'refunded',
  description?: string,
  relatedApprovalId?: string,
  userName?: string
): Promise<void> => {
  try {
    const transactionsRef = collection(db, 'pointsTransactions')
    const transaction = {
      userId,
      userName,
      amount,
      type,
      description,
      relatedApprovalId,
      createdAt: new Date().toISOString(),
    }
    await addDoc(transactionsRef, transaction)
  } catch (error) {
    console.error('Error adding points transaction:', error)
    throw error
  }
}

// Списать баллы при создании заявки
export const spendPoints = async (
  userId: string,
  points: number,
  approvalId: string,
  userName?: string
): Promise<void> => {
  await addPointsTransaction(
    userId,
    -points,
    'spent',
    `Списание баллов за обмен на преимущество`,
    approvalId,
    userName
  )
}

// Вернуть баллы при отклонении заявки
export const refundPoints = async (
  userId: string,
  points: number,
  approvalId: string,
  userName?: string,
  partialAmount?: number // для частичного возврата
): Promise<void> => {
  const refundAmount = partialAmount !== undefined ? partialAmount : points
  await addPointsTransaction(
    userId,
    refundAmount,
    'refunded',
    partialAmount !== undefined 
      ? `Частичный возврат баллов (${partialAmount} из ${points})`
      : `Возврат баллов`,
    approvalId,
    userName
  )
}

// Подписка на изменения транзакций баллов пользователя
export const onPointsTransactionsChange = (
  userId: string,
  callback: (balance: number) => void
): (() => void) => {
  const transactionsRef = collection(db, 'pointsTransactions')
  const q = query(transactionsRef, where('userId', '==', userId))
  
  return onSnapshot(q, (snapshot) => {
    let balance = 0
    snapshot.docs.forEach((doc: any) => {
      const data = doc.data()
      balance += data.amount || 0
    })
    callback(balance) // Возвращаем реальный баланс (может быть отрицательным)
  })
}

// Подписка на изменения заявок пользователя
export const onUserApprovalRequestsChange = (
  userId: string,
  callback: (requests: ApprovalRequest[]) => void
): (() => void) => {
  const approvalsRef = collection(db, APPROVAL_COLLECTION)
  const q = query(approvalsRef, where('authorId', '==', userId))
  
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs
      .map(mapApprovalSnapshot)
      // Фильтруем заявки, удалённые пользователем
      .filter((r: ApprovalRequest) => !(r as any).deletedByUser)
    // Сортируем по дате создания (новые первые)
    results.sort((a: ApprovalRequest, b: ApprovalRequest) => b.createdAt.localeCompare(a.createdAt))
    callback(results)
  })
}

// Начислить баллы за активного реферала
export const awardReferralPoints = async (
  userId: string,
  points: number,
  referralId: string,
  referralName: string,
  userName?: string
): Promise<void> => {
  await addPointsTransaction(
    userId,
    points,
    'earned',
    `Реферал "${referralName}" стал активным (+${points} баллов)`,
    referralId,
    userName
  )
}

// Списать баллы при деактивации реферала
export const revokeReferralPoints = async (
  userId: string,
  points: number,
  referralId: string,
  referralName: string,
  userName?: string
): Promise<void> => {
  await addPointsTransaction(
    userId,
    -points,
    'spent',
    `Реферал "${referralName}" перестал быть активным (-${points} баллов)`,
    referralId,
    userName
  )
}

// Миграция: начислить баллы за всех существующих активных рефералов
export const migrateReferralPoints = async (): Promise<{ migrated: number; errors: string[] }> => {
  const POINTS_PER_REFERRAL = 10
  const errors: string[] = []
  let migrated = 0
  
  try {
    // Получаем всех рефералов
    const referralsRef = collection(db, 'referrals')
    const snapshot = await getDocs(referralsRef)
    
    // Фильтруем только активных
    const activeReferrals = snapshot.docs.filter((doc: any) => {
      const data = doc.data()
      return data.status === 'active'
    })
    
    console.log(`Found ${activeReferrals.length} active referrals to migrate`)
    
    // Получаем все существующие транзакции по рефералам
    const transactionsRef = collection(db, 'pointsTransactions')
    const allTransactions = await getDocs(transactionsRef)
    const processedReferralIds = new Set<string>()
    
    allTransactions.docs.forEach((doc: any) => {
      const data = doc.data()
      if (data.relatedApprovalId) {
        processedReferralIds.add(data.relatedApprovalId)
      }
    })
    
    // Начисляем баллы за каждого активного реферала, если ещё не начислено
    for (const doc of activeReferrals) {
      const referralId = doc.id
      const data = doc.data()
      
      // Пропускаем если уже обработан
      if (processedReferralIds.has(referralId)) {
        console.log(`Skipping ${referralId} - already processed`)
        continue
      }

      if (!data.ownerId) {
        errors.push(`Реферал ${referralId} не имеет ownerId`)
        continue
      }

      try {
        await awardReferralPoints(
          data.ownerId,
          POINTS_PER_REFERRAL,
          referralId,
          data.name || 'Реферал',
          data.ownerName
        )
        migrated++
        console.log(`Migrated: ${referralId} -> ${data.ownerId} (+${POINTS_PER_REFERRAL})`)
      } catch (err) {
        errors.push(`Ошибка для ${referralId}: ${err}`)
      }
    }
    
    console.log(`Migration complete: ${migrated} referrals migrated, ${errors.length} errors`)
    return { migrated, errors }
  } catch (error) {
    console.error('Migration error:', error)
    errors.push(`Общая ошибка: ${error}`)
    return { migrated, errors }
  }
}

// Ручное изменение баллов администратором
export const adjustPointsManually = async (
  userId: string,
  amount: number,
  reason: string,
  adminId: string,
  userName?: string
): Promise<void> => {
  const type = amount > 0 ? 'earned' : 'spent'
  const description = amount > 0 
    ? `Ручное начисление: ${reason}` 
    : `Ручное списание: ${reason}`
  
  await addPointsTransaction(
    userId,
    amount,
    type,
    description,
    `manual_${adminId}_${Date.now()}`,
    userName
  )
}

// Получить баланс всех пользователей
export const getAllUsersPointsBalances = async (): Promise<{ userId: string; userName?: string; balance: number }[]> => {
  try {
    const transactionsRef = collection(db, 'pointsTransactions')
    const snapshot = await getDocs(transactionsRef)
    
    const balances: Record<string, { userName?: string; balance: number }> = {}
    
    snapshot.docs.forEach((doc: any) => {
      const data = doc.data()
      const userId = data.userId
      
      if (!balances[userId]) {
        balances[userId] = { userName: data.userName, balance: 0 }
      }
      
      balances[userId].balance += data.amount || 0
      if (data.userName && !balances[userId].userName) {
        balances[userId].userName = data.userName
      }
    })
    
    return Object.entries(balances)
      .map(([userId, data]) => ({
        userId,
        userName: data.userName,
        balance: Math.max(0, data.balance)
      }))
      .sort((a, b) => b.balance - a.balance)
  } catch (error) {
    console.error('Error getting all users balances:', error)
    return []
  }
}

// Call (Trading Signal) functions
export const addCall = async (callData: Omit<Call, 'id'>): Promise<string> => {
  console.log('📝 Service site: Creating call:', {
    category: callData.category,
    userId: callData.userId,
    status: callData.status,
    createdAt: callData.createdAt
  })

  if (!db) {
    console.error('❌ Service site: Firestore db is not initialized')
    throw new Error('Firestore database is not initialized')
  }

  const callsRef = collection(db, 'calls')
  const docRef = await addDoc(callsRef, callData)

  console.log('✅ Service site: Call created successfully with ID:', docRef.id)
  console.log('📊 Service site: Call data saved to Firestore:', callData)

  return docRef.id
}

export const getCalls = async (filters?: {
  userId?: string
  category?: string
  riskLevel?: string
  status?: string
  activeOnly?: boolean
}): Promise<Call[]> => {
  const callsRef = collection(db, 'calls')

  // Build query constraints
  const constraints: any[] = []

  // Add userId filter if provided
  if (filters?.userId) {
    constraints.push(where('userId', '==', filters.userId))
  }

  // Add status filter if provided (don't combine with activeOnly status)
  if (filters?.status && !filters?.activeOnly) {
    constraints.push(where('status', '==', filters.status))
  }

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category))
  }

  // Add activeOnly filters
  if (filters?.activeOnly) {
    constraints.push(where('status', '==', 'active'))
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    constraints.push(where('createdAt', '>=', yesterday.toISOString()))
  }

  // Always add orderBy
  constraints.push(orderBy('createdAt', 'desc'))

  // Build query
  let q: ReturnType<typeof query>
  if (constraints.length > 0) {
    q = query(callsRef, ...constraints) as ReturnType<typeof query>
  } else {
    q = query(callsRef, orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  let calls = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    const category = (data.category as Call['category']) || 'memecoins'

    // Legacy compatibility: map flat fields into memecoin structure if details are absent
    const legacyMemecoin = (!data.details && data.ticker) ? {
      memecoins: {
        coinName: data.pair || data.ticker,
        ticker: data.ticker || '',
        network: data.network || 'solana',
        contract: data.contract,
        signalType: (data.sentiment || 'buy') as Call['sentiment'],
        reason: data.comment || data.risks || '',
        entryCap: data.entryPoint || '',
        targets: data.target || '',
        stopLoss: data.cancelConditions,
        riskLevel: data.riskLevel || 'medium',
        risks: data.risks || '',
        holdPlan: 'flip',
        liquidityLocked: false,
        traderComment: data.comment,
      }
    } : {}

    const details = (data.details as Call['details']) || legacyMemecoin || {}
    const riskLevel =
      (data.riskLevel as Call['riskLevel']) ||
      details.memecoins?.riskLevel ||
      details.polymarket?.riskLevel ||
      details.futures?.riskLevel

    const sentiment =
      (data.sentiment as Call['sentiment']) ||
      (details.futures?.direction === 'long' ? 'buy' : details.futures?.direction === 'short' ? 'sell' : undefined)

    return {
      id: doc.id,
      userId: data.userId || '',
      category,
      details,
      sentiment,
      riskLevel,
      comment: data.comment,
      createdAt: data.createdAt || new Date().toISOString(),
      status: data.status || 'active',
      maxProfit: data.maxProfit,
      currentPnL: data.currentPnL,
      currentMarketCap: data.currentMarketCap,
      signalMarketCap: data.signalMarketCap,
      currentPrice: data.currentPrice,
      entryPrice: data.entryPrice,
      tags: data.tags || [],
    } as Call
  })

  // Apply additional filters in memory
  if (filters?.category) {
    calls = calls.filter((c: Call) => c.category === filters.category)
  }
  if (filters?.riskLevel) {
    calls = calls.filter((c: Call) => c.riskLevel === filters.riskLevel)
  }

  // Filter by active (24 hours) if needed
  if (filters?.activeOnly && !filters.status) {
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    calls = calls.filter((c: Call) => {
      const createdAt = new Date(c.createdAt)
      return c.status === 'active' && createdAt >= yesterday
    })
  }

  return calls
}

export const updateCall = async (id: string, updates: Partial<Call>): Promise<void> => {
  const callRef = doc(db, 'calls', id)
  await updateDoc(callRef, updates as any)
}

// Временные лимиты по стратегиям (в часах)
const STRATEGY_DEADLINES: Record<string, number> = {
  flip: 24,           // 24 часа
  medium: 14 * 24,    // 14 дней
  long: 90 * 24,      // 90 суток
}

// Пороги завершения
const FULL_SUCCESS_THRESHOLD = 100 // 100% - немедленное завершение
const SUCCESS_THRESHOLD = 50 // 50% - успешное завершение по дедлайну

/**
 * Обновляет данные токена и рассчитывает профит для сигнала мемкоина
 * Логика завершения:
 * - 100%+ профит = сразу успешный (completed)
 * - Дедлайн истёк + профит >= 50% = успешный (completed)
 * - Дедлайн истёк + профит < 50% = неуспешный (cancelled)
 * - Убыток >= 90% = отменён (cancelled)
 * @param callId - ID сигнала
 * @param contractAddress - адрес контракта токена
 * @param autoCompleteThreshold - порог для автоматического завершения по прибыли (в процентах, по умолчанию 50)
 * @param autoCancelThreshold - порог для автоматической отмены по убытку (в процентах, по умолчанию -90)
 * @returns обновлённые данные сигнала или null
 */
export async function updateMemecoinCallData(
  callId: string,
  contractAddress: string,
  _autoCompleteThreshold: number = 50,
  _autoCancelThreshold: number = -90
): Promise<{ currentMarketCap: number; currentPnL: number; maxProfit: number; status?: string; tokenPair?: string; pairAddress?: string } | null> {
  try {
    // Импортируем функции из tokenPriceService
    const { fetchTokenPriceData, calculateProfitByMarketCap, updateMaxProfit } = await import('@/services/tokenPriceService')

    // Получаем текущий сигнал
    const callRef = doc(db, 'calls', callId)
    const callSnap = await getDoc(callRef)

    if (!callSnap.exists()) {
      console.error('Call not found:', callId)
      return null
    }

    const call = callSnap.data() as Call

    // Только для активных мемкоинов
    if (call.category !== 'memecoins' || call.status !== 'active') {
      return null
    }

    // Получаем текущие данные токена
    const tokenData = await fetchTokenPriceData(contractAddress)

    if (!tokenData) {
      console.error('Failed to fetch token data for:', contractAddress)
      return null
    }

    // Рассчитываем текущий PnL
    const currentPnL = call.signalMarketCap
      ? calculateProfitByMarketCap(tokenData.marketCap, call.signalMarketCap)
      : 0

    // Обновляем максимальный профит
    const newMaxProfit = updateMaxProfit(currentPnL, call.maxProfit)

    // Проверяем дедлайн
    const strategy = call.details?.memecoins?.holdPlan || 'medium'
    const deadlineHours = STRATEGY_DEADLINES[strategy] || STRATEGY_DEADLINES.medium
    const publishedAt = call.publishedAt ? new Date(call.publishedAt).getTime() : (call.createdAt ? new Date(call.createdAt).getTime() : Date.now())
    const now = Date.now()
    const hoursSincePublication = (now - publishedAt) / (1000 * 60 * 60)
    const isDeadlineExpired = hoursSincePublication >= deadlineHours

    // Проверяем, нужно ли автоматически завершить или отменить сигнал
    let newStatus: 'active' | 'completed' | 'cancelled' = 'active'
    let statusReason = ''

    // Логика завершения:
    // 1. Профит >= 100% = сразу успешный
    if (newMaxProfit >= FULL_SUCCESS_THRESHOLD) {
      newStatus = 'completed'
      statusReason = `profit reached ${newMaxProfit.toFixed(2)}% (100%+ threshold)`
      console.log(`🎯 Auto-completing call ${callId}: ${statusReason}`)
    }
    // 2. Дедлайн истёк
    else if (isDeadlineExpired) {
      if (newMaxProfit >= SUCCESS_THRESHOLD) {
        newStatus = 'completed'
        statusReason = `deadline reached (${deadlineHours}h), profit ${newMaxProfit.toFixed(2)}% >= 50%`
        console.log(`⏰ Auto-completing call ${callId}: ${statusReason}`)
      } else {
        newStatus = 'cancelled'
        statusReason = `deadline reached (${deadlineHours}h), profit ${newMaxProfit.toFixed(2)}% < 50%`
        console.log(`❌ Auto-cancelling call ${callId}: ${statusReason}`)
      }
    }

    // Обновляем сигнал
    const updates: Partial<Call> = {
      currentMarketCap: tokenData.marketCap,
      currentPrice: tokenData.priceUsd,
      currentPnL,
      maxProfit: newMaxProfit,
    }

    // Добавляем пару токена, если она есть и ещё не сохранена
    if (tokenData.tokenPair && !call.tokenPair) {
      updates.tokenPair = tokenData.tokenPair
    }

    // Добавляем статус и время закрытия, если они изменились
    if (newStatus !== call.status) {
      updates.status = newStatus
      // При закрытии сигнала сохраняем время закрытия
      updates.closedAt = new Date().toISOString()
    }

    await updateDoc(callRef, updates as any)

    console.log('Updated memecoin call data:', {
      callId,
      currentMarketCap: tokenData.marketCap,
      currentPnL,
      maxProfit: newMaxProfit,
      status: newStatus,
    })

    return {
      currentMarketCap: tokenData.marketCap,
      currentPnL,
      maxProfit: newMaxProfit,
      status: newStatus,
      tokenPair: tokenData.tokenPair,
      pairAddress: tokenData.pairAddress,
    }
  } catch (error) {
    console.error('Error updating memecoin call data:', error)
    return null
  }
}

export const deleteCall = async (id: string): Promise<void> => {
  const callRef = doc(db, 'calls', id)
  await deleteDoc(callRef)
}

/**
 * Автоматически удаляет старые закрытые/просроченные сигналы
 * Удаляет сигналы со статусом completed или cancelled, которые закрыты более чем hoursAgo часов назад
 * @param hoursAgo - количество часов, после которых удалять закрытые/просроченные сигналы (по умолчанию 3)
 * @returns количество удалённых сигналов
 */
export async function cleanupOldCalls(hoursAgo: number = 3): Promise<number> {
  try {
    console.log(`🧹 Starting cleanup of calls closed/expired more than ${hoursAgo} hours ago...`)

    const callsRef = collection(db, 'calls')

    // Получаем все завершённые и отменённые сигналы
    const q = query(
      callsRef,
      where('status', 'in', ['completed', 'cancelled'])
    )

    const snapshot = await getDocs(q)
    const now = new Date()
    const cutoffTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    let deletedCount = 0
    const callsToDelete: string[] = []

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as any
      const closedAt = data.closedAt ? new Date(data.closedAt) : null

      // Если есть closedAt и он старше cutoffTime
      if (closedAt && closedAt < cutoffTime) {
        callsToDelete.push(doc.id)
      }
      // Если closedAt нет, проверяем updatedAt (для обратной совместимости)
      else if (!closedAt && data.updatedAt) {
        const updatedAt = new Date(data.updatedAt)
        if (updatedAt < cutoffTime) {
          callsToDelete.push(doc.id)
        }
      }
    })

    // Удаляем найденные сигналы
    if (callsToDelete.length > 0) {
      await Promise.all(callsToDelete.map(id => deleteCall(id)))
      deletedCount = callsToDelete.length
      console.log(`✅ Cleaned up ${deletedCount} old calls`)
    } else {
      console.log(`✨ No old calls to clean up`)
    }

    return deletedCount
  } catch (error) {
    console.error('❌ Error cleaning up old calls:', error)
    return 0
  }
}

// Task functions
export const addTask = async (taskData: Omit<Task, 'id'>): Promise<string> => {
  const tasksRef = collection(db, 'tasks')
  const docRef = await addDoc(tasksRef, taskData)
  return docRef.id
}

export const getTasks = async (filters?: {
  assignedTo?: string | string[]
  category?: string
  status?: TaskStatus
  createdBy?: string
}): Promise<Task[]> => {
  const tasksRef = collection(db, 'tasks')

  const constraints: any[] = []

  if (filters?.status) {
    constraints.push(where('status', '==', filters.status))
  }

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category))
  }

  if (filters?.createdBy) {
    constraints.push(where('createdBy', '==', filters.createdBy))
  }

  constraints.push(orderBy('createdAt', 'desc'))

  let q: ReturnType<typeof query>
  if (constraints.length > 0) {
    q = query(tasksRef, ...constraints) as ReturnType<typeof query>
  } else {
    q = query(tasksRef, orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  const normalizePriority = (value: any): TaskPriority => {
    return value === 'high' || value === 'low' || value === 'urgent' ? value : 'medium'
  }

  const normalizeStatus = (value: any): TaskStatus => {
    return value === 'completed' || value === 'closed' || value === 'approval' || value === 'in_progress_rework' ? value : 'in_progress'
  }

  const normalizeStageAssignees = (assignees: any[] = []): StageAssignee[] =>
    assignees
      .filter((a: any) => a?.userId)
      .slice(0, 10)
      .map((a) => ({
        userId: a.userId,
        priority: normalizePriority(a.priority),
        comment: a.comment,
        instruction: a.instruction,
      }))

  let tasks = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    const rawAssignees = Array.isArray(data.assignees)
      ? data.assignees
      : (data.assignedTo || []).map((userId: string) => ({ userId, priority: 'medium' }))
    const normalizedAssignees = (rawAssignees || [])
      .map((assignee: any) => ({
        userId: assignee.userId || '',
        priority: normalizePriority(assignee.priority),
        comment: assignee.comment,
      }))
      .filter((assignee: any) => !!assignee.userId)
    const assignedIds = normalizedAssignees.map((assignee: any) => assignee.userId)
    const normalizedStages = (data.stages || []).map((stage: any) => ({
      id: stage.id || `stage - ${Date.now()} `,
      name: stage.name || 'Этап',
      description: stage.description,
      responsible: stage.responsible === 'all' ? 'all' : Array.isArray(stage.responsible) ? stage.responsible : (stage.assignees || []).map((a: any) => a.userId),
      assignees: normalizeStageAssignees(stage.assignees),
      stagePriority: normalizePriority(stage.stagePriority),
      requiresApproval: stage.requiresApproval ?? true,
      approvals: stage.approvals || [],
      comments: stage.comments || [],
      status: stage.status || 'pending',
    }))
    return {
      id: doc.id,
      title: data.title || '',
      description: data.description,
      category: data.category || 'trading',
      status: normalizeStatus(data.status),
      createdBy: data.createdBy || '',
      assignedTo: assignedIds,
      coExecutors: data.coExecutors || [],
      assignees: normalizedAssignees,
      approvals: data.approvals || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      completedAt: data.completedAt,
      closedAt: data.closedAt,
      completedBy: data.completedBy,
      priority: normalizePriority(data.priority),
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      dueTime: data.dueTime || '12:00',
      originalDueDate: data.originalDueDate,
      originalDueTime: data.originalDueTime,
      startTime: data.startTime,
      mainExecutor: data.mainExecutor,
      leadExecutor: data.leadExecutor,
      deputies: data.deputies || [],
      executors: data.executors || [],
      curators: data.curators || [],
      leads: data.leads || [],
      stages: normalizedStages,
      currentStageId: data.currentStageId,
      awaitingStageId: data.awaitingStageId,
      comments: data.comments || [],
      expectedResult: data.expectedResult,
      requiresApproval: data.requiresApproval ?? true,
      // Отчёт
      report: data.report,
      // Согласование
      approvalStartedAt: data.approvalStartedAt,
      // Доработка
      reworkComment: data.reworkComment,
      // Продление дедлайна
      deadlineExtensions: data.deadlineExtensions || 0,
      lastExtensionAt: data.lastExtensionAt,
      // Архив
      archivedAt: data.archivedAt,
      archiveDeleteAt: data.archiveDeleteAt,
    } as Task
  })

  // Auto-delete tasks that have been closed for more than 12 hours
  const now = new Date()
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)

  const tasksToDelete = tasks.filter((task: Task) => {
    if (task.status === 'closed' && task.closedAt) {
      const closedDate = new Date(task.closedAt)
      return closedDate < twelveHoursAgo
    }
    return false
  })

  // Delete old closed tasks
  if (tasksToDelete.length > 0) {
    await Promise.all(tasksToDelete.map((task: Task) => deleteTask(task.id)))
    // Remove deleted tasks from the list
    tasks = tasks.filter((task: Task) => !tasksToDelete.find((t: any) => t.id === task.id))
  }

  // Apply assignedTo filter in memory (array-contains doesn't work well with multiple users)
  if (filters?.assignedTo) {
    if (Array.isArray(filters.assignedTo)) {
      const selected = filters.assignedTo
      if (selected.length > 0) {
        tasks = tasks.filter((t: Task) => selected.some((userId) => t.assignedTo.includes(userId)))
      }
    } else {
      tasks = tasks.filter((t: Task) => t.assignedTo.includes(filters.assignedTo as string))
    }
  }

  return tasks
}

export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', id)
  // Remove undefined fields to avoid Firestore errors
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(taskRef, cleanUpdates as any)
}

export const deleteTask = async (id: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', id)
  await deleteDoc(taskRef)
}

// Notes (user + admin visibility)
export const getUserNotes = async (userId?: string, includeAllForAdmin: boolean = false): Promise<Note[]> => {
  const notesRef = collection(db, 'notes')
  let q: ReturnType<typeof query>

  if (!includeAllForAdmin && userId) {
    q = query(notesRef, where('userId', '==', userId))
  } else {
    q = query(notesRef)
  }

  const snapshot = await getDocs(q)
  const notes = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as any
    return {
      id: docSnap.id,
      userId: data.userId || '',
      title: data.title || '',
      text: data.text || '',
      priority: data.priority === 'low' || data.priority === 'high' ? data.priority : 'medium',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Note
  })

  notes.sort((a: Note, b: Note) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  if (userId && !includeAllForAdmin) {
    return notes.filter((n: Note) => n.userId === userId)
  }
  return notes
}

export const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const notesRef = collection(db, 'notes')
  const payload = {
    ...note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const res = await addDoc(notesRef, payload)
  return res.id
}

export const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'userId'>>): Promise<void> => {
  const noteRef = doc(db, 'notes', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(noteRef, cleanUpdates as any)
}

export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, 'notes', id)
  await deleteDoc(noteRef)
}

// User Nickname management
export const getUserNickname = async (userId: string): Promise<UserNickname | null> => {
  const nicknamesRef = collection(db, 'userNicknames')
  const q = query(nicknamesRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return null

  const data = snapshot.docs[0].data() as any
  return {
    id: snapshot.docs[0].id,
    userId: data.userId || '',
    nickname: data.nickname || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  }
}

export const getUserNicknameValue = async (userId: string): Promise<string | null> => {
  const userNickname = await getUserNickname(userId)
  return userNickname?.nickname || null
}

export const setUserNickname = async (userId: string, nickname: string): Promise<string> => {
  const nicknamesRef = collection(db, 'userNicknames')
  const existing = await getUserNickname(userId)
  const now = new Date().toISOString()

  if (existing) {
    const ref = doc(db, 'userNicknames', existing.id)
    await updateDoc(ref, {
      nickname,
      updatedAt: now,
    })
    return existing.id
  } else {
    const res = await addDoc(nicknamesRef, {
      userId,
      nickname,
      createdAt: now,
      updatedAt: now,
    })
    return res.id
  }
}

export const deleteUserNickname = async (userId: string): Promise<void> => {
  const existing = await getUserNickname(userId)
  if (existing) {
    await deleteDoc(doc(db, 'userNicknames', existing.id))
  }
}

// User Conflicts
export const getUserConflicts = async (userId?: string, isActive?: boolean): Promise<UserConflict[]> => {
  const conflictsRef = collection(db, 'userConflicts')
  let q: ReturnType<typeof query>

  if (userId && isActive !== undefined) {
    q = query(conflictsRef, where('isActive', '==', isActive), where('userId', '==', userId))
  } else if (userId) {
    q = query(conflictsRef, where('userId', '==', userId))
  } else if (isActive !== undefined) {
    q = query(conflictsRef, where('isActive', '==', isActive))
  } else {
    q = query(conflictsRef)
  }

  const snapshot: any = await getDocs(q)
  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      restrictedUserId: data?.restrictedUserId || '',
      reason: data?.reason || '',
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      isActive: data?.isActive ?? true
    } as UserConflict
  })
}

export const addUserConflict = async (conflict: Omit<UserConflict, 'id'>) => {
  const conflictsRef = collection(db, 'userConflicts')
  const result = await addDoc(conflictsRef, conflict)
  return result
}

export const updateUserConflict = async (id: string, updates: Partial<UserConflict>) => {
  const conflictRef = doc(db, 'userConflicts', id)
  await updateDoc(conflictRef, updates)
}

export const deleteUserConflict = async (id: string) => {
  const conflictRef = doc(db, 'userConflicts', id)
  await deleteDoc(conflictRef)
}

// Access Blocks
export const getAccessBlocks = async (userId?: string, isActive?: boolean): Promise<AccessBlock[]> => {
  const blocksRef = collection(db, 'accessBlocks')
  let q: ReturnType<typeof query>

  // First get all active blocks, then filter in memory for null userId
  // This is because Firestore doesn't support filtering by null values easily
  if (isActive !== undefined) {
    q = query(blocksRef, where('isActive', '==', isActive))
  } else {
    q = query(blocksRef)
  }

  const snapshot: any = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId,
      userIds: data?.userIds || [],
      targetType: data?.targetType || (data?.userId ? 'single' : 'all'),
      reason: data?.reason || 'Администратор не указал причину',
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      expiresAt: data?.expiresAt,
      isActive: data?.isActive ?? true,
      blockFeatures: data?.blockFeatures || []
    } as AccessBlock
  })

  // Filter in memory based on userId
  if (userId) {
    // Return blocks targeting this specific user OR subsets they are in OR general blocks
    results = results.filter((block: AccessBlock) =>
      block.targetType === 'all' ||
      (block.targetType === 'single' && block.userId === userId) ||
      (block.targetType === 'subset' && block.userIds?.includes(userId))
    )
  } else {
    // Return only general blocks (targetType 'all')
    results = results.filter((block: AccessBlock) => block.targetType === 'all')
  }
    
  return results
}

// Get ALL access blocks (for admin panel - shows both general and user-specific)
export const getAllAccessBlocks = async (isActive?: boolean): Promise<AccessBlock[]> => {
  const blocksRef = collection(db, 'accessBlocks')
  let q: ReturnType<typeof query>

  if (isActive !== undefined) {
    q = query(blocksRef, where('isActive', '==', isActive))
  } else {
    q = query(blocksRef)
  }

  const snapshot: any = await getDocs(q)
  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId,
      userIds: data?.userIds || [],
      targetType: data?.targetType || (data?.userId ? 'single' : 'all'),
      reason: data?.reason || 'Администратор не указал причину',
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      expiresAt: data?.expiresAt,
      isActive: data?.isActive ?? true,
      blockFeatures: data?.blockFeatures || []
    } as AccessBlock
  })
}

export const addAccessBlock = async (block: Omit<AccessBlock, 'id'>) => {
  const blocksRef = collection(db, 'accessBlocks')
  const result = await addDoc(blocksRef, block)
  return result
}

export const updateAccessBlock = async (id: string, updates: Partial<AccessBlock>) => {
  const blockRef = doc(db, 'accessBlocks', id)
  await updateDoc(blockRef, updates)
}

export const deleteAccessBlock = async (id: string) => {
  const blockRef = doc(db, 'accessBlocks', id)
  await deleteDoc(blockRef)
}

// Check if user has access to a specific feature
export const checkUserAccess = async (userId: string, feature: string): Promise<{ hasAccess: boolean; reason?: string; expiresAt?: string }> => {
  try {
    // Unified check for any applicable active blocks
    const allBlocks = await getAllAccessBlocks(true)

    // Sort blocks: site-wide 'all' first, then section blocks
    const sortedBlocks = allBlocks.filter(b => b.isActive).sort((a, b) => {
      if (a.blockFeatures.includes('all')) return -1
      if (b.blockFeatures.includes('all')) return 1
      return 0
    })

    for (const block of sortedBlocks) {
      // Check if block applies to this user
      const isTargeted =
        block.targetType === 'all' ||
        (block.targetType === 'single' && block.userId === userId) ||
        (block.targetType === 'subset' && block.userIds?.includes(userId))

      if (!isTargeted) continue

      // Check if block is expired
      if (block.expiresAt && new Date(block.expiresAt) < new Date()) {
        await updateAccessBlock(block.id, { isActive: false })
        continue
      }

      // 1. Site-wide block
      if (block.blockFeatures.includes('all')) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // 2. Specific feature block (exact match)
      if (block.blockFeatures.includes(feature as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // 3. Section-level blocks (parent blocks) - проверяем если заблокирован parent, то блокируются и все children
      const parents: Record<string, string[]> = {
        'tools': ['tools_events', 'tools_kontur', 'tools_strategies_view', 'tools_items_view'],
        'tools_kontur': ['tools_kontur_memecoins', 'tools_kontur_memecoins_trading', 'tools_kontur_memecoins_deving', 'tools_kontur_polymarket', 'tools_kontur_nft', 'tools_kontur_staking', 'tools_kontur_spot', 'tools_kontur_futures', 'tools_kontur_airdrop', 'tools_kontur_digital_payments', 'tools_kontur_prop_trading', 'tools_kontur_other'],
        // Иерархия для мемкоинов (общая -> trading/deving)
        'tools_kontur_memecoins': ['tools_kontur_memecoins_trading', 'tools_kontur_memecoins_deving'],
        // Иерархия для HUB категорий
        'hub_signals_cat_memecoins': ['hub_signals_cat_memecoins'],
        'hub_signals_cat_polymarket': ['hub_signals_cat_polymarket'],
        'hub_signals_cat_nft': ['hub_signals_cat_nft'],
        'hub_signals_cat_spot': ['hub_signals_cat_spot'],
        'hub_signals_cat_futures': ['hub_signals_cat_futures'],
        'hub_signals_cat_staking': ['hub_signals_cat_staking'],
        'hub_signals_cat_airdrop': ['hub_signals_cat_airdrop'],
        'ava_hub': ['hub_signals_add', 'hub_signals_view', 'hub_signals_cat_memecoins', 'hub_signals_cat_polymarket', 'hub_signals_cat_nft', 'hub_signals_cat_spot', 'hub_signals_cat_futures', 'hub_signals_cat_staking', 'hub_signals_cat_airdrop'],
        'ava_schedule': ['schedule_stats_view', 'schedule_view', 'schedule_add_slot', 'schedule_status_edit', 'schedule_slot_delete'],
        'ava_tasks': ['tasks_add', 'tasks_view'],
        'ava_profit': ['profit_add', 'profit_stats_view', 'profit_leaders_view', 'profit_history_view', 'profit_insights_view', 'profit_cat_memecoins', 'profit_cat_futures', 'profit_cat_nft', 'profit_cat_spot', 'profit_cat_airdrop', 'profit_cat_polymarket', 'profit_cat_staking', 'profit_cat_other', 'profit_wallet_general', 'profit_wallet_personal', 'profit_wallet_pool'],
        'ava_rating': ['rating_others_view', 'rating_self_view', 'rating_specific_view'],
        // Legacy parents
        'slots': ['schedule_stats_view', 'schedule_view', 'schedule_add_slot', 'schedule_status_edit', 'schedule_slot_delete'],
        'earnings': ['profit_add', 'profit_stats_view', 'profit_leaders_view', 'profit_history_view', 'profit_insights_view'],
        'tasks': ['tasks_add', 'tasks_view'],
        'rating': ['rating_others_view', 'rating_self_view', 'rating_specific_view'],
        'about': ['ava_info'],
        // Новые категории меню (верхний уровень)
        'ava_traders_lounge': ['ava_hub', 'ava_trader_diary', 'tools_strategies', 'ava_realtime_chart'],
        'ava_planner_dashboard': ['ava_schedule', 'ava_tasks', 'tools_events', 'tools_challenges', 'tools_initiatives', 'ava_rating', 'ava_referrals'],
        'ava_reward_centre': ['ava_profit', 'ava_community_fund', 'ava_team_fund', 'ava_payments', 'ava_cards_crypto'],
        'ava_analytics_reports': ['tools_applications', 'tools_sales_analytics'],
        'ava_arca_info': ['ava_faq', 'ava_info', 'ava_feedback'],
        // Quick Access (верхнее меню)
        'ava_quick_access': ['ava_converter', 'ava_communication'],
        'ava_converter': [],
        'ava_communication': [],
        'ava_realtime_chart': [],
        'ava_cards_crypto': [],
        'ava_feedback': [],
      }

      for (const [parent, children] of Object.entries(parents)) {
        // Проверяем: если заблокирован parent (blockFeatures содержит parent) И запрашиваемая feature является child
        if (block.blockFeatures.includes(parent as any) && children.includes(feature)) {
          return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
        }
      }

      // 4. Обратная проверка: если запрашиваемая feature заблокирована, проверить её категорию-родителя
      // Создаем обратную карту: child -> parent
      const childToParent: Record<string, string> = {}
      for (const [parent, children] of Object.entries(parents)) {
        for (const child of children) {
          childToParent[child] = parent
        }
      }

      // Если запрашиваемая feature имеет родителя, проверить не заблокирован ли родитель
      const parentFeature = childToParent[feature]
      if (parentFeature && block.blockFeatures.includes(parentFeature as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }
    }

    return { hasAccess: true, reason: undefined, expiresAt: undefined }
  } catch (error) {
    console.error('Error checking user access:', error)
    return { hasAccess: true, reason: undefined, expiresAt: undefined } // Default to allow access on error
  }
}


// AI - AO Alerts
export const getAiAlerts = async (): Promise<AiAlert[]> => {
  const alertsRef = collection(db, 'aiAlerts')
  const q = query(alertsRef, orderBy('createdAt', 'desc'))
  const querySnapshot: any = await getDocs(q) // Corrected from usersRef to q
  return querySnapshot.docs.map((docSnap: any) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as AiAlert)) // Corrected type to AiAlert
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId)
  const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User
  }
  return null
}

// User Management Functions
export const getAllUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, 'users')
  const snapshot = await getDocs(usersRef)
  // Sort in memory to avoid composite index requirement
  const users = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as User))
  return users.sort((a, b) => a.name.localeCompare(b.name))
}

export const addUser = async (user: Omit<User, 'id'>): Promise<string> => {
  const usersRef = collection(db, 'users')
  const cleanUser = Object.fromEntries(
    Object.entries(user).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(usersRef, cleanUser)
  return result.id
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await setDoc(userRef, cleanUpdates, { merge: true })
}

// Update user email
export const updateUserEmail = async (userId: string, email: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { email })
}

// Update user phone
export const updateUserPhone = async (userId: string, phone: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { phone })
}

// Update user login
export const updateUserLogin = async (userId: string, login: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { login })
}

// Update user password
export const updateUserPassword = async (userId: string, password: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { password })
}

// Update user recovery code
export const updateUserRecoveryCode = async (userId: string, recoveryCode: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { recoveryCode })
}

// Update user auth code
export const updateUserAuthCode = async (userId: string, authCode: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { authCode })
}

// Update user positions (team status)
export const updateUserPositions = async (userId: string, positions: string[], primaryPosition?: string): Promise<void> => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { 
    positions,
    primaryPosition: primaryPosition || positions[0]
  })
}

export const deleteUser = async (userId: string): Promise<void> => {
  logger.log(`[deleteUser] Starting deletion for user: ${userId}`)

  // Delete all user-related data from Firestore
  const collectionsToClean = [
    { name: 'workSlots', field: 'userId' },
    { name: 'workSlots', field: 'participants' }, // slots where user is a participant
    { name: 'dayStatuses', field: 'userId' },
    { name: 'earnings', field: 'userId' },
    { name: 'earnings', field: 'participants' }, // earnings where user is a participant
    { name: 'ratings', field: 'userId' },
    { name: 'tasks', field: 'createdBy' },
    { name: 'tasks', field: 'assignedTo' },
    { name: 'userNicknames', field: 'userId' },
    { name: 'notes', field: 'userId' },
    { name: 'messages', field: 'userId' },
    { name: 'userConflicts', field: 'userId' },
    { name: 'userConflicts', field: 'restrictedUserId' },
    { name: 'accessBlocks', field: 'userId' },
  ]

  // Get all user documents across collections
  const userDocIds = new Set<string>()

  for (const { name, field } of collectionsToClean) {
    try {
      const collRef = collection(db, name)
      const q = query(collRef, where(field, '==', userId))
      const snapshot = await getDocs(q)
      snapshot.docs.forEach((doc) => userDocIds.add(doc.id))
    } catch (error) {
      logger.error(`[deleteUser] Error querying ${name}.${field}:`, error)
    }
  }

  // Delete all found documents
  for (const docId of userDocIds) {
    try {
      // Determine which collection the document belongs to
      for (const { name } of collectionsToClean) {
        try {
          const docRef = doc(db, name, docId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            await deleteDoc(docRef)
            logger.log(`[deleteUser] Deleted ${name}/${docId}`)
            break // Document deleted, move to next
          }
        } catch (e) {
          // Document might not exist in this collection, continue
        }
      }
    } catch (error) {
      logger.error(`[deleteUser] Error deleting document ${docId}:`, error)
    }
  }

  // Finally delete the user document itself
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    await deleteDoc(userRef)
    logger.log(`[deleteUser] Deleted user document: ${userId}`)
  }

  logger.log(`[deleteUser] Completed deletion for user: ${userId}`)
}

export const addAiAlert = async (alert: Omit<AiAlert, 'id'>) => {
  const alertsRef = collection(db, 'aiAlerts')
  const cleanAlert = Object.fromEntries(
    Object.entries(alert).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(alertsRef, cleanAlert)
  return result
}

export const updateAiAlert = async (id: string, updates: Partial<AiAlert>) => {
  const alertRef = doc(db, 'aiAlerts', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(alertRef, cleanUpdates)
}

export const deleteAiAlert = async (id: string) => {
  const alertRef = doc(db, 'aiAlerts', id)
  await deleteDoc(alertRef)
}

// Signals Trigger Bot (independent collection)
export const getTriggerAlerts = async (): Promise<TriggerAlert[]> => {
  const alertsRef = collection(db, 'triggerAlerts')
  const q = query(alertsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as TriggerAlert))
}

export const addTriggerAlert = async (alert: Omit<TriggerAlert, 'id'>) => {
  const alertsRef = collection(db, 'triggerAlerts')
  const cleanAlert = Object.fromEntries(
    Object.entries(alert).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(alertsRef, cleanAlert)
  return result
}

export const updateTriggerAlert = async (id: string, updates: Partial<TriggerAlert>) => {
  const alertRef = doc(db, 'triggerAlerts', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(alertRef, cleanUpdates)
}

export const deleteTriggerAlert = async (id: string) => {
  const alertRef = doc(db, 'triggerAlerts', id)
  await deleteDoc(alertRef)
}

// Fasol Signals Strategy (independent collection)
export const getFasolTriggerAlerts = async (): Promise<FasolTriggerAlert[]> => {
  const alertsRef = collection(db, 'fasolTriggerAlerts')
  const q = query(alertsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as FasolTriggerAlert))
}

export const addFasolTriggerAlert = async (alert: Omit<FasolTriggerAlert, 'id'>) => {
  const alertsRef = collection(db, 'fasolTriggerAlerts')
  const cleanAlert = Object.fromEntries(
    Object.entries(alert).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(alertsRef, cleanAlert)
  return result
}

export const updateFasolTriggerAlert = async (id: string, updates: Partial<FasolTriggerAlert>) => {
  const alertRef = doc(db, 'fasolTriggerAlerts', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(alertRef, cleanUpdates)
}

export const deleteFasolTriggerAlert = async (id: string) => {
  const alertRef = doc(db, 'fasolTriggerAlerts', id)
  await deleteDoc(alertRef)
}

// ================================
// Learning Platform - Lessons
// ================================

const LESSONS_COLLECTION = 'lessons'

// Map Firestore document to Lesson type
const mapLessonSnapshot = (docSnap: any): Lesson => {
  const data = docSnap.data() || {}
  return {
    id: docSnap.id,
    topicId: data.topicId || 'memecoins',
    lessonNumber: data.lessonNumber || 1,
    title: data.title || 'Без названия',
    videoUrl: data.videoUrl,
    videoFileName: data.videoFileName,
    youtubeUrl: data.youtubeUrl,
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    videos: data.videos || [],
    files: data.files || [],
    youtubeUrls: data.youtubeUrls || (data.youtubeUrl ? [data.youtubeUrl] : []),
    comment: data.comment,
    resources: data.resources || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    createdBy: data.createdBy,
  }
}

// Get all lessons
export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessonsRef = collection(db, LESSONS_COLLECTION)
  // Get all lessons without ordering to avoid composite index requirement
  // We'll sort in memory instead
  const snapshot = await getDocs(lessonsRef)

  const lessons = snapshot.docs.map(mapLessonSnapshot)

  // Sort by topicId, then by lessonNumber
  return lessons.sort((a, b) => {
    if (a.topicId !== b.topicId) {
      return a.topicId.localeCompare(b.topicId)
    }
    return a.lessonNumber - b.lessonNumber
  })
}

// Get lessons by topic
export const getLessonsByTopic = async (topicId: LessonTopic): Promise<Lesson[]> => {
  // First filter by topic, then sort by lessonNumber
  const allLessons = await getAllLessons()
  return allLessons.filter(lesson => lesson.topicId === topicId)
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
}

// Get a single lesson by ID
export const getLessonById = async (id: string): Promise<Lesson | null> => {
  const lessonRef = doc(db, LESSONS_COLLECTION, id)
  const docSnap = await getDoc(lessonRef)

  if (!docSnap.exists()) return null
  return mapLessonSnapshot(docSnap)
}

// Add a new lesson
export const addLesson = async (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const lessonsRef = collection(db, LESSONS_COLLECTION)
  const now = new Date().toISOString()

  const cleanLesson = Object.fromEntries(
    Object.entries({
      ...lesson,
      createdAt: now,
      updatedAt: now,
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )

  const result = await addDoc(lessonsRef, cleanLesson)
  return result.id
}

// Update a lesson
export const updateLesson = async (id: string, updates: Partial<Omit<Lesson, 'id'>>): Promise<void> => {
  const lessonRef = doc(db, LESSONS_COLLECTION, id)

  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )

  await updateDoc(lessonRef, cleanUpdates)
}

// Delete a lesson
export const deleteLesson = async (id: string): Promise<void> => {
  const lessonRef = doc(db, LESSONS_COLLECTION, id)
  await deleteDoc(lessonRef)
}

// ================================
// Trader's Diary Module
// ================================

const TRADES_COLLECTION = 'trades'
const TRADE_SETUPS_COLLECTION = 'tradeSetups'

// Map Firestore document to Trade type
const mapTradeSnapshot = (docSnap: any): Trade => {
  const data = docSnap.data() || {}
  return {
    id: docSnap.id,
    userId: data.userId || '',
    entryDate: data.entryDate || '',
    ticker: data.ticker || '',
    marketType: data.marketType || 'memecoins',
    direction: data.direction || 'long',
    entryPrice: data.entryPrice || 0,
    exitPrice: data.exitPrice || 0,
    positionSize: data.positionSize || 0,
    stopLoss: data.stopLoss || 0,
    takeProfit: data.takeProfit || 0,
    commission: data.commission || 0,
    pnl: data.pnl || 0,
    rr: data.rr,
    screenshots: data.screenshots || [],
    setup: data.setup,
    setupTemplateId: data.setupTemplateId,
    emotionalState: data.emotionalState,
    emotionalComment: data.emotionalComment,
    tradePlanCompliance: data.tradePlanCompliance,
    entryReason: data.entryReason,
    exitReason: data.exitReason,
    errors: data.errors,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  } as Trade
}

// Get all trades for a user
export const getTrades = async (userId: string, filters?: {
  startDate?: string
  endDate?: string
  marketType?: TradeMarketType
  direction?: TradeDirection
  ticker?: string
}): Promise<Trade[]> => {
  const tradesRef = collection(db, TRADES_COLLECTION)
  // Get all trades for this user, then filter in memory
  const q = query(tradesRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  let trades = snapshot.docs.map(mapTradeSnapshot)

  // Apply filters in memory
  if (filters?.startDate) {
    trades = trades.filter(t => t.entryDate >= filters.startDate!)
  }
  if (filters?.endDate) {
    trades = trades.filter(t => t.entryDate <= filters.endDate!)
  }
  if (filters?.marketType) {
    trades = trades.filter(t => t.marketType === filters.marketType)
  }
  if (filters?.direction) {
    trades = trades.filter(t => t.direction === filters.direction)
  }
  if (filters?.ticker) {
    trades = trades.filter(t => t.ticker.toLowerCase().includes(filters.ticker!.toLowerCase()))
  }

  // Sort by entry date descending
  trades.sort((a, b) => b.entryDate.localeCompare(a.entryDate))

  return trades
}

// Get a single trade by ID
export const getTradeById = async (id: string): Promise<Trade | null> => {
  const tradeRef = doc(db, TRADES_COLLECTION, id)
  const docSnap = await getDoc(tradeRef)

  if (!docSnap.exists()) return null
  return mapTradeSnapshot(docSnap)
}

// Add a new trade
export const addTrade = async (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const tradesRef = collection(db, TRADES_COLLECTION)
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

// Update a trade
export const updateTrade = async (id: string, updates: Partial<Trade>): Promise<void> => {
  const tradeRef = doc(db, TRADES_COLLECTION, id)

  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )

  await updateDoc(tradeRef, cleanUpdates)
}

// Delete a trade
export const deleteTrade = async (id: string): Promise<void> => {
  const tradeRef = doc(db, TRADES_COLLECTION, id)
  await deleteDoc(tradeRef)
}

// Get trade statistics for a user
export const getTradeStats = async (userId: string, startDate?: string, endDate?: string): Promise<{
  totalTrades: number
  winningTrades: number
  losingTrades: number
  totalPnl: number
  winRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  byMarketType: Record<TradeMarketType, { trades: number; pnl: number; wins: number }>
}> => {
  const filters: { startDate?: string; endDate?: string } = {}
  if (startDate) filters.startDate = startDate
  if (endDate) filters.endDate = endDate

  const trades = await getTrades(userId, filters)

  const winningTrades = trades.filter(t => t.pnl > 0)
  const losingTrades = trades.filter(t => t.pnl < 0)
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0)
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0
  const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0

  // Group by market type
  const byMarketType: Record<TradeMarketType, { trades: number; pnl: number; wins: number }> = {
    memecoins: { trades: 0, pnl: 0, wins: 0 },
    polymarket: { trades: 0, pnl: 0, wins: 0 },
    spot: { trades: 0, pnl: 0, wins: 0 },
    futures: { trades: 0, pnl: 0, wins: 0 },
    prop_trading: { trades: 0, pnl: 0, wins: 0 },
    nft: { trades: 0, pnl: 0, wins: 0 },
    airdrop: { trades: 0, pnl: 0, wins: 0 },
    staking: { trades: 0, pnl: 0, wins: 0 },
  }

  for (const trade of trades) {
    const mt = trade.marketType
    byMarketType[mt].trades++
    byMarketType[mt].pnl += trade.pnl
    if (trade.pnl > 0) byMarketType[mt].wins++
  }

  return {
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    totalPnl,
    winRate,
    avgWin,
    avgLoss,
    profitFactor: profitFactor === Infinity ? 999 : profitFactor,
    byMarketType,
  }
}

// Trade Setup Templates
export const getTradeSetups = async (userId: string): Promise<TradeSetupTemplate[]> => {
  const setupsRef = collection(db, TRADE_SETUPS_COLLECTION)
  const q = query(setupsRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() || {}
    return {
      id: docSnap.id,
      userId: data.userId || '',
      name: data.name || '',
      description: data.description || '',
      createdAt: data.createdAt || new Date().toISOString(),
    } as TradeSetupTemplate
  })
}

export const addTradeSetup = async (setup: Omit<TradeSetupTemplate, 'id' | 'createdAt'>): Promise<string> => {
  const setupsRef = collection(db, TRADE_SETUPS_COLLECTION)
  const now = new Date().toISOString()

  const result = await addDoc(setupsRef, {
    ...setup,
    createdAt: now,
  })
  return result.id
}

export const updateTradeSetup = async (id: string, updates: Partial<TradeSetupTemplate>): Promise<void> => {
  const setupRef = doc(db, TRADE_SETUPS_COLLECTION, id)
  await updateDoc(setupRef, updates)
}

export const deleteTradeSetup = async (id: string): Promise<void> => {
  const setupRef = doc(db, TRADE_SETUPS_COLLECTION, id)
  await deleteDoc(setupRef)
}

// ================================
// User Sessions (Firestore)
// ================================

const SESSIONS_COLLECTION = 'sessions'
const SESSION_RETENTION_HOURS = 48
const MAX_SESSIONS_PER_USER = 12

// Get all sessions for a user from Firestore
export const getSessions = async (userId: string): Promise<UserSession[]> => {
  const sessionsRef = collection(db, SESSIONS_COLLECTION)
  const q = query(sessionsRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  const sessions = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId || '',
      browser: data.browser || '',
      device: data.device || '',
      deviceModel: data.deviceModel || '',
      os: data.os || '',
      loginAt: data.loginAt || '',
      city: data.city || '',
      isCurrent: data.isCurrent ?? false,
    } as UserSession
  })

  // Sort by loginAt descending (newest first)
  sessions.sort((a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime())

  return sessions
}

// Add a new session to Firestore
export const addSession = async (session: Omit<UserSession, 'id'>): Promise<string> => {
  const sessionsRef = collection(db, SESSIONS_COLLECTION)

  // First, get existing sessions to check the limit
  const existingSessions = await getSessions(session.userId)

  // If we already have max sessions, mark oldest as not current and remove oldest
  if (existingSessions.length >= MAX_SESSIONS_PER_USER) {
    // Get sessions sorted by loginAt ascending (oldest first)
    const sortedSessions = [...existingSessions].sort(
      (a, b) => new Date(a.loginAt).getTime() - new Date(b.loginAt).getTime()
    )

    // Delete oldest sessions that are not current
    const toDelete = sortedSessions
      .filter(s => !s.isCurrent)
      .slice(0, sortedSessions.length - MAX_SESSIONS_PER_USER + 1)

    for (const s of toDelete) {
      try {
        await deleteDoc(doc(db, SESSIONS_COLLECTION, s.id))
      } catch (e) {
        console.error('Error deleting old session:', e)
      }
    }
  }

  // Add new session (multi-session allowed - don't mark old sessions as not current)
  const cleanSession = Object.fromEntries(
    Object.entries(session).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(sessionsRef, cleanSession)
  return result.id
}

// Delete a session from Firestore
export const deleteSession = async (sessionId: string): Promise<void> => {
  const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId)
  await deleteDoc(sessionRef)
}

// Cleanup sessions older than 48 hours
export const cleanupOldSessions = async (): Promise<void> => {
  try {
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - SESSION_RETENTION_HOURS)
    const cutoffIso = cutoffDate.toISOString()

    const sessionsRef = collection(db, SESSIONS_COLLECTION)
    const q = query(sessionsRef, where('loginAt', '<', cutoffIso))
    const snapshot = await getDocs(q)

    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, SESSIONS_COLLECTION, docSnap.id))
    )

    await Promise.all(deletePromises)
  } catch (error) {
    logger.error('[cleanupOldSessions] Error:', error)
  }
}

// ================================
// User Wallets
// ================================

const WALLETS_COLLECTION = 'wallets'

// Get all wallets for a user
export const getUserWallets = async (userId: string): Promise<UserWallet[]> => {
  const walletsRef = collection(db, WALLETS_COLLECTION)
  const q = query(walletsRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  const wallets = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId || '',
      name: data.name || '',
      address: data.address || '',
      privateKey: data.privateKey || '',
      seedPhrase: data.seedPhrase || '',
      comment: data.comment || '',
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    } as UserWallet
  })

  return wallets
}

// Add a new wallet
export const addWallet = async (wallet: {
  userId: string
  name: string
  address: string
  privateKey?: string
  seedPhrase?: string
  comment?: string
}): Promise<string> => {
  const walletsRef = collection(db, WALLETS_COLLECTION)
  const now = new Date().toISOString()
  const walletWithDates = {
    ...wallet,
    createdAt: now,
    updatedAt: now,
  }
  const cleanWallet = Object.fromEntries(
    Object.entries(walletWithDates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(walletsRef, cleanWallet)
  return result.id
}

// Update a wallet
export const updateWallet = async (id: string, updates: Partial<UserWallet>): Promise<void> => {
  const walletRef = doc(db, WALLETS_COLLECTION, id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(walletRef, cleanUpdates)
}

// Delete a wallet
export const deleteWallet = async (id: string): Promise<void> => {
  const walletRef = doc(db, WALLETS_COLLECTION, id)
  await deleteDoc(walletRef)
}

// ================================
// Community Fund - Compensation Requests
// ================================

const COMPENSATION_REQUESTS_COLLECTION = 'compensationRequests'
const DIVERSIFICATION_ENTRIES_COLLECTION = 'diversificationEntries'

// Add a new compensation request
export const addCompensationRequest = async (
  request: Omit<CompensationRequest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const requestsRef = collection(db, COMPENSATION_REQUESTS_COLLECTION)
  const now = new Date().toISOString()
  const payload = {
    ...request,
    createdAt: now,
    updatedAt: now,
  }
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(requestsRef, cleanPayload)
  return result.id
}

// Get compensation requests
export const getCompensationRequests = async (
  status?: CompensationRequestStatus
): Promise<CompensationRequest[]> => {
  const requestsRef = collection(db, COMPENSATION_REQUESTS_COLLECTION)
  let q: ReturnType<typeof query>

  if (status) {
    q = query(requestsRef, where('status', '==', status))
  } else {
    q = query(requestsRef)
  }

  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId || '',
      userName: data.userName || '',
      sphere: data.sphere || 'other',
      dealDate: data.dealDate || '',
      dealTime: data.dealTime || '',
      comments: data.comments || [],
      screenshots: data.screenshots || [],
      links: data.links || [],
      requestedAmount: data.requestedAmount || 0,
      status: data.status || 'pending',
      votes: data.votes || [],
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
      adminComment: data.adminComment,
      processedAt: data.processedAt,
    } as CompensationRequest
  })

  // Sort by createdAt descending
  results.sort((a: CompensationRequest, b: CompensationRequest) => 
    b.createdAt.localeCompare(a.createdAt)
  )

  return results
}

// Update compensation request
export const updateCompensationRequest = async (
  id: string,
  updates: Partial<CompensationRequest>
): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, id)
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(ref, cleanUpdates)
}

// Vote on compensation request
export const voteCompensationRequest = async (
  requestId: string,
  userId: string,
  vote: 'yes' | 'no'
): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, requestId)
  const snapshot = await getDoc(ref)
  
  if (!snapshot.exists()) {
    throw new Error('Request not found')
  }
  
  const data = snapshot.data()
  const currentVotes = data.votes || []
  
  // Remove previous vote from this user if exists
  const filteredVotes = currentVotes.filter((v: any) => v.userId !== userId)
  
  // Add new vote
  const newVotes = [...filteredVotes, { userId, vote, votedAt: new Date().toISOString() }]
  
  await updateDoc(ref, {
    votes: newVotes,
    updatedAt: new Date().toISOString(),
  })
}

// Start voting on compensation request (admin)
export const startCompensationVoting = async (requestId: string): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, requestId)
  await updateDoc(ref, {
    status: 'voting',
    updatedAt: new Date().toISOString(),
  })
}

// Approve compensation request (admin)
export const approveCompensationRequest = async (
  requestId: string,
  adminId: string,
  adminComment?: string
): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, requestId)
  const now = new Date().toISOString()
  const payload: Record<string, any> = {
    status: 'approved',
    reviewedBy: adminId,
    updatedAt: now,
    processedAt: now,
    decidedAt: now,
  }
  if (adminComment) {
    payload.adminComment = adminComment
  }
  await updateDoc(ref, payload)
}

// Reject compensation request (admin)
export const rejectCompensationRequest = async (
  requestId: string,
  adminComment?: string
): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, requestId)
  const now = new Date().toISOString()
  const payload: Record<string, any> = {
    status: 'rejected',
    updatedAt: now,
    processedAt: now,
    decidedAt: now,
  }
  if (adminComment) {
    payload.adminComment = adminComment
  }
  await updateDoc(ref, payload)
}

// Mark compensation request as paid (admin)
export const markCompensationRequestPaid = async (requestId: string): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, requestId)
  const now = new Date().toISOString()
  await updateDoc(ref, {
    status: 'paid',
    updatedAt: now,
    paidAt: now,
    decidedAt: now,
  })
}

// Delete compensation request (admin)
export const deleteCompensationRequest = async (requestId: string): Promise<void> => {
  const ref = doc(db, COMPENSATION_REQUESTS_COLLECTION, requestId)
  await deleteDoc(ref)
}

// ================================
// Community Fund - Diversification Entries
// ================================

// Add diversification entry
export const addDiversificationEntry = async (
  entry: Omit<DiversificationEntry, 'id' | 'createdAt'>
): Promise<string> => {
  const entriesRef = collection(db, DIVERSIFICATION_ENTRIES_COLLECTION)
  const payload = {
    ...entry,
    createdAt: new Date().toISOString(),
  }
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(entriesRef, cleanPayload)
  return result.id
}

// Get diversification entries
export const getDiversificationEntries = async (): Promise<DiversificationEntry[]> => {
  const entriesRef = collection(db, DIVERSIFICATION_ENTRIES_COLLECTION)
  const q = query(entriesRef, orderBy('date', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      amount: data.amount || 0,
      asset: data.asset || '',
      duration: data.duration || '',
      date: data.date || '',
      createdBy: data.createdBy || '',
      createdAt: data.createdAt || '',
    } as DiversificationEntry
  })
}

// Delete diversification entry
export const deleteDiversificationEntry = async (id: string): Promise<void> => {
  const ref = doc(db, DIVERSIFICATION_ENTRIES_COLLECTION, id)
  await deleteDoc(ref)
}

// ================================
// Community Fund - Stats
// ================================

export const getCommunityFundStats = async () => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // Get all pool contributions (these persist even if earnings are deleted)
  const allContributions = await getPoolContributions()
  
  // Get all compensation requests
  const allRequests = await getCompensationRequests()
  
  // Get all diversification entries
  const allDiversifications = await getDiversificationEntries()
  
  // Calculate total pool (sum of all contributions)
  const totalPool = allContributions.reduce((sum, c) => sum + c.amount, 0)
  
  // Calculate week pool
  const weekPool = allContributions
    .filter(c => c.date >= weekAgo.toISOString().split('T')[0])
    .reduce((sum, c) => sum + c.amount, 0)
  
  // Calculate total compensated (approved + paid requests)
  const totalCompensated = allRequests
    .filter(r => r.status === 'approved' || r.status === 'paid')
    .reduce((sum, r) => sum + r.requestedAmount, 0)
  
  // Calculate total diversified
  const totalDiversified = allDiversifications.reduce((sum, d) => sum + d.amount, 0)
  
  return {
    totalPool,
    weekPool,
    totalCompensated,
    totalDiversified,
  }
}

// ================================
// Team Fund (Team's Wallet) Requests
// ================================

const TEAM_FUND_REQUESTS_COLLECTION = 'teamFundRequests'

// Add a new team fund request
export const addTeamFundRequest = async (
  request: Omit<TeamFundRequest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const requestsRef = collection(db, TEAM_FUND_REQUESTS_COLLECTION)
  const now = new Date().toISOString()
  const payload = {
    ...request,
    createdAt: now,
    updatedAt: now,
  }
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(requestsRef, cleanPayload)
  return result.id
}

// Get team fund requests
export const getTeamFundRequests = async (
  status?: TeamFundRequestStatus
): Promise<TeamFundRequest[]> => {
  const requestsRef = collection(db, TEAM_FUND_REQUESTS_COLLECTION)
  let q: ReturnType<typeof query>

  if (status) {
    q = query(requestsRef, where('status', '==', status))
  } else {
    q = query(requestsRef)
  }

  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId || '',
      userName: data.userName || '',
      sphere: data.sphere || 'memecoins',
      comment: data.comment || '',
      screenshots: data.screenshots || [],
      links: data.links || [],
      requestedAmount: data.requestedAmount || 0,
      status: data.status || 'pending',
      reviewedBy: data.reviewedBy,
      adminComment: data.adminComment,
      decidedAt: data.decidedAt,
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    } as TeamFundRequest
  })

  results.sort((a: TeamFundRequest, b: TeamFundRequest) =>
    b.createdAt.localeCompare(a.createdAt)
  )

  return results
}

// Get team fund requests for a specific user
export const getUserTeamFundRequests = async (
  userId: string
): Promise<TeamFundRequest[]> => {
  const requestsRef = collection(db, TEAM_FUND_REQUESTS_COLLECTION)
  const q = query(requestsRef, where('userId', '==', userId))

  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId || '',
      userName: data.userName || '',
      sphere: data.sphere || 'memecoins',
      comment: data.comment || '',
      screenshots: data.screenshots || [],
      links: data.links || [],
      requestedAmount: data.requestedAmount || 0,
      status: data.status || 'pending',
      reviewedBy: data.reviewedBy,
      adminComment: data.adminComment,
      decidedAt: data.decidedAt,
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    } as TeamFundRequest
  })

  results.sort((a: TeamFundRequest, b: TeamFundRequest) =>
    b.createdAt.localeCompare(a.createdAt)
  )

  return results
}

// Approve team fund request (admin)
export const approveTeamFundRequest = async (
  requestId: string,
  adminId: string,
  adminComment?: string
): Promise<void> => {
  const ref = doc(db, TEAM_FUND_REQUESTS_COLLECTION, requestId)
  const now = new Date().toISOString()
  const payload: Record<string, any> = {
    status: 'approved',
    reviewedBy: adminId,
    updatedAt: now,
    decidedAt: now,
  }
  if (adminComment) {
    payload.adminComment = adminComment
  }
  await updateDoc(ref, payload)
}

// Reject team fund request (admin)
export const rejectTeamFundRequest = async (
  requestId: string,
  adminId: string,
  adminComment?: string
): Promise<void> => {
  const ref = doc(db, TEAM_FUND_REQUESTS_COLLECTION, requestId)
  const now = new Date().toISOString()
  const payload: Record<string, any> = {
    status: 'rejected',
    reviewedBy: adminId,
    updatedAt: now,
    decidedAt: now,
  }
  if (adminComment) {
    payload.adminComment = adminComment
  }
  await updateDoc(ref, payload)
}

// Delete team fund request (admin or owner)
export const deleteTeamFundRequest = async (requestId: string): Promise<void> => {
  const ref = doc(db, TEAM_FUND_REQUESTS_COLLECTION, requestId)
  await deleteDoc(ref)
}

// Clean up old team fund requests (older than 48 hours after decision)
export const cleanupOldTeamFundRequests = async (): Promise<number> => {
  try {
    const requestsRef = collection(db, TEAM_FUND_REQUESTS_COLLECTION)
    const q = query(requestsRef)
    
    const snapshot = await getDocs(q)
    const now = Date.now()
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000)
    
    const oldDocs = snapshot.docs.filter((docSnap: any) => {
      const data = docSnap.data()
      // Only delete approved or rejected requests older than 48 hours
      if (data.status !== 'approved' && data.status !== 'rejected') return false
      if (!data.decidedAt) return false
      const decidedTimestamp = new Date(data.decidedAt).getTime()
      return decidedTimestamp < fortyEightHoursAgo
    })
    
    const deletePromises = oldDocs.map((docSnap) => {
      return deleteDoc(doc(db, TEAM_FUND_REQUESTS_COLLECTION, docSnap.id))
    })
    
    await Promise.all(deletePromises)
    
    console.log(`Cleaned up ${oldDocs.length} old team fund requests`)
    return oldDocs.length
  } catch (error) {
    console.error('Error cleaning up old team fund requests:', error)
    return 0
  }
}

// ================================
// Payments (Team Payments)
// ================================

const PAYMENTS_COLLECTION = 'payments'
const PAYMENT_BATCHES_COLLECTION = 'paymentBatches'

// Create or update a payment
export const createPayment = async (
  payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const paymentsRef = collection(db, PAYMENTS_COLLECTION)
  const now = new Date().toISOString()
  const payload = {
    ...payment,
    createdAt: now,
    updatedAt: now,
  }
  const result = await addDoc(paymentsRef, payload)
  return result.id
}

// Get all payments
export const getPayments = async (
  weekStart?: string,
  weekEnd?: string
): Promise<Payment[]> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION)
    const snapshot = await getDocs(paymentsRef)
    
    console.log('getPayments: found', snapshot.docs.length, 'total payments')
    
    let results = snapshot.docs.map((docSnap: any) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        amount: data.amount || 0,
        status: data.status || 'pending',
        rejectionReason: data.rejectionReason,
        rejectionComment: data.rejectionComment,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        scheduledAt: data.scheduledAt,
        paidAt: data.paidAt,
        createdBy: data.createdBy,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        adminComment: data.adminComment,
      } as Payment
    })

    // Фильтрация на клиенте (если указаны даты)
    if (weekStart && weekEnd) {
      results = results.filter(p => 
        p.weekStart && p.weekEnd &&
        p.weekStart >= weekStart &&
        p.weekEnd <= weekEnd
      )
      console.log('getPayments: after filter', results.length, 'payments')
    }

    return results
  } catch (error) {
    console.error('Error in getPayments:', error)
    return []
  }
}

// Get payments for a specific user
export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  const paymentsRef = collection(db, PAYMENTS_COLLECTION)
  const q = query(paymentsRef, where('userId', '==', userId))

  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId || '',
      userName: data.userName || '',
      amount: data.amount || 0,
      status: data.status || 'pending',
      rejectionReason: data.rejectionReason,
      rejectionComment: data.rejectionComment,
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
      scheduledAt: data.scheduledAt,
      paidAt: data.paidAt,
      createdBy: data.createdBy,
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
      adminComment: data.adminComment,
    } as Payment
  })

  results.sort((a: Payment, b: Payment) => b.createdAt.localeCompare(a.createdAt))

  return results
}

// Update payment status
export const updatePayment = async (
  paymentId: string,
  updates: Partial<Omit<Payment, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const ref = doc(db, PAYMENTS_COLLECTION, paymentId)
  const now = new Date().toISOString()
  await updateDoc(ref, {
    ...updates,
    updatedAt: now,
  })
}

// Delete payment
export const deletePayment = async (paymentId: string): Promise<void> => {
  const ref = doc(db, PAYMENTS_COLLECTION, paymentId)
  await deleteDoc(ref)
}

// Clean up old payments (older than 30 days)
export const cleanupOldPayments = async (): Promise<{ deleted: number }> => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString()
    
    const paymentsRef = collection(db, PAYMENTS_COLLECTION)
    const q = query(
      paymentsRef,
      where('createdAt', '<', thirtyDaysAgoIso)
    )
    
    const snapshot = await getDocs(q)
    const deletePromises = snapshot.docs.map(async (docSnap) => {
      await deleteDoc(docSnap.ref)
    })
    
    await Promise.all(deletePromises)
    console.log(`Cleaned up ${snapshot.docs.length} old payments`)
    return { deleted: snapshot.docs.length }
  } catch (error) {
    console.error('Error cleaning up old payments:', error)
    return { deleted: 0 }
  }
}

// Create payment batch
export const createPaymentBatch = async (
  batch: Omit<PaymentBatch, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const batchesRef = collection(db, PAYMENT_BATCHES_COLLECTION)
  const now = new Date().toISOString()
  const payload = {
    ...batch,
    createdAt: now,
    updatedAt: now,
  }
  const result = await addDoc(batchesRef, payload)
  return result.id
}

// ================================
// User Security (PIN Code for Wallets)
// ================================

const USER_SECURITY_COLLECTION = 'userSecurity'

// Simple hash function for PIN code using Web Crypto API
const hashPinCode = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin + 'antarctic_wallet_salt_2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify wallet PIN code
export const verifyWalletPinCode = async (userId: string, pinCode: string): Promise<boolean> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    if (!docSnap.exists()) return false
    const data = docSnap.data()
    const storedHash = data?.walletPinCodeHash
    if (!storedHash) return false
    const inputHash = await hashPinCode(pinCode)
    return storedHash === inputHash
  } catch (error) {
    console.error('Error verifying wallet PIN code:', error)
    return false
  }
}

// Set wallet PIN code (admin)
export const setWalletPinCode = async (userId: string, pinCode: string): Promise<void> => {
  try {
    const pinCodeHash = await hashPinCode(pinCode)
    const now = new Date().toISOString()
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    await setDoc(securityRef, {
      walletPinCodeHash: pinCodeHash,
      walletPinCodePlain: pinCode,
      walletPinCodeSetAt: now,
    }, { merge: true })
  } catch (error) {
    console.error('Error setting wallet PIN code:', error)
    throw error
  }
}

// Get wallet PIN code plain for admin
export const getWalletPinCodePlainForAdmin = async (userId: string): Promise<string | null> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    if (!docSnap.exists()) return null
    return docSnap.data()?.walletPinCodePlain || null
  } catch (error) {
    console.error('Error getting wallet PIN code:', error)
    return null
  }
}

// Check if user has wallet PIN code set
export const hasWalletPinCode = async (userId: string): Promise<boolean> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    if (!docSnap.exists()) return false
    const data = docSnap.data()
    return !!(data?.walletPinCodeHash || data?.walletPinCodePlain)
  } catch (error) {
    console.error('Error checking wallet PIN code:', error)
    return false
  }
}

// PIN Code Change (with limits)
// ================================

const MAX_PIN_CHANGES_PER_MONTH = 3

// Get PIN change information for a user
export const getPinChangeInfo = async (userId: string): Promise<{
  changesThisMonth: number
  remainingChanges: number
  canChange: boolean
  lastChangeAt?: string
}> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)

    if (!docSnap.exists()) {
      return {
        changesThisMonth: 0,
        remainingChanges: MAX_PIN_CHANGES_PER_MONTH,
        canChange: true,
      }
    }
    
    const data = docSnap.data()
    const pinChangeHistory = data?.pinChangeHistory || []

    // Get current month boundaries
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthStartIso = monthStart.toISOString()

    // Count changes this month
    const changesThisMonth = pinChangeHistory.filter(
      (change: string) => change >= monthStartIso
    ).length

    const remainingChanges = Math.max(0, MAX_PIN_CHANGES_PER_MONTH - changesThisMonth)

    // Get last change date
    const lastChangeAt = pinChangeHistory.length > 0 ? pinChangeHistory[pinChangeHistory.length - 1] : undefined

    return {
      changesThisMonth,
      remainingChanges,
      canChange: remainingChanges > 0,
      lastChangeAt,
    }
  } catch (error) {
    console.error('Error getting PIN change info:', error)
    return {
      changesThisMonth: 0,
      remainingChanges: MAX_PIN_CHANGES_PER_MONTH,
      canChange: true,
    }
  }
}

// Change wallet PIN code with verification
export const changeWalletPinCode = async (
  userId: string,
  oldPinCode: string,
  newPinCode: string,
  authCode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First verify the old PIN code
    const isOldPinValid = await verifyWalletPinCode(userId, oldPinCode)
    if (!isOldPinValid) {
      return { success: false, error: 'Неверный текущий пинкод' }
    }

    // Verify auth code (this is handled on frontend, but we validate it's provided)
    if (!authCode) {
      return { success: false, error: 'Требуется код авторизации' }
    }

    // Get PIN change info to check limits
    const pinChangeInfo = await getPinChangeInfo(userId)
    if (!pinChangeInfo.canChange) {
      return { 
        success: false, 
        error: `Превышен лимит смены пинкода (${MAX_PIN_CHANGES_PER_MONTH} раз в месяц). Попробуйте в следующем месяце.` 
      }
    }

    // Hash new PIN code
    const newPinCodeHash = await hashPinCode(newPinCode)
    const now = new Date().toISOString()

    // Get existing security data
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    const existingData = docSnap.exists() ? docSnap.data() : {}

    // Get existing change history or create new
    const pinChangeHistory = existingData?.pinChangeHistory || []

    // Add new change to history (keep only last 12 months)
    const monthStart = new Date()
    monthStart.setMonth(monthStart.getMonth() - 12)
    const twelveMonthsAgo = monthStart.toISOString()

    const filteredHistory = pinChangeHistory.filter((change: string) => change >= twelveMonthsAgo)
    filteredHistory.push(now)

    // Update the PIN code - old one is automatically invalidated
    await setDoc(securityRef, {
      walletPinCodeHash: newPinCodeHash,
      walletPinCodePlain: newPinCode, // Store plain PIN for admin to view
      walletPinCodeSetAt: now,
      pinChangeHistory: filteredHistory,
      updatedAt: now,
    }, { merge: true })

    return { success: true }
  } catch (error) {
    console.error('Error changing wallet PIN code:', error)
    return { success: false, error: 'Ошибка при смене пинкода' }
  }
}


const hashPersonalData = (data: string, showLast: number = 2): string => {
  if (!data) return ""
  if (data.length <= showLast) return "*".repeat(data.length)
  return "*".repeat(data.length - showLast) + data.slice(-showLast)
}

const hashFullName = (name: string): string => {
  if (!name) return ""
  if (name.length <= 1) return "*"
  return name[0] + "*".repeat(name.length - 1)
}

const hashPassportIssuer = (issuer: string): string => {
  if (!issuer) return ""
  const words = issuer.split(" ")
  if (words.length <= 1) return hashFullName(issuer)
  return words[0] + " ***"
}

export const savePersonalData = async (userId: string, data: any): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId)
    const hashedData = {
      ...data,
      lastNameHash: hashFullName(data.lastName),
      firstNameHash: hashFullName(data.firstName),
      middleNameHash: hashFullName(data.middleName),
      birthDateHash: data.birthDate ? data.birthDate.split("-").reverse().join(".").replace(/\d(?=\d{2})/g, "*") : "",
      birthPlaceHash: hashFullName(data.birthPlace),
      registrationAddressHash: hashFullName(data.registrationAddress),
      residenceAddressHash: hashFullName(data.residenceAddress),
      passportSeriesHash: hashPersonalData(data.passportSeries, 2),
      passportNumberHash: hashPersonalData(data.passportNumber, 2),
      passportIssuedByHash: hashPassportIssuer(data.passportIssuedBy),
      passportIssueDateHash: data.passportIssueDate ? data.passportIssueDate.split("-").reverse().join(".").replace(/\d(?=\d{2})/g, "*") : "",
      passportDepartmentCodeHash: hashPersonalData(data.passportDepartmentCode, 2),
      innHash: hashPersonalData(data.inn, 4),
      personalDataUpdatedAt: new Date().toISOString(),
    }
    await updateDoc(userRef, hashedData)
  } catch (error) {
    console.error("Error saving personal data:", error)
    throw error
  }
}

export const hasPersonalDataPinCode = async (userId: string): Promise<boolean> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    if (!docSnap.exists()) return false
    return !!docSnap.data().personalDataPinCodeHash
  } catch (error) {
    console.error("Error checking personal data PIN:", error)
    return false
  }
}

export const setPersonalDataPinCode = async (userId: string, pinCode: string): Promise<void> => {
  try {
    const pinCodeHash = await hashPinCode(pinCode)
    const now = new Date().toISOString()
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    await setDoc(securityRef, {
      personalDataPinCodeHash: pinCodeHash,
      personalDataPinCodePlain: pinCode,
      personalDataPinCodeSetAt: now,
    }, { merge: true })
  } catch (error) {
    console.error("Error setting personal data PIN code:", error)
    throw error
  }
}

export const verifyPersonalDataPinCode = async (userId: string, pinCode: string): Promise<boolean> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    if (!docSnap.exists()) return false
    const data = docSnap.data()
    const storedHash = data.personalDataPinCodeHash
    if (!storedHash) return false
    const inputHash = await hashPinCode(pinCode)
    return storedHash === inputHash
  } catch (error) {
    console.error("Error verifying personal data PIN code:", error)
    return false
  }
}

export const getPersonalDataPinCodePlain = async (userId: string): Promise<string | null> => {
  try {
    const securityRef = doc(db, USER_SECURITY_COLLECTION, userId)
    const docSnap = await getDoc(securityRef)
    if (!docSnap.exists()) return null
    return docSnap.data().personalDataPinCodePlain || null
  } catch (error) {
    console.error("Error getting personal data PIN code:", error)
    return null
  }
}


// ==================== PERSONAL DATA VERIFICATION ====================

const PERSONAL_DATA_VERIFICATION_COLLECTION = 'personalDataVerifications'

// Отправить заявку на верификацию персональных данных
export const submitPersonalDataForVerification = async (
  userId: string,
  personalData: import('@/types').PersonalDataFull
): Promise<string> => {
  try {
    const now = new Date().toISOString()
    const verificationRef = collection(db, PERSONAL_DATA_VERIFICATION_COLLECTION)
    
    // Проверим, есть ли уже.pending заявка
    const existingQuery = query(
      verificationRef,
      where('userId', '==', userId),
      where('status', '==', 'pending')
    )
    const existingSnap = await getDocs(existingQuery)
    if (!existingSnap.empty) {
      throw new Error('Заявка на верификацию уже существует')
    }
    
    const docRef = await addDoc(verificationRef, {
      userId,
      personalData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    
    // Обновить статус пользователя
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      personalDataVerificationStatus: 'pending',
      personalDataVerificationSubmittedAt: now,
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error submitting personal data for verification:', error)
    throw error
  }
}

// Получить заявку на верификацию по userId
export const getPersonalDataVerificationByUserId = async (
  userId: string
): Promise<import('@/types').PersonalDataVerificationRequest | null> => {
  try {
    const verificationRef = collection(db, PERSONAL_DATA_VERIFICATION_COLLECTION)
    const q = query(
      verificationRef,
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    // Вернуть последнюю заявку
    const docs = snapshot.docs.sort((a, b) => {
      const aData = a.data()
      const bData = b.data()
      return new Date(bData.createdAt).getTime() - new Date(aData.createdAt).getTime()
    })
    
    return { id: docs[0].id, ...docs[0].data() } as import('@/types').PersonalDataVerificationRequest
  } catch (error) {
    console.error('Error getting personal data verification:', error)
    return null
  }
}

// Получить все заявки на верификацию (для админа)
export const getAllPersonalDataVerifications = async (
  status?: import('@/types').PersonalDataVerificationStatus
): Promise<import('@/types').PersonalDataVerificationRequest[]> => {
  try {
    const verificationRef = collection(db, PERSONAL_DATA_VERIFICATION_COLLECTION)
    let q = query(verificationRef, orderBy('createdAt', 'desc'))
    
    if (status) {
      q = query(verificationRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as import('@/types').PersonalDataVerificationRequest[]
  } catch (error) {
    console.error('Error getting all personal data verifications:', error)
    return []
  }
}

// Одобрить заявку на верификацию
export const approvePersonalDataVerification = async (
  verificationId: string,
  adminId: string
): Promise<void> => {
  try {
    const now = new Date().toISOString()
    const verificationRef = doc(db, PERSONAL_DATA_VERIFICATION_COLLECTION, verificationId)
    const docSnap = await getDoc(verificationRef)
    
    if (!docSnap.exists()) {
      throw new Error('Заявка не найдена')
    }
    
    const verificationData = docSnap.data()
    
    // Обновить заявку
    await updateDoc(verificationRef, {
      status: 'approved',
      processedAt: now,
      processedBy: adminId,
      updatedAt: now,
      dmComment: null, // Убираем комментарий при одобрении
    })
    
    // Обновить статус пользователя
    const userRef = doc(db, 'users', verificationData.userId)
    await updateDoc(userRef, {
      personalDataVerificationStatus: 'approved',
      personalDataVerificationProcessedAt: now,
    })
  } catch (error) {
    console.error('Error approving personal data verification:', error)
    throw error
  }
}

// Отклонить заявку на верификацию
export const rejectPersonalDataVerification = async (
  verificationId: string,
  adminId: string,
  dmComment: string
): Promise<void> => {
  try {
    const now = new Date().toISOString()
    const verificationRef = doc(db, PERSONAL_DATA_VERIFICATION_COLLECTION, verificationId)
    const docSnap = await getDoc(verificationRef)
    
    if (!docSnap.exists()) {
      throw new Error('Заявка не найдена')
    }
    
    const verificationData = docSnap.data()
    
    // Обновить заявку
    await updateDoc(verificationRef, {
      status: 'rejected',
      processedAt: now,
      processedBy: adminId,
      dmComment,
      updatedAt: now,
    })
    
    // Обновить статус пользователя
    const userRef = doc(db, 'users', verificationData.userId)
    await updateDoc(userRef, {
      personalDataVerificationStatus: 'rejected',
      personalDataVerificationProcessedAt: now,
    })
  } catch (error) {
    console.error('Error rejecting personal data verification:', error)
    throw error
  }
}

// Обновить комментарий DM в заявке
export const updatePersonalDataVerificationComment = async (
  verificationId: string,
  dmComment: string
): Promise<void> => {
  try {
    const verificationRef = doc(db, PERSONAL_DATA_VERIFICATION_COLLECTION, verificationId)
    await updateDoc(verificationRef, {
      dmComment,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating personal data verification comment:', error)
    throw error
  }
}

// Получить все активные верификации (approved и rejected)
export const getAllActivePersonalDataVerifications = async (): Promise<import('@/types').PersonalDataVerificationRequest[]> => {
  try {
    const verificationRef = collection(db, PERSONAL_DATA_VERIFICATION_COLLECTION)
    const q = query(
      verificationRef,
      where('status', 'in', ['approved', 'rejected']),
      orderBy('processedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as import('@/types').PersonalDataVerificationRequest[]
  } catch (error) {
    console.error('Error getting active personal data verifications:', error)
    return []
  }
}

// Удалить верификацию (снять верификацию с пользователя)
export const removePersonalDataVerification = async (
  verificationId: string,
  userId: string
): Promise<void> => {
  try {
    // 1. Удалить заявку из коллекции
    const verificationRef = doc(db, PERSONAL_DATA_VERIFICATION_COLLECTION, verificationId)
    await deleteDoc(verificationRef)

    // 2. Сбросить данные пользователя
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      // Собрать все поля для сброса
      const fieldsToReset: Record<string, any> = {
        personalDataVerificationStatus: deleteField(),
        personalDataVerificationSubmittedAt: deleteField(),
        personalDataVerificationProcessedAt: deleteField(),
      }
      
      // Добавить все персональные данные для сброса (только если они есть)
      const personalDataFields = [
        'lastName', 'lastNameHash',
        'firstName', 'firstNameHash',
        'middleName', 'middleNameHash',
        'birthDate', 'birthDateHash',
        'birthPlace', 'birthPlaceHash',
        'registrationAddress', 'registrationAddressHash',
        'residenceAddress', 'residenceAddressHash',
        'passportSeries', 'passportSeriesHash',
        'passportNumber', 'passportNumberHash',
        'passportIssuedBy', 'passportIssuedByHash',
        'passportIssueDate', 'passportIssueDateHash',
        'passportDepartmentCode', 'passportDepartmentCodeHash',
        'inn', 'innHash',
        'personalDataUpdatedAt',
        'passportPhotosLink',
        'passportPhotosPassword',
      ]
      
      for (const field of personalDataFields) {
        if (userData[field] !== undefined) {
          fieldsToReset[field] = deleteField()
        }
      }
      
      await updateDoc(userRef, fieldsToReset)
    }
    
    console.log('Verification removed for user:', userId)
  } catch (error) {
    console.error('Error removing personal data verification:', error)
    throw error
  }
}

// ================================
// TON Withdrawal Requests
// ================================

const TON_WITHDRAWAL_COLLECTION = 'tonWithdrawals'

// Создать заявку на вывод TON
export const createTonWithdrawalRequest = async (
  request: Omit<import('@/types').TonWithdrawalRequest, 'id' | 'createdAt' | 'status'>
): Promise<string> => {
  try {
    const now = new Date().toISOString()
    const withdrawalsRef = collection(db, TON_WITHDRAWAL_COLLECTION)
    const payload = {
      ...request,
      status: 'pending' as import('@/types').TonWithdrawalStatus,
      createdAt: now,
    }
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
    )
    const result = await addDoc(withdrawalsRef, cleanPayload)
    return result.id
  } catch (error) {
    console.error('Error creating TON withdrawal request:', error)
    throw error
  }
}

// Получить заявки на вывод TON для пользователя
export const getTonWithdrawalRequests = async (
  userId?: string,
  status?: import('@/types').TonWithdrawalStatus
): Promise<import('@/types').TonWithdrawalRequest[]> => {
  try {
    const withdrawalsRef = collection(db, TON_WITHDRAWAL_COLLECTION)
    let q: ReturnType<typeof query>

    if (userId && status) {
      q = query(withdrawalsRef, where('userId', '==', userId), where('status', '==', status))
    } else if (userId) {
      q = query(withdrawalsRef, where('userId', '==', userId))
    } else if (status) {
      q = query(withdrawalsRef, where('status', '==', status))
    } else {
      q = query(withdrawalsRef)
    }

    const snapshot = await getDocs(q)
    const results = snapshot.docs.map((docSnap: any) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        walletId: data.walletId || '',
        walletAddress: data.walletAddress || '',
        toAddress: data.toAddress || '',
        amount: data.amount || 0,
        comment: data.comment || '',
        status: data.status || 'pending',
        txHash: data.txHash || '',
        adminComment: data.adminComment || '',
        createdAt: data.createdAt || '',
        processedAt: data.processedAt,
        processedBy: data.processedBy,
      } as import('@/types').TonWithdrawalRequest
    })

    // Сортировка по createdAt (новые первые)
    results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return results
  } catch (error) {
    console.error('Error getting TON withdrawal requests:', error)
    return []
  }
}

// Обновить заявку на вывод TON (для админа)
export const updateTonWithdrawalRequest = async (
  id: string,
  updates: Partial<import('@/types').TonWithdrawalRequest>
): Promise<void> => {
  try {
    const ref = doc(db, TON_WITHDRAWAL_COLLECTION, id)
    const cleanUpdates = Object.fromEntries(
      Object.entries({
        ...updates,
        updatedAt: new Date().toISOString(),
      }).filter(([, value]: [string, any]) => value !== undefined)
    )
    await updateDoc(ref, cleanUpdates)
  } catch (error) {
    console.error('Error updating TON withdrawal request:', error)
    throw error
  }
}

// Одобрить и обработать заявку на вывод TON (админ)
export const approveTonWithdrawalRequest = async (
  requestId: string,
  adminId: string,
  txHash: string
): Promise<void> => {
  try {
    const now = new Date().toISOString()
    const ref = doc(db, TON_WITHDRAWAL_COLLECTION, requestId)
    await updateDoc(ref, {
      status: 'completed',
      txHash,
      processedAt: now,
      processedBy: adminId,
      updatedAt: now,
    })
  } catch (error) {
    console.error('Error approving TON withdrawal request:', error)
    throw error
  }
}

// Отклонить заявку на вывод TON (админ)
export const rejectTonWithdrawalRequest = async (
  requestId: string,
  adminId: string,
  adminComment: string
): Promise<void> => {
  try {
    const now = new Date().toISOString()
    const ref = doc(db, TON_WITHDRAWAL_COLLECTION, requestId)
    await updateDoc(ref, {
      status: 'rejected',
      adminComment,
      processedAt: now,
      processedBy: adminId,
      updatedAt: now,
    })
  } catch (error) {
    console.error('Error rejecting TON withdrawal request:', error)
    throw error
  }
}

// Отменить заявку на вывод TON (пользователь)
export const cancelTonWithdrawalRequest = async (
  requestId: string
): Promise<void> => {
  try {
    const ref = doc(db, TON_WITHDRAWAL_COLLECTION, requestId)
    const docSnap = await getDoc(ref)
    
    if (!docSnap.exists()) {
      throw new Error('Заявка не найдена')
    }
    
    const data = docSnap.data()
    if (data.status !== 'pending') {
      throw new Error('Нельзя отменить заявку в статусе ' + data.status)
    }
    
    await updateDoc(ref, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error cancelling TON withdrawal request:', error)
    throw error
  }
}

// Удалить заявку на вывод TON (админ)
export const deleteTonWithdrawalRequest = async (
  requestId: string
): Promise<void> => {
  try {
    const ref = doc(db, TON_WITHDRAWAL_COLLECTION, requestId)
    await deleteDoc(ref)
  } catch (error) {
    console.error('Error deleting TON withdrawal request:', error)
    throw error
  }
}

// ================================
// Contact DM
// ================================

const DM_CONTACT_COLLECTION = 'dmContactRequests'

// Отправить сообщение DM
export const addDMContactRequest = async (
  request: Omit<DMContactRequest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const now = new Date().toISOString()
    const contactRef = collection(db, DM_CONTACT_COLLECTION)
    const payload = {
      ...request,
      createdAt: now,
      updatedAt: now,
    }
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
    )
    const result = await addDoc(contactRef, cleanPayload)
    return result.id
  } catch (error) {
    console.error('Error adding DM contact request:', error)
    throw error
  }
}

// Получить сообщения DM для пользователя
export const getDMContactRequestsByUser = async (
  userId: string
): Promise<DMContactRequest[]> => {
  try {
    const contactRef = collection(db, DM_CONTACT_COLLECTION)
    const q = query(contactRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map((docSnap: any) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        topic: data.topic || 'bug_report',
        message: data.message || '',
        links: data.links || [],
        screenshots: data.screenshots || [],
        status: data.status || 'pending',
        adminComment: data.adminComment || '',
        answeredAt: data.answeredAt,
        answeredBy: data.answeredBy,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      } as DMContactRequest
    })
  } catch (error) {
    console.error('Error getting DM contact requests by user:', error)
    return []
  }
}

// Получить все сообщения DM (для админа/DM)
export const getAllDMContactRequests = async (
  status?: DMContactStatus
): Promise<DMContactRequest[]> => {
  try {
    const contactRef = collection(db, DM_CONTACT_COLLECTION)
    let q: ReturnType<typeof query>
    
    if (status) {
      q = query(contactRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    } else {
      q = query(contactRef, orderBy('createdAt', 'desc'))
    }
    
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map((docSnap: any) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        topic: data.topic || 'bug_report',
        message: data.message || '',
        links: data.links || [],
        screenshots: data.screenshots || [],
        status: data.status || 'pending',
        adminComment: data.adminComment || '',
        answeredAt: data.answeredAt,
        answeredBy: data.answeredBy,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      } as DMContactRequest
    })
  } catch (error) {
    console.error('Error getting all DM contact requests:', error)
    return []
  }
}

// Обновить статус и ответ DM
export const updateDMContactRequest = async (
  id: string,
  updates: Partial<Omit<DMContactRequest, 'id' | 'userId' | 'topic' | 'message' | 'links' | 'screenshots' | 'createdAt'>>
): Promise<void> => {
  try {
    const ref = doc(db, DM_CONTACT_COLLECTION, id)
    const cleanUpdates = Object.fromEntries(
      Object.entries({
        ...updates,
        updatedAt: new Date().toISOString(),
      }).filter(([, value]: [string, any]) => value !== undefined)
    )
    await updateDoc(ref, cleanUpdates)
  } catch (error) {
    console.error('Error updating DM contact request:', error)
    throw error
  }
}

// Отметить сообщение как прочитанное
export const markDMContactAsRead = async (id: string): Promise<void> => {
  try {
    const ref = doc(db, DM_CONTACT_COLLECTION, id)
    await updateDoc(ref, {
      status: 'read',
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error marking DM contact as read:', error)
    throw error
  }
}

// Ответить на сообщение DM
export const answerDMContactRequest = async (
  id: string,
  adminId: string,
  adminComment: string
): Promise<void> => {
  try {
    const now = new Date().toISOString()
    const ref = doc(db, DM_CONTACT_COLLECTION, id)
    await updateDoc(ref, {
      status: 'answered',
      adminComment,
      answeredAt: now,
      answeredBy: adminId,
      updatedAt: now,
    })
  } catch (error) {
    console.error('Error answering DM contact request:', error)
    throw error
  }
}

// Закрыть сообщение DM
export const closeDMContactRequest = async (id: string): Promise<void> => {
  try {
    const ref = doc(db, DM_CONTACT_COLLECTION, id)
    await updateDoc(ref, {
      status: 'closed',
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error closing DM contact request:', error)
    throw error
  }
}

// Удалить сообщение DM (админ)
export const deleteDMContactRequest = async (id: string): Promise<void> => {
  try {
    const ref = doc(db, DM_CONTACT_COLLECTION, id)
    await deleteDoc(ref)
  } catch (error) {
    console.error('Error deleting DM contact request:', error)
    throw error
  }
}
