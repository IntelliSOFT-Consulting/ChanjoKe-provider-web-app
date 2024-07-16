import { Form, Select, Button } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const sites = [
  { name: 'Inside household', key: 'Inside household' },
  { name: 'Outside household', key: 'Outside household' },
  { name: 'Playground', key: 'Playground' },
  { name: 'Fixed health facility', key: 'Fixed health facility' },
  { name: 'Waterpoints', key: 'Waterpoints' },
  { name: 'Bus stations', key: 'Bus stations' },
  { name: 'Border crossing points', key: 'Border crossing points' },
]

export default function CampaignSite() {

  const navigate = useNavigate()
  const [campaignSite, setCampaignSite] = useState('')

  const handleSiteChange = (options) => {
    setCampaignSite(options)
  }

  const handleSubmit = () => {
    navigate(`/search/administerVaccine/${campaignSite}`)
  }
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
        <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
          <div className="text-3xl">Campaigns</div>
        </div>
        <div className="sm:px-4 py-2 sm:py-5 sm:p-6">
          <Form
            className="grid gap-x-4 mx-2 sm:mx-10 mb-0"
            autoComplete="off"
          >
            <div className="col-span-4">
              <Form.Item name="campaignSite">
                <Select
                    placeholder="Select a site"
                    options={sites?.map((site) => ({
                      value: site.key,
                      label: site.name,
                    }))}
                    onChange={handleSiteChange}
                    size="large"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  />
              </Form.Item>
            </div>
          </Form>
        </div>

        <div className="px-4 py-4 sm:px-14 flex justify-end">
          <Button
            onClick={() => navigate(-1)}
            className='ml-4 outline outline-[#163C94] rounded-md px-5 outline-2'>
            Back
          </Button>
          <Button
            disabled={campaignSite === ''}
            onClick={() => handleSubmit()}
            className='ml-4 outline outline-[#163C94] rounded-md px-5 bg-[#163C94] outline-2 text-white'>
            Next
          </Button>
        </div>
      </div>
  )
}