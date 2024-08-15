import { Card, Button, Form, Select } from 'antd'
import { createUseStyles } from 'react-jss'
import { Link, useNavigate } from 'react-router-dom'
import useStock from '../../hooks/useStock'
import { useEffect, useState } from 'react'
import moment from 'moment'
import usePaginatedQuery from '../../hooks/usePaginatedQuery'
import { useSelector } from 'react-redux'
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
  const {
    myFacilityRequests,
    updateRequestStatus,
    outgoingSupplyRequests,
    requests,
  } = useStock()
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const { pageSize, handlePageChange } = usePaginatedQuery()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.userInfo)

  const fetchStock = async () => {
    try {
      const sentOrders = await outgoingSupplyRequests(user?.facility)
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

    return {
      id: order.id,
      identifier: order.identifier?.[0]?.value,
      date: moment(order.date).format('DD-MM-YYYY'),
      facility: order.deliverTo?.display,
      status: order.status,
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'identifier',
      key: 'id',
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
      render: (status) => (
        <span
          className={
            status === 'active' ? classes.statusPending : classes.statusReceived
          }
        >
          {status === 'active' ? 'Pending' : 'Received'}
        </span>
      ),
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
        <div className="flex items-center gap-10">
          <Link
            to={`/stock-management/order-details/${record.id}`}
            className="text-[#163C94] font-semibold"
          >
            View
          </Link>
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
        <Form layout="vertical" className="p-4 flex w-full justify-end">
          <Form.Item
            label="Filter by Status"
            name="filterByStatus"
            className="w-1/4"
          >
            <Select
              placeholder="Select Status"
              className="w-full"
              allowClear
              onChange={handleStatusChange}
              options={[
                { label: 'Pending', value: 'active' },
                { label: 'Received', value: 'completed' },
              ]}
            />
          </Form.Item>
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

        <div className="sm:hidden mt-5">
          {results?.map((result) => (
            <div
              key={result.id}
              className="w-full grid grid-cols-5 gap-3 border border-1 border-gray-200"
            >
              <div className="py-5 pr-6 col-span-4">
                <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">
                  ID: <span className="font-bold">{result.identifier}</span>
                </div>
                <div className="text-sm pl-5 leading-6 text-gray-900">
                  {result.date}
                </div>
                <div className="mt-1 pl-5 text-sm leading-5 text-gray-800">
                  {result.facility}
                </div>
                <div
                  className={`text-sm pl-5 leading-6 font-semibold ${
                    result.status === 'Pending'
                      ? 'text-[#efd406]'
                      : 'text-[#186e03]'
                  }`}
                >
                  {result.status}
                </div>
                <div className="mt-1 pl-5 text-sm leading-5 text-gray-800">
                  Quantity: <span className="font-bold">{result.quantity}</span>
                </div>
                <div className="text-sm pl-5 leading-6 text-gray-900">
                  Products: <span className="font-bold">{result.products}</span>
                </div>
              </div>
              <div className="py-5 max-w-auto right-5">
                <div className="flex flex-col items-start">
                  <a
                    href={`/stock-management/order-details/${result.id}`}
                    className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    View
                  </a>
                  {result.status === 'Received' ? (
                    <Button
                      type="link"
                      disabled
                      className="text-[#163C94] font-semibold p-0"
                    >
                      Receive
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        navigate(
                          `/stock-management/receive-stock/${result.id}`,
                          {
                            state: {
                              orderNumber: result.identifier,
                              origin: result.facility,
                              selectedOriginId: result.id,
                              supplierId: result.supplier,
                            },
                          }
                        )
                      }
                      className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 border-none p-0"
                    >
                      Receive
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
