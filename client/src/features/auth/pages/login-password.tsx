import { FC, memo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useDocumentTitle } from '@shared/hooks'
import { PrimaryButton } from '@shared/ui'
import { InputPassword, validationRules } from '@shared/ui/inputs'

import { Title } from '../components/ui'
import styles from './login-password.module.css'

interface PasswordFormInputs {
  password: string
}

export const LoginPassword: FC = memo(() => {
  useDocumentTitle('Welcome back')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()

  const onSubmit: SubmitHandler<PasswordFormInputs> = (data) => {
    console.log('Form data:', data)
  }

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
            error={errors.password?.message}
            {...register('password', validationRules.password)}
          />

          <PrimaryButton type='submit' text='Log in' />
        </form>
      </div>
    </div>
  )
})
