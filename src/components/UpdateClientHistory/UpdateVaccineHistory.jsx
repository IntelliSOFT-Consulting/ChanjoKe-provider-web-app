import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { Button, DatePicker, Form, Select } from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'
import useVaccination from '../../hooks/useVaccination'
import { formatRecommendationsToObject } from '../ClientDetailsView/clientDetailsController'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import {
  createImmunizationResource,
  updateVaccineDueDates,
} from '../AdministerVaccines/administerController'

export default function UpdateVaccineHistory() {
  const navigate = useNavigate()
  const [missedVaccinesList, setMissedVaccinesList] = useState(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const { clientID } = useParams()
  const { user } = useSelector((state) => state.userInfo)

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
    setMissedVaccinesList(formattedVaccines)
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
    values.description = 'Late vaccination entry.'
    values.occurrence = new Date(
      values.dateOfLastDose?.format('YYYY-MM-DD')
    ).toISOString()
    const selectedVaccine = missedVaccinesList.find(
      (vaccine) => vaccine.vaccine === values.vaccineType
    )

    selectedVaccine.status = 'completed'
    const resource = createImmunizationResource(
      values,
      [selectedVaccine],
      { id: clientID },
      user
    )

    const response = await createImmunization(resource[0])

    const updatedDueDates = updateVaccineDueDates(recommendations, [
      selectedVaccine,
    ])

    await updateRecommendations(updatedDueDates)
    if (response) {
      setDialogOpen(true)

      const timeout = setTimeout(() => {
        setDialogOpen(false)
        navigate(`/client-details/${clientID}`)
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
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Update Vaccine History
        </div>

        {missedVaccinesList ? (
          <Form layout="vertical" onFinish={handleFinish}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                <Form.Item
                  label="Vaccine Type"
                  rules={[
                    { required: true, message: 'Please select a vaccine' },
                  ]}
                  name="vaccineType"
                >
                  <Select
                    placeholder="Select a vaccine"
                    options={missedVaccinesList?.map((vaccine) => {
                      return { label: vaccine.vaccine, value: vaccine.vaccine }
                    })}
                    allowClear
                    size="large"
                    showSearch
                    filterOption={(input, option) =>{
                      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Date of last dose"
                  rules={[{ required: true, message: 'Please select a date' }]}
                  name="dateOfLastDose"
                >
                  <DatePicker
                    placeholder="Select a date"
                    allowClear
                    size="large"
                    className="w-full"
                    disabledDate={(current) =>
                      current && current > moment().endOf('day')
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
                  name="placeOfVaccination"
                >
                  <Select
                    placeholder="Select a place of vaccination"
                    options={[
                      { label: 'Facility', value: 'facility' },
                      { label: 'Outreach', value: 'outreach' },
                    ]}
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>
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
          <div className="my-10 mx-auto flex justify-center">
            <LoadingArrows />
          </div>
        )}
      </div>
    </>
  )
}
