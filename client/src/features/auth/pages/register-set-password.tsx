import { FC, memo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { PrimaryButton } from '@shared/ui'
import { InputPassword, validationRules } from '@shared/ui/inputs'

import { Prompt, Title } from '../components/ui'
import styles from './register-set-password.module.css'

interface PasswordFormInputs {
  password: string
}

export const RegisterSetPassword: FC = memo(() => {
  useDocumentTitle('Set Password')
  const navigate = useNavigate()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()

  const password = watch('password', '')

  const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
    console.log('Form data:', data)
    await navigate('/register/confirm-password')
  }

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

          <PrimaryButton type='submit' text='Next' />
        </form>
      </div>

      <Prompt answer='← Back' link='/register' />
    </>
  )
})
