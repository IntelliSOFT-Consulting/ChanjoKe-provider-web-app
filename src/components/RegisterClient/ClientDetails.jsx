import calculateAge from '../../utils/calculateAge'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import { useEffect, useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'
import calculateEstimatedBirthDate from '../../utils/calculateDate'
import { Col, Row, Radio, DatePicker, Form, Input, Select, InputNumber } from 'antd'
import { useNavigate } from 'react-router-dom'

const Option = Select.Option;
dayjs.extend(weekdays)
dayjs.extend(localeDate)

const identificationOptions = [
  { name: 'Birth Notification Number', value: 'birth_notification_number', minAge: 0, maxAge: 1095 },
  { name: 'Birth Certificate', value: 'birth_certificate', minAge: 0, maxAge: 36525 },
  { name: 'ID Number', value: 'ID_number', minAge: 6575, maxAge: 36525 },
  { name: 'NEMIS', value: 'NEMIS_no', minAge: 1095, maxAge: 6575 },
  { name: 'Passport', value: 'passport', minAge: 0, maxAge: 36525 }, 
]

function daysBetweenTodayAndDate(inputDate) {
  const currentDate = new Date();
  const targetDate = new Date(inputDate);
  const timeDifference = targetDate - currentDate;
  const daysDifference = Math.ceil(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));

  return daysDifference;
}

