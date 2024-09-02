import { WarningOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
} from 'antd'
import dayjs from 'dayjs'
import localeDate from 'dayjs/plugin/localeData'
import weekdays from 'dayjs/plugin/weekday'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import { countryCodes } from '../../data/countryCodes'
import { identificationOptions } from '../../data/options/clientDetails'
import { useLocations } from '../../hooks/useLocation'
import usePatient from '../../hooks/usePatient'
import useVaccination from '../../hooks/useVaccination'
import {
  calculateAges,
  generateDateOfBirth,
  titleCase,
  writeAge,
} from '../../utils/methods'
import AdministrativeArea from './AdministrativeArea'
import CaregiverDetails from './CareGiverDetails'
import PreloadDetails from './PreloadDetails'
import Preview from './Preview'

dayjs.extend(weekdays)
dayjs.extend(localeDate)

export default function ClientDetails() {
  const [isAdult, setIsAdult] = useState(false)
  const [saving, setSaving] = useState(false)
  const [idOptions, setIdOptions] = useState([])
  const [caregivers, setCaregivers] = useState([])
  const [isDocumentTypeSelected, setIsDocumentTypeSelected] = useState(false)
  const [estimatedAge, setEstimatedAge] = useState(true)
  const [draftCaregiver, setDraftCaregiver] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState(null)
  const [clientType, setClientType] = useState(null)

  const [form] = Form.useForm()

  const [caregiverForm] = Form.useForm()

  const { clientID } = useParams()

  useEffect(() => {
    if (clientID) {
      setIsDocumentTypeSelected(true)
    }
  }, [])

  const navigate = useNavigate()

  const { createPatient, checkPatientExists } = usePatient()
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
    setEstimatedAge,
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
    values.countyName = titleCase(
      counties?.find((county) => county.key === values.county)?.name
    )
    values.subCountyName = titleCase(
      subCounties?.find((subCounty) => subCounty.key === values.subCounty)?.name
    )
    values.wardName = titleCase(
      wards?.find((ward) => ward.key === values.ward)?.name
    )

    values.clientID = clientID

    const patient = await createPatient(values)

    if (!clientID) {
      await createRecommendations(patient)
    }
    await createRecommendations(patient, 'update')

    setSaving(false)

    setSuccess(true)

    const timeout = setTimeout(() => {
      const param =
        clientType === 'Non-Routine' || values.years >= 5 ? 'non-routine' : ''
      navigate(
        `/client-details/${patient.id}/routineVaccines${
          param ? `?type=${param}` : ''
        }`
      )
    }, 1500)

    return () => clearTimeout(timeout)
  }

  const calculateDob = () => {
    const { years = 0, months = 0, weeks = 0 } = form.getFieldValue()
    const birthDate = generateDateOfBirth({ years, months, weeks })
    form.setFieldValue('dateOfBirth', dayjs(birthDate))

    form.setFieldValue('age', writeAge({ years, months, weeks }))

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

  const caregiverType = (val) => {
    if (val === 'kin') {
      return 'Next of Kin'
    }
    if (form.getFieldValue('years') >= 18) {
      return 'Next of Kin'
    }
    return 'Caregiver'
  }

  const handleClientType = (e) => {
    setClientType(e.target.value)
  }

  const handleValidateId = async (_, value) => {
    if (value && !clientID) {
      const idType = form.getFieldValue('identificationType')
      const exists = await checkPatientExists(value, idType)
      if (exists) {
        return Promise.reject('Client already exists in the system')
      }
    }
    return Promise.resolve()
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
                />
              </Form.Item>

              <Form.Item name="middleName" label="Middle Name">
                <Input
                  placeholder="Middle Name"
                  autoComplete="off"
                  onBlur={() => capitalize('middleName')}
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
                />
              </Form.Item>

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

              <div className="col-span-1 md:col-span-2 lg:col-span-3 my-4" />

              <Form.Item
                name="vaccineType"
                label="Vaccination Category"
                rules={[
                  {
                    required: true,
                    message: 'Please select vaccination category',
                  },
                ]}
              >
                <Radio.Group onChange={handleClientType}>
                  <Radio value="Routine">Routine</Radio>
                  <Radio value="Non-Routine">Non-Routine</Radio>
                </Radio.Group>
              </Form.Item>

              {clientType === 'Non-Routine' && (
                <Form.Item name="estimatedAge" label="Age Input Method">
                  <Radio.Group
                    onChange={(e) => setEstimatedAge(e.target.value)}
                  >
                    <Radio value={true}>Actual</Radio>
                    <Radio value={false}>Estimated</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                    message: 'Please input date of birth',
                  },
                ]}
                hidden={!estimatedAge}
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
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                label="Age"
                name="age"
                hidden={!estimatedAge}
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
                  className="w-full"
                />
              </Form.Item>

              <div
                className={`gutter-row grid-cols-3 gap-4 mt-0 ${
                  !estimatedAge ? 'grid' : 'hidden'
                }`}
              >
                <Form.Item name="years" label="Years">
                  <InputNumber
                    placeholder="Years"
                    max={99}
                    min={0}
                    onChange={calculateDob}
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item name="months" label="Months">
                  <InputNumber
                    placeholder="Months"
                    min={0}
                    onChange={calculateDob}
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item name="weeks" label="Weeks">
                  <InputNumber
                    placeholder="Weeks"
                    min={0}
                    className="w-full"
                    onChange={calculateDob}
                  />
                </Form.Item>
              </div>

              {!estimatedAge && (
                <Form.Item
                  name="dateOfBirth"
                  label={
                    <div>
                      <span className="font-bold">Date of Birth</span>
                    </div>
                  }
                >
                  <DatePicker
                    disabled={true}
                    format="DD-MM-YYYY"
                    className="w-full"
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
                  disabled={!idOptions?.length}
                  placeholder="Select Identification Type"
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
                    message: 'Please input identifier number',
                  },
                  {
                    validator: handleValidateId,
                  },
                ]}
              >
                <Input
                  disabled={!isDocumentTypeSelected}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                    form.setFieldValue('identificationNumber', value)
                  }}
                  placeholder="Document Identification Number"
                  autoComplete="off"
                  className="w-full"
                />
              </Form.Item>

              {isAdult && (
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: 'Please input phone number',
                    },
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
                      e.target.value = e.target.value.replace(/\D/g, '')
                      if (e.target.value.length > 9) {
                        e.target.value = e.target.value.slice(0, 9)
                      }
                      form.setFieldValue('phoneNumber', e.target.value)
                    }}
                  />
                </Form.Item>
              )}
            </div>
          </div>

          <div className={currentStep === 2 ? 'block px-6' : 'hidden'}>
            <CaregiverDetails
              caregivers={caregivers}
              setCaregivers={setCaregivers}
              form={caregiverForm}
              setDraftCaregiver={setDraftCaregiver}
              caregiverType={caregiverType}
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
              caregiverType={caregiverType}
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

          {draftCaregiver && currentStep === 2 && (
            <div className="shadow w-fit p-2 flex ml-auto rounded-md bg-red-50 text-semibold">
              <WarningOutlined className="text-red-500 mr-2" />
              <p className="text-red-700">
                Please add the draft caregiver details to proceed.
              </p>
            </div>
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
                onClick={() => {
                  if (currentStep === 2) {
                    const caregiverData = caregiverForm.getFieldsValue()
                    delete caregiverData['phoneCode']
                    const caregiverValues = Object.values(caregiverData)
                    const isEmpty = caregiverValues.every((value) => !value)
                    if (!isEmpty) {
                      setDraftCaregiver(true)
                      return
                    }
                    setDraftCaregiver(false)
                  }
                  setCurrentStep(currentStep + 1)
                }}
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
