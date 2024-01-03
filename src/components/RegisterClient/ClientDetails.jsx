import TextInput from '../../common/forms/TextInput'

export default function ClientDetails() {
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

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Gender"
            inputPlaceholder="GENDER"/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Identification Type"
            inputPlaceholder="IDENTIFICATION TYPE"/>
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
          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Client HIV Status"
            inputPlaceholder="Positive"/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Birth Weight"
            inputPlaceholder="Birth Weight"/>
        </div>

        {/* Column 2 */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Client is currently receiving HAART"
            inputPlaceholder="Yes"/>
        </div>

        {/* Column 3 */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Maternal HIV Status"
            inputPlaceholder="Positive"/>
        </div>
      </div>
    </>
  )
}