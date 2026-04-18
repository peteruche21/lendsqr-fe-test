import {
  NIGERIAN_PHONE_PREFIXES,
  USER_JOINED_START_TIMESTAMP,
  USER_JOINED_STEP_MS,
  USER_NAMES,
  USER_ORGANIZATIONS,
  USER_STATUSES,
} from '@/constants/users'
import type { EmailAddress, IsoDateTime, NigerianPhoneNumber, User, UserId } from '@/types'

export function createMockUser(index: number): User {
  const username = USER_NAMES[index % USER_NAMES.length]

  return {
    dateJoined: createDateJoined(index),
    email: createEmail(username),
    id: createUserId(index),
    organization: USER_ORGANIZATIONS[index % USER_ORGANIZATIONS.length],
    phoneNumber: createPhoneNumber(index),
    status: USER_STATUSES[index % USER_STATUSES.length],
    username,
  }
}

function createUserId(index: number): UserId {
  return `user_${index + 1}`
}

function createEmail(username: string): EmailAddress {
  const [name] = username.split(' ')

  return `${name}@lendstar.com`
}

function createPhoneNumber(index: number): NigerianPhoneNumber {
  const prefix = NIGERIAN_PHONE_PREFIXES[index % NIGERIAN_PHONE_PREFIXES.length]
  const suffix = String((index * 7919 + 12345) % 100_000_000).padStart(8, '0')

  return `${prefix}${suffix}`
}

function createDateJoined(index: number): IsoDateTime {
  return new Date(USER_JOINED_START_TIMESTAMP + index * USER_JOINED_STEP_MS).toISOString() as IsoDateTime
}
