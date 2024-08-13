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

export const formatSupplyRequestsToForm = (supplyRequests) => {
  return supplyRequests?.map((request) => ({
    id: request.id,
    location: request.deliverTo?.reference,
    dateIssued: request.occurrenceDateTime
      ? dayjs(request.occurrenceDateTime)
      : null,
    orderNumber: request?.id,
    orderNumberLabel: request?.identifier?.[0]?.value,
    vaccine: request.itemCodeableConcept?.coding?.[0]?.display,
    quantity: request.quantity?.value,
  }))
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
