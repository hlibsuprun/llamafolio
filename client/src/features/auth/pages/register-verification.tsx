import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/components/ui'
import { InputOtp, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { fetchRegistrationData, verifyEmail } from '../api'
import { useAuthStore } from '../auth.store'
import { Prompt, Title } from '../components/ui'
import styles from './register-verification.module.css'

interface OtpFormInputs {
  otp: string
}

export const RegisterVerification: FC = memo(() => {
  useDocumentTitle('Email Verification')
  const navigate = useNavigate()
  const setRegistrationData = useAuthStore((state) => state.setRegistrationData)
  const registrationData = useAuthStore((state) => state.registrationData)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OtpFormInputs>()
  const [otpInputError, setOtpInputError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit: SubmitHandler<OtpFormInputs> = async ({ otp }) => {
    setIsLoading(true)
    try {
      await verifyEmail(otp)
      const registrationResponse = await fetchRegistrationData()
      if (registrationResponse?.data) {
        setRegistrationData(registrationResponse.data)
      }
      void navigate('/register/set-password')
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { detail?: string }
        if (data?.detail === 'Invalid OTP.') setOtpInputError(data?.detail)
        if (data?.detail === 'Session expired.') void navigate('/register')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!registrationData || registrationData?.otp_verified) void navigate('/register')
  }, [])

  useEffect(() => {
    setOtpInputError(errors.otp?.message)
  }, [errors.otp?.message])

  if (!registrationData || registrationData?.otp_verified) return <></>

  return (
    <>
      <div className={styles.container}>
        <div className={styles.text}>
          <Title text='Email Verification' />
          <p className={styles.description}>
            A 6-digit code has been sent to <i>example@example.com</i>.
          </p>
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
            resend='registration'
            error={otpInputError}
            {...register('otp', validationRules.otp)}
          />

          <PrimaryButton type='submit' text='Next' loader={isLoading} />
        </form>
      </div>

      <Prompt answer='← Back' link='/register' />
    </>
  )
})
