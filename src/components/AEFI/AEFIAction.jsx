import { useNavigate } from 'react-router-dom'
import { Col, Row, Form, Input, Select } from 'antd'
import { useSharedState } from '../../shared/sharedState'
import ConfirmDialog from '../../common/dialog/ConfirmDialog'
import { useState } from 'react'


const { TextArea } = Input

export default function AEFIAction() {
  const aefiOutcomes = [
    { name: 'Recovered', value: 'Recovered' },
    { name: 'Recovering', value: 'Recovering' },
    { name: 'Not Recovered', value: 'Not Recovered' },
    { name: 'Unknown', value: 'Unknown' },
    { name: 'Died', value: 'Died' },
  ]

  const [form] = Form.useForm()

  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const { sharedData } = useSharedState()

  const onFinish = (values) => {
    setDialogOpen(true)

    const vaccinesToAEFI = sharedData?.vaccinesToAdminister

    const aefiDetails = sharedData?.aefiDetails

    console.log({ vaccinesToAEFI, aefiDetails, values })

    // Create a list of observations based off every single input

    vaccinesToAEFI.map((vaccine) => {
      const AEFI = {
        'Type of AEFI': aefiDetails.aefiType,
        'Onset of event': aefiDetails.aefiOnset.$d,
        'Brief Details on the AEFI': aefiDetails.aefiDetails,
        'Past medical history': aefiDetails.aefiMedicalHistory,
        'Reaction severity': values.reactionSeverity,
        'Action taken': values.actionTaken,
        'AEFI Outcome': values.aefiOutcome,
        'Name of person reporting': values.reporter,
        'Phone Number': values.phoneNumber,
        'Health Care Worker Name': values.healthCareWorkerName,
        Designation: values.designation,
      }
    })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    // Navigate back to user page
  }

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        description="AEFI Recorded"
        onClose={handleDialogClose}
      />

      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          <h3 className="text-xl font-medium">
            Adverse Event Following Immunisation
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <Form
            onFinish={onFinish}
            layout="vertical"
            form={form}
            autoComplete="off"
          >
            <Row className="mt-5 px-6" gutter={16}>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  name="actionTaken"
                  label={
                    <div>
                      <span className="font-bold">Action taken</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Action taken on AEFI',
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={12}>
                <Form.Item
                  name="aefiOutcome"
                  label={
                    <div>
                      <span className="font-bold">AEFI Outcome</span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Add AEFI Outcome!',
                    },
                  ]}
                >
                  <Select size="large">
                    {aefiOutcomes.map((option) => (
                      <Select.Option value={option.value}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div className="px-4 py-4 sm:px-6 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back
              </button>
              {/* <button
                className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Preview
              </button> */}
              <button className="ml-4 flex-shrink-0 rounded-md bg-[#0b7114] border border-[#0b7114] outline outline-[#0b7114] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0b7114] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b7114]">
                Submit
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
