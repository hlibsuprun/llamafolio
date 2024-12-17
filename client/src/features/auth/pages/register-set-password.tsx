import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/components/ui'
import { InputPassword, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { fetchRegistrationData, setRegistrationPassword } from '../api'
import { useAuthStore } from '../auth.store'
import { Prompt, Title } from '../components/ui'
import styles from './register-set-password.module.css'

interface PasswordFormInputs {
  password: string
}

export const RegisterSetPassword: FC = memo(() => {
  useDocumentTitle('Set Password')
  const navigate = useNavigate()
  const registrationData = useAuthStore((state) => state.registrationData)
  const setRegistrationData = useAuthStore((state) => state.setRegistrationData)
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const password = watch('password', '')

  const onSubmit: SubmitHandler<PasswordFormInputs> = async ({ password }) => {
    setIsLoading(true)
    try {
      await setRegistrationPassword(password)
      const registrationResponse = await fetchRegistrationData()
      if (registrationResponse?.data) {
        setRegistrationData(registrationResponse.data)
      }
      void navigate('/register/confirm-password')
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { detail?: string }
        if (data?.detail === 'Session expired.') void navigate('/register')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!registrationData?.otp_verified) void navigate('/register/verification')
  }, [])

  if (!registrationData?.otp_verified) return <></>

  return (
    <>
      <div className={styles.container}>
        <Title text='Set Password' />

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
            password={password}
            error={errors.password?.message}
            {...register('password', validationRules.newPassword)}
          />

          <PrimaryButton type='submit' text='Next' loader={isLoading} />
        </form>
      </div>

      <Prompt answer='← Back' link='/register' />
    </>
  )
})
