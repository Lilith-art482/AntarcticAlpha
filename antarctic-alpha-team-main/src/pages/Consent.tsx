import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft, Send, RefreshCw, Shield, CheckCircle2, Lock } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { db } from '@/services/firebase'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { savePersonalData, submitPersonalDataForVerification } from '@/services/firestoreService'

interface ConsentLocationState {
  personalData?: {
    phone?: string
    email?: string
    lastName?: string
    firstName?: string
    middleName?: string
    birthDate?: string
    birthPlace?: string
    registrationAddress?: string
    residenceAddress?: string
    passportSeries?: string
    passportNumber?: string
    passportIssuedBy?: string
    passportIssueDate?: string
    passportDepartmentCode?: string
    inn?: string
  }
}

export const Consent = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ConsentLocationState

  const personalData = state?.personalData || {}

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const glassCard = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
  const inputClass = theme === 'dark'
    ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
    : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'

  const [step, setStep] = useState<'consent' | 'credentials'>('consent')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Credentials step
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [credentialsError, setCredentialsError] = useState('')

  const fullName = [personalData.lastName, personalData.firstName, personalData.middleName]
    .filter(Boolean)
    .join(' ') || '_______________________________________________'

  const passportDate = personalData.passportIssueDate
    ? new Date(personalData.passportIssueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : '_________________________'

  const todayDate = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  const [policyChecked, setPolicyChecked] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  const handleSubmitForVerification = async () => {
    if (!login.trim() || !password.trim() || !authCode.trim()) return
    if (!user?.id) {
      setCredentialsError('Не удалось определить пользователя. Войдите в аккаунт.')
      return
    }

    setCredentialsError('')
    setIsSubmitting(true)
    try {
      // Verify credentials by checking against user document
      const userDocRef = doc(db, 'users', user.id)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        setCredentialsError('Пользователь не найден')
        setIsSubmitting(false)
        return
      }

      const userData = userDoc.data()
      if (userData.login !== login || userData.password !== password || userData.authCode !== authCode) {
        setCredentialsError('Неверный логин, пароль или код авторизации')
        setIsSubmitting(false)
        return
      }

      // Get user IP
      let userIp = 'unknown'
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipRes.json()
        userIp = ipData.ip
      } catch {}

      // Save consent to Firestore
      await addDoc(collection(db, 'user_consents'), {
        userId: user.id,
        userLogin: login,
        consentType: 'personal_data_processing',
        personalData: {
          ...personalData,
        },
        ip: userIp,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      })

      // Save personal data and submit for verification
      await savePersonalData(user.id, personalData)
      await submitPersonalDataForVerification(user.id, personalData as any)

      // Navigate back to profile
      navigate('/profile', { state: { verificationSubmitted: true } })
    } catch (error: any) {
      console.error('Error submitting consent:', error)
      setCredentialsError('Произошла ошибка при отправке. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen relative`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <Link
          to="/profile"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all mb-8 ${
            theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Вернуться в профиль</span>
        </Link>

        {step === 'consent' ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 border border-[#4C7F6E]/20 mb-4">
                <Shield className="w-4 h-4 text-[#4C7F6E]" />
                <span className="text-sm font-medium text-[#4C7F6E]">Юридический документ</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-black mb-3 ${headingColor}`}>
                Согласие на обработку персональных данных
              </h1>
              <p className={`text-sm ${subTextColor}`}>
                для целей осуществления выплат
              </p>
            </div>

            <div className={`rounded-2xl p-6 border ${glassCard} mb-6`}>
              <div className={`text-sm ${subTextColor} space-y-4 leading-relaxed`}>
                <p>
                  Я, <span className={`font-bold ${headingColor}`}>{fullName}</span>,
                </p>
                <p>
                  зарегистрированный(ая) по адресу: <span className={`font-bold ${headingColor}`}>{personalData.registrationAddress || '___________________________________________'}</span>,
                </p>

                {/* Блок паспортных данных */}
                <div className={`p-4 rounded-xl space-y-2 ${theme === 'dark' ? 'bg-white/[0.03] border border-white/5' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Паспортные данные</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Серия: </span>
                      <span className={`font-bold ${headingColor}`}>{personalData.passportSeries || '____'}</span>
                    </div>
                    <div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Номер: </span>
                      <span className={`font-bold ${headingColor}`}>{personalData.passportNumber || '______'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Кем выдан: </span>
                      <span className={`font-bold ${headingColor}`}>{personalData.passportIssuedBy || '________________________________'}</span>
                    </div>
                    <div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Дата выдачи: </span>
                      <span className={`font-bold ${headingColor}`}>{passportDate}</span>
                    </div>
                    <div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Код подразделения: </span>
                      <span className={`font-bold ${headingColor}`}>{personalData.passportDepartmentCode || '______'}</span>
                    </div>
                  </div>
                </div>

                <p>
                  даю согласие Индивидуальному предпринимателю Соболевой Ксении Витальевне (ОГРНИП 322645700054948, ИНН 644110963363, адрес: 412906, Россия, Саратовская обл, г Вольск, ул Чернышевского, д. 40) на обработку следующих моих персональных данных: фамилия, имя и отчество; адрес электронной почты; номера телефонов; дата рождения и место рождения; место проживания и регистрации; паспортные данные; ИНН; банковские и крипто-реквизиты.
                </p>

                <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Цель обработки</p>
                  <p>Оформление договоров, финансовых документов, AML/KYC, идентификация личности для осуществления выплат, оформление отчетности, связанной с выплатами.</p>
                </div>

                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Перечень действий</p>
                  <p>сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача (например, платежным системам, банкам), обезличивание, блокирование, удаление, уничтожение.</p>
                </div>

                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Срок действия</p>
                  <p>в течение срока действия договора с Оператором и 3 лет после его окончания.</p>
                </div>

                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Порядок отзыва</p>
                  <p>путем направления письменного уведомления на адрес электронной почты Оператора: <a href="mailto:antarctic.alpha@yandex.ru" className="text-[#4C7F6E] hover:underline">antarctic.alpha@yandex.ru</a>.</p>
                </div>

                <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <p>Дата: <span className={`font-bold ${headingColor}`}>{todayDate}</span></p>
                </div>
              </div>

              {/* Чек-бокс 1: Ознакомление с политикой */}
              <label className={`flex items-start gap-3 cursor-pointer mt-6 p-4 rounded-2xl border transition-all ${
                policyChecked
                  ? 'border-[#4C7F6E]/30 bg-[#4C7F6E]/5'
                  : theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={policyChecked}
                  onChange={(e) => setPolicyChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4C7F6E] focus:ring-[#4C7F6E]"
                />
                <span className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Я ознакомлен(а) с{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-[#4C7F6E] hover:underline font-medium">
                    Политикой обработки персональных данных
                  </Link>{' '}
                  Оператора и даю свое согласие на обработку указанных персональных данных.
                </span>
              </label>

              {/* Чек-бокс 2: Согласие на обработку для выплат */}
              <label className={`flex items-start gap-3 cursor-pointer mt-3 p-4 rounded-2xl border transition-all ${
                consentChecked
                  ? 'border-[#4C7F6E]/30 bg-[#4C7F6E]/5'
                  : theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4C7F6E] focus:ring-[#4C7F6E]"
                />
                <span className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Я согласен(на) на обработку моих персональных данных для целей выплат
                </span>
              </label>

              <button
                onClick={() => setStep('credentials')}
                disabled={!policyChecked || !consentChecked}
                className="w-full mt-6 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Продолжить</span>
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Credentials */
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-500">Подтверждение личности</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-black mb-3 ${headingColor}`}>
                Данные авторизации
              </h1>
              <p className={`text-sm ${subTextColor}`}>
                Введите данные вашего профиля для подтверждения
              </p>
            </div>

            <div className={`rounded-2xl p-6 border ${glassCard} mb-6`}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Логин</label>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${inputClass}`}
                    placeholder="Введите логин"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Пароль</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 pr-12 ${inputClass}`}
                      placeholder="Введите пароль"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Код авторизации</label>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${inputClass}`}
                    placeholder="Введите код из профиля"
                  />
                </div>
              </div>

              {credentialsError && (
                <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    {credentialsError}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmitForVerification}
                disabled={isSubmitting || !login.trim() || !password.trim() || !authCode.trim()}
                className="w-full mt-6 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Сохранить данные и отправить на верификацию</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
