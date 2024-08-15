import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Select,
} from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import useInventory from '../../hooks/useInventory'
import useStock from '../../hooks/useStock'
import Table from '../DataTable'
import {
  inventoryItemBuilder,
  inventoryReportBuilder,
  inventoryItemUpdate,
} from './stockResourceBuilder'
import { deliveriesLocations, formatDeliveryToTable } from './stockUtils'
import LoadingArrows from '../../common/spinners/LoadingArrows'

const useStyles = createUseStyles({
  btnSuccess: {
    backgroundColor: '#169416',
    borderColor: '#169416',
    color: 'white',
    '&:hover': {
      backgroundColor: '#169416',
      borderColor: '#169416',
      color: 'white',
    },
  },
  btnPrimary: {
    backgroundColor: '#163C94',
    borderColor: '#163C94',
    color: 'white',
    '&:hover': {
      backgroundColor: '#163C94 !important',
      borderColor: '#163C94',
      color: 'white !important',
    },
  },
})

const ReceiveStock = () => {
  const [saving, setSaving] = useState(false)
  const classes = useStyles()
  const [form] = Form.useForm()
  const { loading, getIncomingDeliveries, deliveries, updateSupplyDelivery } =
    useStock()

  const [selectedOrder, setSelectedOrder] = useState(null)

  const { user } = useSelector((state) => state.userInfo)

  const {
    getInventoryItems,
    getInventoryReport,
    createInventory,
    updateInventory,
    inventoryItems,
    inventoryReport,
  } = useInventory()
  const location = useLocation()
  const state = location.state || {}
  const { orderNumber = '', origin = '' } = state

  const navigate = useNavigate()

  useEffect(() => {
    getIncomingDeliveries(user.facility)

    getInventoryItems()
    getInventoryReport()

    form.setFieldsValue({ orderNumber, origin })
  }, [])

  const onSubmit = async () => {
    setSaving(true)
    try {
      const original = deliveries?.data?.find(
        (delivery) => selectedOrder.id === delivery.id
      )

      original.status = 'completed'

      await updateSupplyDelivery(original)

      let facilityInventory = await getInventoryItems()
      const facilityReport = await getInventoryReport()

      if (facilityInventory?.length === 0) {
        const inventoryItems = inventoryItemBuilder(user.facility)

        facilityInventory = await Promise.all(
          inventoryItems.map(async (item) => {
            return await createInventory(item)
          })
        )
      }

      // Update inventory items
      const updatedInventory = inventoryItemUpdate(
        selectedOrder?.vaccines,
        facilityInventory
      )

      await Promise.all(
        updatedInventory.map(async (item) => {
          return await updateInventory(item)
        })
      )

      const report = inventoryReportBuilder(
        selectedOrder?.vaccines,
        facilityReport,
        user.facility
      )

      await createInventory(report)

      notification.success({
        message: 'Stock received successfully',
      })

      form.resetFields()
      setSelectedOrder(null)
      setSaving(false)

      setTimeout(() => {
        navigate('/stock-management')
      }, 1500)
    } catch (error) {
      console.log('error', error)
      notification.error({
        message: 'Failed to receive stock',
      })
    }
  }

  const handleSelectOrigin = (value) => {
    const selectedOrigin = deliveries?.data?.find(
      (delivery) => delivery.origin === value
    )
    const formatted = formatDeliveryToTable(selectedOrigin)

    form.setFieldValue('orderNumber', formatted.orderNumber)
    setSelectedOrder(formatted)
  }

  const columns = [
    {
      title: 'Vaccine/Diluents',
      dataIndex: 'vaccine',
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
    },
    {
      title: 'Received Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
    },
  ]

  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Receive Stock</div>}
      actions={[
        <div className="flex w-full justify-end px-6">
          <Button
            type="primary"
            className="mr-4"
            onClick={() => {
              form.resetFields()
              setSelectedOrder(null)
            }}
            ghost
          >
            Cancel
          </Button>
          <Button
            className={classes.btnPrimary}
            onClick={() => form.submit()}
            loading={loading || saving}
            disabled={!selectedOrder || saving}
          >
            Save
          </Button>
        </div>,
      ]}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingArrows />
        </div>
      ) : (
        <Form
          layout="vertical"
          form={form}
          onFinish={onSubmit}
          className="p-4"
          initialValues={{
            dateReceived: dayjs(),
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
            <Form.Item
              label="Date Received"
              name="dateReceived"
              rules={[
                { required: true, message: 'Please input the date received' },
              ]}
            >
              <DatePicker className="w-full" format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Origin"
              rules={[{ required: true, message: 'Please input the origin' }]}
              name="origin"
            >
              <Select
                name="origin"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.label
                    ? option.label.toLowerCase().includes(input.toLowerCase())
                    : false
                }
                options={deliveriesLocations(deliveries?.data)}
                placeholder="Origin"
                onSelect={handleSelectOrigin}
              />
            </Form.Item>

            <Form.Item
              label="Order Number"
              name="orderNumber"
              rules={[
                { required: true, message: 'Please input the order number' },
              ]}
            >
              <Input placeholder="Order number" disabled />
            </Form.Item>
          </div>
          <Table
            columns={columns}
            dataSource={selectedOrder?.vaccines || []}
            pagination={false}
            size="small"
          />
        </Form>
      )}
    </Card>
  )
}

export default ReceiveStock
