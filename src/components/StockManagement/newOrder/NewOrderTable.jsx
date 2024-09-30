import { Button, InputNumber, Select } from 'antd'
import { uniqueVaccineOptions } from '../../../data/vaccineData'
import Table from '../../DataTable'

const getVaccineQuantity = (inventory, vaccine) => {
  const vaccineInventory = inventory?.find((item) => item.vaccine === vaccine)
  return vaccineInventory?.quantity ?? 0
}

const InputColumn = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  status,
}) => (
  <InputNumber
    style={{ width: '100%' }}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    min={0}
    status={status}
  />
)

const NewOrderTable = ({
  inventoryItems,
  tableData,
  setTableData,
  hasErrors,
  handleValidate,
}) => {
  const handleChange = (index, key, value) => {
    const newData = [...tableData]
    newData[index][key] = value
    setTableData(newData)
  }

  const columns = [
    {
      title: 'Antigen',
      dataIndex: 'vaccine',
      render: (_, record, index) => (
        <Select
          style={{ width: '100%' }}
          options={uniqueVaccineOptions}
          value={record.vaccine}
          placeholder="Select Antigen"
          status={hasErrors?.[index.toString()]?.vaccine ? 'error' : 'default'}
          onChange={(value) => {
            const qty = getVaccineQuantity(inventoryItems, value)
            handleChange(index, 'vaccine', value)
            handleChange(index, 'dosesInStock', qty)
          }}
        />
      ),
      width: '20%',
    },
    {
      title: 'Doses in Stock',
      dataIndex: 'dosesInStock',
      render: (value, _record, index) => (
        <InputColumn
          value={value}
          placeholder="Doses in Stock"
          disabled
          status={
            hasErrors?.[index.toString()]?.dosesInStock ? 'error' : 'default'
          }
        />
      ),
    },
    {
      title: 'Consumed last month',
      dataIndex: 'consumedLastMonth',
    },
    {
      title: 'Minimum',
      dataIndex: 'minimum',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Minimum"
          onChange={(value) => handleChange(index, 'minimum', value)}
          status={hasErrors?.[index.toString()]?.minimum ? 'error' : 'default'}
        />
      ),
    },
    {
      title: 'Maximum',
      dataIndex: 'maximum',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Maximum"
          onChange={(value) => handleChange(index, 'maximum', value)}
          status={hasErrors?.[index.toString()]?.maximum ? 'error' : 'default'}
        />
      ),
    },
    {
      title: 'Recommended Stock',
      dataIndex: 'recommendedStock',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Recommended Stock"
          onChange={(value) => handleChange(index, 'recommendedStock', value)}
          status={
            hasErrors?.[index.toString()]?.recommendedStock
              ? 'error'
              : 'default'
          }
        />
      ),
    },
    {
      title: 'Ordered Amount',
      dataIndex: 'quantity',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Ordered Amount"
          onChange={(value) => handleChange(index, 'quantity', value)}
          status={hasErrors?.[index.toString()]?.quantity ? 'error' : 'default'}
        />
      ),
    },
    {
      title: null,
      dataIndex: 'action',
      hidden: tableData.length === 1,
      render: (_, __, index) => (
        <>
          {index > 0 && (
            <Button
              type="link"
              disabled={index === 0}
              onClick={() => {
                const newData = [...tableData]
                newData.splice(index, 1)
                setTableData(newData)
              }}
              danger
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ]

  return (
    <div className="">
      <Table
        size="small"
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={(_, index) => index}
      />

      <div className="flex flex-col items-end">
        {Object.values(hasErrors).length > 0 && (
          <div className="bg-red-50 shadow p-2 mb-4">
            <p className="text-red-500 text-sm">
              {hasErrors?.empty
                ? 'Please add at least one row to proceed.'
                : 'Please complete all required fields to proceed.'}
            </p>
          </div>
        )}
        <Button
          className="!bg-green !text-white hover:text-white"
          onClick={() => {
            const err = handleValidate()
            if (!Object.values(err).length) {
              setTableData([
                ...tableData,
                {
                  vaccine: '',
                },
              ])
            }
          }}
        >
          Add Row
        </Button>
      </div>
    </div>
  )
}

export default NewOrderTable
