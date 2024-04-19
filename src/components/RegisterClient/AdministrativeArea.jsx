import { useLocations } from '../../hooks/useLocation'
import { Form, Input, Select } from 'antd'

export default function AdministrativeArea({ form, capitalize }) {
  const {
    counties,
    subCounties,
    wards,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  } = useLocations(form)

  return (
    <>
      <h3 className="text-xl font-medium">Administrative Area</h3>
      <div className="grid mt-5 grid-cols-3 gap-10">
        <Form.Item
          label="Select County"
          name="county"
          rules={[{ required: true, message: 'Please select a county' }]}
        >
          <Select
            placeholder="Select County"
            onChange={handleCountyChange}
            options={counties.map((county) => ({
              value: county.key,
              label: county.name,
            }))}
            size="large"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>

        <Form.Item
          label="Select Subcounty"
          name="subCounty"
          rules={[{ required: true, message: 'Please select a subcounty' }]}
        >
          <Select
            placeholder="Select Subcounty"
            onChange={handleSubCountyChange}
            options={subCounties.map((subCounty) => ({
              value: subCounty.key,
              label: subCounty.name,
            }))}
            size="large"
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
            options={wards.map((ward) => ({
              value: ward.key,
              label: ward.name,
            }))}
            onChange={handleWardChange}
            size="large"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>

        <Form.Item name="townCenter" label="Town/Trading Center">
          <Input
            size="large"
            placeholder="eg Elgeyo Marakwet Market"
            onBlur={() => capitalize('townCenter')}
          />
        </Form.Item>

        <Form.Item name="estateOrHouseNo" label="Estate & House Number/Village">
          <Input
            size="large"
            placeholder="eg Jamii House, House Number 14"
            onBlur={() => capitalize('estateOrHouseNo')}
          />
        </Form.Item>
      </div>
    </>
  )
}
