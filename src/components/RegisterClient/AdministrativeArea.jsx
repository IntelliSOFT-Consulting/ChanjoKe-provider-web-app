import TextInput from "../../common/forms/TextInput"
import SelectMenu from '../../common/forms/SelectMenu'
import { useState } from "react"

export default function ClientDetails() {

  const locations = [
    { id: 1, name: 'Kiambu' }
  ]

  const wards = [
    { id: 1, name: 'Juja' }
  ]

  const [formData, setFormData ] = useState({
    residenceCounty: '',
    townCenter: '',
    subCounty: '',
    estateOrHouseNo: '',
    ward: ''
  })

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
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
            label="Ward"
            value={formData.ward || 'Ward'}
            onInputChange={(value) => handleChange('ward', value)}
            data={wards}/>

        </div>
      </div>
    </>
  )
}