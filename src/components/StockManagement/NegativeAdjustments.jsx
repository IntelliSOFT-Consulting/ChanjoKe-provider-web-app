import {
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Select,
  notification,
  Tag,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reasons } from '../../data/options/clientDetails'
import { useAudit } from '../../hooks/useAudit'
import useInventory from '../../hooks/useInventory'
import { useLocations } from '../../hooks/useLocation'
import Table from '../DataTable'
import { formatInventoryToTable } from './helpers/inventoryFormatter'
import {
  inventoryItemUpdate,
  inventoryReportBuilder,
  receiveAuditBuilder,
} from './helpers/stockResourceBuilder'

export default function NegativeAdjustments() {
  const [batchOptions, setBatchOptions] = useState(null)
  const [editedBatches, setEditedBatches] = useState([{}])

  const [api, contextHolder] = notification.useNotification()

  const { user } = useSelector((state) => state.userInfo)
  const { fetchLocations, locations } = useLocations()

  const [form] = Form.useForm()

  const navigate = useNavigate()

  const {
    getInventoryReport,
    getInventoryItems,
    updateInventory,
    inventoryReport,
  } = useInventory()

  const { createAudit } = useAudit()

  useEffect(() => {
    getInventoryReport()
    fetchLocations(user?.ward, 'FACILITY')
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
        acc[curr.vaccine].quantity -= curr.sharedQuantity
      } else {
        acc[curr.vaccine] = {
          ...curr,
          quantity: curr.quantity - curr.sharedQuantity,
        }
      }
      return acc
    }, {})
    return Object.values(vaccineCounts)
  }

  const handleSubmit = async (values) => {
    try {
      const getLatestReport = await getInventoryReport()
      const getLatestItems = await getInventoryItems()

      const aggregatedBatches = countPerVaccine(editedBatches)

      const formattedCount = editedBatches.map((batch) => ({
        ...batch,
        previousQuantity: batch.quantity,
        quantity: batch.quantity - batch.sharedQuantity,
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

      const receiver = {
        reference: `Location/${values.location}`,
        display: locations.find((location) => location.key === values.location)
          ?.name,
      }

      const audit = receiveAuditBuilder(
        formattedCount,
        getLatestReport,
        {
          ...user,
          agentName: receiver.display,
          receiver,
          description: values.reason,
        },
        'shared'
      )
      await createAudit(audit)
      await updateInventory(updatedReport)

      setEditedBatches([{}])

      getInventoryReport()

      api.success({
        message: 'Vaccines shared successfully',
      })

      setTimeout(() => {
        navigate('/stock-management')
      }, 1000)
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
          onChange={(value) => {
            const updatedBatches = [...editedBatches]
            updatedBatches[index].sharedQuantity = value
            setEditedBatches(updatedBatches)
          }}
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
            Share with another facility
          </div>
        }
        actions={[
          <div className="flex w-full justify-end px-6">
            <Button className="mr-4">Cancel</Button>
            <Button
              type="primary"
              disabled={
                !batchOptions?.length ||
                editedBatches?.some((batch) => !batch.sharedQuantity) ||
                editedBatches?.some((batch) => !batch.vaccine)
              }
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </div>,
        ]}
      >
        <Form
          layout="vertical"
          className="p-5"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            date: dayjs(),
          }}
        >
          <div className="grid grid-cols-3 gap-10 mb-6">
            <Form.Item
              label="Reason For Adjustment"
              name="reason"
              rules={[{ required: true, message: 'Please select a reason' }]}
            >
              <Select placeholder="Reason for Adjustment" options={reasons} />
            </Form.Item>

            <Form.Item
              label="Destination Facility"
              name="location"
              rules={[{ required: true, message: 'Please select a facility' }]}
            >
              <Select
                placeholder="Select Facility"
                options={locations
                  ?.filter((item) => !user.facility?.includes(item.key))
                  ?.map((location) => ({
                    label: location.name,
                    value: location.key,
                  }))}
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
              dataSource={editedBatches || []}
              pagination={false}
            />

            <div className="flex justify-end mt-5">
              <Button
                className="!bg-green !text-white hover:!bg-green hover:!border-green hover:!text-white"
                disabled={
                  !batchOptions?.length ||
                  editedBatches?.length === batchOptions?.length ||
                  editedBatches?.some((batch) => !batch.sharedQuantity) ||
                  editedBatches?.some((batch) => !batch.vaccine)
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
