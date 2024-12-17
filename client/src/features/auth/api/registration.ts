import axios from 'axios'

interface RegistrationData {
  email_entered: boolean
  otp_verified: boolean
  password_is_set: boolean
}

const instance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_BASE}/registration`
})

const registration = (email: string) => instance.post('', { email })

const resendRegistrationOtp = () => instance.post('/resend_otp')

const verifyEmail = (otp: string) => instance.post('/verify_email', { otp })

const setRegistrationPassword = (password: string) => instance.post('/set_password', { password })

const completeRegistration = (password: string) => instance.post('/complete', { password })

const fetchRegistrationData = () => instance.get<Record<string, RegistrationData>>('/data')

export {
  completeRegistration,
  fetchRegistrationData,
  registration,
  resendRegistrationOtp,
  setRegistrationPassword,
  verifyEmail
}
