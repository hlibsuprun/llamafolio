import { Navigate, RouteObject } from 'react-router-dom'

import { Layout } from './components'
import {
  Login,
  LoginForgotPassword,
  LoginPassword,
  LoginVerification,
  Register,
  RegisterConfirmPassword,
  RegisterSetPassword,
  RegisterVerification,
  ResetPassword,
  ResetPasswordConfirm
} from './pages'

export const router: RouteObject = {
  element: <Layout />,
  children: [
    { path: '*', element: <Navigate to='/login' /> },
    { path: '/login', element: <Login /> },
    {
      path: '/login/verification',
      element: <LoginVerification />
    },
    {
      path: '/login/password',
      element: <LoginPassword />
    },
    {
      path: '/login/forgot-password',
      element: <LoginForgotPassword />
    },
    { path: '/register', element: <Register /> },
    {
      path: '/register/verification',
      element: <RegisterVerification />
    },
    {
      path: '/register/set-password',
      element: <RegisterSetPassword />
    },
    {
      path: '/register/confirm-password',
      element: <RegisterConfirmPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/reset-password/confirm',
      element: <ResetPasswordConfirm />
    }
  ]
}
