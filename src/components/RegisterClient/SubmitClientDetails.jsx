import BaseTable from "../../common/tables/BaseTable";
import SearchTable from "../../common/tables/SearchTable";
import ConvertObjectToArray from "./convertObjectToArray";
import dayjs from "dayjs";
import calculateAge from "../../utils/calculateAge";
import { useEffect, useState } from "react";

export default function ClientDetails({ clientDetails, caregiverDetails, administrativeArea, submitPatientDetails, handleBack }) {

  console.log({ clientDetails })

  const client = { ...clientDetails }
  const ageValue = client.estimatedAge === 'true' ? 'Actual' : 'Estimated'
  delete client.estimatedAge
  client.estimatedAge = ageValue

  const [tHeaders, setTHeaders] = useState([
    {title: 'Caregiver Name', class: '', key: 'caregiverName'},
    {title: 'Caregiver Relationship', class: '', key: 'caregiverType'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
  ])
  const [isOver18, setIsOver18] = useState(false)

  useEffect(() => {
    const date = dayjs(clientDetails?.dateOfBirth?.$d).format('YYYY-MM-DD')
    const stringAge = calculateAge(date)
    const age = stringAge.match(/(\d+)\s*year/i)
    if (age === null) {
      setIsOver18(false)
    } else if (parseInt(age[1]) >= 18) {
      setIsOver18(true)
      setTHeaders([
        {title: 'Next of kin type', class: '', key: 'caregiverType'},
        {title: 'Next of kin Name', class: '', key: 'caregiverName'},
        {title: 'Phone Number', class: '', key: 'phoneNumber'},
        {title: 'Actions', class: '', key: 'actions'},
      ])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver18, tHeaders])

  

  const administrative = { CountyOfResidence: administrativeArea.residenceCounty, ...administrativeArea }
  delete administrative.residenceCounty

  const clientDetailsArray = ConvertObjectToArray(client)
  const administrativeAreaArray = ConvertObjectToArray(administrative)

  return (
    <>
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
          {isOver18 ? 'Next of kin': 'Caregiver'} Details
        </h2>

        <SearchTable headers={tHeaders} data={caregiverDetails} />
      </div>

      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          onClick={handleBack}
          className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Back
        </button>
        <button
          onClick={submitPatientDetails}
          className="bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          Submit
        </button>      
      </div> 
    </>
  )
}