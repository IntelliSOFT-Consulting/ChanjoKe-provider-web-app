import TextInput from '../../common/forms/TextInput'
import SearchTable from '../../common/tables/SearchTable'
import FormState from '../../utils/formState'
import { useNavigate } from 'react-router-dom'

export default function VaccineAppointments({ userCategory, patientData }) {
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

  const appointmentSchedule = []
  const navigate = useNavigate()

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
            onClick={() => navigate(`/new-appointment/${patientData.id}`)}
            className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            New Appointment
          </button>
        </div>
      </div>

      {appointmentSchedule.length > 0 && <SearchTable
          headers={tHeaders}
          data={appointmentSchedule} />}

      {appointmentSchedule.length < 1 && <><p className='text-center'>No appointments made</p></>}

    </div>
  )
}