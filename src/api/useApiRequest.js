import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { refreshTokenIfNeeded, getAccessToken } from './tokenUtils'

const server = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
})

server.interceptors.request.use(
  async (config) => {
    await refreshTokenIfNeeded()
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

server.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      message.error(
        error.response.status === 401
          ? 'Unauthorized: Incorrect credentials'
          : error.response.data.error ||
              error?.response?.data?.issue?.[0]?.diagnostics
      )
    } else {
      message.error('Network Error')
    }
    return Promise.reject(error)
  }
)

export const useApiRequest = () => {
  const abortController = new AbortController()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.userInfo)

  server.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${user?.access_token}`

  const get = async (url, params = {}) => {
    try {
      const response = await server.get(
        url,
        { params: params?.params },
        { signal: abortController.signal }
      )
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/auth')
      }
    }
  }

  const post = async (url, data) => {
    try {
      const response = await server.post(url, data, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/auth')
      }
    }
  }

  const put = async (url, data) => {
    try {
      const response = await server.put(url, data, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/auth')
      }
    }
  }

  const remove = async (url) => {
    try {
      const response = await server.delete(url, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear()
        navigate('/auth')
      }
    }
  }

  return { get, post, put, remove }
}
