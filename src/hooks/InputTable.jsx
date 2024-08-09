import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Popconfirm, Table } from 'antd'
import InputItem from '../components/InputItem'

const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const [tempValues, setTempValues] = useState({})
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)

  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values,
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = (
      <InputItem
        ref={inputRef}
        type={
          !['text', 'number', 'select', 'date', 'radio'].includes(editable)
            ? 'button'
            : editable
        }
        value={tempValues[dataIndex] || record[dataIndex]}
        onPressEnter={save}
        onBlur={save}
        title={title}
        dataIndex={dataIndex}
        record={record}
        required={restProps.required}
        options={restProps.options}
      />
    )
  }
  return <td {...restProps}>{childNode}</td>
}
const useInputTable = () => {
  const [values, setValues] = useState([])

  const InputTable = ({ columns: defaultColumns = [] }) => {
    const [dataSource, setDataSource] = useState([
      {
        key: '0',
        vaccine: 'BCG',
        quantity: 100,
        stockQuantity: 100,
        vvmStatus: 'Stage 1',
        manufacturerDetails: 'Serum Institute of India',
      },
    ])
    const [count, setCount] = useState(2)
    const handleDelete = (key) => {
      const newData = dataSource.filter((item) => item.key !== key)
      setDataSource(newData)
    }

    const handleAdd = () => {
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: '32',
        address: `London, Park Lane no. ${count}`,
      }
      setDataSource([...dataSource, newData])
      setCount(count + 1)
    }
    const handleSave = (row) => {
      console.log('row', row)
      const newData = [...dataSource]
      const index = newData.findIndex((item) => row.key === item.key)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })

      console.log('newData', newData)
      setDataSource(newData)
    }
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }
    const columns = defaultColumns.map((col) => {
      if (!col.type) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.type,
          dataIndex: col.dataIndex,
          title: col.title,
          options: col.options,
          handleSave,
        }),
      }
    })
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="small"
        />
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          ADD
        </Button>
      </div>
    )
  }

  return { InputTable, values }
}

export default useInputTable
