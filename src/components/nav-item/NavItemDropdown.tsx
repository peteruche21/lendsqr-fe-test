import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/card';
import { NavItem } from './NavItem';

type NavItemDropdownProps = {
    active?: boolean;
    children?: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    icon?: ReactNode;
    label: ReactNode;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
};

export function NavItemDropdown({
    active = false,
    children = 'toggle accounts here',
    className,
    defaultOpen = false,
    icon,
    label,
    onOpenChange,
    open,
}: NavItemDropdownProps) {
    const dropdownId = useId();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const classes = ['nav-item-dropdown', className ?? ''].filter(Boolean).join(' ');

    const toggleOpen = () => {
        const nextOpen = !isOpen;

        if (!isControlled) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    return (
        <div className={classes}>
            <NavItem
                active={active}
                aria-controls={dropdownId}
                aria-expanded={isOpen}
                endAdornment={
                    <ChevronDown
                        className="nav-item-dropdown__chevron"
                        data-open={isOpen ? 'true' : 'false'}
                        size={16}
                        strokeWidth={3}
                    />
                }
                icon={icon}
                label={label}
                onClick={toggleOpen}
            />

            {isOpen ? (
                <Card as="div" className="nav-item-dropdown__card" id={dropdownId}>
                    {children}
                </Card>
            ) : null}
        </div>
    );
}

export type { NavItemDropdownProps };
