import SearchTable from "../common/tables/SearchTable"
import TextInput from "../common/forms/TextInput"
import FormState from "../utils/formState"
import useGet from "../api/useGet"
import { useEffect, useState } from "react"
import LoadingArrows from "../common/spinners/LoadingArrows"
import { deconstructPatientData } from '../components/RegisterClient/DataWrapper'

export default function SearchInterface(props) {

  const [title, setTitle] = useState('Search')
  const [actions, setActions] = useState([{ title: 'view', url: '/' }])
  const [results, setResults] = useState([])

  const { data, loading, error } = useGet('Patient')

  useEffect(() => {
    if (Array.isArray(data)) {
      const mappedData = data.map(patient => deconstructPatientData(patient, actions));
      setResults(mappedData);

      console.log({ mappedData })
    }
  }, [data])

  const tHeaders = [
    {title: 'Client Name', class: '', key: 'clientName'},
    {title: 'ID Number', class: '', key: 'idNumber'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const { formData, formErrors, handleChange} = FormState({
    searchInput: '',
  })

  useEffect(() => {
    if (props.searchType === 'searchClient') {
      setTitle('Search')
      setActions([
        { title: 'view', url: '/client-details' }
      ])
    }
    if (props.searchType === 'updateClient') {
      setTitle('Update Client History')
      setActions([
        { title: 'view', btnAction: '' }
      ])
    }
    if (props.searchType === 'administerVaccine') {
      setTitle('Administer Vaccine')
      setActions([
        { title: 'view', url: '/client-details' }
      ])
    }
    if (props.searchType === 'aefi') {
      setTitle('Adverse Event Following Immunisation')
      setActions([
        { title: 'view', url: '/aefi-report' }
      ])
    }
  }, [props.searchType])

  return (
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
              className="ml-4 mt-8 flex-shrink-0 rounded-full w-full bg-[#163C94] border border-[#163C94] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Search
            </button>
          </div>
        </div>

        {error && <div className="my-10 text-center">{error}</div> }
        {loading && <div className="my-10 mx-auto flex justify-center"><LoadingArrows /></div>}
        {!data && !loading && <div className="my-10 text-center">No records to view</div>}
        {data &&
          <SearchTable
            headers={tHeaders}
            data={results} />}
      </div>
    </div>
  );
}