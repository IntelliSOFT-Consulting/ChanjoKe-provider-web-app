import moment from 'moment'
import { calculateAges, titleCase, writeAge } from '../../utils/methods'

export const classifyUserByAge = (birthDate) => {
  const ageInDays = moment().diff(moment(birthDate), 'days')
  if (ageInDays <= 14) return 'At Birth'
  if (ageInDays <= 42) return '6 Weeks'
  if (ageInDays <= 70) return '10 Weeks'
  if (ageInDays <= 182) return '6 Months'
  if (ageInDays <= 213) return '7 Months'
  if (ageInDays <= 274) return '9 Months'
  if (ageInDays <= 365) return '12 Months'
  if (ageInDays <= 548) return '18 Months'
  if (ageInDays <= 730) return '24 Months'
  if (ageInDays <= 5110) return '10-14 Years'
  return 'Not Applicable'
}

export const formatClientDetails = (patientResource) => {
  const systemId = patientResource.identifier.find(
    (id) => id?.type?.coding?.[0]?.display === 'SYSTEM_GENERATED'
  )?.value
  const clientCategory = classifyUserByAge(patientResource.birthDate)
  const ages = calculateAges(patientResource.birthDate)

  return {
    name: `${patientResource?.name?.[0]?.given?.join(' ')} ${
      patientResource?.name?.[0]?.family || ''
    }`,
    systemID: `${systemId || ''}`,
    dob: moment(patientResource?.birthDate).format('Do MMM YYYY'),
    age: writeAge(ages),
    gender: titleCase(patientResource?.gender),
    ages,
    systemId,
    clientCategory,
  }
}

export const formatRecommendationsToObject = (recommendation) => {
  const {
    dateCriterion,
    vaccineCode,
    doseNumberPositiveInt,
    administeredDate,
    targetDisease,
    status,
    forecastStatus,
  } = recommendation

  const dependent = recommendation.seriesDosesString?.split(',')

  const earliestDate = dateCriterion?.find(
    (date) => date.code?.coding?.[0]?.code === 'Earliest-date-to-administer'
  )?.value
  const latestDate = dateCriterion?.find(
    (date) => date.code?.coding?.[0]?.code === 'Latest-date-to-administer'
  )?.value
  const vaccine = vaccineCode?.[0]?.text
  const dueDate = earliestDate ? moment(earliestDate) : null
  const lastDate = latestDate ? moment(latestDate) : null
  const disease = targetDisease?.text
  const displayStatus = status || forecastStatus?.coding?.[0]?.display
  const vaccineId = vaccineCode?.[0]?.coding?.[0]?.display
  const nhddCode = vaccineCode?.[0]?.coding?.[0]?.code
  const dependentVaccine = dependent?.[0]
  const dependencyPeriod = dependent?.[1] ? parseInt(dependent?.[1]) : null

  return {
    vaccine,
    doseNumber: doseNumberPositiveInt,
    dueDate,
    lastDate,
    administeredDate: administeredDate ? moment(administeredDate) : null,
    disease,
    status: displayStatus,
    vaccineId,
    nhddCode,
    dependentVaccine,
    dependencyPeriod,
    id: recommendation.id,
    statusReason: recommendation.statusReason,
  }
}

export const groupVaccinesByCategory = (recommendation, immunizations = []) => {
  const categories = {
    routine: {},
    non_routine: {},
  }

  const routineCategories = new Set()
  const nonRoutineCategories = new Set()

  recommendation.forEach((recommendation) => {
    const categoryType =
      recommendation.description === 'routine'
        ? routineCategories
        : nonRoutineCategories
    categoryType.add(recommendation.series)

    const getVaccine = immunizations?.find(
      (immunization) =>
        immunization.vaccineCode?.coding?.[0]?.display ===
        recommendation.vaccineCode?.[0]?.coding?.[0]?.display
    )

    if (getVaccine) {
      recommendation.id = getVaccine.id
      recommendation.status = getVaccine.status
      recommendation.administeredDate = getVaccine.occurrenceDateTime
      recommendation.statusReason = getVaccine.statusReason
    }

    const category =
      categories[
        recommendation.description === 'routine' ? 'routine' : 'non_routine'
      ]
    category[recommendation.series] = category[recommendation.series] || []
    category[recommendation.series].push(
      formatRecommendationsToObject(recommendation)
    )
  })

  return categories
}
