import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { isAuthenticated as isAuthenticatedApiCall } from '@shared/api'
import { PrimaryButton } from '@shared/components/ui'
import { InputPassword, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { completePasswordReset, fetchPasswordResetData } from '../api'
import { useAuthStore } from '../auth.store'
import { Prompt, Title } from '../components/ui'
import styles from './reset-password-confirm.module.css'

interface PasswordFormInputs {
  password: string
}

export const ResetPasswordConfirm: FC = memo(() => {
  useDocumentTitle('Confirm New Password')
  const navigate = useNavigate()
  const { token } = useParams()
  const setLoginData = useAuthStore((state) => state.setLoginData)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()
  const [passwordInputError, setPasswordInputError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

  const onSubmit: SubmitHandler<PasswordFormInputs> = async ({ password }) => {
    setIsLoading(true)
    if (!token) {
      void navigate('/')
      return
    }

    try {
      await completePasswordReset(password, token)
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
    const checkToken = async () => {
      if (!token) void navigate('/')
      else {
        try {
          const response = await fetchPasswordResetData(token)
          const data = response.data

          if (!data) {
            void navigate('/')
          } else if (!data?.password_is_set) {
            void navigate(`/reset-password/${token}`)
          } else {
            setIsPageLoading(false)
          }
        } catch {
          void navigate('/login')
        }
      }
    }

    void checkToken()
  }, [])

  useEffect(() => {
    setPasswordInputError(errors.password?.message)
  }, [errors.password?.message])

  if (isPageLoading) return <></>

  return (
    <>
      <div className={styles.container}>
        <Title text='Confirm New Password' />

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

          <PrimaryButton type='submit' text='Change Password' loader={isLoading} />
        </form>
      </div>

      <Prompt answer='← Back' link={`/reset-password/${token}`} />
    </>
  )
})
