import FormState from "../../utils/formState"
import TextInput from "../../common/forms/TextInput"
import SelectMenu from "../../common/forms/SelectMenu"
import ConfirmDialog from "../../common/dialog/ConfirmDialog"
import { useSharedState } from "../../shared/sharedState"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function BatchNumbers() {

  const [batchNumbers, setBatchNumbers] = useState([
    { vaccinaName: 'BCG', batches: ['HHFK88399434', 'HDKKD8777847'], diseaseTarget: ''},
    { vaccinaName: 'bOPV', batches: ['OPVJJD788778', 'OPV667HHD889'], diseaseTarget: ''}
  ])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { sharedData } = useSharedState()

  const { formData, formErrors, handleChange } = FormState({
    currentWeight: '',
    batchNumbers: [],
  }, {})
  const navigate = useNavigate()

  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Vaccination data updated successfully`}
        onClose={handleDialogClose} />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Administer Vaccine
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-3 gap-10 px-6 gap-10">
            <div>

              <TextInput
                inputType="text"
                inputName="firstName"
                inputId="firstName"
                label="Current Weight"
                value={formData.currentWeight}
                onInputChange={(value) => handleChange('currentWeight', value)}
                addOn={true}
                addOnTitle="Kgs"
                inputPlaceholder="Current Weight"/>

            </div>

            <div></div>
            <div></div>
          </div>
          <hr className="mt-5" />

          <div className="px-4 py-5 sm:p-6">
            <p>Batch Numbers</p>
            {sharedData.map((vaccine) => 
              (
                <div className="grid grid-cols-3 gap-10">

                  <div>
                    <SelectMenu
                      data={[{ name: '778377443'}, { name: '78788888'}]}
                      error={formErrors.identificationType}
                      value={formData.identificationType || `${vaccine.vaccineName} Batch numbers`}
                      onInputChange={(value) => handleChange('non', value.name)}/>
                  </div>

                  <div>
                    <TextInput
                      inputType="text"
                      inputName="diseaseTarget"
                      inputId="diseaseTarget"
                      disabled={true}
                      value={formData.currentWeight}
                      onInputChange={(value) => handleChange('currentWeight', value)}
                      inputPlaceholder="Disease Targeted"/>
                  </div>
                  <div></div>
                </div>))
              }
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
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Submit
          </button>
          
        </div>
      </div>
    </>
  )
}