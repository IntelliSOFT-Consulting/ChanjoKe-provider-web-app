import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Input, InputNumber, Select, notification } from 'antd'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import { roleGroups } from '../../data/options/clientDetails'
import { useLocations } from '../../hooks/useLocation'
import { usePractitioner } from '../../hooks/usePractitioner'
import { hyphenToCamel } from '../../utils/formatter'
import { titleCase } from '../../utils/methods'

const AddUser = ({
  setVisible,
  visible,
  setPractitionerData,
  fetchPractitioners,
  activeTab,
  currentPage,
}) => {
  const [form] = Form.useForm()
  const { user } = useSelector((state) => state.userInfo)
  const [role, setRole] = useState(null)
  const [api, contextHolder] = notification.useNotification()

  const {
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
    counties,
    subCounties,
    wards,
    facilities,
  } = useLocations(form)

  const {
    handleCreatePractitioner,
    getPractitioner,
    handleUpdatePractitioner,
    searchPractitioner,
  } = usePractitioner({ pageSize: 12 })

  useEffect(() => {
    if (visible?.id) {
      fetchPractitionerDetails(visible.id)
    } else {
      resetForm()
    }
  }, [visible])

  const fetchPractitionerDetails = async (id) => {
    try {
      const practitionerData = await getPractitioner(id)
      await loadLocationHierarchy(practitionerData)
      form.setFieldsValue({
        ...practitionerData,
        phoneNumber: practitionerData?.phone,
        roleGroup: practitionerData?.practitionerRole,
      })
      const selectedRole = roleGroups.find(
        (role) => role.value === practitionerData?.practitionerRole
      )
      setRole(selectedRole)
    } catch (error) {
      console.error('Error fetching practitioner details:', error)
    }
  }

  const handleFinish = async (values) => {
    try {
      if (visible?.id) {
        await handleUpdatePractitioner(values)
      } else {
        await handleCreatePractitioner(values)
      }
      resetForm()
      await fetchPractitioners(null, activeTab === '1', currentPage)
    } catch (error) {
      console.error('Error handling form submission:', error)
      api.error({
        message: 'Error',
        description: error?.response?.data?.message || 'An error occurred',
      })
    }
  }

  const resetForm = () => {
    form.resetFields()
    setPractitionerData(null)
    setRole(null)
    setVisible(false)
  }

  const loadLocationHierarchy = async (userData) => {
    const { county, subCounty, ward } = userData
    if (county) await handleCountyChange(county)
    if (subCounty) await handleSubCountyChange(subCounty)
    if (ward) await handleWardChange(ward)
  }

  const handleLocationChange = async (value, level) => {
    await loadLocationHierarchy({ [level]: value })
  }

  const getOptions = (field) => {
    const optionsMap = {
      country: [{ value: '0', label: 'Kenya' }],
      county: counties?.map((county) => ({
        value: county.key,
        label: county.name,
      })),
      subCounty: subCounties?.map((subCounty) => ({
        value: subCounty.key,
        label: subCounty.name,
      })),
      ward: wards?.map((ward) => ({ value: ward.key, label: ward.name })),
      facility: facilities?.map((facility) => ({
        value: facility.key,
        label: facility.name,
      })),
    }
    return optionsMap[field] || []
  }

  const renderSection = (title, children) => (
    <>
      <h4 className="text-primary border-b-2 border-primary w-full font-semibold text-base mb-6">
        {title}
      </h4>
      {children}
    </>
  )

  const renderPersonalDetails = () =>
    renderSection(
      'Personal Details',
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
          rules={[
            { required: true, message: 'ID Number is required' },
            {
              validator: async (_, value) => {
                if (value && value.toString().length >= 6 && !visible?.id) {
                  const response = await searchPractitioner({
                    identifier: value,
                  })
                  if (response?.length) {
                    return Promise.reject(new Error('ID number already exists'))
                  }
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <InputNumber className="w-full" placeholder="ID Number" />
        </Form.Item>
      </div>
    )

  const renderContactDetails = () =>
    renderSection(
      'Contact Details',
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Phone Number is required' },
            {
              validator: (_, value) =>
                value && value.length < 10
                  ? Promise.reject(new Error('Phone number must be 10 digits'))
                  : Promise.resolve(),
            },
            {
              validator: async (_, value) => {
                if (value && value.length === 10 && !visible?.id) {
                  const response = await searchPractitioner({ telecom: value })
                  if (response?.length) {
                    return Promise.reject(
                      new Error('Phone number already exists')
                    )
                  }
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            placeholder="07********"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10)
              form.setFieldsValue({ phoneNumber: value })
            }}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Email is not valid' },
            {
              validator: async (_, value) => {
                if (value && /\S+@\S+\.\S+/.test(value) && !visible?.id) {
                  const response = await searchPractitioner({ email: value })
                  if (response?.length) {
                    return Promise.reject(new Error('Email already exists'))
                  }
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
      </div>
    )

  const renderRoleDetails = () =>
    renderSection(
      'Role Details',
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-4">
        <Form.Item
          label="Select Role"
          name="roleGroup"
          rules={[{ required: true, message: 'Please select a role group' }]}
        >
          <Select
            placeholder="Select Role"
            showSearch
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            onChange={async (value) => {
              const selected = roleGroups.find((role) => role.value === value)
              setRole(selected)
              form.setFieldsValue({
                country: '0',
                county: undefined,
                subCounty: undefined,
                ward: undefined,
                facility: undefined,
              })
            }}
            options={roleGroups.filter((role) =>
              role.creators.includes(user?.practitionerRole)
            )}
          />
        </Form.Item>
      </div>
    )

  const renderLocationDetails = () => {
    if (!role) return null

    const locationTypes = [
      'COUNTRY',
      'COUNTY',
      'SUB-COUNTY',
      'WARD',
      'FACILITY',
    ]
    const roleLocationType = role.locations[0]
    const roleLocationIndex = locationTypes.indexOf(roleLocationType)

    return renderSection(
      'Location Details',
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
        {locationTypes.slice(0, roleLocationIndex + 1).map((locationType) => {
          const fieldName = hyphenToCamel(locationType.toLowerCase())
          return (
            <Form.Item
              key={fieldName}
              label={`Select ${titleCase(locationType)}`}
              name={fieldName}
              rules={[
                { required: true, message: `Please select a ${fieldName}` },
              ]}
            >
              <Select
                placeholder={`Select ${titleCase(locationType)}`}
                options={getOptions(fieldName)}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => handleLocationChange(value, fieldName)}
              />
            </Form.Item>
          )
        })}
      </div>
    )
  }

  if (visible?.id && !role) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingArrows />
      </div>
    )
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onFinish={handleFinish}
      >
        {renderPersonalDetails()}
        {renderContactDetails()}
        {renderRoleDetails()}
        {renderLocationDetails()}
        <div className="flex justify-end border-t pt-4">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AddUser
