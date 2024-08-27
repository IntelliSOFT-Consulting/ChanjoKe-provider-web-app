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

export const isCovidQualified = (vaccinesSchedule, vaccine) => {
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

  return true
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
const VACCINE_STATUS = {
  NOT_DONE: 'not-done',
  COMPLETED: 'completed',
};

const REASON_TYPES = {
  RELIGIOUS: 'Religious objection',
  PATIENT: 'Caregiver refusal',
  RESCHEDULED: 'Rescheduled',
};

const filterVaccines = (immunizations, statusReason) =>
  immunizations.filter(
    (vaccine) =>
      vaccine.status === VACCINE_STATUS.NOT_DONE &&
      (vaccine.statusReason?.text === statusReason ||
        vaccine.reasonCode?.[0]?.text === statusReason)
  );

const isVaccineCompleted = (immunizations, vaccine) =>
  immunizations.some(
    (v) =>
      v.vaccineCode.text === vaccine.vaccineCode.text &&
      v.status === VACCINE_STATUS.COMPLETED
  );

const listVaccines = (immunizations) =>
  immunizations.map((vaccine) => vaccine.vaccineCode.text).join(', ');

const createAlert = (vaccines, reason) => {
  if (vaccines.length === 0) return null;

  const vaccineList = listVaccines(vaccines);
  if (reason === REASON_TYPES.RESCHEDULED) {
    const verb = vaccines.length > 1 ? 'were' : 'was';
    return `${vaccineList} ${verb} rescheduled`;
  }
  return `${vaccineList} not administered because of ${reason}`;
};

const createAlertForReason = (immunizations, reason) => {
  const filtered = filterVaccines(immunizations, reason);
  const finalFiltered = reason === REASON_TYPES.RESCHEDULED
    ? filtered.filter(vaccine => !isVaccineCompleted(immunizations, vaccine))
    : filtered;
  return createAlert(finalFiltered, reason);
};

export const vaccineAlerts = (immunizations) => ({
  religious: createAlertForReason(immunizations, REASON_TYPES.RELIGIOUS),
  refusal: createAlertForReason(immunizations, REASON_TYPES.PATIENT),
  rescheduled: createAlertForReason(immunizations, REASON_TYPES.RESCHEDULED),
});