import { useEffect, useState } from 'react'
import Table from '../DataTable'
import useReferral from '../../hooks/useReferral'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export default function Referrals() {
  const [currentPage, setCurrentPage] = useState(1)

  const { user } = useSelector((state) => state.userInfo)
  const navigate = useNavigate()

  const { getReferralsToFacility, referrals, loading } = useReferral()

  useEffect(() => {
    getReferralsToFacility(user.facility, currentPage)
  }, [currentPage])

  const columns = [
    {
      title: 'Referring CHP',
      dataIndex: 'requester',
      key: 'requester',
      render: (text, record) => record?.requester?.display || 'N/A',
    },
    {
      title: 'Vaccine Referred',
      dataIndex: 'reasonCode',
      key: 'reasonCode',
      render: (text, record) => record?.reasonCode?.[0]?.text || 'N/A',
    },
    {
      title: 'Date of Referral',
      dataIndex: 'authoredOn',
      key: 'authoredOn',
      render: (text, record) =>
        moment(record?.authoredOn).format('DD-MM-YYYY') || 'N/A',
    },
    {
      title: 'Date Administered',
      dataIndex: 'occurrencePeriod',
      key: 'occurrencePeriod',
      render: (text, record) =>
        moment(record?.occurrencePeriod?.start).format('DD-MM-YYYY') || 'N/A',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          onClick={() => navigate(`/referral-details/${record.id}`)}
          type="link"
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <Table
        loading={loading}
        columns={columns}
        dataSource={referrals?.data || []}
        pagination={{
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          total: referrals?.total,
        }}
        rowKey="id"
      />
    </div>
  )
}
