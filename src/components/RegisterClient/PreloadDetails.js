import { useState, useEffect } from 'react'
import usePatient from '../../hooks/usePatient'
import useObservations from '../../hooks/useObservations'
import { calculateAges, writeAge } from '../../utils/methods'
import dayjs from 'dayjs'
import { identificationOptions } from '../../data/options/clientDetails'

/*
 * This component is responsible for fetching patient details
 * and the first observation for the patient
 * @param {string} patientId - the patient id
 * Formats the patient information to be displayed in the form
 * @param {object} form - the antd form object
 */
export default function PreloadDetails({
  patientId,
  form,
  setCaregivers,
  setIdOptions,
  setIsAdult,
  counties,
  subCounties,
  wards,
  handleCountyChange,
  handleSubCountyChange,
  handleWardChange,
}) {
  const [patient, setPatient] = useState(null)
  const [observation, setObservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const { getPatient } = usePatient()
  const { getFirstObservation } = useObservations()

  const fetchPatient = async () => {
    setLoading(true)
    const patient = await getPatient(patientId)
    setPatient(patient)
  }

  const fetchObservations = async () => {
    setLoading(true)
    const observation = await getFirstObservation(patientId)
    setObservation(observation)
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
    const caregivers = patient.contact.map((caregiver) => {
      return {
        caregiverType: caregiver.relationship[0].coding?.[0]?.display,
        caregiverName: caregiver.name?.text,
        phoneNumber: `${caregiver.telecom[0].value?.slice(0, -9) || '+254'}${caregiver.telecom[0].value?.slice(-9)}`,
      }
    })

    const ages = calculateAges(dateOfBirth?.format('YYYY-MM-DD'))
    const age = writeAge(ages)

    const identificationsQualified = identificationOptions.filter(
      (option) => ages.years >= option.minAge && ages.years <= option.maxAge
    )

    setIdOptions(identificationsQualified)

    setIsAdult(ages.years >= 18)

    setCaregivers(caregivers)

    const weightMetric = observation.valueQuantity?.unit || 'kg'
    const currentWeight = observation.valueQuantity?.value

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
      currentWeight,
      weightMetric,
      age,
      years: ages.years,
      months: ages.months,
      weeks: ages.weeks,
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
    fetchObservations()
  }, [patientId])

  useEffect(() => {
    if (patient && observation) {
      formatPatient()
      setLoading(false)
    }
  }, [patient, observation])

  return { loading }
}
