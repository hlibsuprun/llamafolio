import { FC, memo, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@shared/components/ui'
import { InputOtp, validationRules } from '@shared/components/ui/inputs'
import { useDocumentTitle } from '@shared/hooks'
import { AxiosError } from 'axios'

import { fetchLoginData, verifyLogin } from '../api'
import { useAuthStore } from '../auth.store'
import { Prompt, Title } from '../components/ui'
import styles from './login-verification.module.css'

interface OtpFormInputs {
  otp?: string
  totp?: string
}

export const LoginVerification: FC = memo(() => {
  useDocumentTitle('Security Verification')
  const navigate = useNavigate()
  const setLoginData = useAuthStore((state) => state.setLoginData)
  const loginData = useAuthStore((state) => state.loginData)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OtpFormInputs>()
  const [otpInputError, setOtpInputError] = useState<string | undefined>()
  const [totpInputError, setTotpInputError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit: SubmitHandler<OtpFormInputs> = async ({ otp, totp }) => {
    setIsLoading(true)
    try {
      await verifyLogin(otp, totp)
      const loginResponse = await fetchLoginData()
      if (loginResponse?.data) {
        setLoginData(loginResponse.data)
      }
      void navigate('/login/password')
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { detail?: string }
        if (data?.detail === 'Invalid OTP.') setOtpInputError(data?.detail)
        if (data?.detail === 'Invalid TOTP.') setTotpInputError(data?.detail)
        if (data?.detail === 'Session expired.') void navigate('/login')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!loginData || loginData?.login_verified) void navigate('/login')
  }, [])

  useEffect(() => {
    setOtpInputError(errors.otp?.message)
    setTotpInputError(errors.totp?.message)
  }, [errors.otp?.message, errors.totp?.message])

  if (!loginData || loginData?.login_verified) return <></>

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
          {loginData?.is_email_2fa_enabled && (
            <InputOtp
              label='Email Verification Code'
              resend='login'
              error={otpInputError}
              {...register('otp', validationRules.otp)}
            />
          )}

          {loginData?.is_totp_2fa_enabled && (
            <InputOtp
              label='Authenticator App Code'
              error={totpInputError}
              {...register('totp', validationRules.otp)}
            />
          )}

          <PrimaryButton type='submit' text='Next' loader={isLoading} />
        </form>
      </div>

      <Prompt answer='← Back' link='/login' />
    </>
  )
})
