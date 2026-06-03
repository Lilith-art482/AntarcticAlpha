import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useThemeStore } from '@/store/themeStore'
import { Shield, X, Lock, AlertTriangle } from 'lucide-react'
import { verifyAdminCode } from '@/utils/adminCodeVerification'

interface AdminCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
  description?: string
  userId?: string
}

export const AdminCodeModal: React.FC<AdminCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Подтверждение доступа',
  description = 'Введите код подтверждения для доступа к админ-панели',
  userId,
}) => {
  const { theme } = useThemeStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const MAX_ATTEMPTS = 5

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code) {
      setError('Введите код')
      return
    }

    if (verifyAdminCode(code, userId)) {
      setCode('')
      setAttempts(0)
      onSuccess()
      onClose()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setError('Слишком много неудачных попыток. Доступ заблокирован.')
        // Optional: Add logging or alert for security
        console.warn('[Security] Multiple failed admin code attempts:', newAttempts)
      } else {
        setError(`Неверный код. Осталось попыток: ${MAX_ATTEMPTS - newAttempts}`)
      }
      setCode('')
    }
  }

  const handleBackdropClick = () => {
    setCode('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-[#4C7F6E]/20 to-[#4E6E49]/20' 
                : 'bg-gradient-to-br from-[#4C7F6E]/10 to-[#4E6E49]/10'
            }`}>
              <Lock className="w-6 h-6 text-[#4C7F6E]" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Требуется подтверждение
              </p>
            </div>
          </div>
          <button
            onClick={handleBackdropClick}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${
          theme === 'dark' 
            ? 'bg-amber-500/10 border border-amber-500/20' 
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
              Доступ ограничен
            </p>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Код подтверждения
            </label>
            <div className="relative">
              <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 5)) // Only digits, max 5
                  setError('')
                }}
                placeholder="•••••"
                maxLength={5}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-lg font-mono tracking-[0.5em] text-center transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E] focus:bg-white/10' 
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:bg-white'
                } ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                autoFocus
              />
            </div>
            {error && (
              <p className={`mt-2 text-sm font-medium ${
                error.includes('заблокирован') 
                  ? 'text-red-500' 
                  : theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!code || error.includes('заблокирован')}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              code && !error.includes('заблокирован')
                ? 'bg-gradient-to-r from-[#4C7F6E] to-[#4E6E49] text-white hover:shadow-lg hover:shadow-[#4C7F6E]/30 hover:scale-[1.02] active:scale-[0.98]' 
                : theme === 'dark' 
                  ? 'bg-white/5 text-gray-500' 
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            Подтвердить
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}
