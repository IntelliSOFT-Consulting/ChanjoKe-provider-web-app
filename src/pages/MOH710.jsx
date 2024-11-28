import { Button, Card, DatePicker, Form, Table, Select } from 'antd'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useReports } from '../hooks/useReports'
import dayjs from 'dayjs'
import { useLocations } from '../hooks/useLocation'
import { getLocations } from '../utils/methods'
import { locationToOptions } from '../utils/formatter'
import Exceljs from 'exceljs'
import { DownloadOutlined } from '@ant-design/icons'

export default function MOH710() {
  const [dates, setDates] = useState([])
  const [form] = Form.useForm()

  const { moh710, getMoh710 } = useReports()
  const {
    handleCountyChange,
    handleWardChange,
    handleSubCountyChange,
    fetchWards,
    wards,
    subCounties,
    counties,
    facilities,
  } = useLocations()
  const { user } = useSelector((state) => state.userInfo)

  const defaultLocationOptions = async () => {
    if (user?.orgUnit?.level === 'county') {
      return await handleCountyChange(user?.orgUnit?.code)
    }
    if (user?.orgUnit?.level === 'subCounty') {
      const wards = await fetchWards(user?.orgUnit?.code)
      const wardIds = wards?.map((ward) => ward?.key)?.join(',')
      const facilities = await handleWardChange(wardIds)
      return facilities
    }
    return []
  }

  const priority = ['facility', 'subcounty', 'ward', 'county']

  const getLocation = (formValues) => {
    const values = { ...formValues }
    const location = priority.find((key) => values?.[key])
    return {
      [location]: values?.[location],
    }
  }

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

    const location = getLocation(values) || {}

    const userLocation =
      Object.values(values)?.length > 2 ? location : getLocations(user)

    setDates(dates)
    getMoh710({
      ...userLocation,
      start_date: moment(dates[0], 'DD-MM-YYYY').format('YYYY-MM-DD'),
      end_date: moment(dates[dates.length - 1], 'DD-MM-YYYY').format(
        'YYYY-MM-DD'
      ),
    })
  }

  useEffect(() => {
    handleDates()
    defaultLocationOptions()
    const userLocation = getLocations(user)
    getMoh710({
      ...userLocation,
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    })
  }, [])

  const handleFilter = (values) => {
    const { date } = values
    if (date?.length) {
      const start = date[0]?.format('YYYY-MM-DD')
      const end = date[1]?.format('YYYY-MM-DD')
      const hierarchy = ['facility', 'ward', 'subcounty', 'county']
      let location = {}
      for (const key of hierarchy) {
        if (values?.[key]) {
          if (key === 'facility') {
            location[key] = values[key]
            break
          } else if (key === 'ward') {
            const locationName = wards?.find(
              (ward) => ward?.key === values[key]
            )?.name
            location[key] = locationName
            break
          } else if (key === 'subcounty') {
            const locationName = subCounties?.find(
              (subcounty) => subcounty?.key === values[key]
            )?.name
            location[key] = locationName
            break
          } else if (key === 'county') {
            const locationName = counties?.find(
              (county) => county?.key === values[key]
            )?.name
            location[key] = locationName
            break
          }
        }
      }
      handleDates({ ...location, start, end, location })
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

  const exportToExcel = async () => {
    const workbook = new Exceljs.Workbook()
    const sheet = workbook.addWorksheet('MOH 710')
    const data = moh710.map((item) => {
      const row = {
        Antigen: item.antigen,
        Age: item.ageGroup,
        ...item,
      }
      delete row.antigen
      delete row.ageGroup
      return row
    })
    const columns = [
      {
        header: 'Antigen',
        key: 'Antigen',
        width: 20,
      },
      {
        header: 'Age',
        key: 'Age',
        width: 20,
      },
      ...dates.map((date) => {
        const key = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        return {
          header: date,
          key,
          width: 10,
        }
      }),
      {
        header: 'Total Static',
        key: 'facility_count',
        width: 20,
      },
      {
        header: 'Total Outreach',
        key: 'outreach_count',
        width: 20,
      },
      {
        header: 'Grand Total',
        key: 'total',
        width: 20,
      },
    ]

    sheet.columns = columns
    sheet.addRows(
      data?.map((item) => ({
        ...item,
        ...dates.reduce((acc, date) => {
          const key = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
          acc[key] = item?.[key]?.total || 0
          return acc
        }, {}),
      }))
    )

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })
    sheet.getRow(1).freeze = true

    for (let i = 2; i <= data.length + 1; i += 2) {
      sheet.mergeCells(`A${i}:A${i + 1}`)
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MOH-710-${
      user?.orgUnit?.name || user?.subCounty || user?.facility || 'All'
    }-${dayjs().format('DD-MM-YYYY')}.xlsx`
    a.click()
  }

  return (
    <Card
      title="MOH 710"
      className="mt-5"
      extra={
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          disabled={!moh710}
        >
          Export to Excel
        </Button>
      }
    >
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
          {!user?.orgUnit?.level && (
            <Form.Item label="County" name="county" className="m-0">
              <Select
                options={locationToOptions(counties)}
                onChange={handleCountyChange}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent="No counties found"
                placeholder="Select County"
              />
            </Form.Item>
          )}
          {!user?.subCounty && (
            <Form.Item label="Sub County" name="subcounty" className="m-0">
              <Select
                options={locationToOptions(subCounties)}
                onChange={handleSubCountyChange}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent="No sub counties found"
                placeholder="Select Sub County"
              />
            </Form.Item>
          )}
          {!user?.subCounty && (
            <Form.Item label="Ward" name="ward" className="m-0">
              <Select
                options={locationToOptions(wards)}
                onChange={handleWardChange}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent="No wards found"
                placeholder="Select Ward"
              />
            </Form.Item>
          )}
          {!user?.facility && (
            <Form.Item label="Facility" name="facility" className="m-0">
              <Select
                options={locationToOptions(facilities)}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent="No facilities found"
                placeholder="Select Facility"
              />
            </Form.Item>
          )}
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
