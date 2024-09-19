export const checkIfVaccineIsAlreadyAdministered = (
  recommendation,
  immunizations,
  selectedVaccines
) => {
  immunizations = immunizations?.filter(
    (immunization) => immunization.status === 'completed'
  )
  const recommendations = recommendation.recommendation
  const selectedVaccineNames = selectedVaccines.map(
    (vaccine) => vaccine.vaccine
  )

  const groupVaccineRecommendations = () => {
    const groupedVaccines = {}
    recommendations.forEach((rec) => {
      const vaccineName = rec.vaccineCode?.[0]?.text
      if (
        vaccineName &&
        selectedVaccineNames.some((name) => vaccineName.includes(name))
      ) {
        const vaccine = selectedVaccineNames.find((name) =>
          vaccineName.includes(name)
        )
        groupedVaccines[vaccine] = [...(groupedVaccines[vaccine] || []), rec]
      }
    })
    return groupedVaccines
  }

  const createVaccineData = (vaccine, recommendations) => {
    const sortedRecs = recommendations.sort((a, b) =>
      (a.vaccineCode?.[0]?.text || '').localeCompare(
        b.vaccineCode?.[0]?.text || ''
      )
    )
    const administeredCount = immunizations?.filter((immunization) =>
      recommendations.some(
        (rec) => rec.vaccineCode?.[0]?.text === immunization.vaccineCode?.text
      )
    ).length || 0

    const unadministeredVaccine = sortedRecs[administeredCount] || sortedRecs[0]
    const selectedVaccine = selectedVaccines.find((v) =>
      unadministeredVaccine.vaccineCode?.[0]?.text?.includes(v.vaccine)
    )

    return {
      vaccine: unadministeredVaccine.vaccineCode?.[0]?.text || vaccine,
      nhddCode: unadministeredVaccine.vaccineCode?.[0]?.coding?.[0]?.code,
      vaccineId: unadministeredVaccine.vaccineCode?.[0]?.coding?.[0]?.display,
      doseNumber: unadministeredVaccine.doseNumberPositiveInt,
      status: 'completed',
      batchNumber: selectedVaccine?.batchNumber,
    }
  }

  const groupedVaccines = groupVaccineRecommendations()
  return Object.entries(groupedVaccines).map(([vaccine, recommendations]) =>
    createVaccineData(vaccine, recommendations)
  )
}
