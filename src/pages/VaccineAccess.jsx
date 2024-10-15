import { useEffect, useState } from 'react'
import { useVaccination } from '../hooks'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Popconfirm,
  Modal,
  Form,
  Space,
} from 'antd'
import { uniqueVaccineOptions } from '../data/vaccineData'

import { useLocations } from '../hooks/useLocation'

export default function VaccineAccess() {
  const [vaccines, setVaccines] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    getVaccineAvailability,
    isVaccineAvailableInLocation,
    vaccineLocations,
  } = useVaccination()
  const { counties } = useLocations()

  const [form] = Form.useForm()

  const fetchVaccines = async () => {
    const vaccines = await getVaccineAvailability()
    setVaccines(vaccines)
  }
  useEffect(() => {
    fetchVaccines()
  }, [])

  const handleAdd = () => {
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    form.setFieldValue('vaccine', record.vaccine)
    form.setFieldValue(
      'counties',
      record.locations.map((location) => location.valueCode)
    )
    setIsModalOpen(true)
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const countiesData = values.counties.map((county) => ({
        valueCode: county,
        name: counties.find((c) => c.key === county).name,
      }))

      const vaccinesCopy = [...(vaccineLocations?.locations || [])]

      const existingIndex = vaccinesCopy.findIndex(
        (v) => v.vaccine === values.vaccine
      )

      if (existingIndex !== -1) {
        const isVaccineExisting = vaccinesCopy[existingIndex]
        const newLocations = [...isVaccineExisting.locations, ...countiesData]
        const uniqueLocations = newLocations.filter(
          (location, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.valueCode === location.valueCode && t.name === location.name
            )
        )
        isVaccineExisting.locations = uniqueLocations

        vaccinesCopy[existingIndex] = isVaccineExisting
      } else {
        const isVaccineExisting = {
          vaccine: values.vaccine,
          locations: countiesData,
        }
        vaccinesCopy.push(isVaccineExisting)
      }

      const payload = {
        id: vaccineLocations?.id,
        vaccines: vaccinesCopy,
      }
      const response = await isVaccineAvailableInLocation(payload)

      if (response) {
        form.resetFields()
        setIsModalOpen(false)
        await fetchVaccines()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (record) => {
    const findVaccineAccess = vaccineLocations?.locations?.filter(
      (v) => v.vaccine !== record.vaccine
    )

    const payload = {
      id: vaccineLocations?.id,
      vaccines: findVaccineAccess,
    }

    const response = await isVaccineAvailableInLocation(payload)
    if (response) {
      await fetchVaccines()
    }
  }

  const columns = [
    {
      title: 'Vaccine',
      dataIndex: 'vaccine',
      key: 'vaccine',
    },
    {
      title: 'Locations',
      dataIndex: 'locations',
      key: 'locations',
      render: (locations) =>
        locations.map((location) => location.name).join(', '),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Space direction="horizontal">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record)} danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <Card
      title="Vaccine Restrictions (Restricted to Counties)"
      className="my-4"
      extra={
        <Button type="primary" onClick={() => handleAdd()}>
          Add Vaccine Restrictions
        </Button>
      }
    >
      <Table
        loading={!vaccineLocations}
        dataSource={vaccineLocations?.locations || []}
        columns={columns}
        size="small"
        pagination={false}
        className="my-4"
      />

      <Modal
        title="Add Vaccine Restrictions"
        open={isModalOpen}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="vaccine"
            label="Vaccine"
            rules={[
              {
                required: true,
                message: 'Vaccine is required',
              },
            ]}
          >
            <Select
              options={uniqueVaccineOptions}
              allowClear
              showSearch
              placeholder="Select Vaccine"
            />
          </Form.Item>
          <Form.Item
            name="counties"
            label="Counties"
            rules={[
              {
                required: true,
                message: 'Counties are required',
              },
            ]}
          >
            <Select
              options={counties?.map((county) => ({
                value: county.key,
                label: county.name,
              }))}
              allowClear
              showSearch
              placeholder="Select Counties"
              mode="multiple"
            />
          </Form.Item>

          <div className="flex justify-end mt-4 border-t border-gray-100 border-1 pt-4">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add
            </Button>
          </div>
        </Form>
      </Modal>
    </Card>
  )
}
