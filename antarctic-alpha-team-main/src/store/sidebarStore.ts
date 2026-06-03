import { create } from 'zustand'

interface SidebarStore {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: typeof window !== 'undefined' 
    ? localStorage.getItem('sidebarCollapsed') === 'true'
    : false,
  setIsCollapsed: (collapsed) => {
    localStorage.setItem('sidebarCollapsed', String(collapsed))
    set({ isCollapsed: collapsed })
  },
}))
