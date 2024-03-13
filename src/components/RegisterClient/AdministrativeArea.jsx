import TextInput from "../../common/forms/TextInput"
import SelectMenu from '../../common/forms/SelectMenu'
import FormState from "../../utils/formState"
import RequiredValidator from '../../utils/requiredValidator'
import { useEffect, useState } from "react"
import useGet from "../../api/useGet"
import { deconstructLocationData } from "./DataWrapper"
import ComboInput from "../../common/forms/ComboInput"

export default function AdministrativeArea({ adminArea, setAdministrativeAreaDetails, handleBack, handleNext }) {

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
    subCounty: '',
    ward: '',
    townCenter: '',
    estateOrHouseNo: '',
  }, formRules)

  const [locationURL, setLocationUrl] = useState({ name: 'Location?partof=0&_sort=name&_count=50', level: 1})

  const { data, loading, error } = useGet(locationURL.name)
  const [counties, setCounties] = useState([])
  const [subCounties, setSubCounties] = useState([])
  const [wards, setWards] = useState([])

  useEffect(() => {
    setAdministrativeAreaDetails(formData)

    handleChange('residenceCounty', adminArea?.residenceCounty || '')
    handleChange('subCounty', adminArea?.subCounty || '')
    handleChange('ward', adminArea?.ward || '')
    handleChange('townCenter', adminArea?.townCenter || '')
    handleChange('estateOrHouseNo', adminArea?.estateOrHouseNo || '')
    

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

    console.log({ g: adminArea, form: formData })
  }, [locationURL, data])

  const switchLocationURL = (level, value) => {
    if (value) {
      setLocationUrl({ name: `Location?partof=Location/${value.id}&_count=50&_sort=name`, level: level + 1 })
    }
  }

  return (
    <>
      <h3 className="text-xl font-medium">Administrative Area</h3>

      <div className="grid mt-5 grid-cols-3 gap-10">

        <div>

          <ComboInput
            label="County of Residence"
            setSelected={(value) => {
              handleChange('residenceCounty', value.name)
              handleChange('subCounty', '')
              handleChange('ward', '')
              switchLocationURL(1, value)
            }}
            val={formData?.residenceCounty}
            people={counties}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            value={formData.townCenter}
            onInputChange={(value) => handleChange('townCenter', value)}
            label="Town/Trading Center"
            inputPlaceholder="eg Elgeyo Marakwet Market"/>
        </div>
    
        <div>

          <ComboInput
            label="Sub County"
            setSelected={(value) => {
              handleChange('subCounty', value.name)
              handleChange('ward', '')
              switchLocationURL(2, value)
            }}
            val={formData?.subCounty}
            people={subCounties}/>

          <TextInput
            inputType="text"
            inputName="firstName"
            inputId="firstName"
            value={formData.estateOrHouseNo}
            onInputChange={(value) => handleChange('estateOrHouseNo', value)}
            label="Estate & House No./ Village"
            inputPlaceholder="eg Jamii House, House Number 14"/>
        </div>

        <div>

          <ComboInput
            label="Ward"
            setSelected={(value) => {
              handleChange('ward', value.name)
              switchLocationURL(3, null)
            }}
            val={formData?.ward}
            people={wards}/>

        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          onClick={handleBack}
          className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Back
        </button>
        <button
          onClick={() => {
            handleNext()
            setAdministrativeAreaDetails(formData)
          }}
          className="bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          Preview
        </button>      
      </div> 
    </>
  )
}