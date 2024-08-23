import {
  Button,
  Card,
  InputNumber,
  Popconfirm,
  Select,
  notification,
} from 'antd'
import { useEffect, useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import { formatInventoryToTable } from './helpers/inventoryFormatter'
import { receiveAuditBuilder } from './helpers/stockResourceBuilder'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAudit } from '../../hooks/useAudit'

const useStyles = createUseStyles({
  btnPrimary: {
    backgroundColor: '#163C94',
    borderColor: '#163C94',
    color: 'white',
    '&:hover': {
      backgroundColor: '#163C94 !important',
      borderColor: '#163C94',
      color: 'white !important',
    },
  },
})

export default function StockCount() {
  const [batchOptions, setBatchOptions] = useState([])
  const [editedBatches, setEditedBatches] = useState([{}])
  const [api, contextHolder] = notification.useNotification()
  const { user } = useSelector((state) => state.userInfo)
  const navigate = useNavigate()
  const classes = useStyles()

  const { getDetailedInventoryItems, updateInventory, batchItems } =
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
        quantity: batch.physicalCount,
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
        'count'
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

  const handleBatchSelect = (value, index) => {
    const vaccineBatch = batchOptions.find((v) => v.batchNumber === value)
    setEditedBatches((prev) => {
      const updated = [...prev]
      updated[index] = vaccineBatch
      return updated
    })
  }

  const handlePhysicalCountChange = (value, index) => {
    setEditedBatches((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        physicalCount: value,
        difference: value - updated[index].quantity,
      }
      return updated
    })
  }

  const columns = useMemo(
    () => [
      {
        title: 'Vaccine/Diluents',
        dataIndex: 'vaccine',
        render: (record, _, index) => (
          <Select
            defaultValue={record}
            className="w-full"
            onSelect={(value) => handleBatchSelect(value, index)}
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
        type: 'select',
      },
      {
        title: 'Expiry Date',
        dataIndex: 'expiryDate',
        type: 'date',
        disabled: true,
      },
      {
        title: 'Stock Quantity',
        dataIndex: 'quantity',
        type: 'number',
        disabled: true,
      },
      {
        title: 'Physical Count',
        dataIndex: 'physicalCount',
        type: 'number',
        render: (text, record, index) => (
          <InputNumber
            value={text}
            disabled={!record?.batchNumber}
            status={
              !record?.physicalCount && record?.physicalCount !== 0
                ? 'error'
                : 'success'
            }
            min={0}
            onChange={(value) => handlePhysicalCountChange(value, index)}
          />
        ),
      },
      {
        title: 'Difference',
        dataIndex: 'difference',
        key: 'difference',
      },
      {
        title: null,
        hidden: editedBatches?.length <= 1,
        render: () => (
          <Button type="link" danger>
            Delete
          </Button>
        ),
      },
    ],
    [batchOptions, editedBatches]
  )

  const isSubmitDisabled =
    !editedBatches?.length ||
    !editedBatches?.every((batch) => batch.physicalCount)
  const isAddRowDisabled =
    !batchOptions?.length ||
    editedBatches?.length === batchOptions?.length ||
    editedBatches?.some((batch) => !batch.physicalCount)

  return (
    <>
      <Card
        className="mt-5"
        title={<div className="text-xl font-semibold">Stock Count</div>}
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
            >
              <Button
                disabled={isSubmitDisabled}
                className={classes.btnPrimary}
              >
                Submit
              </Button>
            </Popconfirm>
          </div>,
        ]}
      >
        <div className="p-5">
          <Table
            loading={!batchItems}
            columns={columns}
            size="small"
            dataSource={editedBatches || []}
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
