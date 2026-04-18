import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchUsers } from '@/api';
import { USER_RECORD_COUNT } from '@/constants';
import { UserStatus, type PaginatedRequest, type PaginatedResponse, type User } from '@/types';
import { UsersPage } from './UsersPage';

vi.mock('@/api', () => ({
    fetchUsers: vi.fn(),
}));

const tableUsers = [
    {
        dateJoined: '2020-01-01T08:00:00.000Z',
        email: 'john@gmail.com',
        hasLoan: true,
        hasSavings: true,
        id: 'user_1',
        organization: 'Lendsqr',
        phoneNumber: '07000012345',
        status: UserStatus.Active,
        username: 'john williams',
    },
    {
        dateJoined: '2020-01-02T20:00:00.000Z',
        email: 'mary@gmail.com',
        hasLoan: false,
        hasSavings: false,
        id: 'user_2',
        organization: 'Irorun',
        phoneNumber: '08000020264',
        status: UserStatus.Inactive,
        username: 'mary johnson',
    },
] satisfies User[];

const statsUsers = [
    ...tableUsers,
    {
        dateJoined: '2020-01-04T08:00:00.000Z',
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

function createPayload(items: User[], total: number, request: PaginatedRequest): PaginatedResponse<User> {
    const cursor = request.cursor ?? 0;
    const nextCursor = cursor + request.limit;

    return {
        items,
        pagination: {
            hasNextPage: nextCursor < total,
            nextCursor: nextCursor < total ? nextCursor : null,
            requestedLimit: request.limit,
            returned: items.length,
            total,
        },
    };
}

function renderUsersPage() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UsersPage />
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

describe('UsersPage', () => {
    beforeEach(() => {
        vi.mocked(fetchUsers).mockImplementation(async (request) => {
            if (request.limit === USER_RECORD_COUNT) {
                return createPayload(statsUsers, USER_RECORD_COUNT, request);
            }

            return createPayload(tableUsers, 120, request);
        });
    });

    it('loads table data and keeps stats totals independent from filtered table totals', async () => {
        renderUsersPage();

        expect(await screen.findByText('john williams')).toBeInTheDocument();
        expect(screen.getByText('mary johnson')).toBeInTheDocument();

        const stats = screen.getByLabelText('User statistics');
        expect(within(stats).getByText('520')).toBeInTheDocument();
        expect(within(stats).getAllByText('2')).toHaveLength(2);
        expect(screen.getByText('out of 120')).toBeInTheDocument();
    });

    it('requests the next cursor when pagination advances', async () => {
        renderUsersPage();
        await screen.findByText('john williams');

        fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

        await waitFor(() => {
            expect(fetchUsers).toHaveBeenCalledWith(
                expect.objectContaining({
                    cursor: 20,
                    limit: 20,
                }),
            );
        });
    });

    it('refetches page one with the active column filter', async () => {
        renderUsersPage();
        await screen.findByText('john williams');

        fireEvent.click(screen.getByRole('button', { name: 'Filter by Organization' }));
        fireEvent.change(await screen.findByLabelText('Organization'), { target: { value: 'Irorun' } });

        await waitFor(() => {
            expect(fetchUsers).toHaveBeenCalledWith(
                expect.objectContaining({
                    cursor: 0,
                    filters: expect.objectContaining({
                        organization: 'Irorun',
                    }),
                    limit: 20,
                }),
            );
        });
    });
});
