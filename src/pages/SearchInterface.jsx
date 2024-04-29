import useGet from '../api/useGet'
import { useEffect, useState } from 'react'
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'
import SelectDialog from '../common/dialog/SelectDialog'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../components/DataTable'
import { DatePicker, Form, Input, Button } from 'antd'
import usePaginatedQuery from '../hooks/usePaginatedQuery'
import { useApiRequest } from '../api/useApiRequest'
import { PlusOutlined } from '@ant-design/icons'

export default function SearchInterface(props) {
  const [title, setTitle] = useState('Search')
  const [results, setResults] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [searchUrl, setSearchUrl] = useState('Patient?_sort=-_lastUpdated')
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState({})

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { get } = useApiRequest()

  const { pageSize, handlePageChange } = usePaginatedQuery()

  const { error } = useGet(searchUrl)

  const navigate = useNavigate()

  const handleDialogClose = () => {
    setIsDialogOpen(false)
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
      render: (_, record) => (
        <Link
          to={`/client-details/${record.id}`}
          className="text-[#163C94] font-semibold"
        >
          View
        </Link>
      ),
    },
  ]

  const formatEntry = (entry) => {
    return entry.map((patient) =>
      deconstructPatientData(patient, props.searchType)
    )
  }

  const handleSearch = async (offset = 0, keyword = '') => {
    const params = `&_count=${pageSize}&_total=accurate&_offset=${offset}`
    const endpoint = '/hapi/fhir/Patient'

    setLoading(true)

    if (keyword && !isNaN(Number(keyword))) {
      if (keyword.startsWith('07')) {
        const data = await get(
          `${endpoint}?telecom=${keyword}&_sort=-_lastUpdated${params}`
        )

        if (data?.entry) {
          setResults(formatEntry(data.entry))
          setTotalItems(data.total)
        }
      } else {
        const data = await get(
          `${endpoint}?identifier=${keyword}&_sort=-_lastUpdated${params}`
        )

        if (data?.entry) {
          setResults(formatEntry(data.entry))
          setTotalItems(data.total)
        }
      }

      setLoading(false)
      return
    }
    const data = await get(
      `${endpoint}?name=${keyword}&_sort=-_lastUpdated${params}`
    )

    if (data?.entry) {
      setResults(formatEntry(data.entry))
      setTotalItems(data.total)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    if (props.searchType === 'searchClient') {
      setTitle('Search')
    }
    if (props.searchType === 'updateClient') {
      setTitle('Update Vaccine History')
    }
    if (props.searchType === 'administerVaccine') {
      setTitle('Administer Vaccine')
    }
    if (props.searchType === 'aefi') {
      setTitle('Adverse Event Following Immunisation')
    }
    if (props.searchType === 'appointments') {
      setTitle('Appointments')
    }
    if (props.searchType === 'referrals') {
      setTitle('Referrals')
    }
  }, [props.searchType])

  return (
    <>
      <SelectDialog
        open={isDialogOpen}
        title="Info"
        description="Select Record to update"
        btnOne={{
          text: 'Client Record',
          url: `/update-client-history/${selectedItem.id}`,
        }}
        btnTwo={{
          text: 'Vaccine Details',
          url: '/update-vaccine-history',
        }}
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">{title}</div>
        <div className="px-4 py-5 sm:p-6">
          {props.searchType === 'referrals' && (
            <Form layout="vertical" colon={true}>
              <div className="grid grid-cols-2 mx-10">
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
                  <div></div>
                </div>
                <div></div>
              </div>
            </Form>
          )}
          <Form
            className="grid grid-cols-5 gap-x-4 mx-10 mb-0"
            onFinish={(values) => {
              handleSearch(0, values.searchInput)
            }}
            autoComplete="off"
          >
            <div className="col-span-4">
              <Form.Item name="searchInput">
                <Input
                  allowClear
                  size="large"
                  placeholder="Enter Client Name/ID"
                  onChange={(e) => {
                    const { value } = e.target
                    if (!value) {
                      handleSearch()
                    }
                  }}
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

          {error && <div className="my-10 text-center">{error}</div>}

          <div className="px-10 my-6">
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
    </>
  )
}
