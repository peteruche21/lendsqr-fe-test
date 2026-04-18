import { UserRound } from 'lucide-react';
import { Card } from '@/components';
import { StarFilledIcon, StarOutlineIcon } from '@/assets/icons';
import type { UserDetails } from '@/types';
import { UserDetailsTabs, type TabId } from './UserDetailsTabs';
import './UserDetailsSummary.scss';

interface UserDetailsSummaryProps {
    user: UserDetails;
    activeTab: TabId;
    onTabChange: (id: TabId) => void;
}

export function UserDetailsSummary({ user, activeTab, onTabChange }: UserDetailsSummaryProps) {
    return (
        <Card className="user-details-summary">
            <div className="user-details-summary__top-row">
                <div className="user-details-summary__profile">
                    <div className="user-details-summary__avatar-wrapper">
                        <div className="user-details-summary__avatar-bg">
                            <UserRound className="user-details-summary__avatar-icon" strokeWidth={3} />
                        </div>
                    </div>

                    <div className="user-details-summary__name-id">
                        <h2 className="user-details-summary__name">{user.username}</h2>
                        <span className="user-details-summary__id">{user.id}</span>
                    </div>
                </div>

                <div className="user-details-summary__tier">
                    <span className="user-details-summary__label">User's Tier</span>
                    <div className="user-details-summary__stars">
                        {[1, 2, 3].map((i) =>
                            i <= user.tier ? (
                                <StarFilledIcon key={i} className="user-details-summary__star" />
                            ) : (
                                <StarOutlineIcon key={i} className="user-details-summary__star" />
                            ),
                        )}
                    </div>
                </div>

                <div className="user-details-summary__bank">
                    <h2 className="user-details-summary__balance">{user.accountBalance}</h2>
                    <span className="user-details-summary__bank-details">
                        {user.accountNumber}/{user.bankName}
                    </span>
                </div>
            </div>

            <UserDetailsTabs activeTab={activeTab} onTabChange={onTabChange} />
        </Card>
    );
}
