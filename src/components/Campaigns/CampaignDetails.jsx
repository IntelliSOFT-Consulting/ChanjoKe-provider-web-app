import { Button, Descriptions } from 'antd'
import Loading from '../../common/spinners/LoadingArrows'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  convertCamelCaseString,
  capitalizeFirstLetter,
} from '../../utils/methods'
import useCampaign from '../../hooks/useCampaigns'
import dayjs from 'dayjs'

export default function CampaignDetails() {
  const navigate = useNavigate()
  const { campaignID } = useParams()
  const { loading, campaign, fetchCampaign } = useCampaign()
  const [details, setDetails] = useState({})

  useEffect(() => {
    fetchCampaign(campaignID)
  }, [campaignID])

  useEffect(() => {
    setDetails({
      'Campaign Name': campaign?.title,
      County: capitalizeFirstLetter(
        campaign?.category?.[0]?.coding?.[0]?.display
      ),
      'Sub-County': capitalizeFirstLetter(
        campaign?.category?.[0]?.coding?.[1]?.display
      ),
      'Start Date': dayjs(campaign?.period?.start).format('DD-MM-YYYY'),
      'End Date': dayjs(campaign?.period?.end).format('DD-MM-YYYY'),
      Diseases: campaign?.activity
        ?.map(
          (activity) =>
            activity?.detail?.productCodeableConcept?.coding?.[0]?.display
        )
        .join(', '),
    })
  }, [campaign])
  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
            <div className="text-3xl">{campaign?.title} Campaign</div>
            <div className="right-0">
              <Button
                type="primary"
                onClick={() => navigate(`/new-campaign/${campaignID}`)}
                className="ml-4 font-semibold px-10"
              >
                Edit
              </Button>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-7">
              {/* Column 1 */}
              <div>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  className="w-full"
                >
                  {['Campaign Name', 'County', 'Diseases'].map((key) => (
                    <Descriptions.Item
                      key={key}
                      label={convertCamelCaseString(key)}
                      labelStyle={{ fontWeight: 'bold', color: 'black' }}
                    >
                      {details[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>

              <div>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  className="w-full"
                >
                  {['Start Date', 'End Date'].map((key) => (
                    <Descriptions.Item
                      key={key}
                      label={convertCamelCaseString(key)}
                      labelStyle={{ fontWeight: 'bold', color: 'black' }}
                    >
                      {details[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 flex justify-end mx-9">
            <Button
              onClick={() => navigate(-1)}
              className="ml-4  border-1 border-primary text-primary"
            >
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
