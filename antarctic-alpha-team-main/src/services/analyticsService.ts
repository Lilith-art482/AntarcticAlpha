import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    where,
    getDoc, // Импортируем getDoc
    Query, DocumentData, QueryConstraint,
    deleteField // Импортируем deleteField для удаления полей
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { AnalyticsReview } from '@/types'

export interface Rating {
    userId: string
    value: number // Оценка от 1 до 5
}

const COLLECTION_NAME = 'analytics'

// Функция для получения следующего свободного номера
const getNextFreeNumber = async (): Promise<number> => {
    const analyticsRef = collection(db, COLLECTION_NAME)
    const snapshot = await getDocs(analyticsRef)

    const usedNumbers = new Set<number>()
    snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.number !== undefined) {
            usedNumbers.add(data.number)
        }
    })

    // Находим минимальный свободный номер
    let nextNumber = 1
    while (usedNumbers.has(nextNumber)) {
        nextNumber++
    }

    return nextNumber
}

export const getAnalyticsReviews = async (sphere?: string[]): Promise<AnalyticsReview[]> => {
    const analyticsRef = collection(db, COLLECTION_NAME)
    let q = query(analyticsRef, orderBy('createdAt', 'desc'))

    // Теперь sphere - это строка (futures, spot или polymarket)
    // Для фильтрации по нескольким сферам используем where с 'in'
    if (sphere && sphere.length > 0 && !sphere.includes('all') && sphere.length <= 10) {
        q = query(analyticsRef, where('sphere', 'in', sphere), orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }) as AnalyticsReview)
}

export const getAnalyticsReviewById = async (id: string): Promise<AnalyticsReview | null> => {
    const reviewRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(reviewRef)

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AnalyticsReview
    } else {
        return null
    }
}

export const subscribeToAnalyticsReviews = (callback: (reviews: AnalyticsReview[]) => void, sphere?: string[], traderIds?: string[]) => {
    const analyticsRef = collection(db, COLLECTION_NAME)
    let q: Query<DocumentData> = query(analyticsRef, orderBy('createdAt', 'desc'))

    const queryConstraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    // Теперь sphere - это строка (futures, spot или polymarket)
    // Для фильтрации по нескольким сферам используем where с 'in'
    if (sphere && sphere.length > 0 && !sphere.includes('all') && sphere.length <= 10) {
        queryConstraints.push(where('sphere', 'in', sphere))
    }

    if (traderIds && traderIds.length > 0 && !traderIds.includes('all')) {
        queryConstraints.push(where('createdBy', 'in', traderIds))
    }

    q = query(analyticsRef, ...queryConstraints)

    return onSnapshot(q, (snapshot) => {
        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as AnalyticsReview)
        callback(reviews)
    })
}

export const addAnalyticsReview = async (review: Omit<AnalyticsReview, 'id' | 'createdAt' | 'updatedAt' | 'number'>): Promise<string> => {
    const analyticsRef = collection(db, COLLECTION_NAME)
    const now = new Date().toISOString()
    const nextNumber = await getNextFreeNumber()
    const result = await addDoc(analyticsRef, {
        ...review,
        number: nextNumber,
        createdAt: now,
        updatedAt: now,
        ratings: [] // Инициализируем массив оценок при создании
    })
    return result.id
}

export const updateAnalyticsReview = async (id: string, updates: Partial<AnalyticsReview>): Promise<void> => {
    const reviewRef = doc(db, COLLECTION_NAME, id)

    // Фильтруем undefined значения и заменяем их на deleteField
    const filteredUpdates: any = { ...updates }
    for (const key in filteredUpdates) {
        if (filteredUpdates[key] === undefined) {
            filteredUpdates[key] = deleteField()
        }
    }

    await updateDoc(reviewRef, {
        ...filteredUpdates,
        updatedAt: new Date().toISOString()
    })
}

export const deleteAnalyticsReview = async (id: string): Promise<void> => {
    const reviewRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(reviewRef)
}

// Функция для добавления или обновления оценки
export const addOrUpdateReviewRating = async (reviewId: string, userId: string, ratingValue: number): Promise<void> => {
    const reviewRef = doc(db, COLLECTION_NAME, reviewId);
    const docSnap = await getDoc(reviewRef);

    if (docSnap.exists()) {
        const currentReview = docSnap.data() as AnalyticsReview;
        const currentRatings = currentReview.ratings || [];

        const existingRatingIndex = currentRatings.findIndex(r => r.userId === userId);

        let newRatings: Rating[];

        if (existingRatingIndex !== -1) {
            // Обновить существующую оценку
            newRatings = currentRatings.map((r, index) =>
                index === existingRatingIndex ? { ...r, value: ratingValue } : r
            );
        } else {
            // Добавить новую оценку
            newRatings = [...currentRatings, { userId, value: ratingValue }];
        }

        await updateDoc(reviewRef, { ratings: newRatings, updatedAt: new Date().toISOString() });
    } else {
        throw new Error("Аналитический обзор не найден");
    }
};

// Функция для удаления оценки пользователя
export const deleteReviewRating = async (reviewId: string, userId: string): Promise<void> => {
    const reviewRef = doc(db, COLLECTION_NAME, reviewId);
    const docSnap = await getDoc(reviewRef);

    if (docSnap.exists()) {
        const currentReview = docSnap.data() as AnalyticsReview;
        const currentRatings = currentReview.ratings || [];

        const newRatings = currentRatings.filter(r => r.userId !== userId);

        await updateDoc(reviewRef, { ratings: newRatings, updatedAt: new Date().toISOString() });
    } else {
        throw new Error("Аналитический обзор не найден");
    }
};

// Функция для автоматического продления дедлайнов
// Продлевает дедлайн на 24 часа для обзоров, у которых дедлайн истёк, но разбор не закрыт
export const autoExtendExpiredDeadlines = async (): Promise<number> => {
    const analyticsRef = collection(db, COLLECTION_NAME)
    const snapshot = await getDocs(analyticsRef)

    const now = new Date().getTime()
    let extendedCount = 0

    for (const docSnapshot of snapshot.docs) {
        const review = docSnapshot.data() as AnalyticsReview

        // Пропускаем закрытые обзоры
        if (review.closed) continue

        // Пропускаем обзоры без дедлайна
        if (!review.deadline) continue

        const deadlineTime = new Date(review.deadline).getTime()

        // Если дедлайн истёк, продлеваем на 24 часа
        if (deadlineTime <= now) {
            const newDeadline = new Date(deadlineTime + 24 * 60 * 60 * 1000).toISOString()
            const currentExtensionCount = review.extensionCount || 0

            // Сохраняем оригинальный дедлайн при первом продлении
            const originalDeadline = review.originalDeadline || review.deadline

            await updateDoc(doc(db, COLLECTION_NAME, docSnapshot.id), {
                deadline: newDeadline,
                extensionCount: currentExtensionCount + 1,
                originalDeadline: originalDeadline,
                updatedAt: new Date().toISOString()
            })

            extendedCount++
            console.log(`Продлён дедлайн для обзора #${review.number}: ${review.deadline} -> ${newDeadline}`)
        }
    }

    return extendedCount
};