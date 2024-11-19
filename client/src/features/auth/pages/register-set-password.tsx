import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/ui'
import { InputPassword, validationRules } from '@shared/ui/inputs'

import { Prompt, Title } from '../components/ui'
import styles from './register-set-password.module.css'

interface SetPasswordFormInputs {
  password: string
}

export const RegisterSetPassword: FC = () => {
  const navigate = useNavigate()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<SetPasswordFormInputs>()

  const password = watch('password', '')

  const onSubmit: SubmitHandler<SetPasswordFormInputs> = async (data) => {
    console.log('Form data:', data)
    await navigate('/register/repeat-password')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Title text='Set password' />

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

          <PrimaryButton type='submit' text='Next' />
        </form>
      </div>

      <Prompt answer='← Back' link='/register' />
    </div>
  )
}
