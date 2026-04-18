import { useState } from 'react';
import { ListFilter, MoreVertical } from 'lucide-react';
import { AcUserBlockIcon, AcUserCheckIcon, AcUserEyeIcon } from '@/assets/icons';
import { Badge, Card } from '@/components';
import { useUserStore } from '@/store/userStore';
import { UserStatus, type User, type UserFilterField } from '@/types';

type ColumnHeaderProps = {
    field: UserFilterField;
    hasFilter: boolean;
    onOpenFilter: (field: UserFilterField, trigger: HTMLElement) => void;
    openFilter: UserFilterField | null;
    title: string;
};

export function ColumnHeader({ field, hasFilter, onOpenFilter, openFilter, title }: ColumnHeaderProps) {
    const isOpen = openFilter === field;

    return (
        <div className="table-header">
            <span>{title}</span>
            <button
                aria-expanded={isOpen}
                className="table-header__filter"
                type="button"
                aria-label={`Filter by ${title}`}
                onClick={(event) => {
                    event.stopPropagation();
                    onOpenFilter(field, event.currentTarget);
                }}
            >
                <ListFilter />
                {hasFilter ? <span className="table-header__filter-dot" /> : null}
            </button>
        </div>
    );
}

type StatusCellProps = {
    user: User;
};

export function StatusCell({ user }: StatusCellProps) {
    const getUserStatus = useUserStore((s) => s.getUserStatus);
    const status = getUserStatus(user.id, user.status);

    return <Badge variant={status} />;
}

type ActionsCellProps = {
    user: User;
    onViewDetails: () => void;
};

export function ActionsCell({ user, onViewDetails }: ActionsCellProps) {
    const [open, setOpen] = useState(false);
    const updateUserStatus = useUserStore((s) => s.updateUserStatus);

    const closePopover = () => setOpen(false);

    const handleStatusUpdate = (status: UserStatus) => {
        updateUserStatus(user.id, status);
        closePopover();
    };

    return (
        <div className="table-actions">
            <button
                aria-label="More actions"
                className="table-actions__trigger"
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen(true);
                }}
            >
                <MoreVertical size={20} />
            </button>
            {open && (
                <>
                    <div
                        aria-hidden="true"
                        className="table-actions__backdrop"
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpen(false);
                        }}
                    />
                    <div className="table-actions__popover" onClick={(event) => event.stopPropagation()}>
                        <Card as="div" className="table-actions__card">
                            <button
                                className="table-actions__item"
                                type="button"
                                onClick={() => {
                                    closePopover();
                                    onViewDetails();
                                }}
                            >
                                <AcUserEyeIcon />
                                <span>View Details</span>
                            </button>
                            <button
                                className="table-actions__item"
                                type="button"
                                onClick={() => handleStatusUpdate(UserStatus.Blacklisted)}
                            >
                                <AcUserBlockIcon />
                                <span>Blacklist User</span>
                            </button>
                            <button
                                className="table-actions__item"
                                type="button"
                                onClick={() => handleStatusUpdate(UserStatus.Active)}
                            >
                                <AcUserCheckIcon />
                                <span>Activate User</span>
                            </button>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
