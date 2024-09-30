import ClientDetails from '../components/RegisterClient/ClientDetails'
import SubmitClientDetails from '../components/RegisterClient/SubmitClientDetails'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function RegisterClient() {
  const [clientDetails, setClientDetails] = useState(null)

  const [step, updateStep] = useState(1)

  const { clientID } = useParams()

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          {!clientID ? 'Register Client' : 'Edit Client Details'}
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ClientDetails
            editClientDetails={clientDetails}
            setClientDetails={(value) => {
              setClientDetails(value)
              updateStep(step + 1)
            }}
          />

          {step === 4 && <SubmitClientDetails />}
        </div>
      </div>
    </>
  )
}
