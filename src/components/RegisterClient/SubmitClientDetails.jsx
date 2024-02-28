import BaseTable from "../../common/tables/BaseTable";
import SearchTable from "../../common/tables/SearchTable";
import ConvertObjectToArray from "./convertObjectToArray";

export default function ClientDetails({ clientDetails, caregiverDetails, administrativeArea }) {

  const clientDetailsArray = ConvertObjectToArray(clientDetails)
  const administrativeAreaArray = ConvertObjectToArray(administrativeArea)

  const tHeaders = [
    {title: 'Caregiver Name', class: '', key: 'caregiverName'},
    {title: 'Caregiver Relationship', class: '', key: 'caregiverType'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-10 mx-7">
        {/* Column 1 */}
        <div>
          <h2 className="text-xl font-semibold mb-5">
            Client Details
          </h2>

          <BaseTable data={clientDetailsArray} />

        </div>

        {/* Column 3 */}
        <div>
          <h2 className="text-xl font-semibold mb-5">
            Administrative Area
          </h2>

          <BaseTable data={administrativeAreaArray} />
        </div>

      </div>

      <div>
          <h2 className="text-xl font-semibold ml-7 mb-5 mt-5">
            Caregiver Details
          </h2>

          <SearchTable headers={tHeaders} data={caregiverDetails} />
        </div>
    </>
  )
}