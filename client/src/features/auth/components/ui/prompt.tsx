import { FC, memo } from 'react'
import { Link } from 'react-router-dom'

import styles from './prompt.module.css'

interface PromptProps {
  question?: string
  answer: string
  link: string
}

export const Prompt: FC<PromptProps> = memo(({ question, answer, link }) => {
  return (
    <div className={styles.wrapper}>
      {question}{' '}
      <Link className={styles.link} to={link}>
        {answer}
      </Link>
    </div>
  )
})
