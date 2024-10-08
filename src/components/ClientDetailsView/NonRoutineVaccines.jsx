import { PlusOutlined, WarningTwoTone } from '@ant-design/icons'
import { Disclosure } from '@headlessui/react'
import { Badge, Button, Checkbox, FloatButton, Popconfirm, Tag } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import { useAccess } from '../../hooks/useAccess'
import useAefi from '../../hooks/useAefi'
import { setSelectedVaccines } from '../../redux/slices/vaccineSlice'
import { formatCardTitle } from '../../utils/methods'
import { datePassed, lockVaccine } from '../../utils/validate'
import Table from '../DataTable'
import {
  colorCodeVaccines,
  isCovidQualified,
  prevDoseNotDone
} from './vaccineController'

export default function NonRoutineVaccines({
  userCategory,
  patientData,
  nonRoutineVaccines,
  patientDetails,
  immunizations,
  caregiverRefusal,
}) {
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { getAefis, aefis } = useAefi()
  const { canAccess } = useAccess()

  useEffect(() => {
    getAefis()
  }, [])

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
      btnText: 'Reschedule',
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
      hidden: !canAccess('ADMINISTER_VACCINE'),
      render: (_text, record) => {
        const completed = record.status === 'completed'
        const isLocked = lockVaccine(record.dueDate, record.lastDate)
        const prevNotDone = prevDoseNotDone(immunizations, record)
        const isDisabled =
          completed ||
          patientDetails?.deceased ||
          (isLocked &&
            !['Rescheduled', 'Not Administered'].includes(record.status)) ||
          record.contraindicated ||
          !isCovidQualified(allVaccines, record) ||
          prevNotDone

        

        return (
          <Checkbox
            name={record.vaccine}
            value={record.vaccine}
            defaultChecked={completed}
            className="tooltip"
            disabled={isDisabled}
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
        return record.status === 'completed' ? text?.format('DD-MM-YYYY') : '-'
      },
    },
    {
      title: 'Date Administered',
      dataIndex: 'administeredDate',
      key: 'administeredDate',
      render: (text, record) =>
        text && record.status === 'completed' ? text.format('DD-MM-YYYY') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const missed = datePassed(text, record?.dueDate?.format('YYYY-MM-DD'))
        const hasCompletedSeries = allVaccines?.find(
          (vaccine) =>
            vaccine.nhddCode === record.nhddCode &&
            vaccine.status === 'completed'
        )
        return (
          <Tag
            color={
              text === 'completed'
                ? 'green'
                : text === 'Not Administered' || patientDetails?.deceased
                ? 'red'
                : missed &&
                  text !== 'Rescheduled' &&
                  text !== 'Not Administered'
                ? 'red'
                : text === 'Rescheduled'
                ? 'yellow'
                : 'gray'
            }
          >
            {text === 'completed'
              ? 'Administered'
              : text === 'Not Administered'
              ? 'Not Administered'
              : text === 'Rescheduled'
              ? 'Rescheduled'
              : missed && text !== 'entered-in-error' && hasCompletedSeries
              ? moment().isAfter(record.dueDate)
                ? 'Due'
                : 'Missed'
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
        <div className="flex space-x-2">
          <Button
            disabled={!record?.id || record.status === 'not-done'}
            onClick={() => {
              const url =
                record.status === 'completed'
                  ? `/view-vaccination/${record?.id}`
                  : record.status === 'Rescheduled'
                  ? `/view-contraindication/${record?.id}`
                  : `/view-not-administered/${record?.id}`
              navigate(url)
            }}
            type="link"
            className="font-bold text=[#173C94]"
          >
            View
          </Button>
        </div>
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
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p>Vaccination Schedule</p>
              <small>
                Please click on the checkbox to select which vaccine to
                administer
              </small>
            </div>
            <div>
              {caregiverRefusal && (
                <div className="flex mt-2 md:mt-0 items-center bg-pink px-2 rounded-md ml-0 h-full my-0">
                  <WarningTwoTone twoToneColor="red" classID="text-black" />
                  <small>
                    Some vaccines have not been administered (Caregiver Refusal)
                  </small>
                </div>
              )}
            </div>
          </div>
          <div>
            {canAccess('ADMINISTER_VACCINE') && (
              <FloatButton
                type="primary"
                onClick={() => {
                  setDialogOpen(true)
                  dispatch(setSelectedVaccines(vaccinesToAdminister))
                }}
                disabled={vaccinesToAdminister?.length > 0 ? false : true}
                className={`w-fit ${
                  vaccinesToAdminister?.length === 0 ? 'btn-disabled' : ''
                }`}
                description={
                  <span className="px-2 font-semibold">{`Administer Vaccine ( ${vaccinesToAdminister?.length} )`}</span>
                }
                shape="square"
              />
            )}
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
                    const categoryvaccines = nonRoutineVaccines[category]
                    const administered = sectionVaccines?.filter(
                      (item) => item.status === 'completed'
                    )

                    const vaccineAefisCount =
                      aefis?.filter((aefi) =>
                        categoryvaccines?.find((vaccine) =>
                          aefi?.resource?.suspectEntity?.[0]?.instance?.reference?.includes(
                            vaccine.immunizationId
                          )
                        )
                      )?.length || 0
                    return (
                      <>
                        <dt className="relative">
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
                                {!open && (
                                  <PlusOutlined
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </div>
                          </Disclosure.Button>
                          {open && (
                            <Popconfirm
                              title="Please select an action"
                              onConfirm={() => {
                                dispatch(setSelectedVaccines(administered))
                                navigate(
                                  `/aefi-report/${administered?.[0]?.id}`
                                )
                              }}
                              onCancel={() => {
                                dispatch(setSelectedVaccines(administered))
                                navigate(
                                  `/aefi-details/${administered?.[0]?.id}`
                                )
                              }}
                              okText="Record AEFI"
                              okButtonProps={{
                                disabled: !canAccess('CREATE_AEFI'),
                                className: !canAccess('CREATE_AEFI')
                                  ? 'hidden'
                                  : '',
                              }}
                              cancelText="view AEFIs"
                              className="absolute right-0 -top-2"
                              placement="top"
                            >
                              <Button
                                className="text-[#163C94] absolute"
                                disabled={['gray', 'red'].includes(color)}
                                type="link"
                              >
                                AEFIs ({vaccineAefisCount})
                              </Button>
                            </Popconfirm>
                          )}
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
