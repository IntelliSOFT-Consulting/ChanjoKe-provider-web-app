import { Button, Card, Form, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { campaignSites } from '../../data/options/campaigns'
import useCampaign from '../../hooks/useCampaigns'
import { useEffect } from 'react'

export default function CampaignSite() {
  const navigate = useNavigate()

  const { campaignID } = useParams()
  const { campaign, fetchCampaign } = useCampaign()

  useEffect(() => {
    fetchCampaign(campaignID)
  }, [campaignID])

  const handleSubmit = ({ campaignSite }) => {
    localStorage.setItem(
      'campaign',
      JSON.stringify({
        campaignSite,
        campaignID,
        title: campaign?.title,
      })
    )
    navigate(`/search/administerVaccine/${campaignSite}`, {
      state: {
        campaignID,
      },
    })
  }
  return (
    <Card title="Campaigns" className="mt-5" size="small">
      <Form
        className="mx-2 sm:mx-10 py-2 sm:py-5"
        autoComplete="off"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="campaignSite"
          label="Campaign Site"
          rules={[{ required: true, message: 'Please select a site' }]}
        >
          <Select
            placeholder="Select a site"
            options={campaignSites}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        <div className="py-4 flex justify-end">
          <Button onClick={() => navigate(-1)}>Back</Button>
          <Button htmlType="submit" type="primary" className="ml-4">
            Next
          </Button>
        </div>
      </Form>
    </Card>
  )
}
