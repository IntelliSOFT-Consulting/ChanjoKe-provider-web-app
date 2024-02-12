import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import TextArea from '../../common/forms/TextArea'
import FormState from '../../utils/formState'

export default function AEFIAction() {
  const reactionTypes = [
    { id: 1, name: 'Type of AEFI' },
  ]

  const aefiOutcomes = [
    { id: 1, name: 'AEFI Outcome'}
  ]

  const formRules = {
    reactionSeverity: {
      required: true,
    },
    actionTaken: {
      required: true,
    },
    aefiOutcome: {
      required: true,
    },
    nameOfPersonReporting: {
      required: true,
    },
    phoneNumber: {
      required: true,
    },
    hcwName: {
      required: true,
    },
    designation: {
      required: true,
    },
  }

  const formStructure = {
    reactionSeverity: '',
    actionTaken: '',
    aefiOutcome: '',
    nameOfPersonReporting: '',
    phoneNumber: '',
    hcwName: '',
    designation: '',
  }

  const { formData, formErrors, handleChange } = FormState(formStructure, formRules)

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
                  label="Reaction Severity"
                  required={true}
                  data={reactionTypes}
                  error={formErrors.reactionSeverity}
                  value={formData.reactionSeverity || 'Reaction Severity'}
                  onInputChange={(value) => handleChange('reactionSeverity', value)}/>

                <TextArea
                  inputName="actionTaken"
                  inputId="actionTaken"
                  label="Action Taken"
                  value={formData.actionTaken}
                  error={formErrors.actionTaken}
                  onInputChange={(value) => handleChange('actionTaken', value)}
                  required={true}
                  rows="4"
                  cols="50"
                  inputPlaceholder="Action Taken"/>

                <SelectMenu
                  label="AEFI Outcome"
                  required={true}
                  data={aefiOutcomes}
                  error={formErrors.aefiOutcome}
                  value={formData.aefiOutcome || 'AEFI Outcome'}
                  onInputChange={(value) => handleChange('aefiOutcome', value)}/>


                <TextInput
                  inputType="text"
                  inputName="nameOfPersonReporting"
                  inputId="nameOfPersonReporting"
                  label="Name of person reporting"
                  required={true}
                  error={formErrors.nameOfPersonReporting}
                  value={formData.nameOfPersonReporting}
                  onInputChange={(value) => (handleChange('nameOfPersonReporting', value))}
                  inputPlaceholder="Name of person reporting"/>

              </div>

              {/* Column 2 */}
              <div>

                <TextInput
                  inputType="text"
                  inputName="phoneNumber"
                  inputId="phoneNumber"
                  label="Phone Number"
                  required={true}
                  value={formData.phoneNumber}
                  onInputChange={(value) => (handleChange('phoneNumber', value))}
                  inputPlaceholder="Phone Number"/>

                <TextInput
                  inputType="text"
                  inputName="hcwName"
                  inputId="hcwName"
                  label="Health Care Worker Name"
                  required={true}
                  value={formData.hcwName}
                  onInputChange={(value) => (handleChange('hcwName', value))}
                  inputPlaceholder="Health Care Worker Name"/>

                <TextInput
                  inputType="text"
                  inputName="designation"
                  inputId="designation"
                  label="Designation"
                  required={true}
                  value={formData.designation}
                  onInputChange={(value) => (handleChange('designation', value))}
                  inputPlaceholder="Designation"/>

              </div>

            </div>

          </form>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <button
              className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Back
            </button>
            <button
              className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Preview
            </button>
            <button
              className="ml-4 flex-shrink-0 rounded-md bg-[#0b7114] border border-[#0b7114] outline outline-[#0b7114] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0b7114] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7114]">
              Submit
            </button>
          </div>

        </div>
      </div> 
    </>
  )
}