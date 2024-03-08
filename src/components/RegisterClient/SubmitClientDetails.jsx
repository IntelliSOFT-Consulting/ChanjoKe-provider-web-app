import BaseTable from "../../common/tables/BaseTable";
import SearchTable from "../../common/tables/SearchTable";
import ConvertObjectToArray from "./convertObjectToArray";

export default function ClientDetails({ clientDetails, caregiverDetails, administrativeArea, submitPatientDetails, handleBack }) {

  const clientDetailsArray = ConvertObjectToArray(clientDetails)
  const administrativeAreaArray = ConvertObjectToArray(administrativeArea)

  const tHeaders = [
    {title: 'Caregiver Name', class: '', key: 'caregiverName'},
    {title: 'Caregiver Relationship', class: '', key: 'caregiverType'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
  ]

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
          Caregiver Details
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