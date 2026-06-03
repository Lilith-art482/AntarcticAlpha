import { useState } from 'react'
import {
  Shield,
  Cookie,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Lock,
  Globe,
  AlertCircle,
  LogOut
} from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { saveConsent } from '@/services/pdConsentService'

interface PdConsentModalProps {
  userId?: string
  onAccept: () => void
}

export const PdConsentModal = ({ userId, onAccept }: PdConsentModalProps) => {
  const { theme } = useThemeStore()
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeclineMessage, setShowDeclineMessage] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    purpose: true,
    cookies: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      if (userId) {
        await saveConsent(userId)
      } else {
        // Save to localStorage even without userId
        localStorage.setItem('arca_pd_consent_timestamp', new Date().toISOString())
      }
      onAccept()
    } catch (error) {
      console.error('Error saving consent:', error)
      onAccept()
    } finally {
      setIsLoading(false)
    }
  }

  const isDark = theme === 'dark'

  const sections = [
    {
      id: 'purpose',
      title: 'Цель обработки данных',
      icon: Shield,
      content: `Мы обрабатываем ваши персональные данные исключительно для обеспечения функционирования командной панели ARCA - Team, включая:
      
• Ведение учёта рабочего времени и расписания
• Хранение истории операций и транзакций  
• Обеспечение коммуникации между участниками команды
• Аналитику и статистику производительности
• Выполнение административных и организационных задач

Мы не передаём ваши данные третьим лицам и не используем их в коммерческих целях.`
    },
    {
      id: 'cookies',
      title: 'Использование cookies и аналогичных технологий',
      icon: Cookie,
      content: `Для корректной работы системы мы используем:

• Технические cookies — необходимы для аутентификации и сохранения сессии
• Функциональные cookies — запоминают ваши настройки и предпочтения
• Аналитические cookies — помогают улучшать работу системы

Вы можете в любое время ограничить или отключить использование cookies в настройках своего браузера или использовать специальные программы-блокировщики. Обратите внимание, что отключение некоторых cookies может повлиять на функциональность системы.`
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-[#0d1520] via-[#0f1a28] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#4C7F6E]/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#4C7F6E]/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
            }`}>
              <Shield className="w-8 h-8 text-[#4C7F6E]" />
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Согласие на обработку персональных данных
            </h2>
            <p className={`text-sm leading-relaxed max-w-lg mx-auto ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Для работы с системой ARCA - Team необходимо ваше согласие на обработку персональных данных
            </p>
          </div>

          {/* Quick info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className={`p-4 rounded-2xl ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
            }`}>
              <Lock className="w-5 h-5 text-[#4C7F6E] mb-2" />
              <p className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Безопасность
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Данные защищены
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
            }`}>
              <Globe className="w-5 h-5 text-[#4C7F6E] mb-2" />
              <p className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Конфиденциальность
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Не передаём 3-м лицам
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
            }`}>
              <Cookie className="w-5 h-5 text-[#4C7F6E] mb-2" />
              <p className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Control
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Вы управляете cookies
              </p>
            </div>
          </div>

          {/* Details section toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl mb-4 transition-all ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Подробнее о обработке данных
            </span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-[#4C7F6E]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#4C7F6E]" />
            )}
          </button>

          {/* Expandable details */}
          {showDetails && (
            <div className={`rounded-2xl mb-6 overflow-hidden ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
            }`}>
              {sections.map((section, index) => (
                <div key={section.id} className={`${index !== sections.length - 1 ? 'border-b' : ''} ${
                  isDark ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="w-5 h-5 text-[#4C7F6E]" />
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {section.title}
                      </span>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-400 text-gray-400" />
                    )}
                  </button>
                  {expandedSections[section.id] && (
                    <div className={`px-4 pb-4 text-sm whitespace-pre-line ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info about cookie settings */}
          <div className={`flex items-start gap-3 p-4 rounded-2xl mb-6 ${
            isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'
          }`}>
            <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`} />
            <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
              Вы можете ограничить использование cookies через настройки браузера или специальные программы-блокировщики. Отключение технических cookies может ограничить функциональность системы.
            </p>
          </div>

          {/* Consent reminder */}
          <div className={`text-center text-xs mb-6 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Нажимая «Согласен / Согласна», вы подтверждаете, что ознакомлены с политикой обработки персональных данных и даёте согласие на обработку ваших данных на условиях, описанных выше. Это согласие действует 30 дней.
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 disabled:opacity-50 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Согласен / Согласна
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowDeclineMessage(true)
              }}
              className={`py-4 px-6 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10' 
                  : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <X className="w-5 h-5" />
              Отмена
            </button>
          </div>

          {/* Decline message toast */}
          {showDeclineMessage && (
            <div className={`mt-4 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              isDark 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full shrink-0 ${
                  isDark ? 'bg-red-500/20' : 'bg-red-100'
                }`}>
                  <LogOut className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className={`font-bold text-sm mb-1 ${
                    isDark ? 'text-red-400' : 'text-red-700'
                  }`}>
                    Вы отказались от согласия на обработку данных
                  </p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    К сожалению, без вашего согласия использование системы ARCA - Team невозможно. 
                    Пожалуйста, закройте вкладку браузера или покиньте сайт. 
                    Если вы передумали — нажмите «Согласен / Согласна».
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy reminder */}
          <p className={`text-center text-xs mt-4 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Ваше согласие — это обязательное условие для использования системы ARCA - Team
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook for checking and managing consent
export const usePdConsent = (userId?: string) => {
  const [needsConsent, setNeedsConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkConsent = async () => {
    setIsLoading(true)
    try {
      // Check localStorage first
      const localConsent = localStorage.getItem('arca_pd_consent_timestamp')
      const deferredConsent = localStorage.getItem('arca_pd_consent_deferred')
      
      if (!localConsent && !deferredConsent) {
        setNeedsConsent(true)
      } else if (localConsent) {
        const consentDate = new Date(localConsent)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff >= 30) {
          setNeedsConsent(true)
        }
      }
    } catch (error) {
      console.error('Error checking consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const acceptConsent = async () => {
    try {
      if (userId) {
        await saveConsent(userId)
      } else {
        localStorage.setItem('arca_pd_consent_timestamp', new Date().toISOString())
      }
      setNeedsConsent(false)
    } catch (error) {
      console.error('Error accepting consent:', error)
      setNeedsConsent(false)
    }
  }

  return {
    needsConsent,
    isLoading,
    checkConsent,
    acceptConsent,
  }
}
