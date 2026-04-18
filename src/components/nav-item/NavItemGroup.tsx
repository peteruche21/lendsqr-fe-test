import type { HTMLAttributes, ReactNode } from 'react';

type NavItemGroupProps = HTMLAttributes<HTMLElement> & {
    children?: ReactNode;
    heading: string;
};

export function NavItemGroup({ children, className, heading, ...sectionProps }: NavItemGroupProps) {
    const classes = ['nav-item-group', className ?? ''].filter(Boolean).join(' ');

    return (
        <section className={classes} {...sectionProps}>
            <h2 className="nav-item-group__heading">{heading}</h2>
            <div className="nav-item-group__items">{children}</div>
        </section>
    );
}

export type { NavItemGroupProps };
