import { FC, memo } from 'react'

import styles from './error.module.css'

interface InputErrorProps {
  message: string
}

export const InputError: FC<InputErrorProps> = memo(({ message }) => {
  return <div className={styles.wrapper}>{message}</div>
})
