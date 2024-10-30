import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getRoleFilters } from '../utils/methods'

const path = '/reports/api'

export const useReports = () => {
  const [defaulters, setDefaulters] = useState(null)
  const [moh710, setMoh710] = useState(null)
  const [moh525, setMoh525] = useState(null)
  const [monitoring, setMonitoring] = useState(null)

  const { user } = useSelector((state) => state.userInfo)

  const { get } = useApiRequest()

  const getDefaulterList = async (facility, date) => {
    const response = await get(
      `${path}/defaulters?facility=${facility}&date=${date}`
    )
    setDefaulters(response)
    return response
  }

  const getMoh710 = async (filters) => {
    const queryString = Object.entries(filters)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const response = await get(`${path}/moh_710_report?${queryString}`)
    setMoh710(response?.data)
    return response?.data
  }

  const getMoh525 = async (filters) => {
    const queryString = Object.entries(filters)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const response = await get(`${path}/moh_525_report?${queryString}`)
    setMoh525(response)
    return response
  }

  const getMonitoring = async (filters = {}) => {
    let filter = getRoleFilters(user)
    const queryString = Object.entries({ ...filter, ...filters })
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const response = await get(`${path}/monitoring_report?${queryString}`)
    setMonitoring(response?.data)
    return response?.data
  }

  return {
    defaulters,
    moh710,
    getDefaulterList,
    getMoh710,
    getMoh525,
    moh525,
    getMonitoring,
    monitoring,
  }
}
