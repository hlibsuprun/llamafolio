import { Navigate, RouteObject } from 'react-router-dom'

import { Layout } from './components'
import { Login, Signup } from './pages'

export const router: RouteObject = {
  element: <Layout />,
  children: [
    { path: '*', element: <Navigate to='login' /> },
    { path: 'login', element: <Login /> },
    { path: 'signup', element: <Signup /> }
  ]
}
