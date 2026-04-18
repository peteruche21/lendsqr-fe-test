import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonTone, ButtonVariant } from '@/types';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: 'start' | 'end';
    loading?: boolean;
    loadingLabel?: string;
    tone?: ButtonTone;
    variant?: ButtonVariant;
};

export function Button({
    children,
    className,
    disabled = false,
    fullWidth = false,
    icon,
    iconPosition = 'start',
    loading = false,
    loadingLabel = 'Loading...',
    tone = 'neutral',
    type = 'button',
    variant = 'primary',
    ...buttonProps
}: ButtonProps) {
    const isDisabled = disabled || loading;
    const classes = [
        'button',
        `button--${variant}`,
        `button--tone-${tone}`,
        fullWidth ? 'button--full-width' : '',
        loading ? 'button--loading' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    const startAdornment = loading ? (
        <span aria-hidden="true" className="button__spinner" />
    ) : icon && iconPosition === 'start' ? (
        <span aria-hidden="true" className="button__icon">
            {icon}
        </span>
    ) : null;

    const endAdornment =
        !loading && icon && iconPosition === 'end' ? (
            <span aria-hidden="true" className="button__icon">
                {icon}
            </span>
        ) : null;

    const content = loading ? loadingLabel : children;

    return (
        <button className={classes} disabled={isDisabled} type={type} {...buttonProps}>
            {startAdornment}
            {content ? <span className="button__label">{content}</span> : null}
            {endAdornment}
        </button>
    );
}

export type { ButtonProps };
