import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'

const path = '/reports/api'

export const useReports = () => {
  const [defaulters, setDefaulters] = useState(null)
  const [moh710, setMoh710] = useState(null)
  const [moh525, setMoh525] = useState(null)
  const [monitoring, setMonitoring] = useState(null)

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
    setMoh710(response)
    return response
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
    const queryString = Object.entries(filters)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const response = await get(`${path}/monitoring_report?${queryString}`)
    setMonitoring(response)
    return response
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
