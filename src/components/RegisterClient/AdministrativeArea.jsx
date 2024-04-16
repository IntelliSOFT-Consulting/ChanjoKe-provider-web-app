import TextInput from "../../common/forms/TextInput"
import FormState from "../../utils/formState"
import { useEffect, useState } from "react"
import useGet from "../../api/useGet"
import { deconstructLocationData } from "./DataWrapper"
import { AutoComplete } from "antd"
import { DownOutlined } from '@ant-design/icons'
import { Form, Row, Col } from 'antd'

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
  const [form] = Form.useForm()

  useEffect(() => {
    setAdministrativeAreaDetails(formData)

    handleChange('residenceCounty', adminArea?.residenceCounty || '')
    handleChange('subCounty', adminArea?.subCounty || '')
    handleChange('ward', adminArea?.ward || '')
    handleChange('townCenter', adminArea?.townCenter || '')
    handleChange('estateOrHouseNo', adminArea?.estateOrHouseNo || '')

    console.log({ elements: formData.residenceCounty })
    

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

        <Form
          form={form}
          className="w-full"
          layout="vertical">

          <Row className='mt-5 px-6' gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label={<label className="font-semibold">County of Residence<span className="text-red-500"> *</span></label>}>
              <AutoComplete
                className="mb-3 w-full mt-2"
                options={counties.map((county) => ({ value: county.name, name: county.name, id: county.id }))}
                placeholder="County of Residence"
                size="large"
                suffixIcon={<DownOutlined />}
                value={formData?.residenceCounty}
                onChange={(value, items) => {
                  handleChange('residenceCounty', value)
                  handleChange('subCounty', '')
                  handleChange('ward', '')
                  switchLocationURL(1, items)
                  setAdministrativeAreaDetails({ ...formData, residenceCounty: value })
                }}
                filterOption={(inputValue, option) => 
                  option.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label={<label className="font-semibold">Sub-County<span className="text-red-500"> *</span></label>}>
                <AutoComplete
                  className="mb-3 w-full mt-2"
                  options={subCounties.map((county) => ({ value: county.name, name: county.name, id: county.id }))}
                  placeholder="Sub-County"
                  suffixIcon={<DownOutlined />}
                  size="large"
                  value={formData?.subCounty}
                  onChange={(value, items) => {
                    handleChange('subCounty', value)
                    handleChange('ward', '')
                    console.log({ items })
                    switchLocationURL(2, items)
                    setAdministrativeAreaDetails({ ...formData, subCounty: value })
                  }}
                  filterOption={(inputValue, option) => 
                    option.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label={
                  <div>
                    <span className="font-bold">Ward <span className="text-red-500"> *</span></span>
                  </div>
                }>
                <AutoComplete
                    size="large"
                    suffixIcon={<DownOutlined />}
                    className="mb-3 w-full mt-2"
                    options={wards.map((county) => ({ value: county.name, name: county.name, id: county.id }))}
                    placeholder="Ward"
                    value={formData.ward}
                    onChange={(value) => {
                      handleChange('ward', value)
                      switchLocationURL(3, null)
                      setAdministrativeAreaDetails({ ...formData, ward: value })
                    }}
                    filterOption={(inputValue, option) => 
                      option.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
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
            </Col>
            <Col className="gutter-row" span={8}>
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
            </Col>
          </Row>

        </Form>

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
          disabled={(!formData.residenceCounty || !formData.subCounty || !formData.ward) ? true : false}
          className={(!formData.residenceCounty || !formData.subCounty || !formData.ward) ? "bg-[#9cb7e3] tooltip border-[#9cb7e3] outline-[#9cb7e3] hover:bg-[#9cb7e3] focus-visible:outline-[#9cb7e3] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2": "bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"}>
          Preview
        </button>      
      </div> 
    </>
  )
}