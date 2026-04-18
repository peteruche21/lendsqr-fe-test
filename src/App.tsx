import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  LoginPage,
  NotFoundPage,
  UserDetailPage,
  UsersLayout,
  UsersPage,
} from '@/pages'

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
      <Route path="/login" element={<LoginPage />} />
      <Route element={<UsersLayout />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
