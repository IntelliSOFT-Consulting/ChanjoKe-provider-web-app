import { forwardRef } from 'react'
import {
  Input,
  Select,
  Radio,
  InputNumber,
  DatePicker,
  Form,
  Button,
} from 'antd'

const { Item: FormItem } = Form

const InputItem = forwardRef(
  ({ title, options, dataIndex, type, required = false, ...props }, ref) => {
    const renderInput = () => (
      <FormItem
        style={{ marginBottom: 0 }}
        name={dataIndex}
        rules={[{ required, message: `Please input ${title}!` }]}
      >
        <Input
          placeholder={`Enter ${title}`}
          autoComplete="off"
          {...props}
          ref={ref}
        />
      </FormItem>
    )

    const renderSelect = () => (
      <FormItem
        style={{ marginBottom: 0 }}
        name={dataIndex}
        rules={[{ required, message: `Please select ${title}!` }]}
      >
        <Select
          showSearch
          allowClear
          filterOption={(input, option) =>
            option.label
              ? option.label.toLowerCase().includes(input.toLowerCase())
              : false
          }
          placeholder={`Select ${title}`}
          {...props}
          ref={ref}
        >
          {options.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
    )

    const renderRadio = () => (
      <FormItem
        style={{ marginBottom: 0 }}
        name={dataIndex}
        rules={[{ required, message: `Please select ${title}!` }]}
      >
        <Radio.Group {...props} ref={ref}>
          {options.map(({ value, label }) => (
            <Radio key={value} value={value}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
      </FormItem>
    )

    const renderNumber = () => (
      <FormItem
        style={{ marginBottom: 0 }}
        name={dataIndex}
        rules={[{ required, message: `Please input ${title}!` }]}
      >
        <InputNumber
          placeholder={`Enter ${title}`}
          style={{ width: '100%' }}
          {...props}
          ref={ref}
        />
      </FormItem>
    )

    const renderDate = () => (
      <FormItem
        style={{ marginBottom: 0 }}
        name={dataIndex}
        rules={[{ required, message: `Please select ${title}!` }]}
      >
        <DatePicker style={{ width: '100%' }} {...props} ref={ref} />
      </FormItem>
    )

    switch (type) {
      case 'text':
        return renderInput()
      case 'select':
        return renderSelect()
      case 'radio':
        return renderRadio()
      case 'number':
        return renderNumber()
      case 'date':
        return renderDate()
      case 'button':
        return (
          <Button {...props} type='link' ref={ref}>
            {title}
          </Button>
        )
      default:
        return null
    }
  }
)

export default InputItem
