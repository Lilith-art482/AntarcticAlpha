import { TaskCategory } from '@/types'
import {
  BookOpen,
  CandlestickChart,
  Cpu,
  Radio,
  LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<TaskCategory, LucideIcon> = {
  trading: CandlestickChart,
  development: Cpu,
  stream: Radio,
  learning: BookOpen,
}
