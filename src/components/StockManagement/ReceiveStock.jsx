import React, { useEffect, useState } from 'react'
import { Card, Button, Form, Input, Select, DatePicker, notification } from 'antd'
import useInputTable from '../../hooks/InputTable'
import { createUseStyles } from 'react-jss'
import useStock from '../../hooks/useStock'
import useVaccination from '../../hooks/useVaccination'
import { useParams, useLocation } from 'react-router-dom'

const { useForm } = Form

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
  const [form] = useForm()
  const { receiveStock, loading, fetchActiveSupplyRequests, getSupplyRequestById, updaTeRequestStatus } = useStock()
  const { getAllVaccines } = useVaccination()
  const [vaccineOptions, setVaccineOptions] = useState([])
  const [originOptions, setOriginOptions] = useState([])
  const [supplier, setSupplier] = useState('')
  const [requestId, setRequestId] = useState('')
  const [authoredOn, setAuthoredOn] = useState('')
  const [facilityName, setFacilityName] = useState('')
  const [facilityCode, setFacilityCode] = useState('')

  const { id } = useParams()
  const location = useLocation()
  const state = location.state || {}
  const { orderNumber = '', origin = '', selectedOriginId = '' } = state

  useEffect(() => {
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
          facility: origin.facility
        }))
        setOriginOptions(formattedOrigins)
      }catch(error){
        console.log("Error fetching origins", error)
      }
    }
    fetchOrigins()

    form.setFieldsValue({ orderNumber, origin })

    if(selectedOriginId){
      onOriginSelect(selectedOriginId)
    }
  }, [fetchActiveSupplyRequests, form, selectedOriginId, orderNumber, origin])

  const onOriginSelect = async(selectedOriginId, option) => {
    try{
      const supplyRequest = await getSupplyRequestById(selectedOriginId)

      const vaccine = supplyRequest.itemCodeableConcept.coding.map((code => ({
        value: code.code,
        label: code.display
      })))
      setVaccineOptions(vaccine)

      form.setFieldsValue({ orderNumber: supplyRequest.identifier[0].value })
      setSupplier(option.supplier)
      setRequestId(supplyRequest.id)
      setAuthoredOn(option.authoredOn)
      setFacilityName(option.label)
      setFacilityCode(option.facility)
    } catch(error){
      console.log(error)
    }
  }

  const changeStatus = async(id) => {
    try{
      await updaTeRequestStatus(id, 'completed')
      notification.success({ message: 'Status changed to Received' })
    }catch(error){
      console.log(error)
    }
  }

  const columns = [
    { 
      title: 'Vaccine/Diluents', 
      dataIndex: 'vaccine', 
      type: 'select',
      options: vaccineOptions
    },
    { 
      title: 'Batch Number', 
      dataIndex: 'batchNumber', 
      type: 'text',
    },
    { title: 'Expiry Date', dataIndex: 'expiryDate', type: 'date' },
    { title: 'Quantity', dataIndex: 'quantity', type: 'number' },
    { title: 'Stock Quantity', dataIndex: 'stockQuantity', type: 'number' },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      type: 'select',
      options: [
        // vaccine vial monitors
        { value: 'Stage 1', label: 'Stage 1' },
        { value: 'Stage 2', label: 'Stage 2' },
        { value: 'Stage 3', label: 'Stage 3' },
        { value: 'Stage 4', label: 'Stage 4' },
      ],
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
      type: 'text',
    },
    { title: 'Action', dataIndex: 'action', type: 'remove' },
  ]

  const { InputTable, values: tableValues } = useInputTable({ columns })

  const onSubmit = async(values) => {
    try {
      const combinedData = {
        ...values,
        supplier: supplier,
        ...tableValues[0],
        supplyRequestId: requestId,
        authoredOn: authoredOn,
        facilityName: facilityName,
        facilityCode: facilityCode
      }
      
      console.log(combinedData)
      localStorage.setItem('receiveData', JSON.stringify(combinedData))

      await receiveStock(combinedData)
      await changeStatus(requestId)

      notification.success({
        message: 'Stock received successfully',
      })
      form.resetFields()

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
          <Button className={classes.btnPrimary} onClick={() => form.submit()} loading={loading}>
            Save
          </Button>
        </div>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
          <Form.Item
            label="Date Received"
            name="dateReceived"
            rules={[
              { required: true, message: 'Please input the date received' },
            ]}
          >
            <DatePicker className="w-full" />
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
                option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={originOptions}
              placeholder="Origin"
              onSelect={onOriginSelect}
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
        <InputTable />
      </Form>
    </Card>
  )
}

export default ReceiveStock
