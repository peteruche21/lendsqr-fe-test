import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
    it('connects the label, input, and error message accessibly', () => {
        render(<Input id="email" label="Email" error="Email is required." />);

        const input = screen.getByLabelText('Email');

        expect(input).toHaveAttribute('id', 'email');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAccessibleDescription('Email is required.');
        expect(screen.getByRole('alert')).toHaveTextContent('Email is required.');
    });

    it('defaults to a text input without a password toggle', () => {
        render(<Input label="Username" />);

        expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
        expect(screen.queryByRole('button', { name: /password/i })).not.toBeInTheDocument();
    });

    it('toggles password visibility without changing the field value', () => {
        render(<Input label="Password" type="password" defaultValue="secret-pass" />);

        const input = screen.getByLabelText('Password');
        const toggle = screen.getByRole('button', { name: 'Show password' });

        expect(input).toHaveAttribute('type', 'password');
        fireEvent.click(toggle);
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveValue('secret-pass');
        expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });
});
