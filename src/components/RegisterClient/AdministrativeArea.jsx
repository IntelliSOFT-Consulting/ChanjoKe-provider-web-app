import TextInput from "../../common/forms/TextInput"
import SelectMenu from '../../common/forms/SelectMenu'
import FormState from "../../utils/formState"
import { useEffect } from "react"

export default function AdministrativeArea({ setAdministrativeAreaDetails, setAdminAreaFormErrors }) {

  const locations = [
    { id: 1, name: 'Kiambu' }
  ]

  const wards = [
    { id: 1, name: 'Juja' }
  ]

  const formRules = {
    residenceCounty: {
      required: true,
    },
    subCounty: {
      required: true,
    },
    ward: {
      required: true,
    }
  }

  const { formData, formErrors, handleChange } = FormState({
    residenceCounty: '',
    townCenter: '',
    subCounty: '',
    estateOrHouseNo: '',
    ward: ''
  }, formRules)

  useEffect(() => {
    setAdministrativeAreaDetails(formData)
    setAdminAreaFormErrors(formErrors)
  }, [formData])
  return (
    <>
      <h3 className="text-xl font-medium">Administrative Area</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column   */}
        <div>

          <SelectMenu
            required={true}
            label="Residence County"
            value={formData.residenceCounty || 'Residence County'}
            error={formErrors.residenceCounty}
            onInputChange={(value) => handleChange('residenceCounty', value)}
            data={locations}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            value={formData.townCenter}
            onInputChange={(value) => handleChange('townCenter', value)}
            label="Town/Trading center"
            inputPlaceholder="Town/Trading center"/>
        </div>

        {/* Column   */}
        <div>

          <SelectMenu
            required={true}
            label="Subcounty"
            value={formData.subCounty || 'Subcounty'}
            error={formErrors.residenceCounty}
            onInputChange={(value) => handleChange('subCounty', value)}
            data={locations}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            value={formData.estateOrHouseNo}
            onInputChange={(value) => handleChange('estateOrHouseNo', value)}
            label="Estate & House No./village"
            inputPlaceholder="Estate & House No./village"/>
        </div>

        {/* Column   */}
        <div>

          <SelectMenu
            required={true}
            error={formErrors.ward}
            label="Ward"
            value={formData.ward || 'Ward'}
            onInputChange={(value) => handleChange('ward', value)}
            data={wards}/>

        </div>
      </div>
    </>
  )
}