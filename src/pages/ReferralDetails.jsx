import { Button, Descriptions } from 'antd'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../common/spinners/LoadingArrows'
import useReferral from '../hooks/useReferral'
import { titleCase } from '../utils/methods'

export default function ReferralDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { getReferralById, loading, referral } = useReferral()

  useEffect(() => {
    getReferralById(id)
  }, [id])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
          <div className="text-2xl font-semibold py-5">Referral Details</div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-7 px-10 py-10">
            <Descriptions
              title="Referral Details"
              bordered
              column={1}
              size="small"
              labelStyle={{ fontWeight: 'bold', color: '#163C94' }}
            >
              <Descriptions.Item label="Referring CHP">
                {referral?.requester?.display || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Vaccine Referred">
                {referral?.reasonCode?.[0]?.text || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Details">
                {referral?.note?.[0]?.text || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Schedule Details"
              bordered
              column={1}
              size="small"
              labelStyle={{ fontWeight: 'bold', color: '#163C94' }}
            >
              <Descriptions.Item label="Date of Referral">
                {moment(referral?.authoredOn).format('DD-MM-YYYY') || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled Vaccine Date">
                {moment(referral?.occurrencePeriod?.start).format(
                  'DD-MM-YYYY'
                ) || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Date Vaccine Administered">
                {moment(referral?.occurrencePeriod?.end).format('DD-MM-YYYY') ||
                  'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Health Facility Referred to">
                {titleCase(referral?.performer?.[0]?.display) || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <Button onClick={() => navigate(-1)} type="primary" className="mr-4">
            Back
          </Button>
        </div>
      </div>
    </>
  )
}
