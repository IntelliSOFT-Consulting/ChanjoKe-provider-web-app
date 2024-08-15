import dayjs from 'dayjs'

export const formatInventoryToTable = (inventoryReport) => {
  const formattedReport = []

  const inventoryItems = inventoryReport.extension?.find((ext) =>
    ext?.url?.includes('inventory-items')
  )

  if (!inventoryItems || !inventoryItems.extension) {
    return formattedReport
  }


  inventoryItems.extension.forEach((vaccineExt) => {
    const vaccine = vaccineExt.extension?.[0]?.valueCodeableConcept?.text

    if (!vaccine) return

    const batches = vaccineExt.extension?.find((ext) => ext.url === 'batches')
      ?.extension?.[0]?.extension

    if (!batches) return

    batches?.forEach((batchExt) => {
      const batch = batchExt.extension
      if (!batch) return

      const batchData = {
        vaccine,
        batchNumber: '',
        quantity: 0,
        vvmStatus: '',
        manufacturerDetails: '',
        expiryDate: '',
      }

      batch?.forEach((detail) => {
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

      formattedReport.push(batchData)
    })
  })

  return formattedReport
}
