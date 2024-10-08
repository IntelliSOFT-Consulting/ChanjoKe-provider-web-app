import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
} from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import useAppointment from '../../hooks/useAppointment'
import useEncounter from '../../hooks/useEncounter'
import useInventory from '../../hooks/useInventory'
import useObservations from '../../hooks/useObservations'
import useVaccination from '../../hooks/useVaccination'
import { setSelectedVaccines } from '../../redux/slices/vaccineSlice'
import { createNextVaccineAppointment } from '../ClientDetailsView/DataWrapper'
import {
  formatInventoryToTable,
  vaccineInventory,
} from '../StockManagement/helpers/inventoryFormatter'
import {
  createImmunizationResource,
  getBodyWeight,
  updateVaccineDueDates
} from './administerController'

export default function Administer() {
  const [inventory, setInventory] = useState(null)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [nextVaccines, setNextVaccines] = useState({})

  const [loading, setLoading] = useState(false)

  const { getDetailedInventoryItems, batchItems, updateInventory } =
    useInventory()

  const {
    createImmunization,
    updateImmunization,
    getRecommendations,
    updateRecommendations,
  } = useVaccination()

  const { createEncounter } = useEncounter()
  const { createAppointment, getFacilityAppointments, facilityAppointments } =
    useAppointment()

  const [form] = Form.useForm()

  const [nexVaccineForm] = Form.useForm()

  const { currentPatient } = useSelector((state) => state.currentPatient)

  const { user } = useSelector((state) => state.userInfo)

  const { selectedVaccines, vaccineSchedules } = useSelector(
    (state) => state.vaccineSchedules
  )

  const { getLatestObservation, createObservation } = useObservations()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { clientID } = useParams()

  useEffect(() => {
    if (batchItems) {
      setInventory(formatInventoryToTable(batchItems))
    }
  }, [batchItems])

  const findNextVaccines = async () => {
    const keys = Object.keys(vaccineSchedules)

    const vaccineGroup = keys.find((group) =>
      vaccineSchedules[group].some(
        (vaccine) => vaccine.vaccine === selectedVaccines[0].vaccine
      )
    )

    const indexOfKey = keys.indexOf(vaccineGroup)

    await getFacilityAppointments(
      vaccineSchedules[keys[indexOfKey + 1]]?.[0]?.dueDate
    )

    setNextVaccines({
      nextGroup: keys[indexOfKey + 1],
      nextScheduleDate: vaccineSchedules[keys[indexOfKey + 1]]?.[0]?.dueDate,
      nextContent: vaccineSchedules[keys[indexOfKey + 1]],
    })
  }

  const getWeight = async () => {
    const observation = await getLatestObservation(clientID)
    const today = moment().format('YYYY-MM-DD')
    const observationDate =
      observation?.resource?.meta?.lastUpdated?.split('T')[0]

    if (observation && observationDate === today) {
      const weight = getBodyWeight(observation?.resource)

      form.setFieldsValue(weight)
    }
  }

  useEffect(() => {
    if (!selectedVaccines || selectedVaccines?.length === 0) {
      navigate(`/client-details/${clientID}/routineVaccines`)
    } else {
      getWeight()
      findNextVaccines()
      getDetailedInventoryItems()
    }
  }, [selectedVaccines])

  const handleFormSubmit = async (values) => {
    setLoading(true)

    const selected = selectedVaccines.map((item, index) => {
      const vaccine = { ...item }
      vaccine.batchNumber = values.vaccines[index].batchNumber
      vaccine.status = 'completed'

      return vaccine
    })

    const vaccineResources = createImmunizationResource(
      values,
      selected,
      currentPatient,
      user
    )

    const recommendation = await getRecommendations(clientID)

    const responses = await Promise.all(
      vaccineResources.map(async (resource) => {
        if (resource.id) return await updateImmunization(resource)
        return await createImmunization(resource)
      })
    )

    await updateRecommendations(
      updateVaccineDueDates(recommendation, selectedVaccines)
    )

    const encounter = await createEncounter(
      clientID,
      user?.fhirPractitionerId,
      user?.orgUnit?.code?.split('/')[1]
    )

    await createObservation(values, clientID, encounter?.id)

    const items = await getDetailedInventoryItems()

    await Promise.all(
      items.map(async (vaccine) => {
        const batch = vaccine.extension.find((ext) => ext.url === 'batchNumber')
        if (batch?.valueString === values.vaccines[0].batchNumber) {
          vaccine.extension = vaccine.extension.map((ext) => {
            if (ext.url === 'quantity') {
              return {
                ...ext,
                valueQuantity: {
                  value: ext.valueQuantity.value - 1,
                  unit: ext.valueQuantity.unit,
                },
              }
            }
            return ext
          })

          return await updateInventory(vaccine)
        }
      })
    )

    if (responses) {
      setLoading(false)
      setDialogOpen(true)
    }
  }

  const handleNextDueDateChange = async (values) => {
    const vaccineType =
      selectedVaccines[0].type === 'non-routine' ? 'type=non-routine' : ''
    const newScheduleDate = dayjs(values.nextDueDate).format('YYYY-MM-DD')
    const previousScheduleDate = dayjs(nextVaccines?.nextScheduleDate).format(
      'YYYY-MM-DD'
    )

    if (newScheduleDate !== previousScheduleDate) {
      const updatedRecommendations = await getRecommendations(clientID)

      await updateRecommendations(
        updateVaccineDueDates(
          updatedRecommendations,
          nextVaccines.nextContent,
          newScheduleDate
        )
      )
      if (!vaccineType) {
        const appointmentNext = createNextVaccineAppointment(
          nextVaccines.nextContent?.map((vaccine) => ({
            ...vaccine,
            dueDate: newScheduleDate,
          })),
          clientID,
          user
        )

        await createAppointment(appointmentNext)
      }
    }
    setDialogOpen(false)

    if (!vaccineType && newScheduleDate === previousScheduleDate) {
      const appointmentNext = createNextVaccineAppointment(
        nextVaccines.nextContent,
        clientID,
        user
      )

      await createAppointment(appointmentNext)
    }

    dispatch(setSelectedVaccines([]))
    navigate(-1)
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={
          <div className="font-normal">
            <p>The vaccines have been successfully administered!</p>
            <div className="mt-2 bg-gray-200 w-fit mx-auto p-4 rounded-lg alert-col">
              {isDialogOpen && (
                <Form
                  form={nexVaccineForm}
                  className="ml-2 mt-2"
                  onFinish={handleNextDueDateChange}
                  initialValues={{
                    nextDueDate: dayjs(nextVaccines?.nextScheduleDate),
                  }}
                >
                  <p className="font-semibold text-primary">
                    Next Vaccine Appointment
                  </p>

                  <Form.Item name="nextDueDate" label="Next Due Date">
                    <DatePicker
                      defaultValue={dayjs(nextVaccines?.nextScheduleDate)}
                      onChange={async (date) => {
                        await getFacilityAppointments(
                          date?.format('YYYY-MM-DD')
                        )
                      }}
                      style={{ width: '100%' }}
                      disabledDate={(current) => {
                        return current && current < moment().endOf('day')
                      }}
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>

                  <Form.Item
                    name="numberOfAppointments"
                    className="mt-3"
                    label="Number of Appointments"
                  >
                    <Input
                      placeholder={facilityAppointments?.length || 0}
                      disabled
                    />
                  </Form.Item>
                </Form>
              )}
            </div>
          </div>
        }
        onClose={() => nexVaccineForm.submit()}
        cancelText="Save"
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Administer Vaccine
        </div>
        {selectedVaccines?.length > 0 && (
          <Form
            className="px-4 py-5 sm:p-6"
            layout="vertical"
            form={form}
            onFinish={handleFormSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 px-6 gap-4">
              <div className="col-span-2 border-b ">
                <Form.Item
                  name="currentWeight"
                  label="Current Weight"
                  className="w-1/2 addon"
                >
                  <InputNumber
                    placeholder="Current Weight"
                    controls={false}
                    addonAfter={
                      <Form.Item
                        name="weightMetric"
                        style={{ margin: '0px !important' }}
                      >
                        <Select
                          defaultValue="kg"
                          style={{ width: 70, margin: '0px !important' }}
                        >
                          <Select.Option value="kg">Kg</Select.Option>
                          <Select.Option value="g">g</Select.Option>
                        </Select>
                      </Form.Item>
                    }
                  />
                </Form.Item>
              </div>

              <Form.List
                name="vaccines"
                initialValue={selectedVaccines?.map((vaccine) => ({
                  batchNumber: vaccine.batchNumber,
                  diseaseTarget: vaccine.diseaseTarget,
                }))}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, index) => {
                      return (
                        <div
                          key={field.key}
                          className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10"
                        >
                          <Form.Item
                            name={[field.name, 'batchNumber']}
                            label="Batch Number"
                            rules={[
                              {
                                required: true,
                                message: 'Please select batch number',
                              },
                            ]}
                          >
                            <Select
                              placeholder={
                                typeof selectedVaccines?.[index]
                                  ?.vaccineCode === 'string'
                                  ? selectedVaccines?.[index]?.vaccineCode
                                  : selectedVaccines?.[index]?.vaccineCode
                                      ?.coding?.[0]?.code
                              }
                              style={{ width: '100%' }}
                              options={vaccineInventory(
                                selectedVaccines?.[index]?.vaccine,
                                inventory
                              )?.map((item) => ({
                                value: item.batchNumber,
                                label: item.batchNumber,
                              }))}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'diseaseTarget']}
                            label="Disease Target"
                          >
                            <Input
                              placeholder={selectedVaccines[index].disease}
                              disabled
                            />
                          </Form.Item>
                        </div>
                      )
                    })}
                  </>
                )}
              </Form.List>
            </div>
          </Form>
        )}
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Popconfirm
            title="Are you sure you want to administer?"
            onConfirm={() => form.submit()}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button
              loading={loading}
              disabled={loading}
              type="primary"
              className="ml-4 btn-success text-sm font-semibold"
            >
              Administer
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  )
}
