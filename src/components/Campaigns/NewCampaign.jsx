import { Form, Input, Button, Row, Col, DatePicker, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useLocations } from '../../hooks/useLocation'
import useCampaign from '../../hooks/useCampaigns'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useState, useEffect } from 'react'
import { uniqueVaccineOptions } from '../../data/vaccineData'

export default function NewCampaign() {
  const [form] = Form.useForm()
  const { campaignID } = useParams()

  const {
    counties,
    subCounties,
    wards,
    facilities,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  } = useLocations(form)
  const { createCampaign, fetchCampaign, campaign, updateCampaign } =
    useCampaign()
  const navigate = useNavigate()

  const [isDialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (campaignID !== '0') {
      fetchCampaign(campaignID)
    }
  }, [])

  useEffect(() => {
    if (campaignID !== '0') {
      form.setFieldValue('campaignName', campaign?.title)
      form.setFieldValue('startDate', dayjs(campaign?.period?.start))
      form.setFieldValue('endDate', dayjs(campaign?.period?.end))
      form.setFieldValue(
        'county',
        campaign?.category?.[0]?.coding?.[0]?.display
      )
      form.setFieldValue(
        'subCounty',
        campaign?.category?.[0]?.coding?.[1]?.display
      )
      const targetDiseases = campaign?.activity?.map(
        (activity) =>
          activity?.detail?.productCodeableConcept?.coding?.[0]?.display
      )
      form.setFieldValue('targetDisease', targetDiseases)
    }
  }, [campaign])

  const saveCampaign = (values) => {
    const [startDate, endDate] = values.period
    const formattedStartDate = startDate.format('YYYY-MM-DD')
    const formattedEndDate = endDate.format('YYYY-MM-DD')
    values.targetDiseases = values.targetDisease?.map((disease) => {
      const uniqueVaccine = uniqueVaccineOptions?.find(
        (option) => option.disease === disease
      )
      return {
        coding: [
          {
            code: uniqueVaccine?.nhddCode,
            display: disease,
          },
        ],
        text: uniqueVaccine?.label?.replace('bOPV', 'OPV'),
      }
    })

    if (campaignID === '0') {
      createCampaign({
        ...values,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })

      setDialogOpen(true)

      setTimeout(() => {
        setDialogOpen(false)
        navigate('/campaigns')
      }, 2000)
    } else {
      updateCampaign(campaignID, { id: campaignID, ...values }, 'active')
      setDialogOpen(true)

      setTimeout(() => {
        setDialogOpen(false)
        navigate('/campaigns')
      }, 2000)
    }
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description={
          <div className="font-normal">
            <p>
              {campaignID === '0'
                ? 'Campaign Saved Successfully'
                : 'Campaign Updated'}
            </p>
          </div>
        }
        onClose={() => navigate('/campaigns')}
        cancelText="Save"
      />

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white sm:mt-1 shadow md:mt-5">
        <div className="flex justify-between px-4 text-2xl py-5 sm:px-14">
          <div className="text-3xl">
            {campaignID === '0' ? 'Create a Campaign' : 'Edit Campaign'}
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={(e) => saveCampaign(e)}>
          <div className="sm:px-14 py-2 sm:py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              <Form.Item
                name="campaignName"
                label="Campaign Name"
                rules={[
                  {
                    required: true,
                    message: 'Add a campaign name',
                  },
                ]}
              >
                <Input placeholder="Campaign Name" />
              </Form.Item>

              <Form.Item
                name="period"
                label="Campaign Period"
                rules={[
                  {
                    required: true,
                    message: 'Select a campaign period',
                  },
                ]}
              >
                <DatePicker.RangePicker
                  disabledDate={(current) => {
                    return current && current < dayjs().subtract(1, 'day')
                  }}
                  format={'DD-MM-YYYY'}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                name="targetDisease"
                label="Target Disease(s)"
                rules={[
                  {
                    required: true,
                    message: 'Select at least one target disease',
                  },
                ]}
              >
                <Select
                  placeholder="Select a Target Disease(s)"
                  options={uniqueVaccineOptions
                    ?.filter(
                      (disease, index, self) =>
                        index ===
                        self.findIndex((t) => t.disease === disease.disease)
                    )
                    .map((disease) => ({
                      value: disease.disease,
                      label: disease.disease,
                    }))}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  mode="multiple"
                  maxTagCount="responsive"
                />
              </Form.Item>
              <Form.Item
                name="county"
                label="County"
                rules={[
                  {
                    required: true,
                    message: 'Select a county',
                  },
                ]}
              >
                <Select
                  placeholder="County"
                  onChange={(value, data) => {
                    handleCountyChange(value)
                    form.setFieldValue('county', data?.label)
                  }}
                  options={counties?.map((county) => ({
                    value: county.key,
                    label: county.name,
                  }))}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Form.Item>

              <Form.Item
                name="subCounty"
                label="Sub-County"
                rules={[
                  {
                    required: true,
                    message: 'Add a subcounty',
                  },
                ]}
              >
                <Select
                  placeholder="Subcounty"
                  onChange={handleSubCountyChange}
                  options={subCounties?.map((subCounty) => ({
                    value: subCounty.key,
                    label: subCounty.name,
                  }))}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Form.Item>
            </div>

            <div className="px-4 py-4 sm:px-6 flex justify-end">
              <Button
                onClick={() => navigate(-1)}
                className="ml-4 outline outline-[#163C94] rounded-md px-5 outline-2"
              >
                Back
              </Button>
              <Button
                htmlType="submit"
                className="ml-4 outline outline-[#4e8d6e] rounded-md px-5 bg-[#4e8d6e] outline-2 text-white"
              >
                {campaignID === '0' ? 'Save' : 'Update'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}
