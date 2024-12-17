import { FC, memo, useEffect, useState } from 'react'

import { useAuthStore } from '@features/auth'
import { fetchLoginData, fetchRegistrationData } from '@features/auth/api'
import { ThemeProvider } from '@features/theme'
import { PageLoader } from '@shared/components/ui'
import { AxiosError } from 'axios'

import { Router } from './router'

export const App: FC = memo(() => {
  const setRegistrationData = useAuthStore((state) => state.setRegistrationData)
  const setLoginData = useAuthStore((state) => state.setLoginData)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initializeRegistrationData = async () => {
      try {
        const registrationResponse = await fetchRegistrationData()
        if (registrationResponse?.data) {
          setRegistrationData(registrationResponse.data)
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data)
        }
      }
    }
    const initializeLoginData = async () => {
      try {
        const loginResponse = await fetchLoginData()
        if (loginResponse?.data) {
          setLoginData(loginResponse.data)
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data)
        }
      }
    }

    const initializeAllData = async () => {
      await Promise.all([initializeRegistrationData(), initializeLoginData()])
      setIsLoading(false)
    }

    void initializeAllData()
  }, [])

  return <ThemeProvider>{isLoading ? <PageLoader /> : <Router />}</ThemeProvider>
})
