import TextInput from '../../common/forms/TextInput'
import SearchTable from '../../common/tables/SearchTable'
import FormState from '../../utils/formState'
import { useNavigate } from 'react-router-dom'
import { Col, Row, Input, Button, DatePicker } from 'antd'
import { useEffect } from 'react'
import { useApiRequest } from '../../api/useApiRequest'

export default function VaccineAppointments({ userCategory, patientData }) {
  const { get } = useApiRequest()
  const { formData, formErrors, handleChange} = FormState({
    sortByDate: '',
  })

  const fetchPatientImmunization = async () => {
    const response = await get(
      `/hapi/fhir/Appointment?patient=Patient/${patientData?.id}`
    )
    console.log({ response })
  }

  const tHeaders = [
    {title: 'Appointments', class: '', key: 'appointments' },
    {title: 'Scheduled Date', class: '', key: 'scheduledDate'},
    {title: 'Appointment Date', class: '', key: 'appointmentDate'},
    {title: 'Status', class: '', key: 'status'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const actions = [
    { title: 'edit', url: '/' }
  ]

  const appointmentSchedule = []
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

      {appointmentSchedule.length > 0 && <SearchTable
          headers={tHeaders}
          data={appointmentSchedule} />}

      {appointmentSchedule.length < 1 && <><p className='text-center'>No appointments made</p></>}

    </div>
  )
}