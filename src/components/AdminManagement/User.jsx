import SearchTable from "../../common/tables/SearchTable";
import TextInput from "../../common/forms/TextInput";
import FormState from "../../utils/formState"
import useGet from "../../api/useGet"
import { Link } from "react-router-dom";

export default function User() {

  const { data, loading, error } = useGet('Patient')
  const patients = [
    {dateRegistered: 'Jan 12 2024', fullNames: 'John Doe', actions: [
      { title: 'update', url: '/client-details' },
      { title: 'archive', url: '/client-details' },
    ] },
    {dateRegistered: 'Jan 12 2024', fullNames: 'Jane Doe', actions: [
      { title: 'update', url: '/client-details' },
      { title: 'archive', url: '/client-details' },
    ] }
  ]

  const archived = [
    {dateRegistered: 'Jan 12 2024', fullNames: 'John Doe', actions: [
      { title: 'unarchive', url: '/client-details' },
    ]},
  ]

  const tHeaders = [
    {title: 'Client Name', class: '', key: 'dateRegistered'},
    {title: 'ID Number', class: '', key: 'fullNames'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const { formData, formErrors, handleChange} = FormState({
    searchInput: '',
  })
  return (
    <>

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Admin Management - User
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-5 gap-4 mx-10">
            <div className="col-span-4">
              <TextInput
                inputType="text"
                inputName="searchInput"
                inputId="searchInput"
                required={true}
                value={formData.searchInput}
                onInputChange={(value) => handleChange('searchInput', value)}
                label="Search User"
                inputPlaceholder="Search User"/>
            </div>
            <div>
              <a
                href="/admin-add-user"
                type="button"
                className="ml-4 mt-8 flex-shrink-0 rounded-lg w-full bg-[#163C94] border border-[#163C94] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] active:bg-[#13327b] active:outline-[#13327b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
                Add User
              </a>
            </div>
          </div>

          {error && <div>{error}</div>}
          {loading && <div>loading...</div>}
          {data &&
            <SearchTable
              headers={tHeaders}
              data={patients} />}
        </div>
      </div>

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          Archived Users
        </div>
        <div className="px-4 py-5 sm:p-6">
          {error && <div>{error}</div>}
          {loading && <div>loading...</div>}
          {data &&
            <SearchTable
              headers={tHeaders}
              data={archived} />}
        </div>
      </div>
    
    </>
  );
}