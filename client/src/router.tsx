import { FC, useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { router as AuthRouter, useAuthStore } from '@features/auth'
import { isAuthenticated as isAuthenticatedApiCall } from '@shared/api'
import { Layout } from '@shared/components'
import { AxiosError } from 'axios'

import { Dashboard } from './pages'

export const Router: FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isAuthenticatedApiCall()
        if (response.status === 200) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
        if (error instanceof AxiosError) {
          console.error(error.response?.data)
        }
      }
    }

    void checkAuth()
  }, [])

  const router = createBrowserRouter(
    [
      isAuthenticated
        ? {
            element: <Layout />,
            children: [
              { path: '*', element: <Navigate to='/dashboard' /> },
              { path: '/dashboard', element: <Dashboard /> }
            ]
          }
        : AuthRouter
    ],
    {
      future: {
        v7_startTransition: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true
      }
    }
  )

  return <RouterProvider router={router} />
}
