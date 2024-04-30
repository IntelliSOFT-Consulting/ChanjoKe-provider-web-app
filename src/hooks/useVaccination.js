import moment from 'moment'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useApiRequest } from '../api/useApiRequest'
import { nonRoutineVaccines, routineVaccines } from '../data/vaccineData'
import { formatCardTitle, getAgeInUnits } from '../utils/methods'

const recommendationsEndpoint = '/hapi/fhir/ImmunizationRecommendation'
const immunizationsEndpoint = '/hapi/fhir/Immunization'

export default function useVaccination() {
  const { post, get, put } = useApiRequest()
  const [recommendations, setRecommendations] = useState(null)
  const [immunizations, setImmunizations] = useState(null)
  const [immunization, setImmunization] = useState(null)

  const filterVaccinationRecommendations = (patient, recommendation) => {
    const patientAge = getAgeInUnits(patient.birthDate, 'days')

    const filterVaccines = (vaccines) =>
      vaccines.filter(({ adminRange, constraints, nhddCode, description }) => {
        const eligibleByAge = patientAge <= adminRange.end
        const eligibleByGender = constraints?.gender
          ? patient.gender !== constraints.gender
          : true

        const isVaccineInSchedule = recommendation?.recommendation?.find(
          (recommendation) =>
            recommendation.vaccineCode?.[0]?.coding?.[0]?.code === nhddCode
        )

        return (
          (eligibleByAge && eligibleByGender) ||
          isVaccineInSchedule ||
          description === 'non-routine'
        )
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
          series: formatCardTitle(recommendation.category),
          description: recommendation.description,
          doseNumberPositiveInt: recommendation.doseNumber,
          seriesDosesString: recommendation.dependentVaccine
            ? `${recommendation.dependentVaccine},${recommendation.dependencyPeriod}`
            : null,
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

  const getImmunizations = async (patientId, param='') => {
    const responses = await get(
      `${immunizationsEndpoint}?patient=Patient/${patientId}${param ? `&${param}` : ''}`
    )

    const resources = responses?.entry?.map((entry) => entry.resource)

    setImmunizations(resources)
    return resources
  }

  const getImmunization = async (immunizationId) => {
    const response = await get(`${immunizationsEndpoint}/${immunizationId}`)
    setImmunization(response)
    return response
  }

  const createImmunization = async (immunization) => {
    return await post(immunizationsEndpoint, immunization)
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
    getImmunization,
    updateImmunization,
    recommendations,
    immunizations,
    immunization,
  }
}
