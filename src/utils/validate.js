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

export const lockVaccine = (dueDate, dob) => {
  const today = new Date()
  const birthDate = new Date(dob)
  const dueDay = new Date(dueDate?.format('YYYY-MM-DD'))
  return today < dueDay && today > birthDate
}

export const datePassed = (status, dob, endPeriod) => {
  const today = moment()
  const birthDate = moment(dob)
  const diff = today.diff(birthDate, 'days')
  return status !== 'completed' && diff > endPeriod
}
