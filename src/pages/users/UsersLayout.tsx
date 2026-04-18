import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components'

export function UsersLayout() {
  return (
    <div className="users-layout">
      <TopNav avatarAlt="Adedeji" avatarSrc="/avatar.svg" />
      <Outlet />
    </div>
  )
}
