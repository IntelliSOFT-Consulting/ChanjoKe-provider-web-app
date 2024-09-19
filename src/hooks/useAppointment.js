import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import dayjs from 'dayjs'
import moment from 'moment'
import { useSelector } from 'react-redux'

const appointmentsEndpoint = '/chanjo-hapi/fhir/Appointment'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function useAppointment() {
  const { get, put, post } = useApiRequest()

  const [loader, setLoader] = useState(false)
  const [appointment, setAppointment] = useState({})
  const [appointments, setAppointments] = useState([])
  const [totalAppointments, setTotal] = useState(0)
  const [facilityAppointments, setFacilityAppointments] = useState([])
  const [appointmentsPagination, setAppointmentPagination] = useState([])

  const { user } = useSelector((state) => state.userInfo)

  const getAppointment = async (appointment) => {
    setLoader(true)
    const response = await get(`${appointmentsEndpoint}/${appointment}`)
    setAppointment(response)
    setLoader(false)
    return
  }

  const updateAppointment = async (appointment, payload) => {
    setLoader(true)
    const response = await put(
      `${appointmentsEndpoint}/${appointment}`,
      payload
    )
    setAppointment(response)
    setLoader(false)
    return
  }

  const createAppointment = async (payload) => {
    await post(`${appointmentsEndpoint}`, payload)
  }

  const getPatientAppointments = async (patientID, offset = 0) => {
    setLoader(true)

    const facilityParam = `actor=${user?.orgUnit?.code || '0'}`

    const url =
      offset < 1
        ? `${appointmentsEndpoint}?supporting-info=Patient/${patientID}&${facilityParam}&_count=5`
        : `${appointmentsEndpoint}?supporting-info=Patient/${patientID}&${facilityParam}&_count=5&_offset=${offset}`
    const response = await get(url)

    if (
      response?.entry &&
      Array.isArray(response?.entry) &&
      response?.entry.length > 0
    ) {
      const appointmentsResponse = response?.entry.map((appointment) => ({
        appointments: appointment?.resource?.description,
        scheduledDate:
          dayjs(appointment?.resource?.created).format('DD-MM-YYYY') || '',
        appointmentDate:
          dayjs(appointment?.resource?.start).format('DD-MM-YYYY') || '',
        status: capitalizeFirstLetter(appointment?.resource?.status),
        id: appointment?.resource?.id,
        location: appointment?.resource?.supportingInformation?.[1]?.display,
        createdAt: appointment?.resource?.meta?.lastUpdated,
      }))
      setAppointments(appointmentsResponse)
      setAppointmentPagination(response?.link)
      setTotal(response?.total)
      setLoader(false)
      return appointmentsResponse
    } else {
      setAppointments([])
      setLoader(false)
    }
  }

  const getFacilityAppointments = async (appointmentDate) => {
    setLoader(true)
    const facilityParam = `actor=${user?.orgUnit?.code || '0'}`
    const dateFilter = appointmentDate
      ? `&date=${moment(appointmentDate).format('YYYY-MM-DD')}`
      : ''
    const response = await get(
      `${appointmentsEndpoint}?${facilityParam}${dateFilter}&_count=10000`
    )

    setFacilityAppointments(response?.entry)
    setLoader(false)
  }

  const listAppointments = async (offset = 0) => {
    setLoader(true)
    const facilityParam = `actor=${user?.orgUnit?.code || '0'}`
    const dateFilter = `&date=ge${moment().format('YYYY-MM-DD')}`
    const url =
      offset < 1
        ? `${appointmentsEndpoint}?${facilityParam}&_count=5`
        : `${appointmentsEndpoint}?${facilityParam}&_count=5&_offset=${offset}`
    const response = await get(url)
  }

  return {
    loader,
    appointment,
    appointments,
    appointmentsPagination,
    totalAppointments,
    facilityAppointments,
    getAppointment,
    updateAppointment,
    createAppointment,
    getPatientAppointments,
    getFacilityAppointments,
  }
}
