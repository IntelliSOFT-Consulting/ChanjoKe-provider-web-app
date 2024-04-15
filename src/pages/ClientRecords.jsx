import BaseTable from "../common/tables/BaseTable"
import SearchTable from "../common/tables/SearchTable"
import { useParams, useNavigate } from "react-router-dom"
import useGet from "../api/useGet"
import { useState, useEffect } from "react"
import ConvertObjectToArray from "../components/RegisterClient/convertObjectToArray"
import moment from "moment"
import calculateAge from "../utils/calculateAge"

function convertCamelCaseString(inputString) {
  let stringWithSpaces = inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
  stringWithSpaces = stringWithSpaces.replace(/\b\w+/g, (word) => {
    // Check if the word includes 'of', and if so, keep it lowercase
    if (word.toLowerCase().includes('of')) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return stringWithSpaces;
}

export default function ClientRecords() {

  const { clientID } = useParams()
  const navigate = useNavigate()
  const { data } = useGet(`Patient/${clientID}`)

  const [clientDetailsArray, setClientDetails] = useState([])
  const [caregiverDetails, setCaregiverDetails] = useState([])
  const [administrativeAreaArray, setAreaDetails] = useState([])
  const [isOver18, setIsOver18] = useState(false)
  const [tHeaders, setTHeaders] = useState([
    {title: 'Caregiver Name', class: '', key: 'caregiverName'},
    {title: 'Caregiver Relationship', class: '', key: 'caregiverType'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
  ])

  useEffect(() => {
    let identificationType = ''
    let identificationNumber = ''
    if (data?.identifier && Array.isArray(data?.identifier)) {
      const userID = data?.identifier.filter((id) => (id?.system === 'identification_type' || id?.system === 'identification' ))
      identificationType = userID?.[0]?.type?.coding?.[0]?.display || userID?.[0]?.system
      identificationNumber = userID?.[0]?.value
    }

    const clientDetails = {
      'First Name': data?.name?.[0]?.family,
      'Last Name': data?.name?.[0]?.given[0],
      'Middle Name': data?.name?.[0]?.given[1],
      'Gender': data?.gender,
      'Date of Birth': moment(data?.birthDate).format('DD-MM-YYYY'),
      'Identification Type': convertCamelCaseString(identificationType),
      'Identification Number': identificationNumber,
    }

    if (data?.telecom?.[0]?.value) {
      clientDetails['Phone Number'] = data?.telecom?.[0]?.value;
    }

    const addressDetails = {
      'County of Residence': data?.address?.[0]?.city,
      'Sub-County': data?.address?.[0].district,
      'Ward': data?.address?.[0].state,
      'Town/Trading Center': data?.address?.[0].line?.[0],
      'Estate & House Number/Village': data?.address?.[0].line?.[1]
    }

    if (Array.isArray(data?.contact)) {
      const caregiverArray = data?.contact.map((caregiver) => {
        return {
          caregiverName: caregiver?.name?.given || caregiver?.name?.family,
          caregiverType: caregiver?.relationship?.[0]?.text,
          phoneNumber: caregiver?.telecom?.[0]?.value,
        }
      })
      setCaregiverDetails(caregiverArray)
    }

    const date = moment(data?.birthDate).format('YYYY-MM-DD')
    const stringAge = calculateAge(date)
    const age = stringAge.match(/(\d+)\s*year/i)
    if (age === null) {
      setIsOver18(false)
    } else if (parseInt(age[1]) >= 18) {
      setIsOver18(true)
      setTHeaders([
        {title: 'Next of Kin Type', class: '', key: 'caregiverType'},
        {title: 'Next of Kin Name', class: '', key: 'caregiverName'},
        {title: 'Phone Number', class: '', key: 'phoneNumber'},
      ])
    }

    setClientDetails(ConvertObjectToArray(clientDetails))
    setAreaDetails(ConvertObjectToArray(addressDetails))
  }, [data])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-4 flex justify-end px-14">
          <button
            onClick={() => navigate(`/register-client/${clientID}`)}
            className={'bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'}>
              Update records
          </button>
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
              {isOver18 ? 'Next of Kin': 'Caregiver'} Details
            </h2>

            <SearchTable headers={tHeaders} data={caregiverDetails} />
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 flex justify-end mx-9">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-6 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Back
          </button>
          
        </div>
      </div>
    </>
  )
}