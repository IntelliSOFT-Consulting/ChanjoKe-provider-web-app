import { Button, Descriptions } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingArrows from '../common/spinners/LoadingArrows'
import AEFIDetails from '../components/AEFI/AEFIDetails'
import usePatient from '../hooks/usePatient'
import useVaccination from '../hooks/useVaccination'
import { calculateAges, getAgeAtDose } from '../utils/methods'
import { allVaccines } from '../data/vaccineData'
import { all } from 'axios'

export default function VaccinationDetails() {
  const [patientInfo, setPatientInfo] = useState(null)
  const [seriesCompleted, setSeriesCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  const { getPatient } = usePatient()

  const { getImmunization, getImmunizations, immunizations, immunization } =
    useVaccination()

  const navigate = useNavigate()
  const { vaccinationID } = useParams()

  const fetchPatientInfo = async (patientId) => {
    const response = await getPatient(patientId)
    await getImmunizations(patientId)
    setPatientInfo(response)
    setLoading(false)
  }

  useEffect(() => {
    getImmunization(vaccinationID)
  }, [])

  useEffect(() => {
    if (immunization) {
      fetchPatientInfo(immunization?.patient?.reference?.split('/')[1])
    }
  }, [immunization])

  useEffect(() => {
    if (immunizations) {
      setSeriesCompleted(isSeriesCompleted(immunization, immunizations))
    }
  }, [immunizations])

  const isSeriesCompleted = (immunization, immunizations) => {
    const nhdd = immunization?.vaccineCode?.coding?.[0]?.code
    const vaccineSeries = allVaccines.filter((v) => v.nhddCode === nhdd)

    return vaccineSeries?.length === immunizations?.length
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingArrows />
        </div>
      ) : (
        <>
          <div className="flex w-full justify-between bg-[#f9fafb00] items-center gap-6 rounded-lg px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
            <div className="text-2xl font-semibold py-5">
              {`${patientInfo?.name?.[0]?.given?.join(' ')} ${
                patientInfo?.name?.[0]?.family
              }`.trim()}
            </div>
            <div className="flex">
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/view-not-administered/${immunization?.id}`)
                }
                className="mr-2"
              >
                Not Administered
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/view-contraindication/${immunization?.id}`)
                }
              >
                Contraindications
              </Button>
            </div>
          </div>

          <div className="px-10 text-2xl font-semibold bg-gray-200 py-5 sm:px-10">
            {immunization?.vaccineCode?.text}
          </div>

          <div className="px-10 py-2">
            <Descriptions
              title="Vaccination Details"
              bordered
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              labelStyle={{ fontWeight: 'bold', color: 'black' }}
              size="small"
              contentStyle={{ color: 'black' }}
              style={{
                borderRadius: '0px',
              }}
            >
              <Descriptions.Item label="Dose administered">
                {immunization?.doseQuantity?.value}
              </Descriptions.Item>
              <Descriptions.Item label="Date of last dose">
                {dayjs(immunization?.occurrenceDateTime).format('Do MMM YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Days since last dose">
                {calculateAges(immunization?.occurrenceDateTime).days}
              </Descriptions.Item>
              <Descriptions.Item label="Months since last dose">
                {calculateAges(immunization?.occurrenceDateTime).months}
              </Descriptions.Item>
              <Descriptions.Item label="Years since last dose">
                {calculateAges(immunization?.occurrenceDateTime).years}
              </Descriptions.Item>
              <Descriptions.Item label="Age at last dose">
                {getAgeAtDose(
                  patientInfo?.birthDate,
                  immunization?.occurrenceDateTime
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Client has completed vaccine primary series">
                {seriesCompleted ? 'Yes' : 'No'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div className="px-10 text-1xl font-semibold bg-gray-200 py-5 sm:px-10">
            AEFI
          </div>

          <div className="px-10 py-5">
            <AEFIDetails patientInfo={patientInfo} />
          </div>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94"
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  )
}
