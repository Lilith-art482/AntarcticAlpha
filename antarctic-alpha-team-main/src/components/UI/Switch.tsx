import React from 'react'

interface SwitchProps {
    id: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    className?: string
}

export const Switch: React.FC<SwitchProps> = ({ id, checked, onCheckedChange, className }) => {
    return (
        <label htmlFor={id} className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${checked ? 'bg-emerald-600' : 'bg-gray-200'} ${className || ''}`}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="sr-only" // Скрывает оригинальный чекбокс, чтобы стилизовать его через div
            />
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </label>
    )
}