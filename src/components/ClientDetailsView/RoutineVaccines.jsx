import { useNavigate } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import { useSharedState } from '../../shared/sharedState'
import moment from 'moment'
import { useApiRequest } from '../../api/useApiRequest'
import Loader from '../../common/spinners/LoadingArrows'
import Table from '../DataTable'
import { Badge, Button, Checkbox, Tag, Tooltip } from 'antd'
import { datePassed, lockVaccine } from '../../utils/validate'
import { setSelectedVaccines } from '../../redux/actions/vaccineActions'
import { setCurrentPatient } from '../../redux/actions/patientActions'
import { useDispatch, useSelector } from 'react-redux'
import { createImmunizationRecommendation } from './DataWrapper'
import useAefi from '../../hooks/useAefi'
import dayjs from 'dayjs'

const categories = [
  'at_birth',
  '6_weeks',
  '10_weeks',
  '14_weeks',
  '6_months',
  '7_months',
  '9_months',
  '12_months',
  '18_months',
  '24_months',
  '10-14_years',
]

export default function RoutineVaccines({
  userCategory,
  patientData,
  patientDetails,
  routineVaccines,
}) {
  const [mappedVaccines, setMappedVaccines] = useState([])
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const selectedVaccines = useSelector((state) => state.selectedVaccines)

  const { setSharedData } = useSharedState()
  const { get } = useApiRequest()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { getAefis, loading: loadingAefis } = useAefi()

  function mergeVaccines(localVaccines, apiVaccines) {
    if (Array.isArray(apiVaccines) && apiVaccines?.length) {
      const updatedVaccines = localVaccines.map((localVaccine) => {
        const matchingApiVaccine = apiVaccines.find(
          (apiVaccine) =>
            apiVaccine?.resource?.vaccineCode?.text ===
            localVaccine?.vaccineName
        )

        return matchingApiVaccine
          ? { ...localVaccine, ...matchingApiVaccine.resource }
          : localVaccine
      })

      return updatedVaccines
    } else {
      return localVaccines
    }
  }

  function formatCardTitle(input) {
    return input
      ?.split('_')
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const fetchPatientImmunization = async () => {
    const response = await get(
      `/hapi/fhir/Immunization?patient=Patient/${patientData?.id}`
    )
    setData(response)
    setLoading(false)
  }

  useEffect(() => {
    if (patientData?.id) {
      dispatch(setCurrentPatient(patientData))
      fetchPatientImmunization()
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
  }, [data?.entry, loading])

  function handleCheckBox(onActionBtn, item) {
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
      url: '/administer-vaccine',
      bgClass: 'bg-[#4E8D6E] text-white',
      textClass: 'text-center',
    },
    {
      btnText: 'Contraindicate',
      url: '/add-contraindication',
      bgClass: 'bg-[#5370B0] text-white',
      textClass: 'text-center',
    },
    {
      btnText: 'Not Administered',
      url: '/not-administered',
      bgClass: 'outline outline-[#5370B0] text-[#5370B0]',
      textClass: 'text-center',
    },
  ]

  const columns = [
    {
      title: '',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      render: (text, record) => {
        const completed = record.status === 'completed'
        const locked = lockVaccine(record.dueDate, patientData.birthDate)
        return (
          <Tooltip
            title={
              locked
                ? 'Not yet eligible for this vaccine'
                : completed
                ? 'Vaccine already administered'
                : ''
            }
            color="#163c94"
          >
            <Checkbox
              name={record.vaccineName}
              value={record.vaccineName}
              defaultChecked={completed}
              disabled={completed || locked}
              onChange={() => handleCheckBox('administer', record)}
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
        <Button
          disabled={record?.id ? false : true}
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
      <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <p>Vaccination Schedule</p>
            <small>
              Please click on the checkbox to select which vaccine to administer
            </small>
          </div>
          <div>
            <button
              onClick={() => {
                setDialogOpen(true)
                dispatch(setSelectedVaccines(vaccinesToAdminister))
                setSharedData(vaccinesToAdminister)
              }}
              disabled={vaccinesToAdminister?.length > 0 ? false : true}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
            >
              Administer Vaccine ( {vaccinesToAdminister?.length} )
            </button>
          </div>
        </div>

        {userCategory && !loading && !loadingAefis ? (
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
                        const someAdministered =
                          categoryvaccines?.filter(
                            (vaccine) =>
                              vaccine.status !== 'complete' ||
                              vaccine.status === 'not-done'
                          )?.length > 0 && administered?.length > 0
                        const allAdministered =
                          categoryvaccines?.filter(
                            (vaccine) => vaccine.status === 'completed'
                          )?.length === categoryvaccines?.length
                        const allNotAdministered =
                          categoryvaccines?.filter(
                            (vaccine) => vaccine.status !== 'completed'
                          )?.length === categoryvaccines?.length

                        const allUpcoming =
                          categoryvaccines?.filter((vaccine) => {
                            const today = new Date()
                            const dueDate = new Date(
                              vaccine.dueDate?.format('YYYY-MM-DD')
                            )
                            return (
                              today < dueDate && vaccine.status !== 'completed'
                            )
                          })?.length === categoryvaccines?.length

                        return (
                          <>
                            <dt>
                              <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                <div className="flex w-full justify-between px-10">
                                  <span>
                                    <span className="flex items-center">
                                      {formatCardTitle(category)}
                                      {/*Colour coding - dark grey (not administered), Green (administered), amber (some vaccines not administered), red (missed)*/}
                                      <Badge
                                        className="ml-2 vaccination-status"
                                        size="large"
                                        color={
                                          allAdministered
                                            ? 'green'
                                            : someAdministered
                                            ? '#faad14'
                                            : allNotAdministered
                                            ? allUpcoming
                                              ? 'gray'
                                              : 'red'
                                            : 'gray'
                                        }
                                      />
                                    </span>
                                  </span>
                                  <span>
                                    {open ? (
                                      <Button
                                        to="/aefi-report"
                                        className="text-[#163C94]"
                                        disabled={allNotAdministered}
                                        onClick={() => {
                                          dispatch(
                                            setSelectedVaccines(administered)
                                          )
                                          setSharedData({
                                            vaccinesToAdminister,
                                          })
                                          navigate('/aefi-report')
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
                                // data={category.vaccines}
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
      </div>
    </>
  )
}
