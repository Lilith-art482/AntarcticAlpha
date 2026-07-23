// Типы сфер для Contour
export type ContourSphere = 
  | 'memecoins_trading'   // Мемкоины (трейдинг)
  | 'memecoins_deving'    // Мемкоины (девинг)
  | 'polymarket'          // Polymarket
  | 'futures'             // Фьючерсы и Спот
  | 'nft'                 // NFT
  | 'airdrop'             // AirDrop
  | 'digital_payments'    // Цифровые платёжные решения

export interface User {
  id: string
  name: string
  login: string
  password: string
  avatar?: string // Путь к изображению аватара
  role?: string
  nickname?: string
  recoveryCode?: string
  authCode?: string // Код авторизации (запрашивается при каждом входе)F
  phone?: string
  email?: string // Email пользователя
  telegram?: string // Telegram username
  vk?: string // VK username or profile link
  positions?: string[] // Array of positions (max 10)
  primaryPosition?: string // Primary position displayed in schedule
  // Contour сфера пользователя
  selectedSphere?: ContourSphere // Выбранная сфера
  sphereSelectedAt?: string // ISO timestamp когда была выбрана сфера
  // Статус верификации персональных данных
  personalDataVerificationStatus?: PersonalDataVerificationStatus
  personalDataVerificationSubmittedAt?: string // Когда была отправлена заявка
  personalDataVerificationProcessedAt?: string // Когда было принято решение
}

// Predefined position options
export const PREDEFINED_POSITIONS = [
  'Founder',
  'Co-Founder',
  'Caller Ultima',
  'Caller PRO',
  'Caller Base',
  'Analyst Ultima',
  'Analyst PRO',
  'Analyst Base',
  'Trader Ultima',
  'Trader Pro',
  'Trader Base',
  'Developer',
] as const

// Slot types
export interface TimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
  endDate?: string // YYYY-MM-DD format - optional, only if slot crosses midnight
  breaks?: {
    start: string // HH:mm format
    end: string // HH:mm format
  }[]
}

export type SlotCategory = 'memecoins' | 'futures' | 'nft' | 'spot' | 'airdrop' | 'polymarket' | 'staking' | 'other'

export const SLOT_CATEGORY_META: Record<SlotCategory, { label: string; accent: string; icon: string }> = {
  memecoins: { label: 'Мемкоины', accent: 'emerald', icon: 'rocket' },
  futures: { label: 'Фьючерсы', accent: 'blue', icon: 'trending' },
  nft: { label: 'NFT', accent: 'purple', icon: 'image' },
  spot: { label: 'Спот', accent: 'amber', icon: 'coins' },
  airdrop: { label: 'AirDrop', accent: 'cyan', icon: 'gift' },
  polymarket: { label: 'Polymarket', accent: 'pink', icon: 'barchart' },
  staking: { label: 'Стейкинг', accent: 'indigo', icon: 'shield' },
  other: { label: 'Крипто-рынок', accent: 'gray', icon: 'sparkles' },
}

export interface WorkSlot {
  id: string
  userId: string
  date: string // YYYY-MM-DD format
  slots: TimeSlot[]
  comment?: string
  participants: string[] // user IDs
  category?: SlotCategory // optional for backward compatibility with old slots
  taskId?: string // ID задачи из раздела Tasks (если слот связан с задачей)
}

// Day status types
export type DayStatusType = 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship' | 'working' | 'weekend'

export interface DayStatus {
  id: string
  userId: string
  date: string
  type: DayStatusType
  status?: 'pending' | 'approved' | 'rejected'
  comment?: string
  endDate?: string // for multi-day statuses
}

// Restriction types
export type RestrictionType = 'slots' | 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship' | 'all'

export interface Restriction {
  id: string
  type: RestrictionType // what to restrict
  startDate: string // YYYY-MM-DD format
  endDate?: string // YYYY-MM-DD format for ranges, optional for single dates
  startTime?: string // HH:mm format, optional - if set, restriction starts from this time
  blockFutureDates?: boolean // if true, after restriction time blocks creating records only on the next day after restriction date
  comment?: string
  createdBy: string // admin user ID
  createdAt: string
  isActive: boolean
}

export type ApprovalEntity = 'slot' | 'status' | 'earning' | 'referral' | 'login' | 'points_exchange'
export type ApprovalAction = 'create' | 'update' | 'delete'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalRequest {
  id: string
  entity: ApprovalEntity
  action: ApprovalAction
  status: ApprovalStatus
  authorId: string
  targetUserId: string
  before?: WorkSlot | DayStatus | Earnings | Referral | UserNickname | null
  after?: WorkSlot | DayStatus | Earnings | Referral | UserNickname | PointsExchangeRequest | null
  comment?: string // note from author
  adminComment?: string // decision note
  reviewedBy?: string
  createdAt: string
  updatedAt: string
  processedAt?: string // время когда админ обработал заявку
}

// Earnings types
export type EarningsCategory = 
  | 'memecoins_trading'   // Мемкоины (торговля)
  | 'memecoins_deving'    // Мемкоины (девинг)
  | 'polymarket'          // Polymarket
  | 'spot'                // Спот
  | 'futures'             // Фьючерсы
  | 'prop_trading'        // Проп-трейдинг
  | 'nft'                 // NFT
  | 'staking'             // Стейкинг
  | 'airdrop'             // AirDrop
  | 'p2p'                 // P2P
  | 'p2c'                 // P2C
  | 'funds'               // Фонда
  | 'other'               // Другое

// Extended type for backward compatibility (includes legacy 'memecoins')
export type EarningsCategoryExtended = EarningsCategory | 'memecoins'

