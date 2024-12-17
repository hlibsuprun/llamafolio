import axios from 'axios'

interface PasswordResetData {
  password_is_set: boolean
}

const instance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_BASE}/password_reset`
})

const passwordReset = () => instance.post('')

const setPasswordResetPassword = (password: string, token: string) =>
  instance.post('/set_password', { password, token })

const completePasswordReset = (password: string, token: string) => instance.post('/complete', { password, token })

const fetchPasswordResetData = (token: string) => instance.post<Record<string, PasswordResetData>>('/data', { token })

export { completePasswordReset, fetchPasswordResetData, passwordReset, setPasswordResetPassword }
