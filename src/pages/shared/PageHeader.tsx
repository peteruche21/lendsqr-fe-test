import type { ReactNode } from 'react';
import './PageHeader.scss';

export type PageHeaderProps = {
    actions?: ReactNode;
    navigation?: ReactNode;
    title: string;
};

export function PageHeader({ actions, navigation, title }: PageHeaderProps) {
    return (
        <header className="page-header">
            {navigation ? <div className="page-header__navigation">{navigation}</div> : null}

            <div className="page-header__main">
                <h1 className="page-header__title">{title}</h1>
                {actions ? <div className="page-header__actions">{actions}</div> : null}
            </div>
        </header>
    );
}
