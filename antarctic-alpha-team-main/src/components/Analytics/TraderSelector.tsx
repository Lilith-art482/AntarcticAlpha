import React from 'react'
import { MultiSelect, SelectOption } from '@/components/Call/MultiSelect'
import { TEAM_MEMBERS } from '@/types'
import { Users } from 'lucide-react'
import Avatar from '@/components/Avatar'

interface TraderSelectorProps {
    selectedTraders: string[]
    onSelect: (traderIds: string[]) => void
}

export const TraderSelector: React.FC<TraderSelectorProps> = ({
    selectedTraders,
    onSelect,
}) => {
    const traderOptions: SelectOption[] = TEAM_MEMBERS.map(member => ({
        value: member.id,
        label: member.name,
        icon: <Avatar user={member} size="sm" className="w-4 h-4" />
    }))

    return (
        <MultiSelect
            value={selectedTraders}
            onChange={onSelect}
            options={traderOptions}
            placeholder="Трейдеры"
            searchable={true}
            icon={<Users size={16} />}
        />
    )
}
