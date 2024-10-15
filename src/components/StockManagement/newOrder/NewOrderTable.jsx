import {
  Button,
  InputNumber,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uniqueVaccineOptions } from '../../../data/vaccineData'
import {
  addVaccine,
  changeVaccineQuantity,
  removeVaccine,
} from '../../../redux/slices/stockSlice'
import { isDiluentOrDropper } from '../../../utils/methods'
import {
  getMaximumQuantity,
  getMinimumQuantity,
  minMaxNotSet,
  ValidationMessage,
} from './Validations'

const { Text } = Typography

const getVaccineQuantity = (inventory, vaccine) => {
  const vaccineInventory = inventory?.find((item) => item.vaccine === vaccine)
  return vaccineInventory?.quantity ?? 0
}

const getVaccineLevel = (vaccine, vaccineLevels) => {
  return vaccineLevels?.find((item) => item.name === vaccine)
}

const NewOrderTable = ({
  inventoryItems,
  hasErrors,
  handleValidate,
  vaccineLevels,
}) => {
  const { vaccines } = useSelector((state) => state.newOrder)
  const dispatch = useDispatch()

  const columns = [
    {
      title: 'Antigen',
      dataIndex: 'vaccine',
      width: '20%',
      render: (_, record, index) => (
        <div className="flex flex-col">
          <Select
            className="w-full"
            options={uniqueVaccineOptions}
            value={record.vaccine}
            allowClear
            placeholder="Select Antigen"
            disabled={isDiluentOrDropper(record.vaccine)}
            status={hasErrors?.[index]?.vaccine ? 'error' : undefined}
            onChange={(value) => {
              const qty = getVaccineQuantity(inventoryItems, value)
              const vaccineLevel = getVaccineLevel(value, vaccineLevels)

              if (vaccineLevel) {
                const recommendedStock =
                  Math.floor((vaccineLevel.max - vaccineLevel.min) / 2) +
                  vaccineLevel.min
                record = {
                  ...record,
                  minimum: getMinimumQuantity(
                    { ...record, minimum: vaccineLevel.min },
                    qty
                  ),
                  maximum: getMaximumQuantity(
                    { ...record, maximum: vaccineLevel.max },
                    qty
                  ),
                  recommendedStock,
                  vaccine: value,
                  dosesInStock: qty,
                  quantity: null,
                  index,
                }
              } else {
                record = {
                  ...record,
                  minimum: null,
                  maximum: null,
                  recommendedStock: 0,
                  vaccine: value,
                  dosesInStock: qty,
                  quantity: null,
                  index,
                }
              }

              dispatch(addVaccine(record))
            }}
          />
        </div>
      ),
    },
    {
      title: 'Doses in Stock',
      dataIndex: 'dosesInStock',
      render: (value, _, index) => (
        <InputNumber
          value={value}
          placeholder="Doses in Stock"
          disabled
          className='w-full'
          status={hasErrors?.[index]?.dosesInStock ? 'error' : undefined}
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
        <InputNumber
          value={value}
          placeholder="Minimum"
          disabled
          className='w-full'
          status={hasErrors?.[index]?.minimum ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Maximum',
      dataIndex: 'maximum',
      render: (value, _, index) => (
        <InputNumber
          value={value}
          placeholder="Maximum"
          disabled
          className='w-full'
          status={hasErrors?.[index]?.maximum ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Recommended Stock',
      dataIndex: 'recommendedStock',
      hidden: true,
      render: (value, _, index) => (
        <InputNumber
          value={value}
          placeholder="Recommended Stock"
          disabled
          className='w-full'
          status={hasErrors?.[index]?.recommendedStock ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Ordered Amount',
      dataIndex: 'quantity',
      render: (value, record, index) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Tooltip color="red" title={ValidationMessage(record)}>
            <InputNumber
              value={value}
              className="w-full"
              placeholder="Ordered Amount"
              disabled={isDiluentOrDropper(record.vaccine)}
              min={record.minimum}
              max={record.maximum}
              readOnly={minMaxNotSet(record)}
              onChange={(value) => {
                dispatch(
                  changeVaccineQuantity({
                    vaccine: record.vaccine,
                    quantity: value,
                  })
                )
              }}
              status={
                hasErrors?.[index]?.quantity ||
                (!record.minimum && !record.maximum && record.vaccine)
                  ? 'error'
                  : undefined
              }
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: null,
      dataIndex: 'action',
      render: (_, record, index) =>
        index > 0 &&
        !isDiluentOrDropper(record.vaccine) && (
          <Button
            type="link"
            onClick={() => {
              dispatch(removeVaccine(record))
            }}
            danger
          >
            Delete
          </Button>
        ),
    },
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Table
        size="small"
        columns={columns}
        dataSource={vaccines}
        pagination={false}
        rowKey={(_, index) => index}
      />
      <Space direction="vertical" align="end" style={{ width: '100%' }}>
        {Object.keys(hasErrors).length > 0 && (
          <Text
            type="danger"
            style={{ padding: '8px', backgroundColor: '#fff1f0' }}
          >
            {hasErrors.empty
              ? 'Please add at least one row to proceed.'
              : 'Please complete all required fields to proceed.'}
          </Text>
        )}
        <Button
          type="primary"
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => {
            const err = handleValidate()
            if (Object.keys(err).length === 0) {
              dispatch(addVaccine({ vaccine: '', index: vaccines.length }))
            }
          }}
        >
          Add Row
        </Button>
      </Space>
    </Space>
  )
}

export default NewOrderTable
