import dayjs from 'dayjs'
import moment from 'moment'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const createVaccinationAppointment = (data, patientID, user) => {
  let dateToAdminister = ''

  try {
    const item = data?.dateCriterion?.find((item) =>
      item.code.coding.some(
        (code) => code.code === 'Earliest-date-to-administer'
      )
    )
    if (item) {
      dateToAdminister = item.value
    }
  } catch (error) {
    return
  }

  return {
    resourceType: 'Appointment',
    status: 'booked',
    description: `${data?.vaccineCode?.[0]?.text}`,
    supportingInformation: [
      {
        reference: `Patient/${patientID}`,
      },
      {
        doseNumber: data?.doseNumberPositiveInt,
      },
      {
        display: user?.orgUnit?.code,
      },
    ],
    start: moment(data?.appointmentDate, 'DD-MM-YYYY').format(
      'YYYY-MM-DDTHH:mm:ssZ'
    ),
    created: moment(dateToAdminister).format('YYYY-MM-DDTHH:mm:ssZ'),
    participant: [
      {
        actor: {
          reference: `Practitioner/${user?.fhirPractitionerId}`,
        },
      },
      {
        actor: {
          reference: `${user?.orgUnit?.code}`,
        },
      },
      {
        actor: {
          reference: `Patient/${patientID}`,
        },
      },
    ],
  }
}

const createVaccineImmunization = (data, patientID, status) => {
  return {
    resourceType: 'Immunization',
    status: status,
    vaccineCode: {
      coding: [
        {
          code: data?.vaccineCode,
          display: data?.vaccineName,
        },
      ],
      text: data?.vaccineName,
    },
    patient: {
      reference: `Patient/${patientID}`,
    },
    encounter: {
      reference: 'Encounter/69ccb241-c809-4dfb-82d4-3e4b70d46dde',
    },
    occurrenceDateTime: dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    doseQuantity: {
      value: data?.doseNumber,
    },
    note: [
      {
        text: 'Facility',
      },
      {
        authorString: data?.contraindicationDetails,
      },
    ],
    education: data?.education,
    protocolApplied: [
      {
        series: '3',
        targetDisease: [
          {
            text: data?.diseaseTarget,
          },
        ],
        seriesDosesString: data?.doseNumber,
      },
    ],
  }
}

const recommendation = (recommendation) => {
  if (!recommendation) {
  } else {
    return {
      vaccineCode: {
        text: recommendation?.vaccineName,
        code: recommendation?.vaccineCode,
      },
      targetDisease: {
        text: recommendation?.diseaseTarget,
      },
      forecastStatus: {
        text: recommendation?.forecastStatus,
      },
      dateCriterion: [
        {
          code: {
            text: 'Date vaccine due',
          },
          value:
            dayjs(recommendation?.vaccineDueDate).format(
              'YYYY-MM-DDTHH:mm:ssZ'
            ) !== 'Invalid Date'
              ? dayjs(recommendation?.vaccineDueDate).format(
                  'YYYY-MM-DDTHH:mm:ssZ'
                )
              : '',
        },
      ],
      description: `category: ${recommendation?.category}`,
      doseNumberString: recommendation?.doseNumber.toString(),
      // "seriesDosesString": "5"
    }
  }
}

const createImmunizationRecommendation = (recommendations, patient) => {
  return {
    resourceType: 'ImmunizationRecommendation',
    patient: {
      reference: `Patient/${patient?.id}`,
    },
    date: dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    recommendation: recommendations
      .filter((recommendation) => recommendation)
      .map((r) => recommendation(r)),
  }
}

const createAppointment = (data, patientID, status) => {
  return {
    resourceType: 'Immunization',
    status: status,
    vaccineCode: {
      coding: [
        {
          code: data?.vaccineCode,
          display: data?.vaccineName,
        },
      ],
      text: data?.vaccineName,
    },
    patient: {
      reference: `Patient/${patientID}`,
    },
    encounter: {
      reference: 'Encounter/69ccb241-c809-4dfb-82d4-3e4b70d46dde',
    },
    occurrenceDateTime: dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    doseQuantity: {
      value: data?.doseNumber,
    },
    note: [
      {
        text: 'Facility',
      },
      {
        authorString: data?.contraindicationDetails,
      },
    ],
    education: data?.education,
    protocolApplied: [
      {
        series: '3',
        targetDisease: [
          {
            text: data?.diseaseTarget,
          },
        ],
        seriesDosesString: data?.doseNumber,
      },
    ],
  }
}

const createNextVaccineAppointment = (vaccines, patientId, user) => {
  const nextVaccineDates = vaccines?.map((vaccine) => vaccine.dueDate)
  const earliestDate = moment(
    nextVaccineDates?.sort((a, b) => moment(a) - moment(b))?.[0]
  )

  return {
    resourceType: 'Appointment',
    status: 'booked',
    description: vaccines?.map((vaccine) => vaccine?.vaccine).join(', '),
    supportingInformation: [
      {
        reference: `Patient/${patientId}`,
      },
      {
        doseNumber: vaccines?.map((vaccine) => vaccine?.doseNumber)?.join(', '),
      },
    ],
    start: earliestDate.format('YYYY-MM-DD'),
    end: earliestDate.add(14, 'days').format('YYYY-MM-DD'),
    created: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    participant: [
      {
        actor: {
          reference: `Practitioner/${user?.fhirPractitionerId}`,
        },
      },
      {
        actor: {
          reference: user.orgUnit?.code,
        },
      },
      {
        actor: {
          reference: `Patient/${patientId}`,
        },
      },
    ],
  }
}
export {
  createVaccineImmunization,
  createAppointment,
  createImmunizationRecommendation,
  createVaccinationAppointment,
  createNextVaccineAppointment,
}
