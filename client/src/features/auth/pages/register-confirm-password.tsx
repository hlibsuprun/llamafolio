import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { isAuthenticated as isAuthenticatedApiCall } from '@shared/api'
import { PrimaryButton } from '@shared/components/ui'
import { InputPassword, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { completeRegistration } from '../api'
import { useAuthStore } from '../auth.store'
import { Prompt, Title } from '../components/ui'
import styles from './register-confirm-password.module.css'

interface PasswordFormInputs {
  password: string
}

export const RegisterConfirmPassword: FC = memo(() => {
  useDocumentTitle('Confirm Password')
  const navigate = useNavigate()
  const registrationData = useAuthStore((state) => state.registrationData)
  const setRegistrationData = useAuthStore((state) => state.setRegistrationData)
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
      await completeRegistration(password)
      const response = await isAuthenticatedApiCall()
      if (response.status === 200) {
        setIsAuthenticated(true)
        setRegistrationData(null)
        void navigate('/')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { detail?: string }
        if (data?.detail === 'Passwords do not match.') setPasswordInputError(data?.detail)
        if (data?.detail === 'Session expired.') void navigate('/register')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!registrationData) {
      void navigate('/register')
    } else if (!registrationData?.otp_verified) {
      void navigate('/register/verification')
    } else if (!registrationData?.password_is_set) {
      void navigate('/register/set-password')
    }
  }, [])

  useEffect(() => {
    setPasswordInputError(errors.password?.message)
  }, [errors.password?.message])

  if (!registrationData?.otp_verified || !registrationData?.password_is_set) return <></>

  return (
    <>
      <div className={styles.container}>
        <Title text='Confirm Password' />

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
            error={passwordInputError}
            {...register('password', validationRules.password)}
          />

          <PrimaryButton type='submit' text='Create Account' loader={isLoading} />
        </form>
      </div>

      <Prompt answer='← Back' link='/register/set-password' />
    </>
  )
})
