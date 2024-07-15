import { Button, Descriptions } from 'antd'
import Loading from '../../common/spinners/LoadingArrows'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { convertCamelCaseString } from '../../utils/methods'

export default function CampaignDetails () {

  const navigate = useNavigate()
  const [details, setDetails] = useState({})

  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setDetails({
      'Campaign Name': 'Polio',
      'County': 'Bungoma',
      'Sub-County': 'Bungoma Sub County',
      'Ward': 'Some ward',
      'Start Date': '12 Mar 2023',
      'End Date': '14 Sep 2024',
      'Facility': 'Some picked facility'
    })
  }, [])
  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      {loader ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
            <div className="text-3xl">Polio Campaign</div>
            <div className="right-0">
              <Button
                type="primary"
                onClick={() => navigate('/new-campaign')}
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
                  {[
                    'Campaign Name',
                    'County',
                    'Sub-County',
                    'Ward',
                  ].map((key) => (
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
                  {[
                    'Start Date',
                    'End Date',
                    'Facility',
                  ].map((key) => (
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