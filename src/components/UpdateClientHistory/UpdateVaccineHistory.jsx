import TextInput from "../../common/forms/TextInput"
import { useNavigate } from "react-router-dom"

export default function UpdateVaccineHistory() {
  
  const navigate = useNavigate()

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Update Vaccine History
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-3 gap-10 mt-10">
          {/* Column 1 */}
          <div>

            <TextInput
              inputType="text"
              inputName="vaccineType"
              inputId="vaccineType"
              label="Vaccine Type"
              inputPlaceholder="Vaccine Type"/>

            <TextInput
              inputType="text"
              inputName="facilityAttached"
              inputId="facilityAttached"
              label="Date of last dose"
              inputPlaceholder="Date of last dose"/>
          </div>

          {/* Column 2 */}
          <div>
            <TextInput
              inputType="email"
              inputName="email"
              inputId="email"
              label="Type of last dose"
              inputPlaceholder="Type of last dose"/>
          </div>

          {/* Column 3 */}
          <div>
            <TextInput
              inputType="text"
              inputName="phoneNumber"
              inputId="phoneNumber"
              label="Place of vaccination"
              inputPlaceholder="Place of vaccination"/>

          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Cancel
        </button>
        <button
          className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Preview
        </button>
        
      </div>
    </div>
  )
}