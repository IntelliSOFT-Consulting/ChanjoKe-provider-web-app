import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import { useParams } from 'react-router-dom'

const FHIR_ENDPOINT = '/chanjo-hapi/fhir/AdverseEvent'

const createAefiPayload = (values, currentPatient, user, selectedVaccines) => ({
  resourceType: 'AdverseEvent',
  identifier: [
    {
      system: 'https://www.hl7.org/fhir/adverseevent-definitions.html',
      value: values.aefiReportType,
    },
  ],
  subject: {
    reference: `Patient/${currentPatient?.id}`,
  },
  recorder: {
    reference: `Practitioner/${user?.fhirPractitionerId}`,
  },
  date: new Date().toISOString(),
  event: {
    coding: [
      {
        code: values.aefiType,
        display: values.aefiType,
        system: 'http://terminology.hl7.org/CodeSystem/adverse-event-type',
      },
    ],
    text: values.aefiDetails,
  },
  category: [
    {
      coding: [
        {
          code: 'medication-mishap',
          display: 'Medication Mishap',
          system:
            'http://terminology.hl7.org/CodeSystem/adverse-event-category',
        },
      ],
    },
  ],
  detected: new Date(values.eventOnset).toISOString(),
  recordedDate: new Date().toISOString(),
  suspectEntity: [
    ...(selectedVaccines?.map((vaccine) => ({
      instance: {
        reference: `Immunization/${vaccine.id}`,
        display: `${vaccine.vaccine} (${vaccine.batchNumber})`,
      },
    })) || []),
    {
      casuality: [
        {
          id: values.aefiReportType,
        },
      ],
    },
  ],
  location: {
    reference: user?.orgUnit?.code,
    display: user?.orgUnit?.name,
  },
  extension: createExtensions(values),
})

const createExtensions = (values) => [
  {
    url: 'http://example.org/StructureDefinition/types-of-aefi',
    valueCode: values.aefiReportType,
  },
  {
    url: 'http://example.org/StructureDefinition/past-medical-history',
    valueString: values.pastMedicalHistory,
  },
]

export default function useAefi() {
  const [aefis, setAefis] = useState([])
  const [loading, setLoading] = useState(false)

  const { post, get } = useApiRequest()

  const { currentPatient } = useSelector((state) => state.currentPatient)
  const { user } = useSelector((state) => state.userInfo)
  const { selectedVaccines } = useSelector((state) => state.vaccineSchedules)

  const { clientID } = useParams()

  const submitAefi = async (values) => {
    const payload = createAefiPayload(
      values,
      currentPatient,
      user,
      selectedVaccines
    )
    await post(FHIR_ENDPOINT, payload)
  }

  const getAefis = async (patientId = null, params = '') => {
    setLoading(true)
    try {
      const queryParams = params ? `?${params}` : ''
      const data = await get(
        `${FHIR_ENDPOINT}?subject=Patient/${
          patientId || currentPatient?.id || clientID
        }${queryParams}`
      )
      setAefis(data.entry)
    } catch (error) {
      message.error(error.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  const getVaccineAefis = async (patient, vaccineId, params = '') => {
    const queryParams = params ? `&${params}` : ''
    const patientAefis = await get(
      `${FHIR_ENDPOINT}?subject=Patient/${patient}${queryParams}`
    )

    return patientAefis?.entry?.filter((aefi) => {
      const suspectEntityIds = aefi.resource.suspectEntity?.map(
        (entity) => entity.instance.reference
      )
      return suspectEntityIds?.includes(`Immunization/${vaccineId}`)
    })
  }

  const isVaccineInAefi = (vaccineIds) => {
    return aefis?.some((aefi) =>
      aefi.resource.suspectEntity?.some((entity) =>
        vaccineIds?.some(
          (vaccineId) =>
            entity.instance.reference === `Immunization/${vaccineId}`
        )
      )
    )
  }

  return {
    submitAefi,
    getAefis,
    aefis,
    loading,
    isVaccineInAefi,
    getVaccineAefis,
  }
}
