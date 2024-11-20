import { FC, memo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useDocumentTitle } from '@shared/hooks'
import { PrimaryButton } from '@shared/ui'
import { InputPassword, validationRules } from '@shared/ui/inputs'

import { Prompt, Title } from '../components/ui'
import styles from './reset-password-confirm.module.css'

interface PasswordFormInputs {
  password: string
}

export const ResetPasswordConfirm: FC = memo(() => {
  useDocumentTitle('Confirm New Password')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordFormInputs>()

  const onSubmit: SubmitHandler<PasswordFormInputs> = (data) => {
    console.log('Form data:', data)
  }

  return (
    <>
      <div className={styles.container}>
        <Title text='Confirm New Password' />

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

          <PrimaryButton type='submit' text='Change Password' />
        </form>
      </div>

      <Prompt answer='← Back' link='/reset-password' />
    </>
  )
})
