import axios from 'axios'
import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
} from '../constants/userConstants'
import { message } from 'antd'

const token = localStorage.getItem('authorization')
  ? JSON.parse(localStorage.getItem('authorization')).token
  : null

const server = axios.create({
  baseURL: 'https://chanjoke.intellisoftkenya.com',
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token?.access_token}`,
  },
})

server.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      // find the request endpoint that caused the 401
      const endpoint = originalRequest.url
      if (endpoint.includes('login')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const refreshToken = token?.refresh_token
      const response = await axios.post(
        'https://chanjoke.intellisoftkenya.com/auth/token',
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }
      )
      localStorage.setItem('authorization', JSON.stringify(response.data))
      server.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access_token}`
      return server(originalRequest)
    }
    return Promise.reject(error)
  }
)

export const login = (values) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST })
  try {
    const { data: auth } = await server.post('/auth/provider/login', values)
    if (auth) {
      const response = await server.get(`/auth/provider/me`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      })

      const user = { ...response?.data?.user, ...auth, location: values.location }
      dispatch({
        type: GET_USER_SUCCESS,
        payload: user,
      })

      console.log({ user, response, auth })

      JSON.stringify(localStorage.setItem('practitioner', JSON.stringify(user)))
    }
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error.response.data })
    message.error(error.response?.data?.error)
  }
}

export const logout = () => async (dispatch) => {
  localStorage.removeItem('practitioner')
  dispatch({ type: LOGOUT, payload: {} })
}
