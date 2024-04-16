import { Link, useNavigate, useParams } from 'react-router-dom'
import BaseTable from '../common/tables/BaseTable'
import Table from '../components/DataTable'
import { Button } from 'antd'
import ConvertObjectToArray from '../components/RegisterClient/convertObjectToArray'
import { useEffect, useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { calculateAges, getAgeAtDose } from '../utils/methods'
import usePatient from '../hooks/usePatient'
import useAefi from '../hooks/useAefi'
import dayjs from 'dayjs'

export default function VaccinationDetails() {
  const [patientInfo, setPatientInfo] = useState(null)
  const [doseInfo, setDoseInfo] = useState([])
  const [aefiInfo, setAefiInfo] = useState(null)
  const [clientInfo, setClientInfo] = useState([])
  const [vaccinationAEFIs, setVaccinationAEFIs] = useState([])
  const [vaccinationDetails, setVaccinationDetails] = useState(null)

  const { get } = useApiRequest()
  const { getPatient } = usePatient()
  const { getVaccineAefis } = useAefi()

  const navigate = useNavigate()
  const { vaccinationID } = useParams()

  const formatAefis = (aefis) => {
    return aefis.map((aefi) => {
      return {
        symptomName: aefi?.resource?.event?.coding?.[0]?.display,
        occurenceDate: dayjs(aefi?.resource?.detected).format('DD-MM-YYYY'),
      }
    })
  }

  const fetchPatientInfo = async (patientId) => {
    const response = await getPatient(patientId)
    setPatientInfo(response)
  }

  const fetchAefiInfo = async () => {
    const response = await getVaccineAefis(patientInfo.id, vaccinationID)
    setVaccinationAEFIs(formatAefis(response))
  }

  useEffect(() => {
    if (vaccinationDetails !== null) {
      fetchPatientInfo(vaccinationDetails?.patient?.reference?.split('/')[1])
      const timeFromLastDose = calculateAges(
        vaccinationDetails?.occurrenceDateTime
      )
      setDoseInfo(
        ConvertObjectToArray({
          'Dose administered':
            vaccinationDetails?.doseQuantity?.value.toString(),
          'Date of last dose': dayjs(
            vaccinationDetails?.occurrenceDateTime
          ).format('Do MMM YYYY'),
          'Days since last dose': timeFromLastDose.days.toString(),
          'Months since last dose': timeFromLastDose.months.toString(),
        })
      )
    }
  }, [vaccinationDetails])

  // console.log('vaccinationDetails', vaccinationDetails)
  // console.log('patientInfo', patientInfo)

  useEffect(() => {
    if (patientInfo) {
      fetchAefiInfo(patientInfo.id)
      const timeFromLastDose = calculateAges(
        vaccinationDetails?.occurrenceDateTime
      )
      setClientInfo(
        ConvertObjectToArray({
          'Years since last dose': timeFromLastDose.years.toString(),
          'Age at last dose': getAgeAtDose(
            patientInfo?.birthDate,
            vaccinationDetails?.occurrenceDateTime
          ),
          'Client has completed vaccine primary series':
            vaccinationDetails?.status === 'completed' ? 'YES' : 'NO',
        })
      )
    }
  }, [patientInfo])

  const columns = [
    {
      title: 'AEFI Type',
      dataIndex: 'symptomName',
      key: 'symptomName',
    },
    {
      title: 'Date Reported',
      dataIndex: 'occurenceDate',
      key: 'occurenceDate',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          disabled={true}
          onClick={() => {}}
          type="link"
          className="font-bold text=[#173C94]"
        >
          View
        </Button>
      ),
    },
  ]

  const fetchVaccinationDetails = async () => {
    const response = await get(`/hapi/fhir/Immunization/${vaccinationID}`)
    setVaccinationDetails(response)

    const vaccinationaefiresponses = await get(
      `/hapi/fhir/Observation?part-of=Immunization/${vaccinationID}`
    )

    if (
      Array.isArray(vaccinationaefiresponses) &&
      vaccinationaefiresponses.length
    ) {
      const type = vaccinationaefiresponses?.entry.find(
        (item) => item?.resource?.code?.text === 'Type of AEFI'
      )
      const date = vaccinationaefiresponses?.entry.find(
        (item) => item?.resource?.code?.text === 'Onset of event'
      )

      setVaccinationAEFIs([
        {
          symptomName:
            type?.resource?.valueCodeableConcept?.coding?.[0]?.display,
          occurenceDate: dayjs(
            date?.resource?.valueCodeableConcept?.coding?.[0]?.display
          ).format('Do MMM YYYY'),
          actions: [
            { title: 'edit', url: '#' },
            { title: 'view', url: '#' },
          ],
        },
      ])
    }
  }

  useEffect(() => {
    fetchVaccinationDetails()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 rounded-lg px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
          <div className="text-2xl font-semibold py-5">
            {vaccinationDetails?.protocolApplied?.[0]?.targetDisease?.[0]
              ?.text || 'Target Disease: '}
          </div>
          <Link
            to={`/view-contraindication/${vaccinationDetails?.id}`}
            className="ml-auto flex items-center gap-x-1 rounded-md bg-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Contraindications
          </Link>
        </div>

        <div className="px-10 text-2xl font-semibold bg-gray-200 py-5 sm:px-10">
          {vaccinationDetails?.vaccineCode?.text} (
          {vaccinationDetails?.vaccineCode?.coding?.[0]?.code})
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mx-7 px-10 py-10">
          <div>
            <BaseTable data={doseInfo} />
          </div>
          <div>
            <BaseTable data={clientInfo} />
          </div>
        </div>

        <div className="px-10 text-1xl font-semibold bg-gray-200 py-5 sm:px-10">
          AEFI
        </div>

        <div className="px-10 py-5">
          {!vaccinationAEFIs.length && (
            <>
              <div className="text-center">No AEFIs recorded</div>
            </>
          )}
          {vaccinationAEFIs.length > 0 && (
            <Table
              dataSource={vaccinationAEFIs}
              columns={columns}
              size="small"
              showHeader={false}
              pagination={false}
            />
          )}
        </div>

        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94"
          >
            Back
          </button>
        </div>
      </div>
    </>
  )
}
