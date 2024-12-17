import { FC, memo } from 'react'
import { Link } from 'react-router-dom'

import { Logo as LogoIcon } from '@shared/components/icons'

import styles from './logo.module.css'

interface LogoProps {
  width: number
  onClick?: () => void
}

export const Logo: FC<LogoProps> = memo(({ width, onClick }) => {
  return (
    <Link className={styles.link} style={{ width }} to='/' onClick={onClick}>
      <LogoIcon className={styles.logo} />
    </Link>
  )
})