export const EARNINGS_CATEGORY_META: Record<EarningsCategoryExtended, { label: string; accent: string; icon: 'rocket' | 'line' | 'image' | 'coins' | 'gift' | 'barchart' | 'shield' | 'sparkles' | 'repeat' | 'handshake' | 'code' | 'briefcase'; gradient: string; shortName: string }> = {
  // Legacy category for backward compatibility
  memecoins: { label: 'Мемкоины', accent: 'emerald', icon: 'rocket', gradient: 'from-emerald-500 to-teal-600', shortName: 'Мемы' },
  memecoins_trading: { label: 'Meme Trade', accent: 'emerald', icon: 'rocket', gradient: 'from-emerald-500 to-teal-600', shortName: 'Meme Trade' },
  memecoins_deving: { label: 'Meme Dev', accent: 'teal', icon: 'code', gradient: 'from-teal-500 to-cyan-600', shortName: 'Meme Dev' },
  polymarket: { label: 'Polymarket', accent: 'pink', icon: 'barchart', gradient: 'from-pink-500 to-rose-600', shortName: 'Poly' },
  spot: { label: 'Спот', accent: 'amber', icon: 'coins', gradient: 'from-amber-500 to-orange-600', shortName: 'Спот' },
  futures: { label: 'Фьючерсы', accent: 'blue', icon: 'line', gradient: 'from-blue-500 to-indigo-600', shortName: 'Фьюч' },
  prop_trading: { label: 'Проп-трейдинг', accent: 'violet', icon: 'briefcase', gradient: 'from-violet-500 to-purple-600', shortName: 'Проп' },
  nft: { label: 'NFT', accent: 'purple', icon: 'image', gradient: 'from-purple-500 to-pink-600', shortName: 'NFT' },
  staking: { label: 'Стейкинг', accent: 'indigo', icon: 'shield', gradient: 'from-indigo-500 to-violet-600', shortName: 'Stake' },
  airdrop: { label: 'AirDrop', accent: 'cyan', icon: 'gift', gradient: 'from-cyan-500 to-blue-600', shortName: 'Airdrop' },
  p2p: { label: 'P2P', accent: 'lime', icon: 'repeat', gradient: 'from-lime-500 to-green-600', shortName: 'P2P' },
  p2c: { label: 'P2C', accent: 'orange', icon: 'handshake', gradient: 'from-orange-500 to-amber-600', shortName: 'P2C' },
  funds: { label: 'Фонда', accent: 'purple', icon: 'briefcase', gradient: 'from-purple-500 to-pink-600', shortName: 'Фонда' },
  other: { label: 'Другое', accent: 'gray', icon: 'sparkles', gradient: 'from-gray-500 to-gray-600', shortName: 'Другое' },
}

// Периоды для аналитики
export type EarningsPeriod = 'day' | 'week' | 'month' | '3months' | '6months' | '12months' | 'all'

export const EARNINGS_PERIODS: Record<EarningsPeriod, { label: string; shortLabel: string }> = {
  day: { label: 'День', shortLabel: 'День' },
  week: { label: 'Неделя', shortLabel: 'Нед' },
  month: { label: 'Месяц', shortLabel: 'Мес' },
  '3months': { label: '3 месяца', shortLabel: '3 мес' },
  '6months': { label: '6 месяцев', shortLabel: '6 мес' },
  '12months': { label: '12 месяцев', shortLabel: '12 мес' },
  all: { label: 'За всё время', shortLabel: 'Всё' },
}

export interface Earnings {
  id: string
  userId: string
  date: string
  amount: number
  poolAmount: number
  slotId?: string
  category: EarningsCategoryExtended // Support legacy 'memecoins' for backward compatibility
  walletType?: 'general' | 'pool'
  isDeving?: boolean
  status?: 'pending' | 'approved' | 'rejected'
  // Доп. кошельки
  extraWalletsCount?: number
  extraWalletsAmount?: number
  participants: string[] // for shared earnings
  // Данные транзакции (обязательные для согласования)
  transactionHash?: string // Хэш транзакции или ссылка
  receivedWallet?: string // Кошелек, на который поступили средства
}

// Rating types
export interface RatingData {
  userId: string
  earnings: number
  messages: number
  initiatives: number
  signals: number
  profitableSignals: number
  referrals: number
  daysOff: number
  sickDays: number
  vacationDays: number
  absenceDays: number
  truancyDays: number
  internshipDays: number
  poolAmount: number
  rating: number
  lastUpdated: string
}

export interface TeamRatingHistory {
  date: string
  averageRating: number
  ratings: {
    userId: string
    rating: number
    earnings: number
    poolAmount: number
  }[]
}

// Referral types
export type ReferralStatus = 'pending' | 'confirmed' | 'active' | 'inactive' | 'excluded' | 'not_counted'

export interface Referral {
  id: string
  referralId: string // Формат: 1—ИМЯ—КОД (номер—имя—часть кода после =)
  ownerId: string // ID пригласившего
  ownerName?: string // Имя пригласившего
  name: string // Имя реферала
  userId?: string // ID пользователя в системе (если реферал стал участником)
  age?: string // Возраст реферала
  phone?: string // Телефон
  email?: string // Email
  messenger?: string // Telegram/VK/MAX username или ссылка
  messengerType?: 'telegram' | 'vk' | 'max' // Тип мессенджера
  source?: string // Откуда приглашён
  referralCode?: string // Реферальный код пригласившего
  status?: ReferralStatus
  createdAt: string
  comment?: string
  // Поля для автоматической обработки
  statusChangedAt?: string // Когда последний раз менялся статус
  inactiveSince?: string // Когда стал неактивным (для отсчёта 14 дней)
  deleteAt?: string // Когда должен быть удалён (для excluded и not_counted)
}

// Points Exchange types
export type PointsBenefitType = 'usdt' | 'commission' | 'dayoff'

export interface PointsExchangeRequest {
  id: string
  userId: string
  userName?: string
  points: number
  benefitType: PointsBenefitType
  // Для USDT
  walletAddress?: string
  walletNetwork?: 'ton' | 'trc20'
  // Для снижения комиссии
  dateRange?: { start: string; end: string }
  // Для выходного/отпуска
  dayoffType?: 'dayoff' | 'vacation'
  dayoffDate?: string
  // Статус
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  processedAt?: string
  processedBy?: string
  adminComment?: string
}

// Call (Trading Signal) types
export type Network = 'solana' | 'ethereum' | 'bsc' | 'ton' | 'base' | 'sui' | 'monad' | 'polygon'
  export type CallCategory = 'memecoins' | 'futures' | 'spot' | 'polymarket'
export type CallStatus = 'active' | 'completed' | 'cancelled' | 'reviewed'
export type CallRiskLevel = 'low' | 'medium' | 'high' | 'ultra'
export type CallSentiment = 'buy' | 'sell' | 'hold' | 'alert'

export type FuturesDirection = 'long' | 'short'
export type FuturesSignalType = 'breakout' | 'retest' | 'range' | 'scalping' | 'swing'
export type NftSignalType = 'buy' | 'sell' | 'mint'
export type StakingAction = 'enter' | 'exit' | 'rebalance'

