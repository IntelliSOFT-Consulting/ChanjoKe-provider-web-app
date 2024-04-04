import { useState, useEffect } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { debounce, getOffset } from '../utils/methods'

const fhirRoute = '/hapi/fhir/Practitioner'
export const usePractitioner = ({ pageSize = 12 }) => {
  const [practitioners, setPractitioners] = useState([])
  const [total, setTotal] = useState(0)
  const [archivedPractitioners, setArchivedPractitioners] = useState([])
  const [archivedTotal, setArchivedTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const { get, post } = useApiRequest()

  const fetchPractitioners = async (name = '', status = 'active', page = 0) => {
    setLoading(true)
    const query = `${name ? `name=${name}` : ''}${status ? `&status=${status}` : ''}`
    const offset = getOffset(page, pageSize)
    const url = `${fhirRoute}?${query}&_count=12&_offset=${offset}&_total=accurate`
    const response = await get(url)
    setLoading(false)
    if (status === 'active') {
      setPractitioners(response?.entry || [])
      setTotal(response.total)
    } else {
      setArchivedPractitioners(response.entry || [])
      setArchivedTotal(response.total)
    }
    return response
  }

  const handleSearch = debounce(async (name) => {
    const response = await fetchPractitioners(name)
    setTotal(response.total)
  }, 500)

  const handlePageChange = async (page) => {
    await fetchPractitioners('', 'active', page)
  }

  const handleArchivePageChange = async (page) => {
    await fetchPractitioners('', 'inactive', page)
  }

  const handleCreatePractitioner = async (values) => {
    /* 
    create Pricatitioner fhir resource from values.
    The values from antd form looks like this:
    {
    "firstName": "Joel",
    "lastName": "Okoth",
    "username": "jokoth",
    "phoneNumber": "0787264734",
    "email": "jokoth@gmail.com",
    "county": "Mombasa",
    "subCounty": "MSAMBWENI",
    "level": "Level 2",
    "roleGroup": "Doctor"
}
     */

    const practitioner = {
      resourceType: 'Practitioner',
      name: [
        {
          use: 'official',
          family: values.lastName,
          given: [values.firstName],
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: values.phoneNumber,
        },
        {
          system: 'email',
          value: values.email,
        },
      ],
      address: [
        {
          use: 'home',
          line: [''],
          city: values.subCounty,
          district: values.county,
          state: values.level,
          country: 'Kenya',
        },
      ],
      extension: [
        {
          url: 'http://example.org/fhir/StructureDefinition/role-group',
          valueString: values.roleGroup,
        },
      ],
    }
    const response = await post(fhirRoute, practitioner)
    return response
  }

  const handleUpdatePractitioner = async (id, values) => {
    // update Practitioner fhir resource
  }

  const handleArchivePractitioner = async (id) => {
    // archive Practitioner fhir resource
  }

  const handleActivatePractitioner = async (id) => {
    // activate Practitioner fhir resource
  }

  return {
    practitioners,
    total,
    archivedPractitioners,
    archivedTotal,
    loading,
    handleSearch,
    handlePageChange,
    handleArchivePageChange,
    handleCreatePractitioner,
    handleUpdatePractitioner,
    handleArchivePractitioner,
    handleActivatePractitioner,
  }
}
