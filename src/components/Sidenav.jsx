import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Home', href: '/', current: true, icon: HomeIcon },
  {
    name: 'Admin Management',
    icon: UsersIcon,
    children: [
      { name: 'User', href: '/admin-users' },
      { name: 'Facility', href: 'admin-facilities'}
    ]},
  { name: 'Vaccination Reports', current: false, href: '/', icon: FolderIcon },
  { name: 'Register Client', href: 'register-client', icon: CalendarIcon },
  { name: 'Update Client History', href: 'update-client-history', icon: DocumentDuplicateIcon },
  { name: 'Administer Vaccine', href: 'administer-vaccine', icon: ChartPieIcon },
  { name: 'AEFI', href: 'aefi', icon: ChartPieIcon },
  { name: 'Defaulter Tracing', href: 'defaulter-tracing', icon: ChartPieIcon },
  { name: 'Stock Management', href: 'stock-management', icon: ChartPieIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidenav() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

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
                    leaveTo="opacity-0">
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white pb-2">
                    <div className="grid grid-cols-8 h-28 shrink-0 auto-cols-fr items-center">
                    <div className="bg-[#163C94] col-span-7 h-full text-white text-4xl text-center pt-8">ChanjoKE</div>
                    <div className="grid grid-cols-3 gap-1 h-full bg-white">
                      <div className="basis-1/4 bg-black"></div>
                      <div className="basis-1/4 bg-[#BB0100]"></div>
                      <div className="basis-1/2 bg-[#286208]"></div>
                    </div>
                  </div>
                    <nav className="flex flex-1 flex-col px-6">

                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {!item.children ? (
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                  'block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            ) : (
                              <Disclosure as="div">
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button
                                      className={classNames(
                                        item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                        'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700'
                                      )}
                                    >
                                      <ChevronRightIcon
                                        className={classNames(
                                          open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                          'h-5 w-5 shrink-0'
                                        )}
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </Disclosure.Button>
                                    <Disclosure.Panel as="ul" className="mt-1 px-2">
                                      {item.children.map((subItem) => (
                                        <li key={subItem.name}>
                                          <Disclosure.Button
                                            as="a"
                                            href={subItem.href}
                                            className={classNames(
                                              subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                              'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
                                            )}
                                          >
                                            {subItem.name}
                                          </Disclosure.Button>
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
              <div className="bg-[#163C94] col-span-7 h-full text-white text-4xl text-center pt-8">ChanjoKE</div>
              <div className="grid grid-cols-3 gap-1 h-full bg-white">
                <div className="basis-1/4 bg-black"></div>
                <div className="basis-1/4 bg-[#BB0100]"></div>
                <div className="basis-1/2 bg-[#286208]"></div>
              </div>
            </div>
            <nav className="flex flex-1 flex-col px-6">
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <a
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                          'block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700'
                        )}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700'
                              )}
                            >
                              <ChevronRightIcon
                                className={classNames(
                                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                  'h-5 w-5 shrink-0'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <Disclosure.Button
                                    as="a"
                                    href={subItem.href}
                                    className={classNames(
                                      subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                      'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
                                    )}
                                  >
                                    {subItem.name}
                                  </Disclosure.Button>
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
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">ChanjoKE</div>
          
          <ProfileDropdown />
        </div>
      </div>
    </>
  )
}