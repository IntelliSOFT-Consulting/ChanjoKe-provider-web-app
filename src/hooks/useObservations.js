import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'

const fhirApi = '/hapi/fhir'
export default function useObservations() {
  const { get } = useApiRequest()
  const [observations, setObservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const getObservations = async (patientId) => {
    setLoading(true)
    try {
      const response = await get(`${fhirApi}/Observation?patient=Patient/${patientId}`)
      setObservations(response.entry)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  const getLatestObservation = async (patientId) => {
    const today = new Date().toISOString().split('T')[0]
    const response = await get(`${fhirApi}/Observation?patient=Patient/${patientId}&_sort=-_lastUpdated&_lastUpdated=${today}`)
    return response.entry[0];
  }

  return { observations, loading, error, getObservations, getLatestObservation }
}

