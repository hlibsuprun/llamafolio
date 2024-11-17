import { FC } from 'react'

import { Logo } from 'shared/icons'

import { LoginForm } from '../components/login-form'
import styles from './login.module.css'

export const Login: FC = () => {
  return (
    <>
      <a className={styles['link-logo']} href='/'>
        <Logo className={styles.logo} />
      </a>

      <LoginForm />

      <span className={styles.signup}>
        New to Llamafolio?{' '}
        <a className={styles['link-signup']} href='/signup'>
          Sign up
        </a>
      </span>
    </>
  )
}
