import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ScheduleDateState {
  selectedDate: string | null
  selectedWeekStart: string | null
  viewMode: 'table' | 'week'
  setSelectedDate: (date: string | null) => void
  setSelectedWeekStart: (date: string | null) => void
  setViewMode: (mode: 'table' | 'week') => void
  resetDate: () => void
}

export const useScheduleDateStore = create<ScheduleDateState>()(
  persist(
    (set) => ({
      selectedDate: null,
      selectedWeekStart: null,
      viewMode: 'table',

      setSelectedDate: (date: string | null) => {
        set({ selectedDate: date })
      },

      setSelectedWeekStart: (date: string | null) => {
        set({ selectedWeekStart: date })
      },

      setViewMode: (mode: 'table' | 'week') => {
        set({ viewMode: mode })
      },

      resetDate: () => {
        set({ selectedDate: null, selectedWeekStart: null })
      },
    }),
    {
      name: 'schedule-date-storage',
    }
  )
)
