import SearchIcon from '../assets/search.svg'
import RegisterClientIcon from '../assets/register-client.svg'
import UpdateClientHistoryIcon from '../assets/update-client-history.svg'
import AdministerVaccineIcon from '../assets/post-treatment.svg'
import AefiIcon from '../assets/aefi.svg'
import AppointmentIcon from '../assets/appointments.svg'
import { Link } from 'react-router-dom'

const stats = [
  { name: 'Search Client', icon: SearchIcon, href: 'search-client' },
  { name: 'Register Client', icon: RegisterClientIcon, href: 'register-client' },
  { name: 'Update Client History', icon: UpdateClientHistoryIcon, href: 'update-client-history' },
  { name: 'Administer Vaccine', icon: AdministerVaccineIcon, href: 'administer-vaccine' },
  { name: 'AEFI', icon: AefiIcon, href: 'aefi' },
  { name: 'Appointments', icon: AppointmentIcon, href: 'aefi' }
]

const statsTwo = [
  { id: 1, name: 'Appointments Today', stat: '125', icon: AppointmentIcon, change: '', changeType: 'increase' },
  { id: 2, name: 'Vaccines Administered Today', stat: '100', icon: AdministerVaccineIcon, change: '', changeType: 'increase' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  return (
    <>
      <div>
        <dl className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 gap-5 sm:grid-cols-5 p-6 rounded-lg shadow-xl border bg-white">
          {stats.map((item) => (
            <Link to={item.href} key={item.name} className="overflow-hidden text-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-[#5370B0]">
              <img
                className="h-12 mx-auto mb-5"
                src={item.icon}
                alt={item.name}/>
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            </Link>
          ))}
        </dl>
      </div>

      <br />

      <div>

        <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {statsTwo.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <h1 className='font-bold'>{item.name}</h1>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <img
                  className="h-18 ml-5 mt-6 mb-5"
                  src={item.icon}
                  alt={item.name}/>
                </div>
                <div>
                  <div className="text-7xl text-[#163C94] font-bold mt-5">
                    {item.stat}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}