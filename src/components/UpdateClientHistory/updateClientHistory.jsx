import TextInput from "../../common/forms/TextInput"
import RadioGroup from "../../common/forms/RadioGroup"
import SelectMenu from "../../common/forms/SelectMenu"
import FormState from "../../utils/formState"
import { useNavigate } from "react-router-dom"

export default function UpdateClientHistory() {
  const navigate = useNavigate()
  const { formData, formErrors, handleChange } = FormState({
    birthWeight: '',
    multipleBirths: '',
    typeOfMultipleBirths: '',
    clientHIVStatus: '',
    receivingHaart: '',
    maternalHivStatus: '',
  }, {})

  const affirmOptions = [
    { id: 1, title: 'Yes', name: 'Yes', value: true },
    { id: 2, title: 'No', name: 'No', value: false },
  ]

  const polarityOptions = [
    {name: 'Positive', value: true },
    {name: 'Negative', value: false },
  ]

  const multipleBirthOptions = [
    { id: 1, name: 'Twins', value: 'twins' },
    { id: 2, name: 'Triplets', value: 'triplets' },
    { id: 3, name: 'Quadruplets', value: 'quadruplets' },
    { id: 4, name: 'Quintuplets', value: 'quintluplets' },
    { id: 5, name: 'Sextuplets', value: 'sextuplets' },
    { id: 6, name: 'Septuplets', value: 'septuplets' },
    { id: 6, name: 'Octuplets', value: 'octuplets' },
  ]

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Update Client History
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-3 gap-10 mt-10">
          {/* Column 1 */}
          <div>

            <TextInput
              inputType="text"
              inputName="birthWeight"
              inputId="birthWeight"
              label="Birth Weight (KGs)"
              value={formData.birthWeight}
              onInputChange={(value) => handleChange('birthWeight', value)}
              addOnTitle="Kgs"
              inputPlaceholder="Birth Weight (KGs)"/>

            <SelectMenu
              label="Client HIV Status"
              data={polarityOptions}
              value={formData.clientHIVStatus || 'Client HIV Status'}
              onInputChange={(value) => handleChange('clientHIVStatus', value.name)}/>
          </div>

          {/* Column 2 */}
          <div>
            <RadioGroup
              label="Multiple Births"
              value={formData.multipleBirths}
              error={formErrors.multipleBirths}
              onInputChange={(value) => handleChange('multipleBirths', value)}
              data={affirmOptions} />

            <SelectMenu
              label="Client is currently receiving HAART"
              data={affirmOptions}
              value={formData.receivingHaart || 'Client is currently receiving HAART'}
              onInputChange={(value) => handleChange('receivingHaart', value.name)}/>
          </div>

          {/* Column 3 */}
          <div>
            <SelectMenu
              label="Type of multiple births"
              data={multipleBirthOptions}
              value={formData.multipleBirths || 'Type of multiple births'}
              onInputChange={(value) => handleChange('multipleBirths', value.name)}/>

            <SelectMenu
              label="Maternal HIV Status"
              data={polarityOptions}
              value={formData.maternalHivStatus || 'Maternal HIV Status'}
              onInputChange={(value) => handleChange('maternalHivStatus', value.name)}/>

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