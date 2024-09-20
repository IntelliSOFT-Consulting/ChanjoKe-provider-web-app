import moment from 'moment'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AefiIcon from '../assets/aefi.svg'
import AppointmentIcon from '../assets/appointments.svg'
import ReferralIcon from '../assets/note-add.svg'
import AdministerVaccineIcon from '../assets/post-treatment.svg'
import RegisterClientIcon from '../assets/register-client.svg'
import SearchIcon from '../assets/search.svg'
import StockManagementIcon from '../assets/stock-management.svg'
import UpdateClientHistoryIcon from '../assets/update-client-history.svg'
import UsersIcon from '../assets/users.png'
import FacilityIcon from '../assets/facility.png'
import CampaignIcon from '../assets/campaigns.png'
import LoadingArrows from '../common/spinners/LoadingArrows'
import useAppointment from '../hooks/useAppointment'
import useReferral from '../hooks/useReferral'
import useVaccination from '../hooks/useVaccination'
import { useReports } from '../hooks/useReports'
import CanvasJSReact from '@canvasjs/react-charts'
import { formatPopulation } from '../utils/formatters/formatMonitoring'


let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart

const allShortcuts = [
  {
    name: 'Search Client',
    icon: SearchIcon,
    href: 'search/searchClient/n',
    roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
  },
  {
    name: 'Register Client',
    icon: RegisterClientIcon,
    href: 'register-client',
    roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
  },
  {
    name: 'Update Vaccine History',
    icon: UpdateClientHistoryIcon,
    href: 'search/updateClient/n',
    roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
  },
  {
    name: 'Administer Vaccine',
    icon: AdministerVaccineIcon,
    href: 'search/administerVaccine/n',
    roles: ['NURSE', 'DOCTOR'],
  },
  {
    name: 'AEFI',
    icon: AefiIcon,
    href: 'search/aefi/n',
    roles: ['NURSE', 'DOCTOR'],
  },
  {
    name: 'Appointments',
    icon: AppointmentIcon,
    href: 'search/appointments/n',
    roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
  },
  {
    name: 'Stock Management',
    icon: StockManagementIcon,
    href: 'stock-management',
    roles: [
      'SUB_COUNTY_STORE_MANAGER',
      'FACILITY_STORE_MANAGER',
      'FACILITY_SYSTEM_ADMINISTRATOR',
    ],
  },
  {
    name: 'Community Referrals',
    icon: ReferralIcon,
    href: 'referrals',
    roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
  },
  {
    name: 'Campaigns',
    icon: CampaignIcon,
    href: 'campaigns',
    roles: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
      'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
      'FACILITY_SYSTEM_ADMINISTRATOR',
    ],
  },
  {
    name: 'Users',
    icon: UsersIcon,
    href: 'admin-users',
    roles: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
      'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
      'FACILITY_SYSTEM_ADMINISTRATOR',
    ],
  },
  {
    name: 'Facilities',
    icon: FacilityIcon,
    href: 'admin-facilities',
    roles: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
      'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
    ],
  },
]

export default function Home() {
  const { user } = useSelector((state) => state.userInfo)
  const { getMonitoring, monitoring } = useReports()
  const { getFacilityImmunizations, immunizations } = useVaccination()
  const { getFacilityAppointments, facilityAppointments } = useAppointment()
  const { getReferralsToFacility, referrals } = useReferral()

  const today = moment().format('YYYY-MM-DD')

  useEffect(() => {
    getFacilityImmunizations(user?.orgUnit?.code || '0', `&date=${today}`)
    getFacilityAppointments(today)
    getReferralsToFacility(user?.orgUnit?.code || '0', 0, today)
    getMonitoring({})
  }, [user?.orgUnit?.code])

  const statsTwo = [
    {
      id: 1,
      name: 'Appointments',
      stat: facilityAppointments?.length || 0,
      icon: AppointmentIcon,
      change: '',
      changeType: 'increase',
    },
    {
      id: 2,
      name: 'Community Referrals',
      stat: referrals?.total || 0,
      icon: ReferralIcon,
      change: '',
      changeType: 'increase',
    },
    {
      id: 3,
      name: 'Vaccines Administered',
      stat: immunizations?.length || 0,
      icon: AdministerVaccineIcon,
      change: '',
      changeType: 'increase',
    },
  ]

  const allowedShortcuts = useMemo(() => {
    return allShortcuts.filter(
      (shortcut) =>
        shortcut.roles.includes(user?.practitionerRole) ||
        shortcut.roles.includes('ALL')
    )
  }, [user])

  const options = {
    animationEnabled: true,
    theme: 'light2',
    axisX: {
      valueFormatString: 'MMM',
      intervalType: 'month',
      interval: 1,
    },
    axisY: {
      title: 'Population',
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      itemclick: function (e) {
        if (
          typeof e.dataSeries.visible === 'undefined' ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false
        } else {
          e.dataSeries.visible = true
        }
        e.chart.render()
      },
    },
    data: formatPopulation(monitoring),
  }

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
                      {item.stat}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </dl>

          <br />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="bg-white rounded-lg shadow-xl border p-4">
              <h3 className="font-bold text-primary border-b-2 pb-2 mb-4">
                Population Coverage
              </h3>
              {monitoring && <CanvasJSChart options={options} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
