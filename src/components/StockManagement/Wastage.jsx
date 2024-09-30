import {
  Button,
  Card,
  InputNumber,
  Popconfirm,
  Select,
  notification,
} from 'antd'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAudit } from '../../hooks/useAudit'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import { formatInventoryToTable } from './helpers/inventoryFormatter'
import { receiveAuditBuilder } from './helpers/stockResourceBuilder'

const wastageReasons = {
  Open: [{ label: 'Insufficient Children', value: 'Insufficient Children' }],
  Closed: [
    { label: 'Expiration', value: 'Expiration' },
    { label: 'VVM change', value: 'VVM change' },
    { label: 'Breakage', value: 'Breakage' },
  ],
}

export default function Wastage() {
  const [batchOptions, setBatchOptions] = useState([])
  const [editedBatches, setEditedBatches] = useState([{}])
  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)
  const navigate = useNavigate()

  const { getDetailedInventoryItems, batchItems, updateInventory } =
    useInventory()
  const { createAudit } = useAudit()

  useEffect(() => {
    getDetailedInventoryItems()
  }, [])

  useEffect(() => {
    if (batchItems) {
      setBatchOptions(formatInventoryToTable(batchItems))
    }
  }, [batchItems])

  const handleSubmit = async () => {
    try {
      const latestItems = await getDetailedInventoryItems()

      const formattedCount = editedBatches.map((batch) => ({
        ...batch,
        previousQuantity: batch.quantity,
        quantity: batch.quantity - batch.quantityWasted,
      }))

      const updatedItems = latestItems
        .map((item) => {
          const match = formattedCount.find(
            (count) =>
              count.batchNumber ===
              item.extension.find((ext) => ext.url === 'batchNumber')
                ?.valueString
          )

          if (match) {
            const quantityIndex = item.extension.findIndex(
              (ext) => ext.url === 'quantity'
            )
            item.extension[quantityIndex].valueQuantity.value = match.quantity
            return item
          }
          return null
        })
        .filter(Boolean)

      await Promise.all(updatedItems.map(updateInventory))

      const audit = receiveAuditBuilder(
        formattedCount,
        {
          ...user,
          facility: {
            reference: user.orgUnit.code,
            display: user.orgUnit.name,
          },
        },
        'wastage'
      )
      await createAudit(audit)

      setEditedBatches([{}])
      api.success({ message: 'Stock count updated successfully' })
      setTimeout(() => navigate('/stock-management'), 1000)
    } catch (error) {
      console.error(error)
      api.error({ message: 'Failed to update stock count' })
    }
  }

  const updateBatch = useCallback((index, updates) => {
    setEditedBatches((prevBatches) => {
      const newBatches = [...prevBatches]
      newBatches[index] = { ...newBatches[index], ...updates }
      return newBatches
    })
  }, [])

  const columns = useMemo(
    () => [
      {
        title: 'Vaccine/Diluents',
        dataIndex: 'vaccine',
        render: (record, _, index) => (
          <Select
            defaultValue={record}
            className="w-full"
            onSelect={(value) => {
              const vaccineBatch = batchOptions.find(
                (v) => v.batchNumber === value
              )
              updateBatch(index, vaccineBatch)
            }}
            placeholder="Select Vaccine"
          >
            {batchOptions?.map((vaccine) => (
              <Select.Option
                key={vaccine.batchNumber}
                value={vaccine.batchNumber}
                disabled={editedBatches.some(
                  (batch) =>
                    batch.vaccine === vaccine.vaccine &&
                    batch.batchNumber === vaccine.batchNumber
                )}
              >
                {vaccine?.vaccine}
              </Select.Option>
            ))}
          </Select>
        ),
        width: '20%',
      },
      {
        title: 'Batch Number',
        dataIndex: 'batchNumber',
      },
      {
        title: 'Expiry Date',
        dataIndex: 'expiryDate',
        disabled: true,
      },
      {
        title: 'Stock Quantity',
        dataIndex: 'quantity',
      },
      {
        title: 'Type of wastage',
        dataIndex: 'wastageType',
        render: (text, _, index) => (
          <Select
            defaultValue={text}
            onSelect={(value) =>
              updateBatch(index, {
                wastageType: value,
                reasonOptions: wastageReasons[value],
              })
            }
            placeholder="Select Wastage Type"
            options={[
              { label: 'Open', value: 'Open' },
              { label: 'Closed', value: 'Closed' },
            ]}
          />
        ),
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        render: (text, record, index) => (
          <Select
            defaultValue={text}
            onSelect={(value) => updateBatch(index, { reason: value })}
            placeholder="Select Reason"
            options={record.reasonOptions}
          />
        ),
      },
      {
        title: 'Quantity Wasted',
        dataIndex: 'quantityWasted',
        render: (text, record, index) => (
          <InputNumber
            value={text}
            disabled={!record?.batchNumber}
            status={
              (!record?.quantityWasted && record?.quantityWasted !== 0) ||
              text > record?.quantity
                ? 'error'
                : 'success'
            }
            min={0}
            max={record?.quantity}
            onChange={(value) => updateBatch(index, { quantityWasted: value })}
          />
        ),
      },
      {
        title: 'VVM Status',
        dataIndex: 'vvmStatus',
        type: 'select',
      },
      {
        title: null,
        hidden: editedBatches?.length <= 1,
        render: () => (
          <Button
            type="link"
            danger
            onClick={() => setEditedBatches((prev) => prev.slice(0, -1))}
          >
            Delete
          </Button>
        ),
      },
    ],
    [batchOptions, editedBatches, updateBatch]
  )

  const isSubmitDisabled =
    !editedBatches?.length ||
    !editedBatches?.every(
      (batch) => batch.quantityWasted && batch.reason && batch.wastageType
    )

  const isAddRowDisabled =
    !batchOptions?.length ||
    editedBatches?.length === batchOptions?.length ||
    editedBatches?.some(
      (batch) => !batch.quantityWasted || !batch.reason || !batch.wastageType
    )

  return (
    <>
      <Card
        className="mt-5"
        title={<div className="text-xl font-semibold">Wastage</div>}
        actions={[
          <div className="flex justify-end px-6">
            <Button type="primary" className="mr-4" ghost>
              Cancel
            </Button>
            <Popconfirm
              title="Are you sure you want to update the stock count?"
              onConfirm={handleSubmit}
              okText="Yes"
              cancelText="No"
              placement="top"
            >
              <Button disabled={isSubmitDisabled}>Submit</Button>
            </Popconfirm>
          </div>,
        ]}
      >
        <div className="p-5">
          <Table
            loading={!batchOptions}
            columns={columns}
            size="small"
            dataSource={editedBatches}
            pagination={false}
          />
          <div className="flex justify-end mt-5">
            <Button
              className="!bg-green !text-white hover:!bg-green hover:!border-green hover:!text-white"
              disabled={isAddRowDisabled}
              onClick={() => setEditedBatches((prev) => [...prev, {}])}
            >
              Add Row
            </Button>
          </div>
        </div>
        {contextHolder}
      </Card>
    </>
  )
}
