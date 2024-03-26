import TextInput from "../../common/forms/TextInput"
import SelectMenu from "../../common/forms/SelectMenu"
import TextArea from "../../common/forms/TextArea"
import FormState from "../../utils/formState"
import { useSharedState } from "../../shared/sharedState"
import { createVaccineImmunization } from '../ClientDetailsView/DataWrapper'
import { useApiRequest } from "../../api/useApiRequest"
import { useSelector } from 'react-redux'
import ConfirmDialog from "../../common/dialog/ConfirmDialog"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Contraindications() {
  const navigate = useNavigate()
  const [vaccines, setVaccines] = useState([])
  const [vaccinesToSelect, setVaccinesToSelect] = useState([])
  const { sharedData } = useSharedState()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const currentPatient = useSelector((state) => state.currentPatient)
  const { post } = useApiRequest()

  const { formData, formErrors, handleChange } = FormState({
    vaccinesToContraindicate: '',
    batchNumbers: [],
    contraindicationDetails: '',
    nextVaccinationDate: '',
  }, {})

  useEffect(() => {
    setVaccines(sharedData)
  }, [sharedData])

  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }

  const handleFormSubmit = async () => {
    if (Array.isArray(sharedData) && sharedData.length > 0) {
      const data = sharedData.map((immunization) => {
        immunization.contraindicationDetails = formData.contraindicationDetails
        immunization.education = [
          { presentationDate: formData.nextVaccinationDate }
        ]

        console.log({ immunization })
        return createVaccineImmunization(
          immunization,
          currentPatient.id,
          'entered-in-error'
        )
      })

      const responses = await Promise.all(
        data?.map(async (administerVaccine) => {
          return await post('/hapi/fhir/Immunization', administerVaccine)
        })
      )

      if (responses) {
        setDialogOpen(true)
        const time = setTimeout(() => {
          setDialogOpen(false)
          navigate(-1)
        }, 2000)
        return () => clearTimeout(time)
      }
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={`Contraindication saved successfully`}
        onClose={handleDialogClose} />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Contraindications
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-2 gap-36 px-6 gap-10">
            <div>

              <SelectMenu
                data={vaccines.map((vaccine) => ({ name: vaccine.vaccineName, value: vaccine.vaccineCode }))}
                required={true}
                label="Vaccines to Contraindicate"
                value={formData.vaccinesToContraindicate || 'Vaccines to Contraindicate'}
                onInputChange={(value) => handleChange('vaccinesToContraindicate', value.name)}/>

              <div className="py-4 flex">
                {vaccines.map((vaccine) => (
                  <span class="inline-flex items-center gap-x-3 py-2 ps-5 pe-2 rounded-full text-xs font-medium bg-blue-100 mx-2">
                    {vaccine.vaccineName}
                    <button
                      onClick={() => {
                        const vaccinesLeft = vaccines.filter((vacc) => vacc.vaccineName !== vaccine.vaccineName)
                        setVaccines([...vaccines, vaccinesLeft])
                      }}
                      type="button"
                      class="flex-shrink-0 size-4 inline-flex items-center justify-center rounded-full hover:bg-blue-200 focus:outline-none focus:bg-blue-200">
                      <span class="sr-only">Remove badge</span>
                      <svg class="flex-shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </span>
                ))}
                
              </div>

            </div>

            <div>
              <TextArea
                  inputName="contraindicationDetails"
                  label="Contraindication Details"
                  value={formData.contraindicationDetails}
                  error={formErrors.contraindicationDetails}
                  onInputChange={(value) => handleChange('contraindicationDetails', value)}
                  required={true}
                  rows="4"
                  cols="50"
                  inputPlaceholder="  Enter Contraindications"/>

                <TextInput
                  inputType="date"
                  inputName="nextVaccinationDate"
                  inputId="nextVaccinationDate"
                  required={true}
                  label="Next vaccination date"
                  value={formData.nextVaccinationDate}
                  onInputChange={(value) => handleChange('nextVaccinationDate', value)}/>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Cancel
          </button>
          <button
            onClick={() => {
              setDialogOpen(true)
              handleFormSubmit()
            }}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Next
          </button>
          
        </div>
      </div>
    </>
  )
}