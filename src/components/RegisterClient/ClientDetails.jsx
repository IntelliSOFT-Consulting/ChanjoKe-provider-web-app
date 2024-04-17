import LoadingArrows from '../../common/spinners/LoadingArrows'
import { useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Alert,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  calculateAges,
  generateDateOfBirth,
  writeAge,
} from '../../utils/methods'
import CaregiverDetails from './CareGiverDetails'
import AdministrativeArea from './AdministrativeArea'
import { identificationOptions } from '../../data/options/clientDetails'
import { useSelector } from 'react-redux'
import usePatient from '../../hooks/usePatient'
import useEncounter from '../../hooks/useEncounter'
import useObservations from '../../hooks/useObservations'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { countryCodes } from '../../data/countryCodes'

dayjs.extend(weekdays)
dayjs.extend(localeDate)

function daysBetweenTodayAndDate(inputDate) {
  const currentDate = new Date()
  const targetDate = new Date(inputDate)
  const timeDifference = targetDate - currentDate
  const daysDifference = Math.ceil(
    Math.abs(timeDifference) / (1000 * 60 * 60 * 24)
  )

  return daysDifference
}

export default function ClientDetails({ editClientDetails, setClientDetails }) {
  const [isAdult, setIsAdult] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [idOptions, setIdOptions] = useState([])
  const [estimatedAge, setEstimatedAge] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState(null)

  const [form] = Form.useForm()

  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()

  const { createPatient } = usePatient()
  const { createEncounter } = useEncounter()
  const { createObservation } = useObservations()

  // useEffect(() => {
  //   if (editClientDetails) {
  //     form.setFieldsValue(editClientDetails)
  //   }
  //   setLoading(false)
  // }, [editClientDetails])

  // validate the form and set errors in case of any validation errors with the failing field error messages
  const validateForm = async () => {
    try {
      await form.validateFields()
      form.submit()
    } catch (error) {
      const errorMessages = error.errorFields
        .map((error) =>
          error.errors
            ?.join(', ')
            .replace('Please input ', '')
            .replace('Please select ', '')
        )
        ?.join(', ')
      setErrors(errorMessages)
      return false
    }
  }

  const onFinish = async (values) => {
    setSaving(true)
    const patient = await createPatient(values)
    const encounter = await createEncounter(
      patient.id,
      user?.fhirPractitionerId,
      user?.facility?.replace('Location/', '')
    )
    await createObservation(values, patient.id, encounter.id)

    setSaving(false)

    setSuccess(true)

    const timeout = setTimeout(() => {
      setClientDetails(patient)
      navigate(`/client-details/${patient.id}`)
    }, 1500)

    return () => clearTimeout(timeout)
  }

  const calculateDob = () => {
    const { years, months, weeks } = form.getFieldValue()
    const birthDate = generateDateOfBirth({ years, months, weeks })
    form.setFieldValue('dateOfBirth', dayjs(birthDate))

    setIsAdult(years >= 18)

    if (!years) return
    const identificationsQualified = identificationOptions.filter(
      (option) => years >= option.minAge && years <= option.maxAge
    )

    setIdOptions(identificationsQualified)
  }

  return (
    <>
      {errors && (
        <Alert
          message="Please provide the following information:"
          description={errors}
          type="error"
          closable
          onClose={() => setErrors(null)}
        />
      )}
      {currentStep === 1 && (
        <h3 className="text-xl font-medium mb-6">Client Details</h3>
      )}

      {success && (
        <ConfirmDialog
          title="Success"
          description="Client details saved successfully"
          onClose={() => setSuccess(false)}
          open={success}
        />
      )}

      {!loading && (
        <Form
          name="clientDetails"
          onFinish={onFinish}
          layout="vertical"
          colon={true}
          autoComplete="off"
          validateTrigger="onBlur"
          form={form}
          initialValues={{ age: 0, ...editClientDetails }}
        >
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10">
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
                    message: 'Please input first name',
                  },
                ]}
              >
                <Input
                  placeholder="First Name"
                  autoComplete="off"
                  className="block w-full rounded-md py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400"
                />
              </Form.Item>

              <Form.Item
                name="middleName"
                label={
                  <div>
                    <span className="font-bold">Middle Name</span>
                  </div>
                }
                rules={[]}
              >
                <Input
                  placeholder="Middle Name"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                />
              </Form.Item>

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
                    message: 'Please input last name',
                  },
                ]}
              >
                <Input
                  placeholder="Last Name"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                />
              </Form.Item>

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
                  ]}
                >
                  <Radio.Group>
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div>
                <Form.Item name="estimatedAge" label="Age Input Method">
                  <Radio.Group
                    onChange={(e) => setEstimatedAge(e.target.value)}
                  >
                    <Radio value={true}>Actual</Radio>
                    <Radio value={false}>Estimated</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              {estimatedAge ? (
                <>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[
                      {
                        required: true,
                        message: 'Please input date of birth',
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current && current >= moment().endOf('day')
                      }
                      format="DD-MM-YYYY"
                      onChange={(e) => {
                        if (!e) return
                        const estimate = calculateAges(new Date(e.toDate()))

                        const ages = ['years', 'months', 'weeks', 'days']
                        ages.forEach((age) => {
                          form.setFieldValue(age, estimate[age])
                        })
                        form.setFieldValue('age', writeAge(estimate))

                        const identificationsQualified =
                          identificationOptions.filter(
                            (option) =>
                              estimate.years >= option.minAge &&
                              estimate.years <= option.maxAge
                          )

                        setIdOptions(identificationsQualified)

                        setIsAdult(estimate.years >= 18)
                      }}
                      className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Age"
                    name="age"
                    rules={[
                      {
                        required: true,
                        message: 'Please input age',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Age"
                      disabled={true}
                      className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <div className="gutter-row grid grid-cols-3 gap-4 mt-7">
                    <Form.Item name="years" label="Years">
                      <InputNumber
                        size="large"
                        placeholder="Years"
                        max={99}
                        min={0}
                        onChange={calculateDob}
                        className="w-full"
                      />
                    </Form.Item>
                    <Form.Item name="months" label="Months">
                      <InputNumber
                        size="large"
                        placeholder="Months"
                        min={0}
                        onChange={calculateDob}
                        className="w-full"
                      />
                    </Form.Item>
                    <Form.Item name="weeks" label="Weeks">
                      <InputNumber
                        size="large"
                        placeholder="Weeks"
                        min={0}
                        className="w-full"
                        onChange={calculateDob}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="dateOfBirth"
                    label={
                      <div>
                        <span className="font-bold">
                          Estimated date of birth
                        </span>
                      </div>
                    }
                  >
                    <DatePicker
                      disabled={true}
                      format="DD-MM-YYYY"
                      className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
                  </Form.Item>
                </>
              )}

              {isAdult && (
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value) {
                          //   validate 9 digit phone number (no country code and numeric)
                          if (!/^\d{9}$/.test(value)) {
                            return Promise.reject('Invalid phone number')
                          }
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input
                    addonBefore={
                      <Form.Item name="phoneCode" noStyle>
                        <Select
                          size="large"
                          style={{ width: 120 }}
                          showSearch
                          options={countryCodes}
                          defaultValue={'+254'}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="Code"
                        />
                      </Form.Item>
                    }
                    placeholder="7xxxxxxxx"
                    onChange={(e) => {
                      if (e.target.value.length > 9) {
                        form.setFieldValue(
                          'phoneNumber',
                          e.target.value.slice(0, 9)
                        )
                      }
                    }}
                    size="large"
                  />
                </Form.Item>
              )}

              <Form.Item name="identificationType" label="Identification Type">
                <Select
                  size="large"
                  disabled={idOptions.length === 0}
                  options={idOptions}
                />
              </Form.Item>

              <Form.Item
                name="identificationNumber"
                label="Identification Number"
                rules={[
                  {
                    required: true,
                    message: 'Please input identifier',
                  },
                ]}
              >
                <Input
                  placeholder="Document Identification Number"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                />
              </Form.Item>

              <Form.Item
                name="currentWeight"
                size="large"
                label="Current Weight"
                rules={[]}
              >
                <Input
                  placeholder="Current Weight"
                  autoComplete="off"
                  className="rounded"
                  size="large"
                  addonAfter={
                    <Form.Item
                      name="weightMetric"
                      className="mb-0 block rounded-md"
                    >
                      <Select style={{ width: 100 }} defaultValue={'Kg'}>
                        <Select.Option value="kg">Kilograms</Select.Option>
                        <Select.Option value="g">Grams</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                />
              </Form.Item>
            </div>
          </div>

          <div className={currentStep === 2 ? 'block px-6' : 'hidden'}>
            <CaregiverDetails form={form} />
          </div>

          <div className={currentStep === 3 ? 'block px-6' : 'hidden'}>
            <AdministrativeArea form={form} />
          </div>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            {currentStep > 1 && (
              <Button
                className="mr-4"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                type="primary"
                // htmlType="submit"
                loading={saving}
                disabled={saving}
                onClick={validateForm}
              >
                Submit
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </Form>
      )}

      {loading && (
        <div className="my-10 mx-auto flex justify-center">
          <LoadingArrows />
        </div>
      )}
    </>
  )
}
