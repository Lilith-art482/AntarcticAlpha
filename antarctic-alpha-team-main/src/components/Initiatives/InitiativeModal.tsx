import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Initiative, addInitiative, updateInitiative } from '@/services/initiativesService'
import { X, Save, Plus, Trash2, ImageIcon, Check } from 'lucide-react'
import Avatar from '@/components/Avatar'
import { UserNickname } from '@/components/UserNickname'
import { useUsers } from '@/hooks/useUsers'

interface InitiativeModalProps {
    isOpen: boolean
    onClose: () => void
    initiative: Initiative | null
}

interface LinkInput {
    url: string
    title: string
}

export const InitiativeModal = ({ isOpen, onClose, initiative }: InitiativeModalProps) => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { users } = useUsers()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Initiative>>({
        title: '',
        sphere: '',
        description: '',
        screenshots: [],
        links: [],
        coauthors: []
    })
    const [linkInputs, setLinkInputs] = useState<LinkInput[]>([])

    useEffect(() => {
        if (initiative) {
            setFormData({
                title: initiative.title || '',
                sphere: initiative.sphere || '',
                description: initiative.description || '',
                screenshots: initiative.screenshots || [],
                links: initiative.links || [],
                coauthors: initiative.coauthors || []
            })
            const parsedLinks = initiative.links?.map(link => {
                const parts = link.slice(-1) === '-' ? [link.slice(0, -1).trim()] : link.split(' - ')
                return { url: parts[0] || '', title: parts[1] || '' }
            }) || []
            setLinkInputs(parsedLinks.length > 0 ? parsedLinks : [{ url: '', title: '' }])
        } else {
            setFormData({
                title: '',
                sphere: '',
                description: '',
                screenshots: [],
                links: [],
                coauthors: []
            })
            setLinkInputs([{ url: '', title: '' }])
        }
    }, [initiative, isOpen])

    if (!isOpen) return null

    const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newScreenshots: string[] = [...formData.screenshots!]
        const filesArray = Array.from(files)

        filesArray.forEach(file => {
            if (newScreenshots.length >= 5) return
            const reader = new FileReader()
            reader.onloadend = () => {
                newScreenshots.push(reader.result as string)
                setFormData({ ...formData, screenshots: newScreenshots })
            }
            reader.readAsDataURL(file)
        })
    }

    const handleScreenshotPaste = (e: React.ClipboardEvent) => {
        const file = e.clipboardData.files[0]
        if (!file || !file.type.startsWith('image/')) return
        if (formData.screenshots!.length >= 5) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData({
                ...formData,
                screenshots: [...formData.screenshots!, reader.result as string]
            })
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveScreenshot = (index: number) => {
        const newScreenshots = formData.screenshots!.filter((_, i) => i !== index)
        setFormData({ ...formData, screenshots: newScreenshots })
    }

    const handleAddLinkInput = () => {
        if (linkInputs.length < 5) {
            setLinkInputs([...linkInputs, { url: '', title: '' }])
        }
    }

    const handleRemoveLinkInput = (index: number) => {
        const newLinkInputs = linkInputs.filter((_, i) => i !== index)
        setLinkInputs(newLinkInputs)
    }

    const handleLinkInputChange = (index: number, field: keyof LinkInput, value: string) => {
        const newLinkInputs = [...linkInputs]
        newLinkInputs[index] = { ...newLinkInputs[index], [field]: value }
        setLinkInputs(newLinkInputs)
    }

    const handleToggleCoauthor = (userId: string) => {
        const currentCoauthors = formData.coauthors || []
        if (currentCoauthors.includes(userId)) {
            setFormData({
                ...formData,
                coauthors: currentCoauthors.filter(id => id !== userId)
            })
        } else {
            setFormData({
                ...formData,
                coauthors: [...currentCoauthors, userId]
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formattedLinks = linkInputs
                .filter(link => !(link.url.trim() === '' && link.title.trim() === ''))
                .map(link => `${link.url.trim()} - ${link.title.trim()}`)

            if (initiative) {
                await updateInitiative(initiative.id, {
                    title: formData.title,
                    sphere: formData.sphere,
                    description: formData.description,
                    screenshots: formData.screenshots,
                    links: formattedLinks,
                    coauthors: formData.coauthors
                })
            } else {
                await addInitiative({
                    title: formData.title!,
                    sphere: formData.sphere!,
                    description: formData.description!,
                    screenshots: formData.screenshots!,
                    links: formattedLinks,
                    coauthors: formData.coauthors!,
                    createdBy: user?.id || ''
                })
            }
            onClose()
        } catch (error) {
            console.error('Ошибка при сохранении инициативы:', error)
        } finally {
            setLoading(false)
        }
    }

    const bgColor = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    const availableUsers = users.filter(u => u.id !== user?.id)

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
            <div className={`${bgColor} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 mb-8 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-inherit z-10">
                    <h2 className={`text-xl font-black tracking-tight ${textColor}`}>
                        {initiative ? 'Редактировать инициативу' : 'Добавить инициативу'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
                    {/* Короткое название */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Короткое название инициативы</label>
                        <input
                            type="text"
                            placeholder="автоматизация отчетности"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#4C7F6E] outline-none transition-all ${inputBg} ${textColor}`}
                        />
                    </div>

                    {/* Сфера */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Сфера</label>
                        <input
                            type="text"
                            placeholder="управление, торговля, пул и так далее"
                            value={formData.sphere}
                            onChange={(e) => setFormData({ ...formData, sphere: e.target.value })}
                            required
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#4C7F6E] outline-none transition-all ${inputBg} ${textColor}`}
                        />
                    </div>

                    {/* Подробное описание */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Подробное описание инициативы</label>
                        <textarea
                            rows={4}
                            placeholder="Опишите вашу инициативу подробно..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#4C7F6E] outline-none transition-all resize-none ${inputBg} ${textColor}`}
                        />
                    </div>

                    {/* Скриншоты */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">
                            Скриншоты ({formData.screenshots?.length || 0}/5)
                        </label>
                        <div className="space-y-3">
                            {formData.screenshots && formData.screenshots.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {formData.screenshots.map((screenshot, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={screenshot}
                                                alt={`Screenshot ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-xl border border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveScreenshot(index)}
                                                className="absolute top-1 right-1 p-1 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {(formData.screenshots?.length || 0) < 5 && (
                                <div
                                    className={`relative flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-dashed cursor-pointer transition-all ${theme === 'dark' ? 'border-white/20 hover:border-[#4C7F6E]/50 hover:bg-white/5' : 'border-gray-300 hover:border-[#4C7F6E]/50 hover:bg-gray-50'}`}
                                    onPaste={handleScreenshotPaste}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleScreenshotUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <ImageIcon className={`w-5 h-5 ${subTextColor}`} />
                                    <div className="text-center">
                                        <span className={`text-sm ${subTextColor}`}>
                                            Перетащите, вставьте или загрузите
                                        </span>
                                        <p className={`text-xs ${subTextColor} mt-1 opacity-60`}>
                                            До 5 скриншотов
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ссылки */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">
                            Ссылки ({linkInputs.filter(l => l.url.trim()).length}/5)
                        </label>
                        {linkInputs.map((linkInput, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ссылка"
                                    value={linkInput.url}
                                    onChange={(e) => handleLinkInputChange(index, 'url', e.target.value)}
                                    className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#4C7F6E] outline-none transition-all ${inputBg} ${textColor}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Название"
                                    value={linkInput.title}
                                    onChange={(e) => handleLinkInputChange(index, 'title', e.target.value)}
                                    className={`w-32 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#4C7F6E] outline-none transition-all ${inputBg} ${textColor}`}
                                />
                                {linkInputs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLinkInput(index)}
                                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {linkInputs.length < 5 && (
                            <button
                                type="button"
                                onClick={handleAddLinkInput}
                                className="w-full px-4 py-3 mt-2 rounded-xl border border-dashed border-[#4C7F6E] text-[#4C7F6E] hover:bg-[#4C7F6E]/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Добавить ссылку
                            </button>
                        )}
                    </div>

                    {/* Соавторы */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">
                            Соавторы ({formData.coauthors?.length || 0})
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {availableUsers.length === 0 ? (
                                <p className={`text-sm ${subTextColor}`}>Нет доступных участников</p>
                            ) : (
                                availableUsers.map((u) => (
                                    <div
                                        key={u.id}
                                        onClick={() => handleToggleCoauthor(u.id)}
                                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                                            formData.coauthors?.includes(u.id)
                                                ? 'bg-[#4C7F6E]/20 border border-[#4C7F6E]/30'
                                                : theme === 'dark'
                                                    ? 'bg-white/5 hover:bg-white/10'
                                                    : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Avatar userId={u.id} size="sm" />
                                        <div className="flex-1">
                                            <UserNickname userId={u.id} className={`text-sm font-bold ${textColor}`} />
                                        </div>
                                        {formData.coauthors?.includes(u.id) && (
                                            <div className="w-5 h-5 rounded-full bg-[#4C7F6E] flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-[#4C7F6E]/20 transition-all active:scale-95"
                        >
                            {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
                            {initiative ? 'Обновить инициативу' : 'Создать инициативу'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
