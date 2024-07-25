import { Card, Button, notification, Table } from 'antd'
import { createUseStyles } from 'react-jss'
import { Link, useNavigate } from 'react-router-dom'
import useStock from '../../hooks/useStock'
import { useEffect, useState } from 'react'
import moment from 'moment'
import usePaginatedQuery from '../../hooks/usePaginatedQuery'


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
  const { myFacilityRequests, updaTeRequestStatus } = useStock()
  const [results, setResults] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const { pageSize, handlePageChange } = usePaginatedQuery()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const facility = JSON.parse(localStorage.getItem('practitioner')).facility
        const sentOrders = await myFacilityRequests()
        const formattedOrders = sentOrders.map((order) => ({
          id: order.id,
          identifier: order.identifier[0].value,
          date: moment(order.date).format('DD-MM-YYYY'),
          facility: order.deliverTo.display,
          status: order.status,
          quantity: order.quantity?.value,
          products: order.itemCodeableConcept?.coding.length
        }))

        setResults(formattedOrders)
        setTotalItems(sentOrders.length)
      } catch (error) {
        console.log(error)
      }   
    }

    fetchStock()
  }, [])

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
      dataIndex: 'facility',
      key: 'facility',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          className={
            status === 'Pending'
              ? classes.statusPending
              : classes.statusReceived
          }
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <div className="flex items-center gap-10">
          <Link
            to={`/stock-management/order-details/${record.id}`}
            className="text-[#163C94] font-semibold"
          >
            View
          </Link>
          {record.status === 'Received' ? (
            <Button type="link" disabled className='text-[#163C94] font-semibold p-0'>
              Receive
            </Button>
          ) : (
            <Button
              // onClick={() => changeStatus(record.id)}
              onClick={() => navigate(`/stock-management/receive-stock/${record.id}`)}
              className="text-[#163C94] font-semibold border-none p-0"
            >
              Receive
            </Button>
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
        <div className="bg-[#163c9412] p-3 mx-4 my-5">
          <h3 className="text-[#707070] font-semibold text-base">Order Details</h3>
        </div>

        <div className='hidden sm:block sm:px-4 mb-10'>
          <Table 
            columns={columns}
            dataSource={results}
            size="small"
            bordered
            className={classes.tableHeader}
            pagination={{
              pageSize: 12,
              showSizeChanger: false,
              hideOnSinglePage: true,
              showTotal: (total) => `Total ${total} items`,
              total: totalItems - 1,
            }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm my-2">
                    No Sent Orders
                  </p>
                </div>
              ),
            }}
          />
        </div>

        <div className="sm:hidden mt-5">
          {results.map((result) => (
            <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
              <div className="py-5 pr-6 col-span-4">
                <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">ID: <span className='font-bold'>{result.identifier}</span></div>
                <div className="text-sm pl-5 leading-6 text-gray-900">{result.date}</div>
                <div className="mt-1 pl-5 text-sm leading-5 text-gray-800">{result.facility}</div>
                <div className={`text-sm pl-5 leading-6 font-semibold ${result.status === "Pending" ? "text-[#efd406]" : "text-[#186e03]"}`}>{result.status}</div>
                <div className="mt-1 pl-5 text-sm leading-5 text-gray-800">Quantity: <span className='font-bold'>{result.quantity}</span></div>
                <div className="text-sm pl-5 leading-6 text-gray-900">Products: <span className='font-bold'>{result.products}</span></div>
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
                    <Button type="link" disabled className='text-[#163C94] font-semibold p-0'>
                      Receive
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/stock-management/receive-stock/${result.id}`)}
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