import { Form, Input, Button, Popconfirm } from 'antd'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../components/DataTable'
import useCampaigns from '../hooks/useCampaigns'

const practitioner = JSON.parse(localStorage.getItem('practitioner'))
const practitionerRole = practitioner?.practitionerRole

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
      practitionerRole === 'ADMINISTRATOR' ?
      <>
        <Link
          to={`/campaign/${record?.id}`}
          className="text-[#163C94] font-semibold mr-4"
        >
          View
        </Link>
        <Popconfirm
          title="Are you sure you want to archive this campaign?"
          onConfirm={() => console.log('archived')}
          okText="Yes"
          cancelText="No">
          <button className={`px-2 py-1 text-[#163C94] font-semibold`}>
            Archive
          </button>
        </Popconfirm>
      </>:
      <Link
        to={`/campaign-site/${record?.id}`}
        className="text-[#163C94] font-semibold"
      >
        Select
      </Link>
    ),
  },
]

export default function Campaigns() {

  const navigate = useNavigate()
  const { loading, campaigns, fetchCampaigns } = useCampaigns()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const searchCampaigns = (values) => {
    fetchCampaigns(values?.searchText)
  }
  
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
        <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
          <div className="text-3xl">Campaigns</div>
          <div className="right-0">
            <Button
              type="primary"
              onClick={() => navigate('/new-campaign')}
              className="ml-4 font-semibold px-10"
            >
              New
            </Button>
          </div>
        </div>
        <div className="sm:px-4 py-2 sm:py-5 sm:p-6">
          <Form
            className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 mx-2 sm:mx-10 mb-0"
            onFinish={(values) => searchCampaigns(values)}
            autoComplete="off"
          >
            <div className="col-span-4">
              <Form.Item name="searchText">
                <Input
                  allowClear
                  onChange={(e) => {
                    if (!e?.target?.value) {
                      fetchCampaigns()
                    }
                  }}
                  size="large"
                  placeholder="Search Campaigns"
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
              dataSource={campaigns}
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
            {campaigns.map((result) => (
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