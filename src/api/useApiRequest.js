import axios from 'axios'
import { message } from 'antd'

const server = axios.create({
  baseURL: 'https://chanjoke.intellisoftkenya.com/hapi/fhir',
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }
})

server.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      message.error(error.response.data.message)
    } else {
      message.error('Network Error')
    }
    return Promise.reject(error)
  }
)

export const useApiRequest = () => {
  // abort controller
  const abortController = new AbortController()

  const get = async (url) => {
    try {
      const response = await server.get(url, { signal: abortController.signal })
      return response.data
    } catch (error) {
      console.log('Error', error)
    }
  }

  const post = async (url, data) => {
    try {
      const response = await server.post(url, data, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      console.log('Error', error)
    }
  }

  const put = async (url, data) => {
    try {
      const response = await server.put(url, data, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      console.log('Error', error)
    }
  }

  const remove = async (url) => {
    try {
      const response = await server.delete(url, {
        signal: abortController.signal,
      })
      return response.data
    } catch (error) {
      console.log('Error', error)
    }
  }

  return { get, post, put, remove }
}
