import { Input } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IssueStockLogo from '../common/icons/issueStockLogo'
import OrderStockLogo from '../common/icons/orderStockLogo'
import ReceiveStockLogo from '../common/icons/receiveStockLogo'
import StockLedgerLogo from '../common/icons/stockLedgerLogo'
import Table from '../components/DataTable'
import { dosesToVials } from '../components/StockManagement/helpers/stockUtils'
import useInventory from '../hooks/useInventory'

export default function StockManagement() {
  const [allData, setAllData] = useState(null)
  const [results, setResults] = useState(null)

  const { getAggregateInventoryItems, inventoryItems } = useInventory()

  const { user } = useSelector((state) => state.userInfo)

  useEffect(() => {
    getAggregateInventoryItems({ subject: user?.orgUnit?.code })
  }, [])

  useEffect(() => {
    if (inventoryItems) {
      setResults(inventoryItems)
      setAllData(inventoryItems)
    }
  }, [inventoryItems])

  const iconComponents = {
    IssueStockLogo,
    OrderStockLogo,
    ReceiveStockLogo,
    StockLedgerLogo,
  }

  const stats = [
    {
      name: 'Order Stock',
      icon: 'OrderStockLogo',
      href: 'new-order',
      roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
    },
    {
      name: 'Receive Stock',
      icon: 'ReceiveStockLogo',
      href: 'receive-stock',
      roles: ['FACILITY_STORE_MANAGER', 'FACILITY_SYSTEM_ADMINISTRATOR'],
    },
    {
      name: 'Issue Stock',
      icon: 'IssueStockLogo',
      href: 'issue-stock',
      roles: ['SUB_COUNTY_STORE_MANAGER'],
    },
    {
      name: 'Stock Ledger',
      icon: 'StockLedgerLogo',
      href: 'ledger',
      roles: ['All'],
    },
  ]

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (_, _record, index) => index + 1,
    },
    { title: 'Vaccine', dataIndex: 'vaccine', key: 'vaccine' },
    {
      title: 'Quantity (Doses)',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => record.quantity?.toLocaleString(),
    },
  ]

  const handleSearch = (vaccine) => {
    if (!vaccine) {
      setResults(allData)
      return
    }

    const filtered = allData.filter((item) =>
      item.vaccine?.toLowerCase().includes(vaccine.toLowerCase())
    )
    setResults(filtered)
  }

  const filteredStats = stats.filter((item) => {
    return (
      item.roles.includes(user?.practitionerRole) || item.roles.includes('All')
    )
  })

  const createGrid = () => {
    const length = filteredStats.length
    return length === 1
      ? `sm:grid-cols-1 md:grid-cols-${length}`
      : `md:grid-cols-${length}`
  }
  return (
    <div>
      <dl className={`mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 ${createGrid()} py-12 rounded-lg shadow-lg border bg-white`}>
        {filteredStats.map((item) => {
          const IconComponent = iconComponents[item.icon]
          return (
            <Link
              to={item.href}
              key={item.name}
              className="overflow-hidden grid justify-items-center text-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-primary"
            >
              <IconComponent
                height="50"
                width="50"
                fillColor="#163C94"
                className="h-12 block mx-auto mb-5"
              />
              <dt className="truncate mt-5 text-primary">{item.name}</dt>
            </Link>
          )
        })}
      </dl>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-10">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex mb-6">
            <div className="col-span-3 absolute top-0 left-0 bg-primary">
              <div className="px-8 text-white font-semibold py-2">
                Current Stock
              </div>
            </div>
            <div className="w-1/2 ml-auto mt-8">
              <Input.Search
                placeholder="Search"
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                className="w-full"
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={results}
            loading={!results}
            size="small"
            bordered
            pagination={{
              pageSize: 12,
              showSizeChanger: false,
              hideOnSinglePage: true,
            }}
          />
        </div>
      </div>
    </div>
  )
}
