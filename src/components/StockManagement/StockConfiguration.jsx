import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  Typography,
  Space,
  message,
} from 'antd'
import { uniqueVaccineOptions } from '../../data/vaccineData'
import { useVaccineLevels } from '../../hooks/useVaccineLevels'
import { minMaxLevelBuilder } from './helpers/stockResourceBuilder'

const { Title } = Typography

const StockConfiguration = () => {
  const [levels, setLevels] = useState(null)
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')

  const { vaccineLevels } = useSelector((state) => state.vaccineSchedules)
  const { user } = useSelector((state) => state.userInfo)

  const { createVaccineLevel, updateVaccineLevel } = useVaccineLevels()

  const isVaccineInLevel = () => {
    return uniqueVaccineOptions.filter(
      (vaccine) => !levels?.some((level) => level.name === vaccine.value)
    )
  }

  useEffect(() => {
    if (vaccineLevels?.id) {
      setLevels(vaccineLevels.parameter)
    }
  }, [vaccineLevels?.id])

  const edit = (record) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.name)
    const newLevels = levels?.filter((item) => item.name !== record.name)
    setLevels(newLevels)
  }

  const handleDelete = (key) => {
    const newData = levels?.filter((item) => item.name !== key)
    setLevels(newData)
  }

  const handleAdd = async (values) => {
    const newLevel = {
      name: values.name,
      min: values.min,
      max: values.max,
    }
    setLevels([...levels, newLevel])
    form.resetFields()
    setEditingKey('')
  }

  const handleSave = async () => {
    const newLevels = minMaxLevelBuilder(levels, user.orgUnit)
    try {
      if (vaccineLevels?.id) {
        newLevels.id = vaccineLevels.id
        await updateVaccineLevel(vaccineLevels.id, newLevels)
      } else {
        await createVaccineLevel(newLevels)
      }
      message.success('Stock configuration saved successfully')
    } catch (error) {
      message.error('Failed to save stock configuration')
    }
  }

  const columns = [
    {
      title: 'Vaccine',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Min Amount',
      dataIndex: 'min',
      key: 'min',
      editable: true,
    },
    {
      title: 'Max Amount',
      dataIndex: 'max',
      key: 'max',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.name)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card title={<Title level={3}>Stock Configuration</Title>} className="my-4">
      <div className="p-4">
        <Form form={form} onFinish={handleAdd} layout="inline" className="mb-4">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vaccine is required' }]}
          >
            <Select
              style={{ width: 200 }}
              placeholder="Select Vaccine"
              options={isVaccineInLevel()}
            />
          </Form.Item>
          <Form.Item
            name="min"
            rules={[{ required: true, message: 'Min Amount is required' }]}
          >
            <InputNumber min={0} placeholder="Min Amount" className="w-full" />
          </Form.Item>
          <Form.Item
            name="max"
            rules={[
              { required: true, message: 'Max Amount is required' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value >= getFieldValue('min')) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(
                      'Max Amount must be greater than or equal to Min Amount'
                    )
                  )
                },
              }),
            ]}
          >
            <InputNumber min={0} placeholder="Max Amount" className="w-full" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Add
            </Button>
          </Form.Item>
        </Form>

        <Table
          bordered
          dataSource={levels}
          columns={columns}
          pagination={false}
          size="small"
          loading={!levels}
          className="!text-xs !py-1"
        />

        <div className="mt-4 flex justify-end">
          <Popconfirm
            title="Are you sure you want to save these levels?"
            onConfirm={handleSave}
          >
            <Button type="primary">Save Configuration</Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  )
}

export default StockConfiguration
