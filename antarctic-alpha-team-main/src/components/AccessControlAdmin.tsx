import React, { useState, useEffect } from 'react'
import { useAccessControl } from '@/contexts/AccessControlContext'
import { useAuthStore } from '@/store/authStore'
import { Settings, Shield, Smartphone, Tablet, Monitor, Save, RotateCcw, EyeOff, UserCheck } from 'lucide-react'

export const AccessControlAdmin: React.FC = () => {
  const { settings, updateSettings, resetSettings, isAdmin, setIsAdmin } = useAccessControl()
  const { user, isAuthenticated: isUserAuthenticated } = useAuthStore()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAdminPanelAuthenticated, setIsAdminPanelAuthenticated] = useState(isAdmin || (user?.role === 'admin'))

  // Проверяем, является ли пользователь админом
  const isUserAdmin = isUserAuthenticated && user?.role === 'admin'

  useEffect(() => {
    // Обновляем статус аутентификации при изменении пользователя
    setIsAdminPanelAuthenticated(isAdmin || isUserAdmin)
  }, [user, isAdmin, isUserAdmin])

  // Сбрасываем форму ввода пароля при выходе из админ-режима
  useEffect(() => {
    if (!isAdminPanelAuthenticated) {
      setShowPassword(false)
      setPassword('')
    }
  }, [isAdminPanelAuthenticated])

  // Принудительно обновляем состояние при изменении isAdmin
  useEffect(() => {
    // Если админ-режим выключен, сбрасываем все связанные состояния
    if (!isAdmin && isAdminPanelAuthenticated) {
      setIsAdminPanelAuthenticated(false)
      setShowPassword(false)
      setPassword('')
    }
  }, [isAdmin])

  const handleLogin = () => {
    // Проверка пароля 4747
    if (password === '4747' && isUserAdmin) {
      setIsAdminPanelAuthenticated(true)
      setIsAdmin(true)
      localStorage.setItem('isAdmin', 'true')
      setPassword('')
      setShowPassword(false)
    } else if (password === '4747') {
      alert('Доступ запрещен. Только администраторы могут управлять блокировкой устройств.')
      setPassword('')
    } else {
      alert('Неверный пароль')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAdminPanelAuthenticated(false)
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
  }

  // Показываем кнопку только авторизованным админам
  if (!isUserAdmin) {
    return null
  }

  if (!isAdminPanelAuthenticated) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Войти в админ-панель"
        >
          <Settings className="w-6 h-6" />
        </button>

        {showPassword && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[280px]">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Админ-панель
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Вы вошли как: <span className="font-medium">{user?.name}</span> (Администратор)
            </p>
            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль администратора"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Войти
                </button>
                <button
                  onClick={() => {
                    setShowPassword(false)
                    setPassword('')
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Отмена
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Пароль администратора: 4747
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 w-80 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Управление блокировкой
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Выйти из админ-панели"
          >
            <EyeOff className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Главный переключатель */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Блокировка устройств
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isBlockingEnabled}
                onChange={(e) => updateSettings({ isBlockingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Типы устройств */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Блокируемые устройства:
            </h4>

            {/* Мобильные телефоны */}
            <div className="flex items-center justify-between pl-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Мобильные телефоны
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.blockMobile}
                  onChange={(e) => updateSettings({ blockMobile: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* Планшеты */}
            <div className="flex items-center justify-between pl-4">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Планшеты
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.blockTablet}
                  onChange={(e) => updateSettings({ blockTablet: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {/* Персональные компьютеры */}
            <div className="flex items-center justify-between pl-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Персональные компьютеры
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.blockDesktop}
                  onChange={(e) => updateSettings({ blockDesktop: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Тестовый режим */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Тестовый режим
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isTestMode}
                onChange={(e) => updateSettings({ isTestMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>

          {/* Кастомное сообщение */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Кастомное сообщение
            </label>
            <textarea
              value={settings.customMessage || ''}
              onChange={(e) => updateSettings({ customMessage: e.target.value })}
              placeholder="Введите сообщение для заблокированных пользователей..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                const confirmed = window.confirm('Сохранить текущие настройки?')
                if (confirmed) {
                  // Настройки сохраняются автоматически в контексте
                  alert('Настройки сохранены!')
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Сохранить
            </button>
            <button
              onClick={() => {
                const confirmed = window.confirm('Сбросить все настройки к значениям по умолчанию?')
                if (confirmed) {
                  resetSettings()
                }
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Сброс
            </button>
          </div>

          {/* Статус настроек */}
          <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${settings.isBlockingEnabled ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span>
                Блокировка: {settings.isBlockingEnabled ? 'Активна' : 'Отключена'}
              </span>
            </div>
            <div className="text-xs">
              Заблокировано: {
                [
                  settings.blockMobile && 'Мобильные',
                  settings.blockTablet && 'Планшеты', 
                  settings.blockDesktop && 'ПК'
                ].filter(Boolean).join(', ') || 'Ничего'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}