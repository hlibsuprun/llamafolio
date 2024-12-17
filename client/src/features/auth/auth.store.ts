import { create } from 'zustand'

interface RegistrationData {
  email_entered: boolean
  otp_verified: boolean
  password_is_set: boolean
}

interface LoginData {
  email_entered: boolean
  login_verified: boolean
  is_email_2fa_enabled: boolean
  is_totp_2fa_enabled: boolean
}

interface UserData {
  id: string
  email: string
  is_email_2fa_enabled: boolean
  is_totp_2fa_enabled: boolean
  totp_secret: string
  totp_qr_code: string
}

interface AuthState {
  registrationData: Record<string, RegistrationData> | null
  loginData: Record<string, LoginData> | null
  userData: Record<string, UserData> | null
  isAuthenticated: boolean

  setRegistrationData: (data: Record<string, RegistrationData> | null) => void
  setLoginData: (data: Record<string, LoginData> | null) => void
  setIsAuthenticated: (data: boolean) => void
  clearAuthData: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  registrationData: null,
  loginData: null,
  userData: null,
  isAuthenticated: false,

  setRegistrationData: (data) => set({ registrationData: data }),

  setLoginData: (data) => set({ loginData: data }),

  setIsAuthenticated: (data) => set({ isAuthenticated: data }),

  clearAuthData: () => set({ registrationData: null, loginData: null, isAuthenticated: false })
}))
