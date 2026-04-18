import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserDetailsGeneral } from './UserDetailsGeneral';
import { UserStatus, type UserDetails } from '@/types';

// Mock data with unique values to avoid 'getByText' collisions
const mockUser: UserDetails = {
    accountBalance: '50,000',
    accountNumber: '9988776655',
    bankName: 'Lendsqr Bank',
    dateJoined: '2020-01-01T08:00:00.000Z',
    email: 'jane@example.com',
    hasLoan: false,
    hasSavings: true,
    id: 'user_1',
    organization: 'Lendsqr',
    phoneNumber: '09012345678',
    status: UserStatus.Active,
    username: 'Jane Smith',
    tier: 2,
    personalInfo: {
        bvn: '222333444',
        children: '2',
        gender: 'Female',
        maritalStatus: 'Married',
        residenceType: 'Self Owned',
    },
    education: {
        duration: '2 years',
        level: 'M.Sc',
        loanRepayment: '50,000',
        monthlyIncome: '200k - 500k',
        officeEmail: 'jane@corp.com',
        sector: 'Technology',
        status: 'Employed',
    },
    socials: {
        twitter: '@jsmith_twitter',
        facebook: '@janesmith_fb',
        instagram: '@janesmith_ig',
    },
    guarantors: [
        {
            fullName: 'John Guarantor',
            phoneNumber: '08011122233',
            email: 'john@g.com',
            relationship: 'Brother',
        },
    ],
} satisfies UserDetails;

describe('UserDetailsGeneral', () => {
    it('renders all section titles correctly', () => {
        render(<UserDetailsGeneral user={mockUser} />);
        
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByText('Education and Employment')).toBeInTheDocument();
        expect(screen.getByText('Socials')).toBeInTheDocument();
        expect(screen.getByText('Guarantor')).toBeInTheDocument();
    });

    it('displays mapped user data correctly', () => {
        render(<UserDetailsGeneral user={mockUser} />);
        
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('222333444')).toBeInTheDocument();
        expect(screen.getByText('Self Owned')).toBeInTheDocument();
        expect(screen.getByText('@jsmith_twitter')).toBeInTheDocument();
    });

    it('applies the 4-column grid class to the education section', () => {
        // Use a more specific selector to find the grid within the education section
        render(<UserDetailsGeneral user={mockUser} />);
        const eduSection = screen.getByText('Education and Employment').closest('section');
        const grid = eduSection?.querySelector('.info-section__grid--edu');
        
        expect(grid).toBeInTheDocument();
    });

    it('renders multiple guarantors if present', () => {
        const userWithTwoGuarantors = {
            ...mockUser,
            guarantors: [
                {
                    fullName: 'John Guarantor',
                    phoneNumber: '08011122233',
                    email: 'john@g.com',
                    relationship: 'Brother',
                },
                {
                    fullName: 'Second Guarantor',
                    phoneNumber: '07099988877',
                    email: 'second@g.com',
                    relationship: 'Mother',
                },
            ],
        };

        render(<UserDetailsGeneral user={userWithTwoGuarantors} />);
        
        expect(screen.getByText('John Guarantor')).toBeInTheDocument();
        expect(screen.getByText('Second Guarantor')).toBeInTheDocument();
    });
});
