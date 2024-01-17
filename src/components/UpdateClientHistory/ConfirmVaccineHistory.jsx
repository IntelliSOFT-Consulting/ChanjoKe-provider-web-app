import BaseTable from "../../common/tables/BaseTable"

export default function ConfirmVaccineHistory() {
  const doseNType = [
    { title: 'Vaccine Type', value: 'BCG' },
    { title: 'Number of last dose', value: '2' }
  ]

  const vaccinationDetails = [
    { title: 'Place of vaccination', value: 'Clinic ABS' },
    { title: 'Date of last dose', value: '20th Jan 2020' }
  ]

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Update Vaccine History
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-10 mt-10">
          {/* Column 1 */}
          <div>

            <BaseTable data={doseNType} />
          </div>

          {/* Column 2 */}
          <div>

            <BaseTable data={vaccinationDetails} />
          </div>

        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Cancel
        </button>
        <button
          className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
        
      </div>
    </div>
  )
}