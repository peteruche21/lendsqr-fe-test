export const UserStatus = {
    Active: 'active',
    Blacklisted: 'blacklisted',
    Inactive: 'inactive',
    Pending: 'pending',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type UserId = `user_${number}`;
export type EmailAddress = `${string}@${string}`;
export type NigerianPhoneNumber = `0${7 | 8 | 9}0${string}`;
export type IsoDateTime = `${number}-${number}-${number}T${string}Z`;

export interface UserGuarantor {
    email: string;
    fullName: string;
    phoneNumber: string;
    relationship: string;
}

export interface UserSocials {
    facebook: string;
    instagram: string;
    twitter: string;
}

export interface UserEducationEmployment {
    duration: string;
    level: string;
    loanRepayment: string;
    monthlyIncome: string;
    officeEmail: string;
    sector: string;
    status: string;
}

export interface UserPersonalInfo {
    bvn: string;
    children: string;
    gender: string;
    maritalStatus: string;
    residenceType: string;
}

export type User = {
    dateJoined: IsoDateTime;
    email: EmailAddress;
    hasLoan: boolean;
    hasSavings: boolean;
    id: UserId;
    organization: string;
    phoneNumber: NigerianPhoneNumber;
    status: UserStatus;
    username: string;
};

export interface UserDetails extends User {
    accountBalance: string;
    accountNumber: string;
    bankName: string;
    education: UserEducationEmployment;
    guarantors: UserGuarantor[];
    personalInfo: UserPersonalInfo;
    socials: UserSocials;
    tier: 1 | 2 | 3;
}
