import { FC, memo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { PrimaryButton } from '@shared/ui'
import { InputEmail, validationRules } from '@shared/ui/inputs'

import { Prompt } from '../components/ui'
import { Or, SocialAuthButton, Title } from '../components/ui'
import styles from './login.module.css'

interface EmailFormInputs {
  email: string
}

export const Login: FC = memo(() => {
  useDocumentTitle('Login')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailFormInputs>()

  const onSubmit: SubmitHandler<EmailFormInputs> = async (data) => {
    console.log('Form data:', data)
    await navigate('/login/verification')
  }

  return (
    <>
      <div className={styles.container}>
        <Title text='Log in' />

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

      <Prompt question='New to Llamafolio?' answer='Create account' link='/register' />
    </>
  )
})
