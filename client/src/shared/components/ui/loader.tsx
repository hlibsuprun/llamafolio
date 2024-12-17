import { FC, memo } from 'react'

import styles from './loader.module.css'

export const Loader: FC = memo(() => {
  return (
    <div className={styles.loader}>
      <div className={styles.item} style={{ animationDelay: '50ms' }}></div>
      <div className={styles.item} style={{ animationDelay: '100ms' }}></div>
      <div className={styles.item} style={{ animationDelay: '150ms' }}></div>
      <div className={styles.item} style={{ animationDelay: '200ms' }}></div>
    </div>
  )
})