export default function ClientDetails({ editClientDetails, setClientDetails }) {

  // const [actualDate, setActualDate] = useState('actual')
  const [weeks, setWeeks] = useState(null)
  const [months, setMonths] = useState(null)
  const [years, setYears] = useState(null)
  // const [formValues, setFormValues] = useState(editClientDetails)
  const [loading, setLoading] = useState(false)
  const [userAge, setUserAge] = useState(null)
  const [actualAge, setActualAge] = useState(true)
  const [idOptions, setIdOptions] = useState([])

  const [form] = Form.useForm();
  const navigate = useNavigate()

  form.setFieldsValue({ weightMetric: 'Kgs' });

  useEffect(() => {
    form.setFieldsValue(editClientDetails)
    setUserAge(editClientDetails?.age || 'Age')
    setLoading(true)

    const days = daysBetweenTodayAndDate(moment(editClientDetails?.dateOfBirth?.$d).format('YYYY-MM-DD'))
    const mappedIDs = identificationOptions.filter(option =>
      days >= option.minAge && days <= option.maxAge
    );
    setIdOptions(mappedIDs)
  }, [editClientDetails])

  const onFinish = (values) => {
    values.currentWeight = `${values.currentWeight || 0} ${values.weightMetric}`
    delete values.weightMetric
    setClientDetails(values)
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <h3 className="text-xl font-medium">Client Details</h3>

      {loading && 
        <Form
          name="clientDetails"
          onFinish={onFinish}
          layout="vertical"
          colon={true}
          autoComplete="on"
          validateTrigger="onBlur"
          form={form}
          initialValues={editClientDetails}
          onFinishFailed={onFinishFailed}>
            
            <Row className='mt-5 px-6' gutter={16}>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="firstName"
                  label={
                    <div>
                      <span className="font-bold">First Name</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input first name!',
                    },
                  ]}>
                    <Input
                      placeholder="First Name"
                      autoComplete="off"
                      className='block w-full rounded-md py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="middleName"
                  label={
                    <div>
                      <span className="font-bold">Middle Name</span>
                    </div>
                  }
                  rules={[]}>
                    <Input
                      placeholder="Middle Name"
                      autoComplete="off"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="lastName"
                  label={
                    <div>
                      <span className="font-bold">Last Name</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input last name!',
                    },
                  ]}>
                    <Input
                      placeholder="Last Name"
                      autoComplete="off"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Form.Item
                      name="gender"
                      label={
                        <div>
                          <span className="font-bold">Gender</span>
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Please select gender',
                        },
                      ]}>
                      
                      <Radio.Group>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label={
                        <div>
                          <span className="font-bold">Age Input Method</span>
                        </div>
                      }>
                    <Radio.Group onChange={(value) => {
                      setActualAge(value.target.value)
                      }} value={actualAge}>
                      <Radio value={true}>Actual</Radio>
                      <Radio value={false}>Estimated</Radio>
                    </Radio.Group>
                  </Form.Item>
                  </div>
                </div>
              
              </Col>
              { actualAge && <>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="dateOfBirth"
                    label={
                      <div>
                        <span className="font-bold">Date of birth</span>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please input date of birth!',
                      },
                    ]}>
                    
                    <DatePicker
                      disabledDate={(current) => current && current >= moment().endOf('day')}
                      format="DD-MM-YYYY"
                      onChange={(e) => {
                        const date = moment(e.$d).format('YYYY-MM-DD')
                        setUserAge(calculateAge(date))
                        const days = daysBetweenTodayAndDate(date)
                        const mappedIDs = identificationOptions.filter(option =>
                          days >= option.minAge && days <= option.maxAge
                        );
                        setIdOptions(mappedIDs)
                      }}
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                  </Form.Item>
                </Col>

                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label={
                      <div>
                        <span className="font-bold">Age</span>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please input age!',
                      },
                    ]}>
                      <Input
                        placeholder="Age"
                        value={userAge}
                        disabled={true}
                        className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                  </Form.Item>
                </Col>
              </>
              }

              {!actualAge && <>
                <Col className="gutter-row grid grid-cols-3 gap-4 flex mt-7" span={8}>
                  <Form.Item>     
                    <InputNumber
                      size='large'
                      placeholder="Years"
                      max={99}
                      min={1}
                      value={years}
                      onChange={(e) => {
                        setYears(e)
                        const est = calculateEstimatedBirthDate(weeks, months, e)
                        form.setFieldValue('dateOfBirth', dayjs(est))
                      }}
                      className='w-full' />
                  </Form.Item>
                  <Form.Item>
                    <InputNumber
                      size='large'
                      placeholder="Months"
                      max={11}
                      min={1}
                      onChange={(e) => {
                        setMonths(e)
                        const est = calculateEstimatedBirthDate(weeks, e, years)
                        form.setFieldValue('dateOfBirth', dayjs(est))
                      }}
                      className='w-full'/>
                  </Form.Item>
                  <Form.Item>
                    <InputNumber
                      size='large'
                      placeholder="Weeks"
                      max={3}
                      min={1}
                      className='w-full'
                      onChange={(e) => {
                        setWeeks(e)
                        const est = calculateEstimatedBirthDate(e, months, years)
                        form.setFieldValue('dateOfBirth', dayjs(est))
                      }}/>
                  </Form.Item>
                </Col>

                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="dateOfBirth"
                    label={
                      <div>
                        <span className="font-bold">Estimated date of birth</span>
                      </div>
                    }>
                    
                    <DatePicker
                      disabled={true}
                      format="DD-MM-YYYY"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                  </Form.Item>
                </Col>
              </>
              }

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="identificationType"
                  label={
                    <div>
                      <span className="font-bold">Identification Type</span>
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }>
                  <Select size='large' disabled={form.getFieldValue('dateOfBirth') ? false : true}>
                    {idOptions.map((option) => (
                      <Select.Option value={option.value}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="identificationNumber"
                  label={
                    <div>
                      <span className="font-bold">Document Identification Number</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input identifier!',
                    },
                  ]}>
                    <Input
                      placeholder="Document Identification Number"
                      autoComplete="off"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="currentWeight"
                  label={
                    <div>
                      <span className="font-bold">Current Weight</span>
                    </div>
                  }
                  rules={[]}>
                      <Input
                        placeholder="Current Weight"
                        autoComplete="off"
                        addonAfter={
                          <Form.Item name='weightMetric' className='mb-0 block rounded-md'>
                        <Select
                          style={{ width: 100 }}
                          defaultValue={'Kgs'}
                          onChange={(value) => {
                            form.setFieldsValue({ weightMetric: value });
                          }}>
                          <Select.Option value="Kgs">KGs</Select.Option>
                          <Select.Option value="Grams">Grams</Select.Option>
                        </Select>
                        </Form.Item>
                        } 
                        className='rounded' />
                </Form.Item>
              </Col>

            </Row>

            <div className="px-4 py-4 sm:px-6 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Back
              </button>
              <button
                htmlType="submit"
                className='bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'>
                Next
              </button>
            </div>

        </Form>
      }

      {!loading && <div className="my-10 mx-auto flex justify-center"><LoadingArrows /></div>}

    </>
  )
}