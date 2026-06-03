import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAccessControl } from '@/contexts/AccessControlContext'
import { Smartphone, Tablet, Monitor, X } from 'lucide-react'

// Функции для определения типов устройств
const isMobilePhone = (): boolean => {
  if (typeof window === 'undefined') return false

  const width = window.innerWidth
  const height = window.innerHeight
  const userAgent = navigator.userAgent.toLowerCase()

  // Агрессивная проверка для мобильных телефонов
  const isPhoneByUserAgent = /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isNotTablet = !/ipad|android.*(?!.*mobile)/i.test(userAgent)

  // Размеры для мобильных телефонов (более строгие)
  const isPhoneBySize = width < 1200 && height < 1200 && !(
    // Исключаем большие экраны планшетов
    (width >= 1024 && height >= 768) ||
    (width >= 768 && height >= 1024)
  )

  // Специальная проверка для всех iPhone (включая современные)
  const isIphone = /iphone/i.test(userAgent)
  const isIphoneBySize = isIphone && (
    // iPhone 12 Pro: 390x844, iPhone 12: 390x844, iPhone 11: 375x812, etc.
    (width <= 428 && height <= 926) ||
    // Альбомная ориентация
    (width <= 926 && height <= 428)
  )

  // Специальная проверка для Android телефонов
  const isAndroidPhone = /android.*mobile/i.test(userAgent) && width < 500 && height < 1000

  // Объединенная логика с приоритетом для мобильных
  return (
    // 1. Любой iPhone (даже с большим экраном)
    isIphoneBySize ||
    // 2. Android телефоны
    isAndroidPhone ||
    // 3. Общие мобильные устройства
    (isPhoneByUserAgent && isNotTablet && isPhoneBySize) ||
    // 4. Fallback: очень маленькие экраны
    (width < 600 && height < 800)
  )
}

const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false

  const width = window.innerWidth
  const height = window.innerHeight
  const userAgent = navigator.userAgent.toLowerCase()

  return (
    /ipad|android.*(?!.*mobile)/i.test(userAgent) ||
    (width >= 768 && width <= 1024 && height >= 768) ||
    (width >= 1024 && width <= 1366 && height >= 768)
  ) && !isMobilePhone()
}

