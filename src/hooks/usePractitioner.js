import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { useSelector } from 'react-redux'
import { debounce, getOffset, passwordGenerator } from '../utils/methods'
import { useLocations } from './useLocation'
import { formatLocation } from '../utils/formatter'

const practitionerRoute = '/hapi/fhir/Practitioner'
const registerRoute = '/auth/provider/register'
const providerRoute = '/auth/provider'

export const usePractitioner = () => {
  const [practitioners, setPractitioners] = useState([])
  const [total, setTotal] = useState(0)
  const [archivedPractitioners, setArchivedPractitioners] = useState([])
  const [archivedTotal, setArchivedTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => state.userInfo)

  const { fetchLocations } = useLocations()

  const { get, post, put } = useApiRequest()

  const fetchPractitioners = async (name = '', isActive = true, page = 0) => {
    setLoading(true)

    const currentLocation = user?.orgUnit?.code
    const level = user?.orgUnit?.level
    const offset = getOffset(page)
    const query = `${name ? `name=${name}` : ''}&active=${isActive}`
    let url = `${practitionerRoute}?${query}&_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
    let response

    switch (level) {
      case 'county':
        const subCounty = formatLocation(user?.subCounty)
        url = `${url}&_tag=${subCounty}`
        response = await get(url)

        break
      case 'subCounty':
        const wards = await fetchLocations(currentLocation, 'WARD')
        const wardIds = wards?.map((ward) => ward.key).join(',')
        const facilities = await fetchLocations(wardIds, 'FACILITY')
        const facilityIds = facilities
          ?.map((facility) => formatLocation(facility.key))
          .join(',')
        url = `${url}&_tag=${facilityIds}`
        response = await get(url)

        break
      case 'facility':
        url = `${url}&_tag=${currentLocation}`
        response = await get(url)
        break
      default:
        response = await get(url)
        break
    }

    setLoading(false)
    if (isActive) {
      setPractitioners(response?.entry || [])
      setTotal(response.total)
    } else {
      setArchivedPractitioners(response.entry || [])
      setArchivedTotal(response.total)
    }
    return response
  }

  const handleSearch = debounce(async (name, isActive = true) => {
    const response = await fetchPractitioners(name, isActive, 1)
    setTotal(response.total)
  }, 500)

  const handleCreatePractitioner = async (values) => {
    const response = await post(`${registerRoute}`, {
      idNumber: values.idNumber,
      password: passwordGenerator(8),
      email: values.email,
      role: values.roleGroup,
      firstName: values.firstName,
      lastName: values.lastName,
      facility:
        values.facility ||
        values.ward ||
        values.subCounty ||
        values.county ||
        '0',
      phone: values.phoneNumber,
    })

    return response
  }

  const getPractitioner = async (id) => {
    const response = await get(`${providerRoute}/user/${id}`)
    return response?.user
  }

  const handleUpdatePractitioner = async (values) => {
    const response = await put(`${providerRoute}/user/${values.idNumber}`, {
      ...values,
      idNumber: values.idNumber,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phoneNumber,
      role: values.roleGroup,
      facilityCode: values.facility,
    })

    return response
  }

  const handleArchivePractitioner = async (id, active = false) => {
    const practitionerData = await getPractitioner(id)
    const fhirId = practitionerData.fhirPractitionerId

    const fhirData = await get(`${practitionerRoute}/${fhirId}`)
    fhirData.active = active

    await put(`${practitionerRoute}/${fhirId}`, fhirData)

    return true
  }

  const searchPractitioner = async (params) => {
    const response = await get(practitionerRoute, { params })
    return response?.entry?.map((entry) => entry.resource)
  }

  return {
    practitioners,
    fetchPractitioners,
    total,
    getPractitioner,
    archivedPractitioners,
    archivedTotal,
    loading,
    handleSearch,
    handleCreatePractitioner,
    handleUpdatePractitioner,
    handleArchivePractitioner,
    searchPractitioner,
  }
}
