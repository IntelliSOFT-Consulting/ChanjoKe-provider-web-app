import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Select,
  Popconfirm,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reasons } from '../../data/options/clientDetails'
import { useAudit } from '../../hooks/useAudit'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import {
  inventoryItemBuilder,
  inventoryReportBuilder,
  receiveAuditBuilder,
} from './helpers/stockResourceBuilder'

export default function PositiveAdjustments() {
  const [batchOptions, setBatchOptions] = useState([])
  const [editedBatches, setEditedBatches] = useState([])
  const [locations, setLocations] = useState([])

  const [api, contextHolder] = notification.useNotification()
  const [form] = Form.useForm()
  const { user } = useSelector((state) => state.userInfo)
  const navigate = useNavigate()

  const {
    getAggregateInventoryItems,
    getDetailedInventoryItems,
    createInventory,
    updateInventory,
  } = useInventory()

  const { createAudit, updateAudit, getAudits, audits } = useAudit()

  useEffect(() => {
    getDetailedInventoryItems()
    getAudits({ type: 'shared', 'agent-name': user.facilityName, action: 'U' })
  }, [])

  const addIssuedBatches = useCallback(() => {
    if (!audits?.length) return

    const locationOptions = []
    const batches = audits
      .map((auditData) => {
        const location = auditData?.extension?.[0]?.valueReference

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
          id: auditData.id,
          sharedQuantity: batch.sharedQuantity,
          quantity: 0,
          facilityName: location.display,
          facility: location.reference,
          reason: auditData?.entity?.[0]?.description,
        }))
      })
      ?.flat()

    setLocations(locationOptions)
    setBatchOptions(batches)
  }, [audits])

  useEffect(() => {
    if (audits?.length) {
      addIssuedBatches()
    }
  }, [audits, addIssuedBatches])

  const handleSubmit = async (values) => {
    try {
      const latestItems = await getDetailedInventoryItems()

      const formattedCount = editedBatches.map((batch) => {
        const existingItem = latestItems.find(
          (item) =>
            item.extension?.find((ext) => ext.url === 'batchNumber')
              ?.valueString === batch.batchNumber
        )

        return {
          ...batch,
          previousQuantity:
            existingItem?.extension?.find((ext) => ext.url === 'quantity')
              ?.valueQuantity?.value || 0,
          quantity:
            (existingItem?.extension?.find((ext) => ext.url === 'quantity')
              ?.valueQuantity?.value || 0) + batch.sharedQuantity,
        }
      })

      const payload = {
        ...values,
        vaccines: formattedCount,
        facility: {
          reference: user.orgUnit?.code,
          display: user.orgUnit?.name,
        },
      }

      const inventoryItems = inventoryItemBuilder(payload)

      // Separate existing and new items
      const existingItems = []
      const newItems = []

      inventoryItems.forEach((item) => {
        const existingItem = latestItems.find(
          (latestItem) =>
            latestItem.extension?.find((ext) => ext.url === 'batchNumber')
              ?.valueString ===
            item.extension?.find((ext) => ext.url === 'batchNumber')
              ?.valueString
        )

        if (existingItem) {
          existingItems.push({ ...existingItem, ...item })
        } else {
          newItems.push(item)
        }
      })

      // Update existing items
      await Promise.all(existingItems.map(updateInventory))

      // Create new items
      await Promise.all(newItems.map(createInventory))

      const audit = receiveAuditBuilder(
        formattedCount,
        {
          ...user,
          facility: {
            reference: user.orgUnit.code,
            display: user.orgUnit.name,
          },
          description: values.reason,
        },
        'receipt'
      )
      await createAudit(audit)

      await updateAudit({
        ...audits?.find((audit) => audit.id === values.id),
        action: 'R',
      })

      const aggregate = await getAggregateInventoryItems()
      const report = inventoryReportBuilder(aggregate, user?.orgUnit?.code)
      await createInventory(report)

      setEditedBatches([])

      api.success({
        message: 'Stock count updated successfully',
      })

      setTimeout(() => {
        navigate('/stock-management')
      }, 500)
    } catch (error) {
      console.error(error)
      api.error({
        message: 'Failed to update stock count',
      })
    }
  }

  const columns = useMemo(
    () => [
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
    ],
    []
  )

  const handleLocationChange = useCallback(
    (value) => {
      const selectedBatches = batchOptions.filter(
        (batch) => batch.facility === value
      )
      form.setFieldsValue({
        reason: selectedBatches[0]?.reason,
        id: selectedBatches[0]?.id,
      })
      setEditedBatches(selectedBatches)
    },
    [batchOptions, form]
  )

  return (
    <>
      <Card
        className="mt-5"
        title={
          <div className="text-xl font-semibold">
            Receive from another facility
          </div>
        }
        actions={[
          <div className="flex w-full justify-end px-6">
            <Button className="mr-4">Cancel</Button>
            <Popconfirm
              title="Are you sure you want to receive stock?"
              onConfirm={() => form.submit()}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Receive</Button>
            </Popconfirm>
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
                onChange={handleLocationChange}
                showSearch
                filterOption={(input, option) =>
                  option.label
                    ?.toString()
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item name="id" hidden>
              <Input />
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
              <Select placeholder="Reason for Adjustment" options={reasons} showSearch />
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
              dataSource={editedBatches}
              pagination={false}
            />
          </div>
          {contextHolder}
        </Form>
      </Card>
    </>
  )
}
