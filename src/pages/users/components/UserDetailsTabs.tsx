import './UserDetailsTabs.scss'

export type TabId = 'general' | 'documents' | 'bank' | 'loans' | 'savings' | 'system'

interface Tab {
  id: TabId
  label: string
}

const TABS: Tab[] = [
  { id: 'general', label: 'General Details' },
  { id: 'documents', label: 'Documents' },
  { id: 'bank', label: 'Bank Details' },
  { id: 'loans', label: 'Loans' },
  { id: 'savings', label: 'Savings' },
  { id: 'system', label: 'App and System' },
]

interface UserDetailsTabsProps {
  activeTab: TabId
  onTabChange: (id: TabId) => void
}

export function UserDetailsTabs({ activeTab, onTabChange }: UserDetailsTabsProps) {
  return (
    <nav className="user-details-tabs">
      <ul className="user-details-tabs__list">
        {TABS.map((tab) => (
          <li key={tab.id} className="user-details-tabs__item">
            <button
              className={`user-details-tabs__button ${
                activeTab === tab.id ? 'user-details-tabs__button--active' : ''
              }`}
              type="button"
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
