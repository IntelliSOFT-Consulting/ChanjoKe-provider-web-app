import { useApiRequest } from '../api/useApiRequest'
import { generateUniqueCode } from '../utils/methods'

const fhirEndpoint = '/hapi/fhir'

export default function usePatient() {
  const { get, post, put } = useApiRequest()

  const createPatient = async (data) => {
    const givenNames = [data.firstName, data.middleName].filter((name) => name)
    let patientResource = {
      resourceType: 'Patient',
      identifier: [
        {
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/administrative-identifier',
                code: data.identificationType?.toLowerCase(),
                value: data.identificationType,
              },
            ],
            text: data.identificationType,
          },
          system: 'identification',
          value: data.identificationNumber,
        },
        {
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/administrative-identifier',
                code: 'system_generated',
                display: 'SYSTEM_GENERATED',
              },
            ],
            text: 'SYSTEM_GENERATED',
          },
          system: 'identification',
          value: generateUniqueCode(8),
        },
      ],
      active: true,
      name: [
        {
          use: 'official',
          given: givenNames,
          family: data.lastName,
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: `${data.phoneCode}${data.phoneNumber}`,
        },
      ],
      gender: data.gender,
      birthDate: data.dateOfBirth,
      address: [
        {
          use: 'home',
          line: [data.estateOrHouseNo],
          type: 'both',
          district: data.county,
          subdistrict: data.subCounty,
          township: data.ward,
          city: data.townCenter,
          text: `${data.estateOrHouseNo}, ${data.townCenter}, ${data.ward}, ${data.subCounty}, ${data.county}`,
        },
      ],
      contact: data.caregiver.map((caregiver) => {
        return {
          relationship: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                  code: caregiver.caregiverType,
                  display: caregiver.caregiverType,
                },
              ],
            },
          ],
          name: {
            text: caregiver.caregiverName,
          },
          telecom: [
            {
              system: 'phone',
              value: `${caregiver.phoneCode}${caregiver.phoneNumber}`,
            },
          ],
        }
      }),
    }

    return await post(`${fhirEndpoint}/Patient`, patientResource)
  }

  const getPatient = async (patientId) => {
    try {
      return await get(`${fhirEndpoint}/Patient/${patientId}`)
    } catch (error) {
      return error
    }
  }

  const savePatient = async (patientData) => {
    try {
      const response = await post(`${fhirEndpoint}/Patient`, patientData)
      return response
    } catch (error) {
      return error
    }
  }

  const updatePatient = async (patientId, patientData) => {
    try {
      const response = await put(
        `${fhirEndpoint}/Patient/${patientId}`,
        patientData
      )
      return response
    } catch (error) {
      return error
    }
  }

  return { createPatient, getPatient, savePatient, updatePatient }
}
