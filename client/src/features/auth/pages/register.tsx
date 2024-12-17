import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/components/ui'
import { InputEmail, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { fetchRegistrationData, registration } from '../api'
import { useAuthStore } from '../auth.store'
import { Or, Prompt, SocialAuthButton, Title } from '../components/ui'
import styles from './register.module.css'

interface EmailFormInputs {
  email: string
}

export const Register: FC = memo(() => {
  useDocumentTitle('Create Account')
  const navigate = useNavigate()
  const setRegistrationData = useAuthStore((state) => state.setRegistrationData)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailFormInputs>()
  const [emailInputError, setEmailInputError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit: SubmitHandler<EmailFormInputs> = async ({ email }) => {
    setIsLoading(true)
    try {
      await registration(email)
      const registrationResponse = await fetchRegistrationData()
      if (registrationResponse?.data) {
        setRegistrationData(registrationResponse.data)
      }
      void navigate('/register/verification')
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { detail?: string }
        if (data?.detail === 'Email is already registered.') setEmailInputError(data?.detail)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setEmailInputError(errors.email?.message)
  }, [errors.email?.message])

  return (
    <>
      <div className={styles.container}>
        <Title text='Create Account' />

        <form
          className={styles.form}
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(onSubmit)(e)
          }}
        >
          <InputEmail label='Email address' error={emailInputError} {...register('email', validationRules.email)} />

          <PrimaryButton type='submit' text='Next' loader={isLoading} />
        </form>

        <Or />

        <SocialAuthButton social='Google' />
      </div>

      <Prompt question='Already have an account?' answer='Log in' link='login' />
    </>
  )
})
