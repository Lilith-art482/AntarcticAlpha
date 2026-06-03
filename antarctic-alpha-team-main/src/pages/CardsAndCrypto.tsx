import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { CreditCard, ArrowUpRight, ArrowDownFromLine, QrCode, Sparkles, Copy, Shield, ChevronDown, HelpCircle } from 'lucide-react'
import { QRScanner } from '@/components/QRScanner'
import { generateMnemonic, generateTonWallet, getTonBalance, mnemonicArrayToString } from '@/services/tonService'
import { getUserWallets, addWallet, createTonWithdrawalRequest } from '@/services/firestoreService'
import { UserWallet } from '@/types'
import { TonWalletSection } from '@/components/CardsAndCrypto/TonWalletSection'
import { TonWithdrawModal } from '@/components/CardsAndCrypto/TonWithdrawModal'

export const CardsAndCrypto: React.FC = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const whiteText = theme === 'dark' ? 'text-white' : 'text-gray-900'

  // TON Wallet State
  const [tonWallet, setTonWallet] = useState<UserWallet | null>(null)
  const [tonBalance, setTonBalance] = useState<number>(0)
  const [walletLoading, setWalletLoading] = useState(true)
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newMnemonic, setNewMnemonic] = useState<string[]>([])
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)

  // Withdrawal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Load TON wallet on mount
  useEffect(() => {
    loadTonWallet()
  }, [user])

  const loadTonWallet = async () => {
    if (!user) return
    setWalletLoading(true)
    try {
      const wallets = await getUserWallets(user.id)
      const tonWallets = wallets.filter(w => w.network === 'ton')
      if (tonWallets.length > 0) {
        setTonWallet(tonWallets[0])
        // Load balance
        await loadBalance(tonWallets[0].address)
      } else {
        setTonWallet(null)
      }
    } catch (error) {
      console.error('Error loading TON wallet:', error)
    } finally {
      setWalletLoading(false)
    }
  }

  const loadBalance = async (address: string) => {
    setBalanceLoading(true)
    try {
      const { balance } = await getTonBalance(address)
      setTonBalance(balance)
    } catch (error) {
      console.error('Error loading balance:', error)
      setTonBalance(0)
    } finally {
      setBalanceLoading(false)
    }
  }

  const handleCreateWallet = async () => {
    if (!user) return
    setIsGenerating(true)
    try {
      // Generate new mnemonic
      const mnemonic = await generateMnemonic()
      setNewMnemonic(mnemonic)
      setShowCreateWallet(true)
    } catch (error) {
      console.error('Error generating wallet:', error)
      alert('Ошибка при генерации кошелька')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveWallet = async (walletName: string) => {
    if (!user || newMnemonic.length === 0) return
    setIsGenerating(true)
    try {
      // Generate wallet from mnemonic
      const walletData = await generateTonWallet(newMnemonic)
      
      // Save to Firestore
      const walletId = await addWallet({
        userId: user.id,
        name: walletName,
        address: walletData.address,
        privateKey: walletData.secretKey,
        seedPhrase: mnemonicArrayToString(newMnemonic),
        comment: 'TON Wallet for USDT',
      })
      
      setTonWallet({
        id: walletId,
        userId: user.id,
        name: walletName,
        address: walletData.address,
        network: 'ton',
        privateKey: walletData.secretKey,
        seedPhrase: mnemonicArrayToString(newMnemonic),
        comment: 'TON Wallet for USDT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      
      setShowCreateWallet(false)
      setNewMnemonic([])
      await loadTonWallet()
    } catch (error) {
      console.error('Error saving wallet:', error)
      alert('Ошибка при сохранении кошелька')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleWithdraw = async (address: string, amount: string, comment: string) => {
    if (!user || !tonWallet) return

    setIsWithdrawing(true)
    try {
      const withdrawAmount = parseFloat(amount)
      if (isNaN(withdrawAmount) || withdrawAmount <= 0 || withdrawAmount > tonBalance) {
        alert('Некорректная сумма')
        return
      }

      // Create withdrawal request
      await createTonWithdrawalRequest({
        userId: user.id,
        userName: user.name,
        walletId: tonWallet.id,
        walletAddress: tonWallet.address,
        toAddress: address,
        amount: withdrawAmount,
        comment,
      })

      alert('Заявка на вывод создана! Администратор обработает её в ближайшее время.')
    } catch (error) {
      console.error('Error creating withdrawal request:', error)
      alert('Ошибка при создании заявки')
    } finally {
      setIsWithdrawing(false)
    }
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldId)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const showBetaMessage = () => {
    alert('🔒 Раздел находится в закрытом бета-тестировании')
  }

  const faqData = [
    {
      question: 'Кнопка пополнить позволяет пополнить только кошелек, без карты?',
      answer: 'Да, только кошелек. Сам кошелек можно пополнить через СБП и криптовалютой, а еще переводом от другого пользователя — с любых бирж.'
    },
    {
      question: 'А как пополнить карту и какие способы есть?',
      answer: 'Можно пополнять с крипто-кошелька. Пополнение с фиата пока недоступно.'
    },
    {
      question: 'А что по лимитам?',
      answer: 'Если говорить про карту, то есть лимиты на разовую операцию, сумму в месяц и общий лимит по карте, которые варьируются в зависимости от BIN.\n\nПо кошельку лимиты более прозрачные: от 50 рублей до 200 000 рублей за одну транзакцию, их количество неограниченно, но пороги могут меняться и вводиться ограничения — мы предупредим об этом в плашке, если такое будет.'
    },
    {
      question: 'А есть деление на подписочные и другие карты в зависимости от целей или все универсальные?',
      answer: 'Да, есть градация:\n• Обычные виртуалки — лучше всего подходят для подписок и оплат онлайн.\n• Виртуалки с поддержкой Apple / Google Pay — имеют более широкий функционал, подходят также для привязок к смартфону и оплат офлайн.\n• Пластиковые — с возможностью оплат офлайн и снятия наличных.'
    },
    {
      question: 'Как получить карту?',
      answer: 'Нажмите на кнопку «Получить карту» и следуйте инструкциям. Данные карты появятся в блоке «Мои карты».'
    },
    {
      question: 'Какие комиссии?',
      answer: 'В разработке.'
    },
    {
      question: 'А как работает оплата по QR-коду, это законно?',
      answer: 'Оплата работает по системе P2C (purchase-to-crypto), где криптовалюта обменивается на оплаченный товар/услугу:\n• Пользователь сканирует QR-код для оплаты.\n• Запрос на оплату передается верифицированному контрагенту.\n• Контрагент оплачивает счет.\n• С кошелька списывается криптовалюта как результат обмена.\n\nМы работаем в рамках российского законодательства, поскольку юридически оплата выглядит как сделка между человеком, который хочет продать криптовалюту, и человеком, который хочет её получить.\n\nМы ничего не покупаем и не оплачиваем, а лишь обеспечиваем безопасную и прозрачную связь между участниками сделки. При этом человек, который хочет приобрести криптовалюту, оплачивает обмен по QR-коду рублями. Пользователь формально не совершает прямых криптовалютных транзакций с продавцом, что делает процесс легальным.'
    },
    {
      question: 'Зачем нужно проходить KYC?',
      answer: 'KYC (Know Your Customer) — обязательная процедура для криптовалютных платформ и сервисов. Ее цель — подтвердить личность пользователя для соблюдения норм AML (Anti-Money Laundering, противодействие отмыванию денег).'
    },
    {
      question: 'А куда можно вывести?',
      answer: 'Средства с кошелька можно выводить:\n• по СБП на любой номер телефона,\n• на вашу карту (принадлежащую Antarctic Alpha).\n\nПроверяйте банк и номер. В случае ошибок средства будут утеряны без возможности восстановления.'
    },
    {
      question: 'Как пополнить баланс?',
      answer: 'Чтобы пополнить баланс:\n1. Нажмите кнопку «Пополнить».\n2. Выберите способ пополнения (Перевод с кошелька или СБП).\n3. Выберите доступные для пополнения криптовалюты и подходящую вам сеть (при пополнении с другого кошелька).\n4. Переведите выбранную криптовалюту на указанный адрес депозита на сумму больше 5 USDT (при переводе с другого кошелька).\n5. В случае пополнения через СБП — следуйте инструкции.\n\nБаланс обновится в течение 2–3 минут.'
    },
    {
      question: 'А есть ли конвертация?',
      answer: 'Да, конвертация есть, но лишь для криптовалют. Например, вы можете обменять USDT на Solana и обратно. Со всеми криптовалютами, доступными для обмена, можете ознакомиться в конвертере.'
    },
    {
      question: 'Что можно оплачивать с помощью QR-кода?',
      answer: 'Все, где есть СБП. Например: мобильная связь, интернет, покупка продуктов, пополнение транспортных карт.'
    },
    {
      question: 'А есть переводы с карт?',
      answer: 'Пока нет, но мы работаем над этим.'
    },
    {
      question: 'Как вернуть деньги за товар/услугу?',
      answer: 'Чтобы вернуть деньги за товар/услугу:\n1. Откройте нужный вам платеж в истории транзакций.\n2. Выберите функцию «Оспорить».\n3. Выберите сумму и причину, обязательно изучив условия возврата.\n4. Ожидайте изменения статуса в течение 48 часов после заявки.'
    },
    {
      question: 'Что такое промокоды и для чего они нужны?',
      answer: 'Промокоды предоставляют возможность пополнить баланс кошелька на определенную сумму, указанную в коде. Получить их можно с помощью участия в челленджах, предлагая инициативы или оказав сильное положительное влияние на сообщество.'
    },
    {
      question: 'А если у меня другой вопрос?',
      answer: 'Напишите DM проекту — @artyom_medoed'
    }
  ]

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] rounded-2xl shadow-lg shadow-[#4C7F6E]/20">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-2xl md:text-3xl font-black ${headingColor}`}>
            Cards & Crypto
          </h1>
          <p className={`text-sm ${mutedText}`}>
            Ваши карты и криптовалюта в одном месте
          </p>
        </div>
      </div>

      {/* Блок 1: Быстрые действия */}
      <div className={`rounded-3xl p-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Sparkles className="w-4 h-4 text-[#4C7F6E]" />
          <h2 className={`text-base font-black ${headingColor}`}>
            Быстрые действия
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Пополнить Wallet */}
          <button
            onClick={showBetaMessage}
            className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#4C7F6E]/50'
                : 'bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#4C7F6E]/50'
            }`}
          >
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] shadow-lg">
                <ArrowDownFromLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className={`font-bold text-[10px] leading-tight ${whiteText}`}>
              Пополнить
            </span>
          </button>

          {/* Вывести */}
          <button
            onClick={tonWallet ? () => setShowWithdrawModal(true) : showBetaMessage}
            className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#4C7F6E]/50'
                : 'bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#4C7F6E]/50'
            }`}
          >
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] shadow-lg">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className={`font-bold text-[10px] leading-tight ${whiteText}`}>
              Вывести
            </span>
          </button>

          {/* Оплатить */}
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#4C7F6E]/50'
                : 'bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#4C7F6E]/50'
            }`}
          >
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4C7F6E] to-[#4E6E49] shadow-lg">
                <QrCode className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className={`font-bold text-[10px] leading-tight ${whiteText}`}>
              Оплатить
            </span>
          </button>
        </div>
      </div>

      {/* TON Wallet Section */}
      <TonWalletSection
        tonWallet={tonWallet}
        tonBalance={tonBalance}
        walletLoading={walletLoading}
        balanceLoading={balanceLoading}
        showCreateWallet={showCreateWallet}
        isGenerating={isGenerating}
        newMnemonic={newMnemonic}
        showMnemonic={showMnemonic}
        copiedField={copiedField}
        onCopy={copyToClipboard}
        onCreateWallet={handleCreateWallet}
        onSaveWallet={handleSaveWallet}
        onCancelCreate={() => { setShowCreateWallet(false); setNewMnemonic([]) }}
        onShowMnemonic={() => setShowMnemonic(!showMnemonic)}
        onWithdrawClick={() => setShowWithdrawModal(true)}
        theme={theme}
      />

      {/* TON Withdraw Modal */}
      <TonWithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        balance={tonBalance}
        isWithdrawing={isWithdrawing}
        theme={theme}
      />

      {/* Блок 2: Моя карта */}
      <div className={`rounded-3xl p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-[#4C7F6E]" />
          <h2 className={`text-lg font-black ${headingColor}`}>
            Мои карты
          </h2>
        </div>

        {/* Кнопка Получить карту - ПЕРЕД картой */}
        <button
          onClick={showBetaMessage}
          className={`w-full mb-6 py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#4C7F6E] to-[#4E6E49] text-white shadow-lg shadow-[#4C7F6E]/25 hover:shadow-xl hover:shadow-[#4C7F6E]/35'
              : 'bg-gradient-to-r from-[#4C7F6E] to-[#4E6E49] text-white shadow-lg shadow-[#4C7F6E]/25 hover:shadow-xl hover:shadow-[#4C7F6E]/35'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Получить карту</span>
          </div>
        </button>

        {/* Карта */}
        <div className={`relative overflow-hidden rounded-2xl p-6 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a2332] via-[#0f1724] to-[#1a2332] border border-white/10'
            : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700'
        }`}>
          {/* Декоративные элементы */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4C7F6E]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4E6E49]/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#4C7F6E]/5 to-transparent" />
            </div>
          </div>

          <div className="relative z-10 space-y-5">
            {/* Номер карты */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Номер карты</span>
              </div>
              <button
                onClick={showBetaMessage}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white text-xl font-mono font-bold tracking-widest">
                **** **** **** ****
              </span>
            </div>

            {/* Срок и CVV */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">Срок действия</span>
                <p className="text-white text-base font-bold mt-1">**/**</p>
              </div>
              <div>
                <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">CVV</span>
                <p className="text-white text-base font-bold mt-1">***</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Блок 3: FAQ */}
      <div className={`rounded-3xl p-6 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0d1520] to-[#0a1019] border border-white/10' 
          : 'bg-white border border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-[#4C7F6E]" />
          <h2 className={`text-lg font-black ${headingColor}`}>
            Частые вопросы
          </h2>
        </div>

        <div className="space-y-3">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-gray-50 border-gray-200 hover:bg-white'
              } ${openFaqIndex === index ? 'ring-2 ring-[#4C7F6E]/30' : ''}`}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className={`w-full flex items-center justify-between p-4 text-left ${whiteText}`}
              >
                <span className="font-bold text-sm pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#4C7F6E] transition-transform duration-300 flex-shrink-0 ${
                    openFaqIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`p-4 pt-0 text-sm ${mutedText}`}>
                  <div className="whitespace-pre-line">{item.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={(result) => {
          console.log('QR Code scanned:', result)
          setIsQRScannerOpen(false)
          showBetaMessage()
        }}
      />
    </div>
  )
}

export default CardsAndCrypto
