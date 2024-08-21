import { Disclosure } from '@headlessui/react'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import {
  Badge,
  Button,
  Checkbox,
  FloatButton,
  Tag,
  Tooltip,
  Popconfirm,
} from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import Loader from '../../common/spinners/LoadingArrows'
import useAefi from '../../hooks/useAefi'
import useVaccination from '../../hooks/useVaccination'
import { setCurrentPatient } from '../../redux/slices/patientSlice'
import { setSelectedVaccines } from '../../redux/slices/vaccineSlice'
import { formatCardTitle } from '../../utils/methods'
import { datePassed, lockVaccine } from '../../utils/validate'
import Table from '../DataTable'
import DeleteModal from './DeleteModal'
import { colorCodeVaccines } from './vaccineController'

export default function RoutineVaccines({
  userCategory,
  patientData,
  patientDetails,
  routineVaccines,
  fetchData,
  immunizations,
}) {
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [immunizationToDelete, setImmunizationToDelete] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { updateImmunization } = useVaccination()
  const { selectedVaccines } = useSelector((state) => state.vaccineSchedules)
  const { user } = useSelector((state) => state.userInfo)
  const { getAefis, loading: loadingAefis, aefis } = useAefi()

  const categories = routineVaccines
    ? [...new Set(Object.keys(routineVaccines))]
    : []

  useEffect(() => {
    if (patientData?.id) {
      dispatch(setCurrentPatient(patientData))
      getAefis()
    }
  }, [patientData])

  useEffect(() => {
    const element = document.getElementById(patientDetails?.clientCategory)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [immunizations, routineVaccines, patientDetails])

  const deleteImmunization = async (id, reason) => {
    const immunization = immunizations?.find((entry) => entry.id === id)
    if (immunization) {
      immunization.status = 'entered-in-error'
      immunization.statusReason = {
        coding: [{ code: 'entered-in-error', display: reason }],
        text: reason,
      }
      await updateImmunization(immunization)
      setImmunizationToDelete(null)
      fetchData()
    }
  }

  const handleCheckBox = (item) => {
    setVaccinesToAdminister((prev) => {
      const vaccineExists = prev.find(
        (vaccine) => vaccine.vaccine === item.vaccine
      )
      if (vaccineExists) {
        return prev.filter((vaccine) => vaccine.vaccine !== item.vaccine)
      }
      return [...prev, item]
    })
  }

  const statusMessage = (record, locked = false) => {
    if (patientDetails?.deceased && record.status !== 'completed')
      return 'Patient is deceased'

    const messages = {
      completed: 'Vaccine already administered',
      'not-done': `Vaccine not administered because of ${
        record.statusReason?.coding?.[0]?.display
      } until ${record.dueDate.format('DD-MM-YYYY')}`,
      'entered-in-error': `Vaccine rescheduled, to be administered on ${record.dueDate.format(
        'DD-MM-YYYY'
      )}`,
      Due: () => {
        if (locked && record.dueDate?.isAfter(dayjs()))
          return 'Vaccination date not yet due'
        if (
          datePassed(record.status, record?.dueDate?.format('YYYY-MM-DD')) &&
          locked
        )
          return 'Vaccine missed'
        return ''
      },
    }

    return typeof messages[record.status] === 'function'
      ? messages[record.status]()
      : messages[record.status] || ''
  }

  const columns = [
    {
      title: '',
      dataIndex: 'vaccine',
      key: 'vaccine',
      render: (_text, record) => {
        const completed = record.status === 'completed'
        const locked = lockVaccine(record.dueDate, record.lastDate)
        const disabled =
          completed ||
          patientDetails?.deceased ||
          (locked &&
            !['Rescheduled', 'Not Administered'].includes(record.status))

        return (
          <Tooltip title={statusMessage(record, locked)} color="#163c94">
            <Checkbox
              name={record.vaccine}
              value={record.vaccine}
              defaultChecked={completed}
              disabled={disabled}
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
      render: (text) => (text ? text.format('DD-MM-YYYY') : '-'),
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
        const color =
          text === 'completed'
            ? 'green'
            : text === 'Not Administered' || patientDetails?.deceased
            ? 'red'
            : missed && text !== 'Rescheduled' && text !== 'Not Administered'
            ? 'red'
            : text === 'Rescheduled'
            ? 'yellow'
            : 'gray'

        const status =
          text === 'completed'
            ? 'Administered'
            : text === 'Not Administered'
            ? 'Not Administered'
            : text === 'Rescheduled'
            ? 'Rescheduled'
            : missed && text !== 'entered-in-error'
            ? 'Missed'
            : moment().isAfter(record.dueDate)
            ? 'Due'
            : 'Upcoming'

        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            disabled={record.status === 'Due'}
            onClick={() => {
              const urls = {
                completed: `/view-vaccination/${record?.id}`,
                Rescheduled: `/view-contraindication/${record?.id}`,
                default: `/view-not-administered/${record?.id}`,
              }
              navigate(urls[record.status] || urls.default)
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

  const renderCategoryVaccines = (category) => {
    const categoryvaccines = routineVaccines[category]
    const administered = categoryvaccines?.filter(
      (vaccine) => vaccine.status === 'completed'
    )
    const color = colorCodeVaccines(categoryvaccines)
    const vaccineAefisCount = aefis?.filter((aefi) =>
      categoryvaccines?.find((vaccine) =>
        aefi?.resource?.suspectEntity?.[0]?.instance?.reference?.includes(
          vaccine.immunizationId
        )
      )
    )?.length

    return (
      <Disclosure
        as="div"
        key={category}
        defaultOpen={
          formatCardTitle(category) === patientDetails.clientCategory
        }
        id={formatCardTitle(category)}
        className="pt-2"
      >
        {({ open }) => (
          <>
            <dt className="relative">
              <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                <div className="flex w-full justify-between px-10">
                  <span className="flex items-center">
                    {formatCardTitle(category)}
                    <Badge
                      className="ml-2 vaccination-status"
                      size="large"
                      color={color}
                    />
                  </span>
                  {!open && (
                    <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </div>
              </Disclosure.Button>
              {open && (
                <Popconfirm
                  title="Please select an action"
                  onConfirm={() => {
                    dispatch(setSelectedVaccines(administered))
                    navigate(`/aefi-report/${selectedVaccines?.[0]?.id}`)
                  }}
                  onCancel={() => {
                    dispatch(setSelectedVaccines(administered))
                    navigate(`/aefi-details/${selectedVaccines?.[0]?.id}`)
                  }}
                  okText="Record AEFI"
                  cancelText="view AEFIs"
                  className="absolute right-0 -top-2"
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
            <Disclosure.Panel as="dd" className="mt-2 pr-12 overflow-x-auto">
              <Table
                columns={columns}
                dataSource={categoryvaccines}
                pagination={false}
                size="small"
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

  return (
    <>
      <OptionsDialog
        open={isDialogOpen}
        buttons={[
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
        ]}
        onClose={() => setDialogOpen(false)}
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
          <FloatButton
            type="primary"
            onClick={() => {
              setDialogOpen(true)
              dispatch(setSelectedVaccines(vaccinesToAdminister))
            }}
            disabled={vaccinesToAdminister.length === 0}
            className={`w-fit ${
              vaccinesToAdminister.length === 0 ? 'btn-disabled' : ''
            }`}
            description={
              <span className="px-2 font-semibold">
                {`Administer Vaccine ( ${vaccinesToAdminister.length} )`}
              </span>
            }
            shape="square"
          />
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
                    {renderCategoryVaccines(category)}
                  </div>
                </dl>
              )
          )
        ) : (
          <div className="my-10 mx-auto flex justify-center">
            <Loader />
          </div>
        )}
      </div>
    </>
  )
}
