import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useApiRequest } from '../api/useApiRequest'

const ENDPOINT = '/hapi/fhir/Basic'

export default function useInventory() {
  const [inventoryReport, setInventoryReport] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])

  const { user } = useSelector((state) => state.userInfo)
  const { get, post, put } = useApiRequest()

  const createInventory = async (data) => {
    const response = await post(ENDPOINT, data)
    return response
  }

  const getInventoryItems = async () => {
    const response = await get(ENDPOINT, {
      params: {
        subject: user.facility,
        code: 'inventory-item',
      },
    })

    const inventoryData = response?.entry?.map((entry) => entry.resource) || []
    setInventoryItems(inventoryData)
    return inventoryData
  }

  const updateInventory = async (data) => {
    await put(`${ENDPOINT}/${data.id}`, data)
  }

  const getInventoryReport = async () => {
    const response = await get(ENDPOINT, {
      params: {
        subject: user.facility,
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
    getInventoryItems,
    updateInventory,
    getInventoryReport,
    inventoryItems,
    inventoryReport,
  }
}
