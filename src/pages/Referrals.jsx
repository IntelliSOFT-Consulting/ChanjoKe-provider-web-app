import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Input, DatePicker } from 'antd'
import Table from '../components/DataTable'
import useReferral from '../hooks/useReferral'
import usePatient from '../hooks/usePatient'
import { useSelector } from 'react-redux'
import { debounce } from '../utils/methods'
import { data } from 'autoprefixer'

export default function Referrals() {
  const [referralData, setReferralData] = useState(null)
  const [data, setData] = useState([])
  const { user } = useSelector((state) => state.userInfo)

  const { getReferralsToFacility, referrals } = useReferral()
  const { searchPatients } = usePatient()

  const navigate = useNavigate()

  const [form] = Form.useForm()

  const formatReferralData = (referrals, patients) => {
    const data = referrals.map((referral) => {
      const patient = patients?.find(
        (patient) => patient.id === referral.subject.reference.split('/')[1]
      )
      return {
        id: referral.id,
        patientName: `${patient?.name[0].given[0]} ${patient?.name[0].family}`,
        patientId: patient?.identifier[0].value,
        phone: patient?.telecom[0].value,
        patientResourceId: patient?.id,
      }
    })

    setData(data)
    setReferralData(data)
  }

  const getPatientsByIds = async () => {
    const patientIds = referrals?.data?.map(
      (referral) => referral.subject.reference.split('/')[1]
    )
    const uniquePatientIds = [...new Set(patientIds)]
    const query = `_id=${uniquePatientIds.join(',')}`
    const patients = await searchPatients(query)
    formatReferralData(
      referrals?.data,
      patients?.entry?.map((entry) => entry.resource)
    )
  }

  useEffect(() => {
    getReferralsToFacility(user?.facility)
  }, [user])

  useEffect(() => {
    if (referrals?.data) {
      getPatientsByIds()
    }
  }, [referrals])

  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'ID Number',
      dataIndex: 'patientId',
      key: 'patientId',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Actions',
      dataIndex: 'patientResourceId',
      key: 'patientResourceId',
      render: (text) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/client-details/${text}/routineVaccines?active=referrals`)
          }
        >
          View
        </Button>
      ),
    },
  ]

  const handleSearch = () => {
    const values = form.getFieldsValue()
    const params = {
      patientName: values.patientName,
      startDate: values.date?.[0]?.format('YYYY-MM-DD'),
      endDate: values.date?.[1]?.format('YYYY-MM-DD'),
    }
    const filteredData = data?.filter((referral) => {
      return (
        (!params.patientName ||
          referral.patientName
            .toLowerCase()
            .includes(params.patientName.toLowerCase()) ||
          referral.patientId.includes(params.patientName)) &&
        (!params.startDate || referral.date >= params.startDate) &&
        (!params.endDate || referral.date <= params.endDate)
      )
    })

    setReferralData(filteredData)
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
      <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
        <div className="text-2xl font-semibold py-5">Referrals</div>
      </div>

      <div className="grid grid-cols-1 gap-10 mx-7 px-10 py-10">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 ">
            <Form.Item name="date" label="Date Range" className='w-full'>
              <DatePicker.RangePicker
                onChange={() => handleSearch()}
                className='w-full'
                size="large"
              />
            </Form.Item>
            <div className="flex gap-5 md:col-span-2 w-full items-end">
              <Form.Item
                name="patientName"
                label="Search Client"
                className="w-full"
              >
                <Input
                  placeholder="Search Client"
                  onChange={debounce(() => handleSearch(), 500)}
                  allowClear
                  className="w-full"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  size="large"
                >
                  Search
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
        <Table
          size="small"
          columns={columns}
          loading={!referralData}
          dataSource={referralData}
        />
      </div>
    </div>
  )
}
