import TextInput from "../../common/forms/TextInput"
import FormState from "../../utils/formState"
import { useEffect, useState } from "react"
import useGet from "../../api/useGet"
import { deconstructLocationData } from "./DataWrapper"
import ComboInput from "../../common/forms/ComboInput"
import { AutoComplete } from "antd"

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

  const { formData, handleChange } = FormState({
    residenceCounty: '',  
    subCounty: '',
    ward: '',
    townCenter: '',
    estateOrHouseNo: '',
  }, formRules)

  const [locationURL, setLocationUrl] = useState({ name: 'Location?partof=0&_sort=name&_count=50', level: 1})

  const { data } = useGet(locationURL.name)
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

        <label className="font-bold text-gray-500">County of Residence<span className="text-red-500"> *</span></label>

          <AutoComplete
            style={{ width: 350 }}
            className="mb-3"
            options={counties.map((county) => ({ value: county.name, name: county.name, id: county.id }))}
            placeholder="County of Residence"
            size="large"
            onSelect={(e, val) => {
              handleChange('residenceCounty', val.name)
              handleChange('subCounty', '')
              handleChange('ward', '')
              switchLocationURL(1, val)
              setAdministrativeAreaDetails({ ...formData, residenceCounty: val.name })
            }}
            filterOption={(inputValue, option) => 
              option.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }/>

          <TextInput
            inputType="text"
            inputName="townCenter"
            inputId="townCenter"
            value={formData.townCenter}
            onInputChange={(value) => {
              handleChange('townCenter', value)
              setAdministrativeAreaDetails({ ...formData, townCenter: value })
            }}
            label="Town/Trading Center"
            inputPlaceholder="eg Elgeyo Marakwet Market"/>
        </div>
    
        <div>

          <label className="klfont-bold text-gray-500">Sub-County<span className="text-red-500"> *</span></label>

          <AutoComplete
            style={{ width: 350 }}
            options={subCounties.map((county) => ({ value: county.name, name: county.name, id: county.id }))}
            placeholder="Sub-County"
            className="mb-3"
            size="large"
            defaultValue={formData?.subCounty}
            onSelect={(e, value) => {
              handleChange('subCounty', value.name)
              handleChange('ward', '')
              switchLocationURL(2, value)
              setAdministrativeAreaDetails({ ...formData, subCounty: value.name })
            }}
            filterOption={(inputValue, option) => 
              option.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }/>

          <TextInput
            inputType="text"
            inputName="estateOrHouseNo"
            inputId="estateOrHouseNo"
            value={formData.estateOrHouseNo}
            onInputChange={(value) => {
              handleChange('estateOrHouseNo', value)
              setAdministrativeAreaDetails({ ...formData, estateOrHouseNo: value })
            }}
            label="Estate & House Number/Village"
            inputPlaceholder="eg Jamii House, House Number 14"/>
        </div>

        <div>

          <label className="flex font-bold text-gray-500">Ward <span className="text-red-500"> *</span></label>

          <AutoComplete
              size="large"
              style={{ width: 350 }}
              options={wards.map((county) => ({ value: county.name, name: county.name, id: county.id }))}
              placeholder="Ward"
              className="mb-3"
              onSelect={(e, value) => {
                handleChange('ward', value.name)
                switchLocationURL(3, null)
                setAdministrativeAreaDetails({ ...formData, ward: value.name })
              }}
              filterOption={(inputValue, option) => 
                option.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }/>

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