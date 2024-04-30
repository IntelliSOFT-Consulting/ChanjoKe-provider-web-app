import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { identificationOptions } from '../../data/options/clientDetails'
import usePatient from '../../hooks/usePatient'
import { calculateAges, writeAge } from '../../utils/methods'

export default function PreloadDetails({
  patientId,
  form,
  setCaregivers,
  setIdOptions,
  setIsAdult,
  counties,
  handleCountyChange,
  handleSubCountyChange,
  handleWardChange,
  setEstimatedAge,
}) {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const { getPatient } = usePatient()

  const fetchPatient = async () => {
    setLoading(true)
    const patient = await getPatient(patientId)
    setPatient(patient)
  }

  const formatPatient = async () => {
    const firstName = patient.name[0].given[0]
    const middleName = patient.name[0].given[1] || ''
    const lastName = patient.name[0].family
    const dateOfBirth = dayjs(patient.birthDate)
    const gender = patient.gender
    const phoneNumber = patient.telecom[0].value?.slice(-9)
    const phoneCode = patient.telecom[0].value?.slice(0, -9) || '+254'
    const identificationType = patient.identifier[0].type?.coding?.[0]?.display
    const identificationNumber = patient.identifier[0].value
    const county = patient.address[0].district
    const subCounty = patient.address[0]?.line?.[1]
    const ward = patient.address[0]?.line?.[2]
    const townCenter = patient.address[0]?.line?.[3]
    const estateOrHouseNo = patient.address[0]?.line?.[4]
    const estimatedAge = patient.multipleBirthBoolean === true
    const caregivers = patient.contact.map((caregiver) => {
      return {
        caregiverType: caregiver.relationship[0].coding?.[0]?.display,
        caregiverName: caregiver.name?.text,
        phoneCode: caregiver.telecom[0].value?.slice(0, -9) || '+254',
        phoneNumber: caregiver.telecom[0].value?.slice(-9),
      }
    })

    const ages = calculateAges(dateOfBirth?.format('YYYY-MM-DD'))
    const age = writeAge(ages)

    const identificationsQualified = identificationOptions.filter(
      (option) => ages.years >= option.minAge && ages.years <= option.maxAge
    )

    setIdOptions(identificationsQualified)
    setEstimatedAge(estimatedAge)

    setIsAdult(ages.years >= 18)

    setCaregivers(caregivers)

    await form.setFieldsValue({
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      phoneCode,
      identificationType,
      identificationNumber,
      county,
      subCounty,
      ward,
      townCenter,
      estateOrHouseNo,
      caregivers,
      age,
      years: ages.years,
      months: ages.months,
      weeks: ages.weeks,
      estimatedAge,
    })

    if (counties?.length) {
      await handleCountyChange(county)
      await handleSubCountyChange(subCounty)
      await handleWardChange(ward)
      form.setFieldValue('subCounty', subCounty)
      form.setFieldValue('ward', ward)
    }
  }

  useEffect(() => {
    if (!patientId) return
    fetchPatient()
  }, [patientId])

  useEffect(() => {
    if (patient) {
      formatPatient()
      setLoading(false)
    }
  }, [patient])

  return { loading }
}
