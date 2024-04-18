import { Form, Input, Select, Space } from 'antd'
import { caregiverTypes } from '../../data/options/clientDetails'
import { countryCodes } from '../../data/countryCodes'

export default function CaregiverDetails({ form }) {
  return (
    <div>
      <h3 className="text-xl font-medium mb-6">Caregiver Details</h3>

      <Form.List name="caregiver" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                className={`grid gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ${key !== 0 ? 'border-t pt-4' : ''}`}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'caregiverType']}
                  label="Caregiver Type"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the caregiver type',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select Caregiver Type"
                    options={caregiverTypes}
                    showSearch
                    searchable
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'caregiverName']}
                  label="Caregiver Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the caregiver name',
                    },
                  ]}
                >
                  <Input
                    placeholder="eg John Doe"
                    autoComplete="off"
                    className="block w-full rounded-md py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400"
                  />
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  {...restField}
                  name={[name, 'phoneNumber']}
                  rules={[
                    {
                      pattern: /^(\+?)([0-9]{7,15})$/,
                      message: 'Please enter a valid phone number!',
                    },
                  ]}
                  className="mb-0"
                >
                  <Input
                    placeholder="7xxxxxxxx"
                    size="large"
                    addonBefore={
                      <Form.Item
                        {...restField}
                        name={[name, 'phoneCode']}
                        noStyle
                      >
                        <Select
                          size="large"
                          style={{ width: 120 }}
                          showSearch
                          options={countryCodes}
                          defaultValue={'+254'}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="Code"
                        />
                      </Form.Item>
                    }
                    onChange={(e) => {
                      if (e.target.value.length > 9) {
                        form.setFieldValue(
                          ['caregiver', key, 'phoneNumber'],
                          e.target.value.slice(0, 9)
                        )
                      }
                    }}
                  />
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <button
                type="button"
                onClick={() => add()}
                className="bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Add Caregiver
              </button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  )
}
