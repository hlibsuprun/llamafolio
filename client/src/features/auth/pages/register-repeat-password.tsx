import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { PrimaryButton } from '@shared/ui'
import { InputPassword, validationRules } from '@shared/ui/inputs'

import { Prompt, Title } from '../components/ui'
import styles from './register-set-password.module.css'

interface RepeatPasswordFormInputs {
  password: string
}

export const RegisterRepeatPassword: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RepeatPasswordFormInputs>()

  const onSubmit: SubmitHandler<RepeatPasswordFormInputs> = (data) => {
    console.log('Form data:', data)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Title text='Repeat password' />

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
            error={errors.password?.message}
            {...register('password', validationRules.password)}
          />

          <PrimaryButton type='submit' text='Create Account' />
        </form>
      </div>

      <Prompt answer='← Back' link='/register/set-password' />
    </div>
  )
}
