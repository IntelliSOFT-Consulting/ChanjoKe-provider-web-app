import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import SearchTable from '../../common/tables/SearchTable'
import { routineVaccines } from './vaccineData'
import { Disclosure } from '@headlessui/react'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import OptionsDialog from '../../common/dialog/OptionsDialog'

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

  function formatCardTitle(input) {
    return input
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  function mapVaccinesByCategory(vaccines) {
    const categoriesMap = {};

    routineVaccines.forEach(vaccine => {
      const { category, ...rest } = vaccine;

      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }

      rest.actions = [
        { title: 'view', url: '/' }
      ]

      categoriesMap[category].push(rest);
    });

    const categoriesArray = Object.entries(categoriesMap).map(([category, vaccines]) => ({
      category,
      vaccines,
    }));

    return categoriesArray;
  }

  function handleCheckBox(onActionBtn, item) {
    const vaccineExists = vaccinesToAdminister.find((vaccine) => vaccine.vaccineName === item.vaccineName)
    if (!vaccineExists) {
      setVaccinesToAdminister([...vaccinesToAdminister, item])
      console.log({ vaccinesToAdminister })
    }

    if (vaccineExists) {
      const withoutDeletedVaccine = vaccinesToAdminister.filter((vaccine) => vaccine.vaccineName === item.name)
      console.log({ withoutDeletedVaccine })
      setVaccinesToAdminister([...withoutDeletedVaccine])
    }
    console.log({ onActionBtn, item, vaccineExists })
  }

  const [mappedVaccines, setMappedVaccines] = useState(() => mapVaccinesByCategory(routineVaccines));
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const administerVaccineBtns = [
    { btnText: 'Administer Vaccine', url: '/administer-vaccine', bgClass: 'bg-[#4E8D6E] text-white', textClass: 'text-center' },
    { btnText: 'Contraindications', url: '/add-contraindication', bgClass: 'bg-[#5370B0] text-white', textClass: 'text-center' },
    { btnText: 'Not Administered', url: '/not-administered', bgClass: 'outline outline-[#5370B0] text-[#5370B0]', textClass: 'text-center' }
  ]
  return (
    <>
      <OptionsDialog
        open={isDialogOpen}
        buttons={administerVaccineBtns}
        onClose={handleDialogClose}
        />
      <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <p>Vaccination Schedule</p>
            <small>Please click on the checkbox to select which vaccine to administer</small>
          </div>
          <div>
            <button
              onClick={() => setDialogOpen(true)}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Administer Vaccine ( {vaccinesToAdminister.length} )
            </button>
          </div>
        </div>

        {mappedVaccines.map((category => (
          <dl key={category.category} className="mt-10 space-y-6 divide-y divide-gray-900/10">
            <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-12 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
              <Disclosure as="div" key='key' className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <div className="flex w-full justify-between px-10">
                          <span>
                            <span className='flex'>{formatCardTitle(category.category)}

                              <svg className="h-3 w-3 fill-yellow-500 ml-3 mt-1" viewBox="0 0 6 6" aria-hidden="true">
                                <circle cx={3} cy={3} r={3} />
                              </svg>
                            </span>
                          </span>
                          <span>
                          {open ? (
                            <Link to="/aefi-report" className="text-[#163C94]">
                                AEFIs
                            </Link>
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                          </span>
                        </div>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <SearchTable
                        headers={tHeaders}
                        data={category.vaccines}
                        onCheckbox={(value, item) => handleCheckBox(value, item)} />
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </dl>
        )))}

      </div>
    </>
  ) 
}