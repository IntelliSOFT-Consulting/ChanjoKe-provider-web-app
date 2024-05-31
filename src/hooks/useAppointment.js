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

  const getPatientAppointments = async (patientID) => {
    setLoader(true)
    const response = await get(
      `${appointmentsEndpoint}?supporting-info=Patient/${patientID}`
    )
    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const appointmentsResponse = response?.entry.map((appointment) => ({
        appointments: appointment?.resource?.description,
        scheduledDate: dayjs(appointment?.resource?.created).format('DD-MM-YYYY') || '',
        appointmentDate: dayjs(appointment?.resource?.start).format('DD-MM-YYYY') || '',
        status: capitalizeFirstLetter(appointment?.resource?.status),
        actions: appointment?.resource?.status === 'cancelled' ? 
         [{ title: 'edit', url: `/edit-appointment/${appointment?.resource?.id}` }] :
         [{ title: 'edit', url: `/edit-appointment/${appointment?.resource?.id}` }, { title: 'cancel', btnAction: { appointment: `${JSON.stringify(appointment?.resource)}`, targetName: 'cancelAppointment' }}]
      }))
      setAppointments(appointmentsResponse)
      setLoader(false)
    } else {
      setAppointments([])
      setLoader(false)
    }
  }

  return {
    loader,
    appointment,
    appointments,
    getAppointment,
    updateAppointment,
    createAppointment,
    getPatientAppointments,
  }
}