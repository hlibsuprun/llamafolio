import { FC, memo } from 'react'

import { ThemeProvider } from '@features/theme'

import { Router } from './router'

export const App: FC = memo(() => {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
})
