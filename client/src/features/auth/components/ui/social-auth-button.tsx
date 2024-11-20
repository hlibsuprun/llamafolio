import { FC, memo } from 'react'

import { GoogleLogo } from '@shared/icons'

import styles from './social-auth-button.module.css'

interface SocialAuthButtonProps {
  social: 'Google'
}

export const SocialAuthButton: FC<SocialAuthButtonProps> = memo(({ social }) => {
  return (
    <button className={styles.button} type='button'>
      {social === 'Google' && <GoogleLogo size='16' />}
      Continue with {social}
    </button>
  )
})
