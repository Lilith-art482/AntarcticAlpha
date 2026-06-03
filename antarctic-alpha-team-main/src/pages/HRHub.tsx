import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore, getLimitedSections } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { Lock, Construction, X, Check, XCircle, Mail, Calendar, User, MapPin, Clock, ExternalLink, Trash2 } from 'lucide-react'
import { db } from '@/firebase/config'
import { collection, getDocs, doc, updateDoc, query, orderBy, Timestamp, deleteDoc } from 'firebase/firestore'

interface Application {
  id: string
  firstName: string
  lastName: string
  middleName: string
  birthDate: string
  country: string
  timezone: string
  email: string
  phone: string
  telegram: string
  discord: string
  twitter: string
  maxVk: string
  referralCode?: string
  devExperience: string
  education: string
  previousProjects: string
  goldenCase: string
  keyExpertise: string
  failureLesson: string
  devEngagement: string
  tradingExperience: string
  cryptoGoldenCase: string
  cryptoGoldenCaseLinks: string
  baptismOfFire: string
  alphaSources: string
  dailyToolkit: string
  workingCapital: string
  tradingEngagement: string
  workSphere: string[]
  submittedAt: string
  status?: 'pending' | 'accepted' | 'rejected'
  feedback?: string
}

const RejectButton = ({ onReject, processing }: { onReject: () => Promise<void>, processing: boolean }) => {
  return (
    <button
      onClick={() => {
        if (confirm('Подтверждаешь отказ? Заявка будет удалена из базы.')) {
          onReject()
        }
      }}
      disabled={processing}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <XCircle className="w-5 h-5" />
      Отказать
    </button>
  )
}

const AcceptButton = ({ onAccept, processing }: { onAccept: () => Promise<void>, processing: boolean }) => {
  return (
    <button
      onClick={() => {
        if (confirm('Подтверждаешь принятие заявки?')) {
          onAccept()
        }
      }}
      disabled={processing}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Check className="w-5 h-5" />
      Принять
    </button>
  )
}

