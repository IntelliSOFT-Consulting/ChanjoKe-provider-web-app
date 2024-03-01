import TextInput from "../../common/forms/TextInput"
import SelectMenu from "../../common/forms/SelectMenu"
import { useNavigate } from "react-router-dom"
import FormState from "../../utils/formState"

export default function UpdateVaccineHistory() {
  
  const navigate = useNavigate()

  const vaccines = [
    { name: 'bOPV', value: 'bOPV'}
  ]

  const { formData, formErrors, handleChange } = FormState({
    vaccineType: '',
    doseNumber: '',
    vaccinationFacility: '',
    dateOfLastDose: '',
  }, {
    vaccineType: {
      required: true,
    },
    doseNumber: {
      required: true,
    },
    vaccinationFacility: {
      required: true,
    },
    dateOfLastDose: {
      required: true,
    },
  })

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Update Vaccine History
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-3 gap-10 mt-10">
          {/* Column 1 */}
          <div>

            <SelectMenu
              label="Vaccine Type"
              required={true}
              data={vaccines}
              value={formData.vaccineType || 'Vaccine Type'}
              onInputChange={(value) => handleChange('vaccineType', value.name)}
            />

            <TextInput
              inputType="date"
              inputName="lastDose"
              inputId="lastDose"
              label="Date of last dose"
              required={true}
              value={formData.lastDose}
              error={formErrors.lastDose}
              onInputChange={(value) => handleChange('lastDose', value)}/>
          </div>

          {/* Column 2 */}
          <div>
            <TextInput
              inputType="text"
              inputName="doseNumber"
              inputId="doseNumber"
              label="Dose"
              required={true}
              value={formData.doseNumber}
              error={formErrors.doseNumber}
              onInputChange={(value) => handleChange('doseNumber', value)}
              inputPlaceholder="Dose Number"/>
          </div>

          {/* Column 3 */}
          <div>
            <SelectMenu
              label="Place of Vaccination"
              required={true}
              data={[{ name: 'Facility', value: 'facility' }, { name: 'Outreach', value: 'outreach' }]}
              value={formData.placeOfVaccination || 'Place of Vaccination'}
              onInputChange={(value) => handleChange('placeOfVaccination', value.name)}
            />

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