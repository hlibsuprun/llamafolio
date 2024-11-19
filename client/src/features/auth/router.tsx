import { Navigate, RouteObject } from 'react-router-dom'

import { GuardedRoute, Layout } from './components'
import { Login, Register } from './pages'
import { RegisterRepeatPassword } from './pages/register-repeat-password'
import { RegisterSetPassword } from './pages/register-set-password'
import { RegisterVerification } from './pages/register-verification'

export const router: RouteObject = {
  element: <Layout />,
  children: [
    { path: '*', element: <Navigate to='/login' /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/register/verification',
      element: (
        <GuardedRoute element={<RegisterVerification />} conditions={['register-email']} redirectPath='/register' />
      )
    },
    {
      path: '/register/set-password',
      element: (
        <GuardedRoute element={<RegisterSetPassword />} conditions={['register-email']} redirectPath='/register' />
      )
    },
    {
      path: '/register/repeat-password',
      element: (
        <GuardedRoute
          element={<RegisterRepeatPassword />}
          conditions={['register-email']}
          redirectPath='/set-password'
        />
      )
    }
  ]
}