export interface MemecoinSignalFields {
  network: Network
  contract?: string
  pairAddress?: string
  holdPlan: 'flip' | 'short' | 'medium' | 'long'
  entryCap?: string
  targets?: string
  stopLoss?: string
  trailingPercent?: string
  riskLevel?: CallRiskLevel
  liquidityLocked?: boolean
  traderComment?: string
  tokenSymbol?: string
  tokenLogo?: string
}

export interface FuturesSignalFields {
  pair: string
  direction: FuturesDirection
  entryZone: string
  targets: string
  stopLoss: string
  riskLevel: CallRiskLevel
  traderComment?: string
  link?: string
}

export interface NftSignalFields {
  nftLink: string
  targets: string
  traderComment?: string
}

export interface SpotSignalFields {
  coin: string
  entryZone: string
  targets: string
  stopLoss: string
  holdingHorizon: 'short' | 'medium' | 'long'
  traderComment?: string
  link?: string
}

export interface PolymarketSignalFields {
  event: string
  eventLink: string
  positionType: 'yes' | 'no'
  entryPrice: string // in %
  expectedProbability: string
  eventDeadline: string
  riskLevel: CallRiskLevel
  targetPlan: string
  traderComment?: string
}

export interface CallDetails {
  memecoins?: MemecoinSignalFields
  futures?: FuturesSignalFields
  nft?: NftSignalFields
  spot?: SpotSignalFields
  polymarket?: PolymarketSignalFields
}

export interface Call {
  id: string
  userId: string
  category: CallCategory
  status: CallStatus
  createdAt: string // ISO timestamp - когда запись создана в БД
  publishedAt?: string // ISO timestamp - когда сигнал был опубликован на сайте
  updatedAt?: string // ISO timestamp
  closedAt?: string // ISO timestamp - когда сигнал был закрыт (completed/cancelled)
  details: CallDetails
  sentiment?: CallSentiment
  riskLevel?: CallRiskLevel
  tags?: string[]
  comment?: string // Общий комментарий
  isTeam?: boolean // true = Team сигнал, false или undefined = Общий сигнал

  // Данные для отображения (заполняются из API)
  maxProfit?: number // MAX прибыль в %
  currentPnL?: number // Текущий PNL с момента публикации сигнала в %
  currentMarketCap?: number // Текущая капитализация токена
  signalMarketCap?: number // Капитализация во время публикации сигнала
  currentPrice?: number // Текущая цена токена
  entryPrice?: number // Цена входа
  tokenPair?: string // Пара токена (например, "TOKEN/SOL") из API
}

// Task types
export type TaskCategory = 'trading' | 'development' | 'stream' | 'learning'
export type TaskStatus = 'in_progress' | 'completed' | 'closed' | 'approval' | 'in_progress_rework'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskApproval {
  userId: string
  status: 'approved' | 'rejected' | 'pending'
  comment?: string
  updatedAt: string
  forAll?: boolean // пометка, что согласование выполнено за других
}

export interface TaskAssignee {
  userId: string
  priority: TaskPriority
  comment?: string
}

export interface TaskLink {
  id: string
  url: string
  name: string
}

// Отчёт о выполнении задачи
export interface TaskReport {
  text: string // текст отчёта с сохранением форматирования
  links: TaskLink[] // до 10 ссылок
  screenshots: string[] // до 10 скриншотов (URLs или base64)
  createdAt: string
}

// Комментарий по доработке
export interface TaskReworkComment {
  text: string // текст комментария с сохранением форматирования
  links: TaskLink[] // до 10 ссылок
  screenshots: string[] // до 10 скриншотов
  newDeadline?: string // новый дедлайн
  newDeadlineTime?: string // новое время дедлайна
  createdAt: string
  createdBy: string // кто создал комментарий
}

export interface Task {
  id: string
  title: string
  description?: string
  category: TaskCategory
  status: TaskStatus
  createdBy: string // user ID
  assignedTo: string[] // user IDs (для быстрых фильтров)
  coExecutors?: string[] // соисполнители (user IDs)
  assignees?: TaskAssignee[]
  approvals: TaskApproval[] // Текущие согласования
  createdAt: string
  updatedAt: string
  completedAt?: string
  closedAt?: string
  completedBy?: string // user ID
  priority?: TaskPriority
  dueDate: string // YYYY-MM-DD format (обязательно)
  dueTime: string // HH:mm format (обязательно)
  originalDueDate?: string // оригинальный дедлайн до продления
  originalDueTime?: string // оригинальное время до продления
  expectedResult?: string
  links?: TaskLink[] // до 10 ссылок с именами
  // Отчёт
  report?: TaskReport
  // Информация о согласовании
  approvalStartedAt?: string // когда началось согласование
  // Информация о доработке
  reworkComment?: TaskReworkComment
  // Продление дедлайна
  deadlineExtensions: number // количество автоматических продлений (макс 10)
  lastExtensionAt?: string // когда было последнее продление
  // Архив
  archivedAt?: string // когда задача была перемещена в архив
  archiveDeleteAt?: string // когда задача должна быть удалена из архива
}

// Team members
export const TEAM_MEMBERS: User[] = [
  { id: '1', name: 'Артём', login: 'dexim-artyom03!1@antarctic-alpha', password: 'dexim03@antarcic-alpha_admin-038392!378393neh9!', recoveryCode: '20035009', authCode: '2580', avatar: '/avatars/artyom.jpg', phone: '79778730513', role: 'admin', positions: ['COO', 'Co-Founder'], primaryPosition: 'COO' },
  { id: '2', name: 'Адель', login: 'enowk-kirill@antarctic-alpha', password: 'enowk05antarctic_alpha-kirill@', recoveryCode: '20051001', authCode: '3691', avatar: '/avatars/adel.jpg', phone: '79172480769', role: 'user', positions: ['CTO'], primaryPosition: 'CTO' },
  { id: '3', name: 'Ксения', login: 'xenia@antarctic-alpha', password: 'xenia-@antarctic-alpha03-RSPO', recoveryCode: '20036008', authCode: '4826', avatar: '/avatars/kseniya.jpg', phone: '79378159355', role: 'admin', positions: ['CEO', 'Co-Founder'], primaryPosition: 'CEO' },
]

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  trading: { label: 'Торговля', icon: 'candles', color: 'green' },
  development: { label: 'Разработка', icon: 'cpu', color: 'blue' },
  stream: { label: 'Стрим', icon: 'broadcast', color: 'red' },
  learning: { label: 'Изучение', icon: 'book', color: 'purple' },
}

