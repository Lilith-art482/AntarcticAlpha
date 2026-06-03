import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AccessControlSettings {
  isBlockingEnabled: boolean
  blockMobile: boolean
  blockTablet: boolean
  blockDesktop: boolean
  customMessage?: string
  allowedUsers?: string[]
  blockedUsers?: string[]
  isTestMode: boolean
  isAdmin: boolean
}

interface AccessControlContextType {
  settings: AccessControlSettings
  updateSettings: (newSettings: Partial<AccessControlSettings>) => void
  resetSettings: () => void
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

const defaultSettings: AccessControlSettings = {
  isBlockingEnabled: true,
  blockMobile: true,
  blockTablet: false,
  blockDesktop: false,
  customMessage: '',
  allowedUsers: [],
  blockedUsers: [],
  isTestMode: false,
  isAdmin: false
}

const AccessControlContext = createContext<AccessControlContextType | undefined>(undefined)

export const useAccessControl = () => {
  const context = useContext(AccessControlContext)
  if (context === undefined) {
    throw new Error('useAccessControl must be used within an AccessControlProvider')
  }
  return context
}

interface AccessControlProviderProps {
  children: ReactNode
}

export const AccessControlProvider: React.FC<AccessControlProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessControlSettings>(defaultSettings)
  const [isAdmin, setIsAdmin] = useState(false)

  // Загружаем настройки из localStorage при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessControlSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Ошибка при загрузке настроек блокировки:', error)
      }
    }

    // Проверяем, является ли пользователь админом (можно настроить логику)
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(adminStatus)
  }, [])

  // Сохраняем настройки в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('accessControlSettings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessControlSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('accessControlSettings')
  }

  const value: AccessControlContextType = {
    settings,
    updateSettings,
    resetSettings,
    isAdmin,
    setIsAdmin
  }

  return (
    <AccessControlContext.Provider value={value}>
      {children}
    </AccessControlContext.Provider>
  )
}