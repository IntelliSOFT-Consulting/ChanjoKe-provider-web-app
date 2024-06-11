import SearchTable from '../../common/tables/SearchTable'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Button, DatePicker, Spin } from 'antd'
import { useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import useAppointment from '../../hooks/useAppointment'

export default function VaccineAppointments({ userCategory, patientData, patientDetails }) {
  const {
    loader,
    appointments,
    appointmentsPagination,
    getPatientAppointments,
    updateAppointment,
  } = useAppointment()

  const handleActionBtn = async (payload) => {
    const appointment = JSON.parse(payload?.appointment)

    await updateAppointment(appointment?.id, { ...appointment, status: 'cancelled' })
    getPatientAppointments(patientData?.id)
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
    getPatientAppointments(patientData?.id)
  }, [userCategory])

  const updateAppointmentURL = (data) => {
    getPatientAppointments(null, data)
  }

  return (
    
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <Row
        gutter={16}
        className='mb-10 px-8'>
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

      {loader && 
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

      {!loader && appointments.length > 0 &&
        <SearchTable
          onActionBtn={handleActionBtn}
          headers={tHeaders}
          link={appointmentsPagination}
          updatePaginationURL={updateAppointmentURL}
          data={appointments} />}

      {!loader && appointments.length < 1 && <><p className='text-center'>No appointments made</p></>}

    </div>
  )
}