import React, { useState } from 'react'
import { X, AlertTriangle, Info } from 'lucide-react'

interface TonWithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onWithdraw: (address: string, amount: string, comment: string) => Promise<void>
  balance: number
  isWithdrawing: boolean
  theme: string
}

export const TonWithdrawModal: React.FC<TonWithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  balance,
  isWithdrawing,
  theme,
}) => {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  if (!isOpen) return null

  const handleSubmit = async () => {
    await onWithdraw(address, amount, comment)
    setAddress('')
    setAmount('')
    setComment('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl p-6 ${
        theme === 'dark' 
          ? 'bg-[#0d1520] border border-white/10' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-black ${headingColor}`}>
            Вывод TON
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${mutedText}`} />
          </button>
        </div>

        {/* Info */}
        <div className={`p-4 rounded-2xl mb-6 ${
          theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                Заявка на вывод
              </p>
              <p className={`text-xs mt-1 ${mutedText}`}>
                Администратор обработает вашу заявку вручную. Средства поступят в течение 24 часов.
              </p>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className={`p-4 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${mutedText} mb-2`}>Ваш баланс</p>
          <p className={`text-2xl font-black ${headingColor}`}>{balance.toFixed(2)} TON</p>
        </div>

        {/* Address input */}
        <div className="mb-4">
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedText}`}>
            Адрес получателя TON
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="UQ..."
            className={`w-full px-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            } outline-none focus:border-[#0098EA] transition-colors`}
          />
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedText}`}>
            Сумма вывода (TON)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            max={balance}
            className={`w-full px-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            } outline-none focus:border-[#0098EA] transition-colors`}
          />
          <p className={`text-xs ${mutedText} mt-2`}>
            Максимум: {balance.toFixed(2)} TON
          </p>
        </div>

        {/* Comment input */}
        <div className="mb-6">
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedText}`}>
            Комментарий (необязательно)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Для чего вывод?"
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            } outline-none focus:border-[#0098EA] transition-colors resize-none`}
          />
        </div>

        {/* Warning */}
        <div className={`p-4 rounded-2xl mb-6 ${
          theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className={`text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
              Проверяйте адрес внимательно! Ошибочный адрес приведет к потере средств.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={isWithdrawing || !address.trim() || !amount}
            className="flex-1 py-3 rounded-xl bg-[#0098EA] hover:bg-[#0088d1] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWithdrawing ? 'Отправка...' : 'Создать заявку'}
          </button>
        </div>
      </div>
    </div>
  )
}
