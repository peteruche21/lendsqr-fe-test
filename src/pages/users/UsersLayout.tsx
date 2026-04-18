import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Card, TopNav } from '@/components'
import { Sidebar } from '@/components/sidebar'

export function UsersLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  const isUsersRoute = location.pathname.startsWith('/users')

  return (
    <div className="users-layout">
      <TopNav
        avatarAlt="Adedeji"
        avatarSrc="/adedeji.png"
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className="users-layout__main">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="users-layout__content">
          {isUsersRoute ? (
            <Outlet />
          ) : (
            <div className="users-layout__unimplemented">
              <Card as="div" className="users-layout__unimplemented-card">
                <h2>Section has not been implemented</h2>
                <p>Please navigate to the Users section from the sidebar.</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
