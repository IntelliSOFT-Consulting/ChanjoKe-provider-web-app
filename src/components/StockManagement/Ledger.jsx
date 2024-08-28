import { Button, Card, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { uniqueVaccineOptions } from '../../data/vaccineData'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import { useSelector } from 'react-redux'
import { getVaccineBatches } from './helpers/stockUtils'
import { Link } from 'react-router-dom'

export default function Ledger() {
  const [allData, setAllData] = useState(null)
  const [results, setResults] = useState(null)

  const { user } = useSelector((state) => state.userInfo)

  const {
    getAggregateInventoryItems,
    getDetailedInventoryItems,
    inventoryItems,
    batchItems,
  } = useInventory()

  useEffect(() => {
    getAggregateInventoryItems({
      subject: user?.orgUnit?.code,
    })
    getDetailedInventoryItems(user?.orgUnit?.code)
  }, [])

  const formatResults = (data) => {
    return data.map((item) => {
      const batches = getVaccineBatches(item?.vaccine, batchItems)

      batches.sort(
        (a, b) =>
          dayjs(b.date, 'DD-MM-YYYY').unix() -
          dayjs(a.date, 'DD-MM-YYYY').unix()
      )
      return {
        id: item.id,
        vaccine: item?.vaccine,
        type: 'Dose',
        batches: batches?.length,
        currentBalance: item?.quantity,
        lastTransactionDate: dayjs(batches?.[0]?.date, 'DD-MM-YYYY').format(
          'DD-MM-YYYY'
        ),
      }
    })
  }

  useEffect(() => {
    if (inventoryItems && batchItems) {
      const formatted = formatResults(inventoryItems)
      setResults(formatted)
      setAllData(formatted)
    }
  }, [inventoryItems, batchItems])

  const handleFilter = (vaccine) => {
    if (vaccine === 'All' || !vaccine) {
      setResults(allData)
      return
    }

    const filtered = allData.filter((item) => item.vaccine === vaccine)
    setResults(filtered)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_, _record, index) => index + 1,
    },
    {
      title: 'Product',
      dataIndex: 'vaccine',
      key: 'vaccine',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Batches',
      dataIndex: 'batches',
      key: 'batches',
    },
    {
      title: 'Current Balance',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
    },
    {
      title: 'Last Transaction Date',
      dataIndex: 'lastTransactionDate',
      key: 'lastTransactionDate',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (_text, record) => (
        <Link
          to={`/stock-management/ledger/${record?.vaccine}`}
          className="text-[#163C94] font-semibold border-none p-0"
        >
          Batch Summary
        </Link>
      ),
    },
  ]

  return (
    <>
      <Card
        className="mt-5"
        title={
          <div className="text-xl font-semibold flex justify-between items-center">
            Ledger
          </div>
        }
      >
        <div className="flex justify-between items-center px-4 my-4">
          <Select
            placeholder="Select Antigen"
            className="w-full md:w-1/2"
            placement="Filter by Vaccine"
            allowClear
            onChange={handleFilter}
            options={uniqueVaccineOptions}
            showSearch
          />
        </div>

        <div className="px-4 mb-10 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={results}
            size="small"
            bordered
            pagination={{
              pageSize: 12,
              showSizeChanger: false,
              hideOnSinglePage: true,
            }}
            loading={!batchItems}
          />
        </div>
      </Card>
    </>
  )
}
