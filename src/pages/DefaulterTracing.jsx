import { DatePicker, Form, Input } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import Table from '../components/DataTable'

export default function DefaulterTracing() {
  const [formData, setFormData] = useState({
    clientName: '',
    startDate: '',
    endDate: '',
    vaccineName: '',
  })
  const [defaulters, setDefaulters] = useState([
    {
      name: 'John Doe',
      uniqueID: 'XXX XXX',
      phoneNumber: '0700 000000',
      vaccinesMissed: 'Polio',
      dose: 4,
      scheduledDate: 'Jan 20/2024',
    },
    {
      name: 'John Doe',
      uniqueID: 'XXX XXX',
      phoneNumber: '0700 000000',
      vaccinesMissed: 'Polio',
      dose: 5,
      scheduledDate: 'Jan 20/2024',
    },
    {
      name: 'John Doe',
      uniqueID: 'XXX XXX',
      phoneNumber: '0700 000000',
      vaccinesMissed: 'Polio',
      dose: 2,
      scheduledDate: 'Jan 20/2024',
    },
    {
      name: 'John Doe',
      uniqueID: 'XXX XXX',
      phoneNumber: '0700 000000',
      vaccinesMissed: 'Polio',
      dose: 5,
      scheduledDate: 'Jan 20/2024',
    },
    {
      name: 'John Doe',
      uniqueID: 'XXX XXX',
      phoneNumber: '0700 000000',
      vaccinesMissed: 'Polio',
      dose: 1,
      scheduledDate: 'Jan 20/2024',
    },
  ])

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // validate(name, value, formRules);
  }



  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Unique ID',
      dataIndex: 'uniqueID',
      key: 'uniqueID',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Vaccines Missed',
      dataIndex: 'vaccinesMissed',
      key: 'vaccinesMissed',
    },
    {
      title: 'Dose',
      dataIndex: 'dose',
      key: 'dose',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
  ]

  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Defaulter Tracing
      </div>
      <div className="px-4 py-5 sm:p-6">
        <Form layout="vertical" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Client Name/ID" name="clientName">
            <Input
              placeholder="Enter Client Name/ID"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Start/End Date" name="date">
            <DatePicker.RangePicker
              value={[
                formData.startDate ? moment(formData.startDate) : '',
                formData.endDate ? moment(formData.endDate) : '',
              ]}
              onChange={(date, dateString) => {
                handleChange('startDate', dateString[0])
                handleChange('endDate', dateString[1])
              }}

              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Vaccine" name="vaccineName">
            <Input
              placeholder="Enter Vaccine Name"
              value={formData.vaccineName}
              onChange={(e) => handleChange('vaccineName', e.target.value)}
            />
          </Form.Item>
        </Form>

        <Table
          dataSource={defaulters}
          columns={columns}
          rowKey="uniqueID"
          size="small"
          bordered
          pagination={{
            pageSize: 12,
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  )
}
