import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
} from 'antd'
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  manufacturerOptions,
  vvmStatuses,
} from '../../data/options/clientDetails'
import { uniqueVaccineOptions } from '../../data/vaccineData'
import useInventory from '../../hooks/useInventory'
import { formatLocation } from '../../utils/formatter'
import Table from '../DataTable'
import {
  inventoryItemBuilder,
  inventoryReportBuilder,
} from './helpers/stockResourceBuilder'

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

const ReceiveRegionalStock = () => {
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState([{}])
  const classes = useStyles()
  const [form] = Form.useForm()

  const { user } = useSelector((state) => state.userInfo)

  const {
    getAggregateInventoryItems,
    createInventory,
    batchItems,
    inventoryItems,
  } = useInventory()

  const navigate = useNavigate()

  useEffect(() => {
    getAggregateInventoryItems({ subject: formatLocation(user?.subCounty) })
  }, [])

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      const data = {
        ...values,
        facility: {
          reference: formatLocation(user.subCounty),
          display: user.subCountyName,
        },
        vaccines: items,
      }

      const inventoryItems = inventoryItemBuilder(data)

      await Promise.all(
        inventoryItems.map(async (item) => {
          return await createInventory(item)
        })
      )

      const updatedItems = await getAggregateInventoryItems({
        subject: formatLocation(user.subCounty),
      })

      const report = inventoryReportBuilder(updatedItems, {
        reference: formatLocation(user.subCounty),
        display: user.subCountyName,
      })

      await createInventory(report)

      notification.success({
        message: 'Stock received successfully',
      })

      form.resetFields()
      setItems([{}])
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

  const columns = [
    {
      title: 'Vaccine/Diluents',
      dataIndex: 'vaccine',
      render: (_text, _record, index) => (
        <Select
          placeholder="Select Vaccine"
          className="w-full"
          options={uniqueVaccineOptions}
          onChange={(value) => {
            const updatedItems = [...items]
            const vaccineQty =
              inventoryItems?.find((batch) => batch.vaccine === value)
                ?.quantity ?? 0
            updatedItems[index].vaccine = value
            updatedItems[index].stockQuantity = vaccineQty
            setItems(updatedItems)
          }}
        />
      ),
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      render: (_text, _record, index) => (
        <Input
          placeholder="Batch Number"
          className="w-full"
          onChange={(e) => {
            const updatedItems = [...items]
            updatedItems[index].batchNumber = e.target.value
            setItems(updatedItems)
          }}
        />
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render: (_text, _record, index) => (
        <DatePicker
          placeholder="Expiry Date"
          className="w-full"
          format="DD-MM-YYYY"
          onChange={(date) => {
            const updatedItems = [...items]
            updatedItems[index].expiryDate = date
            setItems(updatedItems)
          }}
          disabledDate={(current) =>
            current && current < dayjs().startOf('day')
          }
        />
      ),
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
      render: (text) => (
        <InputNumber
          value={text}
          placeholder="Stock Quantity"
          className="w-full"
          disabled
        />
      ),
    },
    {
      title: 'Received Quantity',
      dataIndex: 'quantity',
      render: (_text, _record, index) => (
        <InputNumber
          placeholder="Received Quantity"
          className="w-full"
          onChange={(value) => {
            const updatedItems = [...items]
            updatedItems[index].quantity = value
            setItems(updatedItems)
          }}
        />
      ),
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      render: (_text, _record, index) => (
        <Select
          placeholder="Select VVM Status"
          className="w-full"
          options={vvmStatuses}
          onChange={(value) => {
            const updatedItems = [...items]
            updatedItems[index].vvmStatus = value
            setItems(updatedItems)
          }}
        />
      ),
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
      render: (_text, _record, index) => (
        <Select
          placeholder="Manufacturer Details"
          options={manufacturerOptions}
          className="w-full"
          onChange={(e) => {
            const updatedItems = [...items]
            updatedItems[index].manufacturerDetails = e
            setItems(updatedItems)
          }}
        />
      ),
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
            }}
            ghost
          >
            Cancel
          </Button>
          <Button
            className={classes.btnPrimary}
            onClick={() => form.submit()}
            loading={saving}
            disabled={saving}
          >
            Save
          </Button>
        </div>,
      ]}
    >
      <Form
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onSubmit}
        className="p-4"
        initialValues={{
          dateReceived: dayjs(),
          origin: user?.subCounty,
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
              placeholder="Select Origin"
              options={[{ label: user?.subCountyName, value: user?.subCounty }]}
              disabled
            />
          </Form.Item>

          <Form.Item label="Order Number" name="orderNumber">
            <Input placeholder="Order number" />
          </Form.Item>
        </div>
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          size="small"
        />
        <div className="flex justify-end mt-5">
          <Button
            className="!bg-green !text-white hover:!bg-green hover:!border-green hover:!text-white"
            disabled={
              items?.some((batch) => !batch.quantity) ||
              items?.some((batch) => !batch.vaccine) ||
              items?.some((batch) => !batch.batchNumber) ||
              items?.some((batch) => !batch.expiryDate) ||
              items?.some((batch) => !batch.vvmStatus) ||
              items?.some((batch) => !batch.manufacturerDetails)
            }
            onClick={() => {
              setItems([...items, {}])
            }}
          >
            Add Row
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default ReceiveRegionalStock
