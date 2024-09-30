import { Form } from '@ant-design/compatible';
import { Input } from 'antd';

export default function FormInput({ label, placeholder, name, rules, form }) {
  const { getFieldDecorator } = form;

  return (
    <Form.Item label={label}>
      {getFieldDecorator(name, {
        rules: rules,
      })(<Input placeholder={placeholder} />)}
    </Form.Item>
  );
}