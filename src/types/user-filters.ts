import type { UserStatus } from './user'

export type UserFilterField =
  | 'dateJoined'
  | 'email'
  | 'organization'
  | 'phoneNumber'
  | 'status'
  | 'username'

export type UserFilters = {
  dateJoined: string
  email: string
  organization: string
  phoneNumber: string
  status: UserStatus | ''
  username: string
}
