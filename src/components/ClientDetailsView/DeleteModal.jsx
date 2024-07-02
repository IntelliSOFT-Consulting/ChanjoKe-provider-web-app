import { Modal, Button, Form, Select } from 'antd'

const DeleteModal = ({ immunization, onCancel, onOk }) => {
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
          <Select showSearch allowClear>
            {reasons.map((reason) => (
              <Select.Option key={reason} value={reason}>
                {reason}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DeleteModal
