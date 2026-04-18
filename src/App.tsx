import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/main.scss'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function LoginPage() {
  return <Page copy="this is a login page." />
}

function UsersPage() {
  return <Page copy="this is a users page." />
}

function UserDetailPage() {
  return <Page copy="this is a user detail page." />
}

function NotFoundPage() {
  return <Page copy="this is a 404 page." />
}

function Page({ copy }: { copy: string }) {
  return (
    <main className="page">
      <img className="page__logo" src="/logo.svg" alt="Lendsqr" />
      <p>{copy}</p>
    </main>
  )
}

export default App
