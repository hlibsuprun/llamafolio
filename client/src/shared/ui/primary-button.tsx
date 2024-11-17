import { FC } from 'react'

import styles from './primary-button.module.css'

interface PrimaryButtonProps {
  text: string
  type: 'button' | 'reset' | 'submit' | 'link'
  href?: string
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ text, type, href }) => {
  switch (type) {
    case 'link':
      return (
        <a className={styles.link} href={href}>
          {text}
        </a>
      )
    default:
      return (
        <button className={styles.button} type={type}>
          {text}
        </button>
      )
  }
}
