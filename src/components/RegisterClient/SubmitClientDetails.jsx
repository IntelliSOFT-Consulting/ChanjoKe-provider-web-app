import BaseTable from "../../common/tables/BaseTable";
import ConvertObjectToArray from "./convertObjectToArray";

export default function ClientDetails({ clientDetails, caregiverDetails, administrativeArea }) {

  const clientDetailsArray = ConvertObjectToArray(clientDetails)

  const careGiverDetailsArray = caregiverDetails.map((item) => ConvertObjectToArray(item))

  const administrativeAreaArray = ConvertObjectToArray(administrativeArea)

  return (
    <>
      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-5">
            Client Details
          </h2>

          <BaseTable data={clientDetailsArray} />

        </div>

        {/* Column 2 */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-5">
            Caregiver Details
          </h2>

          <BaseTable data={careGiverDetailsArray} />
        </div>

        {/* Column 3 */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-5">
            Administrative Area
          </h2>

          <BaseTable data={administrativeAreaArray} />
        </div>

      </div>
    </>
  )
}