import { FC, memo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { PrimaryButton } from '@shared/ui'
import { InputOtp, validationRules } from '@shared/ui/inputs'

import { Prompt, Title } from '../components/ui'
import styles from './login-verification.module.css'

interface OtpFormInputs {
  otpEmail: string
  otpApp: string
}

export const LoginVerification: FC = memo(() => {
  useDocumentTitle('Security Verification')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OtpFormInputs>()

  const onSubmit: SubmitHandler<OtpFormInputs> = async (data) => {
    console.log('Form data:', data)
    await navigate('/login/password')
  }

  return (
    <>
      <div className={styles.container}>
        <Title text='Security Verification' />

        <form
          className={styles.form}
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(onSubmit)(e)
          }}
        >
          <InputOtp
            label='Email Verification Code'
            resend={true}
            error={errors.otpEmail?.message}
            {...register('otpEmail', validationRules.otp)}
          />

          <InputOtp
            label='Authenticator App Code'
            error={errors.otpApp?.message}
            {...register('otpApp', validationRules.otp)}
          />

          <PrimaryButton type='submit' text='Next' />
        </form>
      </div>

      <Prompt answer='← Back' link='/login' />
    </>
  )
})
