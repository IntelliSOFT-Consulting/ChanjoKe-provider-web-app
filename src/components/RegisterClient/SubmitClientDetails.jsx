import BaseTable from "../../common/tables/BaseTable";

export default function ClientDetails() {
  const clientDetails = [
    { title: 'First Name:', value: 'John' },
    { title: 'Middle Name:', value: 'Doe' },
    { title: 'Last name:', value: 'Joseph' },
    { title: 'Gender:', value: 'Male' },
    { title: 'Age:', value: '2 years 2 months' },
    { title: 'ID Number:', value: '1234567' },
  ]

  const careGiverDetails = [
    { title: 'Care Giver Name:', value: 'John Doe.' },
    { title: 'Care Giver Type', value: 'Father' },
    { title: 'Care Giver contact', value: '0700 000 000' },
  ]

  const administrativeArea = [
    { title: 'Residence of child - County', value: 'Kiambu' },
    { title: 'Subcounty', value: 'Kiambu' },
    { title: 'Ward', value: 'Juja' },
    { title: 'Town/Trading centre', value: 'Juja' },
    { title: 'Estate & House No./village', value: 'Juja town' },
  ]

  return (
    <>
      <div className="grid mt-5 grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-5">
            Client Details
          </h2>

          <BaseTable data={clientDetails} />

        </div>

        {/* Column 2 */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-5">
            Caregiver Details
          </h2>

          <BaseTable data={careGiverDetails} />
        </div>

        {/* Column 3 */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-5">
            Administrative Area
          </h2>

          <BaseTable data={administrativeArea} />
        </div>

      </div>
    </>
  )
}