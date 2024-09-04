import { Card, Descriptions } from 'antd'
import { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import useWindowSize from '../../hooks/useWindowSize'
import useStock from '../../hooks/useStock'
import moment from 'moment'
import LoadingArrows from '../../common/spinners/LoadingArrows'
import Table from '../DataTable'

const useStyles = createUseStyles({
  label: {
    color: '#707070',
    fontWeight: '600',
  },
  value: {
    color: '#707070',
  },
  columnText: {
    color: '#707070',
  },
})

export default function OrderDetails() {
  const { orderID } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)

  const { getSupplyRequestById } = useStock()

  const classes = useStyles()
  const size = useWindowSize()
  const isMobile = size.width < 768

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const order = await getSupplyRequestById(orderID)
        const formattedOrder = formatOrderDetails(order)
        setOrderDetails(formattedOrder)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOrderDetails()
  }, [orderID])

  const extractVaccines = (order) => {
    const vaccineExtension = order.extension?.find((item) =>
      item.url.includes('supplyrequest-vaccine')
    )

    return (
      vaccineExtension?.extension
        ?.map((item) => item.extension)
        .filter(Boolean) || []
    )
  }

  const formatOrderDetails = (order) => {
    const orderItems = extractVaccines(order).map((item) => {
      const vaccine = item.find((ext) => ext.url === 'vaccine')
        ?.valueCodeableConcept?.text
      const orderQuantity = item.find((ext) => ext.url === 'quantity')
        ?.valueQuantity?.value
      const batchIssued = item.find(
        (ext) => ext.url === 'batchIssued'
      )?.valueString
      const vvmIssued = item.find((ext) => ext.url === 'vvmIssued')?.valueString
      const quantityIssued = item.find((ext) => ext.url === 'quantityIssued')
        ?.valueQuantity?.value
      const batchReceived = item.find(
        (ext) => ext.url === 'batchReceived'
      )?.valueString
      const vvmReceived = item.find(
        (ext) => ext.url === 'vvmReceived'
      )?.valueString
      const quantityReceived = item.find(
        (ext) => ext.url === 'quantityReceived'
      )?.valueQuantity?.value

      return {
        vaccine,
        orderQuantity,
        batchIssued,
        vvmIssued,
        quantityIssued,
        batchReceived,
        vvmReceived,
        quantityReceived,
      }
    })

    const isCanceled = order?.status === 'cancelled'
    const cancelDate = isCanceled
      ? moment(order?.meta?.lastUpdated).format('DD-MM-YYYY')
      : '-'
    const preferredPickupDate = order?.extension?.find((item) =>
      item.url?.includes('preferredPickupDate')
    )?.valueDateTime

    return {
      orderNumber: order?.identifier?.[0]?.value,
      issueDate: moment(order?.occurrenceDateTime).format('DD-MM-YYYY'),
      orderingStore: order?.deliverTo?.display,
      receiveDate: moment(order?.occurrencePeriod?.start).format('DD-MM-YYYY'),
      fulfillingStore: order?.deliverFrom?.display,
      cancelDate,
      preferredPickupDate: preferredPickupDate
      ? moment(preferredPickupDate).format('DD-MM-YYYY')
      : '-',
      packDate: moment(order?.occurrencePeriod?.end).format('DD-MM-YYYY'),
      status: order?.status,
      orderItems,
    }
  }

  const columns = [
    {
      title: 'Vaccine/Diluent',
      dataIndex: 'vaccine',
      key: 'vaccine',
      className: {
        [classes.columnText]: true,
      },
    },
    {
      title: 'Order Quantity',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
      className: {
        [classes.columnText]: true,
      },
    },
    {
      title: 'Packed/Issued Batches',
      children: [
        {
          title: 'Batch',
          dataIndex: 'batchIssued',
          key: 'batchIssued',
          className: {
            [classes.columnText]: true,
          },
        },
        {
          title: 'VVM',
          dataIndex: 'vvmIssued',
          key: 'vvmIssued',
          className: {
            [classes.columnText]: true,
          },
        },
        {
          title: 'Quantity',
          dataIndex: 'quantityIssued',
          key: 'quantityIssued',
          className: {
            [classes.columnText]: true,
          },
        },
      ],
    },
    {
      title: 'Received Batches',
      children: [
        {
          title: 'Batch',
          dataIndex: 'batchReceived',
          key: 'batchReceived',
          className: {
            [classes.columnText]: true,
          },
        },
        {
          title: 'VVM',
          dataIndex: 'vvmReceived',
          key: 'vvmReceived',
          className: {
            [classes.columnText]: true,
          },
        },
        {
          title: 'Quantity',
          dataIndex: 'quantityReceived',
          key: 'quantityReceived',
          className: {
            [classes.columnText]: true,
          },
        },
      ],
    },
  ]

  console.log(orderDetails)

  return (
    <Card title={orderDetails?.orderNumber || orderID} className="mt-5">
      {!orderDetails ? (
        <div className="flex justify-center items-center h-96">
          <LoadingArrows />
        </div>
      ) : (
        <>
          <div className="bg-[#163c9412] p-3 mx-4 my-5">
            <h3 className="text-[#707070] font-semibold text-base">
              Order Details
            </h3>
          </div>

          <Descriptions column={isMobile ? 1 : 2} className="p-5">
            <Descriptions.Item
              label={<span className={classes.label}>Order #</span>}
              className={classes.value}
            >
              {orderDetails?.orderNumber}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Issue Date</span>}
            >
              {orderDetails?.issueDate}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Ordering Store</span>}
            >
              {orderDetails?.orderingStore}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Receive Date</span>}
            >
              {orderDetails?.receiveDate}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Fulfilling Store</span>}
            >
              {orderDetails?.fulfillingStore}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Cancel Date</span>}
            >
              {orderDetails?.cancelDate || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className={classes.label}>Preferred Pickup Date</span>
              }
            >
              {orderDetails?.preferredPickupDate || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Status</span>}
            >
              {orderDetails?.status}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={classes.label}>Pack Date</span>}
            >
              {orderDetails?.packDate}
            </Descriptions.Item>
          </Descriptions>

          <div className="bg-[#163c9412] p-3 mx-4 my-5">
            <h3 className="text-[#707070] font-semibold text-base">
              Order Items
            </h3>
          </div>

          <div className="hidden md:block p-5 mb-10">
            <Table
              columns={columns}
              dataSource={orderDetails?.orderItems}
              bordered
              pagination={false}
              loading={!orderDetails}
              size="small"
            />
          </div>
        </>
      )}
    </Card>
  )
}
