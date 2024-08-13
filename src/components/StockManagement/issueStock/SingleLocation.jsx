import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Input,
  InputNumber,
  Select,
  DatePicker,
  notification,
} from 'antd'
import { useSelector } from 'react-redux'
import Table from '../../DataTable'
import useStock from '../../../hooks/useStock'
import { locationOptions, formatSupplyRequestsToForm } from '../stockUtils'
import { supplyDeliveryBuilder } from '../stockResourceBuilder'
import dayjs from 'dayjs'

const { Option } = Select

const SingleLocation = ({ vaccines = [] }) => {
  const [orderItems, setOrderItems] = useState([{}])
  const [formattedSupplyRequests, setFormattedSupplyRequests] = useState([])
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)
  const {
    incomingSupplyRequests,
    createSupplyDelivery,
    updateSupplyRequest,
    requests,
  } = useStock()

  useEffect(() => {
    incomingSupplyRequests(user?.facility, 0, 'active')
  }, [])

  useEffect(() => {
    if (requests?.data) {
      setFormattedSupplyRequests(formatSupplyRequestsToForm(requests.data))
    }
  }, [requests])

  const handleSubmit = async (values) => {
    try {
      const selectedRequests = orderItems.map((item) => ({
        ...requests?.data?.find((request) => request.id === item.id),
        status: 'completed',
      }))

      await Promise.all(selectedRequests.map(updateSupplyRequest))

      const deliveryData = {
        ...values,
        user,
        tableValues: orderItems.map((item) => {
          const resourceItem = selectedRequests.find(
            (request) => request.id === item.id
          )
          return {
            ...item,
            destination: resourceItem?.deliverTo?.reference,
            facilityName: resourceItem?.deliverTo?.display,
            supplyRequestId: item.id,
          }
        }),
        supplier: user?.fhirPractitionerId,
      }

      const supplyDeliveries = supplyDeliveryBuilder(deliveryData)
      await Promise.all(supplyDeliveries.map(createSupplyDelivery))

      form.resetFields()
      setOrderItems([{}])
      incomingSupplyRequests(user?.facility, 0, 'active')
      api.success({
        message: 'Stock issued successfully',
        description:
          'Stock has been issued successfully, awaiting delivery to the selected location.',
      })
    } catch (error) {
      api.error({
        message: 'Error issuing stock',
        description: 'An error occurred while issuing stock. Please try again.',
      })
    }
  }

  const handleVaccineChange = (value, index) => {
    const newOrderItems = [...orderItems]
    const selectedData = formattedSupplyRequests.find(
      (request) =>
        request.vaccine === value &&
        request.location === form.getFieldValue('location')
    )

    newOrderItems[index] = {
      ...newOrderItems[index],
      orderNumber: selectedData?.orderNumberLabel,
      vaccine: value,
      quantity: selectedData?.quantity,
      location: form.getFieldValue('location'),
      id: selectedData?.id,
      expiryDate: selectedData?.expiryDate,
    }
    setOrderItems(newOrderItems)
  }

  const handleInputChange = (index, field, value) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index] = { ...newOrderItems[index], [field]: value }
    setOrderItems(newOrderItems)
  }

  const columns = [
    {
      title: 'Vaccine',
      dataIndex: 'vaccine',
      render: (text, record, index) => (
        <Select
          className="w-full"
          onChange={(value) => handleVaccineChange(value, index)}
          options={orderItems[index].options}
          placeholder="Select vaccine"
          allowClear
        />
      ),
    },
    { title: 'Order Number', dataIndex: 'orderNumber' },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      render: (text, record, index) => (
        <Input
          className="w-full"
          onChange={(e) =>
            handleInputChange(index, 'batchNumber', e.target.value)
          }
          placeholder="Enter batch number"
        />
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render: (text, record, index) => (
        <DatePicker
          className="w-full"
          onChange={(value) => handleInputChange(index, 'expiryDate', value)}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (text, record, index) => (
        <InputNumber
          className="w-full"
          onChange={(value) => handleInputChange(index, 'quantity', value)}
          placeholder="Enter quantity"
        />
      ),
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      render: (text, record, index) => (
        <Select
          className="w-full"
          onChange={(value) => handleInputChange(index, 'vvmStatus', value)}
          placeholder="Select VVM status"
          allowClear
        >
          {['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'].map((stage) => (
            <Option key={stage.toLowerCase()} value={stage.toLowerCase()}>
              {stage}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
      render: (text, record, index) => (
        <Input
          onChange={(e) =>
            handleInputChange(index, 'manufacturerDetails', e.target.value)
          }
          placeholder="Enter manufacturer details"
        />
      ),
    },
  ]

  const handleVaccineOptions = (location) => {
    const request = formattedSupplyRequests.filter(
      (request) => request.location === location
    )
    const options = request.map((request) => ({
      label: request.vaccine,
      value: request.vaccine,
    }))

    setOrderItems((prevItems) => [
      ...prevItems.slice(0, -1),
      { ...prevItems[prevItems.length - 1], options },
    ])
  }

  return (
    <div className="p-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          dateIssued: dayjs(),
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please select a location' }]}
          >
            <Select
              placeholder="Select location"
              options={locationOptions(requests?.data)}
              onChange={handleVaccineOptions}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
          <Form.Item name="orderNumber" label="Order Number" allowClear>
            <Input placeholder="Enter order number" />
          </Form.Item>
          <Form.Item
            name="dateIssued"
            label="Date Issued"
            allowClear
            rules={[{ required: true, message: 'Please select date issued' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <Table
          columns={columns}
          dataSource={orderItems}
          pagination={false}
          size="small"
        />
        <div className="flex justify-end mt-4">
          <Button
            className="bg-green text-white hover:!text-white hover:!bg-green"
            onClick={() =>
              setOrderItems([
                ...orderItems,
                { options: orderItems[orderItems.length - 1].options || [] },
              ])
            }
          >
            ADD
          </Button>
        </div>
        <div className="flex justify-end mt-4 border-t pt-3">
          <Button className="mr-4" onClick={() => form.resetFields()}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            Submit
          </Button>
        </div>
      </Form>
      {contextHolder}
    </div>
  )
}

export default SingleLocation
