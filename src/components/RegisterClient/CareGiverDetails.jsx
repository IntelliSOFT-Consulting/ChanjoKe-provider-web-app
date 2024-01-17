import TextInput from '../../common/forms/TextInput';
import SelectMenu from '../../common/forms/SelectMenu';
import { useState } from 'react';
import SearchTable from '../../common/tables/SearchTable';

export default function CaregiverDetails() {
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

  const [formData, setFormData] = useState({
    caregiverName: '',
    caregiverType: '',
    phoneNumber: '',
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log({ formData });
    setCaregivers([...caregivers, formData])
    console.log({ caregivers })
    setFormData({
      caregiverName: '',
      caregiverType: '',
      phoneNumber: '',
    })
  };

  const [caregivers, setCaregivers] = useState([])

  return (
    <>
      <h3 className="text-xl font-medium">Care Giver's Details</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <SelectMenu
            label="Care Giver's Type"
            required={true}
            data={caregiverTypes}
            value={formData.caregiverType || 'Care Giver\'s Type'}
            onInputChange={(value) => handleChange('caregiverType', value)}
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
            onInputChange={(value) => handleChange('phoneNumber', value)}
            inputPlaceholder="Contact phone number"
          />

          <button
            onClick={handleSubmit}
            className="ml-4 justify-self-end flex-shrink-0 rounded-full bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            Add
          </button>
        </div>
      </div>

      {
        caregivers.length > 0 &&
          <SearchTable
              headers={tHeaders}
              data={caregivers} />
      }
    </>
  );
}