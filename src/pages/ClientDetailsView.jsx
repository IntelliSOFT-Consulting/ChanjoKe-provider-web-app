import SelectDialog from '../common/dialog/SelectDialog'
import BaseTabs from '../common/tabs/BaseTabs'
import Table from '../components/DataTable'
import { useEffect, useState } from 'react'
import useGet from '../api/useGet'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingArrows from '../common/spinners/LoadingArrows'
import { useDispatch } from 'react-redux'
import { setCurrentPatient } from '../redux/actions/patientActions'
import usePatient from '../hooks/usePatient'
import { formatClientDetails } from '../components/ClientDetailsView/clientDetailsController'

export default function ClientDetailsView() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [patientData, setPatientData] = useState(null)

  const { clientID } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { getPatient, patient } = usePatient()
  const { data: immunizationData } = useGet(
    `Immunization?patient=Patient/${clientID}`
  )
  const { data: immunizationRecommendation } = useGet(
    `ImmunizationRecommendation?patient=Patient/${clientID}`
  )

  useEffect(() => {
    getPatient(clientID)
  }, [clientID])

  useEffect(() => {
    if (patient) {
      dispatch(setCurrentPatient(patient))
      setPatientData(formatClientDetails(patient))
    }
  }, [patient, immunizationData, immunizationRecommendation])

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false)
  }

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
          url: `/update-client-history/${patient?.id}`,
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
              onClick={() => navigate(`/client-records/${patient?.id}`)}
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
            {!patientData ? (
              <div className="my-10 mx-auto flex justify-center">
                <LoadingArrows />
              </div>
            ) : (
              <Table
                columns={tHeaders}
                dataSource={patientData ? [patientData] : []}
                pagination={false}
                loading={!patientData}
                size="small"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <BaseTabs
          userCategory={patientData?.clientCategory}
          userID={patient?.id}
          patientData={patient}
          patientDetails={patientData}
        />
      </div>
    </>
  )
}
