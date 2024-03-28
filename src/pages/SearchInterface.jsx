import FormState from '../utils/formState'
import useGet from '../api/useGet'
import { useEffect, useState } from 'react'
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'
import SelectDialog from '../common/dialog/SelectDialog'
import Pagination from '../components/Pagination'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../components/DataTable'
import { Form, Input } from 'antd'

export default function SearchInterface(props) {
  const [title, setTitle] = useState('Search')
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState([])
  const [searchUrl, setSearchUrl] = useState('Patient?_sort=-_lastUpdated')
  const [paginationLinks, setPaginationLinks] = useState([])
  const [selectedItem, setSelectedItem] = useState({})

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, loading, error } = useGet(searchUrl)

  const navigate = useNavigate()

  useEffect(() => {
    if (Array.isArray(data?.entry)) {
      const mappedData = data?.entry.map((patient) =>
        deconstructPatientData(patient, props.searchType)
      )
      setPaginationLinks(data?.link)
      setResults(mappedData)
    }
  }, [data, title])

  const onUpdateUrl = (value) => {
    const URL = value.slice(
      'http://chanjoke.intellisoftkenya.com/hapi/fhir'.length
    )
    setSearchUrl(URL)
  }

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

  const { formData, formErrors, handleChange } = FormState({
    searchInput: '',
  })

  const handleSearch = () => {
    setSearchUrl(`Patient?name=${searchValue}&_sort=-_lastUpdated`)
  }

  const handleAction = (onActionBtn, data) => {
    if (onActionBtn.type === 'modal') {
      setIsDialogOpen(true)
      setSelectedItem(data)
    }
  }

  useEffect(() => {
    if (!searchValue) {
      handleSearch()
    }
  }, [searchValue])

  useEffect(() => {
    if (props.searchType === 'searchClient') {
      setTitle('Search')
    }
    if (props.searchType === 'updateClient') {
      setTitle('Update Client History')
    }
    if (props.searchType === 'administerVaccine') {
      setTitle('Administer Vaccine')
    }
    if (props.searchType === 'aefi') {
      setTitle('Adverse Event Following Immunisation')
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
          <Form
            className="grid grid-cols-5 gap-x-4 mx-10 mb-0"
            onFinish={handleSearch}
          >
            <div className="col-span-4">
              <Input
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
                allowClear
                size="large"
                placeholder="Enter Client Name/ID"
              />
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
              dataSource={!data?.entry && !loading ? [] : results}
              size="small"
              loading={loading}
              pagination={
                results?.length > 12
                  ? {
                      pageSize: 12,
                      showSizeChanger: false,
                      showQuickJumper: true,
                      showTotal: (total) => `Total ${total} items`,
                    }
                  : false
              }
              locale={{
                emptyText: (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-400 text-sm mt-2">Client not found!</p>
                        <button
                          onClick={() => navigate('/register-client/_')}
                          className="mt-8 flex-shrink-0 rounded-lg bg-[#163C94] border border-[#163C94] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
                          Register new client
                        </button>
                  </div>
                ),

              }}
            />

            <Pagination link={paginationLinks} updateURL={onUpdateUrl} />
          </div>
          {/*}*/}
        </div>
      </div>
    </>
  )
}
