import { FC, memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'

import { passwordReset } from '../api'
import { useAuthStore } from '../auth.store'
import { Prompt, Title } from '../components/ui'
import styles from './login-forgot-password.module.css'

export const LoginForgotPassword: FC = memo(() => {
  useDocumentTitle('Forgot password?')
  const navigate = useNavigate()
  const loginData = useAuthStore((state) => state.loginData)

  useEffect(() => {
    if (!loginData) {
      void navigate('/login')
    } else if (!loginData?.login_verified) {
      void navigate('/login/verification')
    } else {
      void passwordReset()
    }
  }, [])

  if (!loginData?.login_verified) return <></>

  return (
    <>
      <div className={styles.container}>
        <Title text='Forgot password?' />

        <p className={styles.description}>
          We’ve sent an email with a password reset link to your inbox. Check your email and follow the instructions to
          reset your password.
        </p>
      </div>

      <Prompt answer='← Back' link='/login/password' />
    </>
  )
})
