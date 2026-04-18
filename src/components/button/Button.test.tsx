import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
    it('renders the primary neutral button by default', () => {
        render(<Button>Save</Button>);

        const button = screen.getByRole('button', { name: 'Save' });
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveClass('button--primary');
        expect(button).toHaveClass('button--tone-neutral');
    });

    it('applies variant, tone, full-width, and custom classes', () => {
        render(
            <Button className="extra-class" fullWidth tone="error" variant="outline">
                Reset
            </Button>,
        );

        const button = screen.getByRole('button', { name: 'Reset' });
        expect(button).toHaveClass('button--outline');
        expect(button).toHaveClass('button--tone-error');
        expect(button).toHaveClass('button--full-width');
        expect(button).toHaveClass('extra-class');
    });

    it('shows the loading label and disables interaction while loading', () => {
        render(
            <Button loading loadingLabel="Submitting...">
                Submit
            </Button>,
        );

        const button = screen.getByRole('button', { name: 'Submitting...' });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('button--loading');
        expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('renders start and end icons only when not loading', () => {
        const icon = <svg data-testid="icon" />;

        const { rerender } = render(<Button icon={icon}>Start</Button>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();

        rerender(
            <Button icon={icon} iconPosition="end">
                End
            </Button>,
        );
        expect(screen.getByTestId('icon')).toBeInTheDocument();

        rerender(
            <Button icon={icon} loading>
                Loading
            </Button>,
        );
        expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
});
