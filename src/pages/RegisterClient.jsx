import ClientDetails from '../components/RegisterClient/ClientDetails'
import CareGiverDetails from '../components/RegisterClient/CareGiverDetails'
import AdministrativeArea from '../components/RegisterClient/AdministrativeArea'
import SubmitClientDetails from '../components/RegisterClient/SubmitClientDetails'
import { useEffect, useState } from 'react'
import { createPatientData } from '../components/RegisterClient/DataWrapper'
import ConfirmDialog from '../common/dialog/ConfirmDialog'
import usePost from '../api/usePost'
import { useNavigate } from 'react-router-dom'

export default function RegisterClient() {

  const { data, loading, error, SubmitForm } = usePost()
  const [step, updateStep] = useState(1)
  const [clientDetails, setClientDetails] = useState(null)
  const [clientErrors, setClientFormErrors] = useState({})

  const [caregiverDetails, setCaregiverDetails] = useState([])
  const [caregiverErrors, setCaregiverFormErrors] = useState({})

  const [administrativeArea, setAdministrativeAreaDetails] = useState(null)
  const [adminErrors, setAdminAreaFormErrors] = useState({})

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [allFormsValid, setAllFormsValid] = useState(false)

  const navigate = useNavigate()

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
  };

  const SubmitDetails = async () => {
    const postData = createPatientData({ ...clientDetails, caregivers: [...caregiverDetails], ...administrativeArea })
    const response = await SubmitForm('Patient', postData)
    navigate(`/client-details/${response?.id}`)
  }

  const nextForm = () => {

    setAllFormsValid(false)

    if (step < 4) {
      updateStep(step + 1)
    }
  }

  const handleCancel = () => {
    if (step > 1) {
      updateStep(step - 1)
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Client added successfully!`}
        onClose={handleDialogClose} />

      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Register Client
        </div>
        <div className="px-4 py-5 sm:p-6">
          {step === 1 && <ClientDetails
            setClientDetails={setClientDetails}
            setClientFormErrors={setClientFormErrors}
            setAllFormsValid={setAllFormsValid} />}
          {step === 2 && <CareGiverDetails
            setCaregiverDetails={setCaregiverDetails}
            setCaregiverFormErrors={setCaregiverFormErrors} />}
          {step === 3 && <AdministrativeArea
            setAdministrativeAreaDetails={setAdministrativeAreaDetails}
            setAllFormsValid={setAllFormsValid}
            setAdminAreaFormErrors={setAdminAreaFormErrors}/>}
          {step === 4 && <SubmitClientDetails
            clientDetails={clientDetails}
            caregiverDetails={caregiverDetails}
            administrativeArea={administrativeArea}/>}
        </div>
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          {step !== 1 &&
            <button
            onClick={handleCancel}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Back
          </button>
          }
          {step === 3 && 
            <button
              onClick={nextForm}
              disabled={!allFormsValid}
              className={`${!allFormsValid ? 'bg-[#5370B0] border-[#5370B0] outline-[#5370B0] hover:bg-[#5370B0] focus-visible:outline-[#5370B0]' : 'bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94]' } ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}>
              Preview
            </button>
          }
          {(step === 1 || step === 2) && 
            <button
              onClick={nextForm}
              disabled={(Object.keys(clientErrors).length !== 0 || Object.keys(adminErrors).length !== 0 || !allFormsValid) && step !== 2}
              className={`${(Object.keys(clientErrors).length !== 0 || Object.keys(adminErrors).length !== 0 || !allFormsValid) && step !== 2 ? 'bg-[#5370B0] border-[#5370B0] outline-[#5370B0] hover:bg-[#5370B0] focus-visible:outline-[#5370B0]' : 'bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94]' } ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}>
              Next
            </button>
          }
          {step === 4 &&
            <button
              onClick={() => SubmitDetails()}
              className="ml-4 flex-shrink-0 rounded-md bg-[#4E8D6E] border border-[#4E8D6E] outline outline-[#4E8D6E] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4E8D6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E8D6E]">
              Submit
            </button>
          }
          
        </div>
      </div>
    </>
  );
}