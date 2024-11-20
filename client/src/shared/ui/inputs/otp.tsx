import { forwardRef, InputHTMLAttributes, useEffect, useState } from 'react'

import { lowerDasher } from '@shared/utils'

import { InputError } from './error'
import { InputLabel } from './label'
import styles from './otp.module.css'

interface InputOtpProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  resend?: true
  error: string | undefined
}

export const InputOtp = forwardRef<HTMLInputElement, InputOtpProps>(({ label, resend, error, ...rest }, ref) => {
  const [timerValue, setTimerValue] = useState<number>(30)
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isResendDisabled && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue((prev) => prev - 1)
      }, 1000)
    } else if (timerValue === 0) {
      setIsResendDisabled(false)
    }

    return () => clearInterval(interval)
  }, [isResendDisabled, timerValue])

  const handleResendClick = () => {
    setIsResendDisabled(true)
    setTimerValue(30)
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    input.value = input.value.replace(/\D/g, '').slice(0, 6)
  }

  return (
    <div className={styles.wrapper}>
      <InputLabel text={label} />

      <div className={styles.container}>
        <input
          className={`${styles.input} ${error && styles.error}`}
          type='text'
          maxLength={6}
          onInput={handleInput}
          name={lowerDasher(label)}
          ref={ref}
          {...rest}
        />

        {resend && (
          <div className={styles.resend}>
            {isResendDisabled ? (
              <span className={styles.timer}>{timerValue}</span>
            ) : (
              <button className={styles.button} type='button' onClick={handleResendClick}>
                Resend Code
              </button>
            )}
          </div>
        )}
      </div>

      {error && <InputError message={error} />}
    </div>
  )
})