export const MobileBlockScreen = () => {
  const { theme } = useThemeStore()
  const { settings } = useAccessControl()
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    isLandscape: false
  })

  // Проверяем тип устройства при монтировании
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent.toLowerCase()

      const isPhone = isMobilePhone()
      const isTab = isTablet()

      // Определяем тип устройства
      let currentDeviceType: 'mobile' | 'tablet' | 'desktop'
      if (isPhone) currentDeviceType = 'mobile'
      else if (isTab) currentDeviceType = 'tablet'
      else currentDeviceType = 'desktop'

      // Отладочная информация
      console.log('=== ПРОВЕРКА УСТРОЙСТВА ===')
      console.log('User-Agent:', userAgent)
      console.log('Размер экрана:', width + 'x' + height)
      console.log('Pixel Ratio:', window.devicePixelRatio)
      console.log('Тип устройства:', currentDeviceType)
      console.log('Настройки блокировки:', settings)
      console.log('==========================')

      // Сохраняем отладочную информацию для отображения
      setDebugInfo(`UA: ${userAgent.substring(0, 30)}... | Тип: ${currentDeviceType.toUpperCase()} | Размер: ${width}x${height}`)

      setDeviceType(currentDeviceType)

      // Определяем, нужно ли блокировать это устройство
      const shouldBlock = (
        (currentDeviceType === 'mobile' && settings.blockMobile) ||
        (currentDeviceType === 'tablet' && settings.blockTablet) ||
        (currentDeviceType === 'desktop' && settings.blockDesktop)
      )

      // Показываем модальное окно только если блокировка включена и устройство должно быть заблокировано
      if (settings.isBlockingEnabled && shouldBlock) {
        setShowModal(true)
      }

      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        isLandscape: window.innerWidth > window.innerHeight
      })
    }

    checkDevice()

    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [settings])

  // Если нет необходимости показывать модальное окно
  if (!showModal || !deviceType) {
    return null
  }

  // Определяем информацию о типе устройства
  const getDeviceInfo = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          icon: Smartphone,
          title: 'Мобильные телефоны не поддерживаются',
          description: 'Данный сайт предназначен для использования на планшетах и персональных компьютерах',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/20'
        }
      case 'tablet':
        return {
          icon: Tablet,
          title: 'Планшеты не поддерживаются',
          description: 'Данный сайт предназначен для использования только на персональных компьютерах',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
      case 'desktop':
        return {
          icon: Monitor,
          title: 'Персональные компьютеры не поддерживаются',
          description: 'Доступ к сайту разрешен только с мобильных устройств и планшетов',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        }
    }
  }

  const deviceInfo = getDeviceInfo()
  const DeviceIcon = deviceInfo.icon

  // Определяем цвета для темы
  const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
  const cardBg = theme === 'dark'
    ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10'
    : 'bg-white border-slate-200'
  const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const deviceBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
  const deviceText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const deviceIconColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
  const deviceIconBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
  const allowedIconColor = theme === 'dark' ? 'text-green-400' : 'text-green-600'
  const notAllowedIconColor = theme === 'dark' ? 'text-red-400' : 'text-red-600'

  return (
    <div className={`fixed inset-0 ${bgColor} flex items-center justify-center z-50 p-4`}>
      <div className={`max-w-lg w-full ${cardBg} rounded-3xl shadow-2xl border p-8 text-center relative`}>
        {/* Кнопка закрытия */}
        <button
          onClick={() => setShowModal(false)}
          className={`absolute top-4 right-4 p-2 rounded-full ${deviceIconBg} ${deviceIconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className={`w-20 h-20 ${deviceInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <DeviceIcon className={`w-10 h-10 ${deviceInfo.iconColor}`} />
          </div>
          <h1 className={`text-3xl font-bold ${titleColor} mb-4`}>
            {settings.customMessage || deviceInfo.title}
          </h1>
          <p className={`text-lg ${textColor} mb-2`}>
            {deviceInfo.description}
          </p>
        </div>

        {/* Устройства */}
        <div className="space-y-4 mb-8">
          {/* Мобильный телефон */}
          <div className={`${deviceBg} rounded-xl p-4 flex items-center justify-between ${deviceType === 'mobile' ? 'ring-2 ring-red-500' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${deviceIconBg} rounded-lg flex items-center justify-center`}>
                <Smartphone className={`w-6 h-6 ${settings.blockMobile ? notAllowedIconColor : allowedIconColor}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium ${deviceText}`}>Мобильный телефон</p>
                <p className={`text-sm ${textColor}`}>
                  {deviceType === 'mobile' ? 'Текущее устройство' : 'Поддерживается'}
                </p>
              </div>
            </div>
            <div className={`font-semibold text-sm ${settings.blockMobile ? 'text-red-500' : 'text-green-500'}`}>
              {settings.blockMobile ? '✗ Заблокирован' : '✓ Поддерживается'}
            </div>
          </div>

          {/* Планшет */}
          <div className={`${deviceBg} rounded-xl p-4 flex items-center justify-between ${deviceType === 'tablet' ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${deviceIconBg} rounded-lg flex items-center justify-center`}>
                <Tablet className={`w-6 h-6 ${settings.blockTablet ? notAllowedIconColor : allowedIconColor}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium ${deviceText}`}>Планшет</p>
                <p className={`text-sm ${textColor}`}>
                  {deviceType === 'tablet' ? 'Текущее устройство' : 'Поддерживается'}
                </p>
              </div>
            </div>
            <div className={`font-semibold text-sm ${settings.blockTablet ? 'text-red-500' : 'text-green-500'}`}>
              {settings.blockTablet ? '✗ Заблокирован' : '✓ Поддерживается'}
            </div>
          </div>

          {/* Персональный компьютер */}
          <div className={`${deviceBg} rounded-xl p-4 flex items-center justify-between ${deviceType === 'desktop' ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${deviceIconBg} rounded-lg flex items-center justify-center`}>
                <Monitor className={`w-6 h-6 ${settings.blockDesktop ? notAllowedIconColor : allowedIconColor}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium ${deviceText}`}>Персональный компьютер</p>
                <p className={`text-sm ${textColor}`}>
                  {deviceType === 'desktop' ? 'Текущее устройство' : 'Поддерживается'}
                </p>
              </div>
            </div>
            <div className={`font-semibold text-sm ${settings.blockDesktop ? 'text-red-500' : 'text-green-500'}`}>
              {settings.blockDesktop ? '✗ Заблокирован' : '✓ Поддерживается'}
            </div>
          </div>
        </div>

        {/* Отладочная информация */}
        <div className={`${theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-4`}>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-red-200' : 'text-red-800'} mb-2`}>
            🔍 Отладочная информация
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-red-300' : 'text-red-700'} mb-2`}>
            {debugInfo}
          </p>
          <div className="text-xs space-y-1">
            <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              Тип устройства: <span className="font-semibold">{deviceType?.toUpperCase()}</span>
            </p>
            <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              Блокировка включена: <span className="font-semibold">{settings.isBlockingEnabled ? 'ДА' : 'НЕТ'}</span>
            </p>
            <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              Блокируется: {
                [
                  settings.blockMobile && 'мобильные',
                  settings.blockTablet && 'планшеты',
                  settings.blockDesktop && 'ПК'
                ].filter(Boolean).join(', ') || 'ничего'
              }
            </p>
          </div>
        </div>

        {/* Информация о текущем устройстве */}
        <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
          <p className={`text-sm ${textColor} mb-2`}>
            Информация о вашем устройстве:
          </p>
          <div className={`text-xs ${textColor} space-y-1`}>
            <p>Размер экрана: {screenInfo.width} × {screenInfo.height}px</p>
            <p>Ориентация: {screenInfo.isLandscape ? 'Альбомная' : 'Книжная'}</p>
            <p>Pixel Ratio: {window.devicePixelRatio}</p>
          </div>
        </div>

        {/* Рекомендации */}
        <div className={`${theme === 'dark' ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4`}>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-200' : 'text-amber-800'} mb-2`}>
            💡 Рекомендации
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
            Для оптимального использования всех функций сайта рекомендуем использовать планшет или компьютер с браузером Chrome, Firefox или Safari
          </p>
        </div>

        {/* Кнопка для тестирования (можно удалить в продакшене) */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setShowModal(false)}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            Временно скрыть окно (для тестирования)
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
            ARCA — Team
          </div>
        </div>
      </div>
    </div>
  )
}