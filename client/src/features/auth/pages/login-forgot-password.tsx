import { FC, memo } from 'react'

import { useDocumentTitle } from '@shared/hooks'

import { Prompt, Title } from '../components/ui'
import styles from './login-forgot-password.module.css'

export const LoginForgotPassword: FC = memo(() => {
  useDocumentTitle('Forgot password?')

  return (
    <>
      <div className={styles.container}>
        <Title text='Forgot password?' />

        <p className={styles.description}>
          We’ve sent an email with a password reset link to your inbox. Check your email (including spam or promotions
          folders) and follow the instructions to reset your password.
        </p>

        <span className={styles.prompt}>
          Didn't receive email?{' '}
          <button className={styles.button} type='button'>
            Resend
          </button>
        </span>
      </div>

      <Prompt answer='← Back' link='/login/password' />
    </>
  )
})
