import { Button, Card, DatePicker, Form, Table } from 'antd'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useReports } from '../hooks/useReports'
import dayjs from 'dayjs'

export default function MOH710() {
  const [dates, setDates] = useState([])
  const [form] = Form.useForm()

  const { moh710, getMoh710 } = useReports()

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
    getMoh710({
      facility_code: user.facility?.split('/')[1],
      start_date: moment(dates[0], 'DD-MM-YYYY').format('YYYY-MM-DD'),
      end_date: moment(dates[dates.length - 1], 'DD-MM-YYYY').format(
        'YYYY-MM-DD'
      ),
    })
  }

  useEffect(() => {
    handleDates()
    getMoh710({
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
      children: dates.map((date) => {
        const key = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        return {
          title: date,
          dataIndex: key,
          key,
          render: (_, record) => {
            return record?.[key]?.total || 0
          },
        }
      }),
    },
    {
      title: 'Total Static',
      dataIndex: 'facility_count',
      key: 'facility_count',
      fixed: 'right',
    },
    {
      title: 'Total Outreach',
      dataIndex: 'outreach_count',
      key: 'outreach_count',
      fixed: 'right',
    },
    {
      title: 'Grand Total',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
    },
  ]

  return (
    <Card title="MOH 710" className="mt-5">
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
            loading={!moh710}
            size="small"
            scroll={{ x: 'max-content' }}
            centered
            bordered
            dataSource={moh710}
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
