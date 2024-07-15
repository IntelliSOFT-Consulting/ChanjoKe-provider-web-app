// import SearchTable from '../../common/tables/SearchTable'
import { useNavigate, Link } from 'react-router-dom'
import { Col, Row, Button, DatePicker, Spin, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import useAppointment from '../../hooks/useAppointment'
import Table from '../DataTable'
import dayjs from 'dayjs'
import { getOffset } from '../../utils/methods'
import useVaccination from '../../hooks/useVaccination'

export default function VaccineAppointments({ userCategory, patientData, patientDetails }) {
  const {
    loader,
    appointments,
    totalAppointments,
    getPatientAppointments,
    updateAppointment,
  } = useAppointment()
  const { immunizations, getImmunizations} = useVaccination()

  const [unvaccinatedAppointments, setUnvaccinatedAppointments] = useState([])

  const handleActionBtn = async (payload) => {
    await updateAppointment(payload?.id, { ...payload, status: 'cancelled', resourceType: 'Appointment' })
    getPatientAppointments(patientData?.id)
  }

  const navigate = useNavigate()

  useEffect(() => {
    getPatientAppointments(patientData?.id)
    getImmunizations(patientData?.id)
  }, [userCategory])

  useEffect(() => {
    fetchVaccinations()
  }, [immunizations, appointments])

  const fetchVaccinations = () => {
    if (Array.isArray(immunizations) && immunizations.length > 0) {
      const completedImmunizations = immunizations.filter((immunization) => immunization.status === 'completed')
      const immunizedAppointments = completedImmunizations.map((item) => item?.vaccineCode?.text)
      const filtered = appointments.filter((appointment) => !immunizedAppointments.includes(appointment.appointments))
      setUnvaccinatedAppointments(filtered)
    } else {
      setUnvaccinatedAppointments(appointments)
    }
  }

  const updateAppointmentURL = (page) => {
    const offset = getOffset(page, 5)
    getPatientAppointments(patientData?.id, offset)
  }

  const columns = [
    {
      title: 'Appointments',
      dataIndex: 'appointments',
      key: 'appointments',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (_, record) => {
        if (record?.status === 'Booked') {
          return (
            <>
              <Link
                to={`/edit-appointment/${record?.id}/${patientData?.id}`}
                className="text-[#163C94] font-semibold"
              >
                Edit
              </Link>
              <Popconfirm
                title="Are you sure you want to cancel?"
                onConfirm={() => handleActionBtn(record)}
                okText="Yes"
                cancelText="No">
                <button className={`px-2 py-1 text-red-400`}>
                  Cancel
                </button>
              </Popconfirm>
            </>
          )
        }
      }
    },
  ]
  

  return (
    
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <Row
        gutter={16}
        className='mb-10 px-8'>
        <Col
          md={12}
          sm={24}>
          <DatePicker
            format={'DD-MM-YYYY'}
            onChange={(e) => {
              if (e) {
                const time = dayjs(e).format('DD-MM-YYYY')
                const filteredAppointments = unvaccinatedAppointments.filter((appointment) => appointment.appointmentDate === time)
                setUnvaccinatedAppointments(filteredAppointments)
              } else {
                fetchVaccinations()
              }
            }}/>
        </Col>
        <Col
          md={12}
          sm={24}
          className='grid'>
          <Button
            onClick={() => navigate(`/new-appointment/${patientData.id}`)}
            className="ml-4 place-self-end font-semibold"
            type="primary">
            New Appointment
          </Button>
        </Col>
      </Row>

      {loader && 
        <div className='text-center'>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 56,
                }}
                spin
              />
              }
            />
        </div>
        }

      {!loader && unvaccinatedAppointments.length > 0 &&
        <Table
          columns={columns}
          dataSource={unvaccinatedAppointments}
          size="small"
          loading={loader}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            hideOnSinglePage: true,
            showTotal: (total) => `Total ${total} items`,
            total: totalAppointments - 1,
            onChange: (page) => updateAppointmentURL(page),
          }}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-400 text-sm my-2">
                  No Appointments Made
                </p>
              </div>
            ),
          }}
        />
      }

      {!loader && appointments.length < 1 && <><p className='text-center'>No appointments made</p></>}

    </div>
  )
}