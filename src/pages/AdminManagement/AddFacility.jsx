import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import FormState from '../../utils/formState'

export default function AddFacility() {
  const counties = [
    { id: 1, name: 'Nairobi' },
    { id: 2, name: 'Kirinyaga' },
    { id: 3, name: 'Narok' },
    { id: 4, name: 'Mombasa' },
  ]

  const subCounties = [
    { id: 1, name: 'Kasarani' },
  ]

  const levels = [
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
  ]

  const wards = [
    { id: 1, name: 'County Ward' }
  ]

  const formRules = {
    facilityName: {
      required: true
    },
    kmflCode: {
      required: true
    },
    level: {
      required: true
    },
    county: {
      required: true
    },
    subCounty: {
      required: true
    },
    ward: {
      required: true
    },
  }

  const formStructure = {
    facilityName: '',
    kmflCode: '',
    level: '',
    county: '',
    subCounty: '',
    ward: '',
  }

  const { formData, formErrors, handleChange } = FormState(formStructure, formRules)

  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Admin Management - Add Facility
      </div>
      <div className="px-4 py-5 sm:p-6">

        <form>
        
          <div className="grid grid-cols-3 gap-10">
            {/* Column 1 */}
            <div>

              <TextInput
                inputType="text"
                inputName="facilityName"
                inputId="facilityName"
                label="Facility Name"
                required={true}
                value={formData.facilityName}
                error={formErrors.facilityName}
                onInputChange={(value) => handleChange('facilityName', value)}
                inputPlaceholder="Facility Name"/>

              <SelectMenu
                label="Select County"
                required={true}
                data={counties}
                error={formErrors.county}
                value={formData.county || 'Select County'}
                onInputChange={(value) => handleChange('county', value)}/>

            </div>

            {/* Column 2 */}
            <div>

              <TextInput
                inputType="text"
                inputName="kmflCode"
                inputId="kmflCode"
                label="KMFL Code"
                required={true}
                value={formData.kmflCode}
                error={formErrors.kmflCode}
                onInputChange={(value) => handleChange('kmflCode', value)}
                inputPlaceholder="KMFL Code"/>

              <SelectMenu
                label="Select Sub-county"
                required={true}
                data={subCounties}
                error={formErrors.subCounty}
                value={formData.subCounty || 'Select Sub-county'}
                onInputChange={(value) => handleChange('subCounty', value)}/>

            </div>

            {/* Column 3 */}
            <div>

              <SelectMenu
                label="Level"
                required={true}
                data={levels}
                error={formErrors.level}
                value={formData.level || 'Level'}
                onInputChange={(value) => handleChange('level', value)}/>

              <SelectMenu
                label="Ward"
                required={true}
                data={wards}
                error={formErrors.ward}
                value={formData.ward || 'Ward'}
                onInputChange={(value) => handleChange('ward', value)}/>
            </div>
          </div>

          <div className="grid grid-cols-5">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div>
              <button
                className="ml-4 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Save Details
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}