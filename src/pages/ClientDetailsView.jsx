import SelectDialog from '../common/dialog/SelectDialog'
import BaseTabs from '../common/tabs/BaseTabs'
import Table from '../components/DataTable'
import { useEffect, useState } from 'react'
import useGet from '../api/useGet'
import { useNavigate, useParams } from 'react-router-dom'
import calculateAge from '../utils/calculateAge'
import LoadingArrows from '../common/spinners/LoadingArrows'
import classifyUserByAge from '../components/ClientDetailsView/classifyUserByAge'
import { useDispatch } from 'react-redux'
import { setCurrentPatient } from '../redux/actions/patientActions'
import moment from 'moment'

export default function ClientDetailsView() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [patientData, setPatientData] = useState({})
  const [clientCategory, setClientCategory] = useState('')
  const [systemGenID, setSystemGenID] = useState('')

  const { clientID } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, loading, error } = useGet(`Patient/${clientID}`)
  const { data: immunizationData } = useGet(
    `Immunization?patient=Patient/${clientID}`
  )
  const { data: immunizationRecommendation } = useGet(
    `ImmunizationRecommendation?patient=Patient/${clientID}`
  )

  useEffect(() => {
    setPatientData(data)
    dispatch(setCurrentPatient(data))
    if (data?.identifier && Array.isArray(data?.identifier)) {
      const systemGenerated = data?.identifier.filter((id) =>
        id?.type?.coding?.[0]?.display === 'SYSTEM_GENERATED' ? id?.value : ''
      )
      setSystemGenID(systemGenerated?.[0]?.value)
    }

    if (patientData?.birthDate) {
      const category = classifyUserByAge(patientData?.birthDate)
      setClientCategory(category)
    }
  }, [data, patientData, immunizationData, immunizationRecommendation])

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false)
  }

  console.log('clientDetails', patientData)

  const stats = [
    {
      name: `${patientData?.name?.[0]?.given?.join(' ')} ${patientData?.name?.[0]?.family || ''}`,
      systemID: `${systemGenID || ''}`,
      dob: moment(patientData?.birthDate).format('Do MMM YYYY'),
      age: calculateAge(patientData?.birthDate),
      gender: patientData?.gender?.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      ),
    },
  ]

  const tHeaders = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'System ID', dataIndex: 'systemID', key: 'systemID' },
    { title: 'D.O.B', dataIndex: 'dob', key: 'dob' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
  ]

  return (
    <>
      <SelectDialog
        open={isDialogOpen}
        title="Info"
        description="Select Record to update"
        btnOne={{
          text: 'Client Record',
          url: `/update-client-history/${patientData?.id}`,
        }}
        btnTwo={{
          text: 'Vaccine Details',
          url: '/update-vaccine-history',
        }}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="flex justify-between px-4 text-2xl py-5 sm:px-6">
          <div className="text-3xl">Client Details</div>
          <div className="right-0">
            <button
              onClick={() => navigate(`/client-records/${patientData?.id}`)}
              className="ml-4 flex-shrink-0 rounded-md border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
            >
              View Client Details
            </button>
            <button
              onClick={() => setDialogOpen(true)}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
            >
              Update personal details
            </button>
          </div>
        </div>

        <div className="container px-3 py-3">
          <div className="overflow-auto">
            {!patientData?.name && (
              <div className="my-10 mx-auto flex justify-center">
                <LoadingArrows />
              </div>
            )}
            {patientData?.name && (
              <Table
                columns={tHeaders}
                dataSource={stats}
                pagination={false}
                size="small"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <BaseTabs
          userCategory={clientCategory}
          userID={patientData?.id}
          patientData={patientData}
        />
      </div>
    </>
  )
}
