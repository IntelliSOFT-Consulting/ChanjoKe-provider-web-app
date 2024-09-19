import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, DatePicker, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiRequest } from '../api/useApiRequest'
import Table from '../components/DataTable'
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'
import usePaginatedQuery from '../hooks/usePaginatedQuery'
import { useSelector } from 'react-redux'

export default function SearchInterface({ searchType }) {
  const [title, setTitle] = useState('Search')
  const [results, setResults] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  const { get } = useApiRequest()
  const { pageSize, handlePageChange } = usePaginatedQuery()
  const { user } = useSelector((state) => state.userInfo)
  const campaign = JSON.parse(localStorage.getItem('campaign') || 'null')
  const navigate = useNavigate()

  useEffect(() => {
    updateTitle(searchType)
  }, [searchType])

  useEffect(() => {
    handleSearch()
  }, [])

  const updateTitle = (type) => {
    const titles = {
      searchClient: 'Search',
      updateClient: 'Update Vaccine History',
      administerVaccine: 'Administer Vaccine',
      aefi: 'Adverse Event Following Immunisation',
      appointments: 'Appointments',
      referrals: 'Community Referrals',
    }
    setTitle(titles[type] || 'Search')
  }

  const formatEntry = (entry) =>
    entry.map((patient) => deconstructPatientData(patient, searchType))

  const handleSearch = async (offset = 0, keyword = '') => {
    const params = `&_count=${pageSize}&_total=accurate&_offset=${offset}`
    const endpoint = '/chanjo-hapi/fhir/Patient'

    setLoading(true)

    let data = await get(
      `${endpoint}?telecom=${encodeURIComponent(
        keyword
      )}&_sort=-_lastUpdated${params}`
    )

    if (!data?.entry) {
      data = await get(
        `${endpoint}?name=${keyword}&_sort=-_lastUpdated${params}`
      )
    }

    if (!data?.entry) {
      data = await get(
        `${endpoint}?identifier=${keyword}&_sort=-_lastUpdated${params}`
      )
    }

    setResults(data?.entry ? formatEntry(data.entry) : [])
    setTotalItems(data?.total || 0)
    setLoading(false)
  }

  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'ID Number',
      dataIndex: 'idNumber',
      key: 'idNumber',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (_, record) => {
        const baseLink =
          user?.location === 'Campaign' && campaign?.campaignID
            ? `/administer/campaigns/${record.id}`
            : searchType === 'updateClient'
            ? `/update-vaccine-history/${record.id}`
            : `/client-details/${record.id}/${
                searchType === 'appointments'
                  ? 'appointments'
                  : 'routineVaccines'
              }`

        return (
          <Link
            to={baseLink}
            state={{
              campaignID: campaign?.campaignID,
              site: campaign?.campaignSite,
            }}
            className="text-[#163C94] font-semibold"
          >
            View
          </Link>
        )
      },
    },
  ]

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
      {campaign ? (
        <Alert
          message={
            <div className="flex items-end">
              <h4 className="font-semibold mr-2">Campaign:</h4>
              <p>{campaign?.title}</p>
            </div>
          }
          showIcon
          banner
        />
      ) : (
        <div className="px-2 text-2xl font-semibold py-3 sm:px-6 sm:py-5">
          {title}
        </div>
      )}
      <div className="sm:px-4 py-2 sm:py-5 sm:p-6">
        {searchType === 'referrals' && (
          <Form layout="vertical" colon>
            <div className="grid grid-cols-2 mb:mx-10">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item label="Start Date">
                    <DatePicker
                      format="DD-MM-YYYY"
                      className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
                  </Form.Item>

                  <Form.Item label="End Date">
                    <DatePicker
                      format="DD-MM-YYYY"
                      className="block w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        )}

        <Form
          className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 mx-2 sm:mx-10 mb-0"
          onFinish={({ searchInput }) => handleSearch(0, searchInput)}
          autoComplete="off"
        >
          <div className="col-span-4">
            <Form.Item name="searchInput">
              <Input
                allowClear
                size="large"
                placeholder="Enter Client Name/ID"
                onChange={(e) => !e.target.value && handleSearch()}
              />
            </Form.Item>
          </div>
          <div>
            <button
              type="submit"
              className="flex-shrink-0 rounded-lg w-full bg-[#163C94] border border-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
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
              total: totalItems - 1,
              onChange: (page) => handlePageChange(page, handleSearch),
            }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm my-2">
                    Client not found!
                  </p>
                  <Button
                    type="primary"
                    onClick={() => navigate('/register-client')}
                    icon={<PlusOutlined />}
                  >
                    Register new client
                  </Button>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}
