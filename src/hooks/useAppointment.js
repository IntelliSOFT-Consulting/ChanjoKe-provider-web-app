import { useState } from "react"
import { useApiRequest } from "../api/useApiRequest"
import dayjs from "dayjs";

const appointmentsEndpoint = '/hapi/fhir/Appointment'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function useAppointment() {
  const { get, put, post } = useApiRequest()

  const [loader, setLoader] = useState(false)
  const [appointment, setAppointment] = useState({})
  const [appointments, setAppointments] = useState([])
  const [totalAppointments, setTotal] = useState(0)
  const [appointmentsPagination, setAppointmentPagination] = useState([])

  const getAppointment = async (appointment) => {
    setLoader(true)
    const response = await get(`${appointmentsEndpoint}/${appointment}`)
    setAppointment(response)
    setLoader(false)
    return;
  }

  const updateAppointment = async (appointment, payload) => {
    setLoader(true)
    const response = await put(
      `${appointmentsEndpoint}/${appointment}`,
      payload
    )
    setAppointment(response)
    setLoader(false)
    return;
  }

  const createAppointment = async (payload) => {
    await post(
      `${appointmentsEndpoint}`, payload
    )
  }

  const getPatientAppointments = async (patientID, offset = 0) => {
    setLoader(true)

    const url = offset < 1 ? `${appointmentsEndpoint}?supporting-info=Patient/${patientID}&_count=5` : `${appointmentsEndpoint}?supporting-info=Patient/${patientID}&_count=5&_offset=${offset}`
    const response = await get(url)
    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const appointmentsResponse = response?.entry.map((appointment) => ({
        appointments: appointment?.resource?.description,
        scheduledDate: dayjs(appointment?.resource?.created).format('DD-MM-YYYY') || '',
        appointmentDate: dayjs(appointment?.resource?.start).format('DD-MM-YYYY') || '',
        status: capitalizeFirstLetter(appointment?.resource?.status),
        id: appointment?.resource?.id,
        // actions: appointment?.resource?.status === 'cancelled' ? 
        //  [] :
        //  [{ title: 'edit', url: `/edit-appointment/${appointment?.resource?.id}` }, { title: 'cancel', btnAction: { appointment: `${JSON.stringify(appointment?.resource)}`, targetName: 'cancelAppointment' }}]
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

  return {
    loader,
    appointment,
    appointments,
    appointmentsPagination,
    totalAppointments,
    getAppointment,
    updateAppointment,
    createAppointment,
    getPatientAppointments,
  }
}