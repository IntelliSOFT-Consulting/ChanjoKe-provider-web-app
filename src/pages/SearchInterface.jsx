import SearchTable from "../common/tables/SearchTable"
import TextInput from "../common/forms/TextInput"
import FormState from "../utils/formState"
import useGet from "../api/useGet"
import { useEffect, useState } from "react"
import LoadingArrows from "../common/spinners/LoadingArrows"
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'
import SelectDialog from "../common/dialog/SelectDialog"
import Pagination from "../components/Pagination"
import { useNavigate, Link } from "react-router-dom"
import Table from '../components/DataTable'

export default function SearchInterface(props) {

  const [title, setTitle] = useState('Search')
  const [results, setResults] = useState([])
  const [searchUrl, setSearchUrl] = useState('Patient?_sort=-_lastUpdated')
  const [paginationLinks, setPaginationLinks] = useState([])
  const [selectedItem, setSelectedItem] = useState({})

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, loading, error } = useGet(searchUrl)
  const navigate = useNavigate()

  useEffect(() => {
    if (Array.isArray(data?.entry)) {
      const mappedData = data?.entry.map(patient => deconstructPatientData(patient, props.searchType));
      setPaginationLinks(data?.link)
      setResults(mappedData);
    }
  }, [data, title])

  const SubmitDetails = () => {
    setSearchUrl(`Patient?name=${formData.searchInput}&_sort=-_lastUpdated`)
  }

  const onUpdateUrl = (value) => {
    const URL = value.slice('http://chanjoke.intellisoftkenya.com/hapi/fhir'.length)
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
      render: (_,record) => <Link to={`/client-details/${record.id}`} className='text-[#163C94] font-semibold'>View</Link>
    }
  ]

  const { formData, formErrors, handleChange} = FormState({
    searchInput: '',
  })

  const handleAction = (onActionBtn, data) => {
    if (onActionBtn.type === 'modal') {
      setIsDialogOpen(true)
      setSelectedItem(data)
    }
  }

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
      title='Info'
      description='Select Record to update'
      btnOne={{
        text: 'Client Record',
        url: `/update-client-history/${selectedItem.id}`
      }}
      btnTwo={{
        text: 'Vaccine Details',
        url: '/update-vaccine-history'
      }}
      onClose={handleDialogClose} />

    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-3 sm:px-6">
        {title}
      </div>
      <div className="px-4">
        <div className="grid grid-cols-5 gap-4 mx-10">
          <div className="col-span-4">
            <TextInput
              inputType="text"
              inputName="searchInput"
              inputId="searchInput"
              value={formData.searchInput}
              onInputChange={(value) => handleChange('searchInput', value)}
              inputPlaceholder="Search Client"/>
          </div>
          <div>
            <button
              onClick={() => SubmitDetails()}
              className="mt-8 flex-shrink-0 rounded-lg w-full bg-[#163C94] border border-[#163C94] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Search
            </button>
          </div>
        </div>

        {error && <div className="my-10 text-center">{error}</div> }
        {loading && <div className="my-10 mx-auto flex justify-center"><LoadingArrows /></div>}
        {!data?.entry && !loading && <>
          <div className="my-10 text-center">No records to view</div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/register-client/_')}
              className="mt-8 flex-shrink-0 rounded-lg bg-[#163C94] border border-[#163C94] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Register new client
            </button>
          </div>
        </>}
        {data?.entry &&
          <div className='px-10 my-6'>
            <Table
              columns={columns}
              dataSource={results}
              size="small"
              loading={loading}
              pagination={results?.length > 12 ? {
                pageSize: 12,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`
              }: false}
            />

            <Pagination link={paginationLinks} updateURL={onUpdateUrl} />
          </div>
        }
      </div>
    </div>
    </>
  );
}