// Access block screen component - shown when user access is blocked
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { checkUserAccess } from '@/services/firestoreService'
import { ShieldX, Clock, AlertTriangle } from 'lucide-react'

export const AccessBlockScreen = () => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const [blockReason, setBlockReason] = useState<string>('')
  const [blockExpiresAt, setBlockExpiresAt] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [showBlock, setShowBlock] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const accessResult = await checkUserAccess(user.id, 'all')
        if (!accessResult.hasAccess) {
          setBlockReason(accessResult.reason || 'Доступ заблокирован')
          setBlockExpiresAt(accessResult.expiresAt)
          setShowBlock(true)
        } else {
          setShowBlock(false)
        }
      } catch (error) {
        console.error('Error checking access:', error)
        setBlockReason('Ошибка проверки доступа')
        setShowBlock(true)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [user])

  if (!showBlock) {
    return null
  }

  if (loading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4E6E49] border-t-transparent"></div>
      </div>
    )
  }

  if (!blockReason) {
    return null // No block, render normally
  }

  const formatExpirationDate = (expiresAt?: string) => {
    if (!expiresAt) return 'навсегда'

    const date = new Date(expiresAt)
    const now = new Date()

    if (date <= now) return 'навсегда'

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Determine background and text colors based on theme
  const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
  const cardBg = theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-white border-slate-200'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const iconBg = theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
  const iconColor = theme === 'dark' ? 'text-red-400' : 'text-red-600'
  const sectionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
  const warningBg = theme === 'dark' ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
  const warningTitleColor = theme === 'dark' ? 'text-amber-200' : 'text-amber-800'
  const warningTextColor = theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
  const warningIconColor = theme === 'dark' ? 'text-amber-400' : 'text-amber-600'

  return (
    <div className={`fixed inset-0 ${bgColor} flex items-center justify-center z-50 p-4`}>
      <div className={`max-w-md w-full ${cardBg} rounded-2xl shadow-2xl border p-8 text-center`}>
        <div className="mb-6">
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <ShieldX className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h1 className={`text-2xl font-bold ${titleColor} mb-2`}>
            Доступ заблокирован
          </h1>
          <p className={`${textColor} mb-4`}>
            {blockReason}
          </p>
        </div>

        <div className={`${sectionBg} rounded-lg p-4 mb-6`}>
          <div className={`flex items-center justify-center gap-2 text-sm ${textColor}`}>
            <Clock className="w-4 h-4" />
            <span>
              Блокировка до: {formatExpirationDate(blockExpiresAt)}
            </span>
          </div>
        </div>

        <div className={`${warningBg} border rounded-lg p-4`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 ${warningIconColor} flex-shrink-0 mt-0.5`} />
            <div className="text-left">
              <p className={`text-sm font-medium ${warningTitleColor} mb-1`}>
                Свяжитесь с администратором
              </p>
              <p className={`text-sm ${warningTextColor}`}>
                Для восстановления доступа обратитесь к администратору системы
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-500">
          ARCA — Team
        </div>
      </div>
    </div>
  )
}
