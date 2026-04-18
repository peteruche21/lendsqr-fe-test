import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
    it('renders with the default placeholder and accessible button label', () => {
        render(<SearchInput />);

        expect(screen.getByPlaceholderText('Search for anything')).toHaveAttribute('type', 'search');
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('forwards input props and change handlers', () => {
        const onChange = vi.fn();

        render(<SearchInput placeholder="Search users" value="john" onChange={onChange} />);
        const input = screen.getByPlaceholderText('Search users');

        expect(input).toHaveValue('john');
        fireEvent.change(input, { target: { value: 'mary' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('uses a custom button label for visible-reader text and aria label', () => {
        render(<SearchInput buttonLabel="Find users" />);

        expect(screen.getByText('Find users')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Find users' })).toBeInTheDocument();
    });
});
