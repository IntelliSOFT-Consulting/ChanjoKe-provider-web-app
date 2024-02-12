import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import TextArea from '../../common/forms/TextArea'
import FormState from '../../utils/formState'
import { useNavigate } from 'react-router-dom'

export default function AEFIType() {
  const aefiTypes = [
    { id: 1, name: 'Type of AEFI' },
  ]

  const formRules = {
    aefiType: {
      required: true,
    },
    aefiDetails: {
      required: true,
    },
    eventOnset: {
      required: true,
    },
    pastMedicalHistory: {
      required: true,
    },
  }

  const formStructure = {
    aefiType: '',
    aefiDetails: '',
    eventOnset: '',
    pastMedicalHistory: '',
  }

  const { formData, formErrors, handleChange } = FormState(formStructure, formRules)
  const navigate = useNavigate()

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          <h3 className="text-xl font-medium">Adverse Event Following Immunisation</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
      
          <form>
          
            <div className="grid mt-5 grid-cols-2 gap-10">
              {/* Column 1 */}
              <div>

                <SelectMenu
                  label="Type of AEFI"
                  required={true}
                  data={aefiTypes}
                  error={formErrors.aefiType}
                  value={formData.aefiType || 'Type of AEFI'}
                  onInputChange={(value) => handleChange('aefiType', value)}/>

                <TextArea
                  inputName="aefiDetails"
                  inputId="aefiDetails"
                  label="Brief details on the AEFI"
                  value={formData.aefiDetails}
                  error={formErrors.aefiDetails}
                  onInputChange={(value) => handleChange('aefiDetails', value)}
                  required={true}
                  rows="4"
                  cols="50"
                  inputPlaceholder="Brief details on the AEFI"/>

              </div>

              {/* Column 2 */}
              <div>

                <TextInput
                  inputType="date"
                  inputName="eventOnset"
                  inputId="eventOnset"
                  label="Onset of event"
                  required={true}
                  value={formData.eventOnset}
                  onInputChange={(value) => (handleChange('eventOnset', value))}
                  inputPlaceholder="Onset of event"/>

                <TextArea
                  inputName="pastMedicalHistory"
                  inputId="pastMedicalHistory"
                  label="Past Medical History"
                  value={formData.pastMedicalHistory}
                  error={formErrors.pastMedicalHistory}
                  onInputChange={(value) => handleChange('pastMedicalHistory', value)}
                  required={true}
                  rows="4"
                  cols="50"
                  inputPlaceholder="Past Medical History"/>

              </div>

            </div>

          </form>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <button
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Back
          </button>
          <button
            onClick={() => navigate('/aefi-action')}
            className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            Next
          </button>    
        </div>

        </div>
      </div>

      
    </>
  )
}