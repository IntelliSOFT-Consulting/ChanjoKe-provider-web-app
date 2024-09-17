import { Button, DatePicker, Form, Input, Radio, Select } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import useAefi from '../../hooks/useAefi'
import usePatient from '../../hooks/usePatient'
import AEFIPreview from './AEFIPreview'

export default function CreateAEFI() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState([])

  const { updatePatient } = usePatient()

  const { currentPatient } = useSelector((state) => state.currentPatient)

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

  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { selectedVaccines } = useSelector((state) => state.vaccineSchedules)

  const earliestDueDate = selectedVaccines?.reduce((acc, vaccine) => {
    const administeredDate = vaccine.administeredDate
    if (acc === null) return administeredDate
    return administeredDate.isSameOrBefore(acc)
      ? administeredDate?.format('YYYY-MM-DD')
      : acc
  }, null)

  useEffect(() => {
    if (!selectedVaccines?.length) {
      navigate(`/client-details/${clientID}/routineVaccines`)
    }
  }, [])

  const onFinish = async (values) => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
      return
    }
    setLoading(true)
    

    await submitAefi(values)
    if (values.aefiOutcome === 'Died') {
      const updatedPatient = { ...currentPatient, deceasedBoolean: true }
      await updatePatient(updatedPatient.id, updatedPatient)
    }
    setShowModal(true)
    const timer = setTimeout(() => {
      setShowModal(false)
      setLoading(false)
      navigate(`/client-details/${currentPatient.id}/routineVaccines`)
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

  console.log('currentStep', currentStep)

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
            <div className="text-red-500 border border-red-500 rounded-md p-2 bg-red-100 transition-all duration-300 ease-in-out transform origin-top">
              <ul className="mx-2 text-xs list-none">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <ConfirmDialog
            open={showModal}
            description="AEFI has been successfully submitted"
            onConfirm={() =>
              navigate(`/client-details/${currentPatient.id}/routineVaccines`)
            }
            onClose={() => setShowModal(false)}
          />
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onFinish}
            onValuesChange={() => setErrors([])}
          >
            <div
              className={`grid mt-5 grid-cols-2 gap-10 ${
                currentStep !== 1 ? 'hidden' : 'block'
              }`}
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
                      return (
                        (current && current > moment().endOf('day')) ||
                        current.isBefore(
                          moment(earliestDueDate).subtract(1, 'd')
                        )
                      )
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

            {currentStep === 2 && <AEFIPreview form={form} selectedVaccines={selectedVaccines} />}
          </Form>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="ml-4 outline outline-[#163C94] text-sm font-semibold text-[#163C94]"
              >
                Back
              </Button>
            )}
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={() => {
                if (currentStep === 1) {
                  setCurrentStep(currentStep + 1)
                  return
                }
                validateForm()
              }}
              className="ml-4 "
            >
              {currentStep === 1 ? 'Preview' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
