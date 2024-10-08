import {
  BankOutlined,
  BarChartOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  DotChartOutlined,
  FallOutlined,
  FormOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  ReconciliationOutlined,
  SelectOutlined,
  SignatureOutlined,
  SoundOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdministerVaccineLogo from '../common/icons/administerVaccineLogo'
import AefiLogo from '../common/icons/aefiLogo'
import AppointmentLogo from '../common/icons/appointmentLogo'
import DefaulterTracingLogo from '../common/icons/defaulterTracingLogo'
import HomeLogo from '../common/icons/homeLogo'
import ReferralIcon from '../common/icons/referralLogo'
import RegisterClientLogo from '../common/icons/registerClientLogo'
import SearchLogo from '../common/icons/searchLogo'
import UpdateClientLogo from '../common/icons/updateClientLogo'
import VaccinationReportLogo from '../common/icons/vaccinationReportLogo'
import ProfileDropdown from './ProfileDropdown'

const iconComponents = {
  aefiLogo: AefiLogo,
  homeLogo: HomeLogo,
  administerVaccineLogo: AdministerVaccineLogo,
  vaccinationReportLogo: VaccinationReportLogo,
  registerClientLogo: RegisterClientLogo,
  updateClientLogo: UpdateClientLogo,
  defaulterTracingLogo: DefaulterTracingLogo,
  searchLogo: SearchLogo,
  appointmentLogo: AppointmentLogo,
  referralIcon: ReferralIcon,
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SidebarItem = ({ item, onItemClick, child = false }) => {
  const IconComponent = iconComponents[item.icon]

  return (
    <Link
      to={item.href}
      onClick={() => onItemClick(item)}
      className={classNames(
        item.current ? 'bg-gray-50 text-[#163C94]' : 'hover:bg-gray-50]',
        `flex rounded-md py-2 pr-2 pl-5 text-md leading-6 font-normal ${
          child ? 'ml-6 text-sm' : 'my-4'
        }`
      )}
    >
      {item.icon && (
        <span className={`mr-2`}>
          {typeof item.icon === 'object' ? (
            <span className={child ? 'text-gray-500' : 'text-xl'}>
              {item.icon}
            </span>
          ) : (
            <IconComponent
              width="24"
              height="24"
              fillColor={item.current ? '#163C94' : '#000000'}
            />
          )}
        </span>
      )}
      {item.name}
    </Link>
  )
}

export default function Sidenav() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.userInfo)

  const getNavigationItems = () => {
    const baseNavigation = [
      {
        name: 'Home',
        href: '/',
        current: true,
        icon: 'homeLogo',
        roles: ['ADMINISTRATOR','ALL'],
      },
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <BarChartOutlined />,
        roles: [
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
          'COUNTY_SYSTEM_ADMINISTRATOR',
        ],
      },
      {
        name: 'Admin Management',
        icon: '',
        href: '#',
        roles: [
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
          'COUNTY_SYSTEM_ADMINISTRATOR',
          'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
          'FACILITY_SYSTEM_ADMINISTRATOR',
        ],
        children: [
          {
            name: 'Users',
            href: '/admin-users',
            icon: <UsergroupAddOutlined />,
            roles: [
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ],
          },
          {
            name: 'Facility',
            href: '/admin-add-facility',
            icon: <BankOutlined />,
            roles: [
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ],
          },
        ],
      },
      {
        name: 'Vaccination Reports',
        href: '#',
        icon: 'vaccinationReportLogo',
        roles: ['ALL'],
        children: [
          {
            name: 'MOH 710',
            href: '/reports/moh-710',
            icon: <BarChartOutlined />,
            roles: ['ALL'],
          },
          {
            name: 'MOH 525',
            href: '/reports/moh-525',
            icon: <DotChartOutlined />,
            roles: ['ALL'],
          },
        ],
      },
      {
        name: 'Search Client',
        href: '/search/searchClient/n',
        icon: 'searchLogo',
        roles: [
          'NURSE',
          'DOCTOR',
          'CLERK',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
        ],
      },
      {
        name: 'Register Client',
        href: '/register-client',
        icon: 'registerClientLogo',
        roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
      },
      {
        name: 'Update Vaccine History',
        href: '/search/updateClient/n',
        icon: 'updateClientLogo',
        roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
      },
      {
        name: 'Administer Vaccine',
        href: '/search/administerVaccine/n',
        icon: 'administerVaccineLogo',
        roles: ['NURSE', 'DOCTOR', 'CLERK', 'FACILITY_SYSTEM_ADMINISTRATOR'],
      },
      {
        name: 'Appointments',
        href: '/search/appointments/n',
        icon: 'appointmentLogo',
        roles: [
          'NURSE',
          'DOCTOR',
          'CLERK',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
        ],
      },
      {
        name: 'AEFI',
        href: '/search/aefi/n',
        icon: 'aefiLogo',
        roles: [
          'NURSE',
          'DOCTOR',
          'CLERK',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
        ],
      },
      {
        name: 'Campaigns',
        href: '/campaigns',
        icon: <SoundOutlined />,
        roles: [
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
          'COUNTY_SYSTEM_ADMINISTRATOR',
          'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'NURSE',
          'DOCTOR',
        ],
      },
      {
        name: 'Community Referrals',
        href: '/referrals',
        icon: 'referralIcon',
        roles: [
          'NURSE',
          'DOCTOR',
          'CLERK',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
        ],
      },
      {
        name: 'Defaulter Tracing',
        href: '/defaulter-tracing',
        icon: 'defaulterTracingLogo',
        roles: [
          'NURSE',
          'DOCTOR',
          'CLERK',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
        ],
      },
      {
        name: 'Stock Management',
        href: '/stock-management',
        icon: '',
        roles: [
          'SUB_COUNTY_STORE_MANAGER',
          'FACILITY_STORE_MANAGER',
          'FACILITY_SYSTEM_ADMINISTRATOR',
          'ADMINISTRATOR',
          'NATIONAL_SYSTEM_ADMINISTRATOR',
        ],
        children: [
          {
            name: 'New Order',
            href: '/stock-management/new-order',
            icon: <FormOutlined />,
            roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
          },
          {
            name: 'Sent Orders',
            href: '/stock-management/sent-orders',
            icon: <SelectOutlined />,
            roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
          },
          {
            name: 'Issue Stock',
            href: '/stock-management/issue-stock',
            icon: <TruckOutlined />,
            roles: ['SUB_COUNTY_STORE_MANAGER'],
          },
          {
            name: 'Receive Stock',
            href: '/stock-management/receive-stock',
            icon: <FallOutlined />,
            roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
          },
          {
            name: 'Receive Regional Stock',
            href: '/stock-management/receive-regional-stock',
            icon: <FallOutlined />,
            roles: ['SUB_COUNTY_STORE_MANAGER'],
          },
          {
            name: 'Received Orders',
            href: '/stock-management/received-orders',
            icon: <SignatureOutlined />,
            roles: ['SUB_COUNTY_STORE_MANAGER'],
          },
          // {
          //   name: 'Receive from another facility',
          //   href: '/stock-management/positive-adjustment',
          //   icon: <PlusCircleOutlined />,
          //   roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
          // },
          // {
          //   name: 'Share with another facility',
          //   href: '/stock-management/negative-adjustment',
          //   icon: <MinusCircleOutlined />,
          //   roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
          // },
          {
            name: 'Stock Count',
            href: '/stock-management/stock-count',
            icon: <DatabaseOutlined />,
            roles: [
              'SUB_COUNTY_STORE_MANAGER',
              'FACILITY_STORE_MANAGER',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ],
          },
          {
            name: 'Wastage',
            href: '/stock-management/wastage',
            icon: <ReconciliationOutlined />,
            roles: [
              'SUB_COUNTY_STORE_MANAGER',
              'FACILITY_STORE_MANAGER',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ],
          },
          {
            name: 'Ledger',
            href: '/stock-management/ledger',
            icon: <ContainerOutlined />,
            roles: [
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_STORE_MANAGER',
              'FACILITY_STORE_MANAGER',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'NURSE',
              'DOCTOR',
              'CLERK',
            ],
          },
        ],
      },
    ]

    return baseNavigation
      .filter(
        (item) =>
          item.roles.includes('ALL') ||
          item.roles.includes(user.practitionerRole)
      )
      .map((item) => ({
        ...item,
        children: item.children
          ? item.children.filter(
              (child) =>
                child.roles.includes('ALL') ||
                child.roles.includes(user.practitionerRole)
            )
          : undefined,
      }))
  }

  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    setNavigation(getNavigationItems())
  }, [user, location.pathname])

  const handleItemClick = (clickedItem) => {
    const updatedNavigation = navigation.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.map((child) => ({
            ...child,
            current: child.href === clickedItem.href,
          })),
        }
      }
      return {
        ...item,
        current: item.href === clickedItem.href,
      }
    })

    setNavigation(updatedNavigation)
    setSidebarOpen(false)
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10 lg:hidden"
            onClose={setSidebarOpen}
          >
            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white pb-2">
                    <div className="grid grid-cols-8 h-28 shrink-0 auto-cols-fr items-center">
                      <div className="bg-[#163C94] col-span-7 h-full text-white text-4xl text-center pt-8">
                        OpenCHANJO
                      </div>
                      <div className="grid grid-cols-3 gap-1 h-full bg-white">
                        <div className="basis-1/4 bg-black"></div>
                        <div className="basis-1/4 bg-[#BB0100]"></div>
                        <div className="basis-1/2 bg-[#286208]"></div>
                      </div>
                    </div>
                    <nav className="flex flex-1 flex-col px-6">
                      <ul className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {!item.children ? (
                              <SidebarItem
                                onItemClick={handleItemClick}
                                item={item}
                                width="24"
                                height="24"
                              />
                            ) : (
                              <Disclosure as="div">
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button
                                      onClick={() => {
                                        navigate(item?.href)
                                      }}
                                      className={classNames(
                                        item.current
                                          ? 'bg-gray-50'
                                          : 'hover:bg-gray-50',
                                        'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6  text-gray-700'
                                      )}
                                    >
                                      <ChevronRightIcon
                                        className={classNames(
                                          open
                                            ? 'rotate-90 text-gray-500'
                                            : 'text-gray-400',
                                          'h-5 w-5 shrink-0'
                                        )}
                                        aria-hidden="true"
                                      />
                                      <div className="text-xl font-normal">
                                        {item.name}
                                      </div>
                                    </Disclosure.Button>
                                    <Disclosure.Panel
                                      as="ul"
                                      className="mt-1 px-2"
                                    >
                                      {item.children.map((subItem) => (
                                        <li key={subItem.name}>
                                          <SidebarItem
                                            onItemClick={handleItemClick}
                                            item={subItem}
                                            width="24"
                                            height="24"
                                          />
                                        </li>
                                      ))}
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
            <div className="grid grid-cols-8 h-28 shrink-0 auto-cols-fr items-center">
              <div className="bg-[#163C94] col-span-7 h-full text-white text-4xl text-center pt-8">
                OpenCHANJO
              </div>
              <div className="grid grid-cols-3 gap-1 h-full bg-white">
                <div className="basis-1/4 bg-black"></div>
                <div className="basis-1/4 bg-[#BB0100]"></div>
                <div className="basis-1/2 bg-[#286208]"></div>
              </div>
            </div>
            <nav className="flex flex-1 flex-col px-6">
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <SidebarItem
                        onItemClick={handleItemClick}
                        item={item}
                        width="24"
                        height="24"
                      />
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              onClick={() => {
                                navigate(item?.href)
                              }}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-50'
                                  : 'hover:bg-gray-50',
                                'flex items-center w-full text-left rounded-md p-2 gap-x-3 leading-6 text-gray-700'
                              )}
                            >
                              <ChevronRightIcon
                                className={classNames(
                                  open
                                    ? 'rotate-90 text-gray-500'
                                    : 'text-gray-400',
                                  'h-5 w-5 shrink-0 ml-2'
                                )}
                                aria-hidden="true"
                              />
                              <div className="text-normal font-normal">
                                {item.name}
                              </div>
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <SidebarItem
                                    onItemClick={handleItemClick}
                                    item={subItem}
                                    child={true}
                                    width="24"
                                    height="24"
                                  />
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-10 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            OpenCHANJO
          </div>

          <ProfileDropdown />
        </div>
      </div>
    </>
  )
}
