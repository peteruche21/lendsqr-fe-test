import type { ReactNode } from 'react'

type PageProps = {
  children?: ReactNode
  copy: string
}

export function Page({ children, copy }: PageProps) {
  return (
    <main className="page">
      <img className="page__logo" src="/logo.svg" alt="Lendsqr" />
      <p>{copy}</p>
      {children}
    </main>
  )
}
