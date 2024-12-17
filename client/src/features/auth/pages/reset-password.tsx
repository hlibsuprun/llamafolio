import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { PrimaryButton } from '@shared/components/ui'
import { InputPassword, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'

import { fetchPasswordResetData, setPasswordResetPassword } from '../api'
import { Prompt, Title } from '../components/ui'
import styles from './reset-password.module.css'

interface PasswordFormInputs {
  password: string
}

export const ResetPassword: FC = memo(() => {
  useDocumentTitle('Reset Password')
  const navigate = useNavigate()
  const { token } = useParams()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

  const password = watch('password', '')

  const onSubmit: SubmitHandler<PasswordFormInputs> = async ({ password }) => {
    setIsLoading(true)
    if (!token) {
      void navigate('/')
      return
    }

    try {
      await setPasswordResetPassword(password, token)
      await navigate(`/reset-password/confirm/${token}`)
    } catch {
      void navigate('/login')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const checkToken = async () => {
      if (!token) void navigate('/')
      else {
        try {
          const response = await fetchPasswordResetData(token)

          if (!response.data) {
            void navigate('/')
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

  if (isPageLoading) return <></>

  return (
    <>
      <div className={styles.container}>
        <Title text='Reset Password' />

        <form
          className={styles.form}
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(onSubmit)(e)
          }}
        >
          <InputPassword
            label='New Password'
            password={password}
            error={errors.password?.message}
            {...register('password', validationRules.newPassword)}
          />

          <PrimaryButton type='submit' text='Next' loader={isLoading} />
        </form>
      </div>

      <Prompt question='Remember your password?' answer='Log in' link='/login' />
    </>
  )
})
