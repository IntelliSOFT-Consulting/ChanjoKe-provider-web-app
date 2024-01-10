import TextInput from "../../common/forms/TextInput"
import SelectMenu from '../../common/forms/SelectMenu'

export default function ClientDetails() {

  const locations = [
    { id: 1, name: 'Kiambu' }
  ]

  const wards = [
    { id: 1, name: 'Juja' }
  ]
  return (
    <>
      <h3 className="text-xl font-medium">Administrative Area</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column   */}
        <div>

          <SelectMenu
            required={true}
            label="Residence County"
            data={locations}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Town/Trading center"
            inputPlaceholder="Town/Trading center"/>
        </div>

        {/* Column   */}
        <div>

          <SelectMenu
            required={true}
            label="Subcounty"
            data={locations}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Estate & House No./village"
            inputPlaceholder="Estate & House No./village"/>
        </div>

        {/* Column   */}
        <div>

          <SelectMenu
            required={true}
            label="Ward"
            data={wards}/>

        </div>
      </div>
    </>
  )
}