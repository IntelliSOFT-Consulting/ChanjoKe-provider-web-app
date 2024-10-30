import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const endpoint = '/chanjo-hapi/fhir/AuditEvent'

export const useAudit = () => {
  const [audits, setAudits] = useState(null)
  const [audit, setAudit] = useState(null)
  const { post, get, put } = useApiRequest()
  const { user } = useSelector((state) => state.userInfo)

  const createTemplate = (action, patient = null, payload = null) => {
    return {
      resourceType: 'AuditEvent',
      recorded: new Date().toISOString(),
      agent: {
        type: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                code: 'Performer',
              },
            ],
          },
        ],
        who: {
          reference: `Practitioner/${user.fhirPractitionerId}`,
          display: `${user.firstName} ${user.lastName}`,
        },
        location: {
          reference: `Location/${user.orgUnit?.id}`,
          display: user.orgUnit?.name,
        },
      },
    }
  }

  const loginAudit = (user) => {
    return {
      resourceType: 'AuditEvent',
    }
  }

  const createAudit = async (auditData) => {
    const response = await post(endpoint, auditData)
    return response
  }

  const getAudits = async (params) => {
    const response = await get(endpoint, {
      params,
    })
    const data = response?.entry?.map((entry) => entry.resource) || []
    setAudits(data)
    return data
  }

  const getAudit = async (id) => {
    const response = await get(`${endpoint}/${id}`)
    setAudit(response)
    return response
  }

  const updateAudit = async (data) => {
    await put(`${endpoint}/${data.id}`, data)
  }

  return { audits, audit, createAudit, getAudits, getAudit, updateAudit }
}
