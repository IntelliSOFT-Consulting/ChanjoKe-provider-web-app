import React from 'react'
import { Card, Button, Form, Tabs, Select, DatePicker, InputNumber } from 'antd'
import useInputTable from '../../hooks/InputTable'
import { createUseStyles } from 'react-jss'
import StockIssueForm from './StockIssueForm'
import SingleLocation from './issueStock/SingleLocation'

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

const IssueStock = () => {
  const classes = useStyles()
  const [form] = useForm()

  const columns = [
    {
      title: 'Location',
      dataIndex: 'location',
      type: 'select',
      options: [{ label: 'Location', value: 'location' }],
      placeholder: 'Select location',
      width: '25%',
    },
    { title: 'Batch Number', dataIndex: 'batchNumber', type: 'select' },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      type: 'date',
      disabled: true,
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
      type: 'number',
      disabled: true,
    },
    { title: 'Quantity Issued', dataIndex: 'quantityIssued', type: 'number' },
    { title: 'VVM Status', dataIndex: 'vvmStatus', type: 'select' },
    { title: 'Action', dataIndex: 'action', type: 'remove' },
  ]

  const { InputTable, values } = useInputTable({ columns })

  const onSubmit = (values) => {
    console.log(values)
  }

  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Issue Stock</div>}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: <div className="px-6 font-semibold">Single Location</div>,
            children: <SingleLocation />,
          },
          {
            key: '2',
            label: <div className="px-4 font-semibold">Multiple Locations</div>,
            children: (
              <StockIssueForm
                form={form}
                onSubmit={onSubmit}
                InputTable={InputTable}
              />
            ),
          },
        ]}
      />
    </Card>
  )
}

export default IssueStock
