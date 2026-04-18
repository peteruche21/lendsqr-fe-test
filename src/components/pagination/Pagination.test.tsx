import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

function visiblePageLabels() {
    return within(screen.getByRole('list'))
        .getAllByRole('listitem')
        .map((item) => item.textContent);
}

describe('Pagination', () => {
    it('renders every page when the total is small', () => {
        render(<Pagination currentPage={2} totalPages={4} />);

        expect(visiblePageLabels()).toEqual(['1', '2', '3', '4']);
        expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent('2');
    });

    it('uses the assessment start window for larger page sets', () => {
        render(<Pagination currentPage={1} totalPages={16} />);

        expect(visiblePageLabels()).toEqual(['1', '2', '3', '...', '15', '16']);
    });

    it('shows the active sibling window in the middle of a large page set', () => {
        render(<Pagination currentPage={8} totalPages={16} />);

        expect(visiblePageLabels()).toEqual(['1', '...', '7', '8', '9', '...', '16']);
    });

    it('uses the end window near the final pages', () => {
        render(<Pagination currentPage={15} totalPages={16} />);

        expect(visiblePageLabels()).toEqual(['1', '2', '...', '14', '15', '16']);
    });

    it('bounds the active page and disables unavailable controls', () => {
        render(<Pagination currentPage={99} totalPages={3} />);

        expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
        expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent('3');
    });

    it('calls page and arrow handlers', () => {
        const onNext = vi.fn();
        const onPageChange = vi.fn();
        const onPrevious = vi.fn();

        render(
            <Pagination
                currentPage={2}
                totalPages={5}
                onNext={onNext}
                onPageChange={onPageChange}
                onPrevious={onPrevious}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
        fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
        fireEvent.click(screen.getByRole('button', { name: '4' }));

        expect(onPrevious).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledTimes(1);
        expect(onPageChange).toHaveBeenCalledWith(4);
    });
});
