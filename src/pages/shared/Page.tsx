import type { ReactNode } from 'react'
import { Logo } from '@/components'

type PageProps = {
  children?: ReactNode
  copy?: string
}

export function Page({ children, copy }: PageProps) {
  return (
    <main className="page">
      <Logo className="page__logo" />
      {copy ? <p>{copy}</p> : null}
      {children}
    </main>
  )
}
