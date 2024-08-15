import {
  Button,
  Card,
  InputNumber,
  Popconfirm,
  Select,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import { formatInventoryToTable } from './helpers/inventoryFormatter'
import {
  inventoryItemUpdate,
  inventoryReportBuilder,
  receiveAuditBuilder,
} from './helpers/stockResourceBuilder'
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
  const [batchOptions, setBatchOptions] = useState(null)
  const [editedBatches, setEditedBatches] = useState([{}])

  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()

  const {
    getInventoryReport,
    getInventoryItems,
    updateInventory,
    inventoryItems,
    inventoryReport,
  } = useInventory()

  const { createAudit } = useAudit()

  const classes = useStyles()

  useEffect(() => {
    getInventoryReport()
  }, [])

  useEffect(() => {
    if (inventoryReport) {
      const formattedInventory = formatInventoryToTable(inventoryReport)
      setBatchOptions(formattedInventory)
    }
  }, [inventoryReport])

  const countPerVaccine = (vaccines) => {
    const removeSelected = batchOptions.filter(
      (batch) =>
        !vaccines.some((vaccine) => vaccine.batchNumber === batch.batchNumber)
    )
    const vaccinesToCount = [...vaccines, ...removeSelected]
    const vaccineCounts = vaccinesToCount.reduce((acc, curr) => {
      if (acc[curr.vaccine]) {
        acc[curr.vaccine].quantity += curr.physicalCount
      } else {
        acc[curr.vaccine] = { ...curr, quantity: curr.physicalCount }
      }
      return acc
    }, {})
    return Object.values(vaccineCounts)
  }

  const handleSubmit = async () => {
    try {
      const getLatestReport = await getInventoryReport()
      const getLatestItems = await getInventoryItems()

      const aggregatedBatches = countPerVaccine(editedBatches)

      const formattedCount = editedBatches.map((batch) => ({
        ...batch,
        previousQuantity: batch.quantity,
        quantity: batch.physicalCount,
      }))

      const updatedReport = inventoryReportBuilder(
        formattedCount,
        getLatestReport,
        user.facility
      )

      updatedReport.id = getLatestReport.id

      const updatedInventoryItems = inventoryItemUpdate(
        aggregatedBatches,
        getLatestItems,
        'count'
      )

      await Promise.all(
        updatedInventoryItems.map((item) => updateInventory(item))
      )

      const audit = receiveAuditBuilder(
        formattedCount,
        getLatestReport,
        user,
        'count'
      )
      await createAudit(audit)
      await updateInventory(updatedReport)

      setEditedBatches([{}])

      getInventoryReport()

      api.success({
        message: 'Stock count updated successfully',
      })

      setTimeout(() => {
        navigate('/stock-management')
      }, 1500)
    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
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

            const updatedBatches = [...editedBatches]
            updatedBatches[index] = vaccineBatch
            setEditedBatches(updatedBatches)
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
          onChange={(value) => {
            const updatedBatches = [...editedBatches]
            updatedBatches[index] = {
              ...updatedBatches[index],
              physicalCount: value,
            }
            setEditedBatches(updatedBatches)
          }}
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
      render: (record) => (
        <Button type="link" danger>
          Delete
        </Button>
      ),
    },
  ]

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
                disabled={
                  !editedBatches?.length ||
                  !editedBatches?.every((batch) => batch.physicalCount)
                }
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
            loading={!batchOptions}
            columns={columns}
            size="small"
            dataSource={editedBatches || []}
            pagination={false}
          />

          <div className="flex justify-end mt-5">
            <Button
              className="!bg-green !text-white hover:!bg-green hover:!border-green hover:!text-white"
              disabled={
                !batchOptions?.length ||
                editedBatches?.length === batchOptions?.length ||
                editedBatches?.some((batch) => !batch.physicalCount)
              }
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
