import TextInput from "../../common/forms/TextInput"

export default function ClientDetails() {
  return (
    <>
      <h3 className="text-xl font-medium">Administrative Area</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column   */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Residence County"
            inputPlaceholder="Residence County"/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Town/Trading center"
            inputPlaceholder="Town/Trading center"/>
        </div>

        {/* Column   */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Subcounty"
            inputPlaceholder="Subcounty"/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Estate & House No./village"
            inputPlaceholder="Estate & House No./village"/>
        </div>

        {/* Column   */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Ward"
            inputPlaceholder="Ward"/>

        </div>
      </div>
    </>
  )
}