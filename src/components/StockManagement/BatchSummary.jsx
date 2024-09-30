import { Button, Card, Input, Radio } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useInventory from '../../hooks/useInventory'
import Table from '../DataTable'
import { getVaccineBatches } from './helpers/stockUtils'
import { DownloadOutlined } from '@ant-design/icons'
import { CSVLink } from 'react-csv'
import { titleCase } from '../../utils/methods'
import { dosesToVials } from './helpers/stockUtils'

export default function BatchSummary() {
  const [allData, setAllData] = useState(null)
  const [results, setResults] = useState(null)
  const [countType, setCountType] = useState('Doses')

  const { vaccine } = useParams()
  const navigate = useNavigate()

  const { getDetailedInventoryItems, batchItems } = useInventory()

  const { user } = useSelector((state) => state.userInfo)

  useEffect(() => {
    getDetailedInventoryItems(user?.orgUnit?.code)
  }, [])

  useEffect(() => {
    if (!batchItems) return
    const formatted = getVaccineBatches(vaccine, batchItems)?.map((item) => ({
      ...item,
      location: titleCase(user?.orgUnit?.name),
      quantity:
        countType === 'Doses'
          ? item?.quantity
          : dosesToVials(item.vaccine, item?.quantity),
    }))

    setResults(formatted)
    setAllData(formatted)
  }, [batchItems, countType])

  const handleFilter = (text) => {
    if (!text) {
      setResults(allData)
      return
    }

    const filtered = allData.filter((item) =>
      JSON.stringify(item).includes(text)
    )
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Batch',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      key: 'vvmStatus',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Manufacturer Details',
      dataIndex: 'manufacturerDetails',
      key: 'manufacturerDetails',
    },
  ]

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Type', key: 'type' },
    { label: 'Batch', key: 'batchNumber' },
    { label: 'VVM Status', key: 'vvmStatus' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Location', key: 'location' },
    { label: 'Expiry Date', key: 'expiryDate' },
    { label: 'Manufacturer Details', key: 'manufacturerDetails' },
  ]

  return (
    <>
      <Card
        className="mt-5"
        title={
          <div className="text-xl font-semibold flex justify-between items-center">
            {vaccine} Ledger
          </div>
        }
        extra={
          <div className="flex items-center space-x-2">
            <Button type="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              <CSVLink
                data={results || []}
                headers={headers}
                filename={`${vaccine} Ledger.csv`}
              >
                Export Ledger
              </CSVLink>
            </Button>
          </div>
        }
      >
        <div className="flex justify-between items-center px-4 my-4">
          <div className="flex items-center">
            <Radio.Group
              value={countType}
              onChange={(e) => setCountType(e.target.value)}
            >
              <Radio value="Doses">Doses</Radio>
              <Radio value="Vials">Vials</Radio>
            </Radio.Group>

            <Input.Search
              placeholder="Search"
              onSearch={handleFilter}
              className="w-[300px]"
              allowClear
            />
          </div>
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
            loading={!results}
          />
        </div>
      </Card>
    </>
  )
}
