import { Button, DatePicker, Form, Input, Popconfirm, Select } from 'antd'
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

export default function NotAdministered() {
  const [loading, setLoading] = useState(false)
  const [contraindicated, setContraindicated] = useState(false)
  const [otherReason, setOtherReason] = useState(false)

  const navigate = useNavigate()

  const [isDialogOpen, setDialogOpen] = useState(false)

  const { createImmunization, getRecommendations, updateRecommendations } =
    useVaccination()

  const [form] = Form.useForm()

  const { currentPatient } = useSelector((state) => state.currentPatient)
  const { selectedVaccines } = useSelector((state) => state.vaccineSchedules)
  const { user } = useSelector((state) => state.userInfo)

  const { clientID } = useParams()

  useEffect(() => {
    if (!selectedVaccines?.length) {
      navigate(`/client-details/${clientID}/routineVaccines`)
    }
  }, [selectedVaccines])

  const fhirReasons = [
    { label: 'Immunity', value: 'Immunity' },
    { label: 'Medical precaution', value: 'Medical precaution' },
    { label: 'Vaccine out of stock', value: 'Vaccine out of stock' },
    { name: 'Patient objection', value: 'Patient objection' },
    { label: 'Caregiver refusal', value: 'Caregiver refusal' },
    { label: 'Religious objection', value: 'Religious objection' },
    { label: 'Cold Chain Break', value: 'Cold Chain Break' },
    { label: 'VVM change', value: 'VVM change' },
    { label: 'Contraindication', value: 'Contraindication' },
    { label: 'Reaction', value: 'Reaction' },
    { label: 'Other', value: 'Other' },
  ]

  function handleDialogClose() {
    navigate(`/client-details/${clientID}/routineVaccines`)
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

    values.reasonCode = 'Not Administered'

    const vaccineResources = createImmunizationResource(
      values,
      selected,
      currentPatient,
      user
    )

    const responses = await Promise.all(
      vaccineResources.map(async (resource) => {
        return await createImmunization(resource)
      })
    )

    if (values.notVaccinatedReason !== 'Contraindication') {
      const recommendation = await getRecommendations(clientID)
      await updateRecommendations(
        updateVaccineDueDates(
          recommendation,
          selected,
          values.nextVaccinationDate?.format('YYYY-MM-DD')
        )
      )
    }

    if (responses) {
      setDialogOpen(true)
      setLoading(false)
      const time = setTimeout(() => {
        setDialogOpen(false)
        navigate(-1)
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
                    onChange={(value) => {
                      if (value === 'Contraindication') {
                        setContraindicated(true)
                      } else if (value === 'Other') {
                        setContraindicated(false)
                        setOtherReason(true)
                      } else {
                        setContraindicated(false)
                      }
                    }}
                  />
                </Form.Item>
                {(contraindicated || otherReason) && (
                  <Form.Item
                    name="otherReason"
                    label={
                      contraindicated
                        ? 'Reason for contraindication'
                        : 'Other reason'
                    }
                    rules={[
                      {
                        required: true,
                        message: contraindicated
                          ? 'Contraindication reason is required'
                          : 'Please specify other reason',
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder={
                        contraindicated
                          ? 'Enter contraindication reason'
                          : 'Specify other reason'
                      }
                    />
                  </Form.Item>
                )}

                {!contraindicated && (
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
                      style={{ width: '100%' }}
                      format="DD-MM-YYYY"
                      disabledDate={(current) =>
                        current &&
                        (current < moment().startOf('day') ||
                          current > moment().add(14, 'days').startOf('day'))
                      }
                    />
                  </Form.Item>
                )}
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
          <Popconfirm
            title="Are you sure you want to submit?"
            onConfirm={() => {
              form.submit()
            }}
            okText="Yes"
            cancelText="No"
            placement="top"
          >
            <Button
              className="ml-4 btn-success text-sm font-semibold"
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  )
}
