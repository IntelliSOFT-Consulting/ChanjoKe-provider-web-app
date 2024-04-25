import { Alert, Checkbox, DatePicker, Form, Input, Radio, Select } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import useAefi from '../../hooks/useAefi'

export default function CreateAEFI() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState([])
  const [isTreatmentGiven, setIsTreatmentGiven] = useState(false)
  const [isSpecimenCollected, setIsSpecimenCollected] = useState(false)

  const currentPatient = useSelector((state) => state.currentPatient)

  const { clientID } = useParams()

  const { submitAefi } = useAefi()

  const aefiTypes = [
    { id: 1, label: 'High fever', value: 'High fever' },
    { id: 2, label: 'Convulsions', value: 'Convulsions' },
    { id: 3, label: 'Anaphylaxis', value: 'Anaphylaxis' },
    { id: 4, label: 'Paralysis', value: 'Paralysis' },
    { id: 5, label: 'Toxic shock', value: 'Toxic shock' },
    { id: 6, label: 'Injection site abcess', value: 'Injection site abcess' },
    { id: 7, label: 'Severe local reaction', value: 'Severe local reaction' },
    {
      id: 8,
      label: 'Generalized urticaria (hives)',
      value: 'Generalized urticaria (hives)',
    },
    { id: 9, label: 'BCG Lymphadentitis', value: 'BCG Lymphadentitis' },
    {
      id: 9,
      label: 'Encaphalopathy/Menengitis',
      value: 'Encaphalopathy/Menengitis',
    },
  ]

  const aefiOutcomes = [
    { label: 'Recovered', value: 'Recovered' },
    { label: 'Recovering', value: 'Recovering' },
    { label: 'Not Recovered', value: 'Not Recovered' },
    { label: 'Unknown', value: 'Unknown' },
    { label: 'Died', value: 'Died' },
  ]

  const navigate = useNavigate()
  const [form] = Form.useForm()

  const selectedVaccines = useSelector((state) => state.selectedVaccines)

  useEffect(() => {
    if (!selectedVaccines?.length) {
      navigate(`/client-details/${clientID}`)
    }
  }, [])

  const onFinish = async (values) => {
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }

    await submitAefi(values)
    setShowModal(true)
    const timer = setTimeout(() => {
      setShowModal(false)
      navigate(`/client-details/${currentPatient.id}`)
    }, 1500)

    return () => clearTimeout(timer)
  }

  const validateForm = () => {
    form
      .validateFields()
      .then(() => {
        form.submit()
      })
      .catch((err) => {
        setErrors(err.errorFields?.map((err) => err?.errors[0]))
      })
  }

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          <h3 className="text-xl font-medium">
            Adverse Event Following Immunisation
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {errors.length > 0 && (
            <Alert
              className="mx-6"
              description={
                <ul className="list-decimal ml-2">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              }
              type="error"
              showIcon={errors.length === 1}
              closable
              onClose={() => setErrors([])}
            />
          )}

          <ConfirmDialog
            open={showModal}
            description="AEFI has been successfully submitted"
            onConfirm={() => navigate(`/client-details/${currentPatient.id}`)}
            onClose={() => setShowModal(false)}
          />
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onFinish}
          >
            <div
              className={`grid mt-5 grid-cols-2 gap-10 ${currentStep === 2 ? 'hidden' : 'block'}`}
            >
              <Form.Item
                className="col-span-2"
                label="Type of AEFI Report"
                name="aefiReportType"
                rules={[
                  {
                    required: true,
                    message: 'Please select a type of AEFI Report',
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Initial">Initial Report</Radio>
                  <Radio value="Follow-up">Follow-up Report</Radio>
                </Radio.Group>
              </Form.Item>
              <div>
                <Form.Item
                  label="Type of AEFI"
                  name="aefiType"
                  rules={[
                    {
                      required: true,
                      message: 'Please select a type of AEFI',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Type of AEFI"
                    options={aefiTypes}
                  />
                </Form.Item>

                <Form.Item
                  label="Brief details on the AEFI"
                  name="aefiDetails"
                  rules={[
                    {
                      required: true,
                      message: 'Please provide brief details on the AEFI',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Brief details on the AEFI"
                  />
                </Form.Item>
              </div>

              {/* Column 2 */}
              <div>
                <Form.Item
                  label="Onset of event"
                  name="eventOnset"
                  rules={[
                    {
                      required: true,
                      message: 'Please provide the onset of event',
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Onset of event"
                    disabledDate={(current) => {
                      return current && current > moment().endOf('day')
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Past Medical History"
                  name="pastMedicalHistory"
                  rules={[
                    {
                      required: true,
                      message: 'Please provide past medical history',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Past Medical History" />
                </Form.Item>
              </div>
            </div>

            <div
              className={`mt-5 px-6 grid-cols-1 md:grid-cols-2 gap-x-10 ${currentStep === 1 ? 'hidden' : 'grid'}`}
              gutter={16}
            >
              <Form.Item name="actionTaken" label="Action taken">
                <Checkbox.Group
                  onChange={(values) => {
                    setIsTreatmentGiven(values.includes('Treatment given'))
                    setIsSpecimenCollected(
                      values.includes('specimen collected')
                    )
                  }}
                >
                  <Checkbox value="Treatment given">Treatment Given</Checkbox>
                  <Checkbox value="specimen collected">
                    Specimen collected for investigation
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>

              <div className="col-span-2 grid-cols-1 md:grid-cols-2 gap-x-10">
                {isTreatmentGiven && (
                  <Form.Item
                    name="treatmentDetails"
                    label="Specify treatment Details"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Specify treatment Details"
                    />
                  </Form.Item>
                )}

                {isSpecimenCollected && (
                  <Form.Item
                    name="specimenDetails"
                    label="Specify specimen Details"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Specify specimen Details"
                    />
                  </Form.Item>
                )}
              </div>

              <div className="col-span-2">
                <Form.Item
                  name="aefiOutcome"
                  className="w-full md:w-1/2"
                  label={
                    <div>
                      <span className="font-bold">AEFI Outcome</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Add AEFI Outcome!',
                    },
                  ]}
                >
                  <Select size="large" options={aefiOutcomes} />
                </Form.Item>
              </div>
            </div>
          </Form>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (currentStep === 1) {
                  setCurrentStep(2)
                  return
                }
                validateForm()
              }}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
            >
              {currentStep === 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
