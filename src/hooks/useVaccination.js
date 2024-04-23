import { useState } from 'react'
import { routineVaccines, nonRoutineVaccines } from '../data/vaccineData'
import { useApiRequest } from '../api/useApiRequest'
import { getAgeInUnits, titleCase } from '../utils/methods'
import moment from 'moment'
import { useSelector } from 'react-redux'

const recommendationsEndpoint = '/hapi/fhir/ImmunizationRecommendation'
const immunizationsEndpoint = '/hapi/fhir/Immunization'

export default function useVaccination() {
  const { post, get, put } = useApiRequest()
  const [recommendations, setRecommendations] = useState(null)
  const [immunizations, setImmunizations] = useState(null)

  const { user } = useSelector((state) => state.userInfo)

  const filterVaccinationRecommendations = (patient, recommendation) => {
    const patientAge = getAgeInUnits(patient.birthDate, 'days')

    const filterVaccines = (vaccines) =>
      vaccines.filter(({ adminRange, constraints, nhddCode }) => {
        const eligibleByAge = patientAge <= adminRange.end
        const eligibleByGender = constraints?.gender
          ? patient.gender !== constraints.gender
          : true

        const isVaccineInSchedule = recommendation?.recommendation?.find(
          (recommendation) =>
            recommendation.vaccineCode?.[0]?.coding?.[0]?.code === nhddCode
        )

        return (eligibleByAge && eligibleByGender) || isVaccineInSchedule
      })

    return [
      ...filterVaccines(routineVaccines),
      ...filterVaccines(nonRoutineVaccines),
    ]
  }

  const formatRecommendationsToFHIR = (patient, recommendation) => {
    const recommendations = filterVaccinationRecommendations(
      patient,
      recommendation
    )

    return {
      resourceType: 'ImmunizationRecommendation',
      id: recommendation?.id,
      patient: {
        reference: `Patient/${patient.id}`,
      },
      date: moment().format('YYYY-MM-DD'),
      recommendation: recommendations.map((recommendation) => {
        let earliestDate = moment(patient.birthDate).add(
          Number(recommendation.adminRange.start),
          'days'
        )

        const latestDate = moment(patient.birthDate).add(
          Number(
            recommendation.adminRange.end === Infinity
              ? 43800
              : recommendation.adminRange.end
          ),
          'days'
        )

        return {
          vaccineCode: {
            coding: [
              {
                code: recommendation.nhddCode,
                display: recommendation.vaccineCode,
              },
            ],
            text: recommendation.vaccineName,
          },
          targetDisease: [
            {
              coding: [
                {
                  code: recommendation.diseaseTarget,
                  display: recommendation.diseaseTarget,
                },
              ],
              text: recommendation.diseaseTarget,
            },
          ],
          forecastStatus: {
            coding: [
              {
                code: 'due',
                display: 'Due',
              },
            ],
          },
          dateCriterion: [
            {
              code: {
                coding: [
                  {
                    code: 'Earliest-date-to-administer',
                    display: 'Earliest-date-to-administer',
                  },
                ],
              },
              value: earliestDate.format('YYYY-MM-DD'),
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
              value: latestDate.format('YYYY-MM-DD'),
            },
          ],
          series: titleCase(recommendation.category),
          description: recommendation.description,
          doseNumberPositiveInt: recommendation.doseNumber,
        }
      }),
    }
  }

  const createRecommendations = async (patient, strategy = 'create') => {
    if (strategy === 'update') {
      const currentRecommendations = await getRecommendations(patient.id)
      const recommendations = formatRecommendationsToFHIR(
        patient,
        currentRecommendations
      )

      return await updateRecommendations(recommendations)
    }

    const recommendations = formatRecommendationsToFHIR(patient)
    return await post(recommendationsEndpoint, recommendations)
  }

  const updateRecommendations = async (recommendation) => {
    await put(`${recommendationsEndpoint}/${recommendation.id}`, recommendation)
  }

  const getRecommendations = async (patient) => {
    const response = await get(
      `${recommendationsEndpoint}?patient=Patient/${patient}`
    )
    const resource = response?.entry?.[0]?.resource

    setRecommendations(resource)
    return resource
  }

  const getImmunizations = async (patientId) => {
    const responses = await get(
      `${immunizationsEndpoint}?patient=Patient/${patientId}`
    )

    const resources = responses?.entry?.map((entry) => entry.resource)

    setImmunizations(resources)
    return resources
  }

  const createImmunization = async (values, patient) => {
    const immunization = {
      resourceType: 'Immunization',
      status: values.status,
      statusReason: {
        coding: [
          {
            code: values.notVaccinatedReason,
            display: values.notVaccinatedReason,
          },
        ],
        text: values.notVaccinatedReason,
      },
      occurrenceDateTime: new Date().toISOString(),
      recorded: moment().format('YYYY-MM-DD'),
      vaccineCode: values.vaccine.vaccineCode,

      description: values.description,
      doseQuantity: {
        value: values.doseQuantity,
        unit: values.doseUnit,
        system: 'http://unitsofmeasure.org',
      },
      patient: {
        reference: `Patient/${patient.id}`,
      },
      performer: [
        {
          actor: {
            reference: `Practitioner/${user.id}`,
          },
        },
      ],
      location: {
        reference: user.facility,
      },
      lotNumber: values.lotNumber,
    }

    await post(immunizationsEndpoint, immunization)
  }

  const updateImmunization = async (immunization) => {
    await put(`${immunizationsEndpoint}/${immunization.id}`, immunization)
  }

  return {
    createRecommendations,
    updateRecommendations,
    getRecommendations,
    getImmunizations,
    createImmunization,
    updateImmunization,
    recommendations,
    immunizations,
  }
}
