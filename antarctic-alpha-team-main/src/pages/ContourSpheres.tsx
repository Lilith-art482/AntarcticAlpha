import { useAdminStore } from '@/store/adminStore'
import ContourSphereManager from '@/components/Management/ContourSphereManager'

export default function ContourSpheres() {
  const { isAdmin } = useAdminStore()

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Access denied</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Администрирование</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Управление сферами Contour</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Просмотр и изменение выбранных сфер для пользователей
        </p>
      </div>

      <ContourSphereManager />
    </div>
  )
}

