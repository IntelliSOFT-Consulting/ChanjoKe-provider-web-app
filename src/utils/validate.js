import moment from 'moment'
export default function validate(currentField, fieldValue, validationRules) {
  if (validationRules) {
    const rulesToApply = Object.keys(validationRules[currentField])

    return rulesToApply.map((rule) => {
      if (rule === 'required' && validationRules[currentField].required) {
        const isRequiredValid =
          fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
        if (isRequiredValid) {
          return {
            valid: true,
            [currentField]: 'Valid',
          }
        } else {
          return {
            valid: false,
            [currentField]: `${currentField} is a required value`,
          }
        }
      }

      if (rule === 'minLen') {
        const isMinLenValid =
          typeof fieldValue === 'string' || typeof fieldValue === 'number'

        // then, check the number of characters in the value are more than 4
        if (isMinLenValid) {
          const minLength = validationRules[currentField].minLen
          const isMinLengthValid = String(fieldValue).length >= minLength

          if (isMinLengthValid) {
            return {
              valid: true,
              [currentField]: 'Valid',
            }
          } else {
            return {
              valid: false,
              [currentField]: `the field ${currentField} requires ${validationRules[currentField].minLen} characters`,
            }
          }
        } else {
          return {
            valid: false,
            [currentField]: `${currentField} should be a string or number`,
          }
        }
      }
    })
  }
}

export const lockVaccine = (startPeriod, dob) => {
  const today = moment()
  const birthDate = moment(dob)
  const diff = today.diff(birthDate, 'days')
  return diff < startPeriod
}

export const datePassed = (status, dob, endPeriod) => {
  const today = moment()
  const birthDate = moment(dob)
  const diff = today.diff(birthDate, 'days')
  return status !== 'completed' && diff > endPeriod
}

export const calculateNextDueDate = (dob, currentVaccine,lastDependency=null) => {
  /*
  Definitions:
  - dob: Date of Birth
  - currentVaccine: The current vaccine to be administered
  - lastDependency: The last vaccine administered which the current vaccine depends on to check if the current vaccine is due/how long it has been due.

  Implementation:
  1. If the lastDependency is not null, then the current vaccine is dependent on the lastDependency to calculate the due date.
     Example:
      - lastDependency: {vaccineName: 'BCG', occurrenceDateTime: '2021-01-01T00:00:00.000Z', category: '4_weeks'}
      - currentVaccine: {vaccineName: 'OPV', category: '6_weeks'}
      - To get the next due date for the current vaccine, we need to get occurrenceDateTime of the lastDependency and add 2 weeks to it (the difference between the lastDependency and the currentVaccine)
  2. If the lastDependency is null, then the current vaccine is not dependent on dob to calculate the due date (use category to calculate the due date)

  Available categories:
  at_birth - 0 days
  6_weeks - 42 days
  10_weeks - 70 days
  14_weeks - 98 days
  9_months - 274 days
  18_months - 548 days
  2_years - 730 days
  5_years - 1825 days
  10_years - 3650 days
   */

}