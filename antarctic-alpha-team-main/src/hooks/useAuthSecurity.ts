import { useEffect } from 'react'
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/store/authStore'

export const useAuthSecurity = () => {
    const { user, isAuthenticated, logout } = useAuthStore()

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return

        // Create a listener for the current user's document in Firestore
        const userRef = doc(db, 'users', user.id)

        const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.data()

                // Only log out if user document was deleted
                // Removed credential change checks to allow users to update their own data
                if (!userData.login && !userData.password) {
                    console.log('Security check failed: user document deleted. Logging out.')
                    logout()
                }
            } else {
                // If user document was deleted from Firestore, also log out
                console.log('Security check failed: user document deleted. Logging out.')
                logout()
            }
        }, (error) => {
            console.error('Auth security listener error:', error)
        })

        // Also monitor sessions - if ALL sessions are deleted, log out (not just isCurrent change)
        // Multi-session allowed, so we only check if any session exists for this user
        const sessionsRef = collection(db, 'sessions')
        const sessionsQuery = query(sessionsRef, where('userId', '==', user.id))
        
        const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            // Only log out if ALL sessions for this user were deleted (account removed)
            // We no longer check isCurrent since multi-session is allowed
            if (sessions.length === 0) {
                console.log('Security check failed: all sessions deleted. Logging out.')
                logout()
            }
        }, (error) => {
            console.error('Sessions listener error:', error)
        })

        return () => {
            unsubscribeUser()
            unsubscribeSessions()
        }
    }, [isAuthenticated, user?.id, logout])
}
