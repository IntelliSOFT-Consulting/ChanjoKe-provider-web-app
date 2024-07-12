import { Card, Descriptions, Table } from "antd"
import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { useParams } from "react-router-dom"
import useWindowSize from "../../hooks/useWindowSize"
import useStock from "../../hooks/useStock"


const useStyles = createUseStyles({
	label: {
		color: "#707070",
		fontWeight: "600",
	},
	value: {
		color: "#707070",
	},
	columnText: {
		color: "#707070",
	},
	tableHeader: {
    '& .ant-table-thead > tr > th': {
      backgroundColor: '#163C9412',
      color: '#707070',
			border: '1px solid #d9d9d9',
    },
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
				setOrderDetails(order)
			} catch(error) {
				console.log(error)
			}
		}
		fetchOrderDetails()
	}, [orderID, getSupplyRequestById])



	const columns = [
    {
      title: 'Vaccine/Diluent',
      dataIndex: 'vaccine',
      key: 'vaccine',
      className: {
        [classes.columnText]: true
      },
    },
    {
      title: 'Order Quantity',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
      className: {
        [classes.columnText]: true
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
            [classes.columnText]: true
          },
        },
        {
          title: 'VVM',
          dataIndex: 'vvmIssued',
          key: 'vvmIssued',
          className: {
            [classes.columnText]: true
          },
        },
        {
          title: 'Quantity',
          dataIndex: 'quantityIssued',
          key: 'quantityIssued',
          className: {
            [classes.columnText]: true
          },
        },
      ]
    },
    {
      title: 'Received Batches',
      children: [
        {
          title: 'Batch',
          dataIndex: 'batchReceived',
          key: 'batchReceived',
          className: {
            [classes.columnText]: true
          },
        },
        {
          title: 'VVM',
          dataIndex: 'vvmReceived',
          key: 'vvmReceived',
          className: {
            [classes.columnText]: true
          },
        },
        {
          title: 'Quantity',
          dataIndex: 'quantityReceived',
          key: 'quantityReceived',
          className: {
            [classes.columnText]: true
          },
        },
      ]
    }
  ]

	return (
		<>
			<Card
				title={`Order ${orderID}`}
				className="mt-5"
			>
				<div className="bg-[#163c9412] p-3 mx-4 my-5">
          <h3 className="text-[#707070] font-semibold text-base">Order Details</h3>
        </div>

				<Descriptions column={isMobile ? 1 : 2} className="p-5">
					<Descriptions.Item
						label={<span className={classes.label}>Order #</span>}
						className={classes.value}
					>
						{orderDetails?.id}
					</Descriptions.Item>
					<Descriptions.Item
						label={<span className={classes.label}>Issue Date</span>}
					>
						{orderDetails?.issueDate}
					</Descriptions.Item>
					<Descriptions.Item
						label={<span className={classes.label}>Ordering Store</span>}
					>
						{orderDetails?.deliverTo}
					</Descriptions.Item>
					<Descriptions.Item
						label={<span className={classes.label}>Receive Date</span>}
					>
						{orderDetails?.receiveDate}
					</Descriptions.Item>
					<Descriptions.Item
						label={<span className={classes.label}>Fulfilling Store</span>}
					>
						{orderDetails?.deliverFrom}
					</Descriptions.Item>
					<Descriptions.Item
						label={<span className={classes.label}>Cancel Date</span>}
					>
						{orderDetails?.cancelDate || '-'}
					</Descriptions.Item>
					<Descriptions.Item
						label={<span className={classes.label}>Preferred Pickup Date</span>}
					>
						{orderDetails?.occurenceDateTime}
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
          <h3 className="text-[#707070] font-semibold text-base">Order Items</h3>
        </div>

				<div className="hidden md:block p-5 mb-10">
					<Table
						columns={columns}
						dataSource={orderDetails}
						className={classes.tableHeader}
						bordered
						pagination={false}
					/>
				</div>

				<div className="block md:hidden p-5 mb-10">
					{orderDetails.map((item, index) => (
						<div key={index} className="w-full grid grid-cols-5 gap-3 border border-1 border-gray-200">
							<div className="py-5 px-4 col-span-4">
								<div className="text-sm">Vaccine/Diluent: <span className="font-semibold text-gray-800">{item.vaccine}</span></div>
								<div className="text-sm">Order Quantity: <span className="font-semibold text-gray-800">{item.orderQuantity}</span></div>
								<div className="text-sm">Packed/Issued Batch: <span className="font-semibold text-gray-800">{item.batchIssued}</span></div>
								<div className="text-sm">Packed/Issued VVM: <span className="font-semibold text-gray-800">{item.vvmIssued}</span></div>
								<div className="text-sm">Packed/Issued Quantity: <span className="font-semibold text-gray-800">{item.quantityIssued}</span></div>
								<div className="text-sm">Received Batch: <span className="font-semibold text-gray-800">{item.batchReceived}</span></div>
								<div className="text-sm">Received VVM: <span className="font-semibold text-gray-800">{item.vvmReceived}</span></div>
								<div className="text-sm">Received Quantity: <span className="font-semibold text-gray-800">{item.quantityReceived}</span></div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</>
	)
}