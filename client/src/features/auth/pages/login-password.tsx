import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { isAuthenticated as isAuthenticatedApiCall } from '@shared/api'
import { PrimaryButton } from '@shared/components/ui'
import { InputPassword, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { verifyPassword } from '../api'
import { useAuthStore } from '../auth.store'
import { Title } from '../components/ui'
import styles from './login-password.module.css'

interface PasswordFormInputs {
  password: string
}

export const LoginPassword: FC = memo(() => {
  useDocumentTitle('Welcome back')
  const navigate = useNavigate()
  const loginData = useAuthStore((state) => state.loginData)
  const setLoginData = useAuthStore((state) => state.setLoginData)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()
  const [passwordInputError, setPasswordInputError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit: SubmitHandler<PasswordFormInputs> = async ({ password }) => {
    setIsLoading(true)
    try {
      await verifyPassword(password)
      const response = await isAuthenticatedApiCall()
      if (response.status === 200) {
        setIsAuthenticated(true)
        setLoginData(null)
        void navigate('/')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { detail?: string }
        if (data?.detail === 'Passwords do not match.') setPasswordInputError(data?.detail)
        if (data?.detail === 'Session expired.') void navigate('/login')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!loginData) {
      void navigate('/login')
    } else if (!loginData?.login_verified) {
      void navigate('/login/verification')
    }
  }, [])

  useEffect(() => {
    setPasswordInputError(errors.password?.message)
  }, [errors.password?.message])

  if (!loginData?.login_verified) return <></>

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Title text='Welcome back' />

        <form
          className={styles.form}
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(onSubmit)(e)
          }}
        >
          <InputPassword
            label='Password'
            forgotPassword={true}
            error={passwordInputError}
            {...register('password', validationRules.password)}
          />

          <PrimaryButton type='submit' text='Log in' loader={isLoading} />
        </form>
      </div>
    </div>
  )
})
