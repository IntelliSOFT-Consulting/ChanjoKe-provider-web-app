import TextInput from "../../common/forms/TextInput"
import SelectMenu from "../../common/forms/SelectMenu"
import ConfirmDialog from "../../common/dialog/ConfirmDialog"
import FormState from "../../utils/formState"
import { useSharedState } from "../../shared/sharedState"
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { createVaccineImmunization } from '../ClientDetailsView/DataWrapper'
import { useNavigate } from "react-router-dom"
import { useApiRequest } from "../../api/useApiRequest"

export default function NotAdministered() {
  const navigate = useNavigate()
  const { sharedData } = useSharedState()

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectedVaccine, setSelectedVaccine] = useState(null)
  const [vaccinesToNotAdminister, setVaccinesToNotAdminister] = useState([])
  const [vaccines, setVaccines] = useState([])
  const [vaccinesToSelect, setVaccinesToSelect] = useState([])

  useEffect(() => {
    const vaccinesToSelect = sharedData.map((vaccine) => ({ name: vaccine.vaccineName, value: vaccine.vaccineName }))
    setVaccinesToSelect(vaccinesToSelect)
    setVaccines(sharedData)

    setVaccines(vaccinesToSelect)
  }, [sharedData])

  const currentPatient = useSelector((state) => state.currentPatient)
  const { post } = useApiRequest()

  const { formData, formErrors, handleChange } = FormState({
    vaccinesToContraindicate: '',
    batchNumbers: [],
    contraindicationDetails: '',
    nextVaccinationDate: '',
  }, {})

  const fhirReasons = [
    { name: 'Immunity', value: 'IMMUNE' },
    { name: 'Medical precaution', value: 'MEDPREC' },
    //{ name: 'Product out of stock', value: 'OSTOCK' },
    // { name: 'Patient objection', value: 'PATOBJ' },
    { name: 'Caregiver refusal', value: 'PHILISOP' },
    { name: 'Religious objection', value: 'RELIG' },
    { name: 'Cold Chain Break', value: 'VACEFF' },
    { name: 'Expired Product', value: 'VACSAF' },
  ]

  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }

  const handleFormSubmit = async () => {
    if (Array.isArray(vaccines) && vaccines.length > 0) {
      const data = vaccines.map((immunization) => {
        immunization.contraindicationDetails = formData.contraindicationDetails
        immunization.education = [
          { presentationDate: formData.nextVaccinationDate }
        ]
        return createVaccineImmunization(
          immunization,
          currentPatient.id,
          'not-done'
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
        description={`Vaccine not administered recorded`}
        onClose={handleDialogClose} />
  
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Not Administered
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-2 gap-36 px-6 gap-10">
            <div>

              <SelectMenu
                data={vaccinesToSelect}
                error={formErrors.identificationType}
                required={true}
                label="Vaccines not administered"
                value={selectedVaccine || 'Vaccines not administered'}
                onInputChange={(value) => {
                  const vaccineExists = vaccines.find((vaccine) => vaccine.vaccineName === value.name)
                  if (!vaccineExists) {
                    const inShared = sharedData.find((vaccine) => vaccine.vaccineName === value.name)
                    setVaccines([...vaccines, inShared ])
                  }
                }}/>

              <div className="py-4 flex">
                {vaccines.map((vaccine) => (
                  <span class="inline-flex items-center gap-x-3 py-2 ps-5 pe-2 rounded-full text-xs font-medium bg-blue-100 mx-2">
                    {vaccine.name}
                    <button
                      onClick={() => {
                        const vaccinesLeft = vaccines.filter((vacc) => vacc.vaccineName !== vaccine.vaccineName)
                        setVaccines(vaccinesLeft)
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
              <SelectMenu
                data={fhirReasons}
                error={formErrors.notVaccinatedReason}
                required={true}
                label="Reasons for not vaccinated"
                value={formData.notVaccinatedReason || 'Select Reason'}
                onInputChange={(value) => handleChange('vaccinesToContraindicate', value.name)}/>

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
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#4e8d6e] outline-[#4e8d6e] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4e8d6e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Submit
          </button>
          
        </div>
      </div>
    </>
  )
}