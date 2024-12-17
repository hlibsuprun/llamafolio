import { FC, memo } from 'react'

import { Loader } from './loader'
import styles from './page-loader.module.css'

export const PageLoader: FC = memo(() => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Loader />
      </div>
    </div>
  )
})
