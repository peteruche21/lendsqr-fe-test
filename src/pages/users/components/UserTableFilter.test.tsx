import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { USER_ORGANIZATIONS } from '@/constants';
import { UserStatus, type UserFilterField, type UserFilters } from '@/types';
import { UserTableFilter } from './UserTableFilter';

function renderFilter<Field extends UserFilterField>({
    field,
    label,
    value,
}: {
    field: Field;
    label: string;
    value: UserFilters[Field];
}) {
    const onChange = vi.fn();
    const onReset = vi.fn();

    render(<UserTableFilter field={field} label={label} value={value} onChange={onChange} onReset={onReset} />);

    return { onChange, onReset };
}

describe('UserTableFilter', () => {
    it('renders a text filter and auto-applies changes', () => {
        const { onChange } = renderFilter({
            field: 'username',
            label: 'Username',
            value: '',
        });

        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'ada' } });

        expect(onChange).toHaveBeenCalledWith('username', 'ada');
        expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();
    });

    it('shows reset only when the current filter has a value', () => {
        const { onReset } = renderFilter({
            field: 'email',
            label: 'Email',
            value: 'mary',
        });

        fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

        expect(onReset).toHaveBeenCalledWith('email');
    });

    it('renders organization options from constants', () => {
        const { onChange } = renderFilter({
            field: 'organization',
            label: 'Organization',
            value: '',
        });

        const select = screen.getByLabelText('Organization');
        fireEvent.change(select, { target: { value: USER_ORGANIZATIONS[1] } });

        expect(screen.getByRole('option', { name: USER_ORGANIZATIONS[0] })).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledWith('organization', USER_ORGANIZATIONS[1]);
    });

    it('renders status options and preserves the selected status', () => {
        renderFilter({
            field: 'status',
            label: 'Status',
            value: UserStatus.Blacklisted,
        });

        expect(screen.getByLabelText('Status')).toHaveValue(UserStatus.Blacklisted);
        expect(screen.getByRole('option', { name: UserStatus.Active })).toBeInTheDocument();
    });

    it('opens the native date picker from the whole date control when available', () => {
        const showPicker = vi.fn();
        HTMLInputElement.prototype.showPicker = showPicker;
        const { onChange } = renderFilter({
            field: 'dateJoined',
            label: 'Date',
            value: '',
        });

        const input = screen.getByLabelText('Date');
        fireEvent.click(input.parentElement!);
        fireEvent.change(input, { target: { value: '2020-02-12' } });

        expect(showPicker).toHaveBeenCalled();
        expect(input).toHaveAttribute('data-empty', 'true');
        expect(onChange).toHaveBeenCalledWith('dateJoined', '2020-02-12');
    });
});
