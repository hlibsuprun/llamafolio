import { FC, memo, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import styles from './layout.module.css'
import { Header } from './ui'

export const Layout: FC = memo(() => {
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [isBurgerOpen, setBurgerOpen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769)
    }

    if (isMobile) closeModal('settings')
    if (!isMobile) closeModal('burger')

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const header = document.querySelector('header')!

    if (isSettingsOpen || isBurgerOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`

      header.style.width = `calc(100% - 2rem - ${scrollbarWidth}px)`
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.paddingRight = ''
      header.style.width = `calc(100% - 2rem)`
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.paddingRight = ''
      header.style.width = `calc(100% - 2rem)`
    }
  }, [isSettingsOpen, isBurgerOpen])

  const toggleSettings = () => setSettingsOpen(!isSettingsOpen)
  const toggleBurgerMenu = () => setBurgerOpen(!isBurgerOpen)

  const closeModal = (modal?: 'settings' | 'burger') => {
    switch (modal) {
      case 'settings':
        setSettingsOpen(false)
        break
      case 'burger':
        setBurgerOpen(false)
        break
      default:
        setSettingsOpen(false)
        setBurgerOpen(false)
        break
    }
  }

  return (
    <div className={styles.wrapper}>
      {isSettingsOpen && !isMobile && <div className={`${styles.overlay}`} onClick={() => closeModal('settings')} />}
      {isBurgerOpen && isMobile && <div className={`${styles.overlay}`} onClick={() => closeModal('burger')} />}

      <Header
        isSettingsOpen={isSettingsOpen}
        isBurgerOpen={isBurgerOpen}
        toggleSettings={toggleSettings}
        toggleBurgerMenu={toggleBurgerMenu}
        closeModal={closeModal}
      />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
})
