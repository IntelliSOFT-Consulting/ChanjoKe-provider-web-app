import TextInput from '../../common/forms/TextInput';
import SelectMenu from '../../common/forms/SelectMenu';
import { useState, useEffect } from 'react';
import SearchTable from '../../common/tables/SearchTable';
import FormState from '../../utils/formState'
import { v4 as uuidv4 } from 'uuid'
import ConfirmationDialog from '../../common/dialog/ConfirmationDialog';

export default function CaregiverDetails({ setCaregiverDetails, setCaregiverFormErrors }) {
  const caregiverTypes = [
    { id: 1, name: 'Father' },
    { id: 2, name: 'Mother' },
    { id: 3, name: 'Guardian' },
  ];

  const tHeaders = [
    {title: 'Relationship', class: '', key: 'caregiverType'},
    {title: 'Care Giver\'s name', class: '', key: 'caregiverName'},
    {title: 'Contact phone number', class: '', key: 'phoneNumber'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const formRules = {
    caregiverName: {
      required: true,
      minLen: 4,
    },
    phoneNumber: {
      required: true,
      minLen: 8,
    }
  }

  const { formData, formErrors, handleChange, resetForm } = FormState({
    id: uuidv4(),
    caregiverName: '',
    caregiverType: '',
    phoneNumber: '',
    actions: [
      { title: 'edit', btnAction: 'editCareGiver' },
      { title: 'remove', btnAction: 'removeCareGiver' }
    ]
  }, formRules)
  const [caregivers, setCaregivers] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setCaregiverDetails(caregivers)
    setCaregiverFormErrors(formErrors)
  }, [caregivers])

  const handleSubmit = () => {
    setCaregivers([formData, ...caregivers,])
    resetForm({
      id: uuidv4(),
      caregiverName: '',
      caregiverType: '',
      phoneNumber: '',
      actions: [
        { title: 'edit', btnAction: 'editCareGiver' },
        { title: 'remove', btnAction: 'removeCareGiver' }
      ]
    })
  };

  const handleAction = (onActionBtn, data) => {
    console.log({ data })
    if (onActionBtn === 'editCareGiver') {
      const arrayWithoutCaregiver = caregivers.filter((caregiver) => caregiver.id !== data.id)

      resetForm({
        id: data.id,
        caregiverName: data.caregiverName,
        caregiverType: data.caregiverType,
        phoneNumber: data.phoneNumber,
        actions: [
          { title: 'edit', btnAction: 'editCareGiver' },
          { title: 'remove', btnAction: 'removeCareGiver' }
        ]
      })
      setCaregivers(arrayWithoutCaregiver)
    }

    if (onActionBtn === 'removeCareGiver') {
      const arrayWithoutCaregiver = caregivers.filter((caregiver) => caregiver.id === data.id)

      setIsDialogOpen(true)
      console.log({ arrayWithoutCaregiver })
    }
  }

  const handleAcceptRemoveCaregiver = () => {

  }

  return (
    <>

      <ConfirmationDialog
        open={isDialogOpen}
        description="Are you sure you want to remove Caregiver?"
        onClose={() => setIsDialogOpen(false)}
        onAccept={handleAcceptRemoveCaregiver}
        title="Remove Caregiver" />
      <h3 className="text-xl font-medium">Care Giver's Details</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <SelectMenu
            label="Care Giver's Type"
            required={true}
            data={caregiverTypes}
            value={formData.caregiverType || 'Care Giver\'s Type'}
            onInputChange={(value) => handleChange('caregiverType', value.name)}
          />
        </div>

        {/* Column 2 */}
        <div>
          <TextInput
            inputType="text"
            inputName="caregiverName"
            inputId="caregiverName"
            label="Care Giver's name"
            required={true}
            value={formData.caregiverName}
            error={formErrors.caregiverName}
            onInputChange={(value) => handleChange('caregiverName', value)}
            inputPlaceholder="Care Giver's name"
          />
        </div>

        {/* Column 3 */}
        <div className="justify-items-stretch grid">
          <TextInput
            inputType="text"
            inputName="phoneNumber"
            inputId="phoneNumber"
            label="Contact phone number"
            required={true}
            value={formData.phoneNumber}
            error={formErrors.phoneNumber}
            onInputChange={(value) => handleChange('phoneNumber', value)}
            inputPlaceholder="Contact phone number"
          />

          <button
            onClick={handleSubmit}
            disabled={Object.keys(formErrors).length !== 0 || !formData.caregiverName || !formData.phoneNumber || !formData.caregiverType}
            className="ml-4 justify-self-end flex-shrink-0 rounded-full bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            Add
          </button>
        </div>
      </div>

      {
        caregivers.length > 0 &&
          <SearchTable
            headers={tHeaders}
            onActionBtn={handleAction}
            data={caregivers} />
      }
    </>
  );
}