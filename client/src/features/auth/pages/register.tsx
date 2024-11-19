import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/ui'
import { InputEmail, validationRules } from '@shared/ui/inputs'

import { Or, Prompt, SocialAuthButton, Title } from '../components/ui'
import styles from './register.module.css'

interface RegisterFormInputs {
  email: string
}

export const Register: FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormInputs>()

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    console.log('Form data:', data)
    localStorage.setItem('register-email', data.email)
    await navigate('/register/verification')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Title text='Create account' />

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
    </div>
  )
}
