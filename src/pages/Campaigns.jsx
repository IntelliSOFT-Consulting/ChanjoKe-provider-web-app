import { Button, Form, Input, Popconfirm, Tabs, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../components/DataTable'
import { useAccess } from '../hooks/useAccess'
import useCampaigns from '../hooks/useCampaigns'
import { useSelector } from 'react-redux'

export default function Campaigns() {
  const navigate = useNavigate()
  const { loading, campaigns, campaignTotal, fetchCampaigns, updateCampaign } =
    useCampaigns()

  const { canAccess } = useAccess()
  const { user } = useSelector((state) => state.userInfo)

  const [activeTab, setActiveTab] = useState('1')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredCampaigns, setFilteredCampaigns] = useState([])

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
      title: null,
      dataIndex: '',
      hidden: !canAccess('CREATE_CAMPAIGN') && activeTab === '2',
      key: 'x',
      render: (_, record) =>
        canAccess('CREATE_CAMPAIGN') ? (
          <>
            <Button
              type="link"
              onClick={() => {
                navigate(`/campaign/${record?.id}`)
              }}
            >
              View
            </Button>

            {activeTab === '1' && canAccess('CREATE_CAMPAIGN') && (
              <Popconfirm
                title="Are you sure you want to archive this campaign?"
                placement="top"
                onConfirm={() => {
                  updateCampaign(
                    record?.id,
                    {
                      id: record?.id,
                      campaignName: record?.resource?.title,
                      startDate: record?.resource?.period?.start,
                      endDate: record?.resource?.period?.end,
                      county:
                        record?.resource?.category?.[0]?.coding?.[0]?.display,
                      subCounty:
                        record?.resource?.category?.[0]?.coding?.[1]?.display,
                      ward: record?.resource?.category?.[0]?.coding?.[2]
                        ?.display,
                      facility:
                        record?.resource?.category?.[0]?.coding?.[3]?.display,
                    },
                    'on-hold'
                  )
                  filterItems()
                }}
                okText="Yes"
                cancelText="No"
              >
                <button className={`px-2 py-1 text-[#163C94] font-semibold`}>
                  Archive
                </button>
              </Popconfirm>
            )}

            {activeTab === '2' && canAccess('CREATE_CAMPAIGN') && (
              <Popconfirm
                title="Are you sure you want to make this campaign active?"
                onConfirm={() => {
                  updateCampaign(
                    record?.id,
                    {
                      id: record?.id,
                      campaignName: record?.resource?.title,
                      startDate: record?.resource?.period?.start,
                      endDate: record?.resource?.period?.end,
                      county:
                        record?.resource?.category?.[0]?.coding?.[0]?.display,
                      subCounty:
                        record?.resource?.category?.[0]?.coding?.[1]?.display,
                      ward: record?.resource?.category?.[0]?.coding?.[2]
                        ?.display,
                      facility:
                        record?.resource?.category?.[0]?.coding?.[3]?.display,
                    },
                    'active'
                  )
                  filterItems()
                }}
                okText="Yes"
                cancelText="No"
              >
                <button className={`px-2 py-1 text-[#163C94] font-semibold`}>
                  Unarchive
                </button>
              </Popconfirm>
            )}
          </>
        ) : (
          <Tooltip
            color="red"
            className="p-0"
            title={
              user?.location !== 'Campaign'
                ? 'Only Campaign users can select campaigns'
                : ''
            }
          >
            <Button
              type="link"
              onClick={() => {
                if (user?.location === 'Campaign') {
                  navigate(`/campaign-site/${record?.id}`)
                }
              }}
              disabled={user?.location !== 'Campaign'}
              className="text-[#163C94] font-semibold"
            >
              {activeTab === '1' ? 'Select' : ''}
            </Button>
          </Tooltip>
        ),
    },
  ]

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const searchCampaigns = (values) => {
    fetchCampaigns(values?.searchText)
  }

  const filterItems = () => {
    if (activeTab === '1') {
      const activeCampaigns = campaigns?.filter(
        (campaign) => campaign.status === 'active'
      )
      setFilteredCampaigns(activeCampaigns)
    } else {
      const archivedCampaigns = campaigns?.filter(
        (campaign) => campaign.status === 'on-hold'
      )
      setFilteredCampaigns(archivedCampaigns)
    }
  }

  useEffect(() => {
    filterItems()
  }, [campaigns, activeTab])

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
      <div className="flex justify-between px-4 text-2xl py-2 sm:px-14">
        <div className="text-3xl">Campaigns</div>
        <div className="right-0">
          {canAccess('CREATE_CAMPAIGN') && (
            <Button
              type="primary"
              onClick={() => navigate('/new-campaign/0')}
              className="ml-4 font-semibold px-10"
            >
              New Campaign
            </Button>
          )}
        </div>
      </div>
      <div className="sm:px-4 py-2 sm:py-5 sm:p-6">
        <div className="px-4 py-5 sm:p-6">
          <Tabs
            defaultActiveKey="1"
            onChange={(key) => {
              setActiveTab(key)
              setCurrentPage(1)
            }}
            items={['Active Campaigns', 'Archived Campaigns'].map(
              (item, index) => ({
                key: (index + 1).toString(),
                label: item,
                children: (
                  <div>
                    <div className="my-2 flex">
                      <Form
                        onFinish={(values) => {
                          searchCampaigns(values)
                        }}
                        className="flex w-full items-center"
                      >
                        <Form.Item name="searchText" className="w-full mr-4">
                          <Input
                            allowClear
                            placeholder="Search Campaign"
                            className="w-full ml-auto"
                            onChange={(e) => {
                              if (!e?.target?.value) {
                                fetchCampaigns()
                                filterItems()
                              }
                            }}
                            size="large"
                            autocomplete="off"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit" size="large">
                            Search
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                    <div className="overflow-x-auto">
                      <Table
                        columns={columns}
                        dataSource={filteredCampaigns}
                        size="small"
                        loading={loading}
                        rowKey="id"
                        pagination={{
                          pageSize: 12,
                          showTotal: (total, range) =>
                            `${range[0]} - ${range[1]} of ${
                              activeTab === '1' ? '10' : campaignTotal
                            } campaigns`,
                          showSizeChanger: false,
                          defaultCurrent: 1,
                          current: currentPage,
                          total: activeTab === '1' ? '10' : campaignTotal,
                          onChange: async (page) => {
                            setCurrentPage(page)
                          },
                        }}
                      />
                    </div>
                  </div>
                ),
              })
            )}
          />
        </div>
      </div>
    </div>
  )
}
