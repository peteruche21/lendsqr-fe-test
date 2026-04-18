import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserStatus, type PaginatedResponse, type User, type UserDetails } from '@/types';
import { handleUsersRequest } from './handler';

async function resolveUsersRequest(url: string, init?: RequestInit): Promise<Response> {
    const responsePromise = handleUsersRequest(new Request(url, init));
    await vi.advanceTimersByTimeAsync(500);
    return responsePromise;
}

describe('handleUsersRequest', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('rejects non-GET requests', async () => {
        const response = await resolveUsersRequest('https://app.test/api/users?limit=2', { method: 'POST' });

        expect(response.status).toBe(405);
        expect(await response.json()).toEqual({ error: 'Method not allowed.' });
    });

    it('requires a positive integer limit', async () => {
        const missingLimit = await resolveUsersRequest('https://app.test/api/users');
        const invalidLimit = await resolveUsersRequest('https://app.test/api/users?limit=0');

        expect(missingLimit.status).toBe(400);
        expect(await missingLimit.json()).toEqual({ error: 'A positive integer limit is required.' });
        expect(invalidLimit.status).toBe(400);
    });

    it('requires a non-negative integer cursor', async () => {
        const response = await resolveUsersRequest('https://app.test/api/users?limit=2&cursor=-1');

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'Cursor must be a positive integer.' });
    });

    it('returns the requested page size and cursor metadata', async () => {
        const response = await resolveUsersRequest('https://app.test/api/users?limit=3&cursor=2');
        const payload = (await response.json()) as PaginatedResponse<User>;

        expect(response.status).toBe(200);
        expect(payload.items).toHaveLength(3);
        expect(payload.items.map((user) => user.id)).toEqual(['user_3', 'user_4', 'user_5']);
        expect(payload.pagination).toMatchObject({
            hasNextPage: true,
            nextCursor: 5,
            requestedLimit: 3,
            returned: 3,
            total: 520,
        });
    });

    it('applies filters before pagination', async () => {
        const response = await resolveUsersRequest(
            `https://app.test/api/users?limit=5&status=${UserStatus.Active}&organization=Lendsqr`,
        );
        const payload = (await response.json()) as PaginatedResponse<User>;

        expect(payload.items).toHaveLength(5);
        expect(payload.pagination.total).toBeGreaterThan(5);
        expect(payload.items.every((user) => user.status === UserStatus.Active)).toBe(true);
        expect(payload.items.every((user) => user.organization === 'Lendsqr')).toBe(true);
    });

    it('ignores invalid status filter values instead of accepting them at the boundary', async () => {
        const response = await resolveUsersRequest('https://app.test/api/users?limit=2&status=deleted');
        const payload = (await response.json()) as PaginatedResponse<User>;

        expect(payload.pagination.total).toBe(520);
        expect(payload.items).toHaveLength(2);
    });

    it('returns a user detail by id', async () => {
        const response = await resolveUsersRequest('https://app.test/api/users/user_10');
        const user = (await response.json()) as UserDetails;

        expect(response.status).toBe(200);
        expect(user.id).toBe('user_10');
        expect(user.guarantors).toHaveLength(2);
    });

    it('returns 404 for a missing user detail', async () => {
        const response = await resolveUsersRequest('https://app.test/api/users/user_9999');

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ error: 'User not found.' });
    });
});
