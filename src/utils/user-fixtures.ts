import {
  NIGERIAN_PHONE_PREFIXES,
  USER_JOINED_START_TIMESTAMP,
  USER_JOINED_STEP_MS,
  USER_NAMES,
  USER_ORGANIZATIONS,
  USER_STATUSES,
} from '@/constants/users'
import type { 
  EmailAddress, 
  IsoDateTime, 
  NigerianPhoneNumber, 
  UserDetails, 
  UserId,
  UserPersonalInfo,
  UserEducationEmployment,
  UserSocials,
  UserGuarantor
} from '@/types'

export function createMockUser(index: number): UserDetails {
  const username = USER_NAMES[index % USER_NAMES.length]
  const phoneNumber = createPhoneNumber(index)
  const email = createEmail(username)

  return {
    id: createUserId(index),
    username,
    email,
    phoneNumber,
    dateJoined: createDateJoined(index),
    organization: USER_ORGANIZATIONS[index % USER_ORGANIZATIONS.length],
    status: USER_STATUSES[index % USER_STATUSES.length],
    hasLoan: index % 3 === 0,
    hasSavings: index % 2 === 0,
    
    // Detailed Info
    tier: ((index % 3) + 1) as 1 | 2 | 3,
    accountBalance: `₦${((index * 1500 + 200000) % 1000000).toLocaleString('en-US')}.00`,
    accountNumber: String((index * 88888 + 9912345678) % 10000000000).padStart(10, '0'),
    bankName: ['Providus Bank', 'Kuda Bank', 'GTBank', 'Zenith Bank'][index % 4],
    
    personalInfo: createPersonalInfo(index, phoneNumber),
    education: createEducation(index, email),
    socials: createSocials(username),
    guarantors: [
      createGuarantor(index + 1),
      createGuarantor(index + 2)
    ],
  }
}

function createUserId(index: number): UserId {
  return `user_${index + 1}`
}

function createEmail(username: string): EmailAddress {
  const [name] = username.split(' ')
  return `${name}@gmail.com` as EmailAddress
}

function createPhoneNumber(index: number): NigerianPhoneNumber {
  const prefix = NIGERIAN_PHONE_PREFIXES[index % NIGERIAN_PHONE_PREFIXES.length]
  const suffix = String((index * 7919 + 12345) % 100000000).padStart(8, '0')
  return `${prefix}${suffix}` as NigerianPhoneNumber
}

function createDateJoined(index: number): IsoDateTime {
  return new Date(USER_JOINED_START_TIMESTAMP + index * USER_JOINED_STEP_MS).toISOString() as IsoDateTime
}

function createPersonalInfo(index: number, phoneNumber: string): UserPersonalInfo {
  return {
    bvn: phoneNumber, // Mocking BVN as phone number for simplicity in fixture
    gender: index % 2 === 0 ? 'Male' : 'Female',
    maritalStatus: ['Single', 'Married', 'Divorced'][index % 3],
    children: index % 3 === 0 ? 'None' : String(index % 4),
    residenceType: ["Parent's Apartment", 'Rented', 'Self Owned'][index % 3]
  }
}

function createEducation(index: number, email: string): UserEducationEmployment {
  return {
    level: ['B.Sc', 'M.Sc', 'PhD', 'HND'][index % 4],
    status: ['Employed', 'Unemployed', 'Self-Employed'][index % 3],
    sector: ['FinTech', 'Digital Media', 'Health', 'Education'][index % 4],
    duration: `${(index % 5) + 1} years`,
    officeEmail: email.replace('gmail.com', 'lendsqr.com'),
    monthlyIncome: `₦${((index * 5000 + 200000) % 500000).toLocaleString('en-US')}.00- ₦${((index * 5000 + 400000) % 800000).toLocaleString('en-US')}.00`,
    loanRepayment: `${((index * 1000 + 40000) % 100000).toLocaleString('en-US')}`
  }
}

function createSocials(username: string): UserSocials {
  const handle = `@${username.toLowerCase().replace(' ', '_')}`
  return {
    twitter: handle,
    facebook: username,
    instagram: handle
  }
}

function createGuarantor(index: number): UserGuarantor {
  const name = USER_NAMES[index % USER_NAMES.length]
  return {
    fullName: name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    phoneNumber: `080${String((index * 1234567) % 10000000).padStart(7, '0')}`,
    email: `${name.split(' ')[0]}@gmail.com`,
    relationship: ['Sister', 'Brother', 'Parent', 'Friend'][index % 4]
  }
}
