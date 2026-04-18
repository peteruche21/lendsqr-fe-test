import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore } from './userStore';
import { UserStatus, type UserDetails } from '@/types';

const mockUser: UserDetails = {
    accountBalance: '1000',
    accountNumber: '1234567890',
    bankName: 'Test Bank',
    dateJoined: '2020-01-01T08:00:00.000Z',
    email: 'john@example.com',
    hasLoan: true,
    hasSavings: false,
    id: 'user_1',
    organization: 'Lendsqr',
    phoneNumber: '07012345678',
    status: UserStatus.Active,
    username: 'John Doe',
    tier: 1,
    personalInfo: {
        bvn: '123',
        children: 'None',
        gender: 'Male',
        maritalStatus: 'Single',
        residenceType: 'Apartment',
    },
    education: {
        duration: '4 years',
        level: 'B.Sc',
        loanRepayment: '40,000',
        monthlyIncome: '100k',
        officeEmail: 'john@office.com',
        sector: 'Fintech',
        status: 'Employed',
    },
    socials: {
        facebook: '@john',
        instagram: '@john',
        twitter: '@john',
    },
    guarantors: [],
};

describe('userStore', () => {
    beforeEach(() => {
        // Clear store to initial state
        useUserStore.setState({
            userCache: {},
            statusOverrides: {},
        });
        vi.clearAllMocks();
    });

    it('saves user to cache correctly', () => {
        useUserStore.getState().saveUser(mockUser);
        
        const state = useUserStore.getState();
        expect(state.userCache['user_1']).toEqual(mockUser);
    });

    it('updates user status override correctly', () => {
        // Arrange
        const testId = 'test_id_update';
        
        // Act
        useUserStore.getState().updateUserStatus(testId, UserStatus.Blacklisted);

        // Assert
        const state = useUserStore.getState();
        expect(state.statusOverrides[testId]).toBe(UserStatus.Blacklisted);
    });

    it('resolves status correctly (prioritizing overrides)', () => {
        const testId = 'test_id_resolve';
        
        // 1. Initially should return original status
        expect(useUserStore.getState().getUserStatus(testId, UserStatus.Active)).toBe(UserStatus.Active);

        // 2. Apply override
        useUserStore.getState().updateUserStatus(testId, UserStatus.Inactive);
        
        // 3. Should now return overridden status
        expect(useUserStore.getState().getUserStatus(testId, UserStatus.Active)).toBe(UserStatus.Inactive);
    });
});
