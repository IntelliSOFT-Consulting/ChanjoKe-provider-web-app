import calculateAge from '../../utils/calculateAge'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import { useEffect, useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'
import { Col, Row, Radio, DatePicker, Form, Input, Select } from 'antd'
import { useNavigate } from 'react-router-dom'

const Option = Select.Option;
dayjs.extend(weekdays)
dayjs.extend(localeDate)

export default function ClientDetails({ editClientDetails, setClientDetails }) {

  // const [actualDate, setActualDate] = useState('actual')
  // const [weeks, setWeeks] = useState(null)
  // const [months, setMonths] = useState(null)
  // const [years, setYears] = useState(null)
  // const [formValues, setFormValues] = useState(editClientDetails)
  const [loading, setLoading] = useState(false)
  const [userAge, setUserAge] = useState(null)

  const [form] = Form.useForm();
  const navigate = useNavigate()

  form.setFieldsValue({ weightMetric: 'Kgs' });

  useEffect(() => {
    form.setFieldsValue(editClientDetails)
    setUserAge(editClientDetails?.age || 'Age')
    setLoading(true)
  }, [editClientDetails])

  const onFinish = (values) => {
    values.currentWeight = `${values.currentWeight || 0} ${values.weightMetric}`
    delete values.weightMetric
    setClientDetails(values)
    // console.log('Success:', values);
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
          form={form}
          initialValues={editClientDetails}
          onFinishFailed={onFinishFailed}>
            
            <Row className='mt-5' gutter={16}>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="firstName"
                  label={
                    <div>
                      <span className="font-bold">First Name</span>
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input your first name!',
                    },
                  ]}>
                    <Input
                      placeholder="First Name"
                      autoComplete="off"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
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
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input your last name!',
                    },
                  ]}>
                    <Input
                      placeholder="Last Name"
                      autoComplete="off"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="gender"
                  label={
                    <div>
                      <span className="font-bold">Gender</span>
                      <span className="text-red-400 mx-2">*</span>
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
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  label={
                    <div>
                      <span className="font-bold">Age Type</span>
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }>
                  <Radio.Group>
                    <Radio value="male">Actual</Radio>
                    <Radio value="female">Estimated</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="birthDate"
                  label={
                    <div>
                      <span className="font-bold">Birth Date</span>
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input birth date!',
                    },
                  ]}>
                  
                  <DatePicker
                    disabledDate={(current) => current && current > moment().endOf('day')}
                    onChange={(e) => {
                      const date = moment(e.$d).format('YYYY-MM-DD')
                      setUserAge(calculateAge(date))
                    }}
                    className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="identificationType"
                  label={
                    <div>
                      <span className="font-bold">Identification Type</span>
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }>
                  <Select>
                    <Select.Option value="id_number">Identification Number</Select.Option>
                    <Select.Option value="birth_certificate">Birth Certificate Number</Select.Option>
                    <Select.Option value="nemis_number">NEMIS Number</Select.Option>
                    <Select.Option value="passport_number">Passport Number</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="identificationNumber"
                  label={
                    <div>
                      <span className="font-bold">Identification Number</span>
                      <span className="text-red-400 mx-2">*</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input identifier!',
                    },
                  ]}>
                    <Input
                      placeholder="Identification Number"
                      autoComplete="off"
                      className='block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]' />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  label={
                    <div>
                      <span className="font-bold">Age</span>
                      <span className="text-red-400 mx-2">*</span>
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

            </Row>

            <Row className='mt-5' gutter={16}>
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