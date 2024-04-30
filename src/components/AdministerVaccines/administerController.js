import moment from 'moment'

export const getBodyWeight = (observation) => {
  const unit = observation?.valueQuantity?.unit
  const value = observation?.valueQuantity?.value

  return {
    weightUnit: unit,
    currentWeight: value,
  }
}

export const createImmunizationResource = (values, vaccines, patient, user) => {
  return vaccines.map((vaccine) => {
    const resource = {
      resourceType: 'Immunization',
      occurrenceDateTime: new Date().toISOString(),
      recorded: new Date().toISOString(),
      status: vaccine.status,
      vaccineCode: {
        coding: [
          {
            code: vaccine.nhddCode,
            display: vaccine.vaccineId,
          },
        ],
        text: vaccine.vaccine,
      },
      description: values.description,
      doseQuantity: {
        value: vaccine.doseNumber,
        unit: vaccine.doseNumber,
        system: 'http://unitsofmeasure.org',
      },
      patient: {
        reference: `Patient/${patient.id}`,
      },
      performer: [
        {
          actor: {
            reference: `Practitioner/${user.fhirPractitionerId}`,
          },
        },
        {
          function: {
            coding: [
              {
                code: 'PP',
                display: 'Primary performer',
              },
            ],
            text: user?.location,
          },
        },
      ],
      location: {
        reference: user.facility,
      },
      lotNumber: vaccine.batchNumber,
      note: [
        {
          text: user?.location
        }
      ]
    }

    if (vaccine.status !== 'completed') {
      resource.statusReason = {
        coding: [
          {
            code: values.notVaccinatedReason,
            display: values.notVaccinatedReason,
          },
        ],
        text: values.notVaccinatedReason,
      }
    }

    if (vaccine.id) {
      resource.id = vaccine.id
      if (vaccine.status === 'completed' && vaccine.statusReason) {
        resource.statusReason = vaccine.statusReason
      }
    }

    return resource
  })
}

const formatVaccines = (vaccines) => {
  return vaccines.map((vaccine) => {
    const getDateValue = (code) => {
      return vaccine?.dateCriterion?.find(
        (date) => date.code?.coding?.[0]?.code === code
      )?.value
    }

    const name = vaccine?.vaccineCode?.[0]?.text
    const vaccineCode = vaccine?.vaccineCode?.[0]?.coding?.[0]?.display
    const doseNumber = vaccine?.doseNumberPositiveInt
    const nextDose = parseInt(vaccine?.seriesDosesString?.split(',')?.[1] || 0)

    return {
      name,
      vaccineCode,
      doseNumber,
      nextDose,
      earliestDate: getDateValue('Earliest-date-to-administer'),
      latestDate: getDateValue('Latest-date-to-administer'),
    }
  })
}

export const updateVaccineDueDates = (
  recommendation,
  selectedVaccines,
  nextDate = null
) => {
  const recommendations = recommendation?.recommendation || []

  selectedVaccines.forEach((selectedVaccine) => {
    const currentVaccine = recommendations.find(
      (recommendation) =>
        recommendation.vaccineCode[0].coding[0].display ===
        selectedVaccine.vaccineId
    )

    const currentVaccineIndex = recommendations.findIndex(
      (recommendation) =>
        recommendation.vaccineCode[0].coding[0].display ===
        selectedVaccine.vaccineId
    )

    if (currentVaccine) {
      if (nextDate) {
        const currentEarliestDate = moment(
          currentVaccine.dateCriterion.find(
            (date) => date.code.coding[0].code === 'Earliest-date-to-administer'
          ).value
        )

        const currentLatestDate = moment(
          currentVaccine.dateCriterion.find(
            (date) => date.code.coding[0].code === 'Latest-date-to-administer'
          ).value
        )

        const difference = currentLatestDate.diff(currentEarliestDate, 'days')

        const nextEarliestDate = moment(nextDate).format('YYYY-MM-DD')
        const nextLatestDate = moment(nextEarliestDate)
          .add(difference, 'days')
          .format('YYYY-MM-DD')

        recommendations[currentVaccineIndex].dateCriterion = [
          {
            code: {
              coding: [
                {
                  code: 'Earliest-date-to-administer',
                  display: 'Earliest-date-to-administer',
                },
              ],
            },
            value: nextEarliestDate,
          },
          {
            code: {
              coding: [
                {
                  code: 'Latest-date-to-administer',
                  display: 'Latest-date-to-administer',
                },
              ],
            },
            value: nextLatestDate,
          },
        ]
      }

      const dependentVaccines = recommendations
        .filter(
          (recommendation) =>
            recommendation.vaccineCode[0].coding[0].code ===
              selectedVaccine.nhddCode &&
            recommendation.doseNumberPositiveInt > selectedVaccine.doseNumber
        )
        .sort((a, b) => a.doseNumberPositiveInt - b.doseNumberPositiveInt)

      const formatted = formatVaccines(dependentVaccines)

      let startDate = nextDate ? moment(nextDate) : moment()

      formatted.forEach((dependentVaccine) => {
        const difference = moment(dependentVaccine.latestDate).diff(
          moment(dependentVaccine.earliestDate),
          'days'
        )

        const nextEarliestDate = startDate
          .add(dependentVaccine.nextDose, 'days')
          .format('YYYY-MM-DD')
        const nextLatestDate = moment(nextEarliestDate)
          .add(difference, 'days')
          .format('YYYY-MM-DD')

        dependentVaccine.earliestDate = nextEarliestDate
        dependentVaccine.latestDate = nextLatestDate
        startDate = moment(nextEarliestDate)
      })

      formatted.forEach((dependentVaccine) => {
        const vaccineIndex = recommendations.findIndex(
          (recommendation) =>
            recommendation.vaccineCode[0].coding[0].display ===
            dependentVaccine.vaccineCode
        )

        if (vaccineIndex !== -1) {
          recommendations[vaccineIndex].dateCriterion = [
            {
              code: {
                coding: [
                  {
                    code: 'Earliest-date-to-administer',
                    display: 'Earliest-date-to-administer',
                  },
                ],
              },
              value: dependentVaccine.earliestDate,
            },
            {
              code: {
                coding: [
                  {
                    code: 'Latest-date-to-administer',
                    display: 'Latest-date-to-administer',
                  },
                ],
              },
              value: dependentVaccine.latestDate,
            },
          ]
        }
      })
    }
  })

  return recommendation
}
