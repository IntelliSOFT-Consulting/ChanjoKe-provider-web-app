import moment from 'moment'
import { calculateAges, titleCase, writeAge } from '../../utils/methods'

const classifyUserByAge = (birthDate) => {
  const ageInDays = moment().diff(moment(birthDate), 'days')
  const ageCategories = [
    { name: 'At Birth', start: 0, end: 42 },
    { name: '6 Weeks', start: 42, end: 70 },
    { name: '10 Weeks', start: 70, end: 98 },
    { name: '14 Weeks', start: 98, end: 182 },
    { name: '6 Months', start: 182, end: 213 },
    { name: '7 Months', start: 213, end: 274 },
    { name: '9 Months', start: 274, end: 365 },
    { name: '12 Months', start: 365, end: 548 },
    { name: '18 Months', start: 548, end: 730 },
    { name: '24 Months', start: 730, end: Infinity },
  ]

  return (
    ageCategories.find(
      ({ start, end }) => ageInDays >= start && ageInDays < end
    )?.name || 'Not Applicable'
  )
}

export const formatClientDetails = (patientResource) => {
  const systemId = patientResource.identifier.find(
    (id) => id?.type?.coding?.[0]?.display === 'SYSTEM_GENERATED'
  )?.value
  const clientCategory = classifyUserByAge(patientResource.birthDate)
  const ages = calculateAges(patientResource.birthDate)

  const otherIdentifiers = patientResource.identifier.filter(
    (id) =>
      !id?.type?.coding?.[0]?.display?.toLowerCase().includes('system') &&
      !id?.type?.coding?.[0]?.display?.toLowerCase().includes('caregiver')
  )
  const isNotificationOnly =
    otherIdentifiers?.length === 1 &&
    otherIdentifiers?.[0]?.type?.coding?.[0]?.display
      ?.toLowerCase()
      ?.includes('notification')

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
    hasNotificationOnly: isNotificationOnly,
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
    statusReason: recommendation.statusReason,
    id: recommendation.id,
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

    const filterVaccines = immunizations?.filter(
      (immunization) =>
        immunization.vaccineCode?.coding?.[0]?.display ===
        recommendation.vaccineCode?.[0]?.coding?.[0]?.display
    )
    const getVaccine = filterVaccines?.reduce((acc, vaccine) => {
      if (!acc) return vaccine
      return moment(vaccine.occurrenceDateTime).isAfter(acc.occurrenceDateTime)
        ? vaccine
        : acc
    }, null)

    if (getVaccine) {
      const statusCode = getVaccine.reasonCode?.[0]?.text
      recommendation.status = getVaccine.status === 'completed' ? 'completed' : statusCode
      recommendation.administeredDate = getVaccine.occurrenceDateTime
      recommendation.statusReason = getVaccine.statusReason
      recommendation.id = getVaccine.id
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

export const formatWeightData = (observations, birthDate) => {
  const dob = moment(birthDate)

  const weightData = observations
    .filter((observation) =>
      observation?.code?.coding?.[0]?.display?.toLowerCase()?.includes('weight')
    )
    .sort((a, b) => moment(a.effectiveDateTime) - moment(b.effectiveDateTime))

  const lastDate = moment(
    weightData?.[weightData.length - 1]?.effectiveDateTime
  )

  const days = lastDate.diff(dob, 'days')
  const period =
    days > 7 && days < 30
      ? 'weeks'
      : days > 30 && days < 365
        ? 'months'
        : days > 365
          ? 'years'
          : 'days'

  const formatted = weightData.map((observation) => {
    const date = moment(observation.effectiveDateTime)
    const age = date.diff(dob, period)

    const weight = observation.valueQuantity.value

    return [age, weight]
  })

  return [[period, 'Weight (Kg)'], [0, 0], ...formatted]
}
