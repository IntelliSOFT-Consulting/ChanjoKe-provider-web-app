import TextInput from "../../common/forms/TextInput"
import SelectMenu from "../../common/forms/SelectMenu"
import TextArea from "../../common/forms/TextArea"
import FormState from "../../utils/formState"
import ConfirmDialog from "../../common/dialog/ConfirmDialog"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Contraindications() {
  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const { formData, formErrors, handleChange } = FormState({
    vaccinesToContraindicate: '',
    batchNumbers: [],
    contraindicationDetails: '',
    nextVaccinationDate: '',
  }, {})

  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Contraindication saved successfully`}
        onClose={handleDialogClose} />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Contraindications
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-2 gap-36 px-6 gap-10">
            <div>

              <SelectMenu
                data={[{ name: '778377443'}, { name: '78788888'}]}
                error={formErrors.identificationType}
                required={true}
                label="Vaccines to Contraindicate"
                value={formData.vaccinesToContraindicate || 'Vaccines to Contraindicate'}
                onInputChange={(value) => handleChange('vaccinesToContraindicate', value.name)}/>

              <div className="py-4 flex justify-end">
                <button
                  className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add
                </button>
                
              </div>

            </div>

            <div>
              <TextArea
                  inputName="contraindicationDetails"
                  label="Contraindication Details"
                  value={formData.contraindicationDetails}
                  error={formErrors.contraindicationDetails}
                  onInputChange={(value) => handleChange('contraindicationDetails', value)}
                  required={true}
                  rows="4"
                  cols="50"
                  inputPlaceholder="Enter Contraindications"/>

                <TextInput
                  inputType="date"
                  inputName="nextVaccinationDate"
                  inputId="nextVaccinationDate"
                  required={true}
                  label="Next vaccination date"
                  value={formData.nextVaccinationDate}
                  onInputChange={(value) => handleChange('nextVaccinationDate', value)}/>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Cancel
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Next
          </button>
          
        </div>
      </div>
    </>
  )
}