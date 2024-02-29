import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import SearchTable from '../../common/tables/SearchTable'
import routineVaccines from './vaccineData'

const atBirthVaccines = routineVaccines.filter((vaccine) => vaccine.category === 'at_birth').map((item) => {
  item.actions = [
    { title: 'view', url: '/'}
  ]
  item.id = uuidv4()
  return item
})

const sixWeekVaccines = routineVaccines.filter((vaccine) => vaccine.category === '6_weeks').map((item) => {
  item.actions = [
    { title: 'view', url: '/'}
  ]
  item.id = uuidv4()
  return item
})

const tenthWeekVaccines = routineVaccines.filter((vaccine) => vaccine.category === '10_weeks').map((item) => {
  item.actions = [
    { title: 'view', url: '/'}
  ]
  item.id = uuidv4()
  return item
})

const forteenWeeks = routineVaccines.filter((vaccine) => vaccine.category === '14_weeks').map((item) => {
  item.actions = [
    { title: 'view', url: '/'}
  ]
  item.id = uuidv4()
  return item
})

const sixMonths = routineVaccines.filter((vaccine) => vaccine.category === '6_months').map((item) => {
  item.actions = [
    { title: 'view', url: '/'}
  ]
  item.id = uuidv4()
  return item
})

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
          <div className='flex'>
            <span className='flex'>At Birth

              <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
              </svg>
            </span>
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
            <span className='flex'>
              6 Weeks

              <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
              </svg>
            </span>
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
            <span className='flex'>
              10 Weeks

              <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
              </svg>
            </span>
          </div>
          <Link to="/aefi-report" className="text-[#163C94]">
            AEFIs
          </Link>
        </div>

        <SearchTable
          headers={tHeaders}
          data={tenthWeekVaccines} />
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-12 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between px-10">
          <div>
            <span className='flex'>
              14 Weeks

              <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
              </svg>
            </span>
          </div>
          <Link to="/aefi-report" className="text-[#163C94]">
            AEFIs
          </Link>
        </div>

        <SearchTable
          headers={tHeaders}
          data={forteenWeeks} />
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-12 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between px-10">
          <div>
            <span className='flex'>
              6 months

              <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
              </svg>
            </span>
          </div>
          <Link to="/aefi-report" className="text-[#163C94]">
            AEFIs
          </Link>
        </div>

        <SearchTable
          headers={tHeaders}
          data={sixMonths} />
      </div>
    </div>
  ) 
}