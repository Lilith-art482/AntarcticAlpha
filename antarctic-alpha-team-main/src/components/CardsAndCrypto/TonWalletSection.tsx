import React, { useState } from 'react'
import { UserWallet } from '@/types'
import { Wallet, Copy, Check, Eye, EyeOff, ArrowUpRight, Plus } from 'lucide-react'

interface TonWalletSectionProps {
  tonWallet: UserWallet | null
  tonBalance: number
  walletLoading: boolean
  balanceLoading: boolean
  showCreateWallet: boolean
  isGenerating: boolean
  newMnemonic: string[]
  showMnemonic: boolean
  copiedField: string | null
  onCopy: (text: string, fieldId: string) => void
  onCreateWallet: () => void
  onSaveWallet: (name: string) => void
  onCancelCreate: () => void
  onShowMnemonic: () => void
  onWithdrawClick: () => void
  theme: string
}

export const TonWalletSection: React.FC<TonWalletSectionProps> = ({
  tonWallet,
  tonBalance,
  walletLoading,
  balanceLoading,
  showCreateWallet,
  isGenerating,
  newMnemonic,
  showMnemonic,
  copiedField,
  onCopy,
  onCreateWallet,
  onSaveWallet,
  onCancelCreate,
  onShowMnemonic,
  onWithdrawClick,
  theme,
}) => {
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const [walletName, setWalletName] = useState('Мой TON Кошелек')

  if (walletLoading) {
    return (
      <div className={`rounded-3xl p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  // Show create wallet form
  if (showCreateWallet && newMnemonic.length > 0) {
    return (
      <div className={`rounded-3xl p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-[#0098EA]/10 rounded-xl">
            <Wallet className="w-5 h-5 text-[#0098EA]" />
          </div>
          <h2 className={`text-lg font-black ${headingColor}`}>
            Сохраните секретную фразу
          </h2>
        </div>

        <div className={`p-4 rounded-2xl mb-6 ${
          theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
        }`}>
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
            ⚠️ Важно! Сохраните эту фразу в безопасном месте. Без неё вы потеряете доступ к кошельку.
          </p>
          <p className={`text-xs mt-1 ${mutedText}`}>
            Никогда не передавайте эту фразу никому!
          </p>
        </div>

        {/* Mnemonic display */}
        <div className={`p-4 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Секретная фраза (24 слова)</span>
            <button
              onClick={onShowMnemonic}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
            >
              {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {newMnemonic.map((word, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-[10px] font-bold text-[#0098EA]/50 mr-2">{idx + 1}</span>
                <span className={`text-sm font-mono ${showMnemonic ? headingColor : 'text-transparent blur-sm'}`}>
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet name input */}
        <div className="mb-6">
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedText}`}>
            Название кошелька
          </label>
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            } outline-none focus:border-[#0098EA] transition-colors`}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancelCreate}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Отмена
          </button>
          <button
            onClick={() => onSaveWallet(walletName)}
            disabled={isGenerating || !walletName.trim()}
            className="flex-1 py-3 rounded-xl bg-[#0098EA] hover:bg-[#0088d1] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Сохранение...' : 'Сохранить кошелек'}
          </button>
        </div>
      </div>
    )
  }

  // Show existing wallet
  if (tonWallet) {
    return (
      <div className={`rounded-3xl p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0098EA]/10 rounded-xl">
              <Wallet className="w-5 h-5 text-[#0098EA]" />
            </div>
            <div>
              <h2 className={`text-lg font-black ${headingColor}`}>{tonWallet.name}</h2>
              <p className={`text-xs ${mutedText}`}>TON Network</p>
            </div>
          </div>
          <button
            onClick={onWithdrawClick}
            className="px-4 py-2 rounded-xl bg-[#0098EA] hover:bg-[#0088d1] text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Вывести
          </button>
        </div>

        {/* Balance */}
        <div className={`p-4 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${mutedText} mb-2`}>Баланс</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${headingColor}`}>
              {balanceLoading ? '...' : tonBalance.toFixed(2)}
            </span>
            <span className={`text-lg font-bold ${mutedText}`}>TON</span>
          </div>
          <p className={`text-xs ${mutedText} mt-1`}>
            ≈ ${(tonBalance * 5.5).toFixed(2)} USD
          </p>
        </div>

        {/* Wallet address */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Адрес кошелька</span>
            <button
              onClick={() => onCopy(tonWallet.address, 'address')}
              className="p-1.5 rounded-lg hover:bg-[#0098EA]/10 transition-colors"
            >
              {copiedField === 'address' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className={`p-3 rounded-xl font-mono text-sm break-all ${
            theme === 'dark' ? 'bg-black/20' : 'bg-gray-100'
          }`}>
            {tonWallet.address}
          </div>
        </div>

        {/* Deposit info */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
            💡 Для пополнения отправьте TON на этот адрес
          </p>
          <p className={`text-xs mt-1 ${mutedText}`}>
            Баланс обновится автоматически после подтверждения сети
          </p>
        </div>
      </div>
    )
  }

  // Show create wallet button
  return (
    <div className={`rounded-3xl p-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
        : 'bg-white border border-gray-200 shadow-lg'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[#0098EA]/10 rounded-xl">
          <Wallet className="w-5 h-5 text-[#0098EA]" />
        </div>
        <h2 className={`text-lg font-black ${headingColor}`}>
          TON Кошелек
        </h2>
      </div>

      <div className={`p-6 rounded-2xl text-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
        <Wallet className={`w-12 h-12 mx-auto mb-4 ${mutedText}`} />
        <p className={`text-base font-bold mb-2 ${headingColor}`}>
          У вас ещё нет TON кошелька
        </p>
        <p className={`text-sm ${mutedText} mb-4`}>
          Создайте кошелек для хранения и управления TON
        </p>
        <button
          onClick={onCreateWallet}
          disabled={isGenerating}
          className="px-6 py-3 rounded-xl bg-[#0098EA] hover:bg-[#0088d1] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Генерация...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Создать кошелек
            </>
          )}
        </button>
      </div>
    </div>
  )
}
