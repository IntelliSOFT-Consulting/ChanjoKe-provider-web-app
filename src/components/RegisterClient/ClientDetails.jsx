import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import RadioGroup from '../../common/forms/RadioGroup'
import calculateAge from '../../utils/calculateAge'
import FormState from '../../utils/formState'
import { useEffect, useState } from 'react'
import RequiredValidator from '../../utils/requiredValidator'

export default function ClientDetails({ setClientDetails, setClientFormErrors, setAllFormsValid }) {
  const identificationTypes = [
    { id: 1, name: 'Identification Number' },
    { id: 2, name: 'Birth Certificate Number' },
    { id: 3, name: 'NEMIS Number' },
    { id: 4, name: 'Passport Number' },
  ]

  const genderOptions = [
    { id: 1, title: 'Male', value: 'male' },
    { id: 2, title: 'Female', value: 'female' },
  ]

  const formRules = {
    firstName: {
      required: true,
      minLen: 4
    },
    gender: {
      required: true,
      enum: ['male', 'female']
    },
    identificationType: {
      required: true,
    },
    identificationNumber: {
      required: true,
      minLen: 5,
      // maxLen: 10,
    },
    lastName: {
      required: true,
      minLen: 4,
    },
  }

  const formStructure = {
    firstName: '',
    gender: '',
    identificationType: '',
    middleName: '',
    dateOfBirth: '',
    identificationNumber: '',
    lastName: '',
    age: '',
    currentWeight: '',
  }

  const { formData, formErrors, handleChange } = FormState(formStructure, formRules)

  useEffect(() => {
    setClientDetails(formData)
    setClientFormErrors(formErrors)
  }, [formData])

  const isFormValid = RequiredValidator(formData, formRules)

  if (isFormValid) {
    setAllFormsValid(isFormValid)
  }

  return (
    <>
      <h3 className="text-xl font-medium">Client Details</h3>

      <form>
      
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
              error={formErrors.firstName}
              onInputChange={(value) => handleChange('firstName', value)}
              inputPlaceholder="First Name"/>

            <RadioGroup
              label="Gender"
              required={true}
              value={formData.gender}
              error={formErrors.gender}
              onInputChange={(value) => handleChange('gender', value)}
              data={genderOptions} />

            <SelectMenu
              label="Identification Type"
              required={true}
              data={identificationTypes}
              error={formErrors.identificationType}
              value={formData.identificationType || 'Identification Type'}
              onInputChange={(value) => handleChange('identificationType', value.name)}/>

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
              onInputChange={(value) => (handleChange('dateOfBirth', value), handleChange('age', calculateAge(value)))}
              inputPlaceholder="Date of Birth"/>

            <TextInput
              inputType="text"
              inputName="middleName"
              inputId="middleName"
              label="Identification Number"
              value={formData.identificationNumber}
              error={formErrors.identificationNumber}
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
              error={formErrors.lastName}
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

      </form>

      
    </>
  )
}