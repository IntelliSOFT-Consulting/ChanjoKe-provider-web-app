import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { message } from 'antd'
import { formatLocation } from '../../utils/formatter'

const BASE_URL = 'https://chanjoke.intellisoftkenya.com'

const createAxiosInstance = () => {
  const token = JSON.parse(localStorage.getItem('user') || '{}')
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Authorization: token?.access_token ? `Bearer ${token.access_token}` : '',
    },
  })
}

const server = createAxiosInstance()

const getLowestOrgUnit = (user) => {
  const orgUnits = [
    {
      name: user.countryName,
      level: 'country',
      code: formatLocation(user.country),
    },
    {
      name: user.countyName,
      level: 'county',
      code: formatLocation(user.county),
    },
    {
      name: user.subCountyName,
      level: 'subCounty',
      code: formatLocation(user.subCounty),
    },
    { name: user.wardName, level: 'ward', code: formatLocation(user.ward) },
    {
      name: user.facilityName,
      level: 'facility',
      code: formatLocation(user.facility),
    },
  ]

  return (
    orgUnits.reverse().find((unit) => unit.name && unit.name.trim() !== '') ||
    null
  )
}

server.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('login')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      try {
        const token = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await server.post('/auth/token', {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
        })
        localStorage.setItem('user', JSON.stringify(response.data))
        server.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.access_token}`
        return server(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'user/login',
  async (values, { rejectWithValue }) => {
    try {
      const { data: auth } = await server.post('/auth/provider/login', values)
      const { data: userData } = await server.get('/auth/provider/me', {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      })

      const user = {
        ...userData.user,
        ...auth,
        location: values.location,
        orgUnit: getLowestOrgUnit(userData.user),
      }

      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await server.post('/auth/provider/refresh_token', {
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      })

      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to refresh token'
      )
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        message.error(action.payload)
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const newToken = action.payload
        state.user = { ...state.user, ...newToken }
        localStorage.setItem('user', JSON.stringify(newToken))
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null
        localStorage.removeItem('user')
      })
  },
})

export const { logout } = userSlice.actions

export default userSlice.reducer
