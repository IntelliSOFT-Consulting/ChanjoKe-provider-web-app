import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { getOffset } from '../utils/methods'

const path = '/chanjo-hapi/fhir/ServiceRequest'

const useReferral = () => {
  const [referrals, setReferrals] = useState([])
  const [referral, setReferral] = useState({})
  const [loading, setLoading] = useState(false)

  const { get } = useApiRequest()

  const getReferralsToFacility = async (facility, page = 0, date = null) => {
    setLoading(true)
    const facilityCode = facility?.replace(/Location\//g, '')
    const offset = getOffset(page)
    const dateFilter = date ? `&authored=${date}` : ''
    const response = await get(
      `${path}?performer=${facilityCode}&_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated${dateFilter}`
    )
    const data = response?.entry?.map((entry) => entry.resource) || []
    setReferrals({
      data,
      total: response?.total,
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

  const getPatientReferrals = async (patientId) => {
    setLoading(true)
    const response = await get(`${path}?subject=Patient/${patientId}`)
    const data = response?.entry?.map((entry) => entry.resource) || []
    setReferrals({
      data,
      total: response.total,
    })
    setLoading(false)
    return response
  }

  return {
    referrals,
    referral,
    loading,
    getReferralsToFacility,
    getPatientReferrals,
    getReferralById,
  }
}

export default useReferral
