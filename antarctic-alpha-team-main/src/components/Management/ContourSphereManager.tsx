import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { getAllUsers, updateUser } from '@/services/firestoreService'
import { ContourSphere } from '@/types'
import { SPHERE_META } from '../Strategies/SphereSelectionModal'
import { 
  Users, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  RefreshCw,
  AlertTriangle,
  X,
  Pencil,
  Calendar
} from 'lucide-react'

interface UserSphereData {
  userId: string
  userName: string
  selectedSphere?: ContourSphere
  sphereSelectedAt?: string
}

export const ContourSphereManager: React.FC = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const [users, setUsers] = useState<UserSphereData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [editingSphere, setEditingSphere] = useState<string | null>(null)
  const [tempSphere, setTempSphere] = useState<ContourSphere | ''>('')
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [tempDate, setTempDate] = useState('')
  
  const sphereOptions = Object.keys(SPHERE_META) as ContourSphere[]

  const loadUsers = async () => {
    if (!isAdmin) return
    setLoading(true)
    try {
      const allUsers = await getAllUsers()
      const usersWithSpheres: UserSphereData[] = allUsers
        .filter(u => u.role !== 'admin') // Исключаем админов из списка
        .map(u => ({
          userId: u.id,
          userName: u.name || u.login || u.id,
          selectedSphere: u.selectedSphere,
          sphereSelectedAt: u.sphereSelectedAt
        }))
      setUsers(usersWithSpheres)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  const handleSaveSphere = async (userId: string) => {
    if (!tempSphere) return
    setSaving(userId)
    try {
      await updateUser(userId, {
        selectedSphere: tempSphere as ContourSphere,
        sphereSelectedAt: new Date().toISOString()
      })
      setUsers(prev => prev.map(u => 
        u.userId === userId 
          ? { ...u, selectedSphere: tempSphere as ContourSphere, sphereSelectedAt: new Date().toISOString() }
          : u
      ))
      setEditingSphere(null)
      setTempSphere('')
    } catch (error) {
      console.error('Error updating sphere:', error)
    } finally {
      setSaving(null)
    }
  }

  const handleResetSphere = async (userId: string) => {
    setSaving(userId)
    try {
      await updateUser(userId, {
        selectedSphere: undefined,
        sphereSelectedAt: undefined
      })
      setUsers(prev => prev.map(u => 
        u.userId === userId 
          ? { ...u, selectedSphere: undefined, sphereSelectedAt: undefined }
          : u
      ))
      setEditingSphere(null)
      setEditingDate(null)
      setTempSphere('')
      setTempDate('')
    } catch (error) {
      console.error('Error resetting sphere:', error)
    } finally {
      setSaving(null)
    }
  }

  const handleExtendLock = async (userId: string) => {
    if (!tempDate) return
    setSaving(userId)
    try {
      // Extend lock by adding days to current date
      const daysToAdd = parseInt(tempDate)
      if (isNaN(daysToAdd) || daysToAdd <= 0) {
        alert('Введите корректное количество дней')
        setSaving(null)
        return
      }
      
      const newLockDate = new Date()
      newLockDate.setDate(newLockDate.getDate() + daysToAdd)
      
      await updateUser(userId, {
        sphereSelectedAt: newLockDate.toISOString()
      })
      setUsers(prev => prev.map(u => 
        u.userId === userId 
          ? { ...u, sphereSelectedAt: newLockDate.toISOString() }
          : u
      ))
      setEditingDate(null)
      setTempDate('')
    } catch (error) {
      console.error('Error extending lock:', error)
    } finally {
      setSaving(null)
    }
  }

  const handleResetLock = async (userId: string) => {
    setSaving(userId)
    try {
      await updateUser(userId, {
        sphereSelectedAt: new Date().toISOString()
      })
      setUsers(prev => prev.map(u => 
        u.userId === userId 
          ? { ...u, sphereSelectedAt: new Date().toISOString() }
          : u
      ))
    } catch (error) {
      console.error('Error resetting lock:', error)
    } finally {
      setSaving(null)
    }
  }

  if (!isAdmin) return null

  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className={`rounded-2xl p-6 ${cardBg} shadow-xl border-2 ${borderColor}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4E6E49]/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#4E6E49]" />
          </div>
          <div>
            <h3 className={`font-bold ${textColor}`}>Управление сферами Contour</h3>
            <p className={`text-xs ${subtleText}`}>Выбор сферы для каждого пользователя</p>
          </div>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} ${subtleText}`} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className={`w-6 h-6 mx-auto animate-spin text-[#4E6E49]`} />
          <p className={`text-sm mt-2 ${subtleText}`}>Загрузка...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <Users className={`w-8 h-8 mx-auto mb-2 ${subtleText}`} />
          <p className={`text-sm ${subtleText}`}>Нет пользователей для управления</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {users.map(user => (
            <div 
              key={user.userId}
              className={`p-4 rounded-xl border ${borderColor} ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedUser(expandedUser === user.userId ? null : user.userId)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    {user.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-medium ${textColor}`}>{user.userName}</p>
                    <p className={`text-xs ${subtleText}`}>
                      {user.selectedSphere 
                        ? `Выбрана: ${SPHERE_META[user.selectedSphere]?.label || user.selectedSphere}`
                        : 'Сфера не выбрана'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.selectedSphere && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {SPHERE_META[user.selectedSphere]?.emoji}
                    </span>
                  )}
                  {expandedUser === user.userId ? (
                    <ChevronUp className={`w-4 h-4 ${subtleText}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 ${subtleText}`} />
                  )}
                </div>
              </div>

              {expandedUser === user.userId && (
                <div className={`mt-4 pt-4 border-t ${borderColor}`}>
                  {user.sphereSelectedAt && (
                    <p className={`text-xs mb-3 ${subtleText}`}>
                      Выбрано: {new Date(user.sphereSelectedAt).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  
                  {editingSphere === user.userId ? (
                    <div className="space-y-3">
                      <select
                        value={tempSphere}
                        onChange={(e) => setTempSphere(e.target.value as ContourSphere | '')}
                        className={`w-full p-3 rounded-xl border ${borderColor} ${
                          theme === 'dark' ? 'bg-[#0a0f14]' : 'bg-white'
                        } ${textColor}`}
                      >
                        <option value="">Выберите сферу</option>
                        {sphereOptions.map(sphere => (
                          <option key={sphere} value={sphere}>
                            {SPHERE_META[sphere]?.emoji} {SPHERE_META[sphere]?.label}
                          </option>
                        ))}
                      </select>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveSphere(user.userId)}
                          disabled={!tempSphere || saving === user.userId}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#4E6E49] hover:bg-[#4E6E49]/90 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all"
                        >
                          {saving === user.userId ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Сохранить
                        </button>
                        <button
                          onClick={() => {
                            setEditingSphere(null)
                            setTempSphere('')
                          }}
                          className="p-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : editingDate === user.userId ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${subtleText}`} />
                        <input
                          type="number"
                          placeholder="Количество дней"
                          value={tempDate}
                          onChange={(e) => setTempDate(e.target.value)}
                          className={`flex-1 p-3 rounded-xl border ${borderColor} ${
                            theme === 'dark' ? 'bg-[#0a0f14]' : 'bg-white'
                          } ${textColor}`}
                        />
                        <span className={`text-xs ${subtleText}`}>дней</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleExtendLock(user.userId)}
                          disabled={!tempDate || saving === user.userId}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all"
                        >
                          {saving === user.userId ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          Продлить
                        </button>
                        <button
                          onClick={() => {
                            setEditingDate(null)
                            setTempDate('')
                          }}
                          className="p-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSphere(user.userId)
                          setTempSphere(user.selectedSphere || '')
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 border border-[#4E6E49]/30 text-[#4E6E49] rounded-xl font-medium text-sm transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                        Изменить
                      </button>
                      {user.selectedSphere && (
                        <>
                          <button
                            onClick={() => handleResetLock(user.userId)}
                            disabled={saving === user.userId}
                            className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-500 rounded-xl font-medium text-sm transition-all"
                            title="Сбросить дату блокировки на сегодня"
                          >
                            {saving === user.userId ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Calendar className="w-4 h-4" />
                            )}
                            Сбросить
                          </button>
                          <button
                            onClick={() => handleResetSphere(user.userId)}
                            disabled={saving === user.userId}
                            className="flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl font-medium text-sm transition-all"
                          >
                            {saving === user.userId ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                            Сбросить
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Lock management buttons */}
                  {user.selectedSphere && !editingSphere && !editingDate && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingDate(user.userId)
                          setTempDate('')
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-500 rounded-xl font-medium text-sm transition-all"
                      >
                        <Calendar className="w-4 h-4" />
                        Продлить блокировку
                      </button>
                    </div>
                  )}

                  {/* Info about lock */}
                  <div className={`mt-4 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className={`text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        Пользователь не может изменить сферу. Только админ может снять или продлить блокировку.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContourSphereManager
