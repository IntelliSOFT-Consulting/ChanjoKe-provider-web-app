import { useState, useEffect, Children } from 'react'
import { Card, Form, Select, DatePicker, Button } from 'antd'
import { useLocations } from '../hooks/useLocation'
import Table from '../components/DataTable'
import moment from 'moment'
import { useReports } from '../hooks/useReports'
import { format710 } from '../utils/formatters/format710'

export default function MOH710() {
  const [dates, setDates] = useState([])
  const [form] = Form.useForm()

  const { moh710, getMoh710 } = useReports()

  const {
    counties,
    subCounties,
    wards,
    facilities,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  } = useLocations(form)

  const handleDates = (values = {}) => {
    const { start, end } = values
    const dates = []
    if (start && end) {
      const startDate = moment(start)
      const endDate = moment(end)
      while (startDate <= endDate) {
        dates.push(startDate.format('DD-MM-YYYY'))
        startDate.add(1, 'days')
      }
    } else {
      const startDate = moment().startOf('month')
      const endDate = moment()
      while (startDate <= endDate) {
        dates.push(startDate.format('DD-MM-YYYY'))
        startDate.add(1, 'days')
      }
    }

    setDates(dates)
    getMoh710(values)
  }

  useEffect(() => {
    handleDates()
    getMoh710({})
  }, [])

  const handleFilter = (values) => {
    const { date } = values
    if (date?.length) {
      const start = date[0]?.format('YYYY-MM-DD')
      const end = date[1]?.format('YYYY-MM-DD')
      handleDates({ ...values, start, end })
    }
  }

  const columns = [
    {
      title: 'Antigen',
      dataIndex: 'antigen',
      key: 'antigen',
      fixed: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'ageGroup',
      key: 'ageGroup',
      fixed: 'left',
    },
    {
      title: 'Date',
      children: dates.map((date) => ({
        title: date,
        dataIndex: date,
        key: date,
      })),
    },
    {
      title: 'Total Static',
      dataIndex: 'totalStatic',
      key: 'totalStatic',
      fixed: 'right',
    },
    {
      title: 'Total Outreach',
      dataIndex: 'totalOutreach',
      key: 'totalOutreach',
      fixed: 'right',
    },
    {
      title: 'Grand Total',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
    },
  ]

  console.log(format710(moh710))

  return (
    <Card title="MOH 710" className="mt-5">
      <div className="px-4 font-semibold py-5 sm:px-6">
        <Form
          layout="vertical"
          form={form}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-end"
          onFinish={handleFilter}
        >
          <Form.Item label="County" name="county" className="m-0">
            <Select
              placeholder="Select County"
              onChange={handleCountyChange}
              options={counties?.map((county) => ({
                label: county.name,
                value: county.key,
              }))}
            />
          </Form.Item>
          <Form.Item label="Sub County" name="subcounty" className="m-0">
            <Select
              placeholder="Select Sub County"
              onChange={handleSubCountyChange}
              options={subCounties?.map((subCounty) => ({
                label: subCounty.name,
                value: subCounty.key,
              }))}
            />
          </Form.Item>
          <Form.Item label="Ward" name="ward" className="m-0">
            <Select
              placeholder="Select Ward"
              onChange={handleWardChange}
              options={wards?.map((ward) => ({
                label: ward.name,
                value: ward.key,
              }))}
            />
          </Form.Item>
          <Form.Item label="Facility" name="facility-code" className="m-0">
            <Select
              placeholder="Select Facility"
              options={facilities?.map((facility) => ({
                label: facility.name,
                value: facility.key,
              }))}
            />
          </Form.Item>
          <Form.Item label="Date" name="date" className="m-0">
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>

          <Form.Item className="m-0">
            <Button type="primary" htmlType="submit">
              Generate Report
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-5 overflow-x-auto">
          <Table
            columns={columns}
            size="small"
            scroll={{ x: 'max-content' }}
            centered
            bordered
            dataSource={format710(moh710)}
          />
        </div>
      </div>
    </Card>
  )
}
