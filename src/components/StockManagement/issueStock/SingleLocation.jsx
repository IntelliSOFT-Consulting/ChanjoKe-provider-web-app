import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Input,
  InputNumber,
  Select,
  DatePicker,
  notification,
  Tag,
  Popconfirm,
} from 'antd'
import { useSelector } from 'react-redux'
import Table from '../../DataTable'
import useStock from '../../../hooks/useStock'
import { locationOptions, formatSupplyRequest } from '../helpers/stockUtils'
import { supplyDeliveryBuilder } from '../helpers/stockResourceBuilder'
import dayjs from 'dayjs'
import { manufacturerOptions } from '../../../data/options/clientDetails'
import { usePractitioner } from '../../../hooks/usePractitioner'
import { titleCase } from '../../../utils/methods'
import { useMeta } from '../../../hooks/useMeta'
import { useLocation, useNavigate } from 'react-router-dom'

const { Option } = Select

const SingleLocation = ({ vaccines = [] }) => {
  const [selectedVaccine, setSelectedVaccine] = useState(null)
  const [orderItems, setOrderItems] = useState([{}])
  const [tableErrors, setTableErrors] = useState({})

  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)

  const { state } = useLocation()
  const navigate = useNavigate()

  const {
    incomingSupplyRequests,
    createSupplyDelivery,
    updateSupplyRequest,
    requests,
  } = useStock()
  const { getPractitionerRoles } = usePractitioner()

  const { deleteTags } = useMeta()

  useEffect(() => {
    incomingSupplyRequests(user?.facility, 0, 'active', 'order')
  }, [])

  useEffect(() => {
    if (state?.order && requests?.data) {
      const selectedRequest = requests?.data.find(
        (request) => state?.order?.id === request.id
      )

      const selected = formatSupplyRequest(selectedRequest)
      form.setFieldsValue({
        location: selected.receiver,
        orderNumber: selected.orderNumber,
      })

      setSelectedVaccine(selected)
    }
  }, [state, requests])

  const handleValidate = () => {
    const errors = {}
    const mandatoryFields = [
      'vaccine',
      'batchNumber',
      'expiryDate',
      'quantity',
      'vvmStatus',
    ]

    orderItems.forEach((item, index) => {
      mandatoryFields.forEach((field) => {
        if (!item[field]) {
          errors[index] = {
            ...errors[index],
            [field]: 'This field is required',
          }
        }
      })
    })

    setTableErrors(errors)

    return errors
  }

  const handleSubmit = async (values) => {
    try {
      const err = handleValidate()
      if (Object.keys(err).length) {
        return
      }
      const selectedRequest = requests?.data.find(
        (request) => selectedVaccine?.id === request.id
      )

      const orderTag = selectedRequest.meta?.tag
      await deleteTags(`SupplyRequest/${selectedRequest.id}`, orderTag)

      selectedRequest.meta = {
        ...selectedRequest.meta,
        tag: [
          {
            system:
              'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/tags',
            code: 'dispatched',
            display: 'Dispatched',
          },
        ],
      }

      const deliveryData = {
        ...values,
        user,
        supplier: {
          reference: `Practitioner/${user?.fhirPractitionerId}`,
          display: `${titleCase(user?.practitionerRole)}/${
            selectedRequest.deliverFrom.reference
          }`,
        },
        identifier: [
          {
            value: selectedRequest.deliverFrom.reference,
          },
        ],
        basedOn: [
          {
            reference: `SupplyRequest/${selectedRequest.id}`,
            display: selectedRequest.identifier?.[0]?.value,
          },
        ],
        destination: selectedRequest.deliverTo,
        tableValues: orderItems.map((item) => {
          return {
            ...item,
          }
        }),
      }

      const supplyDelivery = supplyDeliveryBuilder(deliveryData)

      await createSupplyDelivery(supplyDelivery)
      await updateSupplyRequest(selectedRequest)

      form.resetFields()
      setOrderItems([{}])
      await incomingSupplyRequests(user?.facility, 0, 'active', 'order')
      api.success({
        message: 'Stock issued successfully',
        description:
          'Stock has been issued successfully, awaiting delivery to the selected location.',
      })

      // navigate to stock management page after 1 second
      setTimeout(() => {
        navigate('/stock-management', { state: {} })
      }, 1000)
    } catch (error) {
      console.log(error)
      api.error({
        message: 'Error issuing stock',
        description: 'An error occurred while issuing stock. Please try again.',
      })
    }
  }

  const handleVaccineChange = (value, index) => {
    const qty = selectedVaccine?.vaccines.find(
      (vaccine) => vaccine.vaccine === value
    )?.quantity
    const newOrderItems = [...orderItems]
    newOrderItems[index] = {
      ...newOrderItems[index],
      vaccine: value,
      orderedQuantity: qty,
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
      render: (_text, record, index) => (
        <Select
          className="w-full"
          onChange={(value) => handleVaccineChange(value, index)}
          options={selectedVaccine?.vaccines.map((vaccine) => ({
            label: vaccine.vaccine,
            value: vaccine.vaccine,
          }))}
          value={record.vaccine}
          placeholder="Select vaccine"
          allowClear
          status={tableErrors[index.toString()]?.vaccine ? 'error' : 'success'}
        />
      ),
      width: '10%',
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      render: (_text, record, index) => (
        <Input
          className="w-full"
          onChange={(e) =>
            handleInputChange(index, 'batchNumber', e.target.value)
          }
          value={record.batchNumber}
          placeholder="Enter batch number"
          status={
            tableErrors[index.toString()]?.batchNumber ? 'error' : 'success'
          }
        />
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render: (_text, record, index) => (
        <DatePicker
          className="w-full"
          onChange={(value) => handleInputChange(index, 'expiryDate', value)}
          status={
            tableErrors[index.toString()]?.expiryDate ? 'error' : 'success'
          }
          value={record.expiryDate || null}
        />
      ),
    },
    {
      title: 'Ordered Quantity',
      dataIndex: 'orderedQuantity',
      render: (text) => (
        <InputNumber className="w-full" disabled value={text} />
      ),
    },
    {
      title: 'Issued Quantity',
      dataIndex: 'quantity',
      render: (_text, record, index) => (
        <InputNumber
          className="w-full"
          value={record.quantity}
          onChange={(value) => handleInputChange(index, 'quantity', value)}
          placeholder="Enter quantity"
          status={tableErrors[index.toString()]?.quantity ? 'error' : 'success'}
        />
      ),
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      render: (_text, record, index) => (
        <Select
          className="w-full"
          onChange={(value) => handleInputChange(index, 'vvmStatus', value)}
          placeholder="Select VVM status"
          allowClear
          value={record.vvmStatus}
          status={
            tableErrors[index.toString()]?.vvmStatus ? 'error' : 'success'
          }
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
      render: (_text, record, index) => (
        <Select
          className="w-full"
          onChange={(value) =>
            handleInputChange(index, 'manufacturerDetails', value)
          }
          placeholder="Select Manufacturer"
          allowClear
          value={record.manufacturerDetails}
          status={
            tableErrors[index.toString()]?.manufacturerDetails
              ? 'error'
              : 'success'
          }
          showSearch
          options={manufacturerOptions}
        />
      ),
    },
  ]

  const handleVaccineOptions = (location) => {
    if (!location) {
      setOrderItems([{}])
      form.setFieldValue('orderNumber', null)
      return setSelectedVaccine(null)
    }

    const selectedRequest = requests?.data.find(
      (request) => request.deliverTo?.reference === location
    )

    const selected = formatSupplyRequest(selectedRequest)

    form.setFieldValue('orderNumber', selected.orderNumber)

    setSelectedVaccine(selected)
  }

  const handleOrderNumberChange = (orderNumber) => {
    const selectedRequest = requests?.data.find(
      (request) => request.identifier?.[0]?.value === orderNumber
    )

    const selected = formatSupplyRequest(selectedRequest)
    form.setFieldValue('location', selected.receiver)

    setSelectedVaccine(selected)
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
            >
              {locationOptions(requests?.data)?.map((location) => (
                <Option key={location.value} value={location.value}>
                  <Tag color="blue">({location.value?.split('/')[1]})</Tag>
                  {location.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="orderNumber" label="Order Number" allowClear>
            <Input
              placeholder="Enter order number"
              onBlur={(e) => handleOrderNumberChange(e.target.value)}
            />
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
        <div className="flex flex-col items-end">
          {Object.keys(tableErrors).length > 0 && (
            <p className="text-red-500 bg-red-50 p-2">
              Please fill in all required fields to proceed
            </p>
          )}
          <Button
            className="bg-green text-white hover:!text-white hover:!bg-green mt-4"
            disabled={
              !selectedVaccine ||
              selectedVaccine?.vaccines?.length === orderItems?.length
            }
            onClick={() => {
              const err = handleValidate()
              if (Object.keys(err).length) {
                return
              }
              setOrderItems([
                ...orderItems,
                { options: orderItems[orderItems.length - 1].options || [] },
              ])
            }}
          >
            ADD
          </Button>
        </div>
        <div className="flex justify-end mt-4 border-t pt-3">
          <Button className="mr-4" onClick={() => form.resetFields()}>
            Cancel
          </Button>
          <Popconfirm
            title="Are you sure you want to submit?"
            onConfirm={() => form.submit()}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Submit</Button>
          </Popconfirm>
        </div>
      </Form>
      {contextHolder}
    </div>
  )
}

export default SingleLocation
