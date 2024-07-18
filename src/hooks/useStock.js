import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { getOffset } from '../utils/methods'
import { useSelector } from 'react-redux'

const inventoryPath = '/hapi/fhir/InventoryItem'
const deliveryPath = '/hapi/fhir/SupplyDelivery'
const supplyRequestPath = '/hapi/fhir/SupplyRequest'

const useStock = () => {
  const [stock, setStock] = useState([])
  const [stockItem, setStockItem] = useState({})
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => state.userInfo)

  const { get, post, put } = useApiRequest()


  const createPayload = (values) => {
    const authoredOn = values.authoredOn.replace(/[^0-9]/g, '')
    return {
      resourceType: 'SupplyRequest',
      identifier: [
        {
          system: 'https://hl7.org/fhir/R4/supplyrequest-definitions',
          value: `${values.facility}${authoredOn}`,
        }
      ],
      status: 'active',
      category: {
        coding: [
          {
            code: 'central',
            display: 'Central Supply'
          }
        ]
      },
      priority: 'routine',
      itemCodeableConcept: {
        coding: [
          {
            code: values.vaccine,
            display: values.vaccine,
          }
        ]
      },
      itemReference: {
        reference: `Medication/${values.vaccine}`,
      },
      quantity: {
        value: values.quantity,
      },
      authoredOn: values.authoredOn,
      occurrenceDateTime: values.preferredPickupDate,
      requester: {
        reference: `Practitioner/${user?.fhirPractitionerId}`,
      },
      deliverTo: {
        reference: `Location/${values.facility}`,
        display: values.facilityName,
      },
      extension: [
        {
          url: 'http://example.org/fhir/StructureDefinition/level',
          valueString: values.level
        },
        {
          url: 'http://example.org/StructureDefinition/date-of-last-order',
          valueDateTime: values.lastOrderDate
        },
        {
          url: 'http://example.org/StructureDefinition/expected-date-of-next-order',
          valueDateTime: values.expectedDateOfNextOrder
        },
        {
          url: 'http://example.org/StructureDefinition/total-population',
          valueString: values.totalPopulation
        },
        {
          url: 'http://example.org/StructureDefinition/children',
          valueString: values.children011Months
        },
        {
          url: 'http://example.org/StructureDefinition/pregnant-women',
          valueString: values.pregnantWomen
        },
        {
          url: 'http://example.org/StructureDefinition/doses-in-stock',
          valueString: values.dosesInStock
        },
        {
          url: 'http://example.org/StructureDefinition/minimum',
          valueString: values.minimumDoses
        },
        {
          url: 'http://example.org/StructureDefinition/maximum',
          valueString: values.maximumDoses
        },
        {
          url: 'http://example.org/StructureDefinition/recommended-stock',
          valueString: values.recommendedStock
        }
      ]
    }
  }

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

  const getStockItemById = async (id) => {
    setLoading(true)
    const response = await get(`${inventoryPath}/${id}`)
    setStockItem(response)
    setLoading(false)
    return response
  }

  const receiveStock = async (data) => {
    setLoading(true)
    const response = await post(deliveryPath, data)
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

  const myFacilityRequests = async (facility, page = 0) => {
    setLoading(true)
    try{
      const requester = user?.fhirPractitionerId
      const offset = getOffset(page)
      const response = await get(
        `${supplyRequestPath}?requester=${requester}&_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
      )
      const data = response?.entry?.map((entry) => {
        const resource = entry.resource
        if(resource.status === 'active'){
          resource.status = 'Pending'
        }
        return resource
      }) || []
      setStock({
        data,
        total: response.total,
      })
      setLoading(false)

      return data
    }catch(error){
      console.log(error)
    }
  }

  const mySupplyRequests = async (facility, page = 0) => {
    setLoading(true)
    const facilityCode = facility?.replace(/Location\//g, '')
    const offset = getOffset(page)
    const response = await get(
      `${supplyRequestPath}?supplier=${facilityCode}&_count=12&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
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

  const requestStock = async (data) => {
    setLoading(true)
    const payload = createPayload(data)
    const response = await post(supplyRequestPath, payload)
    setLoading(false)
    console.log(response)
    return response
  }

  const updaTeRequesStatus = async (id, status) => {
    const request = await get(`${supplyRequestPath}/${id}`)
    request.status = status
    const response = await put(`${supplyRequestPath}/${id}`, request)
    return response
  }

  return {
    stock,
    stockItem,
    loading,
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
    requestStock,
    createPayload,
    myFacilityRequests,
    mySupplyRequests,
    getSupplyRequestById,
  }
}

export default useStock
