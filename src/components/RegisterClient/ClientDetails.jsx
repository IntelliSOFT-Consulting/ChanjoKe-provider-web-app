import LoadingArrows from '../../common/spinners/LoadingArrows'
import { useState, useEffect } from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'
import {
  calculateAges,
  generateDateOfBirth,
  titleCase,
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
import { useLocations } from '../../hooks/useLocation'
import Preview from './Preview'
import PreloadDetails from './PreloadDetails'
import useVaccination from '../../hooks/useVaccination'

dayjs.extend(weekdays)
dayjs.extend(localeDate)

export default function ClientDetails() {
  const [isAdult, setIsAdult] = useState(false)
  const [saving, setSaving] = useState(false)
  const [idOptions, setIdOptions] = useState([])
  const [caregivers, setCaregivers] = useState([])
  const [isDocumentTypeSelected, setIsDocumentTypeSelected] = useState(false)
  const [estimatedAge, setEstimatedAge] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState(null)

  const [form] = Form.useForm()
  const { clientID } = useParams()

  const { user } = useSelector((state) => state.userInfo)

  useEffect(() => {
    if (clientID) {
      setIsDocumentTypeSelected(true)
    }
  }, [])

  const navigate = useNavigate()

  const { createPatient } = usePatient()
  const { createEncounter } = useEncounter()
  const { createObservation } = useObservations()
  const {
    counties,
    subCounties,
    wards,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  } = useLocations(form)
  const { loading } = PreloadDetails({
    form,
    setCaregivers,
    patientId: clientID,
    setIdOptions,
    setIsAdult,
    counties,
    subCounties,
    wards,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  })

  const { createRecommendations } = useVaccination()

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
    if (caregivers.length === 0) {
      setErrors('Please add at least one caregiver')
      setSaving(false)
      return
    }
    values.caregivers = caregivers
    values.countyName = counties?.find(
      (county) => county.key === values.county
    )?.name
    values.clientID = clientID
    const patient = await createPatient(values)

    let encounter
    if (!clientID) {
      encounter = await createEncounter(
        patient.id,
        user?.fhirPractitionerId,
        user?.facility?.replace('Location/', '')
      )

      await createRecommendations(patient)
    }
    await createObservation(values, patient.id, encounter?.id)

    setSaving(false)

    setSuccess(true)

    const timeout = setTimeout(() => {
      navigate(`/client-details/${patient.id}`)
    }, 1500)

    return () => clearTimeout(timeout)
  }

  const calculateDob = () => {
    const { years = 0, months = 0, weeks = 0 } = form.getFieldValue()
    const birthDate = generateDateOfBirth({ years, months, weeks })
    form.setFieldValue('dateOfBirth', dayjs(birthDate))

    setIsAdult(years >= 18)

    const identificationsQualified = identificationOptions.filter(
      (option) => years >= option.minAge && years <= option.maxAge
    )

    setIdOptions(identificationsQualified)
  }

  const capitalize = (name) => {
    const value = form.getFieldValue(name)
    if (value) form.setFieldValue(name, titleCase(value))
  }

  return (
    <>
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
          initialValues={{ age: 0, phoneCode: '+254' }}
        >
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10">
              <Form.Item
                name="firstName"
                label="First Name"
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
                  onBlur={() => capitalize('firstName')}
                  size="large"
                />
              </Form.Item>

              <Form.Item name="middleName" label="Middle Name">
                <Input
                  placeholder="Middle Name"
                  autoComplete="off"
                  onBlur={() => capitalize('middleName')}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
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
                  onBlur={() => capitalize('lastName')}
                  size="large"
                />
              </Form.Item>

              <div>
                <Form.Item
                  name="gender"
                  label="Gender"
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
                          Estimated Date of Birth
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
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
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

              <Form.Item
                name="identificationType"
                label="Identification Type"
                rules={[
                  {
                    required: true,
                    message: 'Please select identification type',
                  },
                ]}
              >
                <Select
                  size="large"
                  disabled={idOptions.length === 0}
                  onChange={(value) => {
                    if (value) {
                      setIsDocumentTypeSelected(true)
                    } else {
                      setIsDocumentTypeSelected(false)
                    }
                  }}
                  options={idOptions}
                />
              </Form.Item>

              <Form.Item
                name="identificationNumber"
                label="Identification Number"
                rules={[
                  {
                    required: true,
                    message: 'Please input identifier number',
                  },
                ]}
              >
                <Input
                  disabled={!isDocumentTypeSelected || idOptions.length === 0}
                  placeholder="Document Identification Number"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                />
              </Form.Item>

              <div className="md:col-span-3 w-full border-t my-4" />

              <Form.Item
                name="currentWeight"
                size="large"
                label="Current Weight"
                rules={[]}
                className="col-span-2"
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
            <CaregiverDetails
              caregivers={caregivers}
              setCaregivers={setCaregivers}
            />
          </div>

          <div className={currentStep === 3 ? 'block px-6' : 'hidden'}>
            <AdministrativeArea
              form={form}
              capitalize={capitalize}
              counties={counties}
              subCounties={subCounties}
              wards={wards}
              handleCountyChange={handleCountyChange}
              handleSubCountyChange={handleSubCountyChange}
              handleWardChange={handleWardChange}
            />
          </div>

          <div className={currentStep === 4 ? 'block px-6' : 'hidden'}>
            <Preview
              form={form}
              errors={errors}
              caregivers={caregivers}
              counties={counties}
            />
          </div>

          {errors && (
            <Alert
              className="mt-6"
              message="Please provide the following information:"
              description={titleCase(errors)}
              type="error"
              closable
              onClose={() => setErrors(null)}
            />
          )}

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            {currentStep > 1 && (
              <Button
                className="mr-4"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            {currentStep === 4 && (
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
            {currentStep < 4 && (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                {currentStep === 3 ? 'Preview' : 'Next'}
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
