import { Button, Card, DatePicker, Form } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useStock from '../../hooks/useStock'
import { toTitleCase } from '../../utils/formatter'
import Table from '../DataTable'

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
      border: '1px solid #d9d9d9',
    },
  },
  columnText: {
    color: '#707070',
  },
})

export default function ReceivedOrders() {
  const classes = useStyles()

  const { incomingSupplyRequests, requests, loading } = useStock()
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [filter, setFilter] = useState('')

  const { user } = useSelector((state) => state.userInfo)

  useEffect(() => {
    if (requests?.data?.length) {
      const formattedOrders = requests.data.map((order) => ({
        id: order.id,
        key: order.id,
        orderNumber: order?.identifier[0]?.value,
        authoredOn: moment(order.extension[5]?.valueDateTime).format(
          'DD-MM-YYYY'
        ),
        occurenceDateTime: moment(order.occurrenceDateTime).format(
          'DD-MM-YYYY'
        ),
        deliverTo: toTitleCase(order.deliverTo?.display),
        products:
          order?.extension?.find((item) =>
            item.url.includes('supplyrequest-vaccine')
          )?.extension?.length || 0,
        status: order.status,
      }))
      setResults(formattedOrders)
      setFilteredResults(formattedOrders)
    }
  }, [requests])

  useEffect(() => {
    incomingSupplyRequests(user.orgUnit?.code)
  }, [])

  const handleDateChange = (date, dateString) => {
    setFilter(dateString)
    if (dateString) {
      const filtered = results.filter(
        (order) => order.occurenceDateTime === dateString
      )
      setFilteredResults(filtered)
    } else {
      setFilteredResults(results)
    }
  }

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      className: {
        [classes.columnText]: true,
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'authoredOn',
      key: 'authoredOn',
      className: {
        [classes.columnText]: true,
      },
    },
    {
      title: 'Issued to',
      dataIndex: 'deliverTo',
      key: 'deliverTo',
      className: {
        [classes.columnText]: true,
      },
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      className: {
        [classes.columnText]: true,
      },
    },
    {
      title: null,
      render: (record) => (
        <div className="flex justify-between items-center">
          <Link
            to={`/stock-management/order-details/${record.id}`}
            className="text-[#163C94] font-semibold"
          >
            View
          </Link>
          {record.status === 'active' && (
            <Link
              to={`/stock-management/issue-stock`}
              state={{ order: record }}
              className="text-green font-semibold hover:!text-green"
            >
              Issue Stock
            </Link>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card
      className="mt-5"
      title={
        <div className="text-xl font-semibold flex justify-between items-center">
          Received Orders
          <Button
            type="primary"
            htmlType="submit"
            className={classes.btnPrimary}
          >
            Add New
          </Button>
        </div>
      }
    >
      <div className="bg-[#163c9412] p-3 mx-4 my-5">
        <h3 className="text-[#707070] font-semibold text-base">
          Order Details
        </h3>
      </div>

      <Form layout="vertical" className="p-4 flex w-full justify-end">
        <Form.Item label="Filter by Date" name="filterByDate" className="w-1/4">
          <DatePicker
            placeholder="Filter by Date"
            className="w-full"
            onChange={handleDateChange}
            format="DD-MM-YYYY"
          />
        </Form.Item>
      </Form>

      <div className="hidden sm:block sm:px-4 mb-10 text-[#707070]">
        <Table
          columns={columns}
          dataSource={filteredResults}
          loading={loading}
          size="small"
          bordered
          className={classes.tableHeader}
          pagination={{
            pageSize: 12,
            showSizeChanger: false,
            hideOnSinglePage: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-400 text-sm my-2">No Received Orders</p>
              </div>
            ),
          }}
        />
      </div>
    </Card>
  )
}
