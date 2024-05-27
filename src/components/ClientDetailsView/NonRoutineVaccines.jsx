import { Disclosure } from '@headlessui/react'
import { PlusOutlined } from '@ant-design/icons'
import { Badge, Button, Checkbox, Tag, FloatButton, Popconfirm } from 'antd'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OptionsDialog from '../../common/dialog/OptionsDialog'
import { setSelectedVaccines } from '../../redux/actions/vaccineActions'
import { formatCardTitle } from '../../utils/methods'
import { datePassed } from '../../utils/validate'
import Table from '../DataTable'
import { colorCodeVaccines, isQualified, outGrown } from './vaccineController'
import SelectDialog from '../../common/dialog/SelectDialog'
import useVaccination from '../../hooks/useVaccination'
import moment from 'moment'

export default function NonRoutineVaccines({
  userCategory,
  patientData,
  nonRoutineVaccines,
  patientDetails,
  immunizations,
  fetchData,
}) {
  const [vaccinesToAdminister, setVaccinesToAdminister] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectAefi, setSelectAefi] = useState(false)

  const navigate = useNavigate()
  const selectedVaccines = useSelector((state) => state.selectedVaccines)

  const dispatch = useDispatch()

  const { updateImmunization } = useVaccination()

  const deleteImmunization = async (id) => {
    const immunization = immunizations?.find((entry) => entry.id === id)

    immunization.status = 'entered-in-error'
    await updateImmunization(immunization)
    fetchData()
  }

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
            name={record.vaccine}
            value={record.vaccine}
            defaultChecked={completed}
            className="tooltip"
            disabled={
              !isQualified(allVaccines, record) || outGrown(record?.lastDate)
            }
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
                : text === 'Not Administered'
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
              : text === 'Not Administered'
              ? 'Not Administered'
              : text === 'Contraindicated'
              ? 'Contraindicated'
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
              navigate(`/view-vaccination/${record?.id}`)
            }}
            type="link"
            className="font-bold text=[#173C94]"
          >
            View
          </Button>
          {record.status === 'completed' && (
            <Popconfirm
              title="Are you sure you want to delete this record?"
              onConfirm={() => deleteImmunization(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
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
      <div className="overflow-hidden rounded-lg bg-white px-10 pb-12 pt-5 mt-2 shadow container sm:pt-6">
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
                                      setSelectAefi(true)
                                    }}
                                    type="link"
                                  >
                                    AEFIs
                                  </Button>
                                ) : (
                                  <PlusOutlined
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
