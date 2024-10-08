import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { generateUniqueCode } from '../utils/methods'
import moment from 'moment'
import { useSelector } from 'react-redux'

const fhirEndpoint = '/chanjo-hapi/fhir'

export default function usePatient() {
  const [patient, setPatient] = useState(null)
  const { get, post, put } = useApiRequest()
  const { user } = useSelector((state) => state.userInfo)

  const createPatient = async (data) => {
    const givenNames = [data.firstName, data.middleName].filter((name) => name)
    let patientResource = {
      resourceType: 'Patient',
      meta: {
        tag: [
          {
            system:
              'http://terminology.hl7.org/CodeSystem/location-physical-type',
            code: user?.orgUnit?.code,
            display: user?.orgUnit?.name,
          },
        ],
      },
      identifier: [
        {
          type: {
            coding: [
              {
                system: data.identificationType?.replace(/_/g, ' '),
                code: 'identification_type',
                display: data.identificationType,
                value: data.identificationNumber,
              },
            ],
            text: data.identificationNumber,
          },
          system: 'http://hl7.org/fhir/administrative-identifier',
          value: data.identificationNumber,
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
            data.county,
            data.subCounty,
            data.ward,
            data.communityUnit || 'N/A',
            data.townCenter || 'N/A',
            data.estateOrHouseNo || 'N/A',
          ],
          type: 'both',
          city: data.countyName,
          district: data.subCountyName,
          state: data.wardName,
          text: [data.ward, data.subCounty, data.county]
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
            text: caregiver?.caregiverName,
            given: caregiver?.caregiverName?.split(' '),
            family: caregiver?.caregiverName?.split(' ')[1],
          },
          telecom: [
            {
              system: 'phone',
              value: caregiver.phoneNumber || '',
            },
          ],
          extension: [
            {
              url: 'caregiver_id_type',
              valueString: caregiver.caregiverIdentificationType,
            },
            {
              url: 'caregiver_id_number',
              valueString: caregiver.caregiverID,
            },
            ...(caregiver.kins?.map((kin) => ({
              url: 'next-of-kin',
              extension: [
                {
                  url: 'name',
                  valueString: kin.kinName,
                },
                {
                  url: 'phone',
                  valueString: kin.kinPhoneNumber,
                },
                {
                  url: 'relationship',
                  valueString: kin.kinRelationship,
                },
                {
                  url: 'created',
                  valueDateTime: new Date().toISOString(),
                },
              ],
            })) || []),
          ],
        }
      }),
      extension: [
        {
          url: 'estimated_age',
          valueBoolean: data.estimatedAge,
        },
        {
          url: 'vaccination_category',
          valueString: data.vaccineType,
        },
      ],
    }

    if (data.clientID) {
      patientResource.id = data.clientID
      const patient = await getPatient(data.clientID)

      patientResource.identifier = [
        ...patient.identifier?.filter((id) => {
          const type = id.type.coding[0].display
          return !patientResource.identifier.some(
            (identifier) => identifier.type.coding[0].display === type
          )
        }),
        ...patientResource.identifier,
      ]

      return await put(
        `${fhirEndpoint}/Patient/${data.clientID}`,
        patientResource
      )
    }

    patientResource.identifier = [
      ...patientResource.identifier,
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
    ]

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

  const checkPatientExists = async (identifier, type = null) => {
    try {
      const response = await get(
        `${fhirEndpoint}/Patient?identifier=${identifier}`
      )

      const resources = response?.entry?.map((entry) => entry.resource)

      const patient = resources?.find((resource) =>
        resource.identifier.find((id) => id.type.coding[0].display === type)
      )

      return patient
    } catch (error) {
      return null
    }
  }

  return {
    createPatient,
    getPatient,
    savePatient,
    updatePatient,
    searchPatients,
    checkPatientExists,
    patient,
  }
}
