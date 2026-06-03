import { RatingData } from '@/types'

export interface RatingBreakdown {
  // Основные метрики
  weeklyHours: number
  weeklyHoursPoints: number
  weeklyEarnings: number
  weeklyEarningsPoints: number
  referrals: number
  referralsPoints: number
  initiatives: number
  initiativesPoints: number
  absenceDays: number
  absenceDaysPoints: number
  truancyDays: number
  truancyDaysPoints: number
  totalRating: number
}

export const calculateRating = (
  data: Omit<RatingData, 'rating'>,
  weeklyHours: number = 0,
  weeklyEarnings: number = 0,
  _weeklyDaysOff: number = 0,
  _weeklySickDays: number = 0,
  _ninetyDayVacationDays: number = 0
): number => {
  console.log('calculateRating input:', {
    userId: data.userId,
    weeklyHours,
    weeklyEarnings,
    data_referrals: data.referrals,
    data_initiatives: data.initiatives,
    data_absenceDays: data.absenceDays,
    data_truancyDays: data.truancyDays
  })

  let rating = 0

  // Часы работы в неделю:
  // < 15 часов = 0 баллов
  // 15-25 часов = 10 баллов
  // 25-40+ часов = 20 баллов
  let weeklyHoursPoints = 0
  if (weeklyHours >= 25) {
    weeklyHoursPoints = 20
  } else if (weeklyHours >= 15) {
    weeklyHoursPoints = 10
  }
  rating += weeklyHoursPoints
  console.log('Hours calculation:', { weeklyHours, weeklyHoursPoints, currentRating: rating })

  // Заработок за неделю:
  // < 10.000 ₽ = 0 баллов
  // 10.000 - 20.000 ₽ = 10 баллов
  // 20.000 - 30.000 ₽ = 15 баллов
  // 30.000 - 60.000+ ₽ = 20 баллов
  let weeklyEarningsPoints = 0
  if (weeklyEarnings >= 30000) {
    weeklyEarningsPoints = 20
  } else if (weeklyEarnings >= 20000) {
    weeklyEarningsPoints = 15
  } else if (weeklyEarnings >= 10000) {
    weeklyEarningsPoints = 10
  }
  rating += weeklyEarningsPoints
  console.log('Earnings calculation:', { weeklyEarnings, weeklyEarningsPoints, currentRating: rating })

  // Рефералы за месяц:
  // 1 реферал = 5 баллов
  let referralsPoints = data.referrals * 5
  rating += referralsPoints
  console.log('Referrals calculation:', { referrals: data.referrals, referralsPoints, currentRating: rating })

  // Инициативы за месяц:
  // < 2 = 0 баллов
  // 2 = 20 баллов
  // 2-4+ = 40 баллов
  let initiativesPoints = 0
  if (data.initiatives >= 4) {
    initiativesPoints = 40
  } else if (data.initiatives >= 2) {
    initiativesPoints = 20
  }
  rating += initiativesPoints
  console.log('Initiatives calculation:', { initiatives: data.initiatives, initiativesPoints, currentRating: rating })

  // Отсутствия за месяц:
  // < 5 = 10 баллов
  // > 10 = -20 баллов
  // 5-10 = 0 баллов
  let absenceDaysPoints = 0
  if (data.absenceDays < 5) {
    absenceDaysPoints = 10
  } else if (data.absenceDays > 10) {
    absenceDaysPoints = -20
  }
  rating += absenceDaysPoints
  console.log('Absence calculation:', { absenceDays: data.absenceDays, absenceDaysPoints, currentRating: rating })

  // Прогулы за месяц:
  // > 3 = -15 баллов
  // > 6 = -30 баллов
  let truancyDaysPoints = 0
  if (data.truancyDays > 6) {
    truancyDaysPoints = -30
  } else if (data.truancyDays > 3) {
    truancyDaysPoints = -15
  }
  rating += truancyDaysPoints
  console.log('Truancy calculation:', { truancyDays: data.truancyDays, truancyDaysPoints, currentRating: rating })

  console.log('Final rating calculation:', {
    finalRating: rating
  })

  return rating
}

export const getRatingBreakdown = (
  data: Omit<RatingData, 'rating'>,
  weeklyHours: number = 0,
  weeklyEarnings: number = 0,
  _weeklyDaysOff: number = 0,
  _weeklySickDays: number = 0,
  _ninetyDayVacationDays: number = 0
): RatingBreakdown => {
  // Часы работы в неделю
  let weeklyHoursPoints = 0
  if (weeklyHours >= 25) {
    weeklyHoursPoints = 20
  } else if (weeklyHours >= 15) {
    weeklyHoursPoints = 10
  }

  // Заработок за неделю
  let weeklyEarningsPoints = 0
  if (weeklyEarnings >= 30000) {
    weeklyEarningsPoints = 20
  } else if (weeklyEarnings >= 20000) {
    weeklyEarningsPoints = 15
  } else if (weeklyEarnings >= 10000) {
    weeklyEarningsPoints = 10
  }

  // Рефералы за месяц: 1 реферал = 5 баллов
  let referralsPoints = data.referrals * 5

  // Инициативы за месяц
  let initiativesPoints = 0
  if (data.initiatives >= 4) {
    initiativesPoints = 40
  } else if (data.initiatives >= 2) {
    initiativesPoints = 20
  }

  // Отсутствия за месяц
  let absenceDaysPoints = 0
  if (data.absenceDays < 5) {
    absenceDaysPoints = 10
  } else if (data.absenceDays > 10) {
    absenceDaysPoints = -20
  }

  // Прогулы за месяц
  let truancyDaysPoints = 0
  if (data.truancyDays > 6) {
    truancyDaysPoints = -30
  } else if (data.truancyDays > 3) {
    truancyDaysPoints = -15
  }

  const totalRating = weeklyHoursPoints +
    weeklyEarningsPoints +
    referralsPoints +
    initiativesPoints +
    absenceDaysPoints +
    truancyDaysPoints

  return {
    weeklyHours,
    weeklyHoursPoints,
    weeklyEarnings,
    weeklyEarningsPoints,
    referrals: data.referrals,
    referralsPoints,
    initiatives: data.initiatives,
    initiativesPoints,
    absenceDays: data.absenceDays,
    absenceDaysPoints,
    truancyDays: data.truancyDays,
    truancyDaysPoints,
    totalRating,
  }
}

export const getRatingColor = (rating: number): string => {
  if (rating >= 80) return '#10b981' // Эталон (зелёный)
  if (rating >= 60) return '#3b82f6' // Уверенно (синий)
  if (rating >= 40) return '#f59e0b' // В пути (янтарный)
  return '#f43f5e' // Зона роста (розовый)
}

export interface ExclusionStatus {
  status: 'excluded' | 'warning' | 'ok'
  label: string
  description: string
  color: string
}

export const getExclusionStatus = (rating: number): ExclusionStatus => {
  if (rating < 50) {
    return {
      status: 'excluded',
      label: 'Не в команде',
      description: 'Для нахождения в команде необходимо минимум 50 баллов',
      color: '#dc2626' // красный
    }
  } else if (rating >= 50 && rating < 70) {
    return {
      status: 'warning',
      label: 'Риск исключения',
      description: 'Показатели ниже рекомендуемых, требуется улучшение',
      color: '#f59e0b' // янтарный
    }
  } else {
    return {
      status: 'ok',
      label: 'В команде',
      description: 'Участник соответствует требованиям команды',
      color: '#10b981' // зеленый
    }
  }
}
