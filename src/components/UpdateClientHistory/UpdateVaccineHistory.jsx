import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'
import useVaccination from '../../hooks/useVaccination'
import { formatRecommendationsToObject } from '../ClientDetailsView/clientDetailsController'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import {
  createImmunizationResource,
  updateVaccineDueDates,
} from '../AdministerVaccines/administerController'
import usePatient from '../../hooks/usePatient'
import { MinusCircleOutlined } from '@ant-design/icons'

export default function UpdateVaccineHistory() {
  const navigate = useNavigate()
  const [missedVaccinesList, setMissedVaccinesList] = useState(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const [form] = Form.useForm()

  const { clientID } = useParams()
  const { user } = useSelector((state) => state.userInfo)

  const { getPatient, patient } = usePatient()

  const {
    getRecommendations,
    getImmunizations,
    createImmunization,
    updateRecommendations,
    immunizations,
    recommendations,
  } = useVaccination()

  useEffect(() => {
    getRecommendations(clientID)
    getImmunizations(clientID)
    getPatient(clientID)
  }, [clientID])

  const getMissedVaccines = () => {
    const missedVaccines = recommendations.recommendation?.filter((vaccine) => {
      const dueDate = vaccine.dateCriterion?.find(
        (date) => date.code?.coding?.[0]?.code === 'Earliest-date-to-administer'
      )?.value

      const isRoutine = vaccine.description === 'routine'
      const isPastDue = moment(dueDate).add(1, 'day').isBefore(moment())

      const vaccineCodeDisplay = vaccine.vaccineCode?.[0]?.coding?.[0]?.display
      const isImmunized = immunizations.some(
        (immunization) =>
          immunization.vaccineCode?.coding?.[0]?.display === vaccineCodeDisplay
      )

      return isRoutine && isPastDue && !isImmunized
    })

    const formattedVaccines = missedVaccines.map(formatRecommendationsToObject)
    setMissedVaccinesList(formattedVaccines || [])
    return formattedVaccines
  }

  useEffect(() => {
    if (recommendations && immunizations) {
      getMissedVaccines()
    }
  }, [recommendations, immunizations])

  function handleDialogClose() {
    setDialogOpen(false)
  }

  const handleFinish = async (values) => {
    let drafrRecommendations = { ...recommendations }
    const lateVaccines = await Promise.all(
      values.vaccines.map(async (item) => {
        item.description = 'Late vaccination entry.'
        item.occurrence = new Date(
          item.dateOfLastDose?.format('YYYY-MM-DD')
        ).toISOString()
        const selectedVaccine = missedVaccinesList.find(
          (vaccine) => vaccine.vaccine === item.vaccineType
        )

        selectedVaccine.status = 'completed'
        const resource = createImmunizationResource(
          item,
          [selectedVaccine],
          { id: clientID },
          user
        )

        const response = await createImmunization(resource[0])

        const updatedDueDates = updateVaccineDueDates(recommendations, [
          selectedVaccine,
        ])

        drafrRecommendations = updatedDueDates

        return response
      })
    )
    await updateRecommendations(drafrRecommendations)

    if (lateVaccines) {
      setDialogOpen(true)

      const timeout = setTimeout(() => {
        setDialogOpen(false)
        navigate(`/client-details/${clientID}/routineVaccines`)
      }, 1500)

      return () => {
        clearTimeout(timeout)
      }
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Vaccine history updated successfully`}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-3 sm:px-6">
          Update Vaccine History
        </div>

        {missedVaccinesList ? (
          <Form
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{
              vaccines: [
                {
                  vaccineType: null,
                  dateOfLastDose: null,
                  placeOfVaccination: null,
                },
              ],
            }}
          >
            <Form.List name="vaccines">
              {(fields, { add, remove }) => (
                <div className="px-4 py-2 sm:p-6">
                  {fields.map(({ key, name, ...restField }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative border-b mb-2">
                      <Form.Item
                        label="Vaccine Type"
                        rules={[
                          {
                            required: true,
                            message: 'Please select a vaccine',
                          },
                        ]}
                        name={[name, 'vaccineType']}
                      >
                        <Select
                          placeholder="Select a vaccine"
                          allowClear
                          disabled={!missedVaccinesList?.length}
                          showSearch
                          filterOption={(input, option) => {
                            return (
                              option.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            )
                          }}
                        >
                          {missedVaccinesList?.map((vaccine) => {
                            const values = form.getFieldValue('vaccines')
                            const hasBeenSelected = values?.some(
                              (v) => v?.vaccineType === vaccine?.vaccine
                            )
                            return (
                              <Select.Option
                                value={vaccine.vaccine}
                                disabled={hasBeenSelected}
                              >
                                {vaccine.vaccine}
                              </Select.Option>
                            )
                          })}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Batch Number"
                        name={[name, 'batchNumber']}
                      >
                        <Input placeholder="Enter batch number" />
                      </Form.Item>

                      <Form.Item
                        label="Date of last dose"
                        rules={[
                          { required: true, message: 'Please select a date' },
                        ]}
                        name={[name, 'dateOfLastDose']}
                      >
                        <DatePicker
                          placeholder="Select a date"
                          allowClear
                          className="w-full"
                          disabledDate={(current) =>
                            (current && current > moment().endOf('day')) ||
                            current < moment(patient?.birthDate).startOf('day')
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="Place of Vaccination"
                        rules={[
                          {
                            required: true,
                            message: 'Please select a place of vaccination',
                          },
                        ]}
                        name={[name, 'placeOfVaccination']}
                      >
                        <Select
                          placeholder="Select a place of vaccination"
                          options={[
                            { label: 'Facility', value: 'facility' },
                            { label: 'Outreach', value: 'outreach' },
                          ]}
                          allowClear
                        />
                      </Form.Item>
                      <Button
                        onClick={() => remove(name)}
                        type="link"
                        icon={<MinusCircleOutlined />}
                        className="absolute top-0 -right-5 md:-right-7 "
                        danger
                      />
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button
                      type="primary"
                      onClick={() => add()}
                      disabled={
                        !missedVaccinesList?.length ||
                        missedVaccinesList?.length === fields.length
                      }
                    >
                      Add Vaccine
                    </Button>
                  </div>
                </div>
              )}
            </Form.List>
            <div className="px-4 py-4 sm:px-6 flex justify-end">
              <Button
                onClick={() => navigate(-1)}
                className="ml-4 rounded-md outline outline-[#163C94] text-sm font-semibold text-[#163C94]"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="ml-4 text-sm font-semibold btn-success"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        ) : (
          <div className="mx-auto flex justify-center h-56 items-center">
            <LoadingArrows />
          </div>
        )}
      </div>
    </>
  )
}
