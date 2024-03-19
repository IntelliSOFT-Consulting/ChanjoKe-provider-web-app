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
  const [vaccines, setVaccines] = useState([])
  const [selectedVaccine, setSelectedVaccine] = useState(null)
  const [vaccinesToNotAdminister, setVaccinesToNotAdminister] = useState([])

  useEffect(() => {
    const vaccinesToSelect = sharedData.map((item) => ({
      name: item.vaccineName,
      value: item.vaccineCode,
    }))

    setVaccines(vaccinesToSelect)
    console.log({ sharedData })
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
    { name: 'Product out of stock', value: 'OSTOCK' },
    { name: 'Patient objection', value: 'PATOBJ' },
    { name: 'Philosophical objection', value: 'PHILISOP' },
    { name: 'Religious objection', value: 'RELIG' },
    { name: 'Vaccine efficacy concerns', value: 'VACEFF' },
    { name: 'Vaccine safety concerns', value: 'VACSAF' },
  ]

  function handleDialogClose() {
    navigate(-1)
    setDialogOpen(false)
  }

  const handleFormSubmit = async () => {
    if (Array.isArray(sharedData) && sharedData.length > 0) {
      const data = sharedData.map((immunization) => {
        return createVaccineImmunization(
          immunization,
          currentPatient.id,
          'not-done'
        )
      })

      const responses = await Promise.all(
        data?.map(async (administerVaccine) => {
          return await post('Immunization', administerVaccine)
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
                data={vaccines}
                error={formErrors.identificationType}
                required={true}
                label="Vaccines not administered"
                value={selectedVaccine || 'Vaccines not administered'}
                onInputChange={(value) => {
                  setSelectedVaccine(value.name)
                }}/>

              <div className="py-4 flex justify-end">
                <button
                  className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Add
                </button>
                
              </div>

            </div>

            <div>
              <SelectMenu
                data={fhirReasons}
                error={formErrors.identificationType}
                required={true}
                label="Reasons for not vaccinated"
                value={formData.vaccinesToContraindicate || 'Select Reason'}
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