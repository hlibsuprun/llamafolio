import { FC, memo } from 'react'
import { IoSettingsSharp } from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom'

import { ThemeToggle } from '@features/theme'
import { capitalize } from '@shared/utils'

import styles from './header.module.css'
import { Logo } from './logo'

interface HeaderProps {
  isSettingsOpen: boolean
  toggleSettings: () => void
  isBurgerOpen: boolean
  toggleBurgerMenu: () => void
  closeModal: (modal?: 'settings' | 'burger') => void
}

export const Header: FC<HeaderProps> = memo(
  ({ isSettingsOpen, toggleSettings, isBurgerOpen, toggleBurgerMenu, closeModal }) => {
    const { pathname } = useLocation()

    return (
      <header className={`${styles.header} ${isBurgerOpen && styles.active}`}>
        <div className={styles.header__container}>
          <Logo width={140} onClick={() => closeModal()} />
          <nav className={styles.nav}>
            <hr className={styles.line} />
            <div className={styles.nav__container}>
              <ul className={styles.list}>
                {['dashboard', 'activity', 'settings'].map((path, idx) => (
                  <li className={styles.item} key={idx}>
                    <Link
                      className={`${styles.link} ${pathname === `/${path}` && styles.active}`}
                      to={`/${path}`}
                      onClick={() => closeModal()}
                    >
                      {capitalize(path)}
                    </Link>
                  </li>
                ))}
                <li className={styles.item}>
                  <ThemeToggle className={styles['theme-toggle']} />
                  <button
                    className={`${styles.settings}  ${isSettingsOpen && styles.active}`}
                    onClick={toggleSettings}
                    title='Settings'
                  >
                    <IoSettingsSharp />
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          <button className={styles.hamburger} onClick={toggleBurgerMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className={styles.backdrop}></div>
      </header>
    )
  }
)
