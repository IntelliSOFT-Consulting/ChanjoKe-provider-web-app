import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useSharedState } from '../../shared/sharedState'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createVaccineImmunization } from '../ClientDetailsView/DataWrapper'
import { useApiRequest } from '../../api/useApiRequest'
import { useSelector } from 'react-redux'
import { Form, Input, Select } from 'antd'
import useObservations from '../../hooks/useObservations'
import moment from 'moment'

export default function BatchNumbers() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { sharedData } = useSharedState()
  const { post } = useApiRequest()

  const [form] = Form.useForm()

  const currentPatient = useSelector((state) => state.currentPatient)

  const { getLatestObservation } = useObservations()

  const navigate = useNavigate()

  const getWeight = async () => {
    const observation = await getLatestObservation(currentPatient.id)
    const today = moment().format('YYYY-MM-DD')
    const observationDate = observation.resource.meta.lastUpdated.split('T')[0]

    if (observation && observationDate === today) {
      const weight = observation.resource.code?.text

      form.setFieldValue('currentWeight', weight)
    }
  }

  useEffect(() => {
    if (!sharedData || sharedData?.length === 0) {
      navigate(-1)
    } else {
      getWeight()
    }
  }, [sharedData])

  const handleFormSubmit = async () => {
    if (Array.isArray(sharedData) && sharedData.length > 0) {
      const data = sharedData.map((immunization) => {
        return createVaccineImmunization(
          immunization,
          currentPatient.id,
          'completed'
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
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Vaccination data updated successfully`}
        onClose={() => navigate(-1)}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Administer Vaccine
        </div>
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
                        <Select.Option value="Kg">Kg</Select.Option>
                        <Select.Option value="g">g</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                />
              </Form.Item>
            </div>

            <Form.List
              name="vaccines"
              initialValue={sharedData?.map((vaccine) => ({
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
                        >
                          <Select
                            placeholder={
                              sharedData[index].vaccineCode?.coding[0].code
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
                            placeholder={sharedData[index].diseaseTarget}
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
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            onClick={() => form.submit()}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Administer
          </button>
        </div>
      </div>
    </>
  )
}
