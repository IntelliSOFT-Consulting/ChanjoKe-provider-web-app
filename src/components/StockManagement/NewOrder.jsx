import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import dayjs from 'dayjs'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Select,
  Popconfirm,
  Typography,
  Space,
  Divider,
} from 'antd'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import useInventory from '../../hooks/useInventory'
import useStock from '../../hooks/useStock'
import { titleCase } from '../../utils/methods'
import { supplyRequestBuilder } from './helpers/stockResourceBuilder'
import NewOrderTable from './newOrder/NewOrderTable'
import { formatLocation } from '../../utils/formatter'
import { useVaccineLevels } from '../../hooks/useVaccineLevels'

const { Title, Text } = Typography
const { useForm } = Form

const useStyles = createUseStyles({
  card: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    margin: '16px 0px',
  },
  header: {
    background: '#f0f2f5',
    padding: '5px 16px',
    borderBottom: '1px solid #e8e8e8',
    fontSize: '16px',
  },
  formSection: {
    background: '#fafafa',
    padding: '16px',
    marginBottom: '24px',
    borderRadius: '4px',
  },
  button: {
    minWidth: '120px',
  },
  primaryButton: {
    backgroundColor: '#163C94',
    borderColor: '#163C94',
    '&:hover': {
      backgroundColor: '#122f73',
      borderColor: '#122f73',
    },
  },
})

