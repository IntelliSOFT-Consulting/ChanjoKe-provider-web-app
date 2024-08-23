import { useCallback, useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { getOffset } from '../utils/methods'
import { useSelector } from 'react-redux'
import { useLocations } from './useLocation'

const inventoryPath = '/hapi/fhir/InventoryItem'
const deliveryPath = '/hapi/fhir/SupplyDelivery'
const supplyRequestPath = '/hapi/fhir/SupplyRequest'

const useStock = () => {
  const [stock, setStock] = useState([])
  const [requests, setRequests] = useState(null)
  const [requestItem, setRequestItem] = useState(null)
  const [deliveries, setDeliveries] = useState(null)
  const [stockItem, setStockItem] = useState({})
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => state.userInfo)

  const { fetchLocationsByIds } = useLocations({})

  const { get, post, put } = useApiRequest()

  const getStock = async (page = 0, facility = null) => {
    setLoading(true)
    const offset = getOffset(page)
    const response = await get(
      `${inventoryPath}?_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated${
        facility ? `&location=${facility}` : ''
      }`
    )
    const data = response?.entry?.map((entry) => entry.resource) || []
    setStock({
      data,
      total: response.total,
    })
    setLoading(false)

    return data
  }

  const createSupplyRequest = async (data) => {
    setLoading(true)
    const response = await post(supplyRequestPath, data)
    setLoading(false)
    return response
  }

  const updateSupplyRequest = async (data) => {
    setLoading(true)
    const response = await put(`${supplyRequestPath}/${data.id}`, data)
    setLoading(false)
    return response
  }

  const createSupplyDelivery = async (data) => {
    setLoading(true)
    const response = await post(deliveryPath, data)
    setLoading(false)
    return response
  }

  const updateSupplyDelivery = async (data) => {
    setLoading(true)
    const response = await put(`${deliveryPath}/${data.id}`, data)
    setLoading(false)
    return response
  }

  const getStockItemById = async (id) => {
    setLoading(true)
    const response = await get(`${inventoryPath}/${id}`)
    setStockItem(response)
    setLoading(false)
    return response
  }

  const receiveStock = async (data) => {
    setLoading(true)
    const response = await put(deliveryPath, data)
    setLoading(false)
    return response
  }

  const issueStock = async (data) => {
    setLoading(true)
    const response = await post(supplyRequestPath, data)
    setLoading(false)
    return response
  }

  const countStock = async (data) => {
    setLoading(true)
    const response = await post(inventoryPath, data)
    setLoading(false)
    return response
  }

  const makePositiveAdjustment = async (data) => {
    setLoading(true)
    const response = await post(inventoryPath, data)
    setLoading(false)
    return response
  }

  const makeNegativeAdjustment = async (data) => {
    setLoading(true)
    const response = await post(inventoryPath, data)
    setLoading(false)
    return response
  }

  const viewStockHistory = async (data) => {
    setLoading(true)
    const response = await post(inventoryPath, data)
    setLoading(false)
    return response
  }

  const viewStockLedger = async (data) => {
    setLoading(true)
    const response = await post(inventoryPath, data)
    setLoading(false)
    return response
  }

  const adjustVVMStatus = async (data) => {
    setLoading(true)
    const response = await put(inventoryPath, data)
    setLoading(false)
    return response
  }

  const updateStockCount = async (data) => {
    setLoading(true)
    const response = await put(inventoryPath, data)
    setLoading(false)
    return response
  }

  const getLastOrderRequest = async () => {
    const orderRequests = await get(supplyRequestPath, {
      params: {
        _sort: '-_lastUpdated',
        _count: 1,
      },
    })

    const response = orderRequests?.entry?.[0]?.resource
    setRequestItem(response)
    return response
  }

  const incomingSupplyRequests = async (
    facility,
    page = 0,
    status = null,
    meta = 'order'
  ) => {
    setLoading(true)
    facility = facility?.includes('Location/')
      ? facility
      : `Location/${facility}`
    const offset = getOffset(page)
    const statusFilter = status ? `&status=${status}` : ''
    const metaFilter = meta ? `&_tag=${meta}` : ''
    const totalResponse = await get(`${supplyRequestPath}?_summary=count`)
    const response = await get(
      `${supplyRequestPath}?_tag=${facility}${statusFilter}${metaFilter}&_count=${totalResponse.total}&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
    )
    const data = response?.entry?.map((entry) => entry.resource) || []
    setRequests({
      data,
      total: totalResponse.total,
    })
    setLoading(false)

    return data
  }

  const outgoingSupplyRequests = async (
    facility,
    page = 0,
    status = null,
    meta = null
  ) => {
    setLoading(true)
    const offset = getOffset(page)
    const statusFilter = status ? `&status=${status}` : ''
    const metaFilter = meta ? `&_tag=${meta}` : ''
    const totalResponse = await get(`${supplyRequestPath}?_summary=count`)
    const response = await get(
      `${supplyRequestPath}?subject=${facility}${statusFilter}${metaFilter}&_count=${totalResponse.total}&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
    )
    const data = response?.entry?.map((entry) => entry.resource) || []

    setRequests({
      data,
      total: totalResponse.total,
    })
    setLoading(false)

    return data
  }

  const getIncomingDeliveries = async (
    facility,
    status = 'in-progress',
    page = 0
  ) => {
    setLoading(true)
    const paging = page ? `&_offset=${page}&_count=12` : '&_count=1000'
    const statusFilter = status ? `&status=${status}` : ''
    const response = await get(
      `${deliveryPath}?_tag=${facility}${statusFilter}${paging}`
    )

    const supplierIds =
      response.entry?.map((entry) =>
        entry.resource.identifier?.[0]?.value?.replace('Location/', '')
      ) || []
    const suppliers = await fetchLocationsByIds(supplierIds)

    const data =
      response?.entry?.map((entry) => ({
        ...entry.resource,
        origin: suppliers.find(
          (supplier) =>
            supplier.key ===
            entry.resource.identifier?.[0]?.value?.replace('Location/', '')
        )?.name,
      })) || []
    setDeliveries({
      data,
      total: response.total,
    })
    setLoading(false)

    return data
  }

  const myFacilityRequests = async (
    facility,
    page = 0,
    statusFilter = null
  ) => {
    setLoading(true)
    try {
      const requester = user?.fhirPractitionerId
      const offset = getOffset(page)
      const totalResponse = await get(`${supplyRequestPath}?_summary=count`)
      const totalCount = totalResponse?.total
      const status = statusFilter ? `&status=${statusFilter}` : ''
      const response = await get(
        `${supplyRequestPath}?requester=${requester}&_count=${totalCount}&_offset=${offset}${status}&_total=accurate&_sort=-_lastUpdated`
      )

      const data =
        response?.entry?.map((entry, index) => {
          const resource = entry.resource
          if (resource.status === 'active') {
            resource.status = 'Pending'
          } else if (resource.status === 'completed') {
            resource.status = 'Received'
          }

          return resource
        }) || []
      setStock({
        data,
        total: response.total,
      })
      setLoading(false)

      return data
    } catch (error) {
      console.log(error)
    }
  }

  const fetchActiveSupplyRequests = useCallback(async () => {
    setLoading(true)
    try {
      const response = await myFacilityRequests()
      setLoading(false)
      const activeData = response?.filter((entry) => entry.status === 'Pending')
      const data =
        activeData?.map((entry) => ({
          id: entry.id,
          key: entry.id,
          label: entry.deliverTo.display,
          value: entry.deliverTo.display,
          identifier: entry.identifier[0].value,
          supplier: entry.requester.reference.split('/')[1],
          authoredOn: entry.authoredOn,
          status: entry.status,
          facility: entry.deliverTo.reference.split('/')[1],
        })) || []

      setRequests(data)
      return data
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }, [])

  const mySupplyRequests = async (facility, page = 0) => {
    setLoading(true)
    const supplier = user?.fhirPractitionerId
    const offset = getOffset(page)
    const totalResponse = await get(`${deliveryPath}?_summary=count`)
    const response = await get(
      `${deliveryPath}?supplier=${supplier}&_count=${totalResponse.total}&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
    )
    const data = response?.entry?.map((entry) => entry.resource) || []
    setStock({
      data,
      total: response.total,
    })
    setLoading(false)

    return data
  }

  const getSupplyRequestById = async (id) => {
    setLoading(true)
    const response = await get(`${supplyRequestPath}/${id}`)
    setLoading(false)
    return response
  }

  const updaTeRequestStatus = async (id, status) => {
    const request = await get(`${supplyRequestPath}/${id}`)
    const updatedPayload = { ...request, status: status }
    const response = await put(`${supplyRequestPath}/${id}`, updatedPayload)
    return response
  }

  return {
    stock,
    stockItem,
    requests,
    deliveries,
    loading,
    requestItem,
    getLastOrderRequest,
    incomingSupplyRequests,
    outgoingSupplyRequests,
    getStock,
    getStockItemById,
    receiveStock,
    issueStock,
    countStock,
    makePositiveAdjustment,
    makeNegativeAdjustment,
    viewStockHistory,
    viewStockLedger,
    adjustVVMStatus,
    updateStockCount,
    myFacilityRequests,
    mySupplyRequests,
    getSupplyRequestById,
    updaTeRequestStatus,
    fetchActiveSupplyRequests,
    createSupplyRequest,
    updateSupplyRequest,
    createSupplyDelivery,
    updateSupplyDelivery,
    getIncomingDeliveries,
  }
}

export default useStock
