import moment from 'moment'
import { calculateAges, titleCase, writeAge } from '../../utils/methods'

export const classifyUserByAge = (birthDate) => {
  const ageInDays = moment().diff(moment(birthDate), 'days')
  const ageCategories = {
    at_birth: [0, 14],
    sixWeeks: [15, 42],
    tenWeeks: [43, 70],
    sixMonths: [71, 182],
    sevenMonths: [183, 213],
    nineMonths: [214, 274],
    twelveMonths: [275, 365],
    eighteenMonths: [366, 548],
    twentyFourMonths: [549, 730],
    tenToFourteenYears: [730, 5110],
    not_applicable: [5110, Infinity],
  }

  const categories = {
    at_birth: 'At Birth',
    sixWeeks: '6 Weeks',
    tenWeeks: '10 Weeks',
    sixMonths: '6 Months',
    sevenMonths: '7 Months',
    nineMonths: '9 Months',
    twelveMonths: '12 Months',
    eighteenMonths: '18 Months',
    twentyFourMonths: '24 Months',
    tenToFourteenYears: '10-14 Years',
    not_applicable: 'Not Applicable',
  }

  const mapping = Object.keys(ageCategories).find(
    (category) =>
      ageInDays >= ageCategories[category][0] &&
      ageInDays <= ageCategories[category][1]
  )

  return categories[mapping]
}


export const formatClientDetails = (patientResource) => {
  const systemId = patientResource.identifier.find(
    (id) => id?.type?.coding?.[0]?.display === 'SYSTEM_GENERATED'
  )?.value
  const clientCategory = classifyUserByAge(patientResource.birthDate)
  const ages = calculateAges(patientResource.birthDate)

  return {
    name: `${patientResource?.name?.[0]?.given?.join(' ')} ${patientResource?.name?.[0]?.family || ''}`,
    systemID: `${systemId || ''}`,
    dob: moment(patientResource?.birthDate).format('Do MMM YYYY'),
    age: writeAge(ages),
    gender: titleCase(patientResource?.gender),
    ages,
    systemId,
    clientCategory,
  }
}
