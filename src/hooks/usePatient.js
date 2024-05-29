import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { generateUniqueCode } from '../utils/methods'
import moment from 'moment'

const fhirEndpoint = '/hapi/fhir'

export default function usePatient() {
  const [patient, setPatient] = useState(null)
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
                code: 'identification_type',
                display: data.identificationType,
                value: data.identificationNumber,
              },
            ],
            text: data.identificationNumber,
          },
          system: 'identification_type',
          value: data.identificationNumber,
        },
        {
          type: {
            coding: [
              {
                system: 'estimated-age',
                code: 'estimated_age',
                display: 'Estimated Age',
              },
            ],
            text: data.estimatedAge ? 'false' : 'true',
          },
          system: 'estimated-age',
          value: data.estimatedAge ? 'false' : 'true',
        },
        {
          type: {
            coding: [
              {
                system: 'system-creation',
                code: 'system_creation',
                display: 'System Creation',
              },
            ],
            text: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
          system: 'system-creation',
          value: moment().format('YYYY-MM-DD HH:mm:ss'),
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
        ...data.caregivers.map((caregiver) => ({
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/administrative-identifier',
                code: 'CAREGIVER_ID',
                display: 'CAREGIVER_ID',
                value: 'CAREGIVER_ID',
              },
            ],
            text: caregiver.caregiverID,
          },
          system: 'identification',
          value: caregiver.caregiverID,
        })),
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
          value: data.phoneNumber ? `${data.phoneCode}${data.phoneNumber}` : '',
        },
      ],
      gender: data.gender,
      birthDate: data.dateOfBirth,
      multipleBirthBoolean: data.estimatedAge === false,
      address: [
        {
          use: 'home',
          line: [
            data.countyName,
            data.subCounty,
            data.ward,
            data.townCenter,
            data.estateOrHouseNo,
          ]?.filter(Boolean),
          type: 'both',
          district: data.county,
          subdistrict: data.subCounty,
          township: data.ward,
          city: data.townCenter,
          text: [
            data.estateOrHouseNo,
            data.townCenter,
            data.ward,
            data.subCounty,
            data.county,
          ]
            ?.filter(Boolean)
            .join(', '),
        },
      ],
      contact: data.caregivers.map((caregiver) => {
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
              text: caregiver.caregiverType,
            },
          ],
          name: {
            text: caregiver.caregiverName,
            given: caregiver.caregiverName.split(' '),
            family: caregiver.caregiverName.split(' ')[1],
          },
          telecom: [
            {
              system: 'phone',
              value: caregiver.phoneNumber
                ? `${caregiver.phoneCode}${caregiver.phoneNumber}`
                : '',
            },
          ],
        }
      }),
    }

    if (data.clientID) {
      patientResource.id = data.clientID

      return await put(
        `${fhirEndpoint}/Patient/${data.clientID}`,
        patientResource
      )
    }

    return await post(`${fhirEndpoint}/Patient`, patientResource)
  }

  const getPatient = async (patientId) => {
    try {
      const response = await get(`${fhirEndpoint}/Patient/${patientId}`)
      setPatient(response)
      return response
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

  const searchPatients = async (query) => {
    try {
      const response = await get(`${fhirEndpoint}/Patient?${query}`)
      return response
    } catch (error) {
      return error
    }
  }

  return {
    createPatient,
    getPatient,
    savePatient,
    updatePatient,
    searchPatients,
    patient,
  }
}
