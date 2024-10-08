import { useState, Fragment } from 'react'
import { Button, Form, Input, Popconfirm, Select } from 'antd'
import { countryCodes } from '../../data/countryCodes'
import {
  caregiverIdentificationTypes,
  caregiverTypes,
} from '../../data/options/clientDetails'
import { titleCase } from '../../utils/methods'
import Table from '../DataTable'
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'

export default function CaregiverDetails({
  setCaregivers,
  caregivers,
  form,
  caregiverType,
  setDraftCaregiver,
}) {
  const [identificationType, setIdentificationType] = useState(null)
  const handleEdit = (record) => {
    const phoneCode = record.phoneNumber.slice(0, -9)
    const phoneNumber = record.phoneNumber.replace(phoneCode, '')
    form.setFieldsValue({
      ...record,
      phoneNumber,
    })
    setCaregivers(caregivers.filter((item) => item !== record))
  }

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
      title: `${caregiverType()} ID Type`,
      dataIndex: 'caregiverIdentificationType',
      key: 'caregiverIdentificationType',
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
            placement="top"
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
      <h3 className="text-xl font-medium mb-6">Caregiver Details</h3>
      <Form form={form} layout="vertical" initialValues={{ phoneCode: '+254' }}>
        <div className="grid gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          <div className="col-span-2 grid gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 border p-2 rounded-md">
            <Form.Item
              name="caregiverType"
              label="Caregiver Relationship"
              rules={[
                {
                  required: true,
                  message: `Please select the caregiver relationship`,
                },
              ]}
              extra="Select the relationship of the caregiver to the client"
            >
              <Select
                placeholder={`Select Caregiver Relationship`}
                options={caregiverTypes}
                showSearch
                searchable
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="caregiverName"
              label="Caregiver Name"
              rules={[
                {
                  required: true,
                  message: `Please input the caregiver name`,
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
              name="caregiverIdentificationType"
              label="Document Identification Type"
              rules={[
                {
                  required: true,
                  message: `Please select the caregiver Document Identification Type`,
                },
              ]}
            >
              <Select
                placeholder="Select Document Identification Type"
                options={caregiverIdentificationTypes}
                showSearch
                searchable
                allowClear
                onChange={(value) => {
                  setIdentificationType(value)
                  if (value === 'None') {
                    form.setFieldValue('kins', [
                      { kinName: '', kinRelationship: '', kinPhoneNumber: '' },
                    ])
                  } else {
                    form.setFieldValue('kins', [])
                  }
                }}
              />
            </Form.Item>
            {identificationType !== 'None' && (
              <Form.Item
                name="caregiverID"
                label="Document Identification Number"
                rules={[
                  ({ getFieldValue }) => ({
                    required: !['Father', 'Mother'].includes(
                      getFieldValue('caregiverType')
                    ),
                    message: `Please input the Caregiver Document Identification Number`,
                  }),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value) {
                        if (
                          getFieldValue('caregiverIdentificationType') ===
                          'National ID'
                        ) {
                          if (!/^\d+$/.test(value)) {
                            return Promise.reject(
                              new Error(
                                'Document Identification Number must be numerical'
                              )
                            )
                          }
                          if (value.length < 6) {
                            return Promise.reject(
                              new Error(
                                'Document Identification Number must be at least 6 digits'
                              )
                            )
                          }
                        }
                      }
                      return Promise.resolve()
                    },
                  }),
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
            )}

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  pattern: /^(\+?)([0-9]{7,15})$/,
                  message: 'Please enter a valid phone number!',
                },
                {
                  required: identificationType !== 'None',
                  message: `Please input the Caregiver phone number`,
                },
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
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
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
          {identificationType === 'None' && (
            <Form.List name="kins">
              {(fields, { add, remove }) => (
                <div className="col-span-2 grid gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 my-4">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className=" grid gap-x-10  border border-gray-300 p-4 rounded-md relative my-2"
                    >
                      <Form.Item
                        key={field.key}
                        {...field}
                        label="Kin Name"
                        name={[field.name, 'kinName']}
                        rules={[
                          {
                            required: true,
                            message: 'Please input the kin name',
                          },
                        ]}
                      >
                        <Input placeholder="Kin Name" />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'kinRelationship']}
                        label="Kin Relationship"
                      >
                        <Select placeholder="Relationship with Caregiver">
                          <Select.Option value="CHW">CHW</Select.Option>
                          <Select.Option value="Village Elder">
                            Village Elder
                          </Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'kinPhoneNumber']}
                        label="Kin Phone Number"
                        rules={[
                          {
                            required: true,
                            pattern: /^(\+?)([0-9]{7,15})$/,
                            message: 'Please enter a valid phone number!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Kin Phone Number"
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '')
                            if (e.target.value.length > 9) {
                              e.target.value = e.target.value.slice(0, 9)
                            }
                          }}
                        />
                      </Form.Item>
                      <Button
                        type="link"
                        className="absolute top-0 right-0"
                        onClick={() => remove(field.key)}
                        danger
                        icon={<CloseCircleOutlined />}
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    className="w-full mt-4"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Kin
                  </Button>
                </div>
              )}
            </Form.List>
          )}
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
            {`Add Caregiver`}
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
