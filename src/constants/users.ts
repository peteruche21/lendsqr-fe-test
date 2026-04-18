import { UserStatus } from '@/types'

export const USER_RECORD_COUNT = 520
export const DEFAULT_USER_PAGE_SIZE = 50

export const USER_STATUSES = [
  UserStatus.Active,
  UserStatus.Inactive,
  UserStatus.Pending,
  UserStatus.Blacklisted,
] as const

export const USER_ORGANIZATIONS = [
  'Lendsqr',
  'Irorun',
  'Lendstar',
  'Kuda',
  'Carbon',
  'Fairmoney',
  'Renmoney',
  'Branch',
  'Aella Credit',
  'Page Financials',
] as const

export const USER_NAMES = [
  'john williams',
  'mary johnson',
  'ada okafor',
  'emeka obi',
  'sarah adeyemi',
  'david brown',
  'fatima bello',
  'michael smith',
  'grace oluwaseun',
  'daniel chukwu',
  'amaka nwosu',
  'peter thompson',
  'jane cooper',
  'victor james',
  'aisha mohammed',
  'chinedu ike',
  'ruth anthony',
  'samuel davis',
  'esther george',
  'kelvin taylor',
] as const

export const NIGERIAN_PHONE_PREFIXES = ['070', '080', '090'] as const

export const USER_JOINED_START_TIMESTAMP = Date.UTC(2020, 0, 1, 8, 0, 0)
export const USER_JOINED_STEP_MS = 36 * 60 * 60 * 1000
