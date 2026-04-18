import type { ImgHTMLAttributes } from 'react';

type LogoVariant = 'full' | 'icon';

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
    variant?: LogoVariant;
};

const logoSources: Record<LogoVariant, string> = {
    full: '/logo.svg',
    icon: '/logo-icon.svg',
};

export function Logo({ className, variant = 'full', ...imageProps }: LogoProps) {
    return <img alt="Lendsqr" className={className} src={logoSources[variant]} {...imageProps} />;
}

export type { LogoProps };
