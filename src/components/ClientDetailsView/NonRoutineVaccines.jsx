import { Disclosure } from '@headlessui/react'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import { Badge, Button, Checkbox, Tag } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import { setSelectedVaccines } from '../../redux/actions/vaccineActions'
import { formatCardTitle } from '../../utils/methods'
import { datePassed } from '../../utils/validate'
import Table from '../DataTable'
import { colorCodeVaccines, isQualified } from './vaccineController'
import { routineVaccines } from '../../data/vaccineData'

export default function NonRoutineVaccines({
  userCategory,
  patientData,
  nonRoutineVaccines,
  patientDetails,
}) {
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  function handleCheckBox(item) {
    const vaccineExists = vaccinesToAdminister.find(
      (vaccine) => vaccine.vaccineName === item.vaccineName
    )
    if (vaccineExists === undefined) {
      setVaccinesToAdminister([...vaccinesToAdminister, item])
    }
    if (vaccineExists) {
      const withoutDeletedVaccine = vaccinesToAdminister?.filter(
        (vaccine) => vaccine.vaccineName !== item.vaccineName
      )
      setVaccinesToAdminister(withoutDeletedVaccine)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const administerVaccineBtns = [
    {
      btnText: 'Administer Vaccine',
      url: `/administer-vaccine/${patientData?.id}`,
      bgClass: 'bg-[#4E8D6E] text-white',
      textClass: 'text-center',
    },
    {
      btnText: 'Contraindicate',
      url: `/add-contraindication/${patientData?.id}`,
      bgClass: 'bg-[#163C94] text-white',
      textClass: 'text-center',
    },
    {
      btnText: 'Not Administered',
      url: `/not-administered/${patientData?.id}`,
      bgClass: 'outline outline-[#163C94] text-[#163C94]',
      textClass: 'text-center',
    },
  ]

  const sections = nonRoutineVaccines
    ? [...new Set(Object.keys(nonRoutineVaccines))]
    : []

  const allVaccines = Object.values(nonRoutineVaccines).flat()

  const columns = [
    {
      title: '',
      dataIndex: 'vaccine',
      key: 'vaccine',
      render: (_text, record) => {
        const completed = record.status === 'completed'

        return (
          <Checkbox
            name={record.vaccineName}
            value={record.vaccineName}
            defaultChecked={completed}
            className="tooltip"
            disabled={!isQualified(allVaccines, record)}
            onChange={() => handleCheckBox(record)}
          />
        )
      },
      width: '5%',
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccine',
      key: 'vaccine',
    },
    {
      title: 'Dose Number',
      dataIndex: 'doseNumber',
      key: 'doseNumber',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text, record) => {
        const hasCompletedSeries = allVaccines?.find(
          (vaccine) =>
            vaccine.nhddCode === record.nhddCode &&
            vaccine.status === 'completed'
        )

        if (text && record?.doseNumber > 1 && hasCompletedSeries) {
          return text?.format('DD-MM-YYYY')
        }
        return '-'
      },
    },
    {
      title: 'Date Administered',
      dataIndex: 'administeredDate',
      key: 'administeredDate',
      render: (text, _record) => (text ? text.format('DD-MM-YYYY') : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const missed = datePassed(
          text,
          patientData?.birthDate,
          record?.adminRange?.end
        )
        return (
          <Tag
            color={
              text === 'completed'
                ? 'green'
                : text === 'not-done'
                ? 'red'
                : missed && text !== 'entered-in-error'
                ? 'red'
                : text === 'entered-in-error'
                ? 'yellow'
                : 'gray'
            }
          >
            {text === 'completed'
              ? 'Administered'
              : text === 'not-done'
              ? 'Not Administered'
              : text === 'entered-in-error'
              ? 'Contraindicated'
              : missed && text !== 'entered-in-error'
              ? 'Missed'
              : ''}
          </Tag>
        )
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          disabled={record?.id && record.status !== 'not-done' ? false : true}
          onClick={() => {
            navigate(`/view-vaccination/${record?.id}`)
          }}
          type="link"
          className="font-bold text=[#173C94]"
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <>
      <OptionsDialog
        open={isDialogOpen}
        buttons={administerVaccineBtns}
        onClose={handleDialogClose}
      />
      <div className="overflow-hidden rounded-lg bg-white px-10 pb-12 pt-5 mt-2 shadow container sm:pt-6">
        <div className="flex justify-between">
          <div>
            <p>Vaccination Schedule</p>
            <small>
              Please click on the checkbox to select which vaccine to administer
            </small>
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setDialogOpen(true)
                dispatch(setSelectedVaccines(vaccinesToAdminister))
              }}
              disabled={vaccinesToAdminister?.length > 0 ? false : true}
              className="ml-4"
            >
              Administer Vaccine ( {vaccinesToAdminister?.length} )
            </Button>
          </div>
        </div>

        {sections.map((category) => {
          const sectionVaccines = nonRoutineVaccines[category]
          return (
            <dl
              key={category}
              className="mt-5 space-y-6 divide-y divide-gray-900/10"
            >
              <div className="overflow-hidden rounded-lg bg-gray-100 pb-6 pt-5 mt-5 shadow sm:px-6">
                <Disclosure
                  as="div"
                  key={category}
                  defaultOpen={category === patientDetails?.clientCategory}
                  className="pt-2"
                >
                  {({ open }) => {
                    const color = colorCodeVaccines(sectionVaccines, false)
                    const administered = sectionVaccines?.filter(
                      (item) => item.status === 'completed'
                    )
                    return (
                      <>
                        <dt>
                          <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                            <div className="flex w-full justify-between px-10">
                              <span>
                                <span className="flex items-center">
                                  {formatCardTitle(category)}
                                  <Badge
                                    className="ml-2 vaccination-status"
                                    size="large"
                                    color={color}
                                  />
                                </span>
                              </span>
                              <span>
                                {open ? (
                                  <Button
                                    to="/aefi-report"
                                    className="text-[#163C94]"
                                    disabled={['gray', 'red'].includes(color)}
                                    onClick={() => {
                                      dispatch(
                                        setSelectedVaccines(administered)
                                      )
                                      navigate(`/aefi-report/${patientData?.id}`)
                                    }}
                                    type="link"
                                  >
                                    AEFIs
                                  </Button>
                                ) : (
                                  <PlusSmallIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </div>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel
                          as="dd"
                          className="mt-2 pr-12 overflow-x-auto"
                          open={category.category === userCategory}
                        >
                          <Table
                            columns={columns}
                            dataSource={sectionVaccines}
                            pagination={false}
                            size="small"
                          />
                        </Disclosure.Panel>
                      </>
                    )
                  }}
                </Disclosure>
              </div>
            </dl>
          )
        })}
      </div>
    </>
  )
}
