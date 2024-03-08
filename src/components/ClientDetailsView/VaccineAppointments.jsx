import TextInput from '../../common/forms/TextInput'
import SearchTable from '../../common/tables/SearchTable'
import FormState from '../../utils/formState'

export default function VaccineAppointments() {
  const { formData, formErrors, handleChange} = FormState({
    sortByDate: '',
  })

  const tHeaders = [
    {title: 'Appointments', class: '', key: 'appointments' },
    {title: 'Scheduled Date', class: '', key: 'scheduledDate'},
    {title: 'Appointment Date', class: '', key: 'appointmentDate'},
    {title: 'Status', class: '', key: 'status'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const actions = [
    { title: 'edit', url: '/' }
  ]

  const appointmentSchedule = [
    { appointments: 'At Birth', scheduledDate: 'Jan 1 2020', appointmentDate: 'Jan 1 2020', status: 'Upcoming', actions },
    { appointments: '6 Weeks', scheduledDate: 'Feb 14 2020', appointmentDate: 'Feb 14 2020', status: 'Upcoming', actions },
  ]

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <div className="flex justify-between mx-10">
        <div>
          <TextInput
            inputType="date"
            inputName="sortByDate"
            inputId="sortByDate"
            value={formData.sortByDate}
            onInputChange={(value) => handleChange('sortByDate', value)}
            inputPlaceholder="Sort by Date"
          />
        </div>
        <div>
          <button
            className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            New Appointment
          </button>
        </div>
      </div>

      <SearchTable
          headers={tHeaders}
          data={appointmentSchedule} />

    </div>
  )
}