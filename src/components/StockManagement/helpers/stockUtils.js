import dayjs from 'dayjs'
import { vaccineDoses } from '../../../data/vaccineDoses'

export const updateStock = async (updates, inventory) => {
  const updatedInventory = { ...inventory }
  const updatedItems = updatedInventory.extension[0].extension.map((item) => {
    const updatedItem = { ...item }
    const update = updates.find((update) => update.id === item.id)
    if (update) {
      updatedItem.valueInteger = update.value
    }
    return updatedItem
  })
  updatedInventory.extension[0].extension = updatedItems
  return updatedInventory
}

export const locationOptions = (supplyRequests) => {
  return supplyRequests
    ?.map((request) => {
      const orderNumber = request.identifier[0]?.value

      return {
        label: `${request.deliverTo?.display}_${orderNumber}`,
        value: `${request.deliverTo?.reference}_${orderNumber}`,
      }
    })
    .filter((location) => location?.label)
}

export const orderNumberOptions = (supplyRequests) => {
  return supplyRequests
    ?.map((request) => ({
      label: request?.identifier[0]?.value,
      value: request.id,
    }))
    .filter((order) => order?.label)
}

export const formatSupplyRequest = (supplyRequest) => {
  const vaccines = supplyRequest.extension?.find((item) =>
    item.url.includes('supplyrequest-vaccine')
  )?.extension

  return {
    id: supplyRequest.id,
    orderNumber: supplyRequest?.identifier?.[0]?.value,
    orderDate: dayjs(supplyRequest?.authoredOn),
    status: supplyRequest?.status,
    supplier: supplyRequest?.deliverFrom?.reference,
    receiver: supplyRequest?.deliverTo?.reference,
    vaccines: vaccines?.map((item) => {
      const vaccine = item.extension?.find((ext) => ext.url === 'vaccine')
        ?.valueCodeableConcept?.text
      const quantity = item.extension?.find((ext) => ext.url === 'quantity')
        ?.valueQuantity?.value
      return { vaccine, quantity }
    }),
  }
}

export const updateSupplyRequest = async (values, supplyRequests) => {
  const getRequest = supplyRequests.find(
    (request) => request.id === values.orderNumber
  )
  if (getRequest) {
    getRequest.status = 'completed'
  }

  return supplyRequests
}

export const deliveriesLocations = (supplyDeliveries) => {
  return supplyDeliveries
    ?.map((delivery) => ({
      label: `${delivery.origin} | ${delivery.basedOn?.[0]?.display}`,
      value: `${delivery.origin}_${delivery.basedOn?.[0]?.display}`,
    }))
    .filter((location) => location?.label)
}

export const formatDeliveryToTable = (supplyDelivery, inventoryItems = []) => {
  const vaccines = supplyDelivery?.extension?.[0]?.extension?.map((item) => {
    const vaccine = item.extension.find((ext) => ext.url === 'vaccine')
      ?.valueCodeableConcept?.text
    const batchNumber = item.extension.find(
      (ext) => ext.url === 'batchNumber'
    )?.valueString
    const quantity = item.extension.find((ext) => ext.url === 'quantity')
      ?.valueQuantity?.value
    const vvmStatus = item.extension.find((ext) => ext.url === 'vvmStatus')
      ?.valueCodeableConcept?.text
    const manufacturerDetails = item.extension.find(
      (ext) => ext.url === 'manufacturerDetails'
    )?.valueString
    const expiryDate = item.extension.find(
      (ext) => ext.url === 'expiryDate'
    )?.valueDateTime

    const availableQuantity =
      inventoryItems.find((inventory) => inventory.vaccine === vaccine)
        ?.quantity || 0
    return {
      vaccine,
      batchNumber,
      quantity,
      vvmStatus,
      stockQuantity: availableQuantity,
      manufacturerDetails,
      expiryDate: dayjs(expiryDate).format('DD-MM-YYYY'),
    }
  })

  return {
    id: supplyDelivery.id,
    location: supplyDelivery.origin,
    destination: supplyDelivery.destination?.display,
    vaccines,
    status: supplyDelivery.status,
    orderNumber: supplyDelivery.basedOn?.[0]?.display || 'N/A',
  }
}

export const getVaccineBatches = (vaccineName, batches) => {
  const vaccineBatches = []

  const inventoryItems = batches?.filter(
    (item) => item.identifier[0]?.value === vaccineName
  )

  inventoryItems.forEach((batch) => {
    const batchData = {
      vaccine: vaccineName,
      batchNumber: '',
      expiryDate: '',
      vvmStatus: '',
      manufacturerDetails: '',
      quantity: 0,
      type: 'Dose',
      date: dayjs(batch.created).format('DD-MM-YYYY'),
    }
    batch.extension.forEach((ext) => {
      switch (ext.url) {
        case 'batchNumber':
          batchData.batchNumber = ext.valueString
          break
        case 'expiryDate':
          batchData.expiryDate = ext.valueDateTime
            ? dayjs(ext.valueDateTime).format('DD-MM-YYYY')
            : ''
          break
        case 'quantity':
          batchData.quantity = ext.valueQuantity.value
          break
        case 'vvmStatus':
          batchData.vvmStatus = ext.valueString
          break
        case 'manufacturerDetails':
          batchData.manufacturerDetails = ext.valueString
          break
        default:
          break
      }
    })

    vaccineBatches.push(batchData)
  })

  return vaccineBatches
}

export const dosesToVials = (vacine, quantity) => {
  const vials = Math.ceil(quantity / vaccineDoses[vacine])
  return vials
}

export const vialsToDoses = (vacine, quantity) => {
  const doses = quantity * vaccineDoses[vacine]
  return doses
}
