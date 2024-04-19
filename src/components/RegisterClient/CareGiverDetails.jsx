import { Button, Form, Input, Select } from 'antd'
import { caregiverTypes } from '../../data/options/clientDetails'
import { countryCodes } from '../../data/countryCodes'
import Table from '../DataTable'
import { titleCase } from '../../utils/methods'

export default function CaregiverDetails({ setCaregivers, caregivers }) {
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'Caregiver Type',
      dataIndex: 'caregiverType',
      key: 'caregiverType',
    },
    {
      title: 'Caregiver Name',
      dataIndex: 'caregiverName',
      key: 'caregiverName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text, record) => (
        <span>
          {record.phoneCode}
          {text}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() =>
            setCaregivers(caregivers.filter((item) => item !== record))
          }
        >
          Remove
        </Button>
      ),
    },
  ]

  return (
    <div>
      <h3 className="text-xl font-medium mb-6">Caregiver Details</h3>

      <Form form={form} layout="vertical" initialValues={{ phoneCode: '+254' }}>
        <div className="grid gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          <Form.Item
            name="caregiverType"
            label="Caregiver Type"
            rules={[
              {
                required: true,
                message: 'Please input the caregiver type',
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select Caregiver Type"
              options={caregiverTypes}
              showSearch
              searchable
            />
          </Form.Item>

          <Form.Item
            name="caregiverName"
            label="Caregiver Name"
            rules={[
              {
                required: true,
                message: 'Please input the caregiver name',
              },
            ]}
          >
            <Input
              placeholder="eg John Doe"
              autoComplete="off"
              size="large"
              onBlur={() => {
                const name = form.getFieldValue('caregiverName')
                form.setFieldValue('caregiverName', titleCase(name))
              }}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                pattern: /^(\+?)([0-9]{7,15})$/,
                message: 'Please enter a valid phone number!',
              },
            ]}
            className="mb-0"
          >
            <Input
              placeholder="7xxxxxxxx"
              size="large"
              addonBefore={
                <Form.Item name="phoneCode" noStyle>
                  <Select
                    size="large"
                    style={{ width: 120 }}
                    showSearch
                    options={countryCodes}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    placeholder="Code"
                  />
                </Form.Item>
              }
              onChange={(e) => {
                if (e.target.value.length > 9) {
                  form.setFieldValue('phoneNumber', e.target.value.slice(0, 9))
                }
              }}
            />
          </Form.Item>
        </div>

        <Form.Item className="flex justify-end mt-3">
          <Button
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  setCaregivers([...caregivers, values])
                  form.resetFields()
                })
                .catch((errorInfo) => {
                  console.log('Failed:', errorInfo)
                })
            }}
          >
            Add Caregiver
          </Button>
        </Form.Item>
      </Form>

      {caregivers.length > 0 && (
        <Table
          columns={columns}
          dataSource={caregivers}
          pagination={false}
          size="small"
        />
      )}
    </div>
  )
}
