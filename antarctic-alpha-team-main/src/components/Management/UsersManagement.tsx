import React, { useState, useEffect, useRef } from 'react'
import { Plus, User, X, Image, RefreshCw, Eye, EyeOff, Check, Mail, Phone, Key, Lock, Zap, User as UserIcon, Pencil, Copy, FileText, CreditCard, MapPin, Home, Hash } from 'lucide-react'
import { User as UserType, TEAM_MEMBERS, User as UserInterface } from '@/types'
import { getAllUsers, addUser, updateUser, setUserNickname } from '@/services/firestoreService'
import { clearNicknameCache } from '@/utils/userUtils'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { generateUserCredentials } from '@/utils/userUtils'
import Avatar from '@/components/Avatar'
import { PositionManagement } from './PositionManagement'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Тип для персональных данных
interface PersonalData {
  lastName: string
  firstName: string
  middleName: string
  birthDate: string
  birthPlace: string
  registrationAddress: string
  residenceAddress: string
  passportSeries: string
  passportNumber: string
  passportIssuedBy: string
  passportIssueDate: string
  passportDepartmentCode: string
  inn: string
  passportPhotos: string[]
}

// Component for editable field row
interface FieldRowProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  field: string
  editingField: string | null
  editValue: string
  setEditValue: (value: string) => void
  savingField: string | null
  theme: string
  headingColor: string
  subTextColor: string
  onStartEdit: (field: string, value: string) => void
  onSave: (field: string) => void
  onCancel: () => void
  isPassword?: boolean
  onToggleVisibility?: () => void
  showPassword?: boolean
  onCopy?: (field: string, value: string) => void
  isCopied?: boolean
  rawValue?: string
}

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  value,
  icon: Icon,
  field,
  editingField,
  editValue,
  setEditValue,
  savingField,
  theme,
  headingColor,
  subTextColor,
  onStartEdit,
  onSave,
  onCancel,
  isPassword,
  onToggleVisibility,
  showPassword,
  onCopy,
  isCopied,
  rawValue,
}) => {
  const isEditing = editingField === field
  const isSaving = savingField === field

  if (isEditing) {
    return (
      <div className={`p-4 rounded-2xl border transition-all ${theme === 'dark'
        ? 'bg-white/[0.05] border-[#4C7F6E]/50'
        : 'bg-[#4C7F6E]/10 border-[#4C7F6E]/30'
        }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${theme === 'dark' ? 'bg-white/5 text-[#4C7F6E]' : 'bg-white text-[#4C7F6E] border border-[#4C7F6E]/20'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-[10px] font-black uppercase tracking-wider block mb-1.5 ${subTextColor}`}>
              {label}
            </span>
            <input
              type={isPassword ? 'text' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition-all font-mono text-sm ${theme === 'dark'
                ? 'bg-[#1a1a1a] border-gray-700 text-white focus:border-emerald-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                }`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave(field)
                if (e.key === 'Escape') onCancel()
              }}
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onSave(field)}
              disabled={isSaving}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-500 hover:bg-emerald-600'} text-white disabled:opacity-50`}
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={onCancel}
              disabled={isSaving}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`group relative p-4 rounded-2xl border transition-all duration-300 ${theme === 'dark'
      ? 'bg-white/[0.03] border-white/10 hover:border-[#4C7F6E]/50 hover:bg-white/[0.05]'
      : 'bg-gray-50 border-gray-200 hover:border-[#4C7F6E]/30 hover:bg-[#4C7F6E]/10'
      }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-xl shrink-0 ${theme === 'dark' ? 'bg-white/5 text-[#4C7F6E]' : 'bg-white text-[#4C7F6E] border border-[#4C7F6E]/20'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${subTextColor}`}>
              {label}
            </span>
            <p className={`text-sm font-bold truncate ${headingColor}`}>
              {value}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onCopy && (
            <button
              onClick={() => onCopy(field, rawValue || value)}
              className={`p-2 rounded-lg transition-colors ${isCopied ? 'bg-[#4C7F6E] text-white' : theme === 'dark' ? 'hover:bg-white/10 text-gray-500 group-hover:text-[#4C7F6E]' : 'hover:bg-gray-200 text-gray-500 group-hover:text-[#4C7F6E]'}`}
              title={isCopied ? 'Скопировано' : 'Копировать'}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-200 text-gray-500'}`}
              title={showPassword ? 'Скрыть' : 'Показать'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => onStartEdit(field, value === '—' ? '' : value)}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-500 group-hover:text-[#4C7F6E]' : 'hover:bg-gray-200 text-gray-500 group-hover:text-[#4C7F6E]'}`}
            title="Редактировать"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Merge Firestore users with TEAM_MEMBERS (same logic as useUsers hook)
const mergeUsersWithTeamMembers = (firestoreUsers: UserInterface[]): UserInterface[] => {
  const usersMap = new Map<string, UserInterface>()

  // Add TEAM_MEMBERS first (as fallback/base)
  TEAM_MEMBERS.forEach(user => {
    usersMap.set(user.id, user)
  })

  // Override with Firestore users (new/updated users)
  firestoreUsers.forEach(user => {
    usersMap.set(user.id, user)
  })

  return Array.from(usersMap.values())
}

export const UsersManagement: React.FC = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: '',
    login: '',
    password: '',
    avatar: '',
    nickname: '',
    phone: '',
    recoveryCode: '',
  })
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [generatedCredentials, setGeneratedCredentials] = useState<{ login: string; password: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showUserPasswords, setShowUserPasswords] = useState<Record<string, boolean>>({})
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingField, setSavingField] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  
  // Personal data state
  const [personalData, setPersonalData] = useState<PersonalData | null>(null)
  const [loadingPersonalData, setLoadingPersonalData] = useState(false)
  const [showPassportPhotosModal, setShowPassportPhotosModal] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalFileInputRef = useRef<HTMLInputElement>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const firestoreUsers = await getAllUsers()
      const allUsers = mergeUsersWithTeamMembers(firestoreUsers)
      setUsers(allUsers)
    } catch (error: any) {
      console.error('Error loading users:', error)
      // Fallback to TEAM_MEMBERS on error
      setUsers(TEAM_MEMBERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.login || !formData.password) {
      alert('Заполните все обязательные поля')
      return
    }

    // Validate positions
    if (formData.positions && formData.positions.length > 10) {
      alert('Максимум 10 должностей на участника')
      return
    }

    // Ensure primaryPosition is in positions array
    if (formData.primaryPosition && formData.positions && !formData.positions.includes(formData.primaryPosition)) {
      alert('Основная должность должна быть в списке должностей')
      return
    }

    try {
      // Create complete user data object
      const userData = {
        name: formData.name,
        login: formData.login,
        password: formData.password,
        nickname: formData.nickname || undefined,
        avatar: formData.avatar || undefined,
        phone: formData.phone || undefined,
        recoveryCode: formData.recoveryCode || undefined,
        positions: formData.positions || undefined,
        primaryPosition: formData.primaryPosition || undefined,
      }

      if (editingUser) {
        await updateUser(editingUser.id, userData)
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: { userId: editingUser.id } }))
      } else {
        const newUserRef = await addUser(userData)
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: { userId: newUserRef } }))
        setGeneratedCredentials(null)
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      await loadUsers()
      closeForm()
    } catch (error: any) {
      console.error('Error saving user:', error)
      alert('Ошибка при сохранении пользователя')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file size to 2MB before processing
    if (file.size > 2 * 1024 * 1024) {
      alert('Файл слишком большой. Выберите изображение до 2МБ')
      return
    }

    try {
      setUploading(true)

      const reader = new FileReader()
      reader.onload = (event: any) => {
        const img = new window.Image()
        img.onload = () => {
          // Create a canvas to resize the image to a reasonable size (200x200)
          // This keeps the Base64 string small enough for Firestore
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          // Get compressed Base64 string
          const base64String = canvas.toDataURL('image/jpeg', 0.7)
          setFormData((prev: Partial<UserType>) => ({ ...prev, avatar: base64String }))
          setUploading(false)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error('Error processing image:', error)
      alert('Ошибка при обработке изображения')
      setUploading(false)
    }
  }

  const openAddForm = () => {
    setEditingUser(null)
    const credentials = generateUserCredentials('', users)
    setFormData({
      name: '',
      login: credentials.login,
      password: credentials.password,
      nickname: '',
      avatar: '',
      phone: '',
      recoveryCode: '',
      positions: [],
      primaryPosition: '',
    })
    setGeneratedCredentials(credentials)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({
      name: '',
      login: '',
      password: '',
      nickname: '',
      avatar: '',
      phone: '',
      recoveryCode: '',
      positions: [],
      primaryPosition: '',
    })
    setGeneratedCredentials(null)
  }

  const regenerateCredentials = () => {
    // Get current users list for uniqueness check
    const currentUsers = users.length > 0 ? users : TEAM_MEMBERS
    const credentials = generateUserCredentials(formData.name || 'user', currentUsers)
    setFormData({ ...formData, login: credentials.login, password: credentials.password })
    setGeneratedCredentials(credentials)
  }

  const openUserModal = async (user: UserType) => {
    setSelectedUser(user)
    setShowUserModal(true)
    
    // Load personal data from Firestore
    setLoadingPersonalData(true)
    setPersonalData(null)
    try {
      const userDoc = await getDoc(doc(db, 'users', user.id))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setPersonalData({
          lastName: data.lastName || '',
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          birthDate: data.birthDate || '',
          birthPlace: data.birthPlace || '',
          registrationAddress: data.registrationAddress || '',
          residenceAddress: data.residenceAddress || '',
          passportSeries: data.passportSeries || '',
          passportNumber: data.passportNumber || '',
          passportIssuedBy: data.passportIssuedBy || '',
          passportIssueDate: data.passportIssueDate || '',
          passportDepartmentCode: data.passportDepartmentCode || '',
          inn: data.inn || '',
          passportPhotos: data.passportPhotos || [],
        })
      }
    } catch (error) {
      console.error('Error loading personal data:', error)
    } finally {
      setLoadingPersonalData(false)
    }
  }

  const closeUserModal = () => {
    setSelectedUser(null)
    setShowUserModal(false)
  }

  const toggleUserPassword = (field: string) => {
    setShowUserPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const copyField = (field: string, value: string) => {
    if (!value || value === '—') return
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const copyAllUserData = () => {
    if (!selectedUser) return
    
    const data = `👤 *${selectedUser.name}*
${selectedUser.nickname ? `@${selectedUser.nickname}` : ''}

🔑 *Данные для входа:*
• Логин: ${selectedUser.login}
• Пароль: ${selectedUser.password}
${selectedUser.phone ? `• Телефон: ${selectedUser.phone}` : ''}
${selectedUser.email ? `• Почта: ${selectedUser.email}` : ''}
${selectedUser.recoveryCode ? `• Код восстановления: ${selectedUser.recoveryCode}` : ''}
${selectedUser.authCode ? `• Код авторизации: ${selectedUser.authCode}` : ''}`

    navigator.clipboard.writeText(data)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 3000)
  }

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field)
    setEditValue(currentValue === '—' ? '' : currentValue)
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditValue('')
  }

  const saveField = async (field: string) => {
    if (!selectedUser) return
    
    setSavingField(field)
    try {
      const updateData: Partial<UserType> = {}
      
      switch (field) {
        case 'login':
          updateData.login = editValue
          break
        case 'password':
          updateData.password = editValue
          break
        case 'phone':
          updateData.phone = editValue || undefined
          break
        case 'email':
          updateData.email = editValue || undefined
          break
        case 'recoveryCode':
          updateData.recoveryCode = editValue || undefined
          break
        case 'authCode':
          updateData.authCode = editValue || undefined
          break
        case 'nickname':
          // Update nickname in separate collection and clear cache
          if (editValue !== selectedUser.nickname) {
            if (editValue) {
              await setUserNickname(selectedUser.id, editValue)
            }
            // Clear cache to force reload
            clearNicknameCache(selectedUser.id)
            // Update local state
            setSelectedUser(prev => prev ? { ...prev, nickname: editValue || undefined } : null)
            // Reload users list
            await loadUsers()
            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('nicknameUpdated', { detail: { userId: selectedUser.id } }))
          }
          setEditingField(null)
          setEditValue('')
          return
      }
      
      await updateUser(selectedUser.id, updateData)
      
      // Update local state
      setSelectedUser(prev => prev ? { ...prev, ...updateData } : null)
      
      // Update users list
      await loadUsers()
      
      setEditingField(null)
      setEditValue('')
    } catch (error) {
      console.error('Error updating field:', error)
      alert('Ошибка при сохранении')
    } finally {
      setSavingField(null)
    }
  }

  const handleModalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedUser) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Файл слишком большой. Выберите изображение до 2МБ')
      return
    }

    try {
      setSavingField('avatar')
      
      const reader = new FileReader()
      reader.onload = async (event) => {
        const img = new window.Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          const base64String = canvas.toDataURL('image/jpeg', 0.7)
          
          await updateUser(selectedUser.id, { avatar: base64String })
          setSelectedUser(prev => prev ? { ...prev, avatar: base64String } : null)
          await loadUsers()
          
          setSavingField(null)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Ошибка при загрузке фото')
      setSavingField(null)
    }
  }

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const subTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400'

  if (!isAdmin) {
    return (
      <div className={`p-4 rounded-xl border ${cardBg} ${borderColor}`}>
        <p className={labelColor}>Доступ запрещён. Только для администраторов.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${headingColor}`}>Управление участниками</h2>
        <button
          onClick={openAddForm}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${theme === 'dark'
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
        >
          <Plus size={18} />
          Добавить участника
        </button>
      </div>

      {/* Users Cards */}
      {loading ? (
        <div className={`p-8 text-center ${labelColor}`}>Загрузка...</div>
      ) : users.length === 0 ? (
        <div className={`p-8 text-center rounded-xl border ${cardBg} ${borderColor}`}>
          <User className={`w-12 h-12 mx-auto mb-3 opacity-30 ${labelColor}`} />
          <p className={labelColor}>Нет участников. Добавьте первого!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => openUserModal(user)}
              className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${theme === 'dark'
                ? 'bg-[#1a1a1a] border-gray-800 hover:border-[#4C7F6E]/50 hover:bg-[#222]'
                : 'bg-white border-gray-200 hover:border-[#4C7F6E]/30 hover:shadow-lg hover:shadow-[#4C7F6E]/10'
                }`}
            >
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <Avatar user={user} size="lg" className="w-16 h-16 mx-auto" />
                </div>
                <h3 className={`font-bold text-sm mb-1 ${headingColor} truncate`}>
                  {user.name}
                </h3>
                <p className={`text-xs mb-1 truncate ${subTextColor}`}>
                  {user.nickname || '—'}
                </p>
                <p className={`text-[10px] font-mono truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {user.login}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md ${cardBg} border-2 ${borderColor} shadow-2xl`}>
            <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${headingColor}`}>
                {editingUser ? 'Редактирование участника' : 'Новый участник'}
              </h3>
              <button
                onClick={closeForm}
                className={`p-1 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={labelColor} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${theme === 'dark'
                    ? 'bg-[#2a2a2a] border-gray-700 text-white focus:border-emerald-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500'
                    }`}
                  placeholder="Введите имя участника"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                  Никнейм (необязательно)
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${theme === 'dark'
                    ? 'bg-[#2a2a2a] border-gray-700 text-white focus:border-emerald-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500'
                    }`}
                  placeholder="Введите никнейм"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                    Телефон
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${theme === 'dark'
                      ? 'bg-[#2a2a2a] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500'
                      }`}
                    placeholder="79001234567"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                    Код восстановления
                  </label>
                  <input
                    type="text"
                    value={formData.recoveryCode}
                    onChange={(e) => setFormData({ ...formData, recoveryCode: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${theme === 'dark'
                      ? 'bg-[#2a2a2a] border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500'
                      }`}
                    placeholder="Код"
                  />
                </div>
              </div>

              {/* Credentials Section */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium ${labelColor}`}>Учётные данные для входа</span>
                  {!editingUser && (
                    <button
                      type="button"
                      onClick={regenerateCredentials}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                      <RefreshCw size={12} />
                      Сгенерировать заново
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${subTextColor}`}>
                      Логин <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.login}
                        onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark'
                          ? 'bg-[#2a2a2a] border-gray-700 text-white focus:border-emerald-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                          }`}
                        placeholder="login"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${subTextColor}`}>
                      Пароль <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords['form'] ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark'
                          ? 'bg-[#2a2a2a] border-gray-700 text-white focus:border-emerald-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                          }`}
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, form: !prev.form }))}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        {showPasswords['form'] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Show generated credentials info for new users */}
                  {!editingUser && generatedCredentials && (
                    <div className={`text-xs p-2 rounded-lg ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                      Учётные данные сгенерированы автоматически. Скопируйте их перед закрытием формы.
                    </div>
                  )}
                </div>
              </div>

              {/* Position Management Section */}
              <PositionManagement
                positions={formData.positions || []}
                primaryPosition={formData.primaryPosition || ''}
                onPositionsChange={(positions) => setFormData({ ...formData, positions })}
                onPrimaryChange={(primaryPosition) => setFormData({ ...formData, primaryPosition })}
                theme={theme}
                labelColor={labelColor}
                subTextColor={subTextColor}
              />

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${labelColor}`}>
                  Фото участника
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar user={{ ...formData, id: editingUser?.id || '' } as UserType} size="lg" className="w-16 h-16" />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`w-full px-4 py-2 rounded-xl text-sm font-bold transition-all ${theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } border ${borderColor} flex items-center justify-center gap-2`}
                    >
                      {uploading ? 'Загрузка...' : formData.avatar ? 'Изменить фото' : 'Загрузить фото'}
                      {!uploading && <Image size={16} />}
                    </button>
                    <p className={`mt-1 text-[10px] ${subTextColor}`}>
                      Рекомендуется квадратное изображение (JPG, PNG)
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${theme === 'dark'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                >
                  {editingUser ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeUserModal}
          />
          <div className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] ${cardBg} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border ${borderColor} animate-in fade-in zoom-in duration-500 max-h-[90vh] overflow-y-auto`}>
            {/* Decorative Background */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#4C7F6E]/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 -right-32 w-64 h-64 bg-[#4C7F6E]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative p-8">
              <button
                onClick={closeUserModal}
                className={`absolute top-6 right-6 p-2 rounded-full transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* User Header with Photo */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-3">
                  <Avatar user={selectedUser} size="lg" className="w-24 h-24" />
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleModalFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => modalFileInputRef.current?.click()}
                    disabled={savingField === 'avatar'}
                    className={`absolute -bottom-1 -right-1 p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-[#4C7F6E] hover:bg-[#3d6a5a]' : 'bg-[#4C7F6E] hover:bg-[#3d6a5a]'} text-white shadow-lg ${savingField === 'avatar' ? 'animate-pulse' : ''}`}
                    title="Изменить фото"
                  >
                    {savingField === 'avatar' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Pencil className="w-3 h-3" />}
                  </button>
                </div>
                <h2 className={`text-2xl font-black ${headingColor}`}>
                  {selectedUser.name}
                </h2>
              </div>

              {/* User Details with Edit */}
              <div className="space-y-3">
                {/* Никнейм */}
                <FieldRow
                  label="Никнейм"
                  value={selectedUser.nickname ? `@${selectedUser.nickname}` : '—'}
                  icon={UserIcon}
                  field="nickname"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  onCopy={copyField}
                  isCopied={copiedField === 'nickname'}
                  rawValue={selectedUser.nickname}
                />

                {/* Логин */}
                <FieldRow
                  label="Логин"
                  value={selectedUser.login}
                  icon={UserIcon}
                  field="login"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  onCopy={copyField}
                  isCopied={copiedField === 'login'}
                  rawValue={selectedUser.login}
                />

                {/* Пароль */}
                <FieldRow
                  label="Пароль"
                  value={showUserPasswords['password'] ? selectedUser.password : '••••••••••••'}
                  icon={Key}
                  field="password"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  isPassword
                  onToggleVisibility={() => toggleUserPassword('password')}
                  showPassword={showUserPasswords['password']}
                  onCopy={copyField}
                  isCopied={copiedField === 'password'}
                  rawValue={selectedUser.password}
                />

                {/* Телефон */}
                <FieldRow
                  label="Телефон"
                  value={showUserPasswords['phone'] ? (selectedUser.phone || '—') : '••••••••••••'}
                  icon={Phone}
                  field="phone"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  onToggleVisibility={() => toggleUserPassword('phone')}
                  showPassword={showUserPasswords['phone']}
                  onCopy={copyField}
                  isCopied={copiedField === 'phone'}
                  rawValue={selectedUser.phone}
                />

                {/* Почта */}
                <FieldRow
                  label="Почта"
                  value={showUserPasswords['email'] ? (selectedUser.email || '—') : '••••••••••••'}
                  icon={Mail}
                  field="email"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  onToggleVisibility={() => toggleUserPassword('email')}
                  showPassword={showUserPasswords['email']}
                  onCopy={copyField}
                  isCopied={copiedField === 'email'}
                  rawValue={selectedUser.email}
                />

                {/* Код восстановления */}
                <FieldRow
                  label="Код восстановления"
                  value={showUserPasswords['recoveryCode'] ? (selectedUser.recoveryCode || '—') : '••••••••••••'}
                  icon={Lock}
                  field="recoveryCode"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  onToggleVisibility={() => toggleUserPassword('recoveryCode')}
                  showPassword={showUserPasswords['recoveryCode']}
                  onCopy={copyField}
                  isCopied={copiedField === 'recoveryCode'}
                  rawValue={selectedUser.recoveryCode}
                />

                {/* Код авторизации */}
                <FieldRow
                  label="Код авторизации"
                  value={showUserPasswords['authCode'] ? (selectedUser.authCode || '—') : '••••••••••••'}
                  icon={Zap}
                  field="authCode"
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  savingField={savingField}
                  theme={theme}
                  headingColor={headingColor}
                  subTextColor={subTextColor}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEditing}
                  onToggleVisibility={() => toggleUserPassword('authCode')}
                  showPassword={showUserPasswords['authCode']}
                  onCopy={copyField}
                  isCopied={copiedField === 'authCode'}
                  rawValue={selectedUser.authCode}
                />
              </div>

              {/* Personal Data Section */}
              {(loadingPersonalData || personalData) && (
                <div className="mt-6">
                  <div className={`flex items-center gap-2 mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Персональные данные</span>
                  </div>
                  
                  {loadingPersonalData ? (
                    <div className={`text-center py-4 ${subTextColor}`}>Загрузка...</div>
                  ) : personalData && (
                    <div className="space-y-3">
                      {/* ФИО */}
                      {(personalData.lastName || personalData.firstName || personalData.middleName) && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${subTextColor}`}>
                            ФИО
                          </span>
                          <p className={`text-sm font-bold ${headingColor}`}>
                            {[personalData.lastName, personalData.firstName, personalData.middleName].filter(Boolean).join(' ')}
                          </p>
                        </div>
                      )}

                      {/* Дата рождения и место рождения */}
                      {(personalData.birthDate || personalData.birthPlace) && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="grid grid-cols-2 gap-4">
                            {personalData.birthDate && (
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${subTextColor}`}>
                                  Дата рождения
                                </span>
                                <p className={`text-sm font-bold ${headingColor}`}>
                                  {personalData.birthDate.split('-').reverse().join('.')}
                                </p>
                              </div>
                            )}
                            {personalData.birthPlace && (
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${subTextColor}`}>
                                  Место рождения
                                </span>
                                <p className={`text-sm font-bold ${headingColor}`}>
                                  {personalData.birthPlace}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Место регистрации */}
                      {personalData.registrationAddress && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className={`w-4 h-4 ${subTextColor}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                              Место регистрации
                            </span>
                          </div>
                          <p className={`text-sm font-bold ${headingColor}`}>
                            {personalData.registrationAddress}
                          </p>
                        </div>
                      )}

                      {/* Место проживания */}
                      {personalData.residenceAddress && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Home className={`w-4 h-4 ${subTextColor}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                              Место проживания
                            </span>
                          </div>
                          <p className={`text-sm font-bold ${headingColor}`}>
                            {personalData.residenceAddress}
                          </p>
                        </div>
                      )}

                      {/* Паспортные данные */}
                      {(personalData.passportSeries || personalData.passportNumber || personalData.passportIssuedBy) && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <CreditCard className={`w-4 h-4 ${subTextColor}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                              Паспортные данные
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {personalData.passportSeries && (
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${subTextColor}`}>
                                  Серия
                                </span>
                                <p className={`text-sm font-bold font-mono ${headingColor}`}>
                                  {personalData.passportSeries}
                                </p>
                              </div>
                            )}
                            {personalData.passportNumber && (
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${subTextColor}`}>
                                  Номер
                                </span>
                                <p className={`text-sm font-bold font-mono ${headingColor}`}>
                                  {personalData.passportNumber}
                                </p>
                              </div>
                            )}
                          </div>
                          {personalData.passportIssuedBy && (
                            <div className="mt-2">
                              <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${subTextColor}`}>
                                Кем выдан
                              </span>
                              <p className={`text-sm font-bold ${headingColor}`}>
                                {personalData.passportIssuedBy}
                              </p>
                            </div>
                          )}
                          {(personalData.passportIssueDate || personalData.passportDepartmentCode) && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              {personalData.passportIssueDate && (
                                <div>
                                  <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${subTextColor}`}>
                                    Дата выдачи
                                  </span>
                                  <p className={`text-sm font-bold ${headingColor}`}>
                                    {personalData.passportIssueDate.split('-').reverse().join('.')}
                                  </p>
                                </div>
                              )}
                              {personalData.passportDepartmentCode && (
                                <div>
                                  <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${subTextColor}`}>
                                    Код подразделения
                                  </span>
                                  <p className={`text-sm font-bold font-mono ${headingColor}`}>
                                    {personalData.passportDepartmentCode}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ИНН */}
                      {personalData.inn && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-gradient-to-r from-[#4C7F6E]/10 to-transparent border-[#4C7F6E]/20' : 'bg-gradient-to-r from-[#4C7F6E]/5 to-transparent border-[#4C7F6E]/20'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className={`w-4 h-4 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                              ИНН
                            </span>
                          </div>
                          <p className={`text-sm font-bold font-mono ${headingColor}`}>
                            {personalData.inn}
                          </p>
                        </div>
                      )}

                      {/* Фото паспорта */}
                      {personalData.passportPhotos && personalData.passportPhotos.length > 0 && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Image className={`w-4 h-4 ${subTextColor}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${subTextColor}`}>
                              Фото паспорта ({personalData.passportPhotos.length} стр.)
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {personalData.passportPhotos.map((photo, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  setCurrentPhotoIndex(index)
                                  setShowPassportPhotosModal(true)
                                }}
                                className="relative group cursor-pointer"
                              >
                                <img
                                  src={photo}
                                  alt={`Страница ${index + 1}`}
                                  className="w-16 h-16 rounded-lg object-cover border-2 border-[#4C7F6E]/30 hover:border-[#4C7F6E]/60 transition-all"
                                />
                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold py-0.5 text-center rounded-b-lg">
                                  {index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No personal data message */}
                      {!personalData.lastName && !personalData.firstName && !personalData.passportSeries && !personalData.inn && (
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                          <p className={`text-sm ${subTextColor} text-center`}>
                            Персональные данные не заполнены
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Copy All Button */}
              <button
                onClick={copyAllUserData}
                className={`w-full mt-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } ${copiedAll ? 'bg-[#4C7F6E] text-white' : ''}`}
              >
                {copiedAll ? <Check size={18} /> : <Copy size={18} />}
                {copiedAll ? 'Скопировано!' : 'Скопировать всё для Telegram'}
              </button>

              <button
                onClick={closeUserModal}
                className="w-full mt-6 py-4 rounded-[1.25rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black transition-all duration-300 hover:opacity-90 active:scale-95 shadow-xl"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passport Photos Modal */}
      {showPassportPhotosModal && personalData && personalData.passportPhotos && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowPassportPhotosModal(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setShowPassportPhotosModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setCurrentPhotoIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPhotoIndex === 0}
                className="absolute left-0 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <img
                src={personalData.passportPhotos[currentPhotoIndex]}
                alt={`Страница ${currentPhotoIndex + 1}`}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
              />
              
              <button
                onClick={() => setCurrentPhotoIndex(prev => Math.min(personalData.passportPhotos.length - 1, prev + 1))}
                disabled={currentPhotoIndex === personalData.passportPhotos.length - 1}
                className="absolute right-0 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <span className="text-white font-bold text-lg">
                {currentPhotoIndex + 1} / {personalData.passportPhotos.length}
              </span>
            </div>

            {/* Thumbnails */}
            {personalData.passportPhotos.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {personalData.passportPhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`relative group rounded-lg overflow-hidden transition-all ${
                      currentPhotoIndex === index ? 'ring-2 ring-[#4C7F6E] ring-offset-2 ring-offset-black' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Миниатюра ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold py-0.5 text-center">
                      {index + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
