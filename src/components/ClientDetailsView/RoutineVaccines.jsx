import { useNavigate } from 'react-router-dom'
import { routineVaccines } from './vaccineData'
import { Disclosure } from '@headlessui/react'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import { useSharedState } from '../../shared/sharedState'
import moment from 'moment'
import { useApiRequest } from '../../api/useApiRequest'
import Loader from '../../common/spinners/LoadingArrows'
import Table from '../DataTable'
import { Badge, Button, Checkbox, Tag } from 'antd'
import { datePassed, lockVaccine } from '../../utils/validate'
import { setAEFIVaccines } from '../../redux/actions/vaccineActions'
import { useDispatch } from 'react-redux'

export default function RoutineVaccines({ userCategory, patientData }) {
  const [mappedVaccines, setMappedVaccines] = useState([])
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const { setSharedData } = useSharedState()
  const { get } = useApiRequest()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  function mergeVaccines(localVaccines, apiVaccines) {
    if (Array.isArray(apiVaccines) && apiVaccines.length) {
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
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
 
  useEffect(() => {
    const fetchPatientImmunization = async () => {
      const response = await get(`/hapi/fhir/Immunization?patient=Patient/${patientData?.id}`);
      setData(response);
      setLoading(false)
    }
  
    if (patientData?.id) {
      fetchPatientImmunization();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientData]); 

  useEffect(() => {
    const vaccData = data?.entry?.map((vaccine) => {
      return {
        vaccineName: vaccine?.resource?.vaccineCode?.text,
        vaccineCode: vaccine?.resource?.vaccineCode?.coding?.[0]?.code,
        diseaseTarget:
          vaccine?.resource?.protocolApplied?.[0]?.targetDisease?.[0]?.text,
        status:
          vaccine?.resource?.status === 'completed'
            ? 'Administered'
            : 'Not Administered',
        dateAdministered: moment(vaccine?.resource?.occurenceDateTime).format(
          'DD-MM-YYYY'
        ),
        dueDate: '-',
        doseNumber: vaccine?.resource?.doseQuantity?.value,
      }
    })
    const element = document.getElementById(userCategory)

    if (Array.isArray(vaccData) && vaccData) {
      const mergedVax = mergeVaccines(routineVaccines, data?.entry || [])

      setMappedVaccines(mapVaccinesByCategory(mergedVax))

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }  else {
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
      setMappedVaccines(mapVaccinesByCategory(routineVaccines))
    }
  }, [data?.entry, loading])

  function mapVaccinesByCategory(vaccines) {
    const categoriesMap = {}

    if (Array.isArray(vaccines) && vaccines.length > 0) {
      vaccines.forEach((vaccine) => {
        const { category, ...rest } = vaccine

        if (!categoriesMap[category]) {
          categoriesMap[category] = []
        }

        rest.actions = [{ title: 'view', url: '/view-vaccination/h894uijre09uf90fdskfd' }]

        categoriesMap[category].push(rest)
      })

      const categoriesArray = Object.entries(categoriesMap).map(
        ([category, vaccines]) => ({
          category,
          status: 'pending',
          vaccines,
        })
      )

      return categoriesArray
    }
  }

  function handleCheckBox(onActionBtn, item) {
    const vaccineExists = vaccinesToAdminister.find(
      (vaccine) => vaccine.vaccineName === item.vaccineName
    )
    if (vaccineExists === undefined) {
      setVaccinesToAdminister([...vaccinesToAdminister, item])
    }
    if (vaccineExists) {
      const withoutDeletedVaccine = vaccinesToAdminister.filter(
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
      btnText: 'Contraindications',
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

  const allVaccines = mappedVaccines
    ?.map((category) => category.vaccines)
    ?.flat(Infinity)
  const columns = [
    {
      title: '',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      render: (text, record) => {
        const completed = record.status === 'completed'
        const notDone = record.status === 'not-done'
        return (
          <Checkbox
            name={record.vaccineName}
            value={record.vaccineName}
            defaultChecked={completed}
            disabled={
              completed || notDone ||
              lockVaccine(record?.adminRange?.start, patientData.birthDate)
            }
            onChange={() => handleCheckBox('administer', record)}
          />
        )
      },
      width: '5%',
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
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
      render: (text, _record) => {
        if (_record?.education) {
          return moment(_record?.education?.[0]?.presentationDate).format('DD-MM-YYYY')
        } else {
          const dependentVaccine = allVaccines?.find(
            (vaccine) =>
              _record?.dependentVaccine ===
              vaccine?.vaccineCode?.coding?.[0]?.code
          )
          return text(patientData?.birthDate, dependentVaccine)
        }
      },
    },
    {
      title: 'Date Administered',
      dataIndex: 'occurrenceDateTime',
      key: 'occurrenceDateTime',
      render: (text) => {
        return text ? moment(text).format('DD-MM-YYYY') : '-'
      },
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
          <Tag color={text === 'completed' ? 'green' : text === 'not-done' ? 'red' : (missed && text !== 'entered-in-error') ? 'red' : text === 'entered-in-error' ? 'yellow' : 'gray'}>
            { text === 'completed' ? 'Administered' : text === 'not-done' ? 'Not Administered': text === 'entered-in-error' ? 'Contraindicated': (missed && text !== 'entered-in-error') ? 'Missed': '' }
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
                setSharedData(vaccinesToAdminister)
              }}
              disabled={vaccinesToAdminister.length > 0 ? false : true}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
            >
              Administer Vaccine ( {vaccinesToAdminister.length} )
            </button>
          </div>
        </div>

        {userCategory && !loading ? (
          mappedVaccines.map((category) => (
            <dl
              key={category.category}
              className="mt-10 space-y-6 divide-y divide-gray-900/10"
            >
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 pb-6 pt-5 mt-5 shadow sm:px-6 sm:pt-6">
                <Disclosure
                  as="div"
                  key={category.category}
                  defaultOpen={
                    category.category === userCategory ? true : false
                  }
                  id={`${userCategory}`}
                  className="pt-2"
                >
                  {({ open }) => {
                    const administered = category.vaccines.filter(
                      (vaccine) => vaccine.status === 'completed'
                    )
                    const someAdministered =
                      category.vaccines.filter(
                        (vaccine) => vaccine.status !== 'complete' || vaccine.status === 'not-done'
                      )?.length > 0 && administered.length > 0
                    const allAdministered =
                      category.vaccines.filter(
                        (vaccine) => vaccine.status === 'completed'
                      )?.length === category.vaccines.length
                    const allNotAdministered =
                      category.vaccines.filter(
                        (vaccine) =>
                          vaccine.status !== 'completed' &&
                          !lockVaccine(
                            vaccine?.adminRange?.start,
                            patientData.birthDate
                          )
                      )?.length === category.vaccines.length

                    return (
                      <>
                        <dt>
                          <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                            <div className="flex w-full justify-between px-10">
                              <span>
                                <span className="flex items-center">
                                  {formatCardTitle(category.category)}
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
                                            ? 'red'
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
                                      dispatch(setAEFIVaccines(administered))
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
                            dataSource={category.vaccines}
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
          ))
        ) : (
          <div className="my-10 mx-auto flex justify-center">
            <Loader />
          </div>
        )}
      </div>
    </>
  )
}
