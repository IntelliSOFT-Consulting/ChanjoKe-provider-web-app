import { Form, Input, Select, Button } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import useObservations from '../../hooks/useObservations'
import useVaccination from '../../hooks/useVaccination'
import {
  createImmunizationResource,
  getBodyWeight,
  updateVaccineDueDates,
} from './administerController'

export default function Administer() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const currentPatient = useSelector((state) => state.currentPatient)

  const { user } = useSelector((state) => state.userInfo)

  const selectedVaccines = useSelector((state) => state.selectedVaccines)

  const { getLatestObservation } = useObservations()

  const navigate = useNavigate()

  const { clientID } = useParams()

  const { createImmunization, updateImmunization, getRecommendations, updateRecommendations } =
    useVaccination()

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
      navigate(`/client-details/${clientID}`)
    } else {
      getWeight()
    }
  }, [selectedVaccines])

  const handleFormSubmit = async (values) => {
    setLoading(true)
    const selected = selectedVaccines.map((vaccine, index) => {
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

    if (responses) {
      setLoading(false)
      setDialogOpen(true)
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
        description="The vaccine has been successfully administered"
        onClose={() => navigate(-1)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 gap-10">
              <div className="col-span-2 border-b ">
                <Form.Item
                  name="currentWeight"
                  label="Current Weight"
                  className="w-1/2 addon"
                >
                  <Input
                    placeholder="Current Weight"
                    size="large"
                    addonAfter={
                      <Form.Item name="weightUnit">
                        <Select
                          defaultValue="Kg"
                          style={{ width: 70 }}
                          size="large"
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
                              size="large"
                            >
                              <Select.Option value="HDKKD8777847">
                                HDKKD8777847
                              </Select.Option>
                              <Select.Option value="OPVJJD788778">
                                OPVJJD788778
                              </Select.Option>
                              <Select.Option value="OPV667HHD889">
                                OPV667HHD889
                              </Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'diseaseTarget']}
                            label="Disease Target"
                          >
                            <Input
                              size="large"
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
          <Button
            onClick={() => navigate(-1)}
            className="ml-4  outline outline-[#163C94] text-sm font-semibold text-[#163C94]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => form.submit()}
            loading={loading}
            disabled={loading}
            type="primary"
            className="ml-4 btn-success text-sm font-semibold"
          >
            Administer
          </Button>
        </div>
      </div>
    </>
  )
}
