import { Form, Input, Button, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function NewCampaign() {

  const navigate = useNavigate()

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
      <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
        <div className="text-3xl">Create a Campaign</div>
      </div>

      <Form
         layout="vertical">

        <div className="sm:px-14 py-2 sm:py-5 sm:p-6">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="campaignName"
                label={
                  <div>
                    <span className="font-bold pl-1">Campaign Name</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Add a campaign name',
                  },
                ]}>
                <Input
                  placeholder='Name'/>
              </Form.Item>

              <Form.Item
                name="county"
                label={
                  <div>
                    <span className="font-bold pl-1">County</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Select a county',
                  },
                ]}>
                <Input
                  placeholder='County'/>
              </Form.Item>

              <Form.Item
                name="facility"
                label={
                  <div>
                    <span className="font-bold pl-1">Facility</span>
                  </div>
                }>
                <Input
                  placeholder='Facility'/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label={
                  <div>
                    <span className="font-bold pl-1">Start Date</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Add a campaign start date',
                  },
                ]}>
                <Input
                  placeholder='Start Date'/>
              </Form.Item>

              <Form.Item
                name="campaignName"
                label={
                  <div>
                    <span className="font-bold pl-1">Sub-County</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Add a subcounty',
                  },
                ]}>
                <Input
                  placeholder='Sub-County'/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label={
                  <div>
                    <span className="font-bold pl-1">End Date</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Add a campaign end date',
                  },
                ]}>
                <Input
                  placeholder='End Date'/>
              </Form.Item>

              <Form.Item
                name="ward"
                label={
                  <div>
                    <span className="font-bold pl-1">Ward</span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Ward',
                  },
                ]}>
                <Input
                  placeholder='Ward'/>
              </Form.Item>
            </Col>
          </Row>

          <hr />

          <div className="px-4 py-4 sm:px-6 flex justify-end">
              <Button
                htmlType="submit"
                onClick={() => navigate('/campaign/campaignid')}
                className='ml-4 outline outline-[#4e8d6e] rounded-md px-5 bg-[#4e8d6e] outline-2 text-white'>
                Save
              </Button>
            </div>
        </div>

      </Form>
    </div>
  )
}