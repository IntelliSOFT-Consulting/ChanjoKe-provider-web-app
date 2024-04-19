import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'

const fhirApi = '/hapi/fhir'
export default function useObservations() {
  const { get, post, put } = useApiRequest()
  const [observations, setObservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createObservation = async (values, patient, encounter) => {
    const { weightMetric, currentWeight } = values

    const observation = {
      resourceType: 'Observation',
      status: 'final',
      category: [
        {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
          text: 'Vital Signs',
        },
      ],
      encounter: {
        reference: `Encounter/${encounter}`,
      },
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: `Patient/${patient}`,
      },
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: {
        value: currentWeight,
        unit: weightMetric,
        system: 'http://unitsofmeasure.org',
        code: weightMetric,
      },
    }

    if (values.clientID) {
      const firstObservation = await getFirstObservation(values.clientID)
      if (firstObservation) {
        observation.encounter = {
          reference: `Encounter/${firstObservation.encounter.reference.split('/')[1]}`,
        }

        observation.id = firstObservation.id
      }

      return await put(`${fhirApi}/Observation/${observation.id}`, observation)
    }

    return await post(`${fhirApi}/Observation`, observation)
  }

  const getObservations = async (patientId) => {
    setLoading(true)
    try {
      const response = await get(
        `${fhirApi}/Observation?patient=Patient/${patientId}`
      )
      setObservations(response.entry)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  const getLatestObservation = async (patientId) => {
    const today = new Date().toISOString().split('T')[0]
    const response = await get(
      `${fhirApi}/Observation?patient=Patient/${patientId}&_sort=-_lastUpdated&_lastUpdated=${today}`
    )
    return response.entry?.[0]
  }

  const getFirstObservation = async (patientId) => {
    const response = await get(
      `${fhirApi}/Observation?patient=Patient/${patientId}&_sort=_lastUpdated`
    )
    return response.entry?.[0]?.resource
  }

  return {
    createObservation,
    observations,
    loading,
    error,
    getObservations,
    getLatestObservation,
    getFirstObservation,
  }
}
