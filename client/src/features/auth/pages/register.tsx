import { FC, memo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { PrimaryButton } from '@shared/ui'
import { InputEmail, validationRules } from '@shared/ui/inputs'

import { Or, Prompt, SocialAuthButton, Title } from '../components/ui'
import styles from './register.module.css'

interface EmailFormInputs {
  email: string
}

export const Register: FC = memo(() => {
  useDocumentTitle('Create Account')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailFormInputs>()

  const onSubmit: SubmitHandler<EmailFormInputs> = async (data) => {
    console.log('Form data:', data)
    localStorage.setItem('register-email', data.email)
    await navigate('/register/verification')
  }

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
          <InputEmail
            label='Email address'
            error={errors.email?.message}
            {...register('email', validationRules.email)}
          />

          <PrimaryButton type='submit' text='Next' />
        </form>

        <Or />

        <SocialAuthButton social='Google' />
      </div>

      <Prompt question='Already have an account?' answer='Log in' link='login' />
    </>
  )
})
