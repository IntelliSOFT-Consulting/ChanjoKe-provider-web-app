import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { useSelector } from 'react-redux'
import { debounce, getOffset, passwordGenerator } from '../utils/methods'

const roleRoute = '/hapi/fhir/PractitionerRole'
const practitionerRoute = '/hapi/fhir/Practitioner'
export const usePractitioner = ({ pageSize = 12 }) => {
  const [practitioners, setPractitioners] = useState([])
  const [total, setTotal] = useState(0)
  const [archivedPractitioners, setArchivedPractitioners] = useState([])
  const [archivedTotal, setArchivedTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => state.userInfo)

  const { get, post, put } = useApiRequest()

  const fetchPractitioners = async (name = '', isActive = true, page = 0) => {
    setLoading(true)
    const query = `${name ? `name=${name}` : ''}&active=${isActive}`
    const offset = getOffset(page)

    const url = `${practitionerRoute}?${query}&_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
    const response = await get(url)
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

  const handlePageChange = async (page) => {
    await fetchPractitioners('', 'active', page)
  }

  const handleArchivePageChange = async (page) => {
    await fetchPractitioners('', 'inactive', page)
  }

  const handleCreatePractitionerRole = async (values, practitioner) => {
    const practitionerRole = {
      resourceType: 'PractitionerRole',
      active: true,
      practitioner: {
        reference: `Practitioner/${practitioner.id}`,
      },
      code: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/practitioner-role',
              code: values.roleGroup,
            },
          ],
        },
      ],
      location: [
        {
          reference: values.facility
            ? `Location/${values.facility}`
            : user.facility,
        },
      ],
    }
    const response = await post(roleRoute, practitionerRole)
    return response
  }

  const handleCreatePractitioner = async (values) => {
    const practitioner = {
      resourceType: 'Practitioner',
      active: true,
      identifier: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          value: values.idNumber,
        },
      ],
      name: [
        {
          use: 'official',
          family: values.lastName,
          given: [values.firstName, values.middleName]?.filter(Boolean),
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
    }

    const response = await post(practitionerRoute, practitioner)

    if (response) {
      await handleCreatePractitionerRole(values, response)
      await post('/provider/register', {
        idNumber: values.idNumber,
        password: passwordGenerator(8),
        email: values.email,
        role: values.roleGroup,
        firstName: values.firstName,
        lastName: values.lastName,
        facility: values.facility,
        phone: values.phoneNumber,
      })
    }

    return response
  }

  const formatPractitioner = (response) => {
    const practitioner = response?.entry?.find(
      (entry) => entry.resource.resourceType === 'Practitioner'
    )
    const practitionerRole = response?.entry?.find(
      (entry) => entry.resource.resourceType === 'PractitionerRole'
    )

    const firstName = practitioner?.resource?.name[0]?.given?.join(' ')
    const lastName = practitioner?.resource?.name[0]?.family
    const email = practitioner?.resource?.telecom?.find(
      (telecom) => telecom.system === 'email'
    )?.value
    const phoneNumber = practitioner?.resource?.telecom?.find(
      (telecom) => telecom.system === 'phone'
    )?.value
    const idNumber = practitionerRole?.resource?.identifier?.[0]?.value
    const facility =
      practitionerRole?.resource?.location?.[0]?.reference.split('/')[1]
    const roleGroup = practitionerRole?.resource?.code?.[0]?.coding?.[0]?.code

    return {
      firstName,
      lastName,
      email,
      phoneNumber,
      idNumber,
      facility,
      roleGroup,
      practitionerRole: practitionerRole?.resource?.id,
      practitioner: practitioner?.resource?.id,
    }
  }

  const getPractitioner = async (id) => {
    const response = await get(
      `${roleRoute}?practitioner=${id}&_include=PractitionerRole:practitioner`
    )

    const formattedPractitioner = formatPractitioner(response)
    return {
      formatted: formattedPractitioner,
      raw: response?.entry?.map((entry) => entry.resource),
    }
  }

  const handleUpdatePractitioner = async (id, values) => {
    const practitioner = {
      resourceType: 'Practitioner',
      id: id,
      active: true,
      identifier: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          value: values.idNumber,
        },
      ],
      name: [
        {
          use: 'official',
          family: values.lastName,
          given: [values.firstName, values.middleName]?.filter(Boolean),
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
    }

    const response = await put(`${practitionerRoute}/${id}`, practitioner)
    if (response) {
      const practitionerRole = {
        resourceType: 'PractitionerRole',
        id: values.practitionerRole,
        active: true,
        code: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/practitioner-role',
                code: values.roleGroup,
              },
            ],
          },
        ],
        location: [
          {
            reference: values.facility
              ? `Location/${values.facility}`
              : user.facility,
          },
        ],
      }
      await put(`${roleRoute}/${values.practitionerRole}`, practitionerRole)
    }

    return response
  }

  const handleArchivePractitioner = async (id, active=false) => {
    const practitionerData = await getPractitioner(id)
    const practitioner = practitionerData.raw.find(
      (entry) => entry.resourceType === 'Practitioner'
    )
    const practitionerRole = practitionerData.raw.find(
      (entry) => entry.resourceType === 'PractitionerRole'
    )

    const archivedPractitioner = {
      ...practitioner,
      active,
    }

    const archivedPractitionerRole = {
      ...practitionerRole,
      active,
    }

    await put(`${practitionerRoute}/${id}`, archivedPractitioner)
    await put(`${roleRoute}/${practitionerData.formatted.practitionerRole}`, archivedPractitionerRole)

    return true
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
    handlePageChange,
    handleArchivePageChange,
    handleCreatePractitioner,
    handleUpdatePractitioner,
    handleArchivePractitioner,
  }
}
