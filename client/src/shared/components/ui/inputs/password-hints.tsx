import { FC, memo } from 'react'
import { FaCheck } from 'react-icons/fa6'

import styles from './password-hints.module.css'

interface PasswordHintsProps {
  password: string
  error: boolean
}

export const PasswordHints: FC<PasswordHintsProps> = memo(({ password, error }) => {
  const conditions = [
    { test: (val: string) => val.length >= 8, message: 'Minimum 8 characters' },
    { test: (val: string) => /[0-9]/.test(val), message: 'At least 1 number' },
    { test: (val: string) => /[A-Z]/.test(val), message: 'At least 1 uppercase letter' }
  ]

  return (
    <ul className={styles.list}>
      {conditions.map(({ test, message }, index) => (
        <li key={index} className={`${styles.item} ${test(password) && styles.success} ${error && styles.error}`}>
          <FaCheck size={12} className={styles.icon} />
          {message}
        </li>
      ))}
    </ul>
  )
})
