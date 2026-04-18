import type { HTMLAttributes, ReactNode } from 'react';
import type { UserStatus } from '@/types';

type BadgeVariant = UserStatus;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    children?: ReactNode;
    variant: BadgeVariant;
};

export function Badge({ children, className, variant, ...badgeProps }: BadgeProps) {
    const classes = ['badge', `badge--${variant}`, className ?? ''].filter(Boolean).join(' ');

    return (
        <span className={classes} {...badgeProps}>
            {children ?? variant}
        </span>
    );
}

export type { BadgeProps, BadgeVariant };
