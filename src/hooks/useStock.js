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

  const createPayload = (values, totalCount) => {
    const identifierFacility = values.facilityName.split(' ')[0].toUpperCase()
    const identifierNumber = (totalCount + 1).toString().padStart(4, '0')

    return {
      resourceType: 'SupplyRequest',
      identifier: [
        {
          system: 'https://hl7.org/fhir/R4/supplyrequest-definitions',
          value: `${identifierFacility}-${identifierNumber}`,
        }
      ],
      status: 'active',
      category: {
        coding: [
          {
            code: 'central',
            display: 'Central Supply',
            system: 'http://terminology.hl7.org/CodeSystem/supply-kind'
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
        ],
        text: "Antigen"
      },
      itemReference: {
        reference: `Medication/${values.vaccine}`,
      },
      quantity: {
        value: values.quantity,
        unit: 'doses'
      },
      authoredOn: values.authoredOn,
      occurrenceDateTime: values.preferredPickupDate,
      requester: {
        reference: `Practitioner/${user?.fhirPractitionerId}`,
      },
      deliverFrom: {
        reference: `Location/${user?.facility}`,
        display: user?.facilityName,
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

  const stockPayload = (values) => {
    return {
      resourceType: 'SupplyDelivery',
      identifier: [
        {
          system: "https://hl7.org/fhir/R4/supplydelivery-definitions",
          value: '12345'
        }
      ],
      basedOn: [
        {
          reference: `SupplyRequest/${values.supplyRequest}`,
        }
      ],
      status: 'completed',
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/supply-item-type',
            code: 'medication'
          }
        ],
        text: 'Vaccine'
      },
      suppliedItem: {
        quantity: {
          value: values.quantity,
          unit: 'doses'
        },
        itemCodeableConcept: {
          coding: [
            {
              system: 'http://example.org/supply-items',
              code: values.vaccine
            }
          ],
          text: "Vaccine"
        }
      },
      occurrenceDateTime: values.dateReceived,
      supplier: {
        reference: `Practitioner/${values.origin}`,
      },
      destination: {
        reference: `Location/${user?.facility}`,
      },
      receiver: {
        reference: `Practitioner/${user?.fhirPractitionerId}`,
      },
      extension: [
        {
          url: "http://example.org/fhir/StructureDefinition/order-number",
          valueString: values.orderNumber
        },
        {
          url: 'http://example.org/fhir/StructureDefinition/batch-number',
          valueString: values.batchNumber
        },
        {
          url: 'http://example.org/fhir/StructureDefinition/expiry-date',
          valueDateTime: values.expiryDate
        },
        {
          url: 'http://example.org/fhir/StructureDefinition/stock-quantity',
          valueString: values.stockQuantity
        },
        {
          url: 'http://example.org/fhir/StructureDefinition/vvm-status',
          valueString: values.vvmStatus
        },
        {
          url: 'http://example.org/fhir/StructureDefinition/manufacturer-details',
          valueString: values.manufacturerDetails
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
    const payload = stockPayload(data)
    const response = await post(deliveryPath, payload)
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
      const totalResponse = await get(`${supplyRequestPath}?_summary=count`)
      const totalCount = totalResponse?.total
      const response = await get(
        `${supplyRequestPath}?requester=${requester}&_count=${totalCount}&_offset=${offset}&_total=accurate&_sort=-_lastUpdated`
      )

      const data = response?.entry?.map((entry, index) => {
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
    try{
      const totalResponse = await get(`${supplyRequestPath}?_summary=count`)
      const totalCount = totalResponse.total
      const payload = createPayload(data, totalCount)
      const response = await post(supplyRequestPath, payload)
      setLoading(false)
      console.log(response)
      return response
    }catch(error){
      console.log(error)
    }
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
