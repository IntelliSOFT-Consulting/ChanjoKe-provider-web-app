import {
  Button,
  Card,
  DatePicker,
  InputNumber,
  Form,
  Select,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAudit } from '../../hooks/useAudit'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import { formatInventoryToTable } from './helpers/inventoryFormatter'
import {
  inventoryItemUpdate,
  inventoryReportBuilder,
  receiveAuditBuilder,
} from './helpers/stockResourceBuilder'

export default function PositiveAdjustments() {
  const [batchOptions, setBatchOptions] = useState(null)
  const [editedBatches, setEditedBatches] = useState([{}])

  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()

  const {
    getInventoryReport,
    getInventoryItems,
    updateInventory,
    inventoryReport,
  } = useInventory()

  const { createAudit, getAudits, audits } = useAudit()

  useEffect(() => {
    getInventoryReport()
    getAudits({ type: 'shared', 'agent-name': user.facilityName })
  }, [])

  useEffect(() => {
    if (inventoryReport) {
      const formattedInventory = formatInventoryToTable(inventoryReport)
      setBatchOptions(formattedInventory)
    }
  }, [inventoryReport])

  const addIssuedBatches = () => {
    if (audits?.length) {
      const auditData = audits[0]
      const issuedBatches = auditData?.entity?.[0].detail?.valueString
        ? JSON.parse(auditData?.entity?.[0].detail?.valueString)
        : []
      setEditedBatches(issuedBatches)
    }
  }

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
        'receipt'
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
      title: 'Received Quantity',
      dataIndex: 'quantity',
      render: (text) => (
        <InputNumber
          defaultValue={text}
          className="w-full"
          onChange={(value, _record, index) => {
            const updatedBatches = [...editedBatches]
            updatedBatches[index].quantityWasted = value
            setEditedBatches(updatedBatches)
          }}
          min={0}
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
        title={
          <div className="text-xl font-semibold">
            Received from another facility
          </div>
        }
        actions={[
          <div className="flex w-full justify-end px-6">
            <Button className="mr-4">Cancel</Button>
            <Button type="primary">Submit</Button>
          </div>,
        ]}
      >
        <Form layout="vertical" className="p-5">
          <div className="grid grid-cols-3 gap-10 mb-6">
            <Form.Item label="Reason For Adjustment">
              <Select placeholder="Reason for Adjustment" />
            </Form.Item>

            <Form.Item label="Origin">
              <div className="flex gap-1">
                <Select placeholder="Origin" />
                <Select placeholder="Location" />
              </div>
            </Form.Item>

            <Form.Item label="Date of Adjustment" className="w-full">
              <DatePicker
                placeholder="Date of Adjustment"
                className="w-full"
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </div>
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
        </Form>
      </Card>
    </>
  )
}
