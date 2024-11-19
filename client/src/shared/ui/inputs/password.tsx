import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

import { lowerDasher } from '@shared/utils'

import { InputError } from './error'
import { InputLabel } from './label'
import styles from './password.module.css'
import { PasswordHints } from './password-hints'

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  password?: string
  forgotPassword?: true
  error: string | undefined
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ label, password, forgotPassword, error, ...rest }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false)

    return (
      <div className={styles.wrapper}>
        <InputLabel text={label} />

        {forgotPassword && (
          <a className={styles.link} href='/forgot-password'>
            Forgot password?
          </a>
        )}

        <div className={styles.container}>
          <input
            className={`${styles.input} ${error && styles.error}`}
            type={isVisible ? 'text' : 'password'}
            name={lowerDasher(label)}
            ref={ref}
            {...rest}
          />

          <button type='button' className={styles.eyeButton} onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? <FaEye className={styles.eye} /> : <FaEyeSlash className={styles.eye} />}
          </button>
        </div>

        {typeof password === 'string' && <PasswordHints password={password} error={typeof error === 'string'} />}

        {typeof password === 'undefined' && error && <InputError message={error} />}
      </div>
    )
  }
)
