import store from '../redux/store'
import { refreshToken, logout } from '../redux/slices/userSlice'

export const getAccessToken = () => {
  const token = JSON.parse(localStorage.getItem('user') || '{}')
  return token.access_token
}

export const isTokenExpired = (token) => {
  if (!token) return true
  const expiry = JSON.parse(atob(token.split('.')[1])).exp
  return Math.floor(new Date().getTime() / 1000) >= expiry
}

export const refreshTokenIfNeeded = async () => {
  const token = getAccessToken()
  if (isTokenExpired(token)) {
    try {
      await store.dispatch(refreshToken()).unwrap()
    } catch (error) {
      store.dispatch(logout())
      throw new Error('Session expired. Please login again.')
    }
  }
}
