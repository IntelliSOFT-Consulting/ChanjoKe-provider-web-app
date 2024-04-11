import { Col, Row, Radio, DatePicker, Form, Input, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSharedState } from '../../shared/sharedState'
import { routineVaccines } from './vaccineData'
import { useState, useEffect } from 'react'
import { useApiRequest } from '../../api/useApiRequest'
import dayjs from 'dayjs'

export default function NewAppointment() {

  function mapVaccinesByCategory(vaccines) {
    const categoriesMap = {}

    if (Array.isArray(vaccines) && vaccines.length > 0) {
      vaccines.forEach((vaccine) => {
        const { category, ...rest } = vaccine

        if (!categoriesMap[category]) {
          categoriesMap[category] = []
        }

        rest.actions = [{ title: 'view', url: '/view-vaccination/h894uijre09uf90fdskfd' }]

        categoriesMap[category].push(rest)
      })

      const categoriesArray = Object.entries(categoriesMap).map(
        ([category, vaccines]) => ({
          category,
          status: 'pending',
          vaccines,
        })
      )

      return categoriesArray
    }
  }

  const navigate = useNavigate()
  const { userID } = useParams()
  const [form] = Form.useForm()
  const { get } = useApiRequest()

  const { sharedData, setSharedData } = useSharedState()
  const [categoryVaccines, setCategoryVaccines] = useState([])
  const [patient, setPatient] = useState({})

  useEffect(() => {

    async function getPatientData() {
      const response = await get(`/hapi/fhir/Patient/${userID}`)
      setPatient(response)
    }

    if (userID) {
      getPatientData()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient])
  
  const mapped = mapVaccinesByCategory(routineVaccines)

  const addVaccines = mapped.map((vaccine) => ({
    name: vaccine.category.replace(/_/g, ' '),
    value: vaccine.category
  }))

  const onFinish = (values) => {
    setSharedData({ ...sharedData, aefiDetails: values })
    navigate('/')
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
                      const vaccines = routineVaccines.filter((vacc) => vacc.category === e)
                      const date = vaccines[0].dueDate(patient.birthDate)
                      form.setFieldValue('scheduledDate', dayjs(date))
                      setCategoryVaccines(vaccines)
                    }}>
                    {addVaccines.map((option) => (
                      <Select.Option
                        value={option.value}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </div>
            <div>
              
            <div className="py-4 block">
                {categoryVaccines.map((vaccine) => (
                  <span className="block my-2 flex justify-between gap-x-3 py-2 ps-5 pe-2 rounded-full font-medium bg-gray-100 mx-2">
                    {vaccine.vaccineName}
                    
                    <button
                      type="button"
                      className="flex-shrink-0 size-4 mr-2 mt-1 inline-flex rounded-full">
                      <span className="sr-only">Remove badge</span>
                      <svg className="flex-shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </span>
                ))}
              </div>

            </div>
          </div>
          </Form>
        </div>

          <Form
            onFinish={onFinish}
            layout="vertical"
            form={form}
            autoComplete="off">
            <Row className='mt-5 px-6' gutter={16}>

              <Col className='gutter-row' span={12}>
                <Form.Item
                   name="scheduledDate"
                   label={
                     <div>
                       <span className="font-bold">Scheduled Date</span>
                     </div>
                   }
                   rules={[
                     {
                       required: true,
                       message: 'Add scheduled date',
                     },
                   ]}>
                  <DatePicker format={'MM-DD-YYYY'} disabled className='w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className='gutter-row' span={12}>
                <Form.Item
                   name="appointmentDate"
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
                    disabledDate={(current) => current && current <= dayjs().endOf('day')}
                    className='w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

            </Row>

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