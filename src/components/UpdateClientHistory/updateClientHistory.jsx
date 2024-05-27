import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import FormState from '../../utils/formState'

export default function UpdateClientHistory() {
  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false)
  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }
  const { formData,  handleChange } = FormState(
    {
      currentWeight: '',
      clientHIVStatus: '',
      receivingHaart: '',
      maternalHivStatus: '',
    },
    {}
  )

  const polarityOptions = [
    { name: 'Positive', value: true },
    { name: 'Negative', value: false },
  ]

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Vaccine history updated successfully`}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Update Vaccine History
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-3 gap-10 mt-10">
            {/* Column 1 */}
            <div>
              <TextInput
                inputType="text"
                inputName="currentWeight"
                inputId="currentWeight"
                label="Current Weight (KGs)"
                value={formData.currentWeight}
                onInputChange={(value) => handleChange('currentWeight', value)}
                addOn={true}
                addOnTitle="Kgs"
                inputPlaceholder="Current Weight (KGs)"
              />
            </div>

            {/* Column 2 */}
            <div>
              <SelectMenu
                label="Client HIV Status"
                data={polarityOptions}
                value={formData.clientHIVStatus || 'Client HIV Status'}
                onInputChange={(value) =>
                  handleChange('clientHIVStatus', value.name)
                }
              />
            </div>

            {/* Column 3 */}
            <div></div>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}
