import { Skeleton } from '@/components/skeleton/Skeleton';
import { Card } from '@/components';
import './UserDetailSkeleton.scss';

export function UserDetailSkeleton() {
    return (
        <div className="user-detail-skeleton">
            {/* 1. Summary Card Skeleton */}
            <Card className="user-detail-skeleton__card">
                <div className="user-detail-skeleton__top-row">
                    <div className="user-detail-skeleton__profile">
                        <Skeleton variant="circle" width={100} height={100} />
                        <div className="user-detail-skeleton__name-id">
                            <Skeleton width={150} height={24} />
                            <Skeleton width={100} height={14} />
                        </div>
                    </div>

                    <div className="user-detail-skeleton__tier">
                        <Skeleton width={80} height={14} />
                        <div className="user-detail-skeleton__stars">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} variant="circle" width={14} height={14} />
                            ))}
                        </div>
                    </div>

                    <div className="user-detail-skeleton__bank">
                        <Skeleton width={120} height={24} />
                        <Skeleton width={180} height={12} />
                    </div>
                </div>

                {/* Tabs skeleton */}
                <div className="user-detail-skeleton__tabs">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} width={100} height={32} />
                    ))}
                </div>
            </Card>

            {/* 2. General Details Skeleton */}
            <Card className="user-detail-skeleton__content">
                {Array.from({ length: 4 }).map((_, sectionIndex) => (
                    <div key={sectionIndex} className="user-detail-skeleton__section">
                        <Skeleton width={200} height={20} className="user-detail-skeleton__title" />
                        <div className="user-detail-skeleton__grid">
                            {Array.from({ length: 8 }).map((_, itemIndex) => (
                                <div key={itemIndex} className="user-detail-skeleton__item">
                                    <Skeleton width="40%" height={12} />
                                    <Skeleton width="80%" height={16} />
                                </div>
                            ))}
                        </div>
                        {sectionIndex < 3 && <div className="user-detail-skeleton__divider" />}
                    </div>
                ))}
            </Card>
        </div>
    );
}
