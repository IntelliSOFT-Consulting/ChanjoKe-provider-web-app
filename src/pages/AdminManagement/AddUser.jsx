import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import FormState from '../../utils/formState'

export default function AddUser() {
  const counties = [
    { id: 1, name: 'Nairobi' },
    { id: 2, name: 'Kirinyaga' },
    { id: 3, name: 'Narok' },
    { id: 4, name: 'Mombasa' },
  ]

  const subCounties = [
    { id: 1, name: 'Kasarani' },
  ]

  const countyLevel = [
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
  ]

  const roleGroup = [
    { id: 1, name: 'Nurse' }
  ]

  const formRules = {
    firstName: {
      required: true
    },
    lastName: {
      required: true
    },
    username: {
      required: true
    },
    phoneNumber: {
      required: true
    },
    email: {
      required: true
    },
    county: {
      required: true
    },
    subCounty: {
      required: true
    },
    level: {
      required: true
    },
    roleGroup: {
      required: true
    }
  }

  const formStructure = {
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    email: '',
    county: '',
    subCounty: '',
    level: '',
    roleGroup: ''
  }

  const { formData, formErrors, handleChange } = FormState(formStructure, formRules)

  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Add User
      </div>
      <div className="px-4 py-5 sm:p-6">

        <form>
        
          <div className="grid grid-cols-3 gap-10">
            {/* Column 1 */}
            <div>

              <TextInput
                inputType="text"
                inputName="firstName"
                inputId="firstName"
                label="First Name"
                required={true}
                value={formData.firstName}
                error={formErrors.firstName}
                onInputChange={(value) => handleChange('firstName', value)}
                inputPlaceholder="First Name"/>

              <TextInput
                inputType="number"
                inputName="phoneNumber"
                inputId="phoneNumber"
                label="Phone Number"
                required={true}
                value={formData.phoneNumber}
                error={formErrors.phoneNumber}
                onInputChange={(value) => handleChange('phoneNumber', value)}
                inputPlaceholder="Phone Number"/>

            </div>

            {/* Column 2 */}
            <div>

              <TextInput
                inputType="text"
                inputName="lastName"
                inputId="lastName"
                label="Last Name"
                required={true}
                value={formData.lastName}
                error={formErrors.lastName}
                onInputChange={(value) => handleChange('lastName', value)}
                inputPlaceholder="Last Name"/>

              <TextInput
                inputType="email"
                inputName="email"
                inputId="email"
                label="Email"
                required={true}
                value={formData.email}
                error={formErrors.email}
                onInputChange={(value) => handleChange('email', value)}
                inputPlaceholder="Email"/>

            </div>

            {/* Column 3 */}
            <div>

              <TextInput
                inputType="text"
                inputName="username"
                inputId="username"
                label="Username"
                required={true}
                value={formData.username}
                error={formErrors.username}
                onInputChange={(value) => handleChange('username', value)}
                inputPlaceholder="Username"/>
            </div>
          </div>

          <h3 className="text-base mt-5 text-[#163C94] font-medium border-b-2 border-[#163C94]">Location Details</h3>

          <div className="grid grid-cols-3 gap-10 mt-10">
            {/* Column 1 */}
            <div>

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

              <SelectMenu
                label="Select Subcounty"
                required={true}
                data={subCounties}
                error={formErrors.subCounty}
                value={formData.subCounty || 'Select Subcounty'}
                onInputChange={(value) => handleChange('subCounty', value)}/>

            </div>

            {/* Column 3 */}
            <div>

              <SelectMenu
                label="Select Level"
                required={true}
                data={countyLevel}
                error={formErrors.level}
                value={formData.level || 'Select Center'}
                onInputChange={(value) => handleChange('level', value)}/>

            </div>
          </div>

          <h3 className="text-base mt-5 text-[#163C94] font-medium border-b-2 border-[#163C94]">Role Details</h3>

          <div className="grid grid-cols-3 gap-10 mt-10">
            {/* Column 1 */}
            <div>

              <SelectMenu
                label="Select Role Group"
                required={true}
                data={roleGroup}
                error={formErrors.roleGroup}
                value={formData.roleGroup || 'Select Role Group'}
                onInputChange={(value) => handleChange('roleGroup', value)}/>

            </div>

            {/* Column 2 */}
            <div>
            </div>

            {/* Column 3 */}
            <div>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}