import { describe, expect, it } from 'vitest';
import { UserStatus, type User } from '@/types';
import { filterUsers } from './user-filters';

const users = [
    {
        dateJoined: '2020-01-01T08:00:00.000Z',
        email: 'john@gmail.com',
        hasLoan: true,
        hasSavings: false,
        id: 'user_1',
        organization: 'Lendsqr',
        phoneNumber: '07000012345',
        status: UserStatus.Active,
        username: 'john williams',
    },
    {
        dateJoined: '2020-02-12T20:00:00.000Z',
        email: 'mary@gmail.com',
        hasLoan: false,
        hasSavings: true,
        id: 'user_2',
        organization: 'Irorun',
        phoneNumber: '08000020264',
        status: UserStatus.Inactive,
        username: 'mary johnson',
    },
    {
        dateJoined: '2020-02-12T08:00:00.000Z',
        email: 'ada@gmail.com',
        hasLoan: true,
        hasSavings: true,
        id: 'user_3',
        organization: 'Lendsqr',
        phoneNumber: '09000028183',
        status: UserStatus.Pending,
        username: 'ada okafor',
    },
] satisfies User[];

describe('filterUsers', () => {
    it('returns every user when no filters are set', () => {
        expect(filterUsers(users, {})).toEqual(users);
    });

    it('filters exact organization and status values', () => {
        expect(filterUsers(users, { organization: 'Lendsqr', status: UserStatus.Pending })).toEqual([users[2]]);
    });

    it('filters username and email text case-insensitively', () => {
        expect(filterUsers(users, { username: 'WILLIAMS' })).toEqual([users[0]]);
        expect(filterUsers(users, { email: 'MARY@' })).toEqual([users[1]]);
    });

    it('filters phone numbers by partial digits', () => {
        expect(filterUsers(users, { phoneNumber: '28183' })).toEqual([users[2]]);
    });

    it('filters all users joined on a selected date', () => {
        expect(filterUsers(users, { dateJoined: '2020-02-12' })).toEqual([users[1], users[2]]);
    });

    it('requires all provided filters to match', () => {
        expect(filterUsers(users, { organization: 'Irorun', status: UserStatus.Active })).toEqual([]);
    });
});
