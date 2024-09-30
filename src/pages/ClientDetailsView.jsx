import { WarningTwoTone } from '@ant-design/icons'
import { Button, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingArrows from '../common/spinners/LoadingArrows'
import BaseTabs from '../common/tabs/BaseTabs'
import {
  formatClientDetails,
  formatWeightData,
  groupVaccinesByCategory,
} from '../components/ClientDetailsView/clientDetailsController'
import WeightChart from '../components/ClientDetailsView/WeightChart'
import Table from '../components/DataTable'
import useObservations from '../hooks/useObservations'
import usePatient from '../hooks/usePatient'
import useVaccination from '../hooks/useVaccination'
import { setCurrentPatient } from '../redux/slices/patientSlice'
import { setVaccineSchedules } from '../redux/slices/vaccineSlice'
import { useAccess } from '../hooks/useAccess'

export default function ClientDetailsView() {
  const [patientData, setPatientData] = useState(null)
  const [routineVaccines, setRoutineVaccines] = useState([])
  const [nonRoutineVaccines, setNonRoutineVaccines] = useState([])
  const [observationsData, setObservationsData] = useState([])
  const [caregiverRefusal, setCaregiverRefusal] = useState(false)

  const { clientID, activeTab } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const queryParams = window.location.search?.split('=')?.[1]

  const { getPatient, patient } = usePatient()
  const { canAccess } = useAccess()
  const {
    getRecommendations,
    getImmunizations,
    immunizations,
    recommendations,
  } = useVaccination()

  const { getObservations, observations } = useObservations()

  const fetchData = () => {
    getPatient(clientID)
    getRecommendations(clientID)
    getImmunizations(clientID)
    getObservations(clientID)
  }

  useEffect(() => {
    fetchData()
  }, [clientID])

  useEffect(() => {
    if (patient) {
      dispatch(setCurrentPatient(patient))
      setPatientData(formatClientDetails(patient))
    }
  }, [patient])

  function checkImmunizations(immunizations) {
    const notDoneItem = immunizations.find(item => item.status === 'not-done');
    
    if (!notDoneItem) {
        return false;
    }
    
    return notDoneItem.statusReason && notDoneItem.statusReason.text === 'Caregiver refusal';
}

  useEffect(() => {
    if (recommendations) {
      const groupedVaccines = groupVaccinesByCategory(
        recommendations?.recommendation,
        immunizations
      )

      setRoutineVaccines(groupedVaccines.routine)
      setNonRoutineVaccines(groupedVaccines.non_routine)
      dispatch(setVaccineSchedules(groupedVaccines.routine))
    }

    if (observations) {
      setObservationsData(formatWeightData(observations, patient?.birthDate))
    }

    if (immunizations) {
      const caregiverRefusal = checkImmunizations(immunizations)
      setCaregiverRefusal(caregiverRefusal)
    }

  }, [immunizations, recommendations, observations])


  const tHeaders = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'System ID', dataIndex: 'systemID', key: 'systemID' },
    { title: 'D.O.B', dataIndex: 'dob', key: 'dob' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Sex', dataIndex: 'gender', key: 'gender' },
  ]

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="flex justify-between items-center px-4 text-2xl py-2 sm:px-6">
          <div className="text-xl">
          Client Details
          {patientData?.deceased && (
            <Tag color="red" className="ml-2">
              Deceased
            </Tag>
          )}
          </div>
          <div className="right-0">
            <Button
              onClick={() => navigate(`/client-records/${patient?.id}`)}
              className="ml-4 border-1 border-[#163C94] outline-1 outline-[#163C94] text-[#163C94] font-semibold"
            >
              View Client Details
            </Button>
            {!patientData?.deceased && canAccess('VACCINATION_HISTORY') && (
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/update-vaccine-history/${patient?.id}`)
                }
                className="ml-4 font-semibold"
              >
                Update vaccine history
              </Button>
            )}
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="overflow-auto">
            {!patientData ? (
              <div className="my-10 mx-auto flex justify-center">
                <LoadingArrows />
              </div>
            ) : (
              <div className="flex flex-col  md:flex-row w-full md:space-x-2">
                <Table
                  columns={tHeaders}
                  dataSource={patientData ? [patientData] : []}
                  pagination={false}
                  loading={!patientData}
                  size="small"
                  className="w-full"
                />
                {patientData?.hasNotificationOnly && (
                  <div className="flex mt-2 md:mt-0 items-center bg-pink py-2 px-4 rounded-md ml-0 h-full my-0 max-w-full md:max-w-xs ">
                    <WarningTwoTone
                      twoToneColor="red"
                      classID="text-black text-6xl"
                    />
                    <div className="ml-2 text-sm">
                      This client is registered using a{' '}
                      <b>Birth Notification Number</b>, Please update to their{' '}
                      <b>Birth Certificate</b>.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {observations && <WeightChart weights={observationsData} />}
      </div>

      <div className="mt-4">
        <BaseTabs
          userCategory={patientData?.clientCategory}
          queryParams={queryParams}
          userID={patient?.id}
          patientData={patient}
          patientDetails={patientData}
          routineVaccines={routineVaccines}
          nonRoutineVaccines={nonRoutineVaccines}
          recommendations={recommendations}
          caregiverRefusal={caregiverRefusal}
          activeTab={activeTab}
          immunizations={immunizations}
          fetchData={fetchData}
        />
      </div>
    </>
  )
}
