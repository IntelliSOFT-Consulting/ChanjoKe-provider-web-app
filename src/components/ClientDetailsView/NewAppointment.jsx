import { Col, Row, DatePicker, Form, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApiRequest } from '../../api/useApiRequest'
import dayjs from 'dayjs'
import { lockVaccine } from '../../utils/validate'
import { createAppointment, createVaccinationAppointment } from './DataWrapper'

export default function NewAppointment() {

  // function mapVaccinesByCategory(vaccines) {
  //   const categoriesMap = {}

  //   if (Array.isArray(vaccines) && vaccines.length > 0) {
  //     vaccines.forEach((vaccine) => {
  //       const { category, ...rest } = vaccine

  //       if (!categoriesMap[category]) {
  //         categoriesMap[category] = []
  //       }

  //       rest.actions = [{ title: 'view', url: '/view-vaccination/h894uijre09uf90fdskfd' }]

  //       categoriesMap[category].push(rest)
  //     })

  //     const categoriesArray = Object.entries(categoriesMap).map(
  //       ([category, vaccines]) => ({
  //         category,
  //         status: 'pending',
  //         vaccines,
  //       })
  //     )

  //     return categoriesArray
  //   }
  // }

  const navigate = useNavigate()
  const { userID } = useParams()
  const [form] = Form.useForm()
  const { get, post } = useApiRequest()

  const [patient, setPatient] = useState({})
  const [vaccinesToAppoint, setAppointmentList] = useState([])
  const [vaccinesAppointments, setVaccineAppointments] = useState([])
  const [recommendationID, setRecommendationID] = useState('')

  const fetchPatientImmunization = async () => {
    const response = await get(
      `/hapi/fhir/ImmunizationRecommendation?patient=Patient/${userID}`
    )
    setRecommendationID(response?.entry?.[0]?.resource?.id)
    // const locked = lockVaccine(record.dueDate, record.lastDate)
    if (response.entry && Array.isArray(response.entry)) {
      const recommendation = response?.entry?.[0]?.resource?.recommendation

      const canMakeAppointment = recommendation.map((vaccine) => {
        const locked = lockVaccine(dayjs(vaccine?.dateCriterion?.[0]?.value), dayjs(vaccine?.dateCriterion?.[1]?.value))
        if (!locked) {
            return vaccine;
        }
      }).filter(vaccine => vaccine !== undefined);
      setAppointmentList(canMakeAppointment)
    }
  }

  const createNewAppointment = async (appointmentData) => {
    const response = await post(
      `/hapi/fhir/Appointment`, appointmentData
    )
    console.log({ response })
  }

  useEffect(() => {

    async function getPatientData() {
      const response = await get(`/hapi/fhir/Patient/${userID}`)
      setPatient(response)
    }

    fetchPatientImmunization()

    if (userID) {
      getPatientData()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  const onFinish = (values) => {
    vaccinesAppointments.forEach((vaccine) => {
      const vaccineData = createVaccinationAppointment(vaccine, userID, recommendationID)
      createNewAppointment(vaccineData)

      navigate(`/client-details/${userID}/appointments`)
    })
    // setSharedData({ ...sharedData, aefiDetails: values })
    // navigate('/')
  };

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          <h3 className="text-xl font-medium">New Appointment</h3>
        </div>

        
        <div className="px-4 py-5 sm:p-6">

        <div className="card bg-gray-200 container rounded">
          <Form layout='vertical'>
          <div className="grid grid-cols-2 gap-4 px-8 py-5">
            <div>

              <Col className="gutter-row" span={12}>
                <Form.Item
                  name="addvaccines"
                  label={
                    <div>
                      <span className="font-bold">Add vaccines</span>
                    </div>
                  }>
                  <Select
                    size='large'
                    onChange={(e) => {
                      const vaccine = vaccinesToAppoint.find((item) => item?.vaccineCode?.[0]?.text === e)
                      setVaccineAppointments([...vaccinesAppointments, vaccine ])

                      const vaccines = vaccinesToAppoint.filter((item) => item?.vaccineCode?.[0]?.text !== e)
                      setAppointmentList(vaccines)
                    }}>
                    {vaccinesToAppoint.map((option) => (
                      <Select.Option
                        value={option?.vaccineCode?.[0]?.text}>
                        {option?.vaccineCode?.[0]?.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </div>
            <div>
            </div>
          </div>
          </Form>
        </div>

        <Form
          onFinish={onFinish}
          layout="vertical"
          form={form}
          autoComplete="off">

        {vaccinesAppointments.map((vacc) => (
          
          <Row className='mt-5 px-6' gutter={16}>

            <Col className='gutter-row' span={3}>
              <h3 className='text-1xl font-bold mt-10'>{vacc?.vaccineCode?.[0]?.text}</h3>
            </Col>

            <Col className='gutter-row' span={10}>
              <Form.Item
                 name="scheduledDate"
                 label={
                   <div>
                     <span className="font-bold">Scheduled Date</span>
                   </div>
                 }>
                <DatePicker
                  defaultValue={dayjs(vacc?.dateCriterion?.[0]?.value)}
                  format={'DD-MM-YYYY'}
                  disabled
                  className='w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
              </Form.Item>
            </Col>

            <Col className='gutter-row' span={10}>
              <Form.Item
                 label={
                   <div>
                     <span className="font-bold">Appointment Date</span>
                   </div>
                 }
                 rules={[
                   {
                     required: true,
                     message: 'Add appointment date',
                   },
                 ]}>
                <DatePicker
                  disabledDate={(current) => {
                    const today = dayjs();
                    const vaccineDate = dayjs(vacc?.dateCriterion?.[1]?.value);
                    return current && (current < today || current >= vaccineDate);
                  }}
                  onChange={(e) => {
                    vaccinesAppointments.map((vaccine) => {
                      if (vaccine?.vaccineCode?.[0]?.text === vacc?.vaccineCode?.[0]?.text) {
                        return vaccine.appointmentDate = dayjs(e).format('DD-MM-YYYY')
                      }
                    })
                  }}
                  format={'DD-MM-YYYY'}
                  className='w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
              </Form.Item>
            </Col>

            <Col span={1}>
              <button
                type="button"
                onClick={(e) => {

                  const vaccines = vaccinesAppointments.filter((item) => item?.vaccineCode?.[0]?.text !== vacc?.vaccineCode?.[0]?.text)
                  setVaccineAppointments(vaccines)
                }}
                className="flex-shrink-0 size-4 mr-2 mt-10 inline-flex rounded-full">
                <span className="sr-only">Remove badge</span>
                <svg className="flex-shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </Col>

          </Row>

        
        ))}


          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Back
            </button>
            <button
              htmlType="submit"
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Submit
            </button>    
          </div>

          </Form>

        </div>
      </div>

      
    </>
  )
}