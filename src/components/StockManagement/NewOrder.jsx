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
import moment from 'moment'
import { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import useInventory from '../../hooks/useInventory'
import useStock from '../../hooks/useStock'
import { titleCase } from '../../utils/methods'
import { supplyRequestBuilder } from './helpers/stockResourceBuilder'
import NewOrderTable from './newOrder/NewOrderTable'
import { formatLocation } from '../../utils/formatter'

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

export default function NewOrder() {
  const classes = useStyles()
  const [form] = useForm()
  const [hasErrors, setHasErrors] = useState({})
  const [tableData, setTableData] = useState([{}])

  const {
    loading,
    createSupplyRequest,
    incomingSupplyRequests,
    getLastOrderRequest,
    requestItem,
  } = useStock()
  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()

  const { getAggregateInventoryItems, inventoryItems } = useInventory()

  useEffect(() => {
    getAggregateInventoryItems()
    getLastOrderRequest()
  }, [])

  useEffect(() => {
    if (requestItem) {
      const { occurrenceDateTime } = requestItem
      form.setFieldValue('lastOrderDate', dayjs(occurrenceDateTime))
    }
  }, [requestItem])

  const handleValidate = () => {
    const required = [
      'vaccine',
      'minimum',
      'maximum',
      'recommendedStock',
      'quantity',
    ]
    if (!tableData?.length) {
      setHasErrors({
        empty: true,
      })

      return {
        empty: true,
      }
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
      if (!Object.values(err).length) {
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

        const facilityRequests = await incomingSupplyRequests(
          payload.deliverFrom.reference
        )
        const facilityKey = payload.deliverFrom.display
          .replace(/\s/g, '')
          .substring(0, 3)
          .toUpperCase()

        let identifier = [
          {
            system:
              'https://www.cdc.gov/vaccines/programs/iis/iis-standards.html',
            value: `${facilityKey}-${(facilityRequests.length + 1)
              .toString()
              .padStart(4, '0')}`,
          },
        ]

        payload.identifier = identifier

        await createSupplyRequest(payload)

        form.resetFields()

        notification.success({
          message: 'Order created successfully',
        })

        navigate('/stock-management/sent-orders')
      }
    } catch (err) {
      console.log(err)
      notification.error({
        message: 'Error creating order',
      })
    }
  }

  return (
    <Card
      className="mt-5"
      title={
        <div className="text-xl font-semibold">
          {`New Order for ${titleCase(user?.orgUnit?.name)} (${
            user?.orgUnit?.code?.split('/')[1]
          })`}
        </div>
      }
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
          <Popconfirm
            title="Are you sure you want to submit this order?"
            onConfirm={() => form.submit()}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button className={classes.btnPrimary}>Submit</Button>
          </Popconfirm>
        </div>,
      ]}
    >
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingArrows />
        </div>
      ) : (
        <>
          <div className="bg-[#163c9412] p-3 mx-4">
            <h3 className="text-[#707070] font-semibold text-base">
              Order Details
            </h3>
          </div>
          <Form
            layout="vertical"
            form={form}
            onFinish={onSubmit}
            className="p-4"
            initialValues={{
              authoredOn: dayjs(),
              expectedDateOfNextOrder: dayjs().add(30, 'days'),
              level: 'Sub-County',
              facility: user.subCountyName,
            }}
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
              <Form.Item
                label="Level"
                name="level"
                rules={[{ required: true, message: 'Please select the level' }]}
              >
                <Select
                  placeholder="Select Level"
                  options={[
                    // { label: 'Central', value: 'Central' },
                    // { label: 'Regional', value: 'Regional' },
                    { label: 'Sub-County', value: 'Sub-County' },
                    // { label: 'Health Facility', value: 'Health Facility' },
                  ]}
                  allowClear
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
                    current > moment().subtract(1, 'days').startOf('days')
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
                    form.setFieldValue(
                      'expectedDateOfNextOrder',
                      date.add(30, 'days')
                    )
                  }}
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
                    current && current < moment().startOf('days')
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
                    current && current < moment().startOf('days')
                  }
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </div>
            <div className="border-2 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
              <Form.Item label="Catchment Population" name="totalPopulation">
                <Input placeholder="Catchment Population" />
              </Form.Item>

              <Form.Item
                label="Children Aged 0-11 Months (under 1 year)"
                name="childrenAged0-11Months"
              >
                <Input placeholder="Children Aged 0-11 Months (under 1 year)" />
              </Form.Item>

              <Form.Item label="Pregnant Women" name="pregnantWomen">
                <Input placeholder="Pregnant Women" />
              </Form.Item>
            </div>
            <div className="bg-[#163c9412] p-3 mb-10">
              <h3 className="text-[#707070] font-semibold text-base">
                Antigen Details
              </h3>
            </div>
            <NewOrderTable
              form={form}
              tableData={tableData}
              setTableData={setTableData}
              inventoryItems={inventoryItems}
              hasErrors={hasErrors}
              handleValidate={handleValidate}
            />
          </Form>
        </>
      )}
    </Card>
  )
}
