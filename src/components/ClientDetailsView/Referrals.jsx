import TextInput from '../../common/forms/TextInput'
import SearchTable from '../../common/tables/SearchTable'
import FormState from '../../utils/formState'

export default function Referrals() {
  const { formData, formErrors, handleChange} = FormState({
    sortByDate: '',
  })

  const tHeaders = [
    {title: 'Referring CHP', class: '', key: 'appointments' },
    {title: 'Vaccine Referred', class: '', key: 'scheduledDate'},
    {title: 'Date of Referral', class: '', key: 'appointmentDate'},
    {title: 'Date Administered', class: '', key: 'status'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const actions = [
    { title: 'view', url: '/referral-details', class: 'text-blue-300 font-bold' }
  ]

  const appointmentSchedule = [
    { appointments: 'Joseph Kamau', scheduledDate: 'OPV I', appointmentDate: 'Jan 1 2020', status: 'Jan 1 2020', actions },
    { appointments: 'Jimmy Mwangi', scheduledDate: 'OPV II', appointmentDate: 'Feb 14 2020', status: 'Jan 1 2020', actions },
  ]

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">

      <SearchTable
          headers={tHeaders}
          data={appointmentSchedule} />

    </div>
  )
}