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
    getDoc,
    deleteField
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export interface InitiativeVote {
    userId: string
    vote: 'for' | 'against'
    votedAt: string
}

export interface Initiative {
    id: string
    number?: number // Порядковый номер для отображения
    title: string // Короткое название
    sphere: string // Сфера
    description: string // Подробное описание
    screenshots: string[] // До 5 скриншотов
    links: string[] // До 5 ссылок
    coauthors: string[] // ID соавторов
    createdBy: string // ID автора
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    votes: InitiativeVote[] // Голоса
    status: 'voting' | 'accepted' | 'rejected' | 'pause_dm' | 'refused_dm' | 'implemented' | 'archived'
    votingEndsAt?: string // Когда заканчивается голосование (ISO date string)
    archivedAt?: string // Когда попало в архив
    implementedAt?: string // Когда было реализовано
}

const COLLECTION_NAME = 'initiatives'

// Функция для получения следующего свободного номера
const getNextFreeNumber = async (): Promise<number> => {
    const initiativesRef = collection(db, COLLECTION_NAME)
    const snapshot = await getDocs(initiativesRef)

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

export const getInitiatives = async (): Promise<Initiative[]> => {
    const initiativesRef = collection(db, COLLECTION_NAME)
    const q = query(initiativesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as unknown as Initiative[]
}

export const getInitiativeById = async (id: string): Promise<Initiative | null> => {
    const initiativeRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(initiativeRef)

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Initiative
    } else {
        return null
    }
}

export const subscribeToInitiatives = (callback: (initiatives: Initiative[]) => void) => {
    const initiativesRef = collection(db, COLLECTION_NAME)
    const q = query(initiativesRef, orderBy('createdAt', 'desc'))

    return onSnapshot(q, (snapshot) => {
        const initiatives = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Initiative[]
        callback(initiatives)
    })
}

export const addInitiative = async (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'number' | 'votes' | 'status' | 'votingEndsAt'>): Promise<string> => {
    const initiativesRef = collection(db, COLLECTION_NAME)
    const now = new Date().toISOString()
    const nextNumber = await getNextFreeNumber()
    // Голосование длится 36 часов
    const votingEndsAt = new Date(new Date().getTime() + 36 * 60 * 60 * 1000).toISOString()
    
    const result = await addDoc(initiativesRef, {
        ...initiative,
        number: nextNumber,
        createdAt: now,
        updatedAt: now,
        votes: [],
        status: 'voting',
        votingEndsAt
    })
    return result.id
}

export const updateInitiative = async (id: string, updates: Partial<Initiative>): Promise<void> => {
    const initiativeRef = doc(db, COLLECTION_NAME, id)

    const filteredUpdates: any = { ...updates }
    for (const key in filteredUpdates) {
        if (filteredUpdates[key] === undefined) {
            filteredUpdates[key] = deleteField()
        }
    }

    await updateDoc(initiativeRef, {
        ...filteredUpdates,
        updatedAt: new Date().toISOString()
    })
}

export const deleteInitiative = async (id: string): Promise<void> => {
    const initiativeRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(initiativeRef)
}

// Функция для голосования
export const voteForInitiative = async (initiativeId: string, userId: string, vote: 'for' | 'against'): Promise<void> => {
    const initiativeRef = doc(db, COLLECTION_NAME, initiativeId)
    const docSnap = await getDoc(initiativeRef)

    if (docSnap.exists()) {
        const currentInitiative = docSnap.data() as Initiative
        const currentVotes = currentInitiative.votes || []

        const existingVoteIndex = currentVotes.findIndex(v => v.userId === userId)

        let newVotes: InitiativeVote[]

        if (existingVoteIndex !== -1) {
            // Обновить существующий голос
            newVotes = currentVotes.map((v, index) =>
                index === existingVoteIndex ? { ...v, vote, votedAt: new Date().toISOString() } : v
            )
        } else {
            // Добавить новый голос
            newVotes = [...currentVotes, { userId, vote, votedAt: new Date().toISOString() }]
        }

        await updateDoc(initiativeRef, { votes: newVotes, updatedAt: new Date().toISOString() })
    } else {
        throw new Error("Инициатива не найдена")
    }
}

// Функция для удаления голоса
export const removeVoteFromInitiative = async (initiativeId: string, userId: string): Promise<void> => {
    const initiativeRef = doc(db, COLLECTION_NAME, initiativeId)
    const docSnap = await getDoc(initiativeRef)

    if (docSnap.exists()) {
        const currentInitiative = docSnap.data() as Initiative
        const currentVotes = currentInitiative.votes || []

        const newVotes = currentVotes.filter(v => v.userId !== userId)

        await updateDoc(initiativeRef, { votes: newVotes, updatedAt: new Date().toISOString() })
    } else {
        throw new Error("Инициатива не найдена")
    }
}

// Функция для проверки и обновления статуса инициативы
export const checkAndUpdateInitiativeStatus = async (initiative: Initiative, totalTeamMembers: number): Promise<'voting' | 'accepted' | 'rejected' | 'pause_dm' | 'refused_dm' | 'implemented' | 'archived'> => {
    // Если статус уже не голосование, не меняем его
    if (initiative.status !== 'voting') {
        return initiative.status
    }

    const now = new Date().getTime()
    const votingEndTime = new Date(initiative.votingEndsAt!).getTime()

    // Если голосование еще идет
    if (now < votingEndTime) {
        return 'voting'
    }

    // Голосование закончилось
    const votesFor = initiative.votes.filter(v => v.vote === 'for').length

    // Нужно не менее 50% голосов всех участников команды
    const requiredVotes = Math.ceil(totalTeamMembers * 0.5)

    if (votesFor >= requiredVotes) {
        await updateInitiative(initiative.id, { status: 'accepted' })
        return 'accepted'
    } else {
        await updateInitiative(initiative.id, { status: 'rejected' })
        return 'rejected'
    }
}

// Функция для перемещения реализованных инициатив в архив через 14 дней
export const cleanupImplementedInitiatives = async (initiatives: Initiative[]): Promise<void> => {
    const now = new Date().getTime()
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000

    for (const initiative of initiatives) {
        if (initiative.status === 'implemented' && initiative.implementedAt) {
            const implementedTime = new Date(initiative.implementedAt).getTime()
            const archiveTime = implementedTime + fourteenDaysInMs

            if (now >= archiveTime) {
                await updateInitiative(initiative.id, {
                    status: 'archived',
                    archivedAt: new Date().toISOString()
                })
            }
        }
    }
}

// Функция для удаления архивных инициатив через 7 дней
export const cleanupArchivedInitiatives = async (initiatives: Initiative[]): Promise<void> => {
    const now = new Date().getTime()
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000

    for (const initiative of initiatives) {
        if (initiative.status === 'archived' && initiative.archivedAt) {
            const archivedTime = new Date(initiative.archivedAt).getTime()
            const expirationTime = archivedTime + sevenDaysInMs

            if (now >= expirationTime) {
                await deleteInitiative(initiative.id)
            }
        }
    }
}
