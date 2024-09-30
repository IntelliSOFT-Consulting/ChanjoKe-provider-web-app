import { calculateAges, writeAge, titleCase } from './methods'

export const flattenPatientData = (patientResource) => {
  const firstName = patientResource?.name?.[0]?.given?.join(' ')
  const lastName = patientResource?.name?.[0]?.family
  const age = calculateAges(patientResource?.birthDate)
  const ageString = writeAge(age)

  return {
    id: patientResource?.id,
    name: `${firstName} ${lastName}`,
    age: age,
    ageString: ageString,
    gender: titleCase(patientResource.gender),
  }
}
