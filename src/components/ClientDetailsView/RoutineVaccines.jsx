import { Disclosure } from '@headlessui/react'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import { Badge, Button, Checkbox, FloatButton, Tag, Tooltip } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import SelectDialog from '../../common/dialog/SelectDialog'
import Loader from '../../common/spinners/LoadingArrows'
import useAefi from '../../hooks/useAefi'
import useVaccination from '../../hooks/useVaccination'
import { setCurrentPatient } from '../../redux/actions/patientActions'
import { setSelectedVaccines } from '../../redux/actions/vaccineActions'
import { formatCardTitle } from '../../utils/methods'
import { datePassed, lockVaccine } from '../../utils/validate'
import Table from '../DataTable'
import DeleteModal from './DeleteModal'
import { colorCodeVaccines } from './vaccineController'
import { getDeceasedStatus } from './clientDetailsController'

export default function RoutineVaccines({
  userCategory,
  patientData,
  patientDetails,
  routineVaccines,
  fetchData,
  immunizations,
}) {
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [selectAefi, setSelectAefi] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [immunizationToDelete, setImmunizationToDelete] = useState(null)
  const [isDeceased, setIsDeceased] = useState(false)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { updateImmunization } = useVaccination()

  const selectedVaccines = useSelector((state) => state.selectedVaccines)
  const { user } = useSelector((state) => state.userInfo)

  const { getAefis, loading: loadingAefis, aefis } = useAefi()

  useEffect(() => {
    if (aefis) {
      setIsDeceased(getDeceasedStatus(aefis))
    }
  }, [aefis])

  const categories = routineVaccines
    ? [...new Set(Object.keys(routineVaccines))]
    : []

  const deleteImmunization = async (id, reason) => {
    const immunization = immunizations?.find((entry) => entry.id === id)

    immunization.status = 'entered-in-error'
    immunization.statusReason = {
      coding: [
        {
          code: 'entered-in-error',
          display: reason,
        },
      ],
      text: reason,
    }

    await updateImmunization(immunization)
    setImmunizationToDelete(null)
    fetchData()
  }

  useEffect(() => {
    if (patientData?.id) {
      dispatch(setCurrentPatient(patientData))
      getAefis()
    }
  }, [patientData])

  useEffect(() => {
    const element = document.getElementById(patientDetails?.clientCategory)

    if (routineVaccines) {
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    } else {
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }, [immunizations, routineVaccines, patientDetails])

  function handleCheckBox(item) {
    const vaccineExists = vaccinesToAdminister.find(
      (vaccine) => vaccine.vaccine === item.vaccine
    )
    if (vaccineExists === undefined) {
      setVaccinesToAdminister([...vaccinesToAdminister, item])
    }
    if (vaccineExists) {
      const withoutDeletedVaccine = vaccinesToAdminister?.filter(
        (vaccine) => vaccine.vaccine !== item.vaccine
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

  const statusMessage = (record, locked = false) => {
    const missed = datePassed(
      record.status,
      record?.dueDate?.format('YYYY-MM-DD')
    )
    if (isDeceased && record.status !== 'completed') {
      return 'Patient is deceased'
    }
    switch (record?.status) {
      case 'completed':
        return 'Vaccine already administered'
      case 'not-done':
        return `Vaccine not administered because of ${
          record.statusReason?.coding?.[0]?.display
        } until ${record.dueDate.format('DD-MM-YYYY')}`
      case 'entered-in-error':
        return `Vaccine contraindicated, to be administered on ${record.dueDate.format(
          'DD-MM-YYYY'
        )}`
      case 'Due':
        return locked && record.dueDate?.isAfter(dayjs())
          ? 'Vaccination date not yet due'
          : missed && locked
          ? 'Vaccine missed'
          : ''
      default:
        return ''
    }
  }

  const columns = [
    {
      title: '',
      dataIndex: 'vaccine',
      key: 'vaccine',
      render: (_text, record) => {
        const completed = record.status === 'completed'
        const locked = lockVaccine(record.dueDate, record.lastDate)

        return (
          <Tooltip title={statusMessage(record, locked)} color="#163c94">
            <Checkbox
              name={record.vaccine}
              value={record.vaccine}
              defaultChecked={completed}
              disabled={
                completed || isDeceased ||
                (locked &&
                  !['Contraindicated', 'Not Administered'].includes(
                    record.status
                  ))
              }
              onChange={() => handleCheckBox(record)}
            />
          </Tooltip>
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
      render: (text, _record) => (text ? text.format('DD-MM-YYYY') : '-'),
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
        return (
          <Tag
            color={
              text === 'completed'
                ? 'green'
                : text === 'Not Administered' || isDeceased
                ? 'red'
                : missed &&
                  text !== 'Contraindicated' &&
                  text !== 'Not Administered'
                ? 'red'
                : text === 'Contraindicated'
                ? 'yellow'
                : 'gray'
            }
          >
            {text === 'completed'
              ? 'Administered'
              : isDeceased && text !== 'completed'
              ? 'Deceased'
              : text === 'Not Administered'
              ? 'Not Administered'
              : text === 'Contraindicated'
              ? 'Contraindicated'
              : missed && text !== 'entered-in-error'
              ? 'Missed'
              : moment().isAfter(record.dueDate)
              ? 'Due'
              : 'Upcoming'}
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
            disabled={record.status === 'Due'}
            onClick={() => {
              const url =
                record.status === 'completed'
                  ? `/view-vaccination/${record?.id}`
                  : record.status === 'Contraindicated'
                  ? `/view-contraindication/${record?.id}`
                  : `/view-not-administered/${record?.id}`
              navigate(url)
            }}
            type="link"
            className="font-bold text=[#173C94]"
          >
            View
          </Button>
          {record.status === 'completed' &&
            user?.practitionerRole
              ?.toLowerCase()
              ?.includes('administrator') && (
              <Button
                type="link"
                danger
                onClick={() => setImmunizationToDelete(record.id)}
              >
                Delete
              </Button>
            )}
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
      <DeleteModal
        immunization={immunizationToDelete}
        onCancel={() => setImmunizationToDelete(null)}
        onOk={(values) =>
          deleteImmunization(
            immunizationToDelete,
            values.reason === 'Other' ? values.otherReason : values.reason
          )
        }
      />
      <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <p>Vaccination Schedule</p>
            <small>
              Please click on the checkbox to select which vaccine to administer
            </small>
          </div>
          <div>
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
          </div>
        </div>

        {userCategory && !loadingAefis ? (
          categories.map(
            (category) =>
              routineVaccines[category]?.length > 0 && (
                <dl
                  key={category}
                  className="mt-10 space-y-6 divide-y divide-gray-900/10"
                >
                  <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-6 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
                    <Disclosure
                      as="div"
                      key={category}
                      defaultOpen={
                        formatCardTitle(category) ===
                        patientDetails.clientCategory
                      }
                      id={formatCardTitle(category)}
                      className="pt-2"
                    >
                      {({ open }) => {
                        const categoryvaccines = routineVaccines[category]
                        const administered = categoryvaccines?.filter(
                          (vaccine) => vaccine.status === 'completed'
                        )

                        const color = colorCodeVaccines(categoryvaccines)
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
                                        disabled={['gray', 'red'].includes(
                                          color
                                        )}
                                        onClick={() => {
                                          dispatch(
                                            setSelectedVaccines(administered)
                                          )
                                          setSelectAefi(true)
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
                                dataSource={routineVaccines[category]}
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
          )
        ) : (
          <div className="my-10 mx-auto flex justify-center">
            <Loader />
          </div>
        )}
        <SelectDialog
          open={selectAefi}
          onClose={setSelectAefi}
          title="Select AEFI"
          description="Please select an action"
          btnTwo={{
            text: 'View AEFIs',
            url: `/aefi-details/${selectedVaccines?.[0]?.id}`,
          }}
          btnOne={{
            text: 'Report AEFI',
            url: `/aefi-report/${selectedVaccines?.[0]?.id}`,
          }}
        />
      </div>
    </>
  )
}
