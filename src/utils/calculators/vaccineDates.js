import moment from 'moment'

export const generateDueDates = (vaccines, birthDate) => {
  const calculateDueDate = (startDate, daysToAdd) =>
    moment(startDate)
      .add(daysToAdd === Infinity ? 43800 : daysToAdd, 'days')
      .format('YYYY-MM-DD')

  const processDependentVaccine = (vaccine, series) => {
    const dependencyIndex = series.findIndex(
      (v) => v.vaccineCode === vaccine.vaccineCode
    )
    let dueDate = moment(birthDate).add(series[0].adminRange.start, 'days')

    for (let i = 1; i <= dependencyIndex; i++) {
      dueDate.add(series[i].dependencyPeriod, 'days')
    }

    return {
      dueDate: dueDate.format('YYYY-MM-DD'),
      eligibilityEndDate: calculateDueDate(birthDate, vaccine.adminRange.end),
    }
  }

  const processIndependentVaccine = (vaccine) => ({
    dueDate: calculateDueDate(birthDate, vaccine.adminRange.start),
    eligibilityEndDate: calculateDueDate(birthDate, vaccine.adminRange.end),
  })

  return vaccines.map((vaccine) => {
    const dates = vaccine.dependentVaccine
      ? processDependentVaccine(
          vaccine,
          vaccines
            .filter((v) => v.nhddCode === vaccine.nhddCode)
            .sort((a, b) => a.vaccineCode - b.vaccineCode)
        )
      : processIndependentVaccine(vaccine)

    return { ...vaccine, ...dates }
  })
}
