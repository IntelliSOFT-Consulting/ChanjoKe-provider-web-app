import { Form, Input, Button, Row, Col, DatePicker, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useLocations } from '../../hooks/useLocation'
import useCampaign from '../../hooks/useCampaigns'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useState } from 'react'

export default function NewCampaign() {

  const [form] = Form.useForm()

  const {
    counties,
    subCounties,
    wards,
    facilities,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  } = useLocations(form)
  const { createCampaign } = useCampaign()
  const navigate = useNavigate()

  const [isDialogOpen, setDialogOpen] = useState(false)

  const saveCampaign = (values) => {
    createCampaign(values)

    setDialogOpen(true)

    setTimeout(() => {
      if (isDialogOpen === true) {
        setDialogOpen(false)
        navigate('/campaigns')
      }
    }, 2000)
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={
          <div className="font-normal">
            <p>Campaign saved successfully</p>
          </div>
        }
        onClose={() => navigate('/campaigns')}
        cancelText='Save'
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
        <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
          <div className="text-3xl">Create a Campaign</div>
        </div>

        <Form
          layout="vertical"
          onFinish={(e) => saveCampaign(e)}>

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
                  <Select
                    placeholder="County"
                    onChange={handleCountyChange}
                    options={counties?.map((county) => ({
                      value: county.key,
                      label: county.name,
                    }))}
                    size="large"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="facility"
                  label={
                    <div>
                      <span className="font-bold pl-1">Facility</span>
                    </div>
                  }>
                  <Select
                    placeholder="Facility"
                    options={facilities?.map((facility) => ({
                      value: facility.key,
                      label: facility.name,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      option?.label.toLowerCase()?.includes(input?.toLowerCase())
                    }
                    allowClear
                  />
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
                  <DatePicker
                      disabledDate={(current) => {
                        const today = dayjs()
                        return (
                          current && (current < today)
                        )
                      }}
                      format={'DD-MM-YYYY'}
                      className="w-full rounded-md border-0 py-1.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
                </Form.Item>

                <Form.Item
                  name="subCounty"
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
                  <Select
                    placeholder="Subcounty"
                    onChange={handleSubCountyChange}
                    options={subCounties?.map((subCounty) => ({
                      value: subCounty.key,
                      label: subCounty.name,
                    }))}
                    size="large"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  />
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
                  <DatePicker
                      disabledDate={(current) => {
                        const today = dayjs()
                        return (
                          current && (current < today)
                        )
                      }}
                      placeholder='End Date'
                      format={'DD-MM-YYYY'}
                      className="w-full rounded-md border-0 py-1.5 text-sm text-[#707070] ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]"
                    />
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
                  <Select
                    placeholder="Select a Ward"
                    options={wards?.map((ward) => ({
                      value: ward.key,
                      label: ward.name,
                    }))}
                    onChange={handleWardChange}
                    size="large"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <hr />

            <div className="px-4 py-4 sm:px-6 flex justify-end">
                <Button
                  htmlType="submit"
                  className='ml-4 outline outline-[#4e8d6e] rounded-md px-5 bg-[#4e8d6e] outline-2 text-white'>
                  Save
                </Button>
              </div>
          </div>

        </Form>
      </div>
    </>
  )
}