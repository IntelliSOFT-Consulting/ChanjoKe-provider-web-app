import { Form, Input, Button } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../components/DataTable'
import { PlusOutlined } from '@ant-design/icons'

const columns = [
  {
    title: 'Campaign Name',
    dataIndex: 'campaignName',
    key: 'campaignName',
  },
  {
    title: 'Date Created',
    dataIndex: 'dateCreated',
    key: 'dateCreated',
  },
  {
    title: 'Campaign Duration',
    dataIndex: 'campaignDuration',
    key: 'campaignDuration',
  },
  {
    title: 'Actions',
    dataIndex: '',
    key: 'x',
    render: (_, record) => (
      <Link
        to={`/campaign/${record?.id}`}
        className="text-[#163C94] font-semibold"
      >
        Select
      </Link>
    ),
  },
]

export default function Campaigns() {

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([
    { campaignName: 'Polio', dateCreated: '12 Jun 2024', campaignDuration: '12 Jun 2024 - 13 Aug 2024', id: 'geeg' },
    { campaignName: 'Malaria', dateCreated: '21 Mar 2024', campaignDuration: '21 Mar 2024 - 22 Sep 2024', id: 'heeh' },
    { campaignName: 'Covid', dateCreated: '01 May 2024', campaignDuration: '01 May 2024 - 12 Dec 2024', id: 'ieei' },
  ])
  
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
        <div className="px-2 text-2xl font-semibold py-3 sm:px-6 sm:py-5">Campaigns</div>
        <div className="sm:px-4 py-2 sm:py-5 sm:p-6">
          <Form
            className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 mx-2 sm:mx-10 mb-0"
            onFinish={(values) => console.log({ values })}
            autoComplete="off"
          >
            <div className="col-span-4">
              <Form.Item name="searchCampaigns">
                <Input
                  allowClear
                  size="large"
                  placeholder="Search Campaigns"
                  onChange={(e) => console.log({ e })}
                />
              </Form.Item>
            </div>
            <div>
              <button
                type="submit"
                className="flex-shrink-0 rounded-lg w-full bg-[#163C94] border border-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
              >
                Search
              </button>
            </div>
          </Form>

          <div className="hidden sm:block sm:px-10 my-6">
            <Table
              columns={columns}
              dataSource={results}
              size="small"
              loading={loading}
              pagination={{
                pageSize: 12,
                showSizeChanger: false,
                hideOnSinglePage: true,
                showTotal: (total) => `Total ${total} items`,
                // total: totalItems - 1,
                onChange: (page) => console.log({ page }),
              }}
              locale={{
                emptyText: (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-400 text-sm my-2">
                      Campaign not found
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
                  <div className="text-sm pl-5 leading-6 text-gray-900">{result.campaignName}</div>
                  <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">Duration: <span className='font-bold'>{result.campaignDuration}</span></div>
                  <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.dateCreated}</div>
                </div>
                <div className="py-5 max-w-auto right-5">
                  <div className="flex">
                    <a
                      href={`/client-details/${result.id}/routineVaccines`}
                      className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          </div>
      </div>
  )
}