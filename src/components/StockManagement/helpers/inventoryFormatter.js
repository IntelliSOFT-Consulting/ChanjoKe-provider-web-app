import dayjs from 'dayjs'

export const formatInventoryToTable = (items) => {
  const formattedReport = []

  items.forEach((batch) => {
    const batchData = {
      vaccine: batch.identifier[0].value,
      batchNumber: '',
      quantity: 0,
      vvmStatus: '',
      manufacturerDetails: '',
      expiryDate: '',
    }

    batch.extension.forEach((detail) => {
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
          batchData.vvmStatus = detail.valueString
          break
        case 'manufacturerDetails':
          batchData.manufacturerDetails = detail.valueString
          break
        default:
          break
      }
    })

    formattedReport.push(batchData)
  })

  return formattedReport
}

export const vaccineInventory = (vaccine, inventory) => {
  const data = inventory?.filter((item) => vaccine?.includes(item.vaccine))
  return data?.sort((a, b) => {
    return dayjs(a.expiryDate, 'DD-MM-YYYY').diff(
      dayjs(b.expiryDate, 'DD-MM-YYYY')
    )
  })
}
