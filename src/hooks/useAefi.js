import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import { useParams } from 'react-router-dom'

export default function useAefi() {
  const [aefis, setAefis] = useState([])
  const [loading, setLoading] = useState(false)

  const { post, get } = useApiRequest()

  const currentPatient = useSelector((state) => state.currentPatient)
  const { user } = useSelector((state) => state.userInfo)
  const selectedVaccines = useSelector((state) => state.selectedVaccines)

  const { clientID } = useParams()

  const fhirEndpoint = '/hapi/fhir/AdverseEvent'

  const createPayload = (values) => {
    return {
      resourceType: 'AdverseEvent',
      subject: {
        reference: `Patient/${currentPatient?.id || clientID}`,
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
      mitigatingAction: {
        coding: values?.actionTaken
          ? values?.actionTaken?.map((action) => {
              return {
                code: action,
                display:
                  action === 'Treatment given'
                    ? values.treatmentDetails
                    : values.specimenDetails,
                system:
                  'http://terminology.hl7.org/CodeSystem/adverse-event-mitigating-action',
              }
            })
          : [],
      },
      outcome: {
        coding: [
          {
            code: 'outcome',
            display: values.aefiOutcome,
            system:
              'http://terminology.hl7.org/CodeSystem/adverse-event-outcome',
          },
        ],
      },
      suspectEntity: [
        ...(selectedVaccines?.map((vaccine) => {
          return {
            instance: {
              reference: `Immunization/${vaccine.id}`,
            },
          }
        }) || []),
        {
          casuality: [
            {
              id: values.aefiReportType,
            },
          ],
        },
      ],
      location: {
        reference: user?.facility,
      },
      extension: [
        {
          url: 'https://www.hl7.org/fhir/adverseevent-definitions.html#AdverseEvent.mitigatingAction',
          pastMedicalHistory: values.pastMedicalHistory,
        },
      ],
    }
  }

  const submitAefi = async (values) => {
    const payload = createPayload(values)
    await post(fhirEndpoint, payload)
  }

  const getAefis = async () => {
    setLoading(true)
    try {
      const data = await get(
        `/hapi/fhir/AdverseEvent?subject=Patient/${currentPatient?.id || clientID}`
      )
      setAefis(data.entry)
    } catch (error) {
      message.error(error.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  const isVaccineInAefi = (vaccineIds) => {
    return aefis?.some((aefi) => {
      return aefi.resource.suspectEntity?.some((entity) => {
        return vaccineIds?.some((vaccineId) => {
          return entity.instance.reference === `Immunization/${vaccineId}`
        })
      })
    })
  }

  return { submitAefi, getAefis, aefis, loading, isVaccineInAefi }
}
