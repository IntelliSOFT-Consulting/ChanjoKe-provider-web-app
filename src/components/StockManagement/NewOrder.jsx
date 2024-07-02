import { Card, Button, Form, Input, Select, DatePicker, notification } from 'antd'
import { createUseStyles } from 'react-jss'
import useInputTable from '../../hooks/InputTable'

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

export default function NewOrder() {
  const classes = useStyles()
  const [form] = useForm()


  const columns = [
    { title: 'Antigen ', dataIndex: 'vaccine', type: 'select' },
    { title: 'Doses in Stock', dataIndex: 'batchNumber', type: 'number' },
    { title: 'Minimum', dataIndex: 'expiryDate', type: 'number' },
    { title: 'Maximum', dataIndex: 'quantity', type: 'number' },
    { title: 'Recommended Stock', dataIndex: 'stockQuantity', type: 'number' },
    {
      title: 'Ordered Amount',
      dataIndex: 'manufacturerDetails',
      type: 'number',
    },
    { title: 'Action', dataIndex: 'action', type: 'remove' },
  ]

  const { InputTable } = useInputTable({ columns })

  const onSubmit = (data) => {
    console.log(data)
    notification.success({
      message: 'Order created successfully',
    })
  }

  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Vaccine Ordering Sheet</div>}
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
          <Button className={classes.btnPrimary} onClick={() => form.submit()}>
            Submit
          </Button>
        </div>,
      ]}
    >
      <div className="bg-[#163c9412] p-3 mx-4">
        <h3 className="text-[#707070] font-semibold text-base">Order Details</h3>
      </div>
      <Form layout="vertical" form={form} onFinish={onSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
          <Form.Item
            label="Level"
            name="level"
          >
            <Input placeholder="Level" />
          </Form.Item>
          <Form.Item
            label="Name of County:"
            name="nameOfCounty"
          >
            <Input placeholder="Name of the County" />
          </Form.Item>

          <Form.Item
            label="Sub-county"
            name="subCounty"
          >
            <Input placeholder="Sub County" />
          </Form.Item>

          <Form.Item
            label="Order Location"
            name="orderLocation"
            rules={[
              { required: true, message: 'Please input the order location' },
            ]}
          >
            <Input placeholder="Select Order Location" />
          </Form.Item>

          <Form.Item
            label="Date of Last Order:"
            name="lastOrderDate"
          >
            <DatePicker className="w-full" placeholder="Date of Last Order" />
          </Form.Item>

          <Form.Item
            label="Date of This Order:"
            name="thisOrderDate"
            rules={[
              { required: true, message: 'Please input the order location' },
            ]}
          >
            <DatePicker className="w-full" placeholder="Date of This Order" />
          </Form.Item>

          <Form.Item
            label="Preferred Pickup Date:"
            name="preferredPickupDate"
          >
            <DatePicker className="w-full" placeholder="Preferred Pickup Date" />
          </Form.Item>

          <Form.Item
            label="Expected Date of Next Order:"
            name="expectedDateOfNextOrder"
          >
            <DatePicker className="w-full" placeholder="Expected Date of Next Order" />
          </Form.Item>
        </div>
        <div className="border-2 mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
          <Form.Item
            label="Total Population"
            name="totalPopulation"
          >
            <Input placeholder="Total Population" />
          </Form.Item>

          <Form.Item
            label="Children Aged 0-11 Months (under 1 year)"
            name="childrenAged0-11Months"
          >
            <Input placeholder="Children Aged 0-11 Months (under 1 year)" />
          </Form.Item>

          <Form.Item
            label="Pregnant Women"
            name="pregnantWomen"
          >
            <Input placeholder="Pregnant Women" />
          </Form.Item>
        </div>
        <div className="bg-[#163c9412] p-3 mb-10">
          <h3 className="text-[#707070] font-semibold text-base">Antigen Details</h3>
        </div>
        <InputTable />
      </Form>
    </Card>
  )
}