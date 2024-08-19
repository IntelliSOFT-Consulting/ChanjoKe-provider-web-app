import { Button, Form, Input, Select, Popconfirm, InputNumber } from 'antd'
import { caregiverTypes, caregiverRelationships } from '../../data/options/clientDetails'
import { countryCodes } from '../../data/countryCodes'
import Table from '../DataTable'
import { titleCase } from '../../utils/methods'
import { useState } from 'react'

export default function CaregiverDetails({
  setCaregivers,
  caregivers,
  form,
  caregiverType,
  setDraftCaregiver,
}) {
  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setCaregivers(caregivers.filter((item) => item !== record))
  }

  const [caregiveRelationship, setCaregiverRelationship] = useState('parent')

  const columns = [
    {
      title:
        caregiverType() === 'Caregiver'
          ? `${caregiverType()} Type`
          : `Relationship with ${caregiverType()}`,
      dataIndex: 'caregiverType',
      key: 'caregiverType',
    },
    {
      title: `${caregiverType()} Name`,
      dataIndex: 'caregiverName',
      key: 'caregiverName',
    },
    {
      title: `${caregiverType()} ID Number`,
      dataIndex: 'caregiverID',
      key: 'caregiverID',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text, record) =>
        text ? (
          <span>
            {record.phoneCode}
            {text}
          </span>
        ) : null,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button
            type="link"
            className="px-0"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={
              <span>
                Are you sure you want to remove <b>{record.caregiverName}</b>?
              </span>
            }
            onConfirm={() =>
              setCaregivers(caregivers.filter((item) => item !== record))
            }
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" className="px-0 ml-2" danger>
              Remove
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h3 className="text-xl font-medium mb-6">
        {`${caregiverType(caregiveRelationship)} Details`} {caregiveRelationship}
      </h3>
      <Form form={form} layout="vertical" initialValues={{ phoneCode: '+254', caregiverRelationship: 'parent' }}>
        <div className="grid gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          <Form.Item
            name="caregiverRelationship"
            label="Relationship with client"
            rules={[
              {
                required: true,
                message: `Please select the relationship`,
              },
            ]}
          >
            <Select
              placeholder={`Select Relationship`}
              options={caregiverRelationships}
              onChange={(value) => setCaregiverRelationship(value)}
              showSearch
              searchable
              allowClear
            />
          </Form.Item>
        
          <Form.Item
            name="caregiverType"
            label={
              caregiverType(caregiveRelationship) === 'Caregiver'
                ? `${caregiverType(caregiveRelationship)} Type`
                : `Relationship with ${caregiverType(caregiveRelationship)}`
            }
            rules={[
              {
                required: true,
                message: `Please select the ${caregiverType(caregiveRelationship)} type`,
              },
            ]}
          >
            <Select
              placeholder={`Select ${caregiverType(caregiveRelationship)} Type`}
              options={caregiverTypes}
              showSearch
              searchable
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="caregiverName"
            label={`${caregiverType(caregiveRelationship)} Name`}
            rules={[
              {
                required: true,
                message: `Please input the ${caregiverType(caregiveRelationship)} name`,
              },
            ]}
          >
            <Input
              placeholder="eg John Doe"
              autoComplete="off"
              onBlur={() => {
                const name = form.getFieldValue('caregiverName')
                form.setFieldValue('caregiverName', titleCase(name))
              }}
            />
          </Form.Item>

          <Form.Item
            name="caregiverID"
            label={`${caregiverType(caregiveRelationship)} ID Number`}
            rules={[
              {
                message: `Please input the ${caregiverType(caregiveRelationship)} ID number`,
              },
              {
                required: caregiveRelationship === 'kin' ? true : false 
              }
            ]}
          >
            <Input
              placeholder="eg 12345678"
              autoComplete="off"
              className="w-full"
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                form.setFieldValue('caregiverID', value)
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
              { required: caregiveRelationship === 'kin' ? true : false }
            ]}
            className="mb-0"
          >
            <Input
              placeholder="7xxxxxxxx"
              addonBefore={
                <Form.Item name="phoneCode" noStyle>
                  <Select
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
                e.target.value = e.target.value.replace(/\D/g, '')
                if (e.target.value.length > 9) {
                  e.target.value = e.target.value.slice(0, 9)
                }
                form.setFieldValue('phoneNumber', e.target.value.slice(0, 9))
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
                  setDraftCaregiver(false)
                })
                .catch((errorInfo) => {
                  console.log('Failed:', errorInfo)
                })
            }}
          >
            {`Add ${caregiverType(caregiveRelationship)}`}
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
