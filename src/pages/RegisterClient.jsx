import ClientDetails from '../components/RegisterClient/ClientDetails'
import SubmitClientDetails from '../components/RegisterClient/SubmitClientDetails'
import { useEffect, useState } from 'react'
import {
  createObservationData,
  createPatientData,
} from '../components/RegisterClient/DataWrapper'
import { createImmunizationRecommendation } from '../components/ClientDetailsView/DataWrapper'
import ConfirmDialog from '../common/dialog/ConfirmDialog'
import calculateAge from '../utils/calculateAge'
import usePost from '../api/usePost'
import { useNavigate, useParams } from 'react-router-dom'
import useGet from '../api/useGet'
import usePut from '../api/usePut'
import { useApiRequest } from '../api/useApiRequest'
import { routineVaccines } from '../data/vaccineData'
import dayjs from 'dayjs'

export default function RegisterClient() {
  const [clientDetails, setClientDetails] = useState(null)
  const [caregiverDetails, setCaregiverDetails] = useState([])
  const [administrativeArea, setAdministrativeAreaDetails] = useState(null)

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogText, setDialogText] = useState('')
  const [step, updateStep] = useState(1)
  const [response, setResponse] = useState(null)

  const navigate = useNavigate()
  const { clientID } = useParams()
  const { SubmitForm } = usePost()
  const { SubmitForm: SubmitObservationForm } = usePost()
  const { SubmitUpdateForm } = usePut()
  const { post } = useApiRequest()

  const { data, loading, error } = useGet(`Patient/${clientID}`)
  const { data: observationData } = useGet(
    `Observation?patient=Patient/${clientID}`
  )

  function convertUnderscoresAndCapitalize(inputString) {
    if (inputString !== undefined) {
      let stringWithSpaces = inputString.replace(/([a-z])([A-Z])/g, '$1 $2')
      return stringWithSpaces.replace(/\b\w/g, (char) => char.toUpperCase())
    } else {
      return ''
    }
  }

  useEffect(() => {
    let currentweight = ''
    let identificationType = ''
    let identificationNumber = ''
    let estimatedAge = ''
    if (
      observationData?.entry &&
      Array.isArray(observationData?.entry) &&
      observationData?.entry.length
    ) {
      const weight = observationData?.entry.map((observation) => {
        return observation?.resource?.code?.coding?.[0]?.code ===
          'CURRENT_WEIGHT'
          ? observation?.resource?.code?.text
          : ''
      })
      const finalWeight = weight.reverse()
      currentweight = finalWeight[0]
    }

    if (data?.identifier && Array.isArray(data?.identifier)) {
      const estimatedAgeVal = data?.identifier.filter(
        (id) => id?.system === 'estimated-age'
      )
      const userID = data?.identifier.filter(
        (id) =>
          id?.system === 'identification_type' ||
          id?.system === 'identification'
      )
      estimatedAge = estimatedAgeVal?.[0].value

      identificationType =
        userID?.[0]?.type?.coding?.[0]?.display || userID?.[0]?.system
      identificationNumber = userID?.[0]?.value
    }

    setClientDetails({
      firstName: data?.name?.[0]?.family || '',
      middleName: data?.name?.[0]?.given[1] || '',
      lastName: data?.name?.[0]?.given[0] || '',
      dateOfBirth: data?.birthDate ? dayjs(data?.birthDate) : '',
      phoneNumber: data?.telecom?.[0]?.value,
      age: calculateAge(data?.birthDate),
      gender: data?.gender,
      estimatedAge,
      currentWeight: currentweight,
      identificationType: convertUnderscoresAndCapitalize(identificationType),
      identificationNumber,
    })

    const caregivers = data?.contact.map((caregiver) => {
      return {
        caregiverName: caregiver?.name?.family || caregiver?.name?.given[0],
        caregiverType: caregiver?.relationship?.[0]?.text,
        phoneNumber: caregiver?.telecom?.[0]?.value,
        actions: [
          { title: 'edit', btnAction: 'editCareGiver' },
          { title: 'remove', btnAction: 'removeCareGiver' },
        ],
      }
    })
    setCaregiverDetails(caregivers)

    setAdministrativeAreaDetails({
      residenceCounty: data?.address?.[0]?.city,
      townCenter: data?.address?.[0]?.line?.[0],
      subCounty: data?.address?.[0]?.district,
      estateOrHouseNo: data?.address?.[0]?.line?.[1],
      ward: data?.address?.[0]?.state,
    })
  }, [clientID, data, observationData])

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false)
    navigate(`/client-details/${response?.id}`)
  }

  const SubmitDetails = async () => {
    const postData = createPatientData({
      ...clientDetails,
      caregivers: [...caregiverDetails],
      ...administrativeArea,
      id: clientID || '',
    })

    if (clientID === '_') {
      setDialogText('Client added successfully!')
      setDialogOpen(true)
      const newClientResponse = await SubmitForm('Patient', postData)
      const currentWeight = clientDetails.hasOwnProperty('currentWeight')

      if (currentWeight) {
        SubmitObservationForm(
          'Observation',
          createObservationData(
            clientDetails?.currentWeight,
            newClientResponse?.id
          )
        )
      }
      setResponse(newClientResponse)

      const today = dayjs()
      const userAgeInDays = today.diff(newClientResponse?.birthDate, 'days') + 1
      

      const mapped = routineVaccines.map((vaccine) => {
        const dueDate = vaccine.dueDate(newClientResponse?.birthDate)
        if (userAgeInDays > vaccine.adminRange.end) {
          // user is too old for vaccine
        } else if (userAgeInDays < vaccine.adminRange.end) {
          // user has not yet reached the age limit for vaccine
          return { ...vaccine, vaccineDueDate: dueDate, forecastStatus: 'due' }
        }
      })

      const immunizationRecommendation = createImmunizationRecommendation(mapped, newClientResponse)

      const immunizationRecommendationResponse = await post('/hapi/fhir/ImmunizationRecommendation', immunizationRecommendation)

      console.log({ immunizationRecommendationResponse })

    } else {
      setDialogText('Client details updated successfully!')
      setDialogOpen(true)
      setResponse(await SubmitUpdateForm(`Patient/${clientID}`, postData))

      const currentWeight = clientDetails.hasOwnProperty('currentWeight')

      if (currentWeight) {
        SubmitObservationForm(
          'Observation',
          createObservationData(clientDetails?.currentWeight, clientID)
        )
      }
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={dialogText}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          {clientID === '_' ? 'Register Client' : 'Edit Client Details'}
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ClientDetails
            editClientDetails={clientDetails}
            setClientDetails={(value) => {
              setClientDetails(value)
              updateStep(step + 1)
            }}
          />

          {step === 4 && (
            <SubmitClientDetails
              clientDetails={clientDetails}
              caregiverDetails={caregiverDetails}
              administrativeArea={administrativeArea}
              handleBack={() => updateStep(step - 1)}
              submitPatientDetails={SubmitDetails}
            />
          )}
        </div>
      </div>
    </>
  )
}
