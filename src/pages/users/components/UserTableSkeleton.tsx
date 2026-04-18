import { Skeleton } from '@/components/skeleton/Skeleton';
import './UserTableSkeleton.scss';

export function UserTableSkeleton() {
    return (
        <div className="user-table-skeleton">
            {/* Table Header Placeholder */}
            <div className="user-table-skeleton__header">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={16} width="70%" />
                ))}
            </div>

            {/* Table Rows Placeholder */}
            <div className="user-table-skeleton__rows">
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="user-table-skeleton__row">
                        {Array.from({ length: 6 }).map((_, colIndex) => (
                            <div key={colIndex} className="user-table-skeleton__cell">
                                <Skeleton height={14} width={colIndex === 2 ? '90%' : '60%'} />
                            </div>
                        ))}
                        <div className="user-table-skeleton__cell user-table-skeleton__cell--actions">
                            <Skeleton variant="circle" height={20} width={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
