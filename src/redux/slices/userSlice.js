import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { message } from 'antd'
import { formatLocation } from '../../utils/formatter'

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
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      const endpoint = originalRequest.url
      if (endpoint.includes('login')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const refreshToken = token?.refresh_token
      const response = await server.post('/auth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      localStorage.setItem('authorization', JSON.stringify(response.data))
      server.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.access_token}`
      return server(originalRequest)
    }
    return Promise.reject(error)
  }
)

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  loading: false,
  error: null,
}

export const login = createAsyncThunk('user/login', async (values) => {
  const { data: auth } = await server.post('/auth/provider/login', values)
  if (auth) {
    const response = await server.get(`/auth/provider/me`, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    })

    const user = {
      ...response?.data?.user,
      ...auth,
      location: values.location,
      orgUnit: getLowestOrgUnit(response?.data?.user),
    }

    JSON.stringify(localStorage.setItem('user', JSON.stringify(user)))
    return user
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        message.error(action.error.message)
      })
  },
})

export const { logout } = userSlice.actions

export default userSlice.reducer
