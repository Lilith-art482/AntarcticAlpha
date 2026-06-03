import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { Lock, Users, FileCheck, X, Check, MessageCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { UsersManagement } from '@/components/Management/UsersManagement'
import {
  getAllPersonalDataVerifications,
  approvePersonalDataVerification,
  rejectPersonalDataVerification,
  updatePersonalDataVerificationComment,
  getAllActivePersonalDataVerifications,
  removePersonalDataVerification
} from '@/services/firestoreService'
import type { PersonalDataVerificationRequest } from '@/types'

export const Admin = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const { user } = useAuthStore()

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const subTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400'

  // Verification requests state
  const [verificationRequests, setVerificationRequests] = useState<PersonalDataVerificationRequest[]>([])
  const [loadingVerifications, setLoadingVerifications] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PersonalDataVerificationRequest | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectComment, setRejectComment] = useState('')
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [editingComment, setEditingComment] = useState('')

  // Active verifications state
  const [activeVerifications, setActiveVerifications] = useState<PersonalDataVerificationRequest[]>([])
  const [loadingActiveVerifications, setLoadingActiveVerifications] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Load active verifications
  const loadActiveVerifications = async () => {
    setLoadingActiveVerifications(true)
    try {
      const requests = await getAllActivePersonalDataVerifications()
      setActiveVerifications(requests)
    } catch (error) {
      console.error('Error loading active verifications:', error)
    } finally {
      setLoadingActiveVerifications(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadActiveVerifications()
    }
  }, [isAdmin])

  // Load verification requests
  const loadVerifications = async () => {
    setLoadingVerifications(true)
    try {
      console.log('Loading verifications...')
      const requests = await getAllPersonalDataVerifications('pending')
      console.log('Loaded verifications:', requests)
      setVerificationRequests(requests)
    } catch (error) {
      console.error('Error loading verifications:', error)
    } finally {
      setLoadingVerifications(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadVerifications()
    }
  }, [isAdmin])

  // Approve verification
  const handleApprove = async (requestId: string) => {
    if (!user?.id) return
    setProcessingId(requestId)
    try {
      await approvePersonalDataVerification(requestId, user.id)
      await loadVerifications()
    } catch (error) {
      console.error('Error approving verification:', error)
      alert('Ошибка при одобрении заявки')
    } finally {
      setProcessingId(null)
    }
  }

  // Reject verification
  const handleReject = async () => {
    if (!selectedRequest || !user?.id || !rejectComment.trim()) return
    setProcessingId(selectedRequest.id)
    try {
      await rejectPersonalDataVerification(selectedRequest.id, user.id, rejectComment.trim())
      setShowRejectModal(false)
      setRejectComment('')
      setSelectedRequest(null)
      await loadVerifications()
    } catch (error) {
      console.error('Error rejecting verification:', error)
      alert('Ошибка при отклонении заявки')
    } finally {
      setProcessingId(null)
    }
  }

  // Update DM comment
  const handleUpdateComment = async () => {
    if (!selectedRequest || !editingComment.trim()) return
    try {
      await updatePersonalDataVerificationComment(selectedRequest.id, editingComment.trim())
      setShowCommentModal(false)
      setEditingComment('')
      await loadVerifications()
      // Update local state
      setVerificationRequests(prev => 
        prev.map(r => r.id === selectedRequest.id ? { ...r, dmComment: editingComment.trim() } : r)
      )
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Ошибка при обновлении комментария')
    }
  }

  // Remove verification
  const handleRemoveVerification = async (verificationId: string, userId: string) => {
    if (!confirm('Вы уверены? Все персональные данные пользователя будут удалены, и он сможет заполнить их заново.')) {
      return
    }
    setRemovingId(verificationId)
    try {
      await removePersonalDataVerification(verificationId, userId)
      await loadActiveVerifications()
      alert('Верификация успешно снята')
    } catch (error) {
      console.error('Error removing verification:', error)
      alert('Ошибка при снятии верификации')
    } finally {
      setRemovingId(null)
    }
  }

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAdmin) {
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
          <p className={labelColor}>
            Эта страница доступна только разработчикам и (или) лицам, имеющим доступ в связи с исполнением должностных обязанностей. 
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Users Management Section */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'
        }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
            <Users className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h2 className={`text-xl font-semibold ${headingColor}`}>Участники команды</h2>
        </div>
        <UsersManagement />
      </div>

      {/* Personal Data Verification Section */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
              }`}>
              <FileCheck className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h2 className={`text-xl font-semibold ${headingColor}`}>Заявки на верификацию</h2>
            {verificationRequests.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                {verificationRequests.length}
              </span>
            )}
          </div>
          <button
            onClick={loadVerifications}
            disabled={loadingVerifications}
            className={`p-2 rounded-xl transition-all ${
              theme === 'dark' 
                ? 'hover:bg-white/10 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            } ${loadingVerifications ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {loadingVerifications ? (
          <div className={`text-center py-8 ${subTextColor}`}>Загрузка...</div>
        ) : verificationRequests.length === 0 ? (
          <div className={`text-center py-8 ${subTextColor}`}>
            Нет заявок на верификацию
          </div>
        ) : (
          <div className="space-y-4">
            {verificationRequests.map(request => (
              <div
                key={request.id}
                className={`p-4 rounded-2xl border ${
                  theme === 'dark' 
                    ? 'bg-white/[0.02] border-white/10' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${headingColor}`}>
                      {request.personalData.lastName} {request.personalData.firstName} {request.personalData.middleName}
                    </span>
                    <span className={`text-xs ${subTextColor}`}>
                      ID: {request.userId}
                    </span>
                  </div>
                  <span className={`text-xs ${subTextColor}`}>
                    {formatDate(request.createdAt)}
                  </span>
                </div>

                {/* Personal Data Preview - Полная информация */}
                <div className="space-y-4 mb-4">
                  {/* Секция: ФИО */}
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                        👤 ФИО
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Фамилия</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.lastName || '—'}</span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Имя</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.firstName || '—'}</span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Отчество</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.middleName || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Секция: Дата и место рождения */}
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                        🎂 Дата и место рождения
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Дата рождения</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>
                          {request.personalData.birthDate ? request.personalData.birthDate.split('-').reverse().join('.') : '—'}
                        </span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Место рождения</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.birthPlace || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Секция: Адреса */}
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                        📍 Адреса
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Адрес регистрации</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.registrationAddress || '—'}</span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Адрес проживания</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.residenceAddress || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Секция: Паспорт */}
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                        🪪 Паспортные данные
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Серия паспорта</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.passportSeries || '—'}</span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Номер паспорта</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.passportNumber || '—'}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Кем выдан</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.passportIssuedBy || '—'}</span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Дата выдачи</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>
                          {request.personalData.passportIssueDate ? request.personalData.passportIssueDate.split('-').reverse().join('.') : '—'}
                        </span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider block ${subTextColor}`}>Код подразделения</span>
                        <span className={`text-sm font-semibold ${headingColor}`}>{request.personalData.passportDepartmentCode || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Секция: ИНН */}
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                        🔢 ИНН
                      </span>
                    </div>
                    <span className={`text-lg font-bold ${headingColor}`}>{request.personalData.inn || '—'}</span>
                  </div>
                </div>

                {/* Link to passport photos */}
                {request.personalData.passportPhotosLink && (
                  <div className="mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider block ${subTextColor} mb-1`}>
                      Фото паспорта
                    </span>
                    <a
                      href={request.personalData.passportPhotosLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm text-emerald-500 hover:underline flex items-center gap-1`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Открыть ссылку на файлообменник
                      {request.personalData.passportPhotosPassword && (
                        <span className={`ml-2 text-xs ${subTextColor}`}>
                          (пароль: {request.personalData.passportPhotosPassword})
                        </span>
                      )}
                    </a>
                  </div>
                )}

                {/* DM Comment (if rejected) */}
                {request.dmComment && (
                  <div className={`p-3 rounded-xl mb-4 ${
                    theme === 'dark' ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                  } border`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className={`w-4 h-4 text-red-500`} />
                      <span className={`text-xs font-bold text-red-500`}>Комментарий DM</span>
                    </div>
                    <p className={`text-sm ${headingColor}`}>{request.dmComment}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === request.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>Одобрить</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request)
                      setShowRejectModal(true)
                    }}
                    disabled={processingId === request.id}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Отказать</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request)
                      setEditingComment(request.dmComment || '')
                      setShowCommentModal(true)
                    }}
                    className={`py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Verifications Section */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
              }`}>
              <Check className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <h2 className={`text-xl font-semibold ${headingColor}`}>Активные верификации</h2>
            {activeVerifications.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                {activeVerifications.length}
              </span>
            )}
          </div>
          <button
            onClick={loadActiveVerifications}
            disabled={loadingActiveVerifications}
            className={`p-2 rounded-xl transition-all ${
              theme === 'dark' 
                ? 'hover:bg-white/10 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            } ${loadingActiveVerifications ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {loadingActiveVerifications ? (
          <div className={`text-center py-8 ${subTextColor}`}>Загрузка...</div>
        ) : activeVerifications.length === 0 ? (
          <div className={`text-center py-8 ${subTextColor}`}>
            Нет активных верификаций
          </div>
        ) : (
          <div className="space-y-4">
            {activeVerifications.map(verification => (
              <div
                key={verification.id}
                className={`p-4 rounded-2xl border ${
                  theme === 'dark' 
                    ? 'bg-white/[0.02] border-white/10' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${headingColor}`}>
                      {verification.personalData.lastName} {verification.personalData.firstName} {verification.personalData.middleName}
                    </span>
                    <span className={`text-xs ${subTextColor}`}>
                      ID: {verification.userId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      verification.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {verification.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                    </span>
                  </div>
                  <span className={`text-xs ${subTextColor}`}>
                    {formatDate(verification.processedAt)}
                  </span>
                </div>

                {/* DM Comment if rejected */}
                {verification.dmComment && verification.status === 'rejected' && (
                  <div className={`p-3 rounded-xl mb-3 ${
                    theme === 'dark' ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                  } border`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className={`w-4 h-4 text-red-500`} />
                      <span className={`text-xs font-bold text-red-500`}>Комментарий DM</span>
                    </div>
                    <p className={`text-sm ${headingColor}`}>{verification.dmComment}</p>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveVerification(verification.id, verification.userId)}
                  disabled={removingId === verification.id}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {removingId === verification.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>Снять верификацию</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
            <h3 className={`text-lg font-bold mb-4 ${headingColor}`}>Отказ в верификации</h3>
            <p className={`text-sm mb-4 ${subTextColor}`}>
              Укажите причину отказа. Пользователь увидит этот комментарий.
            </p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Причина отказа..."
              className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-red-500/10 mb-4 ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 text-white focus:border-red-500' 
                  : 'bg-white border-gray-200 text-gray-900 focus:border-red-500'
              }`}
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectComment('')
                  setSelectedRequest(null)
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectComment.trim() || processingId === selectedRequest.id}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingId === selectedRequest.id ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : null}
                Отказать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
            <h3 className={`text-lg font-bold mb-4 ${headingColor}`}>Комментарий DM</h3>
            <textarea
              value={editingComment}
              onChange={(e) => setEditingComment(e.target.value)}
              placeholder="Введите комментарий..."
              className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 mb-4 ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
              }`}
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCommentModal(false)
                  setEditingComment('')
                  setSelectedRequest(null)
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateComment}
                disabled={!editingComment.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
