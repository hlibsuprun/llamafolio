import { forwardRef, InputHTMLAttributes } from 'react'

import { lowerDasher } from '@shared/utils'

import styles from './email.module.css'
import { InputError } from './error'
import { InputLabel } from './label'

interface InputEmailProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error: string | undefined
}

export const InputEmail = forwardRef<HTMLInputElement, InputEmailProps>(({ label, error, ...rest }, ref) => {
  return (
    <div>
      <InputLabel text={label} />

      <div className={styles.container}>
        <input
          className={`${styles.input} ${error && styles.error}`}
          type='text'
          name={lowerDasher(label)}
          ref={ref}
          {...rest}
        />
      </div>

      {error && <InputError message={error} />}
    </div>
  )
})
