import type { MouseEventHandler, ReactNode } from 'react';

type NavItemBaseProps = {
    'aria-controls'?: string;
    'aria-expanded'?: boolean;
    active?: boolean;
    className?: string;
    disabled?: boolean;
    endAdornment?: ReactNode;
    icon?: ReactNode;
    id?: string;
    label: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
};

type NavItemAnchorProps = NavItemBaseProps & {
    href: string;
    rel?: string;
    target?: string;
};

type NavItemButtonProps = NavItemBaseProps & {
    href?: never;
    type?: 'button' | 'reset' | 'submit';
};

type NavItemProps = NavItemAnchorProps | NavItemButtonProps;

function getNavItemClassName(active: boolean, className?: string) {
    return ['nav-item', active ? 'nav-item--active' : '', className ?? ''].filter(Boolean).join(' ');
}

function NavItemContent({
    active,
    endAdornment,
    icon,
    label,
}: Pick<NavItemBaseProps, 'active' | 'endAdornment' | 'icon' | 'label'>) {
    return (
        <span className="nav-item__content">
            {icon ? (
                <span aria-hidden="true" className="nav-item__icon">
                    {icon}
                </span>
            ) : null}
            <span className="nav-item__label">{label}</span>
            {endAdornment ? (
                <span aria-hidden="true" className="nav-item__end-adornment">
                    {endAdornment}
                </span>
            ) : null}
            {active ? <span className="nav-item__active-marker" /> : null}
        </span>
    );
}

export function NavItem(props: NavItemProps) {
    const { active = false, className, disabled = false, endAdornment, icon, id, label, onClick } = props;
    const ariaControls = props['aria-controls'];
    const ariaExpanded = props['aria-expanded'];
    const classes = getNavItemClassName(active, className);

    if ('href' in props && props.href) {
        return (
            <a
                aria-controls={ariaControls}
                aria-current={active ? 'page' : undefined}
                aria-disabled={disabled}
                aria-expanded={ariaExpanded}
                className={classes}
                href={props.href}
                id={id}
                onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
                rel={props.rel}
                target={props.target}
            >
                <NavItemContent active={active} endAdornment={endAdornment} icon={icon} label={label} />
            </a>
        );
    }

    const type = 'type' in props ? (props.type ?? 'button') : 'button';

    return (
        <button
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            className={classes}
            disabled={disabled}
            id={id}
            type={type}
            onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        >
            <NavItemContent active={active} endAdornment={endAdornment} icon={icon} label={label} />
        </button>
    );
}

export type { NavItemProps };
