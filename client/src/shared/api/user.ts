import axios from 'axios'

const instance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_BASE
})

const isAuthenticated = () => instance.get(`${import.meta.env.VITE_API_BASE}/user/check_auth`)

export { isAuthenticated }
