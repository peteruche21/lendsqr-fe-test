import type { HTMLAttributes, MouseEventHandler } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ArrowHeadDownIcon, BellIcon } from '@/assets/icons';
import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { Logo } from '@/components/logo';
import { SearchInput } from '@/components/search-input';

type TopNavProps = HTMLAttributes<HTMLElement> & {
    avatarAlt?: string;
    avatarSrc: string;
    docsHref?: string;
    onMenuClick?: MouseEventHandler<HTMLButtonElement>;
    userName?: string;
};

export function TopNav({
    avatarAlt = 'User avatar',
    avatarSrc,
    className,
    docsHref = '#',
    onMenuClick,
    userName = 'Adedeji',
    ...navProps
}: TopNavProps) {
    const classes = ['top-nav', className ?? ''].filter(Boolean).join(' ');
    const [popoverOpen, setPopoverOpen] = useState(false);

    const togglePopover = () => setPopoverOpen((prev) => !prev);
    const closePopover = () => setPopoverOpen(false);

    return (
        <header className={classes} {...navProps}>
            <div className="top-nav__brand">
                <Link aria-label="Go to Home" className="top-nav__logo-link" to="/users">
                    <Logo className="top-nav__logo" />
                    <Logo className="top-nav__logo-icon" variant="icon" />
                </Link>
                <button aria-label="Open sidebar" className="top-nav__menu-button" type="button" onClick={onMenuClick}>
                    <Menu aria-hidden="true" size={22} strokeWidth={2.4} />
                </button>
            </div>

            <div className="top-nav__content">
                <SearchInput className="top-nav__search" />

                <div className="top-nav__actions">
                    <a className="top-nav__docs-link" href={docsHref}>
                        Docs
                    </a>

                    <div className="top-nav__account-tools">
                        <button aria-label="Notifications" className="top-nav__bell" type="button">
                            <BellIcon aria-hidden="true" />
                        </button>

                        <div
                            className="top-nav__profile-wrapper"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') closePopover();
                            }}
                        >
                            <button
                                aria-expanded={popoverOpen}
                                aria-haspopup="true"
                                className="top-nav__profile"
                                type="button"
                                onClick={togglePopover}
                            >
                                <Avatar alt={avatarAlt} className="top-nav__avatar" src={avatarSrc} />
                                <span className="top-nav__profile-name">{userName}</span>
                                <ArrowHeadDownIcon aria-hidden="true" className="top-nav__profile-chevron" />
                            </button>

                            {popoverOpen && (
                                <>
                                    <div
                                        aria-hidden="true"
                                        className="top-nav__popover-backdrop"
                                        onClick={closePopover}
                                    />
                                    <div className="top-nav__popover">
                                        <Card as="div" className="top-nav__popover-card">
                                            <p className="top-nav__popover-text">account quick actions</p>
                                        </Card>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export type { TopNavProps };
