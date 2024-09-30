import { Form, Input, Select } from 'antd'
import { titleCase } from '../../utils/methods'

export default function AdministrativeArea({
  capitalize,
  counties,
  subCounties,
  wards,
  handleCountyChange,
  handleSubCountyChange,
  handleWardChange,
}) {
  return (
    <>
      <h3 className="text-xl font-medium">Administrative Area</h3>
      <div className="md:grid mt-5 md:grid-cols-3 gap-10">
        <Form.Item
          label="County of Residence"
          name="county"
          rules={[{ required: true, message: 'Please select a county' }]}
        >
          <Select
            placeholder="Select County"
            onChange={handleCountyChange}
            options={counties?.map((county) => ({
              value: county.key,
              label: titleCase(county.name),
            }))}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>

        <Form.Item
          label="Subcounty"
          name="subCounty"
          rules={[{ required: true, message: 'Please select a subcounty' }]}
        >
          <Select
            placeholder="Select Subcounty"
            onChange={handleSubCountyChange}
            options={subCounties?.map((subCounty) => ({
              value: subCounty.key,
              label: titleCase(subCounty.name),
            }))}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>

        <Form.Item
          label="Ward"
          name="ward"
          rules={[{ required: true, message: 'Please select a ward' }]}
        >
          <Select
            placeholder="Select a Ward"
            options={wards?.map((ward) => ({
              value: ward.key,
              label: titleCase(ward.name),
            }))}
            onChange={handleWardChange}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>

        <Form.Item name="communityUnit" label="Community Unit">
          <Select placeholder="Select Community Unit" allowClear options={[]} />
        </Form.Item>

        <Form.Item name="townCenter" label="Town/Trading Center">
          <Input
            placeholder="eg Elgeyo Marakwet Market"
            onBlur={() => capitalize('townCenter')}
          />
        </Form.Item>

        <Form.Item
          name="estateOrHouseNo"
          label="Estate & House Number/Village/Landmark"
          rules={[{ required: true, message: 'Please input estate or house number/village/landmark' }]}
        >
          <Input
            placeholder="eg Jamii House, House Number 14"
            onBlur={() => capitalize('estateOrHouseNo')}
          />
        </Form.Item>
      </div>
    </>
  )
}
