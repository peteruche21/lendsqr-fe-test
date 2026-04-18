import { describe, expect, it } from 'vitest';
import { USER_ORGANIZATIONS, USER_RECORD_COUNT, USER_STATUSES } from '@/constants';
import { createMockUser } from './user-fixtures';

describe('createMockUser', () => {
    it('creates deterministic ids and list fields from the supplied index', () => {
        const firstUser = createMockUser(0);
        const secondUser = createMockUser(1);

        expect(firstUser.id).toBe('user_1');
        expect(secondUser.id).toBe('user_2');
        expect(firstUser.username).toBe('john williams');
        expect(firstUser.organization).toBe(USER_ORGANIZATIONS[0]);
        expect(firstUser.status).toBe(USER_STATUSES[0]);
    });

    it('creates emails from the first username segment', () => {
        expect(createMockUser(0).email).toBe('john@gmail.com');
        expect(createMockUser(1).email).toBe('mary@gmail.com');
    });

    it('creates Nigerian phone numbers with supported prefixes and 11 digits', () => {
        const users = [createMockUser(0), createMockUser(1), createMockUser(2)];

        expect(users.map((user) => user.phoneNumber)).toEqual(['07000012345', '08000020264', '09000028183']);
        for (const user of users) {
            expect(user.phoneNumber).toMatch(/^0[789]0\d{8}$/);
        }
    });

    it('cycles organizations and statuses without exceeding the configured record count', () => {
        const lastUser = createMockUser(USER_RECORD_COUNT - 1);

        expect(lastUser.id).toBe(`user_${USER_RECORD_COUNT}`);
        expect(USER_ORGANIZATIONS).toContain(lastUser.organization);
        expect(USER_STATUSES).toContain(lastUser.status);
    });

    it('creates stable detail fields for the user details page', () => {
        const user = createMockUser(4);

        expect(user.personalInfo.bvn).toBe(user.phoneNumber);
        expect(user.education.officeEmail).toBe(user.email.replace('gmail.com', 'lendsqr.com'));
        expect(user.socials.twitter).toBe(`@${user.username.replace(' ', '_')}`);
        expect(user.guarantors).toHaveLength(2);
        expect(user.tier).toBeGreaterThanOrEqual(1);
        expect(user.tier).toBeLessThanOrEqual(3);
    });
});
