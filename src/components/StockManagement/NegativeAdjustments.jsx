import {
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  notification,
  Select,
  Tag,
  Popconfirm,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reasons } from '../../data/options/clientDetails'
import { useAudit } from '../../hooks/useAudit'
import useInventory from '../../hooks/useInventory'
import { useLocations } from '../../hooks/useLocation'
import Table from '../DataTable'
import { formatInventoryToTable } from './helpers/inventoryFormatter'
import { receiveAuditBuilder } from './helpers/stockResourceBuilder'
import { formatLocation } from '../../utils/formatter'

export default function NegativeAdjustments() {
  const [batchOptions, setBatchOptions] = useState([])
  const [editedBatches, setEditedBatches] = useState([{}])
  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)
  const { fetchLocations, locations } = useLocations({})
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { getDetailedInventoryItems, updateInventory, batchItems } =
    useInventory()

  const { createAudit } = useAudit()

  useEffect(() => {
    getDetailedInventoryItems()
    fetchLocations(formatLocation(user?.ward), 'FACILITY')
  }, [])

  useEffect(() => {
    if (batchItems) {
      setBatchOptions(formatInventoryToTable(batchItems))
    }
  }, [batchItems])

  const handleSubmit = async (values) => {
    try {
      const latestItems = await getDetailedInventoryItems()

      const formattedCount = editedBatches.map((batch) => ({
        ...batch,
        previousQuantity: batch.quantity,
        quantity: batch.quantity - batch.sharedQuantity,
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

      const receiver = {
        reference: `Location/${values.location}`,
        display: locations.find((location) => location.key === values.location)
          ?.name,
      }

      const audit = receiveAuditBuilder(
        formattedCount,
        {
          ...user,
          facility: {
            reference: user.orgUnit.code,
            display: user.orgUnit.name,
          },
          agentName: receiver.display,
          receiver,
          description: values.reason,
        },
        'shared'
      )
      await createAudit(audit)

      setEditedBatches([{}])
      api.success({ message: 'Vaccines shared successfully' })
      setTimeout(() => navigate('/stock-management'), 500)
    } catch (error) {
      console.error(error)
      api.error({ message: 'Failed to share vaccines' })
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
            showSearch
            filterOption={(input, option) =>
              option.label
                ?.toString()
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
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
                {vaccine?.vaccine} -{' '}
                <Tag color="blue">{vaccine?.batchNumber}</Tag>
              </Select.Option>
            ))}
          </Select>
        ),
        width: 250,
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
        key: 'quantity',
      },
      {
        title: 'Shared Quantity',
        dataIndex: 'sharedQuantity',
        render: (text, record, index) => (
          <InputNumber
            placeholder="Shared Quantity"
            value={text}
            className="w-full"
            onChange={(value) => updateBatch(index, { sharedQuantity: value })}
            min={0}
            max={record.quantity}
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
    !batchOptions?.length ||
    editedBatches?.some((batch) => !batch.sharedQuantity || !batch.vaccine)

  const isAddRowDisabled =
    !batchOptions?.length ||
    editedBatches?.length === batchOptions?.length ||
    editedBatches?.some((batch) => !batch.sharedQuantity || !batch.vaccine)

  return (
    <>
      <Card
        className="mt-5"
        title={
          <div className="text-xl font-semibold">
            Share with another facility
          </div>
        }
        actions={[
          <div className="flex w-full justify-end px-6">
            <Button className="mr-4">Cancel</Button>
            <Popconfirm
              title="Are you sure you want to submit?"
              onConfirm={() => form.submit()}
              okText="Yes"
              cancelText="No"
              placement="top"
            >
              <Button type="primary" disabled={isSubmitDisabled}>
                Submit
              </Button>
            </Popconfirm>
          </div>,
        ]}
      >
        <Form
          layout="vertical"
          className="p-5"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ date: dayjs() }}
        >
          <div className="grid grid-cols-3 gap-10 mb-6">
            <Form.Item
              label="Reason For Adjustment"
              name="reason"
              rules={[{ required: true, message: 'Please select a reason' }]}
            >
              <Select
                placeholder="Reason for Adjustment"
                options={reasons}
                showSearch
              />
            </Form.Item>

            <Form.Item
              label="Destination Facility"
              name="location"
              rules={[{ required: true, message: 'Please select a facility' }]}
            >
              <Select
                placeholder="Select Facility"
                options={locations
                  ?.filter((item) => !user.orgUnit?.code?.includes(item.key))
                  ?.map((location) => ({
                    label: location.name,
                    value: location.key,
                  }))}
                showSearch
                filterOption={(input, option) =>
                  option.label
                    ?.toString()
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label="Date of Adjustment"
              className="w-full"
              name="date"
              rules={[{ required: true, message: 'Please select a date' }]}
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
        </Form>
      </Card>
    </>
  )
}
