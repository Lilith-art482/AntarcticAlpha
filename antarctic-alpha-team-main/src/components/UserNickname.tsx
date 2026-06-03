// UserNickname component that automatically updates when nickname changes
import { useUserNickname } from '@/utils/userUtils'

interface UserNicknameProps {
  userId: string
  className?: string
  fallback?: string
  formatter?: (nickname: string) => string
  avatarUrl?: string // Добавляем пропс для URL аватара
}

export const UserNickname = ({
  userId,
  className = '',
  fallback = 'unknown',
  formatter,
  avatarUrl // Принимаем avatarUrl
}: UserNicknameProps) => {
  const nickname = useUserNickname(userId)
  const displayNickname = nickname || fallback
  return (
    <div className="flex items-center gap-2">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-6 h-6 rounded-full object-cover" // Стили для аватара
        />
      )}
      <span className={className}>{formatter ? formatter(displayNickname) : displayNickname}</span>
    </div>
  )
}
