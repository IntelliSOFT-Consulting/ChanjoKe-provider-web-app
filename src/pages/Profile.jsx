import TextInput from "../common/forms/TextInput"

export default function Profile() {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Profile
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-3 gap-10 mt-10">
          {/* Column 1 */}
          <div>

            <TextInput
              inputType="text"
              inputName="name"
              inputId="name"
              label="Name"
              inputPlaceholder="Name"/>

            <TextInput
              inputType="text"
              inputName="facilityAttached"
              inputId="facilityAttached"
              label="Facility Attached"
              inputPlaceholder="Facility Attached"/>
          </div>

          {/* Column 2 */}
          <div>
            <TextInput
              inputType="email"
              inputName="email"
              inputId="email"
              label="email"
              inputPlaceholder="email"/>
          </div>

          {/* Column 3 */}
          <div>
            <TextInput
              inputType="text"
              inputName="phoneNumber"
              inputId="phoneNumber"
              label="Phone Number"
              inputPlaceholder="Phone Number"/>

          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
        
      </div>
    </div>
  )
}