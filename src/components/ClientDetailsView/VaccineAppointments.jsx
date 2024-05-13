import SearchTable from '../../common/tables/SearchTable'
import FormState from '../../utils/formState'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Button, DatePicker, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useApiRequest } from '../../api/useApiRequest'
import { LoadingOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export default function VaccineAppointments({ userCategory, patientData }) {
  const { get } = useApiRequest()

  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(false)

  const { formData, formErrors, handleChange} = FormState({
    sortByDate: '',
  })

  const fetchPatientImmunization = async () => {
    setLoadingAppointments(true)
    const response = await get(
      `/hapi/fhir/Appointment?supporting-info=Patient/${patientData?.id}`
    )
    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const appointments = response?.entry.map((appointment) => ({
        appointments: appointment?.resource?.description,
        scheduledDate: dayjs(appointment?.resource?.start).format('DD-MM-YYYY'),
        appointmentDate: dayjs(appointment?.resource?.created).format('DD-MM-YYYY'),
        status: appointment?.resource?.status,
        actions: [
          { title: 'edit', url: '/' }
        ]
      }))
      setAppointments(appointments)
      setLoadingAppointments(false)
    } else {
      setLoadingAppointments(false)
    }
  }

  const tHeaders = [
    {title: 'Appointments', class: '', key: 'appointments' },
    {title: 'Scheduled Date', class: '', key: 'scheduledDate'},
    {title: 'Appointment Date', class: '', key: 'appointmentDate'},
    {title: 'Status', class: '', key: 'status'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const navigate = useNavigate()

  useEffect(() => {
    fetchPatientImmunization()
  }, [])

  return (
    
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <Row
        gutter={16}
        className='mb-10'>
        <Col
          md={12}
          sm={24}>
          <DatePicker />
        </Col>
        <Col
          md={12}
          sm={24}
          className='grid'>
          <Button
            onClick={() => navigate(`/new-appointment/${patientData.id}`)}
            className="ml-4 flex-shrink-0 place-self-end rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            New Appointment
          </Button>
        </Col>
      </Row>

      {loadingAppointments && 
        <div className='text-center'>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 56,
                }}
                spin
              />
              }
            />
        </div>
        }

      {!loadingAppointments && appointments.length > 0 &&
        <SearchTable
          headers={tHeaders}
          data={appointments} />}

      {!loadingAppointments && appointments.length < 1 && <><p className='text-center'>No appointments made</p></>}

    </div>
  )
}