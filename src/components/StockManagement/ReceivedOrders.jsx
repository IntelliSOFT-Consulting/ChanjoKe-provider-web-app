import { Card, Button, Form, Select, Table } from 'antd'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'
import useStock from '../../hooks/useStock'
import { useEffect, useState } from 'react'

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
  }
})

export default function ReceivedOrders() {
  const classes = useStyles()

  const { mySupplyRequests } = useStock()
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const facility = JSON.parse(localStorage.getItem('practitioner')).facility
        const receivedOrders = await mySupplyRequests(facility)
        const formattedOrders = receivedOrders.map((order) => ({
          id: order.id,
          authoredOn: order.authoredOn,
          occurenceDateTime: order.occurenceDateTime,
          deliverTo: order.deliverTo.display,
          products: order.itemCodeableConcept.coding.display,
          status: order.status
        }))
        setResults(formattedOrders)
        setFilteredResults(formattedOrders)
      } catch(error) {
        console.log(error)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = (value) => {
    setFilter(value)
    if(value) {
      const filtered = results.filter((order) => order.status === value)
      setFilteredResults(filtered)
    } else {
      setFilteredResults(results)
    }

  }

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'id',
      key: 'id',
      className: {
        [classes.columnText]: true
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'authoredOn',
      key: 'authoredOn',
      className: {
        [classes.columnText]: true
      },
    },
    {
      title: 'Received Date',
      dataIndex: 'occurenceDateTime',
      key: 'occurenceDateTime',
      className: {
        [classes.columnText]: true
      },
    },
    {
      title: 'Location',
      dataIndex: 'deliverTo',
      key: 'deliverTo',
      className: {
        [classes.columnText]: true
      },
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      className: {
        [classes.columnText]: true
      },
    },
    {
      title: 'Action',
      render: (record) => <Link 
        to={`/stock-management/order-details/${record.id}`} 
        className="text-[#163C94] font-semibold">
          View
        </Link>,
    }
  ]

  return (
    <>
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
          <h3 className="text-[#707070] font-semibold text-base">Order Details</h3>
        </div>

        <Form layout="vertical" className="p-4 flex w-full justify-end">
          <Form.Item
            label='Filter by Status'
            name="filterByStatus"
            className="w-1/4"
          >
            <Select
              placeholder="All"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={handleStatusChange}
              options={[
                {
                  value: 'Pending',
                  label: 'Pending',
                },
                {
                  value: 'Received',
                  label: 'Received',
                },
              ]}
            />
          </Form.Item>
        </Form>

        <div className='hidden sm:block sm:px-4 mb-10 text-[#707070]'>
          <Table 
            columns={columns}
            dataSource={filteredResults}
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
                  <p className="text-gray-400 text-sm my-2">
                    No Received Orders
                  </p>
                </div>
              ),
            }}
          />
        </div>

        <div className='sm:hidden mt-5 px-4 mb-10'>
          {results.map((result) => (
            <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
              <div className='py-5 px-4 col-span-4'>
                <div className='text-xs'>Order Number: <span className="font-semibold text-gray-800">{result.id}</span></div>
                <div className='text-xs'>Order Date: <span className="font-semibold text-gray-800">{result.authoredOn}</span></div>
                <div className='text-xs'>Received Date: <span className="font-semibold text-gray-800">{result.occurenceDateTime}</span></div>
                <div className='text-xs'>Location: <span className="font-semibold text-gray-800">{result.deliverTo}</span></div>
                <div className='text-xs'>Products: <span className="font-semibold text-gray-800">{result.products}</span></div>
              </div>

              <div className="py-5 px-4">
                <Link 
                  to={`stock-management/order-details/${result.id}`}
                  className="text-[#163C94] font-semibold text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}