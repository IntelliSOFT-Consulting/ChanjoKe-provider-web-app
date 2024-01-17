import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import RadioGroup from '../../common/forms/RadioGroup'
import { useState } from 'react'

export default function ClientDetails() {
  const identificationTypes = [
    { id: 1, name: 'Identification Number' },
    { id: 2, name: 'Birth Certificate Number' },
    { id: 3, name: 'NEMIS Number' },
    { id: 4, name: 'Passport Number' },
  ]

  const genderOptions = [
    { id: 1, title: 'Male' },
    { id: 2, title: 'Female' },
  ]

  const [formData, setFormData ] = useState({
    firstName: '',
    gender: '',
    identificationType: '',
    middleName: '',
    dateOfBirth: '',
    identificationNumber: '',
    lastName: '',
    age: '',
    currentWeight: '',
    receivingHaart: '',
    maternalHIVStatus: '',
  })

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function calculateAge(birthDate) {
    console.log({ birthDate })
    const currentDate = new Date();
    const dob = new Date(birthDate);
    let age = currentDate.getFullYear() - dob.getFullYear();
  
    // Adjust age if the birthday hasn't occurred yet this year
    if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
      age--;
    }
  
    handleChange('age', age)
  
  }

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
            required={true}
            value={formData.firstName}
            onInputChange={(value) => handleChange('firstName', value)}
            inputPlaceholder="First Name"/>

          <RadioGroup
            label="Gender"
            required={true}
            value={formData.gender}
            onInputChange={(value) => handleChange('gender', value)}
            data={genderOptions} />

          <SelectMenu
            label="Identification Type"
            required={true}
            data={identificationTypes}
            value={formData.identificationType || 'Identification Type'}
            onInputChange={(value) => handleChange('identificationType', value)}/>

        </div>

        {/* Column 2 */}
        <div>

          <TextInput
            inputType="text"
            inputName="middleName"
            inputId="middleName"
            label="Middle Name"
            value={formData.middleName}
            onInputChange={(value) => handleChange('middleName', value)}
            inputPlaceholder="Middle Name"/>

          <TextInput
            inputType="date"
            inputName="middleName"
            inputId="middleName"
            label="Date of Birth"
            required={true}
            value={formData.dateOfBirth}
            onInputChange={(value) => (handleChange('dateOfBirth', value), calculateAge(value))}
            inputPlaceholder="Date of Birth"/>

          <TextInput
            inputType="text"
            inputName="middleName"
            inputId="middleName"
            label="Identification Number"
            value={formData.identificationNumber}
            onInputChange={(value) => handleChange('identificationNumber', value)}
            required={true}
            inputPlaceholder="Identification Number"/>

        </div>

        {/* Column 3 */}
        <div>

          <TextInput
            inputType="text"
            inputName="lastName"
            inputId="lastName"
            label="Last Name"
            required={true}
            value={formData.lastName}
            onInputChange={(value) => handleChange('lastName', value)}
            inputPlaceholder="Last Name"/>

          <TextInput
            inputType="text"
            inputName="lastName"
            inputId="lastName"
            label="Age"
            value={formData.age}
            disabled={true}
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
            label="Current Weight"
            value={formData.currentWeight}
            onInputChange={(value) => handleChange('currentWeight', value)}
            addOn={true}
            addOnTitle="Kgs"
            inputPlaceholder="Current Weight"/>
        </div>

        {/* Column 2 */}
        <div>
        </div>

        {/* Column 3 */}
        <div>
        </div>
      </div>
    </>
  )
}