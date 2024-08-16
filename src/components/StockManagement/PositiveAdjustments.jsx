import { Button, Card, DatePicker, Form, Select, notification } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reasons } from '../../data/options/clientDetails'
import { useAudit } from '../../hooks/useAudit'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import {
  inventoryItemUpdate,
  inventoryReportBuilder,
  receiveAuditBuilder,
} from './helpers/stockResourceBuilder'

export default function PositiveAdjustments() {
  const [batchOptions, setBatchOptions] = useState(null)
  const [editedBatches, setEditedBatches] = useState(null)
  const [locations, setLocations] = useState(null)

  const [api, contextHolder] = notification.useNotification()

  const [form] = Form.useForm()

  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()

  const { getInventoryReport, getInventoryItems, updateInventory } =
    useInventory()

  const { createAudit, updateAudit, getAudits, audits } = useAudit()

  useEffect(() => {
    getInventoryReport()
    getAudits({ type: 'shared', 'agent-name': user.facilityName, action: 'U' })
  }, [])

  const addIssuedBatches = () => {
    if (!audits?.length) return

    const locationOptions = []
    const batches = audits
      .map((auditData) => {
        const location = auditData?.agent?.[0]?.location

        if (location) {
          locationOptions.push({
            label: location.display,
            value: location.reference,
          })
        }

        const issuedBatches = auditData?.entity?.[0]?.detail?.[0]?.valueString
        const parsed = issuedBatches ? JSON.parse(issuedBatches) : []
        return parsed.map((batch) => ({
          ...batch,
          sharedQuantity: batch.quantity,
          quantity: 0,
          facilityName: location.display,
          facility: location.reference,
          reason: auditData?.entity?.[0]?.description,
        }))
      })
      ?.flat()

    setLocations(locationOptions)
    setBatchOptions(batches)
  }

  useEffect(() => {
    if (audits?.length) {
      addIssuedBatches()
    }
  }, [audits])

  const countPerVaccine = (vaccines) => {
    const removeSelected = batchOptions.filter(
      (batch) =>
        !vaccines.some((vaccine) => vaccine.batchNumber === batch.batchNumber)
    )
    const vaccinesToCount = [...vaccines, ...removeSelected]
    const vaccineCounts = vaccinesToCount.reduce((acc, curr) => {
      if (acc[curr.vaccine]) {
        acc[curr.vaccine].quantity += curr.sharedQuantity
      } else {
        acc[curr.vaccine] = {
          ...curr,
          quantity: curr.quantity + curr.sharedQuantity,
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
        quantity: batch.quantity + batch.sharedQuantity,
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

      await updateAudit({
        ...audits[0],
        action: 'R',
      })

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
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
    },
    {
      title: 'Received Quantity',
      dataIndex: 'sharedQuantity',
    },

    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
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
            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>
          </div>,
        ]}
      >
        <Form
          layout="vertical"
          className="p-5"
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            date: dayjs(),
          }}
        >
          <div className="grid grid-cols-3 gap-10 mb-6">
            <Form.Item
              label="Origin"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please select the origin of the stock',
                },
              ]}
            >
              <Select
                placeholder="Origin"
                options={locations}
                onChange={(value) => {
                  const selectedBatches = batchOptions.filter(
                    (batch) => batch.facility === value
                  )
                  form.setFieldValue('reason', selectedBatches[0]?.reason)
                  setEditedBatches(selectedBatches)
                }}
              />
            </Form.Item>
            <Form.Item
              label="Reason For Adjustment"
              name="reason"
              rules={[
                {
                  required: true,
                  message: 'Please select a reason for adjustment',
                },
              ]}
            >
              <Select placeholder="Reason for Adjustment" options={reasons} />
            </Form.Item>

            <Form.Item
              label="Date of Adjustment"
              className="w-full"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Please select the date of adjustment',
                },
              ]}
            >
              <DatePicker
                placeholder="Date of Adjustment"
                className="w-full"
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </div>
          <div className="p-5">
            <Table
              loading={!audits}
              columns={columns}
              size="small"
              dataSource={editedBatches || []}
              pagination={false}
            />
          </div>
          {contextHolder}
        </Form>
      </Card>
    </>
  )
}
