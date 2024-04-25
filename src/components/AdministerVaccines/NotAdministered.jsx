import { Button, DatePicker, Form, Select } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import {
  createImmunizationResource,
  updateVaccineDueDates,
} from './administerController'
import useVaccination from '../../hooks/useVaccination'

export default function NotAdministered() {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [isDialogOpen, setDialogOpen] = useState(false)

  const { createImmunization, getRecommendations, updateRecommendations } =
    useVaccination()

  const [form] = Form.useForm()

  const currentPatient = useSelector((state) => state.currentPatient)
  const selectedVaccines = useSelector((state) => state.selectedVaccines)
  const { user } = useSelector((state) => state.userInfo)

  const { clientID } = useParams()

  useEffect(() => {
    if (!selectedVaccines?.length) {
      navigate(`/client-details/${clientID}`)
    }
  }, [selectedVaccines])

  const fhirReasons = [
    { label: 'Immunity', value: 'IMMUNE' },
    { label: 'Medical precaution', value: 'MEDPREC' },
    //{ name: 'Product out of stock', value: 'OSTOCK' },
    // { name: 'Patient objection', value: 'PATOBJ' },
    { label: 'Caregiver refusal', value: 'PHILISOP' },
    { label: 'Religious objection', value: 'RELIG' },
    { label: 'Cold Chain Break', value: 'VACEFF' },
    { label: 'Expired Product', value: 'VACSAF' },
  ]

  function handleDialogClose() {
    navigate(`/client-details/${clientID}`)
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

    values.notVaccinatedReason = values.notVaccinatedReason

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
      setDialogOpen(true)
      setLoading(false)
      const time = setTimeout(() => {
        setDialogOpen(false)
        window.location.reload()
      }, 1500)
      return () => clearTimeout(time)
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Vaccine not administered recorded`}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Not Administered
        </div>
        <div className="px-4 py-5 sm:p-6">
          {selectedVaccines?.length > 0 && (
            <Form
              layout="vertical"
              onFinish={handleFormSubmit}
              form={form}
              initialValues={{
                vaccinesToContraindicate: selectedVaccines?.map(
                  (vaccine) => vaccine.vaccineId
                ),
              }}
              className="grid grid-cols-2 gap-36 px-6 gap-10"
            >
              <div>
                <Form.Item
                  label="Vaccines not administered"
                  name="vaccinesToContraindicate"
                  rules={[
                    { required: true, message: 'Please select a vaccine' },
                    {
                      validator: (_, value) => {
                        const selected = selectedVaccines?.filter((vaccine) =>
                          value.includes(vaccine.vaccineId)
                        )

                        const notDone = selected.filter(
                          (vaccine) => vaccine.status === 'not-done'
                        )
                        if (notDone.length > 0) {
                          const vaccineNames = notDone
                            .map((item) => item.vaccine)
                            .join(', ')
                          return Promise.reject(
                            `${vaccineNames} already marked as not administered`
                          )
                        }

                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select a vaccine"
                    options={selectedVaccines?.map((vaccine) => ({
                      label: vaccine.vaccine,
                      value: vaccine.vaccineId,
                    }))}
                    showSearch
                    size="large"
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  label="Reason for not being vaccinated"
                  name="notVaccinatedReason"
                  rules={[
                    { required: true, message: 'Please select a reason' },
                  ]}
                >
                  <Select
                    placeholder="Select a Reason"
                    options={fhirReasons}
                    showSearch
                    size="large"
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
            className="ml-4 outline outline-[#163C94] text-sm font-semibold text-[#163C94]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              form.submit()
            }}
            className="ml-4 btn-success text-sm font-semibold"
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}
