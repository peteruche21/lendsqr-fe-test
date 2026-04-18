import type { ElementType, HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
    as?: ElementType;
    children?: ReactNode;
};

export function Card({ as: Component = 'section', children, className, ...cardProps }: CardProps) {
    const classes = ['card', className ?? ''].filter(Boolean).join(' ');

    return (
        <Component className={classes} {...cardProps}>
            {children}
        </Component>
    );
}

export type { CardProps };
