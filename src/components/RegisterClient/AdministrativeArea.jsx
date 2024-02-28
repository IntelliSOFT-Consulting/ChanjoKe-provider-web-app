import TextInput from "../../common/forms/TextInput"
import SelectMenu from '../../common/forms/SelectMenu'
import FormState from "../../utils/formState"
import RequiredValidator from '../../utils/requiredValidator'
import { useEffect, useState } from "react"
import useGet from "../../api/useGet"
import { deconstructLocationData } from "./DataWrapper"

export default function AdministrativeArea({ setAdministrativeAreaDetails, setAdminAreaFormErrors, setAllFormsValid }) {

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

  const [locationURL, setLocationUrl] = useState({ name: 'Location', level: 1})

  const { data, loading, error } = useGet(locationURL.name)
  const [counties, setCounties] = useState([])
  const [subCounties, setSubCounties] = useState([])
  const [wards, setWards] = useState([])

  useEffect(() => {
    setAdministrativeAreaDetails(formData)
    setAdminAreaFormErrors(formErrors)

    if (locationURL.level === 1 && Array.isArray(data?.entry)) {
      const locationArray = data?.entry.map((item) => deconstructLocationData(item))
      setCounties(locationArray)
      setSubCounties([])
      setWards([])
    }

    if (locationURL.level === 2 && Array.isArray(data?.entry)) {
      const locationArray = data?.entry.map((item) => deconstructLocationData(item))
      setSubCounties(locationArray)
      setWards([])
    }

    if (locationURL.level === 3 && Array.isArray(data?.entry)) {
      const locationArray = data?.entry.map((item) => deconstructLocationData(item))
      setWards(locationArray)
    }
  }, [formData, locationURL, data])

  const isFormValid = RequiredValidator(formData, formRules)

  if (isFormValid) {
    setAllFormsValid(isFormValid)
  }

  const switchLocationURL = (level, value) => {
    if (value) {
      setLocationUrl({ name: 'Location?partof=Location/' + value.id, level: level + 1 })
    }
  }

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
            onInputChange={(value) => {
              handleChange('residenceCounty', value.name)
              switchLocationURL(1, value)
            }}
            data={counties}/>

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
            onInputChange={(value) => {
              handleChange('subCounty', value.name)
              switchLocationURL(2, value)
            }}
            data={subCounties}/>

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
            onInputChange={(value) => {
              handleChange('ward', value.name)
              switchLocationURL(3)
            }}
            data={wards}/>

        </div>
      </div>
    </>
  )
}