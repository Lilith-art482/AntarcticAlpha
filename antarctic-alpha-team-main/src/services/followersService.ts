import { db } from '@/firebase/config'
import { collection, doc, setDoc, getDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore'

/**
 * Subscribe to a caller
 * @param followerId - ID пользователя, который подписывается
 * @param callerId - ID коллера, на которого подписываются
 */
export const followCaller = async (followerId: string, callerId: string) => {
  const followRef = doc(db, 'callerFollows', `${followerId}_${callerId}`)
  await setDoc(followRef, {
    followerId,
    callerId,
    createdAt: new Date().toISOString()
  })
}

/**
 * Unsubscribe from a caller
 * @param followerId - ID пользователя, который отписывается
 * @param callerId - ID коллера, на которого был подписан
 */
export const unfollowCaller = async (followerId: string, callerId: string) => {
  const followRef = doc(db, 'callerFollows', `${followerId}_${callerId}`)
  await setDoc(followRef, { deleted: true }, { merge: true })
}

/**
 * Check if user is following a caller
 * @param followerId - ID пользователя
 * @param callerId - ID коллера
 */
export const isFollowingCaller = async (followerId: string, callerId: string): Promise<boolean> => {
  const followRef = doc(db, 'callerFollows', `${followerId}_${callerId}`)
  const snapshot = await getDoc(followRef)
  return snapshot.exists() && !snapshot.data()?.deleted
}

/**
 * Subscribe to follower status for a specific caller-caller pair
 * @param followerId - ID пользователя
 * @param callerId - ID коллера
 * @param callback - callback with boolean status
 */
export const subscribeToFollowerStatus = (
  followerId: string,
  callerId: string,
  callback: (isFollowing: boolean) => void
) => {
  const followRef = doc(db, 'callerFollows', `${followerId}_${callerId}`)
  
  return onSnapshot(followRef, (snapshot) => {
    const isFollowing = snapshot.exists() && !snapshot.data()?.deleted
    callback(isFollowing)
  })
}

/**
 * Get followers count for a caller
 * @param callerId - ID коллера
 */
export const getFollowersCount = async (callerId: string): Promise<number> => {
  const followsRef = collection(db, 'callerFollows')
  const q = query(
    followsRef,
    where('callerId', '==', callerId),
    where('deleted', '==', false)
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}

/**
 * Subscribe to followers count for a caller
 * @param callerId - ID коллера
 * @param callback - callback with count
 */
export const subscribeToFollowersCount = (
  callerId: string,
  callback: (count: number) => void
) => {
  const followsRef = collection(db, 'callerFollows')
  const q = query(
    followsRef,
    where('callerId', '==', callerId)
  )
  
  return onSnapshot(q, (snapshot) => {
    const count = snapshot.docs.filter(doc => !doc.data().deleted).length
    callback(count)
  })
}

/**
 * Get all callers that a user follows
 * @param followerId - ID пользователя
 */
export const getFollowingCallers = async (followerId: string): Promise<string[]> => {
  const followsRef = collection(db, 'callerFollows')
  const q = query(
    followsRef,
    where('followerId', '==', followerId)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs
    .filter(doc => !doc.data().deleted)
    .map(doc => doc.data().callerId)
}
