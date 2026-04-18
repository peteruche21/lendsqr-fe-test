import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LoginPage } from './LoginPage';

function renderLoginPage() {
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>,
    );
}

describe('LoginPage', () => {
    it('does not show validation errors before submit', () => {
        renderLoginPage();

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('shows email and password validation after login is clicked', async () => {
        renderLoginPage();

        fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

        expect(await screen.findByText('Email is required.')).toBeInTheDocument();
        expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });

    it('revalidates fields while editing after a failed submit', async () => {
        renderLoginPage();

        fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
        expect(await screen.findByText('Email is required.')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad-email' } });
        await waitFor(() => {
            expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@lendsqr.com' } });
        await waitFor(() => {
            expect(screen.queryByText('Enter a valid email address.')).not.toBeInTheDocument();
        });
    });
});
