import { Card, Button, Table, Form, Select } from 'antd'
import { createUseStyles } from 'react-jss'
import { Link, useNavigate } from 'react-router-dom'
import useStock from '../../hooks/useStock'
import { useEffect, useState } from 'react'
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
  }
})

export default function Ledger() {
  const classes = useStyles()
  const [totalItems, setTotalItems] = useState(0)
  const [results, setResults] = useState([])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product',
      dataIndex: 'vaccine',
      key: 'vaccine',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Batches',
      dataIndex: 'batches',
      key: 'batches',
    },
    {
      title: 'Current Balance',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
    },
    {
      title: 'Last Transaction Date',
      dataIndex: 'lastTransactionDate',
      key: 'lastTransactionDate',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <div className="flex items-center gap-10">
          <Link
            className="text-[#163C94] font-semibold"
          >
            Ledger
          </Link>
          
          <Button
            className="text-[#163C94] font-semibold border-none p-0"
          >
            Batch Summary
          </Button>
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
            Ledger
          </div>
        }
      >
        <div className="bg-[#163c9412] p-3 mx-4 my-5">
          <h3 className="text-[#707070] font-semibold text-base">Product Summary</h3>
        </div>

        <Form layout="vertical" className="p-4 flex w-full justify-end">
          <Form.Item
            label='Filter'
            name="filterByStatus"
            className="w-1/4"
          >
            <Select 
              placeholder='Select Status'
              className='w-full'
              allowClear
              // onChange={handleStatusChange}
              options={[
                { label: 'Option 1', value: 'Option 1' },
                { label: 'Option 2', value: 'Option 2' },
              ]}
            />
          </Form.Item>
        </Form>

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
                <div className="pl-5 text-xs text-gray-800">ID: <span className='font-bold'>{result.id}</span></div>
                <div className="text-sm pl-5 text-gray-900">{result.vaccine}</div>
                <div className="pl-5 text-sm text-gray-800">Type: <span className='font-semibold'>{result.type}</span></div>
                <div className="text-sm pl-5">Batches: <span className='font-semibold'>{result.batches}</span></div>
                <div className="pl-5 text-sm text-gray-800">Current Balance: <span className='font-semibold'>{result.currentBalance}</span></div>
                <div className="text-sm pl-5 text-gray-900">Last Transaction Date: <span className='font-semibold'>{result.lastTransactionDate}</span></div>
              </div>
              <div className="py-5 max-w-auto right-5">
                <div className="flex flex-col items-start">
                  <a
                    className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Ledger
                  </a>
                  <Button
                    className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 border-none p-0"
                  >
                    Batch Summary
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}