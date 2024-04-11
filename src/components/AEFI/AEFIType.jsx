import { DatePicker, Form, Input, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSharedState } from '../../shared/sharedState';

export default function AEFIType() {
  const aefiTypes = [
    { id: 1, label: 'High fever', value: 'High fever' },
    { id: 2, label: 'Convulsions', value: 'Convulsions' },
    { id: 3, label: 'Anaphylaxis', value: 'Anaphylaxis' },
    { id: 4, label: 'Paralysis', value: 'Paralysis' },
    { id: 5, label: 'Toxic shock', value: 'Toxic shock' },
    { id: 6, label: 'Injection site abcess', value: 'Injection site abcess' },
    { id: 7, label: 'Severe local reaction', value: 'Severe local reaction' },
    {
      id: 8,
      label: 'Generalized urticaria (hives)',
      value: 'Generalized urticaria (hives)',
    },
    { id: 9, label: 'BCG Lymphadentitis', value: 'BCG Lymphadentitis' },
    {
      id: 9,
      label: 'Encaphalopathy/Menengitis',
      value: 'Encaphalopathy/Menengitis',
    },
  ]

  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { sharedData, setSharedData } = useSharedState()

  const onFinish = (values) => {
    setSharedData({ ...sharedData, aefiDetails: values })
    navigate('/aefi-action')
  };

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
          <h3 className="text-xl font-medium">
            Adverse Event Following Immunisation
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onFinish}
          >
            <div className="grid mt-5 grid-cols-2 gap-10">
              {/* Column 1 */}
              <div>
                <Form.Item
                  label="Type of AEFI"
                  name="aefiType"
                  rules={[
                    { required: true, message: 'Please select a type of AEFI' },
                  ]}
                >
                  <Select
                    placeholder="Select Type of AEFI"
                    options={aefiTypes}
                  />
                </Form.Item>

                <Form.Item
                  label="Brief details on the AEFI"
                  name="aefiDetails"
                  rules={[
                    {
                      required: true,
                      message: 'Please provide brief details on the AEFI',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Brief details on the AEFI"
                  />
                </Form.Item>
              </div>

              {/* Column 2 */}
              <div>
                <Form.Item
                  label="Onset of event"
                  name="eventOnset"
                  rules={[
                    {
                      required: true,
                      message: 'Please provide the onset of event',
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Onset of event"
                  />
                </Form.Item>

                <Form.Item
                  label="Past Medical History"
                  name="pastMedicalHistory"
                  rules={[
                    {
                      required: true,
                      message: 'Please provide past medical history',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Past Medical History" />
                </Form.Item>
              </div>
            </div>
          </Form>

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back
            </button>
            <button
              onClick={() => {
                form.submit()
              }}
              className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