// Temporary stub types for compatibility
export interface StageAssignee {
  userId: string
  priority: TaskPriority
  comment?: string
  instruction?: string
}

export interface Note {
  id: string
  userId: string
  title: string
  text: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

// User Nickname types
export interface UserNickname {
  id: string
  userId: string
  nickname: string
  createdAt: string
  updatedAt: string
}

// Conflict restrictions types
export interface UserConflict {
  id: string
  userId: string // user who cannot work with restrictedUserId
  restrictedUserId: string // user they cannot work with
  reason?: string
  createdBy: string
  createdAt: string
  isActive: boolean
}

// Access block types
export interface AccessBlock {
  id: string
  userId?: string // specific user ID
  userIds?: string[] // array of user IDs
  targetType: 'all' | 'single' | 'subset'
  reason: string
  createdBy: string
  createdAt: string
  expiresAt?: string // optional expiration date
  isActive: boolean
  blockFeatures: AccessFeature[] // which features to block
}

export type AccessFeature =
  | 'all' // block entire site
  // Menu Categories (Whole sections)
  | 'ava_traders_lounge' // Traders' Lounge (HUB, Trader Diary, Contour)
  | 'ava_planner_dashboard' // Planner Dashboard (Lead, Tasks, Events, etc.)
  | 'ava_reward_centre' // Reward Centre (P&L, Community Fund, Wallet Analytics, Cards & Crypto)
  | 'ava_applications' // ARCA Analytics & Reports
  | 'ava_arca_info' // ARCA INFO (FAQ, INFO, Feedback)
  | 'ava_quick_access' // Quick Access (Converter, Communication)
  // Individual Menu Items (Traders' Lounge)
  | 'ava_hub' // HUB
  | 'ava_trader_diary' // Trader Diary
  | 'tools_strategies' // Contour
  // Individual Menu Items (Planner Dashboard)
  | 'ava_schedule' // Lead
  | 'ava_tasks' // Tasks
  | 'tools_events' // Events
  | 'tools_challenges' // Challenges
  | 'tools_initiatives' // Initiatives
  | 'ava_rating' // Track Record
  | 'ava_referrals' // Invite & Earn
  // Individual Menu Items (Reward Centre)
  | 'ava_profit' // P&L
  | 'ava_community_fund' // Community Fund
  | 'ava_team_fund' // Team's Wallet (Team Fund)
  | 'ava_payments' // Payments
  // Individual Menu Items (ARCA Analytics & Reports)
  | 'tools_applications' // Applications
  // Individual Menu Items (ARCA INFO)
  | 'ava_faq' // FAQ
  | 'ava_info' // INFO
  | 'ava_feedback' // Feedback
  | 'ava_contact_dm' // Contact DM
  // Individual Menu Items (Reward Centre - additional)
  | 'ava_cards_crypto' // Cards & Crypto
  // Individual Menu Items (Traders' Lounge - additional)
  | 'ava_realtime_chart' // Market Analytics
  // Quick Access (верхнее меню)
  | 'ava_converter' // Converter
  | 'ava_communication' // Chat/Communication
  // Legacy Section features
  | 'tools' // block access to Tools section (legacy)
  // Tools Sub-features
  | 'tools_kontur' // block AVA Kontur in Tools
  | 'tools_kontur_memecoins'
  | 'tools_kontur_memecoins_trading'
  | 'tools_kontur_memecoins_deving'
  | 'tools_kontur_polymarket'
  | 'tools_kontur_nft'
  | 'tools_kontur_staking'
  | 'tools_kontur_spot'
  | 'tools_kontur_futures'
  | 'tools_kontur_airdrop'
  | 'tools_kontur_digital_payments'
  | 'tools_kontur_other'
  | 'tools_strategies_view' // block viewing strategies
  | 'tools_items_view' // block viewing tool items
  // HUB Sub-features
  | 'hub_signals_add'
  | 'hub_signals_view'
  | 'hub_signals_cat_memecoins'
  | 'hub_signals_cat_polymarket'
  | 'hub_signals_cat_nft'
  | 'hub_signals_cat_spot'
  | 'hub_signals_cat_futures'
  | 'hub_signals_cat_staking'
  | 'hub_signals_cat_airdrop'
  // Schedule Sub-features
  | 'schedule_stats_view'
  | 'schedule_view'
  | 'schedule_add_slot'
  | 'schedule_status_edit'
  | 'schedule_slot_delete'
  // Tasks Sub-features
  | 'tasks_add'
  | 'tasks_view'
  // Profit Sub-features
  | 'profit_add'
  | 'profit_stats_view'
  | 'profit_leaders_view'
  | 'profit_history_view'
  | 'profit_insights_view'
  | 'profit_cat_memecoins'
  | 'profit_cat_futures'
  | 'profit_cat_nft'
  | 'profit_cat_spot'
  | 'profit_cat_airdrop'
  | 'profit_cat_polymarket'
  | 'profit_cat_staking'
  | 'profit_cat_other'
  | 'profit_wallet_general'
  | 'profit_wallet_personal'
  | 'profit_wallet_pool'
  // Rating Sub-features
  | 'rating_others_view'
  | 'rating_self_view'
  | 'rating_specific_view'
  | 'profile' // block profile access
  // Legacy aliases
  | 'slots'
  | 'earnings'
  | 'tasks'
  | 'rating'
  | 'about'
  | 'tools_meme_evaluation'
  | 'tools_ai_ao_alerts'
  | 'tools_signals_trigger_bot'

// AI - AO Alerts types
export interface AiAlert {
  id: string
  signalDate: string // YYYY-MM-DD
  signalTime: string // HH:mm
  marketCap?: string // string to allow "300,77" format
  address: string
  strategies?: AiAoStrategy[] // Trading strategies
  maxDrop?: string // e.g. "-16"
  maxDropFromLevel07?: string // Drop after level 0.7, e.g. "-5"
  maxProfit?: string // e.g. "+28" or "X3"
  comment?: string // "Постепенное снижение" etc.
  screenshot?: string // URL to screenshot
  isScam?: boolean
  createdAt: string
  createdBy: string
}

// Analytics Review types (добавляем после Task типов)
export interface Rating {
    userId: string
    value: number // Оценка от 1 до 5
}

export interface AnalyticsReview {
    id: string
    number?: number // Порядковый номер для отображения
    sphere: string // Сфера: futures, spot или polymarket
    expertComment?: string // Комментарий трейдера
    importantDetails?: string // Дополнительные детали
    strategy?: string // Стратегия (для фьючерсов/спота)
    currentPrice?: string // Цена на момент разбора
    deadline?: string // ISO date string
    originalDeadline?: string // ISO date string - оригинальный дедлайн, установленный пользователем
    extensionCount?: number // Количество автоматических продлений дедлайна
    links?: string[]
    asset?: string // Актив (для фьючерсов/спота)
    eventName?: string // Название события (для polymarket)
    prediction?: 'yes' | 'no' // Прогноз (для polymarket)
    screenshots?: string[] // Массив скриншотов (до 6 штук)
    createdBy: string
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    ratings?: Rating[] // Новое поле для оценок
    closed?: boolean // Закрыт ли разбор
    closedAt?: string // Когда был закрыт (ISO date string)
    outcome?: 'success' | 'failure' // Результат закрытия: success - удачно, failure - неудачно
}

// AI-AO Alerts types
export type AiAoStrategy = 'Фиба' | 'Market Entry'

export interface AiAoProfit {
  strategy: AiAoStrategy
  value: string // e.g. "+28" or "X3"
}

// Signals Trigger Bot types (independent from AiAlert)
export type TriggerStrategy = AiAoStrategy

export interface TriggerProfit {
  strategy: TriggerStrategy
  value: string // e.g. "+28" or "X3"
}

export interface TriggerAlert {
  id: string
  signalDate: string // YYYY-MM-DD
  signalTime: string // HH:mm
  marketCap?: string
  address: string
  strategies: TriggerStrategy[] // Multiple strategies
  maxDropFromSignal?: string // e.g. "-16"
  maxDropFromLevel07?: string
  maxProfit?: string // e.g. "+28" or "X3"
  profits?: TriggerProfit[] // Multiple profits (one per strategy)
  comment?: string
  screenshot?: string // URL to screenshot
  isScam?: boolean // Mark signal as scam
  createdAt: string
  createdBy: string
}

// Fasol Signals Strategy types
export interface FasolTriggerAlert {
  id: string
  signalDate: string // YYYY-MM-DD
  signalTime: string // HH:mm
  marketCap?: string
  liq?: string
  hold?: string
  top10?: string
  address: string
  strategies?: TriggerStrategy[]
  maxDropFromSignal?: string
  maxDropFromLevel07?: string
  maxProfit?: string
  profits?: TriggerProfit[]
  comment?: string
  screenshot?: string
  isScam?: boolean
  setup?: 'One' | 'Two' | 'Three' | 'Four' | 'Five'
  createdAt: string
  createdBy: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  details?: string
  createdAt: string
}

// Learning Platform types
export type LessonTopic = 'memecoins' | 'polymarket' | 'nft' | 'staking' | 'spot' | 'futures' | 'airdrop'

export interface LessonResource {
  id: string
  title: string
  url: string
  description: string
}

export interface LessonFile {
  url: string
  name: string
}

export interface Lesson {
  id: string
  topicId: LessonTopic
  lessonNumber: number
  title: string
  videoUrl?: string // legacy
  videoFileName?: string // legacy
  youtubeUrl?: string // legacy
  fileUrl?: string // legacy
  fileName?: string // legacy
  videos?: LessonFile[] // Multiple videos
  files?: LessonFile[] // Multiple files
  youtubeUrls?: string[] // Multiple YouTube links
  comment?: string
  resources: LessonResource[]
  createdAt: string
  updatedAt: string
  createdBy?: string // user ID who created the lesson
}

// Event types
export type EventCategory = 'memecoins' | 'polymarket' | 'nft' | 'staking' | 'spot' | 'futures' | 'airdrop'

export const EVENT_CATEGORY_META: Record<EventCategory, { label: string; gradient: string; gradientDark: string; icon: string; cardGradient: string }> = {
  memecoins: {
    label: 'Мемкоины',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-400',
    gradientDark: 'from-emerald-500 via-teal-600 to-cyan-500',
    icon: 'rocket',
    cardGradient: 'from-emerald-500/20 via-teal-400/10 to-cyan-500/5'
  },
  polymarket: {
    label: 'Polymarket',
    gradient: 'from-rose-400 to-red-500',
    gradientDark: 'from-rose-600 to-red-500',
    icon: 'barchart',
    cardGradient: 'from-rose-500/20 via-red-500/10 to-transparent'
  },
  nft: {
    label: 'NFT',
    gradient: 'from-purple-400 to-pink-500',
    gradientDark: 'from-purple-600 to-pink-500',
    icon: 'image',
    cardGradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
  },
  staking: {
    label: 'Стейкинг',
    gradient: 'from-emerald-400 to-green-500',
    gradientDark: 'from-emerald-600 to-green-500',
    icon: 'shield',
    cardGradient: 'from-emerald-500/20 via-green-500/10 to-transparent'
  },
  spot: {
    label: 'Спот',
    gradient: 'from-amber-400 to-orange-500',
    gradientDark: 'from-amber-600 to-orange-500',
    icon: 'coins',
    cardGradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  futures: {
    label: 'Фьючерсы',
    gradient: 'from-blue-400 to-indigo-500',
    gradientDark: 'from-blue-600 to-indigo-500',
    icon: 'trending',
    cardGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent'
  },
  airdrop: {
    label: 'Airdrop',
    gradient: 'from-gray-300 to-gray-400',
    gradientDark: 'from-gray-400 to-gray-300',
    icon: 'gift',
    cardGradient: 'from-gray-500/20 via-gray-400/10 to-transparent'
  },
}

export interface EventLink {
  url: string
  name: string
}

export interface EventFile {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  dates: string[] // Array of dates YYYY-MM-DD
  time: string // HH:mm format
  endTime?: string // HH:mm format
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'range' | 'until'
    startDate: string
    endDate?: string
  }
  links: EventLink[] // Array of named URLs
  requiredParticipants: string[] // User IDs
  recommendedParticipants: string[] // User IDs
  going: string[] // User IDs
  notGoing: string[] // User IDs
  files: EventFile[]
  isHidden?: boolean
  isActualForce?: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ==================== TRADE JOURNAL TYPES ====================

export type TradeMarketType = 'memecoins' | 'polymarket' | 'spot' | 'futures' | 'prop_trading' | 'nft' | 'airdrop' | 'staking'
export type TradeDirection = 'long' | 'short'
export type TradePlanCompliance = 'yes' | 'partial' | 'no'
export type EmotionalState = 'calm' | 'focused' | 'confident' | 'anxious' | 'greedy' | 'fearful' | 'frustrated' | 'tired' | 'neutral'

export interface TradeSetupTemplate {
  id: string
  userId: string
  name: string
  description: string
  createdAt: string
}

export interface TradeError {
  overtrading: boolean
  revengeTrading: boolean
  ignoringStopLoss: boolean
  increasingSize: boolean
  tradingWithoutPlan: boolean
  emotionalDecision: boolean
  chasingPrice: boolean
  averagingDown: boolean
  earlyExit: boolean
  lateEntry: boolean
  other: boolean
  otherText?: string
}

export const TRADE_ERRORS: Record<keyof TradeError, string> = {
  overtrading: 'Овертрейдинг (слишком много сделок)',
  revengeTrading: 'Revenge trading (отыгрыш убытков)',
  ignoringStopLoss: 'Игнорирование стоп-лосса',
  increasingSize: 'Увеличение размера позиции',
  tradingWithoutPlan: 'Торговля без плана',
  emotionalDecision: 'Эмоциональное решение',
  chasingPrice: 'Погоня за ценой',
  averagingDown: 'Усреднение убыточной позиции',
  earlyExit: 'Ранний выход (недополучена прибыль)',
  lateEntry: 'Поздний вход',
  other: 'Другое',
  otherText: 'Другое (опишите)',
}

export const EMOTIONAL_STATES: Record<EmotionalState, { label: string; color: string }> = {
  calm: { label: 'Спокойствие', color: 'bg-blue-500' },
  focused: { label: 'Фокус', color: 'bg-emerald-500' },
  confident: { label: 'Уверенность', color: 'bg-green-500' },
  anxious: { label: 'Тревога', color: 'bg-yellow-500' },
  greedy: { label: 'Жадность', color: 'bg-orange-500' },
  fearful: { label: 'Страх', color: 'bg-red-500' },
  frustrated: { label: 'Разочарование', color: 'bg-rose-500' },
  tired: { label: 'Усталость', color: 'bg-purple-500' },
  neutral: { label: 'Нейтрально', color: 'bg-gray-500' },
}

export const MARKET_TYPES: Record<TradeMarketType, { label: string; icon: string; accent: string }> = {
  memecoins: { label: 'Мемкоины', icon: 'rocket', accent: 'emerald' },
  polymarket: { label: 'Polymarket', icon: 'barchart', accent: 'pink' },
  spot: { label: 'Спот', icon: 'coins', accent: 'amber' },
  futures: { label: 'Фьючерсы', icon: 'trending', accent: 'blue' },
  prop_trading: { label: 'Prop Trading', icon: 'shield', accent: 'indigo' },
  nft: { label: 'NFT', icon: 'image', accent: 'purple' },
  airdrop: { label: 'AirDrop', icon: 'gift', accent: 'cyan' },
  staking: { label: 'Стейкинг', icon: 'shield', accent: 'green' },
}

export interface Trade {
  id: string
  userId: string
  // Required fields
  entryDate: string // ISO timestamp
  ticker: string // Instrument/ticker
  marketType: TradeMarketType
  direction: TradeDirection
  entryPrice: number
  exitPrice: number
  positionSize: number
  stopLoss: number
  takeProfit: number
  commission: number
  pnl: number // Calculated: (exitPrice - entryPrice) * positionSize * directionMultiplier - commission
  // Additional fields
  rr?: number // Risk:Reward ratio
  screenshots?: string[] // URLs to uploaded screenshots (max 3)
  setup?: string // Trade setup description
  setupTemplateId?: string // Reference to saved template
  emotionalState?: EmotionalState
  emotionalComment?: string
  tradePlanCompliance?: TradePlanCompliance
  entryReason?: string
  exitReason?: string
  errors?: TradeError
  // Metadata
  createdAt: string
  updatedAt: string
}

// Day Status types (already defined above)

// User Session types (for Firestore)
export interface UserSession {
  id: string
  userId: string
  browser: string
  device: string
  deviceModel?: string // Модель устройства (например, "iPhone 15 Pro", "Samsung Galaxy S23")
  os: string
  loginAt: string // ISO timestamp
  city?: string
  isCurrent: boolean
}

// Appeal (Contact DM) types
export type AppealCategory = 
  | 'technical'        // Технические проблемы
  | 'billing'          // Биллинг и платежи
  | 'schedule'         // Расписание и слоты
  | 'referral'         // Реферальная программа
  | 'verification'     // Верификация
  | 'training'         // Обучение и Contour
  | 'trading'          // Торговля и сигналы
  | 'access'           // Доступ к разделам
  | 'other'            // Другое

export interface AppealForm {
  category: AppealCategory
  topic?: DMContactTopic // Тема из Contact DM (если обращение создано через него)
  // Для авторизованных
  name?: string
  email?: string
  telegram?: string
  vk?: string
  // Для неавторизованных
  guestEmail?: string
  guestTelegram?: string
  guestVk?: string
  // Общие
  subject: string
  message: string
  // Доп данные из Contact DM
  links?: { url: string; name: string }[]
  screenshots?: string[]
  // Специфичные поля для тем
  ideaSummary?: string
  ideaInInitiatives?: boolean
  ideaInitiativesReason?: string
  violationWho?: string
  violationWhere?: string
  applicationId?: string
  applicationEmail?: string
}
  
export type AppealStatus = 'in_progress' | 'resolved' | 'closed'

export interface Appeal {
  id: string
  userId?: string // ID пользователя (если авторизован)
  form: AppealForm
  status: AppealStatus
  createdAt: string
  updatedAt: string
  processedAt?: string
  processedBy?: string // ID админа
  adminComment?: string // Комментарий админа при обработке
  deleted?: boolean // Мягкое удаление
  appealId?: string // Фиксированный ID обращения для отображения пользователю
}

// User Wallet types
export type WalletNetwork = 'solana' | 'ethereum' | 'bsc' | 'ton'

export const WALLET_NETWORKS: Record<WalletNetwork, { label: string; icon: string; color: string }> = {
  solana: { label: 'Solana', icon: '◎', color: '#9945FF' },
  ethereum: { label: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  bsc: { label: 'BNB Chain', icon: 'B', color: '#F3BA2F' },
  ton: { label: 'TON', icon: '💎', color: '#0098EA' },
}

export interface UserWallet {
  id: string
  userId: string
  name: string // Название кошелька
  address: string // Адрес кошелька
  network?: WalletNetwork // Сеть кошелька (по умолчанию solana)
  privateKey?: string // Private key (опционально)
  seedPhrase?: string // Seed-фраза (опционально)
  comment?: string // Комментарий к кошельку
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

// TON Withdrawal Request types
export type TonWithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled'

export interface TonWithdrawalRequest {
  id: string
  userId: string
  userName?: string // Имя пользователя
  
  // Кошелек отправителя
  walletId: string // ID кошелька в Firestore
  walletAddress: string // TON адрес отправителя
  
  // Данные для вывода
  toAddress: string // Адрес получателя TON
  amount: number // Сумма в TON
  comment?: string // Комментарий к транзакции
  
  // Статус
  status: TonWithdrawalStatus
  txHash?: string // Хэш транзакции в блокчейне
  adminComment?: string // Комментарий админа
  
  // Метаданные
  createdAt: string
  processedAt?: string // Когда обработано
  processedBy?: string // ID админа
}

// Token Trade types (for wallet analytics)
export type TokenTradeStatus = 'open' | 'closed' | 'partial'

export interface TokenTrade {
  id: string
  userId: string
  walletId: string // ID кошелька
  walletAddress: string // Адрес кошелька для связи
  
  // Информация о токене
  tokenSymbol: string // Символ токена (например, "PEPE")
  tokenContract?: string // Контракт токена (для Solana, ETH и др.)
  network: Network // Сеть токена
  
  // Данные входа
  entryDate: string // ISO timestamp - когда купили
  entryPrice: number // Цена входа
  entryMarketCap?: number // MC входа (в USD)
  entryAmount: number // Количество купленных токенов
  entryValue: number // Стоимость входа в USD (entryPrice * entryAmount)
  
  // Данные выхода
  exitDate?: string // ISO timestamp - когда продали
  exitPrice?: number // Цена выхода
  exitAmount?: number // Количество проданных токенов
  exitValue?: number // Стоимость выхода в USD (exitPrice * exitAmount)
  exitMarketCap?: number // MC выхода (в USD)
  
  // Профит и статистика
  currentPrice?: number // Текущая цена (для открытых позиций)
  currentMarketCap?: number // Текущая MC
  maxPrice?: number // Максимальная цена за период
  maxMarketCap?: number // Максимальная MC за период
  maxProfit?: number // Максимальный профит в % (относительно входа)
  
  // Статус и доп. информация
  status: TokenTradeStatus
  comment?: string // Комментарий к сделке
  screenshots?: string[] // Скриншоты сделки
  
  // Метаданные
  createdAt: string
  updatedAt: string
}

// Token Trade History Point (для графика истории)
export interface TokenTradeHistoryPoint {
  timestamp: number
  price: number
  marketCap: number
  profitPercent: number // Профит в % относительно входа
}

// ==================== COMMUNITY FUND TYPES ====================

export type CommunityFundSphere = 'memecoins' | 'futures' | 'nft' | 'spot' | 'airdrop' | 'polymarket' | 'staking' | 'other'

export const COMMUNITY_FUND_SPHERES: Record<CommunityFundSphere, { label: string; accent: string; icon: string }> = {
  memecoins: { label: 'Мемкоины', accent: 'emerald', icon: 'rocket' },
  futures: { label: 'Фьючерсы', accent: 'blue', icon: 'trending' },
  nft: { label: 'NFT', accent: 'purple', icon: 'image' },
  spot: { label: 'Спот', accent: 'amber', icon: 'coins' },
  airdrop: { label: 'AirDrop', accent: 'cyan', icon: 'gift' },
  polymarket: { label: 'Polymarket', accent: 'pink', icon: 'barchart' },
  staking: { label: 'Стейкинг', accent: 'indigo', icon: 'shield' },
  other: { label: 'Другое', accent: 'gray', icon: 'sparkles' },
}

export type CompensationRequestStatus = 'pending' | 'voting' | 'approved' | 'rejected' | 'paid'

export interface CompensationEvidence {
  type: 'comment' | 'screenshot' | 'link'
  content: string // URL for screenshot/link, text for comment
  name?: string // For links - display name
}

export interface CompensationRequest {
  id: string
  userId: string
  userName?: string
  
  // Deal info
  sphere: CommunityFundSphere
  dealDate: string // YYYY-MM-DD
  dealTime: string // HH:mm
  
  // Evidence
  comments: string[] // Up to 10 comments
  screenshots: string[] // Up to 10 screenshot URLs
  links: { url: string; name: string }[] // Up to 15 links with optional name
  
  // Amount
  requestedAmount: number
  
  // Status
  status: CompensationRequestStatus
  votes: { userId: string; vote: 'yes' | 'no'; amount?: number }[] // Voting with optional amount
  approvedBy?: string // Admin who approved
  paidAt?: string // When paid
  adminComment?: string
  decidedAt?: string // When the request was decided (approved/rejected/paid)
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface DiversificationEntry {
  id: string
  amount: number
  asset: string // Token/asset name
  duration: string // Duration (e.g., "30 days", "6 months")
  date: string // YYYY-MM-DD
  
  // Metadata
  createdBy: string
  createdAt: string
}

// Pool contributions - separate from earnings to preserve pool amount when earnings are deleted
export interface PoolContribution {
  id: string
  amount: number // Amount added to pool (can be negative for diversifications)
  date: string // YYYY-MM-DD
  source: 'earning' | 'manual' | 'diversification' // Source of contribution
  earningId?: string // Reference to earning (if source is 'earning')
  description?: string // Optional description
  addedBy: string // User who added this contribution
  
  // Metadata
  createdAt: string
}

// ==================== TEAM FUND (TEAM'S WALLET) TYPES ====================

export type TeamFundSphere = 'memecoins' | 'polymarket' | 'futures_spot' | 'traditional'

export const TEAM_FUND_SPHERES: Record<TeamFundSphere, { label: string; accent: string; description: string }> = {
  memecoins: { label: 'Мемкоины (торговля)', accent: 'emerald', description: 'Торговля мемкоинами на Solana, BSC и других сетях' },
  polymarket: { label: 'Polymarket', accent: 'pink', description: 'Предиктивные рынки и событийная торговля' },
  futures_spot: { label: 'Фьючерсы и спот', accent: 'blue', description: 'Криптовалютные фьючерсы и спот-торговля' },
  traditional: { label: 'Традиционные инвестиции', accent: 'amber', description: 'Скальпинг, трейдинг, интрадей и холд до 3 месяцев' },
}

export type TeamFundRequestStatus = 'pending' | 'approved' | 'rejected'

export interface TeamFundRequest {
  id: string
  userId: string
  userName?: string

  // Запрашиваемая сфера
  sphere: TeamFundSphere

  // Дополнительная информация
  comment: string
  screenshots: string[]
  links: { url: string; name: string }[]

  // Запрашиваемая сумма (0 = полный доступ ко всем средствам)
  requestedAmount: number

  // Статус
  status: TeamFundRequestStatus
  reviewedBy?: string
  adminComment?: string
  decidedAt?: string

  // Метаданные
  createdAt: string
  updatedAt: string
}

// ==================== PERSONAL DATA VERIFICATION TYPES ====================

export type PersonalDataVerificationStatus = 'pending' | 'approved' | 'rejected'

// Интерфейс для персональных данных пользователя (полная версия для верификации)
export interface PersonalDataFull {
  lastName: string
  firstName: string
  middleName?: string
  birthDate?: string
  birthPlace?: string
  registrationAddress?: string
  residenceAddress?: string
  passportSeries?: string
  passportNumber?: string
  passportIssuedBy?: string
  passportIssueDate?: string
  passportDepartmentCode?: string
  inn?: string
  passportPhotosLink?: string
  passportPhotosPassword?: string
}

// Заявка на верификацию персональных данных
export interface PersonalDataVerificationRequest {
  id: string
  userId: string
  userName?: string // Имя пользователя для отображения
  
  // Персональные данные (копируются в момент отправки на верификацию)
  personalData: PersonalDataFull
  
  // Статус верификации
  status: PersonalDataVerificationStatus
  
  // Комментарий DM при отказе
  dmComment?: string
  
  // Метаданные
  createdAt: string
  updatedAt?: string
  processedAt?: string // Когда было принято решение
  processedBy?: string // ID админа, который принял решение
}

// ==================== PAYMENTS TYPES ====================

export type PaymentStatus = 'pending' | 'paid' | 'rejected' | 'threshold_not_reached'

export type PaymentRecurrence = 'weekly' // каждый понедельник

export interface Payment {
  id: string
  userId: string
  userName?: string
  amount: number
  status: PaymentStatus
  rejectionReason?: 'threshold_not_reached' | 'admin_decision'
  rejectionComment?: string
  adminComment?: string // Комментарий админа при создании
  weekStart?: string // YYYY-MM-DD - начало недели для выплаты
  weekEnd?: string // YYYY-MM-DD - конец недели для выплаты
  scheduledAt?: string // YYYY-MM-DD - запланированная дата выплаты (для отложенных)
  paidAt?: string // когда выплачено
  createdBy?: string // admin user ID
  createdAt: string
  updatedAt: string
}

export interface PaymentBatch {
  id: string
  weekStart: string // YYYY-MM-DD - начало недели
  weekEnd: string // YYYY-MM-DD - конец недели
  status: 'pending' | 'processed'
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ==================== CONTACT DM TYPES ====================

export type DMContactTopic = 
  | 'bug_report' // Сообщить о баге
  | 'idea' // Предложить идею
  | 'violation' // Сообщить о нарушениях
  | 'join_team' // Присоединиться к команде
  | 'referral' // Реферальная программа
  | 'earnings_pool_payments' // Заработок, пул и выплаты
  | 'card_payment' // Карта и оплата
  | 'schedule_events_tasks' // Расписание, события и задачи
  | 'general' // Общие вопросы

export const DM_CONTACT_TOPICS: Record<DMContactTopic, string> = {
  bug_report: 'Сообщить о баге',
  idea: 'Предложить идею',
  violation: 'Сообщить о нарушениях',
  join_team: 'Присоединиться к команде',
  referral: 'Реферальная программа',
  earnings_pool_payments: 'Заработок, пул и выплаты',
  card_payment: 'Карта и оплата',
  schedule_events_tasks: 'Расписание, события и задачи',
  general: 'Общие вопросы',
}

export type DMContactStatus = 'pending' | 'read' | 'answered' | 'closed'

export interface DMContactLink {
  url: string
  name: string
}

export interface DMContactExtraFields {
  // Для темы "Предложить идею"
  ideaSummary?: string // Тезис идеи
  ideaInInitiatives?: boolean // Предлагал ли в разделе инициативы?
  ideaInitiativesReason?: string // Почему отказали / почему оставил в таком формате
  
  // Для темы "Сообщить о нарушениях"
  violationWho?: string // Кто нарушил (участник сообщества; член команды; иное лицо)
  violationWhere?: string // Где нарушено (VK; YouTube; Telegram; Discord; Дзен; Учебная платформа; иное)
  
  // Для темы "Присоединиться к команде"
  applicationId?: string // ID анкеты
  applicationEmail?: string // Email, указанный при подаче заявки
  
  // Для гостей (общие)
  guestEmail?: string // Email для ответа (если гость)
}

export interface DMContactRequest {
  id: string
  userId: string
  userName?: string
  
  // Тема сообщения
  topic: DMContactTopic
  
  // Сообщение (с сохранением форматирования)
  message: string
  
  // Прикрепленные данные
  links: DMContactLink[] // До 15 ссылок с именами
  screenshots: string[] // До 10 скриншотов
  
  // Дополнительные поля в зависимости от темы
  extraFields?: DMContactExtraFields
  
  // Статус
  status: DMContactStatus
  adminComment?: string // Ответ DM
  answeredAt?: string
  answeredBy?: string
  
  // Метаданные
  createdAt: string
  updatedAt: string
}
