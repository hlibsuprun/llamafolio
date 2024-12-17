import { FC, memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Logo } from '@shared/components/ui'

import styles from './layout.module.css'

export const Layout: FC = memo(() => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Logo width={170} />
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  )
})
