// Admin mode activation button
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { Shield, ShieldOff } from 'lucide-react'

export const AdminModeButton = () => {
  const { isAdmin, activateAdmin, deactivateAdmin } = useAdminStore()
  const { user } = useAuthStore()
  const { theme } = useThemeStore()

  const handleToggle = () => {
    if (isAdmin) {
      deactivateAdmin()
      alert('Режим администратора деактивирован')
    } else if (user?.id) {
      // Активация по ID пользователя - сработает только если у пользователя роль admin
      // Передаём пустой пароль и userId во второй аргумент
      const success = activateAdmin('', user.id)
      if (success) {
        alert('Режим администратора активирован')
      } else {
        alert('У вас нет прав администратора')
      }
    } else {
      alert('Необходимо войти в систему')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-full rounded-lg p-4 shadow-md transition-colors flex items-center justify-center gap-2 ${
        isAdmin
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : theme === 'dark'
          ? 'bg-[#1a1a1a] hover:bg-gray-700 text-white'
          : 'bg-white hover:bg-gray-50 text-gray-900'
      }`}
    >
      {isAdmin ? (
        <>
          <ShieldOff className="w-5 h-5" />
          <span>Режим администратора (деактивировать)</span>
        </>
      ) : (
        <>
          <Shield className="w-5 h-5" />
          <span>Режим администратора</span>
        </>
      )}
    </button>
  )
}
