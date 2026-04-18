import { fireEvent, render, screen } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from './DataTable';

type Person = {
    email: string;
    name: string;
};

const columns: ColumnDef<Person>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.row.original.name,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.row.original.email,
    },
];

describe('DataTable', () => {
    it('renders headers and rows from TanStack columns', () => {
        render(
            <DataTable
                columns={columns}
                data={[
                    { email: 'ada@lendsqr.com', name: 'Ada' },
                    { email: 'john@lendsqr.com', name: 'John' },
                ]}
            />,
        );

        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
        expect(screen.getByText('Ada')).toBeInTheDocument();
        expect(screen.getByText('john@lendsqr.com')).toBeInTheDocument();
    });

    it('renders a stable empty state across every column', () => {
        render(<DataTable columns={columns} data={[]} />);

        const emptyCell = screen.getByText('No data available');
        expect(emptyCell).toBeInTheDocument();
        expect(emptyCell).toHaveAttribute('colspan', '2');
    });

    it('calls row click handlers with the original row object', () => {
        const onRowClick = vi.fn();
        const person = { email: 'ada@lendsqr.com', name: 'Ada' };

        render(<DataTable columns={columns} data={[person]} onRowClick={onRowClick} />);
        fireEvent.click(screen.getByText('Ada').closest('tr')!);

        expect(onRowClick).toHaveBeenCalledWith(person);
    });
});
