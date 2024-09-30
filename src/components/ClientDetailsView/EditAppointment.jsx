import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Col, Row, DatePicker, Button } from 'antd'
import useVaccination from '../../hooks/useVaccination'
import useAppointment from '../../hooks/useAppointment'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

export default function EditAppointment() {
  const { appointmentID, userID } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { user } = useSelector((state) => state.userInfo)

  const [isDialogOpen, setDialogOpen] = useState(false)

  const {
    appointment,
    loader,
    facilityAppointments,
    getAppointment,
    updateAppointment,
    getFacilityAppointments,
  } = useAppointment()
  const { recommendations, updateRecommendations, getRecommendations } =
    useVaccination()

  const fetchAppointment = async () => {
    await getAppointment(appointmentID)
  }

  const onFinish = async (values) => {
    const datedd = dayjs(values?.appointmentDate).format('YYYY-MM-DDTHH:mm:ssZ')
    await updateAppointment(appointmentID, {
      ...appointment,
      start: datedd,
      status: 'booked',
      participant: [
        {
          actor: {
            reference: `Practitioner/${user?.fhirPractitionerId}`,
          },
        },
        {
          actor: {
            reference: `${user?.orgUnit?.code}`,
          },
        },
        {
          actor: {
            reference: `Patient/${userID}`,
          },
        },
      ],
    })
    setDialogOpen(true)

    const recs = recommendations?.recommendation

    const newRecomendations = recs.map((recommendation) => {
      if (recommendation?.vaccineCode?.[0]?.text === appointment.description) {
        recommendation.dateCriterion[0].value = dayjs(
          values?.appointmentDate,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD')

        return recommendation
      } else {
        return recommendation
      }
    })

    recommendations.recommendation = newRecomendations

    await updateRecommendations(recommendations)

    setTimeout(() => {
      setDialogOpen(false)
      navigate(-1)
    }, 2000)
  }

  useEffect(() => {
    form.setFieldValue('scheduledDate', dayjs(appointment?.created))
    form.setFieldValue('appointmentDate', dayjs(appointment?.start))
    getFacilityAppointments(dayjs(appointment?.start).format('YYYY-MM-DD'))
  }, [appointment])

  useEffect(() => {
    fetchAppointment()
    getRecommendations(userID)
  }, [])

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={
          <div className="font-normal">
            <p>Appointment successfully rescheduled!</p>
          </div>
        }
        onClose={() => {
          navigate(-1)
        }}
      />

      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 rounded-lg px-4 sm:flex-nowrap sm:px-6 lg:px-8 shadow py-4">
          <h3 className="text-xl font-medium">Edit Appointment</h3>
          <h2 className="ml-auto flex items-center gap-x-1 ">
            <span className="font-bold">Number of Appointments: </span>
            <span>{facilityAppointments?.length || 0}</span>
          </h2>
        </div>

        <Form
          onFinish={onFinish}
          layout="vertical"
          form={form}
          autoComplete="off"
        >
          <Row className="mt-5 px-6" gutter={16}>
            <Col className="gutter-row" span={12}>
              <h3 className="text-1xl font-bold mt-10">
                {appointment?.description}
              </h3>
            </Col>

            <Col className="gutter-row" span={6}>
              <Form.Item
                name="scheduledDate"
                label={
                  <div>
                    <span className="font-bold pl-1">Scheduled Date</span>
                  </div>
                }
              >
                <DatePicker
                  format={'DD-MM-YYYY'}
                  disabled
                  className="w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                />
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={6}>
              <Form.Item
                name="appointmentDate"
                label={
                  <div>
                    <span className="font-bold pl-1">Appointment Date</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Add appointment date',
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(current) => {
                    const today = dayjs()
                    return current && current < today
                  }}
                  onChange={(e) => {
                    getFacilityAppointments(dayjs(e).format('YYYY-MM-DD'))
                  }}
                  format={'DD-MM-YYYY'}
                  className="w-full rounded-md border-0 py-2.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <Button
              onClick={() => navigate(-1)}
              className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              loading={loader}
              className="ml-4 outline outline-[#163C94] rounded-md px-5 bg-[#163C94] outline-2 text-white"
            >
              Update
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
