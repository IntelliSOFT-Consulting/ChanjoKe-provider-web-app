import { Button, Card, DatePicker, Form } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReports } from '../hooks/useReports'
import Table from '../components/DataTable'
import dayjs from 'dayjs'

export default function MOH525() {
  const [dates, setDates] = useState([])
  const [form] = Form.useForm()

  const { moh525, getMoh525 } = useReports()

  const { user } = useSelector((state) => state.userInfo)

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
    getMoh525({
      facility_code: user.facility?.split('/')[1],
      start_date: moment(dates[0], 'DD-MM-YYYY').format('YYYY-MM-DD'),
      end_date: moment(dates[dates.length - 1], 'DD-MM-YYYY').format(
        'YYYY-MM-DD'
      ),
    })
  }

  useEffect(() => {
    handleDates()
    getMoh525({
      facility_code: user.facility?.split('/')[1],
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    })
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
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
    },
    {
      title: 'Serial No (MOH510)',
      dataIndex: 'Serial No (MOH510)',
      key: 'Serial No (MOH510)',
    },
    {
      title: "Child's No",
      dataIndex: "Child's No",
      key: "Child's No",
    },
    {
      title: 'Name of the Child',
      dataIndex: 'Name of the Child',
      key: 'Name of the Child',
      render: (text) => (
        <span className="capitalize">{text?.replace('None ', '')}</span>
      ),
    },
    {
      title: 'Sex (F/M)',
      dataIndex: 'Sex (F/M)',
      key: 'Sex (F/M)',
    },
    {
      title: 'Age in Months of the Child',
      dataIndex: 'Age in Months of the Child',
      key: 'Age in Months of the Child',
    },
    {
      title: 'Name of Parent/Caregiver',
      dataIndex: 'Name of Parent/Caregiver',
      key: 'Name of Parent/Caregiver',
    },
    {
      title: 'Telephone No.',
      dataIndex: 'Telephone No.',
      key: 'Telephone No.',
    },
    {
      title: 'Name of Village/Estate/Landmark',
      dataIndex: 'Name of Village/Estate/Landmark',
      key: 'Name of Village/Estate/Landmark',
    },
    {
      title: 'Vaccines Missed',
      dataIndex: 'Vaccines Missed',
      key: 'Vaccines Missed',
    },
    {
      title: 'Traced (YES/NO)',
      dataIndex: 'Traced (YES/NO)',
      key: 'Traced (YES/NO)',
    },
    {
      title: 'Outcome',
      dataIndex: 'Outcome',
      key: 'Outcome',
    },
    {
      title: 'Remarks',
      dataIndex: 'Remarks',
      key: 'Remarks',
    },
  ]

  return (
    <Card title="MOH 525" className="mt-5">
      <div className="px-4 font-semibold py-5 sm:px-6">
        <Form
          layout="vertical"
          form={form}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-end"
          onFinish={handleFilter}
          initialValues={{
            date: [dayjs().startOf('month'), dayjs()],
          }}
        >
          <Form.Item label="Date" name="date" className="m-0">
            <DatePicker.RangePicker
              className="w-full"
              format="DD-MM-YYYY"
              disabledDate={(current) =>
                current && current > moment().endOf('day')
              }
            />
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
            dataSource={moh525}
            loading={!moh525}
            pagination={{
              pageSize: 12,
              hideOnSinglePage: true,
            }}
          />
        </div>
      </div>
    </Card>
  )
}
