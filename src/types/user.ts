export const UserStatus = {
  Active: 'active',
  Blacklisted: 'blacklisted',
  Inactive: 'inactive',
  Pending: 'pending',
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export type UserId = `user_${number}`
export type EmailAddress = `${string}@lendstar.com`
export type NigerianPhoneNumber = `0${7 | 8 | 9}0${string}`
export type IsoDateTime = `${number}-${number}-${number}T${string}Z`

export type User = {
  dateJoined: IsoDateTime
  email: EmailAddress
  id: UserId
  organization: string
  phoneNumber: NigerianPhoneNumber
  status: UserStatus
  username: string
}
