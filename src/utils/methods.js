import moment from 'moment'
export const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

export const getOffset = (page, pageSize = 12) => {
  return page === 1 ? 0 : (page - 1) * pageSize
}

export const calculateAges = (date) => {
  const now = moment()
  const dob = moment(date)
  const years = now.diff(dob, 'years')
  dob.add(years, 'years')
  const months = now.diff(dob, 'months')
  dob.add(months, 'months')
  const weeks = now.diff(dob, 'weeks')
  dob.add(weeks, 'weeks')
  const days = now.diff(dob, 'days')
  return { years, months, weeks, days }
}

export const generateDateOfBirth = (
  age = {
    years: 0,
    months: 0,
    weeks: 0,
  }
) => {
  const dob = moment()
    .subtract(age.years, 'years')
    .subtract(age.months, 'months')
    .subtract(age.weeks, 'weeks')
  return dob
}

export const writeAge = (age) => {
  let ageString = ''
  if (age.years > 0) {
    ageString += `${age.years} year${age.years > 1 ? 's' : ''} `
  }
  if (age.months > 0) {
    ageString += `${age.months} month${age.months > 1 ? 's' : ''} `
  }
  if (age.weeks > 0) {
    ageString += `${age.weeks} week${age.weeks > 1 ? 's' : ''} `
  }
  if (age.days > 0) {
    ageString += `${age.days} day${age.days > 1 ? 's' : ''} `
  }
  return ageString
}

export const getAgeAtDose = (dob, doseDate) => {
  const dobDate = moment(dob)
  const doseDateMoment = moment(doseDate)
  const years = doseDateMoment.diff(dobDate, 'years')
  dobDate.add(years, 'years')
  const months = doseDateMoment.diff(dobDate, 'months')
  dobDate.add(months, 'months')
  const weeks = doseDateMoment.diff(dobDate, 'weeks')
  dobDate.add(weeks, 'weeks')
  const days = doseDateMoment.diff(dobDate, 'days')
  return writeAge({ years, months, weeks, days })
}

export const getAgeInUnits = (dob, unit = 'days') => {
  const dobDate = moment(dob)
  const now = moment()
  switch (unit?.toLowerCase()) {
    case 'years':
      return now.diff(dobDate, 'years')
    case 'months':
      return now.diff(dobDate, 'months')
    case 'weeks':
      return now.diff(dobDate, 'weeks')
    case 'days':
      return now.diff(dobDate, 'days')
    default:
      return now.diff(dobDate, 'days')
  }
}

export const generateUniqueCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('')
}