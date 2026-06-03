import { ReactNode, useCallback } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { useAdminStore, AdminSection } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'

interface AdminProtectedLinkProps extends Omit<LinkProps, 'to' | 'onClick'> {
  to: string
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  section?: AdminSection // Опционально: указываем раздел для проверки доступа
}

// Маппинг путей к разделам
const pathToSection: Record<string, AdminSection> = {
  '/admin': 'admin',
  '/controls': 'controls',
  '/team-wallets': 'team-wallets',
  '/appeals': 'appeals',
  '/applications': 'applications',
  '/approvals': 'approvals',
  '/feedback-form': 'feedback-form',
  '/hr-hub': 'hr-hub',
}

// Admins who do NOT need code verification (exempt users)
const EXEMPT_USER_IDS = ['1', '3']; // Артём (id: 1) и Ксения (id: 3)

export const AdminProtectedLink: React.FC<AdminProtectedLinkProps> = ({
  to,
  children,
  className,
  onClick,
  section,
  ...props
}) => {
  const { hasSectionAccess } = useAdminStore()
  const { user } = useAuthStore()
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Determine section from prop or path
    const targetSection = section || pathToSection[to]
    
    // Check if user has access to this section
    if (!hasSectionAccess(targetSection)) {
      e.preventDefault()
      console.warn('[AdminProtectedLink] Access denied to section:', targetSection)
      return
    }
    
    // If already on this page, allow navigation
    if (window.location.pathname === to) {
      return
    }
    
    // Check if user is exempt from code verification
    const isExempt = user?.id && EXEMPT_USER_IDS.includes(user.id)
    
    if (isExempt) {
      // No code required - navigate directly
      window.location.href = to
      return
    }
    
    // Prevent default navigation
    e.preventDefault()
    
    // Open global admin code modal with userId
    if (window.openAdminCodeModal) {
      window.openAdminCodeModal(() => {
        window.location.href = to
      }, user?.id)
    }
    
    // Call parent onClick if provided
    onClick?.(e)
  }, [to, onClick, section, hasSectionAccess, user?.id])

  // Determine section for access check
  const targetSection = section || pathToSection[to]
  const hasAccess = hasSectionAccess(targetSection)
  
  // If no access, render disabled link
  if (!hasAccess) {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all opacity-50 cursor-not-allowed bg-gray-500/10 text-gray-500`}
        title="Нет доступа"
      >
        {children}
      </div>
    )
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
