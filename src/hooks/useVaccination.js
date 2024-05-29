import moment from 'moment'
import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { nonRoutineVaccines, routineVaccines } from '../data/vaccineData'
import { formatCardTitle } from '../utils/methods'

const recommendationsEndpoint = '/hapi/fhir/ImmunizationRecommendation'
const immunizationsEndpoint = '/hapi/fhir/Immunization'

export default function useVaccination() {
  const { post, get, put } = useApiRequest()
  const [recommendations, setRecommendations] = useState(null)
  const [immunizations, setImmunizations] = useState(null)
  const [immunization, setImmunization] = useState(null)

  const isEligibleByGender = (patientGender, vaccineGender) => {
    if (!vaccineGender) return true
    return patientGender?.toLowerCase() !== vaccineGender?.toLowerCase()
  }

  const filterVaccinationRecommendations = (patient) => {
    const filterVaccines = (vaccines) =>
      vaccines.filter(({ constraints }) =>
        isEligibleByGender(patient.gender, constraints?.gender)
      )

    return [
      ...filterVaccines(routineVaccines),
      ...filterVaccines(nonRoutineVaccines),
    ]
  }

  const formatRecommendationsToFHIR = (patient, recommendation) => {
    const recommendations = filterVaccinationRecommendations(patient)

    const formatDate = (date) => moment(date).format('YYYY-MM-DD')

    const formatDateCriterion = (code, display, date) => ({
      code: {
        coding: [{ code, display }],
      },
      value: formatDate(date),
    })

    const formatRecommendation = (rec, birthDate) => {
      const startDays = Number(rec.adminRange.start)
      const endDays = Number(
        rec.adminRange.end === Infinity ? 43800 : rec.adminRange.end
      )

      const earliestDate = moment(birthDate).add(startDays, 'days')
      const latestDate = moment(birthDate).add(endDays, 'days')

      return {
        vaccineCode: {
          coding: [{ code: rec.nhddCode, display: rec.vaccineCode }],
          text: rec.vaccineName,
        },
        targetDisease: [
          {
            coding: [{ code: rec.diseaseTarget, display: rec.diseaseTarget }],
            text: rec.diseaseTarget,
          },
        ],
        forecastStatus: {
          coding: [{ code: 'due', display: 'Due' }],
        },
        dateCriterion: [
          formatDateCriterion(
            'Earliest-date-to-administer',
            'Earliest-date-to-administer',
            earliestDate
          ),
          formatDateCriterion(
            'Latest-date-to-administer',
            'Latest-date-to-administer',
            latestDate
          ),
        ],
        series: formatCardTitle(rec.category),
        description: rec.description,
        doseNumberPositiveInt: rec.doseNumber,
        seriesDosesString: rec.dependentVaccine
          ? `${rec.dependentVaccine},${rec.dependencyPeriod}`
          : null,
      }
    }

    return {
      resourceType: 'ImmunizationRecommendation',
      id: recommendation?.id,
      patient: { reference: `Patient/${patient.id}` },
      date: formatDate(moment()),
      recommendation: recommendations.map((rec) =>
        formatRecommendation(rec, patient.birthDate)
      ),
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

  const searchRecommendations = async (params) => {
    const response = await get(`${recommendationsEndpoint}?${params}`)
    const resources = response?.entry?.map((entry) => entry.resource)

    setRecommendations(resources)
    return resources
  }

  const getImmunizations = async (patientId, param = '') => {
    const responses = await get(
      `${immunizationsEndpoint}?patient=Patient/${patientId}&_count=10000000&status:not=entered-in-error${
        param ? `&${param}` : ''
      }`
    )

    const resources = responses?.entry?.map((entry) => entry.resource)

    setImmunizations(resources)
    return resources
  }

  const getFacilityImmunizations = async (facilityId) => {
    const responses = await get(
      `${immunizationsEndpoint}?location=${facilityId}&_count=10000000&status:not=entered-in-error&_count=100`
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

  const getPatientImmunizations = async (patientId) => {
    const response = await get(
      `${immunizationsEndpoint}?patient=Patient/${patientId}&status:not=entered-in-error`
    )
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
    searchRecommendations,
    getImmunizations,
    createImmunization,
    getImmunization,
    getPatientImmunizations,
    updateImmunization,
    recommendations,
    immunizations,
    immunization,
    getFacilityImmunizations,
  }
}
