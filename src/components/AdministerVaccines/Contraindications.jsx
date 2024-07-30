import { DatePicker, Form, Input, Select, Button, Popconfirm } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import useVaccination from '../../hooks/useVaccination'
import {
  createImmunizationResource,
  updateVaccineDueDates,
} from './administerController'

export default function Contraindications() {
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const navigate = useNavigate()

  const { clientID } = useParams()

  const currentPatient = useSelector((state) => state.currentPatient)

  const selectedVaccines = useSelector((state) => state.selectedVaccines)

  const { user } = useSelector((state) => state.userInfo)

  const {
    createImmunization,
    updateImmunization,
    getRecommendations,
    updateRecommendations,
  } = useVaccination()

  const [form] = Form.useForm()

  useEffect(() => {
    if (!selectedVaccines?.length) {
      navigate(`/client-details/${clientID}/routineVaccines`)
    }
  }, [selectedVaccines])

  function handleDialogClose() {
    setDialogOpen(false)
  }

  const handleFormSubmit = async (values) => {
    setLoading(true)
    const selected = selectedVaccines
      .filter((vaccine) =>
        values.vaccinesToContraindicate.includes(vaccine.vaccineId)
      )
      ?.map((vaccine) => ({
        ...vaccine,
        status: 'not-done',
      }))

    values.notVaccinatedReason = values.contraindicationDetails
    values.reasonCode = 'Contraindicated'

    const vaccineResources = createImmunizationResource(
      values,
      selected,
      currentPatient,
      user
    )

    const recommendation = await getRecommendations(clientID)

    const responses = await Promise.all(
      vaccineResources.map(async (resource) => {
        return await createImmunization(resource)
      })
    )

    await updateRecommendations(
      updateVaccineDueDates(
        recommendation,
        selected,
        values.nextVaccinationDate?.format('YYYY-MM-DD')
      )
    )

    if (responses) {
      const vaccineType =
        selectedVaccines[0].type === 'non-routine' ? 'type=non-routine' : ''
      setDialogOpen(true)
      setLoading(false)
      const time = setTimeout(() => {
        setDialogOpen(false)
        window.location.href = `/client-details/${clientID}/vaccines?${vaccineType}`
      }, 1500)
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
          {selectedVaccines?.length > 0 && (
            <Form
              onFinish={handleFormSubmit}
              form={form}
              layout="vertical"
              className="grid grid-cols-2 gap-36 px-6 gap-10"
              initialValues={{
                vaccinesToContraindicate: selectedVaccines?.map(
                  (vaccine) => vaccine.vaccineId
                ),
              }}
            >
              <div>
                <Form.Item
                  label="Vaccines to Contraindicate"
                  name="vaccinesToContraindicate"
                  rules={[
                    { required: true, message: 'Please select a vaccine' },
                    {
                      validator: (_, value) => {
                        const selected = selectedVaccines.filter((vaccine) =>
                          value?.includes(vaccine.vaccineId)
                        )

                        const contraindicatedVaccines = selected.filter(
                          (vaccine) =>
                            vaccine.status === 'entered-in-error' &&
                            moment(vaccine.dueDate).isAfter(moment())
                        )

                        if (contraindicatedVaccines?.length > 0) {
                          const vaccineNames = contraindicatedVaccines
                            .map((vaccine) => vaccine.vaccine)
                            ?.join(', ')

                          const nextDueDates = contraindicatedVaccines
                            .map((vaccine) =>
                              moment(
                                vaccine.education?.[0]?.presentationDate
                              ).format('DD-MM-YYYY')
                            )
                            ?.join(', ')
                          return Promise.reject(
                            `${vaccineNames} already contraindicated, the next due date(s) is ${nextDueDates}`
                          )
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Select vaccines to contraindicate"
                    style={{ width: '100%' }}
                    options={selectedVaccines?.map((vaccine) => ({
                      label: vaccine.vaccineName,
                      value: vaccine.vaccineId,
                    }))}
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
          <Button
            onClick={() => window.location.reload()}
            className="ml-4  outline outline-[#163C94] text-sm font-semibold text-[#163C94]"
          >
            Cancel
          </Button>
          <Popconfirm
            title="Are you sure you want to contraindicate the selected vaccines?"
            onConfirm={() => {
              form.submit()
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              className="ml-4 btn-success text-sm font-semibold"
              loading={loading}
              disabled={loading}
            >
              Contraindicate
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  )
}
