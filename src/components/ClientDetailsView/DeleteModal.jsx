import { Modal, Button, Form, Select } from 'antd'
import { useState } from 'react'

const DeleteModal = ({ immunization, onCancel, onOk }) => {
  const [isOther, setIsOther] = useState(false)

  const [form] = Form.useForm()
  const reasons = [
    'Patient request',
    'Incorrect information',
    'Duplicate',
    'Other',
  ]
  return (
    <Modal
      title="Please confirm immunization deletion"
      open={immunization}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Delete
        </Button>,
      ]}
    >
      <Form onFinish={onOk} form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Reason for deletion"
          rules={[
            { required: true, message: 'Please select a reason for deletion' },
          ]}
        >
          <Select
            showSearch
            allowClear
            onChange={(value) => setIsOther(value === 'Other')}
          >
            {reasons.map((reason) => (
              <Select.Option key={reason} value={reason}>
                {reason}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {isOther && (
          <Form.Item
            name="otherReason"
            label="Other reason"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('reason') === 'Other' && !value) {
                    return Promise.reject('Please provide a reason')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Textarea rows={3} placeholder="Please provide a reason" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default DeleteModal
