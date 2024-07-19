import { Card, Button, Form, Input, Select, DatePicker, notification } from 'antd'
import { createUseStyles } from 'react-jss'
import useInputTable from '../../hooks/InputTable'
import useStock from '../../hooks/useStock'
import { useLocations } from '../../hooks/useLocation'
import useVaccination from '../../hooks/useVaccination'
import { useEffect, useState } from 'react'
import moment from 'moment'

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
  const { loading, requestStock } = useStock()
  const { getAllVaccines } = useVaccination()
  const [ vaccineOptions, setVaccineOptions ] = useState([])
  const [ nextOrderDate, setNextOrderDate] = useState(null)

  const { 
    counties,
    subCounties,
    facilities,
    wards, 
    handleCountyChange, 
    handleSubCountyChange,
    handleWardChange
  } = useLocations(form)


  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const vaccines = await getAllVaccines()
        setVaccineOptions(vaccines)
      }catch(error){
        console.log("Error fetching vaccines", error)
      }
    }
    fetchVaccines()
  }, [getAllVaccines])

  const columns = [
    { 
      title: 'Antigen ', 
      dataIndex: 'vaccine', 
      type: 'select', 
      options: vaccineOptions,
    },
    { title: 'Doses in Stock', dataIndex: 'dosesInStock', type: 'number' },
    { title: 'Minimum', dataIndex: 'minimumDoses', type: 'number' },
    { title: 'Maximum', dataIndex: 'maximumDoses', type: 'number' },
    { title: 'Recommended Stock', dataIndex: 'recommendedStock', type: 'number' },
    {
      title: 'Ordered Amount',
      dataIndex: 'quantity',
      type: 'number',
    },
    { title: 'Action', dataIndex: 'action', type: 'remove' },
  ]

  const { InputTable, values: tableValues } = useInputTable({ columns })

  const onSubmit = async(data) => {
    try{
      const combinedData = {
        ...data, 
        ...tableValues[0],
        facilityName: form.getFieldValue('facilityName')
      }

      localStorage.setItem('orderData', JSON.stringify(combinedData))

      const antigenData = JSON.parse(localStorage.getItem('orderData'))

      await requestStock(antigenData)
      notification.success({
        message: 'Order created successfully',
      })
      form.resetFields()
    }catch{
      notification.error({
        message: 'Error creating order',
      })
    }
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
            <Select
              onChange={(value) => handleCountyChange(value)}
              placeholder="Select County"
              options={counties?.map((county) => ({
                value: county.key,
                label: county.name,
              }))}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>

          <Form.Item
            label="Sub-county"
            name="subCounty"
          >
            <Select
              onChange={(value) => handleSubCountyChange(value)}
              placeholder="Select Subcounty"
              options={subCounties?.map((subCounty) => ({
                value: subCounty.key,
                label: subCounty.name,
              }))}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>

          <Form.Item
            label='Ward'
            name="ward"
          >
            <Select
              onChange={(value) => handleWardChange(value)}
              placeholder="Select a Ward"
              options={wards?.map((ward) => ({
                value: ward.key,
                label: ward.name,
              }))}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>

          <Form.Item
            label="Order Location"
            name="facility"
            rules={[
              { required: true, message: 'Please input the order location' },
            ]}
          >
            <Select
              placeholder="Select Order Location"
              options={facilities?.map((facility) => ({
                value: facility.key,
                label: facility.name,
              }))}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => {
                const selectedFacility = facilities.find((facility) => facility.key === value);
                form.setFieldsValue({
                  facility: selectedFacility ? selectedFacility.key : '',
                  facilityName: selectedFacility ? selectedFacility.name : ''
                });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Date of Last Order:"
            name="lastOrderDate"
          >
            <DatePicker 
              className="w-full" 
              placeholder="Date of Last Order" 
              disabledDate={(current) => 
                current && current > moment().subtract(1, 'days').startOf('days')
              }
            />
          </Form.Item>

          <Form.Item
            label="Date of This Order:"
            name="authoredOn"
            rules={[
              { required: true, message: 'Please input the order date' },
            ]}
          >
            <DatePicker 
              className="w-full"
              placeholder="Date of This Order"
              onChange={(date) => setNextOrderDate(date)}
            />
          </Form.Item>

          <Form.Item
            label="Preferred Pickup Date:"
            name="preferredPickupDate"
          >
            <DatePicker 
              className="w-full" 
              placeholder="Preferred Pickup Date"
              disabledDate={(current) => 
                current && current < moment().startOf('days')
              }  
            />
          </Form.Item>

          <Form.Item
            label="Expected Date of Next Order:"
            name="expectedDateOfNextOrder"
          >
            <DatePicker 
              className="w-full" 
              placeholder="Expected Date of Next Order" 
              disabledDate={(current) => 
                current && nextOrderDate ? current < nextOrderDate.startOf('days') : false
              }
            />
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