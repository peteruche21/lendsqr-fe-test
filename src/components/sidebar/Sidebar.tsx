import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from '@/components/card'
import {
  ArrowHeadDownIcon,
  BadgePercentIcon,
  BankIcon,
  BriefCaseIcon,
  ChartIcon,
  ClipboardListIcon,
  CoinstackIcon,
  GalaxyIcon,
  HandshakeIcon,
  HomeIcon,
  LoanIcon,
  LogoutIcon,
  PiggybankIcon,
  SackIcon,
  ScrollIcon,
  SlidersHorizontalIcon,
  TireIcon,
  UserCheckIcon,
  UserGearIcon,
  UserGroupIcon,
  UserXIcon,
  UsersIcon,
} from '@/assets/icons'
import { NavItem } from '@/components/nav-item'

type SidebarProps = {
  onClose?: () => void
  open?: boolean
}

export function Sidebar({ onClose, open }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname
  const [switchOpen, setSwitchOpen] = useState(false)

  const toggleSwitch = () => setSwitchOpen((prev) => !prev)

  return (
    <>
      <div 
        aria-hidden="true" 
        className={`sidebar-backdrop ${open ? 'sidebar-backdrop--open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__content">
          <div className="sidebar__switch">
            <NavItem
              endAdornment={
                <ArrowHeadDownIcon 
                  style={{ 
                    transform: switchOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.2s ease-in-out' 
                  }} 
                />
              }
              icon={<BriefCaseIcon />}
              label="Switch Organization"
              onClick={toggleSwitch}
            />
            {switchOpen && (
              <>
                <div 
                  aria-hidden="true"
                  className="sidebar__switch-backdrop"
                  onClick={() => setSwitchOpen(false)}
                />
                <div className="sidebar__switch-dropdown">
                  <Card as="div" className="sidebar__switch-card">
                    switch organizations
                  </Card>
                </div>
              </>
            )}
          </div>
          
          <div className="sidebar__dashboard">
            <NavItem
              active={currentPath === '/dashboard'}
              href="/dashboard"
              icon={<HomeIcon />}
              label="Dashboard"
            />
          </div>

          <div className="sidebar__groups">
            <div className="nav-item-group">
              <h3 className="nav-item-group__heading">Customers</h3>
              <div className="nav-item-group__items">
                <NavItem active={currentPath.startsWith('/users')} href="/users" icon={<UsersIcon />} label="Users" />
                <NavItem active={currentPath.startsWith('/guarantors')} href="/guarantors" icon={<UserGroupIcon />} label="Guarantors" />
                <NavItem active={currentPath.startsWith('/loans')} href="/loans" icon={<SackIcon />} label="Loans" />
                <NavItem active={currentPath.startsWith('/decision-models')} href="/decision-models" icon={<HandshakeIcon />} label="Decision Models" />
                <NavItem active={currentPath.startsWith('/savings')} href="/savings" icon={<PiggybankIcon />} label="Savings" />
                <NavItem active={currentPath.startsWith('/loan-requests')} href="/loan-requests" icon={<LoanIcon />} label="Loan Requests" />
                <NavItem active={currentPath.startsWith('/whitelist')} href="/whitelist" icon={<UserCheckIcon />} label="Whitelist" />
                <NavItem active={currentPath.startsWith('/karma')} href="/karma" icon={<UserXIcon />} label="Karma" />
              </div>
            </div>

            <div className="nav-item-group">
              <h3 className="nav-item-group__heading">Businesses</h3>
              <div className="nav-item-group__items">
                <NavItem active={currentPath.startsWith('/organization')} href="/organization" icon={<BriefCaseIcon />} label="Organization" />
                <NavItem active={currentPath.startsWith('/loan-products')} href="/loan-products" icon={<LoanIcon />} label="Loan Products" />
                <NavItem active={currentPath.startsWith('/savings-products')} href="/savings-products" icon={<BankIcon />} label="Savings Products" />
                <NavItem active={currentPath.startsWith('/fees-and-charges')} href="/fees-and-charges" icon={<CoinstackIcon />} label="Fees and Charges" />
                <NavItem active={currentPath.startsWith('/transactions')} href="/transactions" icon={<ScrollIcon />} label="Transactions" />
                <NavItem active={currentPath.startsWith('/services')} href="/services" icon={<GalaxyIcon />} label="Services" />
                <NavItem active={currentPath.startsWith('/service-account')} href="/service-account" icon={<UserGearIcon />} label="Service Account" />
                <NavItem active={currentPath.startsWith('/settlements')} href="/settlements" icon={<ScrollIcon />} label="Settlements" />
                <NavItem active={currentPath.startsWith('/reports')} href="/reports" icon={<ChartIcon />} label="Reports" />
              </div>
            </div>

            <div className="nav-item-group">
              <h3 className="nav-item-group__heading">Settings</h3>
              <div className="nav-item-group__items">
                <NavItem active={currentPath.startsWith('/preferences')} href="/preferences" icon={<SlidersHorizontalIcon />} label="Preferences" />
                <NavItem active={currentPath.startsWith('/fees-and-pricing')} href="/fees-and-pricing" icon={<BadgePercentIcon />} label="Fees and Pricing" />
                <NavItem active={currentPath.startsWith('/audit-logs')} href="/audit-logs" icon={<ClipboardListIcon />} label="Audit Logs" />
                <NavItem active={currentPath.startsWith('/systems-messages')} href="/systems-messages" icon={<TireIcon />} label="Systems Messages" />
              </div>
            </div>
          </div>

          <div className="sidebar__footer">
            <div className="sidebar__footer-line" />
            <div className="sidebar__logout">
              <NavItem href="/" icon={<LogoutIcon />} label="Logout" />
            </div>
            <p className="sidebar__version">v1.2.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
