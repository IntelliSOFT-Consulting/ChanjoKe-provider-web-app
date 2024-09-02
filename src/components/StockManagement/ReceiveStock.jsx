import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Tag,
} from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import useInventory from '../../hooks/useInventory'
import useStock from '../../hooks/useStock'
import Table from '../DataTable'
import {
  inventoryItemBuilder,
  inventoryReportBuilder,
} from './helpers/stockResourceBuilder'
import {
  deliveriesLocations,
  formatDeliveryToTable,
} from './helpers/stockUtils'
import { vialsToDoses } from './helpers/stockUtils'

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
  const {
    loading,
    getIncomingDeliveries,
    deliveries,
    updateSupplyDelivery,
    updateRequestStatus,
  } = useStock()

  const [selectedOrder, setSelectedOrder] = useState(null)

  const { user } = useSelector((state) => state.userInfo)

  const {
    getAggregateInventoryItems,
    getDetailedInventoryItems,
    getInventoryReport,
    createInventory,
    inventoryItems,
  } = useInventory()
  const location = useLocation()
  const state = location.state || {}
  const { orderNumber = '', origin = '' } = state

  const navigate = useNavigate()

  useEffect(() => {
    getIncomingDeliveries(user.orgUnit?.code)

    getAggregateInventoryItems()
    getInventoryReport()
  }, [])

  useEffect(() => {
    if (deliveries?.data?.length > 0) {
      form.setFieldsValue({ orderNumber, origin })

      const findDelivery = deliveries?.data?.find(
        (delivery) => delivery.basedOn?.[0]?.display === orderNumber
      )

      const formatted = formatDeliveryToTable(findDelivery, inventoryItems)
      setSelectedOrder(formatted)
    }
  }, [deliveries])

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      const original = deliveries?.data?.find(
        (delivery) => selectedOrder.id === delivery.id
      )

      original.status = 'completed'
      const supplyRequest = original.basedOn?.[0]?.reference?.split('/')?.[1]

      await updateSupplyDelivery(original)
      await updateRequestStatus(supplyRequest, 'completed')

      const payload = {
        ...values,
        vaccines: selectedOrder.vaccines.map((item) => {
          return {
            ...item,
            quantity: vialsToDoses(item.vaccine, item.quantity),
          }
        }),
        facility: {
          reference: user.orgUnit?.code,
          display: user.orgUnit?.name,
        },
      }

      const inventory = inventoryItemBuilder(payload)

      await Promise.all(
        inventory.map(async (item) => {
          return await createInventory(item)
        })
      )

      let facilityInventory = await getDetailedInventoryItems()

      const newReport = inventoryReportBuilder(
        facilityInventory,
        user?.orgUnit?.code
      )

      await createInventory(newReport)

      notification.success({
        message: 'Stock received successfully',
      })

      form.resetFields()
      setSelectedOrder(null)

      navigate('/stock-management', { replace: true })
    } catch (error) {
      console.log('error', error)
      notification.error({
        message: 'Failed to receive stock',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSelectOrigin = (value) => {
    const selectedOrigin = deliveries?.data?.find(
      (delivery) =>
        delivery.origin === value?.split('_')[0] &&
        delivery.basedOn?.[0]?.display === value?.split('_')[1]
    )
    const formatted = formatDeliveryToTable(selectedOrigin, inventoryItems)

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
          <Popconfirm
            title="Are you sure you want to receive this stock?"
            onConfirm={() => form.submit()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className={classes.btnPrimary}
              loading={loading || saving}
              disabled={!selectedOrder || saving}
            >
              Receive
            </Button>
          </Popconfirm>
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
                filterOption={(input, option) => {
                  return option?.key
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }}
                placeholder="Origin"
                onSelect={handleSelectOrigin}
              >
                {deliveriesLocations(deliveries?.data)?.map((location) => {
                  const [origin, orderNumber] = location.value.split('_')
                  return (
                    <Select.Option key={location.value} value={location.value}>
                      {origin} <Tag color="blue">{orderNumber}</Tag>
                    </Select.Option>
                  )
                })}
              </Select>
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
