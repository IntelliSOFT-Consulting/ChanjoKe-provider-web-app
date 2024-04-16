import { useApiRequest } from '../api/useApiRequest'

const fhirWndpoint = '/hapi/fhir'

export default function usePatient() {
  const { get, post, put } = useApiRequest()

  const getPatient = async (patientId) => {
    try {
      return await get(`${fhirWndpoint}/Patient/${patientId}`)
    } catch (error) {
      return error
    }
  }

  const savePatient = async (patientData) => {
    try {
      const response = await post(`${fhirWndpoint}/Patient`, patientData)
      return response
    } catch (error) {
      return error
    }
  }

  const updatePatient = async (patientId, patientData) => {
    try {
      const response = await put(`${fhirWndpoint}/Patient/${patientId}`, patientData)
      return response
    } catch (error) {
      return error
    }
  }

  return { getPatient, savePatient,updatePatient }
}
