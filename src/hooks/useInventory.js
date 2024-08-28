import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useApiRequest } from '../api/useApiRequest'
import { formatLocation } from '../utils/formatter'

const ENDPOINT = '/hapi/fhir/Basic'

export default function useInventory() {
  const [inventoryReport, setInventoryReport] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [batchItems, setBatchItems] = useState(null)

  const { user } = useSelector((state) => state.userInfo)
  const { get, post, put } = useApiRequest()

  const createInventory = async (data) => {
    const response = await post(ENDPOINT, data)
    return response
  }

  const getAggregateInventoryItems = async (params = {}) => {
    const response = await get(ENDPOINT, {
      params: {
        subject: user.orgUnit?.code,
        code: 'inventory-item',
        '_tag:not': 'out-of-stock',
        _count: 100000,
        ...params,
      },
    })

    const inventoryData = response?.entry?.map((entry) => entry.resource) ?? []

    const aggregateInventory = inventoryData.reduce((acc, curr) => {
      const vaccine = curr.identifier[0]?.value
      const quantity =
        curr.extension.find((item) => item.url === 'quantity')?.valueQuantity
          ?.value ?? 0

      if (!vaccine) return acc

      acc[vaccine] = {
        vaccine,
        quantity: (acc[vaccine]?.quantity ?? 0) + quantity,
      }

      return acc
    }, {})

    const inventoryArr = Object.values(aggregateInventory)
    setInventoryItems(inventoryArr)
    return inventoryArr
  }

  const updateInventory = async (data) => {
    if (data.extension[0].valueQuantity.value === 0) {
      data.meta = {
        tag: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
            code: 'out-of-stock',
            display: 'Out of stock',
          },
        ],
      }
    }
    await put(`${ENDPOINT}/${data.id}`, data)
  }

  const getDetailedInventoryItems = async (facility = null) => {
    facility = formatLocation(facility)

    const response = await get(ENDPOINT, {
      params: {
        subject: facility || user.orgUnit?.code,
        code: 'inventory-item',
        '_tag:not': 'out-of-stock',
        _sort: '-created',
        _count: 100000,
      },
    })

    const inventoryData = response?.entry?.map((entry) => entry.resource) ?? []
    setBatchItems(inventoryData)
    return inventoryData
  }

  const getInventoryReport = async () => {
    const response = await get(ENDPOINT, {
      params: {
        subject: user.orgUnit?.code,
        code: 'inventory-report',
        _sort: '-created',
        _count: 1,
      },
    })

    const report = response?.entry?.[0]?.resource || null
    setInventoryReport(report)
    return report
  }

  return {
    createInventory,
    getAggregateInventoryItems: getAggregateInventoryItems,
    updateInventory,
    getInventoryReport,
    getDetailedInventoryItems,
    inventoryItems,
    inventoryReport,
    batchItems,
  }
}
