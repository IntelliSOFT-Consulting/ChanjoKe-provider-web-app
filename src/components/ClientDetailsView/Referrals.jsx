import { useEffect, useState, useCallback, useMemo } from 'react'
import Table from '../DataTable'
import useReferral from '../../hooks/useReferral'
import { Button } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

function ReferralsTable({
  loading,
  columns,
  dataSource,
  currentPage,
  onChangePage,
  total,
}) {
  return (
    <Table
      loading={loading}
      columns={columns}
      size="small"
      dataSource={dataSource}
      pagination={{
        current: currentPage,
        onChange: onChangePage,
        total: total,
      }}
      rowKey="id"
    />
  )
}

export default function Referrals() {
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const { clientID } = useParams()
  const { getPatientReferrals, referrals, loading } = useReferral()

  useEffect(() => {
    getPatientReferrals(clientID, currentPage)
  }, [clientID, currentPage])

  const onChangePage = useCallback((page) => setCurrentPage(page), [])

  const columns = useMemo(
    () => [
      {
        title: 'Referring CHP',
        dataIndex: 'requester',
        key: 'requester',
        render: (_text, record) => record?.requester?.display || 'N/A',
      },
      {
        title: 'Vaccine Referred',
        dataIndex: 'reasonCode',
        key: 'reasonCode',
        render: (_text, record) => record?.reasonCode?.[0]?.text || 'N/A',
      },
      {
        title: 'Date of Referral',
        dataIndex: 'authoredOn',
        key: 'authoredOn',
        render: (_text, record) =>
          moment(record?.authoredOn).format('DD-MM-YYYY') || 'N/A',
      },
      {
        title: 'Date Administered',
        dataIndex: 'occurrencePeriod',
        key: 'occurrencePeriod',
        render: (_text, record) =>
          moment(record?.occurrencePeriod?.start).format('DD-MM-YYYY') || 'N/A',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_text, record) => (
          <Button
            onClick={() => navigate(`/referral-details/${record.id}`)}
            type="link"
          >
            View
          </Button>
        ),
      },
    ],
    [navigate]
  )

  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 mt-2 shadow sm:px-6 sm:pt-6">
      <ReferralsTable
        loading={loading}
        columns={columns}
        dataSource={referrals?.data || []}
        currentPage={currentPage}
        onChangePage={onChangePage}
        total={referrals?.total}
      />
    </div>
  )
}
