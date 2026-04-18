import type { HTMLAttributes } from 'react';
import './Skeleton.scss';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'rect' | 'circle' | 'text';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({ variant = 'rect', width, height, className, style, ...props }: SkeletonProps) {
    const classes = ['skeleton', `skeleton--${variant}`, className ?? ''].filter(Boolean).join(' ');

    const inlineStyles = {
        width,
        height,
        ...style,
    };

    return <div className={classes} style={inlineStyles} {...props} />;
}
