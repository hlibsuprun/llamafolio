import { FC, memo, MouseEvent } from 'react'

import { Loader } from './loader'
import styles from './primary-button.module.css'

interface PrimaryButtonProps {
  text: string
  type: 'button' | 'reset' | 'submit' | 'link'
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  loader?: boolean
  href?: string
}

export const PrimaryButton: FC<PrimaryButtonProps> = memo(({ text, type, onClick, loader, href }) => {
  switch (type) {
    case 'link':
      return (
        <a className={styles.link} href={href}>
          {text}
        </a>
      )
    default:
      return (
        <button
          className={styles.button}
          style={{ pointerEvents: loader ? 'none' : 'auto' }}
          type={type}
          onClick={onClick}
        >
          {loader ? <Loader /> : text}
        </button>
      )
  }
})
