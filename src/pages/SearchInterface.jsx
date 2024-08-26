import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiRequest } from '../api/useApiRequest'
import Table from '../components/DataTable'
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'
import usePaginatedQuery from '../hooks/usePaginatedQuery'

export default function SearchInterface(props) {
  const [title, setTitle] = useState('Search')
  const [results, setResults] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  const { get } = useApiRequest()

  const { pageSize, handlePageChange } = usePaginatedQuery()

  const navigate = useNavigate()

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
        let link = `/client-details/${record.id}/${
          props.searchType === 'appointments'
            ? 'appointments'
            : 'routineVaccines'
        }`

        if (props.searchType === 'updateClient') {
          link = `/update-vaccine-history/${record.id}`
        }
        return (
          <Link to={link} className="text-[#163C94] font-semibold">
            View
          </Link>
        )
      },
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
        } else {
          setResults([])
          setTotalItems(0)
        }
      } else {
        const data = await get(
          `${endpoint}?identifier=${keyword}&_sort=-_lastUpdated${params}`
        )

        if (data?.entry) {
          setResults(formatEntry(data.entry))
          setTotalItems(data.total)
        } else {
          setResults([])
          setTotalItems(0)
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
    } else {
      setResults([])
      setTotalItems(0)
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
      setTitle('Community Referrals')
    }
  }, [props.searchType])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
        <div className="px-2 text-2xl font-semibold py-3 sm:px-6 sm:py-5">
          {title}
        </div>
        <div className="sm:px-4 py-2 sm:py-5 sm:p-6">
          {props.searchType === 'referrals' && (
            <Form layout="vertical" colon={true}>
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
                  <div></div>
                </div>
                <div></div>
              </div>
            </Form>
          )}
          <Form
            className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 mx-2 sm:mx-10 mb-0"
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

          <div className="sm:hidden mt-5">
            {results.map((result) => (
              <div
                key={result.id}
                className="w-full grid grid-cols-5 gap-3 border border-1 border-gray-200"
              >
                <div className="py-5 pr-6 col-span-4">
                  <div className="text-sm pl-5 leading-6 text-gray-900">
                    {result.clientName}
                  </div>
                  <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">
                    ID: <span className="font-bold">{result.idNumber}</span>
                  </div>
                  <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">
                    {result.phoneNumber}
                  </div>
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
    </>
  )
}
