import type { ReactNode } from 'react'
import { Logo } from '@/components'
import './Page.scss'

type PageProps = {
  children?: ReactNode
  header?: ReactNode
  showLogo?: boolean
}

export function Page({ children, header, showLogo = true }: PageProps) {
  return (
    <main className="page">
      {showLogo ? <Logo className="page__logo" /> : null}
      {header ? (
        <div className="page__header-container">
          {header}
        </div>
      ) : null}
      {children}
    </main>
  )
}
