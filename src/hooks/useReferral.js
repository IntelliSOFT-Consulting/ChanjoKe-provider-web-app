import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { getOffset } from '../utils/methods'

const path = '/hapi/fhir/ServiceRequest'

const useReferral = () => {
  const [referrals, setReferrals] = useState([])
  const [referral, setReferral] = useState({})
  const [loading, setLoading] = useState(false)

  const { get } = useApiRequest()

  const getReferralsToFacility = async (facility, page = 0) => {
    setLoading(true)
    const facilityCode = facility?.replace(/Location\//g, '')
    const offset = getOffset(page)
    const response = await get(
      `${path}?performer=${facilityCode}&_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
    )
    const data = response?.entry?.map((entry) => entry.resource) || []
    setReferrals({
      data,
      total: response.total,
    })
    setLoading(false)

    return data
  }

  const getReferralById = async (id) => {
    setLoading(true)
    const response = await get(`${path}/${id}`)
    setReferral(response)
    setLoading(false)
    return response
  }

  return {
    referrals,
    referral,
    loading,
    getReferralsToFacility,
    getReferralById,
  }
}

export default useReferral
