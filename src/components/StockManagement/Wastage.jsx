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

const wastageReasons = {
  Open: [
    {
      label: 'Insufficient Children',
      value: 'Insufficient Children',
    },
  ],
  Closed: [
    { label: 'Expiration', value: 'Expiration' },
    { label: 'Cold chain failures', value: 'Cold chain failures' },
    { label: 'VVM change', value: 'VVM change' },
    { label: 'Breakage', value: 'Breakage' },
    { label: 'Contamination', value: 'Contamination' },
    { label: 'Policy changes', value: 'Policy changes' },
    { label: 'Power outages', value: 'Power outages' },
    { label: 'Inventory mismanagement', value: 'Inventory mismanagement' },
    { label: 'Label/packaging issues', value: 'Label/packaging issues' },
    { label: 'Natural disasters', value: 'Natural disasters' },
  ],
}

export default function Wastage() {
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
        acc[curr.vaccine].quantity -= curr.quantityWasted
      } else {
        acc[curr.vaccine] = {
          ...curr,
          quantity: curr.quantity - curr.quantityWasted,
        }
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
        quantity: batch.quantity - batch.quantityWasted,
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
        'wastage'
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
      title: 'Type of wastaage',
      dataIndex: 'wastageType',
      render: (text, record, index) => (
        <Select
          defaultValue={text}
          onSelect={(value) => {
            const updatedBatches = [...editedBatches]
            updatedBatches[index] = {
              ...updatedBatches[index],
              wastageType: value,
              reasonOptions: wastageReasons[value],
            }
            setEditedBatches(updatedBatches)
          }}
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
          onSelect={(value) => {
            const updatedBatches = [...editedBatches]
            updatedBatches[index] = {
              ...updatedBatches[index],
              reason: value,
            }
            setEditedBatches(updatedBatches)
          }}
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
          onChange={(value) => {
            const updatedBatches = [...editedBatches]
            updatedBatches[index] = {
              ...updatedBatches[index],
              quantityWasted: value,
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
            >
              <Button
                disabled={
                  !editedBatches?.length ||
                  !editedBatches?.every((batch) => batch.quantityWasted) ||
                  !editedBatches?.every((batch) => batch.reason) ||
                  !editedBatches?.every((batch) => batch.wastageType)
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
                editedBatches?.some((batch) => !batch.quantityWasted) ||
                editedBatches?.some((batch) => !batch.reason) ||
                editedBatches?.some((batch) => !batch.wastageType)
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
