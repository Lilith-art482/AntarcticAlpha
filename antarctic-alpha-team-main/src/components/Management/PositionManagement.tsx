import React from 'react'
import { X, Plus } from 'lucide-react'
import { PREDEFINED_POSITIONS } from '@/types'

interface PositionManagementProps {
    positions: string[]
    primaryPosition: string
    onPositionsChange: (positions: string[]) => void
    onPrimaryChange: (primary: string) => void
    theme: string
    labelColor: string
    subTextColor: string
}

export const PositionManagement: React.FC<PositionManagementProps> = ({
    positions = [],
    primaryPosition,
    onPositionsChange,
    onPrimaryChange,
    theme,
    labelColor,
    subTextColor,
}) => {
    const [customInput, setCustomInput] = React.useState('')
    const [showCustomInput, setShowCustomInput] = React.useState(false)

    const addPosition = (position: string) => {
        if (positions.includes(position)) {
            alert('Эта должность уже добавлена')
            return
        }
        if (positions.length >= 10) {
            alert('Максимум 10 должностей на участника')
            return
        }
        const newPositions = [...positions, position]
        onPositionsChange(newPositions)

        // Auto-set as primary if it's the first position
        if (newPositions.length === 1) {
            onPrimaryChange(position)
        }
    }

    const removePosition = (position: string) => {
        const newPositions = positions.filter(p => p !== position)
        onPositionsChange(newPositions)

        // If removed position was primary, set first available as primary
        if (primaryPosition === position && newPositions.length > 0) {
            onPrimaryChange(newPositions[0])
        } else if (newPositions.length === 0) {
            onPrimaryChange('')
        }
    }

    const addCustomPosition = () => {
        if (!customInput.trim()) return
        addPosition(customInput.trim())
        setCustomInput('')
        setShowCustomInput(false)
    }

    return (
        <div className="space-y-3">
            <label className={`block text-sm font-medium ${labelColor}`}>
                Должности участника
            </label>

            {/* Current Positions */}
            {positions.length > 0 && (
                <div className="space-y-2">
                    {positions.map((position) => (
                        <div
                            key={position}
                            className={`flex items-center justify-between p-2.5 rounded-lg border ${theme === 'dark'
                                    ? 'bg-gray-800/50 border-gray-700'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="radio"
                                    checked={primaryPosition === position}
                                    onChange={() => onPrimaryChange(position)}
                                    className="w-4 h-4 text-emerald-500 cursor-pointer"
                                />
                                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {position}
                                </span>
                                {primaryPosition === position && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                        Основная
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removePosition(position)}
                                className={`p-1 rounded hover:bg-red-500/10 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                                    }`}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Position from Predefined */}
            {positions.length < 10 && (
                <div className="space-y-2">
                    <p className={`text-xs ${subTextColor}`}>Добавить из списка:</p>
                    <div className="flex flex-wrap gap-2">
                        {PREDEFINED_POSITIONS.filter(p => !positions.includes(p)).map((position) => (
                            <button
                                key={position}
                                type="button"
                                onClick={() => addPosition(position)}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 hover:border-emerald-500 text-gray-300'
                                        : 'bg-white border-gray-300 hover:border-emerald-500 text-gray-700'
                                    }`}
                            >
                                {position}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Position Input */}
            {positions.length < 10 && (
                <div>
                    {!showCustomInput ? (
                        <button
                            type="button"
                            onClick={() => setShowCustomInput(true)}
                            className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors ${theme === 'dark'
                                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            <Plus size={14} />
                            Добавить свою должность
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPosition())}
                                placeholder="Введите название должности"
                                className={`flex-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                                    }`}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={addCustomPosition}
                                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors"
                            >
                                Добавить
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCustomInput(false)
                                    setCustomInput('')
                                }}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${theme === 'dark'
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                Отмена
                            </button>
                        </div>
                    )}
                </div>
            )}

            {positions.length === 0 && (
                <p className={`text-xs ${subTextColor}`}>
                    Нет добавленных должностей. Выберите из списка или добавьте свою.
                </p>
            )}
        </div>
    )
}
