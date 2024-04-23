import moment from 'moment'

export const isEligibleForVaccine = (vaccine) => {
  const today = new Date()
  const dueDate = new Date(vaccine.dueDate?.format('YYYY-MM-DD'))

  return today >= dueDate && vaccine.status !== 'completed'
}

const receivedDose = (vaccinesSchedule, doseNumber) => {
  return vaccinesSchedule.find(
    (item) => item.doseNumber === doseNumber && item.status === 'completed'
  )
}

export const isQualified = (vaccinesSchedule, vaccine) => {
  const vaccineSeries = vaccinesSchedule.filter((item) =>
    vaccine.vaccine === 'Covid 19 (SARS-CoV-2)'
      ? item.vaccine === 'Covid 19 (SARS-CoV-2)'
      : item.nhddCode === vaccine.nhddCode
  )

  if (vaccine.doseNumber > 1) {
    return (
      isEligibleForVaccine(vaccine) &&
      receivedDose(vaccineSeries, vaccine.doseNumber - 1)
    )
  }

  return isEligibleForVaccine(vaccine)
}

export const colorCodeVaccines = (vaccines) => {
  const statuses = vaccines?.reduce(
    (acc, vaccine) => {
      const isAfter = vaccine.dueDate.isAfter(moment())
      const isBeforeAndNotCompleted =
        vaccine.dueDate.isBefore(moment()) &&
        vaccine.lastDate.isBefore(moment()) &&
        (vaccine.status !== 'completed' ||
          vaccine.status !== 'entered-in-error')
      const isCompleted = vaccine.status === 'completed'

      return {
        upcoming: acc.upcoming && isAfter,
        missed: acc.missed && isBeforeAndNotCompleted,
        allAdministered: acc.allAdministered && isCompleted,
        someAdministered: acc.someAdministered || isCompleted,
      }
    },
    {
      upcoming: true,
      missed: true,
      allAdministered: true,
      someAdministered: false,
    }
  )

  if (statuses?.allAdministered) {
    return 'green'
  }
  if (statuses?.upcoming) {
    return 'gray'
  }
  if (statuses?.missed) {
    return 'red'
  }
  if (statuses?.someAdministered) {
    return 'amber'
  }

  return 'gray'
}
