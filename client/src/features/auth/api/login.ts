import axios from 'axios'

interface LoginData {
  email_entered: boolean
  login_verified: boolean
  is_email_2fa_enabled: boolean
  is_totp_2fa_enabled: boolean
}

const instance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_BASE}/login`
})

const login = (email: string) => instance.post('', { email })

const resendLoginOtp = () => instance.post('/resend_otp')

const verifyLogin = (otp?: string, totp?: string) => instance.post('/verify', { otp, totp })

const verifyPassword = (password: string) => instance.post('/password', { password })

const fetchLoginData = () => instance.get<Record<string, LoginData>>('/data')

export { fetchLoginData, login, resendLoginOtp, verifyLogin, verifyPassword }
