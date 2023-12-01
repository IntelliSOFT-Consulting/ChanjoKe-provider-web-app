import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const stats = [
  { name: 'Search Client', icon: '', href: 'search-client' },
  { name: 'Register Client', icon: '', href: 'register-client' },
  { name: 'Update Client History', icon: '', href: 'update-client-history' },
  { name: 'Administer Vaccine', icon: '', href: 'administer-vaccine' },
  { name: 'AEFI', icon: '', href: 'aefi' },
]

const statsTwo = [
  { id: 1, name: 'Appointments Today', stat: '125', icon: UsersIcon, change: '', changeType: 'increase' },
  { id: 2, name: 'Vaccines Administered Today', stat: '100', icon: EnvelopeOpenIcon, change: '', changeType: 'increase' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  return (
    <>
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900 mt-10">Ministry of Health</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
          {stats.map((item) => (
            <Link to={item.href} key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </Link>
          ))}
        </dl>
      </div>

      <br />

      <div>

        <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {statsTwo.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                <p
                  className={classNames(
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                  )}

                  <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </p>
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      View<span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}