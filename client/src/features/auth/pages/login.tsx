import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { PrimaryButton } from '@shared/ui'
import { InputEmail, InputPassword, validationRules } from '@shared/ui/inputs'

import { Prompt } from '../components/ui'
import { Or, SocialAuthButton, Title } from '../components/ui'
import styles from './login.module.css'

interface LoginFormInputs {
  email: string
  password: string
}

export const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>()

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log('Form data:', data)
  }

  return (
    <div className={styles.wrapper}>
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

          <InputPassword
            label='Password'
            forgotPassword={true}
            error={errors.password?.message}
            {...register('password', validationRules.password)}
          />

          <PrimaryButton type='submit' text='Log in' />
        </form>

        <Or />

        <SocialAuthButton social='Google' />
      </div>

      <Prompt question='New to Llamafolio?' answer='Create account' link='/register' />
    </div>
  )
}
