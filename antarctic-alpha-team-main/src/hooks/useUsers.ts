import { useState, useEffect, useMemo } from 'react'
import { User } from '@/types'
import { getAllUsers } from '@/services/firestoreService'
import { TEAM_MEMBERS } from '@/types'

/**
 * Hook for getting users from Firestore with fallback to TEAM_MEMBERS
 * New users added through admin panel will automatically appear everywhere
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const firestoreUsers = await getAllUsers()
        
        // Merge Firestore users with TEAM_MEMBERS (Firestore takes priority for updates)
        const usersMap = new Map<string, User>()
        
        // Add TEAM_MEMBERS first (as fallback/base)
        TEAM_MEMBERS.forEach(user => {
          usersMap.set(user.id, user)
        })
        
        // Override with Firestore users (new/updated users)
        firestoreUsers.forEach(user => {
          usersMap.set(user.id, user)
        })
        
        setUsers(Array.from(usersMap.values()))
        setError(null)
      } catch (err) {
        console.error('Error loading users:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        // Fallback to TEAM_MEMBERS on error
        setUsers(TEAM_MEMBERS)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return { users, loading, error }
}

/**
 * Hook for getting a single user by ID
 */
export const useUser = (userId: string | null | undefined) => {
  const { users, loading, error } = useUsers()
  
  const user = useMemo(() => {
    if (!userId) return null
    return users.find(u => u.id === userId) || null
  }, [users, userId])
  
  return { user, loading, error }
}

/**
 * Hook for reloading users manually (useful after adding/editing user)
 */
export const useUsersReload = () => {
  const [users, setUsers] = useState<User[]>(TEAM_MEMBERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reload = async () => {
    try {
      setLoading(true)
      const firestoreUsers = await getAllUsers()
      
      const usersMap = new Map<string, User>()
      TEAM_MEMBERS.forEach(user => {
        usersMap.set(user.id, user)
      })
      firestoreUsers.forEach(user => {
        usersMap.set(user.id, user)
      })
      
      setUsers(Array.from(usersMap.values()))
      setError(null)
    } catch (err) {
      console.error('Error reloading users:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return { users, loading, error, reload }
}