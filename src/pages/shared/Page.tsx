import type { ReactNode } from 'react'
import { Logo } from '@/components'

type PageProps = {
  children?: ReactNode
  copy?: string
  showLogo?: boolean
}

export function Page({ children, copy, showLogo = true }: PageProps) {
  return (
    <main className="page">
      {showLogo ? <Logo className="page__logo" /> : null}
      {copy ? <p>{copy}</p> : null}
      {children}
    </main>
  )
}
