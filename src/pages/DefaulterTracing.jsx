import { useState, useEffect } from 'react'
import { DatePicker, Form, Input, Select } from 'antd'
import Table from '../components/DataTable'
import { useApiRequest } from '../api/useApiRequest'
import { debounce } from '../utils/methods'
import moment from 'moment'
import { routineVaccines, nonRoutineVaccines } from '../data/vaccineData'

export default function DefaulterTracing() {
  const [defaulters, setDefaulters] = useState([])
  const [loading, setLoading] = useState(false)

  const { get } = useApiRequest()

  const [form] = Form.useForm()

  const formatVaccines = () => {
    const vaccines = [...routineVaccines, ...nonRoutineVaccines]
    return vaccines.map((vaccine) => ({
      value: vaccine.vaccineName,
      label: vaccine.vaccineName,
    }))
  }

  const fetchDefaulters = async (params) => {
    let query = '/reports/api/defaulters?'
    for (const key in params) {
      if (params[key]) {
        query += `${key}=${params[key]}&`
      }
    }
    setLoading(true)
    const response = await get(query)
    setDefaulters(response)
    setLoading(false)
  }

  useEffect(() => {
    fetchDefaulters({})
  }, [])

  const handleChange = async (page = 1, pageSize = 20) => {
    const formvalues = form.getFieldsValue()

    const startDate = formvalues.date?.[0]?.format('YYYY-MM-DD')
    const endDate = formvalues.date?.[1]?.format('YYYY-MM-DD')

    await fetchDefaulters({
      name: formvalues.clientName,
      vaccine_name: formvalues.vaccineName,
      start_date: startDate,
      end_date: endDate,
      page: page,
      page_size: pageSize,
    })
  }

  const formatName = (given_name, family_name) => {
    if (given_name && family_name) {
      return `${given_name} ${family_name}`
    } else if (given_name) {
      return given_name
    } else if (family_name) {
      return family_name
    } else {
      return 'N/A'
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'family_name',
      key: 'family_name',
      render: (_text, record) =>
        formatName(record.given_name, record.family_name),
    },
    {
      title: 'ID Number',
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
      dataIndex: 'vaccine_name',
      key: 'vaccine_name',
    },
    {
      title: 'Dose',
      dataIndex: 'the_dose',
      key: 'the_dose',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (text) => moment(text).format('DD-MM-YYYY'),
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
              }, 500)}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Start/End Date" name="date">
            <DatePicker.RangePicker
              onChange={debounce(() => {
                handleChange()
              }, 500)}
              className="w-full"
              format="DD-MM-YYYY"
            />
          </Form.Item>

          <Form.Item label="Vaccine" name="vaccineName">
            <Select
              placeholder="Select Vaccine"
              onChange={debounce(() => {
                handleChange()
              }, 500)}
              allowClear
              options={formatVaccines()}
              showSearch
            />
          </Form.Item>
        </Form>

        <Table
          dataSource={defaulters?.data}
          columns={columns}
          loading={loading}
          rowKey="id"
          size="small"
          bordered
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
            total: defaulters?.total_records,
            onChange: (page, pageSize) => {
              handleChange(page, pageSize)
            },
          }}
        />
      </div>
    </div>
  )
}
