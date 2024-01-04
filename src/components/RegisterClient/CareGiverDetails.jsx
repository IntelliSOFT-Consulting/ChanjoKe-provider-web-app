import TextInput from '../../common/forms/TextInput'
import SelectMenu from '../../common/forms/SelectMenu'

export default function CaregiverDetails() {
  const caregiverTypes = [
    { id: 1, name: 'Father' },
    { id: 2, name: 'Mother' },
    { id: 3, name: 'Brother' },
    { id: 4, name: 'Sister' },
  ]

  return (
    <>
      <h3 className="text-xl font-medium">Care Giver's Details</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>

          <SelectMenu
            label="Care Giver's Type"
            data={caregiverTypes}/>

        </div>

        {/* Column 2 */}
        <div>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Care Giver's name"
            inputPlaceholder="Care Giver's name"/>

        </div>

        {/* Column 3 */}
        <div className='justify-items-stretch grid'>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            label="Contact phone number"
            inputPlaceholder="Contact phone number"/>

          <button
            className="ml-4 justify-self-end flex-shrink-0 rounded-full bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            Add
          </button>

        </div>
      </div>
    </>
  )
}