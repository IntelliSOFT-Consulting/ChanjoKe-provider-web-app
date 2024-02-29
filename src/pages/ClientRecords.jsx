import BaseTable from "../common/tables/BaseTable"
import SearchTable from "../common/tables/SearchTable"
import { useParams, useNavigate } from "react-router-dom"
import useGet from "../api/useGet"
import { useState, useEffect } from "react"
import ConvertObjectToArray from "../components/RegisterClient/convertObjectToArray"

export default function ClientRecords() {

  const [patientData, setPatientData] = useState({})

  const { clientID } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useGet(`Patient/${clientID}`)
  const administrativeAreaArray = [] //ConvertObjectToArray(administrativeArea)

  const [clientDetailsArray, setClientDetails] = useState([])
  const [caregiverDetails, setCaregiverDetails] = useState([])

  useEffect(() => {
    setPatientData(data)

    const clientDetails = {
      firstName: data?.name?.[0]?.family,
      lastName: data?.name?.[0]?.given[0],
      gender: data?.gender,
      dateOfBirth: data?.birthDate,
    }

    if (Array.isArray(data?.contact)) {
      const caregiverArray = data?.contact.map((caregiver) => {
        return {
          caregiverName: caregiver?.name?.given,
          caregiverType: caregiver?.relationship?.[0]?.text,
          phoneNumber: caregiver?.telecom?.[0]?.value,
        }
      })
      setCaregiverDetails(caregiverArray)
    }

    setClientDetails(ConvertObjectToArray(clientDetails))

    console.log({ data, clientDetails })
  }, [data])

  const tHeaders = [
    {title: 'Caregiver Name', class: '', key: 'caregiverName'},
    {title: 'Caregiver Relationship', class: '', key: 'caregiverType'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
  ]
  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Register Client
        </div>
        <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-10 mx-7">
          {/* Column 1 */}
          <div>
            <h2 className="text-xl font-semibold mb-5">
              Client Details
            </h2>

            <BaseTable data={clientDetailsArray} />

          </div>

          {/* Column 3 */}
          <div>
            <h2 className="text-xl font-semibold mb-5">
              Administrative Area
            </h2>

            <BaseTable data={administrativeAreaArray} />
          </div>

        </div>

        <div>
            <h2 className="text-xl font-semibold ml-7 mb-5 mt-5">
              Caregiver Details
            </h2>

            <SearchTable headers={tHeaders} data={caregiverDetails} />
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-6 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Back
          </button>
          <button
            className={'bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'}>
              Update records
          </button>
        </div>
      </div>
    </>
  )
}