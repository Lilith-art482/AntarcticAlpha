import React from 'react'
import { User } from '@/types'
import { useUserAvatar } from '@/utils/userUtils'

interface AvatarProps {
  user?: User
  userId?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ user, userId, size = 'md', className = '' }) => {
  const effectiveUserId = userId || user?.id || ''
  const avatarUrl = useUserAvatar(effectiveUserId, user?.avatar)
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-sm'
      case 'lg': return 'w-16 h-16 text-2xl'
      default: return 'w-10 h-10 text-base'
    }
  }

  const getInitials = () => {
    if (!user?.name) return '?'
    const names = user.name.split(' ')
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0][0]
  }

  return (
    <div
      className={`
        ${getSizeClasses()} 
        rounded-full flex items-center justify-center 
        bg-gradient-to-br from-emerald-500 to-teal-600 
        text-white font-semibold
        ${className}
      `}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name || 'User'}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  )
}

export default Avatar