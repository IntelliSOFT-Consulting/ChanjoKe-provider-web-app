import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'

const endpoint = '/hapi/fhir/AuditEvent'

export const useAudit = () => {
  const [audits, setAudits] = useState(null)
  const [audit, setAudit] = useState(null)
  const { post, get, put } = useApiRequest()

  const createAudit = async (auditData) => {
    const response = await post(endpoint, auditData)
    return response
  }

  const getAudits = async (params) => {
    const response = await get(endpoint, {
      params,
    })
    const data = response?.entry?.map((entry) => entry.resource)
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