const NewOrder = () => {
  const classes = useStyles()
  const [form] = useForm()
  const [hasErrors, setHasErrors] = useState({})
  const [tableData, setTableData] = useState([{}])
  const [requestDetails, setRequestDetails] = useState(null)
  const { vaccineLevels } = useSelector((state) => state.vaccineSchedules)
  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()
  const { orderID } = useParams()

  useVaccineLevels()
  const {
    loading,
    createSupplyRequest,
    updateSupplyRequest,
    getSupplyRequestById,
    getLastOrderRequest,
    countSupplyRequests,
    requestItem,
  } = useStock()
  const { getAggregateInventoryItems, inventoryItems } = useInventory()

  useEffect(() => {
    getAggregateInventoryItems()
    getLastOrderRequest()
  }, [])

  useEffect(() => {
    if (orderID) {
      getOrderDetails()
    }
  }, [orderID])

  useEffect(() => {
    if (requestItem) {
      form.setFieldsValue({
        lastOrderDate: dayjs(requestItem.occurrenceDateTime),
      })
    }
  }, [requestItem])

  const getOrderDetails = async () => {
    const details = await getSupplyRequestById(orderID)
    setRequestDetails(details)

    const findExtension = (url) => details.extension?.find((item) => item.url.includes(url));
  
    const extensionData = {
      vaccine: findExtension('supplyrequest-vaccine'),
      level: details.extension[1],
      lastOrderDate: findExtension('supplyrequest-lastOrderDate'),
      preferredPickupDate: findExtension('supplyrequest-preferredPickupDate'),
      expectedDateOfNextOrder: findExtension('supplyrequest-expectedDateOfNextOrder'),
      catchmentPopulation: findExtension('supplyrequest-catchmentPopulation'),
      children: findExtension('supplyrequest-childrenAged0-11Months')
    };
  
    const formattedAntigens = extensionData.vaccine?.extension?.map((antigen) => {
      const findAntigenExtension = (url) => antigen?.extension?.find((item) => item.url.includes(url));
  
      return {
        vaccine: findAntigenExtension('vaccine')?.valueCodeableConcept?.text,
        minimum: findAntigenExtension('minimum')?.valueQuantity?.value,
        maximum: findAntigenExtension('maximum')?.valueQuantity?.value,
        recommendedStock: findAntigenExtension('recommendedStock')?.valueQuantity?.value,
        quantity: findAntigenExtension('quantity')?.valueQuantity?.value,
      };
    });
  
    setTableData(formattedAntigens);
  
    form.setFieldsValue({
      level: extensionData.level?.valueString,
      lastOrderDate: dayjs(extensionData.lastOrderDate?.valueDateTime),
      preferredPickupDate: dayjs(extensionData.preferredPickupDate?.valueDateTime),
      expectedDateOfNextOrder: dayjs(extensionData.expectedDateOfNextOrder?.valueDateTime),
      catchmentPopulation: extensionData.catchmentPopulation?.valueInteger,
      children: extensionData.children?.valueInteger,
    });
  }

  const handleValidate = () => {
    const required = [
      'vaccine',
      'minimum',
      'maximum',
      'recommendedStock',
      'quantity',
    ]
    if (!tableData?.length) {
      setHasErrors({ empty: true })
      return { empty: true }
    }
    const errors = tableData.reduce((acc, row, index) => {
      const rowErrors = required.reduce((acc, field) => {
        if (!row[field]) {
          acc[field] = true
        }
        return acc
      }, {})

      if (Object.keys(rowErrors).length) {
        acc[index] = rowErrors
      }

      return acc
    }, {})

    setHasErrors(errors)
    return errors
  }

  const onSubmit = async (data) => {
    try {
      const err = handleValidate()
      if (Object.keys(err).length === 0) {
        const combinedData = {
          ...data,
          tableData,
          deliverFrom: {
            reference: formatLocation(user?.subCounty),
            display: user?.subCountyName,
          },
          requester: { reference: `Practitioner/${user.fhirPractitionerId}` },
          deliverTo: {
            reference: user.orgUnit?.code,
            display: user.facilityName,
          },
        }

        const payload = supplyRequestBuilder(combinedData)

        if (orderID) {
          payload.identifier = requestDetails.identifier
          payload.id = orderID
          await updateSupplyRequest(payload)
        } else {
          const facilityRequests = await countSupplyRequests()
          const facilityKey = user?.orgUnit?.name
            .replace(/\s/g, '')
            .substring(0, 3)
            .toUpperCase()

          let identifier = [
            {
              system:
                'https://www.cdc.gov/vaccines/programs/iis/iis-standards.html',
              value: `${facilityKey}-${(facilityRequests + 1)
                .toString()
                .padStart(4, '0')}`,
            },
          ]
          payload.identifier = identifier
          await createSupplyRequest(payload)
        }

        form.resetFields()

        notification.success({
          message: 'Order created successfully',
        })
        navigate('/stock-management/sent-orders', { replace: true })
      }
    } catch (err) {
      console.error(err)
      notification.error({
        message: 'Error creating order',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingArrows />
      </div>
    )
  }

  return (
    <Card className={classes.card} size="small">
      <div className={classes.header}>
        <Title level={4}>
          New Order for {titleCase(user?.orgUnit?.name)} (
          {user?.orgUnit?.code?.split('/')[1]})
        </Title>
      </div>
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={{
          authoredOn: dayjs(),
          expectedDateOfNextOrder: dayjs().add(30, 'days'),
          level: 'Sub-County',
          facility: user.subCountyName,
        }}
        autoComplete="off"
      >
        <div className={classes.formSection}>
          <Title level={4}>Order Details</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item
              label="Level"
              name="level"
              rules={[{ required: true, message: 'Please select the level' }]}
            >
              <Select
                placeholder="Select Level"
                options={[{ label: 'Sub-County', value: 'Sub-County' }]}
              />
            </Form.Item>

            <Form.Item label="Order Location" name="facility">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Date of Last Order:" name="lastOrderDate">
              <DatePicker
                className="w-full"
                placeholder="Date of Last Order"
                disabledDate={(current) =>
                  current &&
                  current > dayjs().subtract(1, 'days').startOf('day')
                }
                format="DD-MM-YYYY"
              />
            </Form.Item>

            <Form.Item
              label="Date of This Order:"
              name="authoredOn"
              rules={[
                { required: true, message: 'Please input the order date' },
              ]}
            >
              <DatePicker
                className="w-full"
                placeholder="Date of This Order"
                onChange={(date) => {
                  form.setFieldsValue({
                    expectedDateOfNextOrder: date.add(30, 'days'),
                  })
                }}
                disabledDate={(current) =>
                  current && current < dayjs().startOf('day')
                }
                format="DD-MM-YYYY"
              />
            </Form.Item>

            <Form.Item
              label="Preferred Pickup Date:"
              name="preferredPickupDate"
            >
              <DatePicker
                className="w-full"
                placeholder="Preferred Pickup Date"
                disabledDate={(current) =>
                  current && current < dayjs().startOf('day')
                }
                format="DD-MM-YYYY"
              />
            </Form.Item>

            <Form.Item
              label="Expected Date of Next Order:"
              name="expectedDateOfNextOrder"
            >
              <DatePicker
                className="w-full"
                placeholder="Expected Date of Next Order"
                disabledDate={(current) =>
                  current && current < dayjs().startOf('day')
                }
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </div>
        </div>

        <Divider />

        <div className={classes.formSection}>
          <Title level={4}>Population Information</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item label="Catchment Population" name="totalPopulation">
              <Input placeholder="Catchment Population" />
            </Form.Item>

            <Form.Item label="Children Aged 0-11 Months" name="children">
              <Input placeholder="Children Aged 0-11 Months (under 1 year)" />
            </Form.Item>

            <Form.Item label="Pregnant Women" name="pregnantWomen">
              <Input placeholder="Pregnant Women" />
            </Form.Item>
          </div>
        </div>

        <div className={classes.formSection}>
          <Title level={4}>Antigen Details</Title>
          <NewOrderTable
            form={form}
            tableData={tableData}
            setTableData={setTableData}
            inventoryItems={inventoryItems}
            hasErrors={hasErrors}
            handleValidate={handleValidate}
            vaccineLevels={vaccineLevels?.parameter || []}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Space>
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Popconfirm
              title="Are you sure you want to submit this order?"
              onConfirm={() => form.submit()}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                type="primary"
                className={`${classes.button} ${classes.primaryButton}`}
              >
                Submit Order
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </Form>
    </Card>
  )
}

export default NewOrder
