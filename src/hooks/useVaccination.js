import { useState } from 'react'
import { routineVaccines, nonRoutineVaccines } from '../data/vaccineData'
import { useApiRequest } from '../api/useApiRequest'
import { getAgeInUnits } from '../utils/methods'
import moment from 'moment'
import { useSelector } from 'react-redux'

const fhirEndpoint = '/hapi/fhir/ImmunizationRecommendation'

export default function useVaccination() {
  const { post, get, put } = useApiRequest()

  const { user } = useSelector((state) => state.userInfo)

  const filterVaccinationRecommendations = (patient) => {
    const patientAge = getAgeInUnits(patient.birthDate, 'days')

    const filterVaccines = (vaccines) =>
      vaccines.filter(({ adminRange, constraints }) => {
        const eligibleByAge = patientAge <= adminRange.end
        const eligibleByGender = constraints?.gender
          ? patient.gender !== constraints.gender
          : true
        return eligibleByAge && eligibleByGender
      })

    return [
      ...filterVaccines(routineVaccines),
      ...filterVaccines(nonRoutineVaccines),
    ]
  }

  const formatRecommendationsToFHIR = (patient) => {
    const recommendations = filterVaccinationRecommendations(patient)

    return {
      resourceType: 'ImmunizationRecommendation',
      patient: {
        reference: `Patient/${patient.id}`,
      },
      date: moment().format('YYYY-MM-DD'),
      authority: {
        reference: user?.facility,
      },
      recommendation: recommendations.map((recommendation) => {
        let dueDays =
          getAgeInUnits(patient.birthDate, 'days') +
          recommendation.adminRange.start
        let dueDate = moment(patient.birthDate)
          .add(dueDays, 'days')
          .format('YYYY-MM-DD')
        if (
          recommendation.dependentVaccine &&
          recommendation.dependencyPeriod
        ) {
          const dependentVaccine = recommendations.find(
            (vaccine) => vaccine.code === recommendation.dependentVaccine
          )
          const dependentVaccineDueDate =
            getAgeInUnits(patient.birthDate, 'days') +
            dependentVaccine.adminRange.start
          dueDays = dependentVaccineDueDate + recommendation.dependencyPeriod
          dueDate = moment(patient.birthDate)
            .add(dueDays, 'days')
            .format('YYYY-MM-DD')
        }

        return {
          date: moment().format('YYYY-MM-DD'),
          vaccineCode: {
            coding: [
              {
                code: recommendation.vaccineName,
                display: recommendation.vaccineCode,
              },
            ],
          },
          targetDisease: [
            {
              coding: [
                {
                  code: recommendation.diseaseTarget,
                  display: recommendation.diseaseTarget,
                },
              ],
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
                    code: 'due',
                    display: 'Due',
                  },
                ],
              },
              value: dueDate,
            },
          ],
          seriesDoses: recommendations.filter(
            (item) =>
              item.vaccineCode.slice(0, -1) ===
              recommendation.vaccineCode.slice(0, -1)
          ),
        }
      }),
    }
  }

  const createRecommendations = async (patient) => {
    const recommendations = formatRecommendationsToFHIR(patient)
    await post(fhirEndpoint, recommendations)
  }

  const updateRecommendations = async (patient) => {
    const recommendations = formatRecommendationsToFHIR(patient)
    await put(fhirEndpoint, recommendations)
  }

  const getRecommendations = async (patient) => {
    const response = await get(`${fhirEndpoint}?patient=Patient/${patient.id}`)
    return response.data
  }

  return {
    createRecommendations,
    updateRecommendations,
    getRecommendations,
  }
}
