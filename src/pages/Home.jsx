import { useEffect, useState } from 'react'
import SearchIcon from '../assets/search.svg'
import RegisterClientIcon from '../assets/register-client.svg'
import UpdateClientHistoryIcon from '../assets/update-client-history.svg'
import AdministerVaccineIcon from '../assets/post-treatment.svg'
import AefiIcon from '../assets/aefi.svg'
import ReferralIcon from '../assets/note-add.svg'
import AppointmentIcon from '../assets/appointments.svg'
import StockManagementIcon from '../assets/stock-management.svg'
import { Link } from 'react-router-dom'
import useVaccination from '../hooks/useVaccination'
import { useSelector } from 'react-redux'
import LoadingArrows from '../common/spinners/LoadingArrows'
import moment from 'moment'

const stats = [
  { name: 'Search Client', icon: SearchIcon, href: 'search/searchClient/n' },
  {
    name: 'Register Client',
    icon: RegisterClientIcon,
    href: 'register-client',
  },
  {
    name: 'Update Vaccine History',
    icon: UpdateClientHistoryIcon,
    href: 'search/updateClient/n',
  },
  {
    name: 'Administer Vaccine',
    icon: AdministerVaccineIcon,
    href: 'search/administerVaccine/n',
  },
  { name: 'AEFI', icon: AefiIcon, href: 'search/aefi/n' },
  { name: 'Appointments', icon: AppointmentIcon, href: 'search/appointments/n' },
  {
    name: 'Stock Management',
    icon: StockManagementIcon,
    href: 'stock-management',
  },
  { name: 'Referrals', icon: ReferralIcon, href: 'referrals' },
  { name: 'Campaigns', icon: ReferralIcon, href: 'campaigns' },
]

const statsTwo = [
  {
    id: 1,
    name: 'Appointments',
    stat: '0',
    icon: AppointmentIcon,
    change: '',
    changeType: 'increase',
  },
  {
    id: 2,
    name: 'Referrals',
    stat: '0',
    icon: ReferralIcon,
    change: '',
    changeType: 'increase',
  },
  {
    id: 2,
    name: 'Vaccines Administered',
    stat: '100',
    icon: AdministerVaccineIcon,
    change: '',
    changeType: 'increase',
  },
]

export default function Home() {
  const { user } = useSelector((state) => state.userInfo)

  const { getFacilityImmunizations, immunizations } = useVaccination()

  const today = moment().format('YYYY-MM-DD')

  useEffect(() => {
    getFacilityImmunizations(user?.facility, `&date=gt${today}`)
  }, [user?.facility])

  const totalVaccines = immunizations?.length || 0

  return (
    <>
      {!immunizations ? (
        <div className="flex justify-center items-center h-[80vh]">
          <LoadingArrows />
        </div>
      ) : (
        <div>
          <h3 className="mt-5 text-[#163C94] text-2xl mx-auto max-w-7xl">
            Today's Statistics
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3 mx-auto max-w-7xl">
            {statsTwo.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <h1 className="font-bold text-center text-2xl">{item.name}</h1>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <img
                      className="h-24 ml-5 mt-6 mb-5"
                      src={item.icon}
                      alt={item.name}
                    />
                  </div>
                  <div>
                    <div className="text-7xl text-[#163C94] font-bold mt-10">
                      {item.name === 'Vaccines Administered'
                        ? totalVaccines
                        : item.stat}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </div>
      )}

      <br />

      <div>
        <dl className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 sm:mt-10 mt-3 grid grid-cols-2 gap-5 sm:grid-cols-3 p-6 rounded-lg shadow-xl border bg-white">
          {stats.map((item) => (
            <Link
              to={item.href}
              key={item.name}
              className="overflow-hidden text-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-[#5370B0]"
            >
              <img
                className="h-12 mx-auto mb-5"
                src={item.icon}
                alt={item.name}
              />
              <dt className="truncate text-sm font-normal text-gray-500">
                {item.name}
              </dt>
            </Link>
          ))}
        </dl>
      </div>
    </>
  )
}
