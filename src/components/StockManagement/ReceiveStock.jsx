import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  Tooltip,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import useInventory from '../../hooks/useInventory'
import useStock from '../../hooks/useStock'
import dayjs from 'dayjs'
import Table from '../DataTable'
import { inventoryItemUpdator, supplyDeliveryBuilder } from './stockResourceBuilder'

const useStyles = createUseStyles({
  btnSuccess: {
    backgroundColor: '#169416',
    borderColor: '#169416',
    color: 'white',
    '&:hover': {
      backgroundColor: '#169416',
      borderColor: '#169416',
      color: 'white',
    },
  },
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

const ReceiveStock = () => {
  const classes = useStyles()
  const [form] = Form.useForm()
  const {
    receiveStock,
    loading,
    fetchActiveSupplyRequests,
    getSupplyRequestById,
    updaTeRequestStatus,
  } = useStock()

  const [vaccineOptions, setVaccineOptions] = useState([])
  const [originOptions, setOriginOptions] = useState([])
  const [tableValues, setTableValues] = useState([{}])
  const [isInvalid, setIsInvalid] = useState({})
  const [supplier, setSupplier] = useState('')
  const [requestId, setRequestId] = useState('')
  const [authoredOn, setAuthoredOn] = useState('')
  const [facilityName, setFacilityName] = useState('')
  const [facilityCode, setFacilityCode] = useState('')

  const { user } = useSelector((state) => state.userInfo)

  const { getInventory, updateInventory, createInventory, inventory } = useInventory()
  const location = useLocation()
  const state = location.state || {}
  const {
    orderNumber = '',
    origin = '',
    selectedOriginId = '',
    supplierId = '',
  } = state

  const navigate = useNavigate()

  const fetchOrigins = async () => {
    try {
      const origins = await fetchActiveSupplyRequests()
      const formattedOrigins = origins.map((origin) => ({
        value: origin.id,
        label: origin.label,
        id: origin.id,
        key: origin.key,
        identifier: origin.identifier,
        supplier: origin.supplier,
        authoredOn: origin.authoredOn,
        facility: origin.facility,
      }))
      setOriginOptions(formattedOrigins)
    } catch (error) {
      console.log('Error fetching origins', error)
    }
  }

  useEffect(() => {
    fetchOrigins()
    getInventory(user.facility)
    form.setFieldsValue({ orderNumber, origin })
  }, [])

  useEffect(() => {
    if (selectedOriginId) {
      onOriginSelect(selectedOriginId, { supplier: supplierId })
    }
  }, [selectedOriginId, orderNumber, origin, supplierId])

  const onOriginSelect = async (selectedOriginId, option) => {
    try {
      const supplyRequest = await getSupplyRequestById(selectedOriginId)

      const vaccine = supplyRequest.itemCodeableConcept.coding.map((code) => ({
        value: code.code,
        label: code.display,
      }))
      setVaccineOptions(vaccine)

      form.setFieldsValue({ orderNumber: supplyRequest.identifier[0].value })
      setSupplier(option.supplier)
      setRequestId(supplyRequest.id)
      setAuthoredOn(option.authoredOn)
      setFacilityName(option.label)
      setFacilityCode(option.facility)
    } catch (error) {
      console.log(error)
    }
  }

  const changeStatus = async (id) => {
    try {
      await updaTeRequestStatus(id, 'completed')
      notification.success({ message: 'Status changed to Received' })
    } catch (error) {
      console.log(error)
    }
  }

  const handleValidateTable = () => {
    const mandatoryFields = ['vaccine', 'batchNumber', 'quantity', 'vvmStatus']
    const invalid = mandatoryFields.reduce((acc, field) => {
      if (!tableValues[tableValues.length - 1][field]) {
        acc[field] = true
      }
      return acc
    }, {})

    if (Object.keys(invalid).length) {
      setIsInvalid(invalid)
      return false
    }

    return true
  }

  const handleAdd = () => {
    if (!handleValidateTable()) return

    setTableValues([...tableValues, {}])
  }

  const columns = [
    {
      title: 'Vaccine/Diluents',
      dataIndex: 'vaccine',
      options: vaccineOptions,
      render: (text, record, index) => {
        return (
          <Tooltip title={!vaccineOptions.length ? 'Please select origin' : ''}>
            <Select
              options={vaccineOptions}
              disabled={!vaccineOptions.length}
              status={
                index === tableValues.length - 1 && isInvalid.vaccine
                  ? 'error'
                  : ''
              }
              defaultValue={text}
              className="w-full"
              onChange={(value) => {
                const newValues = [...tableValues]
                newValues[index].vaccine = value

                if (value) {
                  setIsInvalid({
                    ...isInvalid,
                    vaccine: false,
                  })
                }
              }}
            />
          </Tooltip>
        )
      },
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      render: (text, record, index) => {
        return (
          <Input
            defaultValue={text}
            status={
              index === tableValues.length - 1 && isInvalid.batchNumber
                ? 'error'
                : ''
            }
            className="w-full"
            onChange={(e) => {
              const newValues = [...tableValues]
              newValues[index].batchNumber = e.target.value
              if (e.target.value) {
                setIsInvalid({
                  ...isInvalid,
                  batchNumber: false,
                })
              }
            }}
          />
        )
      },
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render: (text, record, index) => {
        return (
          <DatePicker
            defaultValue={text}
            className="w-full"
            disabled
            onChange={(date) => {
              const newValues = [...tableValues]
              newValues[index].expiryDate = date
            }}
          />
        )
      },
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
      render: (text, record, index) => {
        return (
          <InputNumber
            defaultValue={text}
            disabled
            onChange={(e) => {
              const newValues = [...tableValues]
              newValues[index].stockQuantity = e.target.value
            }}
            className="w-full"
          />
        )
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (text, record, index) => {
        return (
          <InputNumber
            className="w-full"
            status={
              index === tableValues.length - 1 && isInvalid.quantity
                ? 'error'
                : ''
            }
            defaultValue={text}
            onChange={(value) => {
              const newValues = [...tableValues]
              newValues[index].quantity = value
              if (value) {
                setIsInvalid({
                  ...isInvalid,
                  quantity: false,
                })
              }
            }}
          />
        )
      },
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      render: (text, record, index) => {
        return (
          <Select
            className="w-full"
            status={
              index === tableValues.length - 1 && isInvalid.vvmStatus
                ? 'error'
                : ''
            }
            options={[
              { value: 'Stage 1', label: 'Stage 1' },
              { value: 'Stage 2', label: 'Stage 2' },
              { value: 'Stage 3', label: 'Stage 3' },
              { value: 'Stage 4', label: 'Stage 4' },
            ]}
            allowClear
            defaultValue={text}
            onChange={(value) => {
              const newValues = [...tableValues]
              newValues[index].vvmStatus = value
              if (value) {
                setIsInvalid({
                  ...isInvalid,
                  vvmStatus: false,
                })
              }
            }}
          />
        )
      },
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
      render: (text, record, index) => {
        return (
          <Input
            defaultValue={text}
            className="w-full"
            onChange={(e) => {
              const newValues = [...tableValues]
              newValues[index].manufacturerDetails = e.target.value
            }}
          />
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record, index) => {
        return (
          <Button
            type="link"
            onClick={() => {
              const newValues = [...tableValues]
              newValues.splice(index, 1)
              setTableValues(newValues)

              setIsInvalid({})
            }}
            className="mr-2"
            danger
          >
            Remove
          </Button>
        )
      },
    },
  ]

  const onSubmit = async (values) => {
    if (!handleValidateTable()) return
    try {
      const combinedData = {
        ...values,
        supplier: supplier,
        supplyRequestId: requestId,
        authoredOn: authoredOn,
        facilityName: facilityName,
        facilityCode: facilityCode,
        tableValues: tableValues,
        receiver: user.fhirPractitionerId,
        receiverName: user.firstName ? `${user.firstName} ${user.lastName}` : '',
      }
      
      const deliveries = supplyDeliveryBuilder(combinedData)
      let currentInventory = await getInventory(user.facility)
      if (!currentInventory) {
        currentInventory = await createInventory()
      }
      const newIntentory = inventoryItemUpdator(deliveries, currentInventory)

      await updateInventory(newIntentory)

      console.log({ deliveries, newIntentory })
      // localStorage.setItem('receiveData', JSON.stringify(combinedData))

      // await receiveStock(combinedData)
      // await changeStatus(requestId)
   

      notification.success({
        message: 'Stock received successfully',
      })

      // navigate('/stock-management/received-orders')
      // form.resetFields()
    } catch (error) {
      notification.error({
        message: 'Failed to receive stock',
      })
    }
  }

  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Receive Stock</div>}
      actions={[
        <div className="flex w-full justify-end px-6">
          <Button
            type="primary"
            className="mr-4"
            onClick={() => form.resetFields()}
            ghost
          >
            Cancel
          </Button>
          <Button
            className={classes.btnPrimary}
            onClick={() => form.submit()}
            loading={loading}
            disabled={loading || Object.values(isInvalid).some(Boolean)}
          >
            Save
          </Button>
        </div>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        className="p-4"
        initialValues={{
          dateReceived: dayjs(),
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
          <Form.Item
            label="Date Received"
            name="dateReceived"
            rules={[
              { required: true, message: 'Please input the date received' },
            ]}
          >
            <DatePicker className="w-full" format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            label="Origin"
            rules={[{ required: true, message: 'Please input the origin' }]}
            name="origin"
          >
            <Select
              name="origin"
              showSearch
              allowClear
              filterOption={(input, option) =>
                option.label
                  ? option.label.toLowerCase().includes(input.toLowerCase())
                  : false
              }
              options={originOptions}
              placeholder="Origin"
              onSelect={onOriginSelect}
              onClear={() => {
                setVaccineOptions([])
                setSupplier('')
                setRequestId('')
                setAuthoredOn('')
                setFacilityName('')
                setFacilityCode('')
              }}
            />
          </Form.Item>

          <Form.Item
            label="Order Number"
            name="orderNumber"
            rules={[
              { required: true, message: 'Please input the order number' },
            ]}
          >
            <Input placeholder="Order number" disabled />
          </Form.Item>
        </div>
        <Table
          columns={columns}
          dataSource={tableValues || []}
          pagination={false}
          size="small"
        />
        <div className="flex items-end flex-col">
          {Object.values(isInvalid)?.filter(Boolean).length > 0 && (
            <div className="bg-red-50 shadow p-2">
              <p className="text-red-500 text-sm">
                Please complete the form above to add item
              </p>
            </div>
          )}

          <Button
            className="mt-4 !bg-green text-white hover:!text-white"
            onClick={handleAdd}
          >
            Add Item
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default ReceiveStock
