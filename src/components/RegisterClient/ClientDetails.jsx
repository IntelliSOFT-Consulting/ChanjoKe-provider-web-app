import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import RadioGroup from '../../common/forms/RadioGroup'

export default function ClientDetails() {
  const identificationTypes = [
    { id: 1, name: 'Identification Number' },
    { id: 2, name: 'Birth Certificate Number' },
    { id: 3, name: 'NEMIS Number' },
    { id: 4, name: 'Passport Number' },
  ]

  const polarStatuses = [
    { id: 1, name: 'Positive' },
    { id: 2, name: 'Negative' },
  ]

  const binaryStatuses = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
  ]

  const genderOptions = [
    { id: 1, title: 'Male' },
    { id: 1, title: 'Female' },
  ]

  return (
    <>
      <h3 className="text-xl font-medium">Client Details</h3>
      
      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="First Name"
            inputPlaceholder="First Name"/>

          <RadioGroup
            label="Gender"
            data={genderOptions} />

          <SelectMenu
            label="Identification Type"
            data={identificationTypes}/>

        </div>

        {/* Column 2 */}
        <div>

          <TextInput
            inputType="text"
            inputName="middleName"
            inputId="middleName"
            label="Middle Name"
            inputPlaceholder="Middle Name"/>

          <TextInput
            inputType="text"
            inputName="middleName"
            inputId="middleName"
            label="Date of Birth"
            inputPlaceholder="Date of Birth"/>

          <TextInput
            inputType="text"
            inputName="middleName"
            inputId="middleName"
            label="Identification Number"
            inputPlaceholder="Identification Number"/>

        </div>

        {/* Column 3 */}
        <div>

          <TextInput
            inputType="text"
            inputName="lastName"
            inputId="lastName"
            label="Last Name"
            inputPlaceholder="Last Name"/>

          <TextInput
            inputType="text"
            inputName="lastName"
            inputId="lastName"
            label="Age"
            inputPlaceholder="Age"/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10 mt-10">
        {/* Column 1 */}
        <div>
          <SelectMenu
            label="Client's HIV Status"
            data={polarStatuses}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Birth Weight"
            inputPlaceholder="Birth Weight"/>
        </div>

        {/* Column 2 */}
        <div>

          <SelectMenu
            label="Client is currently receiving HAART"
            data={binaryStatuses}/>

        </div>

        {/* Column 3 */}
        <div>

          <SelectMenu
            label="Maternal HIV Status"
            data={polarStatuses}/>

        </div>
      </div>
    </>
  )
}