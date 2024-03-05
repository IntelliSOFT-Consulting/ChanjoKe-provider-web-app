import TextInput from "../../common/forms/TextInput"
import SelectMenu from "../../common/forms/SelectMenu"
import { useNavigate } from "react-router-dom"
import FormState from "../../utils/formState"
import { useState } from "react"
import ConfirmDialog from "../../common/dialog/ConfirmDialog"

export default function UpdateVaccineHistory() {
  
  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const vaccines = [
    { name: 'bOPV', value: 'bOPV'}
  ]

  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }

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
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Vaccine history updated successfully`}
        onClose={handleDialogClose} />
      
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
            <SelectMenu
                label="Dose"
                required={true}
                data={[{ name: 'Dose 1', value: '1'}]}
                value={formData.doseNumber || 'Dose Number'}
                onInputChange={(value) => handleChange('doseNumber', value.name)}
              />
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
            onClick={() => setDialogOpen(true)}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Submit
          </button>
          
        </div>
      </div>
    </>
  )
}