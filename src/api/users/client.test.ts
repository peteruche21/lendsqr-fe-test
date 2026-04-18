import { afterEach, describe, expect, it, vi } from 'vitest';
import { UserStatus, type PaginatedResponse, type UserDetails } from '@/types';
import { fetchUserById, fetchUsers } from './client';

const samplePayload = {
    items: [],
    pagination: {
        hasNextPage: false,
        nextCursor: null,
        requestedLimit: 20,
        returned: 0,
        total: 0,
    },
} satisfies PaginatedResponse<UserDetails>;

describe('users API client', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('serializes pagination and non-empty filters into the users request', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(samplePayload),
        });
        vi.stubGlobal('fetch', fetchMock);

        await fetchUsers({
            cursor: 40,
            filters: {
                email: 'mary',
                organization: '',
                status: UserStatus.Active,
            },
            limit: 20,
        });

        const requestedUrl = fetchMock.mock.calls[0]?.[0] as string;
        expect(requestedUrl).toContain('/api/users?');
        expect(requestedUrl).toContain('limit=20');
        expect(requestedUrl).toContain('cursor=40');
        expect(requestedUrl).toContain('email=mary');
        expect(requestedUrl).toContain(`status=${UserStatus.Active}`);
        expect(requestedUrl).not.toContain('organization=');
    });

    it('throws a clear error when the users list request fails', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
            }),
        );

        await expect(fetchUsers({ limit: 20 })).rejects.toThrow('Unable to load users.');
    });

    it('fetches user details by id', async () => {
        const user = {
            id: 'user_1',
        };
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(user),
        });
        vi.stubGlobal('fetch', fetchMock);

        await expect(fetchUserById('user_1')).resolves.toEqual(user);
        expect(fetchMock).toHaveBeenCalledWith('/api/users/user_1');
    });

    it('uses a not-found error for 404 detail responses', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
            }),
        );

        await expect(fetchUserById('missing')).rejects.toThrow('User not found.');
    });
});
