import { FC, memo } from 'react'

import { lowerDasher } from '@shared/utils'

import styles from './label.module.css'

interface InputLabelProps {
  text: string
}

export const InputLabel: FC<InputLabelProps> = memo(({ text }) => {
  return (
    <label className={styles.label} htmlFor={lowerDasher(text)}>
      {text}
    </label>
  )
})
