import { useLocations } from '../../hooks/useLocation'
import { usePractitioner } from '../../hooks/usePractitioner'
import {
  Select,
  Input,
  Form,
  Button,
  Space,
  Modal,
  Card,
  message,
  Popconfirm,
} from 'antd'

export default function AddUser() {
  const [form] = Form.useForm()

  const {
    counties,
    subCounties,
    wards,
    facilities,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  } = useLocations(form)

  const { handleCreatePractitioner } = usePractitioner({ pageSize: 12 })

  return (
    <Card
      title={
        <div className="px-4 text-2xl font-semibold py-2 sm:px-6">Add User</div>
      }
      className="mt-6"
    >
      <div className="px-4 py-5 sm:p-6">
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={handleCreatePractitioner}
        >
          <h4 className="text-primary border-b-2 border-primary w-full font-semibold text-base mb-6">
            Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'First Name is required' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Last Name is required' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
          </div>

          <div>
            <h4 className="text-primary border-b-2 border-primary w-full font-semibold text-base mb-6">
              Contact Details
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: 'Phone Number is required' },
                {
                  validator: (_, value) => {
                    if (value && value.length < 10) {
                      return Promise.reject(
                        new Error('Phone number must be 10 digits')
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input placeholder="07********" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email is required' },
                {
                  type: 'email',
                  message: 'Email is not valid',
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </div>

          <h4 className="text-primary border-b-2 border-primary w-full font-semibold text-base mb-6">
            Location Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
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
              />
            </Form.Item>

            <Form.Item
              label="Facility"
              name="facility"
              rules={[{ required: true, message: 'Please select a facility' }]}
            >
              <Select
                placeholder="Select Facility"
                options={facilities.map((facility) => ({
                  value: facility.key,
                  label: facility.name,
                }))}
              />
            </Form.Item>
          </div>

          <h4 className="text-primary border-b-2 border-primary w-full font-semibold text-base mb-6">
            Role Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-4">
            <Form.Item
              label="Select Role Group"
              name="roleGroup"
              rules={[
                { required: true, message: 'Please select a role group' },
              ]}
            >
              <Select placeholder="Select Role Group">
                <Select.Option value="Doctor">Doctor</Select.Option>
                <Select.Option value="Nurse">Nurse</Select.Option>
                <Select.Option value="Pharmacist">Pharmacist</Select.Option>
                <Select.Option value="Lab Technician">
                  Lab Technician
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  )
}
