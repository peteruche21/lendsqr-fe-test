import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
    it('renders with default rectangular variant', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('skeleton--rect');
    });

    it('renders with circle variant', () => {
        const { container } = render(<Skeleton variant="circle" />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('skeleton--circle');
    });

    it('applies custom dimensions correctly', () => {
        render(<Skeleton width={200} height={50} data-testid="skeleton-box" />);
        const skeleton = document.querySelector('[data-testid="skeleton-box"]') as HTMLElement;
        
        expect(skeleton.style.width).toBe('200px');
        expect(skeleton.style.height).toBe('50px');
    });

    it('renders with text variant', () => {
        const { container } = render(<Skeleton variant="text" />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton).toHaveClass('skeleton--text');
    });
});
