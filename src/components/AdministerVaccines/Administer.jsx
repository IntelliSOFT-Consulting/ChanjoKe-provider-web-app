import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Alert,
  Spin,
  Space,
  Divider
} from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState, useMemo } from 'react'
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
  updateVaccineDueDates,
} from './administerController'
import { MinusCircleOutlined, LoadingOutlined } from '@ant-design/icons'

export default function Administer() {
  // State Management
  const [inventory, setInventory] = useState(null)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [nextVaccines, setNextVaccines] = useState({})
  const [isEmpty, setIsEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Custom Hooks
  const {
    getDetailedInventoryItems,
    batchItems,
    updateInventory,
  } = useInventory()

  const {
    createImmunization,
    updateImmunization,
    getRecommendations,
    updateRecommendations,
  } = useVaccination()

  const { createEncounter } = useEncounter()
  const {
    createAppointment,
    getFacilityAppointments,
    facilityAppointments
  } = useAppointment()

  // Form Management
  const [form] = Form.useForm()
  const [nextVaccineForm] = Form.useForm()

  // Redux State
  const { currentPatient } = useSelector((state) => state.currentPatient)
  const { user } = useSelector((state) => state.userInfo)
  const { selectedVaccines, vaccineSchedules } = useSelector(
    (state) => state.vaccineSchedules
  )

  const { getLatestObservation, createObservation } = useObservations()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { clientID } = useParams()

  // Memoized Inventory
  const formattedInventory = useMemo(() => {
    return batchItems ? formatInventoryToTable(batchItems) : []
  }, [batchItems])

  useEffect(() => {
    setInventory(formattedInventory)
  }, [formattedInventory])

  const findNextVaccines = async () => {
    try {
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
    } catch (err) {
      setError('Failed to fetch next vaccines')
      console.error('Error finding next vaccines:', err)
    }
  }

  const getPatientMetrics = async () => {
    try {
      const observation = await getLatestObservation(clientID)
      const today = moment().format('YYYY-MM-DD')
      const observationDate = observation?.resource?.meta?.lastUpdated?.split('T')[0]

      if (observation && observationDate === today) {
        const weight = getBodyWeight(observation?.resource)
        form.setFieldsValue(weight)
      }
    } catch (err) {
      setError('Failed to fetch patient metrics')
      console.error('Error getting patient metrics:', err)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      if (!selectedVaccines || selectedVaccines?.length === 0) {
        navigate(`/client-details/${clientID}/routineVaccines`)
        return
      }

      try {
        await Promise.all([
          getPatientMetrics(),
          findNextVaccines(),
          getDetailedInventoryItems()
        ])
      } catch (err) {
        setError('Failed to initialize data')
        console.error('Error initializing data:', err)
      }
    }

    initializeData()
  }, [selectedVaccines])

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true)
      setError(null)

      const selected = selectedVaccines.map((item, index) => ({
        ...item,
        batchNumber: values.vaccines[index].batchNumber,
        status: 'completed'
      }))

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
        setDialogOpen(true)
      }
    } catch (err) {
      setError('Failed to submit form')
      console.error('Error submitting form:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNextDueDateChange = async (values) => {
    try {
      const vaccineType = selectedVaccines[0].type === 'non-routine' ? 'type=non-routine' : ''
      const newScheduleDate = dayjs(values.nextDueDate).format('YYYY-MM-DD')
      const previousScheduleDate = dayjs(nextVaccines?.nextScheduleDate).format('YYYY-MM-DD')

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

      if (!vaccineType && newScheduleDate === previousScheduleDate) {
        const appointmentNext = createNextVaccineAppointment(
          nextVaccines.nextContent,
          clientID,
          user
        )

        await createAppointment(appointmentNext)
      }

      setDialogOpen(false)
      dispatch(setSelectedVaccines([]))
      navigate(-1)
    } catch (err) {
      setError('Failed to update next due date')
      console.error('Error updating next due date:', err)
    }
  }

  return (
    <div className="mx-0 ">
      <ConfirmDialog
        open={isDialogOpen}
        description={
          <div className="space-y-4">
            <p className="text-lg">The vaccines have been successfully administered!</p>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              {isDialogOpen && (
                <Form
                  form={nextVaccineForm}
                  onFinish={handleNextDueDateChange}
                  initialValues={{
                    nextDueDate: dayjs(nextVaccines?.nextScheduleDate),
                  }}
                  layout="vertical"
                >
                  <h3 className="text-lg font-medium text-primary mb-4">
                    Next Vaccine Appointment
                  </h3>

                  <Space direction="vertical" className="w-full">
                    <Form.Item
                      name="nextDueDate"
                      label="Next Due Date"
                      rules={[{ required: true, message: 'Please select next due date' }]}
                    >
                      <DatePicker
                        className="w-full"
                        disabledDate={(current) => current && current < moment().endOf('day')}
                        format="DD-MM-YYYY"
                        onChange={async (date) => {
                          await getFacilityAppointments(date?.format('YYYY-MM-DD'))
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="numberOfAppointments"
                      label="Number of Appointments"
                    >
                      <Input
                        placeholder={facilityAppointments?.length || 0}
                        disabled
                      />
                    </Form.Item>
                  </Space>
                </Form>
              )}
            </div>
          </div>
        }
        onClose={() => nextVaccineForm.submit()}
        cancelText="Save"
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Administer Vaccine
          </h2>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="mx-6 mt-4"
            onClose={() => setError(null)}
          />
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        )}

        {selectedVaccines?.length > 0 && (
          <Form
            className="px-6 py-6"
            layout="vertical"
            form={form}
            onFinish={handleFormSubmit}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  name="currentWeight"
                  label="Current Weight"
                  rules={[{ required: true, message: 'Please enter current weight' }]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter weight"
                    controls={false}
                    addonAfter={
                      <Form.Item name="weightMetric" noStyle>
                        <Select defaultValue="kg" style={{ width: 70 }}>
                          <Select.Option value="kg">Kg</Select.Option>
                          <Select.Option value="g">g</Select.Option>
                        </Select>
                      </Form.Item>
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="currentHeight"
                  label="Height"
                  rules={[{ required: true, message: 'Please enter height' }]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter height"
                    controls={false}
                    addonAfter={
                      <Form.Item name="heightMetric" noStyle>
                        <Select defaultValue="cm" style={{ width: 70 }}>
                          <Select.Option value="cm">cm</Select.Option>
                          <Select.Option value="m">m</Select.Option>
                        </Select>
                      </Form.Item>
                    }
                  />
                </Form.Item>
              </div>

              <Divider />

              <Form.List
                name="vaccines"
                initialValue={selectedVaccines?.map((vaccine) => ({
                  batchNumber: vaccine.batchNumber,
                  diseaseTarget: vaccine.diseaseTarget,
                }))}
              >
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields?.map((field, index) => (
                      <div
                        key={field.key}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative pr-12"
                      >
                        <Form.Item
                          name={[field.name, 'batchNumber']}
                          label={`Batch Number for ${selectedVaccines[index].vaccine}`}
                          rules={[
                            {
                              required: true,
                              message: 'Please select batch number',
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select batch number"
                            className="w-full"
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
                        <Button
                          onClick={() => {
                            remove(field.name)
                            if (fields.length === 1) {
                              setIsEmpty(true)
                            }
                          }}
                          icon={<MinusCircleOutlined />}
                          className="absolute right-0 top-8"
                          type="link"
                          danger
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => navigate(-1)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Popconfirm
                  title="Confirm Administration"
                  description="Are you sure you want to administer these vaccines?"
                  onConfirm={() => form.submit()}
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                  okButtonProps={{
                    className: 'btn-success'
                  }}
                >
                  <Button
                    loading={loading}
                    disabled={loading || isEmpty}
                    type="primary"
                    className="btn-success px-6"
                  >
                    Administer
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </Form>
        )}

        {!selectedVaccines?.length && !loading && (
          <div className="px-6 py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No Vaccines Selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select vaccines to administer from the routine vaccines section.
              </p>
              <div className="mt-6">
                <Button
                  type="primary"
                  onClick={() => navigate(`/client-details/${clientID}/routineVaccines`)}
                >
                  Select Vaccines
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}