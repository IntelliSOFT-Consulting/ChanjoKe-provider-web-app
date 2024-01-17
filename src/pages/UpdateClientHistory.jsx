import SearchTable from "../common/tables/SearchTable"
import TextInput from "../common/forms/TextInput"
import useGet from "../api/useGet"

export default function SearchClient() {

  const { data, loading, error } = useGet('Patient')

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Update Client History
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-5 gap-4 mx-10">
          <div className="col-span-4">
            <TextInput
              inputType="text"
              inputName="searchInput"
              inputId="searchInput"
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

        {error && <div>{error}</div>}
        {loading && <div>loading...</div>}
        {data && <SearchTable results={data} />}
      </div>
    </div>
  );
}