export const HRHub = () => {
  const { theme } = useThemeStore()
  const { isAdmin, isLimitedAdmin } = useAdminStore()
  const { user } = useAuthStore()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

  const userLimitedSections = user ? getLimitedSections(user.id) : []
  const hasUserAccess = userLimitedSections.includes('hr-hub')
  const hasAccess = isAdmin || isLimitedAdmin || hasUserAccess

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'))
      const snapshot = await getDocs(q)
      const apps: Application[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Application))
      setApplications(apps)
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (appId: string) => {
    try {
      setProcessing(true)
      await updateDoc(doc(db, 'applications', appId), {
        status: 'accepted',
        reviewedAt: Timestamp.now()
      })
      await loadApplications()
      setSelectedApp(null)
    } catch (error) {
      console.error('Error accepting application:', error)
      alert('Ошибка при принятии заявки')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (appId: string) => {
    try {
      setProcessing(true)
      await deleteDoc(doc(db, 'applications', appId))
      await loadApplications()
      setSelectedApp(null)
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Ошибка при отказе в заявке')
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async (appId: string) => {
    try {
      setProcessing(true)
      await deleteDoc(doc(db, 'applications', appId))
      await loadApplications()
      setSelectedApp(null)
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Ошибка при удалении заявки')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'accepted') {
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400"><Check className="w-3 h-3" />Принято</span>
    }
    if (status === 'rejected') {
      return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400"><XCircle className="w-3 h-3" />Отказ</span>
    }
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">В ожидании</span>
  }

  const getWorkSphereLabel = (value: string) => {
    const map: Record<string, string> = {
      trading: 'Торговля и анализ мемов',
      deving: 'Создание мемов (девинг)',
      polymarket: 'Polymarket',
      spot_futures: 'Спотовая, фьючерсная и проп-трейдинг торговля',
      nft: 'NFT',
      stock: 'Торговля и анализ фондового рынка',
      p2p: 'P2P и P2C',
      staking: 'Стейкинг и AirDrop'
    }
    return map[value] || value
  }

  if (!hasAccess) {
    return (
      <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${theme === 'dark'
        ? 'border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]'
        : 'border-red-200 bg-gradient-to-br from-white to-red-50/20'
        } relative overflow-hidden`}>
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${theme === 'dark'
            ? 'bg-red-500/20'
            : 'bg-red-100'
            }`}>
            <Lock className={`w-12 h-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${headingColor}`}>Доступ запрещен</h2>
          <p className={labelColor}>Эта страница доступна только администраторам.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
            <Construction className="w-8 h-8 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>HR Hub</h1>
            <p className={`text-sm font-medium ${labelColor}`}>Управление заявками на отбор в команду</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} font-bold`}>
            Всего заявок: <span className="text-[#4C7F6E]">{applications.length}</span>
          </div>
          <button onClick={loadApplications} className={`px-4 py-2 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
            Обновить
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`rounded-2xl border ${borderColor} ${cardBg} p-12 text-center`}>
          <p className={labelColor}>Загрузка заявок...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className={`rounded-2xl border ${borderColor} ${cardBg} p-12 text-center`}>
          <p className={labelColor}>Заявки пока отсутствуют</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map(app => (
            <div key={app.id} onClick={() => setSelectedApp(app)} className={`rounded-2xl border ${borderColor} ${cardBg} p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${theme === 'dark' ? 'hover:border-[#4C7F6E]/50' : 'hover:border-[#4C7F6E]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`font-black text-lg mb-1 ${headingColor}`}>{app.firstName} {app.lastName}</h3>
                  <p className={`text-sm ${labelColor} mb-2`}>{app.email}</p>
                  {app.referralCode && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                      <User className="w-3 h-3" />
                      {app.referralCode}
                    </div>
                  )}
                </div>
                {getStatusBadge(app.status)}
              </div>
              <div className={`text-xs ${labelColor} space-y-1`}>
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />{app.country}</div>
                <div className="flex items-center gap-2"><Clock className="w-3 h-3" />{app.timezone}</div>
                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" />{new Date(app.submittedAt).toLocaleDateString('ru-RU')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className={`relative max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${borderColor} ${cardBg}`}>
              <div>
                <h2 className={`text-2xl font-black ${headingColor}`}>{selectedApp.firstName} {selectedApp.lastName}</h2>
                <p className={`text-sm ${labelColor}`}>{selectedApp.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedApp.status)}
                <button onClick={() => setSelectedApp(null)} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-black mb-4 ${headingColor}`}>Персональная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className={`text-xs ${labelColor} mb-1`}>Имя</p><p className={`font-bold ${headingColor}`}>{selectedApp.firstName}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Фамилия</p><p className={`font-bold ${headingColor}`}>{selectedApp.lastName}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Отчество</p><p className={`font-bold ${headingColor}`}>{selectedApp.middleName || '-'}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Дата рождения</p><p className={`font-bold ${headingColor}`}>{selectedApp.birthDate}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Страна</p><p className={`font-bold ${headingColor}`}>{selectedApp.country}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Часовой пояс</p><p className={`font-bold ${headingColor}`}>{selectedApp.timezone}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Email</p><a href={`mailto:${selectedApp.email}`} className="text-[#4C7F6E] font-bold hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{selectedApp.email}</a></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Телефон</p><p className={`font-bold ${headingColor}`}>{selectedApp.phone}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-1`}>Telegram</p><a href={`https://t.me/${selectedApp.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#4C7F6E] font-bold hover:underline flex items-center gap-1">{selectedApp.telegram}<ExternalLink className="w-3 h-3" /></a></div>
                  {selectedApp.discord && <div><p className={`text-xs ${labelColor} mb-1`}>Discord</p><p className={`font-bold ${headingColor}`}>{selectedApp.discord}</p></div>}
                  {selectedApp.twitter && <div><p className={`text-xs ${labelColor} mb-1`}>X (Twitter)</p><a href={selectedApp.twitter} target="_blank" rel="noopener noreferrer" className="text-[#4C7F6E] font-bold hover:underline flex items-center gap-1">{selectedApp.twitter}<ExternalLink className="w-3 h-3" /></a></div>}
                  {selectedApp.maxVk && <div><p className={`text-xs ${labelColor} mb-1`}>MAX / VK</p><a href={selectedApp.maxVk} target="_blank" rel="noopener noreferrer" className="text-[#4C7F6E] font-bold hover:underline flex items-center gap-1">{selectedApp.maxVk}<ExternalLink className="w-3 h-3" /></a></div>}
                  {selectedApp.referralCode && <div><p className={`text-xs ${labelColor} mb-1`}>Реферальный код</p><p className={`font-bold text-[#4C7F6E]`}>{selectedApp.referralCode}</p></div>}
                </div>
              </div>

              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-black mb-4 ${headingColor}`}>Trading & Experience — Общие вопросы</h3>
                <div className="space-y-4">
                  <div><p className={`text-xs ${labelColor} mb-2`}>1) Опыт в разработке</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.devExperience}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>2) Образование</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.education}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>3) Предыдущие проекты</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.previousProjects}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>4) Golden Case</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.goldenCase}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>5) Ключевая экспертиза</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.keyExpertise}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>6) Ситуация провала</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.failureLesson}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>7) Вовлеченность</p><p className={`font-bold text-[#4C7F6E]`}>{selectedApp.devEngagement}</p></div>
                </div>
              </div>

              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-black mb-4 ${headingColor}`}>Trading & Experience — Crypto</h3>
                <div className="space-y-4">
                  <div><p className={`text-xs ${labelColor} mb-2`}>1) Стаж в торговле</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.tradingExperience}</p></div>
                  <div>
                    <p className={`text-xs ${labelColor} mb-2`}>2) Golden Case (торговля)</p>
                    <p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.cryptoGoldenCase}</p>
                    {selectedApp.cryptoGoldenCaseLinks && <a href={selectedApp.cryptoGoldenCaseLinks} target="_blank" rel="noopener noreferrer" className="text-[#4C7F6E] font-bold hover:underline flex items-center gap-1 mt-2"><ExternalLink className="w-3 h-3" />{selectedApp.cryptoGoldenCaseLinks}</a>}
                  </div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>3) Боевое крещение</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.baptismOfFire}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>4) Источники альфы</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.alphaSources}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>5) Daily Toolkit</p><p className={`font-medium ${headingColor} whitespace-pre-wrap`}>{selectedApp.dailyToolkit}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>6) Рабочий капитал</p><p className={`font-bold text-[#4C7F6E]`}>{selectedApp.workingCapital}</p></div>
                  <div><p className={`text-xs ${labelColor} mb-2`}>7) Вовлеченность</p><p className={`font-bold text-[#4C7F6E]`}>{selectedApp.tradingEngagement}</p></div>
                  <div>
                    <p className={`text-xs ${labelColor} mb-2`}>8) Сфера работы</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.workSphere?.map(sphere => <span key={sphere} className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>{getWorkSphereLabel(sphere)}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-xs ${labelColor}`}>Подано: {new Date(selectedApp.submittedAt).toLocaleString('ru-RU')}</p>
              </div>
            </div>

            <div className={`sticky bottom-0 z-10 flex items-center justify-end gap-3 p-6 border-t ${borderColor} ${cardBg}`}>
              {selectedApp.status === 'pending' && (
                <>
                  <RejectButton onReject={() => handleReject(selectedApp.id)} processing={processing} />
                  <AcceptButton onAccept={() => handleAccept(selectedApp.id)} processing={processing} />
                </>
              )}
              {selectedApp.status !== 'pending' && (
                <button
                  onClick={() => {
                    if (confirm('Подтверждаешь удаление заявки? Это действие нельзя отменить.')) {
                      handleDelete(selectedApp.id)
                    }
                  }}
                  disabled={processing}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  Удалить
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
