import { useState, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { MessageSquare, Plus, Users, Bot, Radio, Heart, Send, X, AlertCircle } from 'lucide-react'
import Avatar from '@/components/Avatar'
import { TEAM_MEMBERS, User } from '@/types'
import { getAllUsers } from '@/services/firestoreService'
import { getUserNicknameSync } from '@/utils/userUtils'

interface ChatUser {
  id: string
  name: string
  type: 'ai' | 'hub' | 'pulse' | 'user'
  avatar?: string
}

interface AttachmentLink {
  id: string
  url: string
  name: string
}

interface AttachmentImage {
  id: string
  url: string
  name: string
}

interface AttachmentFile {
  id: string
  url: string
  name: string
  type: string
  size: number
}

interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  timestamp: string
  isBot?: boolean
  links?: AttachmentLink[]
  images?: AttachmentImage[]
  files?: AttachmentFile[]
}

export const Communication = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null)
  const [showUserSelector, setShowUserSelector] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkName, setLinkName] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [selectedImages, setSelectedImages] = useState<AttachmentImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bannerTextColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const bannerTextColorSubtle = theme === 'dark' ? 'text-white/80' : 'text-gray-700/80'

  // Chat history storage (in-memory for demo - will be replaced with Firestore)
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({})
  const [activeChats, setActiveChats] = useState<Set<string>>(new Set())

  // Predefined chats
  const predefinedChats: ChatUser[] = [
    { id: 'ai-fiastic', name: 'Пингвин Фиастик', type: 'ai', avatar: '/avatars/fiastic.png' },
    { id: 'hub-arca', name: 'HUB ARCA TEAM', type: 'hub', avatar: '/avatars/hub-arca.png' },
    { id: 'pulse-arca', name: 'Pulse ARCA', type: 'pulse', avatar: '/avatars/pulse-arca.png' },
    { id: 'concierge', name: 'Консьерж-сервис', type: 'pulse', avatar: '/avatars/concierge.png' },
  ]

  // Load all users for selector
  const loadUsers = async () => {
    try {
      const usersData = await getAllUsers()
      const teamMembers = TEAM_MEMBERS.map(m => ({ ...m }))
      const firestoreUsers = Array.isArray(usersData) ? usersData : (usersData as any).users || []
      setAllUsers([...teamMembers, ...firestoreUsers.filter((u: User) => !teamMembers.find((tm: User) => tm.id === u.id))])
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleOpenUserSelector = () => {
    loadUsers()
    setShowUserSelector(true)
    setShowAttachmentMenu(false)
  }

  const handleSelectUser = (selectedUser: User) => {
    const chatUser: ChatUser = {
      id: selectedUser.id,
      name: getUserNicknameSync(selectedUser.id),
      type: 'user',
      avatar: selectedUser.avatar
    }
    setSelectedChat(chatUser)
    setShowUserSelector(false)
    setActiveChats(prev => new Set([...prev, chatUser.id]))
    // Load chat history
    const existingMessages = chatHistory[chatUser.id] || []
    setMessages(existingMessages)
    setShowAttachmentMenu(false)
  }

  const handleSendMessage = () => {
    if ((!messageInput.trim() && selectedImages.length === 0 && !linkUrl) || !selectedChat || !canSendMessage(selectedChat)) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      senderId: user?.id || 'unknown',
      senderName: user?.name || 'You',
      timestamp: new Date().toISOString(),
      links: linkUrl ? [{ id: Date.now().toString(), url: linkUrl, name: linkName || linkUrl }] : undefined,
      images: selectedImages.length > 0 ? selectedImages : undefined,
      files: undefined
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    
    // Save to chat history
    setChatHistory(prev => ({
      ...prev,
      [selectedChat.id]: updatedMessages
    }))
    
    // Mark chat as active
    setActiveChats(prev => new Set([...prev, selectedChat.id]))

    setMessageInput('')
    setLinkUrl('')
    setLinkName('')
    setSelectedImages([])
    setShowAttachmentMenu(false)

    // Simulate bot response for AI chat
    if (selectedChat.type === 'ai') {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Привет! Я Пингвин Фиастик 🐧 Чем могу помочь?',
          senderId: 'ai-fiastic',
          senderName: 'Пингвин Фиастик',
          timestamp: new Date().toISOString(),
          isBot: true
        }
        const updatedBotMessages = [...updatedMessages, botResponse]
        setMessages(updatedBotMessages)
        setChatHistory(prev => ({
          ...prev,
          [selectedChat.id]: updatedBotMessages
        }))
      }, 1000)
    }
  }

  const handleConfirmLink = () => {
    if (!linkUrl.trim() || !selectedChat) return

    const link: AttachmentLink = {
      id: Date.now().toString(),
      url: linkUrl,
      name: linkName || linkUrl
    }

    const existingMessages = chatHistory[selectedChat.id] || []
    const updatedMessages = [...existingMessages, {
      id: Date.now().toString(),
      text: '',
      senderId: user?.id || 'unknown',
      senderName: user?.name || 'You',
      timestamp: new Date().toISOString(),
      links: [link]
    }]

    setMessages(updatedMessages)
    setChatHistory(prev => ({
      ...prev,
      [selectedChat.id]: updatedMessages
    }))
    setActiveChats(prev => new Set([...prev, selectedChat.id]))

    setLinkUrl('')
    setLinkName('')
    setShowLinkModal(false)
    setShowAttachmentMenu(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !selectedChat) return

    const newImages: AttachmentImage[] = Array.from(files).map(file => ({
      id: Date.now() + Math.random().toString(),
      url: URL.createObjectURL(file),
      name: file.name
    }))

    setSelectedImages(prev => [...prev, ...newImages])

    // Auto-send with images
    const existingMessages = chatHistory[selectedChat.id] || []
    const updatedMessages = [...existingMessages, {
      id: Date.now().toString(),
      text: messageInput,
      senderId: user?.id || 'unknown',
      senderName: user?.name || 'You',
      timestamp: new Date().toISOString(),
      images: newImages
    }]

    setMessages(updatedMessages)
    setChatHistory(prev => ({
      ...prev,
      [selectedChat.id]: updatedMessages
    }))
    setActiveChats(prev => new Set([...prev, selectedChat.id]))

    setMessageInput('')
    setSelectedImages([])
  }

  const handleViewImage = (imageUrl: string, messagesWithImages: Message[]) => {
    const index = messagesWithImages.findIndex(msg => msg.images?.some(img => img.url === imageUrl))
    if (index !== -1) {
      setImageIndex(index)
      setSelectedImage(imageUrl)
    }
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedChat) return
    const messagesWithImages = messages.filter(msg => msg.images && msg.images.length > 0)
    
    if (direction === 'next' && imageIndex < messagesWithImages.length - 1) {
      setImageIndex(imageIndex + 1)
      setSelectedImage(messagesWithImages[imageIndex + 1].images![0].url)
    } else if (direction === 'prev' && imageIndex > 0) {
      setImageIndex(imageIndex - 1)
      setSelectedImage(messagesWithImages[imageIndex - 1].images![0].url)
    }
  }

  const getChatIcon = (chat: ChatUser) => {
    switch (chat.type) {
      case 'ai':
        return <Bot className="w-6 h-6" />
      case 'hub':
        return <Radio className="w-6 h-6" />
      case 'pulse':
        return chat.id === 'concierge' ? <Heart className="w-6 h-6" /> : <Heart className="w-6 h-6" />
      case 'user':
        return <Users className="w-6 h-6" />
    }
  }

  const getChatColor = (chat: ChatUser) => {
    switch (chat.type) {
      case 'ai':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
      case 'hub':
        return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
      case 'pulse':
        return theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
      case 'user':
        return theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
    }
  }

  const getChatDescription = (chat: ChatUser) => {
    switch (chat.type) {
      case 'ai':
        return 'ИИ-ассистент'
      case 'hub':
        return 'Команда ARCA'
      case 'pulse':
        return chat.id === 'concierge' ? 'Личный помощник' : 'Обновления'
      case 'user':
        return 'Участник команды'
    }
  }

  const isConciergeChat = (chat: ChatUser | null) => {
    return chat?.id === 'concierge'
  }

  const canSendMessage = (chat: ChatUser | null) => {
    // Консьерж-сервис заблокирован до выполнения условий
    if (chat?.id === 'concierge') return false
    return true
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Warning Banner */}
      <div className={`w-full max-w-6xl p-4 rounded-2xl border-2 ${
        theme === 'dark' 
          ? 'bg-amber-500/10 border-amber-500/30' 
          : 'bg-amber-50 border-amber-200'
      } flex items-start gap-3`}>
        <div className={`p-2 rounded-xl ${
          theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
        }`}>
          <AlertCircle className={`w-6 h-6 ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold mb-1 ${bannerTextColor}`}>
            Раздел в разработке
          </h3>
          <p className={`text-sm ${bannerTextColorSubtle}`}>
            Функционал чатов в настоящее время совершенствуется. До момента полного запуска 
            рекомендуем использовать для связи VK или Telegram.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl h-[calc(100vh-300px)] flex gap-6">
        {/* Chat List Sidebar */}
      <div className={`w-80 ${cardBg} rounded-2xl border-2 ${borderColor} shadow-lg flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className={`p-4 border-b ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${headingColor}`}>Чаты</h2>
            <button
              onClick={handleOpenUserSelector}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
              }`}
              title="Начать новый чат"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Predefined Chats */}
          {predefinedChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat)
                const existingMessages = chatHistory[chat.id] || []
                setMessages(existingMessages)
                if (existingMessages.length > 0) {
                  setActiveChats(prev => new Set([...prev, chat.id]))
                }
              }}
              className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 ${
                selectedChat?.id === chat.id
                  ? theme === 'dark'
                    ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                    : 'bg-emerald-100 border-2 border-emerald-300'
                  : theme === 'dark'
                    ? 'hover:bg-white/5 border-2 border-transparent'
                    : 'hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
              }`}>
                <div className={getChatColor(chat)}>
                  {getChatIcon(chat)}
                </div>
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold ${headingColor}`}>{chat.name}</p>
                <p className={`text-sm ${labelColor}`}>
                  {getChatDescription(chat)}
                </p>
              </div>
            </button>
          ))}

          <div className={`my-3 border-t ${borderColor}`} />

          <p className={`text-xs uppercase tracking-wider mb-2 ${labelColor} px-3`}>Личные чаты</p>

          {/* User Chats - only show active chats */}
          {allUsers
            .filter(u => activeChats.has(u.id) && u.id !== user?.id)
            .map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  handleSelectUser(u)
                }}
                className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 ${
                  selectedChat?.id === u.id
                    ? theme === 'dark'
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                      : 'bg-emerald-100 border-2 border-emerald-300'
                    : theme === 'dark'
                      ? 'hover:bg-white/5 border-2 border-transparent'
                      : 'hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Avatar user={u} size="sm" />
                <div className="flex-1 text-left">
                  <p className={`font-semibold ${headingColor}`}>{getUserNicknameSync(u.id)}</p>
                  <p className={`text-sm ${labelColor}`}>Участник команды</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${cardBg} rounded-2xl border-2 ${borderColor} shadow-lg flex flex-col overflow-hidden`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b ${borderColor} flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
              }`}>
                <div className={getChatColor(selectedChat)}>
                  {getChatIcon(selectedChat)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${headingColor}`}>{selectedChat.name}</h3>
                <p className={`text-sm ${labelColor}`}>
                  {getChatDescription(selectedChat)}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                      theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                    }`}>
                      <MessageSquare className={`w-12 h-12 ${labelColor}`} />
                    </div>
                    {isConciergeChat(selectedChat) ? (
                      <>
                        <p className={`text-base font-semibold mb-3 ${headingColor}`}>
                          Здесь личный помощник, который сделает всё: от доставки подарков до бронирования отелей и билетов. Освободите время для главного — торговли.
                        </p>
                        <div className={`p-4 rounded-xl text-left ${
                          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                        }`}>
                          <p className={`text-sm font-bold mb-2 ${headingColor}`}>Как получить доступ:</p>
                          <ul className={`text-sm space-y-2 ${labelColor}`}>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 flex-shrink-0">💰</span>
                              <span>Внесите от <strong className={headingColor}>500 USDT</strong> в пул и поддерживайте эту сумму каждый месяц</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 flex-shrink-0">💳</span>
                              <span>Проведите операций (покупка/вывод USDT + QR-оплата) на <strong className={headingColor}>350 USDT/месяц</strong></span>
                            </li>
                          </ul>
                          <p className={`text-xs mt-3 font-medium ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>
                            Станьте ближе к статусу, чтобы не пропустить запуск ❤️
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className={labelColor}>Начните диалог с первым сообщением</p>
                    )}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === (user?.id || 'unknown') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.senderId === (user?.id || 'unknown')
                        ? theme === 'dark'
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-emerald-100 border border-emerald-200'
                        : theme === 'dark'
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-gray-100 border border-gray-200'
                    }`}>
                      <p className={`text-sm font-semibold mb-1 ${
                        msg.senderId === (user?.id || 'unknown')
                          ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                          : getChatColor(selectedChat)
                      }`}>
                        {msg.senderName}
                      </p>
                      {msg.text && <p className={headingColor}>{msg.text}</p>}
                      
                      {/* Links */}
                      {msg.links && msg.links.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                              }`}
                            >
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <span className="text-sm truncate">{link.name}</span>
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Images */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.images.map((img) => (
                            <button
                              key={img.id}
                              onClick={() => handleViewImage(img.url, messages)}
                              className="relative group"
                            >
                              <img src={img.url} alt={img.name} className="w-32 h-32 object-cover rounded-lg" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Files */}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.url}
                              download={file.name}
                              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 hover:bg-gray-700'
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                            >
                              <svg className={`w-4 h-4 flex-shrink-0 ${labelColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${headingColor}`}>{file.name}</p>
                                <p className={`text-xs ${labelColor}`}>{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}

                      <p className={`text-xs mt-2 ${labelColor}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${borderColor}`}>
              {/* Attachment Preview */}
              {selectedImages.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedImages.map((img, idx) => (
                    <div key={img.id} className="relative">
                      <img src={img.url} alt={img.name} className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Link Preview */}
              {linkUrl && (
                <div className={`mb-3 p-3 rounded-lg flex items-center justify-between ${
                  theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex-1">
                    <p className={`font-semibold ${headingColor}`}>{linkName || 'Ссылка'}</p>
                    <p className={`text-sm truncate ${labelColor}`}>{linkUrl}</p>
                  </div>
                  <button
                    onClick={() => { setLinkUrl(''); setLinkName(''); }}
                    className="ml-3 p-1 hover:bg-white/20 rounded"
                  >
                    <X className={`w-4 h-4 ${labelColor}`} />
                  </button>
                </div>
              )}

              {/* Attachment Menu */}
              {showAttachmentMenu && (
                <div className={`mb-3 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                  <div className="flex gap-3 mb-3">
                    <button
                      onClick={() => setShowLinkModal(true)}
                      className={`flex-1 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        theme === 'dark' ? 'hover:bg-blue-500/20' : 'hover:bg-blue-100'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold ${headingColor}`}>Ссылка</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-1 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        theme === 'dark' ? 'hover:bg-purple-500/20' : 'hover:bg-purple-100'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold ${headingColor}`}>Фото</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-1 p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        theme === 'dark' ? 'hover:bg-green-500/20' : 'hover:bg-green-100'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold ${headingColor}`}>Файл</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => canSendMessage(selectedChat) && setShowAttachmentMenu(!showAttachmentMenu)}
                  disabled={!canSendMessage(selectedChat)}
                  className={`p-3 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && canSendMessage(selectedChat) && handleSendMessage()}
                  placeholder={isConciergeChat(selectedChat) ? 'Чат заблокирован до выполнения условий' : 'Напишите сообщение...'}
                  disabled={!canSendMessage(selectedChat)}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-300'
                  } outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && selectedImages.length === 0 && !linkUrl) || !canSendMessage(selectedChat)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    (messageInput.trim() || selectedImages.length > 0 || linkUrl) && canSendMessage(selectedChat)
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : theme === 'dark'
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`inline-flex p-6 rounded-2xl mb-4 ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
              }`}>
                <MessageSquare className={`w-16 h-16 ${labelColor}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${headingColor}`}>Выберите чат</h3>
              <p className={labelColor}>
                Выберите существующий чат или создайте новый с участником команды
              </p>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* User Selector Modal */}
      {showUserSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowUserSelector(false)}>
          <div
            className={`${cardBg} rounded-2xl border-2 ${borderColor} shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
              <h3 className={`text-xl font-bold ${headingColor}`}>Выберите участника</h3>
              <button
                onClick={() => setShowUserSelector(false)}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-5 h-5 ${labelColor}`} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allUsers
                  .filter(u => u.id !== user?.id)
                  .map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      <Avatar user={u} size="md" />
                      <div className="text-left">
                        <p className={`font-semibold ${headingColor}`}>{getUserNicknameSync(u.id)}</p>
                        <p className={`text-sm ${labelColor}`}>Участник команды</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div
            className={`${cardBg} rounded-2xl border-2 ${borderColor} shadow-xl max-w-md w-full p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-xl font-bold mb-4 ${headingColor}`}>Добавить ссылку</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>URL ссылки</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-300'
                  } outline-none transition-colors`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>Название (опционально)</label>
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="Мое название"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-300'
                  } outline-none transition-colors`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Отмена
                </button>
                <button
                  onClick={handleConfirmLink}
                  disabled={!linkUrl.trim()}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    linkUrl.trim()
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center">
            {/* Navigation Buttons */}
            {messages.filter(msg => msg.images && msg.images.length > 0).length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                  disabled={imageIndex === 0}
                  className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                  disabled={imageIndex >= messages.filter(msg => msg.images && msg.images.length > 0).length - 1}
                  className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <img src={selectedImage} alt="Full view" className="max-w-full max-h-[85vh] object-contain rounded-lg" />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white">
              {imageIndex + 1} / {messages.filter(msg => msg.images && msg.images.length > 0).length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
