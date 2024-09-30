import moment from 'moment'

export const groupByVaccineName = (reports) => {
  return reports?.reduce((acc, rec) => {
    const vaccineName = rec.vaccine_name
    if (!acc[vaccineName]) {
      acc[vaccineName] = {
        below1: [],
        above1: [],
      }
    }
    if (rec.age_group === 'Under 1 Year') {
      acc[vaccineName].below1.push(rec)
    } else {
      acc[vaccineName].above1.push(rec)
    }
    return acc
  }, {})
}

export const format710 = (reports) => {
  if (!reports) return
  const groupByVaccine = groupByVaccineName(reports)

  return Object.keys(groupByVaccine).flatMap((vaccineName) => {
    const { below1, above1 } = groupByVaccine[vaccineName]

    const processAgeGroup = (ageGroup, ageGroupLabel) => {
      const vaccineGroupByDate = ageGroup.reduce((acc, rec) => {
        const date = moment(rec.occ_date).format('DD-MM-YYYY')
        if (!acc[date]) {
          acc[date] = 0
          acc.total = 0
        }
        acc[date] += rec.count
        acc.total += rec.count
        return acc
      }, {})

      return {
        antigen: vaccineName,
        ageGroup: ageGroupLabel,
        ...vaccineGroupByDate,
      }
    }

    return [
      processAgeGroup(below1, 'Under 1 Year'),
      processAgeGroup(above1, 'Above 1 Year'),
    ]
  })
}
