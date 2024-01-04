import ClientDetails from '../components/RegisterClient/ClientDetails'
import CareGiverDetails from '../components/RegisterClient/CareGiverDetails'
import AdministrativeArea from '../components/RegisterClient/AdministrativeArea'
import SubmitClientDetails from '../components/RegisterClient/SubmitClientDetails'
import { useState } from 'react'

export default function RegisterClient() {

  const [step, updateStep] = useState(1)

  const nextForm = () => {
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
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Register Client
      </div>
      <div className="px-4 py-5 sm:p-6">
        {step === 1 && <ClientDetails />}
        {step === 2 && <CareGiverDetails />}
        {step === 3 && <AdministrativeArea />}
        {step === 4 && <SubmitClientDetails />}
      </div>
      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          onClick={handleCancel}
          className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Cancel
        </button>
        {
          step === 4
          ? (
            <button
              className="ml-4 flex-shrink-0 rounded-md bg-[#4E8D6E] border border-[#4E8D6E] outline outline-[#4E8D6E] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4E8D6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E8D6E]">
              Submit
            </button>
          ) : (
            <button
              onClick={nextForm}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Next
            </button>
          )
        }
        
      </div>
    </div>
  );
}