import dayjs from 'dayjs'

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
    ?.map((request) => ({
      label: request.deliverTo?.display,
      value: request.deliverTo?.reference,
    }))
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
      label: delivery.origin,
      value: delivery.origin,
    }))
    .filter((location) => location?.label)
}

export const formatDeliveryToTable = (supplyDelivery) => {
  const vaccines = supplyDelivery.extension[0].extension.map((item) => {
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
    return {
      vaccine,
      batchNumber,
      quantity,
      vvmStatus,
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

export const getVaccineBatches = (vaccineName, inventoryReport) => {
  const vaccineBatches = []

  const inventoryItems = inventoryReport.extension?.find((ext) =>
    ext.url.includes('inventory-items')
  )

  if (!inventoryItems || !inventoryItems.extension) {
    return vaccineBatches
  }

  inventoryItems.extension.forEach((vaccineExt) => {
    const vaccine = vaccineExt.extension?.find(
      (ext) =>
        ext.url ===
        `https://example.org/fhir/StructureDefinition/${vaccineName}`
    )?.valueCodeableConcept?.text

    if (vaccine !== vaccineName) return

    const batches = vaccineExt.extension?.find(
      (ext) => ext.url === 'batches'
    )?.extension

    if (!batches) return

    batches.forEach((batchExt) => {
      const batchData = {
        vaccine: vaccineName,
        batchNumber: '',
        expiryDate: '',
        vvmStatus: '',
        manufacturerDetails: '',
        quantity: 0,
        type: 'Dose',
        date: dayjs(inventoryReport.created).format('DD-MM-YYYY'),
      }

      batchExt.extension.forEach((detail) => {
        switch (detail.url) {
          case 'batchNumber':
            batchData.batchNumber = detail.valueString
            break
          case 'expiryDate':
            batchData.expiryDate = detail.valueDateTime
              ? dayjs(detail.valueDateTime).format('DD-MM-YYYY')
              : ''
            break
          case 'quantity':
            batchData.quantity = detail.valueQuantity.value
            break
          case 'vvmStatus':
            batchData.vvmStatus = detail.valueCodeableConcept.text
            break
          case 'manufacturerDetails':
            batchData.manufacturerDetails = detail.valueString
            break
        }
      })

      vaccineBatches.push(batchData)
    })
  })

  return vaccineBatches
}
