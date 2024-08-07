import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'

const path = '/reports/api'

export const useReports = () => {
  const [defaulters, setDefaulters] = useState(null)
  const [moh710, setMoh710] = useState(null)

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

  return {
    defaulters,
    moh710,
    getDefaulterList,
    getMoh710,
  }
}
