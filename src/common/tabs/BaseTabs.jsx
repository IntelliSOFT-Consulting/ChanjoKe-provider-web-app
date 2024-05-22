import React, { useEffect, useState } from 'react'
import NonRoutineVaccines from '../../components/ClientDetailsView/NonRoutineVaccines'
import RoutineVaccines from '../../components/ClientDetailsView/RoutineVaccines'
import VaccineAppointments from '../../components/ClientDetailsView/VaccineAppointments'
import Referrals from '../../components/ClientDetailsView/Referrals'

const tabs = [
  { name: 'Routine Vaccines', id: 'routineVaccines', href: '#', current: false },
  { name: 'Non Routine Vaccines', id: 'nonRoutineVaccines', href: '#', current: false },
  { name: 'Appointments', id: 'appointments', href: '#', current: false },
  { name: 'Referrals', id: 'referrals', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BaseTabs({
  patientData,
  patientDetails,
  userCategory,
  routineVaccines,
  nonRoutineVaccines,
  recommendations,
  immunizations,
  queryParams,
  activeTab,
  fetchData
}) {
  const [currentTab, setCurrentTab] = useState(activeTab || 'routineVaccines')

  useEffect(() => {
    if (patientDetails) {
      if (patientDetails?.ages?.years >= 18 || queryParams === 'non-routine') {
        setCurrentTab('nonRoutineVaccines')
      } if (activeTab === 'appointments') {
        setCurrentTab('appointments')
      } else {
        setCurrentTab('routineVaccines')
      }
    }
  }, [patientDetails])

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId)
  }

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only"></label>
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
                    : 'text-gray-800 bg-gray-200 hover:border-gray-300 hover:text-gray-700',
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
      {currentTab === 'routineVaccines' && (
        <RoutineVaccines
          userCategory={userCategory}
          patientData={patientData}
          patientDetails={patientDetails}
          routineVaccines={routineVaccines}
          recommendations={recommendations}
          immunizations={immunizations}
          fetchData={fetchData}
        />
      )}
      {currentTab === 'nonRoutineVaccines' && (
        <NonRoutineVaccines
          userCategory={userCategory}
          patientData={patientData}
          patientDetails={patientDetails}
          nonRoutineVaccines={nonRoutineVaccines}
          recommendations={recommendations}
          immunizations={immunizations}
          fetchData={fetchData}
        />
      )}
      {currentTab === 'appointments' && (
        <VaccineAppointments
          userCategory={userCategory}
          patientData={patientData}
          patientDetails={patientDetails}
        />
      )}
      {currentTab === 'referrals' && (
        <Referrals userCategory={userCategory} patientData={patientData} />
      )}
    </div>
  )
}
