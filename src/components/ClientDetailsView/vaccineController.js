import moment from 'moment'

export const isEligibleForVaccine = (vaccine) => {
  const today = new Date()
  const dueDate = new Date(vaccine.dueDate?.format('YYYY-MM-DD'))

  return (
    (today >= dueDate && vaccine.status !== 'completed') ||
    ['not-done', 'entered-in-error'].includes(vaccine.status)
  )
}

const receivedDose = (vaccinesSchedule, doseNumber) => {
  return vaccinesSchedule.some(
    (item) => item.doseNumber === doseNumber && item.status === 'completed'
  )
}

export const isQualified = (vaccinesSchedule, vaccine) => {
  if (vaccine.disease === 'Covid 19 (SARS-CoV-2)') {
    const covidVaccines = vaccinesSchedule.filter(
      (item) => item.disease === 'Covid 19 (SARS-CoV-2)'
    )

    const maxCompletedDose = Math.max(
      ...covidVaccines
        .filter((v) => v.status === 'completed')
        .map((v) => v.doseNumber),
      0
    )

    if (vaccine.doseNumber <= maxCompletedDose) {
      return false
    }

    const sameVaccineBrand = covidVaccines.filter(
      (v) => v.vaccineId.split('-')[2] === vaccine.vaccineId.split('-')[2]
    )
    const maxCompletedDoseForBrand = Math.max(
      ...sameVaccineBrand
        .filter((v) => v.status === 'completed')
        .map((v) => v.doseNumber),
      0
    )

    return vaccine.doseNumber === maxCompletedDoseForBrand + 1
  }

  const vaccineSeries = vaccinesSchedule.filter(
    (item) => item.nhddCode === vaccine.nhddCode
  )

  const isSameDoseCompleted = vaccineSeries?.some(
    (item) =>
      item.doseNumber === vaccine.doseNumber && item.status === 'completed'
  )

  if (vaccine.doseNumber > 1) {
    return (
      isEligibleForVaccine(vaccine) &&
      !isSameDoseCompleted &&
      receivedDose(vaccineSeries, vaccine.doseNumber - 1)
    )
  }

  return isEligibleForVaccine(vaccine)
}

export const colorCodeVaccines = (vaccines, routine = true) => {
  const allUpcoming = vaccines.every(
    (vaccine) =>
      vaccine.status === 'Due' &&
      moment(vaccine.dueDate?.format('YYYY-MM-DD')).isAfter(moment())
  )

  const allAdministered = vaccines.every(
    (vaccine) => vaccine.status === 'completed'
  )

  const someAdministered = vaccines.some(
    (vaccine) => vaccine.status === 'completed'
  )

  const late =
    vaccines.every((vaccine) => vaccine.status !== 'completed') &&
    vaccines.some((vaccine) =>
      moment(vaccine.dueDate?.format('YYYY-MM-DD'))
        .add(14, 'days')
        .isBefore(moment())
    )

  if (allAdministered) {
    return 'green'
  }
  if (allUpcoming) {
    return 'gray'
  }
  if (late && routine) {
    return 'red'
  }
  if (someAdministered) {
    return 'orange'
  }

  return 'gray'
}

export const outGrown = (lastDate) => {
  const today = moment()
  const last = moment(lastDate)
  return today.isAfter(last)
}
