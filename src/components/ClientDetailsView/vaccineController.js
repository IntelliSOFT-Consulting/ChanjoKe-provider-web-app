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
  const given = vaccinesSchedule.find(
    (item) => item.doseNumber === doseNumber && item.status === 'completed'
  )
}

export const isQualified = (vaccinesSchedule, vaccine) => {
  const vaccineSeries = vaccinesSchedule.filter((item) =>
    vaccine.vaccine === 'Covid 19 (SARS-CoV-2)'
      ? item.vaccine === 'Covid 19 (SARS-CoV-2)'
      : item.nhddCode === vaccine.nhddCode
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
