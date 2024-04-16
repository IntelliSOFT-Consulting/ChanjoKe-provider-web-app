import moment from 'moment'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useSharedState } from '../../shared/sharedState'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createVaccineImmunization } from '../ClientDetailsView/DataWrapper'
import { useNavigate } from 'react-router-dom'
import { useApiRequest } from '../../api/useApiRequest'
import { DatePicker, Form, Select } from 'antd'

export default function NotAdministered() {
  const navigate = useNavigate()
  const { sharedData } = useSharedState()
  const [form] = Form.useForm()

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [vaccines, setVaccines] = useState([])
  const [vaccinesToSelect, setVaccinesToSelect] = useState([])

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

  const currentPatient = useSelector((state) => state.currentPatient)
  const { put } = useApiRequest()

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
    navigate(-1)
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
        'not-done'
      )
    })

    const responses = await Promise.all(
      data?.map(async (administerVaccine, index) => {
        const vaccineId = selectedVaccines[index].id
        return await put(`/hapi/fhir/Immunization/${vaccineId}`, {
          ...administerVaccine,
          id: vaccineId,
        })
      })
    )

    if (responses) {
      setDialogOpen(true)
      const time = setTimeout(() => {
        setDialogOpen(false)
        navigate(`/client-details/${currentPatient.id}`)
      }, 2000)
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
          {vaccines.length > 0 && (
            <Form
              layout="vertical"
              onFinish={handleFormSubmit}
              form={form}
              initialValues={{
                vaccinesToContraindicate: vaccinesToSelect.map(
                  (vaccine) => vaccine.value
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
                        const selected = vaccines.filter((vaccine) =>
                          value.includes(vaccine.vaccineName)
                        )

                        const notDone = selected.filter(
                          (vaccine) => vaccine.status === 'not-done'
                        )
                        if (notDone.length > 0) {
                          const vaccineNames = notDone
                            .map((item) => item.vaccineName)
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
                    options={vaccinesToSelect}
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
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              form.submit()
            }}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}
