import { useState, useEffect } from 'react'
import { DatePicker, Form, Input } from 'antd'
import moment from 'moment'
import Table from '../components/DataTable'
import { useApiRequest } from '../api/useApiRequest'
import { debounce } from '../utils/methods'
import { render } from '@testing-library/react'

export default function DefaulterTracing() {
  const [defaulters, setDefaulters] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    clientName: '',
    startDate: '',
    endDate: '',
    vaccineName: '',
  })

  const { get } = useApiRequest()

  const [form] = Form.useForm()

  const fetcbDefaulters = async (params) => {
    let query = '/reports/api/defaulters?'
    console.log(params)
    for (const key in params) {
      if (params[key]) {
        console.log(params[key])
        query += `${key}=${params[key]}&`
      }
    }
    setLoading(true)
    const response = await get(query)
    setDefaulters(response)
    setLoading(false)
  }

  const handleChange = async () => {
    const formvalues = form.getFieldsValue()

    console.log(formvalues)

    const startDate = formvalues.date?.[0]?.format('YYYY-MM-DD')
    const endDate = formvalues.date?.[1]?.format('YYYY-MM-DD')

    await fetcbDefaulters({
      name: formvalues.clientName,
      vaccine_name: formvalues.vaccineName,
      start_date: startDate,
      end_date: endDate,
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'family_name',
      key: 'family_name',
      render: (_text, record) => `${record.given_name} ${record.family_name}`,
    },
    {
      title: 'Unique ID',
      dataIndex: 'national_id',
      key: 'national_id',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vaccines Missed',
      dataIndex: 'vaccinename',
      key: 'vaccinename',
    },
    {
      title: 'Dose',
      dataIndex: 'the_vaccine_seq',
      key: 'the_vaccine_seq',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'due_date',
      key: 'due_date',
    },
  ]

  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Defaulter Tracing
      </div>
      <div className="px-4 py-5 sm:p-6">
        <Form
          layout="vertical"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          form={form}
        >
          <Form.Item label="Client Name/ID" name="clientName">
            <Input
              placeholder="Enter Client Name/ID"
              onChange={debounce(() => {
                handleChange()
              }, 300)}
            />
          </Form.Item>

          <Form.Item label="Start/End Date" name="date">
            <DatePicker.RangePicker
              onChange={debounce(() => {
                handleChange()
              }, 300)}
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Vaccine" name="vaccineName">
            <Input
              placeholder="Enter Vaccine Name"
              onChange={debounce(() => {
                handleChange()
              }, 300)}
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
