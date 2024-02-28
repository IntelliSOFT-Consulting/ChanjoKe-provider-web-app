import SelectMenu from '../../common/forms/SelectMenu'
import TextInput from '../../common/forms/TextInput'
import RadioGroup from '../../common/forms/RadioGroup'
import calculateAge from '../../utils/calculateAge'
import FormState from '../../utils/formState'
import { useEffect, useState } from 'react'
import RequiredValidator from '../../utils/requiredValidator'
import calculateEstimatedBirthDate from '../../utils/calculateDate'

export default function ClientDetails({ setClientDetails, setClientFormErrors, setAllFormsValid }) {
  const identificationTypes = [
    { id: 1, name: 'Identification Number' },
    { id: 2, name: 'Birth Certificate Number' },
    { id: 3, name: 'NEMIS Number' },
    { id: 4, name: 'Passport Number' },
  ]
  const [actualDate, setActualDate] = useState('actual')
  const [weeks, setWeeks] = useState(0)
  const [months, setMonths] = useState(0)
  const [years, setYears] = useState(0)

  const monthsData = [
    { name: '1 Month', value: 1 },
    { name: '2 Months', value: 2 },
    { name: '3 Months', value: 3 },
    { name: '4 Months', value: 4 },
    { name: '5 Months', value: 5 },
    { name: '6 Months', value: 6 },
    { name: '7 Months', value: 7 },
    { name: '8 Months', value: 8 },
    { name: '9 Months', value: 9 },
    { name: '10 Months', value: 10 },
    { name: '11 Months', value: 11 },
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

            <RadioGroup
              label="Date of Birth"
              required={true}
              value={actualDate}
              onInputChange={(value) => setActualDate(value)}
              data={[{title: 'Actual', value: 'actual'}, {title: 'Estimated', value: 'estimated'}]} />

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

              {actualDate === 'actual' &&
              <>
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
                  inputName="lastName"
                  inputId="lastName"
                  label="Age"
                  value={formData.age}
                  disabled={true}
                  inputPlaceholder="Age"/>
              </>
              }

              {actualDate === 'estimated' &&
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                  <SelectMenu
                    data={[{name: 'Week 1', value: 1},{name: 'Week 2', value: 2},{name: 'Week 3', value: 3},]}
                    value={weeks || 'Weeks'}
                    label="Estimated Birth Date"
                    onInputChange={(value) => {
                      const dob = calculateEstimatedBirthDate(value.value, months, years)
                      setWeeks(value.value)
                      handleChange('dateOfBirth', dob)
                    }}/>
                  </div>
                  <div>
                  <SelectMenu
                    data={monthsData}
                    label="."
                    value={months || 'Months'}
                    onInputChange={(value) => {
                      const dob = calculateEstimatedBirthDate(weeks, value.value, years)
                      setMonths(value.value)
                      handleChange('dateOfBirth', dob)
                    }}/>
                  </div>
                  <div>
                    <TextInput
                    inputType="number"
                    inputName="years"
                    inputId="years"
                    label='.'
                    value={years}
                    onInputChange={(value) => {
                      const dob = calculateEstimatedBirthDate(weeks, months, value)
                      setYears(value.value)
                      handleChange('dateOfBirth', dob)
                    }}
                    inputPlaceholder="Years"/>
                  </div>
                </div>

                <TextInput
                  inputType="date"
                  inputName="middleName"
                  inputId="middleName"
                  label="Date of Birth"
                  required={true}
                  disabled={true}
                  value={formData.dateOfBirth}
                  inputPlaceholder="Date of Birth"/>
              </>
              }
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