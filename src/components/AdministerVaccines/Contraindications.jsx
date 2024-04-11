import moment from 'moment'
import FormState from '../../utils/formState'
import { useSharedState } from '../../shared/sharedState'
import { createVaccineImmunization } from '../ClientDetailsView/DataWrapper'
import { useApiRequest } from '../../api/useApiRequest'
import { useSelector } from 'react-redux'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DatePicker, Input, Select, Form } from 'antd'

export default function Contraindications() {
  const navigate = useNavigate()
  const [vaccines, setVaccines] = useState([])
  const [vaccinesToSelect, setVaccinesToSelect] = useState([])
  const { sharedData } = useSharedState()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const currentPatient = useSelector((state) => state.currentPatient)
  const { post } = useApiRequest()

  const [form] = Form.useForm()

  useEffect(() => {
    const vaccinesToSelect = sharedData.map((vaccine) => ({
      label: vaccine.vaccineName,
      value: vaccine.vaccineName,
    }))

    if (vaccinesToSelect.length === 0) {
      navigate(-1)
    }
    setVaccinesToSelect(vaccinesToSelect)
    setVaccines(sharedData)
  }, [sharedData])

  function handleDialogClose() {
    setDialogOpen(false)
  }

  const handleFormSubmit = async (values) => {
    const selectedVaccines = vaccines.filter((vaccine) =>
      values.vaccinesToContraindicate.includes(vaccine.vaccineName)
    )

    const data = selectedVaccines.map((immunization) => {
      immunization.contraindicationDetails = values.contraindicationDetails
      immunization.education = [
        {
          presentationDate: values.nextVaccinationDate.format('YYYY-MM-DD'),
        },
      ]
      return createVaccineImmunization(
        immunization,
        currentPatient.id,
        'entered-in-error'
      )
    })

    const responses = await Promise.all(
      data?.map(async (administerVaccine) => {
        return await post('/hapi/fhir/Immunization', administerVaccine)
      })
    )

    if (responses) {
      setDialogOpen(true)
      const time = setTimeout(() => {
        setDialogOpen(false)
        navigate(-1)
      }, 2000)
      return () => clearTimeout(time)
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Contraindication saved successfully`}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Contraindications
        </div>
        <div className="px-4 py-5 sm:p-6">
          {vaccines.length > 0 && (
            <Form
              onFinish={handleFormSubmit}
              form={form}
              layout="vertical"
              className="grid grid-cols-2 gap-36 px-6 gap-10"
              initialValues={{
                vaccinesToContraindicate: vaccinesToSelect.map(
                  (vaccine) => vaccine.value
                ),
              }}
            >
              <div>
                <Form.Item
                  label="Vaccines to Contraindicate"
                  name="vaccinesToContraindicate"
                  rules={[
                    { required: true, message: 'Please select a vaccine' },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Select vaccines to contraindicate"
                    style={{ width: '100%' }}
                    options={vaccinesToSelect}
                    size="large"
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  label="Contraindication Details"
                  name="contraindicationDetails"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter contraindication details',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter Contraindications"
                  />
                </Form.Item>

                <Form.Item
                  label="Next Vaccination Date"
                  name="nextVaccinationDate"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter next vaccination date',
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    disabledDate={(current) =>
                      current &&
                      (current < moment().startOf('day') ||
                        current > moment().add(14, 'days').startOf('day'))
                    }
                  />
                </Form.Item>
              </div>
            </Form>
          )}
        </div>
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              form.submit()
              console.log('clicked')
            }}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Contraindicate
          </button>
        </div>
      </div>
    </>
  )
}
