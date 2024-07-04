import React from 'react'
import { Card, Button, Form, Input, Select, DatePicker, notification } from 'antd'
import useInputTable from '../../hooks/InputTable'
import { createUseStyles } from 'react-jss'
import useStock from '../../hooks/useStock'

const { useForm } = Form

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
  const classes = useStyles()
  const [form] = useForm()
  const { receiveStock, loading } = useStock()

  const columns = [
    { title: 'Vaccine/Diluents', dataIndex: 'vaccine', type: 'select' },
    { title: 'Batch Number', dataIndex: 'batchNumber', type: 'select' },
    { title: 'Expiry Date', dataIndex: 'expiryDate', type: 'date' },
    { title: 'Stock Quantity', dataIndex: 'quantity', type: 'number' },
    { title: 'Quantity', dataIndex: 'stockQuantity', type: 'number' },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      type: 'select',
      options: [
        // vaccine vial monitors
        { value: 'Stage 1', label: 'Stage 1' },
        { value: 'Stage 2', label: 'Stage 2' },
        { value: 'Stage 3', label: 'Stage 3' },
        { value: 'Stage 4', label: 'Stage 4' },
      ],
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
      type: 'text',
    },
    { title: 'Action', dataIndex: 'action', type: 'remove' },
  ]

  const { InputTable, values } = useInputTable({ columns })

  const onSubmit = async(values) => {
    try {
      const response = await receiveStock(values)
      notification.success({
        message: 'Stock received successfully',
      })
      form.resetFields()
    } catch (error) {
      notification.error({
        message: 'Failed to receive stock',
      })
    }
  }

  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Receive Stock</div>}
      actions={[
        <div className="flex w-full justify-end px-6">
          <Button
            type="primary"
            className="mr-4"
            onClick={() => form.resetFields()}
            ghost
          >
            Cancel
          </Button>
          <Button className={classes.btnPrimary} onClick={() => form.submit()} loading={loading}>
            Save
          </Button>
        </div>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
          <Form.Item
            label="Date Received"
            name="dateReceived"
            rules={[
              { required: true, message: 'Please input the date received' },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Origin"
            rules={[{ required: true, message: 'Please input the origin' }]}
            name="origin"
          >
            <Select
              name="origin"
              options={[
                { value: 'NPHCDA', label: 'NPHCDA' },
                { value: 'State', label: 'State' },
              ]}
              placeholder="Origin"
            />
          </Form.Item>

          <Form.Item
            label="Order Number"
            name="orderNumber"
            rules={[
              { required: true, message: 'Please input the order number' },
            ]}
          >
            <Input placeholder="Order number" />
          </Form.Item>
        </div>
        <InputTable />
      </Form>
    </Card>
  )
}

export default ReceiveStock
