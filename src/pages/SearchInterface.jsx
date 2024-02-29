import SearchTable from "../common/tables/SearchTable"
import TextInput from "../common/forms/TextInput"
import FormState from "../utils/formState"
import useGet from "../api/useGet"
import { useEffect, useState } from "react"
import LoadingArrows from "../common/spinners/LoadingArrows"
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'
import SelectDialog from "../common/dialog/SelectDialog"
import Pagination from "../components/Pagination"
import { useNavigate } from "react-router-dom"

export default function SearchInterface(props) {

  const [title, setTitle] = useState('Search')
  const [results, setResults] = useState([])
  const [searchUrl, setSearchUrl] = useState('Patient')
  const [paginationLinks, setPaginationLinks] = useState([])

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
    setSearchUrl(`Patient?name=${formData.searchInput}`)
  }

  const onUpdateUrl = (value) => {
    const URL = value.slice('http://chanjoke.intellisoftkenya.com/hapi/fhir'.length)
    setSearchUrl(URL)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
  }

  const tHeaders = [
    {title: 'Client Name', class: '', key: 'clientName'},
    {title: 'ID Number', class: '', key: 'idNumber'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const { formData, formErrors, handleChange} = FormState({
    searchInput: '',
  })

  const handleAction = ({ ...onActionBtn }) => {
    if (onActionBtn.type === 'modal') {
      setIsDialogOpen(true)
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
      onClose={handleDialogClose} />

    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        {title}
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-5 gap-4 mx-10">
          <div className="col-span-4">
            <TextInput
              inputType="text"
              inputName="searchInput"
              inputId="searchInput"
              value={formData.searchInput}
              onInputChange={(value) => handleChange('searchInput', value)}
              label="Enter Client Name/ID"
              inputPlaceholder="Enter Client Name/ID"/>
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
              onClick={() => navigate('/register-client')}
              className="mt-8 flex-shrink-0 rounded-lg bg-[#163C94] border border-[#163C94] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Register new client
            </button>
          </div>
        </>}
        {data?.entry && !loading &&
          <>
            <SearchTable
              headers={tHeaders}
              data={results}
              onActionBtn={handleAction}/>

            <Pagination link={paginationLinks} updateURL={onUpdateUrl} />
          </>
        }
      </div>
    </div>
    </>
  );
}