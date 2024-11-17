import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import styles from './layout.module.css'

export const Layout: FC = () => {
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
