import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/ui'
import { InputOtp, validationRules } from '@shared/ui/inputs'

import { Prompt, Title } from '../components/ui'
import styles from './register-verification.module.css'

interface OtpFormInputs {
  otp: string
}

export const RegisterVerification: FC = () => {
  const email = localStorage.getItem('register-email')

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OtpFormInputs>()

  const onSubmit: SubmitHandler<OtpFormInputs> = async (data) => {
    console.log('Form data:', data)
    await navigate('/register/set-password')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.text}>
          <Title text='Verify your email' />
          <p className={styles.description}>A 6-digit code has been sent to {email}.</p>
        </div>

        <form
          className={styles.form}
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(onSubmit)(e)
          }}
        >
          <InputOtp
            label='Verification Code'
            resend={true}
            error={errors.otp?.message}
            {...register('otp', validationRules.otp)}
          />

          <PrimaryButton type='submit' text='Next' />
        </form>
      </div>

      <Prompt answer='← Back' link='/register' />
    </div>
  )
}
