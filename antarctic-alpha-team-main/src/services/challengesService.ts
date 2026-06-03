import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/firebase/config'

const CHALLENGES_COLLECTION = 'challenges'

export interface Challenge {
  id?: string
  title: string
  description: string
  reward: string
  difficulty: 'easy' | 'medium' | 'hard'
  deadline: string
  participantIds?: string[] // IDs of users participating
  participants?: number // Count for display (deprecated but kept for compatibility)
  links?: string[] // Up to 5 links
  screenshots?: string[] // Up to 3 screenshot URLs
  createdAt?: string
  updatedAt?: string
}

// Get all challenges
export const getChallenges = async (): Promise<Challenge[]> => {
  try {
    const challengesRef = collection(db, CHALLENGES_COLLECTION)
    const snapshot = await getDocs(challengesRef)
    
    const results = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        reward: data.reward || '',
        difficulty: data.difficulty || 'medium',
        deadline: data.deadline || '',
        participantIds: data.participantIds || [],
        participants: data.participantIds?.length || 0,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || ''
      }
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    
    return results
  } catch (error) {
    console.error('Error getting challenges:', error)
    return []
  }
}

// Add a new challenge (admin only)
export const addChallenge = async (challenge: Omit<Challenge, 'id' | 'participantIds' | 'participants' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const challengesRef = collection(db, CHALLENGES_COLLECTION)
    const now = new Date().toISOString()
    
    const docRef = await addDoc(challengesRef, {
      ...challenge,
      participantIds: [],
      participants: 0,
      createdAt: now,
      updatedAt: now
    })
    
    console.log('Challenge added with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error adding challenge:', error)
    throw error
  }
}

// Update a challenge (admin only)
export const updateChallenge = async (id: string, challenge: Partial<Challenge>): Promise<void> => {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, id)
    await updateDoc(challengeRef, {
      ...challenge,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Challenge updated:', id)
  } catch (error) {
    console.error('Error updating challenge:', error)
    throw error
  }
}

// Delete a challenge (admin only)
export const deleteChallenge = async (id: string): Promise<void> => {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, id)
    await deleteDoc(challengeRef)
    
    console.log('Challenge deleted:', id)
  } catch (error) {
    console.error('Error deleting challenge:', error)
    throw error
  }
}

// Join a challenge
export const joinChallenge = async (challengeId: string, userId: string): Promise<void> => {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, challengeId)
    await updateDoc(challengeRef, {
      participantIds: arrayUnion(userId),
      participants: (await getDocs(collection(db, CHALLENGES_COLLECTION))).docs
        .find(d => d.id === challengeId)?.data().participantIds?.length || 0
    })
    
    console.log('User joined challenge:', userId, challengeId)
  } catch (error) {
    console.error('Error joining challenge:', error)
    throw error
  }
}

// Leave a challenge
export const leaveChallenge = async (challengeId: string, userId: string): Promise<void> => {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, challengeId)
    await updateDoc(challengeRef, {
      participantIds: arrayRemove(userId)
    })
    
    console.log('User left challenge:', userId, challengeId)
  } catch (error) {
    console.error('Error leaving challenge:', error)
    throw error
  }
}