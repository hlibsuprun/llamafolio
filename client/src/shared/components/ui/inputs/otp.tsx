import { FormEvent, forwardRef, InputHTMLAttributes, MouseEvent, useEffect, useState } from 'react'

import { resendLoginOtp, resendRegistrationOtp } from '@features/auth/api'
import { lowerDasher } from '@shared/utils'
import { AxiosError } from 'axios'

import { InputError } from './error'
import { InputLabel } from './label'
import styles from './otp.module.css'

interface InputOtpProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  resend?: 'login' | 'registration'
  error: string | undefined
}

export const InputOtp = forwardRef<HTMLInputElement, InputOtpProps>(({ label, resend, error, ...rest }, ref) => {
  const [timerValue, setTimerValue] = useState<number>(60)
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true)

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

  const handleResendClick = async () => {
    try {
      if (resend === 'login') await resendLoginOtp()
      if (resend === 'registration') await resendRegistrationOtp()
      setIsResendDisabled(true)
      setTimerValue(60)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      }
    }
  }

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
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
              <button
                className={styles.button}
                type='button'
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  void handleResendClick()
                }}
              >
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
