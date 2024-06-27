import { useEffect, useState } from 'react'
import { useLocations } from '../../hooks/useLocation'
import { usePractitioner } from '../../hooks/usePractitioner'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import LoadingArrows from '../../common/spinners/LoadingArrows'

export default function AddUser({
  setVisible,
  visible,
  practitionerData,
  setPractitionerData,
  fetchPractitioners,
  activeTab,
  currentPage,
}) {
  const [defaultCounties, setDefaultCounties] = useState(null)
  const [defaultSubCounties, setDefaultSubCounties] = useState(null)
  const [defaultWards, setDefaultWards] = useState(null)
  const [defaultFacilities, setDefaultFacilities] = useState(null)

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

  const {
    handleCreatePractitioner,
    getPractitioner,
    handleUpdatePractitioner,
  } = usePractitioner({ pageSize: 12 })

  const handleFinish = async (values) => {
    visible?.id
      ? await handleUpdatePractitioner(visible.id, values)
      : await handleCreatePractitioner(values)
    form.resetFields()
    setPractitionerData(null)
    setDefaultCounties(null)
    setDefaultSubCounties(null)
    setDefaultWards(null)
    setDefaultFacilities(null)
    setVisible(false)

    await fetchPractitioners(null, activeTab === '1', currentPage)
  }

  const fetchPractitioner = async (id) => {
    const practitionerData = await getPractitioner(id)
    setPractitionerData(practitionerData?.formatted)
    setDefaultCounties(practitionerData?.formatted?.counties)
    setDefaultSubCounties(practitionerData?.formatted?.subCounties)
    setDefaultWards(practitionerData?.formatted?.wards)
    setDefaultFacilities(practitionerData?.formatted?.facilities)
    form.setFieldsValue(practitionerData?.formatted)
  }

  useEffect(() => {
    if (visible?.id) {
      fetchPractitioner(visible.id)
    }
    if (!visible) {
      form.resetFields()
      setPractitionerData(null)
    }
  }, [visible])

  return (
    <div className="px-4 py-5 sm:p-6">
      {visible?.id && !practitionerData ? (
        <div className="flex justify-center items-center h-64">
          <LoadingArrows />
        </div>
      ) : (
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={handleFinish}
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
              label="ID Number"
              name="idNumber"
              rules={[{ required: true, message: 'ID Number is required' }]}
            >
              <InputNumber className="w-full" placeholder="ID Number" />
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
              <Input
                placeholder="07********"
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10)
                  form.setFieldsValue({ phoneNumber: e.target.value })
                }}
              />
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
                options={(defaultCounties || counties)?.map((county) => ({
                  value: county.key,
                  label: county.name,
                }))}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option?.label.toLowerCase()?.includes(input?.toLowerCase())
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
                options={(defaultSubCounties || subCounties)?.map(
                  (subCounty) => ({
                    value: subCounty.key,
                    label: subCounty.name,
                  })
                )}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option?.label.toLowerCase()?.includes(input?.toLowerCase())
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
                options={(defaultWards || wards)?.map((ward) => ({
                  value: ward.key,
                  label: ward.name,
                }))}
                onChange={handleWardChange}
                showSearch
                filterOption={(input, option) =>
                  option?.label.toLowerCase()?.includes(input?.toLowerCase())
                }
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="Facility"
              name="facility"
              rules={[{ required: true, message: 'Please select a facility' }]}
            >
              <Select
                placeholder="Select Facility"
                options={(defaultFacilities || facilities)?.map((facility) => ({
                  value: facility.key,
                  label: facility.name,
                }))}
                showSearch
                filterOption={(input, option) =>
                  option?.label.toLowerCase()?.includes(input?.toLowerCase())
                }
                allowClear
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
              <Select placeholder="Select Role Group" showSearch>
                <Select.Option value="ADMINISTRATOR">
                  Administrator
                </Select.Option>
                <Select.Option value="CLERK">Clerk</Select.Option>
                <Select.Option value="DOCTOR">Doctor</Select.Option>
                <Select.Option value="LAB TECHNICIAN">
                  Lab Technician
                </Select.Option>
                <Select.Option value="NURSE">Nurse</Select.Option>
                <Select.Option value="PHARMACIST">Pharmacist</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </div>
  )
}
