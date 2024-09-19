import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  identificationOptions,
  identificationPriority,
} from '../../data/options/clientDetails'
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
  const [location, setLocation] = useState({
    county: '',
    subCounty: '',
    ward: '',
  })

  const { getPatient } = usePatient()

  useEffect(() => {
    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  useEffect(() => {
    if (patient) {
      formatPatient()
      setLoading(false)
    }
  }, [patient])

  useEffect(() => {
    preloadLocation()
  }, [counties, location])

  const fetchPatient = async () => {
    setLoading(true)
    const fetchedPatient = await getPatient(patientId)
    setPatient(fetchedPatient)
  }

  const preloadLocation = async () => {
    const { county, subCounty, ward } = location
    if (counties?.length && county && subCounty && ward) {
      await handleCountyChange(county)
      await handleSubCountyChange(subCounty)
      await handleWardChange(ward)

      form.setFieldsValue({ subCounty, ward })
      setLoading(false)
    }
  }

  const formatPatient = async () => {
    const {
      name,
      birthDate,
      gender,
      telecom,
      identifier,
      address,
      extension,
      contact,
    } = patient

    const firstName = name[0].given[0]
    const middleName = name[0].given[1] || ''
    const lastName = name[0].family
    const dateOfBirth = dayjs(birthDate)
    const phoneNumber = telecom[0].value?.slice(-9)
    const phoneCode = telecom[0].value?.slice(0, -9) || '+254'

    const identification = getIdentification(identifier)
    const {
      county,
      subCounty,
      ward,
      communityUnit,
      townCenter,
      estateOrHouseNo,
    } = getAddress(address[0])
    const { vaccinationCategory, estimatedAge, vaccineType } =
      getExtensionData(extension)
    const caregivers = formatCaregivers(contact)

    const ages = calculateAges(dateOfBirth?.format('YYYY-MM-DD'))
    const age = writeAge(ages)

    updateFormAndState(
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      phoneCode,
      identification,
      county,
      subCounty,
      ward,
      communityUnit,
      townCenter,
      estateOrHouseNo,
      vaccinationCategory,
      estimatedAge,
      vaccineType,
      caregivers,
      age,
      ages
    )

    setLocation({ county, subCounty, ward })
  }

  const getIdentification = (identifiers) => {
    const identifier = identificationPriority.find((option) =>
      identifiers.some((item) => item.type?.coding?.[0]?.display === option)
    )
    const identification = identifiers.find(
      (item) => item.type?.coding?.[0]?.display === identifier
    )
    return {
      type: identification?.type?.coding?.[0]?.display,
      number: identification?.value,
    }
  }

  const getAddress = (address) => ({
    county: address?.line?.[0],
    subCounty: address?.line?.[1],
    ward: address?.line?.[2],
    communityUnit: address?.line?.[3]?.replace('N/A', ''),
    townCenter: address?.line?.[4]?.replace('N/A', ''),
    estateOrHouseNo: address?.line?.[5]?.replace('N/A', ''),
  })

  const getExtensionData = (extensions) => {
    const getValue = (url) =>
      extensions?.find((item) => item.url === url)?.valueString
    const getBoolean = (url) =>
      extensions?.find((item) => item.url === url)?.valueBoolean

    return {
      vaccinationCategory: getValue('vaccination_category'),
      estimatedAge: getBoolean('estimated_age'),
      vaccineType: getValue('vaccination_category'),
    }
  }

  const formatCaregivers = (contacts) =>
    contacts.map((caregiver) => ({
      caregiverType: caregiver.relationship[0].coding?.[0]?.display,
      caregiverName: caregiver.name?.text,
      phoneCode: caregiver.telecom[0].value?.slice(0, -9) || '+254',
      phoneNumber: caregiver.telecom[0].value?.slice(-9),
      caregiverID: caregiver.extension?.find(
        (item) => item.url === 'caregiver_id_number'
      )?.valueString,
      caregiverIdentificationType: caregiver.extension?.find(
        (item) => item.url === 'caregiver_id_type'
      )?.valueString,
      caregiverIdentificationNumber: caregiver.extension?.find(
        (item) => item.url === 'caregiver_id_number'
      )?.valueString,
      kin: caregiver.extension?.find(
        (item) => item.url === 'next-of-kin'
      )?.extension?.map((item) => ({
        kinName: item.valueString,
        kinPhoneNumber: item.valueString,
        kinRelationship: item.valueString,
      }))
    }))

  const updateFormAndState = (
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    phoneCode,
    identification,
    county,
    subCounty,
    ward,
    communityUnit,
    townCenter,
    estateOrHouseNo,
    vaccinationCategory,
    estimatedAge,
    vaccineType,
    caregivers,
    age,
    ages
  ) => {
    const identificationsQualified = identificationOptions.filter(
      (option) => ages.years >= option.minAge && ages.years <= option.maxAge
    )

    setIdOptions(identificationsQualified)
    setEstimatedAge(estimatedAge)
    setIsAdult(ages.years >= 18)
    setCaregivers(caregivers)

    form.setFieldsValue({
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      vaccinationCategory,
      gender,
      vaccineType,
      phoneNumber,
      phoneCode,
      identificationType: identification.type,
      identificationNumber: identification.number,
      county,
      subCounty,
      ward,
      communityUnit,
      townCenter,
      estateOrHouseNo,
      caregivers,
      age,
      years: ages.years,
      months: ages.months,
      weeks: ages.weeks,
      estimatedAge,
    })
  }

  return { loading }
}
