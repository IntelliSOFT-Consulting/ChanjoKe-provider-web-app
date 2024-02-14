import { Link } from 'react-router-dom'
import SearchTable from '../../common/tables/SearchTable'

const atBirthVaccines = [
  { vaccineName: 'BCG', doseNumber: '1', dueToAdminister: 'Jan 1 2020', dateAdministered: '-', status: 'Contraindicated', actions: [
    { title: 'view', url: '/'}
  ]},
  {vaccineName: 'bOPV', doseNumber: '1', dueToAdminister: 'Jan 1 2020', dateAdministered: '-', status: 'Missed', actions: [
    { title: 'view', url: '/'}
  ]},
]

const sixWeekVaccines = [
  {vaccineName: 'OPV I', doseNumber: '1', dueToAdminister: 'Jan 1 2020', dateAdministered: 'Jan 1 2020', status: 'Administered', actions: [
    { title: 'view', url: '/'}
  ]},
  {vaccineName: 'OPV II', doseNumber: '1', dueToAdminister: 'Jan 1 2020', dateAdministered: 'Jan 1 2020', status: 'Administered', actions: [
    { title: 'view', url: '/'}
  ]},
  {vaccineName: 'Rotavirus', doseNumber: '1', dueToAdminister: 'Jan 1 2020', dateAdministered: 'Jan 1 2020', status: 'Administered', actions: [
    { title: 'view', url: '/'}
  ]},
]

const tenthWeekVaccines = [
  {vaccineName: 'OPV III', doseNumber: '1', dueToAdminister: 'Jan 1 2024', dateAdministered: '-', status: 'Due', actions: [
    { title: 'view', url: '/'}
  ]},
  {vaccineName: 'Rotavirus II', doseNumber: '1', dueToAdminister: 'Jan 1 2024', dateAdministered: '-', status: 'Due', actions: [
    { title: 'view', url: '/'}
  ]},
]

const tHeaders = [
  {title: '', class: '', key: 'checkbox' },
  {title: 'Vaccine Name', class: '', key: 'vaccineName'},
  {title: 'Dose Number', class: '', key: 'doseNumber'},
  {title: 'Due Date', class: '', key: 'dueToAdminister'},
  {title: 'Date Administered', class: '', key: 'dateAdministered'},
  {title: 'Status', class: '', key: 'status'},
  {title: 'Actions', class: '', key: 'actions'},
]

export default function RoutineVaccines() {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <div className="flex justify-between">
        <div>
          <p>Vaccination Schedule</p>
          <small>Please click on the checkbox to select which vaccine to administer</small>
        </div>
        <div>
          <button
            className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            Administer Vaccine (3)
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-12 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between px-10">
          <div>
            <p>At Birth</p>
          </div>
          <Link to="/aefi-report" className="text-[#163C94]">
            AEFIs
          </Link>
        </div>

        <SearchTable
          headers={tHeaders}
          data={atBirthVaccines} />
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-12 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between px-10">
          <div>
            <p>6 Weeks</p>
          </div>
          <Link to="/aefi-report" className="text-[#163C94]">
            AEFIs
          </Link>
        </div>

        <SearchTable
          headers={tHeaders}
          data={sixWeekVaccines} />
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-12 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between px-10">
          <div>
            <p>10 Weeks</p>
          </div>
          <Link to="/aefi-report" className="text-[#163C94]">
            AEFIs
          </Link>
        </div>

        <SearchTable
          headers={tHeaders}
          data={tenthWeekVaccines} />
      </div>
    </div>
  ) 
}