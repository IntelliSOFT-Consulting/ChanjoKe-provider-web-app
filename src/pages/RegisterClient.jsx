import ClientDetails from '../components/RegisterClient/ClientDetails'
import CareGiverDetails from '../components/RegisterClient/CareGiverDetails'
import AdministrativeArea from '../components/RegisterClient/AdministrativeArea'
import SubmitClientDetails from '../components/RegisterClient/SubmitClientDetails'
import { useEffect, useState } from 'react'
import { createPatientData } from '../components/RegisterClient/DataWrapper'
import ConfirmDialog from '../common/dialog/ConfirmDialog'
import calculateAge from '../utils/calculateAge'
import usePost from '../api/usePost'
import { useNavigate } from 'react-router-dom'
import useGet from '../api/useGet'
import usePut from '../api/usePut'
import dayjs from 'dayjs'

export default function RegisterClient({ editClientID }) {

  const [clientDetails, setClientDetails] = useState(null)
  const [caregiverDetails, setCaregiverDetails] = useState([])
  const [administrativeArea, setAdministrativeAreaDetails] = useState(null)

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('')
  const [allFormsValid, setAllFormsValid] = useState(false)
  const [step, updateStep] = useState(1)
  const [response, setResponse] = useState(null)

  const navigate = useNavigate()
  const { SubmitForm } = usePost()
  const { SubmitUpdateForm } = usePut()
  
  const { data, loading, error } = useGet(`Patient/${editClientID}`)

  useEffect(() => {
    setClientDetails({
      firstName: data?.name?.[0]?.family || '',
      middleName: data?.name?.[0]?.given[1] || '',
      lastName: data?.name?.[0]?.given[0] || '',
      birthDate: data?.birthDate ? dayjs(data?.birthDate) : '',
      age: calculateAge(data?.birthDate),
      gender: data?.gender,
    })

    const caregivers = data?.contact.map((caregiver) => {
      return {
        caregiverName: caregiver?.name?.family || caregiver?.name?.given[0],
        caregiverType: caregiver?.relationship?.[0]?.text,
        phoneNumber: caregiver?.telecom?.[0]?.value,
        actions: [
          { title: 'edit', btnAction: 'editCareGiver' },
          { title: 'remove', btnAction: 'removeCareGiver' }
        ]
      }
    })
    setCaregiverDetails(caregivers)
    
    setAdministrativeAreaDetails({
      residenceCounty: data?.address?.[0]?.city,
      townCenter: data?.address?.[0]?.line?.[0],
      subCounty: data?.address?.[0]?.district,
      estateOrHouseNo: data?.address?.[0]?.line?.[1],
      ward: data?.address?.[0]?.state
    })

  }, [editClientID, data])

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false)
    navigate(`/client-details/${response?.id}`)
  };

  const SubmitDetails = async () => {
    const postData = createPatientData({ ...clientDetails, caregivers: [...caregiverDetails], ...administrativeArea, id: editClientID || '' })

    console.log({ postData })

    if (editClientID === '_') {
      setDialogText('Client added successfully!')
      setDialogOpen(true)
      setResponse(await SubmitForm('Patient', postData))
    } else {
      setDialogText('Client details updated successfully!')
      setDialogOpen(true)
      setResponse(await SubmitUpdateForm(`Patient/${editClientID}`, postData))
    }
    // 
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={dialogText}
        onClose={handleDialogClose} />

      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          {editClientID === '_' ? 'Register Client' : 'Edit Client'}
        </div>
        <div className="px-4 py-5 sm:p-6">
          {step === 1 &&
          <ClientDetails
            editClientDetails={clientDetails}
            setClientDetails={(value) => {
              setClientDetails(value)
              updateStep(step + 1)
            }} />
          }
          {step === 2 &&
          <CareGiverDetails
            editCaregivers={caregiverDetails}
            nextPage={() => updateStep(step + 1)}
            updateCaregiverDetails={setCaregiverDetails}
            handleBack={() => updateStep(step - 1)} />
          }
          {step === 3 && 
          <AdministrativeArea
            adminArea={administrativeArea}
            setAdministrativeAreaDetails={setAdministrativeAreaDetails}
            handleNext={() => updateStep(step + 1)}
            handleBack={() => updateStep(step - 1)}/>
          }
          {step === 4 &&
          <SubmitClientDetails
            clientDetails={clientDetails}
            caregiverDetails={caregiverDetails}
            administrativeArea={administrativeArea}
            handleBack={() => updateStep(step - 1)}
            submitPatientDetails={SubmitDetails}/>
          }
        </div>

      </div>
    </>
  );
}