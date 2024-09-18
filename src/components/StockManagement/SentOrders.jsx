import { Card, Button, Form, Select, Popconfirm } from 'antd'
import { createUseStyles } from 'react-jss'
import { Link, useNavigate } from 'react-router-dom'
import useStock from '../../hooks/useStock'
import { useEffect, useState } from 'react'
import moment from 'moment'
import usePaginatedQuery from '../../hooks/usePaginatedQuery'
import { useSelector } from 'react-redux'
import Table from '../DataTable'
import { titleCase } from '../../utils/methods'
import ExcelJS from 'exceljs'
import { CloudDownloadOutlined } from '@ant-design/icons'

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
    fontWeight: '600',
  },
  tableHeader: {
    '& .ant-table-thead > tr > th': {
      backgroundColor: '#163C9412',
      color: '#707070',
    },
  },
  statusPending: {
    color: '#efd406',
    fontWeight: 'bold',
  },
  statusReceived: {
    color: '#186e03',
    fontWeight: 'bold',
  },
})

export default function SentOrders() {
  const classes = useStyles()
  const { updateRequestStatus, outgoingSupplyRequests, requests } = useStock()
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const { pageSize, handlePageChange } = usePaginatedQuery()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.userInfo)

  const fetchStock = async () => {
    try {
      const sentOrders = await outgoingSupplyRequests(user?.orgUnit?.code)
      const formattedOrders = sentOrders?.map(formatOrder) || []

      setResults(formattedOrders)
      setFilteredResults(formattedOrders)
      setTotalItems(formattedOrders.length)
    } catch (error) {
      console.error('Error fetching stock:', error)
    }
  }

  const formatOrder = (order) => {
    const vaccines = extractVaccines(order)
    const dispatched = order.meta?.tag?.find((tag) => tag.code === 'dispatched')

    return {
      id: order.id,
      identifier: order.identifier?.[0]?.value,
      date: moment(order.date).format('DD-MM-YYYY'),
      facility: order.deliverTo?.display,
      status:
        dispatched && order.status === 'active'
          ? 'Dispatched'
          : order.status === 'completed'
          ? 'Received'
          : order.status,
      vaccines: vaccines.join(', '),
      supplier: order.deliverFrom?.display,
    }
  }

  const extractVaccines = (order) => {
    const vaccineExtension = order.extension?.find((item) =>
      item.url.includes('supplyrequest-vaccine')
    )

    return (
      vaccineExtension?.extension
        ?.map(
          (item) =>
            item.extension?.find((ext) => ext.url === 'vaccine')
              ?.valueCodeableConcept?.text
        )
        .filter(Boolean) || []
    )
  }

  useEffect(() => {
    fetchStock()
  }, [])

  const handleExportToExcel = () => {
    /*
format the worksheet as a following:
    1. Make the header row bold
    2. Make the first column (ID) a link that can be used to navigate to the order details page
    3. The status column should be colored according to the status:
      - Pending: light grey
      - Dispatched: light blue
      - Received: light green
      - Cancelled: red
      - Delivered: green
   */

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Orders')

    // Add headers
    worksheet.columns = [
      { header: 'Order ID', key: 'identifier', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Supplied To', key: 'facility', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Antigens', key: 'vaccines', width: 20 },
      { header: 'Supplier', key: 'supplier', width: 20 },
    ]

    // Add data
    worksheet.addRows(results)

    // Make only the first row headers bold
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.font = { bold: true }
      }
    })

    // Add conditional formatting for the status column
    const statusColumn = worksheet.getColumn('status')
    statusColumn.eachCell((cell, rowNumber) => {
      if (rowNumber !== 1) {
        // Skip the header row
        const status = cell.text
        if (status === 'Pending') {
          cell.font = {
            color: { argb: 'FF707070' },
          }
        } else if (status === 'Dispatched') {
          cell.font = {
            color: { argb: 'FF163C94' },
          }
        } else if (status === 'Received') {
          cell.font = {
            color: { argb: 'FF186E03' },
          }
        } else if (status === 'cancelled') {
          cell.font = {
            color: { argb: 'FFFF0000' },
          }
        }
      }
    })

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        }
      })
    })

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'sent_orders.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error('Error exporting to Excel:', error)
      })
  }

  const handleStatusChange = (value) => {
    if (value) {
      const filtered = results.filter((order) => order.status === value)
      setFilteredResults(filtered)
      setTotalItems(filtered.length)
    } else {
      setFilteredResults(results)
      setTotalItems(results.length)
    }
  }

  const cancelOrder = async (id) => {
    await updateRequestStatus(id, 'cancelled')
    fetchStock()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Order Location',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        return (
          <span
            className={
              status === 'active'
                ? classes.statusPending
                : status === 'Dispatched'
                ? 'text-primary font-bold'
                : status === 'cancelled'
                ? 'text-red-500 font-bold'
                : classes.statusReceived
            }
          >
            {titleCase(status)}
          </span>
        )
      },
    },
    {
      title: 'Antigens',
      dataIndex: 'vaccines',
      key: 'vaccines',
    },
    {
      title: null,
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/stock-management/order-details/${record.id}`}
            className="text-[#163C94] font-semibold"
          >
            View
          </Link>
          {record.status === 'Dispatched' && (
            <Button
              type="link"
              className="text-green font-semibold p-0"
              onClick={() =>
                navigate(`/stock-management/receive-stock/${record.id}`, {
                  state: {
                    orderNumber: record.identifier,
                    origin: `${titleCase(record.supplier)}_${
                      record.identifier
                    }`,
                    selectedOriginId: record.id,
                    supplierId: record.supplier,
                  },
                })
              }
            >
              Receive
            </Button>
          )}
          {record.status === 'active' && (
            <Button
              type="link"
              className="p-0"
              onClick={() =>
                navigate(`/stock-management/edit-order/${record.id}`)
              }
            >
              Edit
            </Button>
          )}
          {record.status === 'active' && (
            <Popconfirm
              title="Are you sure you want to cancel this order?"
              onConfirm={() => cancelOrder(record.id)}
            >
              <Button type="link" danger className="p-0">
                Cancel
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <Card
        className="mt-5"
        title={
          <div className="text-xl font-semibold flex justify-between items-center">
            Sent Orders
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => navigate('/stock-management/new-order')}
              className={classes.btnPrimary}
            >
              Add New
            </Button>
          </div>
        }
      >
        <Form layout="vertical" className="p-4 flex w-full justify-between">
          <Form.Item name="filterByStatus" className="w-1/4">
            <Select
              placeholder="Filter by Status"
              className="w-full"
              allowClear
              onChange={handleStatusChange}
              options={[
                { label: 'Pending', value: 'active' },
                { label: 'Received', value: 'completed' },
              ]}
            />
          </Form.Item>
          <Button
            onClick={handleExportToExcel}
            icon={<CloudDownloadOutlined />}
            size="small"
            disabled={!filteredResults.length}
          >
            Export
          </Button>
        </Form>

        <div className="hidden sm:block sm:px-4 mb-10">
          <Table
            columns={columns}
            dataSource={filteredResults}
            size="small"
            bordered
            loading={!requests}
            className={classes.tableHeader}
            pagination={{
              pageSize: 12,
              showSizeChanger: false,
              hideOnSinglePage: true,
              showTotal: (total) => `Total ${total} items`,
              total: totalItems - 1,
            }}
          />
        </div>
      </Card>
    </>
  )
}
