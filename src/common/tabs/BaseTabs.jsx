import React, { useState } from 'react';

const tabs = [
  { name: 'Upcoming Vaccines', id: 'upcoming', href: '#', current: false },
  { name: 'Vaccine History', id: 'history', href: '#', current: false },
  { name: 'Appointments', id: 'appointments', href: '#', current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function BaseTabs() {
  const [currentTab, setCurrentTab] = useState('appointments');

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={currentTab}
          onChange={(e) => handleTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                className={classNames(
                  currentTab === tab.id
                    ? 'bg-[#163c94] text-white'
                    : 'text-gray-500 bg-[#899cc8] hover:border-gray-300 hover:text-gray-700',
                  'w-1/3 border-b py-4 px-1 text-center text-sm font-medium'
                )}
                onClick={() => handleTabChange(tab.id)}
                aria-current={currentTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on the selected tab */}
      {currentTab === 'upcoming' && <UpcomingVaccinesComponent />}
      {currentTab === 'history' && <VaccineHistoryComponent />}
      {currentTab === 'appointments' && <AppointmentsComponent />}
    </div>
  );
}

const upcomingVaccines = [
  { name: 'Oxford', doseNumber: 2, dateScheduled: 'Jan 1 2020', status: 'Upcoming', actions: 'View'}
]

// Define your UpcomingVaccinesComponent, VaccineHistoryComponent, and AppointmentsComponent here
function UpcomingVaccinesComponent() {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300">
        <tbody className="divide-y divide-gray-200">
          {upcomingVaccines.map((item) => (
            <tr key={item.name}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {item.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.doseNumber}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.dateScheduled}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) 
}

function VaccineHistoryComponent() {
  return <div>Vaccine History Content</div>;
}

function AppointmentsComponent() {
  return <div>Appointments Content</div>;
